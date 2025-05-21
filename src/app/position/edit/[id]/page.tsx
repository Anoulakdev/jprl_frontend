import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditPositions from "@/components/position/editposition";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂຕຳ​ແໜ່ງ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const EditPosition = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂຕຳ​ແໜ່ງ" />

      <div className="flex flex-col gap-10">
        <EditPositions />
      </div>
    </DefaultLayout>
  );
};

export default EditPosition;