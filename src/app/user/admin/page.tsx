import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserList from "@/components/user/admin/userlist";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສະ​ມ​າ​ຊິກ",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const UsersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສະ​ມ​າ​ຊິກ" />

      <div className="flex flex-col gap-10">
        <UserList />
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
