"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getLocalStorage } from "@/utils/storage";
import {
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  ChevronDoubleLeftIcon,
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
  // {
  //   name: "ລາຍ​ງານ",
  //   menuItems: [
  //     {
  //       icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
  //       label: "Charts",
  //       route: "#",
  //       children: [{ label: "Basic Chart", route: "/charts/basic-chart" }],
  //     },
  //   ],
  // },
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
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/admin",
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
        icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
        label: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
        route: "/report/selectyearuser",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-9 w-9" />,
        label: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
        route: "/report/selectdaterange",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-7 w-7" />,
        label: "ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈະ​ກຳ​ຂອງ​ພ​ະ​ນັກ​ງານ",
        route: "/report/useractall",
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ",
        route: "/report/userall",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
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
          const userMenuGroups = [
            {
              name: "ເມ​ນູ​ຫຼັກ",
              menuItems: [
                // Add menu items conditionally based on positionId
                ...(storedUser.positionId === 1 ||
                storedUser.positionId === 2 ||
                storedUser.positionId === 3 ||
                storedUser.positionId === 4 ||
                storedUser.positionId === 5
                  ? [
                      {
                        icon: <CalendarDaysIcon className="h-6 w-6" />,
                        label: "ກິດ​ຈ​ະ​ກຳ",
                        route: "/activity/user",
                      },
                      {
                        icon: <ClockIcon className="h-6 w-6" />,
                        label: "ປະ​ຫວັດກິດ​ຈ​ະ​ກຳ",
                        route: "/activity/user/detail",
                      },
                    ]
                  : []),
                ...(storedUser.positionId === 6 || storedUser.positionId === 7
                  ? [
                      {
                        icon: <UserIcon className="h-6 w-6" />,
                        label: "ສະ​ມາ​ຊິກ",
                        route: "/user/user",
                      },
                      {
                        icon: <CalendarDaysIcon className="h-6 w-6" />,
                        label: "ກິດ​ຈ​ະ​ກຳ",
                        route: "/activity/user",
                      },
                      {
                        icon: <ClockIcon className="h-6 w-6" />,
                        label: "ປະ​ຫວັດກິດ​ຈ​ະ​ກຳ",
                        route: "/activity/user/detail",
                      },
                    ]
                  : []),
                ...(storedUser.positionId === 8 ||
                storedUser.positionId === 9 ||
                storedUser.positionId === 10 ||
                storedUser.positionId === 11
                  ? [
                      {
                        icon: <CalendarDaysIcon className="h-6 w-6" />,
                        label: "ກິດ​ຈ​ະ​ກຳ",
                        route: "/activity/user",
                      },
                      {
                        icon: <ClockIcon className="h-6 w-6" />,
                        label: "ປະ​ຫວັດກິດ​ຈ​ະ​ກຳ",
                        route: "/activity/user/detail",
                      },
                    ]
                  : []),
              ],
            },
            {
              name: "ລາຍ​ງານ",
              menuItems: [
                // Add menu items conditionally based on positionId
                ...(storedUser.positionId === 1 ||
                storedUser.positionId === 2 ||
                storedUser.positionId === 3 ||
                storedUser.positionId === 4 ||
                storedUser.positionId === 5
                  ? [
                      {
                        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
                        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
                        route: "/report/yearuseract",
                      },
                      {
                        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
                        label: "ສັງ​ລວມຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
                        route: "/report/selectactuser",
                      },
                      {
                        icon: (
                          <ClipboardDocumentListIcon className="h-6 w-6" />
                        ),
                        label: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
                        route: "/report/selectactimg",
                      },
                      {
                        icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
                        label: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
                        route: "/report/selectyearuser",
                      },
                      {
                        icon: <ClipboardDocumentListIcon className="h-9 w-9" />,
                        label:
                          "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
                        route: "/report/selectdaterange",
                      },
                    ]
                  : []),
                ...(storedUser.positionId === 6 || storedUser.positionId === 7
                  ? [
                      {
                        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
                        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
                        route: "/report/yearuseract",
                      },
                    ]
                  : []),
                ...(storedUser.positionId === 8 ||
                storedUser.positionId === 9 ||
                storedUser.positionId === 10 ||
                storedUser.positionId === 11
                  ? [
                      {
                        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
                        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
                        route: "/report/yearuseract",
                      },
                    ]
                  : []),
              ],
            },
          ];
          setMenuGroups(userMenuGroups);
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
                      pageName={pageName}
                      setPageName={setPageName}
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
