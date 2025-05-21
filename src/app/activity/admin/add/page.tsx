import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddActs from "@/components/activity/admin/addact";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມກິດ​ຈະ​ກຳ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AddAct = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມກິດ​ຈະ​ກຳ" />
      <div className="flex flex-col gap-10">
        <AddActs />
      </div>
    </DefaultLayout>
  );
};

export default AddAct;
