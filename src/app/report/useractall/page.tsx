import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserActAll from "@/components/report/useractall";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳຂອ​ງ​ພະ​ນັກ​ງານ",
  description: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳຂອ​ງ​ພະ​ນັກ​ງານ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="​ການ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈ​ະ​ກ​ຳຂອ​ງ​ພະ​ນັກ​ງານ" />

      <div className="flex flex-col gap-10">
        <UserActAll />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;