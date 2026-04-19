export function validateTitle(title, min = 2) {
    if (typeof title !== "string") return false;
    return title.trim().length >= min;
}

export function filterByTitle(products, term) {
    if (!Array.isArray(products)) return [];
    const normalized = String(term || "").toLowerCase().trim();
    if (!normalized) return products.slice();
    return products.filter((p) =>
        typeof p?.title === "string" &&
        p.title.toLowerCase().trim().includes(normalized)
    );
}

export function sortProducts(products, sortType) {
    if (!Array.isArray(products)) return [];
    const arr = products.slice();
    switch (sortType) {
        case "newest":
            return arr.sort((a, b) => b.id - a.id);
        case "oldest":
            return arr.sort((a, b) => a.id - b.id);
        case "A-Z":
            return arr.sort((a, b) =>
                a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            );
        case "Z-A":
            return arr.sort((a, b) =>
                a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            ).reverse();
        default:
            return arr;
    }
}

export function createProduct({ title, quantity, location, category }, idProvider = () => Date.now()) {
    return {
        id: idProvider(),
        title: String(title).trim(),
        quantity: Number(quantity) || 0,
        location: location || "none",
        category: category || "none"
    };
}

export function findCategoryByTitle(categories, title) {
    if (!Array.isArray(categories)) return undefined;
    return categories.find((c) => c?.title === title);
}
