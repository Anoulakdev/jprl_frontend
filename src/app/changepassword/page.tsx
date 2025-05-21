import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChangePass from "@/components/ProfileUser/changepassword";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ປ່ຽນ​ລະ​ຫັດ​ຜ່ານ",
  description: "ປ່ຽນ​ລະ​ຫັດ​ຜ່ານ",
};

const ChangepassPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ປ່ຽນ​ລະ​ຫັດ​ຜ່ານ" />

      <div className="flex flex-col gap-10">
        <ChangePass />
      </div>
    </DefaultLayout>
  );
};

export default ChangepassPage;