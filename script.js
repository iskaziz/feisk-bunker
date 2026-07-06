const app = document.querySelector('#app');
const hatchButton = document.querySelector('#hatchButton');
const loadingText = document.querySelector('#loadingText');
const loadingProgress = document.querySelector('#loadingProgress');
const loadingScreen = document.querySelector('#loadingScreen');
const bunkerScene = document.querySelector('#bunkerScene');
const propsLayer = document.querySelector('#propsLayer');
const infoPanel = document.querySelector('#infoPanel');
const panelBackdrop = document.querySelector('#panelBackdrop');
const closePanelButton = document.querySelector('#closePanelButton');
const infoKicker = document.querySelector('#infoKicker');
const infoTitle = document.querySelector('#infoTitle');
const infoBody = document.querySelector('#infoBody');

const appState = {
  isLoaded: false,
  hasEntered: false,
  activePropId: null
};

function getAllImageSources() {
  const backgroundSources = Object.values(FEISK_ASSETS.backgrounds);
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

    const image = document.createElement('img');
    image.src = prop.src;
    image.alt = prop.alt;
    image.draggable = false;

    button.appendChild(image);
    button.addEventListener('click', () => openInfoPanel(prop.id));
    propsLayer.appendChild(button);
  });
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

function init() {
  renderProps();
  preloadAssets();

  hatchButton.addEventListener('click', enterBunker);
  closePanelButton.addEventListener('click', closeInfoPanel);
  panelBackdrop.addEventListener('click', closeInfoPanel);
  document.addEventListener('keydown', handleKeyboard);
}

init();
