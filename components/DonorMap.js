"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DIVISION_COORDS = {
  Dhaka: [23.8103, 90.4125],
  Chattogram: [22.3569, 91.7832],
  Sylhet: [24.8949, 91.8687],
  Khulna: [22.8456, 89.5403],
  Rajshahi: [24.3745, 88.6042],
  Barishal: [22.701, 90.3535],
  Rangpur: [25.7468, 89.2515],
  Mymensingh: [24.7471, 90.4203],
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DonorMap({ donors }) {
  return (
    <MapContainer center={[23.685, 90.3563]} zoom={7} style={{ height: "480px", width: "100%", borderRadius: "12px" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {donors.map((d, i) => {
        const base = DIVISION_COORDS[d.division];
        if (!base) return null;
        const pos = [base[0] + (i % 5) * 0.01, base[1] + (i % 7) * 0.01];
        return (
          <Marker key={d.id} position={pos}>
            <Popup>
              <strong>{d.name}</strong><br />
              {d.bloodGroup} — {d.area ? `${d.area}, ` : ""}{d.district}<br />
              {d.isAvailable ? "Available" : "Unavailable"}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
