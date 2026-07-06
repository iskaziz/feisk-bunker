/*
  Last-resort boot helper for GitHub Pages deployments.
  If the main script fails or an asset never reports loaded, this unlocks the hatch
  and provides a minimal scene transition so the site never freezes on the loader.
*/
(function () {
  const rescueDelay = 5000;

  function $(selector) {
    return document.querySelector(selector);
  }

  function getAssets() {
    const fallback = {
      backgrounds: { bunkerRoom: 'assets/backgrounds/bunker-room-background-reference.png' },
      props: []
    };
    const assets = window.FEISK_ASSETS || window.FEISK_LAYER_B_PROPS || fallback;
    return {
      backgrounds: assets.backgrounds || fallback.backgrounds,
      props: Array.isArray(assets.props) ? assets.props : []
    };
  }

  function renderPropsIfEmpty() {
    const propsLayer = $('#propsLayer');
    if (!propsLayer || propsLayer.children.length) return;

    getAssets().props.forEach((prop) => {
      const button = document.createElement('button');
      button.className = 'scene-prop';
      button.type = 'button';
      button.dataset.propId = prop.id;
      button.style.left = `${prop.x}%`;
      button.style.top = `${prop.y}%`;
      button.style.width = `${prop.width}%`;
      button.style.height = `${prop.height}%`;
      button.style.zIndex = prop.zIndex || 10;
      button.setAttribute('aria-label', prop.title || prop.id);

      const image = document.createElement('img');
      image.src = prop.src;
      image.alt = prop.alt || prop.title || prop.id;
      image.draggable = false;
      button.appendChild(image);

      button.addEventListener('click', () => {
        const app = $('#app');
        const panel = $('#infoPanel');
        const backdrop = $('#panelBackdrop');
        const kicker = $('#infoKicker');
        const title = $('#infoTitle');
        const body = $('#infoBody');
        if (!panel || !app) return;
        if (kicker) kicker.textContent = prop.kicker || 'Archive Object';
        if (title) title.textContent = prop.title || prop.id;
        if (body) body.textContent = prop.body || '';
        app.classList.add('app--panel-open');
        panel.setAttribute('aria-hidden', 'false');
        if (backdrop) backdrop.hidden = false;
      });

      propsLayer.appendChild(button);
    });
  }

  function unlock() {
    const app = $('#app');
    const hatch = $('#hatchButton');
    const text = $('#loadingText');
    const progress = $('#loadingProgress');
    const bg = $('#bunkerBackground');
    const assets = getAssets();

    if (bg && assets.backgrounds.bunkerRoom) bg.src = assets.backgrounds.bunkerRoom;
    renderPropsIfEmpty();

    if (app) {
      app.classList.remove('app--loading');
      app.classList.add('app--ready');
    }
    if (hatch) hatch.disabled = false;
    if (text && /^Loading vault assets/i.test(text.textContent.trim())) {
      text.textContent = 'Click the hatch to enter.';
    }
    if (progress) progress.style.width = '100%';
  }

  function enter() {
    const app = $('#app');
    const hatch = $('#hatchButton');
    const loadingScreen = $('#loadingScreen');
    const bunkerScene = $('#bunkerScene');
    const text = $('#loadingText');

    if (app && app.classList.contains('app--inside')) return;
    if (hatch) hatch.disabled = true;
    if (app) {
      app.classList.add('app--entering');
    }
    if (text) text.textContent = 'Vault hatch opening...';

    window.setTimeout(() => {
      if (loadingScreen) loadingScreen.setAttribute('aria-hidden', 'true');
      if (bunkerScene) bunkerScene.classList.add('bunker-scene--active');
      if (app) app.classList.add('app--inside');
    }, 900);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const hatch = $('#hatchButton');
    if (hatch && !hatch.dataset.failsafeBound) {
      hatch.dataset.failsafeBound = 'true';
      hatch.addEventListener('click', () => {
        if (!hatch.disabled) enter();
      });
    }

    window.setTimeout(() => {
      const text = $('#loadingText');
      const hatchButton = $('#hatchButton');
      if (!hatchButton) return;
      if (hatchButton.disabled || (text && /^Loading vault assets/i.test(text.textContent.trim()))) {
        console.warn('[Feisk failsafe] Loader was still locked; enabling hatch.');
        unlock();
      }
    }, rescueDelay);
  });

  window.FEISK_FAILSAFE_UNLOCK = unlock;
})();
