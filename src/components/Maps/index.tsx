"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import L from "leaflet"; // นำเข้า Leaflet สำหรับสร้าง Icon
import "leaflet/dist/leaflet.css";
import { decryptId } from "@/lib/cryptoId";

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  user: User;
}

interface User {
  code: string;
  firstname: string;
  lastname: string;
  gender: string;
  tel: string;
}

// ✅ สร้างไอคอน Marker
const customIcon = new L.Icon({
  iconUrl: "/markers.png", // 🔹 เปลี่ยนเป็น path รูป marker ของคุณ
  iconSize: [30, 30], // ขนาดของไอคอน
  iconAnchor: [16, 32], // จุดที่ไอคอนยึดติดกับตำแหน่งพิกัด
  popupAnchor: [0, -32], // จุดที่ popup ปรากฏ
});

export default function MapComponent() {
  const router = useRouter();
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      let decryptedId: string;
      try {
        decryptedId = decryptId(decodeURIComponent(id as string));
      } catch (err) {
        router.replace("/unauthorized");
        return;
      }
      axiosInstance
        .get<Location>(`/detailacts/${decryptedId}`)
        .then((response) => {
          setLocation(response.data);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
          toast.error("Error fetching location data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, router]);

  if (isLoading) return <p>Loading map...</p>;
  if (!location) return <p>No location data found</p>;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
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

      <Marker position={[location.lat, location.lng]} icon={customIcon}>
        <Popup>
          {location.user?.gender
            ? location.user.gender === "Male"
              ? "ທ່ານ"
              : location.user.gender === "Female"
                ? "ທ່ານນາງ"
                : ""
            : ""}{" "}
          {location.user?.firstname} {location.user?.lastname}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
