"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import { getLocalStorage } from "@/utils/storage";
import {
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChevronDoubleLeftIcon,
  BellIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

type RoleId = 1 | 2 | 3; // Define possible role IDs (e.g., superadmin, admin, user)
type PositionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // Define possible position IDs

interface StoredUser {
  roleId: RoleId;
  positionId: PositionId;
}

const superadminMenuGroups = [
  {
    name: "ເມ​ນູ​ຫຼັກ",
    menuItems: [
      {
        icon: <HomeIcon className="h-6 w-6" />,
        label: "ໜ້າ​ຫຼັກ",
        route: "/dashboard",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສະ​ມາ​ຊິກ",
        route: "/user/superadmin",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສິດ​ຜູ້​ໃຊ້",
        route: "/role",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ຕຳແໜ່ງ",
        route: "/position",
      },
    ],
  },
];

const adminMenuGroups = [
  {
    name: "ເມ​ນູ​ຫຼັກ",
    menuItems: [
      {
        icon: <HomeIcon className="h-6 w-6" />,
        label: "ໜ້າ​ຫຼັກ",
        route: "/dashboard",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສະ​ມາ​ຊິກ",
        route: "/user/admin",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໂຄງ​ຮ່າງ",
        route: "/organize/organize",
      },
      {
        icon: <BellIcon className="h-6 w-6" />,
        label: "ແຈ້ງ​ການ",
        route: "/notice",
      },
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/admin",
      },
      {
        icon: <UserGroupIcon className="h-6 w-6" />,
        label: "ປະ​ຊຸມ",
        route: "/meeting/admin",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
        route: "/approved/meeting",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໜ່ວຍ",
        route: "/unit",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "​ຈຸ",
        route: "/chu",
      },
    ],
  },
  {
    name: "ລາຍ​ງານ",
    menuItems: [
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        children: [
          {
            label: "ສັງ​ລວມຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
            route: "/report/selectactuser",
          },
          {
            label: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
            route: "/report/selectactimg",
          },
          {
            label: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
            route: "/report/selectyearuser",
          },
          {
            label: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
            route: "/report/selectdaterange",
          },
          {
            label: "ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈະ​ກຳ​ຂອງ​ພ​ະ​ນັກ​ງານ",
            route: "/report/useractall",
          },
          {
            label: "ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ",
            route: "/report/userall",
          },
        ],
      },
      {
        icon: <UserGroupIcon className="h-6 w-6" />,
        label: "ປະ​ຊຸມ",
        children: [
          {
            label: "ສັງ​ລວມຄົນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
            route: "/report/selectmeetuser",
          },
          {
            label: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
            route: "/report/selectmeetimg",
          },
          {
            label: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມເປັນ​ປີ",
            route: "/report/selectmeetyearuser",
          },
          {
            label: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ​ຕາມ​ ​ວ/ດ/ປ",
            route: "/report/selectmeetdaterange",
          },
        ],
      },
    ],
  },
];

const userBossMenuGroups = [
  {
    name: "ເມ​ນູ​ຫຼັກ",
    menuItems: [
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໂຄງ​ຮ່າງລວມ",
        route: "/organize/organizeall",
      },
      {
        icon: <BellIcon className="h-6 w-6" />,
        label: "ແຈ້ງ​ການ",
        route: "/notice",
      },
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/user",
      },
      {
        icon: <UserGroupIcon className="h-6 w-6" />,
        label: "ປະ​ຊຸມ",
        route: "/meeting/user",
      },
    ],
  },
  {
    name: "ລາຍ​ງານ",
    menuItems: [
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
        route: "/report/yearuseract",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
        route: "/report/yearusermeet",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ສັງ​ລວມຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
        route: "/report/selectactuser",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
        route: "/report/selectactimg",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-7 w-7" />,
        label: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
        route: "/report/selectyearuser",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
        label: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
        route: "/report/selectdaterange",
      },
    ],
  },
];

const userUnitMenuGroups = [
  {
    name: "ເມ​ນູ​ຫຼັກ",
    menuItems: [
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໂຄງ​ຮ່າງລວມ",
        route: "/organize/organizeall",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໂຄງ​ຮ່າງໜ່ວຍ",
        route: "/organize/organize",
      },
      {
        icon: <BellIcon className="h-6 w-6" />,
        label: "ແຈ້ງ​ການ",
        route: "/notice",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສະ​ມາ​ຊິກ",
        route: "/user/user",
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ອະ​ນຸ​ມັດເຂົ້າ​ຮ່ວມ​ກິດຈະ​ກຳ​",
        route: "/approved/activity",
      },
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/user",
      },
      {
        icon: <UserGroupIcon className="h-6 w-6" />,
        label: "ປະ​ຊຸມ",
        route: "/meeting/user",
      },
    ],
  },
  {
    name: "ລາຍ​ງານ",
    menuItems: [
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
        route: "/report/yearuseract",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
        route: "/report/yearusermeet",
      },
    ],
  },
];

const userMemberMenuGroups = [
  {
    name: "ເມ​ນູ​ຫຼັກ",
    menuItems: [
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໂຄງ​ຮ່າງລວມ",
        route: "/organize/organizeall",
      },
      {
        icon: <BellIcon className="h-6 w-6" />,
        label: "ແຈ້ງ​ການ",
        route: "/notice",
      },
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/user",
      },
      {
        icon: <UserGroupIcon className="h-6 w-6" />,
        label: "ປະ​ຊຸມ",
        route: "/meeting/user",
      },
    ],
  },
  {
    name: "ລາຍ​ງານ",
    menuItems: [
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
        route: "/report/yearuseract",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ປະ​ຊຸມ",
        route: "/report/yearusermeet",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [menuGroups, setMenuGroups] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser: StoredUser | null = getLocalStorage<StoredUser>("user");
    // Update menuGroups based on user role
    if (storedUser?.roleId) {
      switch (storedUser.roleId) {
        case 1:
          setMenuGroups(superadminMenuGroups);
          break;
        case 2:
          setMenuGroups(adminMenuGroups);
          break;
        case 3:
          switch (storedUser.positionId) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              setMenuGroups(userBossMenuGroups);
              break;
            case 6:
            case 7:
              setMenuGroups(userUnitMenuGroups);
              break;
            case 8:
            case 9:
            case 10:
            case 11:
              setMenuGroups(userMemberMenuGroups);
              break;
          }
          break;
        default:
          setMenuGroups([]);
      }
    }
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="">
            <Image
              width={200}
              height={32}
              src={"/images/edl_logo.png"}
              alt="Logo"
              priority
              className="dark:hidden"
            />
            <Image
              width={200}
              height={32}
              src={"/images/edl_logo.png"}
              alt="Logo"
              priority
              className="hidden dark:block"
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem: any, menuIndex: any) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pathname={pathname}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
