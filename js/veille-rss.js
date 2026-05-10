/**
 * veille-rss.js — Agrégateur RSS pour la page de veille
 * Flux catégorisés selon les centres d'intérêt : sécu, reverse/pwn, Linux, dev, actu tech
 */

// ── Configuration des flux ──────────────────────────────────────────────────

const RSS_FEEDS = [
  // Sécurité générale
  { url: 'https://www.undernews.fr/feed',                                                    cat: 'Sécurité',       source: 'UnderNews'       },
  { url: 'https://www.cert.ssi.gouv.fr/feed/',                                              cat: 'Sécurité',       source: 'CERT-FR'         },
  { url: 'https://feeds.feedburner.com/TheHackersNews',                                     cat: 'Sécurité',       source: 'The Hacker News' },
  { url: 'https://www.schneier.com/feed/atom/',                                             cat: 'Sécurité',       source: 'Schneier on Sec' },
  { url: 'https://phrack.org/index_latest',                                                 cat: 'Sécurité',       source: 'Phrack'},
  
  // Reverse / Pwn / CTF
  { url: 'https://googleprojectzero.blogspot.com/feeds/posts/default',                      cat: 'Reverse / Pwn',  source: 'Project Zero'    },
  { url: 'https://ctftime.org/news/rss/',                                                   cat: 'Reverse / Pwn',  source: 'CTFtime'         },
  { url: 'https://ret2systems.com/feed.xml',                                                cat: 'Reverse / Pwn',  source: 'ret2systems'     },
  { url: 'https://blog.quarkslab.com/',                                                cat: 'Reverse / Pwn',  source: 'Quarkslab'       },
  { url: 'https://connormcgarr.github.io/',                                                cat: 'Reverse / Pwn',  source: 'Connormcgarr'       },
  { url: 'https://0x434b.dev/',                                                cat: 'Reverse / Pwn',  source: '0x434b'       },
  { url: 'https://ctf.re/',                                                cat: 'Reverse / Pwn',  source: 'ctf.re'       },
  // Linux / Bash / Sys
  { url: 'https://www.phoronix.com/rss.php',                                                cat: 'Linux / Bash',   source: 'Phoronix'        },
  { url: 'https://lwn.net/headlines/rss',                                                   cat: 'Linux / Bash',   source: 'LWN.net'         },
  // Dev — Java, C, général
  { url: 'https://www.infoq.com/feed/',                                                     cat: 'Dev / Java / C', source: 'InfoQ'           },
  { url: 'https://feeds.feedburner.com/baeldung',                                           cat: 'Dev / Java / C', source: 'Baeldung'        },
  // Actu Tech générale
  { url: 'https://korben.info/feed',                                                        cat: 'Actu Tech',      source: 'Korben'          },
  { url: 'https://www.lemondeinformatique.fr/flux-rss/thematique/toutes-les-actualites/rss.xml', cat: 'Actu Tech', source: 'LMI'             },
];

const PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

// ── Articles de secours (affichés si tous les flux RSS échouent) ─────────────

const FALLBACK_ARTICLES = [
  { title: 'CVE-2024-3094 — Backdoor dans XZ Utils (liblzma)',                          link: 'https://www.openwall.com/lists/oss-security/2024/03/29/4',               pubDate: new Date('2024-03-29'), source: 'oss-security',        cat: 'Sécurité'       },
  { title: 'CERT-FR — Multiples vulnérabilités dans le noyau Linux',                   link: 'https://www.cert.ssi.gouv.fr/avis/CERTFR-2024-AVI-0001/',                pubDate: new Date('2024-03-10'), source: 'CERT-FR',             cat: 'Sécurité'       },
  { title: 'Heap Exploitation — House of Force et ses variantes',                      link: 'https://heap-exploitation.dhavalkapil.com/',                             pubDate: new Date('2024-01-15'), source: 'dhavalkapil.com',     cat: 'Reverse / Pwn'  },
  { title: 'ret2libc — Bypass NX sans gadget ROP',                                     link: 'https://ir0nstone.gitbook.io/notes/types/stack/ret2libc',               pubDate: new Date('2024-02-10'), source: 'ir0nstone',           cat: 'Reverse / Pwn'  },
  { title: 'Ghidra 11.0 — Nouveautés du décompilateur NSA',                            link: 'https://github.com/NationalSecurityAgency/ghidra/releases',             pubDate: new Date('2024-04-05'), source: 'GitHub NSA',          cat: 'Reverse / Pwn'  },
  { title: 'CTFtime — Writeups de la compétition PlaidCTF 2024',                       link: 'https://ctftime.org/event/2205',                                        pubDate: new Date('2024-04-12'), source: 'CTFtime',             cat: 'Reverse / Pwn'  },
  { title: 'Linux 6.8 — Performances réseau et nouveau support matériel',              link: 'https://www.phoronix.com/review/linux-68-overview',                     pubDate: new Date('2024-03-10'), source: 'Phoronix',            cat: 'Linux / Bash'   },
  { title: 'Bash one-liners pour l\'analyse de logs système',                          link: 'https://www.commandlinefu.com/commands/browse',                         pubDate: new Date('2024-02-20'), source: 'commandlinefu',       cat: 'Linux / Bash'   },
  { title: 'systemd-boot vs GRUB — Comparaison approfondie',                          link: 'https://lwn.net/Articles/966817/',                                       pubDate: new Date('2024-03-01'), source: 'LWN.net',             cat: 'Linux / Bash'   },
  { title: 'Java 21 — Virtual Threads et Project Loom en production',                  link: 'https://www.baeldung.com/java-virtual-thread-vs-thread',                pubDate: new Date('2024-01-22'), source: 'Baeldung',            cat: 'Dev / Java / C' },
  { title: 'C — Undefined Behavior et pièges courants avec GCC',                       link: 'https://blog.regehr.org/archives/213',                                  pubDate: new Date('2024-02-05'), source: 'regehr.org',          cat: 'Dev / Java / C' },
  { title: 'JVM internals — Comprendre le garbage collector ZGC',                      link: 'https://www.infoq.com/articles/zgc-jdk-16/',                            pubDate: new Date('2024-03-15'), source: 'InfoQ',               cat: 'Dev / Java / C' },
  { title: 'RISC-V prend de l\'ampleur dans l\'embarqué en 2024',                      link: 'https://korben.info',                                                   pubDate: new Date('2024-04-01'), source: 'Korben',              cat: 'Actu Tech'      },
  { title: 'Google migre 30M de lignes C++ vers Rust pour la sécurité mémoire',        link: 'https://security.googleblog.com/2024/03/secure-by-design-googles-perspective-on.html', pubDate: new Date('2024-03-22'), source: 'Google Security Blog', cat: 'Actu Tech' },
];

// ── State ────────────────────────────────────────────────────────────────────

let allArticles    = [];
let activeCategory = 'all';
let searchQuery    = '';
let maxArticles    = 40;

// ── DOM refs ─────────────────────────────────────────────────────────────────

const feedList      = document.getElementById('feed-list');
const statusText    = document.getElementById('status-text');
const refreshBtn    = document.getElementById('refresh-feed');
const searchInput   = document.getElementById('veille-search');
const countSelect   = document.getElementById('article-count');
const catBtns       = document.querySelectorAll('.cat-btn');
const fallbackBanner = document.getElementById('fallback-banner');

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchFeed({ url, cat, source }) {
  try {
    const res  = await fetch(PROXY + encodeURIComponent(url));
    const data = await res.json();
    if (data.status !== 'ok') return [];
    return data.items.map(item => ({
      title:   item.title || '(sans titre)',
      link:    item.link  || '#',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(0),
      source,
      cat,
      isFallback: false,
    }));
  } catch {
    return [];
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderSkeleton() {
  feedList.innerHTML = Array.from({ length: 10 }, (_, i) =>
    `<div class="skeleton-line" style="width:${65 + (i % 4) * 8}%;opacity:${1 - i * 0.07}"></div>`
  ).join('');
}

function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return '—';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
       + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildEntry(article, index) {
  const entry = document.createElement('div');
  entry.className = 'feed-entry' + (article.isFallback ? ' is-fallback' : '');
  entry.dataset.cat = article.cat;
  entry.style.animationDelay = `${index * 22}ms`;
  entry.innerHTML = `
    <span class="entry-date">${formatDate(article.pubDate)}</span>
    <span class="entry-source">${escHtml(article.source)}</span>
    <span class="entry-title">
      <a href="${escHtml(article.link)}" target="_blank" rel="noopener">${escHtml(article.title)}</a>
    </span>
    <span class="entry-cat">${escHtml(article.cat)}</span>
  `;
  return entry;
}

function applyFilters() {
  const q = searchQuery.toLowerCase().trim();

  const filtered = allArticles
    .filter(a => {
      const matchCat    = activeCategory === 'all' || a.cat === activeCategory;
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.source.toLowerCase().includes(q);
      return matchCat && matchSearch;
    })
    .slice(0, maxArticles);

  feedList.innerHTML = '';

  if (filtered.length === 0) {
    feedList.innerHTML = '<div class="feed-empty">Aucun article ne correspond à cette recherche.</div>';
    statusText.textContent = '0 article';
    return;
  }

  filtered.forEach((a, i) => feedList.appendChild(buildEntry(a, i)));

  const catLabel     = activeCategory !== 'all' ? ` — ${activeCategory}` : '';
  const offlineNote  = allArticles[0]?.isFallback ? ' · ⚠ mode hors-ligne' : '';
  statusText.textContent = `${filtered.length} article${filtered.length > 1 ? 's' : ''}${catLabel}${offlineNote}`;
}

// ── Load ──────────────────────────────────────────────────────────────────────

async function loadAllFeeds() {
  renderSkeleton();
  statusText.textContent = `Chargement de ${RSS_FEEDS.length} flux…`;
  refreshBtn.classList.add('spinning');

  let loaded = 0;
  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed =>
      fetchFeed(feed).then(items => {
        loaded++;
        statusText.textContent = `${loaded}/${RSS_FEEDS.length} flux chargés…`;
        return items;
      })
    )
  );

  allArticles = [];
  results.forEach(r => { if (r.status === 'fulfilled') allArticles.push(...r.value); });

  if (allArticles.length === 0) {
    // Aucun flux dispo → articles de secours
    allArticles = FALLBACK_ARTICLES.map(a => ({ ...a, isFallback: true }));
    if (fallbackBanner) fallbackBanner.style.display = 'flex';
  } else {
    if (fallbackBanner) fallbackBanner.style.display = 'none';
  }

  allArticles.sort((a, b) => b.pubDate - a.pubDate);
  refreshBtn.classList.remove('spinning');
  applyFilters();
}

// ── Events ────────────────────────────────────────────────────────────────────

refreshBtn.addEventListener('click', loadAllFeeds);

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  applyFilters();
});

countSelect.addEventListener('change', () => {
  maxArticles = parseInt(countSelect.value, 10);
  applyFilters();
});

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    applyFilters();
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadAllFeeds();
  setInterval(loadAllFeeds, 20 * 60 * 1000);
});
