(() => {
  const initWrapper = (wrapper) => {
    const input = wrapper.querySelector(
      'input.zs-search-input, input.zs-faq-search, input.zs-search-page-input'
    );
    const btn = wrapper.querySelector('.search-clear-btn');
    if (!input || !btn) return;

    const sync = () => {
      btn.classList.toggle('is-visible', input.value.length > 0);
    };

    input.addEventListener('input', sync);
    btn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      sync();
    });

    sync();
  };

  const boot = () => {
    document.querySelectorAll('.search-input-wrapper').forEach(initWrapper);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
