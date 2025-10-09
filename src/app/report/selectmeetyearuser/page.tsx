import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectMeetYearUser from "@/components/report/selectmeetyearuser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມເປັນ​ປີ",
  description: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມເປັນ​ປີ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມເປັນ​ປີ" />

      <div className="flex flex-col gap-10">
        <SelectMeetYearUser />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
