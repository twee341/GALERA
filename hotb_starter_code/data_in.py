import pandas as pd
import seaborn as sb
import matplotlib.pyplot as plt
import numpy as np
read_csv=pd.read_csv('C:\\Users\\user\\GALERA\\hotb_starter_code\\csvfiles\\tiktok.csv')
in_df=pd.DataFrame(read_csv)
df=in_df[["time","O1","O2","Fp1","Fp2"]]
#sb.lineplot(df,x="time",y="O1")
a=np.array()
for i in range(0,len(pd["O1"])-1):
    a.append(pd["O1"][i+1]-pd["O1"][i])
plt.show()
sb.lineplot(y=a)
print(df)