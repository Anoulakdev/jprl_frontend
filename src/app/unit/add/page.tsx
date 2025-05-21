import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddUnits from "@/components/unit/addunit";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມໜ່ວຍ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AddUnit = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມໜ່ວຍ" />
      <div className="flex flex-col gap-10">
        <AddUnits />
      </div>
    </DefaultLayout>
  );
};

export default AddUnit;