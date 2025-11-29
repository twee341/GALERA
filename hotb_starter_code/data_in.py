import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sb

read_csv = pd.read_csv('C:\\Users\\user\\GALERA\\hotb_starter_code\\csvfiles\\tiktok.csv')
in_df = pd.DataFrame(read_csv)

df = in_df[["time","O1","O2","Fp1","Fp2"]]
sb.lineplot(df,x="time",y="Fp2")
plt.show()
dt = df["time"].iloc[1] - df["time"].iloc[0]
N = len(df)
freqs = np.fft.fftfreq(N, d=dt)
ds_f = pd.DataFrame({"freq": freqs})
for col in ["O1","O2","Fp1","Fp2"]:
    fft_values = np.fft.fft(df[col])
    ds_f[col] = np.abs(fft_values)
ds_f=ds_f.drop([0])
print(ds_f)




def extract_bandpower(signal, fs, band):
    freqs = np.fft.fftfreq(len(signal), 1/fs)
    fft_vals = np.abs(np.fft.fft(signal))**2
    band_power = fft_vals[(freqs >= band[0]) & (freqs <= band[1])].sum()
    return band_power
fs = 250  # częstotliwość próbkowania EEG (Hz) – zależy od opaski
bands = {"delta":(0.5,4), "theta":(4,8), "alpha":(8,12), "beta":(12,30)}




"""
plt.figure(figsize=(10,5))
plt.plot(ds_f["freq"][:N//2], ds_f["O2"][:N//2])
plt.title("Widmo sygnału O1")
plt.xlabel("Częstotliwość [Hz]")
plt.ylabel("Amplituda")
plt.show()
"""