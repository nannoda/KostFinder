"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

export default function KostSaya() {
    const [kostList, setKostList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [tipeFilter, setTipeFilter] = useState("all");
    const [reviewData, setReviewData] = useState([]);
    const [ratingMap, setRatingMap] = useState({});

    const filteredKost = kostList.filter((kost) => {
        const matchSearch =
            kost.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kost.fasilitas.toLowerCase().includes(searchQuery.toLowerCase());

        const matchStatus = statusFilter === "all" || kost.status === statusFilter;
        const matchTipe = tipeFilter === "all" || kost.tipe_kost === tipeFilter;

        return matchSearch && matchStatus && matchTipe;
    });

    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(filteredKost.length / itemsPerPage);
    const currentItems = filteredKost.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        // Fetch data kost
        fetch("http://localhost:8000/api/pemilik/kost/")
            .then((res) => res.json())
            .then((data) => {
                setKostList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch kost:", err);
                setLoading(false);
            });

        // Fetch review & hitung rata-rata rating (hanya review disetujui)
        fetch("http://127.0.0.1:8000/api/pencari/review/")
            .then((res) => res.json())
            .then((reviews) => {
                // Hanya review dengan status disetujui
                const approvedReviews = reviews.filter((r) => r.status === "disetujui");
                setReviewData(approvedReviews);
                // Kelompokkan dan hitung rata-rata rating
                const grouped = {};
                approvedReviews.forEach((r) => {
                    if (!grouped[r.kost]) grouped[r.kost] = [];
                    grouped[r.kost].push(r.rating);
                });

                const avgMap = {};
                Object.entries(grouped).forEach(([kostId, ratings]) => {
                    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                    avgMap[kostId] = avg.toFixed(1);
                });

                setRatingMap(avgMap);
            })
            .catch((err) => console.error("Gagal fetch review:", err));
    }, []);

    return (
        <section className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold">Kelola Kost</h1>

                <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Cari reviewer atau kost..."
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
                            <div className="space-y-4 text-sm">
                                <div>
                                    <label>Status Kost</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="all">Semua</option>
                                        <option value="pending">Pending</option>
                                        <option value="disetujui">Disetujui</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Tipe Kost</label>
                                    <select
                                        value={tipeFilter}
                                        onChange={(e) => setTipeFilter(e.target.value)}
                                        className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="all">Semua</option>
                                        <option value="putra">Putra</option>
                                        <option value="putri">Putri</option>
                                        <option value="campur">Campur</option>
                                    </select>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500">Memuat data kost...</p>
            ) : kostList.length === 0 ? (
                <p className="text-gray-500">Belum ada data kost.</p>
            ) : (
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Nama Kost</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Fasilitas</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((kost) => (
                                <tr
                                    key={kost.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 font-medium">{kost.nama}</td>
                                    <td className="p-4">Rp {kost.harga.toLocaleString()}</td>
                                    <td className="p-4">{kost.fasilitas}</td>
                                    <td className="p-4 capitalize">{kost.tipe_kost}</td>
                                    <td className="p-4 text-sm text-gray-700">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500 text-base">★</span>
                                            <span>{ratingMap[kost.id] ?? "-"}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full
                                            ${kost.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : kost.status === "ditolak"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {kost.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        <Button
                                            onClick={() => {
                                                if (
                                                    confirm("Apakah Anda yakin ingin menghapus kost ini?")
                                                ) {
                                                    fetch(
                                                        `http://localhost:8000/api/pemilik/kost/${kost.id}/`,
                                                        {
                                                            method: "DELETE",
                                                        }
                                                    )
                                                        .then(() =>
                                                            setKostList((prev) =>
                                                                prev.filter((k) => k.id !== kost.id)
                                                            )
                                                        )
                                                        .catch((err) =>
                                                            console.error("Gagal menghapus kost:", err)
                                                        );
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
        </section>
    );
}
