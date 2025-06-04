import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NoticeList from "@/components/notice/noticelist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແຈ້ງ​ການ",
  description: "ແຈ້ງ​ການ",
};

const NoticePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແຈ້ງ​ການ" />

      <div className="flex flex-col gap-10">
        <NoticeList />
      </div>
    </DefaultLayout>
  );
};

export default NoticePage;
