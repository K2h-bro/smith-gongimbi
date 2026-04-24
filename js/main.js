(function () {
  const data = loadData();
  const priceContent = document.getElementById('price-content');
  const romans = ['i','ii','iii','iv','v','vi','vii','viii','ix','x'];
  const carLabels = { juniper: '주니퍼', highland: '하이랜드', threey: '3 · Y', sx: 'S · X' };

  let selectedCar = 'juniper';

  /* ── 차종별 공임비 렌더링 ── */
  function renderPriceContent(carKey) {
    let html = `<span class="car-badge">${carLabels[carKey]}</span>`;

    data.categories.forEach(cat => {
      const visibleItems = cat.items.filter(item =>
        item.type === 'consult' || item[carKey] !== null
      );
      if (visibleItems.length === 0) return;

      html += `
        <div class="price-category">
          <div class="category-header">
            ${cat.name}<span class="cat-en">${cat.nameEn}</span>
          </div>
          <div class="price-list">
            ${visibleItems.map(item => renderItem(item, carKey)).join('')}
          </div>
        </div>`;
    });

    priceContent.innerHTML = html;
  }

  function renderItem(item, carKey) {
    if (item.type === 'consult') {
      return `
        <div class="price-item is-consult">
          <span class="item-name">${item.name}</span>
          <span class="consult-label">상담 및 채팅 문의</span>
        </div>`;
    }

    const cls = item.type === 'set' ? 'price-item is-set' : 'price-item';
    const sub = item.sub ? `<div class="item-sub">${item.sub}</div>` : '';
    const price = item[carKey];

    return `
      <div class="${cls}">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          ${sub}
        </div>
        <div class="item-price">${price}<span class="unit">만원</span></div>
      </div>`;
  }

  /* ── 탭 이벤트 ── */
  document.querySelectorAll('.car-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.car-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedCar = tab.dataset.car;
      renderPriceContent(selectedCar);
    });
  });

  /* ── 추가 서비스 ── */
  function renderAdditional() {
    const el = document.getElementById('addl-tags');
    el.innerHTML = data.additionalServices
      .map(s => `<span class="addl-tag">${s}</span>`)
      .join('');
  }

  /* ── 안내 사항 ── */
  function renderNotes() {
    const el = document.getElementById('notes-section');
    const half = Math.ceil(data.notes.length / 2);
    const col1 = data.notes.slice(0, half);
    const col2 = data.notes.slice(half);

    function col(notes, start) {
      return notes.map((n, i) => `
        <div class="note-item">
          <span class="note-num">${romans[start + i]}.</span>
          <span class="note-text">${n}</span>
        </div>`).join('');
    }

    el.innerHTML = `
      <div class="notes-col">${col(col1, 0)}</div>
      <div class="notes-col">${col(col2, half)}</div>`;
  }

  /* ── 초기 실행 ── */
  renderPriceContent(selectedCar);
  renderAdditional();
  renderNotes();
})();
