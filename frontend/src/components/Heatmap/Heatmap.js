import React, { useEffect, useState } from "react";
import api from "../../api";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 15,
      blur: 25,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

const Heatmap = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    api.get("/rides/heatmap")
      .then((res) => {
        const coords = res.data.map((item) => [item.Lat, item.Lon]);
        setPoints(coords);
      })
      .catch((err) => console.error("Heatmap API error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Ride Pickup Density Heatmap</h2>
      <MapContainer
        center={[40.75, -73.98]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        <HeatLayer points={points} />
      </MapContainer>
    </div>
  );
};

export default Heatmap;
