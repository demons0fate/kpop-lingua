/* ====== ЕДИНАЯ СТУДИЯ: ГРУППА, ВИНИЛОВЫЕ БОКСЫ, ИНВЕНТАРЬ И СЛИЯНИЕ ====== */
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

  const TROPHIES = [
    { id: "hangul_master", name: "Код Хангыля", desc: "За сдачу Экзамена 1", buff: "+5% XP навсегда", icon: "★" },
    { id: "gold_mic", name: "Золотой микрофон", desc: "Редкий дроп из боксов", buff: "+5% 🎤 навсегда", icon: "🎙" },
    { id: "streak_7", name: "Неоновый лайтстик", desc: "Серия 7 дней подряд", buff: "-5 мин к энергии", icon: "⚡" }
  ];

  let studioSubTab = 'boxes'; // 'boxes' | 'cards' | 'quests'

  // 1. Стили
  const css = document.createElement('style');
  css.textContent = `
    .nav-dot { position: absolute; top: 4px; right: 22%; width: 8px; height: 8px; border-radius: 50%; background: var(--success); border: 1.5px solid #0f0b1a; display: none; }
    .nav-dot.show { display: block; }

    .agency-card { background: linear-gradient(135deg, #271345, #150f26); border: 1px solid rgba(0,229,255,0.32); border-radius: 20px; padding: 14px 16px; margin-bottom: 12px; }
    .agency-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
    .agency-name { font-size: 18px; font-weight: 900; color: #fff; }
    .agency-rank { font-size: 10px; font-weight: 800; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.6px; }
    .agency-buffs { font-size: 11px; color: #d8cce8; display: flex; flex-wrap: wrap; gap: 8px; }

    .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
    .team-slot { background: var(--surface); border: 1.5px dashed rgba(255,255,255,0.16); border-radius: 14px; padding: 8px 4px; text-align: center; cursor: pointer; transition: 0.2s; min-height: 76px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .team-slot.filled { border-style: solid; background: linear-gradient(160deg, #201836, #140f24); }
    .team-slot:active { transform: scale(0.94); }
    .slot-role { font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
    .slot-tag { font-size: 16px; font-weight: 900; margin: 3px 0 1px; color: #fff; }
    .slot-tier { font-size: 9px; font-weight: 800; }

    .synergy-bar { font-size: 11px; padding: 7px 12px; border-radius: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); color: var(--muted); }
    .synergy-bar.on { background: rgba(0,230,118,0.12); border-color: var(--success); color: #b8ffd6; }

    /* Витрина боксов */
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

    .trophy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
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

  // Переименовываем нижнюю вкладку в «Студия» и добавляем точку-уведомление
  const navBinder = document.getElementById('nav-binder');
  if (navBinder) {
    if (navBinder.lastChild) navBinder.lastChild.textContent = 'Студия';
    const dot = document.createElement('div');
    dot.id = 'studio-nav-dot';
    dot.className = 'nav-dot';
    navBinder.appendChild(dot);
  }

  function updateStudioBadge() {
    const dot = document.getElementById('studio-nav-dot');
    if (dot && st.daily && st.cases) {
      const allDone = st.daily.lessons >= 1 && st.daily.dict >= 2 && st.daily.cards >= 3;
      const hasCases = (st.cases.silver + st.cases.gold + st.cases.platinum) > 0;
      dot.classList.toggle('show', (allDone && !st.daily.claimed) || hasCases);
    }
  }

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.team) st.team = { vocal: null, dance: null, rap: null, visual: null };
    if (!st.inv) st.inv = {};
    if (!st.cases) st.cases = { silver: 0, gold: 0, platinum: 0 };
    if (!st.trophies) st.trophies = [];
    if (typeof st.dust !== 'number') st.dust = 0;

    if (st.packTickets > 0) { st.cases.silver += st.packTickets; st.packTickets = 0; }

    st.cards.forEach(id => {
      if (!st.inv[id]) {
        const c = CARDS.find(x => x.id === id);
        const defTier = c && c.r === 'SSR' ? 'platinum' : (c && c.r === 'SR' ? 'gold' : 'silver');
        st.inv[id] = { silver: 0, gold: 0, platinum: 0, neon: 0 };
        st.inv[id][defTier] = (st.cardStars && st.cardStars[id]) ? st.cardStars[id] : 1;
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

    if (st.done.includes(9) && !st.trophies.includes('hangul_master')) st.trophies.push('hangul_master');
    if (st.streak.count >= 7 && !st.trophies.includes('streak_7')) st.trophies.push('streak_7');
    st.biasId = null;
    updateStudioBadge();
    save(false);
  }

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

  window.setStudioSubTab = function (t) {
    haptic('light');
    studioSubTab = t;
    renderBinder();
  };

  // ГЛАВНЫЙ ЭКРАН СТУДИИ (внутри #screen-binder)
  window.renderBinder = function () {
    if (typeof CARDS === 'undefined') return;
    initStudioState();
    const screen = document.getElementById('screen-binder');
    const b = getTeamBonuses();
    const cs = st.cases;
    const ownedCards = CARDS.filter(c => getBestTier(c.id));

    screen.innerHTML = `
      <div class="agency-card">
        <div class="agency-top">
          <div>
            <div class="agency-rank">${getRankTitle(st.xp)} • Серия ${st.streak.count} дн. • Фандом ${b.power}</div>
            <div class="agency-name">${st.agencyName}</div>
          </div>
          <button class="btn ghost" style="padding:6px 10px;font-size:11px" id="rename-agency">Имя</button>
        </div>
        <div class="agency-buffs">
          <span style="color:var(--cyan);font-weight:800">+${b.xp}% XP</span>
          <span style="color:#ff85cb;font-weight:800">+${b.coins}% 🎤</span>
          <span style="color:var(--gold);font-weight:800">-${b.energyMin}м ⚡</span>
        </div>
      </div>

      <div class="team-grid" id="team-grid"></div>
      <div class="synergy-bar ${b.synergy ? 'on' : ''}">
        <span>${b.synergy ? 'Синергия эры активна (+15% к наградам)' : '4 карты одной Эры дадут бонус Синергии'}</span>
        <b>${b.count}/4</b>
      </div>

      <div class="mode-switch">
        <button class="mode-btn ${studioSubTab === 'boxes' ? 'active' : ''}" onclick="setStudioSubTab('boxes')">Боксы</button>
        <button class="mode-btn ${studioSubTab === 'cards' ? 'active' : ''}" onclick="setStudioSubTab('cards')">Мои карты (${ownedCards.length})</button>
        <button class="mode-btn ${studioSubTab === 'quests' ? 'active' : ''}" onclick="setStudioSubTab('quests')">Задания</button>
      </div>
      <div id="studio-sub-body"></div>
    `;

    document.getElementById('rename-agency').onclick = () => {
      const n = prompt('Название твоего агентства:', st.agencyName);
      if (n && n.trim()) { st.agencyName = n.trim().slice(0, 22); save(); renderBinder(); }
    };

    // 4 слота команды
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
        el.innerHTML = `<div class="slot-role">${r.title}</div><div class="slot-tag">${c.tag}</div><div class="slot-tier" style="color:${tm.color}">${tm.name}</div>`;
      } else {
        el.innerHTML = `<div class="slot-role">${r.title}</div><div style="font-size:20px;opacity:0.35;margin-top:4px">+</div>`;
      }
      el.onclick = () => openSlotPicker(r);
      tgGrid.appendChild(el);
    });

    const sub = document.getElementById('studio-sub-body');

    // ПОДВКЛАДКА 1: БОКСЫ
    if (studioSubTab === 'boxes') {
      sub.innerHTML = `
        <div class="box-list">
          <div class="box-row silver">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#454c61,#1d202b);color:#cfd8dc;border:1px solid #cfd8dc">AG</span></div>
            <div style="flex:1">
              <div class="l-title" style="color:#cfd8dc">Серебряный бокс</div>
              <div class="l-meta">Серебро или Золото • За контракты</div>
            </div>
            <button class="btn ${cs.silver > 0 ? '' : 'ghost'}" onclick="openCaseModal('silver')">${cs.silver > 0 ? `Открыть (${cs.silver})` : '50 🎤'}</button>
          </div>

          <div class="box-row gold">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#7a5816,#291e0a);color:#ffd700;border:1px solid #ffd700">AU</span></div>
            <div style="flex:1">
              <div class="l-title" style="color:#ffd700">Золотой бокс</div>
              <div class="l-meta">Золото или Платина • За каждый 4-й урок</div>
            </div>
            <button class="btn ${cs.gold > 0 ? 'gold' : 'ghost'}" onclick="openCaseModal('gold')">${cs.gold > 0 ? `Открыть (${cs.gold})` : '120 🎤'}</button>
          </div>

          <div class="box-row platinum">
            <div class="mini-album"><span style="background:linear-gradient(145deg,#13526e,#23113d);color:#00e5ff;border:1px solid #00e5ff">PT</span></div>
            <div style="flex:1">
              <div class="l-title" style="color:#00e5ff">Платиновый бокс</div>
              <div class="l-meta">100% Платина • Награда за Экзамен</div>
            </div>
            <button class="btn ${cs.platinum > 0 ? 'cyan' : 'ghost'}" onclick="openCaseModal('platinum')">${cs.platinum > 0 ? `Открыть (${cs.platinum})` : 'Экзамен'}</button>
          </div>
        </div>`;
    }

    // ПОДВКЛАДКА 2: МОИ КАРТЫ (ТОЛЬКО ОТКРЫТЫЕ!)
    if (studioSubTab === 'cards') {
      if (!ownedCards.length) {
        sub.innerHTML = `
          <div class="card-box" style="text-align:center;padding:26px 18px">
            <h3 style="margin:0 0 8px">Инвентарь пока пуст</h3>
            <p style="color:var(--muted)">Проходи уроки, зарабатывай микрофоны и открывай виниловые боксы — все твои артисты появятся здесь.</p>
            <button class="btn" style="margin-top:8px" onclick="setStudioSubTab('boxes')">Перейти к боксам</button>
          </div>`;
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'binder-grid';
      ownedCards.forEach(c => {
        const best = getBestTier(c.id);
        const craft = getCraftableTier(c.id);
        const inTeam = st.team[c.roleKey] === c.id;
        const totalCopies = Object.values(st.inv[c.id]).reduce((a, b) => a + b, 0);
        const el = document.createElement('div');
        el.className = `photocard tier-${best} ${inTeam ? 'bias-active' : ''}`;
        el.innerHTML = `
          ${inTeam ? '<div class="pc-bias-tag">В СОСТАВЕ</div>' : ''}
          <div class="pc-rarity" style="color:${TIER_META[best].color}">${TIER_META[best].name}</div>
          ${craft ? '<div class="craft-badge">СЛИЯНИЕ 3→1</div>' : ''}
          ${cardArtHtml(c)}
          <div class="pc-name">${c.name}</div>
          <div class="pc-role">${c.role} • Копий: ${totalCopies}</div>`;
        el.onclick = () => openArtistModal(c.id);
        grid.appendChild(el);
      });
      sub.appendChild(grid);
    }

    // ПОДВКЛАДКА 3: ЗАДАНИЯ И ТРОФЕИ
    if (studioSubTab === 'quests') {
      const d = st.daily;
      const doneCnt = (d.lessons >= 1 ? 1 : 0) + (d.dict >= 2 ? 1 : 0) + (d.cards >= 3 ? 1 : 0);
      const allDone = doneCnt === 3;
      sub.innerHTML = `
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

        <div class="daily-prize" style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:800;color:var(--gold);text-transform:uppercase">Награда за все 3 задания</div>
          <div style="font-size:14px;font-weight:800;margin:4px 0 8px">Серебряный бокс + 25 микрофонов</div>
          ${allDone && !d.claimed
            ? `<button class="btn gold full" id="claim-daily">Забрать награду!</button>`
            : (d.claimed ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Награда получена!</div>` : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((doneCnt / 3) * 100)}%"></div></div>`)
          }
        </div>

        <h3 style="margin:0 0 8px;font-size:14px">Полка трофеев (${st.trophies.length}/${TROPHIES.length})</h3>
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

      const claimBtn = document.getElementById('claim-daily');
      if (claimBtn) {
        claimBtn.onclick = () => {
          st.daily.claimed = true; st.cases.silver++; st.coins += 25;
          save(); updateStudioBadge(); haptic('ok'); sfx('win'); fireConfetti(); renderBinder();
        };
      }
    }
  };

  function openSlotPicker(role) {
    const owned = CARDS.filter(c => getBestTier(c.id) && c.roleKey === role.key);
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    if (!owned.length) {
      modal.innerHTML = `<div class="card-box" style="max-width:300px;text-align:center"><h3>Роль: ${role.title}</h3><p style="color:var(--muted)">У тебя пока нет артистов этой роли. Открой бокс в Студии!</p><button class="btn full" onclick="document.getElementById('pack-modal').classList.remove('open')">Понятно</button></div>`;
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

  // ОТКРЫТИЕ ВИНИЛОВОГО БОКСА
  window.openCaseModal = function (type) {
    initStudioState();
    const prices = { silver: 50, gold: 120, platinum: 0 };
    const hasFree = st.cases[type] > 0;
    if (!hasFree) {
      if (type === 'platinum') return alert('Платиновый бокс выдаётся за сдачу Большого экзамена!');
      if (st.coins < prices[type]) return alert(`Нужно ${prices[type]} микрофонов!`);
      st.coins -= prices[type];
    } else {
      st.cases[type]--;
    }
    save(); updateStudioBadge(); renderBinder();
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
            trophyMsg = `<div style="margin-top:8px;color:var(--gold);font-size:12px;font-weight:800">★ ТРОФЕЙ: Золотой микрофон!</div>`;
          }
        }
        save(); renderBinder();
        haptic('ok'); sfx('win');
        if (tier !== 'silver') fireConfetti();
        if (c.quoteFile) setTimeout(() => playAudio(c.quoteFile, c.quoteKr), 250);

        const tm = TIER_META[tier];
        const cnt = st.inv[c.id][tier];
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
          <button class="btn full" style="max-width:240px;margin-top:18px" onclick="document.getElementById('pack-modal').classList.remove('open')">В инвентарь</button>`;
      }, 900);
    };
  };

  // Перехваты для контрактов и наград
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
