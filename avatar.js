/* ====== РЕДАКТОР ГЕРОЯ (AVATAAARS + СТИЛЬ DUOLINGO) + МОЗАИКА + КАРТОЧКИ ====== */
import { createAvatar } from 'https://cdn.jsdelivr.net/npm/@dicebear/core@9/+esm';
import * as avataaars from 'https://cdn.jsdelivr.net/npm/@dicebear/avataaars@9/+esm';

(function () {
  const OPTIONS = {
    top: {
      label: 'Волосы',
      type: 'part',
      values: [
        'shortFlat', 'shortRound', 'shortWaved', 'shortCurly', 'shaggy',
        'shaggyMullet', 'bob', 'bun', 'curly', 'curvy',
        'longButNotTooLong', 'miaWallace', 'straight01', 'straight02', 'straightAndStrand'
      ]
    },
    hairColor: {
      label: 'Цвет волос',
      type: 'color',
      values: ['2c1b18', '4a312c', '724133', 'a55728', 'b58143', 'd6b370', 'c93305', 'f59797']
    },
    skinColor: {
      label: 'Кожа',
      type: 'color',
      values: ['ffdbb4', 'edb98a', 'd08b5b', '614335']
    },
    eyes: {
      label: 'Глаза',
      type: 'part',
      values: ['default', 'happy', 'wink', 'side', 'squint', 'hearts', 'closed']
    },
    eyebrows: {
      label: 'Брови',
      type: 'part',
      values: ['default', 'defaultNatural', 'raisedExcited', 'raisedExcitedNatural', 'flatNatural', 'sadConcerned', 'angryNatural', 'upDown']
    },
    mouth: {
      label: 'Рот',
      type: 'part',
      values: ['smile', 'default', 'twinkle', 'tongue', 'serious', 'concerned', 'disbelief', 'eating', 'grimace', 'sad']
    },
    clothing: {
      label: 'Одежда',
      type: 'part',
      values: ['hoodie', 'blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck']
    },
    clothesColor: {
      label: 'Цвет одежды',
      type: 'color',
      values: ['262e33', '3c4f5c', '5199e4', '65c9ff', '929598', 'a7ffc4', 'b1e2ff', 'e6e6e6', 'ff488e', 'ff5c5c', 'ffafb9', 'ffffb1']
    },
    accessories: {
      label: 'Очки',
      type: 'part',
      optional: true,
      values: ['round', 'prescription01', 'prescription02', 'sunglasses', 'wayfarers', 'kurt']
    },
    backgroundColor: {
      label: 'Фон',
      type: 'color',
      values: ['3b82f6', '8b5cf6', 'ec4899', '06b6d4', '10b981', 'f59e0b', 'b6e3f4', 'c0aede', 'ffd5dc', '2b2d42']
    },
    acc: {
      label: 'Скины',
      type: 'skin'
    }
  };

  const SKINS_LIST = [
    { id: 'none',  name: 'Без скина',   locked: false },
    { id: 'visor', name: 'Кибер-визор', locked: true, req: 'Мозаика #1' }
  ];

  const DEFAULT_AV = {
    v: 3,
    top: 'shortFlat',
    hairColor: '2c1b18',
    skinColor: 'ffdbb4',
    eyes: 'default',
    eyebrows: 'defaultNatural',
    mouth: 'smile',
    clothing: 'hoodie',
    clothesColor: '5199e4',
    accessories: null,
    backgroundColor: '3b82f6',
    acc: 'none'
  };

  let activeTab = 'top';
  let inMosaicTab = false;

  const css = document.createElement('style');
  css.textContent = `
    .av-svg-wrap { position: relative; width: 100%; height: 100%; border-radius: inherit; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
    .av-svg-wrap > svg:first-child { width: 100%; height: 100%; display: block; pointer-events: none; }
    .av-visor-ov { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

    #screen-binder .mode-btn { font-size: 11px; padding: 8px 4px; }

    /* Крупный баннер героя в Профиле (стиль Duolingo) */
    .prof-hero-banner {
      position: relative;
      width: 100%;
      height: 196px;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 14px;
      border: 2px solid rgba(255,255,255,0.14);
      box-shadow: 0 10px 26px rgba(0,0,0,0.35);
      cursor: pointer;
    }
    .prof-hero-av {
      height: 94%;
      aspect-ratio: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .prof-hero-edit {
      position: absolute;
      right: 10px;
      bottom: 10px;
      background: rgba(19, 19, 31, 0.72);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.22);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      padding: 7px 12px;
      border-radius: 12px;
      cursor: pointer;
    }
    .prof-hero-edit:active { transform: scale(0.95); }

    /* Редактор персонажа в стиле Duolingo */
    .duo-editor { position: fixed; inset: 0; background: #13131f; z-index: 9700; display: none; flex-direction: column; }
    .duo-editor.open { display: flex; animation: fadeIn 0.2s ease; }
    .duo-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #13131f; border-bottom: 1px solid #24243a; flex-shrink: 0; }
    .duo-done { background: none; border: none; color: #38bdf8; font-size: 15px; font-weight: 800; letter-spacing: 0.4px; cursor: pointer; padding: 4px 6px; }
    .duo-stage { position: relative; width: 100%; height: 39dvh; min-height: 220px; max-height: 320px; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; flex-shrink: 0; transition: background-color 0.25s ease; }
    .duo-stage-av { height: 94%; aspect-ratio: 1; display: flex; align-items: flex-end; justify-content: center; }
    .duo-rand-fab { position: absolute; right: 14px; bottom: 14px; width: 44px; height: 44px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.2); background: rgba(19,19,31,0.55); backdrop-filter: blur(8px); color: #fff; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .duo-rand-fab:active { transform: scale(0.93); }

    .duo-tabs { display: flex; overflow-x: auto; background: #171726; border-bottom: 1px solid #26263d; padding: 0 8px; scrollbar-width: none; flex-shrink: 0; }
    .duo-tabs::-webkit-scrollbar { display: none; }
    .duo-tab { position: relative; padding: 13px 14px; background: none; border: none; color: #8888a8; font-size: 14px; font-weight: 700; white-space: nowrap; cursor: pointer; }
    .duo-tab.active { color: #38bdf8; }
    .duo-tab.active::after { content: ""; position: absolute; left: 10px; right: 10px; bottom: 0; height: 3px; border-radius: 3px 3px 0 0; background: #38bdf8; }

    .duo-body { flex: 1; overflow-y: auto; padding: 16px; -webkit-overflow-scrolling: touch; }
    .duo-sec { font-size: 14px; font-weight: 700; color: #a4a4c4; margin-bottom: 12px; }
    .duo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding-bottom: 24px; }
    .duo-grid.colors { grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .duo-grid.skins { grid-template-columns: repeat(2, 1fr); gap: 12px; }

    .duo-item { aspect-ratio: 1; background: #1d1d30; border: 2.5px solid #2b2b45; border-radius: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; transition: border-color 0.15s, transform 0.1s; position: relative; }
    .duo-item:active { transform: scale(0.96); }
    .duo-item.active { border-color: #38bdf8; background: #232942; box-shadow: 0 0 0 2px rgba(56,189,248,0.25); }
    .duo-item.locked { opacity: 0.55; }
    .duo-item.none { font-size: 14px; color: #8f8fb0; font-weight: 700; }
    .duo-item.color-card { padding: 5px; border-radius: 15px; background: #171726; }
    .duo-swatch { width: 100%; height: 100%; border-radius: 10px; }
    .duo-skin-lbl { position: absolute; bottom: 6px; left: 6px; right: 6px; text-align: center; font-size: 11px; font-weight: 800; background: rgba(19,19,31,0.78); padding: 3px 6px; border-radius: 8px; }

    /* Вкладка Мозаика 3×3 */
    .mosaic-box { background: linear-gradient(145deg, #211638, #130d24); border: 1.5px solid rgba(0,229,255,0.32); border-radius: 20px; padding: 16px; margin-bottom: 14px; }
    .mosaic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; max-width: 240px; margin: 14px auto 16px; }
    .m-tile { aspect-ratio: 1; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1.5px dashed rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: rgba(255,255,255,0.25); transition: 0.25s; }
    .m-tile.open { border-style: solid; border-color: var(--cyan); background: linear-gradient(135deg, rgba(255,46,147,0.35), rgba(0,229,255,0.35)); color: #fff; box-shadow: inset 0 0 14px rgba(0,229,255,0.3); }
    .m-tile.craftable { cursor: pointer; border-color: var(--gold); animation: tilePulse 1.4s infinite alternate; }
    @keyframes tilePulse { from { box-shadow: 0 0 4px rgba(255,215,0,0.2); } to { box-shadow: 0 0 14px rgba(255,215,0,0.65); } }

    /* Карточки артистов в едином стиле Avataaars */
    .toon-card-art { position: relative; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
    .toon-card-art svg { width: 100%; height: 100%; display: block; pointer-events: none; }
    .toon-role-pill { position: absolute; bottom: 5px; right: 5px; background: rgba(14,10,26,0.72); border: 1px solid rgba(255,255,255,0.2); border-radius: 7px; padding: 2px 5px; font-size: 9px; font-weight: 900; color: #fff; backdrop-filter: blur(4px); }
  `;
  document.head.appendChild(css);

  function initAvState() {
    if (!st.avatar || st.avatar.v !== 3) {
      const prevAcc = (st.avatar && st.avatar.acc) ? st.avatar.acc : 'none';
      st.avatar = { ...DEFAULT_AV, acc: prevAcc };
    }
    if (!st.mosaic) st.mosaic = { pieces: [], dust: 0, claimed: false };
    if (!st.unlockedAcc) st.unlockedAcc = [];
  }

  function buildConfig(a, withBg = false) {
    const cfg = {
      seed: 'base',
      top: [a.top || DEFAULT_AV.top],
      hairColor: [a.hairColor || DEFAULT_AV.hairColor],
      skinColor: [a.skinColor || DEFAULT_AV.skinColor],
      eyes: [a.eyes || DEFAULT_AV.eyes],
      eyebrows: [a.eyebrows || DEFAULT_AV.eyebrows],
      mouth: [a.mouth || DEFAULT_AV.mouth],
      clothing: [a.clothing || DEFAULT_AV.clothing],
      clothesColor: [a.clothesColor || DEFAULT_AV.clothesColor],
      facialHairProbability: 0,
      accessoriesProbability: a.accessories ? 100 : 0
    };
    if (withBg) {
      cfg.backgroundColor = [a.backgroundColor || DEFAULT_AV.backgroundColor];
    }
    if (a.accessories) {
      cfg.accessories = [a.accessories];
    }
    return cfg;
  }

  window.renderAvatarSvg = function (cfg, transparentBg = false) {
    initAvState();
    const a = (cfg && cfg.v === 3) ? cfg : st.avatar;
    const svg = createAvatar(avataaars, buildConfig(a, false)).toString();
    const bg = transparentBg ? 'transparent' : ('#' + (a.backgroundColor || DEFAULT_AV.backgroundColor));
    const visorSvg = a.acc === 'visor'
      ? `<svg class="av-visor-ov" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
           <rect x="27" y="42" width="46" height="14" rx="7" fill="rgba(0,229,255,0.62)" stroke="#00e5ff" stroke-width="2.5"/>
           <line x1="33" y1="46" x2="48" y2="46" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
         </svg>`
      : '';
    return `<div class="av-svg-wrap" style="background:${bg}">${svg}${visorSvg}</div>`;
  };

  /* ====== ПОЛНОЭКРАННЫЙ РЕДАКТОР (DUOLINGO) ====== */
  const editorOv = document.createElement('div');
  editorOv.className = 'duo-editor';
  editorOv.id = 'av-editor-overlay';
  editorOv.innerHTML = `
    <div class="duo-head">
      <button class="close-btn" style="width:32px;height:32px;font-size:15px" id="duo-close">✕</button>
      <div style="font-size:16px;font-weight:800">Редактор героя</div>
      <button class="duo-done" id="duo-done">ГОТОВО</button>
    </div>
    <div class="duo-stage" id="duo-stage">
      <div class="duo-stage-av" id="duo-stage-av"></div>
      <button class="duo-rand-fab" id="duo-rand" title="Случайный образ">🎲</button>
    </div>
    <div class="duo-tabs" id="duo-tabs"></div>
    <div class="duo-body">
      <div class="duo-sec" id="duo-sec-title">Волосы</div>
      <div class="duo-grid" id="duo-grid"></div>
    </div>
  `;
  document.body.appendChild(editorOv);

  function updateStage() {
    const a = st.avatar;
    editorOv.querySelector('#duo-stage').style.backgroundColor = '#' + (a.backgroundColor || DEFAULT_AV.backgroundColor);
    editorOv.querySelector('#duo-stage-av').innerHTML = renderAvatarSvg(a, true);
  }

  function renderEditorTabs() {
    const wrap = editorOv.querySelector('#duo-tabs');
    wrap.innerHTML = '';
    Object.entries(OPTIONS).forEach(([key, cfg]) => {
      const btn = document.createElement('button');
      btn.className = 'duo-tab' + (activeTab === key ? ' active' : '');
      btn.textContent = cfg.label;
      btn.onclick = () => {
        activeTab = key;
        haptic('light');
        renderEditorTabs();
        renderEditorGrid();
      };
      wrap.appendChild(btn);
    });
  }

  function renderEditorGrid() {
    const grid = editorOv.querySelector('#duo-grid');
    const cfg = OPTIONS[activeTab];
    const a = st.avatar;
    editorOv.querySelector('#duo-sec-title').textContent = cfg.label;
    grid.className = 'duo-grid' + (cfg.type === 'color' ? ' colors' : (cfg.type === 'skin' ? ' skins' : ''));
    grid.innerHTML = '';

    if (cfg.type === 'skin') {
      SKINS_LIST.forEach(sk => {
        const isLocked = sk.locked && !st.unlockedAcc.includes(sk.id);
        const card = document.createElement('div');
        card.className = 'duo-item' + (a.acc === sk.id ? ' active' : '') + (isLocked ? ' locked' : '');
        card.innerHTML = `${renderAvatarSvg({ ...a, acc: sk.id }, false)}<div class="duo-skin-lbl">${isLocked ? '🔒 ' : ''}${sk.name}</div>`;
        card.onclick = () => {
          if (isLocked) return alert(`Открой во вкладке «Мозаика»: собери ${sk.req}!`);
          st.avatar.acc = sk.id;
          save(false); haptic('ok');
          updateStage();
          renderEditorGrid();
        };
        grid.appendChild(card);
      });
      return;
    }

    if (cfg.optional) {
      const none = document.createElement('div');
      none.className = 'duo-item none' + (a[activeTab] === null ? ' active' : '');
      none.textContent = 'Нет';
      none.onclick = () => {
        st.avatar[activeTab] = null;
        save(false); haptic('light');
        updateStage();
        renderEditorGrid();
      };
      grid.appendChild(none);
    }

    cfg.values.forEach(val => {
      const card = document.createElement('div');
      card.className = 'duo-item' + (cfg.type === 'color' ? ' color-card' : '') + (a[activeTab] === val ? ' active' : '');

      if (cfg.type === 'color') {
        const sw = document.createElement('div');
        sw.className = 'duo-swatch';
        sw.style.background = '#' + val;
        card.appendChild(sw);
      } else {
        card.innerHTML = renderAvatarSvg({ ...a, [activeTab]: val }, false);
      }

      card.onclick = () => {
        st.avatar[activeTab] = val;
        save(false); haptic('light');
        updateStage();
        grid.querySelectorAll('.duo-item').forEach(el => el.classList.remove('active'));
        card.classList.add('active');
      };
      grid.appendChild(card);
    });
  }

  function refreshProfileBanner() {
    const banner = document.querySelector('#profile-overlay .prof-hero-banner');
    if (banner) {
      banner.style.background = '#' + (st.avatar.backgroundColor || DEFAULT_AV.backgroundColor);
      const avWrap = banner.querySelector('.prof-hero-av');
      if (avWrap) avWrap.innerHTML = renderAvatarSvg(st.avatar, true);
    }
  }

  const closeEditor = () => {
    editorOv.classList.remove('open');
    save();
    renderBinder();
    refreshProfileBanner();
  };

  editorOv.querySelector('#duo-close').onclick = closeEditor;
  editorOv.querySelector('#duo-done').onclick = () => { haptic('ok'); closeEditor(); };
  editorOv.querySelector('#duo-rand').onclick = () => {
    haptic('light');
    Object.entries(OPTIONS).forEach(([key, cfg]) => {
      if (cfg.type === 'skin') return;
      const pool = cfg.optional ? [null, null, ...cfg.values] : cfg.values;
      st.avatar[key] = pool[Math.floor(Math.random() * pool.length)];
    });
    save(false);
    updateStage();
    renderEditorGrid();
  };

  window.openAvatarCreator = function () {
    initAvState();
    updateStage();
    renderEditorTabs();
    renderEditorGrid();
    editorOv.classList.add('open');
  };

  /* ====== МОЗАИКА 3×3 ====== */
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
    if (avBox) {
      avBox.style.padding = '0';
      avBox.innerHTML = renderAvatarSvg();
    }

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

  /* ====== КРУПНЫЙ БАННЕР ГЕРОЯ В ПРОФИЛЕ ====== */
  const origOpenProfile = window.openProfileModal;
  window.openProfileModal = function () {
    initAvState();
    origOpenProfile();
    const profAv = document.querySelector('#profile-overlay .av-circle');
    if (profAv) {
      const banner = document.createElement('div');
      banner.className = 'prof-hero-banner';
      banner.style.background = '#' + (st.avatar.backgroundColor || DEFAULT_AV.backgroundColor);
      banner.innerHTML = `
        <div class="prof-hero-av">${renderAvatarSvg(st.avatar, true)}</div>
        <button class="prof-hero-edit" type="button">🎨 Изменить</button>
      `;
      banner.onclick = openAvatarCreator;
      profAv.replaceWith(banner);

      const oldPicks = document.querySelector('#profile-overlay .av-pick-row');
      if (oldPicks) oldPicks.style.display = 'none';
    }
  };

  /* ====== ШАНС ДРОПА МОЗАИКИ ПОСЛЕ УРОКА ====== */
  const origFinishAv = window.finishLesson;
  window.finishLesson = function () {
    const passed = !(curL && curL.isExam && mistakes > 4);
    origFinishAv();
    if (passed && Math.random() < 0.45) setTimeout(dropMosaicPiece, 700);
  };

  /* ====== КАРТОЧКИ АРТИСТОВ В СТИЛЕ AVATAAARS ====== */
  const CARD_BGS = [
    "linear-gradient(145deg, #ff2e93, #4a148c)",
    "linear-gradient(145deg, #00e5ff, #1a237e)",
    "linear-gradient(145deg, #ffd700, #bf360c)",
    "linear-gradient(145deg, #b46eff, #311b92)",
    "linear-gradient(145deg, #00e676, #004d40)",
    "linear-gradient(145deg, #ff5252, #4a148c)"
  ];

  window.cardArtHtml = function (c) {
    const id = Number(c.id) || 1;
    const pick = (arr, shift) => arr[(id * 3 + shift) % arr.length];
    const cfg = {
      v: 3,
      top: pick(OPTIONS.top.values, 1),
      hairColor: pick(OPTIONS.hairColor.values, 2),
      skinColor: pick(OPTIONS.skinColor.values, 0),
      eyes: pick(OPTIONS.eyes.values, 1),
      eyebrows: pick(OPTIONS.eyebrows.values, 0),
      mouth: pick(OPTIONS.mouth.values, 2),
      clothing: pick(OPTIONS.clothing.values, 1),
      clothesColor: pick(OPTIONS.clothesColor.values, 4),
      accessories: id % 3 === 0 ? pick(OPTIONS.accessories.values, 1) : null
    };
    const svg = createAvatar(avataaars, buildConfig(cfg, false)).toString();
    const bg = CARD_BGS[id % CARD_BGS.length];
    const roleTag = c.tag || (c.role ? c.role.slice(0, 3).toUpperCase() : 'IDOL');

    return `<div class="pc-art toon-card-art" style="background:${bg}">
      ${svg}
      <div class="toon-role-pill">${roleTag}</div>
    </div>`;
  };

  initAvState();
  renderBinder();
})();
