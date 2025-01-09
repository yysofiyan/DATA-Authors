import { FileText, Calendar, Quote } from 'lucide-react';
import type { Publication } from '../types';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-start gap-2">
        <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
        <span>{publication.title}</span>
      </h3>
      <div className="space-y-2 text-gray-600">
        <p className="text-sm">{publication.journal_conference}</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{publication.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Quote className="w-4 h-4" />
            <span>{publication.cited} citations</span>
          </div>
        </div>
      </div>
    </div>
  );
}