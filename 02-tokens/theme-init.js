/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · theme-init
   ───────────────────────────────────────────────────────────────────────────
   ตั้ง data-theme บน <html> **ก่อน first paint** เพื่อไม่ให้เห็นการกระพริบ
   ของ theme ผิดชั่วขณะ (flash of incorrect theme)

   ⚠️ ต้อง inline ใน <head> แบบ synchronous — ห้าม defer ห้าม async
      ห้ามโหลดเป็นไฟล์แยก เพราะ network request จะทำให้ paint เกิดก่อน

       <head>
         <meta name="color-scheme" content="light dark">
         <script>PASTE THE IIFE BELOW HERE</script>
         <link rel="stylesheet" href="/theme.css">
       </head>

   ค่าที่เก็บมี 3 สถานะ: 'light' | 'dark' | 'system'
   แต่ attribute มีได้เพียง 2 ค่า: light | dark
   เพราะ 'system' ถูก resolve เป็นค่าใดค่าหนึ่งตอนโหลด
   ทำให้ CSS ไม่ต้องรู้เรื่อง 'system' เลย
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var KEY   = 'smego-theme';
  var ATTR  = 'data-theme';
  var QUERY = '(prefers-color-scheme: dark)';
  var root  = document.documentElement;

  /* localStorage โยน exception ได้ในหลายกรณีจริง —
     Safari private mode, iOS ที่ปิดคุกกี้, iframe ที่ถูกบล็อก
     ถ้าอ่านไม่ได้ให้ถือว่าเป็น 'system' ไม่ใช่ปล่อยให้ script ตายทั้งตัว
     เพราะถ้าตาย attribute จะไม่ถูกตั้งและผู้ใช้จะเห็นโหมดสว่างเสมอ */
  function readPref() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === 'light' || v === 'dark' || v === 'system') ? v : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function writePref(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* เขียนไม่ได้ก็ไม่เป็นไร */ }
  }

  function systemIsDark() {
    return typeof matchMedia === 'function' && matchMedia(QUERY).matches;
  }

  /* resolve 'system' เป็นค่าจริง — CSS เห็นแค่ light หรือ dark */
  function resolve(pref) {
    return pref === 'system' ? (systemIsDark() ? 'dark' : 'light') : pref;
  }

  function apply(pref) {
    var theme = resolve(pref);
    root.setAttribute(ATTR, theme);
    /* ตั้งซ้ำใน style ด้วย เพื่อให้ scrollbar และ native control ถูกต้อง
       ตั้งแต่เฟรมแรก ไม่ต้องรอ stylesheet โหลดเสร็จ */
    root.style.colorScheme = theme;
  }

  /* ── รันทันที ก่อน paint ────────────────────────────────────────────────── */
  var pref = readPref();
  apply(pref);

  /* ── ติดตามการเปลี่ยน setting ของ OS เมื่อผู้ใช้เลือก 'system' ──────────── */
  if (typeof matchMedia === 'function') {
    var mq = matchMedia(QUERY);
    var onChange = function () {
      if (readPref() === 'system') apply('system');
    };
    /* addEventListener ไม่มีใน Safari < 14 — มี addListener แทน */
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ── ซิงก์ระหว่างแท็บ ───────────────────────────────────────────────────── */
  addEventListener('storage', function (e) {
    if (e.key === KEY) apply(readPref());
  });

  /* ── API สำหรับปุ่มสลับ theme ───────────────────────────────────────────── */
  window.smegoTheme = {
    /** ค่าที่ผู้ใช้เลือก: 'light' | 'dark' | 'system' */
    get: readPref,

    /** ค่าที่ใช้จริงตอนนี้: 'light' | 'dark' */
    resolved: function () { return root.getAttribute(ATTR) || 'light'; },

    /** ตั้งค่า — รับ 'light' | 'dark' | 'system' */
    set: function (pref) {
      if (pref !== 'light' && pref !== 'dark' && pref !== 'system') return;
      writePref(pref);
      apply(pref);
      dispatchEvent(new CustomEvent('smego:themechange', {
        detail: { preference: pref, resolved: root.getAttribute(ATTR) }
      }));
    },

    /** สลับระหว่าง light และ dark โดยตรง (ออกจากโหมด system) */
    toggle: function () {
      this.set(this.resolved() === 'dark' ? 'light' : 'dark');
    }
  };
})();

/* ═══════════════════════════════════════════════════════════════════════════
   เวอร์ชันย่อสำหรับ inline ใน <head>
   ───────────────────────────────────────────────────────────────────────────
   วางเฉพาะส่วนนี้ถ้าต้องการเล็กที่สุด — ทำแค่หน้าที่กันการกระพริบ
   ส่วน API ของปุ่มสลับให้โหลดตามมาทีหลังได้

   <script>
   (function(){try{var k='smego-theme',p=localStorage.getItem(k)||'system',
   t=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;
   document.documentElement.setAttribute('data-theme',t);
   document.documentElement.style.colorScheme=t}catch(e){
   document.documentElement.setAttribute('data-theme','light')}})();
   </script>

   สังเกต `catch` ที่ตั้งเป็น 'light' — ถ้า localStorage โยน exception
   ต้องยังตั้ง attribute ให้ได้ ไม่ใช่ปล่อยว่าง เพราะ CSS บางส่วนอ้าง
   attribute นี้และการไม่มีค่าจะทำให้สถานะไม่แน่นอน
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   REACT / NEXT.JS
   ───────────────────────────────────────────────────────────────────────────
   Next.js App Router — วางใน app/layout.tsx ด้วย dangerouslySetInnerHTML
   เพื่อให้ script อยู่ใน HTML ที่ server ส่งมา ไม่ต้องรอ hydration

     const INIT = `(function(){ ... })();`;

     export default function RootLayout({ children }) {
       return (
         <html lang="th" suppressHydrationWarning>
           <head>
             <meta name="color-scheme" content="light dark" />
             <script dangerouslySetInnerHTML={{ __html: INIT }} />
           </head>
           <body>{children}</body>
         </html>
       );
     }

   ⚠️ `lang="th"` เป็นข้อบังคับ ไม่ใช่ทางเลือก
      จำเป็นสำหรับ feature `locl` ของ Anuphan และการตัดคำไทย
      (ภาษาไทยไม่มีช่องว่างระหว่างคำ)

   ⚠️ `suppressHydrationWarning` จำเป็นบน <html>
      เพราะ script แก้ attribute ก่อนที่ React จะ hydrate
      ถ้าไม่ใส่ React จะเตือนว่า server กับ client ไม่ตรงกัน

   ⚠️ ห้ามอ่าน theme ใน component ตอน render ครั้งแรก
      server ไม่รู้ค่า จะทำให้ hydration mismatch — ให้อ่านใน useEffect
      หรืออ่านจาก data-theme attribute โดยตรง
   ═══════════════════════════════════════════════════════════════════════════ */
