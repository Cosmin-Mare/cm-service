(function () {
  var PROMO_END = new Date("2026-06-28T23:59:59+03:00");

  function isPromoActive() {
    return new Date() <= PROMO_END;
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function updateCountdown() {
    var diff = PROMO_END - new Date();
    if (diff <= 0) return;

    var total = Math.floor(diff / 1000);
    var days = Math.floor(total / 86400);
    total %= 86400;
    var hours = Math.floor(total / 3600);
    total %= 3600;
    var mins = Math.floor(total / 60);
    var secs = total % 60;

    var daysEl = document.getElementById("promoCountDays");
    var hoursEl = document.getElementById("promoCountHours");
    var minsEl = document.getElementById("promoCountMins");
    var secsEl = document.getElementById("promoCountSecs");

    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = pad2(hours);
    if (minsEl) minsEl.textContent = pad2(mins);
    if (secsEl) secsEl.textContent = pad2(secs);

    var compactEl = document.getElementById("promoCountCompact");
    if (compactEl) {
      compactEl.textContent = days + "z " + pad2(hours) + "h " + pad2(mins) + "m";
    }
  }

  function initCountdown() {
    if (!isPromoActive()) return;

    var countdown = document.getElementById("promoCountdown");
    if (countdown) countdown.hidden = false;

    var compactEl = document.getElementById("promoCountCompact");
    if (compactEl) compactEl.hidden = false;

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function initPromo() {
    if (!isPromoActive()) return;

    document.documentElement.classList.add("promo-active");

    ["promoHero", "navPromo", "promoPriceNote"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.hidden = false;
    });

    var regularNote = document.getElementById("promoPriceRegular");
    if (regularNote) regularNote.hidden = true;

    document.querySelectorAll(".offer-price-amount").forEach(function (el) {
      var regular = el.textContent.trim();
      var min = el.getAttribute("data-price-min");
      var max = el.getAttribute("data-price-max");
      var single = el.getAttribute("data-price");
      var sale;

      if (min && max) {
        sale = Math.round(Number(min) * 0.5) + "–" + Math.round(Number(max) * 0.5) + " RON";
      } else if (single) {
        sale = Math.round(Number(single) * 0.5) + " RON";
      } else {
        return;
      }

      el.innerHTML =
        '<span class="offer-price-was">' +
        regular +
        '</span><span class="offer-price-now">' +
        sale +
        "</span>";
    });

    initCountdown();
  }

  initPromo();

  var nav = document.getElementById("nav");
  var siteHeader = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var yearEl = document.getElementById("year");
  var serviciiGrid = document.getElementById("serviciiGrid");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) {
      nav.classList.toggle("scrolled", y > 24);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && nav && navLinks) {
    function setNavOpen(open) {
      nav.classList.toggle("open", open);
      if (siteHeader) siteHeader.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Închide meniul" : "Meniu");
      document.body.style.overflow = open && window.matchMedia("(max-width: 760px)").matches ? "hidden" : "";
    }

    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("open"));
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 760px)").matches) {
          setNavOpen(false);
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      var t = e.target;
      if (siteHeader && siteHeader.contains(t)) return;
      setNavOpen(false);
    });
  }

  if (serviciiGrid) {
    serviciiGrid.addEventListener("click", function (e) {
      var btn = e.target.closest(".serviciu-toggle");
      if (!btn || !serviciiGrid.contains(btn)) return;
      var card = btn.closest(".serviciu-card");
      if (!card) return;
      var expanded = card.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.textContent = expanded ? "Mai puțin" : "Mai mult";

      if (expanded) {
        serviciiGrid.querySelectorAll(".serviciu-card.is-expanded").forEach(function (other) {
          if (other === card) return;
          other.classList.remove("is-expanded");
          var t = other.querySelector(".serviciu-toggle");
          if (t) {
            t.setAttribute("aria-expanded", "false");
            t.textContent = "Mai mult";
          }
        });
      }
    });
  }

  var copyBtn = document.getElementById("copyPageLink");
  var waShare = document.getElementById("whatsappShareLink");
  if (waShare) {
    waShare.href =
      "https://wa.me/?text=" +
      encodeURIComponent(
        "CM Service — reparații PC și laptop în Dej, Cluj: " + window.location.href
      );
  }
  var contactForm = document.getElementById("contactForm");
  var contactFormStatus = document.getElementById("contactFormStatus");
  var contactFormSubmit = document.getElementById("contactFormSubmit");

  if (contactForm && contactFormStatus) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = contactForm.querySelector('input[name="botcheck"]');
      if (hp && hp.checked) return;

      var fd = new FormData(contactForm);
      var accessKey = fd.get("access_key");
      var name = String(fd.get("name") || "").trim();
      var email = String(fd.get("email") || "").trim();
      var message = String(fd.get("message") || "").trim();
      var phone = String(fd.get("phone") || "").trim();
      var consent = fd.get("consent");

      if (!name || !email || !message) return;
      if (!consent) {
        contactFormStatus.hidden = false;
        contactFormStatus.removeAttribute("data-state");
        contactFormStatus.classList.remove("is-busy");
        contactFormStatus.setAttribute("data-state", "error");
        contactFormStatus.textContent =
          "Bifează acordul pentru prelucrarea datelor înainte de trimitere.";
        return;
      }

      var payload = {
        access_key: accessKey,
        subject: "CM Service — mesaj de pe site",
        name: name,
        email: email,
        message: message,
      };
      if (phone) payload.phone = phone;

      if (contactFormSubmit) {
        contactFormSubmit.disabled = true;
      }
      contactFormStatus.hidden = false;
      contactFormStatus.removeAttribute("data-state");
      contactFormStatus.classList.add("is-busy");
      contactFormStatus.textContent = "Se trimite…";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            contactFormStatus.classList.remove("is-busy");
            contactFormStatus.setAttribute("data-state", "success");
            contactFormStatus.textContent =
              "Mulțumesc! Am primit mesajul. Îți răspund când pot, de regulă în aceeași zi lucrătoare.";
            contactForm.reset();
          } else {
            var errMsg =
              (result.data && (result.data.message || result.data.error)) ||
              "Nu am putut trimite mesajul. Încearcă din nou sau scrie pe email.";
            contactFormStatus.classList.remove("is-busy");
            contactFormStatus.setAttribute("data-state", "error");
            contactFormStatus.textContent = errMsg;
          }
        })
        .catch(function () {
          contactFormStatus.classList.remove("is-busy");
          contactFormStatus.setAttribute("data-state", "error");
          contactFormStatus.textContent =
            "Eroare de rețea. Verifică conexiunea sau contactează-mă direct la telefon sau email.";
        })
        .finally(function () {
          if (contactFormSubmit) {
            contactFormSubmit.disabled = false;
          }
        });
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var url = window.location.href;
      var prevLabel = copyBtn.textContent;
      function done() {
        copyBtn.textContent = "Link copiat!";
        setTimeout(function () {
          copyBtn.textContent = prevLabel;
        }, 2200);
      }
      function fallbackCopy() {
        var ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }
})();
