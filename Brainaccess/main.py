""" EEG measurement example

Example how to get measurements and
save to fif format
using acquisition class from brainaccess.utils

Change Bluetooth device name
"""

import matplotlib.pyplot as plt
import matplotlib
import time
import pandas as pd
import numpy as np
from brainaccess.utils import acquisition
from brainaccess.core.eeg_manager import EEGManager
import galerabrainlib as g





halo: dict = {
    0: "Fp1",
    1: "Fp2",
    2: "O1",
    3: "O2",
}

cap: dict = {
 0: "F3",
 1: "F4",
 2: "C3",
 3: "C4",
 4: "P3",
 5: "P4",
 6: "O1",
 7: "O2",
}

if __name__=="__main__":
    activate=True
    matplotlib.use("TKAgg", force=True)
    eeg = acquisition.EEG()
    device_name = "BA HALO 089"
    with EEGManager() as mgr:

        eeg.setup(mgr, device_name=device_name, cap=halo, sfreq=250)

        eeg.start_acquisition()
        print("Acquisition started")
        foc=pd.DataFrame({"i","foc"})
        i=0

        start_time = time.time()
        annotation = 1
        print("Starting in 5 seconds")
        time.sleep(5)
        #while time.time() - start_time < 10:
        while activate:
            time.sleep(1)

            eeg.annotate(str(annotation))
            mmm=eeg.get_mne(tim=5)
            f_i=g.contr(mmm) #most important line ever

            new_row = pd.DataFrame({"i": [i], "foc":[f_i]})
            foc = pd.concat([foc, new_row], ignore_index=True)

            i+=1

            print(f_i)
            annotation += 1
            """
            if ___ :
                activate=False
            """

        #print("Preparing to plot data")
        time.sleep(1)

        eeg.get_mne()
        eeg.stop_acquisition()
        mgr.disconnect()

    #mne_raw = eeg.data.mne_raw
    #print(f"MNE Raw object: {mne_raw}")

    #data, times = mne_raw.get_data(return_times=True)
    #print(f"Data shape: {data.shape}")

    #eeg.data.save(f'gojdatests/random3.fif') #use to save data on your device

    eeg.close()

    #print("avg",foc["foc"].mean(),"max",foc["foc"].max())

    #final_avg=foc["foc"].mean()
    #final_max=foc["foc"].max()

    """ Use to graphical display
    mne_raw.apply_function(lambda x: x*10**-6)
    Show recorded data
    mne_raw.filter(1, 40).plot(scalings="auto", verbose=False)
    plt.show()
    sb.lineplot(foc,x='i',y='foc')
    plt.show()
    """