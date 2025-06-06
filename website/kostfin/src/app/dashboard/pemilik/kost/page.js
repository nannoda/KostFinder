"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function KostSaya() {
    const [kostList, setKostList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = kostList.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(kostList.length / itemsPerPage);


    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        console.log("User ID:", userId); // Debugging: Cek apakah userId ada

        if (!userId) {
            console.error("User belum login");
            return;
        }

        fetch(`http://localhost:8000/api/pemilik/kost/`)
            .then((res) => res.json())
            .then((data) => {
                const userKost = data.filter(kost => kost.pemilik == userId);
                setKostList(userKost);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch kost:", err);
                setLoading(false);
            });
    }, []);

    const handleTambahKost = () => {
        window.location.href = "kost/tambah-kost";
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Kelola Kost</h1>
                <Button onClick={handleTambahKost} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Kost
                </Button>
            </div>

            {loading ? (
                <p>Loading...</p>
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
                                            <span>{kost.rating ?? '-'}</span>
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
                                            onClick={() => window.location.href = `kost/edit-kost/${kost.id}`}
                                            className="bg-blue-500 text-white hover:bg-blue-600 rounded"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Button>
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
        </div>
    );
}
