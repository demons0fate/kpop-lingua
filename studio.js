/* ====== МОДУЛЬ СТУДИИ, ЕДИНОЙ КОМАНДЫ (4 РОЛИ), КОНТРАКТОВ И ПРОКАЧКИ ====== */
(function () {
  const ROLES = [
    { key: "vocal", title: "Вокал", desc: "Бонус XP" },
    { key: "dance", title: "Танцор", desc: "Энергия" },
    { key: "rap", title: "Рэпер", desc: "Микрофоны" },
    { key: "visual", title: "Вижуал", desc: "Удача паков" }
  ];

  // 1. Стили Студии и обновлённой кнопки профиля
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
    .slot-role { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--cyan); margin-bottom: 6px; }
    .slot-stars { font-size: 11px; color: var(--gold); letter-spacing: 1px; margin-top: 3px; }
    .synergy-box { background: rgba(0,230,118,0.12); border: 1px solid var(--success); border-radius: 14px; padding: 10px 12px; font-size: 12px; color: #b8ffd6; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .synergy-box.off { background: var(--surface); border-color: rgba(255,255,255,0.08); color: var(--muted); }

    .contract-row { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 11px 13px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .contract-row.done { border-color: rgba(0,230,118,0.45); background: rgba(0,230,118,0.08); }
    .c-title { font-size: 13px; font-weight: 700; }
    .c-prog { font-size: 12px; color: var(--cyan); font-weight: 800; }
    .daily-prize { background: linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,46,147,0.15)); border: 1px solid rgba(255,215,0,0.4); border-radius: 16px; padding: 12px 14px; margin-top: 10px; }
  `;
  document.head.appendChild(css);

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function initStudioState() {
    if (!st.agencyName) st.agencyName = "Neon Wave Ent.";
    if (!st.team) st.team = { vocal: null, dance: null, rap: null, visual: null };
    if (!st.cardStars) st.cardStars = {};
    if (typeof st.dust !== 'number') st.dust = 0;
    if (typeof st.packTickets !== 'number') st.packTickets = 0;

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

    st.cards.forEach(id => { if (!st.cardStars[id]) st.cardStars[id] = 1; });
    st.biasId = null; // Отключаем старую одиночную систему Биаса
    updateStudioBadge();
    save(false);
  }

  // 2. Создаём экран Студии и заметную кнопку в шапке
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
      dot.classList.toggle('show', (allDone && !st.daily.claimed) || st.packTickets > 0);
    }
  }

  // 3. Единый расчёт бонусов всей команды (4 роли + звёзды + синергия)
  window.getTeamBonuses = function () {
    let xp = 0, coins = 0, energyMin = 0, luck = 0, power = 0, count = 0;
    const albums = [];
    ROLES.forEach(r => {
      const cid = st.team[r.key];
      if (!cid || !st.cards.includes(cid)) return;
      const c = CARDS.find(x => x.id === cid);
      if (!c) return;
      count++;
      const stars = st.cardStars[cid] || 1;
      const mult = 1 + (stars - 1) * 0.25;
      const val = Math.round(c.bonusVal * mult);
      if (c.bonusType === 'xp') xp += val;
      if (c.bonusType === 'coins') coins += val;
      if (c.bonusType === 'energy') energyMin += val;
      if (c.bonusType === 'luck') luck += val;
      const baseP = c.r === 'SSR' ? 300 : (c.r === 'SR' ? 180 : 100);
      power += Math.round(baseP * mult);
      albums.push(c.album);
    });
    const synergy = albums.length === 4 && albums.every(a => a === albums[0]);
    if (synergy) { xp += 15; coins += 15; power = Math.round(power * 1.15); }
    return { xp, coins, energyMin, luck, power, count, synergy };
  };

  // Подключаем ускорение энергии от Танцора в команде
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

  // 4. Экран Студии
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
          Бонусы группы: <b style="color:var(--cyan)">+${b.xp}% XP</b> • <b style="color:#ff85cb">+${b.coins}% 🎤</b> • <b style="color:var(--gold)">-${b.energyMin}м ⚡</b>
        </div>
        <div class="studio-stats">
          <div class="st-box"><div class="st-val" style="color:var(--accent)">${b.power}</div><div class="st-lbl">Фандом</div></div>
          <div class="st-box"><div class="st-val" style="color:var(--cyan)">${st.cards.length}/${CARDS.length}</div><div class="st-lbl">Карты</div></div>
          <div class="st-box"><div class="st-val" style="color:var(--gold)">${st.dust}</div><div class="st-lbl">Зв. пыль</div></div>
        </div>
      </div>

      <h3 style="margin:0 0 8px;font-size:15px">Состав группы (${b.count}/4)</h3>
      <div class="team-grid" id="team-grid"></div>

      <div class="synergy-box ${b.synergy ? '' : 'off'}">
        <span>${b.synergy ? 'Синергия эры активна! (+15% XP, +15% 🎤)' : 'Поставь 4 карты одной Эры для бонуса Синергии'}</span>
        <b>${b.synergy ? 'ON' : `${b.count}/4`}</b>
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
        <div style="font-size:14px;font-weight:800;margin:4px 0 8px">Бесплатный Чиби-пак + 25 микрофонов</div>
        ${allDone && !d.claimed
          ? `<button class="btn gold full" id="claim-daily">Забрать награду!</button>`
          : (d.claimed
              ? `<div style="font-size:12px;color:var(--success);font-weight:700">✓ Награда получена! Новые контракты завтра.</div>`
              : `<div class="bar-bg"><div class="bar-fill" style="width:${Math.round((doneCnt / 3) * 100)}%"></div></div>`)
        }
      </div>
      ${st.packTickets > 0 ? `<button class="btn full" style="margin-top:12px" onclick="openPackModal(0)">Открыть бесплатный пак (Билетов: ${st.packTickets})</button>` : ''}
    `;

    document.getElementById('rename-agency').onclick = () => {
      const n = prompt('Придумай название своего агентства:', st.agencyName);
      if (n && n.trim()) { st.agencyName = n.trim().slice(0, 22); save(); updateStudioBadge(); renderStudio(); }
    };

    const claimBtn = document.getElementById('claim-daily');
    if (claimBtn) {
      claimBtn.onclick = () => {
        st.daily.claimed = true; st.packTickets++; st.coins += 25;
        save(); updateStudioBadge(); haptic('ok'); sfx('win'); fireConfetti(); renderStudio();
      };
    }

    const tgGrid = document.getElementById('team-grid');
    ROLES.forEach(r => {
      const cid = st.team[r.key];
      const c = cid && st.cards.includes(cid) ? CARDS.find(x => x.id === cid) : null;
      const stars = c ? (st.cardStars[cid] || 1) : 0;
      const el = document.createElement('div');
      el.className = 'team-slot' + (c ? ' filled' : '');
      el.innerHTML = c
        ? `<div class="slot-role">${r.title} • ${c.r}</div><div style="font-weight:800;font-size:13px">${c.name}</div><div class="slot-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div><div class="pc-bonus">${c.bonusText}</div>`
        : `<div class="slot-role">${r.title}</div><div style="font-size:22px;opacity:0.35;margin:6px 0">+</div><div class="l-meta">Выбрать (${r.desc})</div>`;
      el.onclick = () => openSlotPicker(r);
      tgGrid.appendChild(el);
    });
  };

  function openSlotPicker(role) {
    const owned = CARDS.filter(c => st.cards.includes(c.id) && c.roleKey === role.key);
    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    if (!owned.length) {
      modal.innerHTML = `<div class="card-box" style="max-width:300px;text-align:center"><h3>Роль: ${role.title}</h3><p style="color:var(--muted)">У тебя пока нет карт этой роли. Открывай Чиби-паки в Альбомах!</p><button class="btn full" onclick="document.getElementById('pack-modal').classList.remove('open')">Понятно</button></div>`;
      return;
    }
    let html = `<div class="card-box" style="width:100%;max-width:320px"><h3 style="margin-bottom:12px">Выбери: ${role.title}</h3>`;
    owned.forEach(c => {
      const stars = st.cardStars[c.id] || 1;
      html += `<div class="vocab-row" data-pick="${c.id}"><div class="vocab-tag">${c.tag}</div><div style="flex:1"><div style="font-weight:800;font-size:14px">${c.name} [${c.r}]</div><div style="font-size:11px;color:var(--gold)">${'★'.repeat(stars)} • ${c.bonusText}</div></div></div>`;
    });
    html += `<button class="btn ghost full" style="margin-top:8px" onclick="document.getElementById('pack-modal').classList.remove('open')">Закрыть</button></div>`;
    modal.innerHTML = html;
    modal.querySelectorAll('[data-pick]').forEach(row => {
      row.onclick = () => {
        const id = Number(row.getAttribute('data-pick'));
        st.team[role.key] = id; save(); haptic('ok'); sfx('ok');
        modal.classList.remove('open'); renderStudio();
      };
    });
  }

  // 5. Единая витрина Альбомов (вместо старого Биаса — сразу состав группы)
  window.renderBinder = function () {
    if (typeof CARDS === 'undefined') return;
    initStudioState();
    const b = getTeamBonuses();
    document.getElementById('bias-banner-wrap').innerHTML = `
      <div class="bias-banner">
        <div>
          <div style="font-size:11px;color:var(--cyan);font-weight:800">СОСТАВ ГРУППЫ: ${b.count}/4 • ФАНДОМ ${b.power}</div>
          <div style="font-size:12px;color:#e0d4f5;margin-top:2px">Нажми на открытую карту, чтобы поставить её в состав Студии</div>
        </div>
        <button class="btn cyan" style="padding:8px 12px;font-size:12px" onclick="switchTab('studio')">Студия</button>
      </div>`;

    const g = document.getElementById('binder-grid'); g.innerHTML = '';
    (curAlbum === 'all' ? CARDS : CARDS.filter(c => c.album === curAlbum)).forEach(c => {
      const has = st.cards.includes(c.id);
      const inTeam = st.team[c.roleKey] === c.id;
      const stars = st.cardStars[c.id] || 1;
      const rc = c.r === 'SSR' ? 'ssr' : (c.r === 'SR' ? 'sr' : '');
      const el = document.createElement('div');
      el.className = `photocard ${has ? rc : 'locked'} ${inTeam ? 'bias-active' : ''}`;
      el.innerHTML = `
        ${inTeam ? '<div class="pc-bias-tag">В СОСТАВЕ</div>' : ''}
        <div class="pc-rarity">${c.r}</div>
        ${has ? cardArtHtml(c) : '<div class="pc-art" style="background:#181326"><div class="pc-monogram" style="opacity:0.25">?</div></div>'}
        <div class="pc-name">${has ? c.name : 'Скрытая карта'}</div>
        ${has ? `<div class="slot-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>` : ''}
        <div class="pc-role">${has ? c.role : 'Пройди урок или открой пак'}</div>
        ${has ? `<div class="pc-bonus">${c.bonusText}</div>` : ''}
      `;
      if (has) {
        el.onclick = () => {
          st.team[c.roleKey] = c.id; save(); haptic('ok'); sfx('ok');
          if (c.quoteFile) playAudio(c.quoteFile, c.quoteKr);
          renderBinder();
        };
      }
      g.appendChild(el);
    });
  };

  // 6. Перехваты для контрактов (уроки, диктант, 3D-карточки)
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
      // Добавляем бонус команды за новый урок
      if (curL && !st.done.includes(curL.id)) {
        const b = getTeamBonuses();
        st.xp += Math.round(curL.xp * (b.xp / 100));
        st.coins += Math.round(curL.coins * (b.coins / 100));
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

  // 7. Прокачка карт (1★→5★) и бесплатные билеты в openPackModal
  window.openPackModal = function (price) {
    initStudioState();
    const useTicket = price === 0 && st.packTickets > 0;
    if (!useTicket && st.coins < price) return alert(`Нужно ${price} микрофонов!`);
    haptic('medium');
    if (useTicket) st.packTickets--;
    else st.coins -= price;
    save(); updateStudioBadge();

    const modal = document.getElementById('pack-modal');
    modal.classList.add('open');
    modal.innerHTML = `
      <div style="font-size:13px;color:var(--cyan);font-weight:800;letter-spacing:1px;margin-bottom:18px">НАЖМИ НА ПАК, ЧТОБЫ ОТКРЫТЬ</div>
      <div class="pack-foil" id="gacha-pack"><div class="pack-inner">
        <div style="font-size:12px;color:#ff85cb;font-weight:900;letter-spacing:2px">K-POP LINGUA</div>
        <div style="font-size:26px;font-weight:900;margin:14px 0">CHIBI PACK</div>
        <div style="font-size:11px;color:var(--muted)">R • SR • SSR</div>
      </div></div>`;

    document.getElementById('gacha-pack').onclick = () => {
      document.getElementById('gacha-pack').classList.add('shaking');
      haptic('heavy'); sfx('tap');
      setTimeout(() => {
        const luck = getTeamBonuses().luck / 100;
        const r = Math.random();
        const tier = r < (0.08 + luck * 0.4) ? 'SSR' : (r < (0.35 + luck) ? 'SR' : 'R');
        const pool = CARDS.filter(c => c.r === tier);
        const c = pool[Math.floor(Math.random() * pool.length)];

        let statusText = 'НОВАЯ КАРТА В АЛЬБОМ!';
        if (!st.cards.includes(c.id)) {
          st.cards.push(c.id); st.cardStars[c.id] = 1;
        } else {
          const curS = st.cardStars[c.id] || 1;
          if (curS < 5) {
            st.cardStars[c.id] = curS + 1;
            statusText = `ПРОКАЧКА КАРТЫ: ${'★'.repeat(curS + 1)}!`;
          } else {
            st.dust += 25;
            statusText = 'МАКС. ЗВЁЗД • +25 ЗВЁЗДНОЙ ПЫЛИ';
          }
        }
        save(); renderBinder();
        haptic('ok'); sfx('win');
        if (c.r !== 'R') fireConfetti();
        if (c.quoteFile) setTimeout(() => playAudio(c.quoteFile, c.quoteKr), 250);

        const rc = c.r === 'SSR' ? 'ssr' : (c.r === 'SR' ? 'sr' : '');
        const stars = st.cardStars[c.id] || 1;
        modal.innerHTML = `
          <div style="font-size:14px;font-weight:900;color:${c.r === 'SSR' ? 'var(--gold)' : 'var(--cyan)'};margin-bottom:14px">${statusText}</div>
          <div class="photocard ${rc} reveal-card">
            <div class="pc-rarity">${c.r}</div>
            ${cardArtHtml(c)}
            <div class="pc-name" style="font-size:16px">${c.name}</div>
            <div class="slot-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
            <div class="pc-role">${c.role}</div>
            <div class="pc-bonus" style="font-size:12px;margin-top:6px">${c.bonusText}</div>
          </div>
          <button class="btn full" style="max-width:240px;margin-top:18px" onclick="document.getElementById('pack-modal').classList.remove('open')">Забрать</button>`;
      }, 550);
    };
  };

  initStudioState();
})();
