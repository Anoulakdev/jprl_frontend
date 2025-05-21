import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import YearUserAct from "@/components/report/yearuseract";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳ",
  description: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="​ການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳ" />

      <div className="flex flex-col gap-10">
        <YearUserAct />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;