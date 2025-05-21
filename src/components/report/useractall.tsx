/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import flatpickr from "flatpickr";
import axiosInstance from "@/utils/axiosInstance";
import moment from "moment";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// กำหนดประเภทของข้อมูลที่ได้จาก API
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
  const [DateStart, setDateStart] = useState<string | null>(null);
  const [DateEnd, setDateEnd] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [reportData, setReportData] = useState<ReportItem[] | null>(null); // เก็บข้อมูลจาก API
  const [loading, setLoading] = useState<boolean>(false); // สำหรับแสดงสถานะ loading

  // ฟังก์ชันเรียก API
  const fetchReportData = async () => {
    if (!DateStart || !DateEnd || !userCode.trim()) {
      toast.error("ກະ​ລຸ​ນາ​ປ້ອນ​ຂໍ້​ມູນ​ໃຫ້​ຄົບ​ຖ້ວນ​ດ້ວຍ");
      return;
    }

    const formattedStartDate = moment(DateStart, "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
    const formattedEndDate = moment(DateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/useractall?datestart=${formattedStartDate}&dateend=${formattedEndDate}&userCode=${userCode}`,
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ມີບັນຫາໃນການໂຫລດຂໍ້ມູນ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    flatpickr(".form-datepicker-start", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d/m/Y",
      disableMobile: true,
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates, dateStr) => {
        if (selectedDates.length > 0) {
          setDateStart(dateStr);
        }
      },
    });

    flatpickr(".form-datepicker-end", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d/m/Y",
      disableMobile: true,
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates, dateStr) => {
        if (selectedDates.length > 0) {
          setDateEnd(dateStr);
        }
      },
    });
  }, []);

  const handleSearch = () => {
    fetchReportData();
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
      saveAs(
        data,
        `ສັງ​ລວມການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຂອງ​ພະ​ນັກ​ງານ${userCode}.xlsx`,
      );
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:gap-0">
        <div className="relative w-full md:mr-3 md:w-1/6 ">
          <input
            name="DateStart"
            value={DateStart || ""}
            className="form-datepicker-start w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="ວັນ​ທີ່​ເລີ່ມ"
            data-class="flatpickr-right"
            required
            readOnly={true}
            onFocus={(e) => e.target.blur()}
          />
          <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
            <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
          </div>
        </div>
        <div className="relative w-full md:mr-3 md:w-1/6">
          <input
            name="DateEnd"
            value={DateEnd || ""}
            className="form-datepicker-end w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="ວັນ​ທີ່​ສຸດ​ທ້າຍ"
            data-class="flatpickr-right"
            required
            readOnly={true}
            onFocus={(e) => e.target.blur()}
          />
          <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
            <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
          </div>
        </div>
        <div className="relative w-full md:w-1/6">
          <input
            type="text"
            name="userCode"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="ລະ​ຫັ​ດ​ພະ​ນັກ​ງານ"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            required
          />
        </div>
        <div className="self-start">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 md:ml-3 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
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
                      <img
                        className="h-16 w-24 rounded-lg border object-cover shadow-md"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/upload/activity/${item.actimg}`}
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
