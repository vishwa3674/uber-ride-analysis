import pandas as pd
from flask import Blueprint, jsonify
from sklearn.cluster import KMeans
import os

ride_stats = Blueprint("ride_stats", __name__)

@ride_stats.route("/api/rides/hourly")
def rides_per_hour():
    data_path = os.path.join("processed_data", "uber_april_cleaned.csv")
    df = pd.read_csv(data_path)
    hourly_counts = df.groupby("hour").size().reset_index(name="ride_count")
    result = hourly_counts.to_dict(orient="records")
    return jsonify(result)

@ride_stats.route("/api/rides/daily")
def rides_per_day():
    data_path = os.path.join("processed_data", "uber_april_cleaned.csv")
    df = pd.read_csv(data_path)
    daily_counts = df.groupby("day").size().reset_index(name="ride_count")
    return jsonify(daily_counts.to_dict(orient="records"))

@ride_stats.route("/api/rides/weekday")
def rides_by_weekday():
    data_path = os.path.join("processed_data", "uber_april_cleaned.csv")
    df = pd.read_csv(data_path)
    weekday_counts = df.groupby("weekday").size().reset_index(name="ride_count")
    return jsonify(weekday_counts.to_dict(orient="records"))

@ride_stats.route("/api/rides/heatmap")
def ride_heatmap():
    data_path = os.path.join("processed_data", "uber_april_cleaned.csv")
    df = pd.read_csv(data_path)
    sample_df = df[['Lat', 'Lon']].dropna().sample(n=5000, random_state=42) #Limt is set 5000 to reduce frontend load
    return jsonify(sample_df.to_dict(orient="records"))

@ride_stats.route("/api/rides/summary")
def ride_summary():
    data_path = os.path.join("processed_data", "uber_april_cleaned.csv")
    df = pd.read_csv(data_path)
    total_rides = len(df)
    avg_per_day = df.groupby("day").size().mean()
    min_day = df.groupby("day").size().min()
    max_day = df.groupby("day").size().max()

    summary = {
        "total_rides": int(total_rides),
        "avg_rides_per_day": round(avg_per_day, 2),
        "min_rides_per_day": int(min_day),
        "max_rides_per_day": int(max_day)
    }
    return jsonify(summary)

@ride_stats.route("/api/rides/clusters")
def pickup_clusters():
    data_path = os.path.join("processed_data", "uber_april_cleaned.csv")
    df = pd.read_csv(data_path)
    coords = df[['Lat', 'Lon']].dropna()

    kmeans = KMeans(n_clusters=5, random_state=42)
    coords['cluster'] = kmeans.fit_predict(coords)

    return jsonify(coords.sample(n=1000, random_state=42).to_dict(orient='records'))  # Sample to reduce frontend load
