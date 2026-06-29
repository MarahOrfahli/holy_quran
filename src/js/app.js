import { showAllVerses, displaySurahInUI } from "./utils.js";

console.log(await showAllVerses());
displaySurahInUI(1);
// displaySurahInUI(18);
////////////////////////////
// Elements...
let audioElement = document.getElementById("quran-audio"),
  ayahsWrapper = document.getElementById("ayahs-wrapper"),
  bismillahEl = document.getElementById("bismillah"),
  reciterSelect = document.getElementById("reciter-select"),
  btnTranslate = document.getElementById("btn-translate"),
  btnLayout = document.getElementById("btn-layout"),
  themeToggleBtn = document.getElementById("theme-toggle-btn"),
  menuToggleBtn = document.getElementById("menu-toggle-btn"),
  closeSidebarBtn = document.getElementById("close-sidebar-btn"),
  sidebarOverlay = document.getElementById("sidebar-overlay"),
  sidebar = document.getElementById("sidebar"),
  mainPlayBtn = document.getElementById("main-play-btn"),
  prevAyahBtn = document.getElementById("prev-ayah-btn"),
  nextAyahBtn = document.getElementById("next-ayah-btn"),
  volumeSlider = document.getElementById("volume-slider");

function startApp() {
  // Loading Surahs
  setupEventListeners();
}

// Done Dont Change it...
/// Initializing Themes...
function toggleDarkMode() {
  const docClass = document.documentElement.classList;
  if (localStorage.theme === "dark") {
    if(docClass.contains("dark")) docClass.remove("dark");
    localStorage.theme = "light";
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon text-md"></i>`;
    //
  } else {
    docClass.add("dark");
    localStorage.theme = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun text-md"></i>`;
  }
}

// Done Dont Change it...
function toggleSidebar() {
  if (!sidebar || !sidebarOverlay) return;

  if (sidebar.classList.contains("translate-to-left")) {
    sidebar.classList.remove("translate-to-left");
    sidebar.classList.add("translate-x-0");
    sidebarOverlay.classList.remove("hidden");
  } else {
    sidebar.classList.remove("translate-x-0");
    sidebar.classList.add("translate-to-left");
    sidebarOverlay.classList.add("hidden");
  }
}

/////////////////////////////////////////

function setupEventListeners() {
  if (audioElement) {
    audioElement.addEventListener("ended", handleAudioEnded);
    audioElement.addEventListener("play", () => updateAudioUI(true));
    audioElement.addEventListener("pause", () => updateAudioUI(false));
    audioElement.addEventListener("error", () => {
      showToast("Error While Loading Voices..");
      updateAudioUI(false);
    });
  }

  // أحداث الأزرار والقوائم
  if (reciterSelect) reciterSelect.addEventListener("change", changeReciter);
  if (btnTranslate) btnTranslate.addEventListener("click", toggleTranslation);
  if (btnLayout) btnLayout.addEventListener("click", toggleLayout);
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleDarkMode);

  if (menuToggleBtn) menuToggleBtn.addEventListener("click", toggleSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", toggleSidebar);

  if (mainPlayBtn) mainPlayBtn.addEventListener("click", toggleAudio);
  if (prevAyahBtn) prevAyahBtn.addEventListener("click", playPrevAyah);
  if (nextAyahBtn) nextAyahBtn.addEventListener("click", playNextAyah);
  if (volumeSlider)
    volumeSlider.addEventListener("input", (e) => changeVolume(e.target.value));

  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => {
        b.classList.remove(
          "active",
          "bg-gray-200",
          "dark:bg-gray-600",
          "font-medium",
          "text-gray-900",
          "dark:text-white"
        );
        b.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => p.classList.add("hidden"));

      btn.classList.add(
        "active",
        "bg-gray-200",
        "dark:bg-gray-600",
        "font-medium",
        "text-gray-900",
        "dark:text-white"
      );
      btn.setAttribute("aria-selected", "true");

      const target = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.remove("hidden");
    });
  });
}

// Starting App

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}

// async function fetchSurahList() {
//   const surahListContainer = document.getElementById("surah-list");
//   try {
//     const data = await showAllVerses();

//     if (data.code === 200) {
//       allSurahs = data.data;
//       renderSurahList(allSurahs);
//       loadSurah(1);

//       // تعبئة البيانات الفارغة مؤقتاً لقائمة الأجزاء والمحفوظات لتجنب اللودر اللانهائي
//       const juzList = document.getElementById("Juz-list");
//       if (juzList)
//         juzList.innerHTML =
//           '<p class="text-slate-400 text-xs text-center py-8">سيتم توفير الأجزاء قريباً</p>';
//       const bookmarksList = document.getElementById("bookmarks-list");
//       if (bookmarksList)
//         bookmarksList.innerHTML =
//           '<p class="text-slate-400 text-xs text-center py-8">لا توجد محفوظات حالياً</p>';
//     }
//   } catch (error) {
//     if (surahListContainer) {
//       surahListContainer.innerHTML =
//         '<p class="text-rose-500 text-sm text-center">فشل في الاتصال بالخادم. يرجى التحقق من الإنترنت.</p>';
//     }
//   }
// }

// function renderSurahList(surahs) {
//   const listContainer = document.getElementById("surah-list");
//   if (!listContainer) return;
//   listContainer.innerHTML = "";

//   surahs.forEach((surah) => {
//     const isActive = surah.number === currentSurahId;
//     const activeClass = isActive
//       ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-r-4 border-brand-500"
//       : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-r-4 border-transparent hover:border-slate-300 dark:hover:border-slate-700";

//     const html = `
//       <button data-surah-id="${surah.number}" class="w-full text-right flex items-center justify-between px-4 py-3 rounded-l-lg transition-all ${activeClass}">
//           <div class="flex items-center gap-3">
//               <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold font-amiri ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500"}">
//                   ${surah.number}
//               </div>
//               <div class="text-right">
//                   <h4 class="text-sm font-bold font-amiri">${surah.name}</h4>
//                   <p class="text-[10px] text-slate-400 font-cairo">${surah.revelationType === "Meccan" ? "مكية" : "مدنية"} • ${surah.numberOfAyahs} آية</p>
//               </div>
//           </div>
//           <span class="text-xs font-semibold text-slate-400 font-cairo">${surah.englishName}</span>
//       </button>
//     `;
//     listContainer.insertAdjacentHTML("beforeend", html);
//   });

//   // تعيين حدث النقر المباشر لكل زر سورة لضمان عدم حدوث تضارب
//   listContainer.querySelectorAll("button[data-surah-id]").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const id = parseInt(btn.getAttribute("data-surah-id"));
//       loadSurah(id);
//     });
//   });
// }

// // 3. تحميل سورة وعرضها
// async function loadSurah(surahNumber) {
//   currentSurahId = surahNumber;
//   currentAyahIndex = 0;
//   stopAudio();

//   // تحديث تحديد السورة في الفهرس
//   renderSurahList(allSurahs);

//   // إغلاق شريط الموبايل تلقائياً عند اختيار سورة
//   if (window.innerWidth < 1024) {
//     if (sidebar && !sidebar.classList.contains("translate-x-full")) {
//       toggleSidebar();
//     }
//   }

//   // تحديث العنوان الرئيسي
//   const surahInfo = allSurahs.find((s) => s.number === surahNumber);
//   const titleEl = document.getElementById("current-surah-title");
//   if (titleEl) titleEl.innerText = surahInfo ? surahInfo.name : "تحميل...";

//   // تفعيل حالة التحميل المؤقتة
//   const quranContainer = document.getElementById("quran-container");
//   const loadingSpinner = document.getElementById("loading-spinner");

//   if (quranContainer) quranContainer.classList.add("hidden");
//   if (loadingSpinner) {
//     loadingSpinner.classList.remove("hidden");
//     loadingSpinner.classList.add("flex");
//   }

//   try {
//     // جلب النص العربي مع الترجمة من الواجهة السحابية الموثوقة
//     const response = await fetch(
//       `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad`
//     );
//     const data = await response.json();

//     if (data.code === 200) {
//       currentSurahData = data.data[0].ayahs;
//       currentTranslationData = data.data[1].ayahs;

//       // إظهار البسملة في موضعها الصحيح (إخفاؤها في التوبة والفاتحة)
//       if (bismillahEl) {
//         if (surahNumber !== 1 && surahNumber !== 9) {
//           bismillahEl.classList.remove("hidden");
//         } else {
//           bismillahEl.classList.add("hidden");
//         }
//       }

//       renderAyahs();
//     }
//   } catch (error) {
//     showToast("حدث خطأ أثناء تحميل السورة.");
//   } finally {
//     if (loadingSpinner) {
//       loadingSpinner.classList.add("hidden");
//       loadingSpinner.classList.remove("flex");
//     }
//     if (quranContainer) quranContainer.classList.remove("hidden");
//   }
// }

// // 4. بناء هيكل الآيات وتنسيقها
// function renderAyahs() {
//   if (!ayahsWrapper) return;
//   ayahsWrapper.innerHTML = "";

//   if (isDoublePageLayout && !showTranslationMode) {
//     ayahsWrapper.className =
//       "quran-text text-2xl md:text-3xl lg:text-4xl text-justify text-slate-900 dark:text-slate-100 columns-1 lg:columns-2 gap-12 block";
//   } else if (showTranslationMode) {
//     ayahsWrapper.className = "flex flex-col gap-6 w-full";
//   } else {
//     ayahsWrapper.className =
//       "quran-text text-2xl md:text-3xl lg:text-4xl text-justify text-slate-900 dark:text-slate-100 flex flex-wrap content-start gap-x-2 gap-y-4 inline-block";
//   }

//   currentSurahData.forEach((ayah, index) => {
//     let text = ayah.text;
//     if (
//       currentSurahId !== 1 &&
//       index === 0 &&
//       text.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ")
//     ) {
//       text = text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ", "");
//     }

//     const translationText = currentTranslationData[index].text;
//     const ayahContainer = document.createElement(
//       showTranslationMode ? "div" : "span"
//     );
//     ayahContainer.id = `ayah-${index}`;
//     ayahContainer.className = `transition-all duration-300 cursor-pointer ${
//       showTranslationMode
//         ? "p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl"
//         : "hover:text-brand-600 dark:hover:text-brand-400"
//     }`;

//     ayahContainer.addEventListener("click", () => playSpecificAyah(index));

//     const endMark = `<span class="inline-flex items-center justify-center bg-[url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 32 32\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path fill=\\'%2310b981\\' d=\\'M16 2L3 9v14l13 7 13-7V9L16 2zm0 2.2l11 5.9v11.8L16 27.8l-11-5.9V10.1L16 4.2z\\'/></svg>')] bg-center bg-contain bg-no-repeat w-9 h-9 md:w-11 md:h-11 text-[12px] md:text-[14px] font-cairo font-bold mx-1.5 align-middle text-slate-700 dark:text-slate-300">${ayah.numberInSurah}</span>`;

//     if (showTranslationMode) {
//       ayahContainer.innerHTML = `
//         <div class="quran-text text-2xl md:text-3xl text-right mb-4 leading-loose font-amiri text-slate-900 dark:text-white" dir="rtl">
//             ${text} ${endMark}
//         </div>
//         <div class="text-left text-sm md:text-base text-slate-500 dark:text-slate-400 font-cairo leading-relaxed" dir="ltr">
//             ${translationText}
//         </div>
//       `;
//     } else {
//       ayahContainer.innerHTML = `${text} ${endMark}`;
//     }

//     ayahsWrapper.appendChild(ayahContainer);
//   });

//   if (isPlaying) {
//     highlightAyah(currentAyahIndex);
//   }
// }

// 5. التحكم بالصوت والتشغيل التلقائي والتالي
function toggleAudio() {
  if (currentSurahData.length === 0) return;

  if (isPlaying) {
    if (audioElement) audioElement.pause();
  } else {
    if (audioElement) {
      if (!audioElement.src || audioElement.ended) {
        playSpecificAyah(currentAyahIndex);
      } else {
        audioElement.play();
      }
    }
  }
}

// function playSpecificAyah(index) {
//   if (index < 0 || index >= currentSurahData.length) return;

//   currentAyahIndex = index;
//   const reciter = reciterSelect ? reciterSelect.value : "ar.alafasy";
//   const ayah = currentSurahData[index];

//   if (audioElement) {
//     audioElement.src = `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;
//     audioElement.play();
//   }

//   highlightAyah(index);
//   updateAudioInfo(ayah.numberInSurah);
// }

function playNextAyah() {
  if (currentAyahIndex < currentSurahData.length - 1) {
    playSpecificAyah(currentAyahIndex + 1);
  } else {
    stopAudio();
    showToast("Done");
  }
}

function playPrevAyah() {
  if (currentAyahIndex > 0) {
    playSpecificAyah(currentAyahIndex - 1);
  }
}

function handleAudioEnded() {
  playNextAyah();
}

function stopAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  isPlaying = false;
  updateAudioUI(false);
  removeHighlight();
}

function changeReciter() {
  if (isPlaying) {
    playSpecificAyah(currentAyahIndex);
  }
}

function changeVolume(val) {
  if (audioElement) {
    audioElement.volume = val;
  }
}

// 6. تظليل وتأثير التلاوة على الواجهة
function updateAudioUI(playing) {
  isPlaying = playing;
  const mainIcon = document.getElementById("main-play-icon");
  const statusIcon = document.getElementById("audio-status-icon");

  if (playing) {
    if (mainIcon) mainIcon.className = "fa-solid fa-pause text-lg";
    if (statusIcon)
      statusIcon.className =
        "fa-solid fa-waveform fa-beat text-brand-600 dark:text-brand-400";
  } else {
    if (mainIcon) mainIcon.className = "fa-solid fa-play text-lg pl-1";
    if (statusIcon)
      statusIcon.className =
        "fa-solid fa-play text-brand-600 dark:text-brand-400";
  }
}

function updateAudioInfo(ayahNumInSurah) {
  const surahInfo = allSurahs.find((s) => s.number === currentSurahId);
  const nowPlayingSurah = document.getElementById("now-playing-surah");
  const nowPlayingAyah = document.getElementById("now-playing-ayah");

  if (nowPlayingSurah && surahInfo)
    nowPlayingSurah.innerText = `سورة ${surahInfo.name}`;
  if (nowPlayingAyah) nowPlayingAyah.innerText = `الآية: ${ayahNumInSurah}`;
}

function highlightAyah(index) {
  removeHighlight();
  const el = document.getElementById(`ayah-${index}`);
  if (el) {
    if (showTranslationMode) {
      el.classList.add("ayah-active", "border-transparent");
    } else {
      el.classList.add("text-brand-600", "dark:text-brand-400");
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function removeHighlight() {
  const allAyahs = document.querySelectorAll('[id^="ayah-"]');
  allAyahs.forEach((el) => {
    el.classList.remove(
      "ayah-active",
      "border-transparent",
      "text-brand-600",
      "dark:text-brand-400"
    );
  });
}

// 7. تحسينات تجربة المستخدم والقائمة الجانبية والتنبيهات
function toggleTranslation() {
  showTranslationMode = !showTranslationMode;

  if (showTranslationMode) {
    if (btnTranslate) {
      btnTranslate.classList.add(
        "bg-brand-100",
        "text-brand-700",
        "dark:bg-brand-900/40",
        "dark:text-brand-400"
      );
      btnTranslate.classList.remove("bg-slate-50", "text-slate-600");
    }

    isDoublePageLayout = false;
    if (btnLayout) {
      btnLayout.classList.remove(
        "bg-brand-100",
        "text-brand-700",
        "dark:bg-brand-900/40",
        "dark:text-brand-400"
      );
    }
  } else {
    if (btnTranslate) {
      btnTranslate.classList.remove(
        "bg-brand-100",
        "text-brand-700",
        "dark:bg-brand-900/40",
        "dark:text-brand-400"
      );
      btnTranslate.classList.add("bg-slate-50", "text-slate-600");
    }
  }

  if (currentSurahData.length > 0) renderAyahs();
}

function toggleLayout() {
  if (showTranslationMode) {
    showToast("عذراً، يرجى إيقاف الترجمة أولاً لتفعيل وضع الصفحة المزدوجة.");
    return;
  }

  isDoublePageLayout = !isDoublePageLayout;

  if (isDoublePageLayout) {
    if (btnLayout) {
      btnLayout.classList.add(
        "bg-brand-100",
        "text-brand-700",
        "dark:bg-brand-900/40",
        "dark:text-brand-400"
      );
    }
  } else {
    if (btnLayout) {
      btnLayout.classList.remove(
        "bg-brand-100",
        "text-brand-700",
        "dark:bg-brand-900/40",
        "dark:text-brand-400"
      );
    }
  }

  if (currentSurahData.length > 0) renderAyahs();
}



function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.innerText = message;
  toast.classList.remove("-translate-y-24", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("-translate-y-24", "opacity-0");
  }, 3000);
}



import "../../node_modules/@fortawesome/fontawesome-free/js/all.min.js";
