"use strict";

var _productView = _interopRequireDefault(require("./productView.js"));
var _categoryView = _interopRequireDefault(require("./categoryView.js"));
var _cookieBanner = _interopRequireDefault(require("./cookieBanner.js"));
var _i18n = require("./i18n.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
document.addEventListener("DOMContentLoaded", function () {
  var productView = new _productView["default"]();
  var categoryView = new _categoryView["default"]();
  categoryView.setupApp();
  productView.setupApp();
  (0, _i18n.applyTranslations)((0, _i18n.getLang)());
  var langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      return (0, _i18n.toggleLang)();
    });
  }
  new _cookieBanner["default"]().init();
});
