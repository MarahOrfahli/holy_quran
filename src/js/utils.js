import getJuzIndex, { getSurah, getSurahsIndex } from "./dataManager.js";

// public variables
let currentSurahId = 1;
let currentJuzId = 1;
const surahData = await getSurahsIndex();
export let rtl = document.documentElement.dir === "rtl";

const search_result = document.getElementById("result-search"); // Samah

function checkDataInSurah(id, type, lang = "ar") {
  if (type == "name") {
    return lang == "ar"
      ? surahData.filter((d) => d.id == id)[0].title.ar
      : surahData.filter((d) => d.id == id)[0].title.en;
  }
}

export async function loadSurahList() {
  const surahListContainer = document.getElementById("surah-list");
  try {
    renderSurahList(surahData);
    // loadSurah(1);
  } catch (error) {
    if (surahListContainer) {
      surahListContainer.innerHTML =
        '<p class="text-rose-500 text-sm text-center">فشل في الاتصال بالخادم. يرجى التحقق من الإنترنت.</p>';
    }
  }
}

async function renderSurahList(surahs) {
  const listContainer = document.getElementById("surah-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  await surahs.forEach((surah) => {
    const isActive = surah.id === currentSurahId;
    const activeClass = isActive
      ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-r-4 border-brand-500"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-r-4 border-transparent hover:border-slate-300 dark:hover:border-slate-700";

    const html = `
      <button data-surah-id="${surah.id}" class="w-full text-right cursor-pointer flex items-center justify-between px-4 py-3 rounded-l-lg transition-all ${activeClass}">
          <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold font-amiri ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500"}">
                  ${surah.id}
              </div>
              <div class="text-right">
                  <h4 class="text-sm font-bold font-amiri">${surah.title.ar}</h4>
                  <p class="text-[10px] text-slate-400 font-cairo">${surah.surah_type.place === "Mecca" ? "مكية" : "مدنية"} • ${surah.count} آية</p>
              </div>
          </div>
          <span class="text-xs font-semibold text-slate-400 font-cairo">${surah.title.en}</span>
      </button>
    `;
    listContainer.insertAdjacentHTML("beforeend", html);
  });

  listContainer.querySelectorAll("button[data-surah-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-surah-id"));
      // loadSurah(id);
      console.log("Surah Id: ", id);
    });
  });
}

/// Loading Juz...
export async function loadJuzList() {
  const juzList = document.getElementById("Juz-list");
  try {
    const data = await getJuzIndex();
    renderJuzList(data);
    // loadSurah(1);
  } catch (error) {
    if (juzList)
      juzList.innerHTML =
        '<p class="text-slate-400 text-xs text-center py-8">سيتم توفير الأجزاء قريباً</p>';
  }
}

async function renderJuzList(juzs) {
  // const data = await getSurahsIndex();
  const listContainer = document.getElementById("Juz-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  await juzs.forEach((juz) => {
    // console.log(juz)
    const isActive = juz.id === currentJuzId;
    const activeClass = isActive
      ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-r-4 border-brand-500"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-r-4 border-transparent hover:border-slate-300 dark:hover:border-slate-700";

    const html = `
      <button data-juz-id="${juz.id}" class="w-full text-right cursor-pointer flex items-center justify-between px-4 py-3 rounded-l-lg transition-all ${activeClass}">
          <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold font-amiri ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500"}">
                  ${juz.id}
              </div>
              <div class="text-right">
                  <h4 class="text-sm font-bold font-amiri">${juz.title.ar}</h4>
                  </div>
          </div>
          <p class="text-xs font-semibold text-slate-400 font-cairo"> يبدأ من سورة ${checkDataInSurah(juz.pages[0].surahs[0].id, "name")}</span>
      </button>
    `;
    listContainer.insertAdjacentHTML("beforeend", html);
  });
}


/// Samah





/////////////////////////////
