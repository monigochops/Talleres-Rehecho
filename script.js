// script.js
(() => {
  // ====== EDITA AQUÍ LOS DATOS DEL NEGOCIO ======
  const BUSINESS = {
    name: "Talleres Rehecho",
    cityLine: "Medellín (Badajoz)",
    phoneDisplay: "+34 689 375 068",
    phoneE164: "+34689375068",
    address: "C. Cuadrante, 27, 06411 Medellín, Badajoz",
    hours: "Consultar (confírmalo con el taller)",
    rating: "4,7",
    reviews: "31",
    mapsLink: "https://www.google.com/maps?q=C.+Cuadrante,+27,+06411+Medell%C3%ADn,+Badajoz",
    mapsEmbed: "https://www.google.com/maps?q=C.+Cuadrante,+27,+06411+Medell%C3%ADn,+Badajoz&output=embed",
    whatsappE164: "34689375068",
    reviewsLink: "https://www.google.com/maps/search/?api=1&query=C.+Cuadrante,+27,+06411+Medell%C3%ADn,+Badajoz",

    // Reseñas (cortas) que se muestran en la web.
    // ✅ Puedes reemplazarlas por reseñas reales (frases cortas) si el cliente te las autoriza.
    reviewSnippets: [
      { stars: 5, text: "Diagnóstico rápido y trato profesional. Me atendieron sin rodeos.", who: "Cliente" },
      { stars: 5, text: "Taller serio. Comunicación clara y trabajo bien hecho.", who: "Reseña" },
      { stars: 5, text: "Rápidos y atentos. Volveré para mantenimiento.", who: "Cliente habitual" },
    ]
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // ====== Pinta datos en la UI ======
  $("#brandName").textContent = BUSINESS.name;
  $("#footerName").textContent = BUSINESS.name;
  $("#copyName").textContent = BUSINESS.name;

  $("#brandTag").textContent = `Taller mecánico • ${BUSINESS.cityLine}`;
  $("#chipLocation").textContent = `📍 ${BUSINESS.cityLine}`;
  $("#chipHours").textContent = `⏱️ Horario: ${BUSINESS.hours || "consultar"}`;

  $("#kpiRating").textContent = BUSINESS.rating;
  $("#kpiReviews").textContent = `+${BUSINESS.reviews}`;
  $("#statRating").textContent = `${BUSINESS.rating}/5`;
  $("#statReviews").textContent = BUSINESS.reviews;

  $("#contactPhone").textContent = BUSINESS.phoneDisplay;
  $("#contactPhone").href = `tel:${BUSINESS.phoneE164}`;
  $("#contactAddress").textContent = BUSINESS.address;
  $("#contactHours").textContent = BUSINESS.hours;

  const phoneLinks = ["#topPhone","#navPhone","#heroPhone","#whyPhone","#contactCtaPhone","#finalPhone","#floatCall"]
    .map(sel => $(sel))
    .filter(Boolean);
  phoneLinks.forEach(a => a.href = `tel:${BUSINESS.phoneE164}`);

  const mapLinks = ["#topMaps","#heroMaps","#contactCtaMaps","#finalMaps","#floatMap"]
    .map(sel => $(sel))
    .filter(Boolean);
  mapLinks.forEach(a => a.href = BUSINESS.mapsLink);

  const waLink = `https://wa.me/${BUSINESS.whatsappE164}`;
  $("#waQuick").href = `${waLink}?text=${encodeURIComponent(`Hola, soy _____. Quería pedir cita en ${BUSINESS.name}. ¿Tenéis hueco?`)}`;
  $("#floatWa").href = `${waLink}?text=${encodeURIComponent(`Hola, quería pedir cita en ${BUSINESS.name}.`)}`;

  $("#reviewsLink").href = BUSINESS.reviewsLink;
  $("#mapFrame").src = BUSINESS.mapsEmbed;

  $("#year").textContent = new Date().getFullYear();

  // ====== Header shadow on scroll ======
  const header = $("#header");
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ====== Menú móvil ======
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("#navMenu a.nav__link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ====== FAQ acordeón ======
  $$(".faq__item").forEach(btn => {
    btn.addEventListener("click", () => {
      const open = btn.classList.toggle("is-open");
      $$(".faq__item").forEach(b => { if (b !== btn) b.classList.remove("is-open"); });
      if (!open) btn.classList.remove("is-open");
    });
  });

  // ====== Form => WhatsApp ======
  const leadForm = $("#leadForm");
  leadForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(leadForm);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const service = String(fd.get("service") || "").trim();
    const msg = String(fd.get("message") || "").trim();

    const text = [
      `Hola, soy ${name}.`,
      `Mi teléfono es: ${phone}.`,
      `Quería pedir cita para: ${service}.`,
      msg ? `Mensaje: ${msg}` : "",
      `Gracias.`
    ].filter(Boolean).join("\n");

    window.open(`${waLink}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  // ====== Reviews render ======
  const reviewsGrid = $("#reviewsGrid");
  if (reviewsGrid) {
    reviewsGrid.innerHTML = BUSINESS.reviewSnippets.map(r => {
      const stars = "★".repeat(Math.max(1, Math.min(5, r.stars || 5)));
      const safeText = escapeHtml(String(r.text || ""));
      const who = escapeHtml(String(r.who || "Cliente"));
      return `
        <article class="quote reveal">
          <div class="quote__stars" aria-label="${stars.length} estrellas">${stars}</div>
          <p>“${safeText}”</p>
          <div class="quote__who">${who}</div>
        </article>
      `;
    }).join("");
  }

  // ====== Animaciones suaves on-scroll (IntersectionObserver) ======
  const els = $$(".reveal");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add("in");
    }
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));

  // ====== JSON-LD SEO local básico ======
  const ld = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": BUSINESS.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS.address,
      "addressLocality": "Medellín",
      "addressRegion": "Extremadura",
      "postalCode": "06411",
      "addressCountry": "ES"
    },
    "telephone": BUSINESS.phoneDisplay,
    "url": window.location.href,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": BUSINESS.rating.replace(",", "."),
      "reviewCount": BUSINESS.reviews
    }
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);

  function escapeHtml(str){
    return str
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

// ====== Parallax PRO del fondo (suave y barato) ======
// Mueve ligeramente el fondo según el scroll. Respeta reduce-motion.
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function updateParallax(){
  if (reduceMotion) return;
  const y = window.scrollY || 0;
  // 0.06 = muy sutil (no marea)
  const offset = Math.round(y * -0.06);
  document.documentElement.style.setProperty("--bgY", String(offset));
}
updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });



// ===== Lightbox ULTRA (teclado, swipe, zoom, precarga, animación desde miniatura) =====
(function initLightboxUltra(){
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbStage = document.getElementById("lbStage");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbCaption = document.getElementById("lbCaption");
  const lbCount = document.getElementById("lbCount");
  const lbSpinner = document.getElementById("lbSpinner");

  const galleryImgs = Array.from(document.querySelectorAll("#galeria .gallery img, #galeria .gItem img, .gallery img, .gItem img"));

  // Si no existe el lightbox o no hay imágenes, salimos sin romper nada.
  if (!lb || !lbImg || !lbStage || !galleryImgs.length) return;

  let lbIndex = 0;

  // zoom/pan
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let drag = false;
  let startX = 0;
  let startY = 0;

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function applyTransform(){
    lbImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;
    lb.classList.toggle("is-zoom", scale > 1.01);
  }
  function resetZoom(){
    scale = 1; panX = 0; panY = 0;
    applyTransform();
  }

  function setLoading(isLoading){
    lb.classList.toggle("is-loading", !!isLoading);
    lb.classList.toggle("is-ready", !isLoading);
    if (lbSpinner) lbSpinner.setAttribute("aria-hidden", String(!isLoading));
    lbImg.style.opacity = isLoading ? "0" : "";
  }

  function preload(idx){
    const i = (idx + galleryImgs.length) % galleryImgs.length;
    const src = galleryImgs[i]?.getAttribute("src");
    if (!src) return;
    const im = new Image();
    im.decoding = "async";
    im.src = src;
  }

  function openLightbox(i, fromEl){
    lbIndex = (i + galleryImgs.length) % galleryImgs.length;
    const img = galleryImgs[lbIndex];

    // origen de animación (desde la miniatura)
    if (fromEl instanceof Element){
      const r = fromEl.getBoundingClientRect();
      const ox = ((r.left + r.width/2) / window.innerWidth) * 100;
      const oy = ((r.top + r.height/2) / window.innerHeight) * 100;
      lb.style.setProperty("--lb-ox", `${ox}%`);
      lb.style.setProperty("--lb-oy", `${oy}%`);
    } else {
      lb.style.setProperty("--lb-ox", `50%`);
      lb.style.setProperty("--lb-oy", `50%`);
    }

    // Cargar imagen
    setLoading(true);
    lbImg.src = img.getAttribute("src") || "";
    lbImg.alt = img.getAttribute("alt") || "Imagen ampliada";
    if (lbCaption) lbCaption.textContent = img.getAttribute("alt") || "";
    if (lbCount) lbCount.textContent = `${lbIndex + 1} / ${galleryImgs.length}`;

    resetZoom();

    lb.classList.add("is-open", "is-opening");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Esperar a que cargue la imagen para mostrar
    const done = () => {
      setLoading(false);
      // quitar opening tras animación
      window.setTimeout(() => lb.classList.remove("is-opening"), 360);
      // precarga siguiente/anterior
      preload(lbIndex + 1);
      preload(lbIndex - 1);
    };

    if (lbImg.complete && lbImg.naturalWidth > 0) done();
    else lbImg.onload = done;
    lbImg.onerror = () => setLoading(false);

    // foco accesible
    if (lbClose) lbClose.focus({ preventScroll: true });
    else lb.focus({ preventScroll: true });
  }

  function closeLightbox(){
    lb.classList.remove("is-open","is-opening","is-zoom");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetZoom();
  }

  function goNext(){ openLightbox(lbIndex + 1); }
  function goPrev(){ openLightbox(lbIndex - 1); }

  // Abrir con click
  galleryImgs.forEach((img, i) => {
    img.setAttribute("tabindex", "0");
    img.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(i, img);
    });
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i, img);
      }
    });
  });

  // Cerrar con botones / backdrop
  lbClose?.addEventListener("click", (e) => { e.preventDefault(); closeLightbox(); });
  lb.querySelectorAll("[data-lb-close]").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); closeLightbox(); }));

  lbNext?.addEventListener("click", (e) => { e.preventDefault(); goNext(); });
  lbPrev?.addEventListener("click", (e) => { e.preventDefault(); goPrev(); });

  // Teclado
  window.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  });

  // Zoom con rueda
  lbStage.addEventListener("wheel", (e) => {
    if (!lb.classList.contains("is-open")) return;
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.12;
    const next = clamp(scale + delta, 1, 3);
    scale = next;
    if (scale <= 1.01) { scale = 1; panX = 0; panY = 0; }
    applyTransform();
  }, { passive: false });

  // Doble click: toggle zoom
  lbImg.addEventListener("dblclick", (e) => {
    e.preventDefault();
    if (scale <= 1.01) scale = 2;
    else resetZoom();
    applyTransform();
  });

  // Drag cuando hay zoom
  lbImg.addEventListener("pointerdown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (scale <= 1.01) return;
    drag = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    lbImg.setPointerCapture?.(e.pointerId);
  });

  lbImg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    panX = clamp(panX, -650, 650);
    panY = clamp(panY, -450, 450);
    applyTransform();
  });

  lbImg.addEventListener("pointerup", () => { drag = false; });
  lbImg.addEventListener("pointercancel", () => { drag = false; });

  // Swipe móvil (solo si no hay zoom)
  let tX = 0, tY = 0, touching = false;
  lbStage.addEventListener("pointerdown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.pointerType !== "touch") return;
    touching = true;
    tX = e.clientX; tY = e.clientY;
  });
  lbStage.addEventListener("pointerup", (e) => {
    if (!touching) return;
    touching = false;
    const dx = e.clientX - tX;
    const dy = e.clientY - tY;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 80 && scale <= 1.01) {
      if (dx < 0) goNext();
      else goPrev();
    }
  });
})();

})();
