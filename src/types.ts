export interface Publication {
  title: string | null;
  journal_conference: string | null;
  year: number | null;
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
  publications: Publication[];
}