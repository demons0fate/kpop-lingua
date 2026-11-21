/* ====== СТУДИЯ (ОНБОРДИНГ, ПРОФИЛЬ + 12 РАНГОВ, 3 ВКЛАДКИ: ГРУППА / КВЕСТЫ / ЗАЛ СЛАВЫ) + МАГАЗИН + ТОП ====== */
(function () {
  const ROLES = [
    { key: "vocal", title: "Вокал", desc: "Бонус XP" },
    { key: "dance", title: "Танцор", desc: "Энергия" },
    { key: "rap", title: "Рэпер", desc: "Микрофоны" },
    { key: "visual", title: "Вижуал", desc: "Удача боксов" }
  ];

  const TIERS = ["silver", "gold", "platinum", "neon"];
  const TIER_META = {
    silver:   { name: "Серебро", mult: 1.0, power: 100, color: "#cfd8dc" },
    gold:     { name: "Золото",  mult: 1.6, power: 200, color: "#ffd700" },
    platinum: { name: "Платина", mult: 2.3, power: 350, color: "#00e5ff" },
    neon:     { name: "Неон",    mult: 3.2, power: 600, color: "#ff2e93" }
  };

  /* 12 ступеней: 4 лиги × 3 ранга (I, II, III) */
  const LEAGUES = [
    { id: "bronze1", name: "Трейни I",        minXp: 0,    icon: "◆", cls: "lg-bronze", color: "#cd9b6a" },
    { id: "bronze2", name: "Трейни II",       minXp: 100,  icon: "◆", cls: "lg-bronze", color: "#cd9b6a" },
    { id: "bronze3", name: "Трейни III",      minXp: 220,  icon: "◆", cls: "lg-bronze", color: "#cd9b6a" },
    { id: "silver1", name: "Инди-лейбл I",    minXp: 360,  icon: "◈", cls: "lg-silver", color: "#cfd8dc" },
    { id: "silver2", name: "Инди-лейбл II",   minXp: 520,  icon: "◈", cls: "lg-silver", color: "#cfd8dc" },
    { id: "silver3", name: "Инди-лейбл III",  minXp: 700,  icon: "◈", cls: "lg-silver", color: "#cfd8dc" },
    { id: "gold1",   name: "Топ-лейбл I",     minXp: 900,  icon: "★", cls: "lg-gold",   color: "#ffd700" },
    { id: "gold2",   name: "Топ-лейбл II",    minXp: 1150, icon: "★", cls: "lg-gold",   color: "#ffd700" },
    { id: "gold3",   name: "Топ-лейбл III",   minXp: 1450, icon: "★", cls: "lg-gold",   color: "#ffd700" },
    { id: "neon1",   name: "Мировой чарт I",  minXp: 1800, icon: "✦", cls: "lg-neon",   color: "#ff2e93" },
    { id: "neon2",   name: "Мировой чарт II", minXp: 2200, icon: "✦", cls: "lg-neon",   color: "#ff2e93" },
    { id: "neon3",   name: "Мировой чарт III",minXp: 2700, icon: "✦", cls: "lg-neon",   color: "#ff2e93" }
  ];

  const AVATAR_PRESETS = [
    { icon: "🎧", bg: "linear-gradient(135deg, #ff2e93, #7b2cbf)" },
    { icon: "🎤", bg: "linear-gradient(135deg, #00e5ff, #3a0ca3)" },
    { icon: "⚡", bg: "linear-gradient(135deg, #ffd700, #ff6b00)" },
    { icon: "💿", bg: "linear-gradient(135deg, #b46eff, #00c6ff)" },
    { icon: "🌟", bg: "linear-gradient(135deg, #ff4757, #ff9f43)" }
  ];

  const MONTHS = [
    { m: 0,  name: "Янв", icon: "❄️", col: "#00e5ff" },
    { m: 1,  name: "Фев", icon: "💜", col: "#b46eff" },
    { m: 2,  name: "Мар", icon: "🌸", col: "#ff7ac6" },
    { m: 3,  name: "Апр", icon: "🎧", col: "#00c6ff" },
    { m: 4,  name: "Май", icon: "⚡", col: "#ffd700" },
    { m: 5,  name: "Июн", icon: "🌟", col: "#ff9f43" },
    { m: 6,  name: "Июл", icon: "🌊", col: "#00d2d3" },
    { m: 7,  name: "Авг", icon: "🔥", col: "#ff4757" },
    { m: 8,  name: "Сен", icon: "🎙️", col: "#a56eff" },
    { m: 9,  name: "Окт", icon: "🌙", col: "#ff6b81" },
    { m: 10, name: "Ноя", icon: "💿", col: "#00e5ff" },
    { m: 11, name: "Дек", icon: "👑", col: "#ffd700" }
  ];

  const MONTHLY_GOAL = 50;
  const BOX_IMAGES = { silver: '', gold: '', platinum: '', vinyl: '' };

  let studioSubTab = 'group'; // 'group' | 'quests' | 'hall'
  let shopSubTab = 'boxes';   // 'boxes' | 'vip'

  // 1. Стили
  const css = document.createElement('style');
  css.textContent = `
    .nav-dot { position: absolute; top: 4px; right: 22%; width: 8px; height: 8px; border-radius: 50%; background: var(--success); border: 1.5px solid #0f0b1a; display: none; }
    .nav-dot.show { display: block; }
    .tab-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--success); margin-left: 4px; vertical-align: middle; }

    /* Кликабельная шапка агентства */
    .agency-card { border-radius: 20px; padding: 14px 15px; margin-bottom: 14px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.18s ease; }
    .agency-card:active { transform: scale(0.98); }
    .agency-card.lg-bronze { background: linear-gradient(135deg, #2b1f1a, #17111a); border: 1.5px solid rgba(205,155,106,0.55); }
    .agency-card.lg-silver { background: linear-gradient(135deg, #232838, #141224); border: 1.5px solid rgba(207,216,220,0.65); box-shadow: 0 0 16px rgba(207,216,220,0.14); }
    .agency-card.lg-gold   { background: linear-gradient(135deg, #3b2c10, #1c1326); border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255,215,0,0.22); }
    .agency-card.lg-neon   { background: linear-gradient(135deg, #3b1240, #12293d); border: 2px solid #ff2e93; box-shadow: 0 0 24px rgba(255,46,147,0.35), inset 0 0 18px rgba(0,229,255,0.2); }
    .agency-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .av-circle { width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 26px; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
    .agency-name { font-size: 17px; font-weight: 900; color: #fff; line-height: 1.15; }
    .agency-id { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 700; letter-spacing: 0.5px; margin-top: 2px; }
    .league-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 9px; border-radius: 8px; background: rgba(0,0,0,0.42); margin-top: 5px; }
    .agency-buffs { font-size: 11px; color: #d8cce8; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }

    /* Полноэкранный оверлей (Профиль + 12 рангов) */
    .full-overlay { position: fixed; inset: 0; background: #0e0a1a; z-index: 9500; display: none; flex-direction: column; }
    .full-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .ov-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(20,14,34,0.96); }
    .ov-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 36px; -webkit-overflow-scrolling: touch; }

    /* Лестница 12 рангов */
    .rank-step { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 10px 12px; margin-bottom: 8px; opacity: 0.5; }
    .rank-step.reached { opacity: 1; }
    .rank-step.current { opacity: 1; border-width: 1.5px; background: linear-gradient(135deg, rgba(40,28,68,0.95), rgba(20,14,34,0.95)); box-shadow: 0 0 14px rgba(255,46,147,0.2); }
    .rs-ico { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; background: rgba(0,0,0,0.35); flex-shrink: 0; }

    /* Приветственный контракт продюсера */
    .onb-overlay { position: fixed; inset: 0; background: radial-gradient(circle at top, #271242, #0b0714 75%); z-index: 9800; display: none; align-items: center; justify-content: center; padding: 20px; }
    .onb-overlay.open { display: flex; animation: fadeIn 0.28s ease; }
    .onb-card { width: 100%; max-width: 340px; background: rgba(22, 16, 38, 0.94); border: 1.5px solid rgba(255,46,147,0.45); box-shadow: 0 0 36px rgba(255,46,147,0.22); border-radius: 24px; padding: 22px 18px; text-align: center; }
    .onb-input { width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.38); border: 1.5px solid rgba(0,229,255,0.4); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 15px; font-weight: 800; text-align: center; outline: none; margin: 10px 0 14px; }
    .av-pick-row { display: flex; justify-content: center; gap: 10px; margin: 10px 0 18px; }
    .av-pick { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; border: 2px solid transparent; opacity: 0.6; transition: 0.18s; }
    .av-pick.sel { opacity: 1; border-color: #fff; transform: scale(1.1); box-shadow: 0 0 12px rgba(255,255,255,0.35); }

    /* Состав группы и Синергия */
    .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
    .team-slot { background: var(--surface); border: 1.5px dashed rgba(255,255,255,0.16); border-radius: 14px; padding: 8px 4px; text-align: center; cursor: pointer; transition: 0.2s; min-height: 74px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .team-slot.filled { border-style: solid; background: linear-gradient(160deg, #201836, #140f24); }
    .team-slot:active { transform: scale(0.94); }
    .slot-role { font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
    .slot-tag { font-size: 15px; font-weight: 900; margin: 3px 0 1px; color: #fff; }
    .slot-tier { font-size: 9px; font-weight: 800; }

    .synergy-bar { font-size: 11px; padding: 7px 12px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); color: var(--muted); }
    .synergy-bar.on { background: rgba(0,230,118,0.12); border-color: var(--success); color: #b8ffd6; }

    /* Компактная сетка Моих карт (3 колонки) */
    .cards-mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .mini-card { background: linear-gradient(160deg, #251e3d, #140f24); border-radius: 14px; padding: 6px; text-align: center; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.18s var(--spring); }
    .mini-card:active { transform: scale(0.93); }
    .mini-card .pc-art { height: 86px; border-radius: 10px; margin-bottom: 5px; }
    .mini-card .pc-monogram { font-size: 24px; }
    .mini-card .mc-name { font-size: 11px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-card .mc-sub { font-size: 9px; color: var(--muted); }
    .mc-dot { position: absolute; top: 5px; left: 5px; z-index: 3; width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
    .mc-craft { position: absolute; top: 4px; right: 4px; z-index: 3; background: var(--success); color: #05170c; font-size: 8px; font-weight: 900; padding: 2px 5px; border-radius: 6px; }

    /* 4 ранга рамок */
    .tier-silver { border: 1.5px solid #b0bec5; }
    .tier-gold { border: 2px solid #ffd700; box-shadow: 0 0 12px rgba(255,215,0,0.25); }
    .tier-platinum { border: 2px solid #00e5ff; box-shadow: 0 0 16px rgba(0,229,255,0.32); }
    .tier-neon { border: 2px solid #ff2e93; box-shadow: 0 0 18px rgba(255,46,147,0.5); animation: neonPulse 2s infinite alternate; }
    @keyframes neonPulse { from { box-shadow: 0 0 12px rgba(255,46,147,0.4); } to { box-shadow: 0 0 22px rgba(0,229,255,0.7); } }
    .photocard.tier-gold::after, .photocard.tier-platinum::after, .photocard.tier-neon::after { content: ''; position: absolute; inset: -60%; background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.24) 50%, transparent 65%); transform: rotate(18deg); animation: holo 3.4s infinite linear; pointer-events: none; }

    /* Увеличение карты по клику */
    .zoom-modal { width: 100%; max-width: 330px; padding: 16px; animation: zoomIn 0.28s var(--spring); }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.75); } to { opacity: 1; transform: scale(1); } }
    .tier-pills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 12px 0; }
    .t-pill { background: var(--surface-2); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 4px; text-align: center; font-size: 10px; }
    .t-pill b { display: block; font-size: 14px; margin-top: 2px; }

    /* Карточки достижений в Зале славы */
    .ach-card { display: flex; gap: 12px; align-items: center; background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 12px 13px; margin-bottom: 9px; }
    .ach-card.done { border-color: rgba(255,215,0,0.45); background: linear-gradient(135deg, rgba(43,33,66,0.9), rgba(20,14,34,0.95)); }
    .ach-ico { width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; background: rgba(255,255,255,0.06); }
    .ach-card.done .ach-ico { background: rgba(255,215,0,0.18); box-shadow: 0 0 12px rgba(255,215,0,0.2); }
    .ach-body { flex: 1; min-width: 0; }
    .ach-title { font-size: 13px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; gap: 6px; }
    .ach-desc { font-size: 11px; color: var(--muted); margin: 2px 0 6px; }
    .ach-rew { font-size: 10px; font-weight: 800; color: var(--cyan); }

    /* Витрина боксов в Магазине */
    .box-list { display: grid; gap: 10px; }
    .box-row { display: flex; align-items: center; gap: 12px; background: var(--surface); border-radius: 18px; padding: 12px 14px; border: 1.5px solid rgba(255,255,255,0.1); }
    .box-row.silver { border-color: rgba(207,216,220,0.4); background: linear-gradient(135deg, #1f2330, #13151f); }
    .box-row.gold { border-color: rgba(255,215,0,0.45); background: linear-gradient(135deg, #332710, #17120c); }
    .box-row.platinum { border-color: rgba(0,229,255,0.5); background: linear-gradient(135deg, #112b3b, #151026); }
    .mini-album { width: 46px; height: 46px; border-radius: 10px; position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .mini-album::after { content: ''; position: absolute; right: -8px; top: 5px; width: 36px; height: 36px; border-radius: 50%; background: radial-gradient(circle, #ff2e93 18%, #111 22%, #222 45%, #111 70%); z-index: 0; }
    .mini-album span { position: relative; z-index: 1; width: 100%; height: 100%; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

    /* Анимация открытия бокса */
    .album-stage { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 10px 0 18px; }
    .album-vinyl { position: absolute; width: 150px; height: 150px; border-radius: 50%; background: repeating-radial-gradient(circle, #14141c 0px, #14141c 3px, #1f1f2b 4px, #14141c 6px); border: 2px solid rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; transform: translateX(0) rotate(0deg); transition: transform 0.5s ease-in, opacity 0.4s ease; opacity: 0; z-index: 1; pointer-events: none; }
    .vinyl-label { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--cyan)); border: 3px solid #111; display: flex; align-items: center; justify-content: center; }
    .vinyl-hole { width: 10px; height: 10px; border-radius: 50%; background: #0b0814; }
    .album-sleeve { position: relative; z-index: 2; width: 180px; height: 180px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 14px 36px rgba(0,0,0,0.55); transition: transform 0.25s var(--spring), opacity 0.3s ease; animation: packFloat 3s infinite ease-in-out; background-size: contain; background-repeat: no-repeat; background-position: center; }
    .album-sleeve.no-img.silver { background: linear-gradient(145deg, #3a4052, #1b1e29); border: 2px solid #cfd8dc; border-radius: 18px; }
    .album-sleeve.no-img.gold { background: linear-gradient(145deg, #694c14, #261b0b); border: 2px solid #ffd700; border-radius: 18px; }
    .album-sleeve.no-img.platinum { background: linear-gradient(145deg, #124d66, #23123d); border: 2px solid #00e5ff; border-radius: 18px; }
    @keyframes packFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(1deg); } }
    @keyframes packShake { 0%, 100% { transform: scale(1.05) rotate(0); } 20%, 60% { transform: scale(1.05) rotate(-5deg); } 40%, 80% { transform: scale(1.05) rotate(5deg); } }
    .album-stage.opening .album-sleeve { animation: packShake 0.4s ease-in-out; }
    .album-stage.opening .album-vinyl { opacity: 1; transform: translateX(85px) rotate(420deg); }
    .flash-overlay { position: fixed; inset: 0; background: #fff; z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.15s ease-out; }
    .flash-overlay.active { opacity: 1; }

    /* Квесты и Бейджи */
    .quest-sec { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin: 14px 0 8px; display: flex; justify-content: space-between; }
    .contract-row { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 11px 13px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .contract-row.done { border-color: rgba(0,230,118,0.45); background: rgba(0,230,118,0.08); }
    .c-title { font-size: 13px; font-weight: 700; }
    .c-sub { font-size: 10px; color: var(--muted); margin-top: 2px; }
    .c-prog { font-size: 12px; color: var(--cyan); font-weight: 800; }
    .daily-prize { background: linear-gradient(135deg, rgba(255,184,0,0.14), rgba(255,46,147,0.14)); border: 1px solid rgba(255,215,0,0.4); border-radius: 16px; padding: 12px 14px; margin-bottom: 12px; }

    .badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
    .m-badge { background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 8px 4px; text-align: center; opacity: 0.35; filter: grayscale(1); }
    .m-badge.missed { opacity: 0.48; filter: grayscale(1); border-color: rgba(255,255,255,0.08); }
    .m-badge.cur { opacity: 0.95; filter: none; border-style: dashed; border-color: var(--cyan); }
    .m-badge.got { opacity: 1; filter: none; border-width: 1.5px; background: linear-gradient(155deg, #271b42, #150f26); box-shadow: 0 0 12px rgba(255,46,147,0.22); }
    .m-badge-ico { width: 38px; height: 38px; border-radius: 50%; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-size: 18px; background: rgba(255,255,255,0.08); }
    .m-badge-name { font-size: 10px; font-weight: 800; }

    .rank-prize { font-size: 10px; font-weight: 800; padding: 3px 7px; border-radius: 8px; background: rgba(255,255,255,0.08); margin-right: 8px; }

    .fusion-stage { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .f-orb { position: absolute; width: 64px; height: 90px; border-radius: 12px; border: 2px solid #fff; background: linear-gradient(145deg, var(--accent), var(--purple)); box-shadow: 0 0 18px rgba(255,46,147,0.6); }
    .f-orb.o1 { animation: fMerge1 0.85s ease-in forwards; }
    .f-orb.o2 { animation: fMerge2 0.85s ease-in forwards; }
    .f-orb.o3 { animation: fMerge3 0.85s ease-in forwards; }
    @keyframes fMerge1 { 0% { transform: translate(-80px, -45px) rotate(-18deg); opacity: 1; } 100% { transform: translate(0, 0) scale(0.2) rotate(180deg); opacity: 0; } }
    @keyframes fMerge2 { 0% { transform: translate(80px, -45px) rotate(18deg); opacity: 1; } 100% { transform: translate(0, 0) scale(0.2) rotate(-180deg); opacity: 0; } }
    @keyframes fMerge3 { 0% { transform: translate(0, 75px) rotate(0deg); opacity: 1; } 100% { transform: translate(0, 0) scale(0.2) rotate(360deg); opacity: 0; } }
  `;
  document.head.appendChild(css);

  // Вспышка, Профиль-оверлей и Онбординг-оверлей
  const flashEl = document.createElement('div');
  flashEl.className = 'flash-overlay';
  document.body.appendChild(flashEl);
  function triggerFlash(cb) {
    flashEl.classList.add('active');
    setTimeout(() => { if (cb) cb(); flashEl.classList.remove('active'); }, 160);
  }

  const profileOverlay = document.createElement('div');
  profileOverlay.className = 'full-overlay';
  profileOverlay.id = 'profile-overlay';
  document.body.appendChild(profileOverlay);

  const onbOverlay = document.createElement('div');
  onbOverlay.className = 'onb-overlay';
  onbOverlay.id = 'onb-overlay';
  document.body.appendChild(onbOverlay);

  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function weekKey() {
    const d = new Date(), s = new Date(d.getFullYear(), 0, 1);
    return `${d.getFullYear()}-W${Math.ceil((((d - s) / 86400000) + s.getDay() + 1) / 7)}`;
  }
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
  }

  function checkDailyMonthlyPts() {
    const d = st.daily;
    if (d.lessons >= 1 && !d.p1) { d.p1 = true; st.monthly.pts++; }
    if (d.dict >= 2 && !d.p2) { d.p2 = true; st.monthly.pts++; }
    if (d.cards >= 3 && !d.p3) { d.p3 = true; st.monthly.pts++; }
  }

  /* ====== ДОСТИЖЕНИЯ И ТРОФЕИ ====== */
  function getAchievements() {
    const ownedCnt = typeof CARDS !== 'undefined' ? CARDS.filter(c => getBestTier(c.id)).length : 0;
    const teamCnt = st.team ? Object.values(st.team).filter(Boolean).length : 0;
    return [
      { id: "first_step", icon: "🎵", name: "Первый шаг", desc: "Пройди свой первый урок", cur: st.done.length, goal: 1, rewText: "+20 🎤", claim: () => { st.coins += 20; } },
      { id: "hangul_master", icon: "★", name: "Код Хангыля", desc: "Сдай Большой Экзамен 1", cur: st.done.includes(9) ? 1 : 0, goal: 1, rewText: "Пассив: +5% XP", passive: true },
      { id: "lesson_5", icon: "📚", name: "Усердный трейни", desc: "Пройди 5 разных уроков", cur: st.done.length, goal: 5, rewText: "Серебряный бокс", claim: () => { st.cases.silver++; } },
      { id: "full_squad", icon: "🎤", name: "Дебютный состав", desc: "Заполни все 4 роли в Студии", cur: teamCnt, goal: 4, rewText: "Серебряный бокс", claim: () => { st.cases.silver++; } },
      { id: "collector_5", icon: "💿", name: "Коллекционер", desc: "Собери 5 уникальных артистов", cur: ownedCnt, goal: 5, rewText: "+50 🎤", claim: () => { st.coins += 50; } },
      { id: "first_fusion", icon: "✨", name: "Алхимия сцены", desc: "Выполни слияние карт 3 → 1", cur: st.fusionsCount || 0, goal: 1, rewText: "+40 🎤", claim: () => { st.coins += 40; } },
      { id: "streak_7", icon: "⚡", name: "Неоновый лайтстик", desc: "Держи серию 7 дней подряд", cur: st.streak ? st.streak.count : 1, goal: 7, rewText: "Пассив: -5м ⚡", passive: true },
      { id: "gold_mic", icon: "🎙️", name: "Золотой микрофон", desc: "Выбей редкий трофей из бокса", cur: st.trophies.includes('gold_mic') ? 1 : 0, goal: 1, rewText: "Пассив: +5% 🎤", passive: true },
      { id: "xp_1000", icon: "🏆", name: "Звезда чартов", desc: "Набери 1000 XP в агентстве", cur: st.xp, goal: 1000, rewText: "Золотой бокс", claim: () => { st.cases.gold++; } },
      { id: "collector_12", icon: "👑", name: "Полный каталог", desc: "Собери 12 уникальных артистов", cur: ownedCnt, goal: 12, rewText: "Золотой бокс", claim: () => { st.cases.gold++; } }
    ];
  }

  function hasUnclaimedAch() {
    if (!st.achClaimed) return false;
    return getAchievements().some(a => !a.passive && a.cur >= a.goal && !st.achClaimed.includes(a.id));
  }

  function hasUnclaimedQuests() {
    if (!st.daily || !st.weekly || !st.monthly) return false;
    const dReady = st.daily.lessons >= 1 && st.daily.dict >= 2 && st.daily.cards >= 3 && !st.daily.claimed;
    const wReady = st.weekly.days.length >= 5 && !st.weekly.claimed;
    const mReady = st.monthly.pts >= MONTHLY_GOAL && !st.monthly.claimed;
    return dReady || wReady || mReady;
  }

  /* ====== ОКНО ПРИВЕТСТВИЯ (КОНТРАКТ ПРОДЮСЕРА) ====== */
  window.openOnboarding = function () {
    let selIdx = st.avatarIdx || 0;
    onbOverlay.innerHTML = `
      <div class="onb-card">
        <div style="font-size:11px;font-weight:900;letter-spacing:1.5px;color:var(--cyan);margin-bottom:6px">K-POP LINGUA • ДЕБЮТ</div>
        <h2 style="margin:0 0 6px;font-size:21px">Контракт продюсера</h2>
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Придумай название своего агентства и выбери значок студии</div>
        <div style="display:inline-block;font-size:11px;font-weight:800;color:var(--gold);background:rgba(255,215,0,0.12);padding:4px 10px;border-radius:8px;margin-bottom:4px">Твой ID: ${st.producerId}</div>
        <input id="onb-name" class="onb-input" maxlength="22" placeholder="Название студии..." value="${st.agencyName}">
        <div class="av-pick-row" id="onb-av-row">
          ${AVATAR_PRESETS.map((av, i) => `<div class="av-pick ${i === selIdx ? 'sel' : ''}" data-av="${i}" style="background:${av.bg}">${av.icon}</div>`).join('')}
        </div>
        <button class="btn full" id="onb-start">Дебютировать ✨</button>
      </div>`;

    onbOverlay.querySelectorAll('[data-av]').forEach(el => {
      el.onclick = () => {
        selIdx = Number(el.getAttribute('data-av'));
        onbOverlay.querySelectorAll('[data-av]').forEach(x => x.classList.remove('sel'));
        el.classList.add('sel');
        haptic('light');
      };
    });

    document.getElementById('onb-start').onclick = () => {
      const val = document.getElementById('onb-name').value.trim();
      if (val) st.agencyName = val.slice(0, 22);
      st.avatarIdx = selIdx;
      st.onboarded = true;
      save(); haptic('ok'); sfx('win'); fireConfetti();
      onbOverlay.classList.remove('open');
      renderBinder();
    };
    onbOverlay.classList.add('open');
  };

  /* ====== ОКНО ПРОФИЛЯ И ЛЕСТНИЦЫ 12 РАНГОВ ====== */
  window.openProfileModal = function () {
    haptic('light');
    const lg = getLeague(st.xp);
    const av = AVATAR_PRESETS[st.avatarIdx || 0];

    profileOverlay.innerHTML = `
      <div class="ov-header">
        <div>
          <div style="font-size:16px;font-weight:900">Профиль и Лиги</div>
          <div style="font-size:11px;color:var(--muted)">ID: ${st.producerId} • ${st.xp} XP</div>
        </div>
        <button class="close-btn" style="width:32px;height:32px;font-size:15px" onclick="document.getElementById('profile-overlay').classList.remove('open')">✕</button>
      </div>
      <div class="ov-scroll">
        <div class="card-box" style="margin-bottom:14px;text-align:center">
          <div class="av-circle" style="background:${av.bg};border-color:${lg.color};margin:0 auto 10px;width:62px;height:62px;font-size:30px">${av.icon}</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Название твоей студии</div>
          <div style="display:flex;gap:8px;margin-bottom:10px">
            <input id="prof-name-in" class="onb-input" style="margin:0;padding:9px 12px;font-size:14px;text-align:left" maxlength="22" value="${st.agencyName}">
            <button class="btn cyan" id="prof-name-save" style="padding:0 14px">Ок</button>
          </div>
          <div class="av-pick-row" style="margin:8px 0 4px">
            ${AVATAR_PRESETS.map((p, i) => `<div class="av-pick ${i === (st.avatarIdx || 0) ? 'sel' : ''}" data-pav="${i}" style="background:${p.bg};width:38px;height:38px;font-size:18px">${p.icon}</div>`).join('')}
          </div>
        </div>

        <div class="quest-sec" style="margin-top:4px"><span>Лестница рангов (12 ступеней)</span><span style="color:${lg.color}">${lg.name}</span></div>
        ${LEAGUES.map(l => {
          const isCur = l.id === lg.id;
          const reached = st.xp >= l.minXp;
          return `
            <div class="rank-step ${isCur ? 'current' : (reached ? 'reached' : '')}" style="${isCur ? `border-color:${l.color}` : ''}">
              <div class="rs-ico" style="color:${l.color}">${l.icon}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:800;color:${reached ? '#fff' : 'var(--muted)'}">${l.name} ${isCur ? '<span style="font-size:10px;color:var(--cyan)">• Сейчас</span>' : ''}</div>
                <div style="font-size:11px;color:var(--muted)">От ${l.minXp} XP</div>
              </div>
              <div style="font-size:12px;font-weight:800;color:${reached ? 'var(--success)' : 'var(--muted)'}">${reached ? '✓' : '🔒'}</div>
            </div>`;
        }).join('')}

        <div class="quest-sec" style="margin-top:18px"><span>Тестовые инструменты</span></div>
        <div style="display:flex;gap:8px">
          <button class="btn cyan" style="flex:1;font-size:12px" id="prof-test-coins">+500 🎤</button>
          <button class="btn ghost" style="flex:1;font-size:12px" id="prof-test-onb">Приветствие</button>
        </div>
      </div>`;

    document.getElementById('prof-name-save').onclick = () => {
      const n = document.getElementById('prof-name-in').value.trim();
      if (n) { st.agencyName = n.slice(0, 22); save(); haptic('ok'); alert('Название обновлено!'); renderBinder(); }
    };
    profileOverlay.querySelectorAll('[data-pav]').forEach(el => {
      el.onclick = () => {
        st.avatarIdx = Number(el.getAttribute('data-pav'));
        save(); haptic('light'); renderBinder(); openProfileModal();
      };
    });
    document.getElementById('prof-test-coins').onclick = () => {
      st.coins += 500; save(); haptic('ok'); sfx('tap'); alert('+500 микрофонов начислено!'); renderBinder();
    };
    document.getElementById('prof-test-onb').onclick = () => {
      profileOverlay.classList.remove('open');
      openOnboarding();
    };

    profileOverlay.classList.add('open');
  };

  // Настройка нижней навигации
  const navBinder = document.getElementById('nav-binder');
  if (navBinder) {
    if (navBinder.lastChild) navBinder.lastChild.textContent = 'Студия';
    const d1 = document.createElement('div'); d1.id = 'studio-nav-dot'; d1.className = 'nav-dot';
    navBinder.appendChild(d1);
  }
  const navShop = document.getElementById('nav-shop');
  if (navShop) {
    const d2 = document.createElement('div'); d2.id = 'shop-nav-dot'; d2.className = 'nav-dot';
    navShop.appendChild(d2);
  }

  function updateNavDots() {
    const sDot = document.getElementById('studio-nav-dot');
    const shDot = document.getElementById('shop-nav-dot');
    if (sDot) sDot.classList.toggle('show', hasUnclaimedQuests() || hasUnclaimedAch());
    if (shDot && st.cases) shDot.classList.toggle('show', (st.cases.silver + st.cases.gold + st.cases.platinum) > 0);
  }

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.producerId) st.producerId = "KP-" + Math.floor(10000 + Math.random() * 90000);
    if (typeof st.avatarIdx !== 'number') st.avatarIdx = 0;
    if (!st.team) st.team = { vocal: null, dance: null, rap: null, visual: null };
    if (!st.inv) st.inv = {};
    if (!st.cases) st.cases = { silver: 0, gold: 0, platinum: 0 };
    if (!st.trophies) st.trophies = [];
    if (!st.monthlyBadges) st.monthlyBadges = [];
    if (!st.achClaimed) st.achClaimed = [];
    if (!st.fusionsCount) st.fusionsCount = 0;
    if (st.packTickets > 0) { st.cases.silver += st.packTickets; st.packTickets = 0; }

    st.cards.forEach(id => {
      if (!st.inv[id]) {
        const c = CARDS.find(x => x.id === id);
        const defTier = c && c.r === 'SSR' ? 'platinum' : (c && c.r === 'SR' ? 'gold' : 'silver');
        st.inv[id] = { silver: 0, gold: 0, platinum: 0, neon: 0 };
        st.inv[id][defTier] = (st.cardStars && st.cardStars[id]) ? st.cardStars[id] : 1;
      }
    });

    const today = todayKey(), wk = weekKey(), mk = monthKey();
    if (!st.streak) st.streak = { count: 1, lastDate: today };
    else if (st.streak.lastDate !== today) {
      const yest = new Date(Date.now() - 86400000);
      const yKey = `${yest.getFullYear()}-${yest.getMonth() + 1}-${yest.getDate()}`;
      st.streak.count = (st.streak.lastDate === yKey) ? st.streak.count + 1 : 1;
      st.streak.lastDate = today;
    }

    if (!st.daily || st.daily.date !== today) {
      st.daily = { date: today, lessons: 0, dict: 0, cards: 0, p1: false, p2: false, p3: false, claimed: false };
    }
    if (!st.weekly || st.weekly.week !== wk) st.weekly = { week: wk, days: [today], claimed: false };
    else if (!st.weekly.days.includes(today)) st.weekly.days.push(today);
    if (!st.monthly || st.monthly.key !== mk) st.monthly = { key: mk, pts: 0, claimed: false };

    if (st.done.includes(9) && !st.trophies.includes('hangul_master')) st.trophies.push('hangul_master');
    if (st.streak.count >= 7 && !st.trophies.includes('streak_7')) st.trophies.push('streak_7');
    st.biasId = null;
    updateNavDots();
    save(false);
  }

  window.getTeamBonuses = function () {
    let xp = 0, coins = 0, energyMin = 0, luck = 0, power = 0, count = 0;
    const albums = [];
    ROLES.forEach(r => {
      const cid = st.team[r.key], tier = cid ? getBestTier(cid) : null;
      if (!tier) return;
      const c = CARDS.find(x => x.id === cid); if (!c) return;
      count++;
      const tm = TIER_META[tier], val = Math.round(c.bonusVal * tm.mult);
      if (c.bonusType === 'xp') xp += val;
      if (c.bonusType === 'coins') coins += val;
      if (c.bonusType === 'energy') energyMin += val;
      if (c.bonusType === 'luck') luck += val;
      power += tm.power; albums.push(c.album);
    });
    const synergy = albums.length === 4 && albums.every(a => a === albums[0]);
    if (synergy) { xp += 15; coins += 15; power = Math.round(power * 1.15); }
    if (st.trophies.includes('hangul_master')) xp += 5;
    if (st.trophies.includes('gold_mic')) coins += 5;
    if (st.trophies.includes('streak_7')) energyMin += 5;
    return { xp, coins, energyMin, luck, power, count, synergy };
  };

  window.getEnergyRegenMs = function () {
    return Math.max(30 * 60 * 1000, BASE_ENERGY_MS - (getTeamBonuses().energyMin || 0) * 60 * 1000);
  };

  window.setStudioSubTab = function (t) { haptic('light'); studioSubTab = t; renderBinder(); };
  window.setShopSubTab = function (t) { haptic('light'); shopSubTab = t; renderShop(); };

  /* ====== 1. ЭКРАН СТУДИИ (КЛИКАБЕЛЬНАЯ ШАПКА + 3 ЧИСТЫЕ ВКЛАДКИ) ====== */
  window.renderBinder = function () {
    if (typeof CARDS === 'undefined') return;
    initStudioState();
    const screen = document.getElementById('screen-binder');
    const b = getTeamBonuses();
    const lg = getLeague(st.xp);
    const nextLg = LEAGUES.find(x => x.minXp > st.xp);
    const ownedCards = CARDS.filter(c => getBestTier(c.id));
    const av = AVATAR_PRESETS[st.avatarIdx || 0];
    const pctNext = nextLg ? Math.min(100, Math.round(((st.xp - lg.minXp) / Math.max(1, nextLg.minXp - lg.minXp)) * 100)) : 100;

    screen.innerHTML = `
      <div class="agency-card ${lg.cls}" onclick="openProfileModal()">
        <div class="agency-head">
          <div class="av-circle" style="background:${av.bg};border-color:${lg.color}">${av.icon}</div>
          <div style="flex:1;min-width:0">
            <div class="agency-name">${st.agencyName}</div>
            <div class="agency-id">${st.producerId} • Серия ${st.streak.count} дн.</div>
            <div class="league-pill" style="color:${lg.color}">${lg.icon} ${lg.name} • ${st.xp} XP</div>
          </div>
          <div style="font-size:20px;color:rgba(255,255,255,0.45);font-weight:900">›</div>
        </div>
        ${nextLg
          ? `<div style="font-size:10px;color:var(--muted);margin-bottom:4px">До «${nextLg.name}»: ${nextLg.minXp - st.xp} XP</div><div class="bar-bg"><div class="bar-fill" style="width:${pctNext}%"></div></div>`
          : `<div style="font-size:11px;color:var(--gold);font-weight:800">Максимальный ранг достигнут!</div>`}
        <div class="agency-buffs">
          <span>Фандом: <b style="color:var(--accent)">${b.power}</b></span>
          <span style="color:var(--cyan);font-weight:800">+${b.xp}% XP</span>
          <span style="color:#ff85cb;font-weight:800">+${b.coins}% 🎤</span>
        </div>
      </div>

      <div class="mode-switch">
        <button class="mode-btn ${studioSubTab === 'group' ? 'active' : ''}" onclick="setStudioSubTab('group')">Группа</button>
        <button class="mode-btn ${studioSubTab === 'quests' ? 'active' : ''}" onclick="setStudioSubTab('quests')">Квесты${hasUnclaimedQuests() ? '<span class="tab-dot"></span>' : ''}</button>
        <button class="mode-btn ${studioSubTab === 'hall' ? 'active' : ''}" onclick="setStudioSubTab('hall')">Зал славы${hasUnclaimedAch() ? '<span class="tab-dot"></span>' : ''}</button>
      </div>
      <div id="studio-sub-body"></div>
    `;

    const sub = document.getElementById('studio-sub-body');

    // ВКЛАДКА 1: ГРУППА (4 СЛОТА + СИНЕРГИЯ + МОИ КАРТЫ)
    if (studioSubTab === 'group') {
      sub.innerHTML = `
        <div class="team-grid" id="team-grid"></div>
        <div class="synergy-bar ${b.synergy ? 'on' : ''}">
          <span>${b.synergy ? 'Синергия эры активна (+15% к наградам)' : '4 карты одной Эры дадут бонус Синергии'}</span>
          <b>${b.count}/4</b>
        </div>
        <div class="quest-sec" style="margin-top:6px"><span>Мои артисты</span><span>${ownedCards.length} шт.</span></div>
        <div id="owned-cards-wrap"></div>
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
          el.innerHTML = `<div class="slot-role">${r.title}</div><div class="slot-tag">${c.tag}</div><div class="slot-tier" style="color:${tm.color}">${tm.name}</div>`;
        } else {
          el.innerHTML = `<div class="slot-role">${r.title}</div><div style="font-size:20px;opacity:0.35;margin-top:4px">+</div>`;
        }
        el.onclick = () => openSlotPicker(r);
        tgGrid.appendChild(el);
      });

      const wrap = document.getElementById('owned-cards-wrap');
      if (!ownedCards.length) {
        wrap.innerHTML = `<div class="card-box" style="text-align:center;padding:22px 16px"><h3 style="margin:0 0 8px">Инвентарь пуст</h3><p style="color:var(--muted)">Открывай виниловые боксы в Магазине — все твои артисты появятся здесь.</p><button class="btn" style="margin-top:8px" onclick="shopSubTab='boxes';switchTab('shop')">В Магазин боксов</button></div>`;
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'cards-mini-grid';
      ownedCards.forEach(c => {
        const best = getBestTier(c.id), craft = getCraftableTier(c.id);
        const inTeam = st.team[c.roleKey] === c.id;
        const cnt = Object.values(st.inv[c.id]).reduce((a, b) => a + b, 0);
        const el = document.createElement('div');
        el.className = `mini-card tier-${best}`;
        el.innerHTML = `
          ${inTeam ? '<div class="mc-dot"></div>' : ''}
          ${craft ? '<div class="mc-craft">3→1</div>' : ''}
          ${cardArtHtml(c)}
          <div class="mc-name">${c.name.split('•')[0].trim()}</div>
          <div class="mc-sub" style="color:${TIER_META[best].color}">${TIER_META[best].name} ×${cnt}</div>`;
        el.onclick = () => openArtistModal(c.id);
        grid.appendChild(el);
      });
      wrap.appendChild(grid);
    }

    // ВКЛАДКА 2: КВЕСТЫ (МЕСЯЦ 50 БАЛЛОВ + ДЕНЬ + НЕДЕЛЯ)
    if (studioSubTab === 'quests') {
      const d = st.daily, w = st.weekly, m = st.monthly;
      const dCnt = (d.lessons >= 1 ? 1 : 0) + (d.dict >= 2 ? 1 : 0) + (d.cards >= 3 ? 1 : 0);
      const curMonthIdx = new Date().getMonth();
      const curYear = new Date().getFullYear();

      sub.innerHTML = `
        <div class="quest-sec" style="margin-top:4px"><span>Ежемесячный квест • ${MONTHS[curMonthIdx].name} ${curYear}</span><span style="color:var(--accent)">${Math.min(m.pts, MONTHLY_GOAL)}/${MONTHLY_GOAL}</span></div>
        <div class="card-box" style="padding:13px 14px;margin-bottom:12px;border-color:rgba(255,46,147,0.35)">
          <div style="font-size:13px;font-weight:800;margin-bottom:3px">Набери ${MONTHLY_GOAL} баллов за месяц</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Каждое дневное задание = +1 балл (до 3 в день) • Награда: Бейдж + Золотой бокс</div>
          ${m.pts >= MONTHLY_GOAL && !m.claimed
            ? `<button class="btn full" id="claim-monthly">Получить бейдж «${MONTHS[curMonthIdx].name} ${curYear}»!</button>`
            : (m.claimed
                ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Бейдж этого месяца в Зале славы!</div>`
                : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, Math.round((m.pts / MONTHLY_GOAL) * 100))}%"></div></div>`)
          }
        </div>

        <div class="quest-sec"><span>Ежедневные задания</span><span style="color:var(--cyan)">${dCnt}/3</span></div>
        <div class="contract-row ${d.lessons >= 1 ? 'done' : ''}">
          <div><div class="c-title">Пройти 1 урок или повтор</div><div class="c-sub">+1 балл в квест месяца</div></div>
          <div class="c-prog">${Math.min(d.lessons, 1)}/1</div>
        </div>
        <div class="contract-row ${d.dict >= 2 ? 'done' : ''}">
          <div><div class="c-title">Написать 2 слова в Диктанте</div><div class="c-sub">+1 балл в квест месяца</div></div>
          <div class="c-prog">${Math.min(d.dict, 2)}/2</div>
        </div>
        <div class="contract-row ${d.cards >= 3 ? 'done' : ''}">
          <div><div class="c-title">Перевернуть 3 карточки</div><div class="c-sub">+1 балл в квест месяца</div></div>
          <div class="c-prog">${Math.min(d.cards, 3)}/3</div>
        </div>
        <div class="daily-prize">
          <div style="font-size:12px;font-weight:800;margin-bottom:6px">Бонус дня (за все 3): Серебряный бокс + 25 🎤</div>
          ${dCnt === 3 && !d.claimed ? `<button class="btn gold full" id="claim-daily">Забрать бонус дня!</button>` : (d.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Получено сегодня</div>` : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((dCnt / 3) * 100)}%"></div></div>`)}
        </div>

        <div class="quest-sec"><span>Еженедельный челлендж</span><span style="color:var(--gold)">${w.days.length}/5 дн.</span></div>
        <div class="card-box" style="padding:12px 14px;margin-bottom:12px">
          <div style="font-size:13px;font-weight:800;margin-bottom:4px">Заходи 5 дней за неделю</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Награда: Золотой бокс + 50 🎤</div>
          ${w.days.length >= 5 && !w.claimed ? `<button class="btn gold full" id="claim-weekly">Забрать Золотой бокс!</button>` : (w.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Награда недели получена!</div>` : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, Math.round((w.days.length / 5) * 100))}%"></div></div>`)}
        </div>`;

      const cd = document.getElementById('claim-daily');
      if (cd) cd.onclick = () => { st.daily.claimed = true; st.cases.silver++; st.coins += 25; save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder(); };
      const cw = document.getElementById('claim-weekly');
      if (cw) cw.onclick = () => { st.weekly.claimed = true; st.cases.gold++; st.coins += 50; save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder(); };
      const cm = document.getElementById('claim-monthly');
      if (cm) cm.onclick = () => { st.monthly.claimed = true; if (!st.monthlyBadges.includes(m.key)) st.monthlyBadges.push(m.key); st.cases.gold++; save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder(); };
    }

    // ВКЛАДКА 3: ЗАЛ СЛАВЫ (БЕЙДЖИ ГОДА + ДОСТИЖЕНИЯ И ТРОФЕИ)
    if (studioSubTab === 'hall') {
      const curMonthIdx = new Date().getMonth();
      const curYear = new Date().getFullYear();
      const achList = getAchievements();
      const achDone = achList.filter(a => a.cur >= a.goal).length;

      sub.innerHTML = `
        <div class="quest-sec" style="margin-top:4px"><span>Бейджи ${curYear}</span><span>${st.monthlyBadges.length}/12</span></div>
        <div class="badges-grid">
          ${MONTHS.map(mo => {
            const key = `${curYear}-${mo.m}`;
            const got = st.monthlyBadges.includes(key);
            const isCur = mo.m === curMonthIdx;
            const isPast = mo.m < curMonthIdx;
            const cls = got ? 'got' : (isCur ? 'cur' : (isPast ? 'missed' : ''));
            const ico = (got || isCur || isPast) ? mo.icon : '🔒';
            return `<div class="m-badge ${cls}" style="${got ? `border-color:${mo.col}` : ''}">
              <div class="m-badge-ico" style="${got ? `background:${mo.col}28` : ''}">${ico}</div>
              <div class="m-badge-name">${mo.name}</div>
            </div>`;
          }).join('')}
        </div>

        <div class="quest-sec"><span>Достижения и трофеи</span><span style="color:var(--gold)">${achDone}/${achList.length}</span></div>
        ${achList.map(a => {
          const done = a.cur >= a.goal;
          const claimed = a.passive ? done : (st.achClaimed && st.achClaimed.includes(a.id));
          const pct = Math.min(100, Math.round((Math.min(a.cur, a.goal) / a.goal) * 100));
          return `
            <div class="ach-card ${done ? 'done' : ''}">
              <div class="ach-ico">${a.icon}</div>
              <div class="ach-body">
                <div class="ach-title">
                  <span>${a.name}</span>
                  <span style="font-size:11px;color:${done ? 'var(--gold)' : 'var(--muted)'}">${Math.min(a.cur, a.goal)}/${a.goal}</span>
                </div>
                <div class="ach-desc">${a.desc}</div>
                <div class="bar-bg" style="margin-bottom:6px"><div class="bar-fill" style="width:${pct}%"></div></div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span class="ach-rew">${a.rewText}</span>
                  ${done && !claimed
                    ? `<button class="btn gold" style="padding:4px 10px;font-size:11px" data-claim-ach="${a.id}">Забрать</button>`
                    : (claimed ? `<span style="font-size:11px;color:var(--success);font-weight:800">✓ Получено</span>` : '')}
                </div>
              </div>
            </div>`;
        }).join('')}`;

      sub.querySelectorAll('[data-claim-ach]').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-claim-ach');
          const item = getAchievements().find(x => x.id === id);
          if (item && item.claim && !st.achClaimed.includes(id)) {
            item.claim();
            st.achClaimed.push(id);
            save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti();
            renderBinder();
          }
        };
      });
    }
  };

  /* ====== 2. МАГАЗИН (БОКСЫ | ДОНАТ И VIP) ====== */
  window.renderShop = function () {
    syncResources(); initStudioState();
    const screen = document.getElementById('screen-shop');
    const cs = st.cases;
    const eSub = st.energy >= MAX_ENERGY ? 'Полный заряд' : `+1 через ${fmtWait(getEnergyRegenMs() - (Date.now() - st.lastEnergyTs))}`;
    const hSub = st.hearts >= MAX_HEARTS ? 'Все попытки есть' : `+1 через ${fmtWait(HEART_REGEN_MS - (Date.now() - st.lastHeartTs))}`;

    screen.innerHTML = `
      <h3 style="margin:0 0 12px">Магазин агентства</h3>
      <div class="mode-switch">
        <button class="mode-btn ${shopSubTab === 'boxes' ? 'active' : ''}" onclick="setShopSubTab('boxes')">Виниловые боксы${(cs.silver + cs.gold + cs.platinum) > 0 ? ` (${cs.silver + cs.gold + cs.platinum})` : ''}</button>
        <button class="mode-btn ${shopSubTab === 'vip' ? 'active' : ''}" onclick="setShopSubTab('vip')">Донат и VIP</button>
      </div>
      <div id="shop-sub-body"></div>`;

    const sub = document.getElementById('shop-sub-body');
    if (shopSubTab === 'boxes') {
      sub.innerHTML = `
        <div class="box-list">
          <div class="box-row silver">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#454c61,#1d202b);color:#cfd8dc;border:1px solid #cfd8dc">AG</span></div>
            <div style="flex:1"><div class="l-title" style="color:#cfd8dc">Серебряный бокс</div><div class="l-meta">Серебро или Золото • За задания</div></div>
            <button class="btn ${cs.silver > 0 ? '' : 'ghost'}" onclick="openCaseModal('silver')">${cs.silver > 0 ? `Открыть (${cs.silver})` : '50 🎤'}</button>
          </div>
          <div class="box-row gold">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#7a5816,#291e0a);color:#ffd700;border:1px solid #ffd700">AU</span></div>
            <div style="flex:1"><div class="l-title" style="color:#ffd700">Золотой бокс</div><div class="l-meta">Золото или Платина • За 4-й урок</div></div>
            <button class="btn ${cs.gold > 0 ? 'gold' : 'ghost'}" onclick="openCaseModal('gold')">${cs.gold > 0 ? `Открыть (${cs.gold})` : '120 🎤'}</button>
          </div>
          <div class="box-row platinum">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#13526e,#23113d);color:#00e5ff;border:1px solid #00e5ff">PT</span></div>
            <div style="flex:1"><div class="l-title" style="color:#00e5ff">Платиновый бокс</div><div class="l-meta">100% Платина • За Экзамен / Топ-1</div></div>
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
        <div class="shop-item"><div><div class="l-title">Батарейка лайтстика (+1)</div><div class="l-meta">Добавит 1 заряд энергии</div></div><button class="btn cyan" onclick="buyEnergy(1, 30)">30</button></div>
        <div class="shop-item"><div><div class="l-title">Полный заряд (5/5)</div><div class="l-meta">Заполнит всю шкалу</div></div><button class="btn cyan" onclick="buyEnergy(5, 100)">100</button></div>
        <div class="shop-item"><div><div class="l-title">Попытка экзамена (+1)</div><div class="l-meta">Восстановит 1 сердечко</div></div><button class="btn" onclick="buyHeart(1, 40)">40</button></div>
        <div class="shop-sec">Премиум и наборы (Telegram Stars)</div>
        <div class="shop-item vip"><div><div class="l-title">VIP Trainee Pass (30 дней)</div><div class="l-meta">Безлимит энергии и попыток, ×2 награды</div></div><button class="btn gold" onclick="alert('Подключим Telegram Stars с сервером!')">150 ★</button></div>
        <div class="shop-item"><div><div class="l-title">Энергопак (Безлимит 24ч)</div><div class="l-meta">Учи уроки без ограничений весь день</div></div><button class="btn gold" onclick="alert('Болванка под Telegram Stars')">35 ★</button></div>
        <div class="shop-item"><div><div class="l-title">Платиновый набор (3 бокса)</div><div class="l-meta">Гарантированные Платиновые артисты</div></div><button class="btn" onclick="alert('Болванка под Telegram Stars')">75 ★</button></div>`;
    }
  };

  /* ====== 3. РЕЙТИНГ ====== */
  window.renderRank = function () {
    initStudioState();
    const lg = getLeague(st.xp);
    const lc = document.querySelector('#screen-rank .league-card');
    if (lc) {
      lc.innerHTML = `
        <div class="module-tag" style="color:${lg.color}">${lg.icon} ${lg.name}</div>
        <h3 style="margin:6px 0 6px">Топ-3 получают Виниловые боксы!</h3>
        <div style="font-size:12px;color:#c9bedf">1 место: Платина • 2 место: Золото • 3 место: Серебро</div>`;
    }
    const prizes = ['Платина', 'Золото', 'Серебро'];
    const pCols = ['#00e5ff', '#ffd700', '#cfd8dc'];
    const bots = [
      { name: "Minji_Seoul", xp: 620 },
      { name: "Kpop_Sora", xp: 480 },
      { name: "V_Army95", xp: 340 },
      { name: st.agencyName + " (Ты)", xp: st.xp, me: true }
    ].sort((a, b) => b.xp - a.xp);

    document.getElementById('rank-list').innerHTML = bots.map((p, i) => `
      <div class="rank-row ${p.me ? 'me' : ''}">
        <div style="width:28px;font-weight:800;color:${i < 3 ? pCols[i] : 'var(--muted)'}">#${i + 1}</div>
        <div style="flex:1;font-weight:700">${p.name}</div>
        ${i < 3 ? `<div class="rank-prize" style="color:${pCols[i]}">${prizes[i]}</div>` : ''}
        <div style="font-weight:800;color:var(--cyan)">${p.xp} XP</div>
      </div>`).join('');
  };

  function openSlotPicker(role) {
    const owned = CARDS.filter(c => getBestTier(c.id) && c.roleKey === role.key);
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    if (!owned.length) {
      modal.innerHTML = `<div class="card-box" style="max-width:300px;text-align:center"><h3>Роль: ${role.title}</h3><p style="color:var(--muted)">У тебя пока нет артистов этой роли. Открой бокс в Магазине!</p><button class="btn full" onclick="document.getElementById('pack-modal').classList.remove('open')">Понятно</button></div>`;
      return;
    }
    let html = `<div class="card-box" style="width:100%;max-width:320px"><h3 style="margin-bottom:12px">Выбери: ${role.title}</h3>`;
    owned.forEach(c => {
      const tier = getBestTier(c.id), tm = TIER_META[tier];
      html += `<div class="vocab-row" data-pick="${c.id}"><div class="vocab-tag" style="border-color:${tm.color};color:${tm.color}">${c.tag}</div><div style="flex:1"><div style="font-weight:800;font-size:14px">${c.name}</div><div style="font-size:11px;color:${tm.color}">${tm.name} • Фандом ${tm.power}</div></div></div>`;
    });
    html += `<button class="btn ghost full" style="margin-top:8px" onclick="document.getElementById('pack-modal').classList.remove('open')">Закрыть</button></div>`;
    modal.innerHTML = html;
    modal.querySelectorAll('[data-pick]').forEach(row => {
      row.onclick = () => {
        st.team[role.key] = Number(row.getAttribute('data-pick'));
        save(); updateNavDots(); haptic('ok'); sfx('ok'); modal.classList.remove('open'); renderBinder();
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

    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box zoom-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:12px;font-weight:900;color:${tm.color}">${tm.name.toUpperCase()} • ${c.role}</span>
          <button class="close-btn" style="width:30px;height:30px;font-size:14px" onclick="document.getElementById('pack-modal').classList.remove('open')">✕</button>
        </div>
        <div class="photocard tier-${best}" style="margin-bottom:10px;cursor:default">
          ${cardArtHtml(c)}
          <div class="pc-name" style="font-size:16px">${c.name}</div>
          <div class="pc-bonus" style="font-size:12px">Бонус: +${Math.round(c.bonusVal * tm.mult)} ${c.bonusType === 'energy' ? 'мин ⚡' : '%'} • Фандом ${tm.power}</div>
        </div>
        <div class="tier-pills">
          ${TIERS.map(t => `<div class="t-pill" style="border-color:${inv[t] >= 3 && t !== 'neon' ? 'var(--success)' : 'rgba(255,255,255,0.08)'}"><span style="color:${TIER_META[t].color}">${TIER_META[t].name}</span><b>${inv[t] || 0}</b></div>`).join('')}
        </div>
        ${craftTier ? `<button class="btn gold full" style="margin-bottom:8px" id="do-craft">Слияние: 3 ${TIER_META[craftTier].name} → 1 ${TIER_META[nextTier].name}</button>` : ''}
        <div style="display:flex;gap:8px">
          <button class="btn ${inTeam ? 'ghost' : 'cyan'}" style="flex:1" id="do-equip">${inTeam ? 'В составе ✓' : 'В состав'}</button>
          <button class="btn ghost" onclick="playAudio('${c.quoteFile}','${c.quoteKr}')">🔊 Фраза</button>
        </div>
      </div>`;

    document.getElementById('do-equip').onclick = () => {
      st.team[c.roleKey] = cardId; save(); updateNavDots(); haptic('ok'); sfx('ok');
      renderBinder(); openArtistModal(cardId);
    };
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
      st.inv[cardId][fromTier] -= 3;
      st.inv[cardId][toTier] = (st.inv[cardId][toTier] || 0) + 1;
      st.fusionsCount = (st.fusionsCount || 0) + 1;
      save(); updateNavDots(); renderBinder();
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
    }, 850);
  }

  window.openCaseModal = function (type) {
    initStudioState();
    const prices = { silver: 50, gold: 120, platinum: 0 };
    const hasFree = st.cases[type] > 0;
    if (!hasFree) {
      if (type === 'platinum') return alert('Платиновый бокс выдаётся за сдачу Большого экзамена или 1 место в Топе!');
      if (st.coins < prices[type]) return alert(`Нужно ${prices[type]} микрофонов!`);
      st.coins -= prices[type];
    } else {
      st.cases[type]--;
    }
    save(); updateNavDots(); renderShop();
    haptic('medium');

    const titleMap = { silver: "SILVER EDITION", gold: "GOLD EDITION", platinum: "PLATINUM EDITION" };
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');

    const boxUrl = BOX_IMAGES[type];
    const vinylUrl = BOX_IMAGES.vinyl;

    modal.innerHTML = `
      <div style="font-size:12px;color:var(--cyan);font-weight:800;letter-spacing:1.5px;margin-bottom:10px">НАЖМИ НА АЛЬБОМ, ЧТОБЫ ДОСТАТЬ ПЛАСТИНКУ</div>
      <div class="album-stage" id="album-stage">
        <div class="album-vinyl" id="vinyl-anim" style="${vinylUrl ? `background: url('${vinylUrl}') no-repeat center; background-size: contain; border: none; box-shadow: none;` : ''}">
          ${vinylUrl ? '' : '<div class="vinyl-label"><div class="vinyl-hole"></div></div>'}
        </div>
        <div class="album-sleeve ${type} ${boxUrl ? '' : 'no-img'}" id="sleeve-anim" style="${boxUrl ? `background-image: url('${boxUrl}'); box-shadow: none;` : ''}">
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

      setTimeout(() => {
        triggerFlash(() => {
          const luck = getTeamBonuses().luck / 100, r = Math.random();
          let tier = 'silver';
          if (type === 'platinum') tier = 'platinum';
          else if (type === 'gold') tier = r < (0.2 + luck * 0.5) ? 'platinum' : 'gold';
          else tier = r < (0.02 + luck * 0.2) ? 'platinum' : (r < (0.2 + luck) ? 'gold' : 'silver');

          const c = CARDS[Math.floor(Math.random() * CARDS.length)];
          addCardCopy(c.id, tier);

          let trophyMsg = '';
          if ((type === 'gold' && Math.random() < 0.12) || (type === 'platinum' && Math.random() < 0.35)) {
            if (!st.trophies.includes('gold_mic')) {
              st.trophies.push('gold_mic');
              trophyMsg = `<div style="margin-top:8px;color:var(--gold);font-size:12px;font-weight:800">★ ТРОФЕЙ: Золотой микрофон!</div>`;
            }
          }
          save(); updateNavDots();
          haptic('ok'); sfx('win');
          if (tier !== 'silver') fireConfetti();
          if (c.quoteFile) setTimeout(() => playAudio(c.quoteFile, c.quoteKr), 100);

          const tm = TIER_META[tier], cnt = st.inv[c.id][tier];
          modal.innerHTML = `
            <div style="font-size:14px;font-weight:900;color:${tm.color};margin-bottom:14px">${tm.name.toUpperCase()} • КОПИЙ: ${cnt}${cnt >= 3 ? ' (СЛИЯНИЕ 3→1!)' : ''}</div>
            <div class="photocard tier-${tier} reveal-card">
              <div class="pc-rarity" style="color:${tm.color}">${tm.name}</div>
              ${cardArtHtml(c)}
              <div class="pc-name" style="font-size:16px">${c.name}</div>
              <div class="pc-role">${c.role}</div>
              <div style="margin-top:8px;font-size:12px;color:#ff99d6">«${c.quoteKr}»</div>
              ${trophyMsg}
            </div>
            <button class="btn full" style="max-width:240px;margin-top:18px" onclick="document.getElementById('pack-modal').classList.remove('open')">В Студию</button>`;
        });
      }, 350);
    };
  };

  // Перехваты для квестов
  const origFinishLesson = window.finishLesson;
  window.finishLesson = function () {
    const passed = !(curL && curL.isExam && mistakes > 4);
    if (passed) {
      initStudioState();
      st.daily.lessons++;
      checkDailyMonthlyPts();
      if (curL && !st.done.includes(curL.id)) {
        const b = getTeamBonuses();
        st.xp += Math.round(curL.xp * (b.xp / 100));
        st.coins += Math.round(curL.coins * (b.coins / 100));
        if (curL.isExam) {
          st.cases.platinum++;
          if (!st.trophies.includes('hangul_master')) st.trophies.push('hangul_master');
        } else if (curL.id % 4 === 0) {
          st.cases.gold++;
        }
      }
      save(); updateNavDots();
    }
    origFinishLesson();
  };

  const origMountDraw = window.mountDrawWidget;
  window.mountDrawWidget = function (container, item, blindMode, onSuccess, onFail, noPeek) {
    origMountDraw(container, item, blindMode, () => {
      if (document.getElementById('screen-vocab').classList.contains('active')) {
        initStudioState(); st.daily.dict++; checkDailyMonthlyPts(); save(); updateNavDots();
      }
      if (onSuccess) onSuccess();
    }, onFail, noPeek);
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('#fc-card') && e.target.id !== 'fc-audio') {
      initStudioState(); st.daily.cards++; checkDailyMonthlyPts(); save(); updateNavDots();
    }
  });

  /* ====== АВТОСОХРАНЕНИЕ ПРОГРЕССА УРОКА ====== */
  const origStartLesson = window.startLesson;
  window.startLesson = function (id) {
    if (!st.inProgress) st.inProgress = {};
    const saved = st.inProgress[id];
    if (saved && Array.isArray(saved.queue) && saved.qIdx < saved.queue.length) {
      syncResources();
      curL = LESSONS.find(x => x.id === id);
      isReplay = st.done.includes(curL.id);
      queue = saved.queue;
      qIdx = saved.qIdx;
      mistakes = saved.mistakes || 0;
      switchTab('study');
      renderStep();
      return;
    }
    origStartLesson(id);
    if (document.getElementById('screen-study').classList.contains('active') && curL && curL.id === id) {
      st.inProgress[id] = { qIdx, mistakes, queue };
      save(false);
    }
  };

  const origRenderStep = window.renderStep;
  window.renderStep = function () {
    if (curL && qIdx < queue.length) {
      if (!st.inProgress) st.inProgress = {};
      st.inProgress[curL.id] = { qIdx, mistakes, queue };
      save(false);
    }
    origRenderStep();
  };

  const origFinishForSave = window.finishLesson;
  window.finishLesson = function () {
    if (curL && st.inProgress && st.inProgress[curL.id]) {
      delete st.inProgress[curL.id];
      save(false);
    }
    origFinishForSave();
  };

  const origRenderLessons = window.renderLessons;
  window.renderLessons = function () {
    origRenderLessons();
    if (!st.inProgress || typeof LESSONS === 'undefined') return;
    const cards = document.querySelectorAll('#lessons-list .lesson-card');
    LESSONS.forEach((l, idx) => {
      const saved = st.inProgress[l.id];
      if (saved && cards[idx]) {
        const btn = cards[idx].querySelector('button');
        if (btn) {
          btn.innerText = `Продолжить (${saved.qIdx + 1}/${saved.queue.length})`;
          btn.className = 'btn cyan';
        }
      }
    });
  };

  /* ====== ТЁМНЫЙ ТОСТ ====== */
  const toastCss = document.createElement('style');
  toastCss.textContent = `
    .app-toast { position: fixed; left: 50%; bottom: 86px; transform: translateX(-50%) translateY(18px); background: rgba(20, 14, 34, 0.96); border: 1.5px solid rgba(0, 229, 255, 0.45); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 229, 255, 0.18); color: #fff; font-size: 13px; font-weight: 700; line-height: 1.35; text-align: center; padding: 11px 16px; border-radius: 14px; max-width: calc(100vw - 32px); width: max-content; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.22s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1); white-space: pre-line; backdrop-filter: blur(8px); }
    .app-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
  `;
  document.head.appendChild(toastCss);

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

  initStudioState();
  renderLessons();
  if (!st.onboarded) setTimeout(openOnboarding, 250);
})();
