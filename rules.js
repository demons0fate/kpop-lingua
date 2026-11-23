/* Справочник RULES загружается из data/rules.json через data-loader.js. */

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

    const rules = Array.isArray(window.RULES) ? window.RULES : [];
    const body = document.getElementById('vocab-body');
    if (!rules.length) {
      document.getElementById('vocab-count').innerText = '0 / 0';
      body.innerHTML = '<div class="card-box" style="text-align:center">Загружаю справочник…</div>';
      return;
    }

    const unlocked = rules.filter(r => st.done.includes(r.l));
    document.getElementById('vocab-count').innerText = `${unlocked.length} / ${rules.length}`;
    body.innerHTML = '';

    if (!unlocked.length) {
      body.innerHTML = `<div class="card-box" style="text-align:center;padding:24px 16px"><h3>Справочник пока закрыт</h3><p style="color:var(--muted)">Пройди <b>Урок 1</b> — здесь начнут собираться все правила фонетики и грамматики, чтобы ты мог в любой момент их повторить.</p></div>`;
    }

    rules.forEach(r => {
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
