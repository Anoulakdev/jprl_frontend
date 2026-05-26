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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-tr from-[#f3f4ff] via-[#e5e9ff] to-[#fcf5ff] px-4 py-12 sm:px-6 lg:px-8">
      {/* Monochromatic Glass Noise Matte Finish */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.022] pointer-events-none mix-blend-overlay">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.8 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Local Premium Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.22;
            transform: scale(1) translate(0, 0);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.12) translate(15px, -15px);
          }
        }
        @keyframes pulseSlowReverse {
          0%, 100% {
            opacity: 0.22;
            transform: scale(1.05) translate(0, 0);
          }
          50% {
            opacity: 0.45;
            transform: scale(0.9) translate(-25px, 25px);
          }
        }
        @keyframes rotateSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes waveMotion {
          0%, 100% {
            transform: translateY(0) scaleY(1);
          }
          50% {
            transform: translateY(-12px) scaleY(1.02);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: float 4.5s ease-in-out infinite;
        }
        .animate-pulse-slow-1 {
          animation: pulseSlow 10s ease-in-out infinite;
        }
        .animate-pulse-slow-2 {
          animation: pulseSlowReverse 14s ease-in-out infinite;
        }
        .animate-rotate-slow {
          animation: rotateSlow 160s linear infinite;
        }
        .animate-rotate-slow-reverse {
          animation: rotateSlow 200s linear infinite reverse;
        }
        .animate-wave-slow {
          animation: waveMotion 12s ease-in-out infinite;
        }
        .animate-wave-slow-reverse {
          animation: waveMotion 16s ease-in-out infinite reverse;
        }
      `}</style>

      {/* Floating Premium Vibrant Ambient Blobs */}
      <div className="absolute -left-16 -top-16 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-300/35 to-purple-400/35 blur-[90px] animate-pulse-slow-1 pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 h-[36rem] w-[36rem] rounded-full bg-gradient-to-bl from-blue-300/40 to-indigo-400/40 blur-[100px] animate-pulse-slow-2 pointer-events-none" />
      <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-200/30 to-sky-300/30 blur-[85px] animate-pulse-slow-1 pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-gradient-to-r from-pink-200/25 to-purple-300/25 blur-[75px] animate-pulse-slow-2 pointer-events-none" />

      {/* Liquid Curved Bezier Ribbons (Flowing Lines) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.38]">
        <svg className="absolute top-0 left-0 w-[120%] h-[120%] -translate-x-[10%] -translate-y-[10%]" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,300 C200,450 500,150 900,350 C1100,450 1300,400 1600,450" stroke="url(#waveGrad1)" strokeWidth="6" strokeLinecap="round" className="animate-wave-slow" />
          <path d="M-50,350 C250,500 450,100 850,300 C1050,400 1250,350 1550,400" stroke="url(#waveGrad2)" strokeWidth="3.5" strokeDasharray="16 8" strokeLinecap="round" className="animate-wave-slow-reverse" />
          <path d="M-150,250 C150,400 550,200 950,400 C1150,500 1350,450 1650,500" stroke="url(#waveGrad3)" strokeWidth="2" strokeLinecap="round" className="animate-wave-slow" />
          
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3c50e0" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#5750f1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3c50e0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3c50e0" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Abstract Concentric Geometric Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {/* Top-Left Geometric Circles */}
        <svg className="absolute -left-[15%] -top-[15%] w-[60%] h-[60%] text-indigo-300/40 animate-rotate-slow" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="180" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="400" cy="400" r="260" stroke="currentColor" strokeWidth="1" strokeDasharray="12 6" />
          <circle cx="400" cy="400" r="340" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 400 60 A 340 340 0 0 1 740 400" stroke="#3c50e0" strokeWidth="2.5" />
        </svg>

        {/* Bottom-Right Geometric Circles */}
        <svg className="absolute -right-[15%] -bottom-[15%] w-[60%] h-[60%] text-blue-300/40 animate-rotate-slow-reverse" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="120" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="400" cy="400" r="220" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
          <circle cx="400" cy="400" r="320" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="400" cy="400" r="420" stroke="currentColor" strokeWidth="1.2" strokeDasharray="16 8" />
          <path d="M 400 740 A 340 340 0 0 1 60 400" stroke="#5750f1" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Layer 1: Tech Blueprint Grid-Line Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3c50e0 1px, transparent 1px),
            linear-gradient(to bottom, #3c50e0 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)"
        }}
      />

      {/* Layer 2: Radial Dotted Pattern Mask overlay */}
      <div
        className="absolute inset-0 opacity-[0.09] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#3c50e0 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)",
        }}
      />

      {/* Card Wrapper with Entrance Animation */}
      <div className="relative z-10 w-full max-w-[430px] opacity-0 animate-fade-in-up">
        {/* Glassmorphic Container Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-8 md:p-10 shadow-[0_20px_50px_rgba(8,112,184,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_24px_60px_rgba(8,112,184,0.1)]">
          {/* Top Premium Color Gradient Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

          {/* Brand Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Logo Container with floating effect */}
            <div className="animate-float mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-md shadow-blue-500/5 ring-1 ring-slate-100/80">
              <Image
                src="/jprl_logo.png"
                alt="JPRL Logo"
                width={56}
                height={56}
                priority
                className="object-contain"
              />
            </div>

            {/* Main Title */}
            <h2 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-2xl md:text-3xl font-extrabold text-transparent tracking-tight leading-normal">
              ຄ​ຊ​ປ​ປ​ລ ຮາກ​ຖານ ຟ​ຟ​ລ
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              ລະບົບຄຸ້ມຄອງຂໍ້ມູນສະມາຊິກຊາວໜຸ່ມ
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5 shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <div className="font-semibold leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                className="mb-2 block text-sm font-bold text-slate-700"
                htmlFor="username"
              >
                ຊື່​ເຂົ້າ​ລະ​ບົບ
              </label>
              <div className="relative">
                {/* Username Input Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-[15px] text-slate-800 placeholder-slate-400/80 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                  placeholder="ຊື່​ເຂົ້າ​ລະ​ບົບ"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="mb-2 block text-sm font-bold text-slate-700"
                htmlFor="password"
              >
                ລະ​ຫັດ​ຜ່ານ
              </label>
              <div className="relative">
                {/* Password Input Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-12 text-[15px] text-slate-800 placeholder-slate-400/80 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s+/g, ""))}
                  placeholder="ລະ​ຫັດ​ຜ່ານ"
                  required
                />
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:from-blue-400 disabled:to-indigo-400 disabled:pointer-events-none"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>ກຳ​ລັງເຂົ້າ​ລະ​ບົບ...</span>
                  </>
                ) : (
                  <>
                    <span>ເຂົ້າ​ລະ​ບົບ</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs font-semibold text-slate-400/80">
          <p>© 2026 ຄ​ຊ​ປ​ປ​ລ ຮາກ​ຖານ ຟ​ຟ​ລ. ສະຫງວນລິຂະສິດ</p>
          <p className="mt-1 text-[10px] opacity-75 font-medium">ພັດທະນາໂດຍ ຝ່າຍເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ ຟຟລ</p>
        </div>
      </div>
    </div>
  );
}
