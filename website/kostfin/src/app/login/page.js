// LoginPage.js (Login Step 1)

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [registeredPhonesPemilik, setRegisteredPhonesPemilik] = useState([]);
  const [registeredPhonesPencari, setRegisteredPhonesPencari] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/pemilik/login/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setRegisteredPhonesPemilik(data.map(item => item.no_hp));
        }
      })
      .catch((error) => console.error("❌ Error fetching pemilik phones:", error));

    fetch("http://localhost:8000/api/pencari/login/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setRegisteredPhonesPencari(data.map(item => item.no_hp));
        }
      })
      .catch((error) => console.error("❌ Error fetching pencari phones:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("Nomor telepon tidak boleh kosong.");
      return;
    }

    let apiURL = "";
    let userTypeDetected = null; // ✅ State untuk menyimpan userType

    if (registeredPhonesPemilik.includes(phone)) {
      apiURL = "http://localhost:8000/api/pemilik/login/";
      userTypeDetected = "pemilik"; // ✅ Set userType
    } else if (registeredPhonesPencari.includes(phone)) {
      apiURL = "http://localhost:8000/api/pencari/login/";
      userTypeDetected = "pencari"; // ✅ Set userType
    } else {
      setError("Nomor tidak ditemukan, silakan coba lagi!");
      return;
    }

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_hp: phone }), // Hanya kirim no_hp
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("phone", phone);
        localStorage.setItem("userType", userTypeDetected); // ✅ SIMPAN USER TYPE DI LOCALSTORAGE
        router.push("/login-step-2");
      } else {
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