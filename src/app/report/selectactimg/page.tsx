import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectActImg from "@/components/report/selectactimg";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
  description: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ" />

      <div className="flex flex-col gap-10">
        <SelectActImg />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;