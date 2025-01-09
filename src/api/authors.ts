import { SintaProfile } from "../types";

export async function fetchAuthors(): Promise<SintaProfile[]> {
  const response = await fetch('http://localhost:5001/api/authors'); // Ganti dengan URL API Anda
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: SintaProfile[] = await response.json();
  return data;
} 