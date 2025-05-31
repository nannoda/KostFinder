'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { extractLatLngFromUrl } from "@/utils/helper";

const DetailKost = () => {
    const { id } = useParams();
    const [kost, setKost] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tanggalMasuk, setTanggalMasuk] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchKost = async () => {
            const res = await fetch(`http://127.0.0.1:8000/api/pemilik/kost/${id}/`);
            const data = await res.json();
            console.log("Kost Data:", data);
            setKost(data);
        };
        fetchKost();

        const userData = localStorage.getItem('user_id');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [id]);

    useEffect(() => {
        const fetchNearbyPlaces = async (lat, lng) => {
            try {
                const categories = ['restaurant', 'university', 'place_of_worship'];
                const allResults = [];

                for (const category of categories) {
                    const res = await fetch(`/api/foursquare-places?lat=${lat}&lng=${lng}&type=${category}`);
                    const data = await res.json();

                    // Ambil hanya 1 tempat teratas per kategori
                    const topPlace = data.results?.[0];
                    if (topPlace) {
                        allResults.push({
                            name: topPlace.name,
                            type: category,
                            distance: topPlace.distance || 0,
                            rating: topPlace.rating || 4.5, // fallback dummy rating
                        });
                    }
                }

                setNearbyPlaces(allResults);
            } catch (error) {
                console.error("Gagal memuat tempat terdekat:", error);
                setNearbyPlaces([]);
            }
        };

        if (kost?.lokasi) {
            const { lat, lng } = extractLatLngFromUrl(kost.lokasi);
            if (lat && lng) {
                fetchNearbyPlaces(lat, lng);
            }
        }
    }, [kost]);

    const dummyReviews = [
        {
            name: "John Doberman",
            date: "Mar 12 2020",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            name: "John Doberman",
            date: "Mar 12 2020",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            name: "John Doberman",
            date: "Mar 12 2020",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            name: "John Doberman",
            date: "Mar 12 2020",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    ];

    if (!kost) return <div className="p-8">Loading...</div>;

    return (
        <div className="font-sans">
            <Header />
            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Gambar besar (kiri, 2/3 lebar) */}
                    <div className="col-span-2">
                        <img
                            src={kost.gambar_kost?.[0]?.gambar1 || "/kost/sample-kost.jpg"}
                            alt={kost.nama}
                            className="w-full h-110 object-cover object-center rounded-lg"
                        />
                    </div>

                    {/* Gambar kecil (kanan, 2x2) */}
                    <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
                        <img
                            src={kost.gambar_kost?.[0]?.gambar2 || "/kost/sample2.jpg"}
                            className="w-full h-54 object-cover rounded-lg"
                            alt="gambar2"
                        />
                        <img
                            src={kost.gambar_kost?.[0]?.gambar3 || "/kost/sample3.jpg"}
                            className="w-full h-54 object-cover rounded-lg"
                            alt="gambar3"
                        />
                        <img
                            src={kost.gambar_kost?.[0]?.gambar4 || "/kost/sample4.jpg"}
                            className="w-full h-54 object-cover rounded-lg"
                            alt="gambar4"
                        />
                        <img
                            src={kost.gambar_kost?.[0]?.gambar5 || "/kost/sample5.jpg"}
                            className="w-full h-54 object-cover rounded-lg"
                            alt="gambar5"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Kiri - Konten utama */}
                    <div className="col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{kost.nama}</h1>
                            <p className="text-gray-500">{kost.alamat}</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center">
                                <p>Kasur</p>
                            </div>
                            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center">
                                <p>Meja</p>
                            </div>
                            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center">
                                <p>Lemari</p>
                            </div>
                            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center">
                                <p>Kamar Mandi</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Deskripsi Kost</h2>
                            <p className="text-gray-700">{kost.fasilitas}</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Fasilitas Kost</h2>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li>Air Bersih</li>
                                <li>Tempat Bersantai</li>
                                <li>Parkiran</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Lokasi</h2>
                            {kost.lokasi && extractLatLngFromUrl(kost.lokasi) ? (
                                <div className="w-full h-120 rounded-lg overflow-hidden">
                                    <iframe
                                        src={`https://www.google.com/maps?q=${extractLatLngFromUrl(kost.lokasi).lat},${extractLatLngFromUrl(kost.lokasi).lng}&output=embed`}
                                        width="100%"
                                        height="100%"
                                        allowFullScreen=""
                                        loading="lazy"
                                        style={{ border: 0 }}
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                                    Lokasi tidak tersedia
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Tempat Terdekat</h2>
                            {nearbyPlaces.length === 0 ? (
                                <p className="text-gray-500">Tidak ada tempat terdekat ditemukan</p>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto">
                                    {nearbyPlaces.map((place, idx) => (
                                        <div
                                            key={idx}
                                            className="min-w-[200px] bg-white shadow-sm border rounded-lg p-4"
                                        >
                                            <h3 className="font-semibold text-lg">{place.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {place.distance} meters away
                                            </p>
                                            <div className="text-yellow-500 flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i}>
                                                        {i < Math.round(place.rating) ? '★' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Reviews <span className="text-yellow-500">★ 5.0</span></h2>
                            <div className="grid grid-cols-2 gap-6">
                                {dummyReviews.map((review, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-20 h-8 rounded-full bg-gray-300"></div>
                                        <div>
                                            <p className="font-semibold">{review.name}</p>
                                            <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                                            <p className="text-gray-600">{review.review}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                                    Show All {dummyReviews.length} Reviews
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Kanan - Sidebar Sticky */}
                    <div className="col-span-1">
                        <div className="sticky top-4 bg-white shadow-md rounded-lg p-4 text-center border border-gray-200">
                            <p className="text-sm text-gray-500">Harga per bulan</p>
                            <p className="text-xl font-semibold text-primary">IDR {kost.harga.toLocaleString("id-ID")}</p>
                            <button
                                onClick={() => {
                                    if (!user) {
                                        window.location.href = "/login";
                                    } else {
                                        setIsModalOpen(true); // tampilkan modal tanggal booking
                                    }
                                }}
                                className="mt-4 w-full bg-primary text-white py-2 rounded-lg"
                            >
                                Ajukan Booking
                            </button>
                            {feedbackMessage && (
                                <p className="mt-2 text-sm text-blue-600">{feedbackMessage}</p>
                            )}
                        </div>
                    </div>
                </div>


            </div>
            <Footer />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Ajukan Booking</h2>
                        <label className="block mb-2 text-sm text-gray-600">Tanggal Masuk</label>
                        <input
                            type="date"
                            value={tanggalMasuk}
                            onChange={(e) => setTanggalMasuk(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded border border-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch('http://127.0.0.1:8000/api/pencari/booking/', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                kost: kost.id,
                                                penghuni: localStorage.getItem("user_id"), // Ganti dengan ID user yang login
                                                tanggal_masuk: tanggalMasuk,
                                            }),
                                        });
                                        const data = await res.json();
                                        console.log("Booking Response:", data);
                                        if (res.ok) {
                                            setFeedbackMessage("Booking berhasil diajukan!");
                                            setIsModalOpen(false);
                                            setTanggalMasuk("");
                                        } else {
                                            setFeedbackMessage("Gagal mengajukan booking.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        setFeedbackMessage("Terjadi kesalahan saat booking.");
                                    }
                                }}
                                className="px-4 py-2 rounded bg-green-600 text-white"
                            >
                                Kirim Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailKost;
