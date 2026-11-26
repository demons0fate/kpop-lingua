/* ====== ЖИВАЯ СТУДИЯ: 50 УРОВНЕЙ, 4 ГЕРОЯ, ЭПИЗОДЫ ====== */
(function () {
  /* 4 героя студии: картинки из img/chars с мягкой 2D-заглушкой. */
  const HEROES = [
    { id: "mina", name: "Мина", role: "Лидер",   img: "img/chars/mina.webp", grad: "linear-gradient(135deg,#ff8fbd,#a855f7)", color: "#ff8fbd" },
    { id: "kai",  name: "Кай",  role: "Продюсер", img: "img/chars/kai.webp",  grad: "linear-gradient(135deg,#7dd3fc,#2563eb)", color: "#7dd3fc" },
    { id: "sora", name: "Сора", role: "Вокал",    img: "img/chars/sora.webp", grad: "linear-gradient(135deg,#fcd34d,#f97316)", color: "#fcd34d" },
    { id: "yuna", name: "Юна",  role: "Макнэ",    img: "img/chars/yuna.webp", grad: "linear-gradient(135deg,#86efac,#16a34a)", color: "#86efac" }
  ];

  /* Эпохи студии: каждые 10 уровней. */
  const STUDIO_ERAS = [
    { from: 1,  to: 10, name: "Репетиционный зал",  icon: "🎧", color: "#7dd3fc" },
    { from: 11, to: 20, name: "Инди-лейбл",         icon: "🎸", color: "#c4b5fd" },
    { from: 21, to: 30, name: "Продюсерский центр", icon: "🎛️", color: "#fcd34d" },
    { from: 31, to: 40, name: "Топ-агентство Сеула", icon: "👑", color: "#fda4af" },
    { from: 41, to: 50, name: "Мировой стадион",    icon: "🌍", color: "#86efac" }
  ];
  const STUDIO_MAX_LEVEL = 50;

  /* Порог уровня L: 120*(L-1) + 25*(L-1)^2. */
  function studioLevelXp(level) {
    const n = Math.max(0, level - 1);
    return Math.round(120 * n + 25 * n * n);
  }

  function eraForLevel(level) {
    return STUDIO_ERAS.find(e => level >= e.from && level <= e.to) || STUDIO_ERAS[STUDIO_ERAS.length - 1];
  }

  /* Уровень студии (1–50) по накопленному XP + прогресс до следующего. */
  function getStudioLevel(xp) {
    const total = Math.max(0, Math.round(Number(xp) || 0));
    let level = 1;
    for (let L = 2; L <= STUDIO_MAX_LEVEL; L++) {
      if (total >= studioLevelXp(L)) level = L;
    }
    const base = studioLevelXp(level);
    const next = level < STUDIO_MAX_LEVEL ? studioLevelXp(level + 1) : null;
    const pct = next ? Math.min(100, Math.round(((total - base) / Math.max(1, next - base)) * 100)) : 100;
    return {
      level,
      era: eraForLevel(level),
      xp: total,
      baseXp: base,
      nextXp: next,
      toNext: next ? Math.max(0, next - total) : 0,
      pct
    };
  }
  window.getStudioLevel = getStudioLevel;


  const MONTHS = [
    { m: 0, name: "Янв", icon: "❄️", col: "#00e5ff" }, { m: 1, name: "Фев", icon: "💜", col: "#b46eff" },
    { m: 2, name: "Мар", icon: "🌸", col: "#ff7ac6" }, { m: 3, name: "Апр", icon: "🎧", col: "#00c6ff" },
    { m: 4, name: "Май", icon: "⚡", col: "#ffd700" }, { m: 5, name: "Июн", icon: "🌟", col: "#ff9f43" },
    { m: 6, name: "Июл", icon: "🌊", col: "#00d2d3" }, { m: 7, name: "Авг", icon: "🔥", col: "#ff4757" },
    { m: 8, name: "Сен", icon: "🎙️", col: "#a56eff" }, { m: 9, name: "Окт", icon: "🌙", col: "#ff6b81" },
    { m: 10, name: "Ноя", icon: "💿", col: "#00e5ff" }, { m: 11, name: "Дек", icon: "👑", col: "#ffd700" }
  ];

  const MONTH_NAMES = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  const MONTHLY_GOAL = 50;

  /* ====== НЕДЕЛЬНЫЕ ЛИГИ (5 ступеней) и награды за итог недели ======
     Это единственное место, где живёт слово «лига»: ступени еженедельного турнира на XP ⚡. */
  /* tint — акцентный цвет лиги для рамок, grad — мягкий фон шапки, short — подпись в ряду значков */
  const WEEKLY_LEAGUES = [
    { name: "Трейни",            short: "Трейни",       icon: "🎧", color: "#cd9b6a", tint: "#e8b785", promoteCoins: 150, midCoins: 40 },
    { name: "Инди",              short: "Инди",         icon: "🎸", color: "#cfd8dc", tint: "#dfe7ec", promoteCoins: 200, midCoins: 40 },
    { name: "Восходящая группа", short: "Восходящая",   icon: "💿", color: "#38bdf8", tint: "#7dd3fc", promoteCoins: 280, midCoins: 40 },
    { name: "Топ-лейбл",         short: "Топ-лейбл",    icon: "👑", color: "#fbbf24", tint: "#fcd34d", promoteCoins: 340, midCoins: 40 },
    { name: "Мировой чарт",      short: "Мировой чарт", icon: "💎", color: "#ff4b8b", tint: "#ff7aa8", promoteCoins: 400, midCoins: 40 }
  ];
  const WEEKLY_SIZE = 30;          // 30 студий в турнирной комнате
  const ZONE_PROMOTE = 7;          // места 1–7 — зона повышения
  const ZONE_DROP_FROM = 23;       // места 23–30 — зона вылета (кроме 1-й лиги)
  const STREAK_FREEZE_MAX = 2;
  const STREAK_FREEZE_PRICE = 250;

  let studioSubTab = 'group'; // 'group' (Группа) | 'quests' (Квесты)
  /* Комбо верных ответов в текущем уроке — только для дейлика «Чистый бит». */
  let lessonComboRun = 0, lessonMaxCombo = 0, comboTrackedLessonId = null;

  /* ====== СТИЛИ ====== */
  const css = document.createElement('style');
  css.textContent = `
    .nav-dot { position: absolute; top: 4px; right: 22%; width: 8px; height: 8px; border-radius: 50%; background: var(--success); border: 1.5px solid #0f0b1a; display: none; }
    .nav-dot.show { display: block; }
    .tab-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--success); margin-left: 4px; vertical-align: middle; }

    /* Шапка агентства и рамка Лиги */
    .agency-card { border-radius: 20px; padding: 14px 15px; margin-bottom: 12px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.18s ease; }
    .agency-card:active { transform: scale(0.98); }
    .agency-card.lg-bronze { background: linear-gradient(135deg, #2b1f1a, #17111a); border: 1.5px solid rgba(205,155,106,0.55); }
    .agency-card.lg-silver { background: linear-gradient(135deg, #232838, #141224); border: 1.5px solid rgba(207,216,220,0.65); box-shadow: 0 0 16px rgba(207,216,220,0.14); }
    .agency-card.lg-gold   { background: linear-gradient(135deg, #3b2c10, #1c1326); border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255,215,0,0.22); }
    .agency-card.lg-neon   { background: linear-gradient(135deg, #3b1240, #12293d); border: 2px solid #ff2e93; box-shadow: 0 0 24px rgba(255,46,147,0.35), inset 0 0 18px rgba(0,229,255,0.2); }
    .agency-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }

    .av-frame { width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0; position: relative; padding: 3px; display: flex; align-items: center; justify-content: center; }
    .av-frame.lg-bronze { background: linear-gradient(135deg, #e0a96d, #6e4522); }
    .av-frame.lg-silver { background: linear-gradient(135deg, #ffffff, #78909c); box-shadow: 0 0 10px rgba(207,216,220,0.35); }
    .av-frame.lg-gold   { background: linear-gradient(135deg, #fff176, #ff8f00); box-shadow: 0 0 14px rgba(255,215,0,0.45); }
    .av-frame.lg-neon   { background: linear-gradient(135deg, #ff2e93, #00e5ff); box-shadow: 0 0 16px rgba(255,46,147,0.55); }
    .av-frame-in { width: 100%; height: 100%; border-radius: 13px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; color: #fff; background: #181326; }
    .av-frame-in img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .av-league-badge { position: absolute; bottom: -5px; right: -5px; width: 22px; height: 22px; border-radius: 50%; background: #120d21; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; }

    .agency-name { font-size: 17px; font-weight: 900; color: #fff; line-height: 1.15; }
    .agency-id { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 700; margin-top: 2px; }
    .league-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 3px 9px; border-radius: 8px; background: rgba(0,0,0,0.42); margin-top: 5px; }
    .agency-buffs { font-size: 11px; color: #d8cce8; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }

    /* Касса выступлений */
    .cashbox-bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: linear-gradient(135deg, rgba(0,229,255,0.12), rgba(255,46,147,0.12)); border: 1px solid rgba(0,229,255,0.35); border-radius: 16px; padding: 11px 13px; margin-bottom: 12px; }

    /* Состав группы */
    .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
    .team-slot { background: var(--surface); border: 1.5px dashed rgba(255,255,255,0.16); border-radius: 14px; padding: 8px 4px; text-align: center; cursor: pointer; transition: 0.2s; min-height: 80px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .team-slot.filled { border-style: solid; background: linear-gradient(160deg, #201836, #140f24); }
    .team-slot:active { transform: scale(0.94); }
    .slot-role { font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
    .slot-tag { font-size: 14px; font-weight: 900; margin: 2px 0; color: #fff; }
    .slot-tier { font-size: 9px; font-weight: 800; }

    .synergy-bar { font-size: 11px; padding: 7px 12px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); color: var(--muted); }
    .synergy-bar.on { background: rgba(0,230,118,0.12); border-color: var(--success); color: #b8ffd6; }

    /* Сетка карт по Эрам */
    .era-head { display: flex; justify-content: space-between; align-items: center; margin: 14px 0 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .cards-mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
    .mini-card { background: linear-gradient(160deg, #251e3d, #140f24); border-radius: 14px; padding: 6px; text-align: center; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.18s var(--spring); }
    .mini-card:active { transform: scale(0.93); }
    .mini-card.locked-card { opacity: 0.4; filter: grayscale(0.8); cursor: default; }
    .mini-card .pc-art { height: 86px; border-radius: 10px; margin-bottom: 5px; }
    .mini-card .pc-monogram { font-size: 24px; }
    .mini-card .mc-name { font-size: 11px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-card .mc-sub { font-size: 9px; color: var(--muted); }
    .mc-dot { position: absolute; top: 5px; left: 5px; z-index: 3; width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
    .mc-craft { position: absolute; top: 4px; right: 4px; z-index: 3; background: var(--success); color: #05170c; font-size: 8px; font-weight: 900; padding: 2px 5px; border-radius: 6px; }

    /* Рамки карт теперь графические — см. блок «РАМКИ КАРТ ИЗ FIGMA» ниже */

    /* Панель талантов внутри урока (понятные плашки) */
    .talent-bar { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 12px; }
    .t-chip { display: inline-flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 11px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2d9f3; font-size: 11px; font-weight: 800; cursor: pointer; transition: transform 0.15s; }
    .t-chip:active { transform: scale(0.95); }
    .t-chip.shield-on { border-color: rgba(0,229,255,0.35); background: rgba(0,229,255,0.1); color: #bdf7ff; }
    .t-chip.combo-on { border-color: rgba(255,159,67,0.4); background: rgba(255,159,67,0.12); color: #ffd4a3; }
    .t-hint-btn { background: linear-gradient(135deg, #00c6ff, #7b2cbf); border: none; color: #fff; font-size: 11px; font-weight: 800; padding: 7px 11px; border-radius: 11px; cursor: pointer; box-shadow: 0 3px 10px rgba(0,198,255,0.22); }
    .t-hint-btn:active { transform: scale(0.95); }
    .t-hint-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }

    /* Карточки апгрейдов и площадок */
    .upg-row { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 12px 14px; margin-bottom: 9px; }
    .upg-ico { width: 42px; height: 42px; border-radius: 12px; background: var(--surface-2); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    .stage-box { background: linear-gradient(135deg, #251542, #141930); border: 1.5px solid rgba(0,229,255,0.35); border-radius: 18px; padding: 14px; margin-bottom: 14px; }

    /* Оверлеи профиля, квестов и зала славы */
    .full-overlay { position: fixed; inset: 0; background: #0e0a1a; z-index: 9500; display: none; flex-direction: column; }
    .full-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
    .ov-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(20,14,34,0.96); }
    .ov-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 36px; -webkit-overflow-scrolling: touch; }
    .rank-step { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 10px 12px; margin-bottom: 8px; opacity: 0.5; }
    .rank-step.reached, .rank-step.current { opacity: 1; }
    .rank-step.current { border-width: 1.5px; background: linear-gradient(135deg, rgba(40,28,68,0.95), rgba(20,14,34,0.95)); }
    .rs-ico { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; background: rgba(0,0,0,0.35); flex-shrink: 0; }
    .onb-input { width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.38); border: 1.5px solid rgba(0,229,255,0.4); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 15px; font-weight: 800; text-align: center; outline: none; margin: 10px 0 14px; }

    .quest-sec { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin: 14px 0 8px; display: flex; justify-content: space-between; }
    .contract-row { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 11px 13px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .contract-row.done { border-color: rgba(0,230,118,0.45); background: rgba(0,230,118,0.08); }
    .c-title { font-size: 13px; font-weight: 700; }
    .c-prog { font-size: 12px; color: var(--cyan); font-weight: 800; }
    .daily-prize { background: linear-gradient(135deg, rgba(255,184,0,0.14), rgba(255,46,147,0.14)); border: 1px solid rgba(255,215,0,0.4); border-radius: 16px; padding: 12px 14px; margin-bottom: 12px; }
    .daily-prize-count { font-size: 11px; font-weight: 900; color: #ffe9a8; text-align: right; margin-top: 5px; }

    /* Квест месяца: карточка активного месяца с диском и прогрессом */
    .month-quest { position: relative; overflow: hidden; border-radius: 16px; padding: 12px 14px; margin-bottom: 10px; background: linear-gradient(135deg, rgba(0,229,255,0.12), rgba(255,46,147,0.1)); border: 1px solid var(--mq, var(--cyan)); }
    .month-quest::after { content: ''; position: absolute; right: -34px; bottom: -40px; width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, var(--mq, var(--cyan)) 0%, transparent 70%); opacity: 0.18; pointer-events: none; }
    .mq-head { display: flex; align-items: center; gap: 11px; position: relative; z-index: 1; }
    .mq-disc { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; background: radial-gradient(circle, var(--mq, var(--cyan)) 16%, #13111f 22%, #242236 52%, #13111f 78%); box-shadow: 0 0 14px -2px var(--mq, var(--cyan)); animation: mqSpin 6s linear infinite; }
    @keyframes mqSpin { to { transform: rotate(360deg); } }
    .mq-title { font-size: 13px; font-weight: 900; color: #fff; }
    .mq-sub { font-size: 11px; line-height: 1.35; color: #d8cce8; margin-top: 3px; }
    .mq-ico { font-size: 20px; line-height: 1; flex-shrink: 0; }
    .mq-bar { position: relative; z-index: 1; height: 8px; border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.42); margin-top: 10px; }
    .mq-fill { height: 100%; border-radius: 8px; background: linear-gradient(90deg, var(--mq, var(--cyan)), #fff); transition: width 0.45s var(--spring); }
    .mq-btn-done { margin-top: 9px; font-size: 12px; font-weight: 800; color: var(--success); }

    .badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
    .m-badge { background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 8px 4px; text-align: center; opacity: 0.35; filter: grayscale(1); }
    .m-badge.cur { opacity: 0.95; filter: none; border-style: dashed; border-color: var(--cyan); }
    .m-badge.got { opacity: 1; filter: none; border-width: 1.5px; background: linear-gradient(155deg, #271b42, #150f26); }
    .m-badge-ico { width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-size: 17px; background: rgba(255,255,255,0.08); }
    .m-badge-name { font-size: 10px; font-weight: 800; }

    /* Витрина боксов и плавная анимация винила */
    .box-list { display: grid; gap: 10px; }
    .box-row { display: flex; align-items: center; gap: 12px; background: var(--surface); border-radius: 18px; padding: 12px 14px; border: 1.5px solid rgba(255,255,255,0.1); }
    .box-row.silver { border-color: rgba(207,216,220,0.4); background: linear-gradient(135deg, #1f2330, #13151f); }
    .box-row.gold { border-color: rgba(255,215,0,0.45); background: linear-gradient(135deg, #332710, #17120c); }
    .box-row.platinum { border-color: rgba(0,229,255,0.5); background: linear-gradient(135deg, #112b3b, #151026); }
    .mini-album { width: 46px; height: 46px; border-radius: 10px; position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .mini-album::after { content: ''; position: absolute; right: -8px; top: 5px; width: 36px; height: 36px; border-radius: 50%; background: radial-gradient(circle, #ff2e93 18%, #111 22%, #222 45%, #111 70%); z-index: 0; }
    .mini-album span { position: relative; z-index: 1; width: 100%; height: 100%; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

      .album-stage { position: relative; width: 260px; height: 220px; display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 10px 0 18px; }
    .album-vinyl { position: absolute; width: 156px; height: 156px; border-radius: 50%; background: repeating-radial-gradient(circle, #14141c 0px, #14141c 3px, #242433 4px, #14141c 6px); border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; transform: translateX(0) rotate(0deg) scale(0.92); transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease, box-shadow 0.5s ease; opacity: 0; z-index: 1; pointer-events: none; }
    .vinyl-label { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--cyan)); border: 3px solid #111; display: flex; align-items: center; justify-content: center; }
    .vinyl-hole { width: 10px; height: 10px; border-radius: 50%; background: #0b0814; }
    .album-sleeve { position: relative; z-index: 2; width: 180px; height: 180px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 14px 36px rgba(0,0,0,0.55); transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1); animation: packFloat 3s infinite ease-in-out; background-size: contain; background-repeat: no-repeat; background-position: center; }
    .album-sleeve.no-img.silver { background: linear-gradient(145deg, #3a4052, #1b1e29); border: 2px solid #cfd8dc; border-radius: 18px; }
    .album-sleeve.no-img.gold { background: linear-gradient(145deg, #694c14, #261b0b); border: 2px solid #ffd700; border-radius: 18px; }
    .album-sleeve.no-img.platinum { background: linear-gradient(145deg, #124d66, #23123d); border: 2px solid #00e5ff; border-radius: 18px; }
    @keyframes packFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-7px) rotate(1deg); } }
    .album-stage.opening .album-sleeve { animation: none; transform: translateX(-36px) rotate(-9deg) scale(0.96); }
    .album-stage.opening .album-vinyl { opacity: 1; transform: translateX(88px) rotate(480deg) scale(1); box-shadow: 0 0 32px rgba(0,229,255,0.5); }
    .flash-overlay { position: fixed; inset: 0; background: #fff; z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.16s ease-out; }
    .flash-overlay.active { opacity: 1; }

    /* Анимация слияния 3 карт в 1 */
    .fusion-stage { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .f-orb { position: absolute; width: 64px; height: 90px; border-radius: 12px; border: 2px solid #fff; background: linear-gradient(145deg, var(--accent), var(--purple)); box-shadow: 0 0 18px rgba(255,46,147,0.6); }
    .f-orb.o1 { animation: fMerge1 0.85s ease-in forwards; }
    .f-orb.o2 { animation: fMerge2 0.85s ease-in forwards; }
    .f-orb.o3 { animation: fMerge3 0.85s ease-in forwards; }
    @keyframes fMerge1 { 0% { transform: translate(-80px, -45px) rotate(-18deg); opacity: 1; } 100% { transform: translate(0, 0) scale(0.2) rotate(180deg); opacity: 0; } }
    @keyframes fMerge2 { 0% { transform: translate(80px, -45px) rotate(18deg); opacity: 1; } 100% { transform: translate(0, 0) scale(0.2) rotate(-180deg); opacity: 0; } }
    @keyframes fMerge3 { 0% { transform: translate(0, 75px) rotate(0deg); opacity: 1; } 100% { transform: translate(0, 0) scale(0.2) rotate(360deg); opacity: 0; } }
    .flash-overlay.active { opacity: 1; }

    .zoom-modal { width: 100%; max-width: 330px; padding: 16px; }
    .tier-pills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 12px 0; }
    .t-pill { background: var(--surface-2); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 4px; text-align: center; font-size: 10px; }
    .t-pill b { display: block; font-size: 14px; margin-top: 2px; }
    .app-toast { position: fixed; left: 50%; bottom: 86px; transform: translateX(-50%) translateY(18px); background: rgba(20, 14, 34, 0.96); border: 1.5px solid rgba(0, 229, 255, 0.45); color: #fff; font-size: 13px; font-weight: 700; text-align: center; padding: 11px 16px; border-radius: 14px; max-width: calc(100vw - 32px); width: max-content; z-index: 9999; opacity: 0; pointer-events: none; transition: 0.22s ease; white-space: pre-line; backdrop-filter: blur(8px); }
    .app-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
    /* === РАМКИ КАРТ ИЗ FIGMA (600×800, окно по центру) === */
    .mini-card[class*="tier-"],
    .photocard[class*="tier-"] {
      position: relative;
      box-sizing: border-box;
      aspect-ratio: 3 / 4;
      display: flex;
      flex-direction: column;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      animation: none !important;
      overflow: visible !important;
      isolation: isolate;
    }

    /* Тёмная подложка строго под окном рамки — текст и арт читаются на любом фоне */
    .mini-card[class*="tier-"]::before,
    .photocard[class*="tier-"]::before {
      content: "";
      position: absolute;
      inset: 9% 15% 8.5%;
      background: #120d21;
      border-radius: 8px;
      z-index: 0;
    }

    .mini-card[class*="tier-"] > *,
    .photocard[class*="tier-"] > * {
      position: relative;
      z-index: 1;
    }

    /* Бейдж ранга и метка биаса — не участвуют в flex-потоке карточки,
       иначе flex растягивает их на всю ширину окна (надпись «съезжает» влево) */
    .mini-card[class*="tier-"] .pc-rarity,
    .photocard[class*="tier-"] .pc-rarity,
    .mini-card[class*="tier-"] .pc-bias-tag,
    .photocard[class*="tier-"] .pc-bias-tag {
      position: absolute;
      align-self: auto;
      width: auto;
      flex: 0 0 auto;
    }

    /* «Мои карты»: контент строго в окне рамки (~69% ширины) */
    .mini-card[class*="tier-"] {
      padding: 15% 15.5% 16% !important;
    }
    .mini-card[class*="tier-"] .pc-art {
      flex: 1;
      height: auto !important;
      min-height: 0;
      border-radius: 7px;
      margin-bottom: 4px;
    }
    /* Верх окна у рамки скошен — подрезаем арт по той же диагонали */
    .mini-card[class*="tier-"] .pc-art,
    .photocard[class*="tier-"] .pc-art {
      -webkit-clip-path: polygon(18.5% 0, 81.5% 0, 99.6% 17%, 99.6% 100%, 0.4% 100%, 0.4% 17%);
      clip-path: polygon(18.5% 0, 81.5% 0, 99.6% 17%, 99.6% 100%, 0.4% 100%, 0.4% 17%);
    }
    .mini-card[class*="tier-"] .pc-art img,
    .photocard[class*="tier-"] .pc-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .mini-card[class*="tier-"] .pc-monogram { font-size: 22px; }
    .mini-card[class*="tier-"] .mc-name {
      font-size: 10px;
      font-weight: 800;
      line-height: 1.15;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mini-card[class*="tier-"] .mc-sub {
      font-size: 8px;
      font-weight: 700;
      line-height: 1.15;
    }

    /* Большая карта: модалка просмотра, выпадение из бокса, слияние */
    .photocard[class*="tier-"] {
      width: 100%;
      max-width: 280px;
      margin: 0 auto;
      /* px, а не %: у большой карты padding не должен зависеть от ширины модалки */
      padding: 42px 46px 56px !important;
    }
    .photocard[class*="tier-"] .pc-art {
      flex: 1;
      height: auto !important;
      min-height: 0;
      border-radius: 10px;
      margin-bottom: 8px;
    }
    .photocard[class*="tier-"] .pc-name { font-size: 15px; line-height: 1.15; }
    .photocard[class*="tier-"] .pc-role { margin-top: 3px; line-height: 1.2; }
    .photocard[class*="tier-"] .pc-bonus { font-size: 10px; line-height: 1.2; margin-top: 4px; }
    .photocard[class*="tier-"] .pc-rarity {
      top: 13%;
      left: auto;
      right: 13%;
      bottom: auto;
      z-index: 5;
      font-size: 9px;
      padding: 3px 7px;
    }

    /* Сама рамка — поверх контента, клики не перехватывает */
    .mini-card[class*="tier-"]::after,
    .photocard[class*="tier-"]::after {
      content: "";
      position: absolute;
      /* Растягиваем рамку на всю площадь карточки 3:4 */
      inset: 0;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      pointer-events: none;
      z-index: 4;
    }

    /* Точки и маркеры поверх рамки, но уже внутри окна */
    .mc-dot   { top: 21.5% !important; left: 18% !important; z-index: 5 !important; }
    .mc-craft { top: 20.5% !important; right: 18% !important; z-index: 5 !important; }

    /* Новые рамки из Figma */
    .mini-card.tier-silver::after,   .photocard.tier-silver::after   { background-image: url('img/frames/frame-silver.webp'); }
    .mini-card.tier-gold::after,     .photocard.tier-gold::after     { background-image: url('img/frames/frame-gold.webp'); }
    .mini-card.tier-platinum::after, .photocard.tier-platinum::after { background-image: url('img/frames/frame-platinum.webp'); }
    .mini-card.tier-neon::after,     .photocard.tier-neon::after     { background-image: url('img/frames/frame-neon.webp'); }

    /* Слоты состава группы: заполненные показывают ту же рамку ранга */
    .team-slot[class*="tier-"] {
      aspect-ratio: 3 / 4;
      min-height: 0;
      padding: 17% 15.5% !important;
      border: none;
      border-radius: 12px;
      background-color: #120d21;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
    }
    .team-slot[class*="tier-"] .slot-role { font-size: 8px; }
    .team-slot[class*="tier-"] .slot-tag { font-size: 12px; margin: 1px 0; }
    .team-slot[class*="tier-"] .slot-tier { font-size: 8px; }
    .team-slot.tier-silver   { background-image: url('img/frames/frame-silver.webp'); }
    .team-slot.tier-gold     { background-image: url('img/frames/frame-gold.webp'); }
    .team-slot.tier-platinum { background-image: url('img/frames/frame-platinum.webp'); }
    .team-slot.tier-neon     { background-image: url('img/frames/frame-neon.webp'); }

    /* Свечение — только у большой карты, чтобы сетка «Мои карты» оставалась спокойной */
    .photocard.tier-silver::after   { filter: drop-shadow(0 0 5px rgba(222,228,236,0.25)); }
    .photocard.tier-gold::after     { filter: drop-shadow(0 0 6px rgba(246,195,69,0.35)); }
    .photocard.tier-platinum::after { filter: drop-shadow(0 0 7px rgba(110,217,178,0.4)); }
    .photocard.tier-neon::after     { filter: drop-shadow(0 0 8px rgba(255,46,147,0.45)); animation: frameNeonPulse 2.6s ease-in-out infinite alternate; }
    @keyframes frameNeonPulse {
      from { filter: drop-shadow(0 0 4px rgba(255,46,147,0.28)) drop-shadow(0 0 2px rgba(49,230,252,0.2)); }
      to   { filter: drop-shadow(0 0 11px rgba(255,46,147,0.55)) drop-shadow(0 0 6px rgba(49,230,252,0.45)); }
    }
    /* Ежедневные квесты (5 фиксированных), стрик с заморозкой и недельный турнир */
    .c-rew { font-size: 11px; color: #ff9ad6; font-weight: 800; white-space: nowrap; }
    .freeze-pill { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9px; border: 1px solid rgba(0,229,255,0.45); background: rgba(0,229,255,0.12); color: #bdf7ff; margin-left: 4px; vertical-align: middle; cursor: pointer; }
    .freeze-pill.empty { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.05); color: var(--muted); }

    /* Топ: выразительная карточка текущей лиги (эмблема + градиент под цвет лиги) */
    .wr-card { padding: 14px; text-align: left; position: relative; overflow: hidden; border-radius: 20px; }
    .wr-card::after { content: ''; position: absolute; right: -46px; top: -56px; width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, var(--lg-tint, #ff2e93) 0%, transparent 68%); opacity: 0.22; pointer-events: none; }
    .wr-top { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
    .wr-emblem { width: 54px; height: 54px; border-radius: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 26px; line-height: 1; background: rgba(0,0,0,0.32); border: 1.5px solid var(--lg-tint, #ff2e93); box-shadow: 0 0 16px -2px var(--lg-tint, #ff2e93), inset 0 0 12px rgba(255,255,255,0.08); }
    .wr-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .wr-place { font-size: 12px; color: var(--muted); font-weight: 800; margin-top: 3px; }
    .wr-liga { font-size: 21px; font-weight: 900; line-height: 1.1; }
    .wr-hint { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 5px; margin-top: 10px; padding: 4px 10px; border-radius: 10px; font-size: 11px; font-weight: 800; color: #d9f7e3; background: rgba(0,230,118,0.12); border: 1px solid rgba(0,230,118,0.35); }
    .wr-hint.wr-hint-gap { color: #ffe9a8; background: rgba(255,215,0,0.1); border-color: rgba(255,215,0,0.32); }
    .wr-side { display: flex; align-items: center; gap: 6px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
    .wr-timer { font-size: 12px; font-weight: 900; color: #fff; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); padding: 5px 9px; border-radius: 12px; white-space: nowrap; }
    .wr-prizes { font-size: 11px; font-weight: 800; padding: 5px 9px; border-radius: 12px; border: 1px solid rgba(255,215,0,0.45); background: rgba(255,215,0,0.12); color: #ffe9a8; cursor: pointer; white-space: nowrap; transition: transform 0.18s var(--spring); }
    .wr-prizes:active { transform: scale(0.93); }

    /* Топ: лаконичные разделители зон без номеров мест */
    .zone-head { margin: 14px 0 6px; padding: 0 2px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; }
    .zone-head.zone-promote { color: #6ee7a0; }
    .zone-head.zone-hold { color: var(--muted); }
    .zone-head.zone-drop { color: #ff8a94; }

    /* Топ: чистый список участников, без коробок у обычных строк */
    .wr-row { display: flex; align-items: center; gap: 12px; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.05); border-radius: 0; padding: 11px 6px; margin-bottom: 0; }
    .wr-row.me { background: rgba(255,75,139,0.12); border: 1px solid rgba(255,75,139,0.4); border-radius: 14px; padding: 10px; margin: 4px 0; }
    .wr-pos { width: 26px; font-weight: 900; font-size: 12px; color: var(--muted); text-align: center; flex-shrink: 0; }
    .wr-pos.medal { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1a1320; font-size: 12px; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.18); }
    .wr-row.top1 .wr-pos { background: linear-gradient(135deg, #fde68a, #f59e0b); }
    .wr-row.top2 .wr-pos { background: linear-gradient(135deg, #e5e7eb, #94a3b8); }
    .wr-row.top3 .wr-pos { background: linear-gradient(135deg, #fcd0a1, #c2410c); color: #fff; }
    .wr-ava { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #fff; flex-shrink: 0; }
    .wr-name { flex: 1; min-width: 0; font-size: 13px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wr-score { font-size: 12px; font-weight: 900; color: #ff85cb; white-space: nowrap; }

    /* Модалка наград лиги */
    .wr-prize-box { width: 100%; max-width: 340px; padding: 18px 16px; }
    .wr-prize-chain { margin: 10px 0 12px; }
    .wr-prize-chain .ch-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin-bottom: 6px; }
    .wr-prize-chain .ch-row { display: flex; align-items: center; gap: 9px; padding: 6px 9px; margin-bottom: 4px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid transparent; }
    .wr-prize-chain .ch-row .ch-ico { font-size: 14px; line-height: 1; flex-shrink: 0; }
    .wr-prize-chain .ch-row .ch-name { flex: 1; min-width: 0; font-size: 12px; font-weight: 800; color: #cfc6e6; }
    .wr-prize-chain .ch-row .ch-tag { font-size: 9px; font-weight: 800; color: var(--muted); white-space: nowrap; }
    .wr-prize-chain .ch-row.cur { background: rgba(255,46,147,0.16); border-color: var(--accent); box-shadow: 0 0 10px rgba(255,46,147,0.25); }
    .wr-prize-chain .ch-row.cur .ch-name { color: #fff; }
    .wr-prize-chain .ch-row.cur .ch-tag { color: #ff9ad6; }
    .wr-prize-chain .ch-row.past { opacity: 0.45; }
    .wr-prize-card { display: flex; align-items: center; gap: 10px; background: var(--surface-2); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 12px; margin-bottom: 8px; text-align: left; }
    .wr-prize-card.p-promote { border-color: rgba(0,230,118,0.5); background: rgba(0,230,118,0.1); }
    .wr-prize-card.p-hold { border-color: rgba(255,255,255,0.14); }
    .wr-prize-card.p-drop { border-color: rgba(255,71,87,0.42); background: rgba(255,71,87,0.09); }
    .wr-prize-card .p-title { flex: 1; font-size: 12px; font-weight: 800; line-height: 1.3; }
    .wr-prize-card .p-val { font-size: 11px; font-weight: 900; color: #ffe9a8; white-space: nowrap; text-align: right; }
    .wr-prize-card.p-drop .p-val { color: #ffb3ba; }
    .wr-prize-tip { font-size: 11px; line-height: 1.4; color: #ccf7ff; background: rgba(0,229,255,0.08); border-left: 3px solid var(--cyan); border-radius: 8px; padding: 9px 11px; margin: 4px 0 12px; text-align: left; }

    .wr-result-box { text-align: center; max-width: 330px; width: 100%; padding: 20px 16px; }
    .wr-result-box .wr-big { font-size: 22px; font-weight: 900; margin: 6px 0; }
    .wr-result-box .wr-sub { font-size: 12px; color: #d8cce8; line-height: 1.45; margin: 6px 0 12px; }

    /* Мини-магазин в модалке (#pack-modal): пополнение и боксы */
    .quick-shop { width: 100%; max-width: 340px; padding: 16px; text-align: left; }
    .qs-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
    .qs-head .qs-title { font-size: 16px; font-weight: 900; }
    .qs-close { width: 30px; height: 30px; border-radius: 10px; border: none; background: var(--surface-2); color: #fff; font-size: 14px; cursor: pointer; flex-shrink: 0; }
    .qs-status { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .qs-stat { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 9px 10px; }
    .qs-stat .q-ico { font-size: 17px; line-height: 1; flex-shrink: 0; }
    .qs-stat b { display: block; font-size: 12px; font-weight: 900; }
    .qs-stat small { display: block; font-size: 10px; color: var(--muted); margin-top: 2px; line-height: 1.2; }
    .qs-sec { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--muted); margin: 4px 0 8px; }
    .qs-row { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 10px 12px; margin-bottom: 8px; }
    .qs-row .qs-info { flex: 1; min-width: 0; }
    .qs-item-title { font-size: 13px; font-weight: 800; }
    .qs-item-sub { font-size: 10px; color: var(--muted); margin-top: 2px; }
    .qs-row .btn { padding: 8px 10px; font-size: 12px; }
    .qs-box-btn { width: 100%; margin: 2px 0 4px; }
    .qs-note { font-size: 11px; color: var(--muted); text-align: center; margin-top: 8px; }

    /* === МАГАЗИН: 4 ПЛОСКИЕ 2D-КАРТОЧКИ === */
    .shop-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .shop-head-title { font-size: 20px; font-weight: 900; }
    .shop-balance { font-size: 13px; font-weight: 900; color: #fde68a; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25); padding: 5px 10px; border-radius: 12px; }
    .shop-card { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 14px; margin-bottom: 10px; }
    .shop-card.vip { border-color: rgba(251,191,36,0.45); background: var(--surface-2); }
    .shop-card-ico { width: 44px; height: 44px; border-radius: 14px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    .shop-info { flex: 1; min-width: 140px; }
    .shop-title { font-size: 14px; font-weight: 900; }
    .shop-sub { font-size: 11px; color: var(--muted); line-height: 1.4; margin-top: 3px; }
    .shop-buy { padding: 9px 12px; font-size: 12px; }
    .shop-actions { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .shop-note { font-size: 11px; color: var(--muted); text-align: center; margin-top: 6px; line-height: 1.4; }

    /* === ЛИГА: КРУПНАЯ КАРУСЕЛЬ ТРОФЕЕВ + ЧИСТЫЙ ЗАГОЛОВОК === */
    .lg-strip { display: flex; gap: 16px; overflow-x: auto; padding: 8px 16px; margin: 0 -16px 14px; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
    .lg-strip::-webkit-scrollbar { display: none; }
    .lg-step { flex: 0 0 auto; width: 68px; text-align: center; opacity: 0.42; filter: grayscale(1); scroll-snap-align: center; }
    .lg-step.past, .lg-step.cur { opacity: 1; filter: none; }
    .lg-ico { width: 68px; height: 68px; margin: 0 auto 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; background: var(--surface-2); border: 2px solid transparent; transition: width 0.2s ease, height 0.2s ease; }
    .lg-step.past .lg-ico { border-color: rgba(255,255,255,0.16); }
    .lg-step.cur .lg-ico { width: 82px; height: 82px; font-size: 36px; border-color: var(--c); box-shadow: 0 0 0 5px rgba(255,255,255,0.06), 0 0 18px -2px var(--c); }
    .lg-nm { font-size: 9px; font-weight: 800; color: var(--muted); line-height: 1.15; }
    .lg-step.cur .lg-nm { color: #fff; font-size: 10px; }
    .lg-now { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; padding: 0 4px; }
    .lg-now-name { font-size: 22px; font-weight: 900; line-height: 1.15; }
    .lg-now-side { display: flex; align-items: center; gap: 12px; }
    .lg-timer { font-size: 13px; font-weight: 800; color: #e2e8f0; background: none; padding: 0; white-space: nowrap; }
    .lg-prizes { font-size: 11px; font-weight: 800; padding: 6px 11px; border-radius: 10px; border: 1px solid rgba(251,191,36,0.35); background: rgba(251,191,36,0.1); color: #fde68a; cursor: pointer; white-space: nowrap; }
    .lg-prizes:active { transform: scale(0.95); }

    /* === ЖИВАЯ СТУДИЯ: ПРОФИЛЬ, ГЕРОИ, ЭПИЗОДЫ === */
    .studio-head { background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 15px 16px; margin-bottom: 14px; }
    .studio-name { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 19px; font-weight: 900; cursor: pointer; line-height: 1.2; }
    .studio-name .sn-arrow { font-size: 18px; color: var(--muted); font-weight: 900; }
    .studio-lvl { display: inline-flex; align-items: center; gap: 6px; margin: 9px 0 8px; padding: 7px 13px; border-radius: 12px; font-size: 16px; font-weight: 900; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); }
    .studio-xp-note { font-size: 10px; color: var(--muted); margin-top: 5px; }
    .studio-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 10px; font-size: 11px; font-weight: 700; color: #cbd5e1; }
    .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .hero-card { position: relative; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 14px 10px 11px; text-align: center; cursor: pointer; transition: transform 0.18s var(--spring), background 0.18s; }
    .hero-card:active { transform: scale(0.97); background: var(--surface-2); }
    .hero-ava-frame { width: 84px; height: 84px; margin: 0 auto 8px; padding: 3px; border-radius: 26px; display: flex; }
    .hero-ava { width: 100%; height: 100%; border-radius: 22px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 900; color: #fff; background: rgba(0,0,0,0.32); }
    .hero-ava img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .hero-name { font-size: 14px; font-weight: 900; }
    .hero-role { font-size: 10px; color: var(--muted); margin-top: 2px; }
    .hero-count { font-size: 10px; font-weight: 800; color: var(--cyan); margin-top: 5px; }
    .hero-cloud { position: absolute; top: 7px; right: 9px; font-size: 19px; line-height: 1; filter: drop-shadow(0 2px 6px rgba(255,255,255,0.35)); animation: cloudPulse 1.6s ease-in-out infinite; }
    @keyframes cloudPulse { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scale(1.14); } }
    .ep-item { background: var(--surface-2); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 12px 13px; margin-bottom: 10px; }
    .ep-item.read { border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.07); }
    .ep-tag { display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 8px; background: rgba(255,255,255,0.07); color: #ffa9c9; }
    .ep-title { font-size: 14px; font-weight: 900; margin: 6px 0 4px; }
    .ep-text { font-size: 12px; line-height: 1.5; color: #cbd5e1; }
    .ep-phrase { display: flex; align-items: center; gap: 8px; margin-top: 9px; font-size: 12px; color: #ff99d6; font-weight: 700; }
    .ep-actions { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
    .ep-actions .btn { padding: 8px 12px; font-size: 12px; }
    .ep-done { font-size: 11px; font-weight: 800; color: var(--success); }
    .ep-locked { font-size: 11px; color: var(--muted); }
    .studio-empty { font-size: 12px; line-height: 1.5; color: var(--muted); background: var(--surface); border: 1px dashed rgba(255,255,255,0.12); border-radius: 16px; padding: 14px; text-align: center; }

    /* === КОНЕЦ БЛОКА РАМОК === */
  `;
  document.head.appendChild(css);

  const flashEl = document.createElement('div');
  flashEl.className = 'flash-overlay';
  document.body.appendChild(flashEl);
  function triggerFlash(cb) {
    flashEl.classList.add('active');
    setTimeout(() => { if (cb) cb(); flashEl.classList.remove('active'); }, 180);
  }

  const profileOverlay = document.createElement('div');
  profileOverlay.className = 'full-overlay';
  profileOverlay.id = 'profile-overlay';
  document.body.appendChild(profileOverlay);

  let toastTimer = null;
  const toastEl = document.createElement('div');
  toastEl.className = 'app-toast';
  toastEl.onclick = () => toastEl.classList.remove('show');
  document.body.appendChild(toastEl);
  function showToast(msg, ms = 2600) {
    toastEl.textContent = String(msg);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }
  window.alert = function (msg) {
    showToast(msg);
    if (typeof haptic === 'function') haptic('light');
  };

  let pendingFreezeToast = false;   // сработала заморозка ❄️ — показать тост
  let pendingStreakReward = 0;      // веха серии: +30 🎵 за 5/10/15 дней
  let pendingWeeklyResult = false;  // ждём итогов недели — показать модалку
  let weeklyTickTimer = null;       // живой таймер «Топ»

  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function weekKey() { const d = new Date(), s = new Date(d.getFullYear(), 0, 1); return `${d.getFullYear()}-W${Math.ceil((((d - s) / 86400000) + s.getDay() + 1) / 7)}`; }
  function monthKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; }

  /* ====== ЖИВАЯ СТУДИЯ: ГЕРОИ И ЭПИЗОДЫ ====== */
  function getEpisodes() {
    return Array.isArray(window.EPISODES) ? window.EPISODES : [];
  }

  function heroById(id) {
    return HEROES.find(h => h.id === id) || HEROES[0];
  }

  function episodesForHero(charId) {
    return getEpisodes().filter(e => e.charId === charId);
  }

  function isEpisodeOpen(ep, level) {
    return !!ep && Number(ep.unlockLevel || 1) <= level;
  }

  function unreadEpisodesForHero(charId, level) {
    const read = Array.isArray(st.readEpisodes) ? st.readEpisodes : [];
    return episodesForHero(charId).filter(ep => isEpisodeOpen(ep, level) && !read.includes(ep.id));
  }

  function heroAvatarHtml(hero, size = 84) {
    return `<div class="hero-ava-frame" style="width:${size}px;height:${size}px;background:${hero.grad}">
      <div class="hero-ava">
        <img src="${escapeHtml(hero.img)}" alt="${escapeHtml(hero.name)}"
          onerror="this.style.display='none';this.parentNode.textContent='${escapeHtml(hero.name.slice(0, 1))}'">
      </div>
    </div>`;
  }

  /* Модалка героя: открытые эпизоды + условие открытия следующего. */
  function openHeroModal(charId) {
    haptic('light');
    initStudioState();
    const hero = heroById(charId);
    const lvl = getStudioLevel(st.xp);
    const eps = episodesForHero(charId);
    const read = Array.isArray(st.readEpisodes) ? st.readEpisodes : [];
    const modal = document.getElementById('pack-modal');
    if (!modal) return;

    const items = eps.map(ep => {
      const open = isEpisodeOpen(ep, lvl.level);
      const done = read.includes(ep.id);
      if (!open) {
        return `<div class="ep-item">
          <span class="ep-tag">${escapeHtml(ep.tag)}</span>
          <div class="ep-title">${escapeHtml(ep.title)}</div>
          <div class="ep-locked">🔒 Откроется на уровне ${Number(ep.unlockLevel) || 1}</div>
        </div>`;
      }
      return `<div class="ep-item ${done ? 'read' : ''}" data-ep="${escapeHtml(ep.id)}">
        <span class="ep-tag">${escapeHtml(ep.tag)}</span>
        <div class="ep-title">${escapeHtml(ep.title)}</div>
        <div class="ep-text">${escapeHtml(ep.text)}</div>
        <div class="ep-phrase">«${escapeHtml(ep.phraseKr)}» ${escapeHtml(ep.phraseTr)} — ${escapeHtml(ep.phraseRu)}
          <button class="btn ghost ep-audio" data-file="${escapeHtml(ep.file)}" data-kr="${escapeHtml(ep.phraseKr)}" style="padding:5px 9px;font-size:12px">🔊</button>
        </div>
        <div class="ep-actions">
          ${done
            ? '<span class="ep-done">✓ Прочитано</span>'
            : `<button class="btn cyan ep-read" data-ep="${escapeHtml(ep.id)}">Прочитано (+10 🎵)</button>`}
        </div>
      </div>`;
    }).join('');

    const nextLocked = eps.find(ep => Number(ep.unlockLevel || 1) > lvl.level);
    const nextNote = nextLocked
      ? `<div class="studio-empty" style="margin-top:4px">Следующий эпизод откроется на уровне <b style="color:#fff">${Number(nextLocked.unlockLevel)}</b> (сейчас ${lvl.level}).</div>`
      : '';

    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box" style="width:100%;max-width:360px;padding:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px">
            ${heroAvatarHtml(hero, 52)}
            <div>
              <div style="font-size:16px;font-weight:900">${escapeHtml(hero.name)}</div>
              <div style="font-size:11px;color:var(--muted)">${escapeHtml(hero.role)} • ${lvl.level} ур.</div>
            </div>
          </div>
          <button class="close-btn" style="width:30px;height:30px;font-size:14px" onclick="document.getElementById('pack-modal').classList.remove('open')">✕</button>
        </div>
        <div style="max-height:60vh;overflow-y:auto;margin-top:10px">
          ${items || '<div class="studio-empty">У этого героя пока нет эпизодов.</div>'}
          ${nextNote}
        </div>
      </div>`;

    modal.querySelectorAll('.ep-audio').forEach(btn => {
      btn.onclick = () => playAudio(btn.dataset.file, btn.dataset.kr);
    });
    modal.querySelectorAll('.ep-read').forEach(btn => {
      btn.onclick = () => {
        const epId = btn.dataset.ep;
        if (!Array.isArray(st.readEpisodes)) st.readEpisodes = [];
        if (st.readEpisodes.includes(epId)) return;
        st.readEpisodes.push(epId);
        st.coins = (Number(st.coins) || 0) + 10;
        save(); haptic('ok'); sfx('ok');
        alert('Эпизод прочитан: +10 🎵');
        openHeroModal(charId);
        renderBinder();
      };
    });
  }
  window.openHeroModal = openHeroModal;

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.producerId) st.producerId = "KP-" + Math.floor(10000 + Math.random() * 90000);
    if (!st.cases) st.cases = { silver: 0, gold: 0, platinum: 0 };
    if (!Array.isArray(st.monthlyBadges)) st.monthlyBadges = [];
    if (!Array.isArray(st.cards)) st.cards = [];
    if (!Array.isArray(st.done)) st.done = [];
    if (!Array.isArray(st.readEpisodes)) st.readEpisodes = [];
    st.readEpisodes = st.readEpisodes.map(String).filter((id, i, arr) => id && arr.indexOf(id) === i);

    /* Старые сохранения хранили коллекцию в st.inv ({id: {silver: 1}}).
       Переносим ключи в простой массив st.cards без дублей. */
    if (st.inv && typeof st.inv === 'object') {
      Object.keys(st.inv).forEach(key => {
        const id = Number(key);
        if (isFinite(id) && !st.cards.includes(id)) st.cards.push(id);
      });
      delete st.inv;
    }
    st.cards = st.cards.map(Number).filter(id => isFinite(id));
    st.cards = st.cards.filter((id, i) => st.cards.indexOf(id) === i);

    /* Старое поле avatarCardId работает как выбранный Биас, пока не выбран новый. */
    if (st.biasCardId == null && st.avatarCardId != null) {
      const legacy = Number(st.avatarCardId);
      if (st.cards.includes(legacy)) st.biasCardId = legacy;
    }

    const today = todayKey(), wk = weekKey(), mk = monthKey();
    if (typeof st.streakFreeze !== 'number' || !isFinite(st.streakFreeze)) st.streakFreeze = 0;
    st.streakFreeze = Math.max(0, Math.min(STREAK_FREEZE_MAX, Math.floor(st.streakFreeze)));

    if (!st.streak || typeof st.streak !== 'object') st.streak = { count: 1, lastDate: today };
    if (typeof st.streak.count !== 'number' || !isFinite(st.streak.count) || st.streak.count < 1) st.streak.count = 1;
    if (!st.streak.lastDate) st.streak.lastDate = today;
    if (st.streak.lastDate !== today) {
      // Сколько календарных дней прошло с последнего входа (1 — вчера, 2 — пропущен ровно 1 день).
      const gap = dayDiff(st.streak.lastDate, today);
      if (gap === 1) {
        st.streak.count += 1;
      } else if (gap === 2 && st.streakFreeze > 0) {
        st.streakFreeze -= 1;
        pendingFreezeToast = true;   // серия сохранена за счёт заморозки ❄️
      } else {
        st.streak.count = 1;
      }
      st.streak.lastDate = today;
    }

    /* Вехи серии: каждые 5 дней (5, 10, 15…) — +30 🎵 один раз за веху. */
    if (typeof st.lastStreakRewardDay !== 'number') st.lastStreakRewardDay = 0;
    if (st.streak.count % 5 === 0 && st.lastStreakRewardDay !== st.streak.count) {
      st.lastStreakRewardDay = st.streak.count;
      st.coins = (Number(st.coins) || 0) + 30;
      pendingStreakReward = st.streak.count;
    }

    if (!st.daily || st.daily.date !== today) {
      st.daily = {
        date: today, lessons: 0, dict: 0, cards: 0, combo: 0,
        dictSeen: [], cardSeen: [],
        p1: false, p2: false, p3: false, p4: false, p5: false, claimed: false
      };
    } else {
      if (typeof st.daily.lessons !== 'number') st.daily.lessons = 0;
      if (typeof st.daily.dict !== 'number') st.daily.dict = 0;
      if (typeof st.daily.cards !== 'number') st.daily.cards = 0;
      if (typeof st.daily.combo !== 'number') st.daily.combo = 0;
      if (!Array.isArray(st.daily.dictSeen)) st.daily.dictSeen = [];
      if (!Array.isArray(st.daily.cardSeen)) st.daily.cardSeen = [];
      ['p1', 'p2', 'p3', 'p4', 'p5'].forEach(k => { if (typeof st.daily[k] !== 'boolean') st.daily[k] = false; });
      if (typeof st.daily.claimed !== 'boolean') st.daily.claimed = false;
    }

    if (!st.weekly || st.weekly.week !== wk) st.weekly = { week: wk, days: [], claimed: false };
    if (!Array.isArray(st.weekly.days)) st.weekly.days = [];
    if (!st.monthly || st.monthly.key !== mk) st.monthly = { key: mk, pts: 0, claimed: false };
    if (typeof st.monthly.pts !== 'number') st.monthly.pts = 0;

    // Недельный турнир: очки, лига и комната на 29 соперников.
    if (typeof st.weeklyLeague !== 'number' || !isFinite(st.weeklyLeague)) st.weeklyLeague = 0; // миграция: старт с 1-й лиги
    st.weeklyLeague = Math.max(0, Math.min(WEEKLY_LEAGUES.length - 1, Math.floor(st.weeklyLeague)));
    // Единый недельный XP (раньше — «Недельный Хайп»). Старые сохранения переносим один раз.
    if (typeof st.weeklyXp !== 'number' || !isFinite(st.weeklyXp)) {
      st.weeklyXp = Math.max(0, Math.round(Number(st.weeklyHype) || 0));
    }
    st.weeklyXp = Math.max(0, Math.round(st.weeklyXp));
    if (!st.lastWeekKey) st.lastWeekKey = weekKeyOf(Date.now());
    ensureWeeklyRoom();      // добивает соперников, если сохранение старое
    settleWeeklyLeague();    // итоги недели при первом входе после понедельника
    save(false);
  }


  /* ====== СТРИК: РАЗНИЦА ДНЕЙ И ЗАМОРОЗКА ❄️ ====== */
  function dayDiff(fromKey, toKey) {
    const parse = (k) => String(k).split('-').map(Number);
    const a = parse(fromKey), b = parse(toKey);
    if (!a[0] || !b[0]) return 1;
    // Считаем по календарю (UTC): переход на летнее время не ломает серию.
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }

  window.buyStreakFreeze = function () {
    initStudioState();
    if (st.streakFreeze >= STREAK_FREEZE_MAX) return alert(`Максимум ${STREAK_FREEZE_MAX}/${STREAK_FREEZE_MAX} заморозок в запасе.`);
    if (st.coins < STREAK_FREEZE_PRICE) return alert(`Нужно ${STREAK_FREEZE_PRICE} 🎵.`);
    st.coins -= STREAK_FREEZE_PRICE;
    st.streakFreeze = Math.min(STREAK_FREEZE_MAX, st.streakFreeze + 1);
    save(); haptic('ok'); sfx('win');
    alert(`❄️ Заморозка куплена! В запасе: ${st.streakFreeze}/${STREAK_FREEZE_MAX}`);
    refreshQuickShop();
  };

  window.showStreakInfo = function () {
    initStudioState();
    alert(`🔥 Серия входов: ${st.streak.count} дн.\n❄️ Заморозки: ${st.streakFreeze}/${STREAK_FREEZE_MAX}\n\nЕсли пропустить ровно один день, заморозка сохранит серию. Купить её можно в Магазине (🎵 в шапке).`);
  };

  /* ====== КВЕСТЫ: ДЕЙЛИКИ, НЕДЕЛЯ И ОЧКИ МЕСЯЦА ====== */
  /* 5 фиксированных дейликов. Каждый даёт Ноты 🎵 и XP в недельную лигу. */
  const DAILY_QUESTS = [
    { id: 'quest_lesson_1',  title: 'Первый шаг',      desc: 'Завершить 1 урок',                    coins: 20, xp: 30, goal: 1, flag: 'p1', val: d => d.lessons },
    { id: 'quest_combo',     title: 'Чистый бит',      desc: 'Комбо 3+ верных ответа подряд',       coins: 15, xp: 25, goal: 3, flag: 'p2', val: d => d.combo },
    { id: 'quest_vocab',     title: 'Словарный запас', desc: 'Перевернуть 5 карточек в Словаре',    coins: 15, xp: 20, goal: 5, flag: 'p3', val: d => d.cards },
    { id: 'quest_dictation', title: 'Идеальный слух',  desc: 'Завершить шаг с диктантом или аудио', coins: 15, xp: 25, goal: 1, flag: 'p4', val: d => d.dict },
    { id: 'quest_lesson_2',  title: 'Двойной камбэк',  desc: 'Завершить второй урок за день',       coins: 25, xp: 40, goal: 2, flag: 'p5', val: d => d.lessons }
  ];
  const DAILY_ALL_BONUS_COINS = 50;   // бонус за все 5 дейликов: +50 🎵
  const DAILY_ALL_BONUS_XP = 50;      // и +50 XP (в постоянный и недельный XP)

  function isQuestDone(q) {
    const d = st.daily;
    return !!d[q.flag] || q.val(d) >= q.goal;
  }

  function dailyDoneCount() {
    return DAILY_QUESTS.filter(isQuestDone).length;
  }

  function syncQuestProgress() {
    const d = st.daily, m = st.monthly;
    let gained = 0;
    DAILY_QUESTS.forEach(q => {
      if (isQuestDone(q) && !d[q.flag]) { d[q.flag] = true; gained++; }
    });
    // За каждое закрытое задание — +1 балл в квест месяца.
    if (gained) m.pts += gained;

    let badgeAwarded = false;
    if (m.pts >= MONTHLY_GOAL) {
      const now = new Date();
      const badgeKey = `${now.getFullYear()}-${now.getMonth()}`;
      if (!st.monthlyBadges.includes(badgeKey)) {
        st.monthlyBadges.push(badgeKey);
        badgeAwarded = true;
        setTimeout(() => alert('🏅 Квест месяца закрыт! Бейдж добавлен в архив.'), 500);
      }
    }
    if (gained || badgeAwarded) save(false);
    return gained;
  }

  /* Награды за закрытые дейлики. Выдаются один раз за день — при показе
     экрана квестов, чтобы очки не терялись между рендерами. */
  function grantDailyQuestRewards() {
    const d = st.daily;
    let coins = 0, xp = 0, count = 0;
    if (!d.rewarded) {
      DAILY_QUESTS.forEach(q => {
        if (isQuestDone(q)) { coins += q.coins; xp += q.xp; count++; }
      });
      if (count > 0) {
        st.coins += coins;
        if (typeof window.addWeeklyXp === 'function') window.addWeeklyXp(xp);
        else st.weeklyXp = (st.weeklyXp || 0) + xp;
        d.rewarded = true;
        save(false);
      }
    }
    return { coins, xp, count };
  }

  window.trackQuest = function (type, value) {
    initStudioState();
    const d = st.daily;
    if (type === 'lesson') {
      d.lessons++;
      const td = todayKey();
      if (!st.weekly.days.includes(td)) st.weekly.days.push(td);
    } else if (type === 'dict') {
      // Диктант: засчитываем только новые слова (без дублей за день).
      if (value == null || !d.dictSeen.includes(value)) {
        if (value != null) d.dictSeen.push(value);
        d.dict++;
      }
    } else if (type === 'card') {
      if (value == null || !d.cardSeen.includes(value)) {
        if (value != null) d.cardSeen.push(value);
        d.cards++;
      }
    } else if (type === 'combo') {
      // Максимальная серия верных ответов в уроке (дейлик «Чистый бит»).
      d.combo = Math.max(d.combo || 0, Number(value) || 0);
    }
    syncQuestProgress();
    save(false);
  };

  /* ====== НЕДЕЛЬНЫЙ ТУРНИР: 30 СТУДИЙ И ТРИ ЗОНЫ ====== */
  /* Понедельник 00:00 локального времени — начало текущей недели. */
  function weekStartTs(date) {
    const d = date ? new Date(date) : new Date();
    const offset = (d.getDay() + 6) % 7;           // пн = 0 … вс = 6
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset).getTime();
  }

  function weekKeyOf(ts) { return 'W-' + weekStartTs(new Date(ts)); }

  function fmtWeekLeft(ms) {
    const total = Math.max(0, Math.floor(ms / 60000));
    const days = Math.floor(total / 1440), hours = Math.floor((total % 1440) / 60);
    return `${days}д ${hours}ч`;
  }

  /* Псевдослучайное число 0..1 из сида: боты растут детерминированно,
     поэтому очки не «скачут» при каждом открытии вкладки «Топ». */
  function hash01(n) {
    let x = (Math.floor(n) ^ 0x9e3779b9) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x21f0aaad) >>> 0;
    x = Math.imul(x ^ (x >>> 15), 0x735a2d97) >>> 0;
    x = (x ^ (x >>> 15)) >>> 0;
    return x / 4294967296;
  }

  const BOT_NAMES = [
    'Starlit', 'Neon', 'Lunar', 'Hana', 'Mint', 'Velvet', 'Seoul', 'Cherry', 'Echo', 'Aurora',
    'Foxy', 'Blossom', 'Cobalt', 'Pinky', 'Solar', 'Chaos', 'Glow', 'Haneul', 'Onyx', 'Daisy',
    'Prime', 'Rookie', 'Lumi', 'Tiger', 'Nabi', 'Bunny', 'Rocket', 'Juno', 'Candy', 'Alpha'
  ];
  const BOT_SUFFIX = [
    'Ent.', 'Studio', 'Label', 'Records', 'Agency', 'Sound', 'Wave', 'Crew', 'Pack', 'House',
    'Project', 'Company', 'Works', 'Unit', 'Club'
  ];
  const BOT_GRADS = [
    'linear-gradient(135deg,#ff2e93,#7b2cbf)', 'linear-gradient(135deg,#00e5ff,#0072ff)',
    'linear-gradient(135deg,#ffd700,#ff6b00)', 'linear-gradient(135deg,#00e676,#00b0ff)',
    'linear-gradient(135deg,#b46eff,#ff2e93)', 'linear-gradient(135deg,#ff9f43,#ff4757)'
  ];

  /* 29 соперников: у каждого свой потолок очков за неделю и коэффициент активности.
     Топ-1 к концу недели ≈ 850–1100 XP, середина — 300–550, низ — 0–150. */
  function buildWeeklyBots(seed) {
    const bots = [];
    for (let i = 0; i < WEEKLY_SIZE - 1; i++) {
      const r1 = hash01(seed + i * 7 + 1), r2 = hash01(seed + i * 13 + 5);
      const cap = 60 + Math.round(r1 * 1040);
      const rate = 0.45 + r2 * 1.6;
      const name = BOT_NAMES[Math.floor(hash01(seed + i * 31 + 3) * BOT_NAMES.length) % BOT_NAMES.length];
      const suffix = BOT_SUFFIX[Math.floor(hash01(seed + i * 17 + 9) * BOT_SUFFIX.length) % BOT_SUFFIX.length];
      bots.push({
        id: 'bot-' + (i + 1),
        name: `${name} ${suffix}`,
        initials: (name[0] + (suffix ? suffix[0] : '')).toUpperCase(),
        grad: BOT_GRADS[Math.floor(hash01(seed + i * 23 + 11) * BOT_GRADS.length) % BOT_GRADS.length],
        cap, rate
      });
    }
    return bots;
  }

  /* Очки бота по времени с начала недели: растут неровно, но только вперёд. */
  function botXp(bot, weekStart) {
    const elapsed = Math.max(0, Date.now() - weekStart);
    const p = Math.min(1, elapsed / (7 * 86400000));
    const prog = Math.min(1, Math.max(0, p * bot.rate + 0.03 * Math.sin(p * Math.PI * 4 + bot.cap)));
    return Math.round(bot.cap * Math.pow(prog, 0.9));
  }

  function ensureWeeklyRoom() {
    const wk = weekKeyOf(Date.now());
    const w = st.weeklyRoom;
    if (w && w.week === wk && Array.isArray(w.bots) && w.bots.length === WEEKLY_SIZE - 1) return w;
    const seed = (w && w.seed) || st.weeklyRoomSeed || Math.floor(Math.random() * 2e9);
    st.weeklyRoomSeed = seed;
    st.weeklyRoom = { week: wk, seed, bots: buildWeeklyBots(seed) };
    return st.weeklyRoom;
  }

  function weeklyBoard() {
    const weekStart = weekStartTs();
    const room = ensureWeeklyRoom();
    const rows = room.bots.map(b => ({
      id: b.id, name: b.name, initials: b.initials, grad: b.grad,
      xp: botXp(b, weekStart)
    }));
    rows.push({
      id: 'me', me: true,
      name: st.agencyName || 'Твоя студия', initials: '🎵',
      grad: 'linear-gradient(135deg,#ff4b8b,#38bdf8)',
      xp: Math.max(0, Math.round(st.weeklyXp || 0))
    });
    rows.sort((a, b) => (b.xp - a.xp) || (a.me ? -1 : b.me ? 1 : 0));
    rows.forEach((r, i) => { r.pos = i + 1; });
    return rows;
  }

  function zoneInfo(pos) {
    const leagueIdx = st.weeklyLeague || 0;
    const topLeague = leagueIdx === WEEKLY_LEAGUES.length - 1;
    if (pos <= ZONE_PROMOTE) {
      return {
        cls: 'zone-promote', icon: '⬆️', label: 'Зона повышения',
        note: topLeague ? 'Топ-7 элиты' : `Переход в лигу «${WEEKLY_LEAGUES[leagueIdx + 1].name}»`
      };
    }
    if (pos >= ZONE_DROP_FROM && leagueIdx > 0) {
      return { cls: 'zone-drop', icon: '⬇️', label: 'Зона вылета', note: 'Понижение лиги' };
    }
    return { cls: 'zone-hold', icon: '⚪', label: 'Зона удержания', note: 'Сохранение текущей лиги' };
  }

  /* ====== ИТОГИ НЕДЕЛИ (первый вход после понедельника 00:00) ====== */
  function settleWeeklyLeague() {
    const curKey = weekKeyOf(Date.now());
    const prev = st.lastWeekKey;
    st.lastWeekKey = curKey;
    if (!prev || prev === curKey) return null;   // новая установка / всё ещё та же неделя
    if (typeof st.weeklyXp !== 'number') st.weeklyXp = 0;
    if (typeof st.weeklyLeague !== 'number') st.weeklyLeague = 0;

    const leagueIdx = st.weeklyLeague;
    // Итог прошлой недели: у ботов прошлой комнаты уже финальный потолок.
    const oldRoom = st.weeklyRoom;
    const bots = (oldRoom && Array.isArray(oldRoom.bots) && oldRoom.bots.length === WEEKLY_SIZE - 1)
      ? oldRoom.bots : buildWeeklyBots(st.weeklyRoomSeed || 1);
    const myXp = Math.max(0, Math.round(st.weeklyXp));
    const pos = 1 + bots.filter(b => b.cap > myXp).length;

    const L = WEEKLY_LEAGUES[leagueIdx];
    const nextIdx = Math.min(WEEKLY_LEAGUES.length - 1, leagueIdx + 1);
    const prevIdx = Math.max(0, leagueIdx - 1);
    const isLast = leagueIdx === WEEKLY_LEAGUES.length - 1;
    const res = { leagueIdx, pos, xp: myXp, prevName: L.name, out: 'hold', bonusCoins: 0, title: '', text: '' };

    if (pos <= ZONE_PROMOTE) {
      st.weeklyLeague = nextIdx;
      st.coins += L.promoteCoins;
      res.out = 'promote';
      res.bonusCoins = L.promoteCoins;
      res.title = isLast ? 'Ты в топ-7 элиты!' : `Повышение: лига «${WEEKLY_LEAGUES[nextIdx].name}»`;
      res.text = `Место #${pos} из ${WEEKLY_SIZE}. Награда: +${L.promoteCoins} 🎵.`;
    } else if (pos >= ZONE_DROP_FROM && leagueIdx > 0) {
      st.weeklyLeague = prevIdx;
      st.coins += L.midCoins;
      res.out = 'drop';
      res.bonusCoins = L.midCoins;
      res.title = 'Понижение лиги';
      res.text = `Место #${pos} из ${WEEKLY_SIZE}. Возвращаешься в лигу «${WEEKLY_LEAGUES[prevIdx].name}». Утешение: +${L.midCoins} 🎵.`;
    } else {
      st.coins += L.midCoins;
      res.out = 'hold';
      res.bonusCoins = L.midCoins;
      res.title = 'Лига сохранена';
      res.text = `Место #${pos} из ${WEEKLY_SIZE}. Остаёшься в лиге «${L.name}». Награда: +${L.midCoins} 🎵.`;
    }

    // Новая неделя: сбрасываем недельный XP и генерируем 29 новых соперников.
    st.weeklyXp = 0;
    delete st.weeklyRoom;
    ensureWeeklyRoom();
    window.__weeklyLastResult = res;
    pendingWeeklyResult = true;
    save(false);
    return res;
  }

  window.showWeeklyResult = function (res) {
    res = res || window.__weeklyLastResult;
    if (!res) return;
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    const icon = res.out === 'promote' ? '🎉' : (res.out === 'drop' ? '⬇️' : '⚪');
    const color = res.out === 'promote' ? 'var(--success)' : (res.out === 'drop' ? 'var(--danger)' : 'var(--cyan)');
    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box wr-result-box">
        <div style="font-size:34px">${icon}</div>
        <div class="wr-big" style="color:${color}">${escapeHtml(res.title)}</div>
        <div style="font-size:12px;color:var(--cyan);font-weight:800">Итог недели в лиге «${escapeHtml(res.prevName)}»</div>
        <div class="wr-sub">${escapeHtml(res.text)}</div>
        <div style="font-size:12px;color:var(--muted)">Твой XP за неделю: <b style="color:#fff">${res.xp}</b></div>
        <button class="btn full" style="margin-top:12px" onclick="document.getElementById('pack-modal').classList.remove('open');switchTab('rank')">К турниру</button>
      </div>`;
    window.__weeklyLastResult = null;
    if (typeof haptic === 'function') haptic(res.out === 'drop' ? 'err' : 'ok');
    if (res.out === 'promote' && typeof sfx === 'function') sfx('win');
  };

  window.getLastWeeklyResult = function () { return window.__weeklyLastResult || null; };

  /* Старой гачи и бонуса Биаса больше нет: команда не даёт пассивных процентов. */
  window.getTeamBonuses = function () {
    return { coinsPct: 0, hypePct: 0 };
  };

  window.getEnergyRegenMs = function () {
    return BASE_ENERGY_MS;
  };

  /* ====== ПРОФИЛЬ СТУДИИ: СМЕНА НАЗВАНИЯ И УРОВЕНЬ ====== */
  window.openProfileModal = function () {
    haptic('light');
    initStudioState();
    const lvl = getStudioLevel(st.xp);

    profileOverlay.innerHTML = `
      <div class="ov-header">
        <div>
          <div style="font-size:16px;font-weight:900">Студия</div>
          <div style="font-size:11px;color:var(--muted)">ID: ${escapeHtml(st.producerId)} • ${lvl.xp} XP</div>
        </div>
        <button class="close-btn" style="width:32px;height:32px;font-size:15px" onclick="document.getElementById('profile-overlay').classList.remove('open')">✕</button>
      </div>
      <div class="ov-scroll">
        <div class="card-box" style="margin-bottom:14px;text-align:center">
          <div style="font-size:34px;margin-bottom:8px">${lvl.era.icon}</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Название твоей студии</div>
          <div style="display:flex;gap:8px;margin-bottom:10px">
            <input id="prof-name-in" class="onb-input" style="margin:0;padding:9px 12px;font-size:14px;text-align:left" maxlength="22" value="${escapeHtml(st.agencyName)}">
            <button class="btn cyan" id="prof-name-save" style="padding:0 14px">Ок</button>
          </div>
          <div class="studio-lvl" style="color:${lvl.era.color}">Уровень ${lvl.level} • ${escapeHtml(lvl.era.name)}</div>
          <div class="bar-bg"><div class="bar-fill" style="width:${lvl.pct}%"></div></div>
          <div style="font-size:11px;color:var(--muted);margin-top:6px">${lvl.nextXp ? `До следующего уровня: ${lvl.toNext} XP` : 'Максимальный уровень студии'}</div>
        </div>
      </div>`;

    document.getElementById('prof-name-save').onclick = () => {
      const n = document.getElementById('prof-name-in').value.trim();
      if (n) { st.agencyName = n.slice(0, 22); save(); haptic('ok'); alert('Название обновлено!'); renderBinder(); }
    };
    profileOverlay.classList.add('open');
  };

  window.setStudioSubTab = function (t) { haptic('light'); studioSubTab = t; renderBinder(); };

  /* ====== ЭКРАН СТУДИИ (2 ВКЛАДКИ: ГРУППА | КВЕСТЫ) ====== */
  window.renderBinder = function () {
    initStudioState();
    const screen = document.getElementById('screen-binder');
    if (!screen) return;
    const lvl = getStudioLevel(st.xp);
    const vocab = Array.isArray(window.VOCAB) ? window.VOCAB : [];
    const rules = Array.isArray(window.RULES) ? window.RULES : [];
    const learnedWords = vocab.filter(w => st.done.includes(w.l)).length;
    const learnedRules = rules.filter(r => st.done.includes(r.l)).length;

    screen.innerHTML = `
      <div class="studio-head">
        <div class="studio-name" onclick="openProfileModal()">
          <span>${escapeHtml(st.agencyName)}</span>
          <span class="sn-arrow">›</span>
        </div>
        <div class="studio-lvl" style="color:${lvl.era.color};border-color:${lvl.era.color}66">${lvl.era.icon} Уровень ${lvl.level} • ${escapeHtml(lvl.era.name)}</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${lvl.pct}%"></div></div>
        <div class="studio-xp-note">${lvl.nextXp ? `До уровня ${lvl.level + 1}: ${lvl.toNext} XP` : 'Максимальный уровень студии'}</div>
        <div class="studio-meta">
          <span>🔥 Серия ${st.streak.count} дн.</span>
          <span class="freeze-pill ${st.streakFreeze > 0 ? '' : 'empty'}" onclick="showStreakInfo()">❄️ ${st.streakFreeze}/${STREAK_FREEZE_MAX}</span>
          <span>Слов: <b style="color:#fff">${learnedWords}/${vocab.length}</b> • Правил: <b style="color:#fff">${learnedRules}/${rules.length}</b></span>
        </div>
      </div>

      <div class="mode-switch">
        <button class="mode-btn ${studioSubTab === 'group' ? 'active' : ''}" onclick="setStudioSubTab('group')">Группа</button>
        <button class="mode-btn ${studioSubTab === 'quests' ? 'active' : ''}" onclick="setStudioSubTab('quests')">Квесты</button>
      </div>
      <div id="studio-sub-body"></div>
    `;

    const sub = document.getElementById('studio-sub-body');

    if (studioSubTab === 'group') {
      sub.innerHTML = `
        <div class="hero-grid">
          ${HEROES.map(h => {
            const eps = episodesForHero(h.id);
            const openEps = eps.filter(ep => isEpisodeOpen(ep, lvl.level));
            const unread = unreadEpisodesForHero(h.id, lvl.level);
            const firstLevel = eps.length ? Math.min(...eps.map(ep => Number(ep.unlockLevel) || 1)) : 1;
            const caption = !eps.length ? 'Скоро новые заметки'
              : (openEps.length === 0 ? `Эпизоды с уровня ${firstLevel}`
                : (unread.length ? `${unread.length} новых 💬` : `${openEps.length} из ${eps.length} прочитано`));
            return `<div class="hero-card" onclick="openHeroModal('${h.id}')" style="border-color:${unread.length ? h.color + '66' : 'rgba(255,255,255,0.07)'}">
              ${unread.length ? '<div class="hero-cloud">💬</div>' : ''}
              ${heroAvatarHtml(h, 84)}
              <div class="hero-name">${escapeHtml(h.name)}</div>
              <div class="hero-role">${escapeHtml(h.role)}</div>
              <div class="hero-count">${caption}</div>
            </div>`;
          }).join('')}
        </div>
        <div class="studio-empty">Тапни по герою, чтобы прочитать живые заметки о Корее и K-pop. За каждый эпизод — <b style="color:#fde68a">+10 🎵</b>.</div>
      `;
    }

    if (studioSubTab === 'quests') {
      const d = st.daily, m = st.monthly, w = st.weekly;
      // На случай старых сохранений, где счётчики уже заполнены, а флаги ещё нет.
      syncQuestProgress();
      grantDailyQuestRewards();   // каждого закрытого дейлика — своя награда
      const dCnt = dailyDoneCount();
      const wCnt = Math.min(w.days.length, 5);
      const curMonthIdx = new Date().getMonth(), curYear = new Date().getFullYear();
      const moCur = MONTHS[curMonthIdx];
      const monthPts = Math.min(m.pts, MONTHLY_GOAL);
      const monthGot = st.monthlyBadges.includes(`${curYear}-${curMonthIdx}`);

      sub.innerHTML = `
        <div class="quest-sec" style="margin-top:4px"><span>Ежедневные задания • ${dCnt}/5</span><span style="color:#ff85cb">⚡ ${st.weeklyXp} XP за неделю</span></div>
        ${DAILY_QUESTS.map(q => {
          const rep = `<div class="c-rew">+${q.coins} 🎵 • +${q.xp} XP</div>`;
          return `<div class="contract-row ${isQuestDone(q) ? 'done' : ''}">
            <div style="flex:1"><div class="c-title">${isQuestDone(q) ? '✓ ' : ''}${escapeHtml(q.title)}</div><div style="font-size:10px;color:var(--muted)">${escapeHtml(q.desc)}</div>${rep}</div>
            <div class="c-prog">${Math.min(q.val(d), q.goal)}/${q.goal}</div>
          </div>`;
        }).join('')}
        <div class="daily-prize">
          <div style="font-size:12px;font-weight:800;margin-bottom:8px">Бонус за все 5 заданий: +${DAILY_ALL_BONUS_COINS} 🎵 и +${DAILY_ALL_BONUS_XP} XP</div>
          ${dCnt === DAILY_QUESTS.length && !d.claimed ? `<button class="btn gold full" id="claim-daily">Забрать бонус дня!</button>` : (d.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Получено сегодня</div>` : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((dCnt / DAILY_QUESTS.length) * 100)}%"></div></div>`)}
          <div class="daily-prize-count">${dCnt}/5</div>
        </div>

        <div class="quest-sec"><span>Еженедельный челлендж</span><span style="color:var(--cyan)">${wCnt}/5 дней</span></div>
        <div class="daily-prize">
          <div style="font-size:12px;font-weight:800;margin-bottom:6px">5 дней с уроками → +40 🎵</div>
          ${w.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Получено на этой неделе</div>`
            : (wCnt >= 5 ? `<button class="btn gold full" id="claim-weekly">Забрать +40 🎵</button>`
              : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((wCnt / 5) * 100)}%"></div></div>`)}
        </div>

        <div class="quest-sec"><span>Квест месяца</span><span>${st.monthlyBadges.length}/12 бейджей</span></div>
        <div class="month-quest" style="--mq:${moCur.col}">
          <div class="mq-head">
            <div class="mq-disc">💿</div>
            <div style="flex:1;min-width:0">
              <div class="mq-title">Квест ${MONTH_NAMES[curMonthIdx]} • ${monthPts}/${MONTHLY_GOAL}</div>
              <div class="mq-sub">${monthGot ? '🏅 Бейдж месяца уже в архиве!' : 'Закрывай ежедневные задания (+1 очко за квест), чтобы получить бейдж месяца и +150 🎵'}</div>
            </div>
            <div class="mq-ico">${moCur.icon}</div>
          </div>
          <div class="mq-bar"><div class="mq-fill" style="width:${Math.round((monthPts / MONTHLY_GOAL) * 100)}%"></div></div>
          ${monthGot ? `<div class="mq-btn-done">✓ Получено</div>`
            : (monthPts >= MONTHLY_GOAL ? `<button class="btn gold full" id="claim-month" style="margin-top:10px">Забрать бейдж ${MONTH_NAMES[curMonthIdx]} + 150 🎵</button>`
              : '')}
        </div>
        <div class="badges-grid">
          ${MONTHS.map(mo => {
            const key = `${curYear}-${mo.m}`, got = st.monthlyBadges.includes(key), isCur = mo.m === curMonthIdx;
            return `<div class="m-badge ${got ? 'got' : (isCur ? 'cur' : '')}" style="${got ? `border-color:${mo.col}` : ''}"><div class="m-badge-ico">${(got || isCur) ? mo.icon : '🔒'}</div><div class="m-badge-name">${mo.name}</div></div>`;
          }).join('')}
        </div>`;

      const cd = document.getElementById('claim-daily');
      if (cd) cd.onclick = () => {
        syncQuestProgress();
        st.daily.claimed = true;
        st.coins += DAILY_ALL_BONUS_COINS;
        st.xp += DAILY_ALL_BONUS_XP;
        if (typeof window.addWeeklyXp === 'function') window.addWeeklyXp(DAILY_ALL_BONUS_XP);
        else st.weeklyXp = (st.weeklyXp || 0) + DAILY_ALL_BONUS_XP;
        save(); haptic('ok'); sfx('win'); fireConfetti();
        alert(`Бонус дня получен: +${DAILY_ALL_BONUS_COINS} 🎵 и +${DAILY_ALL_BONUS_XP} XP!`);
        renderBinder();
      };

      const cw = document.getElementById('claim-weekly');
      if (cw) cw.onclick = () => {
        st.weekly.claimed = true;
        st.coins += 40;
        save(); haptic('ok'); sfx('win'); fireConfetti();
        alert('Челлендж недели закрыт: +40 🎵!');
        renderBinder();
      };

      /* Бейдж месяца: сразу закрываем цель — квест считается сданным в день получения. */
      const cm = document.getElementById('claim-month');
      if (cm) cm.onclick = () => {
        syncQuestProgress();
        st.coins += 150;
        save(); haptic('ok'); sfx('win'); fireConfetti();
        alert(`🏅 Бейдж «${MONTH_NAMES[new Date().getMonth()]}» получен! +150 🎵`);
        renderBinder();
      };
    }
  };

  /* ====== МАГАЗИН (ЭКРАН) + АНИМАЦИЯ ВИНИЛОВОГО БОКСА ====== */
  const XP_BOOST_PRICE = 120;
  const XP_BOOST_MS = 24 * 60 * 60 * 1000;

  function energyWaitText() {
    return st.energy >= MAX_ENERGY
      ? 'Полный заряд'
      : `+1 через ${fmtWait(getEnergyRegenMs() - (Date.now() - st.lastEnergyTs))}`;
  }

  function fmtBoostLeft(ms) {
    const total = Math.max(0, Math.ceil(ms / 60000));
    const h = Math.floor(total / 60), m = total % 60;
    return h > 0 ? `${h}ч ${m}м` : `${m}м`;
  }

  /* Перерисовывает магазин, только если он сейчас открыт. */
  function refreshQuickShop() {
    const screen = document.getElementById('screen-shop');
    if (screen && screen.classList.contains('active')) window.renderShop();
  }

  /* Совместимость со старым именем: открывает 5-ю вкладку «Магазин». */
  window.openQuickShop = function (message) {
    if (typeof window.switchTab === 'function') window.switchTab('shop');
    if (message) showToast(message);
  };

  window.buyXpBoost = function () {
    initStudioState();
    if (st.xpBoostUntil && Date.now() < st.xpBoostUntil) return alert('Бустер ×2 XP уже работает.');
    if (st.coins < XP_BOOST_PRICE) return alert(`Нужно ${XP_BOOST_PRICE} 🎵.`);
    st.coins -= XP_BOOST_PRICE;
    st.xpBoostUntil = Date.now() + XP_BOOST_MS;
    save(); haptic('ok'); sfx('win');
    alert('⚡ Удвоитель XP активирован на 24 часа!');
    window.renderShop();
  };

  /* Полноценный экран «Магазин»: 4 понятные карточки без гача-боксов. */
  window.renderShop = function () {
    const screen = document.getElementById('screen-shop');
    if (!screen) return;
    initStudioState();
    syncResources();
    const boostActive = !!(st.xpBoostUntil && Date.now() < st.xpBoostUntil);
    const boostLeft = boostActive ? fmtBoostLeft(st.xpBoostUntil - Date.now()) : '';
    const freezeFull = st.streakFreeze >= STREAK_FREEZE_MAX;
    const energyFull = st.energy >= MAX_ENERGY;

    screen.innerHTML = `
      <div class="shop-head">
        <div class="shop-head-title">Магазин</div>
        <div class="shop-balance">🎵 ${st.coins}</div>
      </div>

      <div class="shop-card vip">
        <div class="shop-card-ico">👑</div>
        <div class="shop-info">
          <div class="shop-title">VIP-статус</div>
          <div class="shop-sub">Безлимитные лайтстики ⚡ + 2 заморозки стрика ❄️ сразу при покупке</div>
        </div>
        <button class="btn ghost shop-buy" id="shop-vip">Скоро • Telegram Stars</button>
      </div>

      <div class="shop-card">
        <div class="shop-card-ico">⚡</div>
        <div class="shop-info">
          <div class="shop-title">Удвоитель XP (24 часа)</div>
          <div class="shop-sub">${boostActive ? `Активен ещё ${boostLeft}` : 'Удваивает XP за каждый урок и задание'}</div>
        </div>
        <button class="btn shop-buy" id="shop-boost" ${boostActive ? 'disabled' : ''}>${boostActive ? 'Активен' : XP_BOOST_PRICE + ' 🎵'}</button>
      </div>

      <div class="shop-card">
        <div class="shop-card-ico">❄️</div>
        <div class="shop-info">
          <div class="shop-title">Заморозка стрика</div>
          <div class="shop-sub">Спасает серию при пропуске 1 дня • в запасе ${st.streakFreeze}/${STREAK_FREEZE_MAX}</div>
        </div>
        <button class="btn ${freezeFull ? 'ghost' : ''} shop-buy" id="shop-freeze" ${freezeFull ? 'disabled' : ''}>${freezeFull ? 'Максимум' : STREAK_FREEZE_PRICE + ' 🎵'}</button>
      </div>

      <div class="shop-card">
        <div class="shop-card-ico">⚡</div>
        <div class="shop-info">
          <div class="shop-title">Лайтстики • ${st.energy}/${MAX_ENERGY}</div>
          <div class="shop-sub">${escapeHtml(energyWaitText())}</div>
        </div>
        <div class="shop-actions">
          <button class="btn cyan shop-buy" id="shop-energy1" ${energyFull ? 'disabled' : ''}>+1 заряд (30 🎵)</button>
          <button class="btn ghost shop-buy" id="shop-energy-full" ${energyFull ? 'disabled' : ''}>Полный 5/5 (100 🎵)</button>
        </div>
      </div>
      <div class="shop-note">Покупки списывают Ноты 🎵. Лайтстики восстанавливаются сами: 1 заряд / 2 часа.</div>
    `;

    const vipBtn = document.getElementById('shop-vip');
    if (vipBtn) vipBtn.onclick = () => { haptic('light'); showToast('Оплата через Telegram Stars скоро появится!'); };
    const boostBtn = document.getElementById('shop-boost');
    if (boostBtn) boostBtn.onclick = () => window.buyXpBoost();
    const freezeBtn = document.getElementById('shop-freeze');
    if (freezeBtn) freezeBtn.onclick = () => window.buyStreakFreeze();
    const e1 = document.getElementById('shop-energy1');
    if (e1) e1.onclick = () => buyEnergy(1, 30);
    const ef = document.getElementById('shop-energy-full');
    if (ef) ef.onclick = () => buyEnergy(5, 100);
  };

  /* ====== ТОП: НЕДЕЛЬНЫЙ ТУРНИР ИЗ 30 СТУДИЙ (3 ЗОНЫ) ====== */
  /* Разделители зон: только короткая плашка, без номеров мест. */
  function zoneHeadHtml(cls) {
    if (cls === 'zone-promote') return '<div class="zone-head zone-promote">▲ Зона повышения</div>';
    if (cls === 'zone-drop') return '<div class="zone-head zone-drop">▼ Зона вылета</div>';
    return '<div class="zone-head zone-hold">Зона сохранения</div>';
  }

  function renderRankRows(rows) {
    let html = '', lastZone = null;
    rows.forEach(r => {
      const z = zoneInfo(r.pos);
      if (z.cls !== lastZone) {
        lastZone = z.cls;
        html += zoneHeadHtml(z.cls);
      }
      const medalCls = r.pos <= 3 ? `top top${r.pos}` : '';
      const posHtml = r.pos <= 3
        ? `<div class="wr-pos medal">${r.pos}</div>`
        : `<div class="wr-pos">#${r.pos}</div>`;
      html += `<div class="wr-row ${r.me ? 'me' : ''} ${medalCls}">
        ${posHtml}
        <div class="wr-ava" style="background:${r.grad}">${escapeHtml(r.initials)}</div>
        <div class="wr-name">${escapeHtml(r.name)}${r.me ? ' • ты' : ''}</div>
        <div class="wr-score">${r.xp} XP</div>
      </div>`;
    });
    return html;
  }

  /* Модалка наград текущей лиги (по кнопке «🏆 Награды»). */
  window.openLeaguePrizes = function () {
    initStudioState();
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    const leagueIdx = Math.max(0, Math.min(WEEKLY_LEAGUES.length - 1, st.weeklyLeague || 0));
    const L = WEEKLY_LEAGUES[leagueIdx];
    const next = WEEKLY_LEAGUES[leagueIdx + 1] || null;

    /* Компактный вертикальный список из 5 лиг: названия не обрезаются. */
    const chain = WEEKLY_LEAGUES.map((lg, i) => {
      const cls = i === leagueIdx ? 'cur' : (i < leagueIdx ? 'past' : '');
      const tag = i === leagueIdx ? 'сейчас' : (i === leagueIdx + 1 ? 'дальше' : '');
      return `<div class="ch-row ${cls}">
        <span class="ch-ico">${lg.icon}</span>
        <span class="ch-name">${escapeHtml(lg.name)}</span>
        ${tag ? `<span class="ch-tag">${tag}</span>` : ''}
      </div>`;
    }).join('');
    const card = (cls, ico, title, val) =>
      `<div class="wr-prize-card ${cls}"><span style="font-size:15px">${ico}</span><span class="p-title">${title}</span>${val ? `<span class="p-val">${val}</span>` : ''}</div>`;

    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box wr-prize-box">
        <div style="font-size:16px;font-weight:900">🏆 Награды лиги «${escapeHtml(L.name)}»</div>
        <div style="font-size:11px;color:var(--muted);margin-top:3px">Итоги недели подводятся каждый понедельник в 00:00</div>
        <div class="wr-prize-chain">
          <div class="ch-label">Путь по лигам</div>
          ${chain}
        </div>
        ${card('p-promote', '▲',
          next ? `1–7 место • Повышение в «${escapeHtml(next.name)}»` : '1–7 место • Топ элиты',
          `+${L.promoteCoins} 🎵`)}
        ${leagueIdx > 0
          ? card('p-hold', '⚪', '8–22 место • Удержание лиги', `+${L.midCoins} 🎵`)
          : card('p-hold', '⚪', '8 место и ниже • Удержание лиги', `+${L.midCoins} 🎵`)}
        ${leagueIdx > 0 ? card('p-drop', '▼', '23–30 место • Понижение на 1 лигу', '') : ''}
        <div class="wr-prize-tip">💡 Очки XP начисляются за уроки, диктанты и задания дня.</div>
        <button class="btn full" onclick="document.getElementById('pack-modal').classList.remove('open')">Понятно</button>
      </div>`;
    if (typeof haptic === 'function') haptic('light');
  };

  window.renderRank = function () {
    if (!Array.isArray(window.CARDS)) return;
    initStudioState();
    const screen = document.getElementById('screen-rank');
    if (!screen) return;

    st.weeklyXp = Math.max(0, Math.round(st.weeklyXp || 0));
    const leagueIdx = Math.max(0, Math.min(WEEKLY_LEAGUES.length - 1, st.weeklyLeague || 0));
    const league = WEEKLY_LEAGUES[leagueIdx];
    const rows = weeklyBoard();
    const left = weekStartTs() + 7 * 86400000 - Date.now();

    /* Ряд из 5 крупных значков: пройденные и текущая — цветные, будущие — серые. */
    const strip = WEEKLY_LEAGUES.map((lg, i) => {
      const cls = i === leagueIdx ? 'cur' : (i < leagueIdx ? 'past' : 'next');
      return `<div class="lg-step ${cls}" style="--c:${lg.color}">
        <div class="lg-ico">${lg.icon}</div>
        <div class="lg-nm">${escapeHtml(lg.short || lg.name)}</div>
      </div>`;
    }).join('');

    screen.innerHTML = `
      <div class="lg-strip">${strip}</div>
      <div class="lg-now">
        <div class="lg-now-name" style="color:${league.color}">${league.icon} ${escapeHtml(league.name)}</div>
        <div class="lg-now-side">
          <div class="lg-timer" id="wr-timer">⏱️ ${fmtWeekLeft(left)}</div>
          <button class="lg-prizes" onclick="openLeaguePrizes()">🏆 Награды</button>
        </div>
      </div>

      <div id="rank-list">${renderRankRows(rows)}</div>`;

    // Живой таймер и пересчёт очков ботов (по времени с начала недели).
    if (weeklyTickTimer) clearInterval(weeklyTickTimer);
    weeklyTickTimer = setInterval(() => {
      const t = document.getElementById('wr-timer');
      if (!t || !document.getElementById('screen-rank')?.classList.contains('active')) {
        clearInterval(weeklyTickTimer);
        weeklyTickTimer = null;
        return;
      }
      t.textContent = '⏱️ ' + fmtWeekLeft(weekStartTs() + 7 * 86400000 - Date.now());
    }, 30000);
  };

  /* ====== УРОКИ: ТРЕКИНГ ДИКТАНТА И КОМБО ДЛЯ ДЕЙЛИКОВ ====== */
  const origRenderStep = window.renderStep;
  window.renderStep = function () {
    origRenderStep();
    const body = document.getElementById('study-body');
    const s = queue[qIdx];

    // Успешный шаг диктанта/аудио → дейлик «Идеальный слух» и +5 недельного XP.
    if (body && s && (s.type === 'draw' || s.type === 'listen' || s.type === 'listen_build')) {
      body.querySelectorAll('.feedback-bar.ok').forEach(fb => {
        if (fb.dataset.dictTracked) return;
        fb.dataset.dictTracked = '1';
        if (typeof window.awardDictationStep === 'function') window.awardDictationStep();
      });
    }

    if (!body || !s || (s.type !== 'choice' && s.type !== 'listen')) return;

    // Новый урок — начинаем серию верных ответов заново.
    const lessonId = (typeof curL !== 'undefined' && curL) ? curL.id : null;
    if (lessonId !== comboTrackedLessonId) {
      comboTrackedLessonId = lessonId;
      lessonComboRun = 0;
      lessonMaxCombo = 0;
    }

    // Комбо нужно только для дейлика «Чистый бит» — без панели талантов.
    const opts = Array.from(body.querySelectorAll('.opt-btn'));
    opts.forEach((btn, idx) => {
      const origClick = btn.onclick;
      btn.onclick = () => {
        if (idx === s.correct) {
          lessonComboRun++;
          if (lessonComboRun > lessonMaxCombo) lessonMaxCombo = lessonComboRun;
        } else {
          lessonComboRun = 0;
        }
        if (typeof origClick === 'function') origClick();
      };
    });
  };

  const origFinishLesson = window.finishLesson;
  window.finishLesson = function () {
    if (!curL) return origFinishLesson();
    const passed = !(curL.isExam && mistakes > 4);

    // Награды (XP, Ноты 🎵, бустер ×2 и комбо) считает единая функция в index.html.
    origFinishLesson();
    if (!passed) return;

    initStudioState();
    window.trackQuest('lesson');
    // Дейлик «Чистый бит»: за урок накопилось комбо 3+ верных ответов подряд.
    if (lessonMaxCombo > 0) window.trackQuest('combo', lessonMaxCombo);
    lessonComboRun = 0;
    lessonMaxCombo = 0;
    comboTrackedLessonId = null;

    syncResources();
    save();
  };

  const navBinder = document.getElementById('nav-binder');
  if (navBinder && navBinder.lastChild) navBinder.lastChild.textContent = 'Студия';

  function bootStudio() {
    initStudioState();
    syncResources();   // обновляем шапку (стрик 🔥, ноты 🎵, лайтстики ⚡)
    renderLessons();
    // Сработала заморозка ❄️ — короткое уведомление.
    const hadFreeze = pendingFreezeToast;
    if (pendingFreezeToast) {
      pendingFreezeToast = false;
      showToast(`❄️ Заморозка спасла серию 🔥 ${st.streak.count} дн.! Осталось: ${st.streakFreeze}/${STREAK_FREEZE_MAX}`, 3200);
    }
    // Веха серии: 5, 10, 15… дней подряд — +30 🎵.
    const streakReward = pendingStreakReward;
    pendingStreakReward = 0;
    if (streakReward) {
      setTimeout(() => showToast(`🔥 Серия ${streakReward} дней! Награда: +30 🎵`, 3200), hadFreeze ? 3600 : 0);
    }
    // Первый вход после понедельника — показываем итоги недели.
    if (pendingWeeklyResult || window.__weeklyLastResult) {
      pendingWeeklyResult = false;
      setTimeout(() => { if (!document.querySelector('.modal-bg.open')) window.showWeeklyResult(); }, 700);
    }
  }

  if (window.AppData) window.AppData.whenReady(bootStudio);
  else bootStudio();
})();
