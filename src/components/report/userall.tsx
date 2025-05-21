/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import moment from "moment";
import { UserIcon, ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface User {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  actived: string;
  gender: string;
  tel: string;
  userimg: string;
  roleId: number;
  positionId: number;
  unitId: number;
  chuId: number;
  position: Position;
  unit: Unit;
  chu: Chu;
  datebirth: string;
  tribe: string;
  religion: string;
  villagebirth: string;
  districtbirth: string;
  provincebirth: string;
  villagenow: string;
  districtnow: string;
  provincenow: string;
  edusaman: string;
  edulevel: string;
  edusubject: string;
  edutheory: string;
  phaksupport: string;
  phakrule: string;
  phaksamhong: string;
  phaksomboun: string;
  phakposition: string;
  phakcard: string;
  phakissuedcard: string;
  phakbook: string;
  latcomein: string;
  latposition: string;
  kammabancomein: string;
  kammabanposition: string;
  youthcomein: string;
  womencomein: string;
  womenposition: string;
  arts: string;
  sports: string;
  fbusiness: string;
  ideas: string;
}

interface Position {
  id: number;
  name: string;
  description: string;
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
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedChu, setSelectedChu] = useState<number | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [chus, setChus] = useState<Chu[]>([]);
  const [reportData, setReportData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get(`/units`);
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Failed to load units");
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    const fetchChus = async () => {
      try {
        const response = await axiosInstance.get(`/chus`);
        setChus(response.data);
      } catch (error) {
        console.error("Error fetching chus:", error);
        toast.error("Failed to load chus");
      }
    };

    fetchChus();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/userall?unitId=${selectedUnit ?? ""}&chuId=${selectedChu ?? ""}`,
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນ");
    } finally {
      setLoading(false);
    }
  };

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedUnit(value ? parseInt(value) : null);
  };

  const handleChuChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedChu(value ? parseInt(value) : null);
  };

  const handleSearch = () => {
    fetchReportData();
  };

  const handleProfile = (code: string) => {
    router.push(`/profile/view/${code}`);
  };

  const calculateAge = (datebirth: string) => {
    const birthDate = new Date(datebirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // ตรวจสอบว่าเดือนหรือวันเลยวันเกิดหรือยัง
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // ยังไม่ถึงวันเกิดปีนี้
    }

    return age;
  };

  const exportToExcel = () => {
    if (reportData) {
      const worksheet = XLSX.utils.json_to_sheet(
        reportData.map((item, index) => ({
          "ລ/ດ": index + 1,
          "ລະ​ຫັດ ພ/ງ": item.code,
          "ຊື່​ ແລະ ນາມ​ສະ​ກຸນ": `${item.gender === "Male" ? "ທ່ານ" : item.gender === "Female" ? "ທ່ານນາງ" : ""} ${item.firstname} ${item.lastname}`,
          "ຕຳ​ແໜ່ງ": item.position?.name,
          ໜ່ວຍ: item.unit?.name,
          ຈຸ: item.chu?.name,
          "ວັນ​ເດືອນ​ປີ​ເກີດ": item?.datebirth
            ? moment(item.datebirth).format("DD/MM/YYYY")
            : "",
          "ອາ​ຍຸ": item?.datebirth
            ? calculateAge(item.datebirth) + " ປີ"
            : "N/A",
          "ເບີ​ໂທ": item.tel,
          "ຊົນ​ເຜົ່າ": item.tribe,
          "​ສາ​ດ​ສະ​ໜາ": item.religion,
          "​ບ້ານ​ເກີ​ດ": item.villagebirth,
          "ເມືອງ​ເກີ​ດ": item.districtbirth,
          "ແຂວງ​ເກີ​ດ": item.provincebirth,
          "​ບ້ານ​ຢູ່​ປະ​ຈຸ​ບັນ": item.villagenow,
          "ເມືອງ​ຢູ່​ປະ​ຈຸ​ບັນ": item.districtnow,
          "ແຂວງ​ຢູ່​ປະ​ຈຸ​ບັນ": item.provincenow,
          "ລະ​ດັ​ບ​ການ​ສຶກ​ສາ(ສາ​ມັນ)": item.edusaman,
          "ລະ​ດັ​ບ​ການ​ສຶກ​ສາ(ຊັ້ນ)": item.edulevel,
          "ລະ​ດັ​ບ​ການ​ສຶກ​ສາ(​ສາ​ຂາ​ວິ​ສາ​ສະ​ເພາະ)": item.edusubject,
          "ລະ​ດັ​ບ​ການ​ສຶກ​ສາ(​ທິດ​ສະ​ດີ)": item.edutheory,
          "ວ/ດ/ປ ຮຽນ​ສະ​ໜັບ​ສະ​ໜູນ": item.phaksupport
            ? moment(item.phaksupport).format("DD/MM/YYYY")
            : "",
          "ວ/ດ/ປ ຮຽນ​ກົດ​ລະ​ບຽບ​ພັກ": item.phakrule
            ? moment(item.phakrule).format("DD/MM/YYYY")
            : "",
          "ວ/ດ/ປ ເຂົ້າ​ສຳ​ຮອງ": item.phaksamhong
            ? moment(item.phaksamhong).format("DD/MM/YYYY")
            : "",
          "ວ/ດ/ປ ເຂົ້າ​ສົມ​ບູນ": item.phaksomboun
            ? moment(item.phaksomboun).format("DD/MM/YYYY")
            : "",
          "ຕຳ​ແໜ່ງ​ພັກ": item.phakposition,
          "ລະ​ຫັດ​ບັດ​ສະ​ມາ​ຊິກ​ພັກ": item.phakcard,
          "ວ/ດ/ປ ອອກ​ບັດ": item.phakissuedcard
            ? moment(item.phakissuedcard).format("DD/MM/YYYY")
            : "",
          "ປີ​ຂຽນ​ປຶ​້ມ​ປະ​ຫວັດ​ພັກ": item.phakbook,
          "ວ/ດ/ປ ເຂົ້າສັງ​ກັດ​ລັດ": item.latcomein
            ? moment(item.latcomein).format("DD/MM/YYYY")
            : "",
          "ຕຳ​ແໜ່ງ​ລັດ": item.latposition,
          "ວ/ດ/ປ ເຂົ້າ​ກຳ​ມະ​ບານ": item.kammabancomein
            ? moment(item.kammabancomein).format("DD/MM/YYYY")
            : "",
          "ຕຳ​ແໜ່ງ​ກຳ​ມະ​ບານ": item.kammabanposition,
          "ວ/ດ/ປ ເຂົ້າ​ແມ່​ຍິງ": item.womencomein
            ? moment(item.womencomein).format("DD/MM/YYYY")
            : "",
          "ຕຳ​ແໜ່ງ​ແມ່​ຍິງ": item.womenposition,
          "ວ/ດ/ປ ເຂົ້າ​ຊາວ​ໜຸ່ມ": item.youthcomein
            ? moment(item.youthcomein).format("DD/MM/YYYY")
            : "",
          "ປະ​ເພດ​ສິນ​ລະ​ປະ": Array.isArray(item.arts)
            ? item.arts.join(", ")
            : "",
          "ປະ​ເພດ​ກິ​ລາ": Array.isArray(item.sports)
            ? item.sports.join(", ")
            : "",
          "ປະ​ເພດ​ທຸ​ລະ​ກິດ​ຄອບ​ຄົວ": Array.isArray(item.fbusiness)
            ? item.fbusiness.join(", ")
            : "",
          "ປະ​ເພດ​ແນວຄວາມຄິດນະວັດຕະກຳ": Array.isArray(item.ideas)
            ? item.ideas.join(", ")
            : "",
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
      saveAs(data, `ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ.xlsx`);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:gap-0">
        <div className="relative w-full md:mr-3 md:w-1/4">
          <select
            value={selectedUnit ?? ""}
            onChange={handleUnitChange}
            className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          >
            <option value="">ເລືອກໜ່ວຍ</option>
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

        <div className="relative w-full md:w-1/4">
          <select
            value={selectedChu ?? ""}
            onChange={handleChuChange}
            className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          >
            <option value="">ເລືອກຈຸ</option>
            {chus.map((chu) => (
              <option key={chu.id} value={chu.id}>
                {chu.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
            <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
          </div>
        </div>

        <div className="self-start">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 md:ml-3 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {loading ? "ກຳລັງຄົ້ນຫາ..." : "ຄົ້ນຫາ"}
          </button>
          <button
            onClick={exportToExcel}
            disabled={!reportData.length || loading}
            className={`ml-3 rounded-[7px] bg-green-500 p-[13px] font-medium text-white hover:bg-opacity-90 ${
              !reportData.length || loading
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : reportData.length > 0 ? (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#d9e0e9] text-left text-lg font-bold dark:bg-dark-2">
                <th className="min-w-[80px] px-2 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  ລ/ດ
                </th>
                <th className="min-w-[100px] px-2 py-4 font-medium text-dark dark:text-white">
                  ລະ​ຫັດ ພ/ງ
                </th>
                <th className="min-w-[200px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຊື່​ ແລະ ນາມ​ສະ​ກຸນ
                </th>
                <th className="min-w-[200px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຕຳ​ແໜ່ງ
                </th>
                <th className="min-w-[160px] px-2 py-4 font-medium text-dark dark:text-white">
                  ໜ່ວຍ
                </th>
                <th className="min-w-[90px] px-2 py-4 font-medium text-dark dark:text-white">
                  ຈຸ
                </th>
                <th className="min-w-[120px] px-2 py-4 font-medium text-dark dark:text-white">
                  ເບີ​ໂທ
                </th>
                <th className="min-w-[120px] px-2 py-4 font-medium text-dark dark:text-white">
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
                        {item.position?.name}
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
                      <p className="text-dark dark:text-white">{item.tel}</p>
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
