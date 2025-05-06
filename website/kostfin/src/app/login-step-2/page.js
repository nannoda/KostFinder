"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter untuk navigasi

const LoginStep2 = () => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password:", password);

    // ✅ Redirect ke halaman utama setelah login
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-2xl">
        
        {/* Bagian Login */}
        <h2 className="text-2xl font-bold text-left text-black mb-3">Login</h2>
        <hr className="border-t border-gray-300 mb-6" /> {/* ✅ Garis dipindah ke bawah "Login" */}

        {/* Bagian Profil */}
        <div className="flex items-center mb-4">
          <img
            src="/default-profile.png" // Ganti dengan URL avatar pengguna
            alt="User Avatar"
            className="w-12 h-12 rounded-full border"
          />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-black">Hello, John Doe</h3>
            <p className="text-sm text-gray-600 cursor-pointer hover:underline">Not You?</p>
          </div>
        </div>

        {/* Input Password */}
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <div className="relative w-[100%] mx-auto">
            <label className="absolute top-2 left-7 text-xs font-medium text-black">
              Enter Your Password
            </label>

            {/* Input Field untuk Password */}
            <input
              type="password"
              placeholder="Enter Your Password"
              className="w-full py-3 p-7 pt-5 border rounded-full text-left text-sm font-medium text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="text-sm text-blue-600 text-left cursor-pointer hover:underline">Forgot Your Password?</p>

          {/* Tombol Continue dan Continue With Email */}
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white py-3 rounded-full text-md font-medium hover:bg-blue-600 transition-all"
            >
              Continue
            </button>
            <span className="w-1/1 text-md font-bold text-black text-left pl-4 flex items-center">
              📩 Continue With Email
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginStep2;