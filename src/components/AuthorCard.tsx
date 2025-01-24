// Impor komponen ikon dari library lucide-react
import { User, Building2, Award, TrendingUp, BarChart, GraduationCapIcon } from 'lucide-react';

// Impor tipe data SintaProfile dari file types
import type { SintaProfile } from '../types';

// Interface untuk mendefinisikan properti komponen AuthorCard
interface AuthorCardProps {
  author: SintaProfile; // Data profil penulis dari SINTA
  onClick: () => void;  // Handler untuk event klik pada kartu
}

// Komponen utama AuthorCard
export function AuthorCard({ author, onClick }: AuthorCardProps) {
  return (
    // Container utama kartu dengan styling dan efek hover
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-xl transition-all cursor-pointer" onClick={onClick}>
      {/* Layout flex untuk konten kartu */}
      <div className="flex items-start gap-4">
        {/* Container untuk foto profil */}
        <div className="p-3 bg-indigo-100 rounded-full">
          {author.photoUrl ? (
            // Jika ada URL foto, tampilkan gambar profil
            <img src={author.photoUrl} alt={author.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            // Jika tidak ada URL foto, tampilkan ikon User sebagai fallback
            <User className="w-6 h-6 text-indigo-600" />
          )}
        </div>

        {/* Bagian utama konten kartu */}
        <div className="flex-1">
          {/* Nama penulis */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{author.name}</h3>

          {/* Informasi dasar penulis */}
          <div className="space-y-2 text-sm text-gray-600">
            {/* Baris untuk menampilkan afiliasi */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{author.affiliation}</span>
            </div>
            
            {/* Baris untuk menampilkan program studi */}
            <div className='flex items-center gap-2'>
              <GraduationCapIcon className='w-4 h-4' />
              <span>{author.studyProgram}</span>
            </div>
          </div>

          {/* Grid untuk menampilkan metrik SINTA */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Kartu untuk SINTA Score Overall */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-4 h-4 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">
                  {author.sintaScoreOverall}
                </div>
              </div>
              <div className="text-xs text-gray-600">SINTA Score</div>
            </div>

            {/* Kartu untuk SINTA Score 3 Tahun */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">
                  {author.sintaScore3Yr}
                </div>
              </div>
              <div className="text-xs text-gray-600">SINTA 3Yr</div>
            </div>

            {/* Kartu untuk Affil Score */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">
                  {author.affilScore}
                </div>
              </div>
              <div className="text-xs text-gray-600">Affil Score</div>
            </div>

            {/* Kartu untuk Affil Score 3 Tahun */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BarChart className="w-4 h-4 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">
                  {author.affilScore3Yr}
                </div>
              </div>
              <div className="text-xs text-gray-600">Affil 3Yr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}