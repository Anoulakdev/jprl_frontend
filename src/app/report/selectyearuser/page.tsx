import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectYearUser from "@/components/report/selectyearuser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
  description: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ" />

      <div className="flex flex-col gap-10">
        <SelectYearUser />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;