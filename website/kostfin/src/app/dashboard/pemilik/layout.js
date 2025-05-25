import Link from 'next/link';

export default function PemilikLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="text-2xl font-bold p-4 border-b border-gray-700">
                    KostKu
                </div>
                <nav className="flex-1 p-4 space-y-2 text-sm">
                    <Link href="/dashboard/pemilik" className="block text-white hover:text-indigo-400">Beranda</Link>
                    <Link href="/dashboard/pemilik/kost" className="block text-white hover:text-indigo-400">Kost Saya</Link>
                    <Link href="/dashboard/pemilik/review" className="block text-white hover:text-indigo-400">Review</Link>
                    <Link href="/dashboard/pemilik/booking" className="block text-white hover:text-indigo-400">Booking Masuk</Link>
                </nav>
                <div className="p-4 border-t border-gray-700 text-sm">
                    <a href="#" className="text-gray-400 hover:text-white">Pengaturan</a>
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
                <section className="p-6">
                    {children}
                </section>
            </main>
        </div>
    );
}