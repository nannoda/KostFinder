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
    const [isFilterInitialized, setIsFilterInitialized] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lokasiParam = searchParams.get("lokasi") || "";
        const fasilitasParam = searchParams.get("fasilitas") || "";
        const jenisParam = searchParams.get("jenis") || "all";
        const ratingParam = searchParams.get("rating") || "";

        setSearchTerm(lokasiParam || fasilitasParam);
        setFilterType(jenisParam === "" ? "all" : jenisParam);
        if (ratingParam) setSortRating("desc");

        setIsFilterInitialized(true);
    }, []);

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
                // Ambil data kost
                const kostResponse = await fetch("http://127.0.0.1:8000/api/pemilik/kost/");
                const kostData = await kostResponse.json();

                // Ambil data review
                const reviewResponse = await fetch("http://127.0.0.1:8000/api/pencari/review/");
                const reviewData = await reviewResponse.json();

                // Hitung rata-rata rating per kost
                const ratingMap = {};
                reviewData.forEach((review) => {
                    const kostId = review.kost; // Pastikan 'kost' ini adalah ID kost
                    if (!ratingMap[kostId]) {
                        ratingMap[kostId] = { total: 0, count: 0 };
                    }
                    ratingMap[kostId].total += review.rating;
                    ratingMap[kostId].count += 1;
                });

                // Gabungkan dengan data kost
                const formatted = kostData
                    .filter(kost => kost.status === "disetujui" && kost.status_booking === "tersedia")
                    .map(kost => {
                        const ratingInfo = ratingMap[kost.id] || { total: 0, count: 0 };
                        const averageRating = ratingInfo.count > 0 ? ratingInfo.total / ratingInfo.count : 0;

                        return {
                            id: kost.id,
                            type: kost.tipe_kost,
                            rating: averageRating,
                            priceValue: kost.harga,
                            price: `IDR ${kost.harga.toLocaleString("id-ID")}`,
                            title: kost.nama,
                            location: kost.alamat,
                            lokasi: kost.lokasi,
                            fasility: kost.fasilitas,
                            image: kost.gambar_kost?.[0]?.gambar1 || null,
                            created_at: new Date(kost.created_at),
                        };
                    });

                setAllKostData(formatted);
                setKostData(formatted);
                setIsDataReady(true);
            } catch (err) {
                console.error("Failed to fetch kost or reviews:", err);
            }
        };

        fetchKostData();
    }, []);

    useEffect(() => {
        if (!isFilterInitialized || !isDataReady) return;

        let result = [...allKostData];

        // Search
        if (searchTerm) {
            const keyword = searchTerm.toLowerCase();
            result = result.filter((kost) =>
                kost.title.toLowerCase().includes(keyword) ||
                kost.location.toLowerCase().includes(keyword)
            );
        }

        // Filter tipe kost
        if (filterType !== "all") {
            result = result.filter((kost) => kost.type === filterType);
        }

        // Harga
        const min = parseInt(minPrice) || 0;
        const max = parseInt(maxPrice) || Infinity;
        result = result.filter((kost) => kost.priceValue >= min && kost.priceValue <= max);

        // Rating
        if (sortRating === "asc") {
            result.sort((a, b) => a.rating - b.rating);
        } else if (sortRating === "desc") {
            result.sort((a, b) => b.rating - a.rating);
        }

        setKostData(result);
    }, [searchTerm, filterType, minPrice, maxPrice, sortRating, isFilterInitialized, isDataReady]);

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
                <h2 className="text-3xl font-bold text-gray-800 ml-4 md:ml-15">Kost Terbaik untuk Anda</h2>
                <div className="w-24 h-1 bg-black ml-4 md:ml-15 mt-2 mb-8 rounded-full"></div>

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
                            <Button className="bg-white border border-gray-300 text-black hover:bg-black hover:text-white transition mr-15">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
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
                                className="w-full border border-gray-300 text-gray-600 hover:bg-black hover:text-white"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mx-4 md:mx-15">
                    {kostData.map((kost, index) => (
                        <div key={index} className="flex flex-col">
                            <Link href={`/detail-kost/${kost.id}`}>
                                <Card className="relative group overflow-hidden h-72 rounded-2xl shadow-md transition hover:shadow-xl bg-white">
                                    {kost.image ? (
                                        <img
                                            src={kost.image}
                                            alt={kost.title}
                                            className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-0">
                                            <span className="text-sm text-gray-400">No Image</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

                                    <div className="absolute top-3 right-3 z-20 bg-white p-1.5 rounded-full shadow">
                                        <Heart className="text-gray-400 hover:text-red-500 w-5 h-5" />
                                    </div>

                                    <div className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-black flex items-center gap-1">
                                        <span>{kost.type}</span>
                                        <span className="text-yellow-400">★ {kost.rating.toFixed(1)}</span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 z-20">
                                        <p className="text-sm font-semibold text-white bg-black/60 px-3 py-1 rounded-lg">{kost.price}</p>
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
            </main >
            <Footer />
        </div >
    );
}
