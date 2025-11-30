import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sb
import time
import mne

def fif_to_df(fif):
    raw = mne.io.read_raw_fif(fif, preload=True)
    data,times=raw.get_data(return_times=True)
    t_df=pd.DataFrame(times)
    df=pd.DataFrame(data)
    df=df.transpose()
    df.insert(0, 'time', t_df)
    df=df.drop(4,axis=1)
    df = df.set_axis(["time","O1","O2","Fp2","Fp1"], axis=1)
    return df

def fourier_transform(df, signal_cols, time_col="time"):
    dt = df[time_col].iloc[1] - df[time_col].iloc[0]
    N = len(df)
    freqs = np.fft.fftfreq(N, d=dt)
    ds_f = pd.DataFrame({"freq": freqs})
    for col in signal_cols:
        fft_values = np.fft.fft(df[col].values)
        amplitudes = np.abs(fft_values)
        mean_val = amplitudes.mean()
        std_val = amplitudes.std()
        mask = (amplitudes >= mean_val - 3*std_val) & (amplitudes <= mean_val + 3*std_val)
        ds_f[col] = amplitudes
        ds_f[f"{col}_mask"] = mask
    mask_all = ds_f[[f"{col}_mask" for col in signal_cols]].all(axis=1)
    ds_f = ds_f[mask_all].drop(columns=[f"{col}_mask" for col in signal_cols])
    return ds_f



df=fif_to_df("dura.fif")
df=fourier_transform(df,["O1","O2","Fp2","Fp1"],"time")
sb.histplot(df,x="freq",y="Fp2")
plt.show()