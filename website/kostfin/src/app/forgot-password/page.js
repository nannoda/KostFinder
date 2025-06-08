// app/forgot-password/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState(null);
  const [userType, setUserType] = useState(null); // ✅ State baru untuk userType
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    const storedUserType = localStorage.getItem("userType"); // ✅ Ambil userType

    if (storedPhone && storedUserType) {
      setPhone(storedPhone);
      setUserType(storedUserType); // ✅ Set userType
    } else {
      setError("Informasi pengguna tidak ditemukan. Harap mulai proses login dari awal.");
      setTimeout(() => router.push("/login"), 3000);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!phone || !userType) { // ✅ Validasi userType juga
      setError("Informasi pengguna tidak lengkap. Harap coba lagi dari awal.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Semua field password harus diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    // ✅ Tentukan apiUrl berdasarkan userType
    let apiUrl = "";
    if (userType === "pemilik") {
      apiUrl = "http://localhost:8000/api/pemilik/login/";
    } else if (userType === "pencari") {
      apiUrl = "http://localhost:8000/api/pencari/login/";
    } else {
      setError("Tipe pengguna tidak dikenal.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_hp: phone, new_password: newPassword }), // Kirim new_password
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Password berhasil direset! Anda akan diarahkan kembali ke halaman login.");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/login-step-2");
        }, 3000);
      } else {
        setError(data.message || "Gagal mereset password. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      setError("Terjadi kesalahan jaringan atau server. Coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Reset Password</h2>

        {phone && (
          <p className="text-center text-md font-medium text-gray-800 mb-4">
            Resetting password for: <span className="font-bold">{phone}</span> (as {userType})
          </p>
        )}
        {!phone && !error && (
            <p className="text-center text-md text-gray-600 mb-4">Mencari informasi pengguna...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center mt-3">{message}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Simpan Password Baru
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah ingat password?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
            Login di sini
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;