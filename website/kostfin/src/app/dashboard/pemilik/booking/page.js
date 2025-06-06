"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Booking() {
    const [bookingList, setbookingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookingList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookingList.length / itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            const pemilikId = localStorage.getItem("user_id");
            if (!pemilikId) {
                console.error("User belum login");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/pencari/booking?pemilik_id=${pemilikId}`);
                const data = await res.json();
                setbookingList(data);
            } catch (err) {
                console.error("Gagal fetch booking:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Kelola Booking</h1>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Penyewa</th>
                                <th className="p-4">Kost</th>
                                <th className="p-4">Tanggal Masuk</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((booking) => (
                                <tr key={booking.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4">{booking.penghuni_nama}</td>
                                    <td className="p-4">{booking.kost_nama}</td>
                                    <td className="p-4">{booking.tanggal_masuk}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full
                                            ${booking.status_booking === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : booking.status_booking === "ditolak"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {booking.status_booking}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        <Button
                                            onClick={() => window.location.href = `booking/edit-booking/${booking.id}`}
                                            className="bg-blue-500 text-white hover:bg-blue-600 rounded"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                if (confirm("Apakah Anda yakin ingin menghapus booking ini?")) {
                                                    try {
                                                        // 1. Ubah status kost menjadi tersedia
                                                        await fetch(`http://localhost:8000/api/pemilik/kost/${booking.kost_id}/`, {
                                                            method: "PATCH",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({ status_booking: "tersedia" }),
                                                        });

                                                        // 2. Hapus data booking
                                                        await fetch(`http://localhost:8000/api/pencari/booking/${booking.id}/`, {
                                                            method: "DELETE",
                                                        });

                                                        // 3. Update list booking setelah dihapus
                                                        setbookingList((prev) => prev.filter((k) => k.id !== booking.id));
                                                    } catch (err) {
                                                        console.error("Gagal menghapus booking atau memperbarui kost:", err);
                                                        alert("Terjadi kesalahan saat menghapus booking.");
                                                    }
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-center mt-4 space-x-2">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 text-sm ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
                    >
                        {i + 1}
                    </Button>
                ))}
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
