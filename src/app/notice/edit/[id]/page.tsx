import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditNotices from "@/components/notice/editnotice";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂແຈ້ງ​ການ​",
  description: "ແກ້​ໄຂແຈ້ງ​ການ​",
};

const EditNotice = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂແຈ້ງ​ການ​" />

      <div className="flex flex-col gap-10">
        <EditNotices />
      </div>
    </DefaultLayout>
  );
};

export default EditNotice;
