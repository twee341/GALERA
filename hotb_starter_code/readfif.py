import matplotlib.pyplot as plt
import matplotlib
import pandas as pd
import time
import mne
import seaborn as sb

raw = mne.io.read_raw_fif("xd_to_nie_dziala.fif", preload=True)
#print(raw.info)

# Wyświetl kanały
#print(raw.ch_names)

# Obejrzyj dane w interaktywnym viewerze

# Pobierz dane jako NumPy array
data, times = raw.get_data(return_times=True)
df=pd.DataFrame(data)
df=df.transpose()
#df=df.drop(columns=[4])
sb.lineplot(df,x=4,y=3)
plt.show()