
/* scripts.js
   - Todo oculto al inicio. Al pickear (izquierda/derecha) aparece la tarjeta.
   - Sonido en el picker con toggle (🔊).
   - Recuerda tema y selección por lado en localStorage.
*/
(function () {
  const body = document.body;
  const themeBtn = document.querySelector(".theme-toggle");
  const soundCheckbox = document.getElementById("soundEnabled");
  const pickSound = document.getElementById("pickSound");
  const removeSound = document.getElementById("removeSound");

  const themes = ["rose", "aurora", "midnight", "christmas", "newyear", "valentine", "spring", "summer", "autumn", "winter", "halloween", "galaxy", "easter", "dawn"];

  // ===== Tema con memoria =====
  const savedTheme = localStorage.getItem("scene.theme");
  if (savedTheme && themes.includes(savedTheme)) {
    body.setAttribute("data-theme", savedTheme);
    if (themeBtn) themeBtn.title = `Tema: ${savedTheme}`;
  } else {
    if (themeBtn) themeBtn.title = `Tema: ${body.getAttribute("data-theme") || themes[0]}`;
  }
  themeBtn?.addEventListener("click", () => {
    const current = body.getAttribute("data-theme") || themes[0];
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    body.setAttribute("data-theme", next);
    themeBtn.title = `Tema: ${next}`;
    localStorage.setItem("scene.theme", next);
  });

  // ===== Toggle sonido con memoria =====
  const savedSound = localStorage.getItem("scene.sound") ?? "on";
  const soundOn = savedSound !== "off";
  if (soundCheckbox) soundCheckbox.checked = soundOn;
  soundCheckbox?.addEventListener("change", () => {
    localStorage.setItem("scene.sound", soundCheckbox.checked ? "on" : "off");
  });

  function play(soundEl) {
    const enabled = (localStorage.getItem("scene.sound") ?? "on") !== "off";
    if (!enabled || !soundEl) return;
    try {
      soundEl.currentTime = 0;
      soundEl.play().catch(() => {/* silencioso si el navegador bloquea */});
    } catch (_) {/* noop */}
  }

  // ===== Personajes =====
  const CHARACTERS = {
    mochi:     { src: "mochi.gif",             alt: "Mochi — gato melocotón animado",          label: "Mochi",      thumb: "mochi.gif" },
    peachcat:  { src: "peachcat.gif",          alt: "Peach Cat — gato estilo goma animado",    label: "Peach Cat",  thumb: "peachcat.gif" },
    pusheen:   { src: "pusheen.gif",    alt: "Pusheen — gatito dulce",                  label: "Pusheen",    thumb: "pusheen.gif" },
    shiba:     { src: "shiba.gif",      alt: "Shiba Inu — perrito adorable",            label: "Shiba",      thumb: "shiba.gif" },
    kirby:     { src: "kirby.gif",      alt: "Kirby — héroe rosado",                    label: "Kirby",      thumb: "kirby.gif" },
    nyan:      { src: "nyan.gif",    alt: "Nyan Cat — arcoíris retro",               label: "Nyan",       thumb: "nyan.gif" },
    hellokitty:{ src: "hello kitty.gif",alt: "Hello Kitty — clásico tierno",            label: "Hello Kitty",thumb: "hello kitty.gif" },
    bear:      { src: "bear.gif",       alt: "Bear — osito adorable",                   label: "Bear",       thumb: "bear.gif" }
  };

  // ===== Thumbnails del picker =====
  const picker = document.querySelector(".character-picker");
  picker?.querySelectorAll("button[data-slot][data-char]").forEach(btn => {
    const key = btn.getAttribute("data-char");
    const def = CHARACTERS[key];
    const img = btn.querySelector(".mini-thumb");
    const labelSpan = btn.querySelector(".label");
    if (def && img) {
      img.src = def.thumb || def.src;
      img.alt = `Miniatura de ${labelSpan ? labelSpan.textContent : key}`;
      img.loading = "lazy";
      img.decoding = "async";
    }
  });

  // ===== Todo oculto al inicio =====
  const leftCard  = document.querySelector(".img-left");
  const rightCard = document.querySelector(".img-right");
  leftCard?.classList.add("hidden");
  rightCard?.classList.add("hidden");

  const gallery = document.querySelector(".images-gallery");
  gallery?.classList.add("hidden"); // si quieres visible, quita esta línea

  // ===== Mostrar si hay memoria =====
  const savedLeftKey  = localStorage.getItem("scene.left.char");
  const savedRightKey = localStorage.getItem("scene.right.char");
  if (savedLeftKey && CHARACTERS[savedLeftKey])  { revealAndApply("left", savedLeftKey);  markActiveButton("left", savedLeftKey); }
  if (savedRightKey && CHARACTERS[savedRightKey]) { revealAndApply("right", savedRightKey); markActiveButton("right", savedRightKey); }

  // ===== Click en picker con sonido =====
  picker?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-slot][data-char]");
    if (!btn) return;
    const slot = btn.getAttribute("data-slot"); // "left" | "right"
    const key  = btn.getAttribute("data-char");
    revealAndApply(slot, key);
    markActiveButton(slot, key);

    // Sonido de pick
    play(pickSound);
  });

  // ===== Funciones =====
  function revealAndApply(slot, key) {
    const def = CHARACTERS[key];
    if (!def) return;

    const cardSelector = slot === "left" ? ".img-left" : ".img-right";
    const card = document.querySelector(cardSelector);
    if (!card) return;

    // Mostrar la tarjeta si está oculta
    card.classList.remove("hidden");
    card.setAttribute("aria-hidden", "false");

    // Actualizar imagen y etiqueta
    const targetImg = card.querySelector(".scene-img");
    const targetLabel = card.querySelector(".img-label");
    if (targetImg) { targetImg.src = def.src; targetImg.alt = def.alt; }
    if (targetLabel) { targetLabel.textContent = def.label || key; }

    // Memorizar
    localStorage.setItem(`scene.${slot}.char`, key);
  }

  function markActiveButton(slot, key) {
    const groupSelector = `.picker-buttons button[data-slot="${slot}"]`;
    picker?.querySelectorAll(groupSelector).forEach(b => b.classList.remove("active"));
    picker?.querySelector(`button[data-slot="${slot}"][data-char="${key}"]`)?.classList.add("active");
  }
}());
