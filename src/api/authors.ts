import { SintaProfile } from "../types";

export async function fetchAuthors(): Promise<SintaProfile[]> {
  const response = await fetch('https://yysofiyan-savvytomatotoad.web.val.run/api/authors'); // URL API Local http://localhost:5001/api/authors
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: SintaProfile[] = await response.json();
  return data;
} 