"use client";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import DataTable, { TableColumn } from "react-data-table-component";

interface Chu {
  id: number;
  name: string;
}

interface User {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  actived: string;
  gender: string;
  tel: string;
  userimg: string;
  chu: Chu;
}

interface Activity {
  id: number;
  name: string;
  dateactive: string;
}

interface DetailAct {
  id: number;
  activityId: number;
  userCode: string;
  content: string;
  lat: number;
  lng: number;
  actimg: string;
  createdAt: string;
  updatedAt: string;
  activity: Activity;
  user: User;
  userAction: User;
}

const Approved: React.FC = () => {
  const [data, setData] = useState<DetailAct[]>([]);
  const [selectedAct, setSelectedAct] = useState<number | null>(null);
  const [acts, setActs] = useState<Activity[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [debouncedFilter, setDebouncedFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // ✅ โหลดรายชื่อกิจกรรม
  useEffect(() => {
    const fetchActs = async () => {
      try {
        const response = await axiosInstance.get(`/activitys/sactivity`);
        setActs(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນກິດຈະກຳ");
      }
    };
    fetchActs();
  }, []);

  // ✅ Debounce ค่าค้นหา
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filterText.toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [filterText]);

  // ✅ โหลดข้อมูลเมื่อมีการเปลี่ยน selectedAct
  const fetchData = async (activityId: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/detailacts/listapproved?activityId=${activityId}&approved=2`,
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນ");
    } finally {
      setLoading(false);
    }
  };

  const handleActivityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setSelectedAct(value ? parseInt(value) : null);
  };

  const handleSearch = () => {
    if (selectedAct !== null) {
      fetchData(selectedAct);
    } else {
      toast.error("ກະ​ລຸ​ນາ​ເລືອກ​ກິດ​ຈະ​ກຳ");
    }
  };

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setRowsPerPage(perPage);
  };

  // ✅ กรองข้อมูล
  const filteredData = useMemo(() => {
    if (!debouncedFilter) return data;
    return data.filter((act) => {
      const code = act.userCode?.toLowerCase() || "";
      const firstname = act.user?.firstname?.toLowerCase() || "";
      const tel = act.user?.tel?.toLowerCase() || "";
      return (
        code.includes(debouncedFilter) ||
        firstname.includes(debouncedFilter) ||
        tel.includes(debouncedFilter)
      );
    });
  }, [data, debouncedFilter]);

  const columns: TableColumn<DetailAct>[] = [
    {
      name: "#",
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "ລະ​ຫັດ​ພ/ງ",
      selector: (row) => row.userCode,
      sortable: true,
      width: "160px",
    },
    {
      name: "ຊື່",
      cell: (row) => (
        <div>
          {row.user?.gender === "Male"
            ? "ທ່ານ"
            : row.user?.gender === "Female"
              ? "ທ່ານນາງ"
              : ""}{" "}
          {row.user?.firstname} {row.user?.lastname}
        </div>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "ຈຸ",
      selector: (row) => row.user?.chu?.name,
      sortable: true,
      width: "220px",
    },
    {
      name: "ເບີ​ໂທ",
      selector: (row) => row.user?.tel,
      sortable: true,
    },
    {
      name: "ຮູບ​ພາບ",
      cell: (row) =>
        row.actimg ? (
          <Image
            className="h-16 w-16 rounded-lg border object-cover shadow-md"
            src={`${process.env.NEXT_PUBLIC_API_URL}/upload/activity/${row.actimg}`}
            alt={row.actimg}
            width={500}
            height={500}
          />
        ) : (
          <Image
            className="h-16 w-16 rounded-lg border object-cover shadow-md"
            src={`/nophoto.jpg`}
            alt="nophoto"
            width={500}
            height={500}
          />
        ),
      sortable: false,
    },
    {
      name: "ຜູ້​ປະ​ຕິ​ບັດ",
      cell: (row) => (
        <div>
          {row.userAction?.gender === "Male"
            ? "ທ່ານ"
            : row.userAction?.gender === "Female"
              ? "ທ່ານນາງ"
              : ""}{" "}
          {row.userAction?.firstname} {row.userAction?.lastname}
        </div>
      ),
      sortable: true,
      width: "250px",
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#d9e0e9",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        width: "150px",
        paddingTop: "5px",
        paddingBottom: "5px",
      },
    },
  };

  return (
    <div className=" dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:gap-0">
        <div className="relative w-full md:w-2/3 lg:w-2/3">
          <select
            id="selectedAct"
            value={selectedAct ?? ""}
            onChange={handleActivityChange}
            className="w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 pr-10 text-black outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="" disabled>
              ເລືອກກິດ​ຈະ​ກຳ
            </option>
            {acts.map((act) => (
              <option
                className="text-xs sm:text-xs md:text-sm"
                key={act.id}
                value={act.id}
              >
                {act.name}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06-.02L10 10.648l3.71-3.44a.75.75 0 111.02 1.1l-4.19 3.89a.75.75 0 01-1.04 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="self-start">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 md:ml-3 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {loading ? "ກຳລັງຄົ້ນຫາ..." : "ຄົ້ນຫາ"}
          </button>
        </div>
      </div>
      <div className="mb-4 flex justify-between">
        <div></div>

        <input
          type="text"
          value={filterText}
          onChange={handleFilter}
          placeholder="ຄົ້ນ​ຫາ"
          className="rounded-md border border-gray-300 p-2 text-sm text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <DataTable<DetailAct>
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
            pagination
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
            paginationDefaultPage={currentPage}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            highlightOnHover
            pointerOnHover
            className="w-full table-auto"
            noDataComponent=""
            paginationComponentOptions={{
              rowsPerPageText: "ສະ​ແດງ​ຕ​ໍ່​ໜ້າ",
              rangeSeparatorText: "ຈາກ",
              selectAllRowsItem: true,
              selectAllRowsItemText: "ທັງໝົດ",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Approved;
