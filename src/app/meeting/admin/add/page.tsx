import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddMeets from "@/components/meeting/admin/addmeet";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມປະ​ຊຸມ",
  description: "ເພີ່ມປະ​ຊຸມ",
};

const AddAct = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມປະ​ຊຸມ" />
      <div className="flex flex-col gap-10">
        <AddMeets />
      </div>
    </DefaultLayout>
  );
};

export default AddAct;
