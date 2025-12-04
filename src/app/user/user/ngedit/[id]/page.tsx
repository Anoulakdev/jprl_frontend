import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditUsers from "@/components/user/user/ngedituser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂສະ​ມາ​ຊິກ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const EditUser = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂສະ​ມາ​ຊິກ" />
      <div className="flex flex-col gap-10">
        <EditUsers />
      </div>
    </DefaultLayout>
  );
};

export default EditUser;
