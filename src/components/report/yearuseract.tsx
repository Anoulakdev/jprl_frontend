/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Image from "next/image";
interface ReportItem {
  name: string;
  content: string;
  actimg: string;
  createdAt: string;
  activity: Activity;
}

interface Activity {
  id: number;
  name: string;
  deteactive: string;
}

const Report: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [reportData, setReportData] = useState<ReportItem[] | null>(null); // เก็บข้อมูลจาก API
  const [loading, setLoading] = useState<boolean>(false); // สำหรับแสดงสถานะ loading

  // สร้าง array ของปีย้อนหลัง 5 ปี
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from(
      { length: 5 },
      (_, index) => currentYear - index,
    );
    setYears(yearsArray);
  }, []);

  // ฟังก์ชันเรียก API
  const fetchReportData = async (year: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/yearuseract?year=${year}`,
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเมื่อผู้ใช้เลือกปี
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "ค้นหา"
  const handleSearch = () => {
    if (selectedYear !== null) {
      fetchReportData(selectedYear);
    } else {
      toast.error("ກະ​ລຸ​ນາ​ເລືອກ​ປີ​ຄົ້ນ​ຫາ");
    }
  };

  const exportToExcel = () => {
    if (reportData) {
      const worksheet = XLSX.utils.json_to_sheet(
        reportData.map((item, index) => ({
          "ລ/ດ": index + 1,
          "​ຊື່​ກິດ​ຈ​ະ​ກຳ": item.activity.name,
          "ເນື້ອ​ໃນ​ການ​ມາ​ກິດ​ຈະ​ກຳ": item.content,
          "ເວ​ລາ​": moment(item.createdAt).format("DD/MM/YYYY H:mm:ss"),
        })),
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, `ສັງ​ລວມຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ປີ${selectedYear}.xlsx`);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex items-center">
        <div className="relative w-1/2 md:w-1/4 xl:w-1/4">
          <select
            id="year-select"
            value={selectedYear ?? ""}
            onChange={handleYearChange}
            className="w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 pr-10 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="" disabled>
              ເລືອກປີ
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {/* ไอคอนลูกศร */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06-.02L10 10.648l3.71-3.44a.75.75 0 111.02 1.1l-4.19 3.89a.75.75 0 01-1.04 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`ml-3 rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {loading ? "ກຳລັງຄົ້ນຫາ..." : "ຄົ້ນຫາ"}
        </button>
        <button
          onClick={exportToExcel}
          disabled={!reportData || loading}
          className={`ml-3 rounded-[7px] bg-green-500 p-[13px] font-medium text-white hover:bg-opacity-90 ${!reportData || loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          Excel
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : reportData ? (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#d9e0e9] text-left text-lg font-bold dark:bg-dark-2">
                <th className="min-w-[80px] px-2 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  ລ/ດ
                </th>
                <th className="min-w-[380px] px-2 py-4 font-medium text-dark dark:text-white">
                  ​ຊື່​ກິດ​ຈ​ະ​ກຳ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຮູບ​ພາບ
                </th>
                <th className="min-w-[120px] px-2 py-4 font-medium text-dark dark:text-white">
                  ວັນ​ທີ
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3 xl:pl-7.5">
                      <p className="text-dark dark:text-white">{index + 1}</p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.activity.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <Image
                        className="h-16 w-24 rounded-lg border object-cover shadow-md"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/upload/activity/${item.actimg}`}
                        width={500}
                        height={500}
                        alt={item.actimg}
                      />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {moment(item.createdAt).format("DD/MM/YYYY H:mm:ss")}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-lg text-dark dark:text-white"
                  >
                    ບໍ່​ມີ​ຂໍ້​ມູນ​
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Report;
