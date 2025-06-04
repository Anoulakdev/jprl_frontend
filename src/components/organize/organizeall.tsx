"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

interface Organize {
  id: number;
  organizeimg: string;
  unit: Unit;
}

interface Unit {
  id: number;
  no: number;
  name: string;
}

const OrganizeList: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [data, setData] = useState<Organize | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const router = useRouter();

  // Load all units on first render
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get(`/units/sunit`);
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Failed to load units");
      }
    };

    fetchUnits();
  }, []);

  // Load organize data when selectedUnit changes
  useEffect(() => {
    // เรียกข้อมูลทันทีเมื่อโหลดหน้า ไม่ว่าจะ selectedUnit เป็น null หรือไม่
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/organizes?unitId=${selectedUnit !== null ? selectedUnit : "null"}`,
        );
        setData(Array.isArray(response.data) ? response.data[0] : null); // กรณี array
        console.log("Loaded data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUnit]);

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedUnit(value ? parseInt(value) : null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full md:w-1/2">
          <select
            value={selectedUnit ?? ""}
            onChange={handleUnitChange}
            className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          >
            <option value="">ຄະ​ນະ ຄ​ຊ​ປ​ປ​ລ ຮາກ​ຖານ ຟ​ຟ​ລ</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
            <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : data?.organizeimg ? (
          <div className="rounded-xl border border-gray-300 p-4 shadow-md dark:border-gray-700">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/upload/organize/${data.organizeimg}`}
              alt={data.organizeimg}
              className="rounded-lg object-contain"
            />
          </div>
        ) : (
          <p className="my-10 text-center text-xl text-dark dark:text-gray-300">
            ຍັງ​ບໍ່​ທັນ​ມີ​ຮູບ
          </p>
        )}
      </div>
    </div>
  );
};

export default OrganizeList;
