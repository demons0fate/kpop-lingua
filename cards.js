const CARDS = [
  // ЭРА: ТРЕЙНИ
  {
    id: 1, album: "trainee", roleKey: "vocal", role: "Главный вокал",
    name: "Мина • Зал практики", r: "R", img: "img/cards/mina_r.webp", tag: "MN",
    grad: "linear-gradient(145deg, #2d1b4e, #18112b)",
    bonusType: "xp", bonusVal: 10, bonusText: "+10% XP за уроки",
    quoteKr: "안녕! 오늘도 힘내!", quoteRu: "Привет! Держись и сегодня!", quoteFile: "audio/annyeong.mp3"
  },
  {
    id: 2, album: "trainee", roleKey: "dance", role: "Главный танцор",
    name: "Кай • Зеркальный зал", r: "R", img: "img/cards/kai_r.webp", tag: "KI",
    grad: "linear-gradient(145deg, #162a4a, #12152b)",
    bonusType: "energy", bonusVal: 10, bonusText: "-10 мин к таймеру энергии",
    quoteKr: "화이팅!", quoteRu: "Вперёд! Удачи!", quoteFile: "audio/fighting.mp3"
  },
  {
    id: 3, album: "trainee", roleKey: "rap", role: "Главный рэпер",
    name: "Сора • Ночная студия", r: "SR", img: "img/cards/sora_sr.webp", tag: "SR",
    grad: "linear-gradient(145deg, #42185c, #1c1030)",
    bonusType: "coins", bonusVal: 15, bonusText: "+15% к микрофонам",
    quoteKr: "고마워!", quoteRu: "Спасибо тебе!", quoteFile: "audio/gomawo.mp3"
  },
  {
    id: 4, album: "trainee", roleKey: "visual", role: "Макнэ / Вижуал",
    name: "Юна • Кафе после репетиции", r: "R", img: "img/cards/yuna_r.webp", tag: "YN",
    grad: "linear-gradient(145deg, #1b3b42, #111b29)",
    bonusType: "luck", bonusVal: 5, bonusText: "+5% к шансу SR/SSR в паках",
    quoteKr: "진짜?", quoteRu: "Правда?", quoteFile: "audio/jinjja.mp3"
  },
  // ЭРА: ДЕБЮТ
  {
    id: 5, album: "debut", roleKey: "vocal", role: "Главный вокал",
    name: "Мина • Сцена Дебюта", r: "SSR", img: "img/cards/debut_ssr.webp", tag: "DB",
    grad: "linear-gradient(145deg, #52380c, #24122e)",
    bonusType: "xp", bonusVal: 30, bonusText: "+30% XP за уроки",
    quoteKr: "최고!", quoteRu: "Ты лучший!", quoteFile: "audio/choego.mp3"
  },
  {
    id: 6, album: "debut", roleKey: "dance", role: "Главный танцор",
    name: "Кай • Неоновый софит", r: "SR", img: "img/cards/kai_sr.webp", tag: "KS",
    grad: "linear-gradient(145deg, #123c52, #1a1030)",
    bonusType: "energy", bonusVal: 20, bonusText: "-20 мин к таймеру энергии",
    quoteKr: "대박!", quoteRu: "Просто супер!", quoteFile: "audio/daebak.mp3"
  },
  {
    id: 7, album: "debut", roleKey: "rap", role: "Главный рэпер",
    name: "Джин • Золотой микрофон", r: "SR", img: "img/cards/jin_sr.webp", tag: "JN",
    grad: "linear-gradient(145deg, #4a153b, #1d1026)",
    bonusType: "coins", bonusVal: 25, bonusText: "+25% к микрофонам",
    quoteKr: "노래!", quoteRu: "Песня!", quoteFile: "audio/norae.mp3"
  },
  {
    id: 8, album: "debut", roleKey: "visual", role: "Макнэ / Вижуал",
    name: "Юна • Золотой Лайтстик", r: "SSR", img: "img/cards/lightstick_ssr.webp", tag: "LS",
    grad: "linear-gradient(145deg, #591642, #38280b)",
    bonusType: "luck", bonusVal: 12, bonusText: "+12% к шансу SR/SSR в паках",
    quoteKr: "사랑해!", quoteRu: "Я тебя люблю!", quoteFile: "audio/saranghae.mp3"
  }
];
