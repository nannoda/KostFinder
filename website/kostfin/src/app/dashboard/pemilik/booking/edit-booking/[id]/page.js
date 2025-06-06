"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EditBooking() {
    const { id } = useParams();
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [tanggalMasuk, setTanggalMasuk] = useState("");

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/pencari/booking/${id}/`);
                const data = await res.json();
                setBooking(data);
                setStatus(data.status_booking);
                setTanggalMasuk(data.tanggal_masuk); // bisa diedit
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data booking:", error);
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch(`http://localhost:8000/api/pencari/booking/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status_booking: status,
                    tanggal_masuk: tanggalMasuk,
                }),
            });

            alert("Booking berhasil diperbarui!");
            router.push("/dashboard/pemilik/booking");
        } catch (error) {
            console.error("Gagal update booking:", error);
            alert("Terjadi kesalahan saat update.");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!booking) return <div className="p-6">Booking tidak ditemukan.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">Edit Booking</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Nama Penyewa</label>
                    <input
                        type="text"
                        value={booking.penghuni_nama}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Nama Kost</label>
                    <input
                        type="text"
                        value={booking.kost_nama}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Masuk</label>
                    <input
                        type="date"
                        value={tanggalMasuk}
                        onChange={(e) => setTanggalMasuk(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Status Booking</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard/pemilik/booking")}>
                        Batal
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </div>
    );
}
