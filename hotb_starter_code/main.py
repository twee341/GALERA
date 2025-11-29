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
    print(t_df)
    df=df.transpose()
    print(df)
    df.insert(0, 'time', t_df)
    df.drop(collumns=[5])
    print(df)


fif_to_df("dura.fif")