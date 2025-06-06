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

    if (loading) return <div className="p-6 text-gray-500">⏳ Memuat detail kost...</div>;
    if (!kost) return <div className="p-6 text-red-600 font-semibold">❌ Data kost tidak ditemukan</div>;

    const gambar = kost.gambar_kost?.[0];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-indigo-700">📄 Detail Ajuan Kost</h1>

            {/* Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                {[gambar?.gambar1, gambar?.gambar2, gambar?.gambar3, gambar?.gambar4, gambar?.gambar5]
                    .filter(Boolean)
                    .map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`Gambar ${idx + 1}`}
                            className="w-full h-40 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
                        />
                    ))}
                {(!gambar || Object.values(gambar).every(v => !v)) && (
                    <div className="col-span-full text-gray-400 italic text-sm">
                        Tidak ada gambar kost yang tersedia.
                    </div>
                )}
            </div>

            {/* Detail Info */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">📌 Informasi Kost</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Detail label="Nama Kost" value={kost.nama} />
                    <Detail label="Pemilik" value={kost.pemilik_nama} />
                    <Detail label="Alamat" value={kost.alamat} />
                    <Detail label="Harga" value={`Rp${kost.harga.toLocaleString()}`} />
                    <Detail label="Tipe Kost" value={kost.tipe_kost} />
                    <Detail label="Fasilitas" value={kost.fasilitas} />
                    <Detail
                        label="Tanggal Ajuan"
                        value={new Date(kost.created_at).toLocaleDateString()}
                    />
                </div>
            </div>

            {/* Lokasi */}
            {kost.lokasi && (
                <div className="mb-8">
                    <a
                        href={kost.lokasi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-600 text-sm hover:text-blue-800 transition"
                    >
                        📍 Lihat lokasi di Google Maps
                    </a>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleAction("disetujui")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
                >
                    ✅ Setujui
                </button>
                <button
                    onClick={() => handleAction("ditolak")}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition"
                >
                    ❌ Tolak
                </button>
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="font-medium">{value || '-'}</span>
        </div>
    );
}
