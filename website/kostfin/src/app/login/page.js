"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter untuk navigasi

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const router = useRouter(); // ✅ Inisialisasi router

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nomor:", phone);

    // ✅ Redirect ke halaman Login Step 2 setelah klik "Continue"
    router.push("/login-step-2");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-left text-black mb-5 mt-[-8px]">Login</h2>
        <hr className="border-t border-gray-300 mb-12" />

        {/* Input Nomor Telepon */}
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <div className="relative w-[100%] mx-auto">
            <label className="absolute top-2 left-7 text-xs font-medium text-black">
              Phone Number
            </label>

            {/* Input Field dengan Placeholder */}
            <input
              type="tel"
              placeholder="Enter Your Number"
              className="w-full py-3 p-7 pt-5 border rounded-full text-left text-sm font-medium text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <p className="text-sm text-gray-500">
            We'll call or text you to confirm your number. Standard message and data rates apply.
          </p>

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

export default LoginPage;