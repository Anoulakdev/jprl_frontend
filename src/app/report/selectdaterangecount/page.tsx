import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectDateRangeCount from "@/components/report/selectdaterangecount";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມສະ​ຖິ​ຕິ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
  description: "ສັງ​ລວມສະ​ຖິ​ຕິ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມສະ​ຖິ​ຕິ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ" />

      <div className="flex flex-col gap-10">
        <SelectDateRangeCount />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
