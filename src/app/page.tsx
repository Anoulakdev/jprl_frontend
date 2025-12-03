"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setLocalStorage, getLocalStorage } from "@/utils/storage";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirectUser = useCallback(
    (user: any) => {
      if (user.roleId === 1) {
        router.push("/dashboard");
      } else if (user.roleId === 2) {
        router.push("/dashboard");
      } else if (
        user.roleId === 3 &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(user.positionId)
      ) {
        router.push("/organize/organizeall");
      } else {
        toast.error("ບົດບາດຂອງຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ");
      }
    },
    [router], // ใช้ router เป็น dependency
  );

  useEffect(() => {
    const user = getLocalStorage("user");
    if (user) {
      redirectUser(user);
    }
  }, [redirectUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // เริ่มโหลด

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        { username, password },
      );
      const { token, user } = response.data;

      // Save token and user using the utility function
      setLocalStorage("token", token);
      setLocalStorage("user", user);

      // Redirect to the dashboard
      toast.success("ເຂົ້າ​ລະ​ບົບ​ສຳ​ເລັດ");
      redirectUser(user);
    } catch (err: any) {
      toast.error("ເຂົ້າ​ລະ​ບົບ​ບໍ່ສຳ​ເລັ​ດ");
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false); // จบการโหลด
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-200 px-2">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-5 flex flex-col items-center text-center">
          <Image src={`/jprl_logo.png`} alt="nophoto" width={80} height={80} />
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ຄ​ຊ​ປ​ປ​ລ ຮາກ​ຖານ ຟ​ຟ​ລ
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="text-md mb-2 block font-bold text-gray-700"
              htmlFor="username"
            >
              ຊື່​ເຂົ້າ​ລະ​ບົບ
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="username"
              type="text"
              value={username}
              onChange={
                (e) => setUsername(e.target.value.replace(/\s+/g, "")) // ลบช่องว่างทั้งหมด
              }
              placeholder="ຊື່​ເຂົ້າ​ລະ​ບົບ"
              required
            />
          </div>
          <div className="relative mb-6">
            <label
              className="text-md mb-2 block font-bold text-gray-700"
              htmlFor="password"
            >
              ລະ​ຫັດ​ຜ່ານ
            </label>
            <div className="relative">
              <input
                className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={
                  (e) => setPassword(e.target.value.replace(/\s+/g, "")) // ลบช่องว่างทั้งหมด
                }
                placeholder="ລະ​ຫັດ​ຜ່ານ"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center pb-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeIcon className="h-6 w-6" />
                ) : (
                  <EyeSlashIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              className="focus:shadow-outline flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              )}

              {loading ? "ກຳ​ລັງເຂົ້າ​ລະ​ບົບ..." : "ເຂົ້າ​ລະ​ບົບ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
