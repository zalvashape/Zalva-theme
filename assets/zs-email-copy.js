(() => {
  const TOAST_DURATION_MS = 2500;
  const BUTTON_REVERT_MS = 2000;
  const PRESS_DURATION_MS = 150;
  const DEFAULT_SUCCESS = 'Email copied to clipboard';

  let dismissTimer = 0;

  const getToast = () => document.getElementById('zs-email-copy-toast');

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const input = document.createElement('input');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, text.length);

    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }

    document.body.removeChild(input);
    return ok;
  };

  const showToast = (message) => {
    const toast = getToast();
    if (!toast) return;

    const textEl = toast.querySelector('[data-zs-email-copy-toast-text]');
    if (textEl) textEl.textContent = message;

    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('is-active');

    if (dismissTimer) window.clearTimeout(dismissTimer);
    dismissTimer = window.setTimeout(() => {
      toast.classList.remove('is-active');
      toast.setAttribute('aria-hidden', 'true');
    }, TOAST_DURATION_MS);
  };

  const initButton = (btn) => {
    if (btn.dataset.zsEmailCopyInit === 'true') return;
    btn.dataset.zsEmailCopyInit = 'true';

    const email = btn.getAttribute('data-email') || '';
    const defaultLabel =
      btn.getAttribute('data-email-label') || btn.textContent.trim();
    const copiedLabel = btn.getAttribute('data-email-copied') || 'COPIED ✓';

    let revertTimer = 0;

    const revertLabel = () => {
      btn.textContent = defaultLabel;
      btn.classList.remove('is-copied');
    };

    const runCopy = async () => {
      btn.classList.add('is-pressing');
      window.setTimeout(() => btn.classList.remove('is-pressing'), PRESS_DURATION_MS);

      if (!email) {
        showToast(`Email: ${email}`);
        return;
      }

      let ok = false;
      try {
        ok = await copyText(email);
      } catch {
        ok = false;
      }

      if (ok) {
        btn.textContent = copiedLabel;
        btn.classList.add('is-copied');
        showToast(DEFAULT_SUCCESS);

        if (revertTimer) window.clearTimeout(revertTimer);
        revertTimer = window.setTimeout(revertLabel, BUTTON_REVERT_MS);
      } else {
        showToast(`Email: ${email}`);
      }
    };

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      runCopy();
    });
  };

  const boot = () => {
    document
      .querySelectorAll('[data-zs-email-copy]')
      .forEach((btn) => initButton(btn));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
