"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Admin() {
    const [ajuanKost, setAjuanKost] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [jumlahKost, setJumlahKost] = useState(0);
    const [jumlahReview, setJumlahReview] = useState(0);
    const [jumlahPencari, setJumlahPencari] = useState(0);
    const [jumlahPemilik, setJumlahPemilik] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    resKost,
                    resReview,
                    resPencari,
                    resPemilik,
                    resBooking
                ] = await Promise.all([
                    fetch("http://localhost:8000/api/pemilik/kost/"),
                    fetch("http://localhost:8000/api/pencari/review/"),
                    fetch("http://localhost:8000/api/pencari/penghuni/"),
                    fetch("http://localhost:8000/api/pemilik/pemilik/"),
                ]);

                const dataKost = await resKost.json();
                const dataReview = await resReview.json();
                const dataPencari = await resPencari.json();
                const dataPemilik = await resPemilik.json();

                const pendingKost = dataKost.filter(k => k.status === "pending");
                const pendingReview = dataReview.filter(r => r.status === "pending");

                setAjuanKost(pendingKost);
                setReviews(pendingReview);

                setJumlahKost(dataKost.length);
                setJumlahReview(dataReview.length);
                setJumlahPencari(dataPencari.length);
                setJumlahPemilik(dataPemilik.length);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
            }
        }

        fetchData();
    }, []);

    async function updateStatus(id, statusBaru) {
        try {
            const res = await fetch(`http://localhost:8000/api/pencari/review/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: statusBaru })
            });

            if (res.ok) {
                setReviews(prev => prev.filter(r => r.id !== id));
            } else {
                console.error("Gagal mengubah status review");
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <section className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Beranda</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { title: 'Kost', count: jumlahKost, sub: `${ajuanKost.length} Menunggu` },
                    { title: 'Review', count: jumlahReview, sub: `${reviews.length} Menunggu` },
                    { title: 'Pencari Kost', count: jumlahPencari, sub: 'Aktif' },
                    { title: 'Pemilik Kost', count: jumlahPemilik, sub: 'Aktif' }
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                    >
                        <div className="text-sm text-gray-500">{item.title}</div>
                        <div className="text-3xl font-semibold text-gray-800">{item.count}</div>
                        <div className="text-xs text-gray-400">{item.sub}</div>
                    </div>
                ))}
            </div>

            {/* Ajuan Kost Table */}
            <div className="bg-white rounded shadow overflow-x-auto mb-10">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Ajuan Kost</h3>
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Nama Kost</th>
                            <th className="p-4">Pemilik</th>
                            <th className="p-4">Tanggal Ajuan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ajuanKost.map((kost, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50 transition text-center">
                                <td className="p-4 font-medium">{kost.nama}</td>
                                <td className="p-4">{kost.pemilik_nama || "Tidak diketahui"}</td>
                                <td className="p-4">{new Date(kost.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                                        Menunggu
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <Link href={`admin/detail-ajuan/${kost.id}`}>
                                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded text-xs transition">
                                            Detail
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Review Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Review Kost</h3>
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Pengguna</th>
                            <th className="p-4">Kost</th>
                            <th className="p-4">Review</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50 transition text-center">
                                <td className="p-4 font-medium">{review.penghuni_nama || "Anonim"}</td>
                                <td className="p-4">{review.kost_nama || "Tidak diketahui"}</td>
                                <td className="p-4 text-gray-600">{review.komentar}</td>
                                <td className="p-4">
                                    <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                                    <span className="text-gray-400 ml-1">({review.rating})</span>
                                </td>
                                <td className="p-4">{new Date(review.tanggal).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                        Menunggu
                                    </span>
                                </td>
                                <td className="p-4 text-center space-x-2">
                                    <button
                                        onClick={() => updateStatus(review.id, "disetujui")}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition"
                                    >
                                        Setuju
                                    </button>
                                    <button
                                        onClick={() => updateStatus(review.id, "ditolak")}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                                    >
                                        Tolak
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
