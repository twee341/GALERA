import mne
import os
import numpy as np
import pandas as pd


    ###     USUWANIE SZUMU    ###
df = pd.read_csv("tiktok.csv")
signal = df["value"].values  # <-- wpisz właściwą nazwę kolumny
sfreq = 250  # częstotliwość próbkowania (musisz znać!)


info = mne.create_info(ch_names=["signal"], sfreq=sfreq, ch_types=["eeg"])
raw = mne.io.RawArray(signal[np.newaxis, :], info)


### 🔹 Usunięcie szumu wysokoczęstotliwościowego (low-pass)
raw_filtered = raw.copy().filter(l_freq=None, h_freq=40)

###🔹 Usunięcie składowej stałej (DC offset)
raw_filtered = raw_filtered.filter(l_freq=1, h_freq=None)

### 🔹 Bardzo popularny filtr pasmowy EEG
raw_filtered = raw.copy().filter(l_freq=1, h_freq=40)

#### Usunięcie szumu sieciowego 50 Hz
raw_filtered = raw.copy().notch_filter(freqs=[50])

###Wyświetlenie sygnału przed i po filtracji
raw.plot(title="Przed filtracją")
raw_filtered.plot(title="Po filtracji")


raw_filtered = raw.copy().filter(1, 40).notch_filter(50)