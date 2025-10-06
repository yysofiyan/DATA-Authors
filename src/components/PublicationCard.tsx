import { Calendar, Quote, FileText, Link as LinkIcon } from 'lucide-react';
import type { Publication } from '../types';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <FileText className="w-5 h-5 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-black mb-2 leading-tight">
            {publication.title}
          </h3>
          
          <div className="space-y-2 text-black">
            {publication.journal_conference && (
              <p className="text-sm">{publication.journal_conference}</p>
            )}
            
            {publication.creator && (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-black">Author: {publication.creator}</p>
                {publication.authorOrder && (
                  <span className="inline-flex items-center px-2 py-0.5 border-2 border-black text-xs font-bold bg-white text-black flex-shrink-0">
                    {publication.authorOrder}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {publication.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="text-sm font-bold">{publication.year}</span>
                </div>
              )}
              {publication.cited !== undefined && publication.cited > 0 && (
                <div className="flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="text-sm font-bold">{publication.cited} citations</span>
                </div>
              )}
              {publication.url && publication.url !== '#' && (
                <a 
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-black hover:text-blue-700 text-sm font-bold transition-colors border-b-2 border-black"
                >
                  <LinkIcon className="w-4 h-4 flex-shrink-0" />
                  <span>View Publication</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}