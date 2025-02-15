// Impor modul dan komponen yang diperlukan
import { useState, useEffect } from 'react';
import { Award, ArrowLeft, Hash, Building2 } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { PublicationCard } from './components/PublicationCard';
import { AuthorCard } from './components/AuthorCard';
import type { SintaProfile } from './types';
import { fetchAuthors } from './api/authors';
import { MetricsTable } from './components/MetricsTable';

// Komponen utama aplikasi
function App() {
  // State management untuk data penulis, penulis yang dipilih, loading, dan error
  const [authorsData, setAuthorsData] = useState<SintaProfile[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<SintaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Jumlah publikasi per halaman

  // Effect untuk mengambil data penulis saat komponen pertama kali di-mount
  useEffect(() => {
    const getAuthors = async () => {
      try {
        setLoading(true);
        const authors = await fetchAuthors();
        setAuthorsData(authors);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch authors');
      } finally {
        setLoading(false);
      }
    };

    getAuthors();
  }, []);

  // Hitung total halaman
  const totalPages = Math.ceil(selectedAuthor?.publications?.length || 0 / itemsPerPage);

  // Ambil data publikasi untuk halaman saat ini
  const currentPublications = selectedAuthor?.publications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Tampilkan loading state jika data sedang dimuat
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  // Tampilkan error message jika terjadi kesalahan
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  // Render tampilan detail jika ada penulis yang dipilih
  if (selectedAuthor) {
    console.log('Selected Author Publications:', selectedAuthor?.publications);
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header dengan gradient dan tombol kembali */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setSelectedAuthor(null)}
              className="flex items-center gap-2 text-white mb-6 hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Authors
            </button>

            {/* Grid untuk menampilkan statistik penulis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <StatCard
                title="SINTA Score"
                value={selectedAuthor.sintaScoreOverall ? Number(selectedAuthor.sintaScoreOverall) : 0}
                description="SINTA Score Overall"
                icon={<Award />}
                theme="success"
              />
              <StatCard
                title="Affiliation Score"
                value={selectedAuthor.affilScore}
                description="Overall Affiliation Score"
                icon={<Building2 />}
                theme="info"
              />
              <StatCard
                title="h-index"
                value={selectedAuthor.scopusMetrics.hIndex}
                description="Scopus h-index"
                icon={<Hash />}
                theme="success"
              />
              <StatCard
                title="Total Publications"
                value={selectedAuthor?.publications?.length || 0}
                description="Total number of publications"
              />
            </div>
          </div>
        </header>

        {/* Main content untuk menampilkan publikasi penulis */}
        <main className="container mx-auto px-4 py-8">
          {/* Tambahkan tabel metrik */}
          <MetricsTable
            scopusMetrics={{
              articles: Number(selectedAuthor?.scopusMetrics?.articles),
              citations: Number(selectedAuthor?.scopusMetrics?.citations),
              citedDocs: Number(selectedAuthor?.scopusMetrics?.citedDocs),
              hIndex: Number(selectedAuthor?.scopusMetrics?.hIndex),
              i10Index: Number(selectedAuthor?.scopusMetrics?.i10Index),
              gIndex: Number(selectedAuthor?.scopusMetrics?.gIndex)
            }}
            gsMetrics={{
              articles: Number(selectedAuthor?.gsMetrics?.articles),
              citations: Number(selectedAuthor?.gsMetrics?.citations),
              citedDocs: Number(selectedAuthor?.gsMetrics?.citedDocs),
              hIndex: Number(selectedAuthor?.gsMetrics?.hIndex),
              i10Index: Number(selectedAuthor?.gsMetrics?.i10Index),
              gIndex: Number(selectedAuthor?.gsMetrics?.gIndex)
            }}
          />

          {currentPublications && currentPublications.length > 0 ? (
            <div className="space-y-6">
              {currentPublications.map((publication, index) => (
                <PublicationCard key={index} publication={publication} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              No publications found for this author.
            </div>
          )}

          {/* Tambahkan komponen pagination */}
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Render tampilan utama daftar penulis
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan judul aplikasi */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">SINTA Profiles</h1>
        </div>
      </header>

      {/* Main content untuk menampilkan kartu penulis */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorsData.map((author) => (
            <AuthorCard
              key={author.sintaID}
              author={author}
              onClick={() => setSelectedAuthor(author)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// Export komponen utama
export default App;