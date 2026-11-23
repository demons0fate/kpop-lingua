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
    platinum: { name: "Платина", mult: 2.2, power: 400, color: "#00e5ff", shields: 2, hints: 2, comboPct: 35, hypePct: 35 },
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

    /* Рамки редкости */
    .tier-silver { border: 1.5px solid #b0bec5; }
    .tier-gold { border: 2px solid #ffd700; box-shadow: 0 0 12px rgba(255,215,0,0.28); }
    .tier-platinum { border: 2px solid #00e5ff; box-shadow: 0 0 16px rgba(0,229,255,0.35); }
    .tier-neon { border: 2px solid #ff2e93; box-shadow: 0 0 18px rgba(255,46,147,0.55); animation: neonPulse 2s infinite alternate; }
    @keyframes neonPulse { from { box-shadow: 0 0 12px rgba(255,46,147,0.4); } to { box-shadow: 0 0 22px rgba(0,229,255,0.75); } }

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
        /* === ТЕСТ РАМОК КАРТ (Адаптировано под рамку из Figma) === */
    .mini-card[class*="tier-"] {
      position: relative;
      box-sizing: border-box;
      aspect-ratio: 3 / 4;
      display: flex;
      flex-direction: column;
      /* Отступы: сверху и снизу побольше под эквалайзеры, по бокам под скосы */
      padding: 16% 12% 16% 12% !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      animation: none !important;
      overflow: visible !important;
    }
    .mini-card[class*="tier-"]::before {
      content: "";
      position: absolute;
      /* Внутренний фон подкладываем строго под рамку */
      inset: 8% 7%;
      background: #120d21;
      border-radius: 12px;
      z-index: 0;
    }
    .mini-card[class*="tier-"] > * {
      position: relative;
      z-index: 1;
    }
    .mini-card[class*="tier-"] .pc-art {
      flex: 1;
      height: auto !important;
      min-height: 0;
      border-radius: 8px;
      margin-bottom: 4px;
      object-fit: cover;
    }
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

    /* Специфика для больших карт (в модалках и при открытии) */
    .photocard[class*="tier-"] {
      position: relative;
      box-sizing: border-box;
      aspect-ratio: 3 / 4;
      width: 100%;
      max-width: 280px;
      margin: 0 auto;
      padding: 42px 32px 42px 32px !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      animation: none !important;
      overflow: visible !important;
    }
    .photocard[class*="tier-"]::before {
      content: "";
      position: absolute;
      inset: 22px 18px;
      background: #120d21;
      border-radius: 16px;
      z-index: 0;
    }
    .photocard[class*="tier-"] > * {
      position: relative;
      z-index: 1;
    }
    .photocard[class*="tier-"] .pc-art {
      flex: 1;
      height: auto !important;
      min-height: 0;
      border-radius: 10px;
      margin-bottom: 8px;
    }

    /* Наложение самой рамки поверх всего */
    .mini-card[class*="tier-"]::after,
    .photocard[class*="tier-"]::after {
      content: "";
      position: absolute;
      /* Растягиваем рамку на всю площадь */
      inset: 0;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      pointer-events: none;
      z-index: 4;
    }

    /* Точки и маркеры поверх рамки */
    .mc-dot   { top: 10% !important; left: 10% !important; z-index: 5 !important; }
    .mc-craft { top: 9% !important; right: 10% !important; z-index: 5 !important; }

    /* Подключение файлов из твоей папки */
    .mini-card.tier-silver::after,   .photocard.tier-silver::after   { background-image: url('img/frames/silver.webp'); }
    .mini-card.tier-gold::after,     .photocard.tier-gold::after     { background-image: url('img/frames/gold.webp'); }
    .mini-card.tier-platinum::after, .photocard.tier-platinum::after { background-image: url('img/frames/platinum.webp'); }
    .mini-card.tier-neon::after,     .photocard.tier-neon::after     { background-image: url('img/frames/neon.webp'); }
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
  window.alert = function (msg) {
    toastEl.textContent = String(msg);
    toastEl.classList.add('show');
    if (typeof haptic === 'function') haptic('light');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

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
    if (!st.streak) st.streak = { count: 1, lastDate: today };
    else if (st.streak.lastDate !== today) {
      const yest = new Date(Date.now() - 86400000);
      const yKey = `${yest.getFullYear()}-${yest.getMonth() + 1}-${yest.getDate()}`;
      st.streak.count = (st.streak.lastDate === yKey) ? st.streak.count + 1 : 1;
      st.streak.lastDate = today;
    }

    if (!st.daily || st.daily.date !== today) {
      st.daily = {
        date: today, lessons: 0, dict: 0, cards: 0,
        dictSeen: [], cardSeen: [],
        p1: false, p2: false, p3: false, claimed: false
      };
    } else {
      if (typeof st.daily.lessons !== 'number') st.daily.lessons = 0;
      if (typeof st.daily.dict !== 'number') st.daily.dict = 0;
      if (typeof st.daily.cards !== 'number') st.daily.cards = 0;
      if (!Array.isArray(st.daily.dictSeen)) st.daily.dictSeen = [];
      if (!Array.isArray(st.daily.cardSeen)) st.daily.cardSeen = [];
    }

    if (!st.weekly || st.weekly.week !== wk) st.weekly = { week: wk, days: [], claimed: false };
    if (!Array.isArray(st.weekly.days)) st.weekly.days = [];
    if (!st.monthly || st.monthly.key !== mk) st.monthly = { key: mk, pts: 0, claimed: false };
    if (typeof st.monthly.pts !== 'number') st.monthly.pts = 0;
    save(false);
  }

  /* ====== КВЕСТЫ: ДЕЙЛИКИ, НЕДЕЛЯ И ОЧКИ МЕСЯЦА ====== */
  function dailyDoneCount() {
    const d = st.daily;
    return (d.lessons >= 1 ? 1 : 0) + (d.dict >= 2 ? 1 : 0) + (d.cards >= 3 ? 1 : 0);
  }

  function syncQuestProgress() {
    const d = st.daily, m = st.monthly;
    const goals = { p1: d.lessons >= 1, p2: d.dict >= 2, p3: d.cards >= 3 };
    let gained = 0;
    Object.keys(goals).forEach(key => {
      if (goals[key] && !d[key]) { d[key] = true; gained++; }
    });
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

  window.trackQuest = function (type, value) {
    initStudioState();
    const d = st.daily;
    if (type === 'lesson') {
      d.lessons++;
      const td = todayKey();
      if (!st.weekly.days.includes(td)) st.weekly.days.push(td);
    } else if (type === 'dict') {
      if (value == null || !d.dictSeen.includes(value)) {
        if (value != null) d.dictSeen.push(value);
        d.dict++;
      }
    } else if (type === 'card') {
      if (value == null || !d.cardSeen.includes(value)) {
        if (value != null) d.cardSeen.push(value);
        d.cards++;
      }
    }
    syncQuestProgress();
    save(false);
  };

  window.getLessonComboPct = function () {
    return lessonTalents.comboPct || 0;
  };

  window.getTeamBonuses = function () {
    let power = ((st.upgrades && st.upgrades.practice) || 0) * 80;
    let energyMin = ((st.upgrades && st.upgrades.cafe) || 0) * 5;
    let coinsPct = ((st.upgrades && st.upgrades.sound) || 0) * 5;
    let shields = 0, hints = 0, comboPct = 0, hypePct = 0, count = 0;
    const albums = [];

    ROLES.forEach(r => {
      const cid = st.team[r.key], tier = cid ? getBestTier(cid) : null;
      if (!tier) return;
      const c = CARDS.find(x => x.id === cid); if (!c) return;
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
    if (!Array.isArray(window.CARDS) || !window.CARDS.length) return;
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
            <div class="agency-id">${STAGES[getCurrentStageIdx()].ico} ${STAGES[getCurrentStageIdx()].name} • Серия ${st.streak.count} дн.</div>
            <div class="league-pill" style="color:${lg.color}">${lg.icon} ${lg.name} • ${st.xp} XP</div>
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
        el.className = 'team-slot' + (c ? ' filled' : '');
        if (c) {
          const tm = TIER_META[tier];
          el.style.borderColor = tm.color;
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
      const dCnt = dailyDoneCount();
      const wCnt = Math.min(w.days.length, 5);
      const curMonthIdx = new Date().getMonth(), curYear = new Date().getFullYear();

      sub.innerHTML = `
        <div class="quest-sec" style="margin-top:4px"><span>Ежедневные задания</span><span style="color:var(--cyan)">${dCnt}/3</span></div>
        <div class="contract-row ${d.lessons >= 1 ? 'done' : ''}"><div><div class="c-title">Пройти 1 урок или повтор</div></div><div class="c-prog">${Math.min(d.lessons, 1)}/1</div></div>
        <div class="contract-row ${d.dict >= 2 ? 'done' : ''}"><div><div class="c-title">Написать 2 слова в Диктанте</div></div><div class="c-prog">${Math.min(d.dict, 2)}/2</div></div>
        <div class="contract-row ${d.cards >= 3 ? 'done' : ''}"><div><div class="c-title">Перевернуть 3 карточки</div></div><div class="c-prog">${Math.min(d.cards, 3)}/3</div></div>
        <div class="daily-prize">
          <div style="font-size:12px;font-weight:800;margin-bottom:6px">Бонус дня: Серебряный бокс + 25 🎤</div>
          ${dCnt === 3 && !d.claimed ? `<button class="btn gold full" id="claim-daily">Забрать бонус дня!</button>` : (d.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Получено сегодня</div>` : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((dCnt / 3) * 100)}%"></div></div>`)}
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
        st.cases.silver++;
        st.coins += 25;
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
    if (!Array.isArray(window.CARDS) || !window.CARDS.length) return;
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

  /* ====== ТОП: ЛИГА, ПРИЗОВЫЕ БОКСЫ И ЖИВОЙ РЕЙТИНГ ====== */
  window.renderRank = function () {
    if (!Array.isArray(window.CARDS) || !window.CARDS.length) return;
    initStudioState();
    const screen = document.getElementById('screen-rank');
    if (!screen) return;

    const lg = getLeague(st.xp);
    const nextLg = LEAGUES.find(x => x.minXp > st.xp);
    const pct = nextLg ? Math.min(100, Math.round(((st.xp - lg.minXp) / Math.max(1, nextLg.minXp - lg.minXp)) * 100)) : 100;
    const today = new Date().getDay();
    const daysLeft = (7 - today) % 7;
    const prizes = [
      { place: 1, name: 'Платиновый бокс', cls: 'platinum', color: '#00e5ff', tag: 'P1' },
      { place: 2, name: 'Золотой бокс', cls: 'gold', color: '#ffd700', tag: 'P2' },
      { place: 3, name: 'Серебряный бокс', cls: 'silver', color: '#cfd8dc', tag: 'P3' }
    ];
    const players = [
      { name: 'Minji_Seoul', xp: 620 },
      { name: 'Kpop_Sora', xp: 480 },
      { name: 'V_Army95', xp: 340 },
      { name: `Ты • ${lg.name}`, xp: st.xp, me: true }
    ].sort((a, b) => b.xp - a.xp);

    screen.innerHTML = `
      <div class="league-card">
        <div class="module-tag">Недельный зачёт • ${escapeHtml(lg.name)}</div>
        <h3 style="margin:6px 0">${lg.icon} ${escapeHtml(lg.name)}</h3>
        <div style="font-size:13px;color:#c9bedf;margin-bottom:10px">${st.xp} XP${nextLg ? ` • до «${escapeHtml(nextLg.name)}» ещё ${nextLg.minXp - st.xp} XP` : ' • максимальная лига!'}</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">Обновление рейтинга в воскресенье${daysLeft === 0 ? ' — сегодня!' : ` • через ${daysLeft} дн.`}</div>
      </div>

      <div class="quest-sec"><span>Призы Топ-3</span><span>Неделя</span></div>
      <div class="box-list" style="margin-bottom:16px">
        ${prizes.map(p => `<div class="box-row ${p.cls}">
          <div class="mini-album"><span style="background:rgba(0,0,0,0.35);color:${p.color};border:1px solid ${p.color}">${p.tag}</span></div>
          <div style="flex:1"><div class="l-title" style="color:${p.color}">${p.place} место</div><div class="l-meta">${p.name}</div></div>
          <div style="font-weight:900;color:${p.color}">🏆</div>
        </div>`).join('')}
      </div>

      <div class="quest-sec"><span>Рейтинг недели</span><span>${players.length} участника</span></div>
      <div id="rank-list">
        ${players.map((p, i) => `<div class="rank-row ${p.me ? 'me' : ''}">
          <div style="width:28px;font-weight:800;color:${i < 3 ? 'var(--gold)' : 'var(--muted)'}">#${i + 1}</div>
          <div style="flex:1;font-weight:700">${escapeHtml(p.name)}</div>
          <div style="font-weight:800;color:var(--cyan)">${p.xp} XP</div>
        </div>`).join('')}
      </div>`;
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
  }

  if (window.AppData) window.AppData.whenReady(bootStudio);
  else bootStudio();
})();
