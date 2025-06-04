import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Organize from "@/components/organize/organizeall";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ໂຄງ​ຮ່າງລວມ",
  description: "ໂຄງ​ຮ່າງລວມ",
};

const OrgamizePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ໂຄງ​ຮ່າງລວມ" />

      <div className="flex flex-col gap-10">
        <Organize />
      </div>
    </DefaultLayout>
  );
};

export default OrgamizePage;