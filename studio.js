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
    initStudioState();
    const b = getTeamBonuses();
    const d = st.daily;
    const doneCnt = (d.lessons >= 1 ? 1 : 0) + (d.dict >= 2 ? 1 : 0) + (d.cards >= 3 ? 1 : 0);
    const allDone = doneCnt === 3;

    studioScreen.innerHTML = `
      <div class="agency-card">
        <div class="agency-top">
          <div>
            <div class="agency-rank">${getRankTitle(st.xp)} • Серия: ${st.streak.count} дн.</div>
            <div class="agency-name">${st.agencyName}</div>
          </div>
          <button class="btn ghost" style="padding:7px 11px;font-size:12px" id="rename-agency">Имя</button>
        </div>
        <div style="font-size:12px;color:#d8cce8;margin-bottom:8px">
          Бонусы: <b style="color:var(--cyan)">+${b.xp}% XP</b> • <b style="color:#ff85cb">+${b.coins}% 🎤</b> • <b style="color:var(--gold)">-${b.energyMin}м ⚡</b>
        </div>
        <div class="studio-stats">
          <div class="st-box"><div class="st-val" style="color:var(--accent)">${b.power}</div><div class="st-lbl">Фандом</div></div>
          <div class="st-box"><div class="st-val" style="color:var(--cyan)">${st.cards.length}/${CARDS.length}</div><div class="st-lbl">Артисты</div></div>
          <div class="st-box"><div class="st-val" style="color:var(--gold)">${st.dust}</div><div class="st-lbl">Зв. пыль</div></div>
        </div>
      </div>

      <h3 style="margin:0 0 8px;font-size:15px">Состав группы (${b.count}/4)</h3>
      <div class="team-grid" id="team-grid"></div>

      <div class="synergy-box ${b.synergy ? '' : 'off'}">
        <span>${b.synergy ? 'Синергия эры активна! (+15% XP, +15% 🎤)' : 'Поставь 4 карты одной Эры для бонуса Синергии'}</span>
        <b>${b.synergy ? 'ON' : `${b.count}/4`}</b>
      </div>

      <h3 style="margin:0 0 8px;font-size:15px">Полка трофеев (${st.trophies.length}/${TROPHIES.length})</h3>
      <div class="trophy-grid">
        ${TROPHIES.map(t => {
          const has = st.trophies.includes(t.id);
          return `<div class="trophy-item ${has ? 'has' : ''}" onclick="alert('${t.name}\\n${t.desc}\\nЭффект: ${t.buff}')">
            <div class="trophy-ico">${t.icon}</div>
            <div class="trophy-name">${t.name}</div>
            <div class="trophy-buff">${has ? t.buff : 'Закрыто'}</div>
          </div>`;
        }).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 8px">
        <h3 style="margin:0;font-size:15px">Ежедневные контракты</h3>
        <span style="font-size:12px;color:var(--cyan);font-weight:800">${doneCnt}/3 выполнено</span>
      </div>
      <div class="contract-row ${d.lessons >= 1 ? 'done' : ''}">
        <div><div class="c-title">Пройти 1 урок или повтор</div><div class="l-meta">Вкладка Уроки</div></div>
        <div class="c-prog">${Math.min(d.lessons, 1)}/1</div>
      </div>
      <div class="contract-row ${d.dict >= 2 ? 'done' : ''}">
        <div><div class="c-title">Написать 2 слова в Диктанте</div><div class="l-meta">Словарь → Диктант</div></div>
        <div class="c-prog">${Math.min(d.dict, 2)}/2</div>
      </div>
      <div class="contract-row ${d.cards >= 3 ? 'done' : ''}">
        <div><div class="c-title">Перевернуть 3 карточки</div><div class="l-meta">Словарь → 3D-Карточки</div></div>
        <div class="c-prog">${Math.min(d.cards, 3)}/3</div>
      </div>

      <div class="daily-prize">
        <div style="font-size:11px;font-weight:800;color:var(--gold);text-transform:uppercase">Награда за все 3 контракта</div>
        <div style="font-size:14px;font-weight:800;margin:4px 0 8px">Серебряный кейс + 25 микрофонов</div>
        ${allDone && !d.claimed
          ? `<button class="btn gold full" id="claim-daily">Забрать награду!</button>`
          : (d.claimed
              ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Награда получена! Новые контракты завтра.</div>`
              : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((doneCnt / 3) * 100)}%"></div></div>`)
        }
      </div>
    `;

    document.getElementById('rename-agency').onclick = () => {
      const n = prompt('Придумай название своего агентства:', st.agencyName);
      if (n && n.trim()) { st.agencyName = n.trim().slice(0, 22); save(); updateStudioBadge(); renderStudio(); }
    };

    const claimBtn = document.getElementById('claim-daily');
    if (claimBtn) {
      claimBtn.onclick = () => {
        st.daily.claimed = true; st.cases.silver++; st.coins += 25;
        save(); updateStudioBadge(); haptic('ok'); sfx('win'); fireConfetti(); renderStudio();
      };
    }

    const tgGrid = document.getElementById('team-grid');
    ROLES.forEach(r => {
      const cid = st.team[r.key];
      const tier = cid ? getBestTier(cid) : null;
      const c = tier ? CARDS.find(x => x.id === cid) : null;
      const el = document.createElement('div');
      el.className = 'team-slot' + (c ? ' filled' : '');
      if (c) {
        const tm = TIER_META[tier];
        el.style.borderColor = tm.color;
        el.innerHTML = `<div class="slot-role" style="color:${tm.color}">${r.title} • ${tm.name}</div><div style="font-weight:800;font-size:13px">${c.name}</div><div class="pc-bonus">+${Math.round(c.bonusVal * tm.mult)} ${c.bonusType === 'energy' ? 'мин ⚡' : '%'}</div>`;
      } else {
        el.innerHTML = `<div class="slot-role">${r.title}</div><div style="font-size:22px;opacity:0.35;margin:6px 0">+</div><div class="l-meta">Выбрать (${r.desc})</div>`;
      }
      el.onclick = () => openSlotPicker(r);
      tgGrid.appendChild(el);
    });
  };

  function openSlotPicker(role) {
    const owned = CARDS.filter(c => getBestTier(c.id) && c.roleKey === role.key);
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    if (!owned.length) {
      modal.innerHTML = `<div class="card-box" style="max-width:300px;text-align:center"><h3>Роль: ${role.title}</h3><p style="color:var(--muted)">У тебя пока нет артистов этой роли. Открывай кейсы во вкладке «Артисты»!</p><button class="btn full" onclick="document.getElementById('pack-modal').classList.remove('open')">Понятно</button></div>`;
      return;
    }
    let html = `<div class="card-box" style="width:100%;max-width:320px"><h3 style="margin-bottom:12px">Выбери: ${role.title}</h3>`;
    owned.forEach(c => {
      const tier = getBestTier(c.id), tm = TIER_META[tier];
      html += `<div class="vocab-row" data-pick="${c.id}"><div class="vocab-tag" style="border-color:${tm.color};color:${tm.color}">${c.tag}</div><div style="flex:1"><div style="font-weight:800;font-size:14px">${c.name}</div><div style="font-size:11px;color:${tm.color}">${tm.name} • Сила ${tm.power}</div></div></div>`;
    });
    html += `<button class="btn ghost full" style="margin-top:8px" onclick="document.getElementById('pack-modal').classList.remove('open')">Закрыть</button></div>`;
    modal.innerHTML = html;
    modal.querySelectorAll('[data-pick]').forEach(row => {
      row.onclick = () => {
        st.team[role.key] = Number(row.getAttribute('data-pick'));
        save(); haptic('ok'); sfx('ok'); modal.classList.remove('open'); renderStudio();
      };
    });
  }

  // Вкладка «Артисты и Кейсы»
  window.renderBinder = function () {
    if (typeof CARDS === 'undefined') return;
    initStudioState();
    const cs = st.cases;

    document.getElementById('bias-banner-wrap').innerHTML = `
      <div class="cases-grid">
        <div class="case-card silver">
          <div class="case-title" style="color:#cfd8dc">Серебряный</div>
          <div class="case-sub">Серебро / Золото</div>
          <button class="case-btn ${cs.silver > 0 ? 'ready' : ''}" onclick="openCaseModal('silver')">${cs.silver > 0 ? `Открыть (${cs.silver})` : '50 🎤'}</button>
        </div>
        <div class="case-card gold">
          <div class="case-title" style="color:#ffd700">Золотой</div>
          <div class="case-sub">Золото / Платина</div>
          <button class="case-btn ${cs.gold > 0 ? 'ready' : ''}" onclick="openCaseModal('gold')">${cs.gold > 0 ? `Открыть (${cs.gold})` : '120 🎤'}</button>
        </div>
        <div class="case-card platinum">
          <div class="case-title" style="color:#00e5ff">Платиновый</div>
          <div class="case-sub">100% Платина</div>
          <button class="case-btn ${cs.platinum > 0 ? 'ready' : ''}" onclick="openCaseModal('platinum')">${cs.platinum > 0 ? `Открыть (${cs.platinum})` : 'За Экзамен'}</button>
        </div>
      </div>`;

    const g = document.getElementById('binder-grid'); g.innerHTML = '';
    (curAlbum === 'all' ? CARDS : CARDS.filter(c => c.album === curAlbum)).forEach(c => {
      const best = getBestTier(c.id);
      const craft = getCraftableTier(c.id);
      const inTeam = st.team[c.roleKey] === c.id;
      const el = document.createElement('div');
      el.className = `photocard ${best ? 'tier-' + best : 'locked'} ${inTeam ? 'bias-active' : ''}`;
      const totalCopies = best ? Object.values(st.inv[c.id]).reduce((a, b) => a + b, 0) : 0;
      el.innerHTML = `
        ${inTeam ? '<div class="pc-bias-tag">В СОСТАВЕ</div>' : ''}
        <div class="pc-rarity" style="color:${best ? TIER_META[best].color : 'var(--muted)'}">${best ? TIER_META[best].name : 'Закрыто'}</div>
        ${craft ? '<div class="craft-badge">СЛИЯНИЕ 3→1</div>' : ''}
        ${best ? cardArtHtml(c) : '<div class="pc-art" style="background:#181326"><div class="pc-monogram" style="opacity:0.25">?</div></div>'}
        <div class="pc-name">${best ? c.name : 'Скрытый артист'}</div>
        <div class="pc-role">${best ? `${c.role} • Копий: ${totalCopies}` : 'Открой кейс выше'}</div>
      `;
      if (best) el.onclick = () => openArtistModal(c.id);
      g.appendChild(el);
    });
  };

  // Чистое окно Артиста (Озвучка + Состав + Крафт 3 в 1)
  function openArtistModal(cardId) {
    const c = CARDS.find(x => x.id === cardId);
    const best = getBestTier(cardId);
    const inv = st.inv[cardId];
    const inTeam = st.team[c.roleKey] === cardId;
    const craftTier = getCraftableTier(cardId);
    const nextTier = craftTier ? TIERS[TIERS.indexOf(craftTier) + 1] : null;
    const tm = TIER_META[best];

    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box" style="width:100%;max-width:330px;padding:16px">
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
      </div>
    `;

    document.getElementById('do-equip').onclick = () => {
      st.team[c.roleKey] = cardId; save(); haptic('ok'); sfx('ok');
      renderBinder(); openArtistModal(cardId);
    };

    const craftBtn = document.getElementById('do-craft');
    if (craftBtn) {
      craftBtn.onclick = () => runFusionAnim(cardId, craftTier, nextTier);
    }
  }

  // Анимация слияния 3 в 1
  function runFusionAnim(cardId, fromTier, toTier) {
    const c = CARDS.find(x => x.id === cardId);
    const modal = document.getElementById('pack-modal');
    haptic('heavy'); sfx('tap');
    modal.innerHTML = `
      <div style="font-size:14px;font-weight:900;color:${TIER_META[toTier].color};margin-bottom:12px">СЛИЯНИЕ В ${TIER_META[toTier].name.toUpperCase()}...</div>
      <div class="fusion-stage">
        <div class="f-orb o1"></div><div class="f-orb o2"></div><div class="f-orb o3"></div>
      </div>`;

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

  // Открытие Кейсов (Серебро / Золото / Платина)
  window.openCaseModal = function (type) {
    initStudioState();
    const prices = { silver: 50, gold: 120, platinum: 0 };
    const hasFree = st.cases[type] > 0;
    if (!hasFree) {
      if (type === 'platinum') return alert('Платиновый кейс выдаётся за сдачу Большого экзамена!');
      if (st.coins < prices[type]) return alert(`Нужно ${prices[type]} микрофонов!`);
      st.coins -= prices[type];
    } else {
      st.cases[type]--;
    }
    save(); updateStudioBadge(); renderBinder();
    haptic('medium');

    const titleMap = { silver: "СЕРЕБРЯНЫЙ КЕЙС", gold: "ЗОЛОТОЙ КЕЙС", platinum: "ПЛАТИНОВЫЙ КЕЙС" };
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    modal.innerHTML = `
      <div style="font-size:13px;color:var(--cyan);font-weight:800;letter-spacing:1px;margin-bottom:18px">НАЖМИ НА КЕЙС, ЧТОБЫ ОТКРЫТЬ</div>
      <div class="pack-foil" id="gacha-pack"><div class="pack-inner">
        <div style="font-size:11px;color:#ff85cb;font-weight:900;letter-spacing:2px">K-POP LINGUA</div>
        <div style="font-size:20px;font-weight:900;margin:14px 0">${titleMap[type]}</div>
        <div style="font-size:11px;color:var(--muted)">Нажми для открытия</div>
      </div></div>`;

    document.getElementById('gacha-pack').onclick = () => {
      document.getElementById('gacha-pack').classList.add('shaking');
      haptic('heavy'); sfx('tap');
      setTimeout(() => {
        const luck = getTeamBonuses().luck / 100;
        const r = Math.random();
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
            trophyMsg = `<div style="margin-top:8px;color:var(--gold);font-size:12px;font-weight:800">★ ВЫБИТ ТРОФЕЙ: Золотой микрофон!</div>`;
          }
        }
        save(); renderBinder();
        haptic('ok'); sfx('win');
        if (tier !== 'silver') fireConfetti();
        if (c.quoteFile) setTimeout(() => playAudio(c.quoteFile, c.quoteKr), 250);

        const tm = TIER_META[tier];
        const cnt = st.inv[c.id][tier];
        modal.innerHTML = `
          <div style="font-size:14px;font-weight:900;color:${tm.color};margin-bottom:14px">${tm.name.toUpperCase()} • КОПИЙ: ${cnt}${cnt >= 3 ? ' (ДОСТУПНО СЛИЯНИЕ!)' : ''}</div>
          <div class="photocard tier-${tier} reveal-card">
            <div class="pc-rarity" style="color:${tm.color}">${tm.name}</div>
            ${cardArtHtml(c)}
            <div class="pc-name" style="font-size:16px">${c.name}</div>
            <div class="pc-role">${c.role}</div>
            <div style="margin-top:8px;font-size:12px;color:#ff99d6">«${c.quoteKr}»</div>
            ${trophyMsg}
          </div>
          <button class="btn full" style="max-width:240px;margin-top:18px" onclick="document.getElementById('pack-modal').classList.remove('open')">Забрать</button>`;
      }, 550);
    };
  };

  // Перехваты для контрактов и выдачи кейсов за уроки/экзамен
  const origSwitchTab = window.switchTab;
  window.switchTab = function (t) {
    origSwitchTab(t);
    if (t === 'studio') renderStudio();
  };

  const origFinishLesson = window.finishLesson;
  window.finishLesson = function () {
    const passed = !(curL && curL.isExam && mistakes > 4);
    if (passed) {
      initStudioState();
      st.daily.lessons++;
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
      save(); updateStudioBadge();
    }
    origFinishLesson();
  };

  const origMountDraw = window.mountDrawWidget;
  window.mountDrawWidget = function (container, item, blindMode, onSuccess, onFail, noPeek) {
    origMountDraw(container, item, blindMode, () => {
      if (document.getElementById('screen-vocab').classList.contains('active')) {
        initStudioState(); st.daily.dict++; save(); updateStudioBadge();
      }
      if (onSuccess) onSuccess();
    }, onFail, noPeek);
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('#fc-card') && e.target.id !== 'fc-audio') {
      initStudioState(); st.daily.cards++; save(); updateStudioBadge();
    }
  });

  initStudioState();
})();
