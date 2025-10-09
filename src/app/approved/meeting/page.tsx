import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Approved from "@/components/approved/meeting";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​",
  description: "ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​",
};

const ApprovedPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​" />

      <div className="flex flex-col gap-10">
        <Approved />
      </div>
    </DefaultLayout>
  );
};

export default ApprovedPage;
