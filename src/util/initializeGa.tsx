export const initializeGA = (measurementId: string) => {
    // GA 스크립트가 이미 로드되어 있는지 확인
    if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
      return;
    }
  
    // gtag 스크립트 추가
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  
    // GA 초기화
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href
    });
  
    // gtag 함수를 전역으로 사용할 수 있도록 설정
    window.gtag = gtag;
  };