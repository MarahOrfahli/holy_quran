export default async function getJuzIndex() {
  try {

    const response = await import(`../data/quran_juz.json`, {
      with: { type: 'json' }
    });
    const Data = response.default;
    return Data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export async function getSurahsIndex() {
  try {

    const response = await import(`../data/surah.json`, {
      with: { type: 'json' }
    });
    const Data = response.default;
    return Data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export async function getSurah(surahNumber) {
  try {
    const response = await import(`../data/verses/surah_${surahNumber}.json`, {
      with: { type: 'json' }
    });
    
    const Data = response.default;
    return Data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}


