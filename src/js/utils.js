import getSurahIndex , { getSurah } from './dataManager.js';


export async function showAllVerses() {
  const data = await getSurahIndex(); 
  return data
}

export async function displaySurahInUI(number) {
  const surah = await getSurah(number);

  if (surah) {
    console.log(`Surah ${surah.name}: `, surah);
    // return surah
  }
}
