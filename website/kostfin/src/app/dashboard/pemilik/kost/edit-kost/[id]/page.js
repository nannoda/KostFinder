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
        gambar_kost_id: null,
        deskripsi: "",
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
                // Ambil data kost
                const kostRes = await fetch(`http://localhost:8000/api/pemilik/kost/${kostId}/`);
                if (!kostRes.ok) throw new Error("Gagal mengambil data kost.");
                const kostData = await kostRes.json();

                const imgRes = await fetch(`http://localhost:8000/api/pemilik/kost-images/?kost=${kostId}`);
                if (!imgRes.ok) throw new Error("Gagal mengambil data gambar kost.");
                const imgData = await imgRes.json();

                const relatedKostImage = imgData.find(img => img.kost === parseInt(kostId)); // Pastikan perbandingan type-safe

                setFormData((prev) => ({
                    ...prev,
                    ...kostData,
                    pemilik: localStorage.getItem("user_id") || kostData.pemilik,
                    gambar_kost_id: relatedKostImage ? relatedKostImage.id : null,
                }));
                setLoading(false);
            } catch (err) {
                console.error("Gagal ambil data:", err);
                setLoading(false);
                router.push("/dashboard/pemilik/kost");
            }
        };

        fetchData();
    }, [kostId, router]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const kostBody = new FormData();
            kostBody.append("nama", formData.nama);
            kostBody.append("alamat", formData.alamat);
            kostBody.append("harga", formData.harga);
            kostBody.append("fasilitas", formData.fasilitas);
            kostBody.append("deskripsi", formData.deskripsi);
            kostBody.append("tipe_kost", formData.tipe_kost);
            kostBody.append("lokasi", formData.lokasi);
            kostBody.append("pemilik", formData.pemilik);

            const kostRes = await fetch(`http://localhost:8000/api/pemilik/kost/${kostId}/`, {
                method: "PATCH",
                body: kostBody,
            });

            const kostResult = await kostRes.json();

            if (!kostRes.ok) {
                throw new Error(kostResult.detail || JSON.stringify(kostResult) || "Gagal menyimpan data kost.");
            }
            const imageUpdatePromises = [];
            const hasNewImage = formData.gambar1 instanceof File ||
                formData.gambar2 instanceof File ||
                formData.gambar3 instanceof File ||
                formData.gambar4 instanceof File ||
                formData.gambar5 instanceof File;

            if (hasNewImage && formData.gambar_kost_id) {
                const imageBody = new FormData();
                for (let i = 1; i <= 5; i++) {
                    const img = formData[`gambar${i}`];
                    if (img instanceof File) {
                        imageBody.append(`gambar${i}`, img);
                    }
                }
                const imgRes = await fetch(`http://localhost:8000/api/pemilik/kost-images/${formData.gambar_kost_id}/`, {
                    method: "PATCH",
                    body: imageBody,
                });

                const imgResult = await imgRes.json();

                if (!imgRes.ok) {
                    console.warn("Gambar gagal diupload:", imgResult);
                    alert("Kost berhasil diperbarui, tapi upload gambar gagal.");
                } else {
                    console.log("Gambar berhasil diupload/diperbarui:", imgResult);
                }
            } else if (hasNewImage && !formData.gambar_kost_id) {
                const imageBody = new FormData();
                imageBody.append("kost", kostId);
                for (let i = 1; i <= 5; i++) {
                    const img = formData[`gambar${i}`];
                    if (img instanceof File) {
                        imageBody.append(`gambar${i}`, img);
                    }
                }

                const createImgRes = await fetch("http://localhost:8000/api/pemilik/kost-images/", {
                    method: "POST",
                    body: imageBody,
                });
                const createImgResult = await createImgRes.json();
                if (!createImgRes.ok) {
                    console.warn("Gagal membuat entri gambar baru:", createImgResult);
                    alert("Kost berhasil diperbarui, tapi gagal membuat entri gambar baru.");
                } else {
                    console.log("Entri gambar baru berhasil dibuat:", createImgResult);
                }
            }


            alert("Kost berhasil diperbarui!");
            router.push("/dashboard/pemilik/kost");

        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menyimpan data: " + error.message); // Tampilkan pesan error yang lebih spesifik
        }
    };

    if (loading) return <div className="p-4">Memuat data...</div>;

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
                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                    <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
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
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}
