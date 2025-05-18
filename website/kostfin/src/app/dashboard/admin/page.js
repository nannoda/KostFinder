export default function Admin() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="text-2xl font-bold p-4 border-b border-gray-700">
                    Dash UI
                </div>
                <nav className="flex-1 p-4 space-y-2 text-sm">
                    <a href="#" className="block text-white hover:text-indigo-400">Dashboard</a>
                    <a href="#" className="block text-white hover:text-indigo-400">Kost</a>
                    <a href="#" className="block text-white hover:text-indigo-400">Review</a>
                </nav>
                <div className="p-4 border-t border-gray-700 text-sm">
                    <a href="#" className="text-gray-400 hover:text-white">Download</a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex items-center justify-between p-4 bg-white shadow">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border px-3 py-2 rounded w-1/3"
                    />
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">KostFinder</h2>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {[
                            { title: 'Kost', count: 18, sub: '15 Accepted' },
                            { title: 'Reviews', count: 132, sub: '98 Accepted' },
                            { title: 'Teams', count: 12, sub: '1 Completed' },
                            { title: 'Productivity', count: '76%', sub: '5% Completed' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded shadow">
                                <div className="text-gray-600 text-sm mb-2">{item.title}</div>
                                <div className="text-2xl font-bold">{item.count}</div>
                                <div className="text-gray-500 text-xs">{item.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded shadow overflow-x-auto mb-10">
                        <h3 className="text-lg font-semibold px-6 py-4 border-b">Ajuan Kost</h3>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-4">Nama Kost</th>
                                    <th className="p-4">Pemilik</th>
                                    <th className="p-4">Tanggal Ajuan</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { nama: 'Kost Harmoni', pemilik: 'Andi', tanggal: '2025-05-15', status: 'Menunggu' },
                                    { nama: 'Kost Melati', pemilik: 'Sari', tanggal: '2025-05-10', status: 'Diterima' },
                                    { nama: 'Kost Mawar', pemilik: 'Budi', tanggal: '2025-05-08', status: 'Ditolak' },
                                ].map((kost, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="p-4">{kost.nama}</td>
                                        <td className="p-4">{kost.pemilik}</td>
                                        <td className="p-4">{kost.tanggal}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full 
              ${kost.status === 'Diterima'
                                                    ? 'bg-green-100 text-green-700'
                                                    : kost.status === 'Ditolak'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {kost.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-xs">Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* TABEL Review Kost */}
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <h3 className="text-lg font-semibold px-6 py-4 border-b">Review Kost</h3>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-4">Nama Pengguna</th>
                                    <th className="p-4">Kost</th>
                                    <th className="p-4">Rating</th>
                                    <th className="p-4">Tanggal</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { user: 'Rina', kost: 'Kost Harmoni', rating: 4, tanggal: '2025-05-17', status: 'Menunggu' },
                                    { user: 'Agus', kost: 'Kost Melati', rating: 5, tanggal: '2025-05-14', status: 'Diterima' },
                                ].map((review, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="p-4">{review.user}</td>
                                        <td className="p-4">{review.kost}</td>
                                        <td className="p-4">{'⭐'.repeat(review.rating)}</td>
                                        <td className="p-4">{review.tanggal}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full 
              ${review.status === 'Diterima'
                                                    ? 'bg-green-100 text-green-700'
                                                    : review.status === 'Ditolak'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-xs">Lihat</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}
