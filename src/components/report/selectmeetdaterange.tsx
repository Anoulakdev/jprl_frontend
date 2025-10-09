/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import flatpickr from "flatpickr";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { UserIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { encryptId } from "@/lib/cryptoId";

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
  const [DateStart, setDateStart] = useState<string | null>(null);
  const [DateEnd, setDateEnd] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchReportData = async () => {
    if (!DateStart || !DateEnd) {
      toast.error("ກະ​ລຸ​ນາ​ເລືອກ​ຊ່ວງວັນ​ທີ່");
      return;
    }

    const formattedStartDate = moment(DateStart, "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
    const formattedEndDate = moment(DateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/selectmeetdaterange?datestart=${formattedStartDate}&dateend=${formattedEndDate}`,
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

  const handleProfile = (code: string) => {
    router.push(`/profile/view/${encryptId(code)}`);
  };

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
        `ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​ຕາມ${DateStart}-${DateEnd}.xlsx`,
      );
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:gap-0">
        <div className="relative w-full md:mr-3 md:w-1/4 ">
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
        <div className="relative w-full md:w-1/4">
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
                        {item.unit?.name || ""}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.chu?.name || ""}
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
