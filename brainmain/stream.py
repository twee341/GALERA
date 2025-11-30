import datetime
import threading

import matplotlib.pyplot as plt
import matplotlib
import time
import pandas as pd
import numpy as np
import requests
from brainaccess.utils import acquisition
from brainaccess.core.eeg_manager import EEGManager
import json
import galerabrainlib as g

from config import *

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

def run_eeg_acquisition(timme=5):
    # matplotlib.use("TKAgg", force=True)
    eeg = acquisition.EEG()
    device_name = "BA HALO 089"

    global activate

    try:
        with EEGManager() as mgr:
            eeg.setup(mgr, device_name=device_name, cap=halo, sfreq=250)
            eeg.start_acquisition()
            print("Acquisition started")

            foc = pd.DataFrame({"i", "foc"})
            i = 0
            annotation = 1

            print("Starting in 5 seconds")
            time.sleep(5)

            while True:
                time.sleep(1)

                eeg.annotate(str(annotation))
                mmm = eeg.get_mne(tim=5)
                f_i = g.contr(mmm)

                new_row = pd.DataFrame({"i": [i], "foc": [f_i]})
                foc = pd.concat([foc, new_row], ignore_index=True)

                i += 1

                to_send = {"attentionScore": f_i}

                try:
                    requests.post("http://127.0.0.1:8000/send_stats", json=to_send)
                except Exception as e:
                    print(f"Failed to send stats: {e}")

                annotation += 1

                if not getattr(threading.current_thread(), "do_run", True):
                    break

            eeg.stop_acquisition()
            mgr.disconnect()

        eeg.close()

        final_avg = (foc["foc"].mean() * 10) / 10
        final_max = foc["foc"].max()

        to_send = {"avg": final_avg, "max": final_max}
        try:
            requests.post("http://127.0.0.1:8000/send_stats", json=to_send)
        except:
            pass

    except Exception as e:
        print(f"Error in EEG acquisition: {e}")
        """
        import random
        while True:
            time.sleep(1)
            fake_val = random.randint(40, 90)
            requests.post("http://127.0.0.1:8000/send_stats", json={"attentionScore": fake_val})
        """