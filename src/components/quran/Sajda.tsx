import React, { useEffect, useState } from 'react';

interface Ayah {
  number: number;
  text: string; // Arabic text
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
}

interface SajdaData {
  ayahs: Ayah[];
}

interface UthmaniData {
  ayahs: {
    number: number;
    text: string; // Uthmani Arabic text
  }[];
}

const Sajda: React.FC = () => {
  const [asadData, setAsadData] = useState<SajdaData | null>(null);
  const [uthmaniData, setUthmaniData] = useState<UthmaniData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch both Asad and Uthmani data
  const fetchSajdaVerses = async () => {
    try {
      // Fetch Asad translation
      const asadResponse = await fetch('http://api.alquran.cloud/v1/sajda/en.asad');
      if (!asadResponse.ok) {
        throw new Error('Failed to fetch Asad data');
      }
      const asadResult = await asadResponse.json();
      setAsadData(asadResult.data);

      // Fetch Uthmani text
      const uthmaniResponse = await fetch('http://api.alquran.cloud/v1/sajda/quran-uthmani');
      if (!uthmaniResponse.ok) {
        throw new Error('Failed to fetch Uthmani data');
      }
      const uthmaniResult = await uthmaniResponse.json();
      setUthmaniData(uthmaniResult.data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSajdaVerses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Sajda Verses</h1>
      {asadData?.ayahs.map((ayah, index) => (
        <div key={ayah.number} style={{ marginBottom: '20px' }}>
          <h2>
            Surah {ayah.surah.englishName} (Surah {ayah.surah.number}): Ayah {ayah.number}
          </h2>

          {/* Display Uthmani text */}
          <p
            style={{
              fontSize: '1.5em',
              fontWeight: 'bold',
              direction: 'rtl', // Ensures the Arabic text is displayed right-to-left
              fontFamily: 'Scheherazade, Noto Naskh Arabic, Tahoma, sans-serif', // Using Arabic-supporting fonts
            }}
          >
            {uthmaniData?.ayahs[index]?.text}
          </p>

          {/* Display Asad translation */}
          <p
            style={{
              fontSize: '1.5em',
              fontWeight: 'bold',
              direction: 'ltr', // English text is left-to-right
            }}
          >
            {ayah.text} {/* Asad translation (Arabic) */}
          </p>

          {/* Optional: Display the English translation */}
          <p style={{ fontSize: '1.2em', color: 'gray' }}>
            {ayah.surah.englishNameTranslation} Ayah {ayah.number}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Sajda;
