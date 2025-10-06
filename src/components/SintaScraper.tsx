import React, { useState } from 'react';
import axios from 'axios';
// Import existing components for better UI
import { StatCard } from './StatCard';
import { PublicationCard } from './PublicationCard';
// Import skeleton components
import { SintaProfileSkeleton } from './Skeleton';
// Import icons for better visual representation
import { User, Building2, BookOpen, BarChart3, Search, Loader2, AlertCircle, FileJson, MapPin, HelpCircle } from 'lucide-react';
import type { SintaProfile } from '../types';

import { driver } from 'driver.js';
import "driver.js/dist/driver.css";
import "../styles/driver.css";

const SintaScraper: React.FC = () => {
    const [sintaId, setSintaId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SintaProfile | null>(null);
    const [error, setError] = useState('');
    const [, setHasScraped] = useState(false);

    // Ekstraksi ID SINTA dari input yang bisa berupa angka murni atau URL profil SINTA
    const extractSintaId = (input: string): string | null => {
        const raw = input.trim();
        if (!raw) return null;
        // Pola URL umum SINTA: /authors/profile/<digits> atau /authors/detail/<digits>
        const urlMatch = raw.match(/authors\/(?:profile|detail)\/(\d+)/i);
        if (urlMatch && urlMatch[1]) return urlMatch[1];
        // Jika bukan URL, ambil deretan angka terpanjang minimal 4 digit
        const digitsMatch = raw.match(/(\d{4,})/);
        if (digitsMatch && digitsMatch[1]) return digitsMatch[1];
        // Jika seluruh input angka, izinkan
        if (/^\d+$/.test(raw)) return raw;
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const resolvedId = extractSintaId(sintaId);
        if (!resolvedId) {
            setError('Format ID SINTA tidak valid. Masukkan angka ID atau URL profil SINTA.');
            return;
        }

        // Sinkronkan tampilan input dengan ID yang telah diekstraksi
        if (resolvedId !== sintaId) {
            setSintaId(resolvedId);
        }

        setHasScraped(true);
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            // Langsung panggil endpoint server untuk scraping real-time
            console.log('Calling server API for Sinta ID:', resolvedId);
            const response = await axios.get(`http://localhost:3001/api/authors/${resolvedId}`, { timeout: 60000 });
            console.log('Server response:', response.data);
            setResult(response.data);
        } catch (err: any) {
            console.error('Error:', err);
            if (err.code === 'ERR_NETWORK') {
                setError('Tidak dapat terhubung ke server. Pastikan server backend berjalan di http://localhost:3001.');
            } else if (err.response) {
                if (err.response.status === 404) {
                    setError(`Profil SINTA dengan ID ${sintaId} tidak ditemukan.`);
                } else if (err.response.status === 400) {
                    setError('Format ID SINTA tidak valid di sisi server.');
                } else {
                    setError(err.response.data?.details || err.response.data?.error || 'Gagal mengambil data dari server');
                }
            } else if (err.request) {
                setError('Tidak ada respons dari server. Periksa koneksi internet Anda.');
            } else {
                setError(err.message || 'Terjadi kesalahan tak terduga');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const buildTourSteps = () => {
        const steps: any[] = [
            // { element: '#app-title', popover: { title: 'Judul Aplikasi', description: 'Halaman utama untuk melakukan scraping profil SINTA.', side: 'bottom', align: 'start' } },
            { element: '#sinta-id-form', popover: { title: 'Form Pencarian', description: 'Masukkan ID atau URL profil SINTA, lalu mulai proses.', side: 'bottom', align: 'start' } },
            { element: '#sintaId', popover: { title: 'Input SINTA', description: 'Ketik ID atau URL SINTA. Sistem otomatis mengekstrak ID.', side: 'right', align: 'start' } },
            { element: '#scrape-button', popover: { title: 'Mulai Scrape', description: 'Menjalankan pengambilan data profil dari server.', side: 'top', align: 'start' } },
        ];
        if (isLoading) steps.push({ element: '#skeleton-loading', popover: { title: 'Loading', description: 'Saat proses berjalan, skeleton tampil sebagai indikator.', side: 'top', align: 'start' } });
        if (error) steps.push({ element: '#error-alert', popover: { title: 'Notifikasi Error', description: 'Jika terjadi kesalahan, pesan akan muncul di sini.', side: 'bottom', align: 'start' } });
        if (result) {
            steps.push({ element: '#author-info', popover: { title: 'Informasi Penulis', description: 'Menampilkan nama, Sinta ID, afiliasi, program studi, dan info lainnya.', side: 'top', align: 'start' } });
            steps.push({ element: '#metrics-section', popover: { title: 'Ringkasan Metrik', description: 'Ikhtisar skor SINTA dan metrik Scopus/GS/WoS.', side: 'top', align: 'start' } });
            steps.push({ element: '#publications-section', popover: { title: 'Publikasi', description: 'Daftar publikasi yang terdaftar pada profil.', side: 'top', align: 'start' } });
            steps.push({ element: '#raw-json-section', popover: { title: 'Data Mentah', description: 'Representasi JSON dari data profil untuk debugging.', side: 'top', align: 'start' } });
        }
        steps.push({ popover: { title: 'Selesai', description: 'Sekarang kamu siap menggunakan Sinta Profile Scraper.' } });
        return steps;
    };

    const startTour = () => {
        const tour = driver({ showProgress: true, showButtons: ['next', 'previous', 'close'], steps: buildTourSteps() });
        tour.drive();
    };

    // Deteksi ketersediaan data author info
    const normalizeVal = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());
    const hasAuthorInfo = [
        result?.name,
        result?.sintaID,
        result?.affiliation,
        result?.studyProgram,
        result?.department,
        result?.institutionLocation,
        result?.codePT,
        result?.codeProdi,
    ].some((v) => normalizeVal(v).length > 0);

    // Helper: scroll ke form input & fokuskan
    const scrollToForm = () => {
        const formEl = document.getElementById('sinta-id-form');
        formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const inputEl = formEl?.querySelector('input') as HTMLInputElement | null;
        inputEl?.focus();
    };

    // Helper: muat contoh ID dan scroll ke form
    const handleLoadExample = () => {
        setSintaId('6655767');
        scrollToForm();
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <div className="text-center mb-8">
                <h1 id="app-title" className="text-3xl sm:text-4xl font-bold text-black mb-2">Sinta Profile Scraper</h1>
                <p className="text-black max-w-2xl mx-auto">Enter a Sinta ID to scrape and view academic profile information</p>
            </div>

            <div className="card-brutal mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-black">Enter Sinta Profile</h2>
                    <button
                        onClick={startTour}
                        type="button"
                        className="btn-brutal-success flex items-center gap-2"
                        aria-label="Mulai tour panduan"
                    >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help</span>
                    </button>
                </div>
                <form id="sinta-id-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sintaId" className="block text-lg font-bold text-black mb-1">
                            {/* Sinta ID */}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-black" />
                            </div>
                            <input
                                type="text"
                                id="sintaId"
                                value={sintaId}
                                onChange={(e) => { setSintaId(e.target.value); if (error) setError(''); }}
                                placeholder="Masukkan ID atau URL profil SINTA (contoh: 6655767 atau https://sinta.kemdiktisaintek.go.id/authors/profile/6655767)"
                                className="input-brutal block w-full pl-10 pr-3 py-3"
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-xs text-black/70 mt-2">
                            <span className="block mt-1 text-xs text-black/60">
                                {/* Catatan Etis: Penggunaan alat ini harus tetap memperhatikan etika riset dan privasi. Data yang diambil berasal dari sumber publik dan hanya digunakan untuk tujuan ilmiah, bukan komersial. */}
                            </span>
                        </p>
                    </div>

                    <button
                        id="scrape-button"
                        type="submit"
                        disabled={isLoading || !sintaId.trim()}
                        className="btn-brutal-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span>Scraping Profile...</span>
                            </>
                        ) : (
                            <>
                                <Search className="h-5 w-5" />
                                <span>Scrape Profile</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div id="error-alert" className="alert-brutal-error mb-8 animate-fade-in">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-black mr-2 flex-shrink-0" />
                        <h3 className="text-black font-bold">Error</h3>
                    </div>
                    <p className="text-black mt-1">{error}</p>
                </div>
            )}

            {/* Show skeleton loading when isLoading is true */}
            {isLoading && (
                <div id="skeleton-loading">
                    <SintaProfileSkeleton />
                </div>
            )}

            {result && (
                <div className="space-y-8">
                    {/* Author Information Section */}
                    <div className="card-brutal" id="author-info">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <User className="h-6 w-6 text-black" />
                            Author Information
                        </h2>
                        {hasAuthorInfo ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-200 border-4 border-black rounded-xl w-16 h-16" />
                                    <div>
                                        <h3 className="text-xl font-bold text-black">{result?.name || ''}</h3>
                                        <p className="text-black">Sinta ID: {result?.sintaID || ''}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-black" />
                                        <span className="text-black">{result?.affiliation || ''}</span>
                                    </div>
                                    <p className="text-black ml-7">{result?.studyProgram || ''}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-black" />
                                    <span className="text-black">{result?.department || ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-black" />
                                    <span className="text-black">{result?.institutionLocation || ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-black" />
                                    <span className="text-black">{result?.codePT || ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-black" />
                                    <span className="text-black">{result?.codeProdi || ''}</span>
                                </div>
                            </div>
                        ) : (
                            <div id="empty-author-info" className="text-center py-12 animate-fade-in">
                                {/* Ilustrasi SVG sederhana */}
                                <div className="mx-auto mb-6 inline-block">
                                    <svg
                                        className="w-24 h-24"
                                        viewBox="0 0 120 120"
                                        xmlns="http://www.w3.org/2000/svg"
                                        role="img"
                                        aria-label="Ilustrasi data kosong"
                                    >
                                        <rect x="10" y="20" width="100" height="70" rx="10" className="fill-white stroke-black" strokeWidth="4" />
                                        <circle cx="40" cy="55" r="16" className="fill-gray-200 stroke-black" strokeWidth="4" />
                                        <rect x="65" y="40" width="35" height="10" className="fill-gray-200 stroke-black" strokeWidth="4" />
                                        <rect x="65" y="58" width="35" height="10" className="fill-gray-200 stroke-black" strokeWidth="4" />
                                        <path d="M20 100h80" className="stroke-black" strokeWidth="4" />
                                        <path d="M50 85l10 10 20-20" className="stroke-black" strokeWidth="4" fill="none" />
                                    </svg>
                                </div>

                                <h3 className="mt-2 text-lg font-bold text-black">Data penulis tidak tersedia</h3>
                                <p className="mt-1 text-black max-w-xl mx-auto">
                                    Kami tidak menemukan informasi penulis pada profil ini. Pastikan ID SINTA benar, atau gunakan contoh untuk melihat tampilan.
                                </p>

                                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <button
                                        id="load-example-button"
                                        type="button"
                                        onClick={handleLoadExample}
                                        className="px-4 py-2 bg-white text-black border-4 border-black rounded-xl shadow-[6px_6px_0_0_#000] hover:translate-y-[2px] active:translate-y-[3px] transition"
                                        aria-label="Muat contoh ID SINTA"
                                    >
                                        Muat Contoh
                                    </button>
                                    <button
                                        id="empty-help-button"
                                        type="button"
                                        onClick={startTour}
                                        className="px-4 py-2 bg-[var(--brutal-blue)] text-white border-4 border-black rounded-xl shadow-[6px_6px_0_0_#000] hover:translate-y-[2px] active:translate-y-[3px] transition"
                                        aria-label="Mulai tur panduan"
                                    >
                                        Mulai Tur
                                    </button>
                                    <button
                                        type="button"
                                        onClick={scrollToForm}
                                        className="px-4 py-2 bg-white text-black border-4 border-black rounded-xl shadow-[6px_6px_0_0_#000] hover:translate-y-[2px] active:translate-y-[3px] transition"
                                        aria-label="Isi ID SINTA"
                                    >
                                        Isi ID SINTA
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metrics Section */}
                    <div className="card-brutal" id="metrics-section">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-black" />
                            Metrics Overview
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard 
                                title="Sinta Score" 
                                value={Number(result?.sintaScore) || 0} 
                                description="Overall Sinta Score"
                                theme="info"
                            />
                            <StatCard 
                                title="Sinta 3Yr" 
                                value={Number(result?.sintaScore3Yr) || 0} 
                                description="Sinta Score (3 Years)"
                                theme="success"
                            />
                            <StatCard 
                                title="Affil Score" 
                                value={Number(result?.affilScore) || 0} 
                                description="Affiliation Score"
                                theme="warning"
                            />
                            <StatCard 
                                title="Affil 3Yr" 
                                value={Number(result?.affilScore3Yr) || 0} 
                                description="Affiliation Score (3 Years)"
                                theme="default"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card-brutal bg-blue-100">
                                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    Scopus Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard 
                                        title="Articles" 
                                        value={Number(result?.scopusMetrics?.articles) || 0} 
                                        description="Scopus Articles"
                                        theme="info"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="Citations" 
                                        value={Number(result?.scopusMetrics?.citations) || 0} 
                                        description="Scopus Citations"
                                        theme="info"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="Cited Docs" 
                                        value={Number(result?.scopusMetrics?.citedDocs) || 0} 
                                        description="Scopus Cited Docs"
                                        theme="info"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="H-Index" 
                                        value={Number(result?.scopusMetrics?.hIndex) || 0} 
                                        description="Scopus H-Index"
                                        theme="info"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="i10-Index" 
                                        value={Number(result?.scopusMetrics?.i10Index) || 0} 
                                        description="Scopus i10-Index"
                                        theme="info"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="G-Index" 
                                        value={Number(result?.scopusMetrics?.gIndex) || 0} 
                                        description="Scopus G-Index"
                                        theme="info"
                                        formatter={(val) => val.toString()}
                                    />
                                </div>
                            </div>
                            
                            <div className="card-brutal bg-green-100">
                                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    Google Scholar Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard 
                                        title="Articles" 
                                        value={Number(result?.gsMetrics?.articles) || 0} 
                                        description="GS Articles"
                                        theme="success"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="Citations" 
                                        value={Number(result?.gsMetrics?.citations) || 0} 
                                        description="GS Citations"
                                        theme="success"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="Cited Docs" 
                                        value={Number(result?.gsMetrics?.citedDocs) || 0} 
                                        description="GS Cited Docs"
                                        theme="success"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="H-Index" 
                                        value={Number(result?.gsMetrics?.hIndex) || 0} 
                                        description="GS H-Index"
                                        theme="success"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="i10-Index" 
                                        value={Number(result?.gsMetrics?.i10Index) || 0} 
                                        description="GS i10-Index"
                                        theme="success"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="G-Index" 
                                        value={Number(result?.gsMetrics?.gIndex) || 0} 
                                        description="GS G-Index"
                                        theme="success"
                                        formatter={(val) => val.toString()}
                                    />
                                </div>
                            </div>

                            <div className="card-brutal bg-purple-100">
                                <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    Web of Science Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard 
                                        title="Articles" 
                                        value={Number(result?.wosMetrics?.articles) || 0} 
                                        description="WOS Articles"
                                        theme="default"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="Citations" 
                                        value={Number(result?.wosMetrics?.citations) || 0} 
                                        description="WOS Citations"
                                        theme="default"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="Cited Docs" 
                                        value={Number(result?.wosMetrics?.citedDocs) || 0} 
                                        description="WOS Cited Docs"
                                        theme="default"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="H-Index" 
                                        value={Number(result?.wosMetrics?.hIndex) || 0} 
                                        description="WOS H-Index"
                                        theme="default"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="i10-Index" 
                                        value={Number(result?.wosMetrics?.i10Index) || 0} 
                                        description="WOS i10-Index"
                                        theme="default"
                                        formatter={(val) => val.toString()}
                                    />
                                    <StatCard 
                                        title="G-Index" 
                                        value={Number(result?.wosMetrics?.gIndex) || 0} 
                                        description="WOS G-Index"
                                        theme="default"
                                        formatter={(val) => val.toString()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Publications Section */}
                    <div className="card-brutal">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-black" />
                                Publications
                            </h2>
                            <span className="badge-brutal-primary">
                                {(result.publications?.length) || 0} items
                            </span>
                        </div>
                        
                        {(result.publications?.length || 0) > 0 ? (
                            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                {result.publications?.map((publication, index) => (
                                    <PublicationCard key={index} publication={publication} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="mx-auto h-12 w-12 text-black" />
                                <h3 className="mt-2 text-lg font-bold text-black">No publications found</h3>
                                <p className="mt-1 text-black">This author doesn't have any publications listed.</p>
                            </div>
                        )}
                    </div>

                    {/* Raw JSON Section */}
                    <div className="card-brutal" id="raw-json-section">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <FileJson className="h-6 w-6 text-black" />
                            Raw JSON Data
                        </h2>
                        <div className="bg-gray-100 border-2 border-black rounded p-4 overflow-x-auto">
                            <pre className="text-sm text-black">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SintaScraper;