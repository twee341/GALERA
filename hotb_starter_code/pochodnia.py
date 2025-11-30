import matplotlib.pyplot as plt
import matplotlib
import pandas as pd
import time
import mne
import seaborn as sb
import gemini as g
import numpy as np
def usu_sz(raw):
    raw_filtered = raw.copy().filter(l_freq=1, h_freq=40)

    raw_filtered = raw_filtered.notch_filter(freqs=[50])
    return raw_filtered
def sigma3(df):
    kolumny_do_sprawdzenia = df.select_dtypes(include=[np.number]).columns.tolist()
    if "time" in kolumny_do_sprawdzenia:
        kolumny_do_sprawdzenia.remove("time")
    if not kolumny_do_sprawdzenia:
        return df
    podzbior = df[kolumny_do_sprawdzenia]
    srednia = podzbior.mean()
    odchylenie = podzbior.std()
    maska_zachowania = (np.abs(podzbior - srednia) <= (3 * odchylenie)).all(axis=1)
    return df[maska_zachowania]

def fif_to_df(fif):
    raw = mne.io.read_raw_fif(fif, preload=True)
    #raw=usu_sz(raw)
    data,times=raw.get_data(return_times=True)
    t_df=pd.DataFrame(times)
    df=pd.DataFrame(data)
    df=df.transpose()
    df.insert(0, 'time', t_df)
    df=df.drop(4,axis=1)
    df = df.set_axis(["time","O1","O2","Fp2","Fp1"], axis=1)
    return df
def pochodnia(df):
    t_df=pd.DataFrame(df["time"])
    #print(df)
    df=g.calculate_derivatives_exclude_time(df)
    df.insert(0, 'time', t_df)
    df=df[100:]
    df=sigma3(df)
    return df


#print(raw.info)

# Wyświetl kanały
#print(raw.ch_names)

# Obejrzyj dane w interaktywnym viewerze

# Pobierz dane jako NumPy array
df=fif_to_df("xd.fif")
df=pochodnia(df)
df=abs(df)
sr=df.mean()
print(sr)
sb.lineplot(df,x="time",y="Fp1_deriv")
plt.show()