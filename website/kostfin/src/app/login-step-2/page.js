"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginStep2 = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("John Doe");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(""); // 🔧 Tambahkan role
  const router = useRouter();
  const [userid, setUserid] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("phone");

    if (!phone) {
      router.push("/login");
      return;
    }

    // 🔍 Cek sebagai Pemilik
    fetch(`http://localhost:8000/api/pemilik/login?no_hp=${phone}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
          setUserRole("pemilik");
          localStorage.setItem("user_id", data.id);
          localStorage.setItem("user_role", "pemilik"); // ✅ Set user_role
          console.log("User ID:", data.id);
          console.log(localStorage.getItem("user_id"));
        } else {
          // 🔍 Jika bukan pemilik, cek sebagai pencari
          fetch(`http://localhost:8000/api/pencari/login?no_hp=${phone}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.username) {
                console.log("🔍 Data pencari:", data); // 👈 cek isi objek
                setUsername(data.username);
                setUserRole("pencari");
                localStorage.setItem("user_id", data.id); // ✅ Set user_id
                localStorage.setItem("user_role", "pencari"); // ✅ Set user_role
                console.log("User ID (pencari):", data.id);
              } else {
                setError("User tidak ditemukan");
              }
            })
            .catch((error) => console.error("❌ Error pencari:", error));
        }
      })
      .catch((error) => console.error("❌ Error pemilik:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole === "pemilik") {
      router.push("/dashboard/pemilik/"); // ✅ Redirect ke dashboard pemilik
    } else if (userRole === "pencari") {
      router.push("/"); // ✅ Atau redirect ke halaman utama pencari
    } else {
      setError("Gagal login. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-left text-black mb-3">Login</h2>
        <hr className="border-t border-gray-300 mb-6" />

        {/* Bagian Profil */}
        <div className="flex items-center mb-4">
          <img
            src="/profil/foto_default.png"
            alt="Profile Picture"
            className="w-12 h-12 rounded-full border shadow-lg"
          />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-black">
              Hello, {error ? "User tidak ditemukan" : username}
            </h3>
            <p
              className="text-sm text-gray-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Not You?
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Input Password */}
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <div className="relative w-full mx-auto">
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
