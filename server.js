import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001; // Ganti 5000 menjadi 5001

app.use(cors());
app.use(express.json());

// Contoh data penulis
const authors = [
  {
    name: "YAN YAN SOFIYAN",
    affiliation: "Universitas Sebelas April",
    studyProgram: "S1 - Sistem Informasi",
    sintaID: "6655767",
    subjects: [
      "Information Systems",
      "Web Based Application",
      "Software Developer"
    ],
    sintaScoreOverall: 229,
    sintaScore3Yr: 79,
    affilScore: 0,
    affilScore3Yr: 0,
    publications: [
      {
        title: "Waste Classifier using Naive Bayes Algorithm",
        journal_conference: "2022 10th International Conference on Cyber and IT Service Management, CITSM 2022",
        year: 2022,
        cited: 3
      },
      {
        title: "Microservices Technology on the Development of the Massive Open Online Course in Higher Educations",
        journal_conference: "2021 9th International Conference on Cyber and IT Service Management, CITSM 2021",
        year: 2021,
        cited: 0
      },
      {
        title: "Security Model using Intrusion Detection System on Cloud Computing Security Management",
        journal_conference: "2021 9th International Conference on Cyber and IT Service Management, CITSM 2021",
        year: 2021,
        cited: 2
      },
      {
        title: "Optimization Parameters Support Vector Regression using Grid Search Method",
        journal_conference: "2021 9th International Conference on Cyber and IT Service Management, CITSM 2021",
        year: 2021,
        cited: 6
      }
    ],
    photoUrl: "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=OX1ogLQAAAAJ&citpid=1"
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