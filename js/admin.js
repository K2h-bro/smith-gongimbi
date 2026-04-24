(function () {
  const PASS = 'smith2121';

  /* ── DATA (반드시 최상단에 위치) ── */
  let data = loadData();

  /* ── 히스토리 (Ctrl+Z) ── */
  const history = [];
  const MAX_HISTORY = 30;

  function pushHistory() {
    history.push(JSON.stringify(data));
    if (history.length > MAX_HISTORY) history.shift();
    updateUndoBtn();
  }

  function undo() {
    if (!history.length) return;
    data = JSON.parse(history.pop());
    renderAll();
    updateUndoBtn();
    showToast('되돌리기 완료');
  }

  function updateUndoBtn() {
    const btn = document.getElementById('undo-btn');
    if (btn) btn.disabled = history.length === 0;
  }

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' &&
        !e.target.matches('input, textarea, select')) {
      e.preventDefault();
      undo();
    }
  });
  document.getElementById('undo-btn')?.addEventListener('click', undo);

  /* ── TOAST ── */
  const toast = document.getElementById('toast');
  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = 'toast' + (isError ? ' error' : '');
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ── 저장 시간 표시 ── */
  function updateSavedTime() {
    const el = document.getElementById('saved-time');
    if (!el) return;
    const ts = localStorage.getItem('smith_saved_at');
    el.textContent = ts ? '마지막 저장: ' + ts : '저장 기록 없음';
  }

  function stampSavedTime() {
    const now = new Date();
    const str = now.toLocaleDateString('ko-KR') + ' ' +
      now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('smith_saved_at', str);
    updateSavedTime();
  }

  /* ── SAVE ── */
  async function saveAll() {
    collectData();
    const btn = document.getElementById('save-btn');
    if (btn) { btn.disabled = true; btn.textContent = '저장 중…'; }
    const ok = await apiSave(data);
    if (ok) {
      localStorage.setItem('smith_data', JSON.stringify(data));
      stampSavedTime();
      showToast('저장 완료 ✓');
    } else {
      showToast('저장 실패 — 네트워크 확인', true);
    }
    if (btn) { btn.disabled = false; btn.textContent = '저장 · 적용'; }
  }

  /* ── AUTH & 이벤트 초기화 (DOM 준비 후 실행) ── */
  function init() {
    const loginScreen = document.getElementById('login-screen');
    const adminWrap   = document.getElementById('admin-wrap');
    const passInput   = document.getElementById('pass-input');
    const loginErr    = document.getElementById('login-error');

    async function unlock() {
      loginScreen.style.display = 'none';
      adminWrap.classList.add('visible');

      // 로딩 표시
      const container = document.getElementById('categories-container');
      container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted);font-size:12px;">데이터 불러오는 중…</div>';

      // API에서 최신 데이터 로드
      const apiData = await apiLoad();
      if (apiData) {
        data = apiData;
        localStorage.setItem('smith_data', JSON.stringify(data));
      } else {
        // 첫 실행 시 DEFAULT_DATA를 API에 초기화
        const hasSheet = localStorage.getItem('smith_api_init');
        if (!hasSheet) {
          await apiSave(data);
          localStorage.setItem('smith_api_init', '1');
        }
      }

      renderAll();
      updateSavedTime();
      updateUndoBtn();
    }

    /* 세션 유지 시 자동 로그인 */
    if (sessionStorage.getItem('smith_auth') === '1') { unlock(); }

    document.getElementById('login-btn').addEventListener('click', () => {
      if (passInput.value === PASS) {
        sessionStorage.setItem('smith_auth', '1');
        loginErr.textContent = '';
        unlock();
      } else {
        loginErr.textContent = '비밀번호가 올바르지 않습니다.';
        passInput.value = '';
        passInput.focus();
      }
    });
    passInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('login-btn').click();
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      sessionStorage.removeItem('smith_auth');
      location.reload();
    });

    document.getElementById('save-btn').addEventListener('click', saveAll);

    document.getElementById('reset-btn').addEventListener('click', () => {
      if (!confirm('모든 데이터를 초기값으로 되돌리겠습니까?')) return;
      resetData();
      localStorage.removeItem('smith_saved_at');
      data = loadData();
      renderAll();
      updateSavedTime();
      showToast('초기화 완료');
    });

    document.getElementById('preview-btn').addEventListener('click', () => {
      saveAll();
      const base = window.location.href.split('/admin')[0];
      window.open(base + '/', '_blank');
    });

    document.getElementById('undo-btn').addEventListener('click', undo);

    /* CSV 내보내기 */
    document.getElementById('export-btn').addEventListener('click', () => {
      collectData();
      const rows = [['카테고리', '작업명', '부가설명', '주니퍼', '하이랜드', '3/Y', 'S/X']];
      data.categories.forEach(cat => {
        cat.items.forEach(item => {
          rows.push([
            cat.name.replace(/\s+/g, ''),
            item.name,
            item.sub || '',
            item.juniper ?? '',
            item.highland ?? '',
            item.threey ?? '',
            item.sx ?? ''
          ]);
        });
      });
      const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smith_gongimbi_' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
      URL.revokeObjectURL(url);
      showToast('CSV 다운로드 완료');
    });

    /* 카테고리 추가 */
    document.getElementById('add-cat-btn').addEventListener('click', () => {
      collectData();
      pushHistory();
      data.categories.push({
        id: 'cat_' + Date.now(),
        name: '새 카테고리',
        nameEn: 'New Category',
        items: []
      });
      renderAll();
      showToast('카테고리 추가됨');
      setTimeout(() => {
        document.getElementById('categories-container').lastElementChild
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  /* DOM 완전히 로드된 후 init 실행 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── RENDER ── */
  function renderAll() {
    renderCategories();
    renderAdditional();
    renderNotes();
  }

  const cols = ['juniper', 'highland', 'threey', 'sx'];
  const colLabels = ['주니퍼', '하이랜드', '3 / Y', 'S / X'];

  function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    data.categories.forEach((cat, ci) => {
      const block = document.createElement('div');
      block.className = 'cat-block';
      block.dataset.catIdx = ci;
      block.draggable = true;

      let itemsHtml = '';
      cat.items.forEach((item, ii) => {
        if (item.type === 'consult') {
          itemsHtml += `
            <tr data-item-idx="${ii}" draggable="true" class="draggable-row">
              <td class="drag-handle" title="드래그하여 순서 변경">⠿</td>
              <td><span class="type-badge type-consult">상담</span></td>
              <td><input type="text" class="f-name" value="${esc(item.name)}" placeholder="항목명"></td>
              <td colspan="4" style="text-align:center;color:var(--muted);font-size:11px;">상담 및 채팅 문의 (고정)</td>
              <td class="center"><button class="btn btn-danger btn-sm del-item-btn">삭제</button></td>
            </tr>`;
        } else {
          itemsHtml += `
            <tr data-item-idx="${ii}" draggable="true" class="draggable-row">
              <td class="drag-handle" title="드래그하여 순서 변경">⠿</td>
              <td>
                <select class="f-type" style="background:var(--input-bg);border:1px solid #333;color:var(--text);font-family:inherit;font-size:10px;padding:4px 6px;outline:none;border-radius:2px;">
                  <option value="normal"  ${item.type==='normal' ?'selected':''}>일반</option>
                  <option value="set"     ${item.type==='set'    ?'selected':''}>셋트</option>
                  <option value="consult" ${item.type==='consult'?'selected':''}>상담</option>
                </select>
              </td>
              <td>
                <input type="text" class="f-name" value="${esc(item.name)}" placeholder="항목명" style="min-width:130px;">
                <input type="text" class="f-sub"  value="${esc(item.sub||'')}" placeholder="[부가 설명]" style="margin-top:4px;font-size:10px;color:var(--text-dim);">
              </td>
              ${cols.map(c => `<td class="center"><input type="number" class="f-${c}" value="${item[c]??''}" placeholder="—" min="0" max="999"></td>`).join('')}
              <td class="center"><button class="btn btn-danger btn-sm del-item-btn">삭제</button></td>
            </tr>`;
        }
      });

      block.innerHTML = `
        <div class="cat-block-head">
          <span class="cat-block-name">
            <span class="cat-drag-handle" title="드래그하여 카테고리 순서 변경">⠿⠿</span>
            <input type="text" class="cat-name-input" value="${esc(cat.name)}"
              style="background:transparent;border:none;border-bottom:1px solid var(--border);color:#fff;font-family:inherit;font-size:11px;font-weight:600;letter-spacing:1.5px;padding:2px 4px;width:150px;outline:none;">
            <input type="text" class="cat-en-input" value="${esc(cat.nameEn)}"
              style="background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--gold);font-family:inherit;font-size:9px;letter-spacing:2px;padding:2px 4px;width:100px;outline:none;">
          </span>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-outline btn-sm add-item-btn">+ 항목 추가</button>
            <button class="btn btn-danger btn-sm del-cat-btn">카테고리 삭제</button>
          </div>
        </div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width:28px;"></th>
              <th style="width:72px;">타입</th>
              <th>작업명 / 설명</th>
              ${colLabels.map(l => `<th class="center" style="width:68px;">${l}</th>`).join('')}
              <th style="width:60px;"></th>
            </tr>
          </thead>
          <tbody class="items-tbody">${itemsHtml || `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:14px;font-size:11px;">항목 없음 — "+ 항목 추가" 버튼으로 추가하세요</td></tr>`}</tbody>
        </table>`;

      /* 항목 추가 */
      block.querySelector('.add-item-btn').addEventListener('click', () => {
        collectData();
        pushHistory();
        data.categories[ci].items.push({
          id: 'item_' + Date.now(), name: '새 항목', sub: '',
          juniper: null, highland: null, threey: null, sx: null, type: 'normal'
        });
        renderAll();
      });

      /* 카테고리 삭제 */
      block.querySelector('.del-cat-btn').addEventListener('click', () => {
        const catName = data.categories[ci].name;
        if (!confirm(`"${catName}" 카테고리 전체를 삭제하겠습니까?\n포함된 항목도 모두 삭제됩니다.`)) return;
        collectData();
        pushHistory();
        data.categories.splice(ci, 1);
        renderAll();
        showToast(`"${catName}" 삭제됨`);
      });

      /* 항목 삭제 */
      block.querySelectorAll('.del-item-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          const ii = +this.closest('tr').dataset.itemIdx;
          if (isNaN(ii)) return;
          if (!confirm('이 항목을 삭제하겠습니까?')) return;
          collectData();
          pushHistory();
          data.categories[ci].items.splice(ii, 1);
          renderAll();
        });
      });

      container.appendChild(block);
    });

    setupCatDrag(container);
    container.querySelectorAll('.items-tbody').forEach((tbody, ci) => {
      setupItemDrag(tbody, ci);
    });
  }

  /* ── 카테고리 드래그 ── */
  function setupCatDrag(container) {
    let dragSrc = null;

    container.querySelectorAll('.cat-block').forEach(block => {
      block.addEventListener('dragstart', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
          e.preventDefault(); return;
        }
        dragSrc = block;
        block.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      block.addEventListener('dragend', () => {
        block.classList.remove('dragging');
        container.querySelectorAll('.cat-block').forEach(b => b.classList.remove('drag-over'));
      });
      block.addEventListener('dragover', e => {
        e.preventDefault();
        if (block === dragSrc) return;
        container.querySelectorAll('.cat-block').forEach(b => b.classList.remove('drag-over'));
        block.classList.add('drag-over');
      });
      block.addEventListener('drop', e => {
        e.preventDefault();
        if (!dragSrc || dragSrc === block) return;
        collectData();
        pushHistory();
        const fromIdx = +dragSrc.dataset.catIdx;
        const toIdx   = +block.dataset.catIdx;
        const moved = data.categories.splice(fromIdx, 1)[0];
        data.categories.splice(toIdx, 0, moved);
        renderAll();
        showToast('순서 변경됨');
      });
    });
  }

  /* ── 항목 드래그 ── */
  function setupItemDrag(tbody, ci) {
    let dragRow = null;

    tbody.querySelectorAll('.draggable-row').forEach(row => {
      row.addEventListener('dragstart', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'SELECT') {
          e.preventDefault(); return;
        }
        dragRow = row;
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('dragging');
        tbody.querySelectorAll('tr').forEach(r => r.classList.remove('drag-over'));
      });
      row.addEventListener('dragover', e => {
        e.preventDefault();
        if (row === dragRow) return;
        tbody.querySelectorAll('tr').forEach(r => r.classList.remove('drag-over'));
        row.classList.add('drag-over');
      });
      row.addEventListener('drop', e => {
        e.preventDefault();
        if (!dragRow || dragRow === row) return;
        collectData();
        pushHistory();
        const fromIdx = +dragRow.dataset.itemIdx;
        const toIdx   = +row.dataset.itemIdx;
        if (isNaN(fromIdx) || isNaN(toIdx)) return;
        const moved = data.categories[ci].items.splice(fromIdx, 1)[0];
        data.categories[ci].items.splice(toIdx, 0, moved);
        renderAll();
      });
    });
  }

  function renderAdditional() {
    document.getElementById('addl-editor').value = data.additionalServices.join('\n');
  }

  function renderNotes() {
    document.getElementById('notes-editor').value = data.notes.join('\n');
  }

  /* ── COLLECT ── */
  function collectData() {
    document.querySelectorAll('.cat-block').forEach((block, ci) => {
      if (!data.categories[ci]) return;
      data.categories[ci].name   = block.querySelector('.cat-name-input').value.trim();
      data.categories[ci].nameEn = block.querySelector('.cat-en-input').value.trim();

      block.querySelectorAll('.items-tbody tr[data-item-idx]').forEach((row, ii) => {
        const item = data.categories[ci].items[ii];
        if (!item) return;
        const nameEl = row.querySelector('.f-name');
        if (nameEl) item.name = nameEl.value.trim();
        const subEl  = row.querySelector('.f-sub');
        if (subEl)  item.sub  = subEl.value.trim();
        const typeEl = row.querySelector('.f-type');
        if (typeEl) item.type = typeEl.value;
        cols.forEach(c => {
          const el = row.querySelector(`.f-${c}`);
          if (el) item[c] = el.value === '' ? null : Number(el.value);
        });
      });
    });

    data.additionalServices = document.getElementById('addl-editor').value
      .split('\n').map(s => s.trim()).filter(Boolean);
    data.notes = document.getElementById('notes-editor').value
      .split('\n').map(s => s.trim()).filter(Boolean);
  }

  function esc(str) {
    return String(str ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }
})();
