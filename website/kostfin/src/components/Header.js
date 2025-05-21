import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const phone = localStorage.getItem("phone"); // ✅ Cek apakah user sudah login
    setIsLoggedIn(!!phone);
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md relative z-50">
      <div className="text-xl font-bold">LOGO</div>

      <div className="flex items-center space-x-4">
        <button className="bg-black text-white px-4 py-2 rounded">Jadi Pemilik Kost</button>

        {isLoggedIn ? (
          // ✅ Dropdown Profil
          <div className="relative">
            <img
              src="/profil/foto_default.png"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)} // ✅ Toggle dropdown saat diklik
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                <Link href="/profile">
                  <p className="p-2 text-black hover:bg-gray-200 cursor-pointer">Profile</p>
                </Link>
                <p
                  className="p-2 text-red-500 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("phone"); // ✅ Logout user
                    window.location.reload(); // ✅ Refresh halaman
                  }}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          // ✅ Tombol Login jika user belum masuk
          <Link href="/login">
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;