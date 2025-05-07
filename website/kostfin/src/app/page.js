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
    <div className="border rounded-xl p-4 w-90 h-100 bg-white shadow-sm">
      <div className="flex justify-between text-md mb-2">
        <span className="font-semibold text-black">{kost.type}</span>
        <span className="text-gray-500">{kost.rating}</span>
      </div>
      <img src="/kost/sample-kost.jpg" className="h-60 bg-gray-200 mb-2 rounded"></img>
      <p className="text-lg font-semibold text-black">{kost.price}</p>
      <p className="text-lg text-black">{kost.title}</p>
      <p className="text-sm text-gray-500">{kost.location}</p>
    </div>
  );

  const sectionTitles = [
    ["Terbaru Dari", "Pemilik Kost"],
    ["Kost Terdekat", "Dengan Lokasi Anda"],
    ["Kost Dengan", "Rating Tertinggi"]
  ];

  return (
    <div className="font-sans">
      <Header />

      {/* Banner + Find */}
      <div className="relative w-full h-200">
        {/* Gambar banner */}
        <img
          src="banner/top-banner.jpg"
          className="w-full h-full object-cover rounded"
          alt="Banner"
        />

        {/* Lapisan hitam transparan */}
        <div className="absolute inset-0 bg-black opacity-40 rounded"></div>


        {/* Teks BANNER di tengah gambar */}
        <div className="max-w-[830px] w-full lg:top-[50%] top-[53%] absolute left-[50%] z-1 text-center flex flex-wrap flex-col justify-center translate-x-[-50%] translate-y-[-50%]">
          <h4 className="max-w-[250px] m-[auto] font-Roboto relative text-[#fff] text-[16px] font-light" data-aos="fade-up" data-aos-duration="1000">
            <span className="py-side-border border-[1px] border-solid border-sky-500 w-[50px] absolute top-[9px] left-[-60px] z-[0]"></span>
            Live Better &amp; Stay Closer
            <span className="py-side-border border-[1px] border-solid border-sky-500 w-[50px] absolute top-[9px] right-[-60px] z-[0]"></span>
          </h4>
          <h1 className="my-[30px] 2xl:text-[48px] xl:text-[42px] lg:text-[38px] md:text-[35px] sm:text-[30px] text-[24px] md:leading-[1.2857em] sm:leading-[42px] leading-[36px] font-bold sm:tracking-[2px] tracking-[1px] uppercase text-[#fff]" data-aos="fade-up" data-aos-duration="1500">Make your next move with ease &amp; confidence</h1>
        </div>

        {/* Teks FIND di atas input, terpisah */}
        <div className="absolute bottom-30 left-130 transform -translate-x-1/2 mb-5">
          <div className="font-bold text-6xl text-white drop-shadow-md">
            FIND
          </div>
        </div>

        {/* Input Fields (tanpa container judul) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[60%] bg-white p-4 rounded-full shadow-lg flex items-center justify-between gap-6">
          {/* Form */}
          <form className="flex flex-1 justify-between items-center text-sm text-gray-700">

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
                className="outline-none text-gray-400 placeholder-gray-400 bg-transparent"
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
      {sectionTitles.map((lines, i) => (
        <section key={i} className="p-6 bg-gray-50 pt-25">
          <h2 className="text-4xl font-bold text-black leading-tight mb-2 ml-15">
            {lines.map((line, j) => (
              <div key={j}>{line}</div>
            ))}
          </h2>
          <div className="w-27 h-1 bg-black my-10 ml-15 rounded"></div>
          <div className="flex gap-4 overflow-x-auto justify-center mx-15">
            {kostDummy.map((kost, i) => (
              <KostCard key={i} kost={kost} />
            ))}
          </div>
        </section>
      ))}

      {/* Banner */}
      <div className="bg-gray-50 p-21 px-60">
        <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-center rounded-2xl">
          {/* kiri */}
          <div className="w-170 bg-white">
            <h3 className="text-6xl font-bold text-black mb-2">Coba Promosikan Kost Anda Sekarang Juga!</h3>
            <p className="text-gray-600 mb-4">Dapatkan kemudahan dalam mempromosikan kost Anda!</p>
            <button className="bg-black text-white px-4 py-2 w-50 h-10 rounded-full">Jadi Pemilik Kost</button>
          </div>

          {/* Gambar di kanan */}
          <img src="/banner/bottom-banner.png" className="h-150 w-200 object-cover" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
