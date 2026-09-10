(function () {
  "use strict";

  var pathParts = decodeURIComponent(location.pathname).split("/").filter(Boolean);
  var lastPart = pathParts[pathParts.length - 1] || "";
  var projectFolder = /\.html?$/i.test(lastPart) ? (pathParts[pathParts.length - 2] || "") : lastPart;
  var projectKey = projectFolder.replace(/^TIAN-/i, "").toLowerCase();
  if (projectKey === "yanshi-agent-story") return;
  var configs = {
    "detection-brand": { pending: true },
    "hangzhou-linxin": {
      assets: ["分别说明图 (1).png", "分别说明图 (2).png", "分别说明图 (3).png", "分别说明图 (4).png", "分别说明图 (5).png", "分别说明图 (6).png", "分别说明图 (7).png", "分别说明图 (8).png", "分别说明图 (9).png"]
    },
    "hemei-tianyi": {
      assets: ["01_品牌主标志.png", "02_品牌主视觉.png", "03_品牌标志释义.png", "04_标准色彩.png", "05_标准字体.png", "06_辅助图形.png", "07_应用系统.png", "08_品牌海报.png", "09_环境与导视系统.png"]
    },
    "lanyuan-cable": {
      assets: ["01_品牌主标志.png", "02_品牌主视觉.png", "03_品牌释义.png", "04_标准色彩.png", "05_品牌字体.png", "06_辅助图形.png", "07_应用系统.png", "08_海报系统.png", "09_环境与导视系统.png"]
    },
    "nanshan-wellness": {
      assets: ["分图说明 (1).png", "分图说明 (2).png", "分图说明 (3).png", "分图说明 (4).png", "分图说明 (5).png", "分图说明 (6).png", "分图说明 (7).png", "分图说明 (8).png", "分图说明 (9).png"]
    },
    "yanbowen-noodles": {
      assets: ["01_品牌主视觉.png", "02_LOGO释义.png", "03_标准字体.png", "04_品牌色彩.png", "05_标志组合.png", "06_辅助图形.png", "07_品牌应用展示.png", "08_品牌理念场景.png", "09_品牌收尾视觉.png"]
    },
    "applied-project-07": { pending: true },
    "applied-project-08": { pending: true }
  };

  var article = document.querySelector(".project-article");
  var overview = document.querySelector(".project-overview");
  var gallerySection = document.querySelector(".project-gallery-section");
  var originalGallery = gallerySection && gallerySection.querySelector(".project-gallery");
  if (!article || !overview || !gallerySection || !originalGallery) return;

  var config = configs[projectKey] || {};
  var existingFigures = Array.prototype.slice.call(originalGallery.querySelectorAll("figure"));
  var assets = config.assets || [];
  overview.id = "overview";

  function i18n(el, hans, hant, en) {
    el.setAttribute("data-i18n", "");
    el.setAttribute("data-i18n-hans", hans);
    el.setAttribute("data-i18n-hant", hant);
    el.setAttribute("data-i18n-en", en);
    el.textContent = hans;
    return el;
  }

  function assetLabel(filename, index) {
    var clean = filename.replace(/\.[^.]+$/, "").replace(/^\d+[_-]?/, "").replace(/[（(]\d+[）)]$/, "").replace(/[_-]+/g, " ").trim();
    if (/^(分别说明图|分图说明)$/.test(clean)) return "设计分图 " + String(index + 1).padStart(2, "0");
    return clean || ("设计分图 " + String(index + 1).padStart(2, "0"));
  }

  function makeAssetFigure(asset, index) {
    var figure = document.createElement("figure");
    figure.className = "gallery-item compact-detail-figure";
    var button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-lightbox", "assets/" + asset);
    var image = document.createElement("img");
    image.src = "assets/" + asset;
    image.alt = assetLabel(asset, index);
    image.loading = "lazy";
    var caption = document.createElement("figcaption");
    var number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    var label = document.createElement("span");
    label.textContent = assetLabel(asset, index);
    button.appendChild(image);
    caption.appendChild(number);
    caption.appendChild(label);
    figure.appendChild(button);
    figure.appendChild(caption);
    return figure;
  }

  var groups = [];
  if (assets.length) {
    groups.push({
      key: "overview-board",
      title: ["完整视觉总览", "完整視覺總覽", "Complete Visual Overview"],
      subtitle: ["先以总图建立整体认识，再进入九张分图逐项阅读。", "先以總圖建立整體認識，再進入九張分圖逐項閱讀。", "Begin with the complete board, then read the nine detailed views one by one."],
      items: existingFigures
    });
    var groupNames = [
      [["品牌基础", "品牌基礎", "Brand Foundations"], ["标志、主视觉与设计释义", "標誌、主視覺與設計釋義", "Logo, key visual and design rationale"]],
      [["视觉规范", "視覺規範", "Visual Standards"], ["色彩、字体与辅助图形", "色彩、字體與輔助圖形", "Color, typography and supporting graphics"]],
      [["应用与延展", "應用與延展", "Applications & Extensions"], ["应用系统、传播物料与空间表达", "應用系統、傳播物料與空間表達", "Applications, communication materials and spatial expression"]]
    ];
    for (var g = 0; g < 3; g += 1) {
      var groupAssets = assets.slice(g * 3, g * 3 + 3);
      groups.push({
        key: "detail-group-" + (g + 1),
        title: groupNames[g][0],
        subtitle: groupNames[g][1],
        items: groupAssets.map(function (asset, localIndex) { return makeAssetFigure(asset, g * 3 + localIndex); })
      });
    }
  } else {
    var chunkCount = existingFigures.length > 6 ? 3 : existingFigures.length > 2 ? 2 : 1;
    var chunkSize = Math.max(1, Math.ceil(existingFigures.length / chunkCount));
    var genericNames = [
      [["项目总览", "項目總覽", "Project Overview"], ["建立作品的整体视觉与核心概念。", "建立作品的整體視覺與核心概念。", "The complete visual direction and core concept."]],
      [["设计展开", "設計展開", "Design Development"], ["呈现关键设计过程与视觉系统。", "呈現關鍵設計過程與視覺系統。", "Key design development and the visual system."]],
      [["成果呈现", "成果呈現", "Final Presentation"], ["展示最终成果、应用或空间关系。", "展示最終成果、應用或空間關係。", "Final outcomes, applications and spatial relationships."]]
    ];
    for (var c = 0; c < chunkCount; c += 1) {
      groups.push({
        key: "content-group-" + (c + 1),
        title: genericNames[c][0],
        subtitle: genericNames[c][1],
        items: existingFigures.slice(c * chunkSize, c * chunkSize + chunkSize)
      });
    }
    if (config.pending) {
      groups.push({
        key: "materials-pending",
        title: ["资料补充位置", "資料補充位置", "Materials Pending"],
        subtitle: ["章节结构已经建立，后续资料可直接按此位置继续补充。", "章節結構已經建立，後續資料可直接按此位置繼續補充。", "The chapter structure is ready for future materials."],
        items: [], pending: true
      });
    }
  }

  var primaryNav = document.createElement("nav");
  primaryNav.className = "compact-project-nav";
  primaryNav.setAttribute("aria-label", "作品章节导航");
  var overviewLink = document.createElement("a");
  overviewLink.href = "#overview";
  i18n(overviewLink, "01 概览", "01 概覽", "01 Overview");
  primaryNav.appendChild(overviewLink);
  var indexLink = document.createElement("a");
  indexLink.href = "#content-index";
  i18n(indexLink, "02 导航", "02 導航", "02 Index");
  primaryNav.appendChild(indexLink);
  groups.forEach(function (group, index) {
    var link = document.createElement("a");
    link.href = "#" + group.key;
    i18n(link, String(index + 3).padStart(2, "0") + " " + group.title[0], String(index + 3).padStart(2, "0") + " " + group.title[1], String(index + 3).padStart(2, "0") + " " + group.title[2]);
    primaryNav.appendChild(link);
  });

  var indexSection = document.createElement("section");
  indexSection.className = "compact-index-section";
  indexSection.id = "content-index";
  var indexHead = document.createElement("div");
  indexHead.className = "compact-index-head";
  var eyebrow = document.createElement("p");
  eyebrow.className = "project-section-no";
  eyebrow.textContent = "02 / CONTENT INDEX";
  var indexTitle = document.createElement("h3");
  i18n(indexTitle, "内容导航", "內容導航", "Content Index");
  indexHead.appendChild(eyebrow);
  indexHead.appendChild(indexTitle);
  var previewGrid = document.createElement("div");
  previewGrid.className = "compact-preview-grid";
  groups.forEach(function (group, index) {
    var card = document.createElement("a");
    card.className = "compact-preview-card" + (group.pending ? " is-pending" : "");
    card.href = "#" + group.key;
    var firstImage = group.items[0] && group.items[0].querySelector("img");
    if (firstImage) {
      var previewImage = document.createElement("img");
      previewImage.src = firstImage.getAttribute("src");
      previewImage.alt = group.title[0];
      previewImage.loading = "lazy";
      card.appendChild(previewImage);
    } else {
      var placeholder = document.createElement("span");
      placeholder.className = "compact-preview-placeholder";
      placeholder.textContent = "+";
      card.appendChild(placeholder);
    }
    var cardCopy = document.createElement("span");
    cardCopy.className = "compact-preview-copy";
    var cardNo = document.createElement("small");
    cardNo.textContent = String(index + 3).padStart(2, "0");
    var cardTitle = document.createElement("strong");
    i18n(cardTitle, group.title[0], group.title[1], group.title[2]);
    cardCopy.appendChild(cardNo);
    cardCopy.appendChild(cardTitle);
    card.appendChild(cardCopy);
    previewGrid.appendChild(card);
  });
  indexSection.appendChild(indexHead);
  indexSection.appendChild(previewGrid);

  overview.insertAdjacentElement("afterend", primaryNav);
  primaryNav.insertAdjacentElement("afterend", indexSection);
  gallerySection.innerHTML = "";
  gallerySection.className = "project-gallery-section compact-detail-shell";

  groups.forEach(function (group, groupIndex) {
    var section = document.createElement("section");
    section.className = "compact-chapter";
    section.id = group.key;
    section.setAttribute("data-project-section", "");
    var header = document.createElement("header");
    header.className = "compact-chapter-head";
    var chapterNo = document.createElement("span");
    chapterNo.textContent = String(groupIndex + 3).padStart(2, "0");
    var headerCopy = document.createElement("div");
    var heading = document.createElement("h3");
    i18n(heading, group.title[0], group.title[1], group.title[2]);
    var subheading = document.createElement("p");
    i18n(subheading, group.subtitle[0], group.subtitle[1], group.subtitle[2]);
    headerCopy.appendChild(heading);
    headerCopy.appendChild(subheading);
    header.appendChild(chapterNo);
    header.appendChild(headerCopy);
    section.appendChild(header);

    if (group.items.length > 1) {
      var localNav = document.createElement("nav");
      localNav.className = "compact-local-nav";
      localNav.setAttribute("aria-label", group.title[0]);
      group.items.forEach(function (figure, itemIndex) {
        var figureId = group.key + "-item-" + (itemIndex + 1);
        figure.id = figureId;
        var itemLink = document.createElement("a");
        itemLink.href = "#" + figureId;
        var captionLabel = figure.querySelector("figcaption span:last-child");
        itemLink.textContent = String(itemIndex + 1).padStart(2, "0") + " " + (captionLabel ? captionLabel.textContent.trim() : "DETAIL");
        localNav.appendChild(itemLink);
      });
      section.appendChild(localNav);
    }

    if (group.pending) {
      var note = document.createElement("div");
      note.className = "compact-pending-note";
      var noteTitle = document.createElement("strong");
      i18n(noteTitle, "资料待补齐", "資料待補齊", "Materials to Be Added");
      var noteCopy = document.createElement("p");
      i18n(noteCopy, "这里已预留图像、过程说明与成果展示位置，新增资料后可直接继续排版。", "這裡已預留圖像、過程說明與成果展示位置，新增資料後可直接繼續排版。", "Space is reserved for imagery, process notes and final outcomes so future materials can be added directly.");
      note.appendChild(noteTitle);
      note.appendChild(noteCopy);
      section.appendChild(note);
    } else {
      var grid = document.createElement("div");
      grid.className = "project-gallery compact-gallery-grid";
      group.items.forEach(function (figure, itemIndex) {
        figure.classList.add("compact-detail-figure");
        figure.classList.remove("gallery-wide");
        figure.classList.add(itemIndex === 0 ? "compact-span-12" : "compact-span-6");
        grid.appendChild(figure);
      });
      section.appendChild(grid);
    }
    gallerySection.appendChild(section);
  });

  if ("IntersectionObserver" in window) {
    var sectionLinks = Array.prototype.slice.call(primaryNav.querySelectorAll("a"));
    var targets = sectionLinks.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!visible.length) return;
      var activeId = "#" + visible[0].target.id;
      sectionLinks.forEach(function (link) {
        var active = link.getAttribute("href") === activeId;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.35] });
    targets.forEach(function (target) { observer.observe(target); });
  }
}());
