import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectMeetDateRange from "@/components/report/selectmeetdaterange";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​ຕາມ​ ​ວ/ດ/ປ",
  description: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​ຕາມ​ ​ວ/ດ/ປ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​ຕາມ​ ​ວ/ດ/ປ" />

      <div className="flex flex-col gap-10">
        <SelectMeetDateRange />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
