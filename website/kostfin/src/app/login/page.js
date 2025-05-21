"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [registeredPhonesPemilik, setRegisteredPhonesPemilik] = useState([]); // ✅ Nomor pemilik kost
  const [registeredPhonesPencari, setRegisteredPhonesPencari] = useState([]); // ✅ Nomor pencari kost
  const router = useRouter();

  // ✅ Ambil daftar nomor HP dari backend saat halaman dimuat
  useEffect(() => {
    fetch("http://localhost:8000/api/pemilik/login/")
      .then((res) => res.json())
      .then((data) => setRegisteredPhonesPemilik(data.map(item => item.no_hp))) // ✅ Simpan daftar nomor Pemilik
      .catch((error) => console.error("Error:", error));

    fetch("http://localhost:8000/api/pencari/login/")
      .then((res) => res.json())
      .then((data) => setRegisteredPhonesPencari(data.map(item => item.no_hp))) // ✅ Simpan daftar nomor Pencari
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let apiURL = "";

    if (registeredPhonesPemilik.includes(phone)) {
      apiURL = "http://localhost:8000/api/pemilik/login/"; // ✅ API Login Pemilik
    } else if (registeredPhonesPencari.includes(phone)) {
      apiURL = "http://localhost:8000/api/pencari/login/"; // ✅ API Login Pencari
    } else {
      setError("Nomor tidak ditemukan, silakan coba lagi!");
      return;
    }

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_hp: phone }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("phone", phone); // ✅ Simpan nomor HP sementara
        router.push("/login-step-2"); // ✅ Redirect ke Login Step 2
      } else {
        setError(data.error || "Nomor telepon tidak ditemukan. Silakan coba lagi!");
      }
    } catch (error) {
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

          {error && <p className="text-red-500 text-sm">{error}</p>} {/* ✅ Tampilkan error jika ada */}

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