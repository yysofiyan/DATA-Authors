// Impor modul dan komponen yang diperlukan
import SintaScraper from './components/SintaScraper';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* <header className="bg-white border-b-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black">Sinta Profile Scraper</h1>
              <p className="mt-1 text-black">
                Enter a Sinta ID to scrape and view academic profile information
              </p>
            </div>
          </div>
        </div>
      </header> */}
      <main className="py-8">
        <SintaScraper />
      </main>
      <Footer 
        appName="Sinta Profile Scraper" 
        githubUsername="yysofiyan" 
        githubUserId="34052001" 
      />
    </div>
  );
}

export default App;