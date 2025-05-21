"use client";
import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { removeLocalStorage } from "@/utils/storage";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldpassword: "",
    password1: "",
    password2: "",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Submit the form data
      await axiosInstance.post(`/users/changepassword`, formData); // Ensure this is the correct endpoint
      removeLocalStorage("token");
      removeLocalStorage("user");
      toast.success("ປ່ຽນ​ລະ​ຫັດ​ສຳ​ເລັດ ກະ​ລຸ​ນາ​ເຂົ້າ​ລະ​ບົບ​ໃໝ່");
      router.push("/");
    } catch (error) {
      // Handle errors from the backend
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error;
  
        if (errorMessage === "ລະ​ຫັດ​ໃໝ່​ບໍ່​ຕົງ​ກັນ") {
          toast.error("ລະ​ຫັດ​ໃໝ່​ບໍ່​ຕົງ​ກັນ");
        } else if (errorMessage === "User not found") {
          toast.error("ບໍ່​ພົບ​ຜູ້​ໃຊ້");
        } else if (errorMessage === "ລະ​ຫັດ​ເກ​ົ່າ​ບໍ່​ຕົງ​ກັບ​ຖານ​ຂໍ້​ມູນ") {
          toast.error("ລະ​ຫັດ​ເກ​ົ່າ​ບໍ່​ຕົງ​ກັບ​ຖານ​ຂໍ້​ມູນ");
        } else {
          // Handle other errors
          toast.error("ເພີ່ມ​ຂໍ້​ມູນ​ບໍ່ສຳ​ເລັ​ດ");
        }
      } else {
        // Handle non-Axios errors
        console.error("Error submitting form:", error);
        toast.error("ເພີ່ມ​ຂໍ້​ມູນ​ບໍ່ສຳ​ເລັ​ດ");
      }
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
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ລະ​ຫັດ​ເກົ່າ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="oldpassword"
                value={formData.oldpassword}
                onChange={handleChange}
                placeholder="ລະ​ຫັດ​ເກົ່າ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            {/* Description Field */}
            <div className="w-full xl:w-1/3">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ລະ​ຫັດ​ໃໝ່ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                placeholder="ລະ​ຫັດ​ໃໝ່"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div className="w-full xl:w-1/3">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຢືນ​ຢັນລະ​ຫັດ​ໃໝ່ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                placeholder="ຢືນ​ຢັນລະ​ຫັດ​ໃໝ່"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
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
    </div>
  );
};

export default ChangePassword;
