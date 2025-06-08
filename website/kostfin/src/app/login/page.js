// LoginPage.js (Login Step 1)

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  // ✅ KEMBALIKAN state untuk menyimpan daftar nomor dari backend
  const [registeredPhonesPemilik, setRegisteredPhonesPemilik] = useState([]);
  const [registeredPhonesPencari, setRegisteredPhonesPencari] = useState([]);
  const router = useRouter();

  // ✅ KEMBALIKAN fetch di useEffect untuk mengambil daftar nomor HP dari backend
  useEffect(() => {
    console.log("🔥 `useEffect` dijalankan di Login Step 1!");
    // Fetch nomor dari pemilik
    fetch("http://localhost:8000/api/pemilik/login/")
      .then((res) => res.json())
      .then((data) => {
        // Pastikan data adalah array objek dengan properti no_hp
        if (Array.isArray(data)) {
            setRegisteredPhonesPemilik(data.map(item => item.no_hp));
            console.log("Nomor Pemilik terdaftar:", data.map(item => item.no_hp));
        } else {
            console.warn("Respon pemilik tidak sesuai format array:", data);
        }
      })
      .catch((error) => console.error("❌ Error fetching pemilik phones:", error));

    // Fetch nomor dari pencari
    fetch("http://localhost:8000/api/pencari/login/")
      .then((res) => res.json())
      .then((data) => {
        // Pastikan data adalah array objek dengan properti no_hp
        if (Array.isArray(data)) {
            setRegisteredPhonesPencari(data.map(item => item.no_hp));
            console.log("Nomor Pencari terdaftar:", data.map(item => item.no_hp));
        } else {
            console.warn("Respon pencari tidak sesuai format array:", data);
        }
      })
      .catch((error) => console.error("❌ Error fetching pencari phones:", error));
  }, []); // Dependensi kosong agar hanya dijalankan sekali

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (!phone) {
      setError("Nomor telepon tidak boleh kosong.");
      return;
    }

    let apiURL = "";
    // ✅ Logika untuk menentukan API URL berdasarkan apakah nomor ditemukan di pemilik atau pencari
    if (registeredPhonesPemilik.includes(phone)) {
      apiURL = "http://localhost:8000/api/pemilik/login/";
    } else if (registeredPhonesPencari.includes(phone)) {
      apiURL = "http://localhost:8000/api/pencari/login/";
    } else {
      setError("Nomor tidak ditemukan, silakan coba lagi!");
      return; // Hentikan proses jika nomor tidak terdaftar di kedua jenis user
    }

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_hp: phone }), // Hanya kirim no_hp
      });

      const data = await response.json();
      console.log("Respon dari backend (Login Step 1 POST):", data);

      if (response.ok && data.success) { // Jika sukses dan backend mengembalikan success: true
        localStorage.setItem("phone", phone); // Simpan nomor HP sementara
        router.push("/login-step-2"); // Redirect ke Login Step 2
      } else {
        // Jika backend mengembalikan success: false atau status error
        setError(data.message || "Nomor telepon tidak ditemukan. Silakan coba lagi!");
      }
    } catch (error) {
      console.error("Terjadi kesalahan dalam koneksi server:", error);
      setError("Terjadi kesalahan dalam koneksi server.");
    }
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
            <input
              type="tel"
              placeholder="Enter Your Number"
              className="w-full py-3 p-7 pt-5 border rounded-full text-left text-sm font-medium text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p className="text-sm text-gray-500">
            We'll call or text you to confirm your number. Standard message and data rates apply.
          </p>

          {/* Tombol Continue dan Register */}
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white py-3 rounded-full text-md font-medium hover:bg-blue-600 transition-all"
            >
              Continue
            </button>
            <button
              onClick={() => router.push("/register")}
              className="w-1/2 bg-gray-300 text-black py-3 rounded-full text-md font-medium hover:bg-gray-400 transition-all"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;