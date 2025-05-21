import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Profiles from "@/components/ProfileUser/profileedit";

export const metadata: Metadata = {
  title: "ແກ້​ໄຂ​ຂໍ້​ມູນສ່ວນ​ຕົວ",
  description: "ແກ້​ໄຂ​ຂໍ້​ມູນສ່ວນ​ຕົວ",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ແກ້​ໄຂ​ຂໍ້​ມູນສ່ວນ​ຕົວ" />

      <div className="flex flex-col gap-10">
        <Profiles />
      </div>
    </DefaultLayout>
  );
};

export default Profile;


