"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function KostSaya() {
    const [kostList, setKostList] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <table className="w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">Nama Kost</th>
                            <th className="p-2 border">Harga</th>
                            <th className="p-2 border">Fasilitas</th>
                            <th className="p-2 border">Tipe</th>
                            <th className="p-2 border">Rating</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kostList.map((kost) => {
                            return (
                                <tr key={kost.id} className="text-center">
                                    <td className="p-2 border">{kost.nama}</td>
                                    <td className="p-2 border">Rp {kost.harga.toLocaleString()}</td>
                                    <td className="p-2 border">{kost.fasilitas}</td>
                                    <td className="p-2 border">{kost.tipe_kost}</td>
                                    <td className="p-2 border">{kost.rating}</td>
                                    <td className="p-2 border">{kost.status}</td>
                                    <td className="p-2 border">
                                        <Button
                                            onClick={() => window.location.href = `kost/edit-kost/${kost.id}`}
                                            className="bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (confirm("Apakah Anda yakin ingin menghapus kost ini?")) {
                                                    fetch(`http://localhost:8000/api/pemilik/kost/${kost.id}/`, {
                                                        method: 'DELETE',
                                                    })
                                                        .then(() => {
                                                            setKostList(kostList.filter(k => k.id !== kost.id));
                                                        })
                                                        .catch((err) => console.error("Gagal menghapus kost:", err));
                                                }
                                            }}
                                            className="bg-red-500 text-white hover:bg-red-600 ml-2"
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            )}
        </div>
    );
}
