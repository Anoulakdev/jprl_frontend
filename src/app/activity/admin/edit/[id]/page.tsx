import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditActs from "@/components/activity/admin/editact";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂກິດ​ຈະ​ກຳ​",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const EditAct = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂກິດ​ຈະ​ກຳ​" />

      <div className="flex flex-col gap-10">
        <EditActs />
      </div>
    </DefaultLayout>
  );
};

export default EditAct;