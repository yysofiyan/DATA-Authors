export interface Publication {
  title: string;
  url?: string;
  type?: string;
  journal_conference: string;
  authorOrder?: string;
  creator?: string;
  year: number;
  cited: number;
}

export interface SintaProfile {
  name: string;
  affiliation: string;
  studyProgram: string;
  sintaID: string;
  subjects: string[];
  sintaScoreOverall: number;
  sintaScore3Yr: number;
  affilScore: number;
  affilScore3Yr: number;
  photoUrl: string;
  institutionLocation?: string;
  codePT?: string;
  codeProdi?: string;
  scopusMetrics?: {
    articles: number;
    citations: number;
    hIndex: number;
    i10Index: number;
    gIndex: number;
    citedDocs: number;
  };
  gsMetrics?: {
    articles: number;
    citations: number;
    hIndex: number;
    i10Index: number;
    gIndex: number;
    citedDocs: number;
  };
  publications: Publication[];
}