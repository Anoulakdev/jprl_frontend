import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RoleList from "@/components/role/rolelist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສິດຜູ້​ໃຊ້",
  description: "ສິດຜູ້​ໃຊ້",
};

const RolesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສິດຜູ້​ໃຊ້" />

      <div className="flex flex-col gap-10">
        <RoleList />
      </div>
    </DefaultLayout>
  );
};

export default RolesPage;