import Link from 'next/link';
import {
    Home,
    Building2,
    Star,
    CalendarCheck,
    Settings,
} from 'lucide-react';

export default function PemilikLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="text-2xl font-bold p-4 border-b border-gray-700">
                    KostFinder
                </div>
                <nav className="flex-1 px-4 py-6 text-sm space-y-6">
                    {/* === Navigasi Utama === */}
                    <div>
                        <div className="space-y-2">
                            <Link
                                href="/dashboard/pemilik"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <Home className="w-5 h-5" />
                                Beranda
                            </Link>
                        </div>
                    </div>

                    {/* === Manajemen Kost === */}
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-semibold px-2 mb-2">Manajemen</h3>
                        <div className="space-y-2">
                            <Link
                                href="/dashboard/pemilik/kost"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <Building2 className="w-5 h-5" />
                                Kost Saya
                            </Link>
                            <Link
                                href="/dashboard/pemilik/review"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <Star className="w-5 h-5" />
                                Review
                            </Link>
                            <Link
                                href="/dashboard/pemilik/booking"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <CalendarCheck className="w-5 h-5" />
                                Booking Masuk
                            </Link>
                        </div>
                    </div>

                    {/* === Pengaturan === */}
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-semibold px-2 mb-2">Pengaturan</h3>
                        <div className="space-y-2">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <Settings className="w-5 h-5" />
                                Akun
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-700 text-sm text-center text-gray-400">
                    <span className="hover:text-white cursor-pointer">© KostFin</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex items-center justify-between p-4 bg-white shadow">
                    <h1 className="text-lg font-semibold">Dashboard Pemilik</h1>
                    <div className="flex items-center space-x-4">
                        <button className="relative">
                            <span className="absolute right-0 top-0 h-2 w-2 bg-red-500 rounded-full"></span>
                            🔔
                        </button>
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="Avatar"
                            className="rounded-full w-10 h-10"
                        />
                    </div>
                </header>
                <section className="p-6">{children}</section>
            </main>
        </div>
    );
}
