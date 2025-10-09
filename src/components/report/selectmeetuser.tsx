"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import { toast } from "react-toastify";
import { UserIcon, MapPinIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { encryptId } from "@/lib/cryptoId";

interface User {
  code: string;
  firstname: string;
  lastname: string;
  gender: string;
  tel: string;
  unitId: number;
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

interface Meeting {
  id: number;
  name: string;
  dateactive: string;
  detailmeets: DetailMeet[];
}

interface DetailMeet {
  id: number;
  content: string;
  lat: number;
  lng: number;
  meetimg: string;
  createdAt: string;
  user: User;
}

const Report: React.FC = () => {
  const [selectedMeet, setSelectedMeet] = useState<number | null>(null);
  const [meets, setMeets] = useState<Meeting[]>([]);
  const [detailmeets, setDetailMeets] = useState<DetailMeet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        const response = await axiosInstance.get(`/meetings/smeeting`);
        setMeets(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນກິດຈະກຳ");
      }
    };

    fetchMeets();
  }, []);

  const fetchReportData = async (meetId: number) => {
    if (!meetId) {
      toast.error("ກະລຸນາເລືອກກິດຈະກຳ");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/selectmeetuser?meeting=${meetId}`,
      );
      const selectedMeeting = response.data.find(
        (meet: Meeting) => meet.id === meetId,
      );

      if (!selectedMeeting) {
        toast.error("ບໍ່ພົບຂໍ້ມູນກິດຈະກຳ");
        setLoading(false);
        return;
      }

      setDetailMeets(selectedMeeting?.detailmeets ?? []);
      console.log(selectedMeeting.detailmeets);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນ");
    } finally {
      setLoading(false);
    }
  };

  const handleActivityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setSelectedMeet(value ? parseInt(value) : null);
  };

  const handleSearch = () => {
    if (selectedMeet !== null) {
      fetchReportData(selectedMeet);
    } else {
      toast.error("ກະ​ລຸ​ນາ​ເລືອກ​ປະ​ຊຸມ");
    }
  };

  const handleProfile = (code: string) => {
    router.push(`/profile/view/${encryptId(code)}`);
  };

  const exportToExcel = () => {
    if (detailmeets) {
      const worksheet = XLSX.utils.json_to_sheet(
        detailmeets.map((item, index) => ({
          "ລ/ດ": index + 1,
          "ລະ​ຫັດ ພ/ງ": item.user?.code,
          "ຊື່​ ແລະ ນາມ​ສະ​ກຸນ": `${item.user?.gender === "Male" ? "ທ່ານ" : item.user?.gender === "Female" ? "ທ່ານນາງ" : ""} ${item.user?.firstname} ${item.user?.lastname}`,
          ໜ່ວຍ: item.user?.unit?.name,
          ຈຸ: item.user?.chu?.name,
          "​ເວ​ລ​າ": moment(item.createdAt).format("DD/MM/YYYY H:mm:ss"),
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
      saveAs(data, `ສັງ​ລວມຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ.xlsx`);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:gap-0">
        <div className="relative w-full md:w-2/3 lg:w-2/3">
          <select
            id="year-select"
            value={selectedMeet ?? ""}
            onChange={handleActivityChange}
            className="w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 pr-10 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="" disabled>
              ເລືອກປະ​ຊຸມ
            </option>
            {meets.map((meet) => (
              <option
                className="text-xs sm:text-xs md:text-sm"
                key={meet.id}
                value={meet.id}
              >
                {meet.name}
              </option>
            ))}
          </select>
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
            disabled={detailmeets.length === 0 || loading}
            className={`ml-3 rounded-[7px] bg-green-500 p-[13px] font-medium text-white hover:bg-opacity-90 ${detailmeets.length === 0 || loading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : detailmeets.length > 0 ? (
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
                  ​ຮູບ​ພາບ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  ​ເວ​ລ​າ
                </th>
                <th className="min-w-[150px] px-2 py-4 font-medium text-dark dark:text-white">
                  #
                </th>
              </tr>
            </thead>
            <tbody>
              {detailmeets.length > 0 ? (
                detailmeets.map((item, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3 xl:pl-7.5">
                      <p className="text-dark dark:text-white">{index + 1}</p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.user?.code}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.user?.gender
                          ? item.user.gender === "Male"
                            ? "ທ່ານ"
                            : item.user.gender === "Female"
                              ? "ທ່ານນາງ"
                              : ""
                          : ""}{" "}
                        {item.user?.firstname} {item.user?.lastname}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.user?.unit?.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {item.user?.chu?.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <Image
                        className="h-16 w-24 rounded-lg border object-cover shadow-md"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/upload/meeting/${item.meetimg}`}
                        width={500}
                        height={500}
                        alt={item.meetimg}
                      />
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <p className="text-dark dark:text-white">
                        {moment(item.createdAt).format("DD/MM/YYYY H:mm:ss")}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-dark-3">
                      <button
                        onClick={() => handleProfile(item.user?.code)}
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
