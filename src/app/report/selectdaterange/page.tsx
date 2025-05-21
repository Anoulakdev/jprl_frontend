import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectDateRange from "@/components/report/selectdaterange";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
  description: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ" />

      <div className="flex flex-col gap-10">
        <SelectDateRange />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;