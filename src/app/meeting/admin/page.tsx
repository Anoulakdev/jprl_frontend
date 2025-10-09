import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MeetList from "@/components/meeting/admin/meetlist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ປະ​ຊຸມ",
  description: "ປະ​ຊຸມ",
};

const ActsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ປະ​ຊຸມ" />

      <div className="flex flex-col gap-10">
        <MeetList />
      </div>
    </DefaultLayout>
  );
};

export default ActsPage;
