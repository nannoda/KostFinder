"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import untuk navigasi

const RegisterPage = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // ✅ Inisialisasi router

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/pencari/register/", { // ✅ Pastikan API benar
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, no_hp: noHp, username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registrasi berhasil:", data);
        alert("Registrasi berhasil!");
        router.push("/login"); // ✅ Redirect ke halaman login setelah sukses
      } else {
        console.error("Error:", data);
        alert("Registrasi gagal! Cek API backend.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-left text-black mb-5 mt-[-8px]">Register</h2>
        <hr className="border-t border-gray-300 mb-12" />

        {/* Form Registrasi */}
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full py-3 p-7 border rounded-full text-sm font-medium text-black"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full py-3 p-7 border rounded-full text-sm font-medium text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Nomor HP"
            className="w-full py-3 p-7 border rounded-full text-sm font-medium text-black"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full py-3 p-7 border rounded-full text-sm font-medium text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full py-3 p-7 border rounded-full text-sm font-medium text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Tombol Register */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full text-md font-medium hover:bg-blue-600 transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;