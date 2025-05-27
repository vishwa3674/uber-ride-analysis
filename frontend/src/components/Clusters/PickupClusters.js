import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api";

const colors = ["red", "blue", "green", "orange", "purple"];

const PickupClusters = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/rides/clusters")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching cluster data:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Pickup Clusters (KMeans)</h2>
      <MapContainer center={[40.73, -73.93]} zoom={11} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((point, index) => (
          <CircleMarker
            key={index}
            center={[point.Lat, point.Lon]}
            radius={4}
            fillOpacity={0.7}
            color={colors[point.cluster % colors.length]}
          >
            <Tooltip>Cluster: {point.cluster}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PickupClusters;
