import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddNotices from "@/components/notice/addnotice";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມແຈ້ງ​ການ",
  description: "ເພີ່ມແຈ້ງ​ການ",
};

const AddNotice = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມແຈ້ງ​ການ" />
      <div className="flex flex-col gap-10">
        <AddNotices />
      </div>
    </DefaultLayout>
  );
};

export default AddNotice;
