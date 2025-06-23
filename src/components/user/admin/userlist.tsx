"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { encryptId } from "@/lib/cryptoId";

interface User {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  actived: string;
  gender: string;
  tel: string;
  userimg: string;
  roleId: number;
  positionId: number;
  unitId: number;
  chuId: number;
  role: Role;
  position: Position;
  unit: Unit;
  chu: Chu;
  detailacts?: DetailAct[];
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
}

interface Role {
  id: number;
  name: string;
  description: string;
}
interface Position {
  id: number;
  name: string;
  description: string;
}
interface Unit {
  id: number;
  no: number;
  name: string;
}
interface Chu {
  id: number;
  name: string;
}

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/admin`);
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
    router.push(`/user/admin/edit/${encryptedId}`);
  };

  const handleDeleteClick = (id: number) => {
    const u = data.find((u) => u.id === id);
    if (u) {
      setUserToDelete(u);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await axiosInstance.delete(`/users/${userToDelete.id}`);
        const deletedData = data.filter((u) => u.id !== userToDelete.id);
        setData(deletedData);
        setFilteredData(deletedData);
        toast.success("ລົ​ບ​ຂໍ້ມູນ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        toast.error("ລົ​ບ​ຂໍ້ມູນ​ບໍ່ສຳ​ເລັດ");
      } finally {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleReset = async (id: number) => {
    const confirm = window.confirm("ທ່ານ​ຕ້ອງ​ການ​ທີ່​ຈະ​ລີ​ເສັດ​ບໍ?");
    if (confirm) {
      try {
        // ส่งคำขอรีเซ็ตรหัสผ่าน
        await axiosInstance.put(`/users/resetpassword/${id}`);

        // อัปเดตสถานะเพื่อแสดงว่าผู้ใช้รายนี้ถูกรีเซ็ตรหัสผ่านแล้ว
        const updatedData = data.map((user) =>
          user.id === id ? { ...user, passwordReset: true } : user,
        );

        setData(updatedData);
        setFilteredData(updatedData);

        toast.success("ຣີເສັດລະ​ຫັດ​ສຳ​ເລັດ​ແລ້ວ");
      } catch (error) {
        console.error("Reset password failed:", error);
        toast.error("ຣີ​ເສັດລະ​ຫັດ​ບໍ່ສຳ​ເລັດ");
      }
    }
  };

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    // Filter data based on the input value
    const filtered = data.filter(
      (user) =>
        user.code.toLowerCase().includes(value) ||
        user.firstname.toLowerCase().includes(value) ||
        user.lastname.toLowerCase().includes(value) ||
        user.gender.toLowerCase().includes(value) ||
        user.tel.toLowerCase().includes(value) ||
        user.position.name.toLowerCase().includes(value) ||
        user.unit.name.toLowerCase().includes(value) ||
        user.chu.name.toLowerCase().includes(value),
    );
    setFilteredData(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setRowsPerPage(perPage);
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    try {
      setLoading(true);
      // กำหนดสถานะใหม่ (ถ้าปัจจุบันคือ "A" จะเปลี่ยนเป็น "C")
      const newStatus = currentStatus === "A" ? "C" : "A";

      // ส่งคำขอไปยัง API เพื่ออัปเดตสถานะ
      const response = await axiosInstance.put(`/users/${id}/status`, {
        actived: newStatus,
      });

      if (response.status === 200) {
        toast.success("ອັບ​ເດດສະ​ຖາ​ນະ​ສຳ​ເລັດ​");

        // Re-fetch the user data to reflect the updated status
        const updatedData = await axiosInstance.get(`/users/admin`);
        setData(updatedData.data); // Update the data in the state
        setFilteredData(updatedData.data); // Also update the filtered data
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", error);
      toast.error("ອັບ​ເດດ​ບໍ່​ສຳ​ເລັດ");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "#",
      cell: (row: User, index: number) => {
        const rowIndex = (currentPage - 1) * rowsPerPage + index + 1;
        return rowIndex;
      },
      sortable: true,
      width: "5%",
    },
    {
      name: "ສະ​ຖາ​ນະ",
      cell: (row: User) => (
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={row.actived === "A"}
            onChange={() => handleStatusChange(row.id, row.actived)}
          />
          <div
            className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute 
              after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full 
              after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 
              peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:border-gray-600 
              dark:bg-gray-700"
          ></div>
        </label>
      ),
      sortable: true,
      width: "7%",
    },
    {
      name: "ລະ​ຫັດ​ພ/ງ",
      selector: (row: User) => row.code,
      sortable: true,
      width: "8%",
    },
    {
      name: "ຊື່",
      selector: (row: User) =>
        `${row.gender === "Male" ? "ທ່ານ" : row.gender === "Female" ? "ທ່ານນາງ" : ""} ${row.firstname}`,
      sortable: true,
      width: "11%",
      cell: (row: User) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.gender === "Male"
            ? "ທ່ານ"
            : row.gender === "Female"
              ? "ທ່ານນາງ"
              : ""}{" "}
          {row.firstname}
        </div>
      ),
    },
    {
      name: "ນາມ​ສະ​ກຸນ",
      selector: (row: User) => row.lastname,
      sortable: true,
      cell: (row: User) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.lastname}
        </div>
      ),
    },
    {
      name: "ເບີ​ໂທ",
      selector: (row: User) => row.tel,
      sortable: true,
      cell: (row: User) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.tel}
        </div>
      ),
    },
    {
      name: "​ຕຳ​ແໜ່ງ",
      selector: (row: User) => row.position?.name,
      sortable: true,
      width: "13%",
    },
    {
      name: "​ໜ່ວຍ",
      selector: (row: User) => row.unit?.name,
      sortable: true,
      width: "11%",
      cell: (row: User) => (
        <div className="overflow-hidden whitespace-normal break-words">
          {row.unit?.name}
        </div>
      ),
    },
    {
      name: "​​ຈຸ",
      selector: (row: User) => row.chu?.name,
      sortable: true,
    },
    {
      name: "ຮູບ​ພາບ",
      cell: (row: User) =>
        row.userimg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/upload/user/${row.userimg}`}
            alt={row.userimg}
            style={{
              width: "60px",
              height: "70px",
              borderRadius: "5px",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/nophoto.jpg`}
            alt="nophoto"
            style={{
              width: "60px",
              height: "70px",
              borderRadius: "5px",
            }}
          />
        ),
      sortable: false,
    },
    {
      name: "ຈັດ​ການ",
      cell: (row: User) => (
        <>
          <button
            onClick={() => handleReset(row.id)}
            className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-yellow-500 px-2 py-2 text-xs font-medium text-yellow-500 hover:border-yellow-400 hover:text-yellow-400 focus:border-yellow-400 focus:text-yellow-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row.id)}
            className="mr-2 inline-flex items-center gap-x-2 rounded-lg border border-blue-600 px-2 py-2 text-xs font-medium text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row.id)}
            disabled={row.detailacts && row.detailacts.length > 0}
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
        width: "130px",
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
          href="/user/admin/add"
          className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none active:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          ເພີ່ມສະ​ມາ​ຊິກ
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

export default UserList;
