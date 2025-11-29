import mne
import numpy as np
import pandas as pd
import seaborn as sb
import matplotlib.pyplot as plt

# Definicja pasm
BANDS = {
    "Delta": (0.5, 4),
    "Theta": (4, 8),
    "Alpha": (8, 13),
    "Beta": (13, 30),
    "Gamma": (30, 45) # Często ogranicza się do 45/50 Hz ze względu na szum sieci elektrycznej
}

def calculate_band_power_mne(fif_file):
    # 1. Wczytanie pliku
    raw = mne.io.read_raw_fif(fif_file, preload=True)
    
    # 2. Obliczenie PSD (Power Spectral Density)
    # fmax ustawiamy np. na 50 lub 100 Hz
    spectrum = raw.compute_psd(method='welch', fmin=0.5, fmax=50)
    
    # Pobieramy dane: (liczba_kanałów, liczba_częstotliwości)
    psds, freqs = spectrum.get_data(return_freqs=True)
    
    # Lista kanałów (bez kanałów stymulacji/znaczników, jeśli są)
    # W Twoim pliku main.py usuwałeś kolumnę 4, tutaj MNE zazwyczaj sam oznacza typy kanałów
    ch_names = raw.ch_names
    
    # 3. Obliczanie średniej mocy dla każdego pasma
    band_powers = []
    
    for ch_idx, ch_name in enumerate(ch_names):
        # Pomijamy kanał znaczników (często nazywany STI lub ma index 4 w Twoim kodzie)
        if ch_name == 'STI 014' or ch_idx == 4: 
            continue
            
        row = {"Channel": ch_name}
        for band_name, (fmin, fmax) in BANDS.items():
            # Znajdź indeksy częstotliwości w danym zakresie
            idx_band = np.logical_and(freqs >= fmin, freqs <= fmax)
            # Oblicz średnią moc w tym paśmie
            row[band_name] = psds[ch_idx, idx_band].mean()
        
        band_powers.append(row)
    
    return pd.DataFrame(band_powers)

def calculate_focus_index(df_bands):
    """
    Oblicza indeks skupienia na podstawie gotowej ramki z mocami pasm.
    Wzór: Beta / Theta na kanałach czołowych (Fp1, Fp2).
    """
    # Filtrujemy tylko kanały czołowe, bo one najlepiej oddają "Executive Control"
    frontal_df = df_bands[df_bands["Channel"].isin(["Fp1", "Fp2"])]
    
    # Sumujemy moce z obu kanałów (uśrednianie przestrzenne)
    avg_beta = frontal_df["Beta"].mean()
    avg_theta = frontal_df["Theta"].mean()
    
    # Zabezpieczenie przed dzieleniem przez zero
    if avg_theta == 0:
        return 0
        
    focus_index = avg_beta / avg_theta
    return focus_index

# PRZYKŁAD UŻYCIA (zakładając, że masz już df_bands z poprzedniego kroku):

# Użycie
df_bands = calculate_band_power_mne("dura.fif")
print(df_bands)

# Wizualizacja
df_melted = df_bands.melt(id_vars="Channel", var_name="Band", value_name="Power")
sb.barplot(data=df_melted, x="Channel", y="Power", hue="Band")
plt.title("Moc pasm EEG na kanał")
plt.show()