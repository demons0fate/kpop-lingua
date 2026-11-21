/* ====== РЕДАКТОР ГЕРОЯ (СТИЛЬ DUOLINGO) + ОТДЕЛЬНАЯ ВКЛАДКА «МОЗАИКА» ====== */
(function () {
  const SKINS = ["#ffdfc4", "#f0c8a0", "#d9a077", "#a56c43", "#6b3e26"];
  const HAIRS = ["Короткая", "Каре", "Ёжик", "Хвостики"];
  const HAIR_COLS = ["#1a1625", "#ff2e93", "#00e5ff", "#ffd700", "#b46eff", "#ff6b6b"];
  const EYES = ["Обычные", "Улыбка", "Звёзды", "Дерзкий"];
  const MOUTHS = ["Улыбка", "Смех", "Спокойный", "Кот :3"];
  const SHIRTS = ["#2a2244", "#ff2e93", "#00b4d8", "#ffd700", "#111118"];
  const BGS = [
    "linear-gradient(135deg,#ff2e93,#7b2cbf)",
    "linear-gradient(135deg,#00e5ff,#3a0ca3)",
    "linear-gradient(135deg,#ffd700,#ff6b00)",
    "linear-gradient(135deg,#2563eb,#1e1b4b)",
    "linear-gradient(135deg,#1f2330,#0e0a1a)"
  ];

  const ACCS = [
    { id: "none", name: "Без скина", locked: false },
    { id: "visor", name: "Кибер-визор", locked: true, req: "Мозаика #1" }
  ];

  const EDITOR_TABS = [
    { id: "base",  ico: "👤", label: "База" },
    { id: "hair",  ico: "💇", label: "Волосы" },
    { id: "face",  ico: "👀", label: "Лицо" },
    { id: "cloth", ico: "👕", label: "Одежда" },
    { id: "acc",   ico: "🕶️", label: "Скины" }
  ];

  let editorTab = 'base';
  let inMosaicTab = false;

  const css = document.createElement('style');
  css.textContent = `
    .av-svg-wrap { width: 100%; height: 100%; border-radius: inherit; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .av-svg-wrap svg { width: 100%; height: 100%; display: block; }

    /* Компактные 4 вкладки в Студии */
    #screen-binder .mode-btn { font-size: 11px; padding: 8px 4px; }

    /* Редактор персонажа в стиле Duolingo */
    .duo-editor { position: fixed; inset: 0; background: #0e0a1a; z-index: 9700; display: none; flex-direction: column; }
    .duo-editor.open { display: flex; animation: fadeIn 0.2s ease; }
    .duo-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #130e24; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .duo-done { background: none; border: none; color: var(--cyan); font-size: 13px; font-weight: 900; letter-spacing: 0.6px; cursor: pointer; padding: 6px 4px; }
    .duo-stage { height: 215px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .duo-stage-av { width: 195px; height: 195px; }

    .duo-tabs { display: grid; grid-template-columns: repeat(5, 1fr); background: #151026; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
    .duo-tab { background: none; border: none; border-bottom: 3px solid transparent; padding: 10px 4px; font-size: 20px; cursor: pointer; opacity: 0.45; transition: 0.18s; }
    .duo-tab.active { opacity: 1; border-bottom-color: var(--cyan); background: rgba(0,229,255,0.06); }

    .duo-body { flex: 1; overflow-y: auto; padding: 14px 16px 32px; -webkit-overflow-scrolling: touch; }
    .duo-sec { font-size: 12px; font-weight: 800; color: #d8cce8; margin: 4px 0 10px; }

    /* Скруглённые квадраты цветов (как Skin tone) */
    .duo-swatches { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 18px; }
    .duo-sw { aspect-ratio: 1; border-radius: 14px; border: 2.5px solid rgba(255,255,255,0.12); padding: 4px; cursor: pointer; transition: 0.15s; background: #19132b; }
    .duo-sw.on { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,229,255,0.35); transform: scale(1.04); }
    .duo-sw-in { width: 100%; height: 100%; border-radius: 9px; }

    /* Визуальные превью-карточки деталей */
    .duo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 18px; }
    .duo-card { background: #18122b; border: 2px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 8px; text-align: center; cursor: pointer; position: relative; transition: 0.15s; }
    .duo-card.on { border-color: var(--cyan); background: rgba(0,229,255,0.1); box-shadow: 0 0 14px rgba(0,229,255,0.22); }
    .duo-card.locked { opacity: 0.5; }
    .duo-card-prev { width: 86px; height: 86px; margin: 0 auto 4px; border-radius: 12px; overflow: hidden; }
    .duo-card-lbl { font-size: 11px; font-weight: 800; color: #e2d9f3; }

    /* Отдельная вкладка Мозаика 3×3 */
    .mosaic-box { background: linear-gradient(145deg, #211638, #130d24); border: 1.5px solid rgba(0,229,255,0.32); border-radius: 20px; padding: 16px; margin-bottom: 14px; }
    .mosaic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; max-width: 240px; margin: 14px auto 16px; }
    .m-tile { aspect-ratio: 1; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1.5px dashed rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: rgba(255,255,255,0.25); transition: 0.25s; }
    .m-tile.open { border-style: solid; border-color: var(--cyan); background: linear-gradient(135deg, rgba(255,46,147,0.35), rgba(0,229,255,0.35)); color: #fff; box-shadow: inset 0 0 14px rgba(0,229,255,0.3); }
    .m-tile.craftable { cursor: pointer; border-color: var(--gold); animation: tilePulse 1.4s infinite alternate; }
    @keyframes tilePulse { from { box-shadow: 0 0 4px rgba(255,215,0,0.2); } to { box-shadow: 0 0 14px rgba(255,215,0,0.65); } }
  `;
  document.head.appendChild(css);

  function initAvState() {
    if (!st.avatar) st.avatar = { skin: 0, hair: 0, hairCol: 1, eyes: 0, mouth: 0, shirt: 0, bg: 0, acc: 'none' };
    if (!st.mosaic) st.mosaic = { pieces: [], dust: 0, claimed: false };
    if (!st.unlockedAcc) st.unlockedAcc = [];
  }

  /* Рендер векторного персонажа (SVG) */
  window.renderAvatarSvg = function (cfg, transparentBg) {
    const a = cfg || st.avatar || { skin: 0, hair: 0, hairCol: 1, eyes: 0, mouth: 0, shirt: 0, bg: 0, acc: 'none' };
    const skin = SKINS[a.skin] || SKINS[0];
    const hc = HAIR_COLS[a.hairCol] || HAIR_COLS[0];
    const sh = SHIRTS[a.shirt] || SHIRTS[0];

    let hairBack = '';
    if (a.hair === 1) hairBack = `<rect x="22" y="28" width="56" height="44" rx="18" fill="${hc}"/>`;
    if (a.hair === 3) hairBack = `<circle cx="18" cy="48" r="13" fill="${hc}"/><circle cx="82" cy="48" r="13" fill="${hc}"/>`;

    let hairFront = `<path d="M26 42 Q30 16 50 16 Q70 16 74 42 Q64 28 50 30 Q36 28 26 42 Z" fill="${hc}"/>`;
    if (a.hair === 2) hairFront = `<path d="M26 42 L34 14 L44 26 L52 10 L60 26 L70 16 L74 42 Q50 28 26 42 Z" fill="${hc}"/>`;

    let eyesSvg = `<circle cx="40" cy="48" r="3.8" fill="#161224"/><circle cx="60" cy="48" r="3.8" fill="#161224"/><circle cx="41.2" cy="46.8" r="1.3" fill="#fff"/><circle cx="61.2" cy="46.8" r="1.3" fill="#fff"/>`;
    if (a.eyes === 1) eyesSvg = `<path d="M35 49 Q40 43 45 49" stroke="#161224" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M55 49 Q60 43 65 49" stroke="#161224" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (a.eyes === 2) eyesSvg = `<text x="34" y="53" font-size="12" fill="#ff2e93">★</text><text x="54" y="53" font-size="12" fill="#00e5ff">★</text>`;
    if (a.eyes === 3) eyesSvg = `<rect x="35" y="46" width="10" height="4" rx="2" fill="#161224"/><rect x="55" y="46" width="10" height="4" rx="2" fill="#161224"/>`;

    let mouthSvg = `<path d="M44 60 Q50 66 56 60" stroke="#161224" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    if (a.mouth === 1) mouthSvg = `<path d="M43 59 Q50 69 57 59 Z" fill="#ff4757" stroke="#161224" stroke-width="2"/>`;
    if (a.mouth === 2) mouthSvg = `<line x1="45" y1="62" x2="55" y2="62" stroke="#161224" stroke-width="2.8" stroke-linecap="round"/>`;
    if (a.mouth === 3) mouthSvg = `<path d="M43 61 Q46.5 65 50 61 Q53.5 65 57 61" stroke="#161224" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

    let accSvg = '';
    if (a.acc === 'visor') {
      accSvg = `<rect x="28" y="41" width="44" height="14" rx="7" fill="rgba(0,229,255,0.68)" stroke="#00e5ff" stroke-width="2.5"/><line x1="33" y1="45" x2="46" y2="45" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`;
    }

    const bgStyle = transparentBg ? 'transparent' : (BGS[a.bg] || BGS[0]);
    return `<div class="av-svg-wrap" style="background:${bgStyle}">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${hairBack}
        <path d="M22 100 C24 78 36 74 50 74 C64 74 76 78 78 100 Z" fill="${sh}"/>
        <rect x="44" y="66" width="12" height="12" rx="4" fill="${skin}"/>
        <circle cx="50" cy="48" r="23" fill="${skin}"/>
        <circle cx="34" cy="54" r="3.5" fill="#ff7ac6" opacity="0.45"/>
        <circle cx="66" cy="54" r="3.5" fill="#ff7ac6" opacity="0.45"/>
        ${eyesSvg}
        ${mouthSvg}
        ${hairFront}
        ${accSvg}
      </svg>
    </div>`;
  };

  /* Редактор персонажа в стиле Duolingo */
  const editorOv = document.createElement('div');
  editorOv.className = 'duo-editor';
  editorOv.id = 'av-editor-overlay';
  document.body.appendChild(editorOv);

  window.openAvatarCreator = function () {
    initAvState();
    const a = st.avatar;
    let bodyHtml = '';

    if (editorTab === 'base') {
      bodyHtml = `
        <div class="duo-sec">Тон кожи</div>
        <div class="duo-swatches">${SKINS.map((c, i) => `<div class="duo-sw ${a.skin === i ? 'on' : ''}" data-set="skin:${i}"><div class="duo-sw-in" style="background:${c}"></div></div>`).join('')}</div>
        <div class="duo-sec">Фон карточки</div>
        <div class="duo-swatches">${BGS.map((c, i) => `<div class="duo-sw ${a.bg === i ? 'on' : ''}" data-set="bg:${i}"><div class="duo-sw-in" style="background:${c}"></div></div>`).join('')}</div>`;
    } else if (editorTab === 'hair') {
      bodyHtml = `
        <div class="duo-sec">Цвет волос</div>
        <div class="duo-swatches" style="grid-template-columns:repeat(6,1fr)">${HAIR_COLS.map((c, i) => `<div class="duo-sw ${a.hairCol === i ? 'on' : ''}" data-set="hairCol:${i}"><div class="duo-sw-in" style="background:${c}"></div></div>`).join('')}</div>
        <div class="duo-sec">Причёска</div>
        <div class="duo-grid">${HAIRS.map((n, i) => `<div class="duo-card ${a.hair === i ? 'on' : ''}" data-set="hair:${i}"><div class="duo-card-prev">${renderAvatarSvg({ ...a, hair: i }, true)}</div><div class="duo-card-lbl">${n}</div></div>`).join('')}</div>`;
    } else if (editorTab === 'face') {
      bodyHtml = `
        <div class="duo-sec">Глаза</div>
        <div class="duo-grid">${EYES.map((n, i) => `<div class="duo-card ${a.eyes === i ? 'on' : ''}" data-set="eyes:${i}"><div class="duo-card-prev">${renderAvatarSvg({ ...a, eyes: i }, true)}</div><div class="duo-card-lbl">${n}</div></div>`).join('')}</div>
        <div class="duo-sec">Мордашка</div>
        <div class="duo-grid">${MOUTHS.map((n, i) => `<div class="duo-card ${a.mouth === i ? 'on' : ''}" data-set="mouth:${i}"><div class="duo-card-prev">${renderAvatarSvg({ ...a, mouth: i }, true)}</div><div class="duo-card-lbl">${n}</div></div>`).join('')}</div>`;
    } else if (editorTab === 'cloth') {
      bodyHtml = `
        <div class="duo-sec">Цвет одежды</div>
        <div class="duo-swatches">${SHIRTS.map((c, i) => `<div class="duo-sw ${a.shirt === i ? 'on' : ''}" data-set="shirt:${i}"><div class="duo-sw-in" style="background:${c}"></div></div>`).join('')}</div>`;
    } else if (editorTab === 'acc') {
      bodyHtml = `
        <div class="duo-sec">Скины (открываются в Мозаике)</div>
        <div class="duo-grid">${ACCS.map(ac => {
          const isLocked = ac.locked && !st.unlockedAcc.includes(ac.id);
          return `<div class="duo-card ${a.acc === ac.id ? 'on' : ''} ${isLocked ? 'locked' : ''}" data-acc="${ac.id}">
            <div class="duo-card-prev">${renderAvatarSvg({ ...a, acc: ac.id }, true)}</div>
            <div class="duo-card-lbl">${isLocked ? '🔒 ' : ''}${ac.name}</div>
          </div>`;
        }).join('')}</div>`;
    }

    editorOv.innerHTML = `
      <div class="duo-head">
        <button class="close-btn" style="width:30px;height:30px;font-size:14px" id="duo-close">✕</button>
        <div style="font-size:15px;font-weight:900">Редактор героя</div>
        <button class="duo-done" id="duo-done">ГОТОВО</button>
      </div>
      <div class="duo-stage" style="background:${BGS[a.bg] || BGS[0]}">
        <div class="duo-stage-av">${renderAvatarSvg(a, true)}</div>
      </div>
      <div class="duo-tabs">
        ${EDITOR_TABS.map(t => `<button class="duo-tab ${editorTab === t.id ? 'active' : ''}" data-etab="${t.id}" title="${t.label}">${t.ico}</button>`).join('')}
      </div>
      <div class="duo-body">${bodyHtml}</div>`;

      const closeEditor = () => {
      editorOv.classList.remove('open');
      save();
      renderBinder();
      const profAv = document.querySelector('#profile-overlay .av-circle');
      if (profAv) { profAv.style.padding = '0'; profAv.innerHTML = renderAvatarSvg(); }
    };
    editorOv.querySelector('#duo-close').onclick = closeEditor;
    editorOv.querySelector('#duo-done').onclick = () => { haptic('ok'); closeEditor(); };

    editorOv.querySelectorAll('[data-etab]').forEach(btn => {
      btn.onclick = () => { editorTab = btn.getAttribute('data-etab'); haptic('light'); openAvatarCreator(); };
    });
    editorOv.querySelectorAll('[data-set]').forEach(el => {
      el.onclick = () => {
        const [k, v] = el.getAttribute('data-set').split(':');
        st.avatar[k] = Number(v);
        save(false); haptic('light'); openAvatarCreator();
      };
    });
    editorOv.querySelectorAll('[data-acc]').forEach(el => {
      el.onclick = () => {
        const id = el.getAttribute('data-acc');
        const ac = ACCS.find(x => x.id === id);
        if (ac.locked && !st.unlockedAcc.includes(id)) return alert(`Открой во вкладке «Мозаика»: собери ${ac.req}!`);
        st.avatar.acc = id;
        save(false); haptic('ok'); openAvatarCreator();
      };
    });
    editorOv.classList.add('open');
  };

  /* Дроп кусочка мозаики */
  window.dropMosaicPiece = function () {
    initAvState();
    const m = st.mosaic;
    if (m.pieces.length >= 9) return;
    const idx = Math.floor(Math.random() * 9);
    if (!m.pieces.includes(idx)) {
      m.pieces.push(idx);
      save(); haptic('ok'); alert(`🧩 Новый фрагмент мозаики #${idx + 1}! (${m.pieces.length}/9)`);
    } else {
      m.dust++;
      save(); haptic('light'); alert(`✨ Дубль фрагмента! Получена блёстка (${m.dust}/3 для крафта)`);
    }
    renderBinder();
  };

  /* Перехватываем переключение подвкладок Студии для добавления 4-й вкладки «Мозаика» */
  const origSetStudioSubTab = window.setStudioSubTab;
  window.setStudioSubTab = function (t) {
    inMosaicTab = false;
    origSetStudioSubTab(t);
  };

  window.openMosaicTab = function () {
    haptic('light');
    inMosaicTab = true;
    renderBinder();
  };

  const origRenderBinder = window.renderBinder;
  window.renderBinder = function () {
    initAvState();
    origRenderBinder();

    // Подменяем аватар в шапке Студии
    const avBox = document.querySelector('#screen-binder .av-circle');
    if (avBox) { avBox.style.padding = '0'; avBox.innerHTML = renderAvatarSvg(); }

    // Добавляем 4-ю вкладку «Мозаика» в панель переключения
    const modeSwitch = document.querySelector('#screen-binder .mode-switch');
    if (modeSwitch) {
      const m = st.mosaic;
      const notify = (m.dust >= 3 && m.pieces.length < 9) || (m.pieces.length >= 9 && !m.claimed);
      const mBtn = document.createElement('button');
      mBtn.className = 'mode-btn' + (inMosaicTab ? ' active' : '');
      mBtn.innerHTML = `Мозаика${notify ? '<span class="tab-dot"></span>' : ''}`;
      mBtn.onclick = openMosaicTab;
      if (inMosaicTab) modeSwitch.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      modeSwitch.appendChild(mBtn);
    }

    // Если активна вкладка «Мозаика» — рисуем её контент
    if (inMosaicTab) {
      const sub = document.getElementById('studio-sub-body');
      if (!sub) return;
      const m = st.mosaic;
      const canCraft = m.dust >= 3 && m.pieces.length < 9;
      const isDone = m.pieces.length >= 9;
      const icons = ["🎵", "⚡", "💿", "🎤", "🕶️", "🌟", "🔥", "💜", "👑"];

      sub.innerHTML = `
        <div class="mosaic-box">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:15px;font-weight:900">Мозаика #1: Кибер-визор</div>
              <div style="font-size:11px;color:var(--muted)">Фрагменты падают за уроки • Награда: скин героя</div>
            </div>
            <span style="font-size:13px;font-weight:900;color:var(--cyan)">${m.pieces.length}/9</span>
          </div>
          <div class="mosaic-grid">
            ${Array.from({ length: 9 }).map((_, i) => {
              const open = m.pieces.includes(i);
              return `<div class="m-tile ${open ? 'open' : (canCraft ? 'craftable' : '')}" data-tile="${i}">${open ? icons[i] : (canCraft ? '✨' : '?')}</div>`;
            }).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div style="font-size:12px;color:var(--gold);font-weight:800">Блёстки: ${m.dust}/3 ${canCraft ? '(жми на ?)' : ''}</div>
            ${isDone && !m.claimed
              ? `<button class="btn gold" style="padding:7px 14px;font-size:12px" id="claim-mosaic">Забрать Визор!</button>`
              : (m.claimed
                  ? `<button class="btn cyan" style="padding:7px 14px;font-size:12px" onclick="openAvatarCreator()">Примерить</button>`
                  : `<button class="btn ghost" style="padding:6px 12px;font-size:11px" onclick="dropMosaicPiece()">+ Кусок (тест)</button>`)}
          </div>
        </div>`;

      sub.querySelectorAll('.m-tile.craftable').forEach(t => {
        t.onclick = () => {
          const i = Number(t.getAttribute('data-tile'));
          if (m.dust >= 3 && !m.pieces.includes(i)) {
            m.dust -= 3; m.pieces.push(i);
            save(); haptic('ok'); sfx('win'); renderBinder();
          }
        };
      });
      const cm = sub.querySelector('#claim-mosaic');
      if (cm) cm.onclick = () => {
        m.claimed = true;
        if (!st.unlockedAcc.includes('visor')) st.unlockedAcc.push('visor');
        st.avatar.acc = 'visor';
        save(); haptic('ok'); sfx('win'); fireConfetti();
        alert('🕶️ Кибер-визор открыт и надет на персонажа!');
        renderBinder();
      };
    }
  };

  // Подменяем аватар в Профиле + кнопка редактора
  const origOpenProfile = window.openProfileModal;
  window.openProfileModal = function () {
    initAvState();
    origOpenProfile();
    const profAv = document.querySelector('#profile-overlay .av-circle');
    if (profAv) {
      profAv.style.padding = '0';
      profAv.innerHTML = renderAvatarSvg();
      const btn = document.createElement('button');
      btn.className = 'btn cyan full';
      btn.style.marginBottom = '10px';
      btn.textContent = '🎨 Редактор героя';
      btn.onclick = openAvatarCreator;
      profAv.parentElement.insertBefore(btn, profAv.nextSibling);
      const oldPicks = document.querySelector('#profile-overlay .av-pick-row');
      if (oldPicks) oldPicks.style.display = 'none';
    }
  };

  // Шанс дропа кусочка мозаики после завершения урока
  const origFinishAv = window.finishLesson;
  window.finishLesson = function () {
    const passed = !(curL && curL.isExam && mistakes > 4);
    origFinishAv();
    if (passed && Math.random() < 0.45) setTimeout(dropMosaicPiece, 700);
  };

  initAvState();
  renderBinder();
})();
