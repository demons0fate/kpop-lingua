/* ====== СТУДИЯ 2.0: ТАЛАНТЫ В УРОКАХ, КАССА, ПЛОЩАДКИ, АПГРЕЙДЫ, АВАТАРКИ ИЗ КАРТ И РАМКИ ЛИГ ====== */
(function () {
  const ROLES = [
    { key: "vocal",  title: "Вокал",  ico: "🛡️", talent: "Чистая нота", desc: "Прощает ошибки в уроке" },
    { key: "dance",  title: "Танцор", ico: "🔥", talent: "Ритм-комбо",  desc: "Бонус XP за серию + энергия" },
    { key: "rap",    title: "Рэпер",  ico: "⚡", talent: "Хайп зала",   desc: "Шанс ×2 микрофонов" },
    { key: "visual", title: "Вижуал", ico: "✨", talent: "Фансервис",   desc: "Подсказка 50/50 в уроках" }
  ];

  const TIERS = ["silver", "gold", "platinum", "neon"];
  const TIER_META = {
    silver:   { name: "Серебро", mult: 1.0, power: 100, color: "#cfd8dc", shields: 1, hints: 1, comboPct: 15, hypePct: 15 },
    gold:     { name: "Золото",  mult: 1.5, power: 220, color: "#ffd700", shields: 1, hints: 2, comboPct: 25, hypePct: 25 },
    platinum: { name: "Платина", mult: 2.2, power: 400, color: "#6ed9b2", shields: 2, hints: 2, comboPct: 35, hypePct: 35 },
    neon:     { name: "Неон",    mult: 3.0, power: 700, color: "#ff2e93", shields: 3, hints: 3, comboPct: 50, hypePct: 50 }
  };

  /* 12 ступеней Лиг: задают рамку профиля и потолок апгрейдов студии */
  const LEAGUES = [
    { id: "bronze1", name: "Трейни I",        minXp: 0,    icon: "◆", cls: "lg-bronze", color: "#cd9b6a", maxUpg: 2 },
    { id: "bronze2", name: "Трейни II",       minXp: 100,  icon: "◆", cls: "lg-bronze", color: "#cd9b6a", maxUpg: 3 },
    { id: "bronze3", name: "Трейни III",      minXp: 220,  icon: "◆", cls: "lg-bronze", color: "#cd9b6a", maxUpg: 4 },
    { id: "silver1", name: "Инди-лейбл I",    minXp: 360,  icon: "◈", cls: "lg-silver", color: "#cfd8dc", maxUpg: 5 },
    { id: "silver2", name: "Инди-лейбл II",   minXp: 520,  icon: "◈", cls: "lg-silver", color: "#cfd8dc", maxUpg: 5 },
    { id: "silver3", name: "Инди-лейбл III",  minXp: 700,  icon: "◈", cls: "lg-silver", color: "#cfd8dc", maxUpg: 6 },
    { id: "gold1",   name: "Топ-лейбл I",     minXp: 900,  icon: "★", cls: "lg-gold",   color: "#ffd700", maxUpg: 7 },
    { id: "gold2",   name: "Топ-лейбл II",    minXp: 1150, icon: "★", cls: "lg-gold",   color: "#ffd700", maxUpg: 8 },
    { id: "gold3",   name: "Топ-лейбл III",   minXp: 1450, icon: "★", cls: "lg-gold",   color: "#ffd700", maxUpg: 8 },
    { id: "neon1",   name: "Мировой чарт I",  minXp: 1800, icon: "✦", cls: "lg-neon",   color: "#ff2e93", maxUpg: 9 },
    { id: "neon2",   name: "Мировой чарт II", minXp: 2200, icon: "✦", cls: "lg-neon",   color: "#ff2e93", maxUpg: 10 },
    { id: "neon3",   name: "Мировой чарт III",minXp: 2700, icon: "✦", cls: "lg-neon",   color: "#ff2e93", maxUpg: 10 }
  ];

  /* Площадки карьеры: открывают новые Эры карт */
  const STAGES = [
    { idx: 0, name: "Улица Хондэ",     era: "trainee", reqLessons: 0, reqExam: false, reqFandom: 0,    rateMult: 1.0, ico: "🎸" },
    { idx: 1, name: "Клуб в Сеуле",    era: "debut",   reqLessons: 4, reqExam: false, reqFandom: 500,  rateMult: 1.5, ico: "🎤" },
    { idx: 2, name: "Музыкальное шоу", era: "neon",    reqLessons: 8, reqExam: true,  reqFandom: 1400, rateMult: 2.2, ico: "📺", reqModule: "block-1" },
    { idx: 3, name: "Мировой стадион", era: "tour",    reqLessons: 9, reqExam: true,  reqFandom: 3000, rateMult: 3.2, ico: "🏟️", reqModule: "block-1" }
  ];

  /* 4 апгрейда студии за микрофоны */
  const UPGRADES = [
    { key: "practice", name: "Зал практики",  ico: "🪞", baseCost: 60,  desc: "+80 к Фандому за ур." },
    { key: "sound",    name: "Звукозапись",   ico: "🎚️", baseCost: 80,  desc: "+5% к 🎤 за уроки" },
    { key: "pr",       name: "Пиар-отдел",    ico: "📢", baseCost: 100, desc: "+15% к доходу кассы" },
    { key: "cafe",     name: "Кафетерий",     ico: "☕", baseCost: 90,  desc: "-5 мин к таймеру ⚡" }
  ];

  const MONTHS = [
    { m: 0, name: "Янв", icon: "❄️", col: "#00e5ff" }, { m: 1, name: "Фев", icon: "💜", col: "#b46eff" },
    { m: 2, name: "Мар", icon: "🌸", col: "#ff7ac6" }, { m: 3, name: "Апр", icon: "🎧", col: "#00c6ff" },
    { m: 4, name: "Май", icon: "⚡", col: "#ffd700" }, { m: 5, name: "Июн", icon: "🌟", col: "#ff9f43" },
    { m: 6, name: "Июл", icon: "🌊", col: "#00d2d3" }, { m: 7, name: "Авг", icon: "🔥", col: "#ff4757" },
    { m: 8, name: "Сен", icon: "🎙️", col: "#a56eff" }, { m: 9, name: "Окт", icon: "🌙", col: "#ff6b81" },
    { m: 10, name: "Ноя", icon: "💿", col: "#00e5ff" }, { m: 11, name: "Дек", icon: "👑", col: "#ffd700" }
  ];

  const MONTHLY_GOAL = 50;

  /* ====== НЕДЕЛЬНЫЕ ЛИГИ (5 ступеней) и награды за итог недели ====== */
  const WEEKLY_LEAGUES = [
    { name: "Трейни",           icon: "🎧", color: "#cd9b6a", promoteBox: "Золотой бокс",    promoteCoins: 300, midCoins: 100 },
    { name: "Инди",             icon: "🎸", color: "#cfd8dc", promoteBox: "Золотой бокс",    promoteCoins: 400, midCoins: 100 },
    { name: "Восходящая группа", icon: "🎤", color: "#00e5ff", promoteBox: "Платиновый бокс", promoteCoins: 500, midCoins: 100 },
    { name: "Топ-лейбл",        icon: "★",  color: "#ffd700", promoteBox: "Платиновый бокс", promoteCoins: 600, midCoins: 100 },
    { name: "Мировой чарт",     icon: "✦",  color: "#ff2e93", promoteBox: "Платиновый бокс", promoteCoins: 800, midCoins: 100 }
  ];
  const WEEKLY_SIZE = 30;          // 30 студий в турнирной комнате
  const ZONE_PROMOTE = 7;          // места 1–7 — зона повышения
  const ZONE_DROP_FROM = 23;       // места 23–30 — зона вылета (кроме 1-й лиги)
  const STREAK_FREEZE_MAX = 2;
  const STREAK_FREEZE_PRICE = 250;

  const BOX_IMAGES = { silver: '', gold: '', platinum: '', vinyl: '' };
  let studioSubTab = 'group'; // 'group' | 'studio' | 'quests'
  let shopSubTab = 'boxes';   // 'boxes' | 'vip'
  let lessonTalents = { shields: 0, hints: 0, combo: 0, comboPct: 0, hypePct: 0 };

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
    .daily-prize-items { display: flex; gap: 8px; flex-wrap: wrap; margin: 4px 0 8px; font-size: 11px; font-weight: 800; color: #ffe9a8; }
    .c-rew { font-size: 11px; color: #ff9ad6; font-weight: 800; white-space: nowrap; }
    .freeze-pill { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9px; border: 1px solid rgba(0,229,255,0.45); background: rgba(0,229,255,0.12); color: #bdf7ff; margin-left: 4px; vertical-align: middle; cursor: pointer; }
    .freeze-pill.empty { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.05); color: var(--muted); }

    .wr-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
    .wr-place { font-size: 12px; color: var(--muted); font-weight: 800; margin-top: 4px; cursor: pointer; }
    .wr-liga { font-size: 20px; font-weight: 900; line-height: 1.15; }
    .wr-timer { text-align: right; font-size: 10px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; }
    .wr-timer b { display: block; font-size: 15px; letter-spacing: 0; margin-top: 2px; }
    .zone-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 12px 0 6px; padding: 6px 9px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; }
    .zone-head.zone-promote { background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.45); color: #a9ffd0; }
    .zone-head.zone-hold { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); color: var(--muted); }
    .zone-head.zone-drop { background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.4); color: #ffb3ba; }
    .zone-head small { font-size: 9px; font-weight: 800; text-transform: none; letter-spacing: 0; opacity: 0.85; }
    .wr-row { display: flex; align-items: center; gap: 9px; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 13px; padding: 8px 10px; margin-bottom: 6px; }
    .wr-row.me { border: 1.5px solid var(--accent); background: rgba(255,46,147,0.14); box-shadow: 0 0 14px rgba(255,46,147,0.18); }
    .wr-pos { width: 26px; font-weight: 900; font-size: 12px; color: var(--muted); text-align: center; flex-shrink: 0; }
    .wr-row.top .wr-pos { color: var(--gold); }
    .wr-ava { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: #fff; flex-shrink: 0; }
    .wr-name { flex: 1; min-width: 0; }
    .wr-name b { font-size: 12px; font-weight: 800; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wr-name span { font-size: 9px; color: var(--muted); font-weight: 700; }
    .wr-score { font-size: 12px; font-weight: 900; color: #ff85cb; white-space: nowrap; }

    .wr-result-box { text-align: center; max-width: 330px; width: 100%; padding: 20px 16px; }
    .wr-result-box .wr-big { font-size: 22px; font-weight: 900; margin: 6px 0; }
    .wr-result-box .wr-sub { font-size: 12px; color: #d8cce8; line-height: 1.45; margin: 6px 0 12px; }

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
  let pendingWeeklyResult = false;  // ждём итогов недели — показать модалку
  let weeklyTickTimer = null;       // живой таймер «Топ»

  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function weekKey() { const d = new Date(), s = new Date(d.getFullYear(), 0, 1); return `${d.getFullYear()}-W${Math.ceil((((d - s) / 86400000) + s.getDay() + 1) / 7)}`; }
  function monthKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; }

  function getLeague(xp) {
    let cur = LEAGUES[0];
    LEAGUES.forEach(l => { if (xp >= l.minXp) cur = l; });
    return cur;
  }

  function getBestTier(cardId) {
    const inv = st.inv && st.inv[cardId];
    if (!inv) return null;
    for (let i = TIERS.length - 1; i >= 0; i--) if (inv[TIERS[i]] > 0) return TIERS[i];
    return null;
  }

  function getCraftableTier(cardId) {
    const inv = st.inv && st.inv[cardId];
    if (!inv) return null;
    for (let i = 0; i < TIERS.length - 1; i++) if (inv[TIERS[i]] >= 3) return TIERS[i];
    return null;
  }

  function addCardCopy(cardId, tier) {
    if (!st.inv[cardId]) st.inv[cardId] = { silver: 0, gold: 0, platinum: 0, neon: 0 };
    st.inv[cardId][tier] = (st.inv[cardId][tier] || 0) + 1;
    if (!st.cards.includes(cardId)) st.cards.push(cardId);
    if (!st.avatarCardId) st.avatarCardId = cardId;
  }

  function examPassed(stage) {
    if (!stage || !stage.reqExam) return true;
    const moduleId = stage.reqModule || 'block-1';
    if (typeof isModuleExamPassed === 'function') return isModuleExamPassed(moduleId);
    return (Array.isArray(window.LESSONS) ? window.LESSONS : [])
      .some(l => l.isExam && st.done.includes(l.id));
  }

  function getCurrentStageIdx() {
    const fandom = getTeamBonuses().power;
    let idx = 0;
    STAGES.forEach(s => {
      const okLessons = st.done.length >= s.reqLessons;
      if (okLessons && examPassed(s) && fandom >= s.reqFandom) idx = s.idx;
    });
    return idx;
  }

  function getUnlockedEras() {
    const curStage = getCurrentStageIdx();
    return STAGES.filter(s => s.idx <= curStage).map(s => s.era);
  }

  function renderProfileAvatarHtml(size = 56) {
    const lg = getLeague(st.xp);
    const cards = Array.isArray(window.CARDS) ? window.CARDS : [];
    const c = st.avatarCardId ? cards.find(x => x.id === st.avatarCardId && getBestTier(x.id)) : null;
    const inner = c
      ? `<div class="av-frame-in" style="background:${c.grad}">${c.img
        ? `<img src="${escapeHtml(c.img)}" alt="${escapeHtml(c.tag)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="display:none">${escapeHtml(c.tag)}</span>`
        : `<span>${escapeHtml(c.tag)}</span>`}</div>`
      : `<div class="av-frame-in" style="background:linear-gradient(135deg,#ff2e93,#7b2cbf)">🎧</div>`;
    return `<div class="av-frame ${lg.cls}" style="width:${size}px;height:${size}px">${inner}<div class="av-league-badge" style="color:${lg.color}">${lg.icon}</div></div>`;
  }

  function calcCashbox() {
    const b = getTeamBonuses();
    const stg = STAGES[getCurrentStageIdx()];
    const prLv = (st.upgrades && st.upgrades.pr) || 0;
    const perHour = Math.max(4, Math.round((b.power / 45) * stg.rateMult * (1 + prLv * 0.15)));
    const elapsedHrs = Math.min(12, Math.max(0, (Date.now() - (st.lastCashTs || Date.now())) / 3600000));
    const ready = Math.floor(elapsedHrs * perHour);
    return { ready, perHour, max: perHour * 12 };
  }

  window.claimCashbox = function () {
    const cb = calcCashbox();
    if (cb.ready <= 0) return alert('Касса пока пуста — загляни позже!');
    st.coins += cb.ready;
    st.lastCashTs = Date.now();
    save(); haptic('ok'); sfx('win');
    alert(`🎤 Собрано из кассы выступлений: +${cb.ready} микрофонов!`);
    renderBinder();
  };

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.producerId) st.producerId = "KP-" + Math.floor(10000 + Math.random() * 90000);
    if (!st.team) st.team = { vocal: null, dance: null, rap: null, visual: null };
    if (!st.inv) st.inv = {};
    if (!st.cases) st.cases = { silver: 0, gold: 0, platinum: 0 };
    if (!st.upgrades) st.upgrades = { practice: 0, sound: 0, pr: 0, cafe: 0 };
    if (!st.lastCashTs) st.lastCashTs = Date.now();
    if (!Array.isArray(st.monthlyBadges)) st.monthlyBadges = [];
    if (!st.fusionsCount) st.fusionsCount = 0;
    if (!Array.isArray(st.cards)) st.cards = [];
    if (!Array.isArray(st.done)) st.done = [];

    const cards = Array.isArray(window.CARDS) ? window.CARDS : [];
    st.cards.forEach(id => {
      if (!st.inv[id]) {
        const c = cards.find(x => x.id === id);
        const defTier = c && c.r === 'SSR' ? 'platinum' : (c && c.r === 'SR' ? 'gold' : 'silver');
        st.inv[id] = { silver: 0, gold: 0, platinum: 0, neon: 0 };
        st.inv[id][defTier] = 1;
      }
    });
    if (!st.avatarCardId && st.cards.length) st.avatarCardId = st.cards[0];

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
    if (typeof st.weeklyHype !== 'number' || !isFinite(st.weeklyHype)) st.weeklyHype = 0;
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
    if (st.coins < STREAK_FREEZE_PRICE) return alert(`Нужно ${STREAK_FREEZE_PRICE} микрофонов.`);
    st.coins -= STREAK_FREEZE_PRICE;
    st.streakFreeze = Math.min(STREAK_FREEZE_MAX, st.streakFreeze + 1);
    save(); haptic('ok'); sfx('win');
    alert(`❄️ Заморозка куплена! В запасе: ${st.streakFreeze}/${STREAK_FREEZE_MAX}`);
    if (typeof window.renderShop === 'function') window.renderShop();
  };

  window.showStreakInfo = function () {
    initStudioState();
    alert(`🔥 Серия входов: ${st.streak.count} дн.\n❄️ Заморозки: ${st.streakFreeze}/${STREAK_FREEZE_MAX}\n\nЕсли пропустить ровно один день, заморозка сохранит серию. Купить её можно в Магазине.`);
  };

  /* ====== КВЕСТЫ: ДЕЙЛИКИ, НЕДЕЛЯ И ОЧКИ МЕСЯЦА ====== */
  /* 5 фиксированных дейликов. Каждый даёт микрофоны и Недельный Хайп. */
  const DAILY_QUESTS = [
    { id: 'quest_lesson_1',  title: 'Первый шаг',      desc: 'Завершить 1 урок',                    coins: 20, hype: 30, goal: 1, flag: 'p1', val: d => d.lessons },
    { id: 'quest_combo',     title: 'Чистый бит',      desc: 'Комбо 3+ верных ответа подряд',       coins: 15, hype: 25, goal: 3, flag: 'p2', val: d => d.combo },
    { id: 'quest_vocab',     title: 'Словарный запас', desc: 'Перевернуть 5 карточек в Словаре',    coins: 15, hype: 20, goal: 5, flag: 'p3', val: d => d.cards },
    { id: 'quest_dictation', title: 'Идеальный слух',  desc: 'Завершить шаг с диктантом или аудио', coins: 15, hype: 25, goal: 1, flag: 'p4', val: d => d.dict },
    { id: 'quest_lesson_2',  title: 'Двойной камбэк',  desc: 'Завершить второй урок за день',       coins: 25, hype: 40, goal: 2, flag: 'p5', val: d => d.lessons }
  ];
  const DAILY_ALL_BONUS_COINS = 50;   // бонус за все 5 дейликов (+ Серебряный бокс)

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
    let coins = 0, hype = 0, count = 0;
    if (!d.rewarded) {
      DAILY_QUESTS.forEach(q => {
        if (isQuestDone(q)) { coins += q.coins; hype += q.hype; count++; }
      });
      if (count > 0) {
        st.coins += coins;
        if (typeof window.addWeeklyHype === 'function') window.addWeeklyHype(hype);
        else st.weeklyHype = (st.weeklyHype || 0) + hype;
        d.rewarded = true;
        save(false);
      }
    }
    return { coins, hype, count };
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

  /* Номер недели в формате «Неделя 47» (тот же счёт, что у еженедельного челленджа). */
  function weekNumOf(ts) {
    const d = new Date(ts);
    const start = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - start) / 86400000) + start.getDay() + 1) / 7);
  }

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
     Топ-1 к концу недели ≈ 850–1100 Хайпа, середина — 300–550, низ — 0–150. */
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
  function botHype(bot, weekStart) {
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
      hype: botHype(b, weekStart), sub: 'Студия-соперник'
    }));
    rows.push({
      id: 'me', me: true,
      name: st.agencyName || 'Твоя студия', initials: '🎤',
      grad: 'linear-gradient(135deg,#ff2e93,#00e5ff)',
      hype: Math.max(0, Math.round(st.weeklyHype || 0)), sub: 'Твоя студия'
    });
    rows.sort((a, b) => (b.hype - a.hype) || (a.me ? -1 : b.me ? 1 : 0));
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

  window.getLessonComboPct = function () {
    return lessonTalents.comboPct || 0;
  };

  /* ====== ИТОГИ НЕДЕЛИ (первый вход после понедельника 00:00) ====== */
  function settleWeeklyLeague() {
    const curKey = weekKeyOf(Date.now());
    const prev = st.lastWeekKey;
    st.lastWeekKey = curKey;
    if (!prev || prev === curKey) return null;   // новая установка / всё ещё та же неделя
    if (typeof st.weeklyHype !== 'number') st.weeklyHype = 0;
    if (typeof st.weeklyLeague !== 'number') st.weeklyLeague = 0;

    const leagueIdx = st.weeklyLeague;
    // Итог прошлой недели: у ботов прошлой комнаты уже финальный потолок.
    const oldRoom = st.weeklyRoom;
    const bots = (oldRoom && Array.isArray(oldRoom.bots) && oldRoom.bots.length === WEEKLY_SIZE - 1)
      ? oldRoom.bots : buildWeeklyBots(st.weeklyRoomSeed || 1);
    const myHype = Math.max(0, Math.round(st.weeklyHype));
    const pos = 1 + bots.filter(b => b.cap > myHype).length;

    const L = WEEKLY_LEAGUES[leagueIdx];
    const nextIdx = Math.min(WEEKLY_LEAGUES.length - 1, leagueIdx + 1);
    const prevIdx = Math.max(0, leagueIdx - 1);
    const isLast = leagueIdx === WEEKLY_LEAGUES.length - 1;
    const res = { leagueIdx, pos, hype: myHype, prevName: L.name, out: 'hold', bonusCoins: 0, bonusBox: null, title: '', text: '' };

    if (pos <= ZONE_PROMOTE) {
      st.weeklyLeague = nextIdx;
      const boxKey = L.promoteBox === 'Платиновый бокс' ? 'platinum' : 'gold';
      st.cases[boxKey] = (st.cases[boxKey] || 0) + 1;
      st.coins += L.promoteCoins;
      res.out = 'promote';
      res.bonusCoins = L.promoteCoins;
      res.bonusBox = L.promoteBox;
      res.title = isLast ? 'Ты в топ-7 элиты!' : `Повышение: лига «${WEEKLY_LEAGUES[nextIdx].name}»`;
      res.text = `Место #${pos} из ${WEEKLY_SIZE}. Награда: ${L.promoteBox} и +${L.promoteCoins} 🎤.`;
    } else if (pos >= ZONE_DROP_FROM && leagueIdx > 0) {
      st.weeklyLeague = prevIdx;
      st.coins += L.midCoins;
      res.out = 'drop';
      res.bonusCoins = L.midCoins;
      res.title = 'Понижение лиги';
      res.text = `Место #${pos} из ${WEEKLY_SIZE}. Возвращаешься в лигу «${WEEKLY_LEAGUES[prevIdx].name}». Утешение: +${L.midCoins} 🎤.`;
    } else {
      st.coins += L.midCoins;
      res.out = 'hold';
      res.bonusCoins = L.midCoins;
      res.title = 'Лига сохранена';
      res.text = `Место #${pos} из ${WEEKLY_SIZE}. Остаёшься в лиге «${L.name}». Утешительный бонус: +${L.midCoins} 🎤.`;
    }

    // Новая неделя: сбрасываем Хайп и генерируем 29 новых соперников.
    st.weeklyHype = 0;
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
        <div style="font-size:12px;color:var(--muted)">Твой Хайп за неделю: <b style="color:#fff">${res.hype}</b></div>
        <button class="btn full" style="margin-top:12px" onclick="document.getElementById('pack-modal').classList.remove('open');switchTab('rank')">К турниру</button>
      </div>`;
    window.__weeklyLastResult = null;
    if (typeof haptic === 'function') haptic(res.out === 'drop' ? 'err' : 'ok');
    if (res.out === 'promote' && typeof sfx === 'function') sfx('win');
  };

  window.getLastWeeklyResult = function () { return window.__weeklyLastResult || null; };

  window.getTeamBonuses = function () {
    let power = ((st.upgrades && st.upgrades.practice) || 0) * 80;
    let energyMin = ((st.upgrades && st.upgrades.cafe) || 0) * 5;
    let coinsPct = ((st.upgrades && st.upgrades.sound) || 0) * 5;
    let shields = 0, hints = 0, comboPct = 0, hypePct = 0, count = 0;
    const albums = [];
    // getEnergyRegenMs зовётся ещё до initStudioState (при загрузке данных),
    // поэтому состав может быть не создан — не падаем.
    const team = (st && st.team) || {};
    const cards = Array.isArray(window.CARDS) ? window.CARDS : [];

    ROLES.forEach(r => {
      const cid = team[r.key], tier = cid ? getBestTier(cid) : null;
      if (!tier) return;
      const c = cards.find(x => x.id === cid); if (!c) return;
      const tm = TIER_META[tier];
      count++;
      power += tm.power;
      albums.push(c.album);
      if (r.key === 'vocal') shields = tm.shields;
      if (r.key === 'visual') hints = tm.hints;
      if (r.key === 'dance') { comboPct = tm.comboPct; energyMin += Math.round(c.bonusVal * tm.mult * 0.5); }
      if (r.key === 'rap') hypePct = tm.hypePct;
    });

    const synergy = albums.length === 4 && albums.every(a => a === albums[0]);
    if (synergy) { power = Math.round(power * 1.15); coinsPct += 15; }
    return { power, energyMin, coinsPct, shields, hints, comboPct, hypePct, count, synergy };
  };

  window.getEnergyRegenMs = function () {
    return Math.max(30 * 60 * 1000, BASE_ENERGY_MS - (getTeamBonuses().energyMin || 0) * 60 * 1000);
  };

  /* ====== ПРОФИЛЬ, ВЫБОР АВАТАРКИ ИЗ КАРТ И 12 ЛИГ ====== */
  window.openProfileModal = function () {
    haptic('light');
    initStudioState();
    const lg = getLeague(st.xp);
    const owned = (Array.isArray(window.CARDS) ? window.CARDS : []).filter(c => getBestTier(c.id));

    profileOverlay.innerHTML = `
      <div class="ov-header">
        <div>
          <div style="font-size:16px;font-weight:900">Профиль и Лиги</div>
          <div style="font-size:11px;color:var(--muted)">ID: ${escapeHtml(st.producerId)} • ${st.xp} XP</div>
        </div>
        <button class="close-btn" style="width:32px;height:32px;font-size:15px" onclick="document.getElementById('profile-overlay').classList.remove('open')">✕</button>
      </div>
      <div class="ov-scroll">
        <div class="card-box" style="margin-bottom:14px;text-align:center">
          <div style="display:flex;justify-content:center;margin-bottom:10px">${renderProfileAvatarHtml(76)}</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Название твоей студии</div>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <input id="prof-name-in" class="onb-input" style="margin:0;padding:9px 12px;font-size:14px;text-align:left" maxlength="22" value="${escapeHtml(st.agencyName)}">
            <button class="btn cyan" id="prof-name-save" style="padding:0 14px">Ок</button>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px;text-align:left">Аватарка агентства (выбери выбитого артиста):</div>
          <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">
            ${owned.length ? owned.map(c => `
              <div data-pick-av="${c.id}" style="width:46px;height:46px;border-radius:12px;flex-shrink:0;overflow:hidden;border:2px solid ${st.avatarCardId === c.id ? 'var(--cyan)' : 'rgba(255,255,255,0.15)'};background:${c.grad};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;cursor:pointer">
                ${c.img ? `<img src="${escapeHtml(c.img)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="display:none">${escapeHtml(c.tag)}</span>` : `<span>${escapeHtml(c.tag)}</span>`}
              </div>`).join('') : '<div style="font-size:11px;color:var(--muted)">Открой первый бокс, чтобы поставить артиста на аватарку</div>'}
          </div>
        </div>

        <div class="quest-sec"><span>Лестница лиг (открывают рамки и апгрейды)</span><span style="color:${lg.color}">${lg.name}</span></div>
        ${LEAGUES.map(l => {
          const isCur = l.id === lg.id, reached = st.xp >= l.minXp;
          return `<div class="rank-step ${isCur ? 'current' : (reached ? 'reached' : '')}" style="${isCur ? `border-color:${l.color}` : ''}">
            <div class="rs-ico" style="color:${l.color}">${l.icon}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:800;color:${reached ? '#fff' : 'var(--muted)'}">${l.name} ${isCur ? '<span style="font-size:10px;color:var(--cyan)">• Сейчас</span>' : ''}</div>
              <div style="font-size:11px;color:var(--muted)">От ${l.minXp} XP • Макс. ур. студии: ${l.maxUpg}</div>
            </div>
            <div style="font-size:12px;font-weight:800;color:${reached ? 'var(--success)' : 'var(--muted)'}">${reached ? '✓' : '🔒'}</div>
          </div>`;
        }).join('')}
      </div>`;

    document.getElementById('prof-name-save').onclick = () => {
      const n = document.getElementById('prof-name-in').value.trim();
      if (n) { st.agencyName = n.slice(0, 22); save(); haptic('ok'); alert('Название обновлено!'); renderBinder(); }
    };
    profileOverlay.querySelectorAll('[data-pick-av]').forEach(el => {
      el.onclick = () => {
        st.avatarCardId = Number(el.getAttribute('data-pick-av'));
        save(); haptic('ok'); renderBinder(); openProfileModal();
      };
    });
    profileOverlay.classList.add('open');
  };

  window.setStudioSubTab = function (t) { haptic('light'); studioSubTab = t; renderBinder(); };
  window.setShopSubTab = function (t) {
    haptic('light');
    const y = window.scrollY || 0;
    shopSubTab = t;
    renderShop();
    const raf = window.requestAnimationFrame || function (cb) { setTimeout(cb, 0); };
    raf(() => window.scrollTo(0, y));
  };

  /* ====== ЭКРАН СТУДИИ (3 ВКЛАДКИ: ГРУППА | СТУДИЯ | КВЕСТЫ) ====== */
  window.renderBinder = function () {
    if (!Array.isArray(window.CARDS)) return;
    initStudioState();
    const screen = document.getElementById('screen-binder');
    const b = getTeamBonuses();
    const lg = getLeague(st.xp);
    const nextLg = LEAGUES.find(x => x.minXp > st.xp);
    const pctNext = nextLg ? Math.min(100, Math.round(((st.xp - lg.minXp) / Math.max(1, nextLg.minXp - lg.minXp)) * 100)) : 100;
    const cb = calcCashbox();

    screen.innerHTML = `
      <div class="agency-card ${lg.cls}" onclick="openProfileModal()">
        <div class="agency-head">
          ${renderProfileAvatarHtml(56)}
          <div style="flex:1;min-width:0">
            <div class="agency-name">${escapeHtml(st.agencyName)}</div>
            <div class="agency-id">${STAGES[getCurrentStageIdx()].ico} ${STAGES[getCurrentStageIdx()].name} • Серия ${st.streak.count} дн.<span class="freeze-pill ${st.streakFreeze > 0 ? '' : 'empty'}" onclick="event.stopPropagation();showStreakInfo()">❄️ ${st.streakFreeze}/${STREAK_FREEZE_MAX}</span></div>
            <div class="league-pill" style="color:${lg.color}" onclick="event.stopPropagation();switchTab('rank')">${lg.icon} ${lg.name} • ${st.xp} XP • 🔥 ${st.weeklyHype || 0}</div>
          </div>
          <div style="font-size:20px;color:rgba(255,255,255,0.45);font-weight:900">›</div>
        </div>
        ${nextLg ? `<div style="font-size:10px;color:var(--muted);margin-bottom:4px">До «${nextLg.name}»: ${nextLg.minXp - st.xp} XP</div><div class="bar-bg"><div class="bar-fill" style="width:${pctNext}%"></div></div>` : ''}
        <div class="agency-buffs">
          <span>Фандом: <b style="color:var(--accent)">${b.power}</b></span>
          <span>🛡️ ${b.shields}</span>
          <span>✨ ${b.hints}</span>
          <span>🔥 +${b.comboPct}%</span>
          <span>⚡ ${b.hypePct}%</span>
        </div>
      </div>

      <div class="mode-switch">
        <button class="mode-btn ${studioSubTab === 'group' ? 'active' : ''}" onclick="setStudioSubTab('group')">Группа</button>
        <button class="mode-btn ${studioSubTab === 'studio' ? 'active' : ''}" onclick="setStudioSubTab('studio')">Студия</button>
        <button class="mode-btn ${studioSubTab === 'quests' ? 'active' : ''}" onclick="setStudioSubTab('quests')">Квесты</button>
      </div>
      <div id="studio-sub-body"></div>
    `;

    const sub = document.getElementById('studio-sub-body');

    if (studioSubTab === 'group') {
      const unlockedEras = getUnlockedEras();
      sub.innerHTML = `
        <div class="cashbox-bar">
          <div>
            <div style="font-size:12px;font-weight:900;color:var(--cyan)">Касса выступлений (+${cb.perHour} 🎤/ч)</div>
            <div style="font-size:11px;color:var(--muted)">Накоплено: <b style="color:#fff">${cb.ready}</b> / ${cb.max} 🎤</div>
          </div>
          <button class="btn ${cb.ready > 0 ? 'cyan' : 'ghost'}" style="padding:8px 12px;font-size:12px" onclick="claimCashbox()">Забрать</button>
        </div>

        <div class="team-grid" id="team-grid"></div>
        <div class="synergy-bar ${b.synergy ? 'on' : ''}">
          <span>${b.synergy ? 'Синергия эры активна (+15% Фандом и 🎤)' : '4 карты одной Эры дадут Синергию'}</span>
          <b>${b.count}/4</b>
        </div>
        <div id="eras-cards-wrap"></div>
      `;

      const tgGrid = document.getElementById('team-grid');
      ROLES.forEach(r => {
        const cid = st.team[r.key], tier = cid ? getBestTier(cid) : null;
        const c = tier ? CARDS.find(x => x.id === cid) : null;
        const el = document.createElement('div');
        el.className = 'team-slot' + (c ? ` filled tier-${tier}` : '');
        if (c) {
          const tm = TIER_META[tier];
          el.innerHTML = `<div class="slot-role">${r.ico} ${r.title}</div><div class="slot-tag">${c.tag}</div><div class="slot-tier" style="color:${tm.color}">${tm.name}</div>`;
        } else {
          el.innerHTML = `<div class="slot-role">${r.ico} ${r.title}</div><div style="font-size:18px;opacity:0.35;margin-top:4px">+</div>`;
        }
        el.onclick = () => openSlotPicker(r);
        tgGrid.appendChild(el);
      });

      const erasWrap = document.getElementById('eras-cards-wrap');
      (Array.isArray(ERAS) ? ERAS : []).forEach(era => {
        const isUnlocked = unlockedEras.includes(era.id);
        const eraCards = CARDS.filter(c => c.album === era.id);
        const ownedInEra = eraCards.filter(c => getBestTier(c.id));

        const head = document.createElement('div');
        head.className = 'era-head';
        head.innerHTML = `<span style="color:${isUnlocked ? era.color : 'var(--muted)'}">${isUnlocked ? '' : '🔒 '}${era.name}</span><span style="color:var(--muted)">${ownedInEra.length}/${eraCards.length}</span>`;
        erasWrap.appendChild(head);

        if (!isUnlocked) {
          const reqStage = STAGES[era.stageIdx];
          const lockBox = document.createElement('div');
          lockBox.className = 'card-box';
          lockBox.style.cssText = 'padding:12px;font-size:12px;color:var(--muted);margin-bottom:8px';
          lockBox.innerHTML = `Откроется на площадке <b>${reqStage.ico} ${reqStage.name}</b> (Уроков: ${reqStage.reqLessons}${reqStage.reqExam ? ' + Экзамен' : ''}, Фандом: ${reqStage.reqFandom})`;
          erasWrap.appendChild(lockBox);
          return;
        }

        const grid = document.createElement('div');
        grid.className = 'cards-mini-grid';
        eraCards.forEach(c => {
          const best = getBestTier(c.id);
          const el = document.createElement('div');
          if (!best) {
            el.className = 'mini-card locked-card';
            el.innerHTML = `<div class="pc-art" style="background:#181326"><div class="pc-monogram" style="opacity:0.25">?</div></div><div class="mc-name">???</div><div class="mc-sub">${c.role}</div>`;
          } else {
            const craft = getCraftableTier(c.id);
            const inTeam = st.team[c.roleKey] === c.id;
            const cnt = Object.values(st.inv[c.id]).reduce((a, x) => a + x, 0);
            el.className = `mini-card tier-${best}`;
            el.innerHTML = `
              ${inTeam ? '<div class="mc-dot"></div>' : ''}
              ${craft ? '<div class="mc-craft">3→1</div>' : ''}
              ${cardArtHtml(c)}
              <div class="mc-name">${c.name.split('•')[0].trim()}</div>
              <div class="mc-sub" style="color:${TIER_META[best].color}">${TIER_META[best].name} ×${cnt}</div>`;
            el.onclick = () => openArtistModal(c.id);
          }
          grid.appendChild(el);
        });
        erasWrap.appendChild(grid);
      });
    }

    if (studioSubTab === 'studio') {
      const curIdx = getCurrentStageIdx();
      const curStg = STAGES[curIdx];
      const nextStg = STAGES[curIdx + 1];

      sub.innerHTML = `
        <div class="stage-box">
          <div style="font-size:11px;color:var(--cyan);font-weight:800;text-transform:uppercase">Текущая площадка</div>
          <div style="font-size:18px;font-weight:900;margin:4px 0">${curStg.ico} ${curStg.name}</div>
          <div style="font-size:12px;color:#d8cce8">Множитель кассы: <b>×${curStg.rateMult}</b></div>
          ${nextStg ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:var(--muted)">
            Следующая: <b style="color:#fff">${nextStg.ico} ${nextStg.name}</b><br>
            Нужно: Уроков ${st.done.length}/${nextStg.reqLessons}${nextStg.reqExam ? (examPassed(nextStg) ? ' • Экзамен ✓' : ' • Сдать Экзамен') : ''} • Фандом ${b.power}/${nextStg.reqFandom}
          </div>` : `<div style="margin-top:8px;font-size:12px;color:var(--gold);font-weight:800">★ Максимальная площадка открыта!</div>`}
        </div>

        <div class="quest-sec"><span>Улучшения студии</span><span>Лимит Лиги: ур. ${lg.maxUpg}</span></div>
        ${UPGRADES.map(u => {
          const lv = st.upgrades[u.key] || 0;
          const cost = Math.round(u.baseCost * Math.pow(1.65, lv));
          const capped = lv >= lg.maxUpg;
          return `<div class="upg-row">
            <div class="upg-ico">${u.ico}</div>
            <div style="flex:1">
              <div style="font-size:14px;font-weight:800">${u.name} <span style="color:var(--cyan);font-size:12px">Ур. ${lv}</span></div>
              <div style="font-size:11px;color:var(--muted)">${u.desc}</div>
            </div>
            <button class="btn ${capped ? 'ghost' : 'cyan'}" style="padding:8px 12px;font-size:12px" data-upg="${u.key}" ${capped ? 'disabled' : ''}>${capped ? 'Лимит' : `${cost} 🎤`}</button>
          </div>`;
        }).join('')}
      `;

      sub.querySelectorAll('[data-upg]').forEach(btn => {
        btn.onclick = () => {
          const key = btn.getAttribute('data-upg');
          const u = UPGRADES.find(x => x.key === key);
          const lv = st.upgrades[key] || 0;
          if (lv >= lg.maxUpg) return alert(`Подними Лигу по XP, чтобы качать выше ${lg.maxUpg} ур.!`);
          const cost = Math.round(u.baseCost * Math.pow(1.65, lv));
          if (st.coins < cost) return alert(`Нужно ${cost} микрофонов!`);
          st.coins -= cost;
          st.upgrades[key] = lv + 1;
          save(); haptic('ok'); sfx('ok'); renderBinder();
        };
      });
    }

    if (studioSubTab === 'quests') {
      const d = st.daily, m = st.monthly, w = st.weekly;
      // На случай старых сохранений, где счётчики уже заполнены, а флаги ещё нет.
      syncQuestProgress();
      grantDailyQuestRewards();   // каждого закрытого дейлика — своя награда
      const dCnt = dailyDoneCount();
      const wCnt = Math.min(w.days.length, 5);
      const curMonthIdx = new Date().getMonth(), curYear = new Date().getFullYear();
      const weekLeft = fmtWeekLeft(weekStartTs() + 7 * 86400000 - Date.now());
      const myVk = weekNumOf(weekStartTs());
      const doneQ = DAILY_QUESTS.filter(isQuestDone);
      const allHype = doneQ.reduce((a, q) => a + q.hype, 0);
      const allCoins = doneQ.reduce((a, q) => a + q.coins, 0);

      sub.innerHTML = `
        <div class="quest-sec" style="margin-top:4px"><span>Ежедневные задания • ${dCnt}/5</span><span style="color:#ff85cb">🔥 ${st.weeklyHype} за неделю</span></div>
        ${DAILY_QUESTS.map(q => {
          const rep = `<div class="c-rew">+${q.coins} 🎤 • +${q.hype} 🔥</div>`;
          return `<div class="contract-row ${isQuestDone(q) ? 'done' : ''}">
            <div style="flex:1"><div class="c-title">${isQuestDone(q) ? '✓ ' : ''}${escapeHtml(q.title)}</div><div style="font-size:10px;color:var(--muted)">${escapeHtml(q.desc)}</div>${rep}</div>
            <div class="c-prog">${Math.min(q.val(d), q.goal)}/${q.goal}</div>
          </div>`;
        }).join('')}
        <div class="daily-prize">
          <div style="font-size:12px;font-weight:800;margin-bottom:6px">Бонус за все 5 заданий: Серебряный бокс + ${DAILY_ALL_BONUS_COINS} 🎤</div>
          <div class="daily-prize-items"><span>Дейлики: +${allCoins} 🎤</span><span>Хайп: +${allHype} 🔥</span></div>
          ${dCnt === DAILY_QUESTS.length && !d.claimed ? `<button class="btn gold full" id="claim-daily">Забрать бонус дня!</button>` : (d.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Получено сегодня</div>` : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((dCnt / DAILY_QUESTS.length) * 100)}%"></div></div>`)}
        </div>

        <div class="quest-sec"><span>Недельная лига • неделя ${myVk}</span><span style="color:#ff85cb">🔥 ${st.weeklyHype} Хайпа</span></div>
        <div class="daily-prize" style="border-color:rgba(255,46,147,0.45)">
          <div style="font-size:12px;font-weight:800">${WEEKLY_LEAGUES[st.weeklyLeague || 0].icon} ${escapeHtml(WEEKLY_LEAGUES[st.weeklyLeague || 0].name)} • до конца ${weekLeft}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:6px">+15 🔥 за урок, +5 🔥 за повтор и тренировку в словаре/диктанте</div>
          <button class="btn cyan full" style="margin-top:10px" onclick="switchTab('rank')">Открыть турнир</button>
        </div>

        <div class="quest-sec"><span>Еженедельный челлендж</span><span style="color:var(--cyan)">${wCnt}/5 дней</span></div>
        <div class="daily-prize">
          <div style="font-size:12px;font-weight:800;margin-bottom:6px">5 дней с уроками → Золотой бокс</div>
          ${w.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Получено на этой неделе</div>`
            : (wCnt >= 5 ? `<button class="btn gold full" id="claim-weekly">Забрать Золотой бокс!</button>`
              : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((wCnt / 5) * 100)}%"></div></div>`)}
        </div>

        <div class="quest-sec"><span>Бейджи ${curYear} (Квест месяца: ${Math.min(m.pts, MONTHLY_GOAL)}/${MONTHLY_GOAL})</span><span>${st.monthlyBadges.length}/12</span></div>
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
        st.cases.silver = (st.cases.silver || 0) + 1;
        st.coins += DAILY_ALL_BONUS_COINS;
        save(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder();
      };

      const cw = document.getElementById('claim-weekly');
      if (cw) cw.onclick = () => {
        st.weekly.claimed = true;
        st.cases.gold++;
        save(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder();
      };
    }
  };

  /* ====== МОДАЛКИ КАРТЫ И СЛОТА ====== */
  function openSlotPicker(role) {
    const cards = Array.isArray(window.CARDS) ? window.CARDS : [];
    const owned = cards.filter(c => getBestTier(c.id) && c.roleKey === role.key);
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    if (!owned.length) {
      modal.innerHTML = `<div class="card-box" style="max-width:300px;text-align:center"><h3>${role.ico} ${role.title}</h3><p style="color:var(--muted)">Талант «${role.talent}»: ${role.desc}.<br>Выбей артиста этой роли в Магазине!</p><button class="btn full" onclick="document.getElementById('pack-modal').classList.remove('open')">Понятно</button></div>`;
      return;
    }
    let html = `<div class="card-box" style="width:100%;max-width:320px"><h3 style="margin-bottom:6px">${role.ico} ${role.title}</h3><div style="font-size:11px;color:var(--cyan);margin-bottom:12px">Талант «${role.talent}»: ${role.desc}</div>`;
    owned.forEach(c => {
      const tier = getBestTier(c.id), tm = TIER_META[tier];
      html += `<div class="vocab-row" data-pick="${c.id}"><div class="vocab-tag" style="border-color:${tm.color};color:${tm.color}">${c.tag}</div><div style="flex:1"><div style="font-weight:800;font-size:14px">${c.name}</div><div style="font-size:11px;color:${tm.color}">${tm.name} • Фандом ${tm.power}</div></div></div>`;
    });
    html += `<button class="btn ghost full" style="margin-top:8px" onclick="document.getElementById('pack-modal').classList.remove('open')">Закрыть</button></div>`;
    modal.innerHTML = html;
    modal.querySelectorAll('[data-pick]').forEach(row => {
      row.onclick = () => {
        st.team[role.key] = Number(row.getAttribute('data-pick'));
        save(); haptic('ok'); sfx('ok'); modal.classList.remove('open'); renderBinder();
      };
    });
  }

  function openArtistModal(cardId) {
    const c = CARDS.find(x => x.id === cardId);
    const best = getBestTier(cardId), inv = st.inv[cardId];
    const inTeam = st.team[c.roleKey] === cardId;
    const craftTier = getCraftableTier(cardId);
    const nextTier = craftTier ? TIERS[TIERS.indexOf(craftTier) + 1] : null;
    const tm = TIER_META[best];
    const roleObj = ROLES.find(r => r.key === c.roleKey);

    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box zoom-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:12px;font-weight:900;color:${tm.color}">${tm.name.toUpperCase()} • ${roleObj.ico} ${roleObj.title}</span>
          <button class="close-btn" style="width:30px;height:30px;font-size:14px" onclick="document.getElementById('pack-modal').classList.remove('open')">✕</button>
        </div>
        <div class="photocard tier-${best}" style="margin-bottom:10px;cursor:default">
          ${cardArtHtml(c)}
          <div class="pc-name" style="font-size:16px">${c.name}</div>
          <div class="pc-bonus" style="font-size:11px">${roleObj.talent}: ${roleObj.desc} • Фандом ${tm.power}</div>
        </div>
        <div class="tier-pills">
          ${TIERS.map(t => `<div class="t-pill" style="border-color:${inv[t] >= 3 && t !== 'neon' ? 'var(--success)' : 'rgba(255,255,255,0.08)'}"><span style="color:${TIER_META[t].color}">${TIER_META[t].name}</span><b>${inv[t] || 0}</b></div>`).join('')}
        </div>
        ${craftTier ? `<button class="btn gold full" style="margin-bottom:8px" id="do-craft">Слияние: 3 ${TIER_META[craftTier].name} → 1 ${TIER_META[nextTier].name}</button>` : ''}
        <div style="display:flex;gap:8px">
          <button class="btn ${inTeam ? 'ghost' : 'cyan'}" style="flex:1" id="do-equip">${inTeam ? 'В составе ✓' : 'В состав'}</button>
          <button class="btn ghost" onclick="playAudio('${c.quoteFile}','${c.quoteKr}')">🔊</button>
        </div>
      </div>`;

    document.getElementById('do-equip').onclick = () => { st.team[c.roleKey] = cardId; save(); haptic('ok'); sfx('ok'); renderBinder(); openArtistModal(cardId); };
            const craftBtn = document.getElementById('do-craft');
    if (craftBtn) craftBtn.onclick = () => runFusionAnim(cardId, craftTier, nextTier);
  }

  function runFusionAnim(cardId, fromTier, toTier) {
    const c = CARDS.find(x => x.id === cardId);
    const modal = document.getElementById('pack-modal');
    haptic('heavy'); sfx('tap');
    modal.innerHTML = `
      <div style="font-size:14px;font-weight:900;color:${TIER_META[toTier].color};margin-bottom:12px">СЛИЯНИЕ В ${TIER_META[toTier].name.toUpperCase()}...</div>
      <div class="fusion-stage"><div class="f-orb o1"></div><div class="f-orb o2"></div><div class="f-orb o3"></div></div>`;

    setTimeout(() => {
      triggerFlash(() => {
        st.inv[cardId][fromTier] -= 3;
        st.inv[cardId][toTier] = (st.inv[cardId][toTier] || 0) + 1;
        st.fusionsCount = (st.fusionsCount || 0) + 1;
        save(); renderBinder();
        haptic('ok'); sfx('win'); fireConfetti();
        if (c.quoteFile) playAudio(c.quoteFile, c.quoteKr);

        modal.innerHTML = `
          <div style="font-size:15px;font-weight:900;color:${TIER_META[toTier].color};margin-bottom:14px">НОВЫЙ РАНГ: ${TIER_META[toTier].name.toUpperCase()}!</div>
          <div class="photocard tier-${toTier} reveal-card">
            <div class="pc-rarity" style="color:${TIER_META[toTier].color}">${TIER_META[toTier].name}</div>
            ${cardArtHtml(c)}
            <div class="pc-name" style="font-size:16px">${c.name}</div>
            <div class="pc-bonus" style="font-size:12px;margin-top:6px">Фандом: ${TIER_META[toTier].power}</div>
          </div>
          <button class="btn full" style="max-width:240px;margin-top:18px" onclick="document.getElementById('pack-modal').classList.remove('open')">Забрать</button>`;
      });
    }, 850);
  }

  /* ====== МАГАЗИН + ПЛАВНАЯ АНИМАЦИЯ ВИНИЛОВОГО БОКСА ====== */
  window.renderShop = function () {
    if (!Array.isArray(window.CARDS)) return;
    syncResources(); initStudioState();
    const screen = document.getElementById('screen-shop');
    const cs = st.cases;
    const eSub = st.energy >= MAX_ENERGY ? 'Полный заряд' : `+1 через ${fmtWait(getEnergyRegenMs() - (Date.now() - st.lastEnergyTs))}`;
    const hSub = st.hearts >= MAX_HEARTS ? 'Все попытки есть' : `+1 через ${fmtWait(HEART_REGEN_MS - (Date.now() - st.lastHeartTs))}`;

    screen.innerHTML = `
      <h3 style="margin:0 0 12px">Магазин агентства</h3>
      <div class="mode-switch">
        <button class="mode-btn ${shopSubTab === 'boxes' ? 'active' : ''}" onclick="setShopSubTab('boxes')">Виниловые боксы</button>
        <button class="mode-btn ${shopSubTab === 'vip' ? 'active' : ''}" onclick="setShopSubTab('vip')">Энергия и VIP</button>
      </div>
      <div id="shop-sub-body"></div>`;

    const sub = document.getElementById('shop-sub-body');
    if (shopSubTab === 'boxes') {
      sub.innerHTML = `
        <div style="font-size:11px;color:var(--muted);margin-bottom:10px">Доступно Эр в боксах: <b style="color:var(--cyan)">${getUnlockedEras().length} из ${(Array.isArray(ERAS) ? ERAS : []).length}</b> (открывай новые площадки в Студии)</div>
        <div class="box-list">
          <div class="box-row silver">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#454c61,#1d202b);color:#cfd8dc;border:1px solid #cfd8dc">AG</span></div>
            <div style="flex:1"><div class="l-title" style="color:#cfd8dc">Серебряный бокс</div><div class="l-meta">Серебро или Золото</div></div>
            <button class="btn ${cs.silver > 0 ? '' : 'ghost'}" onclick="openCaseModal('silver')">${cs.silver > 0 ? `Открыть (${cs.silver})` : '50 🎤'}</button>
          </div>
          <div class="box-row gold">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#7a5816,#291e0a);color:#ffd700;border:1px solid #ffd700">AU</span></div>
            <div style="flex:1"><div class="l-title" style="color:#ffd700">Золотой бокс</div><div class="l-meta">Золото или Платина</div></div>
            <button class="btn ${cs.gold > 0 ? 'gold' : 'ghost'}" onclick="openCaseModal('gold')">${cs.gold > 0 ? `Открыть (${cs.gold})` : '120 🎤'}</button>
          </div>
          <div class="box-row platinum">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#13526e,#23113d);color:#00e5ff;border:1px solid #00e5ff">PT</span></div>
            <div style="flex:1"><div class="l-title" style="color:#00e5ff">Платиновый бокс</div><div class="l-meta">100% Платина • За Экзамен</div></div>
            <button class="btn ${cs.platinum > 0 ? 'cyan' : 'ghost'}" onclick="openCaseModal('platinum')">${cs.platinum > 0 ? `Открыть (${cs.platinum})` : 'Экзамен'}</button>
          </div>
        </div>`;
    } else {
      sub.innerHTML = `
        <div class="res-status">
          <div class="res-box"><div class="res-val" style="color:var(--cyan)">${st.energy}/${MAX_ENERGY} Энергия</div><div class="res-sub">${eSub}</div></div>
          <div class="res-box"><div class="res-val" style="color:var(--danger)">${st.hearts}/${MAX_HEARTS} Попытки</div><div class="res-sub">${hSub}</div></div>
        </div>
        <div class="shop-sec">Пополнение за микрофоны</div>
        <div class="shop-item"><div><div class="l-title">Батарейка лайтстика (+1 ⚡)</div><div class="l-meta">Мгновенно добавит 1 заряд энергии</div></div><button class="btn cyan" onclick="buyEnergy(1, 30)">30 🎤</button></div>
        <div class="shop-item"><div><div class="l-title">Полный заряд (5/5 ⚡)</div><div class="l-meta">Заполнит всю шкалу энергии</div></div><button class="btn cyan" onclick="buyEnergy(5, 100)">100 🎤</button></div>
        <div class="shop-item"><div><div class="l-title">Попытка экзамена (+1 ❤️)</div><div class="l-meta">Восстановит одно сердечко</div></div><button class="btn" onclick="buyHeart(1, 40)">40 🎤</button></div>
        <div class="shop-item"><div><div class="l-title">Заморозка стрика ❄️</div><div class="l-meta">Пропустил день — серия 🔥 не сгорает • в запасе ${st.streakFreeze}/${STREAK_FREEZE_MAX}</div></div>
          <button class="btn ${st.streakFreeze >= STREAK_FREEZE_MAX ? 'ghost' : 'cyan'}" ${st.streakFreeze >= STREAK_FREEZE_MAX ? 'disabled' : ''} onclick="buyStreakFreeze()">${st.streakFreeze >= STREAK_FREEZE_MAX ? `Максимум ${STREAK_FREEZE_MAX}/${STREAK_FREEZE_MAX}` : `${STREAK_FREEZE_PRICE} 🎤`}</button>
        </div>
        <div class="shop-sec">Премиум и наборы (Telegram Stars)</div>
        <div class="shop-item vip"><div><div class="l-title">VIP Trainee Pass (30 дней)</div><div class="l-meta">Безлимит энергии и попыток, ×2 награды</div></div><button class="btn gold" onclick="alert('Подключим оплату Telegram Stars, когда перейдём к серверу!')">150 ★</button></div>
        <div class="shop-item"><div><div class="l-title">Энергопак (Безлимит 24ч)</div><div class="l-meta">Учи уроки без ограничений весь день</div></div><button class="btn gold" onclick="alert('Болванка под Telegram Stars')">35 ★</button></div>
        <div class="shop-item"><div><div class="l-title">Дебютный бокс (3 карты)</div><div class="l-meta">Гарантированная карта SR или SSR</div></div><button class="btn" onclick="alert('Болванка под Telegram Stars')">75 ★</button></div>`;
    }
  };

  window.openCaseModal = function (type) {
    initStudioState();
    const prices = { silver: 50, gold: 120, platinum: 0 };
    if (st.cases[type] > 0) st.cases[type]--;
    else {
      if (type === 'platinum') return alert('Платиновый бокс выдаётся за Экзамен!');
      if (st.coins < prices[type]) return alert(`Нужно ${prices[type]} микрофонов!`);
      st.coins -= prices[type];
    }
    save(); renderShop(); haptic('medium');

    const titleMap = { silver: "SILVER EDITION", gold: "GOLD EDITION", platinum: "PLATINUM EDITION" };
    const boxUrl = BOX_IMAGES[type];
    const vinylUrl = BOX_IMAGES.vinyl;
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');

    modal.innerHTML = `
      <div style="font-size:12px;color:var(--cyan);font-weight:800;letter-spacing:1.5px;margin-bottom:10px">НАЖМИ НА АЛЬБОМ, ЧТОБЫ ДОСТАТЬ ПЛАСТИНКУ</div>
      <div class="album-stage" id="album-stage">
        <div class="album-vinyl" style="${vinylUrl ? `background:url('${vinylUrl}') no-repeat center;background-size:contain;border:none;box-shadow:none;` : ''}">
          ${vinylUrl ? '' : '<div class="vinyl-label"><div class="vinyl-hole"></div></div>'}
        </div>
        <div class="album-sleeve ${type} ${boxUrl ? '' : 'no-img'}" style="${boxUrl ? `background-image:url('${boxUrl}');box-shadow:none;` : ''}">
          ${boxUrl ? '' : `
            <div style="font-size:10px;font-weight:900;letter-spacing:1.5px;opacity:0.8">K-POP LINGUA</div>
            <div style="font-size:18px;font-weight:900;line-height:1.1">${titleMap[type]}</div>
            <div style="font-size:10px;opacity:0.65">LIMITED VINYL BOX</div>
          `}
        </div>
      </div>`;

    document.getElementById('album-stage').onclick = () => {
      const stg = document.getElementById('album-stage');
      if (stg.classList.contains('opening')) return;
      stg.classList.add('opening');
      haptic('heavy'); sfx('tap');

      /* Ждём пока винил полностью выедет и раскрутится (650мс) + короткая пауза -> БУМ! */
      setTimeout(() => {
        triggerFlash(() => {
          const unlockedEras = getUnlockedEras();
          const pool = CARDS.filter(c => unlockedEras.includes(c.album));
          if (!pool.length) return alert('Для этой Эры пока нет карт. Открой новую площадку в Студии.');
          const c = pool[Math.floor(Math.random() * pool.length)];
          const r = Math.random();
          const tier = type === 'platinum' ? 'platinum' : (type === 'gold' ? (r < 0.25 ? 'platinum' : 'gold') : (r < 0.2 ? 'gold' : 'silver'));
          addCardCopy(c.id, tier);
          save(); renderBinder();
          haptic('ok'); sfx('win');
          if (tier !== 'silver') fireConfetti();
          if (c.quoteFile) setTimeout(() => playAudio(c.quoteFile, c.quoteKr), 120);

          const tm = TIER_META[tier], cnt = st.inv[c.id][tier];
          modal.innerHTML = `
            <div style="font-size:14px;font-weight:900;color:${tm.color};margin-bottom:14px">${tm.name.toUpperCase()} • КОПИЙ: ${cnt}${cnt >= 3 ? ' (СЛИЯНИЕ 3→1!)' : ''}</div>
            <div class="photocard tier-${tier} reveal-card">
              <div class="pc-rarity" style="color:${tm.color}">${tm.name}</div>
              ${cardArtHtml(c)}
              <div class="pc-name" style="font-size:16px">${c.name}</div>
              <div class="pc-role">${c.role}</div>
              <div style="margin-top:8px;font-size:12px;color:#ff99d6">«${c.quoteKr}»</div>
            </div>
            <button class="btn full" style="max-width:240px;margin-top:18px" onclick="document.getElementById('pack-modal').classList.remove('open')">Забрать</button>`;
        });
      }, 880);
    };
  };

  /* ====== ТОП: НЕДЕЛЬНЫЙ ТУРНИР ИЗ 30 СТУДИЙ (3 ЗОНЫ) ====== */
  function renderRankRows(rows) {
    let html = '', lastZone = null;
    rows.forEach(r => {
      const z = zoneInfo(r.pos);
      if (z.cls !== lastZone) {
        lastZone = z.cls;
        const range = z.cls === 'zone-promote' ? 'Места 1–7'
          : (z.cls === 'zone-drop' ? 'Места 23–30' : (st.weeklyLeague > 0 ? 'Места 8–22' : 'Места 8–30'));
        html += `<div class="zone-head ${z.cls}"><span>${z.icon} ${z.label} • ${range}</span><small>${escapeHtml(z.note)}</small></div>`;
      }
      html += `<div class="wr-row ${r.me ? 'me' : ''} ${r.pos <= 3 ? 'top' : ''}">
        <div class="wr-pos">#${r.pos}</div>
        <div class="wr-ava" style="background:${r.grad}">${escapeHtml(r.initials)}</div>
        <div class="wr-name"><b>${escapeHtml(r.name)}${r.me ? ' • ты' : ''}</b><span>${escapeHtml(r.sub)}</span></div>
        <div class="wr-score">${r.hype} 🔥</div>
      </div>`;
    });
    return html;
  }

  window.renderRank = function () {
    if (!Array.isArray(window.CARDS)) return;
    initStudioState();
    const screen = document.getElementById('screen-rank');
    if (!screen) return;

    st.weeklyHype = Math.max(0, Math.round(st.weeklyHype || 0));
    const leagueIdx = st.weeklyLeague || 0;
    const league = WEEKLY_LEAGUES[leagueIdx];
    const nextLeague = WEEKLY_LEAGUES[leagueIdx + 1] || null;
    const rows = weeklyBoard();
    const me = rows.find(r => r.me) || { pos: WEEKLY_SIZE, hype: st.weeklyHype };
    const myZone = zoneInfo(me.pos);
    const left = weekStartTs() + 7 * 86400000 - Date.now();
    const nextPromo = st.weeklyLeague < WEEKLY_LEAGUES.length - 1 ? WEEKLY_LEAGUES[leagueIdx + 1] : null;
    const promoPrize = `${league.promoteBox} + ${league.promoteCoins} 🎤`;

    screen.innerHTML = `
      <div class="league-card">
        <div class="module-tag">${league.icon} Недельная лига • 30 студий</div>
        <div class="wr-head" style="margin-top:8px">
          <div style="text-align:left">
            <div class="wr-liga">${escapeHtml(league.name)}</div>
            <div class="wr-place" onclick="switchTab('binder')">Место <b style="color:#fff">#${me.pos} из ${WEEKLY_SIZE}</b> • ${me.hype} 🔥</div>
          </div>
          <div class="wr-timer">До конца лиги<b id="wr-timer">${fmtWeekLeft(left)}</b></div>
        </div>
        <div class="bar-bg"><div class="bar-fill" style="width:${Math.max(2, Math.round((1 - me.pos / WEEKLY_SIZE) * 100))}%"></div></div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">
          ⬆️ 1–7${nextPromo ? ' → ' + escapeHtml(nextPromo.name) : ' • Топ-7 элиты'} • ⚪ 8–${leagueIdx > 0 ? 22 : 30} • ${leagueIdx > 0 ? '⬇️ 23–30' : 'без вылета'}
        </div>
      </div>

      <div class="quest-sec"><span>Награда за повышение</span><span>1–7 место</span></div>
      <div class="box-list" style="margin-bottom:8px">
        <div class="box-row ${league.promoteBox === 'Платиновый бокс' ? 'platinum' : 'gold'}">
          <div class="mini-album"><span style="background:rgba(0,0,0,0.35);color:var(--gold);border:1px solid var(--gold)">TOP</span></div>
          <div style="flex:1"><div class="l-title" style="color:var(--gold)">🏆 ${escapeHtml(promoPrize)}</div><div class="l-meta">Удержание (8–${leagueIdx > 0 ? 22 : 30}): +${league.midCoins} 🎤</div></div>
        </div>
      </div>

      <div class="quest-sec"><span>Турнирная комната</span><span>Твоя зона: ${myZone.icon} ${escapeHtml(myZone.note)}</span></div>
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
      t.textContent = fmtWeekLeft(weekStartTs() + 7 * 86400000 - Date.now());
    }, 30000);
  };

  /* ====== ЖИВЫЕ ТАЛАНТЫ ВНУТРИ УРОКОВ (ПОНЯТНЫЕ ПЛАШКИ + ПОДСКАЗКИ ПО КЛИКУ) ====== */
  const origStartLesson = window.startLesson;
  window.startLesson = function (id) {
    const b = getTeamBonuses();
    lessonTalents = { shields: b.shields, hints: b.hints, combo: 0, comboPct: b.comboPct, hypePct: b.hypePct };
    origStartLesson(id);
  };

  const origRenderStep = window.renderStep;
  window.renderStep = function () {
    origRenderStep();
    const body = document.getElementById('study-body');
    const s = queue[qIdx];

    // Успешный шаг диктанта/аудио → дейлик «Идеальный слух» и +5 недельного Хайпа.
    if (body && s && (s.type === 'draw' || s.type === 'listen' || s.type === 'listen_build')) {
      body.querySelectorAll('.feedback-bar.ok').forEach(fb => {
        if (fb.dataset.dictTracked) return;
        fb.dataset.dictTracked = '1';
        if (typeof window.awardDictationStep === 'function') window.awardDictationStep();
      });
    }

    if (!body || !s || (s.type !== 'choice' && s.type !== 'listen')) return;

    const bar = document.createElement('div');
    bar.className = 'talent-bar';
    bar.innerHTML = `
      <div style="display:flex;gap:6px">
        <button type="button" class="t-chip ${lessonTalents.shields > 0 ? 'shield-on' : ''}" id="tb-shield">🛡️ Щит: ${lessonTalents.shields}</button>
        <button type="button" class="t-chip ${lessonTalents.combo > 0 ? 'combo-on' : ''}" id="tb-combo">🔥 Серия: ${lessonTalents.combo}</button>
      </div>
      <button type="button" class="t-hint-btn" id="tb-hint" ${lessonTalents.hints <= 0 ? 'disabled' : ''}>✨ Подсказка (${lessonTalents.hints})</button>
    `;
    body.prepend(bar);

    /* Пояснения по клику на плашки */
    document.getElementById('tb-shield').onclick = () => {
      const vc = st.team.vocal ? CARDS.find(x => x.id === st.team.vocal) : null;
      alert(vc
        ? `🛡️ Щит от ошибок (${vc.name.split('•')[0].trim()}):\nСрабатывает сам при неверном ответе. Осталось: ${lessonTalents.shields}`
        : '🛡️ Щит от ошибок:\nПоставь карту Вокала в состав Студии, чтобы получать защиту в уроках!');
    };
    document.getElementById('tb-combo').onclick = () => {
      const dc = st.team.dance ? CARDS.find(x => x.id === st.team.dance) : null;
      alert(dc
        ? `🔥 Серия ответов (${dc.name.split('•')[0].trim()}):\nБонус +${lessonTalents.comboPct}% XP в конце урока за серию без ошибок!`
        : '🔥 Серия ответов:\nПоставь карту Танцора в состав Студии, чтобы получать бонус XP за комбо!');
    };

    const opts = Array.from(body.querySelectorAll('.opt-btn'));
    document.getElementById('tb-hint').onclick = (e) => {
      if (lessonTalents.hints <= 0) return;
      const wrongBtns = opts.filter((b, idx) => idx !== s.correct && !b.disabled);
      if (wrongBtns.length < 2) return;
      lessonTalents.hints--;
      shuffle(wrongBtns).slice(0, 2).forEach(b => { b.disabled = true; b.style.opacity = '0.2'; });
      e.target.textContent = `✨ Подсказка (${lessonTalents.hints})`;
      e.target.disabled = true;
      haptic('ok'); sfx('tap');
    };

    opts.forEach((btn, idx) => {
      const origClick = btn.onclick;
      btn.onclick = () => {
        if (idx === s.correct) {
          lessonTalents.combo++;
          origClick();
        } else if (lessonTalents.shields > 0) {
          lessonTalents.shields--;
          btn.disabled = true;
          btn.style.opacity = '0.25';
          const sh = document.getElementById('tb-shield');
          sh.textContent = `🛡️ Щит: ${lessonTalents.shields}`;
          if (lessonTalents.shields <= 0) sh.classList.remove('shield-on');
          haptic('ok'); sfx('tap');
          alert('🛡️ Вокал подстраховал! Ошибка не засчитана — выбери другой вариант.');
        } else {
          lessonTalents.combo = 0;
          origClick();
        }
      };
    });
  };

  const origFinishLesson = window.finishLesson;
  window.finishLesson = function () {
    if (!curL) return origFinishLesson();
    const passed = !(curL.isExam && mistakes > 4);
    const wasDone = st.done.includes(curL.id);

    // Награды (XP, микрофоны, хайп, комбо) считает единая функция в index.html.
    origFinishLesson();
    if (!passed) return;

    initStudioState();
    window.trackQuest('lesson');
    // Дейлик «Чистый бит»: за урок накопилось комбо 3+ верных ответов подряд.
    if ((lessonTalents.combo || 0) > 0) window.trackQuest('combo', lessonTalents.combo);

    if (!wasDone) {
      if (curL.isExam) st.cases.platinum++;
      else if (curL.id % 4 === 0) st.cases.gold++;
    }
    syncResources();
    save();
  };

  const navBinder = document.getElementById('nav-binder');
  if (navBinder && navBinder.lastChild) navBinder.lastChild.textContent = 'Студия';

  function bootStudio() {
    initStudioState();
    renderLessons();
    // Сработала заморозка ❄️ — короткое уведомление.
    if (pendingFreezeToast) {
      pendingFreezeToast = false;
      showToast(`❄️ Заморозка спасла серию 🔥 ${st.streak.count} дн.! Осталось: ${st.streakFreeze}/${STREAK_FREEZE_MAX}`, 3200);
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
