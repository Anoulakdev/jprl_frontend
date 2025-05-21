import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddChus from "@/components/chu/addchu";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມຈຸ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AddChu = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມຈຸ" />
      <div className="flex flex-col gap-10">
        <AddChus />
      </div>
    </DefaultLayout>
  );
};

export default AddChu;