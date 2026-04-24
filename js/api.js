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
    // no-cors: CORS preflight 없이 전송 (Apps Script 수신 가능)
    await fetch(SMITH_API, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data)
    });
    return true;
  } catch (e) {
    console.error('API 저장 실패:', e);
    return false;
  }
}
