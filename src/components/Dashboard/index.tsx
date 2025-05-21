"use client";

import { useEffect, useState } from "react";
import { getLocalStorage } from "@/utils/storage"; // import ฟังก์ชัน

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = getLocalStorage("user");
    setUser(storedUser);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      {user ? (
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user.firstname}</h2>
          <p>Username: {user.lastname}</p>
          <p>Role: {user.role.name}</p>
          <p>Position: {user.position.name}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default DashboardPage;
