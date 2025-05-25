'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DetailAjuanPage() {
    const { id } = useParams();
    const router = useRouter();
    const [kost, setKost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`http://localhost:8000/api/pemilik/kost/${id}/`);
                const data = await res.json();
                setKost(data);
            } catch (err) {
                console.error("Gagal memuat data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [id]);

    const handleAction = async (status) => {
        try {
            await fetch(`http://localhost:8000/api/pemilik/kost/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            alert(`Kost telah ${status === "disetujui" ? "disetujui" : "ditolak"}`);
            router.push("/dashboard/admin");
        } catch (err) {
            console.error("Gagal mengubah status", err);
        }
    };

    if (loading) return <div className="p-6">Memuat...</div>;
    if (!kost) return <div className="p-6 text-red-500">Data tidak ditemukan</div>;

    const gambar = kost.gambar_kost?.[0];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Detail Ajuan Kost</h1>

            {/* Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[gambar?.gambar1, gambar?.gambar2, gambar?.gambar3, gambar?.gambar4, gambar?.gambar5]
                    .filter(Boolean)
                    .map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`Gambar ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow"
                        />
                    ))}
            </div>

            {/* Detail Info */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Nama Kost:</strong> {kost.nama}</div>
                    <div><strong>Pemilik:</strong> {kost.pemilik_nama}</div>
                    <div><strong>Alamat:</strong> {kost.alamat}</div>
                    <div><strong>Harga:</strong> Rp{kost.harga.toLocaleString()}</div>
                    <div><strong>Tipe Kost:</strong> {kost.tipe_kost}</div>
                    <div><strong>Fasilitas:</strong> {kost.fasilitas}</div>
                    <div>
                        <strong>Tanggal Ajuan:</strong> {new Date(kost.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Lokasi */}
            <div className="mb-6">
                <a
                    href={kost.lokasi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                >
                    📍 Lihat lokasi di Google Maps
                </a>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleAction("disetujui")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                >
                    ✅ Setujui
                </button>
                <button
                    onClick={() => handleAction("ditolak")}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
                >
                    ❌ Tolak
                </button>
            </div>
        </div>
    );
}
