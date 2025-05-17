'use client';
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Filter } from "lucide-react";
import { haversineDistance, extractLatLngFromUrl } from "@/utils/helper";

import Link from "next/link";

const Home = () => {
  const [kostTerbaru, setKostTerbaru] = useState([]);
  const [kostRating, setKostRating] = useState([]);
  const [kostTerdekat, setKostTerdekat] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Ambil lokasi pengguna
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi:", error);
        }
      );
    }
  }, []);

  // Fetch data kost
  useEffect(() => {
    const fetchKostData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/pemilik/kost/");
        const data = await response.json();

        const formatted = data.map(kost => ({
          id: kost.id,
          type: kost.tipe_kost,
          rating: kost.rating,
          price: `IDR ${kost.harga.toLocaleString("id-ID")}`,
          title: kost.nama,
          location: kost.alamat,
          lokasi: kost.lokasi, // URL Google Maps
          fasility: kost.fasilitas,
          image: kost.gambar_kost?.[0]?.gambar1 || null,
          created_at: new Date(kost.created_at)
        }));

        setKostTerbaru([...formatted].sort((a, b) => b.created_at - a.created_at).slice(0, 4));
        setKostRating([...formatted].sort((a, b) => b.rating - a.rating).slice(0, 4));

        if (userLocation) {
          const kostWithDistance = formatted
            .map((kost) => {
              const coords = extractLatLngFromUrl(kost.lokasi);
              if (!coords) return null;
              const distance = haversineDistance(userLocation, coords);
              return { ...kost, distance };
            })
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 4);

          setKostTerdekat(kostWithDistance);
        }
      } catch (err) {
        console.error("Failed to fetch kost:", err);
      }
    };

    fetchKostData();
  }, [userLocation]);


  const KostCard = ({ kost }) => {
    const shortLocation = kost.location.split(',')[2]?.trim() || kost.location;

    return (
      <Link href={`/detail-kost/${kost.id}`} className="">
        <Card className="rounded-xl shadow-sm transition hover:shadow-md cursor-pointer h-full flex flex-col space-y-0">
          <CardContent className="flex-grow flex flex-col">
            <div className="flex justify-between items-center text-sm md:text-md text-gray-600 mb-4">
              <div className="flex items-center">
                <span className="font-semibold text-black">{kost.type}</span>
                <span className="text-yellow-500 pl-2 font-semibold">★ {kost.rating.toFixed(1)}</span>
              </div>

              <Heart className="text-gray-400 hover:text-red-500 cursor-pointer w-5 h-5" />
            </div>

            <img
              src={kost.image || "/kost/sample-kost.jpg"}
              className="h-48 sm:h-56 md:h-60 w-full object-cover bg-gray-200 mb-2 rounded"
              alt={kost.title}
            />
            <CardTitle className="text-base md:text-lg font-semibold text-black">
              {kost.title} {shortLocation && ` ${shortLocation}`}
            </CardTitle>
            <p className="text-sm md:text-base text-black">{kost.price}</p>
            <CardDescription className="text-xs md:text-sm text-gray-500 truncate">
              {kost.fasility.split(',').join(' - ')}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="font-sans">
      <Header />

      {/* Banner + Find */}
      <div className="relative w-full h-150">
        {/* Gambar banner */}
        <img
          src="banner/top-banner.jpg"
          className="w-full h-full object-cover"
          alt="Banner"
        />

        {/* Lapisan hitam transparan */}
        <div className="absolute inset-0 bg-black opacity-40"></div>


        {/* Teks BANNER di tengah gambar */}
        <div className="max-w-[700px] w-full lg:top-[50%] top-[53%] absolute left-[50%] z-1 text-center flex flex-wrap flex-col justify-center translate-x-[-50%] translate-y-[-50%]">
          <h4 className="max-w-[250px] m-[auto] font-Roboto relative text-[#fff] text-[12px] font-light" data-aos="fade-up" data-aos-duration="1000">
            <span className="py-side-border border-[1px] border-solid border-sky-500 w-[50px] absolute top-[9px] left-[-60px] z-[0]"></span>
            Live Better &amp; Stay Closer
            <span className="py-side-border border-[1px] border-solid border-sky-500 w-[50px] absolute top-[9px] right-[-60px] z-[0]"></span>
          </h4>
          <h1 className="my-[30px] 2xl:text-[40px] xl:text-[34px] lg:text-[30px] md:text-[27px] sm:text-[22px] text-[24px] md:leading-[1.2857em] sm:leading-[42px] leading-[36px] font-bold sm:tracking-[2px] tracking-[1px] uppercase text-[#fff]" data-aos="fade-up" data-aos-duration="1500">Make your next move with ease &amp; confidence</h1>
        </div>

        {/* Input Fields */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[60%] bg-white p-2 rounded-full shadow-lg flex items-center justify-between gap-6">
          {/* Form */}
          <form className="flex flex-1 justify-between items-center text-xs text-gray-700">

            {/* Lokasi */}
            <div className="px-4 flex flex-col">
              <label className="font-semibold mb-1">Lokasi</label>
              <input
                type="text"
                placeholder="Masukan lokasi"
                className="outline-none text-gray-400 placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Fasilitas */}
            <div className="px-4 border-l flex flex-col">
              <label className="font-semibold mb-1">Fasilitas</label>
              <input
                type="text"
                placeholder="Pilih Fasilitas"
                className="outline-none text-gray-400 placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Jenis Kost */}
            <div className="px-4 border-l flex flex-col">
              <label className="font-semibold mb-1">Jenis Kost</label>
              <select className="outline-none text-gray-400 bg-transparent">
                <option value="">Pilih Jenis Kost</option>
                <option value="putra">Putra</option>
                <option value="putri">Putri</option>
                <option value="campur">Campur</option>
              </select>
            </div>

            {/* Rating */}
            <div className="px-4 flex border-l flex-col">
              <label className="font-semibold mb-1">Rating</label>
              <input
                type="number"
                placeholder="Masukan Rating"
                className="outline-none text-gray-400 placeholder-gray-400 bg-transparent w-27"
                min="1"
                max="5"
              />
            </div>
          </form>

          {/* Search Button */}
          <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section Kost */}
      {[
        { title: ["Terbaru Dari", "Pemilik Kost"], data: kostTerbaru },
        { title: ["Kost Terdekat", "Dengan Lokasi Anda"], data: kostTerdekat },
        { title: ["Kost Dengan", "Rating Tertinggi"], data: kostRating }
      ].map((section, i) => (
        <section key={i} className="p-6 bg-gray-50 pt-25">
          <h2 className="text-4xl font-bold text-black leading-tight mb-2 ml-15">
            {section.title.map((line, j) => (
              <div key={j}>{line}</div>
            ))}
          </h2>
          <div className="w-27 h-1 bg-black my-10 ml-15 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-15">
            {section.data.length > 0 ? (
              section.data.map((kost, index) => (
                <KostCard key={`${i}-${index}`} kost={kost} />
              ))
            ) : (
              <p className="text-gray-500">Loading data kost...</p>
            )}
          </div>
        </section>
      ))}

      {/* Banner */}
      <div className="bg-gray-50 p-21 px-60">
        <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-center rounded-2xl">
          {/* kiri */}
          <div className="w-170 pl-9">
            <h3 className="text-4xl font-bold text-black mb-2">Coba Promosikan Kost Anda Sekarang Juga!</h3>
            <p className="text-gray-600 mb-4">Dapatkan kemudahan dalam mempromosikan kost Anda!</p>
            <button className="bg-black text-white px-4 py-2 w-50 h-10 rounded-full">Jadi Pemilik Kost</button>
          </div>

          {/* Gambar di kanan */}
          <img src="/banner/bottom-banner.png" className="h-100 w-150 object-cover" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
