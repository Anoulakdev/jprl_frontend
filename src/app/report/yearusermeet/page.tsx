import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import YearUserMeet from "@/components/report/yearusermeet";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "​ການ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມ",
  description: "​ການ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="​ການ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມ" />

      <div className="flex flex-col gap-10">
        <YearUserMeet />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
