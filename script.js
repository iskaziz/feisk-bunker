(() => {
  'use strict';

  const config = window.FEISK_CONFIG || {};
  const hotspots = Array.isArray(config.hotspots) ? structuredClone(config.hotspots) : [];
  const desktopIcons = Array.isArray(config.desktopIcons) ? config.desktopIcons : [];

  const app = document.getElementById('app');
  const backgroundImage = document.getElementById('bunkerBackground');
  const hotspotsLayer = document.getElementById('hotspotsLayer');
  const dustLayer = document.getElementById('dustLayer');
  const ladderTrigger = document.getElementById('editLadderHotspot');

  const panelBackdrop = document.getElementById('panelBackdrop');
  const infoPanel = document.getElementById('infoPanel');
  const panelClose = document.getElementById('panelClose');
  const panelKicker = document.getElementById('panelKicker');
  const panelTitle = document.getElementById('panelTitle');
  const panelBody = document.getElementById('panelBody');

  const desktopOverlay = document.getElementById('desktopOverlay');
  const desktopClose = document.getElementById('desktopClose');
  const desktopIconsHost = document.getElementById('desktopIcons');
  const desktopWindowLayer = document.getElementById('desktopWindowLayer');
  const desktopTaskList = document.getElementById('desktopTaskList');
  const desktopStart = document.getElementById('desktopStart');

  const editorPanel = document.getElementById('placementEditor');
  const editorDragHandle = document.getElementById('editorDragHandle');
  const editorBody = document.getElementById('editorBody');
  const editorMinimise = document.getElementById('editorMinimise');
  const editorRestore = document.getElementById('editorRestore');
  const editorClose = document.getElementById('editorClose');
  const editorSelectedTitle = document.getElementById('editorSelectedTitle');
  const editorFields = {
    x: document.getElementById('editorX'),
    y: document.getElementById('editorY'),
    width: document.getElementById('editorWidth'),
    height: document.getElementById('editorHeight'),
    dotX: document.getElementById('editorDotX'),
    dotY: document.getElementById('editorDotY')
  };
  const copyPlacement = document.getElementById('copyPlacement');
  const downloadData = document.getElementById('downloadData');
  const resetPlacement = document.getElementById('resetPlacement');

  let editorOpen = false;
  let selectedHotspotId = null;
  let ladderClickCount = 0;
  let ladderClickTimer = null;

  let desktopZ = 10;
  const openDesktopWindows = new Map();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round1(value) {
    return Math.round(value * 10) / 10;
  }

  function getHotspotById(id) {
    return hotspots.find((item) => item.id === id);
  }

  function setSceneBackground() {
    if (config.scene && config.scene.background) {
      backgroundImage.src = config.scene.background;
    }
  }

  function localDotPercent(item) {
    const localX = item.width ? ((item.dotX - item.x) / item.width) * 100 : 50;
    const localY = item.height ? ((item.dotY - item.y) / item.height) * 100 : 50;
    return {
      x: clamp(localX, 0, 100),
      y: clamp(localY, 0, 100)
    };
  }

  function renderHotspots() {
    hotspotsLayer.innerHTML = '';

    hotspots.forEach((item) => {
      const button = document.createElement('button');
      const localDot = localDotPercent(item);

      button.type = 'button';
      button.className = 'hotspot';
      button.dataset.hotspotId = item.id;
      button.setAttribute('aria-label', item.label || item.title || item.id);
      button.style.left = `${item.x}%`;
      button.style.top = `${item.y}%`;
      button.style.width = `${item.width}%`;
      button.style.height = `${item.height}%`;
      button.style.setProperty('--local-dot-x', `${localDot.x}%`);
      button.style.setProperty('--local-dot-y', `${localDot.y}%`);

      if (editorOpen) {
        button.classList.add('is-editable');
      }
      if (selectedHotspotId === item.id) {
        button.classList.add('is-selected');
      }

      button.innerHTML = `
        <span class="hotspot__dot" aria-hidden="true">
          <span class="hotspot__dot-pulse"></span>
          <span class="hotspot__dot-ring"></span>
          <span class="hotspot__dot-core"></span>
        </span>
        <span class="hotspot__dot-handle" aria-hidden="true"></span>
        <span class="hotspot__label">${escapeHtml(item.label || item.title || item.id)}</span>
      `;

      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (editorOpen) {
          selectHotspot(item.id);
          return;
        }
        activateHotspot(item);
      });

      button.addEventListener('pointerdown', (event) => {
        if (!editorOpen) return;
        startHotspotEditDrag(event, item.id);
      });

      hotspotsLayer.appendChild(button);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function activateHotspot(item) {
    document.querySelectorAll('.hotspot').forEach((node) => node.classList.remove('is-active'));
    const active = document.querySelector(`[data-hotspot-id="${CSS.escape(item.id)}"]`);
    active?.classList.add('is-active');

    if (item.action === 'computer') {
      openDesktop();
      return;
    }

    openInfoPanel(item);
  }

  function openInfoPanel(item) {
    closeDesktop();
    panelKicker.textContent = item.kicker || 'Archive File';
    panelTitle.textContent = item.title || item.label || item.id;
    panelBody.textContent = item.body || '';

    panelBackdrop.hidden = false;
    infoPanel.hidden = false;
    requestAnimationFrame(() => app.classList.add('app--panel-open'));
  }

  function closeInfoPanel() {
    app.classList.remove('app--panel-open');
    document.querySelectorAll('.hotspot').forEach((node) => node.classList.remove('is-active'));
    window.setTimeout(() => {
      panelBackdrop.hidden = true;
      infoPanel.hidden = true;
    }, 180);
  }

  function renderDust() {
    if (!dustLayer) return;
    const count = window.matchMedia('(max-width: 820px)').matches ? 22 : 42;
    const fragments = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'dust-particle';
      particle.style.setProperty('--dust-left', `${Math.random() * 100}%`);
      particle.style.setProperty('--dust-size', `${1 + Math.random() * 2.2}px`);
      particle.style.setProperty('--dust-duration', `${13 + Math.random() * 16}s`);
      particle.style.setProperty('--dust-delay', `${Math.random() * -22}s`);
      particle.style.setProperty('--dust-drift', `${-40 + Math.random() * 80}px`);
      fragments.appendChild(particle);
    }

    dustLayer.innerHTML = '';
    dustLayer.appendChild(fragments);
  }

  function openDesktop() {
    closeInfoPanel();
    desktopOverlay.hidden = false;
    app.classList.add('app--desktop-open');
    if (openDesktopWindows.size === 0 && desktopIcons[0]) {
      openDesktopWindow(desktopIcons[0]);
    }
  }

  function closeDesktop() {
    desktopOverlay.hidden = true;
    app.classList.remove('app--desktop-open');
  }

  function renderDesktopIcons() {
    desktopIconsHost.innerHTML = '';

    desktopIcons.forEach((icon) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'desktop-icon';
      button.dataset.desktopIconId = icon.id;
      button.innerHTML = `
        <span class="desktop-icon__symbol" aria-hidden="true">${escapeHtml(icon.symbol || '□')}</span>
        <span class="desktop-icon__label">${escapeHtml(icon.label || icon.title || icon.id)}</span>
      `;
      button.addEventListener('click', () => openDesktopWindow(icon));
      desktopIconsHost.appendChild(button);
    });
  }

  function openDesktopWindow(icon) {
    const existing = openDesktopWindows.get(icon.id);
    if (existing) {
      existing.windowEl.classList.remove('is-minimized');
      focusDesktopWindow(icon.id);
      updateTaskbar();
      return;
    }

    const windowEl = document.createElement('article');
    const offset = openDesktopWindows.size * 24;
    const startLeft = Math.min(210 + offset, 430);
    const startTop = Math.min(32 + offset, 210);

    windowEl.className = 'desktop-window';
    windowEl.dataset.windowId = icon.id;
    windowEl.style.left = `${startLeft}px`;
    windowEl.style.top = `${startTop}px`;
    windowEl.style.zIndex = String(++desktopZ);
    windowEl.innerHTML = `
      <header class="desktop-window__bar">
        <span class="desktop-window__title">${escapeHtml(icon.label || icon.title || icon.id)}</span>
        <span class="desktop-window__buttons">
          <button class="desktop-window__minimise" type="button" aria-label="Minimise window">–</button>
          <button class="desktop-window__close" type="button" aria-label="Close window">×</button>
        </span>
      </header>
      <div class="desktop-window__content">
        <p class="desktop-window__kicker">${escapeHtml(icon.kicker || 'Archive File')}</p>
        <h3>${escapeHtml(icon.title || icon.label || icon.id)}</h3>
        <p>${escapeHtml(icon.body || '')}</p>
      </div>
    `;

    const record = { icon, windowEl, minimized: false };
    openDesktopWindows.set(icon.id, record);
    desktopWindowLayer.appendChild(windowEl);

    windowEl.addEventListener('pointerdown', () => focusDesktopWindow(icon.id));
    windowEl.querySelector('.desktop-window__bar').addEventListener('pointerdown', (event) => startDesktopWindowDrag(event, icon.id));
    windowEl.querySelector('.desktop-window__minimise').addEventListener('click', () => minimiseDesktopWindow(icon.id));
    windowEl.querySelector('.desktop-window__close').addEventListener('click', () => closeDesktopWindow(icon.id));

    focusDesktopWindow(icon.id);
    updateTaskbar();
  }

  function focusDesktopWindow(id) {
    const record = openDesktopWindows.get(id);
    if (!record) return;
    record.windowEl.style.zIndex = String(++desktopZ);
    document.querySelectorAll('.desktop-icon').forEach((node) => {
      node.classList.toggle('is-selected', node.dataset.desktopIconId === id);
    });
    updateTaskbar(id);
  }

  function minimiseDesktopWindow(id) {
    const record = openDesktopWindows.get(id);
    if (!record) return;
    record.minimized = true;
    record.windowEl.classList.add('is-minimized');
    updateTaskbar();
  }

  function closeDesktopWindow(id) {
    const record = openDesktopWindows.get(id);
    if (!record) return;
    record.windowEl.remove();
    openDesktopWindows.delete(id);
    document.querySelectorAll('.desktop-icon').forEach((node) => {
      if (node.dataset.desktopIconId === id) node.classList.remove('is-selected');
    });
    updateTaskbar();
  }

  function updateTaskbar(activeId = null) {
    desktopTaskList.innerHTML = '';
    openDesktopWindows.forEach((record, id) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'desktop-task-button';
      button.textContent = record.icon.label || record.icon.title || id;
      button.classList.toggle('is-active', id === activeId && !record.minimized);
      button.addEventListener('click', () => {
        record.minimized = false;
        record.windowEl.classList.remove('is-minimized');
        focusDesktopWindow(id);
      });
      desktopTaskList.appendChild(button);
    });
  }

  function startDesktopWindowDrag(event, id) {
    if (event.button !== undefined && event.button !== 0) return;
    const record = openDesktopWindows.get(id);
    if (!record) return;
    event.preventDefault();
    focusDesktopWindow(id);

    const rect = record.windowEl.getBoundingClientRect();
    const layerRect = desktopWindowLayer.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = rect.left - layerRect.left;
    const startTop = rect.top - layerRect.top;

    const onMove = (moveEvent) => {
      const maxLeft = Math.max(0, layerRect.width - rect.width);
      const maxTop = Math.max(0, layerRect.height - rect.height);
      const nextLeft = clamp(startLeft + moveEvent.clientX - startX, 0, maxLeft);
      const nextTop = clamp(startTop + moveEvent.clientY - startY, 0, maxTop);
      record.windowEl.style.left = `${nextLeft}px`;
      record.windowEl.style.top = `${nextTop}px`;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    window.addEventListener('pointercancel', onUp, { once: true });
  }

  function toggleEditor(forceState) {
    editorOpen = typeof forceState === 'boolean' ? forceState : !editorOpen;
    editorPanel.hidden = !editorOpen;
    selectedHotspotId = editorOpen ? (selectedHotspotId || hotspots[0]?.id || null) : null;
    updateEditorFromSelection();
    renderHotspots();
  }

  function selectHotspot(id) {
    selectedHotspotId = id;
    updateEditorFromSelection();
    renderHotspots();
  }

  function updateEditorFromSelection() {
    const item = getHotspotById(selectedHotspotId);
    editorSelectedTitle.textContent = item ? item.label || item.title || item.id : 'No hotspot selected';
    Object.values(editorFields).forEach((input) => {
      input.disabled = !item;
    });
    if (!item) return;
    editorFields.x.value = item.x;
    editorFields.y.value = item.y;
    editorFields.width.value = item.width;
    editorFields.height.value = item.height;
    editorFields.dotX.value = item.dotX;
    editorFields.dotY.value = item.dotY;
  }

  function applyEditorField(fieldName, value) {
    const item = getHotspotById(selectedHotspotId);
    if (!item) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;

    if (fieldName === 'width' || fieldName === 'height') {
      item[fieldName] = clamp(round1(numericValue), 1, 100);
    } else {
      item[fieldName] = clamp(round1(numericValue), 0, 100);
    }

    item.x = clamp(item.x, 0, 100 - item.width);
    item.y = clamp(item.y, 0, 100 - item.height);
    item.dotX = clamp(item.dotX, 0, 100);
    item.dotY = clamp(item.dotY, 0, 100);
    renderHotspots();
  }

  function startHotspotEditDrag(event, id) {
    const item = getHotspotById(id);
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();
    selectHotspot(id);

    const rect = event.currentTarget.getBoundingClientRect();
    const stageRect = document.getElementById('sceneStage').getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const isResize = localX > rect.width - 22 && localY > rect.height - 22;
    const dotPercent = localDotPercent(item);
    const dotPxX = (dotPercent.x / 100) * rect.width;
    const dotPxY = (dotPercent.y / 100) * rect.height;
    const dotDistance = Math.hypot(localX - dotPxX, localY - dotPxY);
    const isDotMove = dotDistance < 28;

    const start = {
      clientX: event.clientX,
      clientY: event.clientY,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      dotX: item.dotX,
      dotY: item.dotY
    };

    const onMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - start.clientX) / stageRect.width) * 100;
      const dy = ((moveEvent.clientY - start.clientY) / stageRect.height) * 100;

      if (isDotMove && !isResize) {
        item.dotX = clamp(round1(start.dotX + dx), 0, 100);
        item.dotY = clamp(round1(start.dotY + dy), 0, 100);
      } else if (isResize) {
        item.width = clamp(round1(start.width + dx), 1, 100 - item.x);
        item.height = clamp(round1(start.height + dy), 1, 100 - item.y);
      } else {
        item.x = clamp(round1(start.x + dx), 0, 100 - item.width);
        item.y = clamp(round1(start.y + dy), 0, 100 - item.height);
        item.dotX = clamp(round1(start.dotX + dx), 0, 100);
        item.dotY = clamp(round1(start.dotY + dy), 0, 100);
      }

      renderHotspots();
      updateEditorFromSelection();
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    window.addEventListener('pointercancel', onUp, { once: true });
  }

  function startEditorPanelDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    const rect = editorPanel.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    const onMove = (moveEvent) => {
      const nextLeft = clamp(startLeft + moveEvent.clientX - startX, 0, window.innerWidth - rect.width);
      const nextTop = clamp(startTop + moveEvent.clientY - startY, 0, window.innerHeight - rect.height);
      editorPanel.style.left = `${nextLeft}px`;
      editorPanel.style.top = `${nextTop}px`;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    window.addEventListener('pointercancel', onUp, { once: true });
  }

  function generateDataFile() {
    const cleanConfig = {
      scene: config.scene || { background: 'assets/backgrounds/bunker-room-final.png', aspectRatio: 16 / 9 },
      hotspots,
      desktopIcons
    };

    return `/* Feisk Productions Vault data */\n\nwindow.FEISK_CONFIG = ${JSON.stringify(cleanConfig, null, 2)};\n`;
  }

  function downloadDataFile() {
    const blob = new Blob([generateDataFile()], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.js';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function copyPlacementToClipboard() {
    const item = getHotspotById(selectedHotspotId);
    if (!item) return;
    const text = JSON.stringify({
      id: item.id,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      dotX: item.dotX,
      dotY: item.dotY
    }, null, 2);
    navigator.clipboard?.writeText(text).catch(() => undefined);
  }

  function resetPlacementValues() {
    window.location.reload();
  }

  function bindEvents() {
    panelClose.addEventListener('click', closeInfoPanel);
    panelBackdrop.addEventListener('click', closeInfoPanel);
    desktopClose.addEventListener('click', closeDesktop);
    desktopStart.addEventListener('click', () => {
      if (desktopIcons[0]) openDesktopWindow(desktopIcons[0]);
    });

    ladderTrigger.addEventListener('click', () => {
      ladderClickCount += 1;
      ladderTrigger.classList.add('edit-ladder-hotspot--ping');
      window.clearTimeout(ladderClickTimer);
      ladderClickTimer = window.setTimeout(() => {
        ladderClickCount = 0;
        ladderTrigger.classList.remove('edit-ladder-hotspot--ping');
      }, 700);

      if (ladderClickCount >= 3) {
        ladderClickCount = 0;
        ladderTrigger.classList.remove('edit-ladder-hotspot--ping');
        toggleEditor();
      }
    });

    editorClose.addEventListener('click', () => toggleEditor(false));
    editorMinimise.addEventListener('click', () => {
      editorPanel.classList.add('is-minimised');
      editorBody.hidden = true;
      editorRestore.hidden = false;
    });
    editorRestore.addEventListener('click', () => {
      editorPanel.classList.remove('is-minimised');
      editorBody.hidden = false;
      editorRestore.hidden = true;
    });
    editorDragHandle.addEventListener('pointerdown', startEditorPanelDrag);

    Object.entries(editorFields).forEach(([fieldName, input]) => {
      input.addEventListener('input', () => applyEditorField(fieldName, input.value));
    });

    copyPlacement.addEventListener('click', copyPlacementToClipboard);
    downloadData.addEventListener('click', downloadDataFile);
    resetPlacement.addEventListener('click', resetPlacementValues);

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (!desktopOverlay.hidden) closeDesktop();
        else if (!infoPanel.hidden) closeInfoPanel();
        else if (editorOpen) toggleEditor(false);
      }
    });
  }

  function init() {
    setSceneBackground();
    renderHotspots();
    renderDesktopIcons();
    renderDust();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
