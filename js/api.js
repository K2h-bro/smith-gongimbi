const SMITH_API = 'https://script.google.com/macros/s/AKfycbyXMM7eA3peeZBylAI8xe8N19TDcxEDpUIkQqRRwNsIOgYz73rQKNAhLJdmf0F60Kbd/exec';

async function apiLoad() {
  try {
    const res = await fetch(SMITH_API + '?t=' + Date.now());
    const json = await res.json();
    return (json && !json.empty) ? json : null;
  } catch (e) {
    console.warn('API 로드 실패:', e);
    return null;
  }
}

function apiSave(data) {
  return new Promise((resolve) => {
    const json   = JSON.stringify(data);
    const SIZE   = 800;  // 청크당 글자 수 (URL 안전 범위)
    const chunks = [];
    for (let i = 0; i < json.length; i += SIZE) {
      chunks.push(json.slice(i, i + SIZE));
    }

    let idx = 0;

    function sendNext() {
      if (idx >= chunks.length) { resolve(true); return; }

      const script = document.createElement('script');
      script.src = SMITH_API
        + '?action=save'
        + '&chunk=' + idx
        + '&total=' + chunks.length
        + '&d=' + encodeURIComponent(chunks[idx])
        + '&t=' + Date.now();

      script.onload = script.onerror = () => {
        script.remove();
        idx++;
        sendNext();
      };
      document.head.appendChild(script);
    }

    sendNext();
    setTimeout(() => resolve(true), 30000); // 30초 타임아웃
  });
}
