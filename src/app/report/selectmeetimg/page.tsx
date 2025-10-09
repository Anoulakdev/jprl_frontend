import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectMeetImg from "@/components/report/selectmeetimg";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມ",
  description: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມ" />

      <div className="flex flex-col gap-10">
        <SelectMeetImg />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
