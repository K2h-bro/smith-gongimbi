(function () {
  const PASS = 'smith2121';

  /* ── AUTH ── */
  const loginScreen = document.getElementById('login-screen');
  const adminWrap   = document.getElementById('admin-wrap');
  const passInput   = document.getElementById('pass-input');
  const loginErr    = document.getElementById('login-error');

  function unlock() {
    loginScreen.style.display = 'none';
    adminWrap.classList.add('visible');
    renderAll();
  }

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
  passInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('login-btn').click(); });

  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('smith_auth');
    location.reload();
  });

  /* ── DATA ── */
  let data = loadData();

  /* ── TOAST ── */
  const toast = document.getElementById('toast');
  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = 'toast' + (isError ? ' error' : '');
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ── SAVE ── */
  function saveAll() {
    collectData();
    saveData(data);
    showToast('저장 완료');
  }

  document.getElementById('save-btn').addEventListener('click', saveAll);
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('모든 데이터를 초기값으로 되돌리겠습니까?')) return;
    resetData();
    data = loadData();
    renderAll();
    showToast('초기화 완료');
  });
  document.getElementById('preview-btn').addEventListener('click', () => {
    window.open('../index.html', '_blank');
  });

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

      const isConsultOnly = cat.items.length === 1 && cat.items[0].type === 'consult';

      let itemsHtml = '';
      cat.items.forEach((item, ii) => {
        if (item.type === 'consult') {
          itemsHtml += `
            <tr data-item-idx="${ii}">
              <td><span class="type-badge type-consult">상담</span></td>
              <td><input type="text" class="f-name" value="${esc(item.name)}" placeholder="항목명"></td>
              <td colspan="4" style="text-align:center;color:var(--muted);font-size:11px;">상담 및 채팅 문의 (고정)</td>
              <td class="center"><button class="btn btn-outline btn-sm del-item-btn">삭제</button></td>
            </tr>`;
        } else {
          itemsHtml += `
            <tr data-item-idx="${ii}">
              <td>
                <select class="f-type items-table" style="background:var(--input-bg);border:1px solid #333;color:var(--text);font-family:inherit;font-size:10px;padding:4px 6px;outline:none;">
                  <option value="normal" ${item.type==='normal'?'selected':''}>일반</option>
                  <option value="set"    ${item.type==='set'   ?'selected':''}>셋트</option>
                </select>
              </td>
              <td>
                <input type="text" class="f-name" value="${esc(item.name)}" placeholder="항목명" style="min-width:140px;">
                <input type="text" class="f-sub" value="${esc(item.sub||'')}" placeholder="[부가 설명]" style="margin-top:4px;font-size:10px;color:var(--text-dim);">
              </td>
              ${cols.map(c => `<td class="center"><input type="number" class="f-${c}" value="${item[c]??''}" placeholder="—" min="0" max="999"></td>`).join('')}
              <td class="center"><button class="btn btn-outline btn-sm del-item-btn">삭제</button></td>
            </tr>`;
        }
      });

      block.innerHTML = `
        <div class="cat-block-head">
          <span class="cat-block-name">
            <input type="text" class="cat-name-input" value="${esc(cat.name)}" style="background:transparent;border:none;border-bottom:1px solid var(--border);color:#fff;font-family:inherit;font-size:11px;font-weight:600;letter-spacing:1.5px;padding:2px 4px;width:140px;outline:none;">
            <input type="text" class="cat-en-input" value="${esc(cat.nameEn)}" style="background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--gold);font-family:inherit;font-size:9px;letter-spacing:2px;padding:2px 4px;width:90px;outline:none;">
          </span>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-outline btn-sm add-item-btn">+ 항목 추가</button>
          </div>
        </div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width:72px;">타입</th>
              <th>작업명 / 설명</th>
              ${colLabels.map(l => `<th class="center" style="width:68px;">${l}</th>`).join('')}
              <th style="width:64px;"></th>
            </tr>
          </thead>
          <tbody class="items-tbody">${itemsHtml}</tbody>
        </table>`;

      // Add item
      block.querySelector('.add-item-btn').addEventListener('click', () => {
        data.categories[ci].items.push({
          id: 'new_' + Date.now(),
          name: '새 항목',
          sub: '',
          juniper: null,
          highland: null,
          threey: null,
          sx: null,
          type: 'normal'
        });
        renderAll();
      });

      // Delete item
      block.querySelectorAll('.del-item-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          const ii = +this.closest('tr').dataset.itemIdx;
          if (!confirm('이 항목을 삭제하겠습니까?')) return;
          data.categories[ci].items.splice(ii, 1);
          renderAll();
        });
      });

      container.appendChild(block);
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
    // Categories
    document.querySelectorAll('.cat-block').forEach((block, ci) => {
      data.categories[ci].name   = block.querySelector('.cat-name-input').value.trim();
      data.categories[ci].nameEn = block.querySelector('.cat-en-input').value.trim();

      block.querySelectorAll('.items-tbody tr').forEach((row, ii) => {
        const item = data.categories[ci].items[ii];
        const nameEl = row.querySelector('.f-name');
        if (nameEl) item.name = nameEl.value.trim();
        const subEl = row.querySelector('.f-sub');
        if (subEl) item.sub = subEl.value.trim();
        const typeEl = row.querySelector('.f-type');
        if (typeEl) item.type = typeEl.value;
        cols.forEach(c => {
          const el = row.querySelector(`.f-${c}`);
          if (el) item[c] = el.value === '' ? null : Number(el.value);
        });
      });
    });

    // Additional services
    data.additionalServices = document.getElementById('addl-editor').value
      .split('\n').map(s => s.trim()).filter(Boolean);

    // Notes
    data.notes = document.getElementById('notes-editor').value
      .split('\n').map(s => s.trim()).filter(Boolean);
  }

  function esc(str) {
    return String(str ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }
})();
