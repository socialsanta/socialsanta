/* Social Santa — site interactions (plain JavaScript) */
(function () {
  "use strict";

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    els.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
    });
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("reveal-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var els = document.querySelectorAll("[data-counter]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.textContent = el.dataset.counter + (el.dataset.suffix || ""); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var to = Number(el.dataset.counter);
        var suffix = el.dataset.suffix || "";
        var start = performance.now();
        function tick(t) {
          var p = Math.min(1, (t - start) / 1400);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Navigation menu (floating card) ---------- */
  function initMenu() {
    var btn = document.getElementById("menu-btn");
    var nav = document.getElementById("nav-menu");
    if (!btn || !nav) return;
    var cta = document.querySelector(".header-cta");
    var subBtn = nav.querySelector(".nav-sub-toggle");
    var sub = document.getElementById("nav-sub");

    function setSub(open) {
      if (!subBtn || !sub) return;
      subBtn.setAttribute("aria-expanded", open ? "true" : "false");
      subBtn.setAttribute("aria-label", open ? "Hide services" : "Show services");
      sub.classList.toggle("open", open);
    }
    function setMenu(open, returnFocus) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (cta) cta.inert = open;
      if (!open) { setSub(false); if (returnFocus) btn.focus(); }
    }
    btn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    if (subBtn) subBtn.addEventListener("click", function () { setSub(!sub.classList.contains("open")); });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false, true);
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Services accordion ---------- */
  function initAccordion() {
    var btns = document.querySelectorAll(".svc-btn");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var wasOpen = b.classList.contains("open");
        btns.forEach(function (x) { x.classList.remove("open"); });
        if (!wasOpen) b.classList.add("open");
      });
    });
  }

  /* ---------- Work filter ---------- */
  var projects = [
    { name: "Ocean Plate", cat: "Branding", line: "A brand identity for global shelves.", href: "ocean-plate.html" ,image: "assets/images/ocean-hero.webp"},
    { name: "Galangal", cat: "Social Media", line: "Pan-Asian dining, told one post at a time." }, 
    { name: "AMD", cat: "Branding", line: "An identity refresh with a Kolhapuri soul.", href: "amd.html" ,image: "assets/images/amd-hero.webp"},
    { name: "Niyaaz", cat: "Performance", line: "Filling tables with ads tuned for footfall." },
    { name: "Navieo", cat: "Social Media", line: "A D2C clothing label built on the feed." , href: "navieo.html"  },
    { name: "TBQ", cat: "Production", line: "Celebrations captured for The Banquet Company." },
    { name: "Annostav", cat: "Online Marketing", line: "Digital growth, channel by channel.", href: "annovstav.html" },
    { name: "Belcon", cat: "Online Marketing", line: "A retail growth narrative built for the boardroom."  ,href: "belcon.html" },
    { name: "Creamaai", cat: "Online Marketing", line: "Scroll-stopping campaigns for a sweet brand.", href: "creamaai.html" },
    { name: "Yali Rudraksha", cat: "Branding", line: "Provenance over certification.", href: "yali-rudraksha.html" },
    { name: "The Holy Bites", cat: "Production", line: "Food films that make you hungry." , href: "holy-bites.html" },
    { name: "AKP Ferrocast", cat: "Branding", line: "Repositioning a 1978 iron-casting OEM for global buyers." , href: "akp.html" },
    { name: "Sunny's In A Bottle", cat: "Production", line: "Bottled sunshine, shot in-house." , href: "sunnys.html"  }
  ];

  function initWork() {
    var grid = document.getElementById("work-grid");
    if (!grid) return;
    var buttons = document.querySelectorAll(".filter-btn");
    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function render(cat) {
      var list = projects.filter(function (p) { return cat === "All" || p.cat === cat; });
      grid.innerHTML = list.map(function (p, i) {
        return '<div class="work-item" style="animation-delay:' + (i * 60) + 'ms">' +
          (p.href ? '<a href="' + p.href + '" style="display:block;color:inherit;text-decoration:none;">' : '') +
          '<div class="work-tile tone-' + (i % 4) + '">' +
'<img class="work-image" src="' + p.image + '" alt="' + esc(p.name) + '">' +
'<span class="arrow">↗</span>' +
'<div class="work-info">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<span class="work-cat">' + esc(p.cat) + '</span>' +
          '<p class="work-line">' + esc(p.line) + '</p>' +
          '</div></div>' +
          (p.href ? '</a>' : '') +
          '</div>';
      }).join("");
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.classList.toggle("active", x === b); });
        render(b.dataset.cat);
      });
    });
    render("All");
  }

  /* ---------- Contact form ---------- */
  function initContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var thanks = document.getElementById("thanks");
    var picked = [];
    form.querySelectorAll(".interest").forEach(function (b) {
      b.addEventListener("click", function () {
        var x = b.dataset.interest;
        var i = picked.indexOf(x);
        if (i > -1) picked.splice(i, 1); else picked.push(x);
        b.classList.toggle("on", i === -1);
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var body = "Name: " + f.get("name") + "\nEmail: " + f.get("email") + "\nCompany: " + f.get("company") +
        "\nInterested in: " + picked.join(", ") + "\n\n" + f.get("message");
      window.location.href = "mailto:hello@socialsanta.studio?subject=" +
        encodeURIComponent("New project enquiry") + "&body=" + encodeURIComponent(body);
      form.hidden = true;
      thanks.hidden = false;
    });
  }


  /* ---------- Desktop nav: sliding underline, active link, scrolled bar ---------- */
  function initDesktopNav() {
    var header = document.querySelector(".site-header");
    var list = document.querySelector(".nav-menu-list");
    if (!header || !list) return;

    function onScroll() { header.classList.toggle("scrolled", window.scrollY > 12); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var links = Array.prototype.slice.call(list.querySelectorAll(".nav-link"));
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var isSvc = document.body.classList.contains("svc-page");
    links.forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href === file || (isSvc && href === "services.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });

    var bar = document.createElement("span");
    bar.className = "nav-underline";
    bar.setAttribute("aria-hidden", "true");
    list.appendChild(bar);

    var desktop = window.matchMedia("(min-width: 64rem)");
    var visible = false;

    function place(link) {
      var l = link.getBoundingClientRect(), p = list.getBoundingClientRect();
      bar.style.transform = "translateX(" + (l.left - p.left) + "px)";
      bar.style.width = l.width + "px";
    }
    function show(link) {
      if (!desktop.matches) return;
      if (!visible) {
        bar.classList.add("snap");
        bar.style.width = "0px";
        place(link);
        bar.style.width = "0px";
        void bar.offsetWidth;
        bar.classList.remove("snap");
        bar.classList.add("on");
        visible = true;
      }
      place(link);
    }
    function hide() {
      visible = false;
      bar.classList.remove("on");
      bar.style.width = "0px";
    }

    links.forEach(function (a) {
      a.addEventListener("pointerenter", function () { show(a); });
      a.addEventListener("focus", function () { show(a); });
    });
    list.addEventListener("pointerleave", hide);
    list.addEventListener("focusout", function (e) {
      if (!list.contains(e.relatedTarget)) hide();
    });
    window.addEventListener("resize", hide);
  }
  /* Testimonial marquee: keep the strip wider than the screen so no blank gap appears */
  function initFlow() {
    var track = document.querySelector(".ss-flow-track");
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children).filter(function (el) { return el.tagName === "FIGURE"; });
    if (cards.length < 2) return;
   var originals = cards.slice(0, cards.length / 2).map(function (el) {
    return el.cloneNode(true);
});
    function build() {
      var need = window.innerWidth + 200;
      track.innerHTML = "";
      function addSet(isCopy) {
        originals.forEach(function (o) {
          var c = o.cloneNode(true);
          if (isCopy) c.setAttribute("aria-hidden", "true");
          track.appendChild(c);
        });
      }
      addSet(false);
      var guard = 0;
      while (track.scrollWidth < need && guard++ < 10) addSet(true);
      var half = Array.prototype.slice.call(track.children);
      half.forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        track.appendChild(c);
      });
    }
    build();
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(build, 250);
    });
  }

  /* Testimonial marquee: fills the screen + slow speed */
  function initFlow() {
    var SPEED = 40
    
    
    0; /* pixels per second: lower number = slower */
    var track = document.querySelector(".ss-flow-track");
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children).filter(function (el) { return el.tagName === "FIGURE"; });
    if (cards.length < 2) return;
    var originals = cards.map(function (el) { return el.cloneNode(true); });
    function build() {
      var need = window.innerWidth + 200;
      track.innerHTML = "";
      function addSet(isCopy) {
        originals.forEach(function (o) {
          var c = o.cloneNode(true);
          if (isCopy) c.setAttribute("aria-hidden", "true");
          track.appendChild(c);
        });
      }
      addSet(false);
      var guard = 0;
      while (track.scrollWidth < need && guard++ < 10) addSet(true);
      var half = Array.prototype.slice.call(track.children);
      half.forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        track.appendChild(c);
      });
      track.style.animationDuration = (track.scrollWidth / 2 / SPEED) + "s";
    }
    build();
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(build, 250);
    });
  }


 
    /* Video section: videos start by themselves (muted) when they scroll into view, pause when they leave.
     Click a video to turn its sound on or off. */
  (function () {
    var rail = document.getElementById("ss-yt-rail");
    if (!rail) return;
    var prev = document.getElementById("ss-yt-prev"), next = document.getElementById("ss-yt-next");
    function step() { var c = rail.querySelector(".ss-yt-card"); return c ? c.getBoundingClientRect().width + 20 : 300; }
    function sync() {
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    }
    if (prev) prev.addEventListener("click", function () { rail.scrollBy({ left: -step() * 2, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { rail.scrollBy({ left: step() * 2, behavior: "smooth" }); });
    rail.addEventListener("scroll", sync, { passive: true }); window.addEventListener("resize", sync); sync();

    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setSound(sh, on) {
      var v = sh.querySelector("video"), b = sh.querySelector(".ss-yt-sound");
      v.muted = !on;
      if (b) {
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
      }
    }
    function start(sh, withSound) {
      var v = sh.querySelector("video");
      setSound(sh, !!withSound);
      var p = v.play();
      sh.classList.add("is-live");
      if (p && p.catch) p.catch(function () { sh.classList.remove("is-live"); });   /* blocked: the play button stays */
    }
    function stop(sh) {
      var v = sh.querySelector("video");
      v.pause(); setSound(sh, false);
      sh.classList.remove("is-live");
    }
    function muteOthers(except) {
      rail.querySelectorAll(".ss-yt-shape").forEach(function (sh) { if (sh !== except) setSound(sh, false); });
    }

    /* click: sound on / off (or start the video if it could not start by itself) */
    rail.addEventListener("click", function (e) {
      var sh = e.target.closest(".ss-yt-shape");
      if (!sh) return;
      var v = sh.querySelector("video");
      if (sh.classList.contains("is-live") && !v.paused) {
        var turnOn = v.muted;
        muteOthers(sh);
        setSound(sh, turnOn);
      } else {
        muteOthers(sh);
        start(sh, true);
      }
    });

    /* start when at least half of the video is on screen, pause when it leaves */
    var shapes = [].slice.call(rail.querySelectorAll(".ss-yt-shape"));
    if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) start(en.target, false); else stop(en.target);
        });
      }, { threshold: .5 });
      shapes.forEach(function (sh) { io.observe(sh); });
    }
  })();


  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initYear();
    initAccordion();
    initWork();
    initContact();
    initReveal();
    initCounters();
    initDesktopNav();
    initFlow();
    initMenu();
  });
})();