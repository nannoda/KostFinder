"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    setIsLoggedIn(!!phone);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("phone");
    localStorage.removeItem("user_role");
    if (pathname === "/") {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <header className="w-full bg-gray-100/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-lg md:text-2xl font-bold tracking-wide text-gray-800 hover:text-black transition-colors"
        >
          <img
            src="/logo/logo_kostfin.png"
            alt="KostFinder Logo"
            className="h-8 md:h-10"
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              localStorage.setItem("user_role", "pemilik");
              router.push("/register");
            }}
            className="rounded-full bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
          >
            Jadi Pemilik Kost
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className={`absolute right-0  mt-13 w-44 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ${showDropdown
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
                  }`}
              >
                <Link href="/profile">
                  <p className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer rounded-t-lg">
                    Profil Saya
                  </p>
                </Link>
                <hr className="my-1 border-gray-200" />
                <p
                  className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer rounded-b-lg"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>

              {/* Tombol toggle dropdown */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-gray-300 hover:ring-gray-400 transition-all"
              >
                {showDropdown ? (
                  <X size={18} className="text-gray-600" />
                ) : (
                  <Menu size={18} className="text-gray-600" />
                )}
                <img
                  src="/profil/foto_default.png"
                  alt="Profile"
                  className="h-7 w-7 rounded-full object-cover"
                />
              </button>
            </div>
          ) : (
            /* belum login */
            <Link href="/login">
              <button className="rounded-full bg-gray-700 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
