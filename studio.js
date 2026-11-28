/* ====== K-POP LINGUA 2.0: СОЦСЕТЬ LUNA4, КОНСТРУКТОР АВАТАРА, ОНБОРДИНГ, ЧИСТАЯ ЛИГА, ПРОФИЛЬ И МАГАЗИН ====== */
(function () {
  /* ====== 1. ДАННЫЕ ГЕРОЕВ, УРОВНЕЙ, ЛИГ И КОСМЕТИКИ ====== */
  const HEROES = [
    { id: 'mina', name: 'Мина', role: 'Лидер • LUNA4', color: '#D97742', bg: '#FDE8D8', img: 'img/chars/mina.webp', initial: 'М' },
    { id: 'yuna', name: 'Юна',  role: 'Макнэ • LUNA4', color: '#52A368', bg: '#E3F3E8', img: 'img/chars/yuna.webp', initial: 'Ю' },
    { id: 'kai',  name: 'Кай',  role: 'Продюсер • LUNA4', color: '#5B7C99', bg: '#E3EDF5', img: 'img/chars/kai.webp', initial: 'К' },
    { id: 'sora', name: 'Сора', role: 'Вокал • LUNA4', color: '#B56576', bg: '#F7E4E8', img: 'img/chars/sora.webp', initial: 'С' }
  ];

  const FALLBACK_EPISODES = [
    { id: 'ep-mina-1', charId: 'mina', unlockLevel: 1, tag: 'Сеул • Приветствие', title: 'Добро пожаловать в LUNA4!', text: 'Привет! В Корее при встрече с друзьями говорят короткое 안녕, а в конце вежливых фраз почти всегда звучит 요.', phraseKr: '안녕! 화이팅!', phraseTr: '[ан-нён! файтин!]', phraseRu: 'Привет! Вперёд!', file: 'audio/annyeong.mp3' },
    { id: 'ep-yuna-1', charId: 'yuna', unlockLevel: 1, tag: 'Кофе • Хондэ', title: 'Айс-американо даже зимой', text: 'В Сеуле шутят «얼죽아» — «замёрзну, но буду пить холодный американо». Кофе здесь главный спутник репетиций!', phraseKr: '커피 최고!', phraseTr: '[кхо-пхи чхве-го!]', phraseRu: 'Кофе — супер!', file: 'audio/keopi.mp3' },
    { id: 'ep-kai-1',  charId: 'kai',  unlockLevel: 2, tag: 'Студия • Сленг', title: 'Что кричат, когда трек удался?', text: 'Когда на записи получается идеальный дубль, вся студия в один голос кричит 대박! Запомни это слово.', phraseKr: '대박!', phraseTr: '[тэ-бак!]', phraseRu: 'Вау / Супер!', file: 'audio/daebak.mp3' },
    { id: 'ep-sora-1', charId: 'sora', unlockLevel: 2, tag: 'Вокал • Фанаты', title: 'Главная фраза фансайнов', text: 'После концертов мы всегда говорим фанатам 고마워 — тёплое дружеское «спасибо».', phraseKr: '고마워!', phraseTr: '[ко-ма-во!]', phraseRu: 'Спасибо!', file: 'audio/gomawo.mp3' }
  ];

  const SOCIAL_POSTS = [
    {
      id: 'post-news-1', charId: 'mina', badge: 'НОВОСТЬ ПРОЕКТА', time: 'Сегодня',
      text: 'Мы обновили K-Pop Lingua до 2.0! Новый уютный дизайн «Сеульский латте», трек-лист уроков и наша общая соцсеть. Скоро выйдет Блок 2 (TOPIK I)!',
      kr: '최고!', tr: '[чхве-го]', ru: 'Лучший / Высший класс!', file: 'audio/choego.mp3'
    },
    {
      id: 'post-yuna-1', charId: 'yuna', badge: 'ЗАКУЛИСЬЕ', time: '2ч назад',
      text: 'После 4 часов танцев забежали в кофейню рядом с залом. Потренируй слово «Кофе» вслух!',
      kr: '커피', tr: '[кхо-пхи]', ru: 'Кофе', file: 'audio/keopi.mp3'
    },
    {
      id: 'post-kai-1', charId: 'kai', badge: 'СЛЕНГ', time: 'Вчера',
      text: 'Если в дораме или на шоу кто-то удивляется и переспрашивает — ты точно услышишь это слово:',
      kr: '진짜?', tr: '[чин-чча?]', ru: 'Правда? / Реально?', file: 'audio/jinjja.mp3'
    }
  ];

  const CHAT_SCRIPTS = {
    mina: {
      msg: 'Привет! Рада, что ты с нами в LUNA4 ☕ Как настрой на корейский сегодня?',
      replies: [
        { kr: '화이팅!', ru: 'Вперёд! (Файтин!)', file: 'audio/fighting.mp3', answer: 'Вот это настрой! Жду тебя в следующем треке 💪' },
        { kr: '고마워!', ru: 'Спасибо!', file: 'audio/gomawo.mp3', answer: 'Всегда пожалуйста! Если что — заглядывай в Словарь 📖' }
      ]
    },
    yuna: {
      msg: 'Хей! Я только с репетиции, взяла себе айс-кофе. А ты уже учил слово 커피?',
      replies: [
        { kr: '최고!', ru: 'Супер!', file: 'audio/choego.mp3', answer: 'Обожаю! После урока обязательно повтори прописи ✍️' },
        { kr: '진짜?', ru: 'Правда?', file: 'audio/jinjja.mp3', answer: 'Ага, в Сеуле без кофе никуда! Удачи в учёбе ✨' }
      ]
    },
    kai: {
      msg: 'Йоу! Свожу новый бит. Заценишь потом? Кстати, как по-корейски «Музыка»?',
      replies: [
        { kr: '음악!', ru: 'Музыка!', file: 'audio/eumak.mp3', answer: 'Точно! И помни про перенос звука: [ы-мак] 🎧' },
        { kr: '대박!', ru: 'Вау / Круто!', file: 'audio/daebak.mp3', answer: 'Рад, что зашло! Не сбавляй темп 🔥' }
      ]
    },
    sora: {
      msg: 'Привет ✨ Готовлю новую балладу. Какое корейское слово тебе нравится больше?',
      replies: [
        { kr: '사랑', ru: 'Любовь', file: 'audio/sarang.mp3', answer: 'Классика K-pop! Красивое слово 💛' },
        { kr: '별', ru: 'Звезда', file: 'audio/byeol.mp3', answer: 'Очень поэтично! Ты сам как звезда в Лиге ⭐' }
      ]
    }
  };

  /* 50 уровней профиля (5 эпох) */
  const EPOCHS = ['Репетиционный зал', 'Инди-лейбл', 'Продюсерский центр', 'Топ-агентство Сеула', 'Мировой стадион'];
  function getStudioLevel(xp) {
    const safeXp = Math.max(0, Number(xp) || 0);
    let lvl = 1;
    for (let L = 2; L <= 50; L++) {
      const need = 120 * (L - 1) + 25 * (L - 1) * (L - 1);
      if (safeXp >= need) lvl = L; else break;
    }
    const curNeed = 120 * (lvl - 1) + 25 * (lvl - 1) * (lvl - 1);
    const nextNeed = lvl < 50 ? 120 * lvl + 25 * lvl * lvl : curNeed;
    const epoch = EPOCHS[Math.min(EPOCHS.length - 1, Math.floor((lvl - 1) / 10))];
    return { lvl, epoch, curNeed, nextNeed, pct: lvl >= 50 ? 100 : Math.min(100, Math.round(((safeXp - curNeed) / Math.max(1, nextNeed - curNeed)) * 100)) };
  }
  window.getStudioLevel = getStudioLevel;

  /* Конструктор аватара (слои + косметика в Магазине) */
  const AVATAR_OPTS = {
    bg: [
      { id: 'latte', label: 'Латте', color: '#F2E5D7', price: 0 },
      { id: 'matcha', label: 'Матча', color: '#E2F0E5', price: 0 },
      { id: 'peach', label: 'Персик', color: '#FCE4D6', price: 0 },
      { id: 'seoul', label: 'Ночной Сеул', color: '#2C2A4A', price: 60 }
    ],
    hair: [
      { id: 'waves', label: 'Волны', color: '#3D312A', price: 0 },
      { id: 'bob', label: 'Каре', color: '#5C4033', price: 0 },
      { id: 'buns', label: 'Пучки', color: '#2B211E', price: 0 },
      { id: 'idol', label: 'Карамель', color: '#D97742', price: 90 }
    ],
    outfit: [
      { id: 'hoodie', label: 'Худи', color: '#D97742', price: 0 },
      { id: 'cardigan', label: 'Кардиган', color: '#52A368', price: 0 },
      { id: 'jacket', label: 'Жакет сцены', color: '#3D312A', price: 120 }
    ],
    acc: [
      { id: 'none', label: 'Нет', price: 0 },
      { id: 'clip', label: 'Заколка', price: 0 },
      { id: 'glasses', label: 'Очки айдола', price: 80 }
    ]
  };

  function renderAvatarSvg(av, size = 56) {
    const a = av || { bg: 'latte', hair: 'waves', outfit: 'hoodie', acc: 'none' };
    const bgObj = AVATAR_OPTS.bg.find(x => x.id === a.bg) || AVATAR_OPTS.bg[0];
    const hairObj = AVATAR_OPTS.hair.find(x => x.id === a.hair) || AVATAR_OPTS.hair[0];
    const outObj = AVATAR_OPTS.outfit.find(x => x.id === a.outfit) || AVATAR_OPTS.outfit[0];
    const hairPath = a.hair === 'buns'
      ? `<circle cx="18" cy="22" r="9" fill="${hairObj.color}"/><circle cx="46" cy="22" r="9" fill="${hairObj.color}"/><path d="M16 32 C16 14 48 14 48 32 Z" fill="${hairObj.color}"/>`
      : (a.hair === 'bob'
        ? `<path d="M13 38 C13 13 51 13 51 38 L48 44 L16 44 Z" fill="${hairObj.color}"/>`
        : `<path d="M12 46 C12 12 52 12 52 46 L48 54 L16 54 Z" fill="${hairObj.color}"/>`);
    const accSvg = a.acc === 'glasses'
      ? `<rect x="20" y="29" width="10" height="7" rx="3" fill="none" stroke="#3D312A" stroke-width="2"/><rect x="34" y="29" width="10" height="7" rx="3" fill="none" stroke="#3D312A" stroke-width="2"/><line x1="30" y1="32" x2="34" y2="32" stroke="#3D312A" stroke-width="2"/>`
      : (a.acc === 'clip' ? `<rect x="39" y="20" width="8" height="3" rx="1.5" fill="#D49A3A" transform="rotate(15 43 21)"/>` : '');
    return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" style="border-radius:50%;flex-shrink:0;border:2px solid var(--border);background:${bgObj.color}">
      ${hairPath}
      <path d="M14 64 C14 49 50 49 50 64 Z" fill="${outObj.color}"/>
      <rect x="28" y="42" width="8" height="9" rx="3" fill="#F6D5BE"/>
      <circle cx="32" cy="32" r="14" fill="#FDE4D2"/>
      <path d="M18 28 C20 18 44 18 46 28 C42 23 22 23 18 28 Z" fill="${hairObj.color}"/>
      <circle cx="26.5" cy="33" r="1.8" fill="#3D312A"/>
      <circle cx="37.5" cy="33" r="1.8" fill="#3D312A"/>
      <circle cx="23" cy="36.5" r="2.2" fill="#F4A59C" opacity="0.55"/>
      <circle cx="41" cy="36.5" r="2.2" fill="#F4A59C" opacity="0.55"/>
      <path d="M29 38 Q32 41 35 38" fill="none" stroke="#3D312A" stroke-width="1.8" stroke-linecap="round"/>
      ${accSvg}
    </svg>`;
  }

  /* Лиги и квесты */
  const WEEKLY_LEAGUES = [
    { name: 'Трейни', short: 'Трейни', icon: '🎧', color: '#B07D56', promoteCoins: 150, midCoins: 40 },
    { name: 'Инди', short: 'Инди', icon: '🎸', color: '#78909C', promoteCoins: 200, midCoins: 40 },
    { name: 'Восходящая группа', short: 'Восходящая', icon: '💿', color: '#5B7C99', promoteCoins: 280, midCoins: 40 },
    { name: 'Топ-лейбл', short: 'Топ-лейбл', icon: '👑', color: '#D49A3A', promoteCoins: 340, midCoins: 40 },
    { name: 'Мировой чарт', short: 'Мировой', icon: '💎', color: '#D97742', promoteCoins: 400, midCoins: 40 }
  ];
  const WEEKLY_SIZE = 30, ZONE_PROMOTE = 7, ZONE_DROP_FROM = 23;
  const STREAK_FREEZE_MAX = 2, STREAK_FREEZE_PRICE = 250;
  const XP_BOOST_PRICE = 120, XP_BOOST_MS = 24 * 60 * 60 * 1000;
  const MONTHLY_GOAL = 50;
  const MONTHS = [
    { m: 0, name: 'Янв', icon: '❄️' }, { m: 1, name: 'Фев', icon: '💜' }, { m: 2, name: 'Мар', icon: '🌸' },
    { m: 3, name: 'Апр', icon: '🎧' }, { m: 4, name: 'Май', icon: '⚡' }, { m: 5, name: 'Июн', icon: '🌟' },
    { m: 6, name: 'Июл', icon: '🌊' }, { m: 7, name: 'Авг', icon: '🔥' }, { m: 8, name: 'Сен', icon: '🎙️' },
    { m: 9, name: 'Окт', icon: '🌙' }, { m: 10, name: 'Ноя', icon: '💿' }, { m: 11, name: 'Дек', icon: '👑' }
  ];
  const MONTH_NAMES = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

  let socialSubTab = 'feed'; // 'feed' | 'chat'
  let activeChatHeroId = null;
  let lessonComboRun = 0, lessonMaxCombo = 0, comboTrackedLessonId = null;
  let pendingFreezeToast = false, pendingStreakReward = 0, pendingWeeklyResult = false, weeklyTickTimer = null;

  /* ====== 2. СТИЛИ (СЕУЛЬСКИЙ ЛАТТЕ) ====== */
  const css = document.createElement('style');
  css.textContent = `
    .app-toast {
      position: fixed; left: 50%; bottom: 84px; transform: translateX(-50%) translateY(16px);
      background: #3D312A; color: #FAF6F1; font-size: 13px; font-weight: 700; text-align: center;
      padding: 11px 16px; border-radius: 14px; max-width: calc(100vw - 32px); width: max-content;
      z-index: 9999; opacity: 0; pointer-events: none; transition: 0.22s ease; white-space: pre-line;
      box-shadow: 0 8px 24px rgba(61,49,42,0.22);
    }
    .app-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }

    /* Соцсеть LUNA4 */
    .stories-strip { display: flex; gap: 14px; overflow-x: auto; padding: 4px 2px 14px; scrollbar-width: none; }
    .stories-strip::-webkit-scrollbar { display: none; }
    .story-item { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; flex-shrink: 0; width: 66px; }
    .story-ring { width: 62px; height: 62px; border-radius: 50%; padding: 3px; border: 2.5px solid var(--border); display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
    .story-ring.unread { border-color: var(--accent); }
    .story-item:active .story-ring { transform: scale(0.92); }
    .story-ava { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; color: var(--text); }
    .story-ava img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .story-name { font-size: 11px; font-weight: 800; color: var(--text); }

    .req-card { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 10px 12px; margin-bottom: 8px; }
    .post-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 14px; margin-bottom: 12px; box-shadow: var(--shadow); }
    .post-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .post-badge { font-size: 9px; font-weight: 900; color: var(--accent); background: var(--accent-soft); padding: 3px 7px; border-radius: 6px; margin-left: auto; }
    .post-phrase { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; margin: 10px 0; cursor: pointer; }
    .post-actions { display: flex; gap: 8px; }
    .post-act-btn { border: 1px solid var(--border); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 6px 12px; font-size: 12px; font-weight: 800; cursor: pointer; }
    .post-act-btn.liked { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }

    .chat-row { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 12px; margin-bottom: 9px; cursor: pointer; }
    .chat-bubble { background: var(--surface); border: 1px solid var(--border); border-radius: 16px 16px 16px 4px; padding: 12px 14px; font-size: 13.5px; line-height: 1.45; margin-bottom: 10px; max-width: 88%; }
    .chat-bubble.me { background: var(--accent); color: #FFFFFF; border-color: var(--accent); border-radius: 16px 16px 4px 16px; margin-left: auto; }

    /* Чистая Лига */
    .lg-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .lg-title { font-size: 22px; font-weight: 900; color: var(--text); line-height: 1.15; }
    .lg-timer { font-size: 12px; font-weight: 800; color: var(--muted); margin-top: 2px; }
    .lg-info-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-size: 15px; font-weight: 900; cursor: pointer; }
    .lg-carousel { display: flex; gap: 12px; overflow-x: auto; padding: 6px 2px 14px; scroll-snap-type: x mandatory; scrollbar-width: none; }
    .lg-carousel::-webkit-scrollbar { display: none; }
    .lg-node { flex-shrink: 0; scroll-snap-align: center; display: flex; flex-direction: column; align-items: center; gap: 5px; opacity: 0.4; filter: grayscale(0.8); }
    .lg-node.past, .lg-node.cur { opacity: 1; filter: none; }
    .lg-circle { width: 64px; height: 64px; border-radius: 50%; background: var(--surface); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 26px; }
    .lg-node.cur .lg-circle { width: 78px; height: 78px; font-size: 32px; border-width: 3px; border-color: var(--c); box-shadow: 0 6px 18px rgba(61,49,42,0.08); }
    .lg-nm { font-size: 10px; font-weight: 800; color: var(--muted); }
    .lg-node.cur .lg-nm { color: var(--text); }

    .wr-row { display: flex; align-items: center; gap: 12px; padding: 10px 8px; border-bottom: 1px solid var(--border); }
    .wr-row.me { background: var(--accent-soft); border-radius: 14px; border-bottom-color: transparent; padding: 10px 12px; margin: 4px -4px; }
    .wr-pos { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: var(--muted); flex-shrink: 0; }
    .wr-pos.p1 { background: #FDE68A; color: #92400E; }
    .wr-pos.p2 { background: #E5E7EB; color: #374151; }
    .wr-pos.p3 { background: #FED7AA; color: #9A3412; }
    .wr-ava { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; color: #FFFFFF; flex-shrink: 0; }
    .wr-name { flex: 1; min-width: 0; font-size: 14px; font-weight: 800; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wr-score { font-size: 13px; font-weight: 900; color: var(--accent); white-space: nowrap; }
    .zone-line { height: 2px; border-radius: 2px; margin: 4px 0; }
    .zone-line.up { background: var(--success); }
    .zone-line.down { background: var(--danger); }

    /* Профиль и Квесты */
    .prof-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 16px; margin-bottom: 16px; box-shadow: var(--shadow); }
    .prof-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
    .prof-name { font-size: 18px; font-weight: 900; color: var(--text); }
    .prof-lvl { font-size: 12px; font-weight: 800; color: var(--accent); margin-top: 2px; }
    .prof-stats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; font-size: 11.5px; font-weight: 700; color: var(--muted); }
    .prof-actions { display: flex; gap: 8px; margin-top: 12px; }
    .prof-actions .btn { flex: 1; padding: 10px 12px; font-size: 12.5px; }

    .quest-sec { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin: 16px 0 8px; display: flex; justify-content: space-between; }
    .q-row { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 11px 13px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .q-row.done { border-color: var(--success); background: var(--success-soft); }
    .badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
    .m-badge { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 8px 4px; text-align: center; opacity: 0.45; }
    .m-badge.cur, .m-badge.got { opacity: 1; border-color: var(--accent); }

    /* Шторка Магазина и Конструктор */
    .shop-card { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 12px 14px; margin-bottom: 10px; }
    .shop-ico { width: 42px; height: 42px; border-radius: 12px; background: var(--surface-2); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    .av-opt-row { display: flex; flex-wrap: wrap; gap: 7px; margin: 6px 0 12px; }
    .av-chip { border: 1.5px solid var(--border); background: var(--surface); color: var(--text); padding: 7px 12px; border-radius: 11px; font-size: 12px; font-weight: 800; cursor: pointer; }
    .av-chip.active { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .onb-input { width: 100%; background: var(--surface); border: 1.5px solid var(--border); border-radius: 12px; padding: 11px 14px; color: var(--text); font-size: 15px; font-weight: 800; outline: none; margin: 8px 0 12px; }
    .onb-input:focus { border-color: var(--accent); }
  `;
  document.head.appendChild(css);

  /* ====== 3. ТОСТЫ ====== */
  let toastTimer = null;
  const toastEl = document.createElement('div');
  toastEl.className = 'app-toast';
  toastEl.onclick = () => toastEl.classList.remove('show');
  document.body.appendChild(toastEl);
  function showToast(msg, ms = 2600) {
    toastEl.textContent = String(msg);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }
  window.alert = function (msg) { showToast(msg); if (typeof haptic === 'function') haptic('light'); };

  /* ====== 4. СОСТОЯНИЕ И МИГРАЦИЯ ====== */
  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function weekKey() { const d = new Date(), s = new Date(d.getFullYear(), 0, 1); return `${d.getFullYear()}-W${Math.ceil((((d - s) / 86400000) + s.getDay() + 1) / 7)}`; }
  function monthKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; }
  function dayDiff(fromKey, toKey) {
    const a = String(fromKey).split('-').map(Number), b = String(toKey).split('-').map(Number);
    if (!a[0] || !b[0]) return 1;
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }

  function initStudioState() {
    if (!st.agencyName) st.agencyName = 'Трейни';
    if (!Array.isArray(st.done)) st.done = [];
    if (!Array.isArray(st.monthlyBadges)) st.monthlyBadges = [];
    if (!Array.isArray(st.readEpisodes)) st.readEpisodes = [];
    if (!Array.isArray(st.friends)) st.friends = ['mina'];
    if (!Array.isArray(st.likedPosts)) st.likedPosts = [];
    if (!st.chatReplies || typeof st.chatReplies !== 'object') st.chatReplies = {};
    if (!Array.isArray(st.ownedItems)) st.ownedItems = [];
    if (!st.avatar || typeof st.avatar !== 'object') st.avatar = { bg: 'latte', hair: 'waves', outfit: 'hoodie', acc: 'none' };

    const today = todayKey(), wk = weekKey(), mk = monthKey();
    if (typeof st.streakFreeze !== 'number' || !isFinite(st.streakFreeze)) st.streakFreeze = 0;
    st.streakFreeze = Math.max(0, Math.min(STREAK_FREEZE_MAX, Math.floor(st.streakFreeze)));

    if (!st.streak || typeof st.streak !== 'object') st.streak = { count: 1, lastDate: today };
    if (st.streak.lastDate !== today) {
      const gap = dayDiff(st.streak.lastDate, today);
      if (gap === 1) st.streak.count += 1;
      else if (gap === 2 && st.streakFreeze > 0) { st.streakFreeze -= 1; pendingFreezeToast = true; }
      else st.streak.count = 1;
      st.streak.lastDate = today;
    }

    if (typeof st.lastStreakRewardDay !== 'number') st.lastStreakRewardDay = 0;
    if (st.streak.count % 5 === 0 && st.lastStreakRewardDay !== st.streak.count) {
      st.lastStreakRewardDay = st.streak.count;
      st.coins = (Number(st.coins) || 0) + 30;
      pendingStreakReward = st.streak.count;
    }

    if (!st.daily || st.daily.date !== today) {
      st.daily = { date: today, lessons: 0, dict: 0, cards: 0, combo: 0, dictSeen: [], cardSeen: [], p1: false, p2: false, p3: false, p4: false, p5: false, claimed: false };
    }
    if (!st.weekly || st.weekly.week !== wk) st.weekly = { week: wk, days: [], claimed: false };
    if (!st.monthly || st.monthly.key !== mk) st.monthly = { key: mk, pts: 0, claimed: false };

    if (typeof st.weeklyLeague !== 'number' || !isFinite(st.weeklyLeague)) st.weeklyLeague = 0;
    st.weeklyLeague = Math.max(0, Math.min(WEEKLY_LEAGUES.length - 1, Math.floor(st.weeklyLeague)));
    if (typeof st.weeklyXp !== 'number' || !isFinite(st.weeklyXp)) st.weeklyXp = 0;
    if (!st.lastWeekKey) st.lastWeekKey = weekKeyOf(Date.now());
    ensureWeeklyRoom();
    settleWeeklyLeague();
    save(false);
  }

  /* ====== 5. ОНБОРДИНГ (2 ШАГА) И КОНСТРУКТОР АВАТАРА ====== */
  function openOnboarding() {
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    modal.classList.add('open');
    let step = 1;
    const renderStep1 = () => {
      modal.innerHTML = `
        <div class="card-box" style="width:100%;max-width:350px;margin:0;text-align:center">
          <div style="font-size:11px;font-weight:900;color:var(--accent);letter-spacing:0.8px;margin-bottom:6px">ДОБРО ПОЖАЛОВАТЬ</div>
          <h3 style="margin:0 0 12px;font-size:20px">Создай свой образ</h3>
          <div style="display:flex;justify-content:center;margin-bottom:10px" id="onb-av-preview">${renderAvatarSvg(st.avatar, 84)}</div>
          <input id="onb-name" class="onb-input" maxlength="20" placeholder="Твоё имя" value="${escapeHtml(st.agencyName === 'Трейни' ? '' : st.agencyName)}">
          <div class="av-opt-row" style="justify-content:center">
            ${AVATAR_OPTS.hair.filter(x => x.price === 0).map(x => `<button class="av-chip ${st.avatar.hair === x.id ? 'active' : ''}" data-hair="${x.id}">${x.label}</button>`).join('')}
          </div>
          <div class="av-opt-row" style="justify-content:center">
            ${AVATAR_OPTS.bg.filter(x => x.price === 0).map(x => `<button class="av-chip ${st.avatar.bg === x.id ? 'active' : ''}" data-bg="${x.id}">${x.label}</button>`).join('')}
          </div>
          <button class="btn full" id="onb-next">Продолжить →</button>
        </div>`;
      modal.querySelectorAll('[data-hair]').forEach(b => b.onclick = () => { st.avatar.hair = b.dataset.hair; renderStep1(); });
      modal.querySelectorAll('[data-bg]').forEach(b => b.onclick = () => { st.avatar.bg = b.dataset.bg; renderStep1(); });
      document.getElementById('onb-next').onclick = () => {
        const val = document.getElementById('onb-name').value.trim();
        if (val) st.agencyName = val.slice(0, 20);
        step = 2; save(); haptic('ok'); renderStep2();
      };
    };
    const renderStep2 = () => {
      const mina = HEROES[0];
      modal.innerHTML = `
        <div class="card-box" style="width:100%;max-width:350px;margin:0;text-align:center">
          <div style="font-size:11px;font-weight:900;color:var(--accent);letter-spacing:0.8px;margin-bottom:10px">ВХОДЯЩИЙ ЗАПРОС В ДРУЗЬЯ</div>
          <div style="display:flex;justify-content:center;margin-bottom:10px">${heroAvaHtml(mina, 76)}</div>
          <h3 style="margin:0 0 4px;font-size:20px">${mina.name} • LUNA4</h3>
          <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:8px 0 16px">«Привет, <b>${escapeHtml(st.agencyName)}</b>! Я Мина из группы LUNA4. Я и остальные ребята будем помогать тебе с корейским, делиться сторис из Сеула и писать в личку. Загляни в Соцсеть — остальные уже добавились!»</p>
          <button class="btn full" id="onb-accept">Принять Мину и открыть Соцсеть</button>
        </div>`;
      document.getElementById('onb-accept').onclick = () => {
        st.onboarded = true;
        if (!st.friends.includes('mina')) st.friends.push('mina');
        save(); haptic('ok'); sfx('win');
        closePackModal();
        updateSocialBadge();
        switchTab('social');
      };
    };
    renderStep1();
  }

  window.openAvatarModal = function () {
    initStudioState();
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    modal.classList.add('open', 'sheet');
    const isOwned = (opt) => opt.price === 0 || st.ownedItems.includes(opt.id);
    const renderRow = (cat, title) => `
      <div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase">${title}</div>
      <div class="av-opt-row">
        ${AVATAR_OPTS[cat].map(o => {
          const own = isOwned(o);
          const act = st.avatar[cat] === o.id;
          return `<button class="av-chip ${act ? 'active' : ''}" data-cat="${cat}" data-id="${o.id}">${o.label}${own ? '' : ` • ${o.price} 🎵`}</button>`;
        }).join('')}
      </div>`;
    modal.innerHTML = `
      <div class="sheet-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:17px;font-weight:900">Конструктор образа</div>
          <button class="close-btn" onclick="closePackModal()" style="width:32px;height:32px;font-size:14px">✕</button>
        </div>
        <div style="display:flex;justify-content:center;margin:8px 0 14px">${renderAvatarSvg(st.avatar, 88)}</div>
        ${renderRow('bg', 'Фон')}
        ${renderRow('hair', 'Причёска')}
        ${renderRow('outfit', 'Одежда')}
        ${renderRow('acc', 'Аксессуар')}
        <button class="btn full" onclick="closePackModal();renderBinder()">Готово</button>
      </div>`;
    modal.querySelectorAll('.av-chip').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.cat, id = btn.dataset.id;
        const opt = AVATAR_OPTS[cat].find(x => x.id === id);
        if (!opt) return;
        if (!isOwned(opt)) {
          if (st.coins < opt.price) return alert(`Нужно ${opt.price} 🎵!`);
          st.coins -= opt.price;
          st.ownedItems.push(opt.id);
          sfx('win'); haptic('ok');
          showToast(`Куплено: ${opt.label}!`);
        } else {
          haptic('light'); sfx('tap');
        }
        st.avatar[cat] = opt.id;
        save();
        window.openAvatarModal();
      };
    });
  };

  /* ====== 6. СОЦСЕТЬ LUNA4 (СТОРИС, ЗАЯВКИ, ЛЕНТА, ЛИЧКА) ====== */
  function heroAvaHtml(h, size = 44) {
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${h.bg};color:${h.color};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:${Math.round(size * 0.42)}px;overflow:hidden;flex-shrink:0;border:1.5px solid var(--border)">
      <img src="${h.img}" alt="${h.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <span style="display:none">${h.initial}</span>
    </div>`;
  }

  function getEpisodesList() {
    const src = (Array.isArray(window.EPISODES) && window.EPISODES.length) ? window.EPISODES : FALLBACK_EPISODES;
    const lvl = getStudioLevel(st.xp).lvl;
    return src.filter(e => (e.unlockLevel || 1) <= lvl);
  }

  function updateSocialBadge() {
    const badge = document.getElementById('social-badge');
    if (!badge) return;
    const unreadEps = getEpisodesList().filter(e => !st.readEpisodes.includes(e.id)).length;
    const pendingReqs = HEROES.filter(h => !st.friends.includes(h.id)).length;
    const unreadChats = st.friends.filter(fid => CHAT_SCRIPTS[fid] && !st.chatReplies[fid]).length;
    const total = unreadEps + pendingReqs + unreadChats;
    badge.style.display = total > 0 ? 'flex' : 'none';
    badge.textContent = total > 9 ? '9+' : String(total);
  }

  function openStoryModal(heroId) {
    const h = HEROES.find(x => x.id === heroId);
    if (!h) return;
    const eps = getEpisodesList().filter(e => e.charId === heroId);
    const ep = eps.find(e => !st.readEpisodes.includes(e.id)) || eps[eps.length - 1];
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    modal.classList.add('open');
    if (!ep) {
      modal.innerHTML = `<div class="card-box" style="width:100%;max-width:340px;text-align:center">${heroAvaHtml(h, 64)}<h3 style="margin:10px 0 6px">${h.name}</h3><p style="color:var(--muted)">Новые сторис откроются с повышением уровня!</p><button class="btn full" onclick="closePackModal()">Понятно</button></div>`;
      return;
    }
    const isRead = st.readEpisodes.includes(ep.id);
    modal.innerHTML = `
      <div class="card-box" style="width:100%;max-width:350px;margin:0">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          ${heroAvaHtml(h, 42)}
          <div style="flex:1"><div style="font-weight:900;font-size:14px">${h.name}</div><div style="font-size:11px;color:var(--accent);font-weight:800">${escapeHtml(ep.tag || 'Сторис')}</div></div>
          <button class="close-btn" onclick="closePackModal()" style="width:30px;height:30px;font-size:14px">✕</button>
        </div>
        <h3 style="margin:0 0 8px;font-size:17px">${escapeHtml(ep.title)}</h3>
        <p style="font-size:13.5px;line-height:1.5;color:var(--text)">${escapeHtml(ep.text)}</p>
        ${ep.phraseKr ? `<div class="post-phrase" id="st-phrase">
          <div><div style="font-size:18px;font-weight:900">${escapeHtml(ep.phraseKr)}</div><div style="font-size:12px;color:var(--accent);font-weight:700">${escapeHtml(ep.phraseTr || '')} • ${escapeHtml(ep.phraseRu || '')}</div></div>
          <div class="ex-play">🔊</div>
        </div>` : ''}
        <button class="btn full" id="st-claim">${isRead ? 'Закрыть' : 'Прочитано (+10 🎵)'}</button>
      </div>`;
    const ph = document.getElementById('st-phrase');
    if (ph) ph.onclick = () => { haptic('light'); playAudio(ep.file, ep.phraseKr); };
    document.getElementById('st-claim').onclick = () => {
      if (!isRead) {
        st.readEpisodes.push(ep.id);
        st.coins += 10;
        save(); haptic('ok'); sfx('win');
        showToast('Сторис прочитана! +10 🎵');
      }
      closePackModal();
      updateSocialBadge();
      window.renderSocial();
    };
  }

  window.renderSocial = function () {
    initStudioState();
    updateSocialBadge();
    const screen = document.getElementById('screen-social');
    if (!screen) return;

    if (socialSubTab === 'chat' && activeChatHeroId) {
      const h = HEROES.find(x => x.id === activeChatHeroId);
      const sc = CHAT_SCRIPTS[activeChatHeroId];
      const chosenIdx = st.chatReplies[activeChatHeroId];
      const chosen = chosenIdx != null ? sc.replies[chosenIdx] : null;
      screen.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <button class="close-btn" id="chat-back">←</button>
          ${heroAvaHtml(h, 38)}
          <div><div style="font-weight:900;font-size:15px">${h.name}</div><div style="font-size:11px;color:var(--success);font-weight:700">В сети • Bubble</div></div>
        </div>
        <div class="chat-bubble">${escapeHtml(sc.msg)}</div>
        ${chosen ? `
          <div class="chat-bubble me"><b>${escapeHtml(chosen.kr)}</b><div style="font-size:11px;opacity:0.85">${escapeHtml(chosen.ru)}</div></div>
          <div class="chat-bubble">${escapeHtml(chosen.answer)}</div>
        ` : `
          <div style="font-size:11px;font-weight:800;color:var(--muted);margin:14px 0 8px">ОТВЕТЬ НА КОРЕЙСКОМ (+5 🎵):</div>
          ${sc.replies.map((r, i) => `<button class="opt-btn" data-rep="${i}"><b>${escapeHtml(r.kr)}</b> — ${escapeHtml(r.ru)}</button>`).join('')}
        `}`;
      document.getElementById('chat-back').onclick = () => { activeChatHeroId = null; window.renderSocial(); };
      screen.querySelectorAll('[data-rep]').forEach(btn => {
        btn.onclick = () => {
          const i = Number(btn.dataset.rep);
          st.chatReplies[activeChatHeroId] = i;
          st.coins += 5;
          save(); haptic('ok'); sfx('ok');
          playAudio(sc.replies[i].file, sc.replies[i].kr);
          showToast('Ответ отправлен! +5 🎵');
          updateSocialBadge();
          window.renderSocial();
        };
      });
      return;
    }

    const eps = getEpisodesList();
    const pendingReqs = HEROES.filter(h => !st.friends.includes(h.id));

    screen.innerHTML = `
      <div class="mode-switch">
        <button class="mode-btn ${socialSubTab === 'feed' ? 'active' : ''}" id="soc-tab-feed">Лента LUNA4</button>
        <button class="mode-btn ${socialSubTab === 'chat' ? 'active' : ''}" id="soc-tab-chat">Личка</button>
      </div>
      <div id="social-body"></div>`;

    document.getElementById('soc-tab-feed').onclick = () => { haptic('light'); socialSubTab = 'feed'; activeChatHeroId = null; window.renderSocial(); };
    document.getElementById('soc-tab-chat').onclick = () => { haptic('light'); socialSubTab = 'chat'; activeChatHeroId = null; window.renderSocial(); };

    const body = document.getElementById('social-body');
    if (socialSubTab === 'feed') {
      const storiesHtml = `<div class="stories-strip">${HEROES.map(h => {
        const hasUnread = eps.some(e => e.charId === h.id && !st.readEpisodes.includes(e.id));
        return `<div class="story-item" data-story="${h.id}">
          <div class="story-ring ${hasUnread ? 'unread' : ''}">${heroAvaHtml(h, 52)}</div>
          <div class="story-name">${h.name}</div>
        </div>`;
      }).join('')}</div>`;

      const reqsHtml = pendingReqs.length ? `
        <div class="quest-sec" style="margin-top:0"><span>Заявки в друзья</span><span>${pendingReqs.length}</span></div>
        ${pendingReqs.map(h => `<div class="req-card">
          ${heroAvaHtml(h, 42)}
          <div style="flex:1"><div style="font-weight:900;font-size:14px">${h.name}</div><div style="font-size:11px;color:var(--muted)">${h.role}</div></div>
          <button class="btn" style="padding:8px 14px;font-size:12px" data-add="${h.id}">Принять</button>
        </div>`).join('')}` : '';

      const postsHtml = SOCIAL_POSTS.map(p => {
        const h = HEROES.find(x => x.id === p.charId) || HEROES[0];
        const liked = st.likedPosts.includes(p.id);
        return `<div class="post-card">
          <div class="post-head">
            ${heroAvaHtml(h, 38)}
            <div><div style="font-weight:900;font-size:14px">${h.name}</div><div style="font-size:11px;color:var(--muted)">${p.time}</div></div>
            <div class="post-badge">${p.badge}</div>
          </div>
          <div style="font-size:13.5px;line-height:1.48">${escapeHtml(p.text)}</div>
          <div class="post-phrase" data-audio="${p.file}" data-kr="${p.kr}">
            <div><div style="font-size:18px;font-weight:900">${p.kr} <span style="font-size:12px;color:var(--accent)">${p.tr}</span></div><div style="font-size:12px;color:var(--muted)">${p.ru}</div></div>
            <div class="ex-play">🔊</div>
          </div>
          <div class="post-actions">
            <button class="post-act-btn ${liked ? 'liked' : ''}" data-like="${p.id}">${liked ? '♥ Нравится' : '♡ Лайк'}</button>
          </div>
        </div>`;
      }).join('');

      body.innerHTML = storiesHtml + reqsHtml + postsHtml;
      body.querySelectorAll('[data-story]').forEach(el => el.onclick = () => { haptic('light'); openStoryModal(el.dataset.story); });
      body.querySelectorAll('[data-add]').forEach(el => el.onclick = () => {
        st.friends.push(el.dataset.add); save(); haptic('ok'); sfx('ok');
        showToast('Добавлено в друзья! Загляни в Личку 💬');
        window.renderSocial();
      });
      body.querySelectorAll('[data-like]').forEach(el => el.onclick = () => {
        const id = el.dataset.like;
        if (st.likedPosts.includes(id)) st.likedPosts = st.likedPosts.filter(x => x !== id);
        else st.likedPosts.push(id);
        save(); haptic('light'); window.renderSocial();
      });
      body.querySelectorAll('[data-audio]').forEach(el => el.onclick = () => { haptic('light'); playAudio(el.dataset.audio, el.dataset.kr); });
    } else {
      const friends = HEROES.filter(h => st.friends.includes(h.id));
      body.innerHTML = friends.map(h => {
        const sc = CHAT_SCRIPTS[h.id];
        const done = st.chatReplies[h.id] != null;
        return `<div class="chat-row" data-chat="${h.id}">
          ${heroAvaHtml(h, 46)}
          <div style="flex:1;min-width:0">
            <div style="font-weight:900;font-size:14px">${h.name}</div>
            <div style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(sc.msg)}</div>
          </div>
          ${done ? '<span style="font-size:11px;color:var(--success);font-weight:800">✓</span>' : '<span style="width:9px;height:9px;border-radius:50%;background:var(--accent)"></span>'}
        </div>`;
      }).join('');
      body.querySelectorAll('[data-chat]').forEach(el => el.onclick = () => { haptic('light'); activeChatHeroId = el.dataset.chat; window.renderSocial(); });
    }
  };

  /* ====== 7. ЧИСТАЯ ЛИГА (БЕЗ ЛИШНИХ ПЛАШЕК) ====== */
  function weekStartTs(date) {
    const d = date ? new Date(date) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)).getTime();
  }
  function weekKeyOf(ts) { return 'W-' + weekStartTs(new Date(ts)); }
  function fmtWeekLeft(ms) {
    const t = Math.max(0, Math.floor(ms / 60000));
    return `${Math.floor(t / 1440)}д ${Math.floor((t % 1440) / 60)}ч`;
  }
  function hash01(n) {
    let x = (Math.floor(n) ^ 0x9e3779b9) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x21f0aaad) >>> 0;
    x = Math.imul(x ^ (x >>> 15), 0x735a2d97) >>> 0;
    return ((x ^ (x >>> 15)) >>> 0) / 4294967296;
  }
  const BOT_NAMES = ['Hana','Minji','Soo','Jiwon','Yeri','Tae','Lumi','Sora','Nabi','Bora','Haneul','Juno','Rina','Kiki','Momo','Doyeon','Seojun','Aerin','Yoon','Nari'];
  const BOT_COLORS = ['#D97742','#52A368','#5B7C99','#B56576','#D49A3A','#7F6A93'];

  function buildWeeklyBots(seed) {
    const bots = [];
    for (let i = 0; i < WEEKLY_SIZE - 1; i++) {
      const r1 = hash01(seed + i * 7 + 1), r2 = hash01(seed + i * 13 + 5);
      const name = BOT_NAMES[Math.floor(hash01(seed + i * 31 + 3) * BOT_NAMES.length) % BOT_NAMES.length] + '_' + (10 + (i * 3));
      bots.push({ id: 'bot-' + i, name, initial: name[0].toUpperCase(), color: BOT_COLORS[i % BOT_COLORS.length], cap: 60 + Math.round(r1 * 980), rate: 0.45 + r2 * 1.5 });
    }
    return bots;
  }
  function botXp(bot, weekStart) {
    const p = Math.min(1, Math.max(0, Date.now() - weekStart) / (7 * 86400000));
    return Math.round(bot.cap * Math.pow(Math.min(1, p * bot.rate), 0.9));
  }
  function ensureWeeklyRoom() {
    const wk = weekKeyOf(Date.now()), w = st.weeklyRoom;
    if (w && w.week === wk && Array.isArray(w.bots) && w.bots.length === WEEKLY_SIZE - 1) return w;
    const seed = (w && w.seed) || st.weeklyRoomSeed || Math.floor(Math.random() * 2e9);
    st.weeklyRoomSeed = seed;
    st.weeklyRoom = { week: wk, seed, bots: buildWeeklyBots(seed) };
    return st.weeklyRoom;
  }
  function weeklyBoard() {
    const ws = weekStartTs(), room = ensureWeeklyRoom();
    const rows = room.bots.map(b => ({ id: b.id, name: b.name, initial: b.initial, color: b.color, xp: botXp(b, ws) }));
    rows.push({ id: 'me', me: true, name: st.agencyName || 'Трейни', xp: Math.max(0, Math.round(st.weeklyXp || 0)) });
    rows.sort((a, b) => (b.xp - a.xp) || (a.me ? -1 : b.me ? 1 : 0));
    rows.forEach((r, i) => { r.pos = i + 1; });
    return rows;
  }
  function settleWeeklyLeague() {
    const curKey = weekKeyOf(Date.now()), prev = st.lastWeekKey;
    st.lastWeekKey = curKey;
    if (!prev || prev === curKey) return;
    const idx = st.weeklyLeague || 0, L = WEEKLY_LEAGUES[idx];
    const bots = (st.weeklyRoom && st.weeklyRoom.bots) || buildWeeklyBots(st.weeklyRoomSeed || 1);
    const pos = 1 + bots.filter(b => b.cap > (st.weeklyXp || 0)).length;
    if (pos <= ZONE_PROMOTE) { st.weeklyLeague = Math.min(WEEKLY_LEAGUES.length - 1, idx + 1); st.coins += L.promoteCoins; pendingWeeklyResult = `🎉 Место #${pos}! Повышение и +${L.promoteCoins} 🎵`; }
    else if (pos >= ZONE_DROP_FROM && idx > 0) { st.weeklyLeague = idx - 1; st.coins += L.midCoins; pendingWeeklyResult = `Итог недели: место #${pos}. +${L.midCoins} 🎵`; }
    else { st.coins += L.midCoins; pendingWeeklyResult = `Лига сохранена (место #${pos}). +${L.midCoins} 🎵`; }
    st.weeklyXp = 0; delete st.weeklyRoom; ensureWeeklyRoom(); save(false);
  }

  window.openLeaguePrizes = function () {
    const L = WEEKLY_LEAGUES[st.weeklyLeague || 0];
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.innerHTML = `
      <div class="card-box" style="width:100%;max-width:340px;margin:0">
        <h3 style="margin:0 0 6px">${L.icon} Лига «${L.name}»</h3>
        <p style="font-size:12px;color:var(--muted)">Итоги подводятся каждый понедельник в 00:00.</p>
        <div class="q-row done"><span>▲ 1–7 место (Повышение)</span><b>+${L.promoteCoins} 🎵</b></div>
        <div class="q-row"><span>8–22 место (Удержание)</span><b>+${L.midCoins} 🎵</b></div>
        ${st.weeklyLeague > 0 ? '<div class="q-row"><span>▼ 23–30 место (Понижение)</span><b>—</b></div>' : ''}
        <button class="btn full" style="margin-top:10px" onclick="closePackModal()">Понятно</button>
      </div>`;
  };

  window.renderRank = function () {
    initStudioState();
    const screen = document.getElementById('screen-rank');
    if (!screen) return;
    const idx = st.weeklyLeague || 0, L = WEEKLY_LEAGUES[idx];
    const rows = weeklyBoard();
    const left = weekStartTs() + 7 * 86400000 - Date.now();

    const carousel = WEEKLY_LEAGUES.map((lg, i) => `
      <div class="lg-node ${i === idx ? 'cur' : (i < idx ? 'past' : '')}" style="--c:${lg.color}">
        <div class="lg-circle">${lg.icon}</div>
        <div class="lg-nm">${lg.short}</div>
      </div>`).join('');

    let listHtml = '';
    rows.forEach(r => {
      const pCls = r.pos <= 3 ? 'p' + r.pos : '';
      const ava = r.me ? renderAvatarSvg(st.avatar, 40) : `<div class="wr-ava" style="background:${r.color}">${r.initial}</div>`;
      listHtml += `<div class="wr-row ${r.me ? 'me' : ''}">
        <div class="wr-pos ${pCls}">${r.pos}</div>
        ${ava}
        <div class="wr-name">${escapeHtml(r.name)}${r.me ? ' (ты)' : ''}</div>
        <div class="wr-score">${r.xp} XP</div>
      </div>`;
      if (r.pos === ZONE_PROMOTE) listHtml += '<div class="zone-line up"></div>';
      if (idx > 0 && r.pos === ZONE_DROP_FROM - 1) listHtml += '<div class="zone-line down"></div>';
    });

    screen.innerHTML = `
      <div class="lg-top">
        <div><div class="lg-title">${L.icon} ${L.name}</div><div class="lg-timer" id="wr-timer">⏱️ ${fmtWeekLeft(left)}</div></div>
        <button class="lg-info-btn" onclick="openLeaguePrizes()" aria-label="Награды">ⓘ</button>
      </div>
      <div class="lg-carousel">${carousel}</div>
      <div>${listHtml}</div>`;

    if (weeklyTickTimer) clearInterval(weeklyTickTimer);
    weeklyTickTimer = setInterval(() => {
      const t = document.getElementById('wr-timer');
      if (!t || !document.getElementById('screen-rank')?.classList.contains('active')) { clearInterval(weeklyTickTimer); return; }
      t.textContent = '⏱️ ' + fmtWeekLeft(weekStartTs() + 7 * 86400000 - Date.now());
    }, 30000);
  };

  /* ====== 8. ПРОФИЛЬ И КВЕСТЫ ====== */
  const DAILY_QUESTS = [
    { title: 'Первый шаг', desc: 'Завершить 1 урок', coins: 20, xp: 30, goal: 1, flag: 'p1', val: d => d.lessons },
    { title: 'Чистый бит', desc: 'Комбо 3+ верных ответа подряд', coins: 15, xp: 25, goal: 3, flag: 'p2', val: d => d.combo },
    { title: 'Словарный запас', desc: 'Перевернуть 5 карточек в Словаре', coins: 15, xp: 20, goal: 5, flag: 'p3', val: d => d.cards },
    { title: 'Идеальный слух', desc: 'Завершить шаг с диктантом/аудио', coins: 15, xp: 25, goal: 1, flag: 'p4', val: d => d.dict },
    { title: 'Двойной камбэк', desc: 'Завершить второй урок за день', coins: 25, xp: 40, goal: 2, flag: 'p5', val: d => d.lessons }
  ];
  function isQuestDone(q) { return !!st.daily[q.flag] || q.val(st.daily) >= q.goal; }
  function syncQuestProgress() {
    let gained = 0;
    DAILY_QUESTS.forEach(q => { if (isQuestDone(q) && !st.daily[q.flag]) { st.daily[q.flag] = true; gained++; st.coins += q.coins; addWeeklyXp(q.xp); } });
    if (gained) st.monthly.pts += gained;
    if (st.monthly.pts >= MONTHLY_GOAL) {
      const k = monthKey();
      if (!st.monthlyBadges.includes(k)) { st.monthlyBadges.push(k); showToast('🏅 Квест месяца закрыт! Бейдж в архиве.'); }
    }
    if (gained) save(false);
  }
  window.trackQuest = function (type, value) {
    initStudioState();
    const d = st.daily;
    if (type === 'lesson') { d.lessons++; const td = todayKey(); if (!st.weekly.days.includes(td)) st.weekly.days.push(td); }
    else if (type === 'dict') { if (value == null || !d.dictSeen.includes(value)) { if (value != null) d.dictSeen.push(value); d.dict++; } }
    else if (type === 'card') { if (value == null || !d.cardSeen.includes(value)) { if (value != null) d.cardSeen.push(value); d.cards++; } }
    else if (type === 'combo') { d.combo = Math.max(d.combo || 0, Number(value) || 0); }
    syncQuestProgress(); save(false);
  };

  window.renderBinder = function () {
    initStudioState();
    syncQuestProgress();
    const screen = document.getElementById('screen-binder');
    if (!screen) return;
    const lv = getStudioLevel(st.xp);
    const vocab = Array.isArray(window.VOCAB) ? window.VOCAB : [];
    const rules = Array.isArray(window.RULES) ? window.RULES : [];
    const learnedW = vocab.filter(w => st.done.includes(w.l)).length;
    const learnedR = rules.filter(r => st.done.includes(r.l)).length;
    const dCnt = DAILY_QUESTS.filter(isQuestDone).length;
    const wCnt = Math.min(st.weekly.days.length, 5);
    const curMo = new Date().getMonth(), curYr = new Date().getFullYear();

    screen.innerHTML = `
      <div class="prof-card">
        <div class="prof-top">
          ${renderAvatarSvg(st.avatar, 66)}
          <div style="flex:1;min-width:0">
            <div class="prof-name">${escapeHtml(st.agencyName)}</div>
            <div class="prof-lvl">Уровень ${lv.lvl} • ${lv.epoch}</div>
            <div class="bar-bg" style="margin-top:6px"><div class="bar-fill" style="width:${lv.pct}%"></div></div>
          </div>
        </div>
        <div class="prof-stats">
          <span>🔥 Серия: <b>${st.streak.count} дн.</b></span>
          <span>❄️ Заморозки: <b>${st.streakFreeze}/${STREAK_FREEZE_MAX}</b></span>
          <span>📖 Слов: <b>${learnedW}/${vocab.length}</b></span>
          <span>📑 Правил: <b>${learnedR}/${rules.length}</b></span>
        </div>
        <div class="prof-actions">
          <button class="btn" onclick="openAvatarModal()">Изменить образ</button>
          <button class="btn ghost" id="prof-rename">Сменить имя</button>
        </div>
      </div>

      <div class="quest-sec"><span>Ежедневные квесты</span><span>${dCnt}/5</span></div>
      ${DAILY_QUESTS.map(q => `<div class="q-row ${isQuestDone(q) ? 'done' : ''}">
        <div><div style="font-size:13px;font-weight:800">${isQuestDone(q) ? '✓ ' : ''}${q.title}</div><div style="font-size:11px;color:var(--muted)">${q.desc} • +${q.coins} 🎵</div></div>
        <div style="font-size:12px;font-weight:900;color:var(--accent)">${Math.min(q.val(st.daily), q.goal)}/${q.goal}</div>
      </div>`).join('')}
      ${dCnt === 5 && !st.daily.claimed ? '<button class="btn gold full" id="claim-daily">Забрать бонус дня (+50 🎵 • +50 XP)</button>' : ''}

      <div class="quest-sec"><span>Недельный челлендж</span><span>${wCnt}/5 дней</span></div>
      <div class="q-row ${st.weekly.claimed ? 'done' : ''}">
        <div><div style="font-size:13px;font-weight:800">5 дней с уроками → +40 🎵</div></div>
        ${wCnt >= 5 && !st.weekly.claimed ? '<button class="btn gold" style="padding:7px 12px;font-size:12px" id="claim-weekly">Забрать</button>' : `<span style="font-size:12px;font-weight:800;color:var(--muted)">${st.weekly.claimed ? '✓' : wCnt + '/5'}</span>`}
      </div>

      <div class="quest-sec"><span>Квест ${MONTH_NAMES[curMo]}</span><span>${Math.min(st.monthly.pts, MONTHLY_GOAL)}/${MONTHLY_GOAL}</span></div>
      <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, Math.round((st.monthly.pts / MONTHLY_GOAL) * 100))}%"></div></div>
      <div class="badges-grid">${MONTHS.map(mo => {
        const got = st.monthlyBadges.includes(`${curYr}-${mo.m}`), isCur = mo.m === curMo;
        return `<div class="m-badge ${got ? 'got' : (isCur ? 'cur' : '')}"><div style="font-size:18px">${(got || isCur) ? mo.icon : '🔒'}</div><div style="font-size:10px;font-weight:800;margin-top:2px">${mo.name}</div></div>`;
      }).join('')}</div>`;

    document.getElementById('prof-rename').onclick = () => {
      const modal = document.getElementById('pack-modal');
      modal.classList.add('open');
      modal.innerHTML = `<div class="card-box" style="width:100%;max-width:330px;margin:0">
        <h3>Новое имя</h3>
        <input id="rn-in" class="onb-input" maxlength="20" value="${escapeHtml(st.agencyName)}">
        <button class="btn full" id="rn-ok">Сохранить</button>
      </div>`;
      document.getElementById('rn-ok').onclick = () => {
        const v = document.getElementById('rn-in').value.trim();
        if (v) { st.agencyName = v.slice(0, 20); save(); closePackModal(); window.renderBinder(); }
      };
    };
    const cd = document.getElementById('claim-daily');
    if (cd) cd.onclick = () => { st.daily.claimed = true; st.coins += 50; st.xp += 50; addWeeklyXp(50); save(); haptic('ok'); sfx('win'); fireConfetti(); showToast('+50 🎵 и +50 XP!'); window.renderBinder(); };
    const cw = document.getElementById('claim-weekly');
    if (cw) cw.onclick = () => { st.weekly.claimed = true; st.coins += 40; save(); haptic('ok'); sfx('win'); fireConfetti(); showToast('+40 🎵 за неделю!'); window.renderBinder(); };
  };

  /* ====== 9. ШТОРКА МАГАЗИНА (ИЗ ШАПКИ) ====== */
  window.showStreakInfo = function () {
    initStudioState();
    showToast(`🔥 Серия: ${st.streak.count} дн.\n❄️ Заморозки: ${st.streakFreeze}/${STREAK_FREEZE_MAX}\nЗаморозка спасает серию при пропуске 1 дня.`, 3200);
  };

  window.openShopSheet = function (toastMsg) {
    initStudioState(); syncResources();
    const modal = document.getElementById('pack-modal');
    if (!modal) return;
    const boostOn = !!(st.xpBoostUntil && Date.now() < st.xpBoostUntil);
    const waitTxt = st.energy >= MAX_ENERGY ? 'Полный заряд' : `+1 через ${fmtWait(getEnergyRegenMs() - (Date.now() - st.lastEnergyTs))}`;
    modal.classList.add('open', 'sheet');
    modal.innerHTML = `
      <div class="sheet-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-size:18px;font-weight:900">Магазин • 🎵 ${st.coins}</div>
          <button class="close-btn" onclick="closePackModal()" style="width:32px;height:32px;font-size:14px">✕</button>
        </div>
        <div class="shop-card">
          <div class="shop-ico">👑</div>
          <div style="flex:1"><div style="font-weight:900;font-size:14px">VIP-статус</div><div style="font-size:11px;color:var(--muted)">Безлимит лайтстиков + 2 заморозки</div></div>
          <button class="btn ghost" style="padding:8px 10px;font-size:11px" onclick="alert('Оплата Telegram Stars скоро появится!')">Stars</button>
        </div>
        <div class="shop-card">
          <div class="shop-ico">⚡</div>
          <div style="flex:1"><div style="font-weight:900;font-size:14px">Удвоитель XP (24ч)</div><div style="font-size:11px;color:var(--muted)">${boostOn ? 'Уже активен!' : '×2 XP за уроки и задания'}</div></div>
          <button class="btn" style="padding:8px 12px;font-size:12px" id="sh-boost" ${boostOn ? 'disabled' : ''}>${boostOn ? 'Активен' : XP_BOOST_PRICE + ' 🎵'}</button>
        </div>
        <div class="shop-card">
          <div class="shop-ico">❄️</div>
          <div style="flex:1"><div style="font-weight:900;font-size:14px">Заморозка стрика</div><div style="font-size:11px;color:var(--muted)">В запасе ${st.streakFreeze}/${STREAK_FREEZE_MAX}</div></div>
          <button class="btn" style="padding:8px 12px;font-size:12px" id="sh-freeze" ${st.streakFreeze >= STREAK_FREEZE_MAX ? 'disabled' : ''}>${st.streakFreeze >= STREAK_FREEZE_MAX ? 'Макс.' : STREAK_FREEZE_PRICE + ' 🎵'}</button>
        </div>
        <div class="shop-card" style="flex-wrap:wrap">
          <div class="shop-ico">⚡</div>
          <div style="flex:1"><div style="font-weight:900;font-size:14px">Лайтстики • ${st.energy}/${MAX_ENERGY}</div><div style="font-size:11px;color:var(--muted)">${waitTxt}</div></div>
          <div style="display:flex;gap:8px;width:100%;margin-top:4px">
            <button class="btn ghost" style="flex:1;padding:9px;font-size:12px" onclick="buyEnergy(1,30)" ${st.energy >= MAX_ENERGY ? 'disabled' : ''}>+1 (30 🎵)</button>
            <button class="btn" style="flex:1;padding:9px;font-size:12px" onclick="buyEnergy(5,100)" ${st.energy >= MAX_ENERGY ? 'disabled' : ''}>5/5 (100 🎵)</button>
          </div>
        </div>
        <div class="shop-card" style="cursor:pointer" onclick="openAvatarModal()">
          <div class="shop-ico">✨</div>
          <div style="flex:1"><div style="font-weight:900;font-size:14px">Гардероб образа</div><div style="font-size:11px;color:var(--muted)">Очки айдола, жакет сцены, Ночной Сеул</div></div>
          <span style="font-weight:900;color:var(--accent)">Открыть ›</span>
        </div>
      </div>`;
    const bb = document.getElementById('sh-boost');
    if (bb) bb.onclick = () => {
      if (st.coins < XP_BOOST_PRICE) return alert(`Нужно ${XP_BOOST_PRICE} 🎵.`);
      st.coins -= XP_BOOST_PRICE; st.xpBoostUntil = Date.now() + XP_BOOST_MS;
      save(); haptic('ok'); sfx('win'); showToast('⚡ Бустер ×2 XP включён на 24 часа!'); window.openShopSheet();
    };
    const bf = document.getElementById('sh-freeze');
    if (bf) bf.onclick = () => {
      if (st.coins < STREAK_FREEZE_PRICE) return alert(`Нужно ${STREAK_FREEZE_PRICE} 🎵.`);
      st.coins -= STREAK_FREEZE_PRICE; st.streakFreeze++;
      save(); haptic('ok'); sfx('win'); showToast('❄️ Заморозка куплена!'); window.openShopSheet();
    };
    if (toastMsg) showToast(toastMsg);
  };
  window.openQuickShop = window.openShopSheet;

  /* ====== 10. ТРЕКИНГ УРОКОВ ДЛЯ КВЕСТОВ ====== */
  const origRenderStep = window.renderStep;
  window.renderStep = function () {
    origRenderStep();
    const body = document.getElementById('study-body'), s = queue[qIdx];
    if (body && s && (s.type === 'draw' || s.type === 'listen' || s.type === 'listen_build')) {
      body.querySelectorAll('.feedback-bar.ok').forEach(fb => {
        if (fb.dataset.dictTracked) return;
        fb.dataset.dictTracked = '1';
        if (typeof window.awardDictationStep === 'function') window.awardDictationStep();
      });
    }
    if (!body || !s || (s.type !== 'choice' && s.type !== 'listen')) return;
    const lid = curL ? curL.id : null;
    if (lid !== comboTrackedLessonId) { comboTrackedLessonId = lid; lessonComboRun = 0; lessonMaxCombo = 0; }
    body.querySelectorAll('.opt-btn').forEach((btn, idx) => {
      const orig = btn.onclick;
      btn.onclick = () => {
        if (idx === s.correct) { lessonComboRun++; if (lessonComboRun > lessonMaxCombo) lessonMaxCombo = lessonComboRun; }
        else lessonComboRun = 0;
        if (typeof orig === 'function') orig();
      };
    });
  };

  const origFinishLesson = window.finishLesson;
  window.finishLesson = function () {
    if (!curL) return origFinishLesson();
    const passed = !(curL.isExam && mistakes > 4);
    origFinishLesson();
    if (!passed) return;
    initStudioState();
    window.trackQuest('lesson');
    if (lessonMaxCombo > 0) window.trackQuest('combo', lessonMaxCombo);
    lessonComboRun = 0; lessonMaxCombo = 0; comboTrackedLessonId = null;
    syncResources(); updateSocialBadge(); save();
  };

  /* ====== 11. СТАРТ ====== */
  function bootStudio() {
    initStudioState();
    syncResources();
    updateSocialBadge();
    renderLessons();
    if (!st.onboarded) setTimeout(openOnboarding, 250);
    if (pendingFreezeToast) { pendingFreezeToast = false; showToast(`❄️ Заморозка спасла серию 🔥 ${st.streak.count} дн.!`, 3200); }
    if (pendingStreakReward) { const r = pendingStreakReward; pendingStreakReward = 0; setTimeout(() => showToast(`🔥 Серия ${r} дней! +30 🎵`, 3000), 600); }
    if (pendingWeeklyResult) { const m = pendingWeeklyResult; pendingWeeklyResult = false; setTimeout(() => showToast(m, 3500), 1200); }
  }

  if (window.AppData) window.AppData.whenReady(bootStudio);
  else bootStudio();
})();
