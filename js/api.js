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

async function apiSave(data) {
  try {
    const json = encodeURIComponent(JSON.stringify(data));
    const res = await fetch(`${SMITH_API}?action=save&d=${json}&t=${Date.now()}`);
    const result = await res.json();
    return result.ok === true;
  } catch (e) {
    console.error('API 저장 실패:', e);
    return false;
  }
}
