"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

interface Chu {
  id: number;
  unitId: number;
  name: string;
  unit: Unit;
}

interface Unit {
  id: number;
  no: number;
  name: string;
}

const EditForm: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [chu, setChu] = useState<Chu | null>(null);
  const [unitss, setUnitss] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    if (!id) return;

    setIsLoading(true); // Set loading to true before fetching
    axiosInstance
      .get<Chu>(`/chus/${id}`)
      .then((response) => {
        setChu(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chu data:", error);
        toast.error("Error fetching chu data");
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  }, [id]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get(`/units/sunit`);
        setUnitss(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Failed to load units");
      }
    };

    fetchUnits();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setChu((prevChu) => ({ ...prevChu!, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chu) return;

    try {
      setIsLoading(true); // Set loading during submission
      await axiosInstance.put(`/chus/${chu.id}`, chu);
      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/chu");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("ອັບ​ເດດ​ບໍ່​ສຳ​ເລັດ");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          {isLoading ? (
            <p>Loading...</p> // Show loading indicator
          ) : (
            <>
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                {/* Name Field */}
                <div className="w-full xl:w-1/2">
                  <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                    ໜ່ວຍ <span className="text-red">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="unitId"
                      value={chu?.unitId || ""}
                      onChange={handleChange}
                      className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                      required
                    >
                      <option value="" disabled>
                        ເລືອກໜ່ວຍ
                      </option>
                      {unitss.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          ໜ່ວຍ{unit.no} - {unit.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-xl text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-down-circle"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                    ຊື່​ຈຸ <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={chu?.name || ""}
                    onChange={handleChange}
                    placeholder="ຊື່​ຈຸ"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className={`flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white transition hover:bg-opacity-90 md:w-1/2 xl:w-1/2 ${
                    isLoading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={isLoading} // Disable button when loading
                >
                  {isLoading ? "ກຳລັງອັບເດດ..." : "ອັບ​ເດດ"}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditForm;
