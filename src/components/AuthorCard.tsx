import { User, Building2, GraduationCap, BookOpen } from 'lucide-react';
import type { SintaProfile } from '../types';

interface AuthorCardProps {
  author: SintaProfile;
  onClick: () => void;
}

export function AuthorCard({ author, onClick }: AuthorCardProps) {
  return (
    <div
      className="bg-white rounded-lg p-6 shadow hover:shadow-xl transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-full">
          {author.photoUrl ? (
            <img
              src={author.photoUrl}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'fallback-avatar.png'; // Optional: Add fallback image
              }}
            />
          ) : (
            <User className="w-6 h-6 text-indigo-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{author.name}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{author.affiliation}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>{author.studyProgram}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{author.subjects.slice(0, 2).join(", ")}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Publications */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {author.sintaScoreOverall}
              </div>
              <div className="text-xs text-gray-600">SINTA Score Overall</div>
            </div>

            {/* SINTA Score 3Yr */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {author.sintaScore3Yr}
              </div>
              <div className="text-xs text-gray-600">SINTA Score 3Yr</div>
            </div>

            {/* Affiliation Score */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {author.affilScore}
              </div>
              <div className="text-xs text-gray-600">Affil. Score</div>
            </div>

            {/* Affiliation Score 3Yr */}
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {author.affilScore3Yr}
              </div>
              <div className="text-xs text-gray-600">Affil. Score 3Yr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}