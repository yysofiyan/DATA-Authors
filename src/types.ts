import { ReactNode } from "react";

export type Publication = {
  title: string;
  url?: string;
  type?: string;
  journal_conference?: string;
  authorOrder?: string;
  creator?: string;
  year?: number;
  cited?: number;
};

export interface SintaProfile {
  affilScore3Yr: ReactNode;
  sintaScore3Yr: ReactNode;
  sintaScoreOverall: ReactNode;
  studyProgram: ReactNode;
  sintaID: string; // maps from sinta_id
  name: string;
  photoUrl: string; // maps from photo_url
  affiliation: string;
  department: string; // maps from studyProgram
  institutionName: string; // maps from institution_name
  institutionLocation: string;
  codePT: string; // maps from code_pt
  codeProdi: string; // maps from code_prodi
  
  // SINTA Metrics
  sintaScore: string; // maps from sinta_score
  sintaScore3Years: string; // maps from sinta_score_3_years
  
  // Scopus Metrics
  scopusMetrics: {
    articles: string;
    citations: string;
    citedDocs: string;
    hIndex: string;
    i10Index: string;
    gIndex: string;
  };
  
  // Google Scholar Metrics
  gsMetrics: {
    articles: string;
    citations: string;
    citedDocs: string;
    hIndex: string;
    i10Index: string;
    gIndex: string;
  };
  
  // Web of Science Metrics
  wosMetrics: {
    articles: string;
    citations: string;
    citedDocs: string;
    hIndex: string;
    i10Index: string;
    gIndex: string;
  };
  
  // Additional Metrics
  affilScore: string;
  affilScore3Years: string;
  
  publications: Publication[];
}