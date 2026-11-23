/* ====== БЕЗОПАСНАЯ ЗАГЛУШКА TELEGRAM WEBAPP ======
   Приложение должно открываться и в обычном браузере (для тестов),
   поэтому любые отсутствующие методы Telegram заменяем безопасными no-op. */
(function () {
  'use strict';

  const native = window.Telegram && window.Telegram.WebApp;
  const noop = function () {};

  function createStub() {
    return {
      initData: '',
      initDataUnsafe: {},
      version: '6.0',
      platform: 'unknown',
      colorScheme: 'dark',
      themeParams: {},
      isExpanded: false,
      viewportHeight: window.innerHeight || 0,
      viewportStableHeight: window.innerHeight || 0,
      ready: noop,
      expand: noop,
      close: noop,
      disableVerticalSwipes: noop,
      enableVerticalSwipes: noop,
      setHeaderColor: noop,
      setBackgroundColor: noop,
      onEvent: noop,
      offEvent: noop,
      sendData: noop,
      openTelegramLink: function (url) {
        try { window.open(url, '_blank', 'noopener'); } catch (e) {}
      },
      HapticFeedback: {
        impactOccurred: noop,
        notificationOccurred: noop,
        selectionChanged: noop
      },
      BackButton: { show: noop, hide: noop, onClick: noop, offClick: noop },
      MainButton: {
        show: noop, hide: noop, setText: noop, onClick: noop, offClick: noop,
        enable: noop, disable: noop, setParams: noop
      },
      CloudStorage: {
        getItem: function (key, cb) { if (cb) cb(null, null); },
        setItem: function (key, value, cb) { if (cb) cb(null); },
        removeItem: function (key, cb) { if (cb) cb(null); }
      }
    };
  }

  const app = native || createStub();
  const stub = createStub();

  // Дополняем старые/частично доступные клиенты Telegram недостающими методами.
  Object.keys(stub).forEach(function (key) {
    if (app[key] === undefined) app[key] = stub[key];
  });
  if (!app.HapticFeedback) {
    app.HapticFeedback = stub.HapticFeedback;
  } else {
    Object.keys(stub.HapticFeedback).forEach(function (key) {
      if (typeof app.HapticFeedback[key] !== 'function') app.HapticFeedback[key] = stub.HapticFeedback[key];
    });
  }

  const isTelegram = !!(native && (
    native.initData ||
    (native.initDataUnsafe && native.initDataUnsafe.user) ||
    (native.platform && native.platform !== 'unknown')
  ));

  const user = (app.initDataUnsafe && app.initDataUnsafe.user) || {
    id: 0,
    first_name: 'Trainee',
    last_name: '',
    username: 'local_trainee'
  };

  function haptic(type) {
    if (!isTelegram) return;
    try {
      const h = app.HapticFeedback;
      if (!h) return;
      if (type === 'ok') h.notificationOccurred('success');
      else if (type === 'err') h.notificationOccurred('error');
      else h.impactOccurred(type === 'heavy' || type === 'medium' ? type : 'light');
    } catch (e) {}
  }

  window.Telegram = window.Telegram || {};
  window.Telegram.WebApp = app;
  window.KPLTelegram = { app: app, isTelegram: isTelegram, user: user, haptic: haptic };

  // Вне Telegram просто разворачиваем страницу на весь экран.
  try {
    app.ready();
    app.expand();
    if (isTelegram && app.disableVerticalSwipes) app.disableVerticalSwipes();
  } catch (e) {}
})();
