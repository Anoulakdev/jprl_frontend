"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-red-100 via-red-200 to-red-100 px-6">
      <div className="max-w-md rounded-lg bg-white p-16 text-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-6 h-20 w-20 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 3h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>

        <h2 className="mx-12 mb-10 text-2xl font-semibold text-gray-800">
          ທ່ານ​ບໍ່​ມີ​ສິດ​ເຂົ້າ​ເຖິງ​ໜ້າ​ນີ້
        </h2>

        <Link
          href="/"
          className="inline-block rounded-lg bg-red-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-red-700"
        >
          ກັບ​ໜ້າ​ຫຼັກ
        </Link>
      </div>
    </div>
  );
}
