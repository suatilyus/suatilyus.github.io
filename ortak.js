/* suatilyus — shared behaviour for every page */
{
const ROOT = new URL('.', document.currentScript.src).href;   // site root, works on any page depth

/* stale-copy guard: if the browser kept an older version of this page, reload once to get the new one */
const SURUM = new URL(document.currentScript.src).searchParams.get('v');
if (SURUM) fetch(ROOT + 'surum.txt?t=' + Date.now(), {cache: 'no-store'}).then(r => r.ok ? r.text() : '').then(t => {
  t = t.trim(); if (!t || t === SURUM) return;
  let son = 0; try { son = +sessionStorage.getItem('suat-yenile') || 0; } catch (e) {}
  if (Date.now() - son < 60000) return;            // never loop
  try { sessionStorage.setItem('suat-yenile', Date.now()); } catch (e) {}
  location.reload();
}).catch(() => {});

/* toast with drawn icons */
let toastEl, toastT;
function toast(msg, ok) {
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.append(toastEl); }
  toastEl.innerHTML = '';
  const i = new Image(); i.alt = ''; i.src = ROOT + (ok ? 'img/onay-ikon.png' : 'img/cikis-ikon.png');
  toastEl.append(i, document.createTextNode(msg));
  toastEl.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

/* "yakında, aha burada!" burst */
let pop, popT;
function yakinda() {
  if (!pop) {
    pop = document.createElement('div'); pop.className = 'yk-pop cz on'; pop.setAttribute('role', 'status'); pop.setAttribute('aria-label', 'Yakında, aha burada!');
    pop.innerHTML = `<img class="c" src="${ROOT}img/ui/yakinda-c.png" alt=""><img src="${ROOT}img/ui/yakinda.png" alt="Yakında! Aha burada!">`;
    document.body.append(pop);
    pop.getBoundingClientRect();
  }
  pop.classList.add('show');
  clearTimeout(popT); popT = setTimeout(() => pop.classList.remove('show'), 1500);
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-soon]');
  if (a) { e.preventDefault(); yakinda(); }
});

/* corner menu: dil / giriş → kayıt ol · giriş yap · (gizli) müdüriyet · dil */
function kose() {
  if (document.body.dataset.nokose != null) return;
  const u = n => ROOT + 'img/ui/' + n + '.png';
  let known = false; try { known = localStorage.getItem('suat-mud') === '1'; } catch (e) {}
  const k = document.createElement('nav'); k.className = 'kose'; k.setAttribute('aria-label', 'Dil ve giriş');
  k.innerHTML = `<button class="kose-btn cz lit" aria-expanded="false" aria-haspopup="true"><img src="${u('dil-gosterge')}" alt="Türkçe / giriş" width="282" height="135"></button>
    <div class="kose-menu" role="menu">
      <a class="k-kayit" href="#" data-soon role="menuitem"><img src="${u('kayit-ol')}" alt="Kayıt ol" width="251" height="94"></a>
      <a class="k-giris" href="#" data-soon role="menuitem"><img src="${u('giris-yap')}" alt="Giriş yap" width="212" height="86"></a>
      <a class="k-mud" href="${ROOT}panel/index.html" role="menuitem" ${known ? '' : 'hidden'}><img src="${u('muduriyet')}" alt="Müdüriyet" width="307" height="88"></a>
      <img class="k-dil" src="${u('dil')}" alt="Dil" width="93" height="48">
      <button class="lang sel" aria-pressed="true"><img class="fl" src="${u('bayrak-tr')}" alt=""><img class="w" src="${u('turkce')}" alt="Türkçe"></button>
      <button class="lang" aria-pressed="false" data-soon><img class="fl" src="${u('bayrak-en')}" alt=""><img class="w" src="${u('ingilizce')}" alt="İngilizce"></button>
    </div>`;
  document.body.append(k);
  const btn = k.querySelector('.kose-btn'), mud = k.querySelector('.k-mud');
  const toggle = v => { k.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); };
  /* secret: hold the corner button ~1.5 s to reveal MÜDÜRİYET */
  let hold, held = false;
  const start = () => { held = false; hold = setTimeout(() => { held = true; mud.hidden = false; toggle(true); if (navigator.vibrate) navigator.vibrate(30); }, 1500); };
  const stop = () => clearTimeout(hold);
  btn.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener('contextmenu', e => e.preventDefault());
  btn.addEventListener('click', () => { if (held) { held = false; return; } toggle(!k.classList.contains('open')); });
  document.addEventListener('click', e => { if (!k.contains(e.target)) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kose); else kose();

/* site content (veri/site.json, written by the control panel). Falls back to defaults. */
const VARSAYILAN = () => ({
  v: 1,
  butonlar: [
    {id: 'uygulamalar', ad: 'Uygulamalar', link: 'uygulamalar/', gorsel: 'img/btn-uygulamalar.png', renk: 'img/btn-uygulamalar-c.png'},
    {id: 'illustrasyon', ad: 'İllüstrasyon', link: 'illustrasyon/', gorsel: 'img/btn-illustrasyon.png', renk: 'img/btn-illustrasyon-c.png'},
    {id: 'indir', ad: 'İndir-kullan', link: 'indir/', gorsel: 'img/btn-indir-kullan.png', renk: 'img/btn-indir-kullan-c.png'},
    {id: 'teklif-al', ad: 'Teklif al', link: 'https://ig.me/m/suatilyus', gorsel: 'img/btn-teklif-al.png', renk: 'img/btn-teklif-al-c.png'},
    {id: 'teklif-ver', ad: 'Teklif ver', link: 'https://ig.me/m/suatilyus', gorsel: 'img/btn-teklif-ver.png', renk: 'img/btn-teklif-ver-c.png'}
  ],
  illustrasyon: [],
  indir: [
    {id: 'fontlar', ad: 'Fontlar', not: 'suatilyus el yazısı fontları', dosyalar: [
      {ad: 'suatilyus skinny', dosya: 'dosyalar/suatilyus-skinny-regular.ttf', boyut: 18384},
      {ad: 'suatilyus long', dosya: 'dosyalar/suatilyus-long-regular.ttf', boyut: 17532},
      {ad: 'suatilyus hand', dosya: 'dosyalar/suatilyus-hand-regular.ttf', boyut: 17892}]},
    {id: 'brushlar', ad: 'Brushlar', not: 'Procreate fırçaları', dosyalar: []}
  ],
  notlar: [], reddedilen: [],
  notKutusu: KUTU0()
});
/* note inbox: Google Form (suatilyus not kutusu) + its response sheet published as CSV */
const KUTU0 = () => ({
  form: 'https://docs.google.com/forms/d/e/1FAIpQLSccqGv7FUsKM87hh3gOBIRQdyzAYhrW-aOulezxnHgy_oIBqA/formResponse',
  alan: 'entry.494750193',
  csv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJo5hjYIVAyn-2LWlTgjXnSh8yAgTy2IEXXd46Fx_qr-RMZojMxtA3DEUmXaZiC47GJbPK2Vu8VAq4/pub?output=csv'
});
const kutuDoldur = d => { const k = d.notKutusu || {}; if (!k.form || !k.alan || !k.csv) d.notKutusu = Object.assign(KUTU0(), Object.fromEntries(Object.entries(k).filter(([, v]) => v))); 
  /* notes: drop duplicates and anything he removed */
  const red = new Set(d.reddedilen || []), gor = new Set();
  d.notlar = (d.notlar || []).filter(n => n && !red.has(n.id) && !gor.has(n.id) && gor.add(n.id));
  return d; };
let veriP;
function veri() {
  if (!veriP) veriP = (async () => {
    const t = '?' + Date.now();
    const s = await fetch(ROOT + 'veri/site.json' + t).then(r => r.ok ? r.json() : null).catch(() => null);
    if (s && s.v) return kutuDoldur(s);
    const d = VARSAYILAN();
    const w = await fetch(ROOT + 'veri/duvar.json' + t).then(r => r.ok ? r.json() : null).catch(() => null);
    d.illustrasyon = ((w && w.duvar) || []).map(x => ({dosya: x.dosya, ad: x.ad, not: x.not || '', indir: true}));
    return d;
  })();
  return veriP;
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const url = l => /^https?:/.test(l) ? l : ROOT + l;
const kb = n => !n ? '' : n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

window.suat = {toast, yakinda, ROOT, veri, VARSAYILAN, esc, url, kb, kutuDoldur};
}
