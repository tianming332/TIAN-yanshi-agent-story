(function () {
  "use strict";
  var MAIN_LIVE = "https://tianming332.github.io/JiangmingTian_Portfolio_Final/";
  var parts = decodeURIComponent(location.pathname).split("/").filter(Boolean);
  var lastPart = parts[parts.length - 1] || "";
  var projectFolder = /\.html?$/i.test(lastPart) ? (parts[parts.length - 2] || "") : lastPart;
  var projectId = projectFolder.replace(/^TIAN-/i, "").toLowerCase();
  var dataBase = MAIN_LIVE + "data/";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function language() { return window.tjmLanguage ? window.tjmLanguage.current() : "zh-hans"; }
  function localized(record) {
    var current = language();
    return current === "en" ? record.en : (current === "ja" ? record.hant : record.hans);
  }
  function setI18n(element, record) {
    element.setAttribute("data-i18n", "");
    element.setAttribute("data-i18n-hans", record.hans);
    element.setAttribute("data-i18n-ja", record.hant);
    element.setAttribute("data-i18n-en", record.en);
    element.textContent = localized(record);
  }
  function metaLabel(group, key) {
    var translated = window.PORTFOLIO_TRANSLATIONS && window.PORTFOLIO_TRANSLATIONS[group] && window.PORTFOLIO_TRANSLATIONS[group][key];
    var fallback = window.PORTFOLIO_META && window.PORTFOLIO_META[group] && window.PORTFOLIO_META[group][key] || key;
    return {
      hans: translated && translated["zh-hans"] || fallback,
      hant: translated && translated["ja"] || fallback,
      en: translated && translated.en || String(key).toUpperCase()
    };
  }

  function renderTaxonomy() {
    if (document.getElementById("projectTaxonomy")) return;
    var item = (window.WORKS || []).find(function (work) { return work.id === projectId; });
    if (!item) return;
    var translation = window.WORK_TRANSLATIONS && window.WORK_TRANSLATIONS[projectId];
    var tagsHans = item.tags || [];
    var tagsHant = translation && translation["ja"] && translation["ja"].tags || tagsHans;
    var tagsEn = translation && translation.en && translation.en.tags || tagsHans;
    var labels = [];
    (item.directions || []).forEach(function (key) { labels.push(metaLabel("directions", key)); });
    (item.types || []).forEach(function (key) { labels.push(metaLabel("types", key)); });
    tagsHans.forEach(function (tag, index) { labels.push({ hans: tag, hant: tagsHant[index] || tag, en: tagsEn[index] || tag }); });

    var section = document.createElement("section");
    section.className = "detail-taxonomy";
    section.id = "projectTaxonomy";
    var heading = document.createElement("div");
    heading.className = "detail-taxonomy-head";
    var eyebrow = document.createElement("p");
    eyebrow.className = "project-section-no";
    eyebrow.textContent = "PROJECT TAXONOMY";
    var title = document.createElement("h3");
    setI18n(title, { hans: "项目标签", hant: "項目標籤", en: "Project Tags" });
    heading.appendChild(eyebrow);
    heading.appendChild(title);
    var list = document.createElement("div");
    list.className = "detail-taxonomy-list";
    labels.forEach(function (record) {
      var chip = document.createElement("span");
      setI18n(chip, record);
      list.appendChild(chip);
    });
    section.appendChild(heading);
    section.appendChild(list);
    var anchor = document.querySelector(".project-overview") || document.querySelector(".project-detail-hero");
    if (anchor) anchor.insertAdjacentElement("afterend", section);
  }

  function updateProjectLinks() {
    document.querySelectorAll("[data-detail-id]").forEach(function (link) {
      var id = link.dataset.detailId;
      var record = window.WORK_DETAIL_LINKS && window.WORK_DETAIL_LINKS[id];
      link.href = record && record.live || (MAIN_LIVE + "?from=project#all-works");
    });
  }

  Promise.resolve()
    .then(function () { return loadScript(dataBase + "work-translations.js"); })
    .then(function () { return loadScript(dataBase + "works.js"); })
    .then(function () { return loadScript(dataBase + "work-detail-links.js"); })
    .then(function () { renderTaxonomy(); updateProjectLinks(); })
    .catch(function () {
      document.querySelectorAll("[data-detail-id]").forEach(function (link) { link.href = MAIN_LIVE + "?from=project#all-works"; });
    });
}());
