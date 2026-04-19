import Storage from "../src/js/storage.js";

describe("Storage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("getProducts returns empty array when nothing stored", () => {
        expect(Storage.getProducts).toEqual([]);
    });

    test("getCategories returns empty array when nothing stored", () => {
        expect(Storage.getCategories()).toEqual([]);
    });

    test("saveProducts persists to localStorage", () => {
        const products = [{ id: 1, title: "A" }];
        Storage.saveProducts(products);
        expect(JSON.parse(localStorage.getItem("products"))).toEqual(products);
        expect(Storage.getProducts).toEqual(products);
    });

    test("saveCategories persists to localStorage", () => {
        const cats = [{ title: "Food" }];
        Storage.saveCategories(cats);
        expect(Storage.getCategories()).toEqual(cats);
    });

    test("removeProduct filters out the matching id", () => {
        Storage.saveProducts([
            { id: 1, title: "A" },
            { id: 2, title: "B" },
            { id: 3, title: "C" }
        ]);
        Storage.removeProduct(2);
        expect(Storage.getProducts.map((p) => p.id)).toEqual([1, 3]);
    });

    test("removeProduct is a no-op when id does not exist", () => {
        Storage.saveProducts([{ id: 1, title: "A" }]);
        Storage.removeProduct(999);
        expect(Storage.getProducts).toHaveLength(1);
    });
});
