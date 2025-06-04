"use client";
import flatpickr from "flatpickr";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

const AddForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    noticefile: "",
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedImage(e.target.files[0]); // Directly set the file
    }
  };

  useEffect(() => {
    flatpickr(".form-datepicker", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d/m/Y",
      disableMobile: true,
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates, dateStr, instance) => {
        setFormData((prevData) => ({
          ...prevData,
          date: dateStr,
        }));
      },
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append(
        "date",
        moment(formData.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
      );

      if (uploadedImage) {
        formDataToSend.append("noticefile", uploadedImage);
      }

      await axiosInstance.post("/notices", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      toast.success("ເພີ່ມ​ຂໍ້​ມູນ​​ສຳ​ເລັ​ດ​ແລ້ວ​");
      router.push("/notice");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("ເພີ່ມ​ຂໍ້​ມູນ​ບໍ່ສຳ​ເລັ​ດ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            {/* Name Field */}
            <div className="w-full xl:w-1/3">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                ວັນ​ທີ <span className="text-red">*</span>
              </label>
              <div className="relative">
                <input
                  name="date"
                  value={formData.date}
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
            <div className="w-full xl:w-1/3">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຫົວ​ຂໍ້​ແຈ້ງ​ການ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="ຫົວ​ຂໍ້​ແຈ້ງ​ການ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div className="w-full xl:w-1/3">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                ເອ​ກະ​ສານ <span className="text-red">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf"
                name="noticefile"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] text-black outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white transition hover:bg-opacity-90 xl:w-1/2 ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ເພີ່ມຂໍ້​ມູນ"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
