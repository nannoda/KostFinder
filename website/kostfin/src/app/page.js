'use client';
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const kostDummy = Array(5).fill({
    type: "Putra",
    rating: "5.0",
    price: "IDR 600.000",
    title: "Kost Ghafi Tipe A Gonilan",
    location: "Jl. Nusa Indah No. 10, Kartasura"
  });

  const KostCard = ({ kost }) => (
    <div className="border rounded-lg p-4 w-[200px] bg-white shadow-sm">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold">{kost.type}</span>
        <span className="text-gray-500">{kost.rating}</span>
      </div>
      <div className="h-24 bg-gray-200 mb-2 rounded"></div>
      <p className="text-sm font-semibold">{kost.price}</p>
      <p className="text-sm">{kost.title}</p>
      <p className="text-xs text-gray-500">{kost.location}</p>
    </div>
  );

  return (
    <div className="font-sans">
      <Header />

      {/* Banner */}
      <div className="bg-gray-100 text-center py-16">
        <h1 className="text-4xl text-gray-300 font-bold">BANNER</h1>
      </div>

      {/* Find Section */}
      <div className="p-6 bg-white">
        <div className="text-center font-semibold text-xl mb-4">FIND</div>
        <div className="flex justify-center gap-2 flex-wrap">
          <input placeholder="Lokasi" className="border p-2 rounded" />
          <input placeholder="Fasilitas" className="border p-2 rounded" />
          <input placeholder="Jarak" className="border p-2 rounded" />
          <input placeholder="Rating" className="border p-2 rounded" />
          <button className="bg-black text-white px-4 py-2 rounded">Cari</button>
        </div>
      </div>

      {/* Section Kost */}
      {[
        "Terbaru Dari Pemilik Kost",
        "Kost Terdekat Dengan Lokasi Anda",
        "Kost Dengan Rating Tertinggi"
      ].map((title, i) => (
        <section key={i} className="p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <div className="flex gap-4 overflow-x-auto">
            {kostDummy.map((kost, i) => (
              <KostCard key={i} kost={kost} />
            ))}
          </div>
        </section>
      ))}

      {/* Promo Banner */}
      <div className="p-8 bg-gray-100 flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">Coba Promosikan Kost Anda Sekarang Juga!</h3>
        <p className="text-gray-600 mb-4">Dapatkan kemudahan dalam mempromosikan kost Anda!</p>
        <button className="bg-black text-white px-4 py-2 rounded">Jadi Pemilik Kost</button>
        <div className="mt-6 text-4xl text-gray-300 font-bold">BANNER</div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
