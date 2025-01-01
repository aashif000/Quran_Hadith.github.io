const BASE_URL = "https://api.alquran.cloud/v1";

export const getQuran = async (edition: string) => {
  const response = await fetch(`${BASE_URL}/quran/${edition}`);
  return response.json();
};

export const getSurah = async (surahNumber: string, edition: string) => {
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
  return response.json();
};

export const getJuz = async (juzNumber: string, edition: string) => {
  const response = await fetch(`${BASE_URL}/juz/${juzNumber}/${edition}`);
  return response.json();
};

export const getRuku = async (rukuNumber: string, edition: string) => {
  const response = await fetch(`${BASE_URL}/ruku/${rukuNumber}/${edition}`);
  return response.json();
};

export const getPage = async (pageNumber: string, edition: string) => {
  const response = await fetch(`${BASE_URL}/page/${pageNumber}/${edition}`);
  return response.json();
};

export const getHizbQuarter = async (hizbNumber: string, edition: string) => {
  const response = await fetch(`${BASE_URL}/hizbQuarter/${hizbNumber}/${edition}`);
  return response.json();
};

export const getAyah = async (reference: string, edition: string) => {
  const response = await fetch(`${BASE_URL}/ayah/${reference}/${edition}`);
  return response.json();
};

export const getAyahEditions = async (reference: string, editions: string[]) => {
  const editionsStr = editions.join(',');
  const response = await fetch(`${BASE_URL}/ayah/${reference}/editions/${editionsStr}`);
  return response.json();
};

export const getManzil = async (manzilNumber: string, edition: string, offset?: number, limit?: number) => {
  let url = `${BASE_URL}/manzil/${manzilNumber}/${edition}`;
  if (offset !== undefined || limit !== undefined) {
    const params = new URLSearchParams();
    if (offset !== undefined) params.append('offset', offset.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    url += `?${params.toString()}`;
  }
  return (await fetch(url)).json();
};

export const searchQuran = async (keyword: string, surah: string = "all", edition: string = "en") => {
  const response = await fetch(`${BASE_URL}/search/${keyword}/${surah}/${edition}`);
  return response.json();
};