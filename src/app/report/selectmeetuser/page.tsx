import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectMeetUser from "@/components/report/selectmeetuser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "​ສັງ​ລ​ວມ​ຄົນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
  description: "​ສັງ​ລ​ວມ​ຄົນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="​ສັງ​ລ​ວມ​ຄົນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ" />

      <div className="flex flex-col gap-10">
        <SelectMeetUser />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
