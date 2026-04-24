(function () {
  const romans = ['i','ii','iii','iv','v','vi','vii','viii','ix','x'];
  const carLabels = { juniper: '주니퍼', highland: '하이랜드', threey: '3 · Y', sx: 'S · X' };
  let selectedCar = 'juniper';

  /* ── 로딩 상태 ── */
  function showLoading() {
    document.getElementById('price-content').innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--text-muted);">
        <div class="spinner"></div>
        <div style="margin-top:14px;font-size:12px;letter-spacing:1px;">데이터 불러오는 중…</div>
      </div>`;
  }

  /* ── 렌더링 ── */
  function renderAll(data) {
    renderPriceContent(data, selectedCar);
    renderAdditional(data);
    renderNotes(data);
  }

  function renderPriceContent(data, carKey) {
    const el = document.getElementById('price-content');
    let html = `<span class="car-badge">${carLabels[carKey]}</span>`;

    data.categories.forEach(cat => {
      const visible = cat.items.filter(i => i.type === 'consult' || i[carKey] !== null);
      if (!visible.length) return;

      html += `
        <div class="price-category">
          <div class="category-header">
            ${cat.name}<span class="cat-en">${cat.nameEn}</span>
          </div>
          <div class="price-list">
            ${visible.map(item => renderItem(item, carKey)).join('')}
          </div>
        </div>`;
    });

    el.innerHTML = html;
  }

  function renderItem(item, carKey) {
    if (item.type === 'consult') {
      return `<div class="price-item is-consult">
        <span class="item-name">${item.name}</span>
        <span class="consult-label">상담 및 채팅 문의</span>
      </div>`;
    }
    const cls = item.type === 'set' ? 'price-item is-set' : 'price-item';
    const sub = item.sub ? `<div class="item-sub">${item.sub}</div>` : '';
    return `<div class="${cls}">
      <div class="item-info">
        <div class="item-name">${item.name}</div>${sub}
      </div>
      <div class="item-price">${item[carKey]}<span class="unit">만원</span></div>
    </div>`;
  }

  function renderAdditional(data) {
    document.getElementById('addl-tags').innerHTML =
      data.additionalServices.map(s => `<span class="addl-tag">${s}</span>`).join('');
  }

  function renderNotes(data) {
    const el = document.getElementById('notes-section');
    const half = Math.ceil(data.notes.length / 2);
    function col(notes, start) {
      return notes.map((n, i) => `
        <div class="note-item">
          <span class="note-num">${romans[start + i]}.</span>
          <span class="note-text">${n}</span>
        </div>`).join('');
    }
    el.innerHTML = `
      <div class="notes-col">${col(data.notes.slice(0, half), 0)}</div>
      <div class="notes-col">${col(data.notes.slice(half), half)}</div>`;
  }

  /* ── 탭 이벤트 ── */
  document.querySelectorAll('.car-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.car-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedCar = tab.dataset.car;
      const cached = window.__smithData;
      if (cached) renderPriceContent(cached, selectedCar);
    });
  });

  /* ── 초기 로드 ── */
  async function init() {
    showLoading();

    // API에서 최신 데이터 우선 로드
    const apiData = await apiLoad();
    if (apiData) {
      window.__smithData = apiData;
      localStorage.setItem('smith_data', JSON.stringify(apiData));
      renderAll(apiData);
      return;
    }

    // API 실패 시 캐시 사용
    const cached = localStorage.getItem('smith_data');
    if (cached) {
      const cachedData = JSON.parse(cached);
      window.__smithData = cachedData;
      renderAll(cachedData);
      return;
    }

    // 캐시도 없으면 기본값 사용
    const fallback = JSON.parse(JSON.stringify(DEFAULT_DATA));
    window.__smithData = fallback;
    renderAll(fallback);
  }

  init();
})();
