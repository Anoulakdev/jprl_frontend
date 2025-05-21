import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditUnits from "@/components/unit/editunit";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂໜ່ວຍ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const EditUnit = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂໜ່ວຍ" />

      <div className="flex flex-col gap-10">
        <EditUnits />
      </div>
    </DefaultLayout>
  );
};

export default EditUnit;