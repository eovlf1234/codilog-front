const BACKEND_URL = "https://codilog-back.onrender.com";

export async function onRequest({ request }) {
    const url = new URL(request.url);

    // /api 제거
    const path = url.pathname.replace(/^\/api(?=\/|$)/, "") || "/";

    // Render 백엔드 주소 생성
    const targetUrl = new URL(
        path + url.search,
        BACKEND_URL
    );

    // 기존 요청의 헤더, 쿠키, 본문 등을 유지
    const proxyRequest = new Request(targetUrl, request);

    // 백엔드 응답을 그대로 반환
    return fetch(proxyRequest);
}