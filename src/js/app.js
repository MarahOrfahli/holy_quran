import { loadJuzList, loadSurahList, rtl } from "./utils.js";
import { bookmarkManager } from "./bookmarks.js";

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

// Arrays...
const READERS = [
  { ar: "فارس عباد", en: "Fares Abbad" },
  { ar: "محمد المنشاوي", en: "Mohammed Al-Minshawi" },
  { ar: "سعد الغامدي", en: "Saad Al-Ghamdi" },
  { ar: "عبد الباسط عبد الصمد", en: "Abdul Basit Abdul Samad" },
  { ar: "محمود الحصري", en: "Mahmoud Al-Hussary" },
  { ar: "ماهر المعيقلي", en: "Maher Al-Muaiqly" },
  { ar: "عبد الرحمن السديس", en: "Abdul Rahman Al-Sudais" },
  { ar: "مشاري راشد العفاسي", en: "Mashary Rashid Al-Afasy" },
  { ar: "احمد العجمي", en: "Ahmed Al-Ajmi" },
  { ar: "ياسر الدوسري", en: "Yasser Al-Dosari" }
];

function startApp() {
  // Loading App...
  checkBookmarks();
  loadSurahList();
  loadJuzList();
  setupEventListeners();
}

// Done Dont Change it...
/// Initializing Themes...
function toggleDarkMode() {
  const docClass = document.documentElement.classList;
  if (localStorage.theme === "dark") {
    if (docClass.contains("dark")) docClass.remove("dark");
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
  let sidebarClass = "";
  if (!sidebar || !sidebarOverlay) return;
  rtl ? (sidebarClass = "translate-to-right") : "translate-to-left";
  if (sidebar.classList.contains(sidebarClass)) {
    sidebar.classList.remove(sidebarClass);
    sidebar.classList.add("translate-x-0");
    sidebarOverlay.classList.remove("hidden");
  } else {
    sidebar.classList.remove("translate-x-0");
    sidebar.classList.add(sidebarClass);
    sidebarOverlay.classList.add("hidden");
  }
}

function checkBookmarks() {
  const bookmarksList = document.getElementById("bookmarks-list");
  console.log(bookmarkManager);
  if (bookmarkManager.bookmarks.length == 0)
    bookmarksList.innerHTML = `<p class="text-slate-400 text-xs text-center py-8">
                <span>لا توجد محفوظات حالياً</span><br/>
                <span>يمكنك إضافة علامة عند الضغط على الاية</span>
        </p>`;
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

  const tabs_nav = document.querySelectorAll(".tab-btn-nav");
  const panels_page = document.querySelectorAll(".tab-panel-page");

  tabs_nav.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs_nav.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      panels_page.forEach((p) => p.classList.add("hidden"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const target = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.remove("hidden");
    });
  });

  // Modal Elements...
  const modal = document.getElementById("settingsModal");
  const openBtn = document.getElementById("setting-btn");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const darkToggle = document.getElementById("darkModeToggle");
  const langSelect = document.getElementById("languageSelect");
  const sizeBtns = document.querySelectorAll(".font-size-btn");
  // const resetBtn = document.getElementById("resetBtn");

  // Translation Will be in json file soon
  const translations = {
    ar: {
      title: "الإعدادات",
      darkMode: "الوضع الداكن",
      darkDesc: "تبديل مظهر الموقع",
      language: "اللغة",
      langDesc: "اختر لغة العرض",
      fontSize: "حجم الخط",
      fontDesc: "صغير / متوسط / كبير",
      reset: "إعادة تعيين الإعدادات",
      saved: "تم حفظ الإعدادات تلقائياً"
    },
    en: {
      title: "Settings",
      darkMode: "Dark Mode",
      darkDesc: "Toggle site appearance",
      language: "Language",
      langDesc: "Choose display language",
      fontSize: "Font Size",
      fontDesc: "Small / Medium / Large",
      reset: "Reset Settings",
      saved: "Settings saved automatically"
    }
  };

  function openModal() {
    modal.classList.remove("hidden");
    // إضافة تأثير fade-in
    setTimeout(() => {
      modal.querySelector(".modal-content").classList.remove("scale-95");
      modal.querySelector(".modal-content").classList.add("scale-100");
    }, 10);
  }

  function closeModal() {
    modal.querySelector(".modal-content").classList.remove("scale-100");
    modal.querySelector(".modal-content").classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 250);
  }

  // openBtn.addEventListener("click", openModal);
  // closeBtn.addEventListener("click", closeModal);
  // إغلاق عند الضغط خارج المودال
  // modal.addEventListener("click", function (e) {
  //   if (e.target === modal) {
  //     closeModal();
  //   }
  // });

  // تبديل الوضع الداكن
  // darkToggle.addEventListener("change", function () {
  //   applyDarkMode(this.checked);
  // });

  // تغيير اللغة
  // langSelect.addEventListener("change", function () {
  //   applyLanguage(this.value);
  // });

  // تغيير حجم الخط
  // sizeBtns.forEach((btn) => {
  //   btn.addEventListener("click", function () {
  //     const size = this.dataset.size;
  //     applyFontSize(size);
  //   });
  // });
}

// Starting App

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}

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
  document.documentElement.lang == "ar"
    ? ((document.documentElement.lang = "en"),
      (document.documentElement.dir = "ltr"))
    : ((document.documentElement.lang = "ar"),
      (document.documentElement.dir = "rtl"));



  // ("lang" in localStorage) ? localStorage.lang =

  // if ("lang" in localStorage) {
  //   if (localStorage.lang == "ar") {
  //     localStorage.lang = "en";
  //     document.documentElement.lang = "en";
  //     document.documentElement.dir = "ltr";
  //     // if(sidebar.classList.contains("translate-to-left")){
  //     //   sidebar.classList.remove("translate-x-0");
  //     // sidebar.classList.add("translate-to-left");
  //     // sidebarOverlay.classList.add("hidden");
  //     // }
  //   } else {
  //     localStorage.lang = "ar";
  //     document.documentElement.lang = "ar";
  //     document.documentElement.dir = "rtl";
  //   }
  // } 

  // if (sidebar.classList.contains("translate-to-right")) {
  //       sidebar.classList.remove("translate-to-right");
  //       sidebar.classList.add("translate-x-0");
  //   sidebar.classList.add("lg:translate-x-0");

  //       sidebarOverlay.classList.remove("hidden");
  //     }

  // else localStorage.lang = html.lang;
  // toggleSidebar()
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
