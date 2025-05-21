import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectActUser from "@/components/report/selectactuser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "​ສັງ​ລ​ວມ​ຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳ",
  description: "​ສັງ​ລ​ວມ​ຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="​ສັງ​ລ​ວມ​ຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳ" />

      <div className="flex flex-col gap-10">
        <SelectActUser />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;