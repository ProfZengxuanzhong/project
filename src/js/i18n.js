export const translations = {
    en: {
        appTitle: "Inventory App With JS & TailwindCSS",
        addNewCategory: "Add New Category",
        addNewProduct: "Add New Product",
        title: "Title",
        description: "Description",
        quantity: "Quantity",
        location: "Location",
        category: "Category",
        cancel: "Cancel",
        addCategoryBtn: "Add Category",
        addProductBtn: "Add Product",
        productsList: "Products List",
        search: "Search...",
        selectLocation: "- select location -",
        selectCategory: "- select category -",
        sortNewest: "Newest",
        sortOldest: "Oldest",
        sortAZ: "A-Z",
        sortZA: "Z-A",
        cookieText: "We use localStorage to save your inventory on this device. No data is sent to any server.",
        cookieAccept: "Accept",
        cookieReject: "Reject",
        privacyLink: "Privacy Policy",
        langToggle: "中文"
    },
    zh: {
        appTitle: "库存管理应用（JS + TailwindCSS）",
        addNewCategory: "添加新分类",
        addNewProduct: "添加新产品",
        title: "标题",
        description: "描述",
        quantity: "数量",
        location: "位置",
        category: "分类",
        cancel: "取消",
        addCategoryBtn: "添加分类",
        addProductBtn: "添加产品",
        productsList: "产品列表",
        search: "搜索...",
        selectLocation: "- 选择位置 -",
        selectCategory: "- 选择分类 -",
        sortNewest: "最新",
        sortOldest: "最旧",
        sortAZ: "A-Z",
        sortZA: "Z-A",
        cookieText: "我们使用浏览器 localStorage 在本设备保存您的库存数据，不会上传到任何服务器。",
        cookieAccept: "同意",
        cookieReject: "拒绝",
        privacyLink: "隐私政策",
        langToggle: "EN"
    }
};

const LANG_KEY = "lang";
const DEFAULT_LANG = "en";
const SUPPORTED = ["en", "zh"];

export function getLang() {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem(LANG_KEY) : null;
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
}

export function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return DEFAULT_LANG;
    if (typeof localStorage !== "undefined") localStorage.setItem(LANG_KEY, lang);
    return lang;
}

export function t(key, lang = getLang()) {
    const dict = translations[lang] || translations[DEFAULT_LANG];
    return dict[key] ?? key;
}

export function applyTranslations(lang = getLang()) {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key, lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", t(key, lang));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria");
        el.setAttribute("aria-label", t(key, lang));
    });
}

export function toggleLang() {
    const next = getLang() === "en" ? "zh" : "en";
    setLang(next);
    applyTranslations(next);
    return next;
}
