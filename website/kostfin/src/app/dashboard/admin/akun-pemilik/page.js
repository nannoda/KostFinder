"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function AkunPemilik() {
    const [pemilikList, setPemilikList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetch(`http://localhost:8000/api/pemilik/pemilik/`)
            .then((res) => res.json())
            .then((data) => {
                setPemilikList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch pemilik:", err);
                setLoading(false);
            });
    }, []);

    const filteredList = pemilikList.filter((pemilik) =>
        pemilik.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    return (
        <section className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold">Kelola Akun</h1>

                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Cari nama..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
            </div>


            {loading ? (
                <p className="text-gray-500">Memuat data pemilik...</p>
            ) : filteredList.length === 0 ? (
                <p className="text-gray-500">Tidak ada pemilik yang cocok.</p>
            ) : (
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Alamat</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">No HP</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((pemilik) => (
                                <tr key={pemilik.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium">{pemilik.nama}</td>
                                    <td className="p-4">{pemilik.username}</td>
                                    <td className="p-4 max-w-[200px] truncate">{pemilik.alamat_kost}</td>
                                    <td className="p-4">{pemilik.email}</td>
                                    <td className="p-4">{pemilik.no_hp}</td>
                                    <td className="p-4 text-center space-x-2">
                                        <Button
                                            onClick={() =>
                                                (window.location.href = `akun-pemilik/edit-pemilik/${pemilik.id}`)
                                            }
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
                                                    fetch(
                                                        `http://localhost:8000/api/pemilik/pemilik/${pemilik.id}/`,
                                                        {
                                                            method: "DELETE",
                                                        }
                                                    )
                                                        .then(() =>
                                                            setPemilikList((prev) =>
                                                                prev.filter((k) => k.id !== pemilik.id)
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

            {/* Pagination */}
            {filteredList.length > itemsPerPage && (
                <div className="flex justify-center mt-4 space-x-2">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 text-sm ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </section>
    );
}
