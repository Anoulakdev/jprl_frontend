import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddRoles from "@/components/role/addrole";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມສິດ​ຜູ້​ໃຊ້",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AddUser = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ເພີ່ມສິດ​ຜູ້​ໃຊ້" />
      <div className="flex flex-col gap-10">
        <AddRoles />
      </div>
    </DefaultLayout>
  );
};

export default AddUser;