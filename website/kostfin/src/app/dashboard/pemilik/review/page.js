"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";


export default function Review() {
    const [reviewList, setreviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            console.error("User belum login");
            return;
        }

        fetch(`http://localhost:8000/api/pencari/review`)
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter(
                    (r) => r.kost_pemilik_id == userId && r.status === "disetujui"
                );
                setreviewList(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch review:", err);
                setLoading(false);
            });
    }, []);

    const filteredReviews = reviewList.filter((r) => {
        const matchNama = r.penghuni_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.kost_nama.toLowerCase().includes(searchQuery.toLowerCase());

        const matchRating = ratingFilter === "all" || r.rating === parseInt(ratingFilter);

        const matchTanggal =
            (!startDate || new Date(r.tanggal) >= new Date(startDate)) &&
            (!endDate || new Date(r.tanggal) <= new Date(endDate));

        return matchNama && matchRating && matchTanggal;
    });

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <section className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold">Kelola Review</h1>

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
                            <div className="space-y-4">
                                {/* Rating Filter */}
                                <div>
                                    <label className="text-sm font-medium">Rating</label>
                                    <select
                                        value={ratingFilter}
                                        onChange={(e) => setRatingFilter(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    >
                                        <option value="all">Semua</option>
                                        <option value="5">5 Bintang</option>
                                        <option value="4">4 Bintang</option>
                                        <option value="3">3 Bintang</option>
                                        <option value="2">2 Bintang</option>
                                        <option value="1">1 Bintang</option>
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
                <p className="text-gray-500">Memuat data review...</p>
            ) : filteredReviews.length === 0 ? (
                <p className="text-gray-500">Tidak ada review yang ditemukan.</p>
            ) : (
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Reviewer</th>
                                <th className="p-4">Kost</th>
                                <th className="p-4">Komentar</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((review) => (
                                <tr
                                    key={review.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 font-medium">{review.penghuni_nama}</td>
                                    <td className="p-4">{review.kost_nama}</td>
                                    <td className="p-4">{review.komentar}</td>
                                    <td className="p-4 text-yellow-500">
                                        {"★".repeat(review.rating)}
                                    </td>
                                    <td className="p-4">{review.tanggal}</td>
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
