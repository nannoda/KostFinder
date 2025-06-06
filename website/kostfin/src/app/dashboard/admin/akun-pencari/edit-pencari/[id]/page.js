"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditPencari() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nama: "",
        username: "",
        email: "",
        no_hp: "",
    });

    useEffect(() => {
        fetch(`http://localhost:8000/api/pencari/penghuni/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                setFormData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch data pencari:", err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/pencari/penghuni/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Berhasil mengupdate akun pencari");
                router.push("/dashboard/admin/akun-pencari");
            } else {
                alert("Gagal update data");
            }
        } catch (err) {
            console.error("Error saat update:", err);
        }
    };

    if (loading) {
        return <p className="p-6">Memuat data...</p>;
    }

    return (
        <section className="p-6 max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Edit Akun Pencari</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama</label>
                    <Input
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        required
                        className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">No HP</label>
                    <Input
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        required
                        className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                        Simpan
                    </Button>
                </div>
            </form>
        </section>
    );
}
