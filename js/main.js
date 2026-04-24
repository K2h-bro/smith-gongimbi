(function () {
  const data = loadData();
  const tbody = document.getElementById('table-body');
  const romans = ['i','ii','iii','iv','v','vi','vii','viii','ix','x'];

  function price(val) {
    if (val === null || val === undefined) {
      return '<td class="price-cell empty">—</td>';
    }
    return `<td class="price-cell">${val}<span class="unit">만</span></td>`;
  }

  // Table rows
  data.categories.forEach(cat => {
    // Category header
    tbody.insertAdjacentHTML('beforeend',
      `<tr class="cat-header">
        <td colspan="6">${cat.name}<span class="cat-en">${cat.nameEn}</span></td>
      </tr>`
    );

    cat.items.forEach(item => {
      if (item.type === 'consult') {
        tbody.insertAdjacentHTML('beforeend',
          `<tr class="consult-row">
            <td class="label-cell">${item.name}</td>
            <td colspan="5">상담 및 채팅 문의</td>
          </tr>`
        );
        return;
      }
      const rowClass = item.type === 'set' ? 'item-row set-row' : 'item-row';
      const sub = item.sub ? `<span class="sub">${item.sub}</span>` : '';
      tbody.insertAdjacentHTML('beforeend',
        `<tr class="${rowClass}">
          <td></td>
          <td class="item-name">${item.name}${sub}</td>
          ${price(item.juniper)}
          ${price(item.highland)}
          ${price(item.threey)}
          ${price(item.sx)}
        </tr>`
      );
    });
  });

  // Additional services
  const tagsEl = document.getElementById('addl-tags');
  data.additionalServices.forEach(s => {
    tagsEl.insertAdjacentHTML('beforeend', `<span class="addl-tag">${s}</span>`);
  });

  // Notes — split into 2 columns
  const notesEl = document.getElementById('notes-section');
  const half = Math.ceil(data.notes.length / 2);
  const col1 = data.notes.slice(0, half);
  const col2 = data.notes.slice(half);

  function renderNoteCol(notes, startIdx) {
    return notes.map((n, i) =>
      `<div class="note-item">
        <span class="note-num">${romans[startIdx + i]}.</span>
        <span class="note-text">${n}</span>
      </div>`
    ).join('');
  }

  notesEl.innerHTML =
    `<div class="notes-col">${renderNoteCol(col1, 0)}</div>
     <div class="notes-col">${renderNoteCol(col2, half)}</div>`;
})();
