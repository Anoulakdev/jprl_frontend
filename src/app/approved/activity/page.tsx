import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Approved from "@/components/approved/activity";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ກິດຈະ​ກຳ​",
  description: "ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ກິດຈະ​ກຳ​",
};

const ChuPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ກິດຈະ​ກຳ​" />

      <div className="flex flex-col gap-10">
        <Approved />
      </div>
    </DefaultLayout>
  );
};

export default ChuPage;
