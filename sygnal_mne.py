    ###     USUWANIE SZUMU    ###
    
import time
import matplotlib.pyplot as plt
import mne
import os
import numpy as np
import pandas as pd

raw = mne.io.read_raw_fif("dura.fif", preload=True)
raw_filtered = raw.copy().filter(l_freq=1, h_freq=40)

raw_filtered = raw_filtered.notch_filter(freqs=[50])

raw.plot(title="Przed filtracją")
raw_filtered.plot(title="Po filtracji")
#time.sleep(30)
plt.show()