import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserAll from "@/components/report/userall";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ",
  description: "ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ" />

      <div className="flex flex-col gap-10">
        <UserAll />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;