import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { removeLocalStorage } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getLocalStorage } from "@/utils/storage";
import {
  EyeIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = getLocalStorage("user");
    setUser(storedUser);
  }, []);

  // Logout handler
  const handleLogout = () => {
    removeLocalStorage("token");
    removeLocalStorage("user");
    setDropdownOpen(false);
    toast.success("ອອກ​ຈາກ​ລະ​ບົບ");
    router.push("/");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          {user?.userimg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/upload/user/${user.userimg}`}
              alt="User"
              className="rounded-full"
              style={{
                width: "100px", // Ensure the width and height are equal for a perfect circle
                height: "50px", // Same here for height
                objectFit: "cover", // Ensures the image fills the circle area without distortion
              }}
            />
          ) : (
            <Image
              src={`/nophoto.jpg`}
              alt="nophoto"
              width={60}
              height={60}
              style={{
                width: "60px", // Ensure the width and height are equal for a perfect circle
                height: "50px", // Same here for height
                objectFit: "cover", // Ensures the image fills the circle area without distortion
              }}
            />
          )}
        </span>

        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6">
          <span className="hidden lg:block">
            {user?.gender === "Male"
              ? "ທ່ານ"
              : user?.gender === "Female"
                ? "ທ່ານນາງ"
                : ""}{" "}
            {user?.firstname} {user?.lastname}
          </span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen && "rotate-180"}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
              fill=""
            />
          </svg>
        </span>
      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            {user?.roleId === 3 && (
              <>
                <li>
                  <Link
                    href={`/profile/view/${user.code}`}
                    className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
                  >
                    <EyeIcon className="h-6 w-6" />
                    ເບິ່ງ​ຂໍ້​ມູນສ່ວນ​ຕົວ
                  </Link>
                </li>

                <li>
                  <Link
                    // href={`/profile/edit/${user.id}`}
                    href="/profile/edit"
                    className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
                  >
                    <Cog6ToothIcon className="h-6 w-6" />
                    ແກ້​ໄຂ​ຂໍ້​ມູນສ່ວນ​ຕົວ
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                href="/changepassword"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <Cog6ToothIcon className="h-6 w-6" />
                ປ່ຽນ​ລະ​ຫັດ​ຜ່ານ
              </Link>
            </li>
          </ul>
          <div className="p-2.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
              ອອກ​ລະ​ບົບ
            </button>
          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
