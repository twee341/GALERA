import pandas as pd
import seaborn as sb
read_csv=pd.read_csv('C:\\Users\\user\\GALERA\\hotb_starter_code\\csvfiles\\control_raw.csv')
df=pd.DataFrame(read_csv)
print(df)