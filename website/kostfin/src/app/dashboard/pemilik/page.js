"use client";
import { useEffect, useState } from "react";

export default function PemilikDashboard() {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({
        jumlahKost: 0,
        kostAktif: 0,
        jumlahBooking: 0,
        bookingPending: 0,
        jumlahReview: 0,
        rataRating: 0,
        bookingData: []
    });

    const fetchStats = async () => {
        const pemilik_id = localStorage.getItem("user_id");

        const [kostRes, bookingRes, reviewRes] = await Promise.all([
            fetch("http://localhost:8000/api/pemilik/kost/"),
            fetch(`http://localhost:8000/api/pencari/booking?pemilik_id=${pemilik_id}`),
            fetch("http://localhost:8000/api/pencari/review/")
        ]);

        const kostData = await kostRes.json();
        const bookingData = await bookingRes.json();
        const reviewData = await reviewRes.json();

        // Filter data milik pemilik ini
        const pemilikKosts = kostData.filter(k => String(k.pemilik) === pemilik_id);
        const pemilikKostIds = pemilikKosts.map(k => k.id);

        const pemilikBookings = bookingData.filter(b => pemilikKostIds.includes(b.kost_id));
        const pemilikReviews = reviewData.filter(r => r.kost_pemilik_id == pemilik_id && r.status === "disetujui");

        // Hitung statistik
        const jumlahKost = pemilikKosts.filter(jk => jk.status === "disetujui").length;
        const kostAktif = pemilikKosts.filter(k => k.status_booking === "tersedia" && k.status === "disetujui").length;

        const jumlahBooking = pemilikBookings.length;
        const bookingPending = pemilikBookings.filter(b => b.status_booking === "pending").length;

        const jumlahReview = pemilikReviews.length;
        const totalRating = pemilikReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const rataRating = jumlahReview > 0 ? (totalRating / jumlahReview).toFixed(1) : 0;

        setStats({
            jumlahKost,
            kostAktif,
            jumlahBooking,
            bookingPending,
            jumlahReview,
            rataRating,
            bookingData
        });
    };


    const fetchBookings = async () => {
        const pemilik_id = localStorage.getItem("user_id");
        const res = await fetch(`http://localhost:8000/api/pencari/booking?pemilik_id=${pemilik_id}`);
        const data = await res.json();
        console.log("ID Pemilik:", pemilik_id);

        const pendingBooking = data.filter(booking => booking.status_booking === "pending");

        console.log("Pending Bookings:", pendingBooking);
        setBookings(pendingBooking);
    };

    const updateStatus = async (id, kost_id, status) => {
        // 1. Update status_booking
        await fetch(`http://localhost:8000/api/pencari/booking/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status_booking: status }),
        });

        // 2. Jika disetujui, ubah kost jadi tidak tersedia
        if (status === "disetujui") {
            await fetch(`http://localhost:8000/api/pemilik/kost/${kost_id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status_booking: "tidak tersedia" }),
            });
        }

        // Refresh data
        await fetchBookings();
    };

    useEffect(() => {
        fetchBookings();
        fetchStats();
    }, []);

    return (
        <section className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Beranda</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Card Stats */}
                {[
                    { title: 'Kost Terdaftar', count: stats.jumlahKost, sub: `${stats.kostAktif} Tersedia` },
                    { title: 'Booking Masuk', count: stats.jumlahBooking, sub: `${stats.bookingPending} Belum diproses` },
                    { title: 'Review Diterima', count: stats.jumlahReview, sub: `Rata-rata ${stats.rataRating}⭐` },
                    { title: 'Total Booking Disetujui', count: stats.bookingData.filter(b => b.status_booking === "disetujui").length, sub: `Oleh penyewa aktif` }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                        <div className="text-gray-600 text-sm">{item.title}</div>
                        <div className="text-3xl font-semibold">{item.count}</div>
                        <div className="text-gray-400 text-xs">{item.sub}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded shadow overflow-x-auto mb-10">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Permintaan Booking</h3>
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Penyewa</th>
                            <th className="p-4">Kamar</th>
                            <th className="p-4">Tanggal Masuk</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50 transition text-center">
                                <td className="p-4 font-medium">{booking.penghuni_nama}</td>
                                <td className="p-4">{booking.kost_nama}</td>
                                <td className="p-4">{booking.tanggal_masuk}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                        {booking.status_booking}
                                    </span>
                                </td>
                                <td className="p-4 text-center space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                        onClick={() => updateStatus(booking.id, booking.kost_id, "disetujui")}
                                    >
                                        Setuju
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                        onClick={() => updateStatus(booking.id, booking.kost_id, "ditolak")}
                                    >
                                        Tolak
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
