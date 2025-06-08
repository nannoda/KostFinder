// C:\Users\LENOVO\Documents\GitHub\KostFinder\website\kostfin\src\app\profile\page.jsx

"use client"; // PENTING: Harus ada ini untuk menggunakan React Hooks (useState, useEffect)

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
// import { Star } from 'lucide-react'; // Uncomment jika menggunakan ikon bintang dari lucide-react

// --- IMPOR KOMPONEN HEADER DAN FOOTER ANDA ---
// Perhatikan path relatifnya. Dari src/app/profile, Anda harus mundur dua tingkat (../../)
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ProfilePage = () => {
  const router = useRouter(); // INISIALISASI useRouter
  // State untuk menyimpan data profil pengguna yang diambil dari backend
  const [userProfile, setUserProfile] = useState(null);
  // State untuk menunjukkan apakah data sedang dimuat
  const [loading, setLoading] = useState(true);
  // State untuk menunjukkan pesan error jika terjadi
  const [error, setError] = useState(null);

  // Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const userPhone = localStorage.getItem("phone"); // Mengambil nomor HP dari localStorage
      if (!userPhone) {
        // Jika nomor HP tidak ada (pengguna belum login), tampilkan error dan berhenti
        setError("Anda belum login. Nomor HP tidak ditemukan di penyimpanan lokal. Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }

      try {
        // Memanggil API login untuk mendapatkan data profil lengkap berdasarkan nomor HP
        const API_URL = `http://localhost:8000/api/pencari/login/?no_hp=${userPhone}`;
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserProfile(data); // Data lengkap dari backend akan disimpan di sini

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
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Header untuk halaman Profil */}

      <main className="flex-grow p-4 md:p-8 lg:p-12"> {/* Pertahankan padding di sini */}
        {/* Konten utama halaman profil Anda, sesuai desain */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Bagian Atas: Nama dan Tanggal Bergabung */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Hello, {userProfile.nama || userProfile.username || "Pengguna"}</h1>
            <p className="text-gray-500">Joined in N/A</p>
          </div>

          {/* Grid Layout untuk Konten Utama Profil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kolom Kiri: Foto Profil & Informasi Identitas */}
            <div className="md:col-span-1 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src={userProfile.profile_image || userProfile.gambar_profil || "/profil/foto_default.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* ✅ HAPUS BARIS BUTTON INI */}
                {/* <button className="text-blue-600 hover:underline">Upload a Photo</button> */}
              </div>

              {/* Detail Identitas di bawah "Identity Verification" */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Identity Verification</h2>
                <p className="text-gray-700 text-base mb-1">
                  <strong>Nama:</strong> {userProfile.nama || 'N/A'}
                </p>
                <p className="text-gray-700 text-base mb-1">
                  <strong>Username:</strong> {userProfile.username || 'N/A'}
                </p>
                <p className="text-gray-700 text-base mb-1">
                  <strong>Email:</strong> {userProfile.email || 'N/A'}
                </p>
                <p className="text-gray-700 text-base mb-2">
                  <strong>No. HP:</strong> {userProfile.no_hp || 'N/A'}
                </p>

                {/* Status Konfirmasi Email dan Mobile */}
                <p className={`${userProfile.email_confirmed ? 'text-green-600' : 'text-red-500'} flex items-center mb-1 text-sm`}>
                  {userProfile.email_confirmed ? (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  Email {userProfile.email_confirmed ? "Confirmed" : "Not Confirmed"}
                </p>
                <p className={`${userProfile.mobile_confirmed ? 'text-green-600' : 'text-red-500'} flex items-center text-sm`}>
                  {userProfile.mobile_confirmed ? (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  Mobile {userProfile.mobile_confirmed ? "Confirmed" : "Not Confirmed"}
                </p>
              </div>

            </div>

            {/* Kolom Kanan: Edit Profile, Review, dll. */}
            <div className="md:col-span-2 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6"> {/* Menggunakan flex dan justify-between */}
                <Link href="/edit-profile">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    Edit Profile
                  </button>
                </Link>
                <button
                  onClick={() => router.push('/')} // Navigasi ke halaman home
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Kembali
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  {userProfile.reviews || 0} Reviews
                </h2>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Reviewed By You</h2>
                <p className="text-gray-600">
                  Tidak ada review yang diberikan.
                </p>
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