"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import {
  CalendarDaysIcon,
  PlusIcon,
  UserGroupIcon,
  BellAlertIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";
import { encryptId } from "@/lib/cryptoId";

interface Activity {
  id: number;
  name: string;
  dateactive: string;
}

const ActList: React.FC = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/activitys`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = (id: number) => {
    // router.push(`/activity/user/detail/add/${id}`);
    const encryptedId = encryptId(id);
    window.location.href = `/activity/user/detail/add/${encryptedId}`;
  };

  const today = moment().format("YYYY-MM-DD");

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white">
        <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
        ກິດ​ຈ​ະ​ກຳປະ​ຈຳ​ມື້ນີ້
      </h2>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          {data.filter(
            (act) =>
              act.dateactive && moment(act.dateactive).isSame(today, "day"),
          ).length > 0 ? (
            data
              .filter(
                (act) =>
                  act.dateactive && moment(act.dateactive).isSame(today, "day"),
              )
              .map((act) => (
                <div
                  key={act.id}
                  className="w-full rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 xl:w-1/2"
                >
                  <div className="p-5">
                    <h5
                      className="mb-3 text-2xl font-semibold tracking-tight text-gray-800 dark:text-white"
                      style={{
                        height: "90px",
                      }}
                    >
                      <div className="flex gap-3">
                        <Square3Stack3DIcon className="h-7 w-7 text-blue-600" />{" "}
                        {act.name}
                      </div>
                    </h5>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAdd(act.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <PlusIcon className="h-5 w-5" />
                        ເພີ່ມ​ກິດ​ຈ​ະ​ກຳ
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="w-full py-15 text-center text-2xl font-bold text-red-600">
              ຍັງ​ບໍ່​ທັນ​ມີ​ກິດ​ຈະ​ກຳ​ໃນ​ມື້​ນີ້
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActList;
