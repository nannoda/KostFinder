"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Admin() {
    const [ajuanKost, setAjuanKost] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchAjuan() {
            try {
                const res = await fetch("http://localhost:8000/api/pemilik/kost/");
                const data = await res.json();

                // Filter kost dengan status "pending"
                const pendingKost = data.filter(kost => kost.status === "pending");

                setAjuanKost(pendingKost);
            } catch (error) {
                console.error("Gagal mengambil data ajuan kost:", error);
            }
        }

        fetchAjuan();
    }, []);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch("http://localhost:8000/api/pencari/review/");
                const data = await res.json();
                const pendingReviews = data.filter(r => r.status === "pending");

                console.log("semua Reviews:", data);
                console.log("Pending Reviews:", pendingReviews);
                setReviews(pendingReviews);
            } catch (error) {
                console.error("Gagal mengambil data review:", error);
            }
        }

        fetchReviews();
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
                setReviews(prev => prev.filter(r => r.id !== id)); // hapus dari tampilan
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
                <h2 className="text-xl font-semibold">KostFinder</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { title: 'Kost', count: 18, sub: '15 Accepted' },
                    { title: 'Reviews', count: 132, sub: '98 Accepted' },
                    { title: 'Teams', count: 12, sub: '1 Completed' },
                    { title: 'Productivity', count: '76%', sub: '5% Completed' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow">
                        <div className="text-gray-600 text-sm mb-2">{item.title}</div>
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-gray-500 text-xs">{item.sub}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-x-auto mb-10">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Ajuan Kost</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-4">Nama Kost</th>
                            <th className="p-4">Pemilik</th>
                            <th className="p-4">Tanggal Ajuan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    {ajuanKost.map((kost, idx) => (
                        <tbody key={idx}>
                            <tr key={idx} className="border-t">
                                <td className="p-4">{kost.nama}</td>
                                <td className="p-4">{kost.pemilik_nama || "Tidak diketahui"}</td>
                                <td className="p-4">{new Date(kost.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                        Menunggu
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <Link href={`admin/detail-ajuan/${kost.id}`}>
                                        <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-xs">
                                            Detail
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>

            {/* TABEL Review Kost */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Review Kost</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left">
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
                            <tr key={idx} className="border-t">
                                <td className="p-4">{review.penghuni_nama || "Anonim"}</td>
                                <td className="p-4">{review.kost_nama || "Tidak diketahui"}</td>
                                <td className="p-4">{review.komentar}</td>
                                <td className="p-4">{'⭐'.repeat(review.rating)}</td>
                                <td className="p-4">{new Date(review.tanggal).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                        Menunggu
                                    </span>
                                </td>
                                <td className="p-4 text-center space-x-2">
                                    <button onClick={() => updateStatus(review.id, "disetujui")} className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                                        Setuju
                                    </button>
                                    <button onClick={() => updateStatus(review.id, "ditolak")} className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                                        Tolak
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
