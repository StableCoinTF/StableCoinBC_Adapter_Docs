const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const spec = yaml.load(fs.readFileSync('asyncapi.yaml', 'utf8'));
const channelsRaw = yaml.load(fs.readFileSync('channels.yaml', 'utf8'));

// Resolve $ref in channels
for (const [key, val] of Object.entries(spec.channels)) {
  if (val.$ref) {
    const [file, pointer] = val.$ref.split('#/');
    spec.channels[key] = channelsRaw[pointer];
  }
}

const channels = spec.channels;
const operations = spec.operations;
const schemas = spec.components?.schemas || {};

// ── Helpers ──

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function resolveRef(obj) {
  if (!obj || !obj.$ref) return obj;
  const ref = obj.$ref.includes('#') ? obj.$ref.split('#')[1] : obj.$ref;
  const p = ref.replace(/^\//, '').split('/');
  let cur = spec;
  for (const k of p) cur = cur[k];
  return cur;
}

function resolveType(prop) {
  if (prop.$ref) {
    const resolved = resolveRef(prop);
    return { typeName: resolved.title || 'enum', desc: resolved.description, enumVals: resolved.enum };
  }
  if (prop.type === 'array' && prop.items) {
    return { typeName: 'array<object>', items: prop.items };
  }
  return { typeName: prop.type || 'string' };
}

function renderProps(properties, required = []) {
  if (!properties) return '';
  let rows = '';
  for (const [name, prop] of Object.entries(properties)) {
    const isReq = required.includes(name);
    const resolved = resolveType(prop);
    let typeStr = resolved.typeName;
    if (resolved.enumVals) typeStr = resolved.enumVals.map(v => `<code>${esc(v)}</code>`).join(' | ');
    const nullable = prop.nullable ? '<span class="tag nullable">nullable</span>' : '';
    const reqBadge = isReq ? '<span class="tag required">required</span>' : '';
    const desc = resolved.desc || prop.description || '';
    const example = prop.examples ? `<code>${esc(String(prop.examples[0]))}</code>` : '';

    rows += `<tr>
      <td><code>${esc(name)}</code></td>
      <td>${typeStr} ${nullable}</td>
      <td>${reqBadge}</td>
      <td>${esc(desc)}</td>
      <td>${example}</td>
    </tr>`;

    if (resolved.items?.properties) {
      for (const [sn, sp] of Object.entries(resolved.items.properties)) {
        const sReq = (resolved.items.required || []).includes(sn);
        const sDesc = sp.description || '';
        const sEx = sp.examples ? `<code>${esc(String(sp.examples[0]))}</code>` : '';
        rows += `<tr class="nested">
          <td><code>&nbsp;&nbsp;${esc(sn)}</code></td>
          <td>${sp.type || 'string'}</td>
          <td>${sReq ? '<span class="tag required">required</span>' : ''}</td>
          <td>${esc(sDesc)}</td>
          <td>${sEx}</td>
        </tr>`;
      }
    }
  }
  return rows;
}

function renderExamples(examples) {
  if (!examples || !examples.length) return '';
  const items = examples.map(ex => {
    const json = JSON.stringify(ex.payload, null, 2);
    const highlighted = json
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="str">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="num">$1</span>')
      .replace(/: (null|true|false)/g, ': <span class="lit">$1</span>');
    return `<div class="example-block">
      <div class="example-title">${esc(ex.name)}</div>
      <pre class="code-block">${highlighted}</pre>
    </div>`;
  }).join('\n');
  return `<details class="examples-toggle">
    <summary>예시 보기 (${examples.length}건)</summary>
    ${items}
  </details>`;
}

// ── Build Sections (auto from yaml) ──

// receive operation → reply channel의 그룹 매핑
const replyGroupMap = {};
for (const [opId, op] of Object.entries(operations)) {
  if (op.action === 'receive' && op.reply?.channel) {
    const reqRef = op.channel.$ref.replace('#/channels/', '');
    const repRef = op.reply.channel.$ref.replace('#/channels/', '');
    const reqChannel = channels[reqRef];
    if (reqChannel['x-group']) replyGroupMap[repRef] = reqChannel['x-group'];
  }
}

const sections = [];

for (const [opId, op] of Object.entries(operations)) {
  const channelRef = op.channel.$ref.replace('#/channels/', '');
  const channel = channels[channelRef];

  const group = channel['x-group'] || replyGroupMap[channelRef];
  if (!group) continue;

  const msgKey = Object.keys(channel.messages)[0];
  const msg = channel.messages[msgKey];
  const payload = msg.payload;
  const action = op.action;
  const id = opId;

  sections.push({ id, action, group, op, channel, msg, payload });
}

// ── Sidebar Groups (auto from x-group) ──

const navGroups = [];
const groupMap = new Map();
for (const sec of sections) {
  if (!groupMap.has(sec.group)) {
    groupMap.set(sec.group, []);
    navGroups.push({ title: sec.group, items: groupMap.get(sec.group) });
  }
  groupMap.get(sec.group).push(sec.id);
}

// ── Schemas ──

const schemaDescMap = {};
for (const [name, schema] of Object.entries(schemas)) {
  const lines = (schema.description || '').trim().split('\n').filter(l => l.trim().startsWith('- '));
  schemaDescMap[name] = { title: schema.title, description: schema.description, enumVals: schema.enum || [], rows: lines.map(l => {
    const m = l.trim().match(/^-\s*(\S+):\s*(.+)$/);
    return m ? { val: m[1], desc: m[2] } : { val: l.trim().replace(/^-\s*/, ''), desc: '' };
  })};
}

// ── Generate HTML ──

function buildSidebar() {
  let html = `<div class="nav-section-title" onclick="this.classList.toggle('collapsed');this.nextElementSibling.classList.toggle('section-collapsed')"><span class="nav-section-arrow">▾</span> Kafka Message Spec</div>
  <div class="nav-section-body">`;
  for (const g of navGroups) {
    html += `<div class="nav-group collapsed">
      <div class="nav-group-title" onclick="this.parentElement.classList.toggle('collapsed')"><span class="nav-arrow">▾</span> ${esc(g.title)}</div>
      <div class="nav-group-items">`;
    for (const id of g.items) {
      const sec = sections.find(s => s.id === id);
      if (!sec) continue;
      const badge = sec.action === 'send' ? '<span class="badge send">SEND</span>' : '<span class="badge receive">RECEIVE</span>';
      html += `<a href="#${esc(id)}" class="nav-link">${badge} ${esc(sec.channel.title)}</a>`;
    }
    html += '</div></div>';
  }
  const schemaLinks = Object.keys(schemaDescMap).map(name =>
    `<a href="#${esc(name)}" class="nav-link">📌 ${esc(name)}</a>`
  ).join('\n');
  html += `<div class="nav-group collapsed">
    <div class="nav-group-title" onclick="this.parentElement.classList.toggle('collapsed')"><span class="nav-arrow">▾</span> 공통 스키마</div>
    <div class="nav-group-items">
      ${schemaLinks}
    </div>
  </div>`;
  html += '</div>';
  return html;
}

function buildSection(sec) {
  const { id, action, channel, msg, payload } = sec;
  const direction = channel.description || '';
  const titleBadge = action === 'send' ? '<span class="badge-lg send">SEND</span>' : '<span class="badge-lg receive">RECEIVE</span>';

  let html = `<section class="section" id="${esc(id)}">
  <div class="sec-row">
    <div class="sec-left">
      <h2 class="section-title">${titleBadge} ${esc(channel.title)}</h2>
      <p class="section-desc">${esc(direction)}</p>
      <div class="topic-info">
        <div class="topic-row"><span class="topic-label">토픽</span><code class="topic-value">${esc(channel.address)}</code></div>
      </div>
    </div>
    <div class="sec-right"></div>
  </div>

  <div class="sec-row">
    <div class="sec-left">
      <h3>메시지 스키마 — ${esc(msg.title)}</h3>
      <div class="table-wrap"><table>
        <colgroup><col class="col-field"><col class="col-type"><col class="col-req"><col class="col-desc"><col class="col-ex"></colgroup>
        <thead><tr><th>필드</th><th>타입</th><th>필수</th><th>설명</th><th>예시</th></tr></thead>
        <tbody>${renderProps(payload.properties, payload.required)}</tbody>
      </table></div>
    </div>
    <div class="sec-right">${renderExamples(msg.examples)}</div>
  </div>
  </section>`;
  return html;
}

function buildSchemas() {
  let html = '';
  for (const [name, info] of Object.entries(schemaDescMap)) {
    const rows = info.rows.map(r => `<tr><td><code>${esc(r.val)}</code></td><td>${esc(r.desc)}</td></tr>`).join('\n');
    html += `<section class="section" id="${esc(name)}">
      <div class="sec-row">
        <div class="sec-left">
          <h2 class="section-title">${esc(name)}</h2>
          <p class="section-desc">${esc(info.title || '')}</p>
          <div class="table-wrap"><table>
            <thead><tr><th>값</th><th>의미</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
        </div>
        <div class="sec-right"></div>
      </div>
    </section>`;
  }
  return html;
}

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(spec.info.title)} — 메시지 스펙 문서</title>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap">
<style>
:root{--primary:#2563eb;--primary-light:#dbeafe;--primary-dark:#1e40af;--success:#16a34a;--success-light:#dcfce7;--warning:#d97706;--warning-light:#fef3c7;--danger:#dc2626;--danger-light:#fee2e2;--info:#7c3aed;--info-light:#ede9fe;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-200:#e5e7eb;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-700:#374151;--gray-800:#1f2937;--gray-900:#111827;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06)}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:80px}
body{font-family:'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--gray-50);color:var(--gray-800);line-height:1.7;font-size:15px}

.header{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--gray-200);padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between}
.header h1{font-size:18px;font-weight:700;color:var(--gray-900)}
.header h1 span{color:var(--primary)}
.header-meta{font-size:12px;color:var(--gray-500)}

.layout{display:flex;margin-top:64px;min-height:calc(100vh - 64px)}

.sidebar{position:fixed;top:64px;left:0;bottom:0;width:280px;background:#fff;border-right:1px solid var(--gray-200);overflow-y:auto;padding:20px 0;z-index:50}
.sidebar::-webkit-scrollbar{width:4px}
.sidebar::-webkit-scrollbar-thumb{background:var(--gray-300);border-radius:4px}
.nav-section-title{padding:10px 20px;font-size:13px;font-weight:800;color:var(--gray-900);cursor:pointer;user-select:none;display:flex;align-items:center;gap:6px;letter-spacing:.02em}
.nav-section-title:hover{color:var(--primary)}
.nav-section-arrow{font-size:11px;transition:transform .2s;display:inline-block}
.nav-section-body{padding-left:12px;border-left:2px solid var(--gray-200);margin-left:20px;overflow:hidden;max-height:2000px;transition:max-height .3s ease}
.nav-section-body.section-collapsed{max-height:0}
.nav-section-title.collapsed .nav-section-arrow{transform:rotate(-90deg)}
.nav-group{margin-bottom:4px}
.nav-group-title{padding:8px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-500);cursor:pointer;user-select:none;display:flex;align-items:center;gap:4px;transition:color .15s}
.nav-group-title:hover{color:var(--primary)}
.nav-arrow{font-size:10px;transition:transform .2s;display:inline-block}
.nav-group.collapsed .nav-arrow{transform:rotate(-90deg)}
.nav-group-items{overflow:hidden;max-height:500px;transition:max-height .25s ease}
.nav-group.collapsed .nav-group-items{max-height:0}
.nav-link{display:block;padding:7px 20px 7px 28px;color:var(--gray-700);text-decoration:none;font-size:13.5px;border-left:3px solid transparent;transition:all .15s}
.nav-link:hover{background:var(--gray-100);color:var(--primary)}
.nav-link.active{border-left-color:var(--primary);background:var(--primary-light);color:var(--primary-dark);font-weight:600}

.main{margin-left:280px;padding:32px 0 80px}

.section{margin-bottom:48px}
.sec-row{display:flex}
.sec-left{flex:0 1 960px;min-width:0;padding:0 40px}
.sec-right{width:580px;flex-shrink:0;padding:8px 20px}
.sec-right:empty{display:none}

.section-title{font-size:24px;font-weight:800;color:var(--gray-900);margin-bottom:8px;padding-bottom:12px;border-bottom:3px solid var(--primary);display:flex;align-items:center;gap:10px}

.badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;letter-spacing:.03em;flex-shrink:0}
.badge.receive{background:#ede9fe;color:#6d28d9}
.badge.send{background:#dcfce7;color:#15803d}

.badge-lg{font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:.04em}
.badge-lg.receive{background:#ede9fe;color:#6d28d9}
.badge-lg.send{background:#dcfce7;color:#15803d}
.section-desc{color:var(--gray-500);margin-bottom:20px;font-size:14px;white-space:pre-line}

h3{font-size:17px;font-weight:700;color:var(--gray-900);margin:24px 0 12px;display:flex;align-items:center;gap:8px}

.topic-info{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius);padding:16px 20px;margin-bottom:20px;box-shadow:var(--shadow)}
.topic-row{display:flex;align-items:center;gap:12px;padding:4px 0}
.topic-label{font-size:12px;font-weight:700;color:var(--gray-500);min-width:80px;text-transform:uppercase;letter-spacing:.04em}
.topic-value{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--primary-dark);background:var(--primary-light);padding:2px 10px;border-radius:6px}
.no-reply{font-family:inherit;background:var(--gray-100);color:var(--gray-500);font-size:13px;padding:2px 10px;border-radius:6px}

.sec-right .examples-toggle{background:transparent;border-radius:var(--radius);padding:0;border:none}
.sec-right .examples-toggle summary{background:var(--primary-light);color:var(--primary-dark);border-radius:6px}
.sec-right .examples-toggle summary:hover{background:#bfdbfe}
.sec-right .examples-toggle[open] summary{border-radius:6px 6px 0 0}
.sec-right .examples-toggle summary::before{color:var(--primary)}
.sec-right .example-title{color:var(--gray-500)}
.sec-right .code-block{border-color:var(--gray-700);background:var(--gray-900)}

.table-wrap{overflow-x:auto;margin:12px 0 16px;border-radius:var(--radius);border:1px solid var(--gray-200)}
table{width:100%;border-collapse:collapse;font-size:13.5px;table-layout:fixed}
colgroup .col-field{width:18%}colgroup .col-type{width:14%}colgroup .col-req{width:8%}colgroup .col-desc{width:40%}colgroup .col-ex{width:20%}
th{background:var(--gray-100);padding:10px 14px;text-align:left;font-weight:700;color:var(--gray-700);font-size:12px;text-transform:uppercase;letter-spacing:.04em;border-bottom:2px solid var(--gray-200)}
td{padding:10px 14px;border-bottom:1px solid var(--gray-100)}
tr:hover td{background:var(--gray-50)}
tr.nested td{color:var(--gray-500)}
td code,th code{background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:12px;color:var(--primary-dark);font-family:'JetBrains Mono',monospace}

.tag{display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;margin-left:4px}
.tag.required{background:var(--danger-light);color:var(--danger)}
.tag.nullable{background:var(--warning-light);color:var(--warning)}

.examples-toggle{margin:12px 0}
.examples-toggle summary{font-size:13px;font-weight:600;color:var(--primary);cursor:pointer;padding:8px 14px;background:var(--primary-light);border-radius:8px;list-style:none;display:flex;align-items:center;gap:6px;transition:background .15s}
.examples-toggle summary::-webkit-details-marker{display:none}
.examples-toggle summary::before{content:'▶';font-size:10px;transition:transform .2s;display:inline-block}
.examples-toggle[open] summary::before{transform:rotate(90deg)}
.examples-toggle summary:hover{background:#bfdbfe}
.examples-toggle[open] summary{margin-bottom:8px;border-radius:8px 8px 0 0}
.example-block{margin:8px 0}
.example-title{font-size:12px;font-weight:600;color:var(--gray-500);margin-bottom:4px;text-transform:uppercase;letter-spacing:.03em}
.code-block{background:var(--gray-900);color:#e2e8f0;border-radius:8px;padding:16px 20px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:12.5px;line-height:1.6;overflow-x:auto;border:1px solid var(--gray-700)}
.code-block .key{color:#93c5fd}
.code-block .str{color:#86efac}
.code-block .num{color:#fbbf24}
.code-block .lit{color:#c084fc}

.back-top{position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:var(--primary);color:#fff;border:none;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;z-index:100}
.back-top.show{opacity:1}
.back-top:hover{background:var(--primary-dark)}

@media(max-width:1400px){.main::after{display:none}.sec-row{flex-direction:column}.sec-right{width:auto;background:#0f172a;border-radius:8px;margin:8px 40px;padding:12px 16px}}
@media(max-width:900px){.sidebar{display:none}.main{margin-left:0;padding:32px 0 80px}.sec-left{padding:0 16px}.sec-right{margin:8px 16px}}
</style>
</head>
<body>

<header class="header">
  <h1>🔗 <span>StableCoin BC</span> Adapter 메시지 스펙</h1>
  <span class="header-meta">AsyncAPI ${esc(spec.info.version)} · ${new Date().toISOString().slice(0,10)}</span>
</header>

<div class="layout">
<nav class="sidebar" id="sidebar">
${buildSidebar()}
</nav>

<main class="main">
${sections.map(buildSection).join('\n')}
${buildSchemas()}
</main>
</div>

<button class="back-top" id="backTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>

<script>
// Active nav
var links=document.querySelectorAll('.nav-link'),secs=[];
links.forEach(function(l){var id=l.getAttribute('href').substring(1),el=document.getElementById(id);if(el)secs.push({l:l,el:el})});
window.addEventListener('scroll',function(){var y=window.scrollY+120,a=null;
for(var i=secs.length-1;i>=0;i--)if(secs[i].el.offsetTop<=y){a=secs[i];break}
links.forEach(function(l){l.classList.remove('active')});if(a)a.l.classList.add('active');
document.getElementById('backTop').classList.toggle('show',window.scrollY>300)});
</script>
</body>
</html>`;

const outDir = path.join(__dirname, 'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Generated docs/index.html');
