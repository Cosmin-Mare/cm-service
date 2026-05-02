(function () {
  var nav = document.getElementById("nav");
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
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Închide meniul" : "Meniu");
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
      if (nav.contains(t)) return;
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
