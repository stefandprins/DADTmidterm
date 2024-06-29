import pandas as pd

# Load the CSV file
df = pd.read_csv('data/National.csv')

# Save as Parquet
df.to_parquet('data/file.parquet')