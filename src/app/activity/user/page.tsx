import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ActList from "@/components/activity/user";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ກິດ​ຈະ​ກຳ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const ActsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ກິດ​ຈະ​ກຳ" />

      <div className="flex flex-col gap-10">
        <ActList />
      </div>
    </DefaultLayout>
  );
};

export default ActsPage;