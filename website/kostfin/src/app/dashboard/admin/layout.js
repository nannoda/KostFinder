"use client";
import Link from "next/link";
import { Home, Building2, MessageSquare, User, UserRound, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AdminLayout({ children }) {
    const router = useRouter();
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="text-2xl font-bold p-4 border-b border-gray-700">
                    <img src="/logo/logo_kostfin_white.png" alt="Logo" className="h-10 inline-block ml-5" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-6 text-sm">
                    {/* Beranda */}
                    <div className="space-y-1">
                        <Link
                            href="/dashboard/admin"
                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                        >
                            <Home className="w-5 h-5" />
                            Beranda
                        </Link>
                    </div>

                    {/* Kost Management */}
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-semibold px-2 mb-2">Kost</h3>
                        <div className="space-y-1">
                            <Link
                                href="/dashboard/admin/kost"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <Building2 className="w-5 h-5" />
                                Kost
                            </Link>
                            <Link
                                href="/dashboard/admin/review"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Review Kost
                            </Link>
                        </div>
                    </div>

                    {/* Akun Management */}
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-semibold px-2 mb-2">Akun</h3>
                        <div className="space-y-1">
                            <Link
                                href="/dashboard/admin/akun-pemilik"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <User className="w-5 h-5" />
                                Akun Pemilik
                            </Link>
                            <Link
                                href="/dashboard/admin/akun-pencari"
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
                            >
                                <UserRound className="w-5 h-5" />
                                Akun Pencari
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-semibold px-2 mb-2">Lain-lain</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('user_role');
                                    localStorage.removeItem('phone');
                                    router.push('/');
                                }}
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition w-full text-left"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>

                </nav>
                <div className="p-4 border-t border-gray-700 text-sm text-center text-gray-400">
                    <span className="hover:text-white cursor-pointer">© KostFinder</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex items-center justify-between p-4 bg-white shadow">
                    <div className="text-lg font-semibold">Dashboard Admin</div>
                    <div className="flex items-center space-x-4">
                        <button className="relative">
                            <span className="absolute right-0 top-0 h-2 w-2 bg-red-500 rounded-full" />
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
