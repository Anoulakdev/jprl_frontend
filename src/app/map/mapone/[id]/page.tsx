import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Maps from "@/components/Maps";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແຜນ​ທີ່",
  description: "ແຜນ​ທີ່",
};

const Map = () => {
  return (
    // <DefaultLayout>
    <Maps />
    // </DefaultLayout>
  );
};

export default Map;
