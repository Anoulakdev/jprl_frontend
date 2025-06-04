"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PlusIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getLocalStorage } from "@/utils/storage";

interface Organize {
  id: number;
  organizeimg: string;
  unit: Unit;
}

interface Unit {
  id: number;
  no: number;
  name: string;
}

interface User {
  id: number;
  roleId: number;
  unitId: number;
}

const OrganizeList: React.FC = () => {
  const [data, setData] = useState<Organize | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const fetchData = async (unitId: number | null) => {
    try {
      setLoading(true);
      const url = unitId
        ? `/organizes?unitId=${unitId}`
        : `/organizes?unitId=null`;
      const response = await axiosInstance.get(url);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setData(response.data[0]);
        console.log(response.data[0]);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load organize data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = getLocalStorage<User>("user");
    setUser(storedUser);
    const unit = storedUser?.roleId === 2 ? null : storedUser?.unitId ?? null;
    setUnitId(unit);
    fetchData(unit);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("organizeimg", selectedFile);
      if (unitId !== null) {
        formData.append("unitId", unitId.toString());
      }

      const response = await axiosInstance.post("/organizes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData(response.data);
      toast.success("ເພິ່ມ​ຂໍ້​ມູນ​ສຳ​ເລັດ");
      setShowAddModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchData(unitId);
    } catch (error) {
      console.error("Error adding organize:", error);
      toast.error("Failed to add organize structure");
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedFile || !data?.id) {
      toast.warning("Please select an image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("organizeimg", selectedFile);
      if (unitId !== null) {
        formData.append("unitId", unitId.toString());
      }

      const response = await axiosInstance.put(
        `/organizes/${data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setData(response.data);
      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ");
      router.push("/organize/organize");
      setShowEditModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchData(unitId);
    } catch (error) {
      console.error("Error updating organize:", error);
      toast.error("Failed to update organize structure");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          ໂຄງຮ່າງຄະ​ນະ{" "}
          {user?.roleId === 2
            ? "ຄ​ຊ​ປ​ປ​ລ ຮາກ​ຖານ ຟ​ຟ​ລ"
            : `ໜ່ວຍ${data?.unit?.name || ""}`}
        </h2>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow focus:outline-none
      ${data?.organizeimg ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              onClick={() => setShowAddModal(true)}
              disabled={!!data?.organizeimg}
            >
              <PlusIcon className="h-5 w-5" />
              ເພີ່ມໂຄງຮ່າງ
            </button>

            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow focus:outline-none
      ${!data?.organizeimg ? "cursor-not-allowed bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}`}
              onClick={() => setShowEditModal(true)}
              disabled={!data?.organizeimg}
            >
              <PencilIcon className="h-5 w-5" />
              ແກ້ໄຂໂຄງຮ່າງ
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : data?.organizeimg ? (
          <div className="rounded-xl border border-gray-300 p-4 shadow-md dark:border-gray-700">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/upload/organize/${data.organizeimg}`}
              alt={data.organizeimg}
              className="rounded-lg object-contain"
            />
          </div>
        ) : (
          <p className="my-10 text-center text-xl text-dark dark:text-gray-300">
            ຍັງ​ບໍ່​ທັນ​ມີ​ຮູບ
          </p>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-lg bg-blue-100 p-6 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
            <button
              onClick={() => {
                setShowAddModal(false);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              ເພີ່ມໂຄງຮ່າງ
            </h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                ເລືອກຮູບພາບ
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-gray-600 dark:focus:border-blue-500"
                />
              </div>
            </div>

            {previewUrl && (
              <div className="mb-4 rounded-lg border border-gray-200 p-2 shadow-sm dark:border-gray-700">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  ຕົວຢ່າງຮູບພາບ
                </label>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-auto max-h-60 w-full rounded-lg object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={handleAddSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
              >
                ບັນທຶກ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-lg bg-blue-100 p-6 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              ແກ້ໄຂໂຄງຮ່າງ
            </h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                ເລືອກຮູບພາບໃໝ່
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-gray-600 dark:focus:border-blue-500"
              />
            </div>

            {previewUrl ? (
              <div className="mb-4 rounded-lg border border-gray-200 p-2 shadow-sm dark:border-gray-700">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  ຕົວຢ່າງຮູບພາບໃໝ່
                </label>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-auto max-h-60 w-full rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="mb-4 rounded-lg border border-gray-200 p-2 shadow-sm dark:border-gray-700">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  ຮູບພາບປະຈຸບັນ
                </label>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/upload/organize/${data?.organizeimg}`}
                  alt="Current"
                  className="h-auto max-h-60 w-full rounded-lg object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={handleEditSubmit}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-700"
              >
                ອັບເດດ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizeList;
