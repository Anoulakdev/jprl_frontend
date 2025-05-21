"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import moment from "moment";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface DetailAct {
  id: number;
  content: string;
  actimg: string;
  createdAt: string;
  activity: Activity;
}

interface Activity {
  id: number;
  name: string;
  dateactive: string;
}

const ActList: React.FC = () => {
  const [data, setData] = useState<DetailAct[]>([]);
  const [filteredData, setFilteredData] = useState<DetailAct[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [detailactToDelete, setDetailActToDelete] = useState<DetailAct | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/detailacts`);
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/activity/user/detail/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    const detailact = data.find((detailact) => detailact.id === id);
    if (detailact) {
      setDetailActToDelete(detailact);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (detailactToDelete) {
      try {
        await axiosInstance.delete(`/detailacts/${detailactToDelete.id}`);
        const deletedData = data.filter(
          (detailact) => detailact.id !== detailactToDelete.id,
        );
        setData(deletedData);
        setFilteredData(deletedData);
        toast.success("ລົ​ບ​ຂໍ້ມູນ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        toast.error("ລົ​ບ​ຂໍ້ມູນ​ບໍ່ສຳ​ເລັດ");
      } finally {
        setIsDeleteModalOpen(false);
        setDetailActToDelete(null);
      }
    }
  };

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    // Filter data based on the input value
    const filtered = data.filter(
      (act) =>
        act.content.toLowerCase().includes(value) ||
        new Date(act.createdAt).toLocaleDateString("en-GB").includes(value),
    );
    setFilteredData(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setRowsPerPage(perPage);
  };

  const columns = [
    {
      name: "#",
      cell: (row: DetailAct, index: number) => {
        const rowIndex = (currentPage - 1) * rowsPerPage + index + 1;
        return rowIndex;
      },
      width: "8%",
      sortable: true,
    },
    {
      name: "ຫົວ​ຂໍ້​ກິດ​ຈະ​ກຳ",
      selector: (row: DetailAct) => row.activity.name,
      sortable: true,
      width: "30%",
      cell: (row: DetailAct) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.activity.name}
        </div>
      ),
    },
    {
      name: "ເນື້ອ​ໃນ​ການ​ມາ​ກິດ​ຈະ​ກຳ",
      selector: (row: DetailAct) => row.content,
      sortable: true,
      width: "30%",
      cell: (row: DetailAct) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.content}
        </div>
      ),
    },
    {
      name: "ຮູບ​ພາບ",
      cell: (row: DetailAct) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-16 w-24 rounded-lg border object-cover shadow-md"
          src={`${process.env.NEXT_PUBLIC_API_URL}/upload/activity/${row.actimg}`}
          alt={row.actimg}
        />
      ),
      sortable: false,
    },
    {
      name: "ເວ​ລາ​ບັນ​ທຶ​ກ", // "Recorded Time"
      selector: (row: DetailAct) =>
        moment(row.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      sortable: true,
      width: "12%",
      cell: (row: DetailAct) => (
        <div className="whitespace-normal break-words">
          {moment(row.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </div>
      ),
    },
    {
      name: "ຈັດ​ການ",
      cell: (row: DetailAct) => {
        const today = moment().format("YYYY-MM-DD");
        const dateactive = moment(row.activity.dateactive).format("YYYY-MM-DD");
        const isToday = today === dateactive;

        return (
          <>
            <button
              onClick={() => handleEdit(row.id)}
              className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-xs font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
              disabled={!isToday}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(row.id)}
              className="inline-flex items-center gap-x-2 rounded-lg border border-red-500 px-2 py-2 text-xs font-medium text-red-500 hover:border-red-400 hover:text-red-400 focus:border-red-400 focus:text-red-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              disabled={!isToday}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </>
        );
      },
      sortable: false,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        width: "180px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        paddingTop: "5px",
        paddingBottom: "5px",
      },
    },
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex justify-end">
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
          <DataTable
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
            noDataComponent={
              <div className="py-5 text-xl text-black">ບໍ່​ມີ​ຂໍ້​ມູນ​</div>
            }
            paginationComponentOptions={{
              rowsPerPageText: "ສະ​ແດງ​ຕ​ໍ່​ໜ້າ",
              rangeSeparatorText: "ຈາກ",
              selectAllRowsItem: true,
              selectAllRowsItemText: "ທັງໝົດ",
            }}
          />
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 shadow-[0px_0px_60px_20px_rgba(0,0,0,0.9)]">
      <div className="animate-fade-in rounded-xl bg-blue-200 p-8 shadow-2xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ທ່ານ​ຕ້ອງ​ການ​ຈະ​ລົ​ບ​ຂໍ້​ມູນ​ນີ້​ບໍ?
        </h2>
        <div className="mt-8 flex justify-center gap-x-4">
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 hover:shadow-lg focus:outline-none"
          >
            ລົບ
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-gray-600 hover:shadow-lg focus:outline-none"
          >
            ຍົກ​ເລີກ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActList;
