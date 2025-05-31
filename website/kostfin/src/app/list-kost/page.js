'use client';
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Filter } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export default function KostListPage() {
    const [kostData, setKostData] = useState([]);
    const [allKostData, setAllKostData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortRating, setSortRating] = useState("none");
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

                const formatted = data
                    .filter(kost => kost.status === "disetujui" && kost.status_booking === "tersedia")
                    .map(kost => ({
                        id: kost.id,
                        type: kost.tipe_kost,
                        rating: kost.rating,
                        priceValue: kost.harga,
                        price: `IDR ${kost.harga.toLocaleString("id-ID")}`,
                        title: kost.nama,
                        location: kost.alamat,
                        lokasi: kost.lokasi,
                        fasility: kost.fasilitas,
                        image: kost.gambar_kost?.[0]?.gambar1 || null,
                        created_at: new Date(kost.created_at),
                    }));

                setKostData(formatted);
                setAllKostData(formatted);
            } catch (err) {
                console.error("Failed to fetch kost:", err);
            }
        };

        fetchKostData();
    }, []);

    useEffect(() => {
        let result = [...allKostData];

        // Search filter
        if (searchTerm) {
            const keyword = searchTerm.toLowerCase();
            result = result.filter((kost) =>
                kost.title.toLowerCase().includes(keyword) ||
                kost.location.toLowerCase().includes(keyword)
            );
        }

        // Tipe kost
        if (filterType !== "all") {
            result = result.filter((kost) => kost.type === filterType);
        }

        // Harga
        const min = parseInt(minPrice) || 0;
        const max = parseInt(maxPrice) || Infinity;
        result = result.filter((kost) => kost.priceValue >= min && kost.priceValue <= max);

        // Sort rating
        if (sortRating === "asc") {
            result.sort((a, b) => a.rating - b.rating);
        } else if (sortRating === "desc") {
            result.sort((a, b) => b.rating - a.rating);
        }

        setKostData(result);
    }, [searchTerm, filterType, minPrice, maxPrice, sortRating]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const lokasiParam = searchParams.get("lokasi") || "";
        const fasilitasParam = searchParams.get("fasilitas") || "";
        const jenisParam = searchParams.get("jenis") || "all";
        const ratingParam = searchParams.get("rating") || "";

        setSearchTerm(lokasiParam || fasilitasParam); // Simple keyword search
        setFilterType(jenisParam === "" ? "all" : jenisParam);
        if (ratingParam) setSortRating("desc");
    }, []);


    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 px-4 md:px-10 py-6">
                <h2 className="text-2xl font-bold text-black leading-tight mt-10 mb-2 ml-15">Kost List</h2>
                <div className="w-27 h-1 bg-black mb-5 ml-15 rounded"></div>

                {/* Search & Filter */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6 ml-15">
                    <Input
                        type="text"
                        placeholder="Search kost..."
                        className="max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="flex gap-2 items-center mr-15">
                                <Filter className="w-4 h-4" />
                                Filters
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 space-y-4 mr-25">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipe Kost</Label>
                                <select
                                    id="type"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                >
                                    <option value="all">Semua</option>
                                    <option value="Putra">Putra</option>
                                    <option value="Putri">Putri</option>
                                    <option value="Campur">Campur</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="minPrice">Harga Minimum</Label>
                                <Input
                                    id="minPrice"
                                    type="number"
                                    placeholder="e.g. 500000"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxPrice">Harga Maksimum</Label>
                                <Input
                                    id="maxPrice"
                                    type="number"
                                    placeholder="e.g. 2000000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort">Urutkan Rating</Label>
                                <select
                                    id="sort"
                                    value={sortRating}
                                    onChange={(e) => setSortRating(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                >
                                    <option value="none">Tidak diurutkan</option>
                                    <option value="asc">Terendah</option>
                                    <option value="desc">Tertinggi</option>
                                </select>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setFilterType("all");
                                    setMinPrice("");
                                    setMaxPrice("");
                                    setSortRating("none");
                                }}
                            >
                                Reset Filter
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Kost Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10 mx-15">
                    {kostData.map((kost, index) => (
                        <div key={index} className="flex flex-col">
                            <Link href={`/detail-kost/${kost.id}`}>
                                <Card className="relative group overflow-hidden h-70 rounded-xl">
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

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

                                    <div className="absolute top-2 right-2 z-20 bg-white p-1 rounded-full shadow">
                                        <Heart className="text-gray-400 hover:text-red-500 cursor-pointer w-5 h-5" />
                                    </div>

                                    <div className="absolute top-2 left-2 z-20 flex gap-2 text-xs items-center">
                                        <div className="bg-gray-200 text-black px-2 py-0.5 border border-gray-200 rounded">
                                            <span className="border-r border-gray-300 pr-2">{kost.type}</span>
                                            <span className="text-black pl-2 font-semibold">★ {kost.rating.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-2 left-2 z-20">
                                        <p className="text-sm font-bold text-white bg-black/50 px-2 py-1 rounded">
                                            {kost.price}
                                        </p>
                                    </div>
                                </Card>
                            </Link>

                            <div className="mt-2 px-1">
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{kost.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{kost.fasility}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
