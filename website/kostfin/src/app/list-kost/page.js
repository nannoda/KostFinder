'use client';
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Filter } from "lucide-react";

export default function KostListPage() {
    const [kostData, setKostData] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    useEffect(() => {
        const fetchKostData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/pemilik/kost/");
                const data = await response.json();

                const formatted = data.map((kost) => ({
                    type: kost.tipe_kost,
                    rating: kost.rating,
                    price: `IDR ${kost.harga.toLocaleString("id-ID")}`,
                    title: kost.nama,
                    location: kost.alamat,
                    lokasi: kost.lokasi,
                    fasility: kost.fasilitas,
                    image: kost.gambar_kost?.[0]?.gambar1 || null,
                    created_at: new Date(kost.created_at),
                }));

                setKostData(formatted);
            } catch (err) {
                console.error("Failed to fetch kost:", err);
            }
        };

        fetchKostData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 px-4 md:px-10 py-6">
                <h2 className="text-2xl font-bold text-black leading-tight mt-10 mb-2 ml-15">Kost List</h2>
                <div className="w-27 h-1 bg-black mb-5 ml-15 rounded"></div>
                <div className="flex justify-between items-center mb-6 ml-15">
                    <input
                        type="text"
                        placeholder="Search kost..."
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm"
                    />
                    <Button className="flex gap-2 items-center mr-15">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10 mx-15">
                    {kostData.map((kost, index) => (
                        <div key={index} className="flex flex-col">
                            {/* Kost Card */}
                            <Card className="relative group overflow-hidden h-70 rounded-xl">
                                {/* Full Background Image */}
                                {kost.image ? (
                                    <img
                                        src={kost.image}
                                        alt={kost.title}
                                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-0">
                                        <span className="text-sm text-gray-500">No Image</span>
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

                                {/* Favorite Icon */}
                                <div className="absolute top-2 right-2 z-20 bg-white p-1 rounded-full shadow">
                                    <Heart className="text-gray-400 hover:text-red-500 cursor-pointer w-5 h-5" />
                                </div>

                                {/* Type & Rating (top-left) */}
                                <div className="absolute top-2 left-2 z-20 flex gap-2 text-xs items-center">
                                    <div className="bg-gray-200 text-black px-2 py-0.5 border border-gray-200 rounded">
                                        <span className="border-r border-gray-300 pr-2">{kost.type}</span>
                                        <span className="text-black pl-2 font-semibold">★ {kost.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Price (bottom-left) */}
                                <div div className="absolute bottom-2 left-2 z-20" >
                                    <p className="text-sm font-bold text-white bg-black/50 px-2 py-1 rounded">{kost.price}</p>
                                </div>
                            </Card>

                            {/* Info di Luar Card */}
                            <div className="mt-2 px-1">
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{kost.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{kost.fasility}</p>
                            </div>
                        </div>
                    ))
                    }
                </div >
            </main >
            <Footer />
        </div >
    );
}
