"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { decryptId } from "@/lib/cryptoId";

interface User {
  id: number;
  username: string;
  code: string;
  firstname: string;
  lastname: string;
  actived: string;
  gender: string;
  tel: string;
  userimg: string;
  roleId: number;
  positionId: number;
  unitId: number;
  chuId: number;
  role: Role;
  position: Position;
  unit: Unit;
  chu: Chu;
}

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

const EditForm = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the user ID from the query
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null); // Stores the image name for display
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      let decryptedId: string;
      try {
        decryptedId = decryptId(decodeURIComponent(id as string));
      } catch (err) {
        router.replace("/unauthorized");
        return;
      }

      axiosInstance
        .get<User>(`/users/${decryptedId}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          toast.error("Error fetching user data");
        })
        .finally(() => {
          setIsLoading(false); // Stop loading
        });
    }
  }, [id, router]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get(`/roles/srole`);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file); // Set the actual file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("firstname", user.firstname);
      formData.append("lastname", user.lastname);
      formData.append("gender", user.gender);
      formData.append("tel", user.tel || "");
      formData.append("roleId", String(user.roleId));
      formData.append("positionId", String(user.positionId));
      formData.append("unitId", String(user.unitId));
      formData.append("chuId", String(user.chuId));

      if (uploadedImage) {
        formData.append("userimg", uploadedImage);
      }

      await axiosInstance.put(`/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/user/superadmin");
    } catch (error) {
      console.error("Error during form submission:", error); // Log any errors
      toast.error("ອັບ​ເດດ​ບໍ່​ສຳ​ເລັດ");
    } finally {
      setIsLoading(false); // Stop loading
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
                    checked={user?.gender === "Male"}
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
                    checked={user?.gender === "Female"}
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
                ຊື່​ເຂົ້າ​ລະ​ບົບ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={user?.username || ""}
                onChange={handleChange}
                placeholder="ຊື່​ເຂົ້າ​ລະ​ບົບ"
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
                value={user?.firstname || ""}
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
                value={user?.lastname || ""}
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
                ສິດຜູ້ໃຊ້ <span className="text-red">*</span>
              </label>
              <div className="relative">
                <select
                  name="roleId"
                  value={user?.roleId || ""}
                  onChange={handleChange}
                  className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  required
                >
                  <option value="" disabled>
                    ເລືອກສິດຜູ້ໃຊ້
                  </option>
                  {roles
                    .filter((role) => role.id !== 3)
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
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
                ເບີ​ໂທ(20xxxxxxxx) <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="tel"
                value={user?.tel || ""}
                onChange={handleChange}
                placeholder="(20xxxxxxxx)"
                maxLength={10}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
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

            <div className="w-full md:w-1/4 lg:w-1/4">
              {user?.userimg && (
                <Image
                  className="mt-5"
                  src={`${process.env.NEXT_PUBLIC_API_URL}/upload/user/${user.userimg}`}
                  alt={user.userimg}
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>

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
        </div>
      </form>
    </div>
  );
};

export default EditForm;
