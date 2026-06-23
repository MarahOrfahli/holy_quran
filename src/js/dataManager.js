export default async function getSurahIndex() {
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
    const response = await import(`../data/surah/surah_${surahNumber}.json`, {
      with: { type: 'json' }
    });
    
    const Data = response.default;
    return Data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}


