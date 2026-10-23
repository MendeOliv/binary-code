(function () {
  try {
    var theme = window.localStorage.getItem('cb-theme') === 'light' ? 'light' : 'dark';
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.dataset.theme = theme;
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();
