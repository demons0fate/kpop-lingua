/* ====== ЗАГРУЗКА ДАННЫХ ИЗ JSON (lazy + кеш) ======
   Данные уроков/карт/правил/слов лежат в data/*.json.
   Индекс уроков и справочники грузим на старте (это мало),
   а шаги конкретного урока — только когда игрок нажал «Учить». */
(function () {
  const VERSION = '3';
  const cache = new Map();

  function getJSON(path) {
    if (!cache.has(path)) {
      const p = fetch(`${path}?v=${VERSION}`, { cache: 'no-cache' }).then((r) => {
        if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
        return r.json();
      });
      cache.set(path, p);
    }
    return cache.get(path);
  }

  const AppData = {
    ready: false,
    error: null,
    _waiters: [],

    /* Колбэк вызовется сразу, если данные уже загружены. */
    whenReady(cb) {
      if (this.ready) cb();
      else this._waiters.push(cb);
    },

    /* Полный урок со шагами (кешируется после первого открытия). */
    lesson(id) {
      const meta = (window.LESSONS || []).find((l) => l.id === id);
      if (meta && Array.isArray(meta.steps) && meta.steps.length) return Promise.resolve(meta);
      const path = (meta && meta.file) || `data/lessons/lesson-${String(id).padStart(2, '0')}.json`;
      return getJSON(path);
    },

    /* Полный список уроков нужен редко — например, для проверки модуля. */
    lessons() {
      return Promise.all((window.LESSONS || []).map((meta) => this.lesson(meta.id)));
    },

    async init() {
      const [modules, index, cards, vocab, rules, episodes] = await Promise.all([
        getJSON('data/modules.json'),
        getJSON('data/lessons-index.json'),
        getJSON('data/cards.json'),
        getJSON('data/vocab.json'),
        getJSON('data/rules.json'),
        getJSON('data/episodes.json')
      ]);
      window.MODULES = modules.modules || [];
      window.LESSONS = index.lessons || [];
      window.CARDS = cards.cards || [];
      window.ERAS = cards.eras || [];
      window.VOCAB = vocab.items || [];
      window.RULES = rules.items || [];
      window.EPISODES = episodes.episodes || [];

      this.ready = true;
      this._waiters.splice(0).forEach((cb) => {
        try { cb(); } catch (e) { console.error(e); }
      });
      document.dispatchEvent(new CustomEvent('app:data-ready'));
    }
  };

  window.AppData = AppData;
  AppData.init().catch((err) => {
    AppData.error = err;
    window.APP_DATA_ERROR = err;
    console.error('Data load failed:', err);
    const list = document.getElementById('lessons-list');
    if (list) {
      list.innerHTML =
        '<div class="card-box"><h3>Не удалось загрузить данные</h3>' +
        '<p style="color:var(--muted)">Проверь соединение и обнови страницу. Уроки лежат в <b>data/*.json</b>.</p>' +
        '<button class="btn full" onclick="location.reload()">Обновить</button></div>';
    }
    document.dispatchEvent(new CustomEvent('app:data-error'));
  });
})();
