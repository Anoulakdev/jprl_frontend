"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ items }: any) => {
  const pathname = usePathname();

  return (
    <ul className="my-2 flex flex-col gap-1.5 pl-9">
      {items.map((child: any, index: number) => (
        <li key={index}>
          <Link
            href={child.route}
            className={`relative flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm font-medium duration-300 ease-in-out ${
              pathname === child.route
                ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            {child.icon && <span className="flex-shrink-0">{child.icon}</span>}
            {child.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
