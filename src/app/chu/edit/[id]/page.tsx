import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditChus from "@/components/chu/editchu";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂຈຸ​",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const EditChu = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂຈຸ​" />

      <div className="flex flex-col gap-10">
        <EditChus />
      </div>
    </DefaultLayout>
  );
};

export default EditChu;