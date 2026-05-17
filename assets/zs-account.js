(() => {
  const initSidebar = () => {
    const sidebar = document.querySelector('[data-zs-account-sidebar]');
    const toggle = document.querySelector('[data-zs-account-sidebar-toggle]');
    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  };

  const initAuthPanels = () => {
    const root = document.querySelector('[data-zs-account-auth]');
    if (!root) return;

    const loginPanel = root.querySelector('[data-zs-account-panel="login"]');
    const recoverPanel = root.querySelector('[data-zs-account-panel="recover"]');
    const showRecoverLinks = root.querySelectorAll('[data-zs-account-show-recover]');
    const showLoginLinks = root.querySelectorAll('[data-zs-account-show-login]');

    const showPanel = (name) => {
      const isRecover = name === 'recover';
      loginPanel?.toggleAttribute('hidden', isRecover);
      recoverPanel?.toggleAttribute('hidden', !isRecover);
      if (isRecover) {
        const email = loginPanel?.querySelector('input[name="customer[email]"]');
        const recoverEmail = recoverPanel?.querySelector('input[name="email"]');
        if (email && recoverEmail && email.value) recoverEmail.value = email.value;
        recoverPanel?.querySelector('input')?.focus();
      }
    };

    showRecoverLinks.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showPanel('recover');
        window.location.hash = 'recover';
      });
    });

    showLoginLinks.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showPanel('login');
        history.replaceState(null, '', window.location.pathname);
      });
    });

    if (window.location.hash === '#recover') showPanel('recover');
    if (root.querySelector('[data-zs-recover-success]')) showPanel('recover');
  };

  const initFormLoading = () => {
    document.querySelectorAll('[data-zs-account-form]').forEach((form) => {
      form.addEventListener('submit', () => {
        const btn = form.querySelector('[type="submit"]');
        if (!btn || btn.disabled) return;
        btn.dataset.zsOriginalText = btn.textContent;
        btn.textContent = '...';
        btn.disabled = true;
      });
    });
  };

  const initAddressForms = () => {
    const root = document.querySelector('[data-zs-account-addresses]');
    if (!root) return;

    const addBtn = root.querySelector('[data-zs-address-add]');
    const newForm = root.querySelector('[data-zs-address-form="new"]');
    const cancelBtns = root.querySelectorAll('[data-zs-address-cancel]');
    const editBtns = root.querySelectorAll('[data-zs-address-edit]');

    addBtn?.addEventListener('click', () => {
      newForm?.removeAttribute('hidden');
      newForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    cancelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const formId = btn.getAttribute('data-zs-address-cancel');
        const form = root.querySelector(`[data-zs-address-form="${formId}"]`);
        form?.setAttribute('hidden', '');
      });
    });

    editBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-zs-address-edit');
        const form = root.querySelector(`[data-zs-address-form="${id}"]`);
        form?.removeAttribute('hidden');
        form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const boot = () => {
    initSidebar();
    initAuthPanels();
    initFormLoading();
    initAddressForms();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
