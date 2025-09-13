import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";

const socket = io("https://redesigned-guide-q74g965665qgh4976-5000.app.github.dev/buses");

export default function App() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    socket.on("busUpdate", (data) => {
      setBuses(data);
    });

    return () => {
      socket.off("busUpdate");
    };
  }, []);

  return (
    <div className="container">
      <h1 className="heading">🚌 Live Smart Bus Tracker</h1>

      <div className="map-container">
        <MapContainer
          center={[17.385044, 78.486671]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {buses.map((bus) => (
            <Marker key={bus.id} position={bus.coords}>
              <Popup>
                <b>{bus.name}</b>
                <br />
                Route: {bus.route}
                <br />
                Departure: {bus.time}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="card-grid">
        {buses.map((bus) => (
          <div className="card" key={bus.id}>
            <h3>{bus.name}</h3>
            <p><strong>Route:</strong> {bus.route}</p>
            <p><strong>Departure:</strong> {bus.time}</p>
            <p><strong>Live Location:</strong> {bus.coords[0].toFixed(3)}, {bus.coords[1].toFixed(3)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
