"use client";
import { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nama:", name, "Email:", email, "Password:", password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama"
            className="w-full p-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
          >
            Daftar
          </button>
        </form>
        {/* Navigasi ke halaman login */}
        <p className="text-center text-sm mt-4">
          Sudah punya akun? <Link href="/login" className="text-blue-500">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;