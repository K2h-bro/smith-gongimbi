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
    try {
      const json = encodeURIComponent(JSON.stringify(data));
      const img = new Image();
      // 이미지 태그는 CORS·리다이렉트 제약 없이 GET 요청을 보냄
      // Apps Script가 doGet을 실행한 후 JSON을 반환 → 이미지 로드 실패(onerror)하지만 저장은 완료됨
      img.onload = img.onerror = () => resolve(true);
      img.src = `${SMITH_API}?action=save&d=${json}&t=${Date.now()}`;
      setTimeout(() => resolve(true), 8000);
    } catch (e) {
      console.error('API 저장 실패:', e);
      resolve(false);
    }
  });
}
