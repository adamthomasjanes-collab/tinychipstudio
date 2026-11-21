// Preview-only, explicit opt-in. Never reads field values, storage, cookies,
// error messages, URL parameters, request bodies or authentication data.
export function installDiagnostics() {
  const host = document.createElement('aside');
  host.id = 'qa-diagnostics';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>:host{position:fixed;bottom:12px;right:12px;z-index:20000;font:14px/1.5 system-ui;color:#fff}details{width:min(360px,90vw);background:#15171d;border:2px solid #c7ff58;padding:12px;box-sizing:border-box}summary,button{cursor:pointer;min-height:44px}button{font:inherit;margin:4px;padding:8px;background:#c7ff58;color:#111;border:0}pre{white-space:pre-wrap;overflow:auto;max-height:45dvh;font-size:14px}summary{display:flex;align-items:center}</style><details><summary>QA · preview diagnostics</summary><button id="scan">Refresh report</button><button id="highlight">Highlight overflow</button><button id="copy">Copy report</button><button id="console">Load Eruda console</button><p>Use synthetic test data only. Reports contain geometry, capabilities and error counts; no form contents.</p><pre tabindex="0" aria-label="Diagnostic report"></pre></details>`;
  document.body.append(host);
  let errorCount = 0, rejectionCount = 0, report, markers = [];
  window.addEventListener('error', () => { errorCount++; });
  window.addEventListener('unhandledrejection', () => { rejectionCount++; });
  let resourceErrors = 0, httpErrors = 0;
  window.addEventListener('error', (event) => {
    if (event.target instanceof Element) resourceErrors++;
  }, true);
  if (window.PerformanceObserver?.supportedEntryTypes.includes('resource')) {
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (entry.responseStatus >= 400) httpErrors++;
    }).observe({ type: 'resource', buffered: true });
  }
  const insetProbe = document.createElement('div');
  insetProbe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  shadow.append(insetProbe);
  const viewport = () => {
    const vv = window.visualViewport;
    return {
      layout: [document.documentElement.clientWidth, document.documentElement.clientHeight],
      window: [innerWidth, innerHeight], scrollY: Math.round(scrollY),
      visual: vv && [vv.width, vv.height, vv.offsetLeft, vv.offsetTop].map(Math.round),
      scale: vv?.scale,
    };
  };
  const checkpoints = [];
  const record = event => {
    if (checkpoints.length >= 20) checkpoints.splice(1, 1); // retain the initial geometry
    checkpoints.push({ event, ms: Math.round(performance.now()), ...viewport() });
  };
  record('initial');
  const checkpointsAfterIdle = (target, events, label) => {
    let timer;
    for (const event of events) target?.addEventListener(event, () => {
      clearTimeout(timer);
      timer = setTimeout(() => record(label), 180);
    }, { passive: true });
  };
  checkpointsAfterIdle(window, ['resize'], 'window resize');
  checkpointsAfterIdle(window, ['scroll'], 'page scroll');
  checkpointsAfterIdle(window.visualViewport, ['scroll', 'resize'], 'visual viewport');
  checkpointsAfterIdle(window, ['orientationchange'], 'orientation');
  for (const name of ['focusin', 'focusout']) document.addEventListener(name, event => {
    if (event.target.matches?.('input,textarea,select')) record(name);
  });
  const geometry = e => {
    const r = e.getBoundingClientRect();
    return { tag:e.tagName, id:e.id || undefined, x:Math.round(r.x), y:Math.round(r.y), width:Math.round(r.width), height:Math.round(r.height), clientWidth:e.clientWidth, scrollWidth:e.scrollWidth };
  };
  const scan = () => {
    const elements = [...document.querySelectorAll('body *')].filter(e=>e!==host && !e.closest('[aria-hidden="true"],.visually-hidden') && e.getClientRects().length);
    const overflow = elements.filter(e=>{
      const r=e.getBoundingClientRect();
      const s=getComputedStyle(e);
      return (r.right>innerWidth+2||r.left < -2) && s.position!=='fixed' && s.visibility!=='hidden' && !e.closest('.ba-stage,.marquee,.crew');
    });
    const vv=window.visualViewport;
    report={ time:new Date().toISOString(), viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio,documentWidth:document.documentElement.scrollWidth}, visualViewport:vv?{width:vv.width,height:vv.height,top:vv.offsetTop,left:vv.offsetLeft,scale:vv.scale}:null, userAgent:navigator.userAgent, capabilities:{touch:navigator.maxTouchPoints,visualViewport:Boolean(vv),dynamicViewport:CSS.supports('height','100dvh'),reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches}, overflow:overflow.slice(0,40).map(geometry), potentiallyClipped:elements.filter(e=>['hidden','clip'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2).slice(0,30).map(geometry), fixedAndSticky:elements.filter(e=>['fixed','sticky'].includes(getComputedStyle(e).position)).slice(0,30).map(geometry), errors:{uncaught:errorCount,unhandledRejections:rejectionCount} };
    const ua = navigator.userAgent;
    const insets = getComputedStyle(insetProbe);
    report.appSignals = {
      instagram: /Instagram/i.test(ua), facebook: /FBAN|FBAV|FB_IAB/i.test(ua),
      messenger: /Messenger|FBAN\/Orca/i.test(ua), androidWebView: /; wv\)/i.test(ua),
      instagramReferrer: /^https:\/\/(?:[\w-]+\.)*instagram\.com\//i.test(document.referrer),
    };
    report.layout = { ...viewport(), documentHeight: document.documentElement.scrollHeight };
    report.safeArea = Object.fromEntries(['Top', 'Right', 'Bottom', 'Left'].map(side => [side, insets['padding' + side]]));
    report.typePixels = Object.fromEntries(['h1', '.hero-sub', '.hero-offer', '.ba-tab strong', '.ba-tab small', '.guide-dock-label'].map(selector =>
      [selector, getComputedStyle(document.querySelector(selector)).fontSize]));
    report.errors.resourceLoadFailures = resourceErrors;
    report.errors.observedHttpFailures = httpErrors;
    report.checkpoints = checkpoints;
    shadow.querySelector('pre').textContent=JSON.stringify(report,null,2);
    return overflow;
  };
  shadow.getElementById('scan').onclick=scan;
  shadow.getElementById('highlight').onclick=()=>{
    markers.forEach(e=>{e.style.outline=e.dataset.qaOutline;delete e.dataset.qaOutline;});markers=[];
    markers=scan();markers.forEach(e=>{e.dataset.qaOutline=e.style.outline;e.style.outline='2px solid #ff007e';});
  };
  shadow.getElementById('copy').onclick=async(e)=>{scan();try{await navigator.clipboard.writeText(JSON.stringify(report,null,2));e.target.textContent='Copied';}catch{e.target.textContent='Select report to copy';}};
  shadow.getElementById('console').onclick=async(e)=>{const {default:eruda}=await import('eruda');eruda.init({tool:['console','info'],useShadowDom:true,defaults:{displaySize:50}});e.target.disabled=true;e.target.textContent='Console loaded';};
  scan();
}
