import {
  about,
  accounts,
  collabs,
  contact,
  highlights,
  impressionSeries,
  lifetime,
  markets,
  reel,
  site,
  works,
  hero,
  type CollabReel,
  type WorkItem,
  type WorkMetrics,
} from "./data/content";

const ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESC[char] ?? char);
}

function withBase(src: string): string {
  if (
    /^(https?:)?\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("mailto:")
  ) {
    return src;
  }
  const base = import.meta.env.BASE_URL || "./";
  return `${base}${src.replace(/^\.?\//, "")}`;
}

function youtubeId(input: string): string | null {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^(www|m)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
          id = parts[1] ?? null;
        }
      }
    }
    return id && /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function isDirectVideo(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
}

function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : iso;
}

function formatStat(value: number, decimals: number): string {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function metricEntries(metrics?: WorkMetrics): { label: string; value: string }[] {
  if (!metrics) return [];
  const entries = [
    metrics.platform ? { label: "平台", value: metrics.platform } : null,
    metrics.views ? { label: "观看", value: metrics.views } : null,
    metrics.likes ? { label: "点赞", value: metrics.likes } : null,
    metrics.engagementRate ? { label: "互动率", value: metrics.engagementRate } : null,
  ];
  return entries.filter((entry): entry is { label: string; value: string } => entry !== null);
}

function metricLine(metrics?: WorkMetrics): string {
  const entries = metricEntries(metrics);
  if (!entries.length) return "";
  const views = entries.find((entry) => entry.label === "观看");
  const rate = entries.find((entry) => entry.label === "互动率");
  const platform = entries.find((entry) => entry.label === "平台");
  return [platform?.value, views?.value, rate ? `互动 ${rate.value}` : ""]
    .filter(Boolean)
    .join(" · ");
}

const seen = new Set<string>();
for (const work of works) {
  if (seen.has(work.id)) console.warn(`作品 id 重复：${work.id}`);
  seen.add(work.id);
}

const featured = works.find((work) => work.featured && work.type === "video");

const SPANS = [7, 5, 5, 7, 4, 4, 4, 6, 6];

function iconPlay(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path fill="currentColor" d="M8 5.2v13.6L19.2 12 8 5.2z"/></svg>`;
}

function iconPlayMark(): string {
  return `<svg class="reel-play-icon" viewBox="0 0 40 40" aria-hidden="true" width="34" height="34"><circle cx="20" cy="20" r="13.25" fill="rgba(250,247,242,0.28)" stroke="currentColor" stroke-width="1"/><path fill="currentColor" d="M17.1 14.4v11.2L26.6 20z"/></svg>`;
}

function isTall(work: WorkItem): boolean {
  if (!work.ratio) return false;
  const [width, height] = work.ratio.split("/").map((part) => Number(part.trim()));
  return Number.isFinite(width) && Number.isFinite(height) && height > width;
}

function kickerBits(work: WorkItem): string {
  const example = work.example === false ? "" : `<span>示例</span> · `;
  const duration = work.duration ? ` · ${esc(work.duration)}` : "";
  return `${example}${esc(work.category)}${duration} · <time datetime="${esc(work.date)}">${esc(formatDate(work.date))}</time>`;
}

function iconClose(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;
}

function thumb(work: WorkItem, eager = false): string {
  const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<img src="${esc(withBase(work.thumbnail))}" alt="${esc(work.title)}" data-seed="${esc(work.id)}" ${loading} decoding="async">`;
}

function playerMarkup(work: WorkItem, autoplay: boolean, cover: boolean): string {
  const yt = youtubeId(work.src);
  if (work.type === "video" && yt) {
    const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
    const coverFit = cover ? " is-cover" : "";
    return `<iframe class="player-frame${coverFit}" src="${esc(src)}" title="${esc(work.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }
  if (work.type === "video" && isDirectVideo(work.src)) {
    const coverFit = cover && !work.ratio ? " is-cover" : "";
    return `<video class="player-frame${coverFit}" controls playsinline ${autoplay ? "autoplay" : ""} poster="${esc(withBase(work.thumbnail))}" src="${esc(withBase(work.src))}"></video>`;
  }
  if (work.type === "video") {
    return `<div class="player-fallback"><p>这条链接暂时不能内嵌播放。</p><p><a href="${esc(work.src)}" target="_blank" rel="noopener noreferrer">在新窗口打开</a></p></div>`;
  }
  return `<img src="${esc(withBase(work.src))}" alt="${esc(work.title)}" data-seed="${esc(work.id)}">`;
}

function filters(): { id: string; label: string }[] {
  const categories: string[] = [];
  for (const work of works) {
    if (!categories.includes(work.category)) categories.push(work.category);
  }
  return [
    { id: "all", label: "全部" },
    { id: "type:image", label: "图片" },
    { id: "type:video", label: "视频" },
    ...categories.map((category) => ({ id: `cat:${category}`, label: category })),
  ];
}

function matches(work: WorkItem, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "type:image") return work.type === "image";
  if (filter === "type:video") return work.type === "video";
  if (filter.startsWith("cat:")) return work.category === filter.slice(4);
  return true;
}

function cardHtml(work: WorkItem, index: number): string {
  const span = work.span ?? SPANS[index % SPANS.length];
  const line = metricLine(work.metrics);
  const ratio = work.ratio ? ` has-ratio" style="--ar: ${esc(work.ratio)}` : "";
  const play =
    work.type === "video"
      ? `<button type="button" class="play-btn" data-play="${esc(work.id)}" aria-label="在卡片中播放「${esc(work.title)}」">${iconPlay()}<span>播放</span></button>`
      : "";
  return `<article class="card" data-span="${span}" style="--i:${index}">
    <div class="card-media ${esc(work.frame)}${ratio}">
      <div class="media-slot" data-inline-for="${esc(work.id)}">${thumb(work)}</div>
      ${play}
      <button type="button" class="open-media" data-open="${esc(work.id)}" aria-label="查看「${esc(work.title)}」"></button>
    </div>
    <button type="button" class="card-copy" data-open="${esc(work.id)}">
      <p class="kicker">${kickerBits(work)}</p>
      <h3>${esc(work.title)}</h3>
      ${line ? `<p class="card-metrics">${esc(line)}</p>` : ""}
    </button>
  </article>`;
}

function reelHtml(): string {
  const films = reel.films
    .map(
      (film, index) => `<article class="reel-item" style="--i:${index}">
        <div class="reel-stage" style="--ar: ${esc(film.ratio)}">
          <img class="reel-poster" alt="" src="${esc(withBase(film.poster))}">
          <video muted loop playsinline preload="none" poster="${esc(withBase(film.poster))}" src="${esc(withBase(film.src))}"></video>
          <button type="button" class="reel-hit" data-open="${esc(film.id)}" aria-label="有声播放「${esc(film.titleZh)}」">${iconPlayMark()}</button>
        </div>
        <button type="button" class="reel-copy" data-open="${esc(film.id)}">
          <p class="reel-no">${esc(film.issue)}</p>
          <h3 lang="ja">${esc(film.titleJa)}</h3>
          <p class="reel-zh">${esc(film.titleZh)}</p>
          <p class="reel-kicker">${esc(film.category)} · ${esc(film.duration)}</p>
        </button>
      </article>`,
    )
    .join("");
  const count = reel.films.length;
  const stageHeight =
    count <= 3 ? "clamp(340px, 42vw, 480px)" : count === 4 ? "clamp(240px, 26vw, 340px)" : "clamp(220px, 24vw, 320px)";
  return `<section class="section reel reveal" id="featured" aria-label="最近の作品">
    <div class="wrap">
      <div class="sec-head">
        <div class="sec-label"><span class="sec-no">02</span><span class="sec-en" lang="en">Featured Works</span></div>
        <h2 lang="ja">${esc(reel.title)}</h2>
        <p class="lede">${esc(reel.lede)}</p>
        <p class="reel-note"><span class="reel-note-swipe">左右滑动 · </span>静音预览 · 点开有声</p>
      </div>
    </div>
    <div class="reel-scroll">
      <div class="reel-row" style="--reel-h: ${stageHeight}">${films}</div>
    </div>
    <div class="wrap">${aiNoteHtml()}</div>
  </section>`;
}

function aiNoteHtml(): string {
  return `<p class="ai-note"><span>作品均由 AI 生成或辅助创作</span><span lang="ja">作品はすべてAIによる生成、またはAIを活用して制作しています。</span></p>`;
}

function seriesHtml(): string {
  const max = Math.max(...impressionSeries.points.map((point) => point.value), 1);
  const bars = impressionSeries.points
    .map((point, index) => {
      const height = Math.max(8, Math.round((point.value / max) * 100));
      const last = index === impressionSeries.points.length - 1 ? " is-last" : "";
      return `<div class="vcol">
        <span class="vval">${esc(String(point.value))}</span>
        <div class="vtrack"><div class="vbar${last}" style="--h:${height}%;--i:${index}"></div></div>
        <span class="vlab">${esc(point.label)}</span>
      </div>`;
    })
    .join("");
  const rows = impressionSeries.points
    .map((point) => `<tr><td>${esc(point.label)}</td><td>${esc(String(point.value))} ${esc(impressionSeries.unit)}</td></tr>`)
    .join("");
  return `<figure class="chart">
    <figcaption>
      <span class="chart-title">${esc(impressionSeries.title)}</span>
      <span class="chart-note">${esc(impressionSeries.note)}</span>
    </figcaption>
    <div class="vbars" role="img" aria-label="${esc(impressionSeries.title)}">${bars}</div>
    <table class="sr-only"><caption>${esc(impressionSeries.title)}</caption><tbody>${rows}</tbody></table>
  </figure>`;
}

function marketsHtml(): string {
  const max = Math.max(...markets.items.map((item) => item.value), 1);
  const rows = markets.items
    .map((item, index) => {
      const width = Math.max(6, Math.round((item.value / max) * 100));
      return `<div class="hbar" style="--i:${index}">
        <div class="hbar-top"><span>${esc(item.label)}</span><span>${esc(String(item.value))}${esc(markets.suffix)}</span></div>
        <div class="htrack"><div class="hfill" style="--w:${width}%"></div></div>
      </div>`;
    })
    .join("");
  const table = markets.items
    .map((item) => `<tr><td>${esc(item.label)}</td><td>${esc(String(item.value))}${esc(markets.suffix)}</td></tr>`)
    .join("");
  return `<figure class="markets">
    <figcaption>
      <span class="chart-title">${esc(markets.title)}</span>
      <span class="chart-note">${esc(markets.note)}</span>
    </figcaption>
    <div class="hlist">${rows}</div>
    <table class="sr-only"><caption>${esc(markets.title)}</caption><tbody>${table}</tbody></table>
  </figure>`;
}

function featureHtml(): string {
  if (!featured) return "";
  const line = metricLine(featured.metrics);
  return `<section class="feature" aria-label="本月放映">
    <div class="feature-copy">
      <p class="kicker">本月放映 · 示例 · 可内嵌播放</p>
      <h3>${esc(featured.title)}</h3>
      <p>${esc(featured.description)}</p>
      ${line ? `<p class="card-metrics">${esc(line)}</p>` : ""}
      <button type="button" class="text-btn" data-open="${esc(featured.id)}">在弹层中观看</button>
    </div>
    <div class="feature-stage">
      <div class="media-slot" data-inline-for="${esc(featured.id)}">${thumb(featured, true)}</div>
      <button type="button" class="play-btn play-btn-lg" data-play="${esc(featured.id)}" aria-label="在页面中播放「${esc(featured.title)}」">${iconPlay()}<span>播放</span></button>
    </div>
  </section>`;
}

function embedPermalink(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    parsed.searchParams.set("utm_source", "ig_embed");
    parsed.searchParams.set("utm_campaign", "loading");
    return parsed.toString();
  } catch {
    return "";
  }
}

function collabCard(item: CollabReel, index: number): string {
  const permalink = embedPermalink(item.url);
  const badge = item.sample === false ? "" : `<p class="collab-badge">示例 / サンプル</p>`;
  const plays = item.plays?.trim()
    ? `<p class="collab-plays">播放 / plays · ${esc(item.plays.trim())}</p>`
    : "";
  const embed = permalink
    ? `<div class="collab-embed">
        <blockquote class="instagram-media" data-instgrm-permalink="${esc(permalink)}" data-instgrm-version="14">
          <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.collaborator)}</a>
        </blockquote>
      </div>`
    : "";
  const open = permalink
    ? `<a class="collab-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">在 Instagram 打开 / Instagramで開く</a>`
    : "";
  return `<article class="collab-card" style="--i:${index}">
    ${badge}
    ${embed}
    <h3>${esc(item.collaborator)}</h3>
    <p class="collab-role">${esc(item.role)}</p>
    ${plays}
    ${open}
  </article>`;
}

function collabsHtml(): string {
  if (!collabs.items.length) return "";
  const note =
    collabs.noteZh || collabs.noteJa
      ? `<p class="collab-note">${collabs.noteZh ? esc(collabs.noteZh) : ""}${collabs.noteZh && collabs.noteJa ? " / " : ""}${collabs.noteJa ? `<span lang="ja">${esc(collabs.noteJa)}</span>` : ""}</p>`
      : "";
  return `<section class="section collabs reveal" id="collabs" aria-label="合作短视频">
    <div class="wrap">
      <div class="sec-head">
        <div class="sec-label"><span class="sec-no">05</span><span class="sec-en" lang="en">Collaborations</span></div>
        <h2>${esc(collabs.title)}</h2>
        <p class="collab-sub" lang="ja">${esc(collabs.titleJa)}</p>
        ${note}
      </div>
      <div class="collab-grid">${collabs.items.map((item, index) => collabCard(item, index)).join("")}</div>
    </div>
  </section>`;
}

function accountsHtml(): string {
  const cards = accounts.items
    .map(
      (item, index) => `<article class="account-card" style="--i:${index}">
        <p class="account-platform">${esc(item.platform)}</p>
        <h3>${esc(item.handle)}</h3>
        ${item.name ? `<p class="account-name">${esc(item.name)}</p>` : ""}
        <a class="account-link" href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">查看账号 / アカウントを見る</a>
      </article>`,
    )
    .join("");
  return `<section class="section accounts reveal" id="accounts" aria-label="运营过的社媒账号">
    <div class="wrap">
      <div class="sec-head">
        <div class="sec-label"><span class="sec-no">06</span><span class="sec-en" lang="en">Accounts</span></div>
        <h2>${esc(accounts.title)}</h2>
        <p class="account-sub" lang="ja">${esc(accounts.titleJa)}</p>
      </div>
      <div class="account-grid">${cards}</div>
    </div>
  </section>`;
}

function mountInstagramEmbeds(): void {
  if (!document.querySelector(".instagram-media")) return;
  const process = () => {
    window.instgrm?.Embeds.process();
  };
  if (window.instgrm?.Embeds) {
    process();
    return;
  }
  const src = "https://www.instagram.com/embed.js";
  let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (!script) {
    script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.body.appendChild(script);
  }
  script.addEventListener("load", process, { once: true });
}

function pageHtml(): string {
  const lifetimeHtml = lifetime
    .map(
      (item, index) => `<article class="lifetime-card${item.prefix ? " is-sales" : ""}" style="--i:${index}">
        <p class="lifetime-label">${esc(item.label)} <span lang="ja">/ ${esc(item.labelJa)}</span></p>
        <p class="lifetime-value">${item.prefix ? `<span class="yen">${esc(item.prefix)}</span>` : ""}<span class="num" data-count="${item.value}" data-decimals="0">${esc(item.text)}</span>${item.unit ? `<span class="unit">${esc(item.unit)}</span>` : ""}</p>
        <p class="lifetime-note">含所有任职公司 / 全在籍企業の合計</p>
      </article>`,
    )
    .join("");

  const stats = highlights
    .map(
      (item, index) => `<article class="stat" style="--i:${index}">
        <p class="stat-label">${esc(item.label)}</p>
        <p class="stat-value"><span class="num" data-count="${item.value}" data-decimals="${item.decimals}">${esc(formatStat(item.value, item.decimals))}</span><span class="unit">${esc(item.unit)}</span></p>
        <p class="stat-hint">${esc(item.hint)}</p>
      </article>`,
    )
    .join("");

  const facts = about.facts
    .map((fact) => `<div><dt>${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`)
    .join("");

  const links = contact.links
    .map(
      (link) => `<a class="contact-link" href="${esc(link.href)}" ${link.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <span>${esc(link.label)}</span>
        <strong>${esc(link.value)}</strong>
      </a>`,
    )
    .join("");

  const chips = filters()
    .map(
      (filter, index) =>
        `<button type="button" class="filter-btn" role="tab" id="tab-${index}" aria-selected="${filter.id === "all" ? "true" : "false"}" aria-controls="works-grid" data-filter="${esc(filter.id)}">${esc(filter.label)}</button>`,
    )
    .join("");

  return `<div class="intro" id="intro">
    <div class="intro-inner">
      <p class="intro-kicker" lang="en">Portfolio · ${esc(site.issue)}</p>
      <p class="intro-name">${esc(site.name)}</p>
      <p class="intro-en" lang="en">${esc(site.nameEn)}</p>
    </div>
  </div>
  <div class="scroll-progress" aria-hidden="true"></div>
  <p class="edge-mark" lang="en">Portfolio · ${esc(site.issue)}</p>
  <header class="site-header">
    <a class="brand" href="#top">
      <span class="brand-mark" aria-hidden="true">${esc(site.name.slice(0, 1))}</span>
      <span class="brand-name">${esc(site.name)}</span>
    </a>
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="nav-links">目录</button>
    <nav id="nav-links" class="nav-links" aria-label="页内">
      <a href="#featured">近作</a>
      <a href="#figures">数据</a>
      <a href="#works">作品</a>
      ${collabs.items.length ? `<a href="#collabs">合作</a>` : ""}
      <a href="#accounts">账号</a>
      <a href="#about">关于</a>
      <a href="#contact">联络</a>
    </nav>
    <p class="issue-label">${esc(site.issue)}</p>
  </header>
  <main id="content">
    <section class="hero" id="top">
      <div class="hero-left">
        <p class="vert" lang="ja">協業<span lang="en">COLLABORATION</span></p>
        <div class="hero-copy">
          <p class="issue"><span>01</span> ${esc(site.issue)}</p>
          <h1>${esc(site.name)}</h1>
          <p class="hero-en" lang="en">${esc(site.nameEn)}</p>
          ${site.nameJa !== site.name ? `<p class="hero-ja" lang="ja">${esc(site.nameJa)}</p>` : ""}
          <p class="tagline">${esc(site.tagline)}</p>
          <p class="tagline-ja" lang="ja">${esc(site.taglineJa)}</p>
          <p class="role">${esc(site.role)}</p>
        </div>
      </div>
      <figure class="hero-figure">
        <img src="${esc(hero.image)}" alt="${esc(hero.alt)}" data-seed="hero" fetchpriority="high" decoding="async">
        <figcaption><span>Cover · 示例图片</span><span>${esc(site.locationNote)}</span></figcaption>
      </figure>
    </section>

    ${reelHtml()}

    <section class="section figures reveal" id="figures">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-label"><span class="sec-no">03</span><span class="sec-en" lang="en">Figures</span></div>
          <h2>这一季的数字</h2>
          <p class="lede">合作达人、播放、互动、市场和交付视频。下面的数字与图表都是示例，改数据文件就会一起变。</p>
        </div>
        <div class="stat-grid">${stats}</div>
        <div class="lifetime">${lifetimeHtml}</div>
        <div class="chart-layout">
          ${seriesHtml()}
          ${marketsHtml()}
        </div>
        <p class="footnote">示例数据 · 编辑 <code>src/data/content.ts</code></p>
      </div>
    </section>

    <section class="section works reveal" id="works">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-label"><span class="sec-no">04</span><span class="sec-en" lang="en">Selected Works</span></div>
          <h2>作品</h2>
          <p class="lede">图片点开看大图，影片可以在卡片里播放，也可以在弹层里看。分类来自数据文件。</p>
        </div>
        <div class="filters" role="tablist" aria-label="作品分类">${chips}</div>
        <p class="works-count" id="works-count" aria-live="polite"></p>
        ${featureHtml()}
        <div class="works-grid" id="works-grid"></div>
        ${aiNoteHtml()}
      </div>
    </section>

    ${collabsHtml()}

    ${accountsHtml()}

    <section class="section about reveal" id="about">
      <div class="wrap about-grid">
        <div>
          <div class="sec-label"><span class="sec-no">07</span><span class="sec-en" lang="en">Profile</span></div>
          <blockquote>${esc(about.quote)}</blockquote>
          <figure class="about-figure">
            <img src="${esc(about.image)}" alt="${esc(about.imageAlt)}" data-seed="about" loading="lazy" decoding="async">
            <figcaption>示例配图，并非本人肖像</figcaption>
          </figure>
        </div>
        <div class="about-copy">
          <h2>关于</h2>
          ${about.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
          <dl class="facts">${facts}</dl>
        </div>
      </div>
    </section>

    <section class="section contact reveal" id="contact">
      <div class="wrap">
        <div class="sec-label"><span class="sec-no">08</span><span class="sec-en" lang="en">Contact</span></div>
        <h2>${esc(contact.title)}</h2>
        <div class="contact-list">${links}</div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="wrap footer-row">
      <p>© ${esc(site.updated.slice(0, 4))} ${esc(site.name)}</p>
      <p>图片 Unsplash · 短片为 InnAIO 战役成片 · 数据为示例</p>
    </div>
  </footer>
  <dialog class="lightbox" id="lightbox" aria-labelledby="lb-title"></dialog>`;
}

let activeFilter = "all";
let visible: WorkItem[] = works.slice();
let syncReel = (): void => {};

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("找不到 #app");
app.innerHTML = pageHtml();
document.title = `${site.name} ${site.nameEn} · 海外达人合作`;

const grid = document.querySelector<HTMLElement>("#works-grid");
const countEl = document.querySelector<HTMLElement>("#works-count");
const dialog = document.querySelector<HTMLDialogElement>("#lightbox");
if (!grid || !countEl || !dialog) throw new Error("页面结构不完整");

function renderGrid(): void {
  visible = works.filter((work) => matches(work, activeFilter));
  grid!.innerHTML = visible.length
    ? visible.map((work, index) => cardHtml(work, index)).join("")
    : `<p class="empty">这个分类还没有作品。</p>`;
  const label = filters().find((filter) => filter.id === activeFilter)?.label ?? "全部";
  countEl!.textContent = `${label} · ${visible.length} 件`;
}

function resetInline(except?: HTMLElement): void {
  document.querySelectorAll<HTMLElement>("[data-inline-for]").forEach((slot) => {
    if (slot === except) return;
    const id = slot.dataset.inlineFor;
    if (!id || !slot.querySelector("video, iframe")) return;
    const work = works.find((item) => item.id === id);
    if (!work) return;
    slot.innerHTML = thumb(work, id === featured?.id);
    slot.closest(".card-media, .feature-stage")?.classList.remove("is-playing");
  });
}

function playInline(id: string, origin: HTMLElement): void {
  const work = works.find((item) => item.id === id);
  if (!work) return;
  const scope = origin.closest(".card, .feature") ?? document;
  const slot = scope.querySelector<HTMLElement>(`[data-inline-for="${CSS.escape(id)}"]`);
  if (!slot) return;
  resetInline(slot);
  document.querySelectorAll("video").forEach((video) => video.pause());
  slot.innerHTML = playerMarkup(work, true, !work.ratio);
  slot.closest(".card-media, .feature-stage")?.classList.add("is-playing");
  const video = slot.querySelector("video");
  if (video) {
    video.muted = true;
    void video.play().catch(() => undefined);
  }
  syncReel();
}

function cycleOf(id: string): WorkItem[] {
  return visible.some((work) => work.id === id) ? visible : works;
}

function lightboxHtml(work: WorkItem): string {
  const list = cycleOf(work.id);
  const index = Math.max(0, list.findIndex((item) => item.id === work.id));
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const entries = metricEntries(work.metrics);
  const metrics = entries.length
    ? `<dl class="lb-metrics">${entries.map((entry) => `<div><dt>${esc(entry.label)}</dt><dd>${esc(entry.value)}</dd></div>`).join("")}</dl>`
    : `<p class="lb-nometrics">这条作品没有附带数据。</p>`;
  const nav =
    list.length > 1
      ? `<div class="lb-nav">
          <button type="button" data-goto="${esc(prev.id)}">上一件</button>
          <span>${index + 1} / ${list.length}</span>
          <button type="button" data-goto="${esc(next.id)}">下一件</button>
        </div>`
      : "";
  const tall = work.type === "video" && isTall(work);
  const mediaStyle = work.ratio ? ` style="--ar: ${esc(work.ratio)}"` : "";
  const ja = work.titleJa ? `<p class="lb-ja" lang="ja">${esc(work.titleJa)}</p>` : "";
  const metricsBlock = entries.length
    ? metrics
    : work.example === false
      ? ""
      : `<p class="lb-nometrics">这条作品没有附带数据。</p>`;
  return `<div class="lb-layout">
    <div class="lb-media${tall ? " is-tall" : ""}"${mediaStyle}>${playerMarkup(work, work.type === "video", false)}</div>
    <div class="lb-copy">
      <button type="button" class="lb-close" data-close aria-label="关闭">${iconClose()}</button>
      <p class="kicker">${kickerBits(work)}</p>
      <h2 id="lb-title">${esc(work.title)}</h2>
      ${ja}
      <p>${esc(work.description)}</p>
      ${metricsBlock}
      <div class="lb-actions">
        <button type="button" class="text-btn" data-copy>复制链接</button>
        <span id="copy-status" role="status"></span>
      </div>
      ${nav}
      <p class="lb-keys">← → 切换 · Esc 关闭</p>
    </div>
  </div>`;
}

function setWorkParam(id: string | null): void {
  const url = new URL(location.href);
  if (id) url.searchParams.set("work", id);
  else url.searchParams.delete("work");
  history.replaceState(null, "", url);
}

function openWork(id: string): void {
  const work = works.find((item) => item.id === id);
  if (!work) return;
  resetInline();
  document.querySelectorAll("video").forEach((video) => video.pause());
  dialog!.classList.remove("is-closing");
  dialog!.innerHTML = lightboxHtml(work);
  if (!dialog!.open) dialog!.showModal();
  document.body.classList.add("lock");
  setWorkParam(id);
  const video = dialog!.querySelector("video");
  if (video) {
    video.muted = false;
    void video.play().catch(() => undefined);
  }
  syncReel();
  dialog!.querySelector<HTMLElement>(".lb-close")?.focus();
}

function closeWork(): void {
  if (!dialog!.open) return;
  if (reduceMotion || dialog!.classList.contains("is-closing")) {
    dialog!.classList.remove("is-closing");
    dialog!.close();
    return;
  }
  dialog!.classList.add("is-closing");
  const finish = (event?: Event) => {
    if (event && event.target !== dialog) return;
    dialog!.removeEventListener("transitionend", finish);
    dialog!.classList.remove("is-closing");
    if (dialog!.open) dialog!.close();
  };
  dialog!.addEventListener("transitionend", finish);
  window.setTimeout(finish, 480);
}

dialog.addEventListener("close", () => {
  dialog.innerHTML = "";
  document.body.classList.remove("lock");
  setWorkParam(null);
  syncReel();
});

dialog.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target === dialog) {
    closeWork();
    return;
  }
  if (target.closest("[data-close]")) {
    closeWork();
    return;
  }
  const goto = target.closest<HTMLElement>("[data-goto]");
  if (goto?.dataset.goto) openWork(goto.dataset.goto);
  if (target.closest("[data-copy]")) {
    const status = dialog.querySelector<HTMLElement>("#copy-status");
    const url = location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        if (status) status.textContent = "链接已复制";
      })
      .catch(() => {
        if (status) status.textContent = url;
      });
  }
});

dialog.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  if (event.target instanceof HTMLVideoElement || event.target instanceof HTMLInputElement) return;
  const title = dialog.querySelector("#lb-title");
  const current = works.find((work) => work.title === title?.textContent);
  if (!current) return;
  const list = cycleOf(current.id);
  if (list.length < 2) return;
  const index = list.findIndex((work) => work.id === current.id);
  const step = event.key === "ArrowRight" ? 1 : -1;
  const next = list[(index + step + list.length) % list.length];
  event.preventDefault();
  openWork(next.id);
});

document.querySelector(".filters")?.addEventListener("click", (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter ?? "all";
  document.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((item) => {
    item.setAttribute("aria-selected", item === button ? "true" : "false");
  });
  renderGrid();
});

document.querySelector(".filters")?.addEventListener("keydown", (event) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const tabs = [...document.querySelectorAll<HTMLButtonElement>(".filter-btn")];
  const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  if (current < 0) return;
  event.preventDefault();
  const step = event.key === "ArrowRight" ? 1 : -1;
  const next = tabs[(current + step + tabs.length) % tabs.length];
  next.click();
  next.focus();
});

app.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const play = target.closest<HTMLElement>("[data-play]");
  if (play?.dataset.play) {
    playInline(play.dataset.play, play);
    return;
  }
  const open = target.closest<HTMLElement>("[data-open]");
  if (open?.dataset.open && !dialog.open) openWork(open.dataset.open);
});

const menuBtn = document.querySelector<HTMLButtonElement>(".menu-btn");
const nav = document.querySelector<HTMLElement>("#nav-links");
menuBtn?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open") ?? false;
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.textContent = open ? "关闭" : "目录";
  document.body.classList.toggle("lock", open);
});
nav?.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;
  nav.classList.remove("is-open");
  menuBtn?.setAttribute("aria-expanded", "false");
  if (menuBtn) menuBtn.textContent = "目录";
  document.body.classList.remove("lock");
});

const header = document.querySelector(".site-header");
const progress = document.querySelector<HTMLElement>(".scroll-progress");
const heroImg = document.querySelector<HTMLImageElement>(".hero-figure img");
const navAnchors = [...document.querySelectorAll<HTMLAnchorElement>(".nav-links a")];

function splitHeading(el: HTMLElement): void {
  if (el.dataset.split === "1") return;
  const text = el.textContent ?? "";
  if (!text.trim()) return;
  el.dataset.split = "1";
  el.setAttribute("aria-label", text);
  el.replaceChildren(
    ...[...text].map((char, index) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", String(index));
      span.setAttribute("aria-hidden", "true");
      span.textContent = char === " " ? "\u00a0" : char;
      return span;
    }),
  );
}

document.querySelectorAll<HTMLElement>("h1, .sec-head h2, blockquote:not(.instagram-media)").forEach(splitHeading);

let scrollQueued = false;
function paintScroll(): void {
  scrollQueued = false;
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  if (heroImg?.dataset.parallax === "1") {
    const shift = Math.min(y, 720) * 0.08;
    heroImg.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(1.06)`;
  }
  const mark = y + 96;
  let current = navAnchors[0];
  for (const link of navAnchors) {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section) continue;
    if (section.offsetTop <= mark) current = link;
  }
  for (const link of navAnchors) link.classList.toggle("is-current", link === current);
}

function queueScroll(): void {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(paintScroll);
}

window.addEventListener("scroll", queueScroll, { passive: true });

function animateCount(el: HTMLElement): void {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals ?? "0");
  if (!Number.isFinite(target)) return;
  const start = performance.now();
  const duration = 900;
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = formatStat(target * eased, decimals);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = formatStat(target, decimals);
  };
  requestAnimationFrame(tick);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const intro = document.querySelector<HTMLElement>("#intro");

if (reduceMotion) {
  intro?.remove();
  document.documentElement.classList.add("is-ready");
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
} else {
  document.documentElement.classList.add("is-ready");
  window.setTimeout(() => intro?.remove(), 1600);
  if (finePointer && window.matchMedia("(min-width: 900px)").matches && heroImg) {
    heroImg.dataset.parallax = "1";
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
        entry.target.querySelectorAll<HTMLElement>("[data-count]").forEach(animateCount);
      }
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>(".card").forEach((card) => {
    if (!card.querySelector("[data-play]")) return;
    const media = card.querySelector<HTMLElement>(".card-media");
    if (!media) return;
    const label = document.createElement("span");
    label.className = "follow-play";
    label.textContent = "播放";
    label.setAttribute("aria-hidden", "true");
    media.appendChild(label);
    media.addEventListener("pointermove", (event) => {
      const rect = media.getBoundingClientRect();
      label.style.transform = `translate3d(${event.clientX - rect.left}px, ${event.clientY - rect.top}px, 0)`;
    });
  });
}

paintScroll();

document.addEventListener(
  "error",
  (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.fallback === "1") return;
    target.dataset.fallback = "1";
    const seed = target.dataset.seed || "portfolio";
    target.src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/1500`;
  },
  true,
);

function bindReel(reduce: boolean): void {
  const stages = [...document.querySelectorAll<HTMLElement>(".reel-stage")];
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const sync = (stage: HTMLElement) => {
    const video = stage.querySelector("video");
    if (!video) return;
    const blocked = reduce || dialog!.open || Boolean(document.querySelector(".is-playing"));
    const want = !blocked && (stage.dataset.hover === "1" || stage.dataset.inview === "1");
    if (want) {
      video.muted = true;
      void video.play().catch(() => undefined);
      stage.classList.add("is-previewing");
    } else {
      video.pause();
      stage.classList.remove("is-previewing");
    }
  };

  syncReel = () => stages.forEach(sync);

  if (reduce) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const stage = entry.target as HTMLElement;
        stage.dataset.inview = entry.isIntersecting && entry.intersectionRatio >= 0.55 ? "1" : "0";
        sync(stage);
      }
    },
    { threshold: [0, 0.55, 0.8] },
  );
  for (const stage of stages) {
    io.observe(stage);
    if (!fine) continue;
    stage.addEventListener("pointerenter", () => {
      stage.dataset.hover = "1";
      sync(stage);
    });
    stage.addEventListener("pointerleave", () => {
      stage.dataset.hover = "0";
      sync(stage);
    });
  }
}

renderGrid();
bindReel(reduceMotion);
mountInstagramEmbeds();

const initial = new URL(location.href).searchParams.get("work");
if (initial && works.some((work) => work.id === initial)) openWork(initial);

window.addEventListener("popstate", () => {
  const id = new URL(location.href).searchParams.get("work");
  if (id && works.some((work) => work.id === id)) openWork(id);
  else if (dialog.open) dialog.close();
});
