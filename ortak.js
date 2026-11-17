/* suatilyus — shared behaviour for every page */
{
const ROOT = new URL('.', document.currentScript.src).href;   // site root, works on any page depth

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

window.suat = {toast, yakinda, ROOT};
}
