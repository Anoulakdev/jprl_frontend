import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditMeets from "@/components/meeting/user/editdetailmeet";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂປະ​ຊຸມ",
  description: "ແກ້​ໄຂປະ​ຊຸມ",
};

const EditMeet = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂປະ​ຊຸມ" />

      <div className="flex flex-col gap-10">
        <EditMeets />
      </div>
    </DefaultLayout>
  );
};

export default EditMeet;
