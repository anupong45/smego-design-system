const fs = require('fs');
const P = require("path").join(__dirname, "tokens.json");
let T;
try { T = JSON.parse(fs.readFileSync(P, 'utf8')); console.log('✅ JSON valid'); }
catch (e) { console.log('❌ JSON INVALID:', e.message); process.exit(1); }

const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), T);
const isTok = (o) => o && typeof o === 'object' && '$value' in o;

// collect every token + every reference
const tokens = [], refs = [];
const REF = /^\{([^}]+)\}$/;
const walk = (node, path) => {
  if (!node || typeof node !== 'object') return;
  if (isTok(node)) {
    tokens.push(path);
    const scan = (v) => {
      if (typeof v === 'string') { const m = v.match(REF); if (m) refs.push({ from: path, to: m[1] }); }
      else if (Array.isArray(v)) v.forEach(scan);
      else if (v && typeof v === 'object') Object.values(v).forEach(scan);
    };
    scan(node.$value);
    return;
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, path ? `${path}.${k}` : k);
};
walk(T, '');

console.log(`\ntokens: ${tokens.length}   references: ${refs.length}`);

// 1. every reference resolves to a real token
const broken = refs.filter(r => !isTok(get(r.to)));
console.log(`\n${broken.length ? '❌' : '✅'} reference integrity: ${broken.length} broken`);
broken.forEach(r => console.log(`   ${r.from}  ->  {${r.to}}  NOT FOUND`));

// 2. no literals in tier 2 (semantic / semanticDark) colour tokens
const HEXLIKE = /^#|^rgb|^hsl/i;
const literals = [];
const checkLiterals = (node, path) => {
  if (!node || typeof node !== 'object') return;
  if (isTok(node)) {
    const scan = (v, where) => {
      if (typeof v === 'string' && HEXLIKE.test(v)) literals.push(`${path}${where}  =  ${v}`);
      else if (Array.isArray(v)) v.forEach((x, i) => scan(x, `${where}[${i}]`));
      else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => scan(x, `${where}.${k}`));
    };
    scan(node.$value, '');
    return;
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) checkLiterals(v, path ? `${path}.${k}` : k);
};
checkLiterals(T.semantic, 'semantic');
checkLiterals(T.semanticDark, 'semanticDark');
// #00000000 zero-alpha shadows are the documented exception
const realLiterals = literals.filter(l => !l.includes('#00000000'));
console.log(`\n${realLiterals.length ? '❌' : '✅'} tier-2 has no hard-coded colours: ${realLiterals.length} found (${literals.length - realLiterals.length} documented #00000000 exceptions ignored)`);
realLiterals.forEach(l => console.log('   ' + l));

// 3. font-size floor = 13px
const fs13 = Object.entries(T.scale.fontSize).filter(([k]) => !k.startsWith('$'));
const below = fs13.filter(([k]) => Number(k) < 13);
console.log(`\n${below.length ? '❌' : '✅'} 13px font-size floor: ${below.length} violations   (steps: ${fs13.map(([k]) => k).join(', ')})`);

// 4. every typography token ratio >= 1.333
console.log('\nline-height ratios:');
let bad = 0;
for (const [name, t] of Object.entries(T.semantic.typography)) {
  if (name.startsWith('$')) continue;
  const fsKey = t.$value.fontSize.match(REF)[1].split('.').pop();
  const lhKey = t.$value.lineHeight.match(REF)[1].split('.').pop();
  const ratio = Number(lhKey) / Number(fsKey);
  const ok = ratio >= 1.333;
  if (!ok) bad++;
  console.log(`   ${ok ? '✅' : '❌'} ${name.padEnd(10)} ${fsKey}/${lhKey} = ${ratio.toFixed(3)}`);
}
console.log(`${bad ? '❌' : '✅'} minimum ratio 1.333: ${bad} violations`);

// 5. line-heights on the 4px grid
const lh = Object.keys(T.scale.lineHeight).filter(k => !k.startsWith('$'));
const offGrid = lh.filter(k => Number(k) % 4 !== 0);
console.log(`\n${offGrid.length ? '❌' : '✅'} line-heights on 4px grid: ${offGrid.length} off-grid`);

// 6. spacing scale = approved set only
const approved = ['0','0.5','1','2','3','4','5','6','8','10','12','16','20','24','32'];
const sp = Object.keys(T.scale.space).filter(k => !k.startsWith('$'));
const extra = sp.filter(k => !approved.includes(k)), missing = approved.filter(k => !sp.includes(k));
console.log(`${extra.length || missing.length ? '❌' : '✅'} spacing = approved set  (extra: ${extra.join(',') || 'none'} | missing: ${missing.join(',') || 'none'})`);

// 7. icon stroke defined for every icon size
const sizes = Object.keys(T.scale.icon.size).filter(k => !k.startsWith('$'));
const strokes = Object.keys(T.scale.icon.stroke).filter(k => !k.startsWith('$'));
const unpaired = sizes.filter(s => !strokes.includes(s));
console.log(`${unpaired.length ? '❌' : '✅'} every icon size has a locked stroke: ${unpaired.length} unpaired`);

// 8. semanticDark keys must exist in semantic (no orphan overrides)
const flat = (n, p = '') => { const out = []; if (!n || typeof n !== 'object') return out;
  if (isTok(n)) return [p];
  for (const [k, v] of Object.entries(n)) if (!k.startsWith('$')) out.push(...flat(v, p ? `${p}.${k}` : k)); return out; };
const lightKeys = new Set(flat(T.semantic));
const orphans = flat(T.semanticDark).filter(k => !lightKeys.has(k));
console.log(`\n${orphans.length ? '❌' : '✅'} dark overrides all have light counterparts: ${orphans.length} orphans`);
orphans.forEach(k => console.log('   ' + k));

// 9. tier 3 empty
const c = Object.keys(T.component).filter(k => !k.startsWith('$'));
console.log(`${c.length ? '⚠️ ' : '✅'} tier 3 (component) empty by exception: ${c.length} entries`);

// 10. drift check — tokens.json semantic colours must match semantic.css variable names
// mapping rule: --color-{path after semantic.color joined by '-', omitting 'default'}
const cssSrc = fs.readFileSync(require('path').join(__dirname, 'src', 'semantic.css'), 'utf8');
const cssVars = new Set([...cssSrc.matchAll(/^\s*(--color-[a-z0-9-]+)\s*:/gm)].map(m => m[1]));
const jsonVars = new Set();
const collect = (node, segs) => {
  if (!node || typeof node !== 'object') return;
  if (isTok(node)) { jsonVars.add('--color-' + segs.filter(s => s !== 'default').join('-')); return; }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) collect(v, [...segs, k]);
};
collect(T.semantic.color, []);
const onlyJson = [...jsonVars].filter(v => !cssVars.has(v)).sort();
const onlyCss  = [...cssVars].filter(v => !jsonVars.has(v)).sort();
console.log(`\n${onlyJson.length || onlyCss.length ? '❌' : '✅'} tokens.json <-> semantic.css agree: ${jsonVars.size} json / ${cssVars.size} css`);
onlyJson.forEach(v => console.log(`   only in tokens.json: ${v}`));
onlyCss.forEach(v  => console.log(`   only in semantic.css: ${v}`));
