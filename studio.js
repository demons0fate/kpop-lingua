/* ====== МОДУЛЬ СТУДИИ, КЕЙСОВ, СЛИЯНИЯ 3-В-1 И ТРОФЕЕВ ====== */
(function () {
  const ROLES = [
    { key: "vocal", title: "Вокал", desc: "Бонус XP" },
    { key: "dance", title: "Танцор", desc: "Энергия" },
    { key: "rap", title: "Рэпер", desc: "Микрофоны" },
    { key: "visual", title: "Вижуал", desc: "Удача кейсов" }
  ];

  const TIERS = ["silver", "gold", "platinum", "neon"];
  const TIER_META = {
    silver:   { name: "Серебро", mult: 1.0,  power: 100, color: "#cfd8dc" },
    gold:     { name: "Золото",  mult: 1.6,  power: 200, color: "#ffd700" },
    platinum: { name: "Платина", mult: 2.3,  power: 350, color: "#00e5ff" },
    neon:     { name: "Неон",    mult: 3.2,  power: 600, color: "#ff2e93" }
  };

  const TROPHIES = [
    { id: "hangul_master", name: "Код Хангыля", desc: "За сдачу Экзамена 1", buff: "+5% XP навсегда", icon: "★" },
    { id: "gold_mic", name: "Золотой микрофон", desc: "Редкий дроп из кейсов", buff: "+5% 🎤 навсегда", icon: "🎙" },
    { id: "streak_7", name: "Неоновый лайтстик", desc: "Серия 7 дней подряд", buff: "-5 мин к энергии", icon: "⚡" }
  ];

  // 1. Стили
  const css = document.createElement('style');
  css.textContent = `
    .studio-btn { display: flex; align-items: center; gap: 7px; background: linear-gradient(135deg, #2b144a, #1c1233); border: 1.5px solid rgba(255,46,147,0.65); padding: 4px 11px 4px 5px; border-radius: 20px; color: #fff; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 0 14px rgba(255,46,147,0.28); position: relative; transition: transform 0.18s var(--spring); }
    .studio-btn:active { transform: scale(0.93); }
    .studio-ava { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--cyan)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #0b0814; }
    .studio-dot { position: absolute; top: -2px; right: -2px; width: 9px; height: 9px; border-radius: 50%; background: var(--success); border: 2px solid #120d1e; display: none; }
    .studio-dot.show { display: block; }

    .agency-card { background: linear-gradient(135deg, #271345, #171029); border: 1px solid rgba(0,229,255,0.35); border-radius: 20px; padding: 16px; margin-bottom: 14px; }
    .agency-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; }
    .agency-name { font-size: 19px; font-weight: 900; color: #fff; }
    .agency-rank { font-size: 11px; font-weight: 800; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.6px; }
    .studio-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
    .st-box { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 8px; text-align: center; }
    .st-val { font-size: 16px; font-weight: 900; color: #fff; }
    .st-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; }

    .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px; }
    .team-slot { background: var(--surface); border: 1.5px dashed rgba(255,255,255,0.16); border-radius: 16px; padding: 12px; text-align: center; cursor: pointer; position: relative; transition: 0.2s; }
    .team-slot.filled { border-style: solid; border-color: rgba(0,229,255,0.45); background: linear-gradient(160deg, #201836, #140f24); }
    .team-slot:active { transform: scale(0.96); }
    .slot-role { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--cyan); margin-bottom: 5px; }
    .synergy-box { background: rgba(0,230,118,0.12); border: 1px solid var(--success); border-radius: 14px; padding: 10px 12px; font-size: 12px; color: #b8ffd6; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .synergy-box.off { background: var(--surface); border-color: rgba(255,255,255,0.08); color: var(--muted); }

    .trophy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
    .trophy-item { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 10px 6px; text-align: center; opacity: 0.4; filter: grayscale(1); }
    .trophy-item.has { opacity: 1; filter: none; border-color: rgba(255,215,0,0.45); background: linear-gradient(155deg, #2b2142, #181129); }
    .trophy-ico { font-size: 20px; margin-bottom: 4px; color: var(--gold); }
    .trophy-name { font-size: 11px; font-weight: 800; line-height: 1.2; }
    .trophy-buff { font-size: 9px; color: var(--cyan); margin-top: 3px; font-weight: 700; }

    .contract-row { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 11px 13px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .contract-row.done { border-color: rgba(0,230,118,0.45); background: rgba(0,230,118,0.08); }
    .c-title { font-size: 13px; font-weight: 700; }
    .c-prog { font-size: 12px; color: var(--cyan); font-weight: 800; }
    .daily-prize { background: linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,46,147,0.15)); border: 1px solid rgba(255,215,0,0.4); border-radius: 16px; padding: 12px 14px; margin-top: 10px; }

    /* Склад кейсов */
    .cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
    .case-card { background: var(--surface); border-radius: 16px; padding: 10px 8px; text-align: center; border: 1.5px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between; gap: 6px; }
    .case-card.silver { border-color: rgba(207,216,220,0.45); background: linear-gradient(160deg, #222633, #13151f); }
    .case-card.gold { border-color: rgba(255,215,0,0.5); background: linear-gradient(160deg, #382c12, #1a140d); }
    .case-card.platinum { border-color: rgba(0,229,255,0.55); background: linear-gradient(160deg, #133142, #17122b); }
    .case-title { font-size: 11px; font-weight: 900; }
    .case-sub { font-size: 9px; color: var(--muted); }
    .case-btn { border: none; border-radius: 10px; padding: 7px 4px; font-size: 11px; font-weight: 800; cursor: pointer; color: #fff; background: rgba(255,255,255,0.12); }
    .case-btn.ready { background: linear-gradient(135deg, var(--accent), var(--purple)); box-shadow: 0 0 12px rgba(255,46,147,0.4); }

    /* 4 ранга рамок */
    .photocard.tier-silver { border: 1.5px solid #b0bec5; box-shadow: 0 0 10px rgba(176,190,197,0.15); }
    .photocard.tier-gold { border: 2px solid #ffd700; box-shadow: 0 0 16px rgba(255,215,0,0.28); }
    .photocard.tier-platinum { border: 2px solid #00e5ff; box-shadow: 0 0 20px rgba(0,229,255,0.35); }
    .photocard.tier-neon { border: 2px solid #ff2e93; box-shadow: 0 0 24px rgba(255,46,147,0.55), inset 0 0 14px rgba(0,229,255,0.3); animation: neonPulse 2s infinite alternate; }
    @keyframes neonPulse { from { box-shadow: 0 0 16px rgba(255,46,147,0.45); } to { box-shadow: 0 0 28px rgba(0,229,255,0.75); } }
    .photocard.tier-gold::after, .photocard.tier-platinum::after, .photocard.tier-neon::after { content: ''; position: absolute; inset: -60%; background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.24) 50%, transparent 65%); transform: rotate(18deg); animation: holo 3.4s infinite linear; pointer-events: none; }

    .craft-badge { position: absolute; bottom: 8px; right: 8px; z-index: 3; background: var(--success); color: #061a0e; font-size: 9px; font-weight: 900; padding: 3px 7px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,230,118,0.6); }
    .tier-pills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 12px 0; }
    .t-pill { background: var(--surface-2); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 4px; text-align: center; font-size: 10px; }
    .t-pill b { display: block; font-size: 14px; margin-top: 2px; }

    /* Анимация слияния 3 в 1 */
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

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function getBestTier(cardId) {
    const inv = st.inv && st.inv[cardId];
    if (!inv) return null;
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (inv[TIERS[i]] > 0) return TIERS[i];
    }
    return null;
  }

  function getCraftableTier(cardId) {
    const inv = st.inv && st.inv[cardId];
    if (!inv) return null;
    for (let i = 0; i < TIERS.length - 1; i++) {
      if (inv[TIERS[i]] >= 3) return TIERS[i];
    }
    return null;
  }

  function addCardCopy(cardId, tier) {
    if (!st.inv[cardId]) st.inv[cardId] = { silver: 0, gold: 0, platinum: 0, neon: 0 };
    st.inv[cardId][tier] = (st.inv[cardId][tier] || 0) + 1;
    if (!st.cards.includes(cardId)) st.cards.push(cardId);
  }

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.team) st.team = { vocal: null, dance: null, rap: null, visual: null };
    if (!st.inv) st.inv = {};
    if (!st.cases) st.cases = { silver: 0, gold: 0, platinum: 0 };
    if (!st.trophies) st.trophies = [];
    if (typeof st.dust !== 'number') st.dust = 0;

    // Миграция старых билетов в Серебряные кейсы
    if (st.packTickets > 0) {
      st.cases.silver += st.packTickets;
      st.packTickets = 0;
    }

    // Миграция старых карт в инвентарь рамок
    st.cards.forEach(id => {
      if (!st.inv[id]) {
        const c = CARDS.find(x => x.id === id);
        const defTier = c && c.r === 'SSR' ? 'platinum' : (c && c.r === 'SR' ? 'gold' : 'silver');
        const cnt = (st.cardStars && st.cardStars[id]) ? st.cardStars[id] : 1;
        st.inv[id] = { silver: 0, gold: 0, platinum: 0, neon: 0 };
        st.inv[id][defTier] = cnt;
      }
    });

    const today = todayKey();
    if (!st.streak) st.streak = { count: 1, lastDate: today };
    else if (st.streak.lastDate !== today) {
      const yest = new Date(Date.now() - 86400000);
      const yKey = `${yest.getFullYear()}-${yest.getMonth() + 1}-${yest.getDate()}`;
      st.streak.count = (st.streak.lastDate === yKey) ? st.streak.count + 1 : 1;
      st.streak.lastDate = today;
    }

    if (!st.daily || st.daily.date !== today) {
      st.daily = { date: today, lessons: 0, dict: 0, cards: 0, claimed: false };
    }

    // Проверка авто-трофеев
    if (st.done.includes(9) && !st.trophies.includes('hangul_master')) st.trophies.push('hangul_master');
    if (st.streak.count >= 7 && !st.trophies.includes('streak_7')) st.trophies.push('streak_7');

    st.biasId = null;
    updateStudioBadge();
    save(false);
  }

  // Переименовываем вкладку «Альбомы» -> «Артисты»
  const navBinder = document.getElementById('nav-binder');
  if (navBinder && navBinder.lastChild) navBinder.lastChild.textContent = 'Артисты';
  const binderTitle = document.querySelector('#screen-binder h3');
  if (binderTitle) binderTitle.innerText = 'Артисты и Кейсы';
  // Прячем старую кнопку «Открыть Чиби-пак»
  const oldPackBtn = document.querySelector('#screen-binder > button.btn.full');
  if (oldPackBtn) oldPackBtn.style.display = 'none';

  // Создаём экран Студии и кнопку профиля в шапке
  const studioScreen = document.createElement('div');
  studioScreen.id = 'screen-studio';
  studioScreen.className = 'screen';
  document.body.insertBefore(studioScreen, document.querySelector('.nav'));

  const brandEl = document.querySelector('.brand');
  if (brandEl) {
    brandEl.innerHTML = `<div class="studio-btn"><div class="studio-ava" id="st-ava">N</div><span>Студия</span><div class="studio-dot" id="st-dot"></div></div>`;
    brandEl.style.background = 'none';
    brandEl.style.webkitTextFillColor = 'initial';
    brandEl.onclick = () => switchTab('studio');
  }

  function updateStudioBadge() {
    const ava = document.getElementById('st-ava');
    const dot = document.getElementById('st-dot');
    if (ava && st.agencyName) ava.innerText = st.agencyName[0].toUpperCase();
    if (dot && st.daily) {
      const allDone = st.daily.lessons >= 1 && st.daily.dict >= 2 && st.daily.cards >= 3;
      const hasCases = (st.cases.silver + st.cases.gold + st.cases.platinum) > 0;
      dot.classList.toggle('show', (allDone && !st.daily.claimed) || hasCases);
    }
  }

  // Расчёт бонусов команды + трофеев
  window.getTeamBonuses = function () {
    let xp = 0, coins = 0, energyMin = 0, luck = 0, power = 0, count = 0;
    const albums = [];
    ROLES.forEach(r => {
      const cid = st.team[r.key];
      const tier = cid ? getBestTier(cid) : null;
      if (!tier) return;
      const c = CARDS.find(x => x.id === cid);
      if (!c) return;
      count++;
      const tm = TIER_META[tier];
      const val = Math.round(c.bonusVal * tm.mult);
      if (c.bonusType === 'xp') xp += val;
      if (c.bonusType === 'coins') coins += val;
      if (c.bonusType === 'energy') energyMin += val;
      if (c.bonusType === 'luck') luck += val;
      power += tm.power;
      albums.push(c.album);
    });
    const synergy = albums.length === 4 && albums.every(a => a === albums[0]);
    if (synergy) { xp += 15; coins += 15; power = Math.round(power * 1.15); }
    // Баффы от трофеев
    if (st.trophies.includes('hangul_master')) xp += 5;
    if (st.trophies.includes('gold_mic')) coins += 5;
    if (st.trophies.includes('streak_7')) energyMin += 5;
    return { xp, coins, energyMin, luck, power, count, synergy };
  };

  window.getEnergyRegenMs = function () {
    const cut = (getTeamBonuses().energyMin || 0) * 60 * 1000;
    return Math.max(30 * 60 * 1000, BASE_ENERGY_MS - cut);
  };

  function getRankTitle(xp) {
    if (xp >= 2000) return "Глава лейбла";
    if (xp >= 1000) return "Топ-продюсер";
    if (xp >= 400) return "Менеджер группы";
    return "Стажёр агентства";
  }

  // Экран Студии
  window.renderStudio = function () {
