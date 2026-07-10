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
const editLadderHotspot = document.querySelector('#editLadderHotspot');
const panelBackdrop = document.querySelector('#panelBackdrop');
const infoPanel = document.querySelector('#infoPanel');
const closePanelButton = document.querySelector('#closePanelButton');
const infoKicker = document.querySelector('#infoKicker');
const infoTitle = document.querySelector('#infoTitle');
const infoBody = document.querySelector('#infoBody');
const editorPanel = document.querySelector('#editorPanel');
const editorHeader = document.querySelector('#editorHeader');
const editorStatus = document.querySelector('#editorStatus');
const editorSelected = document.querySelector('#editorSelected');
const editorValues = document.querySelector('#editorValues');
const editorCopyButton = document.querySelector('#editorCopyButton');
const editorDownloadButton = document.querySelector('#editorDownloadButton');
const editorResetButton = document.querySelector('#editorResetButton');
const editorCloseButton = document.querySelector('#editorCloseButton');
const editorMinimiseButton = document.querySelector('#editorMinimiseButton');
const dustLayer = document.querySelector('#dustLayer');
const rotatePrompt = document.querySelector('#rotatePrompt');
const forceRotateButton = document.querySelector('#forceRotateButton');
const continuePortraitButton = document.querySelector('#continuePortraitButton');
const computerOverlay = document.querySelector('#computerOverlay');
const computerIcons = document.querySelector('#computerIcons');
const computerCloseButton = document.querySelector('#computerCloseButton');
const computerWindowKicker = document.querySelector('#computerWindowKicker');
const computerWindowTitle = document.querySelector('#computerWindowTitle');
const computerWindowBody = document.querySelector('#computerWindowBody');

const DEFAULT_ASSETS = {
  backgrounds: {
    bunkerRoom: 'assets/backgrounds/bunker-room-final.png',
    loadingPortrait: 'assets/backgrounds/loading-jungle-portrait.png',
    loadingLandscape: 'assets/backgrounds/loading-jungle-landscape.png'
  },
  hotspots: [],
  computerIcons: []
};

const ACTIVE_ASSETS = window.FEISK_ASSETS || DEFAULT_ASSETS;
const hotspots = Array.isArray(ACTIVE_ASSETS.hotspots) ? ACTIVE_ASSETS.hotspots : [];
const originalHotspots = hotspots.map((hotspot) => ({ ...hotspot }));

const appState = {
  loaded: false,
  entered: false,
  panelOpen: false,
  editorMode: false,
  selectedId: null,
  ladderClickCount: 0,
  ladderClickTimer: null,
  panX: 0,
  minPanX: 0,
  maxPanX: 0,
  hasUserPanned: false,
  panPointer: null,
  suppressNextClick: false,
  hotspotDrag: null,
  resizeDrag: null,
  editorDrag: null,
  rotatePromptDismissed: false,
  computerOpen: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function isPortraitMobile() {
  return window.matchMedia('(orientation: portrait)').matches;
}

function setLoadingBackgroundVariables() {
  const backgrounds = ACTIVE_ASSETS.backgrounds || {};
  document.documentElement.style.setProperty('--loading-bg-image', `url('${backgrounds.loadingLandscape || DEFAULT_ASSETS.backgrounds.loadingLandscape}')`);
  document.documentElement.style.setProperty('--loading-bg-image-portrait', `url('${backgrounds.loadingPortrait || DEFAULT_ASSETS.backgrounds.loadingPortrait}')`);
}

function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

function getImageSources() {
  const bg = ACTIVE_ASSETS.backgrounds || {};
  const loading = window.FEISK_LOADING_SCREEN?.uiAssets || [];
  return [bg.bunkerRoom, bg.loadingPortrait, bg.loadingLandscape, ...loading].filter(Boolean);
}

async function preloadAssets() {
  setLoadingBackgroundVariables();
  const sources = [...new Set(getImageSources())];
  if (!sources.length) {
    unlockHatch();
    return;
  }
  let doneCount = 0;
  await Promise.all(sources.map(async (src) => {
    await preloadImage(src);
    doneCount += 1;
    const pct = Math.round((doneCount / sources.length) * 100);
    if (loadingProgress) loadingProgress.style.width = `${pct}%`;
    if (loadingText) loadingText.textContent = `Loading vault assets... ${pct}%`;
  }));
  unlockHatch();
}

function unlockHatch() {
  appState.loaded = true;
  app.classList.remove('app--loading');
  app.classList.add('app--ready');
  hatchButton.disabled = false;
  loadingText.textContent = 'Click the hatch to enter.';
  loadingProgress.style.width = '100%';
}

function renderBackground() {
  bunkerBackground.src = ACTIVE_ASSETS.backgrounds?.bunkerRoom || DEFAULT_ASSETS.backgrounds.bunkerRoom;
  bunkerBackground.addEventListener('load', () => {
    updateStageSize();
    if (appState.entered && !appState.hasUserPanned) centerPan();
  });
}

function getHotspotById(id) {
  return hotspots.find((hotspot) => hotspot.id === id);
}

function applyHotspotStyle(el, hotspot) {
  if (!el || !hotspot) return;
  el.style.left = `${hotspot.x}%`;
  el.style.top = `${hotspot.y}%`;
  el.style.width = `${hotspot.width}%`;
  el.style.height = `${hotspot.height}%`;
  el.style.borderRadius = hotspot.shape === 'ellipse' ? '999px' : `${hotspot.radius ?? 10}px`;
}

function createDustParticles() {
  if (!dustLayer || dustLayer.childElementCount) return;
  const count = window.matchMedia('(max-width: 1024px)').matches ? 28 : 46;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'dust-particle';
    particle.style.setProperty('--dust-left', `${Math.random() * 100}%`);
    particle.style.setProperty('--dust-size', `${1 + Math.random() * 2.2}px`);
    particle.style.setProperty('--dust-duration', `${14 + Math.random() * 18}s`);
    particle.style.setProperty('--dust-delay', `${-Math.random() * 22}s`);
    particle.style.setProperty('--dust-drift', `${-45 + Math.random() * 90}px`);
    dustLayer.appendChild(particle);
  }
}

function renderComputerIcons() {
  if (!computerIcons) return;
  const items = ACTIVE_ASSETS.computerIcons || [];
  computerIcons.innerHTML = '';
  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'computer-icon';
    button.dataset.iconId = item.id;
    button.textContent = `${item.icon || '▣'} ${item.label || item.title}`;
    button.addEventListener('click', () => selectComputerIcon(item.id));
    computerIcons.appendChild(button);
    if (index === 0) setTimeout(() => selectComputerIcon(item.id), 0);
  });
}

function selectComputerIcon(id) {
  const item = (ACTIVE_ASSETS.computerIcons || []).find((entry) => entry.id === id);
  if (!item) return;
  document.querySelectorAll('.computer-icon').forEach((el) => {
    el.classList.toggle('is-selected', el.dataset.iconId === id);
  });
  computerWindowKicker.textContent = item.kicker || 'Archive File';
  computerWindowTitle.textContent = item.title || item.label || id;
  computerWindowBody.textContent = item.body || '';
}

function openComputerOverlay() {
  appState.computerOpen = true;
  closeInfoPanel();
  app.classList.add('app--computer-open');
  computerOverlay.setAttribute('aria-hidden', 'false');
  renderComputerIcons();
}

function closeComputerOverlay() {
  appState.computerOpen = false;
  app.classList.remove('app--computer-open');
  computerOverlay.setAttribute('aria-hidden', 'true');
}

function shouldShowRotatePrompt() {
  return isPortraitMobile() && appState.entered && !appState.rotatePromptDismissed;
}

function showRotatePromptIfNeeded() {
  const show = shouldShowRotatePrompt();
  rotatePrompt.hidden = !show;
  rotatePrompt.setAttribute('aria-hidden', show ? 'false' : 'true');
}

function hideRotatePrompt() {
  appState.rotatePromptDismissed = true;
  rotatePrompt.hidden = true;
  rotatePrompt.setAttribute('aria-hidden', 'true');
}

async function forceRotate() {
  hideRotatePrompt();
  try {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
    if (screen.orientation?.lock) {
      await screen.orientation.lock('landscape');
    }
  } catch (error) {
    console.info('[Feisk] Rotate lock not supported by this browser:', error);
  } finally {
    updateStageSize();
    centerPan();
  }
}

function continuePortrait() {
  hideRotatePrompt();
  updateStageSize();
  centerPan();
}

function renderHotspots() {
  hotspotsLayer.innerHTML = '';
  hotspots.forEach((hotspot) => {
    const button = document.createElement('button');
    button.className = 'hotspot';
    button.type = 'button';
    button.dataset.hotspotId = hotspot.id;
    button.setAttribute('aria-label', hotspot.label || hotspot.title || hotspot.id);
    applyHotspotStyle(button, hotspot);

    const resizeHandle = document.createElement('span');
    resizeHandle.className = 'hotspot__resize-handle';
    resizeHandle.setAttribute('aria-hidden', 'true');
    button.appendChild(resizeHandle);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      if (appState.suppressNextClick) return;
      if (appState.editorMode) {
        selectHotspot(hotspot.id);
        return;
      }
      if (hotspot.id === 'old-desktop-computer') {
        openComputerOverlay();
        return;
      }
      openInfoPanel(hotspot.id);
    });

    button.addEventListener('pointerdown', (event) => {
      if (!appState.editorMode) return;
      event.preventDefault();
      event.stopPropagation();
      selectHotspot(hotspot.id);
      startHotspotDrag(event, hotspot.id);
    });

    resizeHandle.addEventListener('pointerdown', (event) => {
      if (!appState.editorMode) return;
      event.preventDefault();
      event.stopPropagation();
      selectHotspot(hotspot.id);
      startResizeDrag(event, hotspot.id);
    });

    hotspotsLayer.appendChild(button);
  });
}

function updateStageSize() {
  if (!sceneStage || !bunkerBackground) return;
  if (isPortraitMobile()) {
    const ratio = bunkerBackground.naturalWidth && bunkerBackground.naturalHeight
      ? bunkerBackground.naturalWidth / bunkerBackground.naturalHeight
      : 16 / 9;
    const stageHeight = window.innerHeight;
    sceneStage.style.width = `${Math.ceil(stageHeight * ratio)}px`;
    sceneStage.style.height = `${stageHeight}px`;
  } else {
    sceneStage.style.width = '';
    sceneStage.style.height = '';
    sceneStage.style.transform = '';
    appState.panX = 0;
    return;
  }
  updatePanBounds();
}

function updatePanBounds() {
  if (!isPortraitMobile()) return;
  const viewportWidth = sceneViewport.clientWidth;
  const stageWidth = sceneStage.offsetWidth;
  appState.maxPanX = 0;
  appState.minPanX = Math.min(0, viewportWidth - stageWidth);
  appState.panX = clamp(appState.panX, appState.minPanX, appState.maxPanX);
  applyPan();
}

function applyPan() {
  if (!isPortraitMobile()) return;
  sceneStage.style.transform = `translate3d(${appState.panX}px, -50%, 0)`;
}

function centerPan() {
  updatePanBounds();
  if (!isPortraitMobile()) return;
  const viewportWidth = sceneViewport.clientWidth;
  const stageWidth = sceneStage.offsetWidth;
  appState.panX = clamp(Math.round((viewportWidth - stageWidth) / 2), appState.minPanX, appState.maxPanX);
  applyPan();
}

function onViewportPointerDown(event) {
  if (!isPortraitMobile() || appState.editorMode || appState.panelOpen || appState.computerOpen) return;
  appState.panPointer = {
    id: event.pointerId,
    startX: event.clientX,
    startPanX: appState.panX,
    dragged: false
  };
  sceneViewport.classList.add('is-dragging');
  sceneViewport.setPointerCapture(event.pointerId);
}

function onViewportPointerMove(event) {
  if (!appState.panPointer || event.pointerId !== appState.panPointer.id) return;
  const delta = event.clientX - appState.panPointer.startX;
  if (Math.abs(delta) > 4) appState.panPointer.dragged = true;
  appState.panX = clamp(appState.panPointer.startPanX + delta, appState.minPanX, appState.maxPanX);
  appState.hasUserPanned = true;
  applyPan();
}

function onViewportPointerUp(event) {
  if (!appState.panPointer || event.pointerId !== appState.panPointer.id) return;
  appState.suppressNextClick = appState.panPointer.dragged;
  sceneViewport.classList.remove('is-dragging');
  sceneViewport.releasePointerCapture(event.pointerId);
  appState.panPointer = null;
  setTimeout(() => { appState.suppressNextClick = false; }, 80);
}

function enterBunker() {
  if (!appState.loaded || appState.entered) return;
  appState.entered = true;
  hatchButton.disabled = true;
  app.classList.add('app--entering');
  loadingText.textContent = 'Vault hatch opening...';
  setTimeout(() => {
    loadingScreen.setAttribute('aria-hidden', 'true');
    bunkerScene.classList.add('bunker-scene--active');
    app.classList.add('app--inside');
    updateStageSize();
    centerPan();
    showRotatePromptIfNeeded();
  }, 900);
}

function openInfoPanel(id) {
  const hotspot = getHotspotById(id);
  if (!hotspot) return;
  appState.panelOpen = true;
  infoKicker.textContent = hotspot.kicker || 'Archive';
  infoTitle.textContent = hotspot.title || hotspot.label || id;
  infoBody.textContent = hotspot.body || '';
  panelBackdrop.hidden = false;
  infoPanel.setAttribute('aria-hidden', 'false');
  app.classList.add('app--panel-open');
  document.querySelectorAll('.hotspot').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.hotspotId === id);
  });
}

function closeInfoPanel() {
  appState.panelOpen = false;
  infoPanel.setAttribute('aria-hidden', 'true');
  app.classList.remove('app--panel-open');
  document.querySelectorAll('.hotspot').forEach((el) => el.classList.remove('is-active'));
  setTimeout(() => {
    if (!appState.panelOpen) panelBackdrop.hidden = true;
  }, 220);
}

function handleLadderTripleClick() {
  if (!appState.entered) return;
  appState.ladderClickCount += 1;
  editLadderHotspot.classList.add('edit-ladder-hotspot--ping');
  setTimeout(() => editLadderHotspot.classList.remove('edit-ladder-hotspot--ping'), 180);
  clearTimeout(appState.ladderClickTimer);
  if (appState.ladderClickCount >= 3) {
    appState.ladderClickCount = 0;
    toggleEditorMode();
    return;
  }
  appState.ladderClickTimer = setTimeout(() => {
    appState.ladderClickCount = 0;
  }, 900);
}

function toggleEditorMode(force) {
  appState.editorMode = typeof force === 'boolean' ? force : !appState.editorMode;
  app.classList.toggle('app--editor-mode', appState.editorMode);
  editorPanel.hidden = !appState.editorMode;
  if (appState.editorMode) {
    closeInfoPanel();
    selectHotspot(appState.selectedId || hotspots[0]?.id);
    updateEditorStatus('Editor mode enabled. Triple-click the ladder again or close this panel to exit.');
  }
}

function selectHotspot(id) {
  appState.selectedId = id;
  document.querySelectorAll('.hotspot').forEach((el) => {
    el.classList.toggle('is-selected', el.dataset.hotspotId === id);
  });
  updateEditorValues();
}

function updateEditorStatus(text) {
  editorStatus.textContent = text;
}

function updateEditorValues() {
  const hotspot = getHotspotById(appState.selectedId);
  if (!hotspot) {
    editorSelected.textContent = 'No hotspot selected';
    editorValues.textContent = '';
    return;
  }
  editorSelected.textContent = hotspot.label || hotspot.id;
  editorValues.textContent = `id: ${hotspot.id}\nx: ${hotspot.x}\ny: ${hotspot.y}\nwidth: ${hotspot.width}\nheight: ${hotspot.height}`;
}

function stagePointToPercent(clientX, clientY) {
  const rect = sceneStage.getBoundingClientRect();
  return {
    x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100)
  };
}

function startHotspotDrag(event, id) {
  const hotspot = getHotspotById(id);
  const start = stagePointToPercent(event.clientX, event.clientY);
  appState.hotspotDrag = {
    id,
    pointerId: event.pointerId,
    startX: start.x,
    startY: start.y,
    originalX: hotspot.x,
    originalY: hotspot.y
  };
  event.currentTarget.setPointerCapture(event.pointerId);
}

function startResizeDrag(event, id) {
  const hotspot = getHotspotById(id);
  const start = stagePointToPercent(event.clientX, event.clientY);
  appState.resizeDrag = {
    id,
    pointerId: event.pointerId,
    startX: start.x,
    startY: start.y,
    originalWidth: hotspot.width,
    originalHeight: hotspot.height
  };
  event.currentTarget.parentElement.setPointerCapture(event.pointerId);
}

function onWindowPointerMove(event) {
  if (appState.hotspotDrag && event.pointerId === appState.hotspotDrag.pointerId) {
    const drag = appState.hotspotDrag;
    const hotspot = getHotspotById(drag.id);
    const point = stagePointToPercent(event.clientX, event.clientY);
    hotspot.x = round1(clamp(drag.originalX + point.x - drag.startX, 0, 100 - hotspot.width));
    hotspot.y = round1(clamp(drag.originalY + point.y - drag.startY, 0, 100 - hotspot.height));
    applyHotspotStyle(document.querySelector(`[data-hotspot-id="${drag.id}"]`), hotspot);
    updateEditorValues();
  }

  if (appState.resizeDrag && event.pointerId === appState.resizeDrag.pointerId) {
    const drag = appState.resizeDrag;
    const hotspot = getHotspotById(drag.id);
    const point = stagePointToPercent(event.clientX, event.clientY);
    hotspot.width = round1(clamp(drag.originalWidth + point.x - drag.startX, 2, 100 - hotspot.x));
    hotspot.height = round1(clamp(drag.originalHeight + point.y - drag.startY, 2, 100 - hotspot.y));
    applyHotspotStyle(document.querySelector(`[data-hotspot-id="${drag.id}"]`), hotspot);
    updateEditorValues();
  }

  if (appState.editorDrag && event.pointerId === appState.editorDrag.pointerId) {
    const drag = appState.editorDrag;
    const x = clamp(drag.startLeft + event.clientX - drag.startX, 0, window.innerWidth - editorPanel.offsetWidth);
    const y = clamp(drag.startTop + event.clientY - drag.startY, 0, window.innerHeight - 42);
    editorPanel.style.left = `${x}px`;
    editorPanel.style.top = `${y}px`;
    editorPanel.style.bottom = 'auto';
  }
}

function onWindowPointerUp(event) {
  if (appState.hotspotDrag?.pointerId === event.pointerId) appState.hotspotDrag = null;
  if (appState.resizeDrag?.pointerId === event.pointerId) appState.resizeDrag = null;
  if (appState.editorDrag?.pointerId === event.pointerId) appState.editorDrag = null;
}

function exportDataJs() {
  const content = `window.FEISK_ASSETS = ${JSON.stringify(ACTIVE_ASSETS, null, 2)};\nwindow.FEISK_HOTSPOTS = window.FEISK_ASSETS.hotspots;\n`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  updateEditorStatus('Downloaded data.js. Replace the file in your repo with this version.');
}

function copyPlacement() {
  const hotspot = getHotspotById(appState.selectedId);
  if (!hotspot) return;
  const text = `x: ${hotspot.x}, y: ${hotspot.y}, width: ${hotspot.width}, height: ${hotspot.height}`;
  navigator.clipboard?.writeText(text);
  updateEditorStatus('Placement copied.');
}

function resetPlacement() {
  hotspots.splice(0, hotspots.length, ...originalHotspots.map((h) => ({ ...h })));
  renderHotspots();
  selectHotspot(hotspots[0]?.id);
  updateEditorStatus('Placement reset.');
}

function startEditorDrag(event) {
  if (event.target.closest('button')) return;
  const rect = editorPanel.getBoundingClientRect();
  appState.editorDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startLeft: rect.left,
    startTop: rect.top
  };
  editorHeader.setPointerCapture(event.pointerId);
}

function bindEvents() {
  hatchButton.addEventListener('click', enterBunker);
  closePanelButton.addEventListener('click', closeInfoPanel);
  panelBackdrop.addEventListener('click', closeInfoPanel);
  editLadderHotspot.addEventListener('click', handleLadderTripleClick);

  sceneViewport.addEventListener('pointerdown', onViewportPointerDown);
  sceneViewport.addEventListener('pointermove', onViewportPointerMove);
  sceneViewport.addEventListener('pointerup', onViewportPointerUp);
  sceneViewport.addEventListener('pointercancel', onViewportPointerUp);

  editorCloseButton.addEventListener('click', () => toggleEditorMode(false));
  editorMinimiseButton.addEventListener('click', () => editorPanel.classList.toggle('is-minimised'));
  editorHeader.addEventListener('pointerdown', startEditorDrag);
  editorCopyButton.addEventListener('click', copyPlacement);
  editorDownloadButton.addEventListener('click', exportDataJs);
  editorResetButton.addEventListener('click', resetPlacement);

  window.addEventListener('pointermove', onWindowPointerMove);
  window.addEventListener('pointerup', onWindowPointerUp);
  window.addEventListener('resize', () => {
    updateStageSize();
    if (!appState.hasUserPanned) centerPan();
    showRotatePromptIfNeeded();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      appState.hasUserPanned = false;
      updateStageSize();
      centerPan();
      showRotatePromptIfNeeded();
    }, 250);
  });

  computerCloseButton.addEventListener('click', closeComputerOverlay);
  computerOverlay.addEventListener('click', (event) => {
    if (event.target === computerOverlay) closeComputerOverlay();
  });
  forceRotateButton.addEventListener('click', forceRotate);
  continuePortraitButton.addEventListener('click', continuePortrait);

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (appState.computerOpen) closeComputerOverlay();
    else if (appState.editorMode) toggleEditorMode(false);
    else if (appState.panelOpen) closeInfoPanel();
  });
}

function boot() {
  renderBackground();
  renderHotspots();
  renderComputerIcons();
  createDustParticles();
  bindEvents();
  preloadAssets().catch(() => unlockHatch());
  setTimeout(() => {
    if (!appState.loaded) unlockHatch();
  }, 6000);
}

window.addEventListener('DOMContentLoaded', boot);
