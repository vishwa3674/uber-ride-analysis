import pandas as pd
import os

# Path to raw CSV
data_path = os.path.join("..", "..", "data", "uber-raw-data-apr14.csv")

# Load CSV
df = pd.read_csv(data_path)

# Convert 'Date/Time' to datetime object
df['Date/Time'] = pd.to_datetime(df['Date/Time'])

# Extract useful features
df['hour'] = df['Date/Time'].dt.hour
df['day'] = df['Date/Time'].dt.day
df['weekday'] = df['Date/Time'].dt.weekday
df['month'] = df['Date/Time'].dt.month

# Save cleaned data
output_path = os.path.join("..", "processed_data", "uber_april_cleaned.csv")
df.to_csv(output_path, index=False)

print("✅ Cleaned data saved to:", output_path)
