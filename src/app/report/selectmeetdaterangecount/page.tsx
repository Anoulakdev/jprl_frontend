import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectMeetDateRangeCount from "@/components/report/selectmeetdaterangecount";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ສັງ​ລວມສະ​ຖິ​ຕິ​​ເຂົ້າ​ຮ່ວມປະ​ຊຸມຕາມ​ ​ວ/ດ/ປ",
  description: "ສັງ​ລວມສະ​ຖິ​ຕິ​​ເຂົ້າ​ຮ່ວມປະ​ຊຸມຕາມ​ ​ວ/ດ/ປ",
};

const ReportsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ສັງ​ລວມສະ​ຖິ​ຕິ​​ເຂົ້າ​ຮ່ວມປະ​ຊຸມຕາມ​ ​ວ/ດ/ປ" />

      <div className="flex flex-col gap-10">
        <SelectMeetDateRangeCount />
      </div>
    </DefaultLayout>
  );
};

export default ReportsPage;
