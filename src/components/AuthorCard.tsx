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
    <div 
      className="border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Layout flex untuk konten kartu */}
      <div className="flex items-start gap-4">
        {/* Container untuk foto profil */}
        <div className="flex-shrink-0">
          {author.photoUrl ? (
            // Jika ada URL foto, tampilkan gambar profil
            <img 
              src={author.photoUrl} 
              alt={author.name} 
              className="w-16 h-16 rounded-full object-cover border-4 border-black"
            />
          ) : (
            // Jika tidak ada URL foto, tampilkan ikon User sebagai fallback
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-4 border-black">
              <User className="w-8 h-8 text-black" />
            </div>
          )}
        </div>

        {/* Bagian utama konten kartu */}
        <div className="flex-1 min-w-0">
          {/* Nama penulis */}
          <h3 className="text-xl font-bold text-black mb-1 truncate">{author.name}</h3>
          <p className="text-sm font-bold text-black mb-3">Sinta ID: {author.sintaID}</p>

          {/* Informasi dasar penulis */}
          <div className="space-y-2 text-sm text-black">
            {/* Baris untuk menampilkan afiliasi */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{author.affiliation}</span>
            </div>
            
            {/* Baris untuk menampilkan program studi */}
            <div className='flex items-center gap-2'>
              <GraduationCapIcon className='w-4 h-4 flex-shrink-0' />
              <span className="truncate">{author.studyProgram}</span>
            </div>
          </div>

          {/* Grid untuk menampilkan metrik SINTA */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Kartu untuk SINTA Score Overall */}
            <div className="text-center p-3 bg-gray-100 border-2 border-black">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-4 h-4 text-black" />
                <div className="text-lg font-bold text-black">
                  {Number(author.sintaScoreOverall) || 0}
                </div>
              </div>
              <div className="text-xs font-bold text-black truncate">SINTA Score</div>
            </div>

            {/* Kartu untuk SINTA Score 3 Tahun */}
            <div className="text-center p-3 bg-gray-100 border-2 border-black">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-black" />
                <div className="text-lg font-bold text-black">
                  {Number(author.sintaScore3Yr) || 0}
                </div>
              </div>
              <div className="text-xs font-bold text-black truncate">SINTA 3Yr</div>
            </div>

            {/* Kartu untuk Affil Score */}
            <div className="text-center p-3 bg-gray-100 border-2 border-black">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-black" />
                <div className="text-lg font-bold text-black">
                  {Number(author.affilScore) || 0}
                </div>
              </div>
              <div className="text-xs font-bold text-black truncate">Affil Score</div>
            </div>

            {/* Kartu untuk Affil Score 3 Tahun */}
            <div className="text-center p-3 bg-gray-100 border-2 border-black">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BarChart className="w-4 h-4 text-black" />
                <div className="text-lg font-bold text-black">
                  {Number(author.affilScore3Yr) || 0}
                </div>
              </div>
              <div className="text-xs font-bold text-black truncate">Affil 3Yr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}