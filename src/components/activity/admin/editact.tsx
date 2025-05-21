"use client";
import flatpickr from "flatpickr";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

interface Activity {
  id: number;
  name: string;
  dateactive: string;
}

const EditForm: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [act, setAct] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    if (!id) return;

    setIsLoading(true); // Set loading to true before fetching
    axiosInstance
      .get<Activity>(`/activitys/${id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        const activity = response.data;
        setAct({
          id: activity.id,
          name: activity.name,
          dateactive: moment(activity.dateactive).format("DD/MM/YYYY"),
        });
      })
      .catch((error) => {
        console.error("Error fetching role data:", error);
        toast.error("Error fetching role data");
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAct((prevAct) => ({ ...prevAct!, [name]: value }));
  };

  useEffect(() => {
    if (!act) return;

    flatpickr(".form-datepicker", {
      mode: "single",
      static: true,
      dateFormat: "d/m/Y",
      disableMobile: true,
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      defaultDate: act.dateactive, // Set the initial value for flatpickr
      onChange: (selectedDates, dateStr) => {
        setAct((prevAct) =>
          prevAct ? { ...prevAct, dateactive: dateStr } : null,
        );
      },
    });
  }, [act]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!act) return;

    setIsLoading(true); // Set loading during submission
    try {
      // Convert dateactive to yyyy-mm-dd format using Moment.js
      const formattedDate = moment(act.dateactive, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );

      // Update formData with formatted date
      const updatedFormData = {
        ...act,
        dateactive: formattedDate,
      };
      await axiosInstance.put(`/activitys/${act.id}`, updatedFormData);
      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/activity/admin");
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
                    ຫົວ​ຂໍ້​ກິດ​ຈະ​ກຳ <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={act?.name || ""}
                    onChange={handleChange}
                    placeholder="ຫົວ​ຂໍ້​ກິດ​ຈະ​ກຳ"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                {/* Description Field */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    ມື້​ເລີ່ມ​ກິດ​ຈະ​ກຳ <span className="text-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="dateactive"
                      value={act?.dateactive || ""}
                      onChange={handleChange}
                      className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                      placeholder="dd/mm/yyyy"
                      data-class="flatpickr-right"
                      required
                      readOnly={true}
                      onFocus={(e) => e.target.blur()}
                    />

                    <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                      <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 xl:w-1/2"
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
