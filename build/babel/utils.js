"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProduct = createProduct;
exports.filterByTitle = filterByTitle;
exports.findCategoryByTitle = findCategoryByTitle;
exports.sortProducts = sortProducts;
exports.validateTitle = validateTitle;
function validateTitle(title) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (typeof title !== "string") return false;
  return title.trim().length >= min;
}
function filterByTitle(products, term) {
  if (!Array.isArray(products)) return [];
  var normalized = String(term || "").toLowerCase().trim();
  if (!normalized) return products.slice();
  return products.filter(function (p) {
    return typeof (p === null || p === void 0 ? void 0 : p.title) === "string" && p.title.toLowerCase().trim().includes(normalized);
  });
}
function sortProducts(products, sortType) {
  if (!Array.isArray(products)) return [];
  var arr = products.slice();
  switch (sortType) {
    case "newest":
      return arr.sort(function (a, b) {
        return b.id - a.id;
      });
    case "oldest":
      return arr.sort(function (a, b) {
        return a.id - b.id;
      });
    case "A-Z":
      return arr.sort(function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });
    case "Z-A":
      return arr.sort(function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }).reverse();
    default:
      return arr;
  }
}
function createProduct(_ref) {
  var title = _ref.title,
    quantity = _ref.quantity,
    location = _ref.location,
    category = _ref.category;
  var idProvider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return Date.now();
  };
  return {
    id: idProvider(),
    title: String(title).trim(),
    quantity: Number(quantity) || 0,
    location: location || "none",
    category: category || "none"
  };
}
function findCategoryByTitle(categories, title) {
  if (!Array.isArray(categories)) return undefined;
  return categories.find(function (c) {
    return (c === null || c === void 0 ? void 0 : c.title) === title;
  });
}
