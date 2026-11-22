/* ====== СПРАВОЧНИК ПРАВИЛ (ФОНЕТИКА И ГРАММАТИКА) ====== */
const RULES = [
  {
    id: "r1",
    l: 1,
    block: "Блок 1 • Хангыль",
    title: "Кружочек ㅇ, две «О» и правило Й",
    summary: "Как читать базовые гласные без ошибок",
    text: "Гласная в корейском никогда не стоит одна — перед ней ставят немой кружочек <b>ㅇ</b>. Запомни два главных принципа:",
    formula: "ㅏ [а] → ㅑ [я] • ㅓ [о] → ㅕ [ё] • ㅗ [о] → ㅛ [ё] • ㅜ [у] → ㅠ [ю]",
    tip: "Разница между двумя «О»: для <b>오</b> сложи губы трубочкой, а для <b>어</b> широко открой рот, как на «А», но произнеси «О».",
    examples: [
      { kr: "어", tr: "[о] открытое", ru: "Черта смотрит влево", file: "audio/eo.mp3" },
      { kr: "오", tr: "[о] округлое", ru: "Черта смотрит вверх", file: "audio/o.mp3" },
      { kr: "우유", tr: "[у-ю]", ru: "Молоко", file: "audio/uyu.mp3" }
    ]
  },
  {
    id: "r2",
    l: 2,
    block: "Блок 1 • Хангыль",
    title: "Озвончение согласных и слог 시",
    summary: "Почему 바다 читается [па-да], а не [ба-та]",
    text: "Согласные <b>ㄱ, ㄷ, ㅂ, ㅈ</b> в начале слова звучат глухо (<b>[к, т, п, ч]</b>), но <b>между двумя гласными</b> (или после сонорных ㄴ, ㄹ, ㅁ, ㅇ) они смягчаются и становятся звонкими (<b>[г, д, б, дж]</b>).",
    formula: "ㄱ → к/г • ㄷ → т/д • ㅂ → п/б • ㅈ → ч/дж",
    tip: "Буква <b>ㅅ [с]</b> перед гласной <b>ㅣ [и]</b> всегда шепелявит и читается мягко — <b>시 [щи]</b>.",
    examples: [
      { kr: "바다", tr: "[па-да]", ru: "Море (ㅂ в начале → П, ㄷ внутри → Д)", file: "audio/bada.mp3" },
      { kr: "고기", tr: "[ко-ги]", ru: "Мясо (ㄱ → К, вторая ㄱ → Г)", file: "audio/gogi.mp3" },
      { kr: "시", tr: "[щи]", ru: "Мягкое [щи] перед ㅣ", file: "audio/si.mp3" }
    ]
  },
  {
    id: "r3",
    l: 3,
    block: "Блок 1 • Хангыль",
    title: "Придыхательные согласные",
    summary: "Звуки с сильным выдохом: ㅋ, ㅌ, ㅍ, ㅊ",
    text: "Эти 4 буквы произносятся с резким потоком воздуха и <b>никогда не озвончаются</b> в середине слова. В заимствованных словах звук [ф] всегда заменяют на <b>ㅍ [пх]</b>.",
    formula: "ㅋ [кх] • ㅌ [тх] • ㅍ [пх] • ㅊ [чх]",
    tip: "Поднеси ладонь ко рту: на обычной <b>ㄱ</b> воздуха почти нет, а на <b>ㅋ</b> ты почувствуешь чёткий ветерок.",
    examples: [
      { kr: "커피", tr: "[кхо-пхи]", ru: "Кофе (звук Ф → ㅍ)", file: "audio/keopi.mp3" },
      { kr: "포도", tr: "[пхо-до]", ru: "Виноград (ㅍ не озвончается, ㄷ → Д)", file: "audio/podo.mp3" }
    ]
  },
  {
    id: "r4",
    l: 4,
    block: "Блок 1 • Хангыль",
    title: "Двойные (напряжённые) согласные",
    summary: "Жёсткие звуки ㄲ, ㄸ, ㅃ, ㅆ, ㅉ без выдоха",
    text: "Удвоенные буквы произносятся коротко, твёрдо и с напряжением в горле. Как и придыхательные, они <b>никогда не озвончаются</b> между гласными.",
    formula: "ㄲ [кк] • ㄸ [тт] • ㅃ [пп] • ㅆ [сс] • ㅉ [чч]",
    tip: "Сравни: <b>오바</b> читалось бы [о-ба], а двойная <b>ㅃ</b> в <b>오빠</b> держит твёрдое [оп-па].",
    examples: [
      { kr: "오빠", tr: "[оп-па]", ru: "Старший брат (от девушки)", file: "audio/oppa.mp3" },
      { kr: "아빠", tr: "[ап-па]", ru: "Папа", file: "audio/appa.mp3" }
    ]
  },
  {
    id: "r5",
    l: 5,
    block: "Блок 1 • Хангыль",
    title: "Составные гласные (Дифтонги)",
    summary: "Как читать ㅐ, ㅔ и связки с [в]",
    text: "В современном корейском <b>ㅐ</b> и <b>ㅔ</b> звучат практически одинаково — как <b>[э]</b>. Остальные дифтонги — это быстрое слияние двух гласных в один плавный звук.",
    formula: "ㅐ/ㅔ [э] • ㅘ [ва] • ㅝ [во] • ㅟ [ви] • ㅚ [вэ] • ㅢ [ый]",
    tip: "Слово <b>뭐 [мво]</b> («Что?») и <b>최고 [чхве-го]</b> («Лучший!») — отличные якоря, чтобы запомнить ㅝ и ㅚ.",
    examples: [
      { kr: "노래", tr: "[но-рэ]", ru: "Песня", file: "audio/norae.mp3" },
      { kr: "최고", tr: "[чхве-го]", ru: "Лучший!", file: "audio/choego.mp3" },
      { kr: "의자", tr: "[ый-джа]", ru: "Стул", file: "audio/uija.mp3" }
    ]
  },
  {
    id: "r6",
    l: 6,
    block: "Блок 1 • Хангыль",
    title: "Патчим (Часть 1): Сонорные внизу",
    summary: "Буквы ㄴ, ㄹ, ㅁ, ㅇ в нижней позиции слога",
    text: "Патчим (받침) — это согласная, закрывающая слог снизу. Сонорные буквы внизу звучат мягко и протяжно.",
    formula: "ㄴ [н] • ㅁ [м] • ㄹ [ль] • ㅇ [носовое н / -ng]",
    tip: "Кружочек <b>ㅇ</b> вверху немой, но внизу он просыпается и даёт носовой звук [н], как в английском <i>song</i>.",
    examples: [
      { kr: "별", tr: "[пёль]", ru: "Звезда (ㄹ внизу всегда мягкое [ль])", file: "audio/byeol.mp3" },
      { kr: "사랑", tr: "[са-ран]", ru: "Любовь (внизу носовое ㅇ)", file: "audio/sarang.mp3" },
      { kr: "사람", tr: "[са-рам]", ru: "Человек (внизу ㅁ)", file: "audio/saram.mp3" }
    ]
  },
  {
    id: "r7",
    l: 7,
    block: "Блок 1 • Хангыль",
    title: "Глухой патчим и Перенос звука (연음)",
    summary: "Главное правило беглого корейского чтения",
    text: "1) В конце слова глухие <b>ㄱ, ㄷ, ㅂ</b> (а также <b>ㅅ, ㅈ, ㅊ</b>) резко обрываются в <b>[к], [т] или [п]</b>.<br>2) Если сразу после патчима идёт слог с немым <b>ㅇ</b>, нижняя согласная <b>перепрыгивает</b> на его место и звучит в полную силу!",
    formula: "음 + 악 → [으막 / ы-мак] • 국 + 어 → [구거 / гу-го]",
    tip: "Буквы <b>ㅅ, ㅈ, ㅊ</b> в патчиме без следующей гласной всегда читаются как короткое <b>[т]</b>: 옷 [от], 꽃 [ккот].",
    examples: [
      { kr: "꽃", tr: "[ккот]", ru: "Цветок (ㅊ внизу → глухое [т])", file: "audio/kkot.mp3" },
      { kr: "음악", tr: "[ы-мак]", ru: "Музыка (перенос ㅁ на место ㅇ)", file: "audio/eumak.mp3" },
      { kr: "한국어", tr: "[хан-гу-го]", ru: "Корейский язык (перенос ㄱ)", file: "audio/hangugeo.mp3" }
    ]
  },
  {
    id: "r8",
    l: 8,
    block: "Блок 1 • Хангыль",
    title: "Ассимиляция (ㄱ+ㄴ) и Обращения",
    summary: "Почему 막내 читается [ман-нэ] и как звать старших",
    text: "Когда после глухого патчима <b>ㄱ</b> сразу идёт носовая <b>ㄴ</b> или <b>ㅁ</b>, звук ㄱ смягчается и превращается в <b>[н]</b>, чтобы не ломать язык.",
    formula: "ㄱ + ㄴ → [н + н] • 막내 → [ман-нэ]",
    tip: "Обращения зависят от пола говорящего: девушка зовёт старших <b>오빠</b> (парня) и <b>언니</b> (девушку); парень зовёт старшего парня <b>형</b>.",
    examples: [
      { kr: "막내", tr: "[ман-нэ]", ru: "Младший участник группы", file: "audio/maknae.mp3" },
      { kr: "언니", tr: "[он-ни]", ru: "Старшая сестра (от девушки)", file: "audio/eonni.mp3" },
      { kr: "형", tr: "[хён]", ru: "Старший брат (от парня)", file: "audio/hyeong.mp3" }
    ]
  }
];

(function () {
  let openRuleId = null;

  const css = document.createElement('style');
  css.textContent = `
    #screen-vocab .mode-btn { font-size: 11px; padding: 9px 4px; }
    .rule-card { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; margin-bottom: 10px; overflow: hidden; transition: border-color 0.2s; }
    .rule-card.open { border-color: rgba(0,229,255,0.45); }
    .rule-card.locked { opacity: 0.45; }
    .rule-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 13px 14px; cursor: pointer; }
    .rule-badge { display: inline-block; font-size: 10px; font-weight: 800; color: var(--cyan); background: rgba(0,229,255,0.12); padding: 2px 8px; border-radius: 7px; margin-bottom: 4px; }
    .rule-title { font-size: 14px; font-weight: 800; color: #fff; }
    .rule-sum { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .rule-arrow { font-size: 16px; color: var(--muted); font-weight: 900; transition: transform 0.2s; }
    .rule-card.open .rule-arrow { transform: rotate(90deg); color: var(--cyan); }
    .rule-body { padding: 0 14px 14px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; line-height: 1.5; color: #e6e1f2; }
    .rule-formula { background: rgba(138,43,226,0.18); border: 1px solid rgba(138,43,226,0.45); border-radius: 10px; padding: 9px 11px; font-size: 12px; font-weight: 800; color: #fff; text-align: center; margin: 10px 0; }
  `;
  document.head.appendChild(css);

  /* Добавляем 4-ю кнопку «Правила» в переключатель Словаря */
  const sw = document.querySelector('#screen-vocab .mode-switch');
  if (sw && !document.getElementById('vmode-rules')) {
    const cardsBtn = document.getElementById('vmode-cards');
    if (cardsBtn) cardsBtn.textContent = 'Карточки';
    const rBtn = document.createElement('button');
    rBtn.className = 'mode-btn';
    rBtn.id = 'vmode-rules';
    rBtn.textContent = 'Правила';
    rBtn.onclick = () => setVocabMode('rules');
    sw.appendChild(rBtn);
  }

  const origSetVocabMode = window.setVocabMode;
  window.setVocabMode = function (m) {
    origSetVocabMode(m);
    const rb = document.getElementById('vmode-rules');
    if (rb) rb.classList.toggle('active', m === 'rules');
  };

  const origRenderVocab = window.renderVocab;
  window.renderVocab = function () {
    if (vocabMode !== 'rules') return origRenderVocab();

    const unlocked = RULES.filter(r => st.done.includes(r.l));
    document.getElementById('vocab-count').innerText = `${unlocked.length} / ${RULES.length}`;
    const body = document.getElementById('vocab-body');
    body.innerHTML = '';

    if (!unlocked.length) {
      body.innerHTML = `<div class="card-box" style="text-align:center;padding:24px 16px"><h3>Справочник пока закрыт</h3><p style="color:var(--muted)">Пройди <b>Урок 1</b> — здесь начнут собираться все правила фонетики и грамматики, чтобы ты мог в любой момент их повторить.</p></div>`;
    }

    RULES.forEach(r => {
      const isOpenable = st.done.includes(r.l);
      const isExpanded = isOpenable && openRuleId === r.id;
      const card = document.createElement('div');
      card.className = `rule-card ${isExpanded ? 'open' : ''} ${!isOpenable ? 'locked' : ''}`;

      card.innerHTML = `
        <div class="rule-head">
          <div style="flex:1">
            <div class="rule-badge">Урок ${r.l} • ${r.block}</div>
            <div class="rule-title">${isOpenable ? '' : '🔒 '}${r.title}</div>
            <div class="rule-sum">${isOpenable ? r.summary : `Откроется после прохождения Урока ${r.l}`}</div>
          </div>
          <div class="rule-arrow">${isOpenable ? '›' : ''}</div>
        </div>
      `;

      if (isOpenable) {
        card.querySelector('.rule-head').onclick = () => {
          haptic('light');
          openRuleId = (openRuleId === r.id) ? null : r.id;
          renderVocab();
        };
      }

      if (isExpanded) {
        const rb = document.createElement('div');
        rb.className = 'rule-body';
        rb.innerHTML = `
          <p style="margin:10px 0">${r.text}</p>
          ${r.formula ? `<div class="rule-formula">${r.formula}</div>` : ''}
          ${r.tip ? `<div class="tip-box">${r.tip}</div>` : ''}
          <div class="example-list"></div>
        `;
        const list = rb.querySelector('.example-list');
        (r.examples || []).forEach(ex => {
          const row = document.createElement('div');
          row.className = 'example-row';
          row.innerHTML = `<div class="ex-kr">${ex.kr}</div><div class="ex-info"><div class="ex-tr">${ex.tr}</div><div class="ex-ru">${ex.ru}</div></div><div class="ex-play">🔊</div>`;
          row.onclick = () => { haptic('light'); playAudio(ex.file, ex.kr); };
          list.appendChild(row);
        });
        card.appendChild(rb);
      }
      body.appendChild(card);
    });
  };
})();
