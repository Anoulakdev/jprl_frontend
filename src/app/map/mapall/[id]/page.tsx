import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MapAlls from "@/components/Maps/MapAll";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "ແຜນ​ທີ່",
  description: "ແຜນ​ທີ່",
};

const Map = () => {
  return (
    // <DefaultLayout>
    <MapAlls />
    // </DefaultLayout>
  );
};

export default Map;
