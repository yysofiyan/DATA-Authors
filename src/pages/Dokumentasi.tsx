import React from 'react';
import { ExternalLink, Code, Database, Globe, Zap, Palette, Shield, Package } from 'lucide-react';

const References: React.FC = () => {
  const frontendLibraries = [
    {
      name: 'React',
      version: '18.3.1',
      description: 'Library JavaScript untuk membangun user interface yang interaktif dan responsif.',
      url: 'https://react.dev/',
      category: 'Frontend Framework'
    },
    {
      name: 'TypeScript',
      version: '5.5.3',
      description: 'Superset JavaScript yang menambahkan static typing untuk development yang lebih aman.',
      url: 'https://www.typescriptlang.org/',
      category: 'Language'
    },
    {
      name: 'Vite',
      version: '5.4.2',
      description: 'Build tool modern yang sangat cepat untuk development dan production.',
      url: 'https://vitejs.dev/',
      category: 'Build Tool'
    },
    {
      name: 'TailwindCSS',
      version: '3.4.17',
      description: 'Utility-first CSS framework untuk styling yang cepat dan konsisten.',
      url: 'https://tailwindcss.com/',
      category: 'CSS Framework'
    },
    {
      name: 'Lucide React',
      version: '0.344.0',
      description: 'Koleksi icon SVG yang beautiful dan customizable untuk React.',
      url: 'https://lucide.dev/',
      category: 'Icons'
    },
    {
      name: 'Driver.js',
      version: '1.3.6',
      description: 'Powerful, lightweight, vanilla JavaScript engine to drive the user\'s focus across the page.',
      url: 'https://driverjs.com/',
      category: 'Tour & Onboarding'
    }
  ];

  const backendLibraries = [
    {
      name: 'Express.js',
      version: '4.21.2',
      description: 'Web framework minimal dan fleksibel untuk Node.js.',
      url: 'https://expressjs.com/',
      category: 'Backend Framework'
    },
    {
      name: 'Axios',
      version: '1.6.2',
      description: 'HTTP client library untuk melakukan request API dengan Promise-based.',
      url: 'https://axios-http.com/',
      category: 'HTTP Client'
    },
    {
      name: 'Cheerio',
      version: '1.0.0',
      description: 'Server-side implementation jQuery untuk web scraping dan parsing HTML.',
      url: 'https://cheerio.js.org/',
      category: 'Web Scraping'
    },
    {
      name: 'CORS',
      version: '2.8.5',
      description: 'Middleware Express untuk mengaktifkan Cross-Origin Resource Sharing.',
      url: 'https://github.com/expressjs/cors',
      category: 'Middleware'
    },
    {
      name: 'Playwright',
      version: '1.42.1',
      description: 'Framework untuk web testing dan automation browser.',
      url: 'https://playwright.dev/',
      category: 'Testing & Automation'
    },
    {
      name: 'Serverless HTTP',
      version: '3.2.0',
      description: 'Wrapper untuk menjalankan Express apps di serverless environment.',
      url: 'https://github.com/dougmoscrop/serverless-http',
      category: 'Serverless'
    }
  ];

  const devTools = [
    {
      name: 'ESLint',
      version: '9.9.1',
      description: 'Linter untuk mengidentifikasi dan memperbaiki masalah dalam kode JavaScript/TypeScript.',
      url: 'https://eslint.org/',
      category: 'Code Quality'
    },
    {
      name: 'PostCSS',
      version: '8.4.49',
      description: 'Tool untuk transforming CSS dengan JavaScript plugins.',
      url: 'https://postcss.org/',
      category: 'CSS Processing'
    },
    {
      name: 'Autoprefixer',
      version: '10.4.20',
      description: 'PostCSS plugin untuk menambahkan vendor prefixes secara otomatis.',
      url: 'https://autoprefixer.github.io/',
      category: 'CSS Processing'
    }
  ];

  const externalServices = [
    {
      name: 'SINTA (Science and Technology Index)',
      description: 'Portal untuk mengakses data publikasi ilmiah dan metrik penelitian Indonesia',
      url: 'https://sinta.kemdikbud.go.id/',
      category: 'Research Database'
    },
    {
      name: 'Scopus',
      description: 'Database abstrak dan sitasi terbesar untuk literatur peer-reviewed',
      url: 'https://www.scopus.com/',
      category: 'Research Database'
    },
    {
      name: 'Google Scholar',
      description: 'Search engine untuk literatur akademik dan publikasi ilmiah',
      url: 'https://scholar.google.com/',
      category: 'Research Database'
    },
    {
      name: 'LinkedIn',
      description: 'Platform networking profesional untuk koneksi akademik dan industri',
      url: 'https://linkedin.com/',
      category: 'Professional Network'
    },
    {
      name: 'Netlify',
      description: 'Platform hosting dan deployment untuk aplikasi web modern',
      url: 'https://netlify.com/',
      category: 'Hosting & Deployment'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend Framework':
      case 'Backend Framework':
        return <Code className="w-5 h-5" />;
      case 'CSS Framework':
      case 'CSS Processing':
        return <Palette className="w-5 h-5" />;
      case 'Research Database':
        return <Database className="w-5 h-5" />;
      case 'Build Tool':
        return <Zap className="w-5 h-5" />;
      case 'Professional Network':
      case 'Hosting & Deployment':
        return <Globe className="w-5 h-5" />;
      case 'Code Quality':
      case 'Testing & Automation':
        return <Shield className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const LibraryCard: React.FC<{
    name: string;
    version?: string;
    description: string;
    url: string;
    category: string;
  }> = ({ name, version, description, url, category }) => (
    // Updated to use card-brutal styling
    <div className="card-brutal hover:shadow-[6px_6px_0_0_#000] transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-black">
            {getCategoryIcon(category)}
          </div>
          <div>
            <h3 className="font-bold text-black">{name}</h3>
            {version && (
              <span className="text-sm text-black font-mono">{version}</span>
            )}
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700 transition-colors"
          aria-label={`Visit ${name} website`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <p className="text-black text-sm mb-3">{description}</p>
      <span className="inline-block px-2 py-1 border-2 border-black text-black text-xs font-bold">
        {category}
      </span>
    </div>
  );

  const Section: React.FC<{
    title: string;
    description: string;
    libraries: Array<{
      name: string;
      version?: string;
      description: string;
      url: string;
      category: string;
    }>;
  }> = ({ title, description, libraries }) => (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
        <p className="text-black">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((library, index) => (
          <LibraryCard key={index} {...library} />
        ))}
      </div>
    </section>
  );

  return (
    // Updated background and removed min-h-screen
    <div className="bg-white py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Referensi & Dokumentasi Sistem
          </h1>
          <p className="text-black max-w-3xl mx-auto">
            Dokumentasi lengkap tentang teknologi, library, dan layanan yang digunakan 
            dalam pengembangan Portal Penelitian ini. Sistem ini dibangun dengan 
            teknologi modern untuk memberikan performa optimal dan pengalaman pengguna yang baik.
          </p>
        </div>

        {/* System Architecture Overview */}
        {/* Updated to use card-brutal styling */}
        <div className="card-brutal mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Arsitektur Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="border-4 border-black bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Code className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-bold text-black mb-2">Frontend</h3>
              <p className="text-sm text-black">
                React 18 + TypeScript dengan TailwindCSS untuk UI yang responsif dan modern
              </p>
            </div>
            <div className="text-center">
              <div className="border-4 border-black bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Database className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-bold text-black mb-2">Backend</h3>
              <p className="text-sm text-black">
                Express.js dengan web scraping menggunakan Cheerio dan Playwright
              </p>
            </div>
            <div className="text-center">
              <div className="border-4 border-black bg-purple-100 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-bold text-black mb-2">Deployment</h3>
              <p className="text-sm text-black">
                Netlify untuk hosting dengan serverless functions untuk API
              </p>
            </div>
          </div>
        </div>

        {/* Frontend Libraries */}
        <Section
          title="Frontend Technologies"
          description="Library dan framework yang digunakan untuk membangun antarmuka pengguna yang interaktif dan responsif."
          libraries={frontendLibraries}
        />

        {/* Backend Libraries */}
        <Section
          title="Backend Technologies"
          description="Server-side technologies untuk API, web scraping, dan data processing."
          libraries={backendLibraries}
        />

        {/* Development Tools */}
        <Section
          title="Development Tools"
          description="Tools dan utilities yang digunakan untuk development, testing, dan code quality."
          libraries={devTools}
        />

        {/* External Services */}
        <Section
          title="External Services & APIs"
          description="Layanan eksternal dan database yang diintegrasikan dalam sistem."
          libraries={externalServices}
        />

        {/* Footer */}
        {/* Updated to use card-brutal styling */}
        <div className="card-brutal text-center mb-6 pb-4">
          <h2 className="text-xl font-bold text-black mb-3">
            Tentang Dokumentasi Ini
          </h2>
          <p className="text-black mb-4">
            Dokumentasi ini dibuat untuk memberikan transparansi dan referensi lengkap 
            tentang teknologi yang digunakan dalam pengembangan Portal Penelitian. 
            Semua library dan layanan dipilih berdasarkan best practices dan kebutuhan sistem.
          </p>
          <p className="text-sm text-black mb-2">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default References;