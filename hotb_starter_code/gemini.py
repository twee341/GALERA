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

def calculate_band_power_mne(raw):
    # 1. Wczytanie pliku
    
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
import pandas as pd
import numpy as np

def calculate_derivatives_exclude_time(df, time_col="time"):
    """
    Oblicza pochodną (dy/dt) dla zmiennych w DataFrame, pomijając kolumnę czasu w wynikach.
    
    Args:
        df (pd.DataFrame): Dane wejściowe.
        time_col (str): Nazwa kolumny z czasem (używana do obliczenia dt).
        
    Returns:
        pd.DataFrame: DataFrame zawierający tylko pochodne sygnałów (bez kolumny czasu).
    """
    # Sprawdzamy, czy kolumna czasu istnieje
    if time_col not in df.columns:
        raise ValueError(f"Kolumna '{time_col}' nie została znaleziona w DataFrame.")

    # 1. Obliczamy różnicę czasu (dt)
    dt = df[time_col].diff()
    dt = dt.replace(0, np.nan) # Zabezpieczenie przed dzieleniem przez zero
    
    # 2. Wybieramy kolumny do różniczkowania (wszystkie numeryczne OPRÓCZ czasu)
    signal_cols = [col for col in df.columns if col != time_col and pd.api.types.is_numeric_dtype(df[col])]
    
    # 3. Obliczamy pochodne tylko dla wybranych kolumn
    deriv_df = pd.DataFrame(index=df.index)
    
    for col in signal_cols:
        dy = df[col].diff()
        # Pochodna = zmiana sygnału / zmiana czasu
        deriv_df[f"{col}_deriv"] = dy / dt

    return deriv_df

# --- PRZYKŁAD UŻYCIA ---
# Przykładowe dane

if __name__=="__main__":
    df_bands = calculate_band_power_mne(mne.io.read_raw_fif("dura.fif", preload=True))
    print(df_bands)

    # Wizualizacja
    df_melted = df_bands.melt(id_vars="Channel", var_name="Band", value_name="Power")
    sb.barplot(data=df_melted, x="Channel", y="Power", hue="Band")
    plt.title("Moc pasm EEG na kanał")
    plt.show()