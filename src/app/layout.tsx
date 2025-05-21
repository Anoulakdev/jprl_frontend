"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrelineScript from "./components/PrelineScript";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
        {/* ถ้าคุณยังอยากกำหนด theme-color สำหรับ Android Chrome */}
        {/* <meta name="theme-color" content="#000000" /> */}
      </head>
      <body suppressHydrationWarning={true}>
        <ToastContainer
          autoClose={3000} // เวลาแสดงผล 5 วินาที (หน่วยเป็นมิลลิวินาที)
          hideProgressBar={false} // แสดงแถบความคืบหน้า
          position="top-right" // ตำแหน่งข้อความแจ้งเตือน
          pauseOnHover={false} // หยุดการนับถอยหลังเมื่อเอาเมาส์ไปวาง
        />
        {loading ? <Loader /> : children}
      </body>
      <PrelineScript />
    </html>
  );
}
