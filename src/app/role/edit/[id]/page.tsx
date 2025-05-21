import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditRoles from "@/components/role/editrole";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂສິດຜູ້​ໃຊ​້​",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const EditRole = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂສິດຜູ້​ໃຊ​້​" />

      <div className="flex flex-col gap-10">
        <EditRoles />
      </div>
    </DefaultLayout>
  );
};

export default EditRole;