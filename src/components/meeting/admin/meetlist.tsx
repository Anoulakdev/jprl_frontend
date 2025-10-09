"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { encryptId } from "@/lib/cryptoId";

interface DetailMeet {
  id: number;
  meetingId: number;
  userCode: string;
  content: string;
  lat: number;
  lng: number;
  meetimg: string;
  createdAt: string;
  updatedAt: string;
}

interface Meeting {
  id: number;
  name: string;
  dateactive: string;
  detailmeets?: DetailMeet[];
}

const MeetList: React.FC = () => {
  const [data, setData] = useState<Meeting[]>([]);
  const [filteredData, setFilteredData] = useState<Meeting[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/meetings`);
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
    const encryptedId = encryptId(id);
    router.push(`/meeting/admin/edit/${encryptedId}`);
  };

  const handleDeleteClick = (id: number) => {
    const meeting = data.find((meeting) => meeting.id === id);
    if (meeting) {
      setMeetingToDelete(meeting);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (meetingToDelete) {
      try {
        await axiosInstance.delete(`/meetings/${meetingToDelete.id}`);
        const deletedData = data.filter(
          (meeting) => meeting.id !== meetingToDelete.id,
        );
        setData(deletedData);
        setFilteredData(deletedData);
        toast.success("ລົ​ບ​ຂໍ້ມູນ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        toast.error("ລົ​ບ​ຂໍ້ມູນ​ບໍ່ສຳ​ເລັດ");
      } finally {
        setIsDeleteModalOpen(false);
        setMeetingToDelete(null);
      }
    }
  };

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    // Filter data based on the input value
    const filtered = data.filter(
      (meet) =>
        meet.name.toLowerCase().includes(value) ||
        new Date(meet.dateactive).toLocaleDateString("en-GB").includes(value),
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
      cell: (row: Meeting, index: number) => {
        const rowIndex = (currentPage - 1) * rowsPerPage + index + 1;
        return rowIndex;
      },
      width: "8%",
      sortable: true,
    },
    {
      name: "ຫົວ​ຂໍ້​ປະ​ຊຸມ",
      selector: (row: Meeting) => row.name,
      sortable: true,
      width: "55%",
      cell: (row: Meeting) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.name}
        </div>
      ),
    },
    {
      name: "ມື້​ເລີ່ມ​ປະ​ຊຸມ",
      selector: (row: Meeting) =>
        new Date(row.dateactive).toLocaleDateString("en-GB"),
      // width: "17%",
      sortable: true,
    },
    {
      name: "ຈັດ​ການ",
      cell: (row: Meeting) => (
        <>
          <button
            onClick={() => handleEdit(row.id)}
            className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-xs font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row.id)}
            disabled={row.detailmeets && row.detailmeets.length > 0}
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
        backgroundColor: "#d9e0e9",
        fontWeight: "bold",
        fontSize: "16px",
        width: "200px",
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
          href="/meeting/admin/add"
          className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none active:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          ເພີ່ມປະ​ຊຸມ
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

export default MeetList;
