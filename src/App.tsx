import { useState, useEffect } from 'react';
import { GraduationCap, Building2, BookOpen, Award, ArrowLeft } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { PublicationCard } from './components/PublicationCard';
import { AuthorCard } from './components/AuthorCard';
import type { SintaProfile } from './types';
import { fetchAuthors } from './api/authors';

function App() {
  const [authorsData, setAuthorsData] = useState<SintaProfile[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<SintaProfile | null>(null);

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const authors = await fetchAuthors();
        setAuthorsData(authors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    getAuthors();
  }, []);

  if (selectedAuthor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => setSelectedAuthor(null)}
              className="flex items-center gap-2 text-white mb-6 hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Authors
            </button>
            <h1 className="text-4xl font-bold mb-4">{selectedAuthor.name}</h1>
            <div className="flex flex-wrap gap-6 text-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{selectedAuthor.affiliation}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>{selectedAuthor.studyProgram}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>SINTA ID: {selectedAuthor.sintaID}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Research Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedAuthor.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="SINTA Score Overall"
              value={selectedAuthor.sintaScoreOverall}
              description="Total SINTA score across all years"
            />
            <StatCard
              title="SINTA Score (3 Years)"
              value={selectedAuthor.sintaScore3Yr}
              description="SINTA score for the last 3 years"
            />
            <StatCard
              title="Affiliation Score"
              value={selectedAuthor.affilScore}
              description="Total score from affiliated works"
            />
            <StatCard
              title="Affiliation Score (3 Years)"
              value={selectedAuthor.affilScore3Yr}
              description="Affiliation score for the last 3 years"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-6">Scopus</h2>
          <div className="space-y-4">
            {selectedAuthor.publications.map((pub, index) => (
              <PublicationCard key={index} publication={pub} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">SINTA Authors</h1>
          <p className="text-gray-100">Browse and explore author profiles from SINTA database</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorsData.map((author, index) => (
            <AuthorCard
              key={index}
              author={author}
              onClick={() => setSelectedAuthor(author)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;