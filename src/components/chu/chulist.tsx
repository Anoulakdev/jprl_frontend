"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Chu {
  id: number;
  name: string;
  unit: Unit;
}

interface Unit {
  id: number;
  no: number;
  name: string;
}

const ChuList: React.FC = () => {
  const [data, setData] = useState<Chu[]>([]);
  const [filteredData, setFilteredData] = useState<Chu[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [chuToDelete, setChuToDelete] = useState<Chu | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/chus`);
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/chu/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    const chu = data.find((chu) => chu.id === id);
    if (chu) {
      setChuToDelete(chu);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (chuToDelete) {
      try {
        await axiosInstance.delete(`/chus/${chuToDelete.id}`);
        const deletedData = data.filter((chu) => chu.id !== chuToDelete.id);
        setData(deletedData);
        setFilteredData(deletedData);
        toast.success("ລົ​ບ​ຂໍ້ມູນ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        toast.error("ລົ​ບ​ຂໍ້ມູນ​ບໍ່ສຳ​ເລັດ");
      } finally {
        setIsDeleteModalOpen(false);
        setChuToDelete(null);
      }
    }
  };

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    // Filter data based on the input value
    const filtered = data.filter(
      (chu) =>
        chu.unit.name.toLowerCase().includes(value) ||
        chu.name.toLowerCase().includes(value),
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
      name: "ລ/ດ",
      cell: (row: Chu, index: number) => index + 1,
      sortable: true,
      width: "10%",
    },
    {
      name: "ຊື່​ໜ່ວຍ",
      selector: (row: Chu) => row.unit.name,
      sortable: true,
      width: "30%",
    },
    {
      name: "ຊື່​ຈຸ​ງານ",
      selector: (row: Chu) => row.name,
      sortable: true,
      width: "40%",
    },
    {
      name: "#",
      cell: (row: Chu) => (
        <>
          <button
            onClick={() => handleEdit(row.id)}
            className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-xs font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row.id)}
            className="inline-flex items-center gap-x-2 rounded-lg border border-red-500 px-2 py-2 text-xs font-medium text-red-500 hover:border-red-400 hover:text-red-400 focus:border-red-400 focus:text-red-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </>
      ),
      sortable: false,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        width: "200px",
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
      <div className="mb-4 flex justify-between">
        <Link
          href="/chu/add"
          className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none active:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          ເພີ່ມຈ​ຸ
        </Link>

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
            noDataComponent="ບໍ່​ມີ​ຂໍ້​ມູນ​ຄົ້ນ​ຫາ"
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

export default ChuList;
