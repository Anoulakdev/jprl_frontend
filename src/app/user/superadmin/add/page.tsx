import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddUsers from "@/components/user/superadmin/adduser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມສະ​ມາ​ຊິກ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AddUser = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມສະ​ມາ​ຊິກ" />
      <div className="flex flex-col gap-10">
        <AddUsers />
      </div>
    </DefaultLayout>
  );
};

export default AddUser;
