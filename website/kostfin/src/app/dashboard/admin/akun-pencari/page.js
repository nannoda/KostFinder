"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function AkunPencari() {
    const [pencariList, setpencariList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pencariList.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(pencariList.length / itemsPerPage);

    useEffect(() => {
        fetch(`http://localhost:8000/api/pencari/penghuni/`)
            .then((res) => res.json())
            .then((data) => {
                setpencariList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch pencari:", err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kelola akun</h1>
            </div>

            {loading ? (
                <p className="text-gray-500">Memuat data pencari...</p>
            ) : pencariList.length === 0 ? (
                <p className="text-gray-500">Belum ada data pencari.</p>
            ) : (
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Usename</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">No HP</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((pencari) => (
                                <tr
                                    key={pencari.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 font-medium">{pencari.nama}</td>
                                    <td className="p-4">{pencari.username}</td>
                                    <td className="p-4">{pencari.email}</td>
                                    <td className="p-4 capitalize">{pencari.no_hp}</td>
                                    <td className="p-4 text-center space-x-2">
                                        <Button
                                            onClick={() =>
                                                (window.location.href = `akun-pencari/edit-pencari/${pencari.id}`)
                                            }
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (
                                                    confirm("Apakah Anda yakin ingin menghapus akun ini?")
                                                ) {
                                                    fetch(
                                                        `http://localhost:8000/api/pencari/penghuni/${pencari.id}/`,
                                                        {
                                                            method: "DELETE",
                                                        }
                                                    )
                                                        .then(() =>
                                                            setpencariList((prev) =>
                                                                prev.filter((k) => k.id !== pencari.id)
                                                            )
                                                        )
                                                        .catch((err) =>
                                                            console.error("Gagal menghapus akun:", err)
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
