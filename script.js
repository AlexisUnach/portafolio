const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Spotlight que sigue al cursor ---------- */
if (!prefersReducedMotion) {
  const root = document.documentElement;
  window.addEventListener("pointermove", (e) => {
    root.style.setProperty("--mx", `${e.clientX}px`);
    root.style.setProperty("--my", `${e.clientY}px`);
  });
}

/* ---------- Efecto de máquina de escribir ---------- */
const phrases = [
  "desarrollo web",
  "soporte de infraestructura",
  "bases de datos",
  "ingeniería de software",
];

const typedEl = document.getElementById("typed");

if (typedEl) {
  if (prefersReducedMotion) {
    typedEl.textContent = phrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const TYPE_SPEED = 65;
    const DELETE_SPEED = 35;
    const HOLD_TIME = 1800;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    tick();
  }
}

/* ---------- Carrusel de proyectos ---------- */
/* Sin autoplay: el carrusel solo avanza cuando el usuario hace click
   en las flechas o en un punto de navegación. */
const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("carouselDots");

if (track && prevBtn && nextBtn && dotsWrap) {
  const slides = Array.from(track.children);
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir al proyecto ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  render();
}

/* ---------- Revelado de secciones al hacer scroll ---------- */
const blocks = document.querySelectorAll(".block");

if ("IntersectionObserver" in window && blocks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  blocks.forEach((block) => observer.observe(block));
} else {
  blocks.forEach((block) => block.classList.add("in-view"));
}

/* ---------- Resalta el enlace de navegación activo ---------- */
const sections = document.querySelectorAll(".block, .hero");
const navLinks = document.querySelectorAll(".nav a");

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((section) => {
    if (section.id) navObserver.observe(section);
  });
}