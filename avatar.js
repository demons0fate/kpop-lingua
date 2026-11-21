/* ====== РЕДАКТОР ГЕРОЯ (DICEBEAR TOON HEAD + СТИЛЬ DUOLINGO) + ВКЛАДКА «МОЗАИКА» ====== */
(function () {
  const SKINS = ["f1c3a5", "c68e7a", "b98e6a", "a36b4f", "5c3829"];
  const HAIR_COLS = ["2c1b18", "ff2e93", "00e5ff", "d6b370", "b46eff", "a55728"];
  const CLOTHES_COLS = ["151613", "ec4899", "0b3286", "731ac3", "eab308", "e8e9e6"];

  const HAIRS = [
    { v: "undercut",  n: "Андеркат" },
    { v: "spiky",     n: "Ёжик" },
    { v: "sideComed", n: "Набок" },
    { v: "bun",       n: "Пучок" },
    { v: "none",      n: "Без волос" }
  ];

  const REAR_HAIRS = [
    { v: "none",         n: "Короткие" },
    { v: "neckHigh",     n: "До шеи" },
    { v: "shoulderHigh", n: "До плеч" },
    { v: "longStraight", n: "Длинные" },
    { v: "longWavy",     n: "Волнистые" }
  ];

  const EYES = [
    { v: "wide",   n: "Широкие" },
    { v: "happy",  n: "Радость" },
    { v: "wink",   n: "Подмиг" },
    { v: "bow",    n: "Мягкие" },
    { v: "humble", n: "Скромные" }
  ];

  const BROWS = [
    { v: "happy",   n: "Добрые" },
    { v: "neutral", n: "Обычные" },
    { v: "raised",  n: "Удивление" },
    { v: "angry",   n: "Дерзкие" },
    { v: "sad",     n: "Грустные" }
  ];

  const MOUTHS = [
    { v: "smile", n: "Улыбка" },
    { v: "laugh", n: "Смех" },
    { v: "agape", n: "Вау" },
    { v: "angry", n: "Хмурый" },
    { v: "sad",   n: "Грусть" }
  ];

  const BEARDS = [
    { v: "none",          n: "Нет" },
    { v: "chin",          n: "Бородка" },
    { v: "chinMoustache", n: "С усами" },
    { v: "fullBeard",     n: "Борода" },
    { v: "moustacheTwirl",n: "Усы" }
  ];

  const CLOTHES = [
    { v: "openJacket", n: "Куртка" },
    { v: "tShirt",     n: "Футболка" },
    { v: "turtleNeck", n: "Водолазка" },
    { v: "shirt",      n: "Рубашка" },
    { v: "dress",      n: "Платье" }
  ];

  const BGS = [
    "linear-gradient(135deg,#ff2e93,#7b2cbf)",
    "linear-gradient(135deg,#00e5ff,#3a0ca3)",
    "linear-gradient(135deg,#ffd700,#ff6b00)",
    "linear-gradient(135deg,#2563eb,#1e1b4b)",
    "linear-gradient(135deg,#1f2330,#0e0a1a)"
  ];

  const ACCS = [
    { id: "none",  name: "Без скина", locked: false },
    { id: "visor", name: "Кибер-визор", locked: true, req: "Мозаика #1" }
  ];

  const EDITOR_TABS = [
    { id: "base",  ico: "👤", label: "База" },
    { id: "hair",  ico: "💇", label: "Волосы" },
    { id: "face",  ico: "👀", label: "Лицо" },
    { id: "cloth", ico: "👕", label: "Одежда" },
    { id: "acc",   ico: "🕶️", label: "Скины" }
  ];

  const DEFAULT_AV = {
    v: 2,
    skin: "f1c3a5",
    hair: "undercut",
    rearHair: "none",
    hairCol: "ff2e93",
    eyes: "happy",
    brows: "happy",
    mouth: "smile",
    beard: "none",
    clothes: "openJacket",
    clothesCol: "151613",
    bg: 0,
    acc: "none"
  };

  let editorTab = 'base';
  let inMosaicTab = false;

  const css = document.createElement('style');
  css.textContent = `
    .av-svg-wrap { position: relative; width: 100%; height: 100%; border-radius: inherit; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .av-svg-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
    .av-visor-ov { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

    #screen-binder .mode-btn { font-size: 11px; padding: 8px 4px; }

    /* Редактор персонажа в стиле Duolingo */
    .duo-editor { position: fixed; inset: 0; background: #0e0a1a; z-index: 9700; display: none; flex-direction: column; }
    .duo-editor.open { display: flex; animation: fadeIn 0.2s ease; }
    .duo-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #130e24; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .duo-done { background: none; border: none; color: var(--cyan); font-size: 13px; font-weight: 900; letter-spacing: 0.6px; cursor: pointer; padding: 6px 4px; }
    .duo-stage { height: 215px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .duo-stage-av { width: 200px; height: 200px; }

    .duo-tabs { display: grid; grid-template-columns: repeat(5, 1fr); background: #151026; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
    .duo-tab { background: none; border: none; border-bottom: 3px solid transparent; padding: 10px 4px; font-size: 20px; cursor: pointer; opacity: 0.45; transition: 0.18s; }
    .duo-tab.active { opacity: 1; border-bottom-color: var(--cyan); background: rgba(0,229,255,0.06); }

    .duo-body { flex: 1; overflow-y: auto; padding: 14px 16px 32px; -webkit-overflow-scrolling: touch; }
    .duo-sec { font-size: 12px; font-weight: 800; color: #d8cce8; margin: 4px 0 10px; }

    .duo-swatches { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 18px; }
    .duo-sw { aspect-ratio: 1; border-radius: 14px; border: 2.5px solid rgba(255,255,255,0.12); padding: 4px; cursor: pointer; transition: 0.15s; background: #19132b; }
    .duo-sw.on { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,229,255,0.35); transform: scale(1.04); }
    .duo-sw-in { width: 100%; height: 100%; border-radius: 9px; }

    .duo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 18px; }
    .duo-card { background: #18122b; border: 2px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 6px; text-align: center; cursor: pointer; position: relative; transition: 0.15s; }
    .duo-card.on { border-color: var(--cyan); background: rgba(0,229,255,0.1); box-shadow: 0 0 14px rgba(0,229,255,0.22); }
    .duo-card.locked { opacity: 0.5; }
    .duo-card-prev { width: 76px; height: 76px; margin: 0 auto 4px; border-radius: 10px; overflow: hidden; }
    .duo-card-lbl { font-size: 10px; font-weight: 800; color: #e2d9f3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Вкладка Мозаика 3×3 */
    .mosaic-box { background: linear-gradient(145deg, #211638, #130d24); border: 1.5px solid rgba(0,229,255,0.32); border-radius: 20px; padding: 16px; margin-bottom: 14px; }
    .mosaic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; max-width: 240px; margin: 14px auto 16px; }
    .m-tile { aspect-ratio: 1; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1.5px dashed rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: rgba(255,255,255,0.25); transition: 0.25s; }
    .m-tile.open { border-style: solid; border-color: var(--cyan); background: linear-gradient(135deg, rgba(255,46,147,0.35), rgba(0,229,255,0.35)); color: #fff; box-shadow: inset 0 0 14px rgba(0,229,255,0.3); }
    .m-tile.craftable { cursor: pointer; border-color: var(--gold); animation: tilePulse 1.4s infinite alternate; }
    @keyframes tilePulse { from { box-shadow: 0 0 4px rgba(255,215,0,0.2); } to { box-shadow: 0 0 14px rgba(255,215,0,0.65); } }
  `;
  document.head.appendChild(css);

  function initAvState() {
    if (!st.avatar || st.avatar.v !== 2) {
      const prevAcc = (st.avatar && st.avatar.acc) ? st.avatar.acc : "none";
      st.avatar = { ...DEFAULT_AV, acc: prevAcc };
    }
    if (!st.mosaic) st.mosaic = { pieces: [], dust: 0, claimed: false };
    if (!st.unlockedAcc) st.unlockedAcc = [];
  }

  /* Сборка URL для DiceBear Toon Head */
  function buildToonUrl(a) {
    const p = new URLSearchParams();
    p.set("seed", "kpop");
    p.set("skinColor", a.skin || DEFAULT_AV.skin);
    p.set("hairColor", a.hairCol || DEFAULT_AV.hairCol);
    p.set("clothesColor", a.clothesCol || DEFAULT_AV.clothesCol);
    p.set("eyesVariant", a.eyes || DEFAULT_AV.eyes);
    p.set("eyebrowsVariant", a.brows || DEFAULT_AV.brows);
    p.set("mouthVariant", a.mouth || DEFAULT_AV.mouth);
    p.set("clothesVariant", a.clothes || DEFAULT_AV.clothes);

    if (a.hair === "none") {
      p.set("hairProbability", "0");
    } else {
      p.set("hairProbability", "100");
      p.set("hairVariant", a.hair || DEFAULT_AV.hair);
    }

    if (!a.rearHair || a.rearHair === "none") {
      p.set("rearHairProbability", "0");
    } else {
      p.set("rearHairProbability", "100");
      p.set("rearHairVariant", a.rearHair);
    }

    if (!a.beard || a.beard === "none") {
      p.set("beardProbability", "0");
    } else {
      p.set("beardProbability", "100");
      p.set("beardVariant", a.beard);
    }

    return `https://api.dicebear.com/10.x/toon-head/svg?${p.toString()}`;
  }

  /* Рендер персонажа Toon Head + слой скина */
  window.renderAvatarSvg = function (cfg, transparentBg) {
    const a = (cfg && cfg.v === 2) ? cfg : (st.avatar && st.avatar.v === 2 ? st.avatar : DEFAULT_AV);
    const bgStyle = transparentBg ? 'transparent' : (BGS[a.bg] || BGS[0]);
    const url = buildToonUrl(a);
    const visorSvg = a.acc === 'visor'
      ? `<svg class="av-visor-ov" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
           <rect x="27" y="42" width="46" height="14" rx="7" fill="rgba(0,229,255,0.62)" stroke="#00e5ff" stroke-width="2.5"/>
           <line x1="33" y1="46" x2="48" y2="46" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
         </svg>`
      : '';

    return `<div class="av-svg-wrap" style="background:${bgStyle}">
      <img src="${url}" alt="avatar" loading="lazy"/>
      ${visorSvg}
    </div>`;
  };

  /* Редактор персонажа */
  const editorOv = document.createElement('div');
  editorOv.className = 'duo-editor';
  editorOv.id = 'av-editor-overlay';
  document.body.appendChild(editorOv);

  function renderCards(list, key, a) {
    return `<div class="duo-grid">${list.map(it => `
      <div class="duo-card ${a[key] === it.v ? 'on' : ''}" data-set="${key}:${it.v}">
        <div class="duo-card-prev">${renderAvatarSvg({ ...a, [key]: it.v }, true)}</div>
        <div class="duo-card-lbl">${it.n}</div>
      </div>`).join('')}</div>`;
  }

  window.openAvatarCreator = function () {
    initAvState();
    const a = st.avatar;
    let bodyHtml = '';

    if (editorTab === 'base') {
      bodyHtml = `
        <div class="duo-sec">Тон кожи</div>
        <div class="duo-swatches">${SKINS.map(c => `<div class="duo-sw ${a.skin === c ? 'on' : ''}" data-set="skin:${c}"><div class="duo-sw-in" style="background:#${c}"></div></div>`).join('')}</div>
        <div class="duo-sec">Фон карточки</div>
        <div class="duo-swatches">${BGS.map((c, i) => `<div class="duo-sw ${a.bg === i ? 'on' : ''}" data-set="bg:${i}"><div class="duo-sw-in" style="background:${c}"></div></div>`).join('')}</div>`;
    } else if (editorTab === 'hair') {
      bodyHtml = `
        <div class="duo-sec">Цвет волос</div>
        <div class="duo-swatches" style="grid-template-columns:repeat(6,1fr)">${HAIR_COLS.map(c => `<div class="duo-sw ${a.hairCol === c ? 'on' : ''}" data-set="hairCol:${c}"><div class="duo-sw-in" style="background:#${c}"></div></div>`).join('')}</div>
        <div class="duo-sec">Причёска (верх)</div>
        ${renderCards(HAIRS, 'hair', a)}
        <div class="duo-sec">Длина волос (сзади)</div>
        ${renderCards(REAR_HAIRS, 'rearHair', a)}`;
    } else if (editorTab === 'face') {
      bodyHtml = `
        <div class="duo-sec">Глаза</div>
        ${renderCards(EYES, 'eyes', a)}
        <div class="duo-sec">Брови</div>
        ${renderCards(BROWS, 'brows', a)}
        <div class="duo-sec">Эмоция</div>
        ${renderCards(MOUTHS, 'mouth', a)}
        <div class="duo-sec">Борода / Усы</div>
        ${renderCards(BEARDS, 'beard', a)}`;
    } else if (editorTab === 'cloth') {
      bodyHtml = `
        <div class="duo-sec">Цвет одежды</div>
        <div class="duo-swatches" style="grid-template-columns:repeat(6,1fr)">${CLOTHES_COLS.map(c => `<div class="duo-sw ${a.clothesCol === c ? 'on' : ''}" data-set="clothesCol:${c}"><div class="duo-sw-in" style="background:#${c}"></div></div>`).join('')}</div>
        <div class="duo-sec">Стиль одежды</div>
        ${renderCards(CLOTHES, 'clothes', a)}`;
    } else if (editorTab === 'acc') {
      bodyHtml = `
        <div class="duo-sec">Скины (открываются в Мозаике)</div>
        <div class="duo-grid" style="grid-template-columns:repeat(2,1fr)">${ACCS.map(ac => {
          const isLocked = ac.locked && !st.unlockedAcc.includes(ac.id);
          return `<div class="duo-card ${a.acc === ac.id ? 'on' : ''} ${isLocked ? 'locked' : ''}" data-acc="${ac.id}">
            <div class="duo-card-prev" style="width:90px;height:90px">${renderAvatarSvg({ ...a, acc: ac.id }, true)}</div>
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
        st.avatar[k] = k === 'bg' ? Number(v) : v;
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

  /* 4-я вкладка «Мозаика» в Студии */
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

    const avBox = document.querySelector('#screen-binder .av-circle');
    if (avBox) { avBox.style.padding = '0'; avBox.innerHTML = renderAvatarSvg(); }

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

  /* Подмена аватара в Профиле + скрытие старых эмодзи */
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

  /* Шанс дропа кусочка мозаики после завершения урока */
  const origFinishAv = window.finishLesson;
  window.finishLesson = function () {
    const passed = !(curL && curL.isExam && mistakes > 4);
    origFinishAv();
    if (passed && Math.random() < 0.45) setTimeout(dropMosaicPiece, 700);
  };

  initAvState();
  renderBinder();
})();
