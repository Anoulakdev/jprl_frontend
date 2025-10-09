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
}

interface Activity {
  id: number;
  name: string;
  dateactive: string;
}

const Pending: React.FC = () => {
  const [data, setData] = useState<DetailAct[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [debouncedFilter, setDebouncedFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filterText.toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [filterText]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/detailacts/listapproved?approved=1`,
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproved = async (id: number) => {
    const confirm = window.confirm("ທ່ານ​ຕ້ອງ​ການ​ທີ່​ຈະອະ​ນຸ​ມັດ​ບໍ?");
    if (confirm) {
      try {
        // ส่งคำขอรีเซ็ตรหัสผ่าน
        await axiosInstance.put(`/detailacts/approved/${id}`, {
          approved: 2,
        });

        // ✅ ลบออกจาก list (เพราะอนุมัติแล้ว)
        setData((prev) => prev.filter((item) => item.id !== id));

        toast.success("ອະ​ນຸ​ມັດ​ສຳ​ເລັດ​​ແລ້ວ");
      } catch (error) {
        console.error("Reset password failed:", error);
        toast.error("ອະ​ນຸ​ມັດ​​ບໍ່ສຳ​ເລັດ");
      }
    }
  };

  const handleReject = async (id: number) => {
    const confirm = window.confirm("ທ່ານ​ຕ້ອງ​ການ​ທີ່​ຈະປະ​ຕິ​ເສດ​ບໍ?");
    if (confirm) {
      try {
        // ส่งคำขอรีเซ็ตรหัสผ่าน
        await axiosInstance.put(`/detailacts/approved/${id}`, {
          approved: 3,
        });

        // ✅ ลบออกจาก list (เพราะอนุมัติแล้ว)
        setData((prev) => prev.filter((item) => item.id !== id));

        toast.success("ປະ​ຕິ​ເສດ​ສຳ​ເລັດ​​ແລ້ວ");
      } catch (error) {
        console.error("Reset password failed:", error);
        toast.error("ປະ​ຕິ​ເສດ​​ບໍ່ສຳ​ເລັດ");
      }
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

  // ✅ filter data with useMemo
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
      cell: (row, index) => {
        const rowIndex = (currentPage - 1) * rowsPerPage + index + 1;
        return rowIndex;
      },
      sortable: true,
      width: "5%",
    },
    {
      name: "ຫົວ​ຂໍ້​ກິດ​ຈະ​ກ​ຳ",
      selector: (row) => row.activity?.name,
      sortable: true,
      cell: (row) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.activity?.name}
        </div>
      ),
      width: "28%",
    },
    {
      name: "ລະ​ຫັດ​ພ/ງ",
      selector: (row) => row.userCode,
      sortable: true,
      width: "10%",
    },
    {
      name: "ຊື່",
      selector: (row) =>
        `${row.user?.gender === "Male" ? "ທ່ານ" : row.user?.gender === "Female" ? "ທ່ານນາງ" : ""} ${row.user?.firstname}`,
      sortable: true,
      width: "15%",
      cell: (row) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.user?.gender === "Male"
            ? "ທ່ານ"
            : row.user?.gender === "Female"
              ? "ທ່ານນາງ"
              : ""}{" "}
          {row.user?.firstname} {row.user?.lastname}
        </div>
      ),
    },
    {
      name: "ຈຸ",
      selector: (row) => row.user?.chu?.name,
      sortable: true,
      width: "12%",
    },
    {
      name: "ເບີ​ໂທ",
      selector: (row) => row.user?.tel,
      sortable: true,
      cell: (row) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.user?.tel}
        </div>
      ),
      width: "10%",
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
      name: "ຈັດ​ການ",
      cell: (row) => (
        <>
          <button
            onClick={() => handleApproved(row.id)}
            className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-green-500 px-2 py-2 text-xs font-medium text-green-500 hover:border-green-400 hover:text-green-400"
          >
            ອະ​ນຸ​ມັ​ດ
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-red-500 px-2 py-2 text-xs font-medium text-red-500 hover:border-red-400 hover:text-red-400"
          >
            ປະ​ຕິ​ເສດ
          </button>
        </>
      ),
      sortable: false,
      width: "11%",
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#d9e0e9",
        fontWeight: "bold",
        fontSize: "16px",
        // width: "120px",
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

export default Pending;
