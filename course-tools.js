(function () {
  const textSelector = 'main h1,main h2,main h3,main p,main li,main td,main th,main figcaption,main .callout';
  const storageKey = 'course-inline-edits:' + location.pathname;
  const modeLabels = {
    edit: '\u70b9\u51fb\u6587\u5b57\u5373\u53ef\u4fee\u6539',
    highlight: '\u9009\u4e2d\u6587\u5b57\u540e\u4f1a\u53d8\u9ec4',
    underline: '\u9009\u4e2d\u6587\u5b57\u540e\u4f1a\u52a0\u7ea2\u7ebf',
    note: '\u9009\u4e2d\u6587\u5b57\u540e\u5199\u65c1\u6ce8',
    circle: '\u6309\u4f4f\u62d6\u52a8\u753b\u7ea2\u8272\u5708\u5708',
    arrow: '\u4ece\u8d77\u70b9\u62d6\u5230\u7ec8\u70b9\u753b\u7bad\u5934'
  };
  let mode = 'idle';
  let saveTimer = null;
  let drawing = null;

  const editableItems = () => Array.from(document.querySelectorAll(textSelector)).filter(el => !el.closest('.edit-tools,.review-tools,.review-panel'));
  const getButton = name => document.querySelector('[data-edit-tool="' + name + '"]');

  function loadData() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (e) { return {}; }
  }

  function sizeLayer(layer) {
    const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
    const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
    layer.setAttribute('width', width);
    layer.setAttribute('height', height);
    layer.style.width = width + 'px';
    layer.style.height = height + 'px';
  }

  function ensureLayer() {
    let layer = document.getElementById('drawLayer');
    if (layer) { sizeLayer(layer); return layer; }
    layer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    layer.id = 'drawLayer';
    layer.setAttribute('class', 'draw-layer');
    layer.innerHTML = '<defs><marker id="drawArrowHead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M2,2 L10,6 L2,10 Z" fill="#ef4444"></path></marker></defs>';
    document.body.appendChild(layer);
    sizeLayer(layer);
    return layer;
  }

  function createSvg(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  function saveData() {
    const data = { text: {}, drawings: [] };
    editableItems().forEach(el => {
      if (el.dataset.editKey) data.text[el.dataset.editKey] = el.innerHTML;
    });
    ensureLayer().querySelectorAll('[data-drawing="true"]').forEach(el => {
      const item = { tag: el.tagName.toLowerCase(), attrs: {} };
      Array.from(el.attributes).forEach(attr => {
        if (attr.name !== 'data-drawing') item.attrs[attr.name] = attr.value;
      });
      data.drawings.push(item);
    });
    localStorage.setItem(storageKey, JSON.stringify(data));
    showTip('\u5df2\u81ea\u52a8\u4fdd\u5b58');
  }

  function restoreDrawings(data) {
    const layer = ensureLayer();
    layer.querySelectorAll('[data-drawing="true"]').forEach(el => el.remove());
    (data.drawings || []).forEach(item => {
      if (!['ellipse', 'line'].includes(item.tag)) return;
      const el = createSvg(item.tag);
      Object.entries(item.attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
      el.dataset.drawing = 'true';
      layer.appendChild(el);
    });
  }

  function prepare() {
    const data = loadData();
    editableItems().forEach((el, index) => {
      const key = 'text-' + index;
      el.dataset.editKey = key;
      if (data.text && Object.prototype.hasOwnProperty.call(data.text, key)) el.innerHTML = data.text[key];
    });
    restoreDrawings(data);
  }

  function showTip(text) {
    const tip = document.getElementById('editTip');
    if (!tip) return;
    tip.textContent = text;
    tip.style.display = 'block';
    clearTimeout(showTip.timer);
    showTip.timer = setTimeout(() => {
      if (mode === 'idle') tip.style.display = 'none';
      else tip.textContent = modeLabels[mode] || '';
    }, 1500);
  }

  function setMode(nextMode) {
    mode = mode === nextMode ? 'idle' : nextMode;
    const isDrawing = mode === 'circle' || mode === 'arrow';
    document.body.classList.toggle('edit-mode', mode === 'edit');
    document.body.classList.toggle('mark-mode', mode !== 'idle' && mode !== 'edit' && !isDrawing);
    document.body.classList.toggle('draw-mode', isDrawing);
    ensureLayer().style.pointerEvents = isDrawing ? 'auto' : 'none';
    editableItems().forEach(el => {
      if (mode === 'edit') {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'true');
      } else {
        el.removeAttribute('contenteditable');
      }
    });
    document.querySelectorAll('[data-edit-tool]').forEach(btn => btn.classList.toggle('active', btn.dataset.editTool === mode));
    if (getButton('edit')) getButton('edit').textContent = mode === 'edit' ? '\u5b8c\u6210\u7f16\u8f91' : '\u7f16\u8f91\u6587\u5b57';
    const tip = document.getElementById('editTip');
    if (tip) {
      tip.textContent = modeLabels[mode] || '';
      tip.style.display = mode === 'idle' ? 'none' : 'block';
    }
    if (mode !== 'edit') saveData();
  }

  function wrapSelection(className, title) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const host = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    if (!host || !host.closest('main')) return false;
    const span = document.createElement('span');
    span.className = className;
    if (title) span.title = title;
    try {
      range.surroundContents(span);
    } catch (e) {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }
    selection.removeAllRanges();
    saveData();
    return true;
  }

  function addNote() {
    const text = prompt('\u8bf7\u8f93\u5165\u65c1\u8fb9\u6ce8\u91ca\uff1a');
    if (!text || !text.trim()) return false;
    return wrapSelection('inline-note', text.trim());
  }

  function pointerPoint(event) {
    return { x: Math.round(event.clientX + window.scrollX), y: Math.round(event.clientY + window.scrollY) };
  }

  function beginDrawing(event) {
    if (mode !== 'circle' && mode !== 'arrow') return;
    if (event.target.closest && event.target.closest('.edit-tools')) return;
    event.preventDefault();
    const layer = ensureLayer();
    const start = pointerPoint(event);
    const shape = createSvg(mode === 'circle' ? 'ellipse' : 'line');
    shape.dataset.drawing = 'true';
    shape.setAttribute('fill', 'none');
    shape.setAttribute('stroke', '#ef4444');
    shape.setAttribute('stroke-width', '4');
    shape.setAttribute('stroke-linecap', 'round');
    shape.setAttribute('stroke-linejoin', 'round');
    if (mode === 'circle') {
      shape.setAttribute('cx', start.x);
      shape.setAttribute('cy', start.y);
      shape.setAttribute('rx', '1');
      shape.setAttribute('ry', '1');
    } else {
      shape.setAttribute('x1', start.x);
      shape.setAttribute('y1', start.y);
      shape.setAttribute('x2', start.x);
      shape.setAttribute('y2', start.y);
      shape.setAttribute('marker-end', 'url(#drawArrowHead)');
    }
    layer.appendChild(shape);
    drawing = { mode, start, shape };
  }

  function moveDrawing(event) {
    if (!drawing) return;
    event.preventDefault();
    const current = pointerPoint(event);
    if (drawing.mode === 'circle') {
      drawing.shape.setAttribute('cx', Math.round((drawing.start.x + current.x) / 2));
      drawing.shape.setAttribute('cy', Math.round((drawing.start.y + current.y) / 2));
      drawing.shape.setAttribute('rx', Math.max(4, Math.round(Math.abs(current.x - drawing.start.x) / 2)));
      drawing.shape.setAttribute('ry', Math.max(4, Math.round(Math.abs(current.y - drawing.start.y) / 2)));
    } else {
      drawing.shape.setAttribute('x2', current.x);
      drawing.shape.setAttribute('y2', current.y);
    }
  }

  function endDrawing() {
    if (!drawing) return;
    drawing = null;
    saveData();
  }

  document.addEventListener('mouseup', () => {
    if (mode === 'highlight') wrapSelection('inline-highlight');
    if (mode === 'underline') wrapSelection('inline-underline');
    if (mode === 'note') addNote();
  });

  window.addEventListener('resize', () => sizeLayer(ensureLayer()));
  document.addEventListener('pointerdown', beginDrawing);
  document.addEventListener('pointermove', moveDrawing);
  document.addEventListener('pointerup', endDrawing);
  document.addEventListener('pointercancel', endDrawing);

  document.addEventListener('input', e => {
    if (mode !== 'edit' || !e.target.closest('[contenteditable="true"]')) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveData, 350);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mode !== 'idle') {
      e.preventDefault();
      setMode(mode);
    }
    if ((e.key === 'Backspace' || e.key === 'Delete') && (mode === 'circle' || mode === 'arrow')) {
      const drawings = ensureLayer().querySelectorAll('[data-drawing="true"]');
      const last = drawings[drawings.length - 1];
      if (last) {
        last.remove();
        saveData();
      }
    }
  });

  window.setInlineTool = setMode;
  window.toggleInlineEdit = () => setMode('edit');
  window.restoreInlineText = () => {
    if (!confirm('\u786e\u5b9a\u6062\u590d\u6b64\u9875\u9762\u7684\u539f\u6587\u5e76\u6e05\u7a7a\u6240\u6709\u6807\u8bb0\u5417\uff1f')) return;
    localStorage.removeItem(storageKey);
    location.reload();
  };

  prepare();
})();