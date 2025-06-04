/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

interface DetailAct {
  id: number;
  userCode: "33656";
  content: string;
  lat: string;
  lng: string;
  actimg: string;
}

const EditForm = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the user ID from the query
  const [act, setAct] = useState<DetailAct | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null); // Stores the image name for display
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Fetch user data when the component mounts
      axiosInstance
        .get<DetailAct>(`/detailacts/${id}`)
        .then((response) => {
          setAct(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          toast.error("Error fetching user data");
        })
        .finally(() => {
          setIsLoading(false); // Stop loading
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (act) {
      setAct({ ...act, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!act) return;

    try {
      const updatedAct = {
        ...act,
        actimg: uploadedImage || act.actimg, // Set the uploaded image name
      };

      await axiosInstance.put(`/detailacts/${act.id}`, updatedAct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/activity/user/detail");
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
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຈຸ <span className="text-red">*</span>
              </label>
              <textarea
                name="content"
                value={act?.content || ""}
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
              />
              {/* 👇 แสดง preview ถ้ามี */}
              {previewImage && (
                <div className="mt-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-64 rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              {act?.actimg && (
                <img
                  className="mt-5"
                  src={`${process.env.NEXT_PUBLIC_API_URL}/upload/activity/${act.actimg}`}
                  alt={act.actimg}
                  width={200}
                  height={200}
                />
              )}
            </div>
          </div> */}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white transition hover:bg-opacity-90 md:w-1/2 xl:w-1/2 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isLoading}
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
