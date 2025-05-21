import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProfileView from "@/components/ProfileUser/profileview";

export const metadata: Metadata = {
  title: "ເບິ່ງ​ຂໍ້​ມູນສ່ວນ​ຕົວ",
  description: "ເບິ່ງ​ຂໍ້​ມູນສ່ວນ​ຕົວ",
};

const Profile = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="ເບິ່ງ​ຂໍ້​ມູນສ່ວນ​ຕົວ" /> */}

      <div className="flex flex-col gap-10">
        <ProfileView />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
