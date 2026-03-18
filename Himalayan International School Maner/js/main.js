(function () {
  var navOrder = [
    "home",
    "stats",
    "about",
    "campus-strip",
    "pillars",
    "values",
    "academics",
    "facilities",
    "location",
    "leadership",
    "admissions",
    "enquiry",
    "gallery",
    "notices",
    "contact",
  ];

  function headerTriggerY() {
    var topBar = document.querySelector(".alert-bar");
    var topBar2 = document.querySelector(".top-bar");
    var header = document.querySelector(".site-header");
    var y = 8;
    if (topBar) y += topBar.offsetHeight;
    if (topBar2) y += topBar2.offsetHeight;
    if (header) y += header.offsetHeight;
    return y;
  }

  function updateNavActive() {
    var trigger = window.scrollY + headerTriggerY();
    var sections = [];
    navOrder.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var top = el.getBoundingClientRect().top + window.pageYOffset;
      sections.push({ id: id, top: top });
    });
    sections.sort(function (a, b) {
      return a.top - b.top;
    });
    var activeId = "";
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].top <= trigger) activeId = sections[i].id;
    }
    if (activeId === "stats") activeId = "home";
    if (activeId === "enquiry") activeId = "admissions";

    document
      .querySelectorAll(".nav-desktop a[href^='#'], .nav-mobile a[href^='#']")
      .forEach(function (a) {
        var id = (a.getAttribute("href") || "").slice(1);
        var isActive = id === activeId && activeId !== "";
        a.classList.toggle("nav-active", isActive);
        if (isActive) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
  }

  var navRaf = 0;
  function onScrollNav() {
    if (navRaf) return;
    navRaf = requestAnimationFrame(function () {
      navRaf = 0;
      updateNavActive();
    });
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  window.addEventListener("resize", updateNavActive);
  window.addEventListener("load", function () {
    updateNavActive();
    setTimeout(updateNavActive, 200);
  });
  window.addEventListener("hashchange", function () {
    setTimeout(updateNavActive, 0);
    setTimeout(updateNavActive, 400);
  });
  document.addEventListener("DOMContentLoaded", updateNavActive);

  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".nav-mobile");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      toggle.setAttribute(
        "aria-expanded",
        mobileNav.classList.contains("is-open")
      );
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Hero slideshow */
  (function heroSlider() {
    var root = document.querySelector("[data-hero-slides]");
    if (!root) return;
    var slides = root.querySelectorAll(".hero-slide");
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var dotsWrap = document.querySelector("[data-hero-dots]");
    var n = slides.length;
    var i = 0;
    var autoplay = 6500;
    var t = null;

    slides.forEach(function (_, j) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Slide " + (j + 1));
      if (j === 0) b.classList.add("is-active");
      b.addEventListener("click", function () {
        go(j);
        stop();
        start();
      });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(j) {
      i = (j + n) % n;
      slides.forEach(function (s, k) {
        s.classList.toggle("is-active", k === i);
      });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-active", k === i);
      });
    }
    function nextSlide() {
      go(i + 1);
    }
    function start() {
      stop();
      t = setInterval(nextSlide, autoplay);
    }
    function stop() {
      if (t) clearInterval(t);
      t = null;
    }

    if (prev) prev.addEventListener("click", function () { go(i - 1); stop(); start(); });
    if (next) next.addEventListener("click", function () { go(i + 1); stop(); start(); });

    var heroEl = root.closest(".hero-slideshow");
    if (heroEl) {
      heroEl.addEventListener("mouseenter", stop);
      heroEl.addEventListener("mouseleave", start);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
    start();
  })();

  /* Stats count-up */
  (function statsCount() {
    var nums = document.querySelectorAll(".stat-item__num[data-count]");
    if (!nums.length) return;
    var done = false;
    function run() {
      if (done) return;
      var strip = document.getElementById("stats");
      if (!strip || strip.getBoundingClientRect().top > window.innerHeight * 0.85)
        return;
      done = true;
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var start = 0;
        var dur = 1400;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("load", run);
    run();
  })();

  /* Academics tabs */
  (function acadTabs() {
    var root = document.querySelector("[data-acad-tabs]");
    if (!root) return;
    var btns = root.querySelectorAll(".acad-tabs__buttons [data-tab]");
    var panels = root.querySelectorAll(".acad-panel[data-panel]");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        btns.forEach(function (b) {
          var on = b.getAttribute("data-tab") === tab;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (p) {
          var on = p.getAttribute("data-panel") === tab;
          p.classList.toggle("is-active", on);
          p.hidden = !on;
        });
      });
    });
  })();

  /* Leadership: Director / Principal slides */
  (function leadershipSlider() {
    var root = document.querySelector("[data-leadership-slider]");
    if (!root) return;
    var slides = root.querySelectorAll("[data-leadership-slide]");
    var btnPrev = root.querySelector("[data-leadership-prev]");
    var btnNext = root.querySelector("[data-leadership-next]");
    var dots = root.querySelectorAll("[data-leadership-dot]");
    var n = slides.length;
    var index = 0;
    var timer = null;

    function go(j) {
      index = ((j % n) + n) % n;
      slides.forEach(function (s, k) {
        s.classList.toggle("is-active", k === index);
        s.setAttribute("aria-hidden", k === index ? "false" : "true");
      });
      dots.forEach(function (d, k) {
        var on = k === index;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        go(index + 1);
      }, 12000);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        stop();
        go(index - 1);
        start();
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", function () {
        stop();
        go(index + 1);
        start();
      });
    }
    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        stop();
        go(parseInt(d.getAttribute("data-index"), 10) || 0);
        start();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    go(0);
    start();
  })();

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var closeBtn = document.querySelector(".lightbox-close");

  document.querySelectorAll(".gallery-grid a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var src = link.getAttribute("href");
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        lightboxImg.alt = link.querySelector("img")
          ? link.querySelector("img").alt
          : "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();
