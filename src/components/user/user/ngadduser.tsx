"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import flatpickr from "flatpickr";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getLocalStorage } from "@/utils/storage";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";

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
  code: string;
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
    datebirth: "",
    tribe: "",
    religion: "",
    villagebirth: "",
    districtbirth: "",
    provincebirth: "",
    villagenow: "",
    districtnow: "",
    provincenow: "",
    edusaman: "",
    edulevel: "",
    edusubject: "",
    edutheory: "",
    latcomein: "",
    latposition: "",
    latdepartment: "",
    latdivision: "",
    latunit: "",
    phaksupport: "",
    phakrule: "",
    phaksamhong: "",
    phaksomboun: "",
    phakposition: "",
    phakcard: "",
    phakissuedcard: "",
    phakbook: "",
    kammabancomein: "",
    kammabanposition: "",
    youthcomein: "",
    womencomein: "",
    womenposition: "",
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [positionss, setPositionss] = useState<Position[]>([]);
  const [chuss, setChuss] = useState<Chu[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
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
        const response = await axiosInstance.get(`/positions/sposition`);
        setPositionss(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Failed to load positions");
      }
    };

    fetchPositions();
  }, []);

  useEffect(() => {
    if (!formData.unitId) {
      setChuss([]); // เคลียร์ chus ถ้ายังไม่เลือก unit
      return;
    }

    const fetchChus = async () => {
      try {
        const response = await axiosInstance.get(
          `/chus/schu?unitId=${formData.unitId}`,
        );
        setChuss(response.data);
      } catch (error) {
        console.error("Error fetching chus:", error);
        toast.error("Failed to load chus");
      }
    };

    fetchChus();
  }, [formData.unitId]);

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
    const pickers = document.querySelectorAll(".form-datepicker");

    pickers.forEach((picker) => {
      const fieldName = picker.getAttribute("data-field");

      flatpickr(picker, {
        mode: "single",
        static: true,
        monthSelectorType: "static",
        dateFormat: "d/m/Y",
        disableMobile: true,
        prevArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (_, dateStr) => {
          const key = fieldName as string;

          setFormData((prev) => ({
            ...prev,
            [key]: dateStr,
          }));
        },
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      const fdatebirth = moment(formData.datebirth, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const flatcomein = moment(formData.latcomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphaksupport = moment(formData.phaksupport, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphakrule = moment(formData.phakrule, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphaksamhong = moment(formData.phaksamhong, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphaksomboun = moment(formData.phaksomboun, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphakissuedcard = moment(
        formData.phakissuedcard,
        "DD/MM/YYYY",
      ).format("YYYY-MM-DD");
      const fkammabancomein = moment(
        formData.kammabancomein,
        "DD/MM/YYYY",
      ).format("YYYY-MM-DD");
      const fyouthcomein = moment(formData.youthcomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fwomencomein = moment(formData.womencomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );

      formDataToSend.append("code", formData.code);
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("lastname", formData.lastname);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("tel", formData.tel);
      formDataToSend.append("roleId", String(formData.roleId));
      formDataToSend.append("positionId", String(formData.positionId));
      formDataToSend.append("unitId", String(formData.unitId));
      formDataToSend.append("chuId", String(formData.chuId));
      formDataToSend.append("datebirth", fdatebirth);
      formDataToSend.append("tribe", formData.tribe);
      formDataToSend.append("religion", formData.religion);
      formDataToSend.append("villagebirth", formData.villagebirth);
      formDataToSend.append("districtbirth", formData.districtbirth);
      formDataToSend.append("provincebirth", formData.provincebirth);
      formDataToSend.append("villagenow", formData.villagenow);
      formDataToSend.append("districtnow", formData.districtnow);
      formDataToSend.append("provincenow", formData.provincenow);
      formDataToSend.append("edusaman", formData.edusaman);
      formDataToSend.append("edulevel", formData.edulevel);
      formDataToSend.append("edusubject", formData.edusubject);
      formDataToSend.append("edutheory", formData.edutheory);
      formDataToSend.append("latcomein", flatcomein);
      formDataToSend.append("latposition", formData.latposition);
      formDataToSend.append("latdepartment", formData.latdepartment);
      formDataToSend.append("latdivision", formData.latdivision);
      formDataToSend.append("latunit", formData.latunit);
      formDataToSend.append("phaksupport", fphaksupport);
      formDataToSend.append("phakrule", fphakrule);
      formDataToSend.append("phaksamhong", fphaksamhong);
      formDataToSend.append("phaksomboun", fphaksomboun);
      formDataToSend.append("phakposition", formData.phakposition);
      formDataToSend.append("phakcard", formData.phakcard);
      formDataToSend.append("phakissuedcard", fphakissuedcard);
      formDataToSend.append("phakbook", formData.phakbook);
      formDataToSend.append("kammabancomein", fkammabancomein);
      formDataToSend.append("kammabanposition", formData.kammabanposition);
      formDataToSend.append("youthcomein", fyouthcomein);
      formDataToSend.append("womencomein", fwomencomein);
      formDataToSend.append("womenposition", formData.womenposition);

      if (uploadedImage) {
        formDataToSend.append("userimg", uploadedImage);
      }

      // Submit the form data
      await axiosInstance.post(`/users/ngadd`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
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
          <h2 className="pb-1 text-2xl font-bold text-gray-800">
            * ຂໍ້​ມູ​ນ​ພື້ນ​ຖານ
          </h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/5 lg:w-1/5">
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

            <div className="w-full md:w-1/5 lg:w-1/5">
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

            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຊື່ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleChange}
                placeholder="ຊື່"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ນາມ​ສະ​ກຸນ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleChange}
                placeholder="ນາມ​ສະ​ກຸນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ເບີ​ໂທ(20xxxxxxxx) <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="tel"
                value={formData.tel || ""}
                onChange={handleChange}
                placeholder="(20xxxxxxxx)"
                maxLength={10}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/5 lg:w-1/5">
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

            <div className="w-full md:w-1/5 lg:w-1/5">
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
                      {chu.code}-{chu.name}
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

            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                ວັນ​ເດືອນ​ປີ​ເກີດ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="datebirth"
                  value={formData.datebirth}
                  onChange={handleChange}
                  className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="datebirth"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຊົນ​ເຜົ່າ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="tribe"
                value={formData.tribe || ""}
                onChange={handleChange}
                placeholder="ຊົນ​ເຜົ່າ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ສາດ​ສະ​ໜາ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion || ""}
                onChange={handleChange}
                placeholder="ສາດ​ສະ​ໜາ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/3 lg:w-1/3">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
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

          <h2 className="pb-1 pt-2 text-2xl font-bold text-gray-800">
            * ທີ່​ຢູ່​ເກີດ
          </h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ບ້ານ​ເກີດ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="villagebirth"
                value={formData.villagebirth || ""}
                onChange={handleChange}
                placeholder="ບ້ານ​ເກີດ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ເມືອງ​ເກີດ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="districtbirth"
                value={formData.districtbirth || ""}
                onChange={handleChange}
                placeholder="ເມືອງ​ເກີດ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ແຂວງ​ເກີດ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="provincebirth"
                value={formData.provincebirth || ""}
                onChange={handleChange}
                placeholder="ແຂວງ​ເກີດ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <h2 className="pb-1 pt-2 text-2xl font-bold text-gray-800">
            * ທີ່​ຢູ່​ປະ​ຈຸ​ບັນ
          </h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ບ້ານ​ປະ​ຈຸ​ບັນ​ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="villagenow"
                value={formData.villagenow || ""}
                onChange={handleChange}
                placeholder="ບ້ານ​ປະ​ຈຸ​ບັນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ເມືອງ​ປະ​ຈຸ​ບັນ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="districtnow"
                value={formData.districtnow || ""}
                onChange={handleChange}
                placeholder="ເມືອງ​ປະ​ຈຸ​ບັນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ແຂວງ​ປະ​ຈຸ​ບັນ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="provincenow"
                value={formData.provincenow || ""}
                onChange={handleChange}
                placeholder="ແຂວງ​ປະ​ຈຸ​ບັນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <h2 className="pb-1 pt-2 text-2xl font-bold text-gray-800">
            * ລະ​ດັບ​ການ​ສຶກ​ສາ
          </h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ສາ​ມັນ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="edusaman"
                value={formData.edusaman || ""}
                onChange={handleChange}
                placeholder="ສາ​ມັນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຊັ້ນ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="edulevel"
                value={formData.edulevel || ""}
                onChange={handleChange}
                placeholder="ຊັ້ນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ສາ​ຂາ​ວິ​ຊາ​ສະ​ເພາະ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="edusubject"
                value={formData.edusubject || ""}
                onChange={handleChange}
                placeholder="ສາ​ຂາ​ວິ​ສາ​ສະ​ເພາະ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ທິດ​ສະ​ດີ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="edutheory"
                value={formData.edutheory || ""}
                onChange={handleChange}
                placeholder="ທິດ​ສະ​ດີ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <h2 className="pb-1 pt-2 text-2xl font-bold text-gray-800">* ພັກ</h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ຮຽນ​ສະ​ໜັບ​ສະ​ໜູນ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="phaksupport"
                  value={formData.phaksupport || ""}
                  onChange={handleChange}
                  className="form-datepicker phaksupport w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="phaksupport"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ຮຽນ​ກົດ​ລະ​ບຽບ​ພັກ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="phakrule"
                  value={formData.phakrule || ""}
                  onChange={handleChange}
                  className="form-datepicker phakrule w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="phakrule"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ເຂົ້າ​ສຳ​ຮອງ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="phaksamhong"
                  value={formData.phaksamhong || ""}
                  onChange={handleChange}
                  className="form-datepicker phaksamhong w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="phaksamhong"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ເຂົ້າ​ສົມ​ບູນ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="phaksomboun"
                  value={formData.phaksomboun || ""}
                  onChange={handleChange}
                  className="form-datepicker phaksomboun w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="phaksomboun"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ລະ​ຫັດ​ບັດ​ສະ​ມາ​ຊິກ​ພັກ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="phakcard"
                value={formData.phakcard || ""}
                onChange={handleChange}
                placeholder="ລະ​ຫັດ​ບັດ​ສະ​ມາ​ຊິກ​ພັກ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ອອກ​ບັດ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="phakissuedcard"
                  value={formData.phakissuedcard || ""}
                  onChange={handleChange}
                  className="form-datepicker phakissuedcard w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="phakissuedcard"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຕຳ​ແໜ່ງ​ພັກ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="phakposition"
                value={formData.phakposition || ""}
                onChange={handleChange}
                placeholder="ຕຳ​ແໜ່ງ​ພັກ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ປີ​ຂຽນ​ປຶ​້ມ​ປະ​ຫວັດ​ພັກ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="phakbook"
                value={formData.phakbook || ""}
                onChange={handleChange}
                placeholder="ປີ​ຂຽນ​ປຶ​້ມ​ປະ​ຫວັດ​ພັກ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <h2 className="pb-1 pt-2 text-2xl font-bold text-gray-800">
            * ເຂົ້າ​ການ​ປະ​ຕິ​ວັດ
          </h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ເຂົ້າສັງ​ກັດ​ລັດ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="latcomein"
                  value={formData.latcomein || ""}
                  onChange={handleChange}
                  className="form-datepicker latcomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="latcomein"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຕຳ​ແໜ່ງ​ລັດ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="latposition"
                value={formData.latposition || ""}
                onChange={handleChange}
                placeholder="ຕຳ​ແໜ່ງ​ລັດ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຝ່າຍ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="latdepartment"
                value={formData.latdepartment || ""}
                onChange={handleChange}
                placeholder="ຝ່າຍ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ພະ​ແນກ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="latdivision"
                value={formData.latdivision || ""}
                onChange={handleChange}
                placeholder="ພະ​ແນກ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ໜ່ວຍ​ງານ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="latunit"
                value={formData.latunit || ""}
                onChange={handleChange}
                placeholder="ໜ່ວຍ​ງານ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <h2 className="pb-1 pt-2 text-2xl font-bold text-gray-800">
            * ອົງ​ການ​ຈັດ​ຕັ້ງ​ມະ​ຫາ​ຊົນ
          </h2>
          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ເຂົ້າ​ກຳ​ມະ​ບານ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="kammabancomein"
                  value={formData.kammabancomein || ""}
                  onChange={handleChange}
                  className="form-datepicker kammabancomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="kammabancomein"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຕຳ​ແໜ່ງ​ກຳ​ມະ​ບານ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="kammabanposition"
                value={formData.kammabanposition || ""}
                onChange={handleChange}
                placeholder="ຕຳ​ແໜ່ງ​ກຳ​ມະ​ບານ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ເຂົ້າ​ແມ່​ຍິງ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="womencomein"
                  value={formData.womencomein || ""}
                  onChange={handleChange}
                  className="form-datepicker womencomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="womencomein"
                  readOnly
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຕຳ​ແໜ່ງ​ແມ່​ຍິງ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="womenposition"
                value={formData.womenposition || ""}
                onChange={handleChange}
                placeholder="ຕຳ​ແໜ່ງ​ແມ່​ຍິງ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວ/ດ/ປ ເຂົ້າ​ຊາວ​ໜຸ່ມ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="youthcomein"
                  value={formData.youthcomein || ""}
                  onChange={handleChange}
                  className="form-datepicker youthcomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-field="youthcomein"
                  readOnly
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
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white transition hover:bg-opacity-90 md:w-1/2 xl:w-1/2 ${
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
