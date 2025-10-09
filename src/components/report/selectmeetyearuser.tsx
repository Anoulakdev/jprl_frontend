/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import { UserIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { encryptId } from "@/lib/cryptoId";

// กำหนดประเภทของข้อมูลที่ได้จาก API
interface ReportItem {
  code: string;
  firstname: string;
  lastname: string;
  gender: string;
  tel: string;
  count: number;
  unit: Unit;
  chu: Chu;
}

interface Unit {
  id: number;
  no: number;
  name: string;
}

interface Chu {
  id: number;
  name: string;
}

const Report: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [reportData, setReportData] = useState<ReportItem[] | null>(null); // เก็บข้อมูลจาก API
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
        `/reports/selectmeetyearuser?year=${year}`,
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

  const handleProfile = (code: string) => {
    router.push(`/profile/view/${encryptId(code)}`);
  };

  // ฟังก์ชันส่งออกข้อมูลเป็น Excel
  const exportToExcel = () => {
    if (reportData) {
      const worksheet = XLSX.utils.json_to_sheet(
        reportData.map((item, index) => ({
          "ລ/ດ": index + 1,
          "ລະ​ຫັດ ພ/ງ": item.code,
          "ຊື່​ ແລະ ນາມ​ສະ​ກຸນ": `${item.gender === "Male" ? "ທ່ານ" : item.gender === "Female" ? "ທ່ານນາງ" : ""} ${item.firstname} ${item.lastname}`,
          ໜ່ວຍ: item.unit?.name,
          ຈຸ: item.chu?.name,
          "ຈຳ​ນວນ": item.count,
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
      saveAs(
        data,
        `ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມເປັນ​ປີ${selectedYear}.xlsx`,
      );
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
            className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
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

        {/* ปุ่มส่งออกเป็น Excel */}
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
                <th className="min-w-[90px] px-2 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  ລ/ດ
                </th>
                <th className="min-w-[120px] px-2 py-4 font-medium text-dark dark:text-white">
                  ລະ​ຫັດ ພ/ງ
                </th>
                <th className="min-w-[200px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຊື່​ ແລະ ນາມ​ສະ​ກຸນ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  ໜ່ວຍ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຈຸ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຈຳ​ນວນ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  #
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
                      <p className="text-dark dark:text-white">{item.code}</p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.gender
                          ? item.gender === "Male"
                            ? "ທ່ານ"
                            : item.gender === "Female"
                              ? "ທ່ານນາງ"
                              : ""
                          : ""}{" "}
                        {item.firstname} {item.lastname}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.unit?.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.chu?.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">{item.count}</p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <button
                        onClick={() => handleProfile(item.code)}
                        className="group relative mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-xs font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span className="absolute left-[-230%] top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 dark:bg-neutral-700">
                          ເບິ່ງ​ປະ​ຫວັດ
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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
