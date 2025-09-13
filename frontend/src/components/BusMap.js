import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61205.png",
  iconSize: [32, 32],
});

export default function BusMap({ buses }) {
  return (
    <MapContainer
      center={[17.385044, 78.486671]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      />

      {buses.map((bus, i) => (
        <>
          <Marker key={`marker-${i}`} position={[bus.lat, bus.lng]} icon={busIcon}>
            <Popup>
              <strong>Bus {bus.number}</strong><br />
              Occupancy: {bus.occupancy}<br />
              Route: {bus.route}
            </Popup>
          </Marker>

          {bus.routeCoords && (
            <Polyline
              key={`line-${i}`}
              positions={bus.routeCoords}
              color="blue"
              weight={4}
            />
          )}
        </>
      ))}
    </MapContainer>
  );
}
