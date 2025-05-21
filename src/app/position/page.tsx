import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PositionList from "@/components/position/positionlist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ຕຳ​ແໜ່ງ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const PositionPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ຕຳ​ແໜ່ງ" />

      <div className="flex flex-col gap-10">
        <PositionList />
      </div>
    </DefaultLayout>
  );
};

export default PositionPage;