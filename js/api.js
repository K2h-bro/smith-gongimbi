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
    const json = encodeURIComponent(JSON.stringify(data));
    const url = SMITH_API + '?action=save&d=' + json + '&t=' + Date.now();

    // 스크립트 태그 방식: CORS·리다이렉트 제약 없이 GET 전송
    const script = document.createElement('script');
    script.src = url;
    script.onload  = () => { script.remove(); resolve(true); };
    script.onerror = () => { script.remove(); resolve(true); }; // 오류여도 요청은 전송됨
    document.head.appendChild(script);

    // 8초 타임아웃 (네트워크 응답 없어도 저장 완료로 처리)
    setTimeout(() => resolve(true), 8000);
  });
}
