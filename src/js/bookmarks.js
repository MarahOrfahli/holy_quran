// 1. قائمة الألوان الثابتة (نضعها خارج الكلاس أو كخاصية ثابتة)
const AVAILABLE_COLORS = [
  { name: "أحمر", code: "#FF6B6B" },
  { name: "أزرق", code: "#4D96FF" },
  { name: "أخضر", code: "#6BCB77" },
  { name: "أصفر", code: "#FFD93D" },
  { name: "بنفسجي", code: "#9B59B6" }
];

class BookmarksManager {
  static AVAILABLE_COLORS = AVAILABLE_COLORS;
  #storageKey = "quranBookmarks"

  constructor() {
    this.bookmarks = this._loadFromStorage();
  }

  _loadFromStorage() {
    let data;
    if (this.#storageKey in localStorage) {
      data = localStorage.getItem(this.#storageKey);
      return JSON.parse(data);
    } else return [];
  }

  _saveToStorage() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.bookmarks));
  }

  _generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  // Add, Edit, Delete...
  add(surahName, ayahNumber, type, value) {
    if (type !== "note" && type !== "color") {
      throw new Error("النوع يجب أن يكون 'note' أو 'color'");
    }

    if (type === "color") {
      const isValid = BookmarksManager.AVAILABLE_COLORS.some(
        (c) => c.code === value
      );
      if (!isValid) throw new Error("اللون غير متاح ضمن القائمة");
    }

    if (type === "note" && typeof value !== "string") {
      throw new Error("الملاحظة يجب أن تكون نصاً");
    }

    const newBookmark = {
      id: this._generateId(),
      surahName,
      ayahNumber,
      type,
      createdAt: new Date().toISOString()
    };

    if (type === "note") {
      newBookmark.content = value;
    } else {
      newBookmark.color = value;
    }

    this.bookmarks.push(newBookmark);
    this._saveToStorage();
    return newBookmark;
  }

  // استرجاع جميع الإشارات
  getAll() {
    return this.bookmarks; // يعيد المصفوفة مباشرة
  }

  // الحصول على إشارة معينة بواسطة id
  getById(id) {
    return this.bookmarks.find((b) => b.id === id);
  }

  // حذف إشارة
  delete(id) {
    const initialLength = this.bookmarks.length;
    this.bookmarks = this.bookmarks.filter((b) => b.id !== id);

    if (this.bookmarks.length === initialLength) {
      return false; // لم يتم العثور عليها
    }

    this._saveToStorage();
    return true;
  }

  // تحديث إشارة (تغيير الملاحظة أو اللون)
  update(id, newValue) {
    const bookmark = this.getById(id);
    if (!bookmark) {
      throw new Error("الإشارة غير موجودة");
    }

    if (bookmark.type === "note") {
      bookmark.content = newValue;
    } else if (bookmark.type === "color") {
      const isValid = BookmarksManager.AVAILABLE_COLORS.some(
        (c) => c.code === newValue
      );
      if (!isValid) throw new Error("اللون غير متاح");
      bookmark.color = newValue;
    }

    this._saveToStorage();
    return true;
  }

  // تصفية حسب نوع معين (ميزة إضافية)
  filterByType(type) {
    return this.bookmarks.filter((b) => b.type === type);
  }

  // مسح جميع الإشارات
  clearAll() {
    this.bookmarks = [];
    this._saveToStorage();
  }
}

export const bookmarkManager = new BookmarksManager();
