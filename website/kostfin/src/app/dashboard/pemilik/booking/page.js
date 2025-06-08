"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function Booking() {
    const [bookingList, setbookingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


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

    // Filter hasil berdasarkan pencarian nama penyewa atau kost
    const filteredBookings = bookingList.filter((booking) => {
        const matchSearch =
            booking.penghuni_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.kost_nama.toLowerCase().includes(searchQuery.toLowerCase());

        const matchStatus =
            statusFilter === "all" || booking.status_booking === statusFilter;

        const matchDate =
            (!startDate || new Date(booking.tanggal_masuk) >= new Date(startDate)) &&
            (!endDate || new Date(booking.tanggal_masuk) <= new Date(endDate));

        return matchSearch && matchStatus && matchDate;
    });

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">Kelola Booking</h1>

                <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Cari penyewa atau kost..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>

                    {/* Filter Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-64 p-4 bg-white rounded-lg shadow-lg border">
                            <div className="space-y-4">
                                {/* Status Booking */}
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    >
                                        <option value="all">Semua</option>
                                        <option value="pending">Pending</option>
                                        <option value="ditolak">Ditolak</option>
                                        <option value="disetujui">Disetujui</option>
                                    </select>
                                </div>

                                {/* Tanggal dari */}
                                <div>
                                    <label className="text-sm font-medium">Tanggal dari</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Tanggal sampai */}
                                <div>
                                    <label className="text-sm font-medium">Tanggal sampai</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
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
                                    <td className="p-4 font-medium">{booking.penghuni_nama}</td>
                                    <td className="p-4">{booking.kost_nama}</td>
                                    <td className="p-4">{booking.tanggal_masuk}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full
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
                                                        await fetch(`http://localhost:8000/api/pemilik/kost/${booking.kost_id}/`, {
                                                            method: "PATCH",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({ status_booking: "tersedia" }),
                                                        });

                                                        await fetch(`http://localhost:8000/api/pencari/booking/${booking.id}/`, {
                                                            method: "DELETE",
                                                        });

                                                        setbookingList((prev) => prev.filter((k) => k.id !== booking.id));
                                                    } catch (err) {
                                                        console.error("Gagal menghapus booking:", err);
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
