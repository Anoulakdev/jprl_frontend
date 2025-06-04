"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

interface Unit {
  id: number;
  no: number;
  name: string;
}

const EditForm: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    if (!id) return;

    setIsLoading(true); // Set loading to true before fetching
    axiosInstance
      .get<Unit>(`/units/${id}`)
      .then((response) => {
        setUnit(response.data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
        toast.error("Error fetching unit data");
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUnit((prevUnit) => ({ ...prevUnit!, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unit) return;

    try {
      setIsLoading(true); // Set loading during submission
      await axiosInstance.put(`/units/${unit.id}`, unit);
      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/unit");
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
                    ເລກ​ໜ່ວຍ <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    name="no"
                    value={unit?.no || ""}
                    onChange={handleChange}
                    placeholder="ເລກ​ໜ່ວຍ"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                {/* Description Field */}
                <div className="w-full xl:w-1/2">
                  <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                    ຊື່​ໜ່ວຍ
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={unit?.name || ""}
                    onChange={handleChange}
                    placeholder="ຊື່​ໜ່ວຍ"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
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
