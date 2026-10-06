/* =========================================================
   MOTO GUARDIA — CLEAN MAIN.JS
========================================================= */

/* =========================
   HERO VIDEO
========================= */

const heroVideo = document.querySelector(".hero__video");

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  heroVideo.play().catch(() => {});
}

/* =========================
   HEADER
========================= */

const header = document.querySelector(".header");

function updateHeader() {
  if (!header) return;

  header.classList.toggle("is-scrolled", window.scrollY > 30);
}

updateHeader();

window.addEventListener("scroll", updateHeader, { passive: true });

/* =========================
   MOBILE MENU
========================= */

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      nav.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

/* =========================================================
   DIRECTIONS — HOVER DESCRIPTIONS
========================================================= */

const directionDescriptions = [
  "Отрабатываем управление на грунте, песке, колее, подъёмах и спусках. Развиваем баланс, контроль тяги и уверенное управление на нестабильном покрытии.",

  "Тренируем движение в плотном потоке, маневрирование, выбор безопасной траектории и дистанции. Учимся быстро оценивать дорожную обстановку и уверенно действовать в реальных городских условиях.",

  "Отрабатываем экстренное торможение, объезд препятствий и стабилизацию мотоцикла. Разбираем действия при резком изменении обстановки и учимся сохранять контроль в критических ситуациях.",

  "Готовим инструкторов по системе Tactical Ride: методика проведения занятий, постановка упражнений, контроль техники, разбор ошибок и безопасная работа с группой.",
];

document.querySelectorAll(".direction-card").forEach((card, index) => {
  card
    .querySelectorAll(".direction-card__extra, .direction-hover-description")
    .forEach((el) => el.remove());

  if (!directionDescriptions[index]) return;

  const description = document.createElement("div");

  description.className = "direction-hover-description";

  description.textContent = directionDescriptions[index];

  card.appendChild(description);
});

/* =========================================================
   CONTACT TEXT
   FIXED CENTERED LINES + REVERSIBLE SCROLL REVEAL
========================================================= */

const contactText = document.querySelector(".contacts p");

if (contactText) {
  const lines = [
    "Легион Мото Гвардия создан для тех,",

    "кто стремится стать мастером управления",

    "мотоциклом, получить доступ к элитной сети",

    "единомышленников и быть готовым к любым",

    "вызовам современного мира.",
  ];

  /* Полностью удаляем старую структуру */
  contactText.innerHTML = "";

  lines.forEach((lineText) => {
    const line = document.createElement("span");

    line.className = "final-reveal-line";

    [...lineText].forEach((character) => {
      const char = document.createElement("span");

      if (character === " ") {
        char.className = "final-reveal-char final-reveal-space";

        char.innerHTML = "&nbsp;";
      } else {
        char.className = "final-reveal-char";

        char.textContent = character;
      }

      line.appendChild(char);
    });

    contactText.appendChild(line);
  });

  const chars = [...contactText.querySelectorAll(".final-reveal-char")];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mixColor(start, end, amount) {
    const r = Math.round(start[0] + (end[0] - start[0]) * amount);

    const g = Math.round(start[1] + (end[1] - start[1]) * amount);

    const b = Math.round(start[2] + (end[2] - start[2]) * amount);

    return `rgb(${r}, ${g}, ${b})`;
  }

  const pale = [68, 71, 68];
  const white = [244, 244, 239];

  function updateTextReveal() {
    const rect = contactText.getBoundingClientRect();

    const viewport = window.innerHeight;

    /*
          Внизу — бледный.
          При скролле вниз → белый.
          Назад вверх → снова бледный.
        */

    const start = viewport * 0.9;

    const finish = viewport * 0.22;

    const progress = clamp((start - rect.top) / (start - finish), 0, 1);

    chars.forEach((char) => {
      if (char.classList.contains("final-reveal-space")) return;

      const charRect = char.getBoundingClientRect();

      const x = clamp(
        (charRect.left - rect.left) / Math.max(rect.width, 1),
        0,
        1,
      );

      const y = clamp(
        (charRect.top - rect.top) / Math.max(rect.height, 1),
        0,
        1,
      );

      /*
              Диагональ:
              левый верх → правый низ
            */

      const threshold = x * 0.43 + y * 0.72;

      const localProgress = clamp(
        (progress * 1.45 - threshold + 0.05) / 0.2,
        0,
        1,
      );

      char.style.color = mixColor(pale, white, localProgress);
    });
  }

  let revealFrame = null;

  function requestRevealUpdate() {
    if (revealFrame) return;

    revealFrame = requestAnimationFrame(() => {
      updateTextReveal();

      revealFrame = null;
    });
  }

  updateTextReveal();

  window.addEventListener("scroll", requestRevealUpdate, { passive: true });

  window.addEventListener("resize", requestRevealUpdate);
}

/* =========================================================
   GLOBAL RUSSIAN TYPOGRAPHY
   Убираем висячие предлоги и короткие союзы по всему сайту
========================================================= */

(function () {
  const shortWords = [
    "в",
    "во",
    "и",
    "а",
    "но",
    "к",
    "ко",
    "с",
    "со",
    "у",
    "о",
    "об",
    "обо",
    "от",
    "до",
    "за",
    "из",
    "изо",
    "на",
    "над",
    "по",
    "под",
    "при",
    "про",
    "для",
    "без",
    "через",
    "между",
  ];

  const pattern = new RegExp(`(^|\\s)(${shortWords.join("|")})\\s+`, "giu");

  function processTextNode(node) {
    let value = node.nodeValue;

    if (!value || !value.trim()) return;

    value = value.replace(
      pattern,
      (match, before, word) => `${before}${word}\u00A0`,
    );

    node.nodeValue = value;
  }

  function fixTypography(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;

        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent.closest("script, style, textarea, input, code, pre")) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(processTextNode);
  }

  function runTypographyFix() {
    fixTypography(document.body);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runTypographyFix);
  } else {
    runTypographyFix();
  }

  /*
       Важно:
       часть текста на сайте создаётся динамически JS
       (например hover-описания).
       Поэтому запускаем типографику ещё раз после сборки.
    */

  setTimeout(runTypographyFix, 50);
  setTimeout(runTypographyFix, 300);

  /*
       Если позже DOM меняется —
       автоматически исправляем новые тексты.
    */

  const observer = new MutationObserver(() => {
    clearTimeout(window.__motoguardiaTypographyTimer);

    window.__motoguardiaTypographyTimer = setTimeout(runTypographyFix, 20);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

// === SCROLL REVEAL MOTOGUARDIA V1 ===

document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) return;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -7% 0px",
    },
  );

  revealItems.forEach((item) => {
    observer.observe(item);
  });
});

// === BIDIRECTIONAL SCROLL REVEAL V3 ===

document.addEventListener("DOMContentLoaded", () => {
  /*
   * Автоматически добавляем reveal-анимации
   * старым блокам сайта.
   */

  const addReveal = (selector, animationClass = "reveal--up") => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("reveal", animationClass);
    });
  };

  /* ---------------------------------------------
       Заголовки разделов
    --------------------------------------------- */

  addReveal(".principles .section-label, .principles h2", "reveal--up");

  addReveal(
    ".training-system .section-label, .training-system h2, .system .section-label, .system h2",
    "reveal--up",
  );

  addReveal(".directions .section-label, .directions h2", "reveal--up");

  addReveal(".education .section-label, .education h2", "reveal--up");

  /* ---------------------------------------------
       Принципы
    --------------------------------------------- */

  addReveal(
    ".principles .principle-card, .principles__card, .principles .card",
    "reveal--soft",
  );

  /* ---------------------------------------------
       Что входит в систему
    --------------------------------------------- */

  addReveal(
    ".training-system .system-card, .system .system-card, .training-system .card",
    "reveal--up",
  );

  /* ---------------------------------------------
       Направления
    --------------------------------------------- */

  addReveal(
    ".directions .direction-card, .directions .training-card",
    "reveal--soft",
  );

  /* ---------------------------------------------
       Как проходит обучение
    --------------------------------------------- */

  addReveal(".education__step", "reveal--left");

  addReveal(".education__photo", "reveal--right");

  /*
   * Никакого unobserve().
   *
   * Поэтому:
   * - вниз → появляется;
   * - вышел из viewport → снова становится скрытым;
   * - идём обратно вверх → появляется повторно.
   */

  const revealItems = document.querySelectorAll(".reveal");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((el) => {
      el.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          /*
           * Снимаем класс, когда элемент полностью
           * вышел из зоны.
           *
           * Поэтому обратный скролл тоже
           * запускает анимацию.
           */
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.12,

      /*
       * Анимация начинается не у самого края,
       * а когда блок немного вошёл в экран.
       */
      rootMargin: "-3% 0px -8% 0px",
    },
  );

  revealItems.forEach((el) => {
    observer.observe(el);
  });
});

// === PRINCIPLES CARDS OBSERVER V4 ===

document.addEventListener("DOMContentLoaded", () => {
  /*
   * Заголовки НЕ трогаем.
   * Только карточки принципов.
   */

  const cards = document.querySelectorAll(
    ".principles .principle-card, " +
      ".principles .principles__card, " +
      ".principles .card",
  );

  if (!cards.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cards.forEach((card) => {
      card.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          /*
           * Убираем класс после ухода из viewport.
           * Поэтому при скролле обратно вверх
           * анимация повторяется.
           */
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "-2% 0px -8% 0px",
    },
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
});

/* =========================================================
   FINAL SCROLL ANIMATION GUARD
   заголовки всегда статичны
========================================================= */

function lockStaticHeadings() {
  const staticElements = document.querySelectorAll(`
        .section-label,
        .about-center__label,
        .eyebrow,
        .kicker,
        section h1,
        section h2
    `);

  staticElements.forEach((el) => {
    el.classList.remove(
      "reveal",
      "visible",
      "is-visible",
      "active",
      "animate",
      "animate-title",
      "scroll-title",
      "reveal-title",
    );

    el.style.setProperty("opacity", "1", "important");
    el.style.setProperty("visibility", "visible", "important");
    el.style.setProperty("transform", "none", "important");
    el.style.setProperty("translate", "none", "important");
    el.style.setProperty("animation", "none", "important");
    el.style.setProperty("transition", "none", "important");
  });
}

lockStaticHeadings();

window.addEventListener("load", lockStaticHeadings);
window.addEventListener("resize", lockStaticHeadings);



/* =========================================================
   FINAL SCROLL MOTION — PRINCIPLES + MANIFESTO
========================================================= */

(() => {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let raf = 0;

  const principles = document.querySelector('#principles');
  const principleCards = principles ? [...principles.querySelectorAll('.principle')] : [];

  const manifesto = document.querySelector('#manifesto');
  const manifestoText = manifesto?.querySelector('.manifesto-final__text');
  let manifestoChars = [];

  if (manifestoText) {
    const lines = [...manifestoText.querySelectorAll('.manifesto-final__line')];
    lines.forEach((line) => {
      if (line.dataset.split === '1') return;
      const value = line.textContent;
      line.textContent = '';
      [...value].forEach((char) => {
        const span = document.createElement('span');
        span.className = char === ' ' ? 'manifesto-final__char manifesto-final__space' : 'manifesto-final__char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        line.appendChild(span);
      });
      line.dataset.split = '1';
    });
    manifestoChars = [...manifestoText.querySelectorAll('.manifesto-final__char:not(.manifesto-final__space)')];
  }

  function updatePrinciples() {
    if (!principles || principleCards.length < 6) return;

    const rect = principles.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // 0 when section starts entering from bottom; 1 by the time title/cards are comfortably in view.
    /*
       Стартуем ПОЗЖЕ:
       только когда секция уже заметно вошла в экран.

       И растягиваем движение почти до верхней части viewport,
       чтобы анимация не успевала закончиться за полсекунды.
    */
    const progress = clamp((vh * 0.72 - rect.top) / (vh * 0.60), 0, 1);

    /* мягкий smoothstep — без резкого старта и финиша */
    const eased = progress * progress * (3 - 2 * progress);
    const distance = window.innerWidth <= 600 ? 52 : 118;

    principleCards.forEach((card, index) => {
      const direction = index < 3 ? -1 : 1;
      const x = direction * distance * (1 - eased);
      card.style.setProperty('transform', `translate3d(${x}px,0,0)`, 'important');
      card.style.setProperty('opacity', String(0.22 + 0.78 * eased), 'important');
      card.style.setProperty('transition', 'none', 'important');
      card.style.setProperty('animation', 'none', 'important');
    });
  }

  function updateManifesto() {
    if (!manifesto || !manifestoText || !manifestoChars.length) return;

    const sectionRect = manifesto.getBoundingClientRect();
    const textRect = manifestoText.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    /*
       Manifesto тоже начинается позже и идёт медленнее.
       Белая диагональ проходит через текст постепенно,
       пока блок движется через основную часть экрана.
    */
    const progress = clamp((vh * 0.72 - sectionRect.top) / (vh * 0.62), 0, 1);

    manifestoChars.forEach((char) => {
      const r = char.getBoundingClientRect();
      const x = clamp((r.left - textRect.left) / Math.max(textRect.width, 1), 0, 1);
      const y = clamp((r.top - textRect.top) / Math.max(textRect.height, 1), 0, 1);
      // Diagonal threshold: top-left lights first, bottom-right last.
      const threshold = x * 0.46 + y * 0.54;
      const local = clamp((progress * 1.12 - threshold + 0.03) / 0.28, 0, 1);
      const pale = [82, 84, 80];
      const white = [242, 241, 235];
      const rgb = pale.map((c, i) => Math.round(c + (white[i] - c) * local));
      char.style.setProperty('color', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, 'important');
      char.style.setProperty('-webkit-text-fill-color', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, 'important');
    });
  }

  function update() {
    raf = 0;
    updatePrinciples();
    updateManifesto();
  }

  function requestUpdate() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);
  document.addEventListener('DOMContentLoaded', requestUpdate);
  requestUpdate();
})();


/* =========================================================
   MANIFESTO — TRUE DIAGONAL SCROLL REVEAL
   top-left -> bottom-right
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector("#manifesto");
    const text = section?.querySelector(".manifesto-final__text");

    if (!section || !text) return;

    /*
       Защита от повторного запуска.
    */
    if (text.dataset.diagonalReady === "1") return;

    text.dataset.diagonalReady = "1";


    const lines = [
        ...text.querySelectorAll(".manifesto-final__line")
    ];


    /*
       Пересобираем каждую строку посимвольно.
       Именно это позволяет получить настоящую диагональ,
       а не просто fade целой строки.
    */
    lines.forEach(line => {

        const raw = line.textContent;

        line.innerHTML = "";

        [...raw].forEach(char => {

            const span = document.createElement("span");

            span.className =
                char === " "
                    ? "manifesto-diag-char is-space"
                    : "manifesto-diag-char";

            span.innerHTML =
                char === " "
                    ? "&nbsp;"
                    : char;

            line.appendChild(span);

        });

    });


    const chars = [
        ...text.querySelectorAll(
            ".manifesto-diag-char:not(.is-space)"
        )
    ];


    if (!chars.length) return;


    const clamp = (n, min, max) =>
        Math.max(min, Math.min(max, n));


    const smoothstep = t => {
        t = clamp(t, 0, 1);

        return t * t * (3 - 2 * t);
    };


    /*
       Для каждого символа вычисляем положение
       по диагонали внутри всего текстового блока.
    */
    function calculateDiagonalPositions() {

        const textRect = text.getBoundingClientRect();

        chars.forEach(char => {

            const r = char.getBoundingClientRect();

            const x =
                (
                    r.left +
                    r.width / 2 -
                    textRect.left
                ) / Math.max(textRect.width, 1);

            const y =
                (
                    r.top +
                    r.height / 2 -
                    textRect.top
                ) / Math.max(textRect.height, 1);


            /*
               0 = левый верх
               1 = правый низ
            */
            char.dataset.diag =
                clamp((x + y) / 2, 0, 1);

        });

    }


    function updateManifesto() {

        const rect = text.getBoundingClientRect();
        const vh = window.innerHeight;


        /*
           СТАРТ:
           только когда сам текст уже реально
           входит в экран снизу.

           То есть логотип может быть виден,
           а текст всё ещё остаётся бледным.
        */
        const startTop = vh * 0.88;


        /*
           ФИНИШ:
           когда почти весь текст прошёл
           значительную часть viewport.

           Поэтому анимация длинная,
           реально привязанная к скроллу.
        */
        const finishTop =
            vh * 0.18 - rect.height * 0.45;


        const progress = clamp(
            (startTop - rect.top) /
            (startTop - finishTop),
            0,
            1
        );


        chars.forEach(char => {

            const diagonal =
                Number(char.dataset.diag || 0);


            /*
               Чем дальше символ расположен
               вправо-вниз, тем позже он белеет.

               Ширина 0.28 делает границу мягкой,
               но при этом диагональ хорошо читается.
            */
            const local = smoothstep(
                (progress - diagonal + 0.10) / 0.28
            );


            const alpha =
                0.16 + local * 0.84;


            char.style.color =
                `rgba(242, 241, 235, ${alpha})`;

        });

    }


    let raf = null;


    function requestUpdate() {

        if (raf) return;

        raf = requestAnimationFrame(() => {

            updateManifesto();

            raf = null;

        });

    }


    calculateDiagonalPositions();
    updateManifesto();


    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        () => {

            calculateDiagonalPositions();

            requestUpdate();

        }
    );

});



/* === MOBILE DIRECTION TAP FIX START === */

document.addEventListener("DOMContentLoaded", () => {

    const cards = Array.from(
        document.querySelectorAll(".direction-card")
    );

    if (!cards.length) return;

    const isMobile = () =>
        window.matchMedia("(max-width: 820px), (hover: none)").matches;

    cards.forEach((card) => {

        card.addEventListener("click", (event) => {

            if (!isMobile()) return;

            const wasOpen = card.classList.contains("mobile-open");

            cards.forEach((otherCard) => {
                otherCard.classList.remove("mobile-open");
            });

            if (!wasOpen) {
                card.classList.add("mobile-open");
            }

            event.stopPropagation();
        });

    });

    document.addEventListener("click", (event) => {

        if (!isMobile()) return;

        if (!event.target.closest(".direction-card")) {
            cards.forEach((card) => {
                card.classList.remove("mobile-open");
            });
        }

    });

    window.addEventListener("resize", () => {

        if (!isMobile()) {
            cards.forEach((card) => {
                card.classList.remove("mobile-open");
            });
        }

    });

});

/* === MOBILE DIRECTION TAP FIX END === */

