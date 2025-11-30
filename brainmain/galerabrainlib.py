import matplotlib.pyplot as plt
import matplotlib
import pandas as pd
import time
import mne
import seaborn as sb
import numpy as np
def ReLU(x):
    if x>0:return x
    return 0
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
def calculate_derivatives_exclude_time(df, time_col="time"):
    if time_col not in df.columns:
        raise ValueError(f"Kolumna '{time_col}' nie została znaleziona w DataFrame.")
    dt = df[time_col].diff()
    dt = dt.replace(0, np.nan)
    signal_cols = [col for col in df.columns if col != time_col and pd.api.types.is_numeric_dtype(df[col])]
    deriv_df = pd.DataFrame(index=df.index)
    for col in signal_cols:
        dy = df[col].diff()
        deriv_df[f"{col}_deriv"] = dy / dt
    return deriv_df
def fif_to_df(raw):
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
    df=calculate_derivatives_exclude_time(df)
    df.insert(0, 'time', t_df)
    df=df[100:]
    df=sigma3(df)
    return df
def contr(raw):
    df=fif_to_df(raw)
    df=pochodnia(df)
    df=abs(df)
    sr=df.std()/df.mean()
    x=(sr["O1_deriv"]*sr["O2_deriv"]*sr["Fp1_deriv"]*sr["Fp2_deriv"])**0.25
    y=50/(ReLU(x-0.5)+0.5)
    z=int((40-ReLU(40-ReLU(y-40)))/40*1000)/10
    return z
