import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UnitList from "@/components/unit/unitlist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ໜ່ວຍ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const UnitsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ໜ່ວຍ" />

      <div className="flex flex-col gap-10">
        <UnitList />
      </div>
    </DefaultLayout>
  );
};

export default UnitsPage;