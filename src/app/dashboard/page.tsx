import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Dashboard from "@/components/Dashboard/Dashboard1";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ໜ້າ​ຫຼັກ",
  description: "ໜ້າ​ຫຼັກ",
};

const DashboardPage = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="ສະ​ມ​າ​ຊິກ" /> */}
      <div className="flex flex-col gap-10">
        <Dashboard />
      </div>
    </DefaultLayout>
  );
};

export default DashboardPage;
