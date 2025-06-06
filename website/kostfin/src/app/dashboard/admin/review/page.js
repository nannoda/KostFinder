"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Review() {
    const [reviewList, setreviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reviewList.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(reviewList.length / itemsPerPage);

    useEffect(() => {
        fetch(`http://localhost:8000/api/pencari/review`)
            .then((res) => res.json())
            .then((data) => {
                setreviewList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch review:", err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kelola Review</h1>
            </div>

            {loading ? (
                <p className="text-gray-500">Memuat data review...</p>
            ) : reviewList.length === 0 ? (
                <p className="text-gray-500">Belum ada data review.</p>
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
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Aksi</th>
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
                                    <td className="p-4 capitalize text-yellow-500">{'★'.repeat(review.rating)}</td>
                                    <td className="p-4">{review.tanggal}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full
                                            ${review.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : review.status === "ditolak"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        <Button
                                            onClick={() => {
                                                if (
                                                    confirm("Apakah Anda yakin ingin menghapus review ini?")
                                                ) {
                                                    fetch(
                                                        `http://localhost:8000/api/pencari/review/${review.id}/`,
                                                        {
                                                            method: "DELETE",
                                                        }
                                                    )
                                                        .then(() =>
                                                            setreviewList((prev) =>
                                                                prev.filter((k) => k.id !== review.id)
                                                            )
                                                        )
                                                        .catch((err) =>
                                                            console.error("Gagal menghapus review:", err)
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
