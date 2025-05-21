"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Chu {
  id: number;
  name: string;
}

const ChuList: React.FC = () => {
  const [data, setData] = useState<Chu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [chuToDelete, setChuToDelete] = useState<Chu | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Chu[]>("/chus");
        setData(response.data);
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
        toast.success("ລົ​ບ​ຂໍ້ມູນ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        toast.error("ລົ​ບ​ຂໍ້ມູນ​ບໍ່ສຳ​ເລັດ");
      } finally {
        setIsDeleteModalOpen(false);
        setChuToDelete(null);
      }
    }
  };

  const columns = [
    {
      name: "ລ/ດ",
      cell: (row: Chu, index: number) => index + 1,
      sortable: true,
    },
    {
      name: "ຊື່​ຈຸ​ງານ",
      selector: (row: Chu) => row.name,
      sortable: true,
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
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex justify-between">
        <Link
          href="/chu/add"
          className="mr-20 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none active:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          ເພີ່ມຈ​ຸ
        </Link>
      </div>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <DataTable
              columns={columns}
              data={data}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              className="w-full table-auto"
              noDataComponent="ບໍ່​ມີ​ຂໍ້​ມູນ​"
            />
          </table>
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
