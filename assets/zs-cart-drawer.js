(() => {
  const drawer = document.querySelector('[data-zs-cart-drawer]');
  if (!drawer) return;

  const panel = drawer.querySelector('[data-zs-cart-drawer-panel]');
  const overlay = drawer.querySelector('[data-zs-cart-drawer-overlay]');
  const closeBtn = drawer.querySelector('[data-zs-cart-drawer-close]');
  const liveRegion = drawer.querySelector('[data-zs-cart-drawer-live]');
  const bodyTarget = drawer.querySelector('[data-zs-cart-drawer-body]');
  const scrollProgress = drawer.querySelector('[data-zs-cart-drawer-progress]');
  const scrollProgressFill = drawer.querySelector('[data-zs-cart-drawer-progress-fill]');
  const countEl = drawer.querySelector('[data-zs-cart-drawer-count]');
  const shippingTextEl = drawer.querySelector('[data-zs-cart-drawer-shipping-text]');
  const shippingFillEl = drawer.querySelector('[data-zs-cart-drawer-shipping-fill]');
  const subtotalEl = drawer.querySelector('[data-zs-cart-drawer-subtotal]');
  const checkoutBtn = drawer.querySelector('[data-zs-cart-drawer-checkout]');

  const threshold = parseInt(drawer.getAttribute('data-free-shipping-threshold') || '7500', 10);
  const moneyFormat = drawer.getAttribute('data-money-format') || '${{amount}}';
  const checkoutUrl = drawer.getAttribute('data-checkout-url') || '/checkout';
  const discoverUrl = drawer.getAttribute('data-discover-url') || '/collections/all';

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isOpen = false;
  let lastFocus = null;
  let cartState = null;
  let toastDismissTimer = 0;
  let scrollProgressRaf = 0;
  let scrollWasAtEnd = false;

  const addedToast =
    document.querySelector('[data-zs-cart-added-toast]') ||
    document.getElementById('zs-cart-added-toast');
  const toastViewBtn = addedToast?.querySelector('[data-zs-cart-toast-view]');

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const formatMoney = (cents) => {
    if (typeof cents !== 'number') return '';
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents, moneyFormat);
    }
    const amount = (cents / 100).toFixed(2);
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, amount);
  };

  const announce = (message) => {
    if (!liveRegion || !message) return;
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 50);
  };

  const updateScrollProgress = () => {
    if (!bodyTarget || !scrollProgressFill) return;
    const { scrollTop, scrollHeight, clientHeight } = bodyTarget;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 1) {
      scrollProgress?.setAttribute('hidden', '');
      scrollProgress?.setAttribute('aria-hidden', 'true');
      scrollProgressFill.style.height = '0';
      scrollWasAtEnd = false;
      return;
    }

    scrollProgress?.removeAttribute('hidden');
    scrollProgress?.setAttribute('aria-hidden', 'false');
    const pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
    scrollProgressFill.style.height = `${pct}%`;

    const atEnd = scrollTop >= maxScroll - 2;
    if (atEnd && !scrollWasAtEnd) {
      scrollProgress?.classList.add('is-complete');
      const onAnimEnd = () => {
        scrollProgress?.classList.remove('is-complete');
        scrollProgressFill.removeEventListener('animationend', onAnimEnd);
      };
      scrollProgressFill.addEventListener('animationend', onAnimEnd);
    }
    scrollWasAtEnd = atEnd;
  };

  const scheduleScrollProgress = () => {
    if (scrollProgressRaf) return;
    scrollProgressRaf = window.requestAnimationFrame(() => {
      scrollProgressRaf = 0;
      updateScrollProgress();
    });
  };

  const pulseCartIcon = () => {
    const wrap = document.querySelector('.zs-header__cart-wrap');
    if (!wrap || prefersReducedMotion) return;
    wrap.classList.remove('is-pulsing');
    void wrap.offsetWidth;
    wrap.classList.add('is-pulsing');
    wrap.addEventListener(
      'animationend',
      () => wrap.classList.remove('is-pulsing'),
      { once: true }
    );
  };

  const dismissAddedToast = () => {
    if (!addedToast) return;
    addedToast.classList.remove('is-active');
    addedToast.setAttribute('aria-hidden', 'true');
    if (toastDismissTimer) {
      window.clearTimeout(toastDismissTimer);
      toastDismissTimer = 0;
    }
  };

  const showAddedToast = () => {
    if (!addedToast) return;
    dismissAddedToast();
    pulseCartIcon();
    addedToast.classList.add('is-active');
    addedToast.setAttribute('aria-hidden', 'false');
    toastDismissTimer = window.setTimeout(dismissAddedToast, 3000);
  };

  const updateHeaderCount = (count) => {
    const wrap = document.querySelector('.zs-header__cart-wrap');
    if (!wrap) return;
    let badge = wrap.querySelector('.zs-header__cart-count');
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'zs-header__cart-count';
        wrap.appendChild(badge);
      }
      badge.textContent = String(count);
    } else if (badge) {
      badge.remove();
    }
  };

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  };

  const getVariantLabel = (item) => {
    if (item.options_with_values && item.options_with_values.length) {
      return item.options_with_values.map((o) => `${o.name}: ${o.value}`).join(' / ');
    }
    if (!item.variant_title || item.variant_title === 'Default Title') return '';
    return item.variant_title;
  };

  const buildItemHtml = (item, options = {}) => {
    const isNew = options.isNew ? ' zs-cart-drawer__item--new' : '';
    const imgSrc = item.image || item.featured_image?.url || '';
    const imgTag = imgSrc
      ? `<img class="zs-cart-drawer__item-img" src="${escapeHtml(imgSrc)}" alt="" width="80" height="100" loading="lazy">`
      : '<div class="zs-cart-drawer__item-img zs-cart-drawer__item-img--placeholder" aria-hidden="true"></div>';
    const variant = getVariantLabel(item);
    const variantHtml = variant
      ? `<p class="zs-cart-drawer__item-variant">${escapeHtml(variant)}</p>`
      : '';
    const linePrice = item.final_line_price != null ? item.final_line_price : item.line_price;

    return `
      <li class="zs-cart-drawer__item${isNew}" data-line-key="${escapeHtml(item.key)}" data-line-index="${item.index || ''}">
        <div class="zs-cart-drawer__item-inner">
          <a class="zs-cart-drawer__item-media" href="${escapeHtml(item.url)}" tabindex="-1" aria-hidden="true">
            ${imgTag}
          </a>
          <div class="zs-cart-drawer__item-details">
            <a class="zs-cart-drawer__item-title" href="${escapeHtml(item.url)}">${escapeHtml(item.product_title)}</a>
            ${variantHtml}
            <p class="zs-cart-drawer__item-price">${formatMoney(linePrice)}</p>
            <div class="zs-cart-drawer__item-actions">
              <div class="zs-cart-drawer__qty" role="group" aria-label="Quantity for ${escapeHtml(item.product_title)}">
                <button type="button" class="zs-cart-drawer__qty-btn" data-qty-change="-1" data-line-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button>
                <span class="zs-cart-drawer__qty-value" aria-live="polite">${item.quantity}</span>
                <button type="button" class="zs-cart-drawer__qty-btn" data-qty-change="1" data-line-key="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="zs-cart-drawer__remove" data-remove-line="${escapeHtml(item.key)}">Remove</button>
            </div>
          </div>
        </div>
      </li>`;
  };

  const renderShipping = (subtotal) => {
    if (!shippingTextEl || !shippingFillEl) return;
    const pct = Math.min(100, (subtotal / threshold) * 100);
    shippingFillEl.style.width = `${pct}%`;

    if (subtotal >= threshold) {
      shippingTextEl.textContent = "You've unlocked free shipping ✓";
      shippingTextEl.classList.add('is-unlocked');
    } else {
      const away = threshold - subtotal;
      shippingTextEl.textContent = `${formatMoney(away)} away from free shipping`;
      shippingTextEl.classList.remove('is-unlocked');
    }
  };

  const renderEmpty = () => `
    <div class="zs-cart-drawer__empty">
      <span class="zs-cart-drawer__empty-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
      <p class="zs-cart-drawer__empty-title">Your bag is empty.</p>
      <p class="zs-cart-drawer__empty-sub">Discover pieces designed for you.</p>
      <a class="zs-cart-drawer__empty-cta" href="${escapeHtml(discoverUrl)}">Discover</a>
    </div>`;

  const renderItems = (cart, newLineKey) => {
    if (!cart.items || cart.items.length === 0) return renderEmpty();
    const items = cart.items
      .map((item) => buildItemHtml(item, { isNew: newLineKey && item.key === newLineKey }))
      .join('');
    return `<ul class="zs-cart-drawer__list" role="list">${items}</ul>`;
  };

  const renderCart = (cart, options = {}) => {
    cartState = cart;
    const count = cart.item_count || 0;
    const subtotal = cart.items_subtotal_price || 0;

    if (countEl) countEl.textContent = `(${count})`;
    updateHeaderCount(count);

    renderShipping(subtotal);

    if (subtotalEl) {
      subtotalEl.classList.add('is-updating');
      subtotalEl.textContent = formatMoney(subtotal);
      window.setTimeout(() => subtotalEl.classList.remove('is-updating'), 300);
    }

    drawer.classList.toggle('has-items', count > 0);
    drawer.classList.toggle('is-empty', count === 0);

    if (bodyTarget) {
      bodyTarget.innerHTML = renderItems(cart, options.newLineKey);
      bindItemEvents();
      scheduleScrollProgress();
    }

    if (options.announce) announce(options.announce);
  };

  const fetchCart = async () => {
    const res = await fetch('/cart.js', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('Cart fetch failed');
    return res.json();
  };

  const changeLine = async (key, quantity) => {
    pendingLineKey = key;
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.description || 'Could not update cart');
    }
    return res.json();
  };

  const addToCart = async (payload) => {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: payload.id, quantity: payload.quantity || 1 }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.description || 'Could not add to cart');
    }
    return res.json();
  };

  const animateRemove = (lineKey) =>
    new Promise((resolve) => {
      const row = bodyTarget?.querySelector(`[data-line-key="${lineKey.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`);
      if (!row || prefersReducedMotion) {
        resolve();
        return;
      }
      row.classList.add('is-removing');
      row.addEventListener(
        'transitionend',
        () => resolve(),
        { once: true }
      );
      window.setTimeout(resolve, 400);
    });

  const handleQtyChange = async (key, delta) => {
    if (!cartState) return;
    const item = cartState.items.find((i) => i.key === key);
    if (!item) return;
    const nextQty = item.quantity + delta;
    if (nextQty < 0) return;

    try {
      if (nextQty === 0) {
        await animateRemove(key);
      }
      const cart = await changeLine(key, nextQty);
      renderCart(cart, {
        announce:
          nextQty === 0
            ? 'Item removed from bag'
            : `Quantity updated to ${nextQty}`,
      });
    } catch (e) {
      announce(e.message || 'Could not update cart');
    }
  };

  const handleRemove = async (key) => {
    try {
      await animateRemove(key);
      const cart = await changeLine(key, 0);
      renderCart(cart, { announce: 'Item removed from bag' });
    } catch (e) {
      announce(e.message || 'Could not remove item');
    }
  };

  const bindItemEvents = () => {
    if (!bodyTarget) return;

    bodyTarget.querySelectorAll('[data-qty-change]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-line-key');
        const delta = parseInt(btn.getAttribute('data-qty-change'), 10);
        if (key) handleQtyChange(key, delta);
      });
    });

    bodyTarget.querySelectorAll('[data-remove-line]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-remove-line');
        if (key) handleRemove(key);
      });
    });
  };

  const getFocusable = (container) =>
    Array.from(container.querySelectorAll(FOCUSABLE)).filter(
      (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );

  const trapTab = (e) => {
    if (!isOpen || e.key !== 'Tab' || !panel) return;
    const nodes = getFocusable(panel);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const open = async () => {
    if (isOpen) return;
    dismissAddedToast();
    lastFocus = document.activeElement;

    try {
      const cart = await fetchCart();
      renderCart(cart);
    } catch {
      /* keep existing markup */
    }

    isOpen = true;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('zs-cart-drawer-open');
    overlay?.setAttribute('aria-hidden', 'false');

    window.setTimeout(() => {
      (closeBtn || panel)?.focus();
      scheduleScrollProgress();
    }, prefersReducedMotion ? 0 : 100);

    document.addEventListener('keydown', onKeydown);
    panel?.addEventListener('keydown', trapTab);
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('zs-cart-drawer-open');
    overlay?.setAttribute('aria-hidden', 'true');

    document.removeEventListener('keydown', onKeydown);
    panel?.removeEventListener('keydown', trapTab);

    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  };

  const onKeydown = (e) => {
    if (e.key === 'Escape') close();
  };

  const refreshAndOpen = async (options = {}) => {
    try {
      const cart = await fetchCart();
      renderCart(cart, options);
      open();
    } catch (e) {
      announce(e.message || 'Could not update bag');
    }
  };

  overlay?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);

  checkoutBtn?.addEventListener('click', () => {
    window.location.href = checkoutUrl;
  });

  toastViewBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    dismissAddedToast();
    open();
  });

  document.querySelectorAll('[data-zs-cart-open]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-zs-ajax-cart-form], .zs-product__form, .main-product__form, .main-collection__quick-form');
    if (!form) return;

    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const id = formData.get('id');
    const quantity = parseInt(formData.get('quantity') || '1', 10);

    if (!id) return;

    try {
      const added = await addToCart({ id: Number(id) || id, quantity });
      const cart = await fetchCart();
      const newKey = added?.key || (cart.items[cart.items.length - 1]?.key ?? null);
      renderCart(cart, {
        newLineKey: newKey,
        announce: 'Item added to bag',
      });
      showAddedToast();
      document.dispatchEvent(new CustomEvent('zs:cart:added', { detail: { cart, added } }));
    } catch (err) {
      announce(err.message || 'Could not add to bag');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  const initFromDom = () => {
    const stateEl = drawer.querySelector('[data-zs-cart-drawer-state]');
    if (!stateEl) return;
    try {
      const cart = JSON.parse(stateEl.textContent);
      renderCart(cart);
    } catch {
      /* ignore */
    }
  };

  if (bodyTarget) {
    bodyTarget.addEventListener('scroll', scheduleScrollProgress, { passive: true });
    window.addEventListener('resize', scheduleScrollProgress, { passive: true });
  }

  initFromDom();
  scheduleScrollProgress();

  window.ZsCartDrawer = {
    open,
    close,
    refresh: fetchCart,
    render: renderCart,
    refreshAndOpen,
    showAddedToast,
    dismissAddedToast,
  };
})();
