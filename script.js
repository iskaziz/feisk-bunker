const app = document.querySelector('#app');
const hatchButton = document.querySelector('#hatchButton');
const loadingText = document.querySelector('#loadingText');
const loadingProgress = document.querySelector('#loadingProgress');
const loadingScreen = document.querySelector('#loadingScreen');
const bunkerScene = document.querySelector('#bunkerScene');
const sceneViewport = document.querySelector('#sceneViewport');
const sceneStage = document.querySelector('#sceneStage');
const bunkerBackground = document.querySelector('#bunkerBackground');
const hotspotsLayer = document.querySelector('#hotspotsLayer');
const infoPanel = document.querySelector('#infoPanel');
const panelBackdrop = document.querySelector('#panelBackdrop');
const closePanelButton = document.querySelector('#closePanelButton');
const infoKicker = document.querySelector('#infoKicker');
const infoTitle = document.querySelector('#infoTitle');
const infoBody = document.querySelector('#infoBody');
const mobileOrientationPrompt = document.querySelector('#mobileOrientationPrompt');
const continuePortraitButton = document.querySelector('#continuePortraitButton');
const editDoorHotspot = document.querySelector('#editDoorHotspot');
const editorPanel = document.querySelector('#editorPanel');
const editorStatus = document.querySelector('#editorStatus');
const editorSelected = document.querySelector('#editorSelected');
const editorValues = document.querySelector('#editorValues');
const editorCopyButton = document.querySelector('#editorCopyButton');
const editorDownloadButton = document.querySelector('#editorDownloadButton');
const editorResetButton = document.querySelector('#editorResetButton');
const editorCloseButton = document.querySelector('#editorCloseButton');
const editorMinimizeButton = document.querySelector('#editorMinimizeButton');

const DEFAULT_DATA = {
  backgrounds: { bunkerRoom: 'assets/backgrounds/bunker-room-final.png' },
  hotspots: []
};

const ACTIVE_DATA = (() => {
  const source = window.FEISK_ASSETS || DEFAULT_DATA;
  const legacyProps = Array.isArray(source.props) ? source.props : [];
  const hotspots = Array.isArray(source.hotspots) ? source.hotspots : legacyProps;

  return {
    backgrounds: source.backgrounds || DEFAULT_DATA.backgrounds,
    hotspots: hotspots.map((hotspot) => ({ ...hotspot }))
  };
})();

const STORAGE_KEY = 'feisk-bunker-hotspot-placement-v1';
const originalHotspots = ACTIVE_DATA.hotspots.map((hotspot) => ({ ...hotspot }));

const appState = {
  isLoaded: false,
  hasEntered: false,
  activeHotspotId: null,
  portraitBypass: false,
  editorMode: false,
  selectedHotspotId: null,
  doorClickCount: 0,
  doorClickTimer: null,
  dragState: null,
  resizeState: null,
  editorMinimized: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function getHotspotById(id) {
  return ACTIVE_DATA.hotspots.find((hotspot) => hotspot.id === id);
}

function unlockHatch(message = 'Click the hatch to enter.') {
  appState.isLoaded = true;
  app.classList.remove('app--loading');
  app.classList.add('app--ready');
  hatchButton.disabled = false;
  loadingProgress.style.width = '100%';
  loadingText.textContent = message;
}

function getAllImageSources() {
  const backgroundSources = [
    ACTIVE_DATA.backgrounds.bunkerRoom,
    ACTIVE_DATA.backgrounds.loadingPortrait,
    ACTIVE_DATA.backgrounds.loadingLandscape
  ].filter(Boolean);

  const loadingSources = window.FEISK_LOADING_SCREEN?.uiAssets || [];
  return [...new Set([...backgroundSources, ...loadingSources])];
}

function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src || typeof src !== 'string') {
      resolve({ src, status: 'skipped' });
      return;
    }

    const image = new Image();
    let done = false;

    const finish = (status) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      resolve({ src, status });
    };

    const timer = window.setTimeout(() => finish('timeout'), 5000);
    image.onload = () => finish('loaded');
    image.onerror = () => finish('missing');
    image.src = src;
  });
}

async function preloadAssets() {
  const safetyTimer = window.setTimeout(() => {
    if (!appState.isLoaded) unlockHatch('Click the hatch to enter.');
  }, 8000);

  try {
    const sources = getAllImageSources();
    let completed = 0;

    if (!sources.length) {
      unlockHatch();
      return;
    }

    await Promise.all(sources.map(async (src) => {
      const result = await preloadImage(src);
      completed += 1;
      const percent = Math.round((completed / sources.length) * 100);
      loadingProgress.style.width = `${percent}%`;
      loadingText.textContent = `Loading vault assets... ${percent}%`;
      if (result.status !== 'loaded') {
        console.warn(`[Feisk] Asset ${result.status}: ${src}`);
      }
      return result;
    }));

    unlockHatch();
  } catch (error) {
    console.error('[Feisk] Preload failed:', error);
    unlockHatch('Click the hatch to enter.');
  } finally {
    window.clearTimeout(safetyTimer);
  }
}

function loadSavedPlacement() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (!Array.isArray(saved)) return;

    saved.forEach((savedHotspot) => {
      const target = getHotspotById(savedHotspot.id);
      if (!target) return;
      target.x = savedHotspot.x;
      target.y = savedHotspot.y;
      target.width = savedHotspot.width;
      target.height = savedHotspot.height;
    });
  } catch (error) {
    console.warn('[Feisk] Saved hotspot placement ignored:', error);
  }
}

function savePlacement() {
  const payload = ACTIVE_DATA.hotspots.map(({ id, x, y, width, height }) => ({ id, x, y, width, height }));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function applyHotspotPlacement(button, hotspot) {
  button.style.left = `${hotspot.x}%`;
  button.style.top = `${hotspot.y}%`;
  button.style.width = `${hotspot.width}%`;
  button.style.height = `${hotspot.height}%`;
}

function updateHotspotElement(id) {
  const hotspot = getHotspotById(id);
  const button = hotspotsLayer.querySelector(`[data-hotspot-id="${id}"]`);
  if (!hotspot || !button) return;
  applyHotspotPlacement(button, hotspot);
}

function renderSceneBackground() {
  bunkerBackground.src = ACTIVE_DATA.backgrounds.bunkerRoom || DEFAULT_DATA.backgrounds.bunkerRoom;
}

function renderHotspots() {
  hotspotsLayer.innerHTML = '';

  ACTIVE_DATA.hotspots.forEach((hotspot) => {
    const button = document.createElement('button');
    button.className = 'scene-hotspot';
    button.type = 'button';
    button.dataset.hotspotId = hotspot.id;
    button.setAttribute('aria-label', `Open ${hotspot.title || hotspot.label || hotspot.id} information`);
    applyHotspotPlacement(button, hotspot);

    const label = document.createElement('span');
    label.className = 'scene-hotspot__label';
    label.textContent = hotspot.label || hotspot.title || hotspot.id;

    const moveHandle = document.createElement('span');
    moveHandle.className = 'scene-hotspot__move-handle';
    moveHandle.setAttribute('aria-hidden', 'true');

    const resizeHandle = document.createElement('span');
    resizeHandle.className = 'scene-hotspot__resize-handle';
    resizeHandle.setAttribute('aria-hidden', 'true');

    button.append(label, moveHandle, resizeHandle);

    button.addEventListener('click', (event) => {
      if (appState.editorMode) {
        event.preventDefault();
        event.stopPropagation();
        selectHotspot(hotspot.id);
        return;
      }

      openInfoPanel(hotspot.id);
      button.classList.add('is-active');
      window.setTimeout(() => button.classList.remove('is-active'), 450);
    });

    button.addEventListener('pointerdown', (event) => {
      if (!appState.editorMode) return;
      if (event.target.classList.contains('scene-hotspot__resize-handle')) return;
      beginDrag(event, hotspot.id);
    });

    resizeHandle.addEventListener('pointerdown', (event) => beginResize(event, hotspot.id));
    moveHandle.addEventListener('pointerdown', (event) => beginDrag(event, hotspot.id));

    hotspotsLayer.appendChild(button);
  });
}

function openInfoPanel(id) {
  const hotspot = getHotspotById(id);
  if (!hotspot) return;

  appState.activeHotspotId = id;
  infoKicker.textContent = hotspot.kicker || 'Archive Object';
  infoTitle.textContent = hotspot.title || hotspot.label || id;
  infoBody.textContent = hotspot.body || '';

  infoPanel.classList.add('is-open');
  infoPanel.setAttribute('aria-hidden', 'false');
  panelBackdrop.hidden = false;
  window.setTimeout(() => closePanelButton.focus({ preventScroll: true }), 20);
}

function closeInfoPanel() {
  appState.activeHotspotId = null;
  infoPanel.classList.remove('is-open');
  infoPanel.setAttribute('aria-hidden', 'true');
  panelBackdrop.hidden = true;
}

function enterBunker() {
  if (!appState.isLoaded) return;

  appState.hasEntered = true;
  app.classList.add('app--entering');
  hatchButton.disabled = true;
  loadingText.textContent = 'Opening hatch...';

  window.setTimeout(() => {
    app.classList.remove('app--loading', 'app--ready', 'app--entering');
    app.classList.add('app--inside');
    loadingScreen.setAttribute('aria-hidden', 'true');
    bunkerScene.setAttribute('aria-hidden', 'false');
    checkMobileOrientation();
  }, 950);
}

function checkMobileOrientation() {
  const isPortraitMobile = window.matchMedia('(max-width: 820px) and (orientation: portrait)').matches;
  const shouldShow = isPortraitMobile && !appState.portraitBypass && appState.hasEntered;

  mobileOrientationPrompt.classList.toggle('is-visible', shouldShow);
  mobileOrientationPrompt.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  sceneViewport.classList.toggle('scene-viewport--portrait-scroll', isPortraitMobile);
}

function handleEditorDoorClick() {
  if (!appState.hasEntered) return;

  appState.doorClickCount += 1;
  window.clearTimeout(appState.doorClickTimer);

  appState.doorClickTimer = window.setTimeout(() => {
    appState.doorClickCount = 0;
  }, 900);

  if (appState.doorClickCount >= 3) {
    appState.doorClickCount = 0;
    toggleEditor(!appState.editorMode);
  }
}

function toggleEditor(enabled) {
  appState.editorMode = enabled;
  app.classList.toggle('app--editor', enabled);
  editorPanel.hidden = !enabled;

  if (enabled) {
    editorStatus.textContent = 'Editor enabled. Select a hotspot to move or resize it.';
    if (!appState.selectedHotspotId && ACTIVE_DATA.hotspots[0]) selectHotspot(ACTIVE_DATA.hotspots[0].id);
  } else {
    appState.selectedHotspotId = null;
    document.querySelectorAll('.scene-hotspot.is-selected').forEach((el) => el.classList.remove('is-selected'));
    editorSelected.textContent = 'No hotspot selected';
    editorValues.textContent = '';
  }
}

function selectHotspot(id) {
  const hotspot = getHotspotById(id);
  if (!hotspot) return;

  appState.selectedHotspotId = id;
  document.querySelectorAll('.scene-hotspot.is-selected').forEach((el) => el.classList.remove('is-selected'));
  hotspotsLayer.querySelector(`[data-hotspot-id="${id}"]`)?.classList.add('is-selected');
  editorSelected.textContent = hotspot.label || hotspot.title || id;
  updateEditorValues();
}

function updateEditorValues() {
  const hotspot = getHotspotById(appState.selectedHotspotId);
  if (!hotspot) {
    editorValues.textContent = '';
    return;
  }

  editorValues.textContent = `id: ${hotspot.id}\nx: ${round1(hotspot.x)}\ny: ${round1(hotspot.y)}\nwidth: ${round1(hotspot.width)}\nheight: ${round1(hotspot.height)}`;
}

function getStagePercentFromPointer(event) {
  const rect = sceneStage.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  };
}

function beginDrag(event, id) {
  if (!appState.editorMode) return;
  event.preventDefault();
  event.stopPropagation();

  const hotspot = getHotspotById(id);
  if (!hotspot) return;

  selectHotspot(id);
  const pointer = getStagePercentFromPointer(event);
  appState.dragState = {
    id,
    pointerId: event.pointerId,
    startPointerX: pointer.x,
    startPointerY: pointer.y,
    startX: hotspot.x,
    startY: hotspot.y
  };

  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function beginResize(event, id) {
  if (!appState.editorMode) return;
  event.preventDefault();
  event.stopPropagation();

  const hotspot = getHotspotById(id);
  if (!hotspot) return;

  selectHotspot(id);
  const pointer = getStagePercentFromPointer(event);
  appState.resizeState = {
    id,
    pointerId: event.pointerId,
    startPointerX: pointer.x,
    startPointerY: pointer.y,
    startWidth: hotspot.width,
    startHeight: hotspot.height
  };

  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function handlePointerMove(event) {
  if (appState.dragState) {
    const hotspot = getHotspotById(appState.dragState.id);
    if (!hotspot) return;

    const pointer = getStagePercentFromPointer(event);
    const dx = pointer.x - appState.dragState.startPointerX;
    const dy = pointer.y - appState.dragState.startPointerY;

    hotspot.x = round1(clamp(appState.dragState.startX + dx, 0, 100 - hotspot.width));
    hotspot.y = round1(clamp(appState.dragState.startY + dy, 0, 100 - hotspot.height));

    updateHotspotElement(hotspot.id);
    updateEditorValues();
    savePlacement();
  }

  if (appState.resizeState) {
    const hotspot = getHotspotById(appState.resizeState.id);
    if (!hotspot) return;

    const pointer = getStagePercentFromPointer(event);
    const dx = pointer.x - appState.resizeState.startPointerX;
    const dy = pointer.y - appState.resizeState.startPointerY;

    hotspot.width = round1(clamp(appState.resizeState.startWidth + dx, 2, 100 - hotspot.x));
    hotspot.height = round1(clamp(appState.resizeState.startHeight + dy, 2, 100 - hotspot.y));

    updateHotspotElement(hotspot.id);
    updateEditorValues();
    savePlacement();
  }
}

function handlePointerUp() {
  appState.dragState = null;
  appState.resizeState = null;
}

function nudgeSelectedHotspot(event) {
  if (!appState.editorMode || !appState.selectedHotspotId) return;
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (!keys.includes(event.key)) return;

  const hotspot = getHotspotById(appState.selectedHotspotId);
  if (!hotspot) return;

  event.preventDefault();
  const amount = event.shiftKey ? 1 : 0.2;
  if (event.key === 'ArrowLeft') hotspot.x = round1(clamp(hotspot.x - amount, 0, 100 - hotspot.width));
  if (event.key === 'ArrowRight') hotspot.x = round1(clamp(hotspot.x + amount, 0, 100 - hotspot.width));
  if (event.key === 'ArrowUp') hotspot.y = round1(clamp(hotspot.y - amount, 0, 100 - hotspot.height));
  if (event.key === 'ArrowDown') hotspot.y = round1(clamp(hotspot.y + amount, 0, 100 - hotspot.height));

  updateHotspotElement(hotspot.id);
  updateEditorValues();
  savePlacement();
}

function buildExportedDataJs() {
  const data = {
    backgrounds: ACTIVE_DATA.backgrounds,
    hotspots: ACTIVE_DATA.hotspots.map((hotspot) => ({
      id: hotspot.id,
      label: hotspot.label,
      title: hotspot.title,
      kicker: hotspot.kicker,
      body: hotspot.body,
      x: round1(hotspot.x),
      y: round1(hotspot.y),
      width: round1(hotspot.width),
      height: round1(hotspot.height)
    }))
  };

  return `/*\n  Feisk Productions Vault data file.\n  Hotspot x/y/width/height values are percentages relative to the 16:9 background.\n*/\n\nwindow.FEISK_ASSETS = ${JSON.stringify(data, null, 2)};\nwindow.FEISK_HOTSPOTS = window.FEISK_ASSETS.hotspots;\n`;
}

async function copyPlacement() {
  const text = ACTIVE_DATA.hotspots.map((hotspot) => (
    `${hotspot.id}: x ${round1(hotspot.x)}, y ${round1(hotspot.y)}, width ${round1(hotspot.width)}, height ${round1(hotspot.height)}`
  )).join('\n');

  try {
    await navigator.clipboard.writeText(text);
    editorStatus.textContent = 'Hotspot placement copied.';
  } catch {
    editorStatus.textContent = 'Copy failed. Use Download data.js instead.';
  }
}

function downloadDataFile() {
  const blob = new Blob([buildExportedDataJs()], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.js';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  editorStatus.textContent = 'Downloaded data.js. Replace the repo file with it.';
}

function resetPlacement() {
  ACTIVE_DATA.hotspots.forEach((hotspot) => {
    const original = originalHotspots.find((item) => item.id === hotspot.id);
    if (!original) return;
    hotspot.x = original.x;
    hotspot.y = original.y;
    hotspot.width = original.width;
    hotspot.height = original.height;
    updateHotspotElement(hotspot.id);
  });

  window.localStorage.removeItem(STORAGE_KEY);
  updateEditorValues();
  editorStatus.textContent = 'Hotspot placement reset.';
}

function toggleEditorMinimized() {
  appState.editorMinimized = !appState.editorMinimized;
  editorPanel.classList.toggle('is-minimized', appState.editorMinimized);
  editorMinimizeButton.textContent = appState.editorMinimized ? '▢' : '–';
  editorMinimizeButton.setAttribute('aria-label', appState.editorMinimized ? 'Expand editor' : 'Minimize editor');
}

function init() {
  renderSceneBackground();
  loadSavedPlacement();
  renderHotspots();
  preloadAssets();
  checkMobileOrientation();

  hatchButton.addEventListener('click', enterBunker);
  closePanelButton.addEventListener('click', closeInfoPanel);
  panelBackdrop.addEventListener('click', closeInfoPanel);
  continuePortraitButton.addEventListener('click', () => {
    appState.portraitBypass = true;
    checkMobileOrientation();
  });

  editDoorHotspot.addEventListener('click', handleEditorDoorClick);
  editorCloseButton.addEventListener('click', () => toggleEditor(false));
  editorMinimizeButton.addEventListener('click', toggleEditorMinimized);
  editorCopyButton.addEventListener('click', copyPlacement);
  editorDownloadButton.addEventListener('click', downloadDataFile);
  editorResetButton.addEventListener('click', resetPlacement);

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('resize', checkMobileOrientation);
  window.addEventListener('orientationchange', () => window.setTimeout(checkMobileOrientation, 250));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeInfoPanel();
    nudgeSelectedHotspot(event);
  });
}

window.addEventListener('error', (event) => {
  console.error('[Feisk runtime error]', event.message, event.error || event);
  if (!appState.hasEntered) unlockHatch('Boot warning. Click the hatch to continue.');
});

init();
