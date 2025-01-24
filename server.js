import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001; // Ganti 5000 menjadi 5001

app.use(cors());
app.use(express.json());

// Contoh data penulis
const authors = [
  {
    sintaID: "6655767",
    name: "YAN YAN SOFIYAN",
    photoUrl: "https://scholar.google.co.id/citations?view_op=view_photo&user=OX1ogLQAAAAJ&citpid=1",
    affiliation: "Universitas Sebelas April",
    studyProgram: "S1 - Sistem Informasi",
    institutionName: "Universitas Sebelas April",
    institutionLocation: "KAB. SUMEDANG - JAWA BARAT, ID",
    codePT: "041097",
    codeProdi: "57201",
    
    // Metrics
    sintaScoreOverall: 224,
    sintaScore3Yr: 79,
    affilScore: 0,
    affilScore3Yr: 0,
    
    // Scopus metrics
    scopusMetrics: {
      articles: 5,
      citations: 22,
      hIndex: 3,
      i10Index: 1,
      gIndex: 2,
      citedDocs: 4
    },
    
    // Google Scholar metrics
    gsMetrics: {
      articles: 28,
      citations: 126,
      hIndex: 7,
      i10Index: 5,
      gIndex: 1,
      citedDocs: 12
    },
    
    // Web of Science metrics
    wosMetrics: {
      articles: 0,
      citations: 0,
      citedDocs: 0,
      hIndex: "-",
      i10Index: "-",
      gIndex: "-"
    },
    
    // Publications array
    publications: [
      {
        title: "Waste Classifier using Naive Bayes Algorithm",
        url: "https://www.scopus.com/record/display.uri?eid=2-s2.0-85142876992",
        type: "no-Q as Conference Proceedin",
        journal_conference: "2022 10th International Conference on Cyber and IT Service Management, CITSM 2022",
        authorOrder: "5 of 6", // Diubah dari AuthorOrder
        creator: "Fadil I.", // Diubah dari Creator
        year: 2022,
        cited: 4
      },
      {
        title: "Microservices Technology on the Development of the Massive Open Online Course in Higher Educations",
        url: "https://www.scopus.com/authid/detail.uri?authorId=57421449500",
        type: "no-Q as Conference Proceedin",
        journal_conference: "2021 9th International Conference on Cyber and IT Service Management, CITSM 2021",
        authorOrder: "1 of 3",
        creator: "Sofiyan Y.",
        year: 2021,
        cited: 0
      },
      {
        title: "Security Model using Intrusion Detection System on Cloud Computing Security Management",
        url: "https://www.scopus.com/record/display.uri?eid=2-s2.0-85123246304&origin=resultslist",
        type: "no-Q as Conference Procedin",
        journal_conference: "2021 9th International Conference on Cyber and IT Service Management, CITSM 2021",
        authorOrder: "3 of 4",
        creator: "Helmiawan M.A.",
        year: 2021,
        cited: 2
      },
      {
        title: "Optimization Parameters Support Vector Regression using Grid Search Method",
        journal_conference: "2021 9th International Conference on Cyber and IT Service Management, CITSM 2021",
        year: 2021,
        cited: 6
      }
    ]
  },
  // Tambahkan penulis lain sesuai kebutuhan
];

// Endpoint untuk mengambil data penulis
app.get('/api/authors', (req, res) => {
  res.json(authors);
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Ekspor app setelah deklarasi
export default app;