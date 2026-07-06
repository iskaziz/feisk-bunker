const app = document.querySelector('#app');
const hatchButton = document.querySelector('#hatchButton');
const loadingText = document.querySelector('#loadingText');
const loadingProgress = document.querySelector('#loadingProgress');
const loadingScreen = document.querySelector('#loadingScreen');
const bunkerScene = document.querySelector('#bunkerScene');
const sceneViewport = document.querySelector('#sceneViewport');
const propsLayer = document.querySelector('#propsLayer');
const infoPanel = document.querySelector('#infoPanel');
const panelBackdrop = document.querySelector('#panelBackdrop');
const closePanelButton = document.querySelector('#closePanelButton');
const infoKicker = document.querySelector('#infoKicker');
const infoTitle = document.querySelector('#infoTitle');
const infoBody = document.querySelector('#infoBody');
const mobileOrientationPrompt = document.querySelector('#mobileOrientationPrompt');
const continuePortraitButton = document.querySelector('#continuePortraitButton');

const appState = {
  isLoaded: false,
  hasEntered: false,
  activePropId: null,
  portraitBypass: false
};

function getAllImageSources() {
  const backgroundSources = [FEISK_ASSETS.backgrounds.bunkerRoom].filter(Boolean);
  const propSources = FEISK_ASSETS.props.map((prop) => prop.src);
  return [...backgroundSources, ...propSources];
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve({ src, status: 'loaded' });

    // For a prototype, missing placeholder files should not block entry forever.
    // Replace this with reject/error handling when production assets are final.
    image.onerror = () => {
      console.warn(`Prototype asset missing or failed to load: ${src}`);
      resolve({ src, status: 'missing' });
    };

    image.src = src;
  });
}

async function preloadAssets() {
  const sources = getAllImageSources();
  let loadedCount = 0;

  await Promise.all(
    sources.map(async (src) => {
      const result = await preloadImage(src);
      loadedCount += 1;
      const percentage = Math.round((loadedCount / sources.length) * 100);
      loadingProgress.style.width = `${percentage}%`;
      loadingText.textContent = `Loading vault assets... ${percentage}%`;
      return result;
    })
  );

  appState.isLoaded = true;
  app.classList.remove('app--loading');
  app.classList.add('app--ready');
  hatchButton.disabled = false;
  loadingText.textContent = 'Click the hatch to enter.';
}

function renderSceneBackground() {
  const background = document.querySelector('#bunkerBackground');
  if (!background) return;

  background.src = FEISK_ASSETS.backgrounds.bunkerRoom;
}

function renderProps() {
  propsLayer.innerHTML = '';

  FEISK_ASSETS.props.forEach((prop) => {
    const button = document.createElement('button');
    button.className = 'scene-prop';
    button.type = 'button';
    button.dataset.propId = prop.id;
    button.setAttribute('aria-label', `Open ${prop.title} information`);

    button.style.left = `${prop.x}%`;
    button.style.top = `${prop.y}%`;
    button.style.width = `${prop.width}%`;
    button.style.height = `${prop.height}%`;

    if (prop.zIndex) {
      button.style.zIndex = prop.zIndex;
    }

    const image = document.createElement('img');
    image.src = prop.src;
    image.alt = prop.alt;
    image.draggable = false;

    button.appendChild(image);
    button.addEventListener('click', () => openInfoPanel(prop.id));
    propsLayer.appendChild(button);
  });
}

function centerSceneScroll() {
  if (!sceneViewport) return;

  const hiddenWidth = sceneViewport.scrollWidth - sceneViewport.clientWidth;
  if (hiddenWidth > 0) {
    sceneViewport.scrollLeft = hiddenWidth / 2;
  }
}

function isPortraitMobile() {
  return window.matchMedia('(max-width: 820px) and (orientation: portrait)').matches;
}

function updateOrientationPrompt() {
  if (!mobileOrientationPrompt) return;

  const shouldShow = appState.hasEntered && isPortraitMobile() && !appState.portraitBypass;
  mobileOrientationPrompt.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
}

function enterBunker() {
  if (!appState.isLoaded || appState.hasEntered) return;

  appState.hasEntered = true;
  hatchButton.disabled = true;
  app.classList.add('app--entering');
  loadingText.textContent = 'Vault hatch opening...';

  window.setTimeout(() => {
    loadingScreen.setAttribute('aria-hidden', 'true');
    bunkerScene.classList.add('bunker-scene--active');
    app.classList.add('app--inside');
    centerSceneScroll();
    updateOrientationPrompt();
  }, 1400);
}

function openInfoPanel(propId) {
  const prop = FEISK_ASSETS.props.find((item) => item.id === propId);
  if (!prop) return;

  appState.activePropId = propId;
  infoKicker.textContent = prop.kicker;
  infoTitle.textContent = prop.title;
  infoBody.textContent = prop.body;

  panelBackdrop.hidden = false;
  infoPanel.setAttribute('aria-hidden', 'false');
  app.classList.add('app--panel-open');
  closePanelButton.focus();
}

function closeInfoPanel() {
  appState.activePropId = null;
  infoPanel.setAttribute('aria-hidden', 'true');
  app.classList.remove('app--panel-open');

  window.setTimeout(() => {
    if (!app.classList.contains('app--panel-open')) {
      panelBackdrop.hidden = true;
    }
  }, 250);
}

function handleKeyboard(event) {
  if (event.key === 'Escape' && app.classList.contains('app--panel-open')) {
    closeInfoPanel();
  }
}

function continueInPortrait() {
  appState.portraitBypass = true;
  updateOrientationPrompt();
  centerSceneScroll();
}

function init() {
  renderSceneBackground();
  renderProps();
  preloadAssets();

  hatchButton.addEventListener('click', enterBunker);
  closePanelButton.addEventListener('click', closeInfoPanel);
  panelBackdrop.addEventListener('click', closeInfoPanel);
  document.addEventListener('keydown', handleKeyboard);

  if (continuePortraitButton) {
    continuePortraitButton.addEventListener('click', continueInPortrait);
  }

  window.addEventListener('resize', () => {
    centerSceneScroll();
    updateOrientationPrompt();
  });

  window.addEventListener('orientationchange', () => {
    window.setTimeout(() => {
      centerSceneScroll();
      updateOrientationPrompt();
    }, 250);
  });
}

init();
