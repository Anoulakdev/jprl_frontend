import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChuList from "@/components/chu/chulist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ຈຸ",
  description: "ຈຸ",
};

const ChuPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ຈຸ" />

      <div className="flex flex-col gap-10">
        <ChuList />
      </div>
    </DefaultLayout>
  );
};

export default ChuPage;