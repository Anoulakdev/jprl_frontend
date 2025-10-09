"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Pending from "./pending";
import Approved from "./approved";
import Reject from "./reject";

const ApprovedList: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (
      tabParam === "pending" ||
      tabParam === "approved" ||
      tabParam === "rejected"
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const tabs = [
    { key: "pending", label: "⏳ ລໍ​ຖ້າ​ອະ​ນຸ​ມັດ" },
    { key: "approved", label: "✅ ​ອະ​ນຸ​ມັດ" },
    { key: "rejected", label: "❌ ​ປະ​ຕິ​ເສດ" },
  ];

  return (
    <div
      className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 
      dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5"
    >
      {/* Tabs */}
      <div className="mb-5 flex border-b border-gray-200 dark:border-dark-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-md px-4 py-2 font-medium transition-colors duration-200 
              ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-3">
        {activeTab === "pending" && <Pending />}
        {activeTab === "approved" && <Approved />}
        {activeTab === "rejected" && <Reject />}
      </div>
    </div>
  );
};

export default ApprovedList;
