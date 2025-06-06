"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TambahKost() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nama: "",
        alamat: "",
        harga: "",
        fasilitas: "",
        tipe_kost: "Putra",
        lokasi: "",
        pemilik: "", // diset nanti
        gambar1: null,
        gambar2: null,
        gambar3: null,
        gambar4: null,
        gambar5: null,
    });

    useEffect(() => {
        const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
        if (userId) {
            setFormData(prev => ({ ...prev, pemilik: userId }));
        } else {
            alert("Silakan login terlebih dahulu.");
            router.push("/login");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) body.append(key, value);
        });

        try {
            const res = await fetch("http://localhost:8000/api/pemilik/kost/", {
                method: "POST",
                body,
            });

            const result = await res.json();
            console.log("Server response:", result);

            if (!res.ok) {
                throw new Error(result.detail || "Gagal menambah kost");
            }

            alert("Kost berhasil ditambahkan!");
            router.push("/dashboard/pemilik/kost");
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menambah kost.");
        }
    };
    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8">Edit Kost</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border">
                <div>
                    <label className="block text-sm font-medium mb-1">Nama Kost</label>
                    <input type="text" name="nama" required value={formData.nama} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Alamat</label>
                    <textarea name="alamat" required value={formData.alamat} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Harga</label>
                        <input type="number" name="harga" required value={formData.harga} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipe Kost</label>
                        <select name="tipe_kost" value={formData.tipe_kost} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                            <option value="Putra">Putra</option>
                            <option value="Putri">Putri</option>
                            <option value="Campur">Campur</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Fasilitas</label>
                    <input type="text" name="fasilitas" value={formData.fasilitas} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Link Lokasi Google Maps</label>
                    <input type="url" name="lokasi" required value={formData.lokasi} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Upload Gambar (max 5)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <input key={i} type="file" accept="image/*"
                                name={`gambar${i}`} onChange={handleChange}
                                className="border p-2 rounded-lg w-full file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200" />
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex flex-col md:flex-row gap-4 justify-end">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/pemilik/kost")}
                        className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg shadow transition-all duration-200"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow transition-all duration-200"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
