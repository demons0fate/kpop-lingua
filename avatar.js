/* ====== КОНСТРУКТОР ПЕРСОНАЖА (SVG) + МОЗАИКА 3×3 (СКИНЫ ЗА СБОР) ====== */
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
    "linear-gradient(135deg,#1f2330,#0e0a1a)"
  ];

  const ACCS = [
    { id: "none", name: "Нет", locked: false },
    { id: "visor", name: "Кибер-визор", locked: true, req: "Мозаика 3×3" }
  ];

  const css = document.createElement('style');
  css.textContent = `
    .av-svg-wrap { width: 100%; height: 100%; border-radius: inherit; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .av-svg-wrap svg { width: 100%; height: 100%; display: block; }

    /* Конструктор персонажа */
    .av-editor-prev { width: 116px; height: 116px; border-radius: 26px; margin: 0 auto 14px; border: 2.5px solid var(--cyan); box-shadow: 0 0 24px rgba(0,229,255,0.28); overflow: hidden; }
    .av-sec { font-size: 11px; font-weight: 800; color: var(--muted); text-transform: uppercase; margin: 12px 0 6px; }
    .av-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .av-chip { background: var(--surface); border: 1.5px solid rgba(255,255,255,0.1); color: #fff; font-size: 12px; font-weight: 700; padding: 6px 11px; border-radius: 10px; cursor: pointer; }
    .av-chip.on { border-color: var(--cyan); background: rgba(0,229,255,0.16); color: var(--cyan); }
    .av-chip.locked { opacity: 0.45; }
    .av-swatch { width: 30px; height: 30px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
    .av-swatch.on { border-color: #fff; transform: scale(1.12); box-shadow: 0 0 10px rgba(255,255,255,0.4); }

    /* Мозаика 3×3 */
    .mosaic-box { background: linear-gradient(145deg, #211638, #130d24); border: 1.5px solid rgba(0,229,255,0.3); border-radius: 18px; padding: 14px; margin-bottom: 16px; }
    .mosaic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; max-width: 210px; margin: 10px auto 12px; }
    .m-tile { aspect-ratio: 1; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px dashed rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: rgba(255,255,255,0.25); transition: 0.25s; }
    .m-tile.open { border-style: solid; border-color: var(--cyan); background: linear-gradient(135deg, rgba(255,46,147,0.35), rgba(0,229,255,0.35)); color: #fff; box-shadow: inset 0 0 12px rgba(0,229,255,0.3); }
    .m-tile.craftable { cursor: pointer; border-color: var(--gold); animation: tilePulse 1.4s infinite alternate; }
    @keyframes tilePulse { from { box-shadow: 0 0 4px rgba(255,215,0,0.2); } to { box-shadow: 0 0 12px rgba(255,215,0,0.6); } }
  `;
  document.head.appendChild(css);

  function initAvState() {
    if (!st.avatar) st.avatar = { skin: 0, hair: 0, hairCol: 1, eyes: 0, mouth: 0, shirt: 0, bg: 0, acc: 'none' };
    if (!st.mosaic) st.mosaic = { pieces: [], dust: 0, claimed: false };
    if (!st.unlockedAcc) st.unlockedAcc = [];
  }

  /* Рендер векторного персонажа (SVG) */
  window.renderAvatarSvg = function (cfg) {
    const a = cfg || st.avatar || { skin: 0, hair: 0, hairCol: 1, eyes: 0, mouth: 0, shirt: 0, bg: 0, acc: 'none' };
    const skin = SKINS[a.skin] || SKINS[0];
    const hc = HAIR_COLS[a.hairCol] || HAIR_COLS[0];
    const sh = SHIRTS[a.shirt] || SHIRTS[0];

    let hairBack = '';
    if (a.hair === 1) hairBack = `<rect x="22" y="28" width="56" height="44" rx="18" fill="${hc}"/>`;
    if (a.hair === 3) hairBack = `<circle cx="18" cy="48" r="13" fill="${hc}"/><circle cx="82" cy="48" r="13" fill="${hc}"/>`;

    let hairFront = `<path d="M26 42 Q30 16 50 16 Q70 16 74 42 Q64 28 50 30 Q36 28 26 42 Z" fill="${hc}"/>`;
    if (a.hair === 2) hairFront = `<path d="M26 42 L34 14 L44 26 L52 10 L60 26 L70 16 L74 42 Q50 28 26 42 Z" fill="${hc}"/>`;

    let eyesSvg = `<circle cx="40" cy="48" r="3.6" fill="#161224"/><circle cx="60" cy="48" r="3.6" fill="#161224"/><circle cx="41.2" cy="46.8" r="1.2" fill="#fff"/><circle cx="61.2" cy="46.8" r="1.2" fill="#fff"/>`;
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

    return `<div class="av-svg-wrap" style="background:${BGS[a.bg] || BGS[0]}">
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

  /* Редактор персонажа */
  const editorOv = document.createElement('div');
  editorOv.className = 'full-overlay';
  editorOv.id = 'av-editor-overlay';
  document.body.appendChild(editorOv);

  window.openAvatarCreator = function () {
    initAvState();
    haptic('light');
    const a = st.avatar;
    editorOv.innerHTML = `
      <div class="ov-header">
        <div style="font-size:16px;font-weight:900">Создание персонажа</div>
        <button class="close-btn" style="width:32px;height:32px;font-size:15px" onclick="document.getElementById('av-editor-overlay').classList.remove('open')">✕</button>
      </div>
      <div class="ov-scroll">
        <div class="av-editor-prev" id="av-prev-box">${renderAvatarSvg(a)}</div>

        <div class="av-sec">Тон кожи</div>
        <div class="av-chips">${SKINS.map((c, i) => `<div class="av-swatch ${a.skin === i ? 'on' : ''}" style="background:${c}" data-set="skin:${i}"></div>`).join('')}</div>

        <div class="av-sec">Причёска</div>
        <div class="av-chips">${HAIRS.map((n, i) => `<div class="av-chip ${a.hair === i ? 'on' : ''}" data-set="hair:${i}">${n}</div>`).join('')}</div>

        <div class="av-sec">Цвет волос</div>
        <div class="av-chips">${HAIR_COLS.map((c, i) => `<div class="av-swatch ${a.hairCol === i ? 'on' : ''}" style="background:${c}" data-set="hairCol:${i}"></div>`).join('')}</div>

        <div class="av-sec">Глаза</div>
        <div class="av-chips">${EYES.map((n, i) => `<div class="av-chip ${a.eyes === i ? 'on' : ''}" data-set="eyes:${i}">${n}</div>`).join('')}</div>

        <div class="av-sec">Мордашка</div>
        <div class="av-chips">${MOUTHS.map((n, i) => `<div class="av-chip ${a.mouth === i ? 'on' : ''}" data-set="mouth:${i}">${n}</div>`).join('')}</div>

        <div class="av-sec">Одежда</div>
        <div class="av-chips">${SHIRTS.map((c, i) => `<div class="av-swatch ${a.shirt === i ? 'on' : ''}" style="background:${c}" data-set="shirt:${i}"></div>`).join('')}</div>

        <div class="av-sec">Фон</div>
        <div class="av-chips">${BGS.map((c, i) => `<div class="av-swatch ${a.bg === i ? 'on' : ''}" style="background:${c}" data-set="bg:${i}"></div>`).join('')}</div>

        <div class="av-sec">Аксессуары (за Мозаику)</div>
        <div class="av-chips">${ACCS.map(ac => {
          const isLocked = ac.locked && !st.unlockedAcc.includes(ac.id);
          return `<div class="av-chip ${a.acc === ac.id ? 'on' : ''} ${isLocked ? 'locked' : ''}" data-acc="${ac.id}">${isLocked ? '🔒 ' : ''}${ac.name}</div>`;
        }).join('')}</div>

        <button class="btn full" style="margin-top:20px" onclick="document.getElementById('av-editor-overlay').classList.remove('open')">Готово</button>
      </div>`;

    editorOv.querySelectorAll('[data-set]').forEach(el => {
      el.onclick = () => {
        const [k, v] = el.getAttribute('data-set').split(':');
        st.avatar[k] = Number(v);
        save(false); haptic('light'); openAvatarCreator(); renderBinder();
      };
    });
    editorOv.querySelectorAll('[data-acc]').forEach(el => {
      el.onclick = () => {
        const id = el.getAttribute('data-acc');
        const ac = ACCS.find(x => x.id === id);
        if (ac.locked && !st.unlockedAcc.includes(id)) return alert(`Открой в Зале славы: собери ${ac.req}!`);
        st.avatar.acc = id;
        save(false); haptic('ok'); openAvatarCreator(); renderBinder();
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

  /* Встраиваем SVG-аватар и Мозаику 3×3 в интерфейс */
  const origRenderBinder = window.renderBinder;
  window.renderBinder = function () {
    initAvState();
    origRenderBinder();

    // Подменяем кружок аватара в шапке Студии
    const avBox = document.querySelector('#screen-binder .av-circle');
    if (avBox) { avBox.style.padding = '0'; avBox.innerHTML = renderAvatarSvg(); }

    // Если открыт "Зал славы" — добавляем блок Мозаики 3×3 наверх
    const sub = document.getElementById('studio-sub-body');
    if (sub && sub.querySelector('.badges-grid')) {
      const m = st.mosaic;
      const canCraft = m.dust >= 3 && m.pieces.length < 9;
      const isDone = m.pieces.length >= 9;
      const icons = ["🎵", "⚡", "💿", "🎤", "🕶️", "🌟", "🔥", "💜", "👑"];

      const wrap = document.createElement('div');
      wrap.className = 'mosaic-box';
      wrap.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:14px;font-weight:900">Мозаика #1: Кибер-визор</div>
            <div style="font-size:11px;color:var(--muted)">Собери 9 частей → скин для персонажа</div>
          </div>
          <span style="font-size:12px;font-weight:900;color:var(--cyan)">${m.pieces.length}/9</span>
        </div>
        <div class="mosaic-grid">
          ${Array.from({ length: 9 }).map((_, i) => {
            const open = m.pieces.includes(i);
            return `<div class="m-tile ${open ? 'open' : (canCraft ? 'craftable' : '')}" data-tile="${i}">${open ? icons[i] : (canCraft ? '✨' : '?')}</div>`;
          }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div style="font-size:11px;color:var(--gold);font-weight:800">Блёстки: ${m.dust}/3 ${canCraft ? '(жми на ?)' : ''}</div>
          ${isDone && !m.claimed
            ? `<button class="btn gold" style="padding:6px 12px;font-size:12px" id="claim-mosaic">Забрать Визор!</button>`
            : (m.claimed
                ? `<button class="btn cyan" style="padding:6px 12px;font-size:11px" onclick="openAvatarCreator()">Примерить</button>`
                : `<button class="btn ghost" style="padding:5px 10px;font-size:11px" onclick="dropMosaicPiece()">+ Кусок (тест)</button>`)}
        </div>`;

      wrap.querySelectorAll('.m-tile.craftable').forEach(t => {
        t.onclick = () => {
          const i = Number(t.getAttribute('data-tile'));
          if (m.dust >= 3 && !m.pieces.includes(i)) {
            m.dust -= 3; m.pieces.push(i);
            save(); haptic('ok'); sfx('win'); renderBinder();
          }
        };
      });
      const cm = wrap.querySelector('#claim-mosaic');
      if (cm) cm.onclick = () => {
        m.claimed = true;
        if (!st.unlockedAcc.includes('visor')) st.unlockedAcc.push('visor');
        st.avatar.acc = 'visor';
        save(); haptic('ok'); sfx('win'); fireConfetti();
        alert('🕶️ Кибер-визор открыт и надет на персонажа!');
        renderBinder();
      };
      sub.prepend(wrap);
    }
  };

  // Подменяем аватар в Профиле + добавляем кнопку конструктора
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
      btn.textContent = '🎨 Настроить персонажа';
      btn.onclick = openAvatarCreator;
      profAv.parentElement.insertBefore(btn, profAv.nextSibling);
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
