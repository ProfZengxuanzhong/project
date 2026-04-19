import {
    validateTitle,
    filterByTitle,
    sortProducts,
    createProduct,
    findCategoryByTitle
} from "../src/js/utils.js";

describe("validateTitle", () => {
    test("returns true for strings with >= min chars after trim", () => {
        expect(validateTitle("ab")).toBe(true);
        expect(validateTitle("  hello  ")).toBe(true);
    });

    test("returns false for short or empty strings", () => {
        expect(validateTitle("a")).toBe(false);
        expect(validateTitle(" ")).toBe(false);
        expect(validateTitle("")).toBe(false);
    });

    test("returns false for non-string input", () => {
        expect(validateTitle(null)).toBe(false);
        expect(validateTitle(undefined)).toBe(false);
        expect(validateTitle(42)).toBe(false);
    });

    test("respects custom minimum length", () => {
        expect(validateTitle("abc", 5)).toBe(false);
        expect(validateTitle("abcdef", 5)).toBe(true);
    });
});

describe("filterByTitle", () => {
    const products = [
        { id: 1, title: "Apple" },
        { id: 2, title: "Banana" },
        { id: 3, title: "  apple pie " },
        { id: 4, title: "Cherry" }
    ];

    test("returns products matching search term (case-insensitive)", () => {
        const result = filterByTitle(products, "apple");
        expect(result).toHaveLength(2);
    });

    test("returns all products when term is empty", () => {
        expect(filterByTitle(products, "")).toHaveLength(4);
        expect(filterByTitle(products, "   ")).toHaveLength(4);
    });

    test("returns empty array for non-array input", () => {
        expect(filterByTitle(null, "x")).toEqual([]);
        expect(filterByTitle(undefined, "x")).toEqual([]);
    });

    test("skips items without a string title", () => {
        const dirty = [...products, { id: 5, title: null }, { id: 6 }];
        const result = filterByTitle(dirty, "apple");
        expect(result.every((p) => typeof p.title === "string")).toBe(true);
    });
});

describe("sortProducts", () => {
    const products = [
        { id: 3, title: "Banana" },
        { id: 1, title: "apple" },
        { id: 2, title: "Cherry" }
    ];

    test("sorts newest by descending id", () => {
        expect(sortProducts(products, "newest").map((p) => p.id)).toEqual([3, 2, 1]);
    });

    test("sorts oldest by ascending id", () => {
        expect(sortProducts(products, "oldest").map((p) => p.id)).toEqual([1, 2, 3]);
    });

    test("sorts A-Z case-insensitively", () => {
        expect(sortProducts(products, "A-Z").map((p) => p.title)).toEqual(["apple", "Banana", "Cherry"]);
    });

    test("sorts Z-A case-insensitively", () => {
        expect(sortProducts(products, "Z-A").map((p) => p.title)).toEqual(["Cherry", "Banana", "apple"]);
    });

    test("returns shallow copy for unknown sort type", () => {
        const out = sortProducts(products, "nope");
        expect(out).toEqual(products);
        expect(out).not.toBe(products);
    });

    test("returns empty array for non-array input", () => {
        expect(sortProducts(null, "newest")).toEqual([]);
    });
});

describe("createProduct", () => {
    test("creates product with trimmed title and defaults", () => {
        const p = createProduct({ title: "  Milk  " }, () => 42);
        expect(p).toEqual({
            id: 42,
            title: "Milk",
            quantity: 0,
            location: "none",
            category: "none"
        });
    });

    test("preserves numeric quantity", () => {
        const p = createProduct({ title: "a", quantity: 7 }, () => 1);
        expect(p.quantity).toBe(7);
    });

    test("coerces non-numeric quantity to 0", () => {
        expect(createProduct({ title: "a", quantity: "abc" }, () => 1).quantity).toBe(0);
    });

    test("uses provided location and category", () => {
        const p = createProduct({ title: "x", location: "BDG", category: "shoe" }, () => 1);
        expect(p.location).toBe("BDG");
        expect(p.category).toBe("shoe");
    });
});

describe("findCategoryByTitle", () => {
    const categories = [
        { title: "Food", description: "edible" },
        { title: "Tools", description: "hardware" }
    ];

    test("finds matching category", () => {
        expect(findCategoryByTitle(categories, "Food")).toEqual({ title: "Food", description: "edible" });
    });

    test("returns undefined when not found", () => {
        expect(findCategoryByTitle(categories, "Nope")).toBeUndefined();
    });

    test("handles invalid input", () => {
        expect(findCategoryByTitle(null, "x")).toBeUndefined();
    });
});
