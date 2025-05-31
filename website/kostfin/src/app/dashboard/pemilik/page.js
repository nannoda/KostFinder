"use client";
import { useEffect, useState } from "react";

export default function PemilikDashboard() {
    const [bookings, setBookings] = useState([]);

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
    }, []);

    return (
        <section className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { title: 'Kost Terdaftar', count: 3, sub: '2 Aktif' },
                    { title: 'Booking Masuk', count: 5, sub: '1 Belum diproses' },
                    { title: 'Review Diterima', count: 8, sub: 'Rata-rata 4.5⭐' },
                    { title: 'Pendapatan Bulan Ini', count: 'Rp3.200.000', sub: 'Naik 12%' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow">
                        <div className="text-gray-600 text-sm mb-2">{item.title}</div>
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-gray-500 text-xs">{item.sub}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded shadow overflow-x-auto mb-10">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Permintaan Booking</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left">
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
                            <tr key={idx} className="border-t">
                                <td className="p-4">{booking.penghuni_nama}</td>
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
