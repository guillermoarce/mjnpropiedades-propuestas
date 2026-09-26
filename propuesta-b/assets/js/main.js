// mjn propiedades — interacciones del sitio estático (sin dependencias externas)

(function () {
  "use strict";

  /* ---------------------------------------------------------- nav móvil */
  var toggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.innerHTML = open ? ICONS.close : ICONS.menu;
    });
  }

  var ICONS = {
    menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  /* ---------------------------------------------------------- reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
  // Red de seguridad: si por algún motivo el observer no dispara (navegadores
  // atípicos, pestaña en segundo plano), el contenido no debe quedar invisible.
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }, 2500);

  /* ---------------------------------------------------------- contador animado (hero) */
  document.querySelectorAll("[data-count-to]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count-to"), 10);
    var started = false;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          var start = 0;
          var duration = 900;
          var startTime = performance.now();
          function tick(now) {
            var p = Math.min(1, (now - startTime) / duration);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(start + (target - start) * eased);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    });
    obs.observe(el);
  });

  /* ---------------------------------------------------------- galería de ficha + lightbox */
  var galleryEl = document.querySelector("[data-gallery]");
  if (galleryEl) {
    var dataScript = document.querySelector("[data-gallery-photos]");
    var photos = dataScript ? JSON.parse(dataScript.textContent) : [];
    var galleryTitle = galleryEl.getAttribute("data-title") || "";
    var current = 0;
    var lastFocused = null;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Galería de fotos — " + galleryTitle);
    lb.innerHTML =
      '<div class="lightbox-top">' +
      '<span class="lightbox-count" data-lb-count></span>' +
      '<button type="button" class="lightbox-close" data-lb-close aria-label="Cerrar galería">' + ICONS.close + "</button>" +
      "</div>" +
      '<div class="lightbox-stage" data-lb-stage>' +
      '<button type="button" class="lightbox-arrow prev" data-lb-prev aria-label="Foto anterior"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<div class="lightbox-stage-inner"><img class="lightbox-img" data-lb-img alt=""></div>' +
      '<button type="button" class="lightbox-arrow next" data-lb-next aria-label="Foto siguiente"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<span class="lightbox-hint">Usa las flechas del teclado para navegar · Esc para cerrar</span>' +
      "</div>" +
      '<div class="lightbox-strip" data-lb-strip></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("[data-lb-img]");
    var lbCount = lb.querySelector("[data-lb-count]");
    var lbStrip = lb.querySelector("[data-lb-strip]");
    var lbStage = lb.querySelector("[data-lb-stage]");

    photos.forEach(function (src, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<img src="' + src + '" alt="Miniatura ' + (i + 1) + '" loading="lazy">';
      b.addEventListener("click", function () {
        current = i;
        render();
      });
      lbStrip.appendChild(b);
    });

    function preload(idx) {
      var im = new Image();
      im.src = photos[idx];
    }

    function render() {
      lbImg.classList.remove("show");
      var src = photos[current];
      var pre = new Image();
      pre.onload = function () {
        lbImg.src = src;
        requestAnimationFrame(function () {
          lbImg.classList.add("show");
        });
      };
      pre.src = src;
      lbImg.alt = galleryTitle + " — foto " + (current + 1) + " de " + photos.length;
      lbCount.textContent = current + 1 + " / " + photos.length;
      Array.prototype.forEach.call(lbStrip.children, function (b, i) {
        b.classList.toggle("active", i === current);
      });
      var activeThumb = lbStrip.children[current];
      if (activeThumb) activeThumb.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      preload((current + 1) % photos.length);
      preload((current - 1 + photos.length) % photos.length);
    }

    function go(delta) {
      current = (current + delta + photos.length) % photos.length;
      render();
    }

    function openLightbox(idx) {
      lastFocused = document.activeElement;
      current = idx;
      render();
      lb.classList.add("open");
      document.body.classList.add("lb-lock");
      lb.querySelector("[data-lb-close]").focus();
      document.addEventListener("keydown", onKey);
    }

    function closeLightbox() {
      lb.classList.remove("open");
      document.body.classList.remove("lb-lock");
      document.removeEventListener("keydown", onKey);
      if (lastFocused) lastFocused.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    }

    galleryEl.querySelectorAll("[data-open-lightbox]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(parseInt(el.getAttribute("data-index") || "0", 10));
      });
    });

    lb.querySelector("[data-lb-close]").addEventListener("click", closeLightbox);
    lb.querySelector("[data-lb-prev]").addEventListener("click", function () { go(-1); });
    lb.querySelector("[data-lb-next]").addEventListener("click", function () { go(1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === lbStage) closeLightbox();
    });

    var touchStartX = null;
    lbStage.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lbStage.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1);
      touchStartX = null;
    });
  }

  /* ---------------------------------------------------------- WhatsApp helpers */
  var WA_NUMBER = "56900000000";
  function waLink(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }
  window.mjnWaLink = waLink;

  /* ---------------------------------------------------------- buscador guiado (home) */
  var guided = document.querySelector("[data-guided-search]");
  if (guided) {
    guided.addEventListener("submit", function (e) {
      e.preventDefault();
      var op = guided.querySelector('[name="operacion"]').value;
      var comuna = guided.querySelector('[name="comuna"]').value;
      var params = new URLSearchParams();
      if (op) params.set("operacion", op);
      if (comuna) params.set("comuna", comuna);
      var qs = params.toString();
      window.location.href = "propiedades.html" + (qs ? "?" + qs : "");
    });
  }

  /* ---------------------------------------------------------- catálogo con filtros */
  var catalog = document.querySelector("[data-catalog]");
  if (catalog) {
    var cards = Array.prototype.slice.call(catalog.querySelectorAll("[data-card]"));
    var form = document.querySelector("[data-filter-form]");
    var countEl = document.querySelector("[data-result-count]");
    var emptyEl = document.querySelector("[data-empty-state]");
    var priceSelect = form.querySelector('[name="precio"]');
    var opSelect = form.querySelector('[name="operacion"]');

    var PRICE_BUCKETS = {
      venta: [
        { label: "Cualquier precio", min: 0, max: Infinity },
        { label: "Hasta UF 5.000", min: 0, max: 5000 },
        { label: "UF 5.000 – 8.000", min: 5000, max: 8000 },
        { label: "UF 8.000 – 12.000", min: 8000, max: 12000 },
        { label: "Más de UF 12.000", min: 12000, max: Infinity },
      ],
      arriendo: [
        { label: "Cualquier precio", min: 0, max: Infinity },
        { label: "Hasta $700.000", min: 0, max: 700000 },
        { label: "$700.000 – 1.000.000", min: 700000, max: 1000000 },
        { label: "Más de $1.000.000", min: 1000000, max: Infinity },
      ],
    };

    function renderPriceOptions() {
      var op = opSelect.value || "venta";
      var buckets = PRICE_BUCKETS[op];
      priceSelect.innerHTML = buckets
        .map(function (b, i) { return '<option value="' + i + '">' + b.label + "</option>"; })
        .join("");
      priceSelect.disabled = !opSelect.value;
    }

    function applyFilters() {
      var data = new FormData(form);
      var operacion = data.get("operacion") || "";
      var tipo = data.get("tipo") || "";
      var comuna = data.get("comuna") || "";
      var dormitorios = data.get("dormitorios") || "";
      var priceIdx = parseInt(data.get("precio") || "0", 10);
      var buckets = PRICE_BUCKETS[operacion || "venta"];
      var bucket = buckets[priceIdx] || buckets[0];

      var visible = 0;
      cards.forEach(function (card) {
        var ok = true;
        if (operacion && card.dataset.operation !== operacion) ok = false;
        if (tipo && card.dataset.type !== tipo) ok = false;
        if (comuna && card.dataset.comuna !== comuna) ok = false;
        if (dormitorios) {
          var beds = parseInt(card.dataset.bedrooms || "0", 10);
          if (dormitorios === "4") { if (beds < 4) ok = false; }
          else if (beds !== parseInt(dormitorios, 10)) ok = false;
        }
        if (operacion) {
          var price = parseFloat(card.dataset.price || "0");
          if (price < bucket.min || price > bucket.max) ok = false;
        }
        card.style.display = ok ? "" : "none";
        if (ok) visible++;
      });

      if (countEl) countEl.textContent = visible + (visible === 1 ? " propiedad encontrada" : " propiedades encontradas");
      if (emptyEl) emptyEl.style.display = visible === 0 ? "block" : "none";
      catalog.style.display = visible === 0 ? "none" : "grid";
    }

    opSelect.addEventListener("change", function () {
      renderPriceOptions();
      applyFilters();
    });
    form.querySelectorAll("select").forEach(function (sel) {
      if (sel !== opSelect) sel.addEventListener("change", applyFilters);
    });

    var clearBtn = document.querySelector("[data-clear-filters]");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        form.reset();
        renderPriceOptions();
        applyFilters();
      });
    }

    // Preselección desde query string (?operacion=&comuna=)
    var qs = new URLSearchParams(window.location.search);
    if (qs.get("operacion")) form.querySelector('[name="operacion"]').value = qs.get("operacion");
    if (qs.get("comuna")) form.querySelector('[name="comuna"]').value = qs.get("comuna");

    renderPriceOptions();
    applyFilters();
  }

  /* ---------------------------------------------------------- formularios -> WhatsApp */
  document.querySelectorAll("[data-wa-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="nombre"]');
      var contact = form.querySelector('[name="contacto"]');
      var errors = form.querySelectorAll(".field-error");
      errors.forEach(function (el) { el.remove(); });

      var valid = true;
      if (name && name.value.trim().length <= 1) {
        valid = false;
        showError(name, "Cuéntanos tu nombre.");
      }
      if (contact && contact.value.trim().length <= 3) {
        valid = false;
        showError(contact, "Déjanos un dato de contacto.");
      }
      var opField = form.querySelector('[name="quiero"]');
      if (opField && !opField.value) {
        valid = false;
        showError(opField, "Indícanos qué necesitas.");
      }
      if (!valid) return;

      var template = form.getAttribute("data-wa-template") || "Hola, me gustaría contactar a mjn propiedades.";
      var lines = [template, ""];
      lines.push("Nombre: " + (name ? name.value : ""));
      lines.push("Contacto: " + (contact ? contact.value : ""));

      form.querySelectorAll("[data-wa-field]").forEach(function (field) {
        var val = field.value;
        if (val) lines.push(field.getAttribute("data-wa-field") + ": " + val);
      });
      var msgField = form.querySelector('[name="mensaje"]');
      if (msgField && msgField.value) lines.push("", msgField.value);

      window.open(waLink(lines.filter(Boolean).join("\n")), "_blank", "noopener,noreferrer");
    });
  });

  function showError(field, text) {
    var p = document.createElement("p");
    p.className = "field-error";
    p.textContent = text;
    field.insertAdjacentElement("afterend", p);
  }

  /* ---------------------------------------------------------- compartir ficha */
  var shareBtn = document.querySelector("[data-share]");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var title = shareBtn.getAttribute("data-title") || document.title;
      var url = window.location.href;
      var text = "Mira esta propiedad en mjn propiedades: " + title + " " + url;
      if (navigator.share) {
        navigator.share({ title: title, text: text, url: url }).catch(function () {});
      } else {
        window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
      }
    });
  }

  /* ---------------------------------------------------------- parallax sutil del hero */
  var blob = document.querySelector("[data-hero-blob]");
  if (blob) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      blob.style.transform = "translate3d(0," + y * 0.15 + "px,0)";
    }, { passive: true });
  }
})();
