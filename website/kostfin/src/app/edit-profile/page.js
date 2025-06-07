// C:\Users\LENOVO\Documents\GitHub\KostFinder\website\kostfin\src\app\edit-profile\page.jsx

"use client"; // Ini adalah Client Component karena menggunakan state dan hooks

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header'; // Sesuaikan path jika berbeda (misal: ../../components/Header)
import Footer from '../../components/Footer'; // Sesuaikan path jika berbeda (misal: ../../components/Footer)
import { useRouter } from 'next/navigation'; // Untuk navigasi setelah save

const EditProfilePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    email: '',
    no_hp: ''
  });
  const [userProfileId, setUserProfileId] = useState(null); // Untuk menyimpan ID profil yang akan diedit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // useEffect untuk mengambil data profil saat ini untuk mengisi form
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setLoading(true);
      setError(null);
      const userPhone = localStorage.getItem("phone"); // Mengambil nomor HP dari localStorage

      if (!userPhone) {
        setError("Nomor HP tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      try {
        // Mengambil data profil dari API login (untuk mendapatkan ID dan data awal)
        const API_FETCH_URL = `http://localhost:8000/api/pencari/login/?no_hp=${userPhone}`;
        const response = await fetch(API_FETCH_URL);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Gagal mengambil data: ${response.status}`);
        }

        const data = await response.json();
        // Simpan ID profil untuk digunakan saat update
        setUserProfileId(data.id);
        setFormData({
          nama: data.nama || '',
          username: data.username || '',
          email: data.email || '',
          no_hp: data.no_hp || ''
        });
      } catch (err) {
        console.error("Error fetching current profile for edit:", err);
        setError(`Gagal memuat data profil saat ini: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []); // Hanya jalankan sekali saat komponen dimuat

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!userProfileId) {
      setError("ID pengguna tidak ditemukan. Tidak dapat menyimpan perubahan.");
      setLoading(false);
      return;
    }

    try {
      // API_URL untuk PATCH/PUT ke PenghuniKostViewSet berdasarkan ID
      // Ini akan menjadi seperti: http://localhost:8000/api/pencari/penghuni/4/
      const API_UPDATE_URL = `http://localhost:8000/api/pencari/penghuni/${userProfileId}/`;
      // TIDAK ADA PENGAMBILAN TOKEN DARI LOCALSTORAGE KARENA ANDA TIDAK MENGGUNAKANNYA

      const response = await fetch(API_UPDATE_URL, {
        method: 'PATCH', // Menggunakan PATCH untuk update sebagian
        headers: {
          'Content-Type': 'application/json',
          // TIDAK ADA HEADER 'Authorization' DI SINI KARENA ANDA TIDAK MENGGUNAKAN TOKEN
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || `Gagal menyimpan: ${response.status}`);
      }

      // ✅ BARIS PENTING: PERBARUI NOMOR HP DI LOCALSTORAGE SETELAH BERHASIL SAVE
      localStorage.setItem("phone", formData.no_hp); // Simpan nomor HP yang baru

      setSuccessMessage("Profil berhasil diperbarui!");
      // Setelah berhasil, arahkan kembali ke halaman profil
      router.push('/profile');

    } catch (err) {
      console.error("Error saving profile:", err);
      setError(`Gagal menyimpan profil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan Loading/Error saat fetch data awal
  if (loading && userProfileId === null) { // userProfileId akan null jika belum ada fetch data awal
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
          <p className="text-gray-600 text-xl">Memuat form edit profil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && userProfileId === null) { // Jika ada error saat fetch awal
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="text-sm mt-2">Pastikan server backend berjalan dan data profil valid.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Jika userProfileId masih null setelah loading selesai (misal gagal fetch)
  if (userProfileId === null) {
      return (
          <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
                  <p className="text-red-500 text-xl">Data pengguna tidak ditemukan untuk mengedit profil. Silakan coba lagi.</p>
              </main>
              <Footer />
          </div>
      );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8 lg:p-12">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Profil</h1>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="no_hp" className="block text-gray-700 text-sm font-bold mb-2">No. HP:</label>
              <input
                type="tel" // type="tel" untuk nomor telepon
                id="no_hp"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => router.back()} // Kembali ke halaman sebelumnya (profil)
                className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfilePage;