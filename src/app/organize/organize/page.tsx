import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Organize from "@/components/organize/organize";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ໂຄງ​ຮ່າງ",
  description: "ໂຄງ​ຮ່າງ",
};

const OrgamizePage = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="ໂຄງ​ຮ່າງ" /> */}

      <div className="flex flex-col gap-10">
        <Organize />
      </div>
    </DefaultLayout>
  );
};

export default OrgamizePage;
