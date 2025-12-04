"use client";
import React, { useCallback, useEffect, useState } from "react";
import flatpickr from "flatpickr";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { decryptId } from "@/lib/cryptoId";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";

interface User {
  id: number;
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
  datebirth: string;
  tribe: string;
  religion: string;
  villagebirth: string;
  districtbirth: string;
  provincebirth: string;
  villagenow: string;
  districtnow: string;
  provincenow: string;
  edusaman: string;
  edulevel: string;
  edusubject: string;
  edutheory: string;
  phaksupport: string;
  phakrule: string;
  phaksamhong: string;
  phaksomboun: string;
  phakposition: string;
  phakcard: string;
  phakissuedcard: string;
  phakbook: string;
  latcomein: string;
  latposition: string;
  latdepartment: string;
  latdivision: string;
  latunit: string;
  kammabancomein: string;
  kammabanposition: string;
  youthcomein: string;
  womencomein: string;
  womenposition: string;
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
  code: string;
}

const EditForm = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the user ID from the query
  const [user, setUser] = useState<User | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null); // Stores the image name for display
  const [positionss, setPositionss] = useState<Position[]>([]);
  const [chuss, setChuss] = useState<Chu[]>([]);
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
          const u = response.data;
          setUser({
            ...u,
            datebirth: u.datebirth
              ? moment(u.datebirth).format("DD/MM/YYYY")
              : "",
            phaksupport: u.phaksupport
              ? moment(u.phaksupport).format("DD/MM/YYYY")
              : "",
            phakrule: u.phakrule ? moment(u.phakrule).format("DD/MM/YYYY") : "",
            phaksamhong: u.phaksamhong
              ? moment(u.phaksamhong).format("DD/MM/YYYY")
              : "",
            phaksomboun: u.phaksomboun
              ? moment(u.phaksomboun).format("DD/MM/YYYY")
              : "",
            phakissuedcard: u.phakissuedcard
              ? moment(u.phakissuedcard).format("DD/MM/YYYY")
              : "",
            latcomein: u.latcomein
              ? moment(u.latcomein).format("DD/MM/YYYY")
              : "",
            kammabancomein: u.kammabancomein
              ? moment(u.kammabancomein).format("DD/MM/YYYY")
              : "",
            youthcomein: u.youthcomein
              ? moment(u.youthcomein).format("DD/MM/YYYY")
              : "",
            womencomein: u.womencomein
              ? moment(u.womencomein).format("DD/MM/YYYY")
              : "",
          });
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
    if (!user?.unitId) {
      setChuss([]);
      return;
    }
    const fetchChus = async () => {
      try {
        const response = await axiosInstance.get(
          `/chus/schu?unitId=${user.unitId}`,
        );
        setChuss(response.data);
      } catch (error) {
        console.error("Error fetching chus:", error);
        toast.error("Failed to load chus");
      }
    };
    fetchChus();
  }, [user?.unitId]);

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

  const initializeFlatpickr = useCallback(
    (selector: string, field: keyof User) => {
      flatpickr(selector, {
        mode: "single",
        static: true,
        dateFormat: "d/m/Y",
        disableMobile: true,
        prevArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        defaultDate: user?.[field] ? String(user[field]) : undefined,
        onChange: (selectedDates, dateStr) => {
          setUser((prevData) =>
            prevData ? { ...prevData, [field]: dateStr } : null,
          );
        },
      });
    },
    [user], // Dependency ของ useCallback
  );

  useEffect(() => {
    if (!user) return;

    // Initialize flatpickr for each field
    initializeFlatpickr(".form-datepicker.datebirth", "datebirth");
    initializeFlatpickr(".form-datepicker.phaksupport", "phaksupport");
    initializeFlatpickr(".form-datepicker.phakrule", "phakrule");
    initializeFlatpickr(".form-datepicker.phaksamhong", "phaksamhong");
    initializeFlatpickr(".form-datepicker.phaksomboun", "phaksomboun");
    initializeFlatpickr(".form-datepicker.phakissuedcard", "phakissuedcard");
    initializeFlatpickr(".form-datepicker.latcomein", "latcomein");
    initializeFlatpickr(".form-datepicker.kammabancomein", "kammabancomein");
    initializeFlatpickr(".form-datepicker.youthcomein", "youthcomein");
    initializeFlatpickr(".form-datepicker.womencomein", "womencomein");
  }, [user, initializeFlatpickr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsLoading(true);
      const formData = new FormData();

      const fdatebirth = moment(user.datebirth, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphaksupport = moment(user.phaksupport, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphakrule = moment(user.phakrule, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphaksamhong = moment(user.phaksamhong, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphaksomboun = moment(user.phaksomboun, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fphakissuedcard = moment(user.phakissuedcard, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const flatcomein = moment(user.latcomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fkammabancomein = moment(user.kammabancomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fyouthcomein = moment(user.youthcomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      const fwomencomein = moment(user.womencomein, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );

      formData.append("firstname", user.firstname);
      formData.append("lastname", user.lastname);
      formData.append("gender", user.gender);
      formData.append("tel", user.tel || "");
      formData.append("roleId", String(user.roleId));
      formData.append("positionId", String(user.positionId));
      formData.append("unitId", String(user.unitId));
      formData.append("chuId", String(user.chuId));
      formData.append("datebirth", fdatebirth || "");
      formData.append("tribe", user.tribe || "");
      formData.append("religion", user.religion || "");
      formData.append("villagebirth", user.villagebirth || "");
      formData.append("districtbirth", user.districtbirth || "");
      formData.append("provincebirth", user.provincebirth || "");
      formData.append("villagenow", user.villagenow || "");
      formData.append("districtnow", user.districtnow || "");
      formData.append("provincenow", user.provincenow || "");
      formData.append("edusaman", user.edusaman || "");
      formData.append("edulevel", user.edulevel || "");
      formData.append("edusubject", user.edusubject || "");
      formData.append("edutheory", user.edutheory || "");
      formData.append("phaksupport", fphaksupport || "");
      formData.append("phakrule", fphakrule || "");
      formData.append("phaksamhong", fphaksamhong || "");
      formData.append("phaksomboun", fphaksomboun || "");
      formData.append("phakposition", user.phakposition || "");
      formData.append("phakcard", user.phakcard || "");
      formData.append("phakissuedcard", fphakissuedcard || "");
      formData.append("phakbook", user.phakbook || "");
      formData.append("latcomein", flatcomein || "");
      formData.append("latposition", user.latposition || "");
      formData.append("latdepartment", user.latdepartment || "");
      formData.append("latdivision", user.latdivision || "");
      formData.append("latunit", user.latunit || "");
      formData.append("kammabancomein", fkammabancomein || "");
      formData.append("kammabanposition", user.kammabanposition || "");
      formData.append("youthcomein", fyouthcomein || "");
      formData.append("womencomein", fwomencomein || "");
      formData.append("womenposition", user.womenposition || "");

      if (uploadedImage) {
        formData.append("userimg", uploadedImage);
      }

      await axiosInstance.put(`/users/ng/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      toast.success("ອັບ​ເດດ​ສຳ​ເລັດ​ແລ​້ວ");
      router.push("/user/user");
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

            <div className="w-full md:w-1/5 lg:w-1/5">
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

            <div className="w-full md:w-1/5 lg:w-1/5">
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

            <div className="w-full md:w-1/5 lg:w-1/5">
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
            <div className="w-full md:w-1/5 lg:w-1/5">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຕຳ​ແໜ່ງ <span className="text-red">*</span>
              </label>
              <div className="relative">
                <select
                  name="positionId"
                  value={user?.positionId || ""}
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
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 md:flex-row lg:flex-row">
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຈຸ <span className="text-red">*</span>
              </label>
              <div className="relative">
                <select
                  name="chuId"
                  value={user?.chuId || ""}
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

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ວັນ​ເດືອນ​ປີ​ເກີດ <span className="text-red"></span>
              </label>
              <div className="relative">
                <input
                  name="datebirth"
                  value={user?.datebirth || ""}
                  onChange={handleChange}
                  className="form-datepicker datebirth w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ຊົນ​ເຜົ່າ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="tribe"
                value={user?.tribe || ""}
                onChange={handleChange}
                placeholder="ຊົນ​ເຜົ່າ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ສາດ​ສະ​ໜາ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="religion"
                value={user?.religion || ""}
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
                value={user?.villagebirth || ""}
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
                value={user?.districtbirth || ""}
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
                value={user?.provincebirth || ""}
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
                value={user?.villagenow || ""}
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
                value={user?.districtnow || ""}
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
                value={user?.provincenow || ""}
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
                value={user?.edusaman || ""}
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
                value={user?.edulevel || ""}
                onChange={handleChange}
                placeholder="ຊັ້ນ"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4">
              <label className="text-body-md mb-3 block font-medium text-dark dark:text-white">
                ສາ​ຂາ​ວິ​ສາ​ສະ​ເພາະ <span className="text-red"></span>
              </label>
              <input
                type="text"
                name="edusubject"
                value={user?.edusubject || ""}
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
                value={user?.edutheory || ""}
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
                  value={user?.phaksupport || ""}
                  onChange={handleChange}
                  className="form-datepicker phaksupport w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                  value={user?.phakrule || ""}
                  onChange={handleChange}
                  className="form-datepicker phakrule w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                  value={user?.phaksamhong || ""}
                  onChange={handleChange}
                  className="form-datepicker phaksamhong w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                  value={user?.phaksomboun || ""}
                  onChange={handleChange}
                  className="form-datepicker phaksomboun w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                value={user?.phakcard || ""}
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
                  value={user?.phakissuedcard || ""}
                  onChange={handleChange}
                  className="form-datepicker phakissuedcard w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                value={user?.phakposition || ""}
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
                value={user?.phakbook || ""}
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
                  value={user?.latcomein || ""}
                  onChange={handleChange}
                  className="form-datepicker latcomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                value={user?.latposition || ""}
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
                value={user?.latdepartment || ""}
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
                value={user?.latdivision || ""}
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
                value={user?.latunit || ""}
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
                  value={user?.kammabancomein || ""}
                  onChange={handleChange}
                  className="form-datepicker kammabancomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                value={user?.kammabanposition || ""}
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
                  value={user?.womencomein || ""}
                  onChange={handleChange}
                  className="form-datepicker womencomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
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
                value={user?.womenposition || ""}
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
                  value={user?.youthcomein || ""}
                  onChange={handleChange}
                  className="form-datepicker youthcomein w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                  placeholder="dd/mm/yyyy"
                  data-class="flatpickr-right"
                />

                <div className="pointer-events-none absolute inset-0 left-auto right-5 items-center text-black lg:flex">
                  <ArrowDownCircleIcon className="mt-3 h-6 w-6 md:mt-3 lg:mt-1" />
                </div>
              </div>
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
