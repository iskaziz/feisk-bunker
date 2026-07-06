const app = document.querySelector('#app');
const hatchButton = document.querySelector('#hatchButton');
const loadingText = document.querySelector('#loadingText');
const loadingProgress = document.querySelector('#loadingProgress');
const loadingScreen = document.querySelector('#loadingScreen');
const bunkerScene = document.querySelector('#bunkerScene');
const sceneViewport = document.querySelector('#sceneViewport');
const sceneStage = document.querySelector('#sceneStage');
const propsLayer = document.querySelector('#propsLayer');
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


function showBootWarning(message) {
  console.warn('[Feisk boot]', message);
  if (loadingText && !appState?.hasEntered) {
    loadingText.textContent = message;
  }
}

window.addEventListener('error', (event) => {
  const message = event.message || 'Unknown JavaScript error';
  console.error('[Feisk runtime error]', message, event.error || event);
  if (loadingText && !appState?.hasEntered) {
    loadingText.textContent = `Boot warning: ${message}. Click the hatch to continue.`;
  }
  if (hatchButton) hatchButton.disabled = false;
  if (app) {
    app.classList.remove('app--loading');
    app.classList.add('app--ready');
  }
});

const STORAGE_KEY = 'feisk-bunker-prop-placement-v1';

const DEFAULT_FEISK_ASSETS = {
  backgrounds: { bunkerRoom: 'assets/backgrounds/bunker-room-background-reference.png' },
  props: []
};

const ACTIVE_FEISK_ASSETS = (() => {
  const candidate = window.FEISK_ASSETS || window.FEISK_LAYER_B_PROPS || DEFAULT_FEISK_ASSETS;
  return {
    backgrounds: candidate.backgrounds || DEFAULT_FEISK_ASSETS.backgrounds,
    props: Array.isArray(candidate.props) ? candidate.props : []
  };
})();

const appState = {
  isLoaded: false,
  hasEntered: false,
  activePropId: null,
  portraitBypass: false,
  editorMode: false,
  selectedPropId: null,
  doorClickCount: 0,
  doorClickTimer: null,
  dragState: null,
  resizeState: null
};

const originalProps = ACTIVE_FEISK_ASSETS.props.map((prop) => ({ ...prop }));

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
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
  const backgroundSources = [ACTIVE_FEISK_ASSETS.backgrounds.bunkerRoom].filter(Boolean);
  const propSources = ACTIVE_FEISK_ASSETS.props.map((prop) => prop.src);
  const loadingSources = window.FEISK_LOADING_SCREEN?.uiAssets || [];
  return [...backgroundSources, ...propSources, ...loadingSources];
}

function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src || typeof src !== 'string') {
      resolve({ src, status: 'skipped' });
      return;
    }

    const image = new Image();
    let isDone = false;

    const finish = (status) => {
      if (isDone) return;
      isDone = true;
      window.clearTimeout(timer);
      resolve({ src, status });
    };

    const timer = window.setTimeout(() => {
      console.warn(`Prototype asset timed out while loading: ${src}`);
      finish('timeout');
    }, 4500);

    image.onload = () => finish('loaded');

    image.onerror = () => {
      console.warn(`Prototype asset missing or failed to load: ${src}`);
      finish('missing');
    };

    image.src = src;
  });
}

async function preloadAssets() {
  const safetyTimer = window.setTimeout(() => {
    if (!appState.isLoaded) unlockHatch('Click the hatch to enter.');
  }, 7000);

  try {
  const sources = getAllImageSources();
  let loadedCount = 0;

  if (!sources.length) {
    unlockHatch();
    return;
  }

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

  unlockHatch();
  } catch (error) {
    console.error('[Feisk preload failed]', error);
    unlockHatch('Click the hatch to enter.');
  } finally {
    window.clearTimeout(safetyTimer);
  }
}

function renderSceneBackground() {
  const background = document.querySelector('#bunkerBackground');
  if (!background) return;

  background.src = ACTIVE_FEISK_ASSETS.backgrounds.bunkerRoom;
}

function getPropById(propId) {
  return ACTIVE_FEISK_ASSETS.props.find((prop) => prop.id === propId);
}

function applyPropPlacement(button, prop) {
  button.style.left = `${prop.x}%`;
  button.style.top = `${prop.y}%`;
  button.style.width = `${prop.width}%`;
  button.style.height = `${prop.height}%`;

  if (prop.zIndex) {
    button.style.zIndex = prop.zIndex;
  }
}

function updatePropElement(propId) {
  const prop = getPropById(propId);
  const button = propsLayer.querySelector(`[data-prop-id="${propId}"]`);
  if (!prop || !button) return;

  applyPropPlacement(button, prop);
}

function renderProps() {
  propsLayer.innerHTML = '';

  ACTIVE_FEISK_ASSETS.props.forEach((prop) => {
    const button = document.createElement('button');
    button.className = 'scene-prop';
    button.type = 'button';
    button.dataset.propId = prop.id;
    button.setAttribute('aria-label', `Open ${prop.title} information`);
    applyPropPlacement(button, prop);

    const image = document.createElement('img');
    image.src = prop.src;
    image.alt = prop.alt;
    image.draggable = false;

    const moveHandle = document.createElement('span');
    moveHandle.className = 'scene-prop__move-handle';
    moveHandle.setAttribute('aria-hidden', 'true');

    const resizeHandle = document.createElement('span');
    resizeHandle.className = 'scene-prop__resize-handle';
    resizeHandle.setAttribute('aria-hidden', 'true');

    button.appendChild(image);
    button.appendChild(moveHandle);
    button.appendChild(resizeHandle);

    button.addEventListener('click', (event) => {
      if (appState.editorMode) {
        event.preventDefault();
        event.stopPropagation();
        selectProp(prop.id);
        return;
      }

      openInfoPanel(prop.id);
    });

    button.addEventListener('pointerdown', (event) => handlePropPointerDown(event, prop.id));
    moveHandle.addEventListener('pointerdown', (event) => handlePropPointerDown(event, prop.id));
    resizeHandle.addEventListener('pointerdown', (event) => handleResizePointerDown(event, prop.id));

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
  const prop = getPropById(propId);
  if (!prop) return;

  appState.activePropId = propId;
  infoKicker.textContent = prop.kicker;
  infoTitle.textContent = prop.title;
  infoBody.textContent = prop.body;

  panelBackdrop.hidden = false;
  infoPanel.setAttribute('aria-hidden', 'false');
  app.classList.add('app--panel-open');
  closePanelButton.focus({ preventScroll: true });
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

function continueInPortrait() {
  appState.portraitBypass = true;
  updateOrientationPrompt();
  centerSceneScroll();
}

function handleDoorTripleClick() {
  if (!appState.hasEntered) return;

  appState.doorClickCount += 1;
  editDoorHotspot.classList.add('editor-door-hotspot--ping');

  window.setTimeout(() => {
    editDoorHotspot.classList.remove('editor-door-hotspot--ping');
  }, 180);

  clearTimeout(appState.doorClickTimer);

  if (appState.doorClickCount >= 3) {
    appState.doorClickCount = 0;
    toggleEditorMode();
    return;
  }

  appState.doorClickTimer = window.setTimeout(() => {
    appState.doorClickCount = 0;
  }, 900);
}

function toggleEditorMode(forceValue) {
  appState.editorMode = typeof forceValue === 'boolean' ? forceValue : !appState.editorMode;
  app.classList.toggle('app--editor-mode', appState.editorMode);
  editorPanel.hidden = !appState.editorMode;

  if (appState.editorMode) {
    closeInfoPanel();
    if (ACTIVE_FEISK_ASSETS.props.length) selectProp(appState.selectedPropId || ACTIVE_FEISK_ASSETS.props[0].id);
    updateEditorStatus('Editor mode enabled. Drag props, or use the green corner handle to move. Pull the gold corner handle to resize.');
  } else {
    appState.selectedPropId = null;
    updateSelectedClass();
  }
}

function selectProp(propId) {
  const prop = getPropById(propId);
  if (!prop) return;

  appState.selectedPropId = propId;
  updateSelectedClass();
  updateEditorReadout();
}

function updateSelectedClass() {
  propsLayer.querySelectorAll('.scene-prop').forEach((button) => {
    button.classList.toggle('scene-prop--selected', button.dataset.propId === appState.selectedPropId);
  });
}

function updateEditorStatus(message) {
  if (editorStatus) editorStatus.textContent = message;
}

function updateEditorReadout() {
  const prop = getPropById(appState.selectedPropId);
  if (!prop) {
    editorSelected.textContent = 'No prop selected';
    editorValues.textContent = '';
    return;
  }

  editorSelected.textContent = prop.title;
  editorValues.textContent = `id: ${prop.id}\nx: ${round1(prop.x)}\ny: ${round1(prop.y)}\nwidth: ${round1(prop.width)}\nheight: ${round1(prop.height)}\nzIndex: ${prop.zIndex || 7}`;
}

function stagePointToPercent(clientX, clientY) {
  const rect = sceneStage.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100
  };
}

function handlePropPointerDown(event, propId) {
  if (!appState.editorMode) return;
  if (event.target.classList.contains('scene-prop__resize-handle')) return;

  const prop = getPropById(propId);
  if (!prop) return;

  event.preventDefault();
  event.stopPropagation();
  selectProp(propId);

  const start = stagePointToPercent(event.clientX, event.clientY);
  appState.dragState = {
    propId,
    pointerId: event.pointerId,
    startX: start.x,
    startY: start.y,
    propX: prop.x,
    propY: prop.y
  };

  event.currentTarget.setPointerCapture(event.pointerId);
}

function handleResizePointerDown(event, propId) {
  if (!appState.editorMode) return;

  const prop = getPropById(propId);
  if (!prop) return;

  event.preventDefault();
  event.stopPropagation();
  selectProp(propId);

  const start = stagePointToPercent(event.clientX, event.clientY);
  appState.resizeState = {
    propId,
    pointerId: event.pointerId,
    startX: start.x,
    startY: start.y,
    width: prop.width,
    height: prop.height
  };

  event.currentTarget.parentElement.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  if (appState.dragState) {
    const state = appState.dragState;
    const prop = getPropById(state.propId);
    if (!prop) return;

    const point = stagePointToPercent(event.clientX, event.clientY);
    prop.x = round1(clamp(state.propX + point.x - state.startX, 0, 100));
    prop.y = round1(clamp(state.propY + point.y - state.startY, 0, 100));
    updatePropElement(prop.id);
    updateEditorReadout();
    return;
  }

  if (appState.resizeState) {
    const state = appState.resizeState;
    const prop = getPropById(state.propId);
    if (!prop) return;

    const point = stagePointToPercent(event.clientX, event.clientY);
    const deltaX = point.x - state.startX;
    const deltaY = point.y - state.startY;
    prop.width = round1(clamp(state.width + deltaX, 2, 70));
    prop.height = round1(clamp(state.height + deltaY, 2, 70));
    updatePropElement(prop.id);
    updateEditorReadout();
  }
}

function getExportableAssets() {
  return {
    backgrounds: { ...ACTIVE_FEISK_ASSETS.backgrounds },
    props: ACTIVE_FEISK_ASSETS.props.map((prop) => ({
      ...prop,
      x: round1(prop.x),
      y: round1(prop.y),
      width: round1(prop.width),
      height: round1(prop.height),
      zIndex: prop.zIndex
    }))
  };
}

function savePlacementToLocalStorage() {
  const placement = ACTIVE_FEISK_ASSETS.props.map(({ id, x, y, width, height, zIndex }) => ({
    id,
    x: round1(x),
    y: round1(y),
    width: round1(width),
    height: round1(height),
    zIndex
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(placement));
  updateEditorStatus('Saved to this browser. Use Copy data.js placement to update your project files.');
}

function handlePointerUp() {
  if (appState.dragState || appState.resizeState) {
    savePlacementToLocalStorage();
  }

  appState.dragState = null;
  appState.resizeState = null;
}

function loadPlacementFromLocalStorage() {
  const rawPlacement = localStorage.getItem(STORAGE_KEY);
  if (!rawPlacement) return;

  try {
    const savedPlacement = JSON.parse(rawPlacement);
    savedPlacement.forEach((savedProp) => {
      const prop = getPropById(savedProp.id);
      if (!prop) return;

      prop.x = savedProp.x;
      prop.y = savedProp.y;
      prop.width = savedProp.width;
      prop.height = savedProp.height;
      prop.zIndex = savedProp.zIndex;
    });
  } catch (error) {
    console.warn('Could not load saved prop placement:', error);
  }
}

function getPlacementExport() {
  const props = ACTIVE_FEISK_ASSETS.props.map(({ id, x, y, width, height, zIndex }) => ({
    id,
    x: round1(x),
    y: round1(y),
    width: round1(width),
    height: round1(height),
    zIndex
  }));

  return JSON.stringify(props, null, 2);
}

function getDataFileExport() {
  return `/*
  Feisk Productions Vault data file
  Exported from the in-browser prop placement editor.

  Position and size values are percentages relative to the 16:9 scene stage.
  x/y mark the centre point of the clickable PNG on the stage.
*/

window.FEISK_ASSETS = ${JSON.stringify(getExportableAssets(), null, 2)};
window.FEISK_LAYER_B_PROPS = window.FEISK_ASSETS;
`;
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function downloadDataFile() {
  savePlacementToLocalStorage();
  downloadTextFile('data.js', getDataFileExport());
  updateEditorStatus('Downloaded data.js with the current prop placement. Replace your existing data.js with this file.');
}

async function copyPlacement() {
  const exportText = getPlacementExport();

  try {
    await navigator.clipboard.writeText(exportText);
    updateEditorStatus('Placement copied. Paste these values into data.js or data.layer-b-props.js.');
  } catch (error) {
    updateEditorStatus('Copy failed. Open the console and copy window.FEISK_PROP_PLACEMENT_EXPORT.');
    window.FEISK_PROP_PLACEMENT_EXPORT = exportText;
  }
}

function resetPlacement() {
  originalProps.forEach((originalProp) => {
    const prop = getPropById(originalProp.id);
    if (!prop) return;

    prop.x = originalProp.x;
    prop.y = originalProp.y;
    prop.width = originalProp.width;
    prop.height = originalProp.height;
    prop.zIndex = originalProp.zIndex;
    updatePropElement(prop.id);
  });

  localStorage.removeItem(STORAGE_KEY);
  updateEditorReadout();
  updateEditorStatus('Placement reset to the values currently shipped in data.js.');
}

function nudgeSelectedProp(event) {
  if (!appState.editorMode || !appState.selectedPropId) return;

  const prop = getPropById(appState.selectedPropId);
  if (!prop) return;

  const step = event.shiftKey ? 1 : 0.2;
  let didMove = false;

  if (event.key === 'ArrowLeft') {
    prop.x = round1(clamp(prop.x - step, 0, 100));
    didMove = true;
  }

  if (event.key === 'ArrowRight') {
    prop.x = round1(clamp(prop.x + step, 0, 100));
    didMove = true;
  }

  if (event.key === 'ArrowUp') {
    prop.y = round1(clamp(prop.y - step, 0, 100));
    didMove = true;
  }

  if (event.key === 'ArrowDown') {
    prop.y = round1(clamp(prop.y + step, 0, 100));
    didMove = true;
  }

  if (didMove) {
    event.preventDefault();
    updatePropElement(prop.id);
    updateEditorReadout();
    savePlacementToLocalStorage();
  }
}

function handleKeyboard(event) {
  if (event.key === 'Escape') {
    if (appState.editorMode) {
      toggleEditorMode(false);
      return;
    }

    if (app.classList.contains('app--panel-open')) {
      closeInfoPanel();
    }
  }

  nudgeSelectedProp(event);
}

function init() {
  loadPlacementFromLocalStorage();
  renderSceneBackground();
  renderProps();
  preloadAssets();

  hatchButton.addEventListener('click', enterBunker);
  closePanelButton.addEventListener('click', closeInfoPanel);
  panelBackdrop.addEventListener('click', closeInfoPanel);
  document.addEventListener('keydown', handleKeyboard);
  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', handlePointerUp);
  document.addEventListener('pointercancel', handlePointerUp);

  if (continuePortraitButton) {
    continuePortraitButton.addEventListener('click', continueInPortrait);
  }

  if (editDoorHotspot) {
    editDoorHotspot.addEventListener('click', handleDoorTripleClick);
  }

  if (editorCopyButton) {
    editorCopyButton.addEventListener('click', copyPlacement);
  }

  if (editorDownloadButton) {
    editorDownloadButton.addEventListener('click', downloadDataFile);
  }

  if (editorResetButton) {
    editorResetButton.addEventListener('click', resetPlacement);
  }

  if (editorCloseButton) {
    editorCloseButton.addEventListener('click', () => toggleEditorMode(false));
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

try {
  init();
} catch (error) {
  console.error('[Feisk init failed]', error);
  if (loadingText) loadingText.textContent = `Boot warning: ${error.message}. Click the hatch to continue.`;
  if (hatchButton) hatchButton.disabled = false;
  if (app) {
    app.classList.remove('app--loading');
    app.classList.add('app--ready');
  }
}
