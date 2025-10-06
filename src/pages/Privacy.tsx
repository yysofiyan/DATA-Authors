import React from 'react';

const Privacy: React.FC = () => {
    const lastUpdated = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-black mb-4">
                        Kebijakan Privasi
                    </h1>
                    <p className="text-black">
                        Sinta Profile Scraper
                    </p>
                </div>

                {/* Last Updated */}
                <div className="card-brutal mb-8">
                    <p className="text-black">
                        <span className="font-bold">Terakhir diperbarui:</span> {lastUpdated}
                    </p>
                </div>

                {/* Privacy Content */}
                <div className="card-brutal mb-8">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            1. Pendahuluan
                        </h2>
                        <p className="text-black mb-4">
                            Selamat datang di Portal Penelitian Sinta Profile Scraper ("Aplikasi"). Kebijakan Privasi
                            ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, dan melindungi informasi
                            pribadi Anda saat menggunakan Aplikasi kami.
                        </p>
                        <p className="text-black">
                            Dengan menggunakan Aplikasi ini, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            2. Informasi yang Kami Kumpulkan
                        </h2>
                        <h3 className="text-lg font-bold text-black mb-2">Informasi yang Anda Berikan</h3>
                        <ul className="list-disc list-inside text-black mb-4 space-y-2">
                            <li>ID Sinta yang Anda masukkan untuk mengambil data profil peneliti</li>
                        </ul>

                        <h3 className="text-lg font-bold text-black mb-2">Informasi yang Secara Otomatis Dikumpulkan</h3>
                        <ul className="list-disc list-inside text-black mb-4 space-y-2">
                            <li>Informasi teknis seperti alamat IP, jenis browser, dan sistem operasi</li>
                            <li>Data penggunaan seperti halaman yang dikunjungi dan tindakan yang diambil</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            3. Bagaimana Kami Menggunakan Informasi Anda
                        </h2>
                        <ul className="list-disc list-inside text-black mb-4 space-y-2">
                            <li>Untuk mengambil dan menampilkan data profil peneliti dari SINTA</li>
                            <li>Untuk meningkatkan kinerja dan fungsionalitas Aplikasi</li>
                            <li>Untuk menganalisis penggunaan Aplikasi dan memahami preferensi pengguna</li>
                            <li>Untuk mendeteksi dan mencegah aktivitas yang mencurigakan atau penyalahgunaan</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            4. Pengungkapan Informasi kepada Pihak Ketiga
                        </h2>
                        <p className="text-black mb-4">
                            Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak ketiga.
                            Namun, kami dapat membagikan informasi Anda dengan pihak ketiga dalam situasi berikut:
                        </p>
                        <ul className="list-disc list-inside text-black mb-4 space-y-2">
                            <li>Dengan penyedia layanan yang membantu kami dalam operasi Aplikasi</li>
                            <li>Jika diwajibkan oleh hukum atau untuk mematuhi proses hukum</li>
                            <li>Untuk melindungi hak, properti, atau keamanan kami atau pengguna lain</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            5. Keamanan Informasi
                        </h2>
                        <p className="text-black">
                            Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi Anda.
                            Ini termasuk enkripsi, firewall, dan kontrol akses untuk melindungi data Anda
                            dari akses yang tidak sah, pengungkapan, atau penghancuran.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            6. Hak Privasi Anda
                        </h2>
                        <p className="text-black mb-4">
                            Anda memiliki hak untuk:
                        </p>
                        <ul className="list-disc list-inside text-black mb-4 space-y-2">
                            <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
                            <li>Memperbaiki informasi yang tidak akurat atau tidak lengkap</li>
                            <li>Meminta penghapusan informasi pribadi Anda</li>
                            <li>Menarik persetujuan Anda kapan saja</li>
                        </ul>
                        <p className="text-black">
                            Untuk menggunakan hak ini, silakan hubungi kami melalui informasi kontak yang disediakan di bawah.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            7. Perubahan pada Kebijakan Privasi Ini
                        </h2>
                        <p className="text-black">
                            Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu
                            Anda tentang perubahan apa pun dengan memposting kebijakan baru di halaman ini dan
                            memperbarui tanggal "Terakhir diperbarui" di bagian atas kebijakan ini.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">
                            8. Hubungi Kami
                        </h2>
                        <p className="text-black mb-4">
                            Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini,
                            silakan hubungi kami di:
                        </p>
                        <div className="card-brutal bg-gray-100">
                            <p className="text-black">GitHub: https://github.com/yysofiyan/sinta-profile-scraper</p>
                        </div>
                    </section>
                </div>

                {/* Footer Note */}
                <div className="text-center">
                    <p className="text-sm text-black">
                        Kebijakan Privasi ini berlaku untuk penggunaan Aplikasi Sinta Profile Scraper
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;