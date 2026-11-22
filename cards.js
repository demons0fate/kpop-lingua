const ERAS = [
  { id: "trainee", name: "Эра 1: Трейни",       stageIdx: 0, color: "#cfd8dc", desc: "Зал практики и первые шаги" },
  { id: "debut",   name: "Эра 2: Дебют",        stageIdx: 1, color: "#ffd700", desc: "Клуб в Сеуле • Первые софиты" },
  { id: "neon",    name: "Эра 3: Неон Сеула",   stageIdx: 2, color: "#00e5ff", desc: "Музыкальное шоу • Ночной драйв" },
  { id: "tour",    name: "Эра 4: Мировой тур",  stageIdx: 3, color: "#ff2e93", desc: "Стадион • Легенды сцены" }
];

const CARDS = [
  /* ====== ЭРА 1: ТРЕЙНИ (Доступна со старта) ====== */
  {
    id: 1, album: "trainee", roleKey: "vocal", role: "Вокал",
    name: "Мина • Зал практики", r: "R", img: "img/cards/mina_r.webp", tag: "MN",
    grad: "linear-gradient(145deg, #2d1b4e, #18112b)",
    bonusType: "xp", bonusVal: 10, bonusText: "Щит от ошибок в уроке",
    quoteKr: "안녕! 오늘도 힘내!", quoteRu: "Привет! Держись и сегодня!", quoteFile: "audio/annyeong.mp3"
  },
  {
    id: 2, album: "trainee", roleKey: "dance", role: "Танцор",
    name: "Кай • Зеркальный зал", r: "R", img: "img/cards/kai_r.webp", tag: "KI",
    grad: "linear-gradient(145deg, #162a4a, #12152b)",
    bonusType: "energy", bonusVal: 10, bonusText: "Комбо XP + быстрее энергия",
    quoteKr: "화이팅!", quoteRu: "Вперёд! Удачи!", quoteFile: "audio/fighting.mp3"
  },
  {
    id: 3, album: "trainee", roleKey: "rap", role: "Рэпер",
    name: "Сора • Ночная студия", r: "SR", img: "img/cards/sora_sr.webp", tag: "SR",
    grad: "linear-gradient(145deg, #42185c, #1c1030)",
    bonusType: "coins", bonusVal: 15, bonusText: "Шанс ×2 микрофонов",
    quoteKr: "고마워!", quoteRu: "Спасибо тебе!", quoteFile: "audio/gomawo.mp3"
  },
  {
    id: 4, album: "trainee", roleKey: "visual", role: "Вижуал",
    name: "Юна • Кафе после репетиции", r: "R", img: "img/cards/yuna_r.webp", tag: "YN",
    grad: "linear-gradient(145deg, #1b3b42, #111b29)",
    bonusType: "luck", bonusVal: 5, bonusText: "Подсказка 50/50 в уроках",
    quoteKr: "진짜?", quoteRu: "Правда?", quoteFile: "audio/jinjja.mp3"
  },
  {
    id: 9, album: "trainee", roleKey: "vocal", role: "Вокал",
    name: "Хару • Акустика на крыше", r: "R", img: "img/cards/haru_r.webp", tag: "HR",
    grad: "linear-gradient(145deg, #243352, #131626)",
    bonusType: "xp", bonusVal: 12, bonusText: "Щит от ошибок в уроке",
    quoteKr: "노래!", quoteRu: "Песня!", quoteFile: "audio/norae.mp3"
  },

  /* ====== ЭРА 2: ДЕБЮТ (Площадка: Клуб в Сеуле) ====== */
  {
    id: 5, album: "debut", roleKey: "vocal", role: "Вокал",
    name: "Мина • Сцена Дебюта", r: "SSR", img: "img/cards/debut_ssr.webp", tag: "DB",
    grad: "linear-gradient(145deg, #52380c, #24122e)",
    bonusType: "xp", bonusVal: 20, bonusText: "Щит от ошибок в уроке",
    quoteKr: "최고!", quoteRu: "Ты лучший!", quoteFile: "audio/choego.mp3"
  },
  {
    id: 6, album: "debut", roleKey: "dance", role: "Танцор",
    name: "Кай • Неоновый софит", r: "SR", img: "img/cards/kai_sr.webp", tag: "KS",
    grad: "linear-gradient(145deg, #123c52, #1a1030)",
    bonusType: "energy", bonusVal: 15, bonusText: "Комбо XP + быстрее энергия",
    quoteKr: "대박!", quoteRu: "Просто супер!", quoteFile: "audio/daebak.mp3"
  },
  {
    id: 7, album: "debut", roleKey: "rap", role: "Рэпер",
    name: "Джин • Золотой микрофон", r: "SR", img: "img/cards/jin_sr.webp", tag: "JN",
    grad: "linear-gradient(145deg, #4a153b, #1d1026)",
    bonusType: "coins", bonusVal: 20, bonusText: "Шанс ×2 микрофонов",
    quoteKr: "노래!", quoteRu: "Песня!", quoteFile: "audio/norae.mp3"
  },
  {
    id: 8, album: "debut", roleKey: "visual", role: "Вижуал",
    name: "Юна • Золотой Лайтстик", r: "SSR", img: "img/cards/lightstick_ssr.webp", tag: "LS",
    grad: "linear-gradient(145deg, #591642, #38280b)",
    bonusType: "luck", bonusVal: 10, bonusText: "Подсказка 50/50 в уроках",
    quoteKr: "사랑해!", quoteRu: "Я тебя люблю!", quoteFile: "audio/saranghae.mp3"
  },
  {
    id: 10, album: "debut", roleKey: "dance", role: "Танцор",
    name: "Тэян • Первый фанкам", r: "SR", img: "img/cards/taeyang_sr.webp", tag: "TY",
    grad: "linear-gradient(145deg, #4a2315, #1b1124)",
    bonusType: "energy", bonusVal: 15, bonusText: "Комбо XP + быстрее энергия",
    quoteKr: "화이팅!", quoteRu: "Вперёд!", quoteFile: "audio/fighting.mp3"
  },

  /* ====== ЭРА 3: НЕОН СЕУЛА (Площадка: Музыкальное шоу) ====== */
  {
    id: 11, album: "neon", roleKey: "vocal", role: "Вокал",
    name: "Арин • Кибер-сирена", r: "SR", img: "img/cards/arin_sr.webp", tag: "AR",
    grad: "linear-gradient(145deg, #0d3b52, #2b1047)",
    bonusType: "xp", bonusVal: 22, bonusText: "Щит от ошибок в уроке",
    quoteKr: "별!", quoteRu: "Звезда!", quoteFile: "audio/byeol.mp3"
  },
  {
    id: 12, album: "neon", roleKey: "dance", role: "Танцор",
    name: "Рен • Улицы Каннама", r: "SR", img: "img/cards/ren_sr.webp", tag: "RN",
    grad: "linear-gradient(145deg, #10423b, #14122b)",
    bonusType: "energy", bonusVal: 18, bonusText: "Комбо XP + быстрее энергия",
    quoteKr: "서울!", quoteRu: "Сеул!", quoteFile: "audio/seoul.mp3"
  },
  {
    id: 13, album: "neon", roleKey: "rap", role: "Рэпер",
    name: "Сора • Неоновый бит", r: "SSR", img: "img/cards/sora_neon.webp", tag: "SN",
    grad: "linear-gradient(145deg, #52104b, #122042)",
    bonusType: "coins", bonusVal: 25, bonusText: "Шанс ×2 микрофонов",
    quoteKr: "대박!", quoteRu: "Вау, супер!", quoteFile: "audio/daebak.mp3"
  },
  {
    id: 14, album: "neon", roleKey: "visual", role: "Вижуал",
    name: "Лиа • Ночной объектив", r: "SR", img: "img/cards/lia_sr.webp", tag: "LA",
    grad: "linear-gradient(145deg, #36185c, #0f2b3d)",
    bonusType: "luck", bonusVal: 12, bonusText: "Подсказка 50/50 в уроках",
    quoteKr: "미소!", quoteRu: "Улыбка!", quoteFile: "audio/miso.mp3"
  },
  {
    id: 15, album: "neon", roleKey: "rap", role: "Рэпер",
    name: "Джин • Андеграунд", r: "SSR", img: "img/cards/jin_neon.webp", tag: "JG",
    grad: "linear-gradient(145deg, #47142b, #121c38)",
    bonusType: "coins", bonusVal: 25, bonusText: "Шанс ×2 микрофонов",
    quoteKr: "음악!", quoteRu: "Музыка!", quoteFile: "audio/eumak.mp3"
  },

  /* ====== ЭРА 4: МИРОВОЙ ТУР (Площадка: Стадион) ====== */
  {
    id: 16, album: "tour", roleKey: "vocal", role: "Вокал",
    name: "Мина • Королева чарта", r: "SSR", img: "img/cards/mina_tour.webp", tag: "MQ",
    grad: "linear-gradient(145deg, #63440a, #3b0f3a)",
    bonusType: "xp", bonusVal: 30, bonusText: "Щит от ошибок в уроке",
    quoteKr: "사랑해!", quoteRu: "Я тебя люблю!", quoteFile: "audio/saranghae.mp3"
  },
  {
    id: 17, album: "tour", roleKey: "dance", role: "Танцор",
    name: "Кай • Главная сцена", r: "SSR", img: "img/cards/kai_tour.webp", tag: "KT",
    grad: "linear-gradient(145deg, #0d4a5e, #361042)",
    bonusType: "energy", bonusVal: 22, bonusText: "Комбо XP + быстрее энергия",
    quoteKr: "최고!", quoteRu: "Лучший!", quoteFile: "audio/choego.mp3"
  },
  {
    id: 18, album: "tour", roleKey: "rap", role: "Рэпер",
    name: "Зико • Золотой зал", r: "SSR", img: "img/cards/zico_tour.webp", tag: "ZK",
    grad: "linear-gradient(145deg, #591c12, #291038)",
    bonusType: "coins", bonusVal: 30, bonusText: "Шанс ×2 микрофонов",
    quoteKr: "세계!", quoteRu: "Весь мир!", quoteFile: "audio/segye.mp3"
  },
  {
    id: 19, album: "tour", roleKey: "visual", role: "Вижуал",
    name: "Юна • Мировой лайтстик", r: "SSR", img: "img/cards/yuna_tour.webp", tag: "YT",
    grad: "linear-gradient(145deg, #5c1045, #0e384d)",
    bonusType: "luck", bonusVal: 15, bonusText: "Подсказка 50/50 в уроках",
    quoteKr: "보고 싶어!", quoteRu: "Скучаю по тебе!", quoteFile: "audio/bogoshipo.mp3"
  },
  {
    id: 20, album: "tour", roleKey: "vocal", role: "Вокал",
    name: "Соён • Гранд-финал", r: "SSR", img: "img/cards/soyeon_tour.webp", tag: "SY",
    grad: "linear-gradient(145deg, #663d0b, #14364a)",
    bonusType: "xp", bonusVal: 30, bonusText: "Щит от ошибок в уроке",
    quoteKr: "고마워!", quoteRu: "Спасибо!", quoteFile: "audio/gomawo.mp3"
  }
];
