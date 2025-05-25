"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditKost() {
    const kostId = useParams().id;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nama: "",
        alamat: "",
        harga: "",
        fasilitas: "",
        tipe_kost: "Putra",
        lokasi: "",
        pemilik: "",
        gambar1: null,
        gambar2: null,
        gambar3: null,
        gambar4: null,
        gambar5: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/pemilik/kost/${kostId}/`);
                const data = await res.json();
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                    pemilik: localStorage.getItem("user_id") || data.pemilik,
                }));
                setLoading(false);
            } catch (err) {
                console.error("Gagal ambil data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [kostId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) body.append(key, value);
        });

        try {
            const res = await fetch(`http://localhost:8000/api/pemilik/kost/${kostId}/`, {
                method: "PATCH",
                body,
            });

            const result = await res.json();
            console.log("Server response:", result);

            if (!res.ok) throw new Error(result.detail || "Gagal mengedit kost");

            alert("Kost berhasil diperbarui!");
            router.push("/dashboard/pemilik/kost");
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat memperbarui kost.");
        }
    };

    if (loading) return <div className="p-4">Memuat data...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Kost</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
                <div>
                    <label className="block text-sm font-medium">Nama Kost</label>
                    <input type="text" name="nama" required value={formData.nama} onChange={handleChange}
                        className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Alamat</label>
                    <textarea name="alamat" required value={formData.alamat} onChange={handleChange}
                        className="w-full border p-2 rounded" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Harga</label>
                        <input type="number" name="harga" required value={formData.harga} onChange={handleChange}
                            className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tipe Kost</label>
                        <select name="tipe_kost" value={formData.tipe_kost} onChange={handleChange}
                            className="w-full border p-2 rounded">
                            <option value="Putra">Putra</option>
                            <option value="Putri">Putri</option>
                            <option value="Campur">Campur</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Fasilitas</label>
                    <input type="text" name="fasilitas" value={formData.fasilitas} onChange={handleChange}
                        className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Link Lokasi Google Maps</label>
                    <input type="url" name="lokasi" required value={formData.lokasi} onChange={handleChange}
                        className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Upload Gambar (max 5)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <input key={i} type="file" accept="image/*"
                                name={`gambar${i}`} onChange={handleChange}
                                className="border p-2 rounded" />
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                        Simpan Kost
                    </button>
                </div>
            </form>
        </div>
    );
}
