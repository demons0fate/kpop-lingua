/* ====== СТУДИЯ (ЛИГИ, КАРТЫ 3-КОЛОНКИ, КВЕСТЫ 50 БАЛЛОВ И БЕЙДЖИ) + МАГАЗИН БОКСОВ + ТОП ====== */
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

  const LEAGUES = [
    { id: "bronze", name: "Лига Трейни",   minXp: 0,    icon: "◆", cls: "lg-bronze", color: "#cd9b6a" },
    { id: "silver", name: "Инди-лейбл",    minXp: 250,  icon: "◈", cls: "lg-silver", color: "#cfd8dc" },
    { id: "gold",   name: "Топ-лейбл",     minXp: 700,  icon: "★", cls: "lg-gold",   color: "#ffd700" },
    { id: "neon",   name: "Мировой чарт",  minXp: 1500, icon: "✦", cls: "lg-neon",   color: "#ff2e93" }
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

  const TROPHIES = [
    { id: "hangul_master", name: "Код Хангыля", desc: "За сдачу Экзамена 1", buff: "+5% XP", icon: "★" },
    { id: "gold_mic", name: "Золотой микрофон", desc: "Редкий дроп из боксов", buff: "+5% 🎤", icon: "🎙" },
    { id: "streak_7", name: "Неоновый лайтстик", desc: "Серия 7 дней подряд", buff: "-5м ⚡", icon: "⚡" }
  ];

  let studioSubTab = 'cards'; // 'cards' | 'quests'
  let shopSubTab = 'boxes';   // 'boxes' | 'vip'

  // 1. Стили
  const css = document.createElement('style');
  css.textContent = `
    .nav-dot { position: absolute; top: 4px; right: 22%; width: 8px; height: 8px; border-radius: 50%; background: var(--success); border: 1.5px solid #0f0b1a; display: none; }
    .nav-dot.show { display: block; }

    /* Карточка агентства и рамки лиг */
    .agency-card { border-radius: 20px; padding: 14px 16px; margin-bottom: 12px; position: relative; overflow: hidden; }
    .agency-card.lg-bronze { background: linear-gradient(135deg, #2b1f1a, #17111a); border: 1.5px solid rgba(205,155,106,0.5); }
    .agency-card.lg-silver { background: linear-gradient(135deg, #232838, #141224); border: 1.5px solid rgba(207,216,220,0.6); box-shadow: 0 0 16px rgba(207,216,220,0.14); }
    .agency-card.lg-gold   { background: linear-gradient(135deg, #3b2c10, #1c1326); border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255,215,0,0.22); }
    .agency-card.lg-neon   { background: linear-gradient(135deg, #3b1240, #12293d); border: 2px solid #ff2e93; box-shadow: 0 0 24px rgba(255,46,147,0.35), inset 0 0 18px rgba(0,229,255,0.2); }
    .agency-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
    .league-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; padding: 3px 8px; border-radius: 8px; background: rgba(0,0,0,0.38); margin-bottom: 4px; }
    .agency-name { font-size: 18px; font-weight: 900; color: #fff; }
    .agency-buffs { font-size: 11px; color: #d8cce8; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }

    .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
    .team-slot { background: var(--surface); border: 1.5px dashed rgba(255,255,255,0.16); border-radius: 14px; padding: 8px 4px; text-align: center; cursor: pointer; transition: 0.2s; min-height: 74px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .team-slot.filled { border-style: solid; background: linear-gradient(160deg, #201836, #140f24); }
    .team-slot:active { transform: scale(0.94); }
    .slot-role { font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
    .slot-tag { font-size: 15px; font-weight: 900; margin: 3px 0 1px; color: #fff; }
    .slot-tier { font-size: 9px; font-weight: 800; }

    .synergy-bar { font-size: 11px; padding: 7px 12px; border-radius: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); color: var(--muted); }
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

    /* Витрина боксов в Магазине */
    .box-list { display: grid; gap: 10px; }
    .box-row { display: flex; align-items: center; gap: 12px; background: var(--surface); border-radius: 18px; padding: 12px 14px; border: 1.5px solid rgba(255,255,255,0.1); }
    .box-row.silver { border-color: rgba(207,216,220,0.4); background: linear-gradient(135deg, #1f2330, #13151f); }
    .box-row.gold { border-color: rgba(255,215,0,0.45); background: linear-gradient(135deg, #332710, #17120c); }
    .box-row.platinum { border-color: rgba(0,229,255,0.5); background: linear-gradient(135deg, #112b3b, #151026); }
    .mini-album { width: 46px; height: 46px; border-radius: 10px; position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .mini-album::after { content: ''; position: absolute; right: -8px; top: 5px; width: 36px; height: 36px; border-radius: 50%; background: radial-gradient(circle, #ff2e93 18%, #111 22%, #222 45%, #111 70%); z-index: 0; }
    .mini-album span { position: relative; z-index: 1; width: 100%; height: 100%; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

    /* Анимация открытия: Коробка + Выезжающий винил */
    .album-stage { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 10px 0 18px; }
    .album-vinyl { position: absolute; width: 176px; height: 176px; border-radius: 50%; background: repeating-radial-gradient(circle, #14141c 0px, #14141c 3px, #1f1f2b 4px, #14141c 6px); border: 2px solid rgba(255,255,255,0.12); box-shadow: 0 10px 30px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1); z-index: 1; }
    .vinyl-label { width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--cyan)); border: 3px solid #111; display: flex; align-items: center; justify-content: center; }
    .vinyl-hole { width: 12px; height: 12px; border-radius: 50%; background: #0b0814; }
    .album-sleeve { position: relative; z-index: 2; width: 186px; height: 186px; border-radius: 18px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 14px 36px rgba(0,0,0,0.65); transition: transform 0.7s var(--spring); animation: packFloat 2.2s infinite ease-in-out; }
    .album-sleeve.silver { background: linear-gradient(145deg, #3a4052, #1b1e29); border: 2px solid #cfd8dc; }
    .album-sleeve.gold { background: linear-gradient(145deg, #694c14, #261b0b); border: 2px solid #ffd700; }
    .album-sleeve.platinum { background: linear-gradient(145deg, #124d66, #23123d); border: 2px solid #00e5ff; }
    .album-stage.opening .album-sleeve { animation: none; transform: translateX(-34px) rotate(-5deg); }
    .album-stage.opening .album-vinyl { transform: translateX(72px) rotate(540deg); }

    /* Задания, Ежемесячные бейджи (50 баллов) и Трофеи */
    .quest-sec { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin: 14px 0 8px; display: flex; justify-content: space-between; }
    .contract-row { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 11px 13px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .contract-row.done { border-color: rgba(0,230,118,0.45); background: rgba(0,230,118,0.08); }
    .c-title { font-size: 13px; font-weight: 700; }
    .c-sub { font-size: 10px; color: var(--muted); margin-top: 2px; }
    .c-prog { font-size: 12px; color: var(--cyan); font-weight: 800; }
    .daily-prize { background: linear-gradient(135deg, rgba(255,184,0,0.14), rgba(255,46,147,0.14)); border: 1px solid rgba(255,215,0,0.4); border-radius: 16px; padding: 12px 14px; margin-bottom: 12px; }

    .badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
    .m-badge { background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 8px 4px; text-align: center; opacity: 0.35; filter: grayscale(1); }
    .m-badge.missed { opacity: 0.48; filter: grayscale(1); border-color: rgba(255,255,255,0.08); }
    .m-badge.cur { opacity: 0.95; filter: none; border-style: dashed; border-color: var(--cyan); }
    .m-badge.got { opacity: 1; filter: none; border-width: 1.5px; background: linear-gradient(155deg, #271b42, #150f26); box-shadow: 0 0 12px rgba(255,46,147,0.22); }
    .m-badge-ico { width: 38px; height: 38px; border-radius: 50%; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-size: 18px; background: rgba(255,255,255,0.08); }
    .m-badge-name { font-size: 10px; font-weight: 800; }

    .trophy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
    .trophy-item { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 10px 6px; text-align: center; opacity: 0.4; filter: grayscale(1); }
    .trophy-item.has { opacity: 1; filter: none; border-color: rgba(255,215,0,0.45); background: linear-gradient(155deg, #2b2142, #181129); }
    .trophy-ico { font-size: 18px; margin-bottom: 3px; color: var(--gold); }
    .trophy-name { font-size: 10px; font-weight: 800; line-height: 1.2; }
    .trophy-buff { font-size: 9px; color: var(--cyan); margin-top: 2px; font-weight: 700; }

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

  // Начисление баллов месяца строго за выполненные дневные задания (макс. 3 в день)
  function checkDailyMonthlyPts() {
    const d = st.daily;
    if (d.lessons >= 1 && !d.p1) { d.p1 = true; st.monthly.pts++; }
    if (d.dict >= 2 && !d.p2) { d.p2 = true; st.monthly.pts++; }
    if (d.cards >= 3 && !d.p3) { d.p3 = true; st.monthly.pts++; }
  }

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
    if (sDot && st.daily && st.weekly && st.monthly) {
      const dailyReady = st.daily.lessons >= 1 && st.daily.dict >= 2 && st.daily.cards >= 3 && !st.daily.claimed;
      const weeklyReady = st.weekly.days.length >= 5 && !st.weekly.claimed;
      const monthlyReady = st.monthly.pts >= MONTHLY_GOAL && !st.monthly.claimed;
      sDot.classList.toggle('show', dailyReady || weeklyReady || monthlyReady);
    }
    if (shDot && st.cases) {
      shDot.classList.toggle('show', (st.cases.silver + st.cases.gold + st.cases.platinum) > 0);
    }
  }

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.team) st.team = { vocal: null, dance: null, rap: null, visual: null };
    if (!st.inv) st.inv = {};
    if (!st.cases) st.cases = { silver: 0, gold: 0, platinum: 0 };
    if (!st.trophies) st.trophies = [];
    if (!st.monthlyBadges) st.monthlyBadges = [];
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

  /* ====== 1. ЭКРАН СТУДИИ (ЛИЧНЫЙ КАБИНЕТ + МОИ КАРТЫ + ЗАДАНИЯ) ====== */
  window.renderBinder = function () {
    if (typeof CARDS === 'undefined') return;
    initStudioState();
    const screen = document.getElementById('screen-binder');
    const b = getTeamBonuses();
    const lg = getLeague(st.xp);
    const nextLg = LEAGUES.find(x => x.minXp > st.xp);
    const ownedCards = CARDS.filter(c => getBestTier(c.id));

    screen.innerHTML = `
      <div class="agency-card ${lg.cls}">
        <div class="agency-top">
          <div>
            <div class="league-pill" style="color:${lg.color}">${lg.icon} ${lg.name} • ${st.xp} XP</div>
            <div class="agency-name">${st.agencyName}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn cyan" style="padding:6px 9px;font-size:11px" id="test-add-coins">+500</button>
            <button class="btn ghost" style="padding:6px 10px;font-size:11px" id="rename-agency">Имя</button>
          </div>
        </div>
        ${nextLg ? `<div style="font-size:10px;color:var(--muted);margin-bottom:4px">До лиги «${nextLg.name}»: ${nextLg.minXp - st.xp} XP</div><div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, Math.round((st.xp / nextLg.minXp) * 100))}%"></div></div>` : `<div style="font-size:11px;color:var(--gold);font-weight:800">Максимальная лига достигнута!</div>`}
        <div class="agency-buffs">
          <span>Серия: <b>${st.streak.count} дн.</b></span>
          <span>Фандом: <b style="color:var(--accent)">${b.power}</b></span>
          <span style="color:var(--cyan);font-weight:800">+${b.xp}% XP</span>
          <span style="color:#ff85cb;font-weight:800">+${b.coins}% 🎤</span>
        </div>
      </div>

      <div class="team-grid" id="team-grid"></div>
      <div class="synergy-bar ${b.synergy ? 'on' : ''}">
        <span>${b.synergy ? 'Синергия эры активна (+15% к наградам)' : '4 карты одной Эры дадут бонус Синергии'}</span>
        <b>${b.count}/4</b>
      </div>

      <div class="mode-switch">
        <button class="mode-btn ${studioSubTab === 'cards' ? 'active' : ''}" onclick="setStudioSubTab('cards')">Мои карты (${ownedCards.length})</button>
        <button class="mode-btn ${studioSubTab === 'quests' ? 'active' : ''}" onclick="setStudioSubTab('quests')">Задания и Бейджи</button>
      </div>
      <div id="studio-sub-body"></div>
    `;

    document.getElementById('test-add-coins').onclick = () => {
      st.coins += 500; save(); haptic('ok'); sfx('tap'); renderBinder();
    };
    document.getElementById('rename-agency').onclick = () => {
      const n = prompt('Название твоего агентства:', st.agencyName);
      if (n && n.trim()) { st.agencyName = n.trim().slice(0, 22); save(); renderBinder(); }
    };

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

    const sub = document.getElementById('studio-sub-body');

    // МОИ КАРТЫ (компактно 3 колонки + увеличение по клику)
    if (studioSubTab === 'cards') {
      if (!ownedCards.length) {
        sub.innerHTML = `<div class="card-box" style="text-align:center;padding:24px 16px"><h3 style="margin:0 0 8px">Инвентарь пуст</h3><p style="color:var(--muted)">Открывай виниловые боксы в Магазине — все твои артисты появятся здесь.</p><button class="btn" style="margin-top:8px" onclick="shopSubTab='boxes';switchTab('shop')">В Магазин боксов</button></div>`;
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
      sub.appendChild(grid);
    }

    // ЗАДАНИЯ (Ежедневные + Еженедельные + Ежемесячный квест 50 баллов + Архив бейджей)
    if (studioSubTab === 'quests') {
      const d = st.daily, w = st.weekly, m = st.monthly;
      const dCnt = (d.lessons >= 1 ? 1 : 0) + (d.dict >= 2 ? 1 : 0) + (d.cards >= 3 ? 1 : 0);
      const curMonthIdx = new Date().getMonth();
      const curYear = new Date().getFullYear();

      sub.innerHTML = `
        <div class="quest-sec"><span>Ежемесячный квест • ${MONTHS[curMonthIdx].name} ${curYear}</span><span style="color:var(--accent)">${Math.min(m.pts, MONTHLY_GOAL)}/${MONTHLY_GOAL}</span></div>
        <div class="card-box" style="padding:13px 14px;margin-bottom:12px;border-color:rgba(255,46,147,0.35)">
          <div style="font-size:13px;font-weight:800;margin-bottom:3px">Набери ${MONTHLY_GOAL} баллов за месяц</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Каждое дневное задание = +1 балл (до 3 в день) • Награда: Рарный бейдж + Золотой бокс</div>
          ${m.pts >= MONTHLY_GOAL && !m.claimed
            ? `<button class="btn full" id="claim-monthly">Получить бейдж «${MONTHS[curMonthIdx].name} ${curYear}»!</button>`
            : (m.claimed
                ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Бейдж этого месяца в твоей коллекции!</div>`
                : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, Math.round((m.pts / MONTHLY_GOAL) * 100))}%"></div></div>`)
          }
        </div>

        <div class="quest-sec"><span>Ежедневные задания (до 3 баллов в день)</span><span style="color:var(--cyan)">${dCnt}/3</span></div>
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
        </div>

        <div class="quest-sec"><span>Бейджи ${curYear} (Архив)</span><span>${st.monthlyBadges.length}/12</span></div>
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

        <div class="quest-sec"><span>Полка трофеев</span><span>${st.trophies.length}/${TROPHIES.length}</span></div>
        <div class="trophy-grid">
          ${TROPHIES.map(t => {
            const has = st.trophies.includes(t.id);
            return `<div class="trophy-item ${has ? 'has' : ''}" onclick="alert('${t.name}\\n${t.desc}\\nЭффект: ${t.buff}')">
              <div class="trophy-ico">${t.icon}</div>
              <div class="trophy-name">${t.name}</div>
              <div class="trophy-buff">${has ? t.buff : 'Закрыто'}</div>
            </div>`;
          }).join('')}
        </div>`;

      const cd = document.getElementById('claim-daily');
      if (cd) cd.onclick = () => { st.daily.claimed = true; st.cases.silver++; st.coins += 25; save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder(); };
      const cw = document.getElementById('claim-weekly');
      if (cw) cw.onclick = () => { st.weekly.claimed = true; st.cases.gold++; st.coins += 50; save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder(); };
      const cm = document.getElementById('claim-monthly');
      if (cm) cm.onclick = () => { st.monthly.claimed = true; if (!st.monthlyBadges.includes(m.key)) st.monthlyBadges.push(m.key); st.cases.gold++; save(); updateNavDots(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder(); };
    }
  };

  /* ====== 2. МАГАЗИН (2 ВКЛАДКИ: БОКСЫ | ДОНАТ И VIP) ====== */
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

  /* ====== 3. РЕЙТИНГ (ТОП-3 ПОЛУЧАЮТ БОКСЫ РАЗНЫХ РАНГОВ) ====== */
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
      st.team[c.roleKey] = cardId; save(); haptic('ok'); sfx('ok');
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
    modal.innerHTML = `
      <div style="font-size:12px;color:var(--cyan);font-weight:800;letter-spacing:1px;margin-bottom:10px">НАЖМИ НА АЛЬБОМ, ЧТОБЫ ДОСТАТЬ ПЛАСТИНКУ</div>
      <div class="album-stage" id="album-stage">
        <div class="album-vinyl"><div class="vinyl-label"><div class="vinyl-hole"></div></div></div>
        <div class="album-sleeve ${type}">
          <div style="font-size:10px;font-weight:900;letter-spacing:1.5px;opacity:0.8">K-POP LINGUA</div>
          <div style="font-size:18px;font-weight:900;line-height:1.1">${titleMap[type]}</div>
          <div style="font-size:10px;opacity:0.65">LIMITED VINYL BOX</div>
        </div>
      </div>`;

    document.getElementById('album-stage').onclick = () => {
      const stg = document.getElementById('album-stage');
      if (stg.classList.contains('opening')) return;
      stg.classList.add('opening');
      haptic('heavy'); sfx('tap');

      setTimeout(() => {
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
        if (c.quoteFile) setTimeout(() => playAudio(c.quoteFile, c.quoteKr), 250);

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
      }, 900);
    };
  };

  // Перехваты для квестов (дневных -> 1 балл в месяц за каждое задание)
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

  initStudioState();
})();
