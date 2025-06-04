"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  ChevronDoubleLeftIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
  allowedRoles?: number[];
  allowedPositions?: number[];
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    name: "ເມ​ນູ​ຫຼັກ",
    menuItems: [
      {
        icon: <HomeIcon className="h-6 w-6" />,
        label: "ໜ້າ​ຫຼັກ",
        route: "/dashboard",
        allowedRoles: [1, 2],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສະ​ມາ​ຊິກ",
        route: "/user/superadmin",
        allowedRoles: [1],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສິດ​ຜູ້​ໃຊ້",
        route: "/role",
        allowedRoles: [1],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ຕຳແໜ່ງ",
        route: "/position",
        allowedRoles: [1],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສະ​ມາ​ຊິກ",
        route: "/user/admin",
        allowedRoles: [2],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໂຄງ​ຮ່າງ",
        route: "",
        allowedRoles: [2, 3],
      },
      {
        icon: <BellIcon className="h-6 w-6" />,
        label: "ແຈ້ງ​ການ",
        route: "/notice",
        allowedRoles: [2, 3],
      },
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/admin",
        allowedRoles: [2],
      },
      {
        icon: <CalendarDaysIcon className="h-6 w-6" />,
        label: "ກິດ​ຈ​ະ​ກຳ",
        route: "/activity/user",
        allowedRoles: [3],
        allowedPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ໜ່ວຍ",
        route: "/unit",
        allowedRoles: [2],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "​ຈຸ",
        route: "/chu",
        allowedRoles: [2],
      },
      {
        icon: <UserIcon className="h-6 w-6" />,
        label: "ສະ​ມາ​ຊິກ",
        route: "/user/user",
        allowedRoles: [3],
        allowedPositions: [6, 7],
      },
      {
        icon: <ClockIcon className="h-6 w-6" />,
        label: "ປະ​ຫວັດກິດ​ຈ​ະ​ກຳ",
        route: "/activity/user/detail",
        allowedRoles: [3],
        allowedPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
        allowedRoles: [2, 3],
        allowedPositions: [1, 2, 3, 4, 5],
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ຮູບ​ພາບຄົນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ",
        route: "/report/selectactimg",
        allowedRoles: [2, 3],
        allowedPositions: [1, 2, 3, 4, 5],
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ສັງ​ລວມຈຳ​ນວນ​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳເປັນ​ປີ",
        route: "/report/selectyearuser",
        allowedRoles: [2, 3],
        allowedPositions: [1, 2, 3, 4, 5],
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ສັງ​ລວມຈຳ​ນວນ​​ເຂົ້າ​ຮ່ວມ​ກິດ​ຈະ​ກຳ​ຕາມ​ ​ວ/ດ/ປ",
        route: "/report/selectdaterange",
        allowedRoles: [2, 3],
        allowedPositions: [1, 2, 3, 4, 5],
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈະ​ກຳ​ຂອງ​ພ​ະ​ນັກ​ງານ",
        route: "/report/useractall",
        allowedRoles: [2],
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "ສັງ​ລວມ​ຈຳ​ນວນ​ສະ​ມາ​ຊິກ",
        route: "/report/userall",
        allowedRoles: [2],
      },
      {
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        label: "​ການ​ເຂົ້າ​ຮ່ວມ​ກິ​ດ​ຈ​ະ​ກຳ",
        route: "/report/yearuseract",
        allowedRoles: [3],
        allowedPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

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
          <Link href="/">
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
                  {group.menuItems.map((menuItem: MenuItem, menuIndex: any) => (
                    <ProtectedRoute
                      key={`protect-${menuIndex}`}
                      allowedRoles={menuItem.allowedRoles}
                      allowedPositions={menuItem.allowedPositions}
                    >
                      <SidebarItem
                        // key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    </ProtectedRoute>
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
