import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserMeetAll from "@/components/report/usermeetall";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "​ການ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມຂອ​ງ​ພະ​ນັກ​ງານ",
  description: "​ການ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມຂອ​ງ​ພະ​ນັກ​ງານ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="​ການ​ເຂົ້າ​ຮ່ວມປະ​ຊຸມຂອ​ງ​ພະ​ນັກ​ງານ" />

      <div className="flex flex-col gap-10">
        <UserMeetAll />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
