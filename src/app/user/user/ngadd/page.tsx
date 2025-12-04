import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddUsers from "@/components/user/user/ngadduser";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ເພີ່ມສະ​ມາ​ຊິກ",
  description: "ເພີ່ມສະ​ມາ​ຊິກ",
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
