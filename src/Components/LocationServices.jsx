// LocationServices.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; 

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icons
const shopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const transportIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2983/2983788.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const LocationMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
};

const LocationServices = () => {
  const [userPos, setUserPos] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const allShops = [
    {
      name: "Recharge Hub",
      type: "Recharge",
      position: [28.6139, 77.209],
    },
    {
      name: "Metro Station",
      type: "Transport",
      position: [28.611, 77.21],
    },
    {
      name: "Bus Stop Central",
      type: "Transport",
      position: [28.615, 77.211],
    },
    {
      name: "QuickPay Store",
      type: "Recharge",
      position: [28.6125, 77.2085],
    },
  ];

  const filteredShops =
    filter === "All"
      ? allShops
      : allShops.filter((shop) => shop.type === filter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);
  const value = useContext(SomeContext); // ✅ this is good

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <MapPin className="text-blue-600" /> Location-Based Services
      </h2>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["All", "Recharge", "Transport"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1 rounded-full text-sm transition ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map or Loading UI */}
      {loading ? (
        <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl shadow-md mb-6">
          <p className="text-gray-600">Getting your location...</p>
        </div>
      ) : (
        <div className="h-[400px] rounded-2xl overflow-hidden shadow-md mb-6">
          <MapContainer
            center={userPos || [28.6139, 77.209]}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <LocationMarker position={userPos} />

            {filteredShops.map((shop, idx) => (
              <Marker
                key={idx}
                position={shop.position}
                icon={shop.type === "Recharge" ? shopIcon : transportIcon}
              >
                <Popup>
                  <strong>{shop.name}</strong>
                  <br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shop.position[0]},${shop.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Get Directions
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default LocationServices;
