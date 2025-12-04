"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { decryptId } from "@/lib/cryptoId";

interface User {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  gender: string;
  tel: string;
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
  latoffice: string;
  latunit: string;
  kammabancomein: string;
  kammabanposition: string;
  youthcomein: string;
  womencomein: string;
  womenposition: string;
  arts: string[];
  sports: string[];
  fbusiness: string[];
  ideas: string[];
  userimg: string;
  position: Position;
  unit: Unit;
  chu: Chu;
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

const ProfileView = () => {
  const router = useRouter();
  const { code } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return; // ป้องกัน error ถ้า code เป็น undefined

      try {
        setIsLoading(true);

        let decryptedId: string;
        try {
          decryptedId = decryptId(decodeURIComponent(code as string));
        } catch (err) {
          router.replace("/unauthorized");
          return;
        }

        const response = await axiosInstance.get(
          `/users/profileview/${decryptedId}`,
        );
        const u = response.data;

        setUser({
          id: u.id,
          code: u.code || "",
          firstname: u.firstname || "",
          lastname: u.lastname || "",
          gender: u.gender || "",
          tel: u.tel || "",
          datebirth: u.datebirth ? u.datebirth : "",
          tribe: u.tribe || "",
          religion: u.religion || "",
          villagebirth: u.villagebirth || "",
          districtbirth: u.districtbirth || "",
          provincebirth: u.provincebirth || "",
          villagenow: u.villagenow || "",
          districtnow: u.districtnow || "",
          provincenow: u.provincenow || "",
          edusaman: u.edusaman || "",
          edulevel: u.edulevel || "",
          edusubject: u.edusubject || "",
          edutheory: u.edutheory || "",
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
          phakposition: u.phakposition || "",
          phakcard: u.phakcard || "",
          phakissuedcard: u.phakissuedcard
            ? moment(u.phakissuedcard).format("DD/MM/YYYY")
            : "",
          phakbook: u.phakbook || "",
          latcomein: u.latcomein
            ? moment(u.latcomein).format("DD/MM/YYYY")
            : "",
          latposition: u.latposition || "",
          latdepartment: u.latdepartment || "",
          latdivision: u.latdivision || "",
          latoffice: u.latoffice || "",
          latunit: u.latunit || "",
          kammabancomein: u.kammabancomein
            ? moment(u.kammabancomein).format("DD/MM/YYYY")
            : "",
          kammabanposition: u.kammabanposition || "",
          youthcomein: u.youthcomein
            ? moment(u.youthcomein).format("DD/MM/YYYY")
            : "",
          womencomein: u.womencomein
            ? moment(u.womencomein).format("DD/MM/YYYY")
            : "",
          womenposition: u.womenposition || "",
          arts: u.arts || [],
          sports: u.sports || [],
          fbusiness: u.fbusiness || [],
          ideas: u.ideas || [],
          userimg: u.userimg,
          position: u.position,
          unit: u.unit,
          chu: u.chu,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [code, router]);

  const calculateAge = (datebirth: string) => {
    const birthDate = new Date(datebirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // ตรวจสอบว่าเดือนหรือวันเลยวันเกิดหรือยัง
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // ยังไม่ถึงวันเกิดปีนี้
    }

    return age;
  };

  return (
    <>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-45">
          <Image
            src="/images/cover/cover-01.png"
            alt="profile cover"
            className="h-[130px] w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center sm:h-[145px] md:h-[185px]"
            width={1920}
            height={260}
            priority
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4 print:hidden">
            <button
              onClick={() => window.print()} // เปิดหน้าปริ้น
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <span>
                <PrinterIcon className="h-4 w-4" />
              </span>
              <span>Print</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-[160px] w-[160px] rounded-full bg-white/20 p-1 backdrop-blur sm:h-[176px] sm:w-[176px]">
            <div className="relative h-full w-full drop-shadow-2">
              {user?.userimg ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/upload/user/${user?.userimg}`}
                  width={160}
                  height={160}
                  className="h-full w-full rounded-full object-cover"
                  alt="profile"
                />
              ) : (
                <Image
                  src={`/nophoto.jpg`}
                  width={160}
                  height={160}
                  className="h-full w-full rounded-full object-cover"
                  alt="profile"
                />
              )}
            </div>
          </div>

          <div className="mt-2">
            <h4 className="mb-5 text-heading-6 font-bold text-dark dark:text-white">
              {user?.gender
                ? user?.gender === "Male"
                  ? "ທ່ານ"
                  : user?.gender === "Female"
                    ? "ທ່ານນາງ"
                    : ""
                : ""}{" "}
              {user?.firstname} {user?.lastname}
            </h4>

            <div className="mx-auto flex max-w-[1200px] flex-col gap-6 pl-2.5 text-left sm:flex-row md:flex-row">
              {/* ส่วนซ้าย */}
              <div className="w-full sm:w-1/2 md:w-1/2">
                <h5 className="text-lg font-semibold text-black dark:text-white">
                  * ຂໍ້​ມູ​ນ​ພື້ນ​ຖານ
                </h5>
                <p className="text-black dark:text-white">
                  ລະ​ຫັດ ພ/ງ: {user?.code}
                </p>
                <p className=" text-black dark:text-white">
                  ຊື່​ ແລະ ນາມ​ສະ​ກຸນ:{" "}
                  {user?.gender
                    ? user?.gender === "Male"
                      ? "ທ່ານ"
                      : user?.gender === "Female"
                        ? "ທ່ານນາງ"
                        : ""
                    : ""}{" "}
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-black dark:text-white">
                  ວັນ​ເດືອນ​ປີ​ເກີດ:{" "}
                  {user?.datebirth
                    ? moment(user?.datebirth).format("DD/MM/YYYY")
                    : ""}
                </p>
                <p className="text-black dark:text-white">
                  ອາ​ຍຸ:{" "}
                  {user?.datebirth
                    ? calculateAge(user.datebirth) + " ປີ"
                    : "N/A"}
                </p>
                <p className="text-black dark:text-white">
                  ເບີ​ໂທ: {user?.tel}
                </p>
                <p className="text-black dark:text-white">
                  ຊົນ​ເຜົ່າ: {user?.tribe}
                </p>
                <p className="text-black dark:text-white">
                  ​ສາ​ດ​ສະ​ໜາ: {user?.religion}
                </p>
                <p className="text-black dark:text-white">
                  ​ບ່ອນ​ເກີ​ດ: ບ້ານ{user?.villagebirth}
                  {","} ເມືອງ{user?.districtbirth}
                  {","} ແຂວງ{user?.provincebirth}
                </p>
                <p className="text-black dark:text-white">
                  ​ບ່ອນ​ຢູ່​ປະ​ຈຸ​ບັນ: ບ້ານ{user?.villagenow}
                  {","} ເມືອງ{user?.districtnow}
                  {","} ແຂວງ{user?.provincenow}
                </p>

                <h5 className="mt-4 text-lg font-semibold text-black dark:text-white">
                  * ລະ​ດັ​ບ​ການ​ສຶກ​ສາ
                </h5>

                <p className=" text-black dark:text-white">
                  ສາ​ມັນ: {user?.edusaman}
                </p>
                <p className="text-black dark:text-white">
                  ຊັ້ນ: {user?.edulevel}
                </p>
                <p className="text-black dark:text-white">
                  ​ສາ​ຂາ​ວິ​ສາ​ສະ​ເພາະ: {user?.edusubject}
                </p>
                <p className="text-black dark:text-white">
                  ​ທິດ​ສະ​ດີ: {user?.edutheory}
                </p>

                <h5 className="mt-4 text-lg font-semibold text-black dark:text-white">
                  * ພັກ
                </h5>

                <p className=" text-black dark:text-white">
                  ວ/ດ/ປ ຮຽນ​ສະ​ໜັບ​ສະ​ໜູນ: {user?.phaksupport}
                </p>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ຮຽນ​ກົດ​ລະ​ບຽບ​ພັກ: {user?.phakrule}
                </p>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ເຂົ້າ​ສຳ​ຮອງ: {user?.phaksamhong}
                </p>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ເຂົ້າ​ສົມ​ບູນ: {user?.phaksomboun}
                </p>
                <p className="text-black dark:text-white">
                  ຕຳ​ແໜ່ງ​ພັກ: {user?.phakposition}
                </p>
                <p className="text-black dark:text-white">
                  ລະ​ຫັດ​ບັດ​ສະ​ມາ​ຊິກ​ພັກ: {user?.phakcard}
                </p>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ອອກ​ບັດ: {user?.phakissuedcard}
                </p>
                <p className="text-black dark:text-white">
                  ປີ​ຂຽນ​ປຶ​້ມ​ປະ​ຫວັດ​ພັກ: {user?.phakbook}
                </p>
              </div>

              {/* ส่วนขวา */}
              <div className="w-full sm:w-1/2 md:w-1/2">
                <h5 className="text-lg font-semibold text-black dark:text-white">
                  * ເຂົ້າ​ການ​ປະ​ຕິ​ວັດ
                </h5>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ເຂົ້າສັງ​ກັດ​ລັດ: {user?.latcomein}
                </p>
                <p className="text-black dark:text-white">
                  ຕຳ​ແໜ່ງ​ລັດ: {user?.latposition}
                </p>
                <p className="text-black dark:text-white">
                  ຝ່າຍ: {user?.latdepartment}
                </p>
                <p className="text-black dark:text-white">
                  ພະ​ແນກ/ສາ​ຂາ: {user?.latdivision}
                </p>
                <p className="text-black dark:text-white">
                  ​ຫ້ອງ​ການ: {user?.latoffice}
                </p>
                <p className="text-black dark:text-white">
                  ​ໜ່ວຍ​ງານ: {user?.latunit}
                </p>

                <h5 className="mt-4 text-lg font-semibold text-black dark:text-white">
                  * ອົງ​ການ​ຈັດ​ຕັ້ງ​ມະ​ຫາ​ຊົນ
                </h5>

                <p className=" text-black dark:text-white">
                  ວ/ດ/ປ ເຂົ້າ​ກຳ​ມະ​ບານ: {user?.kammabancomein}
                </p>
                <p className="text-black dark:text-white">
                  ຕຳ​ແໜ່ງ​ກຳ​ມະ​ບານ: {user?.kammabanposition}
                </p>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ເຂົ້າ​ແມ່​ຍິງ: {user?.womencomein}
                </p>
                <p className="text-black dark:text-white">
                  ຕຳ​ແໜ່ງ​ແມ່​ຍິງ: {user?.womenposition}
                </p>
                <p className="text-black dark:text-white">
                  ວ/ດ/ປ ເຂົ້າ​ຊາວ​ໜຸ່ມ: {user?.youthcomein}
                </p>
                <p className="text-black dark:text-white">
                  ຕຳ​ແໜ່ງ​ຊາວ​ໜຸ່ມ: {user?.position?.name}
                </p>
                <p className="text-black dark:text-white">
                  ໜ່ວຍ​: ໜ່ວຍ{user?.unit?.no}
                </p>
                <p className="text-black dark:text-white">
                  ຈຸ​: {user?.chu?.name}
                </p>

                <h5 className="mt-4 text-lg font-semibold text-black dark:text-white">
                  * ກິດ​ຈ​ະ​ກຳເສີມ
                </h5>

                <p className=" text-black dark:text-white">
                  ປະ​ເພດ​ສິນ​ລະ​ປະ:{" "}
                  {user?.arts?.length ? user.arts.join(", ") : ""}
                </p>
                <p className="text-black dark:text-white">
                  ປະ​ເພດ​ກິ​ລາ:{" "}
                  {user?.sports?.length ? user.sports.join(", ") : ""}
                </p>
                <p className="text-black dark:text-white">
                  ປະ​ເພດ​ທຸ​ລະ​ກິດ​ຄອບ​ຄົວ:{" "}
                  {user?.fbusiness?.length ? user.fbusiness.join(", ") : ""}
                </p>
                <p className="text-black dark:text-white">
                  ປະ​ເພດ​ແນວຄວາມຄິດນະວັດຕະກຳ:{" "}
                  {user?.ideas?.length ? user.ideas.join(", ") : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileView;
