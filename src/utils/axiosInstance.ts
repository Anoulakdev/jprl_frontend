// utils/axiosInstance.ts
import axios from "axios";
import { getLocalStorage, removeLocalStorage } from "@/utils/storage";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // กำหนด URL หลัก
  timeout: 5000, // Timeout (ms)
  headers: {
    "Content-Type": "application/json", // Header เริ่มต้น
  },
});

// เพิ่ม Interceptor สำหรับ request (ถ้าต้องการ เช่น การใส่ token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// เพิ่ม Interceptor สำหรับ response (จัดการ error response)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // กรณี token หมดอายุหรือไม่ถูกต้อง
        console.error("Unauthorized: ກະ​ລຸ​ນາ​ເຂົ້າ​ລະ​ບົບ​");
        removeLocalStorage("token");
        removeLocalStorage("user");
        window.location.href = "/"; // Redirect ไปยังหน้า login
      } else if (status >= 500) {
        // กรณีเซิร์ฟเวอร์มีปัญหา
        console.error("Server error: ຂໍອະໄພ, ເວັບ​ໄຊ​ມີ​ບັນ​ຫາ");
      }
    }
    return Promise.reject(error); // ส่ง error กลับไปให้ตัวที่เรียกใช้
  },
);

export default axiosInstance;
