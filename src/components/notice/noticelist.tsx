"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { getLocalStorage } from "@/utils/storage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { encryptId } from "@/lib/cryptoId";

interface Notice {
  id: number;
  title: string;
  date: string;
  noticefile: string;
}

const NoticeList: React.FC = () => {
  const [data, setData] = useState<Notice[]>([]);
  const [filteredData, setFilteredData] = useState<Notice[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/notices`);
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

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = getLocalStorage("user");
    setUser(storedUser);
  }, []);

  const handleEdit = (id: number) => {
    const encryptedId = encryptId(id);
    router.push(`/notice/edit/${encryptedId}`);
  };

  const handleDeleteClick = (id: number) => {
    const notice = data.find((notice) => notice.id === id);
    if (notice) {
      setNoticeToDelete(notice);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (noticeToDelete) {
      try {
        await axiosInstance.delete(`/notices/${noticeToDelete.id}`);
        const deletedData = data.filter(
          (notice) => notice.id !== noticeToDelete.id,
        );
        setData(deletedData);
        setFilteredData(deletedData);
        toast.success("ລົ​ບ​ຂໍ້ມູນ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        toast.error("ລົ​ບ​ຂໍ້ມູນ​ບໍ່ສຳ​ເລັດ");
      } finally {
        setIsDeleteModalOpen(false);
        setNoticeToDelete(null);
      }
    }
  };

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    // Filter data based on the input value
    const filtered = data.filter(
      (notice) =>
        notice.date.includes(value) ||
        notice.title.toLowerCase().includes(value),
    );
    setFilteredData(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setRowsPerPage(perPage);
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobURL = URL.createObjectURL(blob);
      const aTag = document.createElement("a");
      aTag.href = blobURL;
      aTag.download = filename;
      document.body.appendChild(aTag);
      aTag.click();
      aTag.remove();
      URL.revokeObjectURL(blobURL);
    } catch (error: any) {
      console.error("Error downloading file:", error.message);
      toast.error("ດາວ​ໂຫຼດໄຟລ໌ບໍ່ສຳ​ເລັດ");
    }
  };

  const columns = [
    {
      name: "ລ/ດ",
      cell: (row: Notice, index: number) => index + 1,
      sortable: true,
      width: "10%",
    },
    {
      name: "ວັນ​ທີ",
      selector: (row: Notice) => new Date(row.date).toLocaleDateString("en-GB"),
      sortable: true,
      width: "15%",
    },
    {
      name: "ຫົວ​ຂໍ້",
      selector: (row: Notice) => row.title,
      sortable: true,
      width: "45%",
    },
    {
      name: "ໄຟລ໌",
      cell: (row: Notice) =>
        row.noticefile ? (
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/upload/notice/${row.noticefile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-700"
            title="ເປີດ PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="37"
              fill="currentColor"
              className="bi bi-filetype-pdf"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"
              />
            </svg>
          </a>
        ) : (
          <span className="italic text-gray-400">ບໍ່ມີໄຟລ໌</span>
        ),
      sortable: false,
    },
    {
      name: "ດາວ​ໂຫຼດ",
      cell: (row: Notice) =>
        row.noticefile ? (
          <button
            onClick={() =>
              downloadFile(
                `${process.env.NEXT_PUBLIC_API_URL}/upload/notice/${row.noticefile}`,
                `${row.title}.pdf`,
              )
            }
            className="inline-flex items-center gap-x-2 rounded-lg border border-orange-600 px-3 py-1.5 text-sm font-medium text-orange-600 hover:border-orange-500 hover:text-orange-500 focus:outline-none focus:ring focus:ring-orange-300"
            title="ດາວ​ໂຫຼດ"
          >
            ດາວ​ໂຫຼດ
          </button>
        ) : (
          <span className="italic text-gray-400">ບໍ່ມີໄຟລ໌</span>
        ),
      sortable: false,
    },
    ...(user?.roleId === 2
      ? [
          {
            name: "#",
            cell: (row: Notice) => (
              <>
                <button
                  onClick={() => handleEdit(row.id)}
                  className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-xs font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(row.id)}
                  className="inline-flex items-center gap-x-2 rounded-lg border border-red-500 px-2 py-2 text-xs font-medium text-red-500 hover:border-red-400 hover:text-red-400 focus:border-red-400 focus:text-red-400 focus:outline-none"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </>
            ),
            sortable: false,
          },
        ]
      : []),
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
        paddingTop: "5px",
        paddingBottom: "5px",
        height: "70px",
      },
    },
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex justify-between">
        {user?.roleId === 2 ? (
          <Link
            href="/notice/add"
            className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700"
          >
            ເພີ່ມແຈ້ງ​ການ
          </Link>
        ) : (
          <div></div>
        )}

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

export default NoticeList;
