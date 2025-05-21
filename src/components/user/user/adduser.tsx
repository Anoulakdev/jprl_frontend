"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getLocalStorage } from "@/utils/storage";

interface Role {
  id: number;
  name: string;
  description: string;
}
interface Position {
  id: number;
  name: string;
  description: string;
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

type User = {
  unitId: string; // หรือ number ถ้าเป็นตัวเลข
  // เพิ่ม field อื่น ๆ ตามจริง
};

const AddForm = () => {
  const [formData, setFormData] = useState({
    code: "",
    firstname: "",
    lastname: "",
    gender: "",
    tel: "",
    roleId: 3,
    positionId: "",
    unitId: "",
    chuId: "",
    userimg: "",
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [roless, setRoless] = useState<Role[]>([]);
  const [positionss, setPositionss] = useState<Position[]>([]);
  const [unitss, setUnitss] = useState<Unit[]>([]);
  const [chuss, setChuss] = useState<Chu[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser: User | null = getLocalStorage("user");

    if (storedUser?.unitId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        unitId: storedUser.unitId,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axiosInstance.get(`/positions`);
        setPositionss(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Failed to load positions");
      }
    };

    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchChus = async () => {
      try {
        const response = await axiosInstance.get(`/chus`);
        setChuss(response.data);
      } catch (error) {
        console.error("Error fetching chus:", error);
        toast.error("Failed to load chus");
      }
    };

    fetchChus();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Add the image name to the form data
      const userData = {
        ...formData,
        userimg: uploadedImage || null, // Set the uploaded image name
      };

      // Submit the form data
      await axiosInstance.post(`/users`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("ເພີ່ມ​ຂໍ້​ມູນ​​ສຳ​ເລັ​ດ​ແລ້ວ​");
      router.push("/user/user");
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
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ເພດ <span className="text-red">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    className="text-primary"
                    required
                  />
                  <span className="text-dark dark:text-white">ຊາຍ</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                    className="text-primary"
                    required
                  />
                  <span className="text-dark dark:text-white">​ຍິງ</span>
                </label>
              </div>
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ລະ​ຫັ​ດ​ພະ​ນັກ​ງານ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="ລະ​ຫັ​ດ​ພະ​ນັກ​ງານ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຊື່ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="ຊື່"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ນາມ​ສະ​ກຸນ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="ນາມ​ສະ​ກຸນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ເບີ​ໂທ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="ເບີ​ໂທ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຕຳ​ແໜ່ງ <span className="text-red">*</span>
              </label>
              <div className="relative">
                <select
                  name="positionId"
                  value={formData.positionId || ""}
                  onChange={handleChange}
                  className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  required
                >
                  <option value="" disabled>
                    ເລືອກ​ຕຳ​ແໜ່ງ
                  </option>
                  {positionss.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
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

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຈຸ <span className="text-red">*</span>
              </label>
              <div className="relative">
                <select
                  name="chuId"
                  value={formData.chuId || ""}
                  onChange={handleChange}
                  className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  required
                >
                  <option value="" disabled>
                    ເລືອກ​ຈຸ
                  </option>
                  {chuss.map((chu) => (
                    <option key={chu.id} value={chu.id}>
                      {chu.name}
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
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                ຮູບ​ພາບ
              </label>
              <input
                type="file"
                accept="image/*"
                name="userimg"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] text-black outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 md:w-1/2 xl:w-1/2"
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
