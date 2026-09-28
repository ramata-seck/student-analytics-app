import csv
import json
import pandas as pd
#lire le fichier csv
df = pd.read_csv("donnees_propres.csv")
#print(df)
df.to_json("valides.json", orient="records", indent=4, force_ascii=False)
df2 = pd.read_json("valides.json")
print(df2)