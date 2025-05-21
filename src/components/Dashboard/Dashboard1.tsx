"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { dataStats } from "@/types/dataStats";
import { toast } from "react-toastify";
import { UserIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

interface ReportItem {
  code: string;
  firstname: string;
  lastname: string;
  gender: string;
  tel: string;
  count: number;
  unit: {
    name: string;
  };
  chu: {
    name: string;
  };
}

interface Act {
  actcount: number;
}

interface User {
  usercount: number;
}

interface Unit {
  unitcount: number;
}

interface Chu {
  chucount: number;
}

const DataStatsOne: React.FC<dataStats> = () => {
  const [reportData, setReportData] = useState<ReportItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acts, setActs] = useState<Act>({ actcount: 0 });
  const [users, setUsers] = useState<User>({ usercount: 0 });
  const [units, setUnits] = useState<Unit>({ unitcount: 0 });
  const [chus, setChus] = useState<Chu>({ chucount: 0 });

  const currentyear = new Date().getFullYear();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axiosInstance.get(
          `/reports/selectyearuser?year=${currentyear}`,
        );
        setReportData(response.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching activitys:", error);
      }
    };

    fetchReportData();
  }, [currentyear]);

  useEffect(() => {
    const fetchAct = async () => {
      try {
        const response = await axiosInstance.get(`/activitys/count`);
        setActs(response.data);
      } catch (error) {
        console.error("Error fetching activitys:", error);
        toast.error("Failed to load activitys");
      }
    };

    fetchAct();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/count`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await axiosInstance.get(`/units/count`);
        setUnits(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Failed to load units");
      }
    };

    fetchUnit();
  }, []);

  useEffect(() => {
    const fetchChu = async () => {
      try {
        const response = await axiosInstance.get(`/chus/count`);
        setChus(response.data);
      } catch (error) {
        console.error("Error fetching chus:", error);
        toast.error("Failed to load chus");
      }
    };

    fetchChu();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex w-full items-center justify-between rounded-[10px] bg-white p-4 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: "#3FD97F" }}
            >
              <CalendarDaysIcon className="h-9 w-9 text-white" />
            </div>
            <h4 className="text-heading-3 font-bold text-dark dark:text-white">
              {acts.actcount}
            </h4>
          </div>

          <div className="mt-4 flex items-end justify-end">
            <p className="ml-auto text-right text-xl font-medium text-black dark:text-white">
              ຈຳ​ນວນ​ກິດ​ຈະ​ກຳ​ທັງ​ໝົດ
            </p>
          </div>
        </div>
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex w-full items-center justify-between rounded-[10px] bg-white p-4 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: "#FF9C55" }}
            >
              <UserIcon className="h-9 w-9 text-white" />
            </div>
            <h4 className="text-heading-3 font-bold text-dark dark:text-white">
              {users.usercount}
            </h4>
          </div>

          <div className="mt-4 flex items-end justify-end">
            <p className="ml-auto text-right text-xl font-medium text-black dark:text-white">
              ຈຳ​ນວນ​ສະ​ມາ​ຊິກທັງ​ໝົດ
            </p>
          </div>
        </div>
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex w-full items-center justify-between rounded-[10px] bg-white p-4 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: "#8155FF" }}
            >
              <UserIcon className="h-9 w-9 text-white" />
            </div>
            <h4 className="text-heading-3 font-bold text-dark dark:text-white">
              {units.unitcount}
            </h4>
          </div>

          <div className="mt-4 flex items-end justify-end">
            <p className="ml-auto text-right text-xl font-medium text-black dark:text-white">
              ຈຳ​ນວນ​ໜ່ວຍທັງ​ໝົດ
            </p>
          </div>
        </div>
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div className="flex w-full items-center justify-between rounded-[10px] bg-white p-4 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: "#18BFFF" }}
            >
              <UserIcon className="h-9 w-9 text-white" />
            </div>
            <h4 className="text-heading-3 font-bold text-dark dark:text-white">
              {chus.chucount}
            </h4>
          </div>

          <div className="mt-4 flex items-end justify-end">
            <p className="ml-auto text-right text-xl font-medium text-black dark:text-white">
              ຈຳ​ນວນ​ຈຸທັງ​ໝົດ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">
          ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ​ຫຼາຍ​ທີ່​ສຸດ ພາຍ​ໃນປີ {currentyear}
        </h2>
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
            </tr>
          </thead>
          <tbody>
            {reportData && reportData.length > 0 ? (
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
    </>
  );
};

export default DataStatsOne;
