/* ====== ЗАГРУЗКА ДАННЫХ ИЗ JSON (K-Pop Lingua 2.0) ======
   Учебный контент лежит в data/*.json.
   Индекс уроков и справочники грузим на старте,
   а шаги конкретного урока — лениво при нажатии «Начать урок». */
(function () {
  const VERSION = '4';
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

  function getOptionalJSON(path, fallback) {
    return getJSON(path).catch(() => fallback);
  }

  const AppData = {
    ready: false,
    error: null,
    _waiters: [],

    whenReady(cb) {
      if (this.ready) cb();
      else this._waiters.push(cb);
    },

    lesson(id) {
      const meta = (window.LESSONS || []).find((l) => l.id === id);
      if (meta && Array.isArray(meta.steps) && meta.steps.length) return Promise.resolve(meta);
      const path = (meta && meta.file) || `data/lessons/lesson-${String(id).padStart(2, '0')}.json`;
      return getJSON(path);
    },

    lessons() {
      return Promise.all((window.LESSONS || []).map((meta) => this.lesson(meta.id)));
    },

    async init() {
      const [modules, index, vocab, rules, episodes] = await Promise.all([
        getJSON('data/modules.json'),
        getJSON('data/lessons-index.json'),
        getJSON('data/vocab.json'),
        getJSON('data/rules.json'),
        getOptionalJSON('data/episodes.json', { episodes: [] })
      ]);

      window.MODULES = modules.modules || [];
      window.LESSONS = index.lessons || [];
      window.VOCAB = vocab.items || [];
      window.RULES = rules.items || [];
      window.EPISODES = episodes.episodes || episodes.items || (Array.isArray(episodes) ? episodes : []);

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
