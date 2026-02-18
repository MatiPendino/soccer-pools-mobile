export function initializeGoogleAds() {
    if (typeof document === 'undefined') return;
    if (document.querySelector('script[data-google-ads]')) return; // avoid duplicates

    const GTAG_ID = 'AW-17052096122';

    // External gtag.js loader
    const loaderScript = document.createElement('script');
    loaderScript.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
    loaderScript.async = true;
    loaderScript.setAttribute('data-google-ads', '');
    document.head.appendChild(loaderScript);

    // Inline init script
    const initScript = document.createElement('script');
    initScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GTAG_ID}');
    `;
    document.head.appendChild(initScript);
}
