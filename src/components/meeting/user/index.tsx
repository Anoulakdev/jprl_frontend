"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Meetlist from "./meetlist";
import DetailMeetlist from "./detailmeetlist";

const MeetingList: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    if (tabParam === "add" || tabParam === "history") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const tabs = [
    { key: "add", label: "➕ ເພີ່ມປະ​ຊຸມ" },
    { key: "history", label: "🕓 ​ປະ​ຫວັດປະ​ຊຸມ" },
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
        {activeTab === "add" && <Meetlist />}
        {activeTab === "history" && <DetailMeetlist />}
      </div>
    </div>
  );
};

export default MeetingList;
