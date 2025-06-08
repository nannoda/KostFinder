"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import untuk navigasi
import { useEffect } from "react"; // ✅ Import untuk efek samping

const RegisterPage = () => {
  const [role, setRole] = useState(""); // ✅ Pilihan role
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alamatKost, setAlamatKost] = useState(""); // ✅ Hanya untuk pemilik kost
  const router = useRouter(); // ✅ Inisialisasi router
  const [hasUserRole, setHasUserRole] = useState(false); // ✅ State untuk cek apakah sudah ada role

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    if (storedRole) {
      setHasUserRole(true);
      setRole(storedRole); // Set role dari localStorage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiURL =
      role === "pemilik"
        ? "http://localhost:8000/api/pemilik/register/" // ✅ API untuk pemilik
        : "http://localhost:8000/api/pencari/register/"; // ✅ API untuk pencari

    const bodyData =
      role === "pemilik"
        ? { nama, email, no_hp: noHp, username, password, alamat_kost: alamatKost } // ✅ Kirim alamat_kost
        : { nama, email, no_hp: noHp, username, password };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registrasi berhasil:", data);
        alert("Registrasi berhasil!");
        router.push("/login"); // ✅ Redirect ke login
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
        <h2 className="text-2xl font-bold text-left text-black mb-5 mt-[-8px]">
          Register
        </h2>
        <hr className="border-t border-gray-300 mb-6" />

        {/* Pilihan Role */}
        {!role ? (
          <div className="flex flex-col items-center space-y-4">
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-full text-md font-medium hover:bg-blue-600 transition-all"
              onClick={() => setRole("pemilik")}
            >
              Register sebagai Pemilik Kost
            </button>
            <button
              className="w-full bg-green-500 text-white py-3 rounded-full text-md font-medium hover:bg-green-600 transition-all"
              onClick={() => setRole("pencari")}
            >
              Register sebagai Pencari Kost
            </button>
          </div>
        ) : (
          /* Form Registrasi */
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
            {/* Input Alamat Kost (Hanya untuk Pemilik) */}
            {role === "pemilik" && (
              <input
                type="text"
                placeholder="Alamat Kost"
                className="w-full py-3 p-7 border rounded-full text-sm font-medium text-black"
                value={alamatKost}
                onChange={(e) => setAlamatKost(e.target.value)}
                required
              />
            )}

            {/* Tombol Register */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-full text-md font-medium hover:bg-blue-600 transition-all"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;