/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · สร้าง figma-variables.md จาก tokens.json
   ───────────────────────────────────────────────────────────────────────────
   figma-variables.md เป็นไฟล์ที่ "สร้างขึ้น" ไม่ใช่ไฟล์ที่เขียนมือ
   ห้ามแก้ไฟล์นั้นตรง ๆ — แก้ tokens.json แล้วรัน:

       node 02-tokens/gen-figma.js

   เหตุผล: ตารางที่พิมพ์มือจะไม่ตรงกับ tokens.json ตั้งแต่การแก้ครั้งที่สาม
   ═══════════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const T = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json'), 'utf8'));

const isTok = (o) => o && typeof o === 'object' && '$value' in o;
const get = (p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), T);

/* แปลง rem → px เพราะ Figma ทำงานเป็น px เท่านั้น */
const toPx = (v) => {
  if (typeof v !== 'string') return v;
  /* หมายเหตุ: ห้ามใส่ .replace(/\.?0+$/,'') ต่อท้าย — จะกิน 0 ท้ายของจำนวนเต็มด้วย
     ทำให้ 20 กลายเป็น 2 และ 40 กลายเป็น 4 (เจอจริงตอนตรวจ output ครั้งแรก)
     unary + บนผลของ toFixed จัดการทศนิยมส่วนเกินให้อยู่แล้ว */
  let m = v.match(/^(-?[\d.]+)rem$/);      if (m) return String(+(parseFloat(m[1]) * 16).toFixed(4));
  m = v.match(/^(-?[\d.]+)px$/);           if (m) return m[1];
  m = v.match(/^(-?[\d.]+)ms$/);           if (m) return m[1];
  if (v === '0') return '0';
  if (v === '9999px') return '9999';
  return v;
};

/* ไล่ reference จนถึงค่าจริง */
const deref = (v, depth = 0) => {
  if (depth > 10) return v;
  if (typeof v !== 'string') return v;
  const m = v.match(/^\{([^}]+)\}$/);
  if (!m) return v;
  const t = get(m[1]);
  return isTok(t) ? deref(t.$value, depth + 1) : v;
};

/* ชื่อ Figma = path หลัง group แรก join ด้วย / โดยตัด segment ชื่อ 'default' */
const figmaName = (prefix, segs) => prefix + '/' + segs.filter(s => s !== 'default').join('/');
/* ชื่อ CSS = -- + prefix + path join ด้วย - โดยตัด 'default' */
const cssName = (prefix, segs) => '--' + prefix + '-' + segs.filter(s => s !== 'default').join('-');

const walk = (node, segs, out) => {
  if (!node || typeof node !== 'object') return;
  if (isTok(node)) { out.push({ segs: [...segs], tok: node }); return; }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...segs, k], out);
};

const esc = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|');

/* ── PRIMITIVE ─────────────────────────────────────────────────────────────── */
let md = `# Figma Variables · SME.GO Design System

> ⚠️ **ไฟล์นี้สร้างจาก \`tokens.json\` ด้วย \`node 02-tokens/gen-figma.js\`**
> ห้ามแก้ไฟล์นี้ตรง ๆ — แก้ \`tokens.json\` แล้วสร้างใหม่ ไม่เช่นนั้นจะไม่ตรงกัน

---

## ข้อจำกัดของ Figma Variables ที่ต้องรู้ก่อนเริ่ม

Figma รองรับ variable เพียง 4 ชนิด: **COLOR · FLOAT · STRING · BOOLEAN**

| สิ่งที่ระบบมี | เก็บเป็น variable ได้ไหม | ทำอย่างไร |
|---|---|---|
| สี | ✅ COLOR | ตามตารางด้านล่าง |
| ระยะ · radius · ขนาด | ✅ FLOAT (หน่วย px) | Figma ไม่รู้จัก rem — ตารางนี้แปลงเป็น px ให้แล้ว (1rem = 16px) |
| duration | ✅ FLOAT (หน่วย ms) | |
| font family · weight | ✅ STRING / FLOAT | |
| **easing (cubic-bezier)** | ❌ **ไม่ได้** | ต้องตั้งใน prototype interaction ทีละอัน — ดูตารางท้ายไฟล์ |
| **เงา** | ❌ **ไม่ได้** | ต้องเป็น **Effect Style** — ดูตารางท้ายไฟล์ |
| **typography** | ❌ **ไม่ได้** | ต้องเป็น **Text Style** — ดูตารางท้ายไฟล์ |

**ค่าที่แสดงเป็น px ทั้งหมด** ยกเว้นที่ระบุไว้เป็นอย่างอื่น

---

## Collection \`1. Primitive\`

**mode เดียว** — ค่าดิบไม่เปลี่ยนตาม theme สิ่งที่เปลี่ยนคือ *บทบาท* ในชั้น 2

| Figma name | ค่า | CSS variable |
|---|---|---|
`;

{
  const out = [];
  walk(T.primitive.color, [], out);
  for (const { segs, tok } of out) {
    md += `| \`${figmaName('color', segs)}\` | \`${esc(toPx(deref(tok.$value)))}\` | \`${cssName('sme', segs)}\` |\n`;
  }
  md += `\n### Font (Collection \`1. Primitive\`)\n\n| Figma name | ค่า | ชนิด |\n|---|---|---|\n`;
  const fo = [];
  walk(T.primitive.font, [], fo);
  for (const { segs, tok } of fo) {
    const v = deref(tok.$value);
    md += `| \`font/${segs.join('/')}\` | \`${esc(Array.isArray(v) ? v[0] : v)}\` | ${Array.isArray(v) ? 'STRING' : 'FLOAT'} |\n`;
  }
}

/* ── SCALE ─────────────────────────────────────────────────────────────────── */
md += `
---

## Collection \`4. Scale\`

**mode เดียว** — ค่าตัวเลขที่ไม่ขึ้นกับ theme

`;
for (const group of ['space', 'radius', 'fontSize', 'lineHeight', 'letterSpacing', 'duration', 'breakpoint', 'container', 'viewport', 'layout', 'measure']) {
  if (!T.scale[group]) continue;
  const out = [];
  walk(T.scale[group], [], out);
  if (!out.length) continue;
  md += `### \`${group}\`\n\n| Figma name | ค่า (px / ms) | CSS variable |\n|---|---|---|\n`;
  for (const { segs, tok } of out) {
    const cssPrefix = { space: 'spacing', radius: 'radius', fontSize: 'text', lineHeight: 'leading', letterSpacing: 'tracking', duration: 'transition-duration', breakpoint: 'breakpoint', container: 'container' }[group];
    const css = cssPrefix ? `\`--${cssPrefix}-${segs.join('-')}\`` : '—';
    md += `| \`${group}/${segs.join('/')}\` | \`${esc(toPx(deref(tok.$value)))}\` | ${css} |\n`;
  }
  md += `\n`;
}
{
  const out = [];
  walk(T.scale.icon, [], out);
  md += `### \`icon\`\n\n| Figma name | ค่า | หมายเหตุ |\n|---|---|---|\n`;
  for (const { segs, tok } of out) {
    const note = segs[0] === 'stroke' ? '⚠️ ผูกกับขนาด — ห้ามตั้งเอง' : '';
    md += `| \`icon/${segs.join('/')}\` | \`${esc(toPx(deref(tok.$value)))}\` | ${note} |\n`;
  }
}

/* ── SEMANTIC (Light / Dark) ───────────────────────────────────────────────── */
md += `
---

## Collection \`2. Semantic\` — **2 modes: Light · Dark**

นี่คือ collection เดียวที่มี 2 mode
ค่าที่ช่อง Dark ว่าง = **ใช้ค่าเดียวกับ Light** ไม่ต้องตั้งซ้ำใน Figma

| Figma name | Light | Dark | CSS variable |
|---|---|---|---|
`;
{
  const light = [], dark = [];
  walk(T.semantic.color, [], light);
  walk(T.semanticDark.color, [], dark);
  const darkMap = new Map(dark.map(d => [d.segs.join('.'), d.tok]));
  for (const { segs, tok } of light) {
    const d = darkMap.get(segs.join('.'));
    md += `| \`${figmaName('color', segs)}\` | \`${esc(toPx(deref(tok.$value)))}\` | ${d ? '`' + esc(toPx(deref(d.$value))) + '`' : '—'} | \`${cssName('color', segs)}\` |\n`;
  }
}
md += `
### \`elevation\` (Collection \`2. Semantic\`)

⚠️ **ค่า shadow เก็บเป็น variable ไม่ได้** — เก็บได้เฉพาะ surface และ edge
shadow ต้องเป็น Effect Style และ **ต้องไม่ผูกกับ variant โหมดมืด**

| Figma name | Light | Dark | CSS variable |
|---|---|---|---|
`;
{
  const light = [], dark = [];
  for (const g of ['surface', 'edge']) {
    if (T.semantic.elevation[g]) walk(T.semantic.elevation[g], [g], light);
    if (T.semanticDark.elevation && T.semanticDark.elevation[g]) walk(T.semanticDark.elevation[g], [g], dark);
  }
  const dm = new Map(dark.map(d => [d.segs.join('.'), d.tok]));
  for (const { segs, tok } of light) {
    const d = dm.get(segs.join('.'));
    md += `| \`elevation/${segs.join('/')}\` | \`${esc(toPx(deref(tok.$value)))}\` | ${d ? '`' + esc(toPx(deref(d.$value))) + '`' : '—'} | \`--elevation-${segs.join('-')}\` |\n`;
  }
}

/* ── คำอธิบายที่ต้องใส่ ─────────────────────────────────────────────────────── */
md += `
---

## คำอธิบาย (Description) ที่ต้องใส่ใน Figma

ใส่เฉพาะ variable ที่มีกับดักจริง — คำอธิบายที่ไม่บอกอะไรใหม่จะถูกเมิน

| Figma variable | Description ที่ต้องวาง |
|---|---|
`;
{
  const rows = [];
  const collect = (node, segs, prefix) => {
    if (!node || typeof node !== 'object') return;
    if (isTok(node)) {
      if (node.$description) rows.push([figmaName(prefix, segs), node.$description]);
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === '$description' && segs.length) rows.push([figmaName(prefix, segs), v]);
      if (!k.startsWith('$')) collect(v, [...segs, k], prefix);
    }
  };
  collect(T.primitive.color, [], 'color');
  collect(T.semantic.color, [], 'color');
  const seen = new Set();
  for (const [n, d] of rows) {
    if (seen.has(n)) continue;
    seen.add(n);
    md += `| \`${n}\` | ${esc(d)} |\n`;
  }
}

/* ── สิ่งที่เป็น variable ไม่ได้ ────────────────────────────────────────────── */
md += `
---

## ❌ สิ่งที่เก็บเป็น Figma Variable ไม่ได้

### Text Styles — ต้องสร้างเป็น Text Style

| Figma Text Style | Font | Size / Line-height / Weight | Tracking |
|---|---|---|---|
`;
for (const [name, t] of Object.entries(T.semantic.typography)) {
  if (name.startsWith('$')) continue;
  const v = t.$value;
  const fam = deref(v.fontFamily);
  const fs = toPx(deref(v.fontSize)), lh = toPx(deref(v.lineHeight)), w = deref(v.fontWeight);
  const ls = deref(v.letterSpacing);
  const pretty = name.replace(/([A-Z])/g, '/$1').replace(/^(\w)/, c => c.toUpperCase());
  md += `| \`${pretty}\` | ${Array.isArray(fam) ? fam[0] : fam} | ${fs} / ${lh} / ${w} | ${ls === '0' ? '—' : '`' + ls + '` ⚠️ ละตินล้วน'} |\n`;
}

md += `
### Effect Styles — ต้องสร้างเป็น Effect Style (โหมดสว่างเท่านั้น)

| Figma Effect Style | ชั้น | ค่า |
|---|---|---|
`;
for (const [name, t] of Object.entries(T.semantic.shadow)) {
  if (name.startsWith('$')) continue;
  const layers = Array.isArray(t.$value) ? t.$value : [t.$value];
  layers.forEach((L, i) => {
    md += `| ${i === 0 ? '`Elevation/' + name + '`' : ''} | ${i + 1} | x ${toPx(L.offsetX)} · y ${toPx(L.offsetY)} · blur ${toPx(L.blur)} · spread ${toPx(L.spread)} · \`${deref(L.color)}\` |\n`;
  });
}

md += `
⚠️ **โหมดมืดต้องไม่มี effect เลย** — Figma ไม่มีวิธีบอกว่า effect ควรหายไปตาม mode
ต้องสร้าง component variant แยกสำหรับโหมดมืดที่ไม่ผูก effect style ไว้

### Easing — ต้องตั้งใน Prototype Interaction ทีละอัน

| ใช้กับ | Figma easing (Custom) | CSS variable |
|---|---|---|
`;
for (const [name, t] of Object.entries(T.scale.easing)) {
  if (name.startsWith('$')) continue;
  md += `| ${name} | \`${t.$value.join(', ')}\` | \`--ease-${name === 'entering' ? 'entering' : name}\` |\n`;
}
md += `
⚠️ **ห้ามใช้ Ease In / Ease Out / Ease In Out ที่ Figma ให้มา** — ค่าไม่ตรงกับ token
และงานที่ implement จะรู้สึกต่างจาก prototype

---

## โครงสร้างหน้าในไฟล์ Figma

\`\`\`
📄 00 · Cover
📄 01 · Brand Principles
📄 02 · Color
📄 03 · Typography
📄 04 · Spacing & Grid
📄 05 · Radius & Elevation
📄 06 · Motion
📄 07 · Iconography
📄 08 · Accessibility
\`\`\`

## Frame ที่ต้องมีทุกหน้า

| Frame | ทำไม |
|---|---|
| **320 × auto** | **ข้อกำหนด SC 1.4.10** — ไม่ใช่ทางเลือก เกิดจากผู้ใช้ซูม 400% บนจอ 1280 |
| 360 × 800 | พื้นออกแบบ — เริ่มที่นี่ |
| 768 × 1024 | tablet |
| 1280 × 900 | desktop |
| 1440 × 900 | wide — เฉพาะ dashboard |

## Layout Grid

| Frame | Columns | Gutter | Margin |
|---|---|---|---|
| 320 · 360 | 4 | 16 | 16 |
| 768 | 8 | 24 | 24 |
| 1280 · 1440 | 12 | 24 | 32 |

## ⚠️ กฎบังคับใน Figma

1. **Corner smoothing = 0%** ทุก component — CSS ไม่มี squircle ถ้าตั้ง 60% แบบ iOS งานจริงจะไม่ตรงกับแบบทุกมุม และ **แก้ไม่ได้**
2. **\`1. Primitive\` มี mode เดียว** — ห้ามให้เปลี่ยนตาม theme สีน้ำเงิน 600 เป็นสีเดียวกันทั้งสองโหมด
3. **Icon เป็น component set ที่มี variant \`size\`** โดยแต่ละ variant ตั้ง stroke ไว้แล้ว — Figma ไม่มีวิธีบังคับให้ stroke ผูกกับขนาด
4. **โหมดมืดไม่มี drop shadow เลย** — ใช้ surface + edge แทน
5. **Focus variant ต้องมีในทุก component set** ไม่ใช่ตัวอย่างแยก
6. **Annotation \`aria-label\` ภาษาไทย** สำหรับปุ่มไอคอนล้วนทุกตัว
`;

fs.writeFileSync(path.join(__dirname, 'figma-variables.md'), md);
const lines = md.split('\n').length;
console.log(`✅ สร้าง figma-variables.md แล้ว — ${lines} บรรทัด`);
