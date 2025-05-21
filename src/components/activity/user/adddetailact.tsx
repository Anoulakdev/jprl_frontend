"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { getLocalStorage } from "@/utils/storage";

interface User {
  code: string;
}

const AddForm = () => {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    activityId: id || "", // Make sure to handle cases where id might be null
    userCode: "",
    content: "",
    lat: "",
    lng: "",
    actimg: "",
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = getLocalStorage<User>("user");

    if (storedUser?.code) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userCode: storedUser.code,
      }));
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            lat: latitude.toString(),
            lng: longitude.toString(),
          }));
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          toast.error("ບໍ່ສາມາດຫາສະຖານທີຂອງທ່ານໄດ້");
        },
      );
    } else {
      toast.error("ບໍ່ສະເພາະການຮັບສະຖານທີຂອງທ່ານ");
    }
  }, []);

  // Check if the record already exists
  useEffect(() => {
    const checkDuplicateRecord = async () => {
      try {
        // Use formData.userCode instead of userCode directly
        const response = await axiosInstance.get(`/detailacts/checkact`, {
          params: {
            activityId: id,
            userCode: formData.userCode, // Fix: use formData.userCode here
          },
        });

        if (response.status === 200) {
          setIsDuplicate(true);
        }
      } catch (error) {
        console.error("Error checking duplicate record:", error);
      }
    };

    if (id && formData.userCode) {
      checkDuplicateRecord();
    }
  }, [id, formData.userCode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const actData = {
        ...formData,
        actimg: uploadedImage || null,
      };

      // console.log(actData);

      await axiosInstance.post(`/detailacts`, actData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("ເພີ່ມ​ຂໍ້​ມູນ​​ສຳ​ເລັ​ດ​ແລ້ວ​");
      router.push("/activity/user/detail");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("ເພີ່ມ​ຂໍ້​ມູນ​ບໍ່ສຳ​ເລັ​ດ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      {isDuplicate ? (
        <div className="px-1 py-10 text-center text-2xl font-bold text-red-600">
          ທ່ານ​ໄດ້​ເພີ່ມ​ກິດ​ຈ​ະ​ກຳ ​ເຂົ້າ​ໃນ​ລະ​ບົບ​ແລ້ວ.
          <div className="pt-12 text-right">
            <Link href="/activity/user/detail">
              <button className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-sm font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400">
                ໄປ​ໜ້າ​ປະ​ຫວັດ​ກິດ​ຈະ​ກຳ
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
              {/* Name Field */}
              <div className="w-full xl:w-1/2">
                <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                  ເນື້ອ​ໃນ​ການ​ມາ​ກິດ​ຈະ​ກຳ <span className="text-red">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="ເນື້ອ​ໃນ​ການ​ມາ​ກິດ​ຈະ​ກຳ"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  required
                ></textarea>
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  ຮູບ​ພາບ <span className="text-red">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="actimg"
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
                className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 xl:w-1/2"
              >
                {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ເພີ່ມຂໍ້​ມູນ"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddForm;
