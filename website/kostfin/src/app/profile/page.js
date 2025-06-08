"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ProfilePage = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const userPhone = localStorage.getItem("phone");
      const role = localStorage.getItem("user_role");
      setUserRole(role); // simpan role ke state

      if (!userPhone) {
        setError("Anda belum login. Nomor HP tidak ditemukan di penyimpanan lokal. Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }

      try {
        // Tentukan endpoint berdasarkan role
        const baseURL = "http://localhost:8000/api";
        const endpoint =
          role === "pemilik"
            ? `${baseURL}/pemilik/login/?no_hp=${userPhone}`
            : `${baseURL}/pencari/login/?no_hp=${userPhone}`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data profil pengguna:", data);
        setUserProfile(data);
      } catch (err) {
        console.error("Gagal mengambil data profil:", err);
        setError(`Gagal memuat profil: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Efek ini hanya berjalan sekali saat komponen dimuat

  // --- Tampilan Loading, Error, atau Data Profil ---

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
          <p className="text-gray-600 text-xl">Memuat data profil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="text-sm mt-2">Pastikan nomor HP yang Anda gunakan untuk login terdaftar dan server backend berjalan dengan benar.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
          <p className="text-gray-600 text-xl">Tidak ada data profil yang tersedia untuk nomor HP Anda.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Tampilan Profil Jika Data Berhasil Dimuat ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow p-6 md:p-10 lg:p-14">
        <div className="max-w-5xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex items-center gap-8 p-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0 self-start">
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={userProfile.profile_image || userProfile.gambar_profil || "/profil/foto_default.png"}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-grow mt-6 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {userProfile.nama || userProfile.username || "Pengguna"}
                </h1>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
                  <div>
                    <p className="text-gray-600 font-medium">Username</p>
                    <p className="text-gray-800">{userProfile.username || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Email</p>
                    <p className="text-gray-800">{userProfile.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Nomor HP</p>
                    <p className="text-gray-800">{userProfile.no_hp || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Role</p>
                    <p className="capitalize text-gray-800">{userRole || "Tidak Diketahui"}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-start gap-4">
                  <Link href="/edit-profile">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition duration-200">
                      Edit Profil
                    </button>
                  </Link>
                  <button
                    onClick={() => router.push(userRole === "pemilik" ? "/dashboard/pemilik" : "/")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow-sm transition duration-200"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>

  );
};

export default ProfilePage;