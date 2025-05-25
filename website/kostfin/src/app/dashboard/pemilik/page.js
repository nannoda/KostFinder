export default function PemilikDashboard() {
    return (
        <section className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { title: 'Kost Terdaftar', count: 3, sub: '2 Aktif' },
                    { title: 'Booking Masuk', count: 5, sub: '1 Belum diproses' },
                    { title: 'Review Diterima', count: 8, sub: 'Rata-rata 4.5⭐' },
                    { title: 'Pendapatan Bulan Ini', count: 'Rp3.200.000', sub: 'Naik 12%' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow">
                        <div className="text-gray-600 text-sm mb-2">{item.title}</div>
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-gray-500 text-xs">{item.sub}</div>
                    </div>
                ))}
            </div>

            {/* Booking Masuk */}
            <div className="bg-white rounded shadow overflow-x-auto mb-10">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Permintaan Booking</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-4">Penyewa</th>
                            <th className="p-4">Kamar</th>
                            <th className="p-4">Tanggal Masuk</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { nama: 'Alya', kamar: 'Tipe B', tanggal: '2025-06-01', status: 'Menunggu' },
                            { nama: 'Rizky', kamar: 'Tipe A', tanggal: '2025-05-25', status: 'Diterima' },
                        ].map((booking, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="p-4">{booking.nama}</td>
                                <td className="p-4">{booking.kamar}</td>
                                <td className="p-4">{booking.tanggal}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${booking.status === 'Diterima'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status}
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

            {/* Review Kost */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <h3 className="text-lg font-semibold px-6 py-4 border-b">Review Kost</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-4">Pengguna</th>
                            <th className="p-4">Kost</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Komentar</th>
                            <th className="p-4">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { user: 'Rina', kost: 'Kost Harmoni', rating: 4, komentar: 'Tempat nyaman dan bersih', tanggal: '2025-05-17' },
                            { user: 'Agus', kost: 'Kost Melati', rating: 5, komentar: 'Sangat puas!', tanggal: '2025-05-14' },
                        ].map((review, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="p-4">{review.user}</td>
                                <td className="p-4">{review.kost}</td>
                                <td className="p-4">{'⭐'.repeat(review.rating)}</td>
                                <td className="p-4">{review.komentar}</td>
                                <td className="p-4">{review.tanggal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}