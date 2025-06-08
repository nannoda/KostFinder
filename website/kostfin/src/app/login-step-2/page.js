"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginStep2 = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("John Doe"); // Default jika tidak ditemukan
  const [userType, setUserType] = useState(null); // Menyimpan tipe user (pemilik/pencari)
  const [error, setError] = useState(""); // State untuk pesan error
  const router = useRouter();

  useEffect(() => {
    console.log("🔥 `useEffect` dijalankan di Login Step 2!");
    const phone = localStorage.getItem("phone");
    console.log("📞 Nomor HP dari `localStorage`:", phone);

    if (!phone) {
      console.log("❌ Nomor HP kosong, redirect ke login!");
      router.push("/login"); // Kembali ke Login Step 1 jika tidak ada nomor HP
      return;
    }

    // ✅ Bagian ini untuk mengambil username berdasarkan nomor HP
    // Ini adalah GET request. Pastikan backend Anda merespons dengan {"username": "..."}
    // atau {"username": null, "message": "Nomor HP tidak ditemukan"}
    console.log("🚀 Memulai fetch untuk username di Login Step 2...");

    // Coba di endpoint pemilik
    fetch(`http://localhost:8000/api/pemilik/login/?no_hp=${phone}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          console.log("📌 Username dari Pemilik Kost:", data.username);
          setUsername(data.username);
          setUserType("pemilik"); // Set userType
          localStorage.setItem("user_id", data.id);
          localStorage.setItem("user_role", "pemilik");
        } else {
          // Jika tidak ada di pemilik, coba di pencari
          fetch(`http://localhost:8000/api/pencari/login/?no_hp=${phone}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.username) {
                console.log("📌 Username dari Pencari Kost:", data.username);
                setUsername(data.username);
                setUserType("pencari"); // Set userType
                localStorage.setItem("user_id", data.id); // ✅ Set user_id
                localStorage.setItem("user_role", "pencari");
              } else {
                console.log("❌ Username tidak ditemukan untuk nomor ini!");
                setError("User tidak ditemukan untuk nomor ini. Coba lagi.");
              }
            })
            .catch((error) => {
              console.error("❌ Error mengambil username pencari:", error);
              setError("Gagal mengambil data user (Pencari).");
            });
        }
      })
      .catch((error) => {
        console.error("❌ Error mengambil username pemilik:", error);
        setError("Gagal mengambil data user (Pemilik).");
      });
  }, []);

  // Handler saat form password disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset pesan error setiap kali submit

    // Tambahkan log ini untuk debugging
    console.log("Attempting to submit password:", password);
    console.log("Current phone from localStorage:", localStorage.getItem("phone"));
    console.log("Detected user type:", userType);


    // Pastikan userType sudah teridentifikasi sebelum melanjutkan
    if (!userType) {
      setError("Tipe pengguna tidak dikenali. Mohon coba ulangi proses login.");
      return;
    }

    const phone = localStorage.getItem("phone");
    if (!phone) {
      setError("Nomor HP tidak ditemukan. Mohon ulangi proses login.");
      router.push("/login"); // Kembali ke Login Step 1
      return;
    }

    // Tentukan URL API login berdasarkan tipe user
    // ✅ PENTING: Pastikan URL ini diakhiri dengan garis miring (trailing slash) untuk Django
    const apiUrl = userType === "pemilik"
      ? `http://localhost:8000/api/pemilik/login/`
      : `http://localhost:8000/api/pencari/login/`;

    try {
      console.log(`🚀 Mengirim permintaan login ke: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        method: "POST", // Menggunakan POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ no_hp: phone, password: password }), // Kirim no_hp dan password
      });

      const data = await response.json(); // Parse respons JSON
      console.log("📝 Respon dari server:", data);

      // ✅ Cek properti 'success' dari respons backend
      if (response.ok && data.success && userType === "pemilik") { // Login Berhasil jika status 2xx dan success: true
        router.push("/dashboard/pemilik/");
      } else if (response.ok && data.success && userType === "pencari") {
        router.push("/");
      } else {
        setError(data.message || "Login gagal. Periksa nomor HP dan password Anda.");
      }
    } catch (err) {
      // Tangani error jaringan atau server tidak merespons
      console.error("❌ Terjadi kesalahan saat melakukan fetch:", err);
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-left text-black mb-3">Login</h2>
        <hr className="border-t border-gray-300 mb-6" />

        {/* Bagian Profil */}
        <div className="flex items-center mb-4">
          <img src="/profil/foto_default.png" alt="Profile Picture" className="w-12 h-12 rounded-full border shadow-lg" />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-black">
              Hello, {error && error.includes("User tidak ditemukan") ? "User tidak ditemukan" : username}
            </h3>
            <p className="text-sm text-gray-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
              Not You?
            </p>
          </div>
        </div>

        {/* Area untuk menampilkan pesan error */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Input Password */}
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <div className="relative w-[100%] mx-auto">
            <label className="absolute top-2 left-7 text-xs font-medium text-black">
              Enter Your Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="w-full py-3 p-7 pt-5 border rounded-full text-left text-sm font-medium text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-sm text-blue-600 text-left cursor-pointer hover:underline">
            Forgot Your Password?
          </p>

          {/* Tombol Continue */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white py-3 rounded-full text-md font-medium hover:bg-blue-600 transition-all"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginStep2;