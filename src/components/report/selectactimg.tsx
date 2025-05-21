/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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

interface Activity {
  id: number;
  name: string;
  dateactive: string;
  detailacts: DetailAct[];
}

interface DetailAct {
  id: number;
  content: string;
  lat: number;
  lng: number;
  actimg: string;
  createdAt: string;
  user: User;
}

const Report: React.FC = () => {
  const [selectedAct, setSelectedAct] = useState<number | null>(null);
  const [acts, setActs] = useState<Activity[]>([]);
  const [detailacts, setDetailActs] = useState<DetailAct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchActs = async () => {
      try {
        const response = await axiosInstance.get(`/activitys`);
        setActs(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນກິດຈະກຳ");
      }
    };

    fetchActs();
  }, []);

  const fetchReportData = async (actId: number) => {
    if (!actId) {
      toast.error("ກະລຸນາເລືອກກິດຈະກຳ");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/selectactimg?activity=${actId}`,
      );
      const selectedActivity = response.data.find(
        (act: Activity) => act.id === actId,
      );
      setDetailActs(selectedActivity?.detailacts ?? []);
      console.log(selectedActivity.detailacts);
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
    setSelectedAct(value ? parseInt(value) : null);
  };

  const handleSearch = () => {
    if (selectedAct !== null) {
      fetchReportData(selectedAct);
    } else {
      toast.error("ກະ​ລຸ​ນາ​ເລືອກ​ກິດ​ຈະ​ກຳ");
    }
  };

  const handleDownloadAll = async () => {
    if (detailacts.length === 0) {
      toast.error("ບໍ່ມີຮູບພາບໃຫ້ດາວໂຫລດ");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("activity_images");
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/upload/activity`;

    for (const item of detailacts) {
      try {
        const response = await fetch(`${baseUrl}/${item.actimg}`);
        const blob = await response.blob();
        folder?.file(item.actimg, blob);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const activityName =
        acts.find((act) => act.id === selectedAct)?.name || "activity";
      const sanitizedName = activityName.replace(/[\\/:*?"<>|]/g, "");
      saveAs(content, `${sanitizedName}.zip`);
    });
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:gap-0">
        <div className="relative w-full md:w-2/3 lg:w-2/3">
          <select
            id="year-select"
            value={selectedAct ?? ""}
            onChange={handleActivityChange}
            className="w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 pr-10 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="" disabled>
              ເລືອກກິດ​ຈະ​ກຳ
            </option>
            {acts.map((act) => (
              <option
                className="text-xs sm:text-xs md:text-sm"
                key={act.id}
                value={act.id}
              >
                {act.name}
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
            onClick={handleDownloadAll}
            disabled={detailacts.length === 0}
            className={`ml-3 rounded-[7px] bg-green-600 p-[13px] font-medium text-white hover:bg-opacity-90 md:ml-3 ${
              detailacts.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            ດາວໂຫລດຮູບພາບ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
          {detailacts.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              <img
                className="h-35 w-full object-cover sm:h-40 md:h-35 lg:h-30 xl:h-40"
                src={`${process.env.NEXT_PUBLIC_API_URL}/upload/activity/${item.actimg}`}
                alt={item.actimg}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Report;
