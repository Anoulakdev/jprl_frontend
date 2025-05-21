"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface User {
  gender: string;
  firstname: string;
  lastname: string;
}

interface Location {
  id: number;
  activityId: number;
  userCode: string;
  content: string;
  lat: number;
  lng: number;
  actimg: string;
  user: User;
}

export default function MapComponent() {
  const { id } = useParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const customIcon = new L.Icon({
    iconUrl: "/markers.png",
    iconSize: [30, 30],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axiosInstance
        .get<{ detailacts: Location[] }>(`/activitys/${id}`)
        .then((response) => {
          setLocations(response.data.detailacts);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
          toast.error("Error fetching location data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) return <p>Loading map...</p>;
  if (locations.length === 0) return <p>No location data found</p>;

  return (
    <MapContainer
      center={[locations[0].lat, locations[0].lng]} // แสดง map ตำแหน่งแรก
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        attribution="Labels &copy; Esri"
      />

      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
          <Popup>
            {loc.user?.gender === "Male"
              ? "ທ່ານ"
              : loc.user?.gender === "Female"
                ? "ທ່ານນາງ"
                : ""}{" "}
            {loc.user?.firstname} {loc.user?.lastname}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
