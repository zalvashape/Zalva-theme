(() => {
  const root = document.querySelector('[data-zs-product]');
  if (!root) return;

  const sectionId = root.getAttribute('data-section-id');
  const productJsonEl = document.getElementById(`ProductJson-${sectionId}`);
  if (!productJsonEl) return;

  let product;
  try {
    product = JSON.parse(productJsonEl.textContent);
  } catch {
    return;
  }

  const selectedEl = document.getElementById(`ProductSelectedOptions-${sectionId}`);
  let selectedOptions = [];
  if (selectedEl) {
    try {
      selectedOptions = JSON.parse(selectedEl.textContent);
    } catch {
      selectedOptions = [];
    }
  }

  const variantInput = document.getElementById(`VariantId-${sectionId}`);
  const priceEl = document.getElementById(`Price-${sectionId}`);
  const moneyFormat = priceEl?.getAttribute('data-money-format') || '${{amount}}';
  const form = root.querySelector('.zs-product__form');
  const submitBtn = form?.querySelector('[data-zs-product-submit]');

  const formatMoney = (cents) => {
    if (typeof cents !== 'number') return '';
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents, moneyFormat);
    }
    const amount = (cents / 100).toFixed(2);
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, amount);
  };

  const findVariant = () =>
    product.variants.find((v) =>
      selectedOptions.every((opt, i) => v[`option${i + 1}`] === opt)
    );

  const isVariantAvailable = (variant) => variant && variant.available;

  const updateSoldOutStates = () => {
    root.querySelectorAll('[data-zs-size-btn]').forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-option-index'), 10);
      const val = btn.getAttribute('data-value');
      const testOpts = [...selectedOptions];
      testOpts[idx] = val;
      const match = product.variants.find((v) =>
        testOpts.every((opt, i) => !opt || v[`option${i + 1}`] === opt)
      );
      const soldOut = !match || !match.available;
      btn.classList.toggle('is-sold-out', soldOut);
      btn.setAttribute('aria-disabled', soldOut ? 'true' : 'false');
    });
  };

  const setActiveMedia = (mediaId) => {
    const id = String(mediaId);
    root.querySelectorAll('[data-zs-gallery-slide]').forEach((slide) => {
      slide.classList.toggle('is-active', slide.getAttribute('data-media-id') === id);
    });
    root.querySelectorAll('[data-zs-gallery-thumb]').forEach((btn) => {
      const active = btn.getAttribute('data-media-id') === id;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
    const carousel = root.querySelector('[data-zs-gallery-carousel]');
    if (carousel) {
      const slide = carousel.querySelector(`[data-media-id="${id}"]`);
      if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  const updatePrice = (variant) => {
    if (!priceEl || !variant) return;
    const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
    if (onSale) {
      priceEl.innerHTML = `
        <span class="zs-product__sale-badge">SALE</span>
        <span class="zs-product__price-sale">${formatMoney(variant.price)}</span>
        <span class="zs-product__price-compare">${formatMoney(variant.compare_at_price)}</span>`;
    } else {
      priceEl.innerHTML = `<span class="zs-product__price-current">${formatMoney(variant.price)}</span>`;
    }
  };

  const updateVariantUI = (variant) => {
    if (!variant) return;
    if (variantInput) variantInput.value = variant.id;

    updatePrice(variant);

    if (submitBtn) {
      submitBtn.disabled = !variant.available;
      if (!submitBtn.classList.contains('is-success') && !submitBtn.classList.contains('is-loading')) {
        submitBtn.textContent = variant.available ? 'ADD TO BAG' : 'SOLD OUT';
      }
    }

    root.querySelectorAll('[data-zs-selected-label]').forEach((el) => {
      const kind = el.getAttribute('data-zs-selected-label');
      if (kind === 'color') {
        const colorOpt = product.options.findIndex(
          (o) => o.toLowerCase() === 'color' || o.toLowerCase() === 'colour'
        );
        if (colorOpt >= 0) el.textContent = variant[`option${colorOpt + 1}`] || '';
      }
      if (kind === 'size') {
        const sizeOpt = product.options.findIndex((o) => o.toLowerCase() === 'size');
        if (sizeOpt >= 0) el.textContent = variant[`option${sizeOpt + 1}`] || '';
      }
    });

    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);

    const fm = variant.featured_media?.id;
    if (fm) setActiveMedia(fm);

    updateSoldOutStates();
  };

  root.querySelectorAll('[data-zs-gallery-thumb]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-media-id');
      if (id) setActiveMedia(id);
    });
  });

  const carousel = root.querySelector('[data-zs-gallery-carousel]');
  const dots = root.querySelectorAll('[data-zs-gallery-dot]');
  if (carousel && dots.length) {
    const syncDots = () => {
      const scrollLeft = carousel.scrollLeft;
      const width = carousel.offsetWidth || 1;
      const index = Math.round(scrollLeft / width);
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    };
    carousel.addEventListener('scroll', syncDots, { passive: true });
    syncDots();
  }

  root.querySelectorAll('[data-zs-variant-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-sold-out') || btn.getAttribute('aria-disabled') === 'true') return;
      const idx = parseInt(btn.getAttribute('data-option-index'), 10);
      const val = btn.getAttribute('data-value');
      selectedOptions[idx] = val;

      const group = btn.closest('[data-zs-variant-group]');
      group?.querySelectorAll('[data-zs-variant-btn]').forEach((b) => {
        const same = parseInt(b.getAttribute('data-option-index'), 10) === idx;
        const sel = same && b.getAttribute('data-value') === val;
        b.classList.toggle('is-selected', sel);
        if (same) {
          b.setAttribute('aria-pressed', sel ? 'true' : 'false');
          b.setAttribute('aria-current', sel ? 'true' : 'false');
        }
      });

      const variant = findVariant();
      if (variant) updateVariantUI(variant);
    });
  });

  updateSoldOutStates();
  const initial = findVariant();
  if (initial) updateVariantUI(initial);

  let openAccordion = null;
  const closeAccordion = (item) => {
    if (!item) return;
    item.classList.remove('is-open');
    const trigger = item.querySelector('[data-zs-product-accordion-trigger]');
    trigger?.setAttribute('aria-expanded', 'false');
    const panel = item.querySelector('[data-zs-product-accordion-panel]');
    if (panel) panel.hidden = true;
  };

  const openAccordionItem = (item) => {
    if (openAccordion && openAccordion !== item) closeAccordion(openAccordion);
    const trigger = item.querySelector('[data-zs-product-accordion-trigger]');
    const panel = item.querySelector('[data-zs-product-accordion-panel]');
    const isOpen = item.classList.contains('is-open');
    if (isOpen) {
      closeAccordion(item);
      openAccordion = null;
      return;
    }
    item.classList.add('is-open');
    trigger?.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
    openAccordion = item;
  };

  root.querySelectorAll('[data-zs-product-accordion]').forEach((group) => {
    group.querySelectorAll('[data-zs-product-accordion-item]').forEach((item) => {
      const trigger = item.querySelector('[data-zs-product-accordion-trigger]');
      trigger?.addEventListener('click', () => openAccordionItem(item));
    });
  });

  const recHost = root.querySelector('[data-zs-product-recommendations]');
  if (recHost) {
    const url = recHost.getAttribute('data-url');
    if (url) {
      fetch(url)
        .then((r) => r.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const grid = doc.querySelector('.zs-product__rec-grid');
          if (grid && grid.children.length > 1) {
            recHost.innerHTML = '';
            recHost.appendChild(grid);
            recHost.closest('[data-zs-product-zone-rec]')?.classList.remove('is-hidden');
          }
        })
        .catch(() => {});
    }
  }

  const revealZones = root.querySelectorAll('[data-zs-product-reveal]');
  if (revealZones.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    revealZones.forEach((z) => io.observe(z));
    window.setTimeout(() => {
      revealZones.forEach((z) => z.classList.add('is-visible'));
    }, 1200);
  } else {
    revealZones.forEach((z) => z.classList.add('is-visible'));
  }

  if (form && submitBtn) {
    form.addEventListener(
      'submit',
      async (e) => {
        if (!form.classList.contains('zs-product__form')) return;
        e.preventDefault();
        e.stopImmediatePropagation();

        const id = variantInput?.value;
        if (!id || submitBtn.disabled) return;

        const prevText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        submitBtn.textContent = 'ADDING...';

        try {
          const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ items: [{ id: Number(id) || id, quantity: 1 }] }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.description || data.message || 'Could not add to bag');

          submitBtn.classList.remove('is-loading');
          submitBtn.classList.add('is-success');
          submitBtn.textContent = 'ADDED ✓';

          if (window.ZsCartDrawer?.refresh) {
            const cart = await window.ZsCartDrawer.refresh();
            window.ZsCartDrawer.render?.(cart, { announce: 'Item added to bag' });
          }
          window.ZsCartDrawer?.showAddedToast?.();
          document.dispatchEvent(new CustomEvent('zs:cart:added', { detail: { added: data } }));

          window.setTimeout(() => {
            submitBtn.classList.remove('is-success');
            submitBtn.textContent = prevText;
            submitBtn.disabled = !findVariant()?.available;
          }, 1000);
        } catch (err) {
          submitBtn.classList.remove('is-loading');
          submitBtn.textContent = prevText;
          submitBtn.disabled = !findVariant()?.available;
          window.alert(err.message || 'Could not add to bag');
        }
      },
      true
    );
  }
})();
