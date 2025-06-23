"use client";
import flatpickr from "flatpickr";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { decryptId } from "@/lib/cryptoId";

interface Notice {
  id: number;
  title: string;
  date: string;
  noticefile: string;
}

const EditForm: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    let decryptedId: string;
    try {
      decryptedId = decryptId(decodeURIComponent(id as string));
    } catch (err) {
      router.replace("/unauthorized");
      return;
    }

    axiosInstance
      .get<Notice>(`/notices/${decryptedId}`)
      .then((response) => {
        console.log("API Response:", response.data);
        const notice = response.data;
        setNotice({
          id: notice.id,
          date: moment(notice.date).format("DD/MM/YYYY"),
          title: notice.title,
          noticefile: notice.noticefile,
        });
      })
      .catch((error) => {
        console.error("Error fetching role data:", error);
        toast.error("Error fetching role data");
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNotice((prevAct) => ({ ...prevAct!, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file); // Set the actual file
    }
  };

  useEffect(() => {
    if (!notice) return;

    flatpickr(".form-datepicker", {
      mode: "single",
      static: true,
      dateFormat: "d/m/Y",
      disableMobile: true,
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      defaultDate: notice.date, // Set the initial value for flatpickr
      onChange: (selectedDates, dateStr) => {
        setNotice((prevAct) =>
          prevAct ? { ...prevAct, date: dateStr } : null,
        );
      },
    });
  }, [notice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notice) return;

    setIsLoading(true); // Set loading during submission
    try {
      const formData = new FormData();
      formData.append(
        "date",
        moment(notice.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
      );
      formData.append("title", notice.title);

      if (uploadedImage) {
        formData.append("noticefile", uploadedImage);
      }

      await axiosInstance.put(`/notices/${notice.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/notice");
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
                <div className="w-full xl:w-1/3">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    ວັນ​ທີ <span className="text-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="date"
                      value={notice?.date || ""}
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
                    value={notice?.title || ""}
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
