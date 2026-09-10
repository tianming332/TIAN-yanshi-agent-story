(function () {
  "use strict";
  var dialog = document.getElementById("lightbox");
  var image = document.getElementById("lightboxImage");
  var close = document.getElementById("closeLightbox");

  function openLightbox(src, alt) {
    if (!dialog || !image || !src) return;
    image.src = src;
    image.alt = alt || "作品图片放大预览";
    dialog.showModal();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-lightbox]");
    if (button) {
      openLightbox(button.dataset.lightbox, button.querySelector("img") && button.querySelector("img").alt);
      return;
    }
    var link = event.target.closest(".yanshi-lightbox");
    if (link) {
      event.preventDefault();
      openLightbox(link.getAttribute("href"), link.querySelector("img") && link.querySelector("img").alt);
    }
  });

  if (close) close.addEventListener("click", function () { dialog.close(); });
  if (dialog) {
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () { image.removeAttribute("src"); });
  }

  function updateProgress() {
    var max = document.documentElement.scrollHeight - innerHeight;
    var progress = max > 0 ? scrollY / max : 0;
    var bar = document.getElementById("progressBar");
    if (bar) bar.style.transform = "scaleX(" + progress + ")";
  }

  var sectionLinks = Array.prototype.slice.call(document.querySelectorAll(".yanshi-nav a"));
  if ("IntersectionObserver" in window && sectionLinks.length) {
    var sections = sectionLinks.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      sectionLinks.forEach(function (link) {
        var active = link.getAttribute("href") === "#" + visible.target.id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.35] });
    sections.forEach(function (section) { observer.observe(section); });
  }

  updateProgress();
  addEventListener("scroll", updateProgress, { passive: true });
}());
