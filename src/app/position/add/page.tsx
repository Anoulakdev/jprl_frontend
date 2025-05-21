import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddPositions from "@/components/position/addposition";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມຕຳ​ແໜ່ງ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AddPosition = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມຕຳ​ແໜ່ງ" />
      <div className="flex flex-col gap-10">
        <AddPositions />
      </div>
    </DefaultLayout>
  );
};

export default AddPosition;