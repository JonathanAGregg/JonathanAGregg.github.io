/*
 * Renders the content in content.js and wires up the interactions.
 * Vanilla JS, no build step and no dependencies, so it also works when
 * index.html is opened straight from disk.
 */
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o && o[k]; }, S); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-"); };

  /* ---------- Simple bindings ---------- */
  $$("[data-bind]").forEach(function (el) { el.textContent = get(el.dataset.bind) || ""; });
  $$("[data-bind-href]").forEach(function (el) { el.href = get(el.dataset.bindHref) || "#"; });
  $$("[data-bind-mailto]").forEach(function (el) { el.href = "mailto:" + get(el.dataset.bindMailto); });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Topographic background (see tools/make_contours.py) ---------- */
  var topo = $(".contours");
  if (topo && window.CONTOURS_SVG) topo.innerHTML = window.CONTOURS_SVG;

  /* ---------- At a glance ---------- */
  $("#glance").innerHTML = S.glance.map(function (g) {
    return '<div class="glance-item"><dt>' + esc(g.label) + "</dt><dd>" + esc(g.value) + "</dd></div>";
  }).join("");

  /* ---------- Work list + filters ---------- */
  var list = $("#work-list");
  list.innerHTML = S.work.map(function (w, i) {
    return (
      '<li class="work-item" data-tags="' + esc(w.tags.map(slug).join(" ")) + '">' +
        '<a class="work-link" href="#work/' + esc(w.id) + '" data-open="' + esc(w.id) + '">' +
          '<span class="work-index"><span>CASE</span><strong>' + String(i + 1).padStart(2, "0") + "</strong></span>" +
          '<span class="work-main">' +
            '<span class="work-meta">' + esc(w.org) + " · " + esc(w.year) + "</span>" +
            '<span class="work-title">' + esc(w.title) + "</span>" +
            '<span class="work-summary">' + esc(w.summary) + "</span>" +
            '<span class="work-tags">' + w.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</span>" +
          "</span>" +
          '<span class="work-stat"><strong>' + esc(w.metrics[0].value) + "</strong>" + esc(w.metrics[0].label) + "</span>" +
          '<span class="work-arrow" aria-hidden="true">→</span>' +
        "</a>" +
      "</li>"
    );
  }).join("");

  var allTags = [];
  S.work.forEach(function (w) { w.tags.forEach(function (t) { if (allTags.indexOf(t) < 0) allTags.push(t); }); });
  var filters = $("#filters");
  filters.innerHTML = ["All"].concat(allTags).map(function (t, i) {
    return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-filter="' + (i === 0 ? "" : slug(t)) + '">' + esc(t) + "</button>";
  }).join("");

  function applyFilter(tag) {
    var shown = 0;
    $$(".work-item", list).forEach(function (li) {
      var on = !tag || li.dataset.tags.split(" ").indexOf(tag) >= 0;
      li.hidden = !on;
      if (on) shown++;
    });
    $$(".chip", filters).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === tag)); });
    $("#filter-count").textContent = tag ? "Showing " + shown + " of " + S.work.length : "";
  }
  filters.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) applyFilter(b.dataset.filter);
  });

  /* ---------- Case study dialog (deep-linkable via #work/<id>) ---------- */
  var dialog = $("#case");
  var current = -1;
  var lastFocus = null;

  function visibleIds() {
    return $$(".work-item", list).filter(function (li) { return !li.hidden; })
      .map(function (li) { return $("a", li).dataset.open; });
  }

  function renderCase(w) {
    var ids = visibleIds();
    var pos = ids.indexOf(w.id);
    $("#case-meta").textContent = w.org + " · " + w.year;
    $("#case-pos").textContent = (pos + 1) + " / " + ids.length;
    $$(".case-step", dialog).forEach(function (b) { b.disabled = ids.length < 2; });
    $("#case-body").innerHTML =
      '<h2 id="case-title">' + esc(w.title) + "</h2>" +
      '<p class="case-summary">' + esc(w.summary) + "</p>" +
      '<dl class="case-metrics">' + w.metrics.map(function (m) {
        return "<div><dd>" + esc(m.value) + "</dd><dt>" + esc(m.label) + "</dt></div>";
      }).join("") + "</dl>" +
      '<div class="case-grid">' +
        '<section><h3>The problem</h3><p>' + esc(w.problem) + "</p></section>" +
        '<section><h3>What I did</h3><ol class="steps">' + w.approach.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol></section>" +
        '<section class="case-outcome"><h3>Outcome</h3><p>' + esc(w.outcome) + "</p></section>" +
        '<section><h3>Stack</h3><p class="stack">' + w.stack.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</p></section>" +
      "</div>";
    $("#case-body").scrollTop = 0;
    dialog.scrollTop = 0;
  }

  function openCase(id, push) {
    var idx = S.work.findIndex(function (w) { return w.id === id; });
    if (idx < 0) return;
    current = idx;
    renderCase(S.work[idx]);
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
      document.documentElement.classList.add("modal-open");
    }
    $(".case-close", dialog).focus();
    if (push) history.pushState(null, "", "#work/" + id);
  }

  function closeCase(fromHistory) {
    if (!dialog.open) return;
    dialog.close();
  }
  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("modal-open");
    if (location.hash.indexOf("#work/") === 0) history.pushState(null, "", "#work");
    if (lastFocus) lastFocus.focus();
  });

  function step(dir) {
    var ids = visibleIds();
    var i = ids.indexOf(S.work[current].id);
    var next = ids[(i + dir + ids.length) % ids.length];
    openCase(next, false);
    history.replaceState(null, "", "#work/" + next);
  }

  list.addEventListener("click", function (e) {
    var a = e.target.closest("[data-open]");
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    openCase(a.dataset.open, true);
  });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target.closest("[data-close]")) closeCase();
    var s = e.target.closest("[data-step]");
    if (s) step(Number(s.dataset.step));
  });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  function syncFromHash() {
    var m = location.hash.match(/^#work\/([\w-]+)/);
    if (m) openCase(m[1], false);
    else if (dialog.open) dialog.close();
  }
  window.addEventListener("popstate", syncFromHash);
  syncFromHash();

  /* ---------- Principles, experience, toolkit, about, contact ---------- */
  $("#principles").innerHTML = S.principles.map(function (p, i) {
    return '<li class="principle"><span class="principle-num">' + String(i + 1).padStart(2, "0") + "</span><h3>" + esc(p.title) + "</h3><p>" + esc(p.body) + "</p></li>";
  }).join("");

  $("#timeline").innerHTML = S.experience.map(function (x, i) {
    return (
      '<li class="role">' +
        '<details' + (i === 0 ? " open" : "") + ">" +
          '<summary><span class="role-head"><span class="role-title">' + esc(x.role) + '</span><span class="role-org">' + esc(x.org) + "</span></span>" +
          '<span class="role-dates"><span>' + esc(x.dates) + '</span><span class="role-place">' + esc(x.place) + "</span></span></summary>" +
          '<p class="role-blurb">' + esc(x.blurb) + "</p>" +
          "<ul>" + x.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
        "</details>" +
      "</li>"
    );
  }).join("");

  $("#toolkit").innerHTML = S.toolkit.map(function (g) {
    return '<div class="tool-group"><h4>' + esc(g.group) + "</h4><p>" + g.items.map(esc).join('<span class="sep" aria-hidden="true"> / </span>') + "</p></div>";
  }).join("");

  $("#about-body").innerHTML = S.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
    '<p class="edu">' + esc(S.education) + "</p>";

  var links = [];
  if (S.links.linkedin) links.push(['LinkedIn', S.links.linkedin]);
  if (S.links.github) links.push(['GitHub', S.links.github]);
  links.push(['Résumé', S.resume]);
  $("#contact-links").innerHTML = links.map(function (l) {
    var ext = /^https?:/.test(l[1]);
    return '<li><a class="text-link" href="' + esc(l[1]) + '"' + (ext ? ' target="_blank" rel="noopener"' : " download") + ">" + esc(l[0]) + (ext ? " ↗" : " ↓") + "</a></li>";
  }).join("");

  /* ---------- Side projects + full-screen image viewer ---------- */
  var projects = S.projects || [];
  $("#project-list").innerHTML = projects.map(function (pr) {
    return (
      '<article class="project" id="project-' + esc(pr.id) + '">' +
        '<figure class="project-figure">' +
          '<button type="button" class="project-zoom" style="--project-aspect:' + pr.width + ' / ' + pr.height + '" data-lightbox="' + esc(pr.id) + '" aria-label="View ' + esc(pr.title) + ' full size">' +
            '<img src="' + esc(pr.image) + '" alt="' + esc(pr.alt) + '" width="' + pr.width + '" height="' + pr.height + '" loading="' + esc(pr.loading || "lazy") + '" decoding="async">' +
            '<span class="project-image-fallback" hidden>Preview unavailable. Open the project source below.</span>' +
            '<span class="project-zoom-hint" aria-hidden="true">View full size</span>' +
          "</button>" +
        "</figure>" +
        '<div class="project-text">' +
          '<p class="work-meta">' + esc(pr.kicker) + (pr.year ? " · " + esc(pr.year) : "") + "</p>" +
          "<h3>" + esc(pr.title) + "</h3>" +
          "<p>" + esc(pr.summary) + "</p>" +
          '<dl class="project-facts">' + pr.facts.map(function (f) { return "<div><dd>" + esc(f.value) + "</dd><dt>" + esc(f.label) + "</dt></div>"; }).join("") + "</dl>" +
          (pr.why ? '<p class="project-why"><strong>Why it\'s here:</strong> ' + esc(pr.why) + "</p>" : "") +
          (pr.tools && pr.tools.length ? '<p class="stack">' + pr.tools.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</p>" : "") +
          (pr.source ? '<p class="project-source">' + esc(pr.sourceLabel || "Source") + ": " + (pr.sourceUrl ? '<a class="text-link" href="' + esc(pr.sourceUrl) + '" target="_blank" rel="noopener">' + esc(pr.source) + "</a>" : esc(pr.source)) + "</p>" : "") +
        "</div>" +
      "</article>"
    );
  }).join("");
  if (!projects.length) { var ps = $("#projects"); if (ps) ps.hidden = true; var pl = $('#nav-list a[href="#projects"]'); if (pl) pl.parentNode.hidden = true; }

  $$(".project-zoom img", $("#project-list")).forEach(function (image) {
    image.addEventListener("error", function () {
      image.hidden = true;
      var fallback = image.nextElementSibling;
      if (fallback) fallback.hidden = false;
    });
  });

  var lightbox = $("#lightbox"), lbImg = $("#lightbox-img"), lbFocus = null;
  $("#project-list").addEventListener("click", function (e) {
    var b = e.target.closest("[data-lightbox]");
    if (!b) return;
    var pr = projects.filter(function (x) { return x.id === b.dataset.lightbox; })[0];
    lbImg.src = pr.image; lbImg.alt = pr.alt;
    $("#lightbox-caption").textContent = pr.title;
    $("#lightbox-open").href = pr.image;
    lbFocus = b;
    lightbox.showModal();
    document.documentElement.classList.add("modal-open");
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target === lbImg || e.target.closest("[data-close-lightbox]")) lightbox.close();
  });
  lightbox.addEventListener("close", function () {
    document.documentElement.classList.remove("modal-open");
    if (lbFocus) lbFocus.focus();
  });

  /* ---------- Copy email ---------- */
  var toast = $("#toast"), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }
  $("#copy-email").addEventListener("click", function () {
    var done = function () { showToast("Email copied to clipboard"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(S.email).then(done, function () { showToast(S.email); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = S.email; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { showToast(S.email); }
      ta.remove();
    }
  });

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  function currentTheme() {
    return root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  $(".theme-toggle").addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    showToast(next === "dark" ? "Dark theme" : "Light theme");
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = $(".nav-toggle"), navList = $("#nav-list");
  navToggle.addEventListener("click", function () {
    var open = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(open));
    navList.classList.toggle("open", open);
  });
  navList.addEventListener("click", function (e) {
    if (e.target.closest("a")) { navToggle.setAttribute("aria-expanded", "false"); navList.classList.remove("open"); }
  });

  /* ---------- Header state + scrollspy ---------- */
  var header = $(".site-header");
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var navLinks = $$("#nav-list a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });

    // Gentle reveal on scroll (skipped when the user prefers reduced motion; see CSS).
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); reveal.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".work-item, .principle, .role, .tool-group, .project").forEach(function (el) { el.classList.add("reveal"); reveal.observe(el); });
  }
})();
