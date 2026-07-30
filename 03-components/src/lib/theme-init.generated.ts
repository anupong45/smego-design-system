/* ไฟล์นี้ถูกสร้างด้วยสคริปต์ ห้ามแก้มือ
   สร้างด้วย:  npm run gen:theme-init
   แหล่งความจริง: 02-tokens/theme-init.js
   ตรงกันหรือไม่ ถูกยืนยันด้วย tests/a11y/theme-init.test.ts */

/**
 * IIFE ที่ต้อง inline ใน `<head>` **แบบ synchronous ก่อน first paint**
 *
 * Next.js App Router — `app/layout.tsx`:
 *
 * ```tsx
 * import { THEME_INIT_SCRIPT } from '@smego/ui';
 *
 * <html lang="th" suppressHydrationWarning>
 *   <head>
 *     <meta name="color-scheme" content="light dark" />
 *     <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
 *   </head>
 * ```
 *
 * ⚠️ `lang="th"` เป็นข้อบังคับ — feature `locl` ของ Anuphan และการตัดคำไทย
 * ⚠️ `suppressHydrationWarning` บน `<html>` จำเป็น เพราะ script แก้ attribute
 *    ก่อน React hydrate
 * ⚠️ ห้าม `defer` ห้าม `async` ห้ามแยกเป็นไฟล์ — paint จะเกิดก่อน
 */
export const THEME_INIT_SCRIPT = "(function () {\n  'use strict';\n\n  var KEY   = 'smego-theme';\n  var ATTR  = 'data-theme';\n  var QUERY = '(prefers-color-scheme: dark)';\n  var root  = document.documentElement;\n\n  /* localStorage โยน exception ได้ในหลายกรณีจริง —\n     Safari private mode, iOS ที่ปิดคุกกี้, iframe ที่ถูกบล็อก\n     ถ้าอ่านไม่ได้ให้ถือว่าเป็น 'system' ไม่ใช่ปล่อยให้ script ตายทั้งตัว\n     เพราะถ้าตาย attribute จะไม่ถูกตั้งและผู้ใช้จะเห็นโหมดสว่างเสมอ */\n  function readPref() {\n    try {\n      var v = localStorage.getItem(KEY);\n      return (v === 'light' || v === 'dark' || v === 'system') ? v : 'system';\n    } catch (e) {\n      return 'system';\n    }\n  }\n\n  function writePref(v) {\n    try { localStorage.setItem(KEY, v); } catch (e) { /* เขียนไม่ได้ก็ไม่เป็นไร */ }\n  }\n\n  function systemIsDark() {\n    return typeof matchMedia === 'function' && matchMedia(QUERY).matches;\n  }\n\n  /* resolve 'system' เป็นค่าจริง — CSS เห็นแค่ light หรือ dark */\n  function resolve(pref) {\n    return pref === 'system' ? (systemIsDark() ? 'dark' : 'light') : pref;\n  }\n\n  function apply(pref) {\n    var theme = resolve(pref);\n    root.setAttribute(ATTR, theme);\n    /* ตั้งซ้ำใน style ด้วย เพื่อให้ scrollbar และ native control ถูกต้อง\n       ตั้งแต่เฟรมแรก ไม่ต้องรอ stylesheet โหลดเสร็จ */\n    root.style.colorScheme = theme;\n  }\n\n  /* ── รันทันที ก่อน paint ────────────────────────────────────────────────── */\n  var pref = readPref();\n  apply(pref);\n\n  /* ── ติดตามการเปลี่ยน setting ของ OS เมื่อผู้ใช้เลือก 'system' ──────────── */\n  if (typeof matchMedia === 'function') {\n    var mq = matchMedia(QUERY);\n    var onChange = function () {\n      if (readPref() === 'system') apply('system');\n    };\n    /* addEventListener ไม่มีใน Safari < 14 — มี addListener แทน */\n    if (mq.addEventListener) mq.addEventListener('change', onChange);\n    else if (mq.addListener) mq.addListener(onChange);\n  }\n\n  /* ── ซิงก์ระหว่างแท็บ ───────────────────────────────────────────────────── */\n  addEventListener('storage', function (e) {\n    if (e.key === KEY) apply(readPref());\n  });\n\n  /* ── API สำหรับปุ่มสลับ theme ───────────────────────────────────────────── */\n  window.smegoTheme = {\n    /** ค่าที่ผู้ใช้เลือก: 'light' | 'dark' | 'system' */\n    get: readPref,\n\n    /** ค่าที่ใช้จริงตอนนี้: 'light' | 'dark' */\n    resolved: function () { return root.getAttribute(ATTR) || 'light'; },\n\n    /** ตั้งค่า — รับ 'light' | 'dark' | 'system' */\n    set: function (pref) {\n      if (pref !== 'light' && pref !== 'dark' && pref !== 'system') return;\n      writePref(pref);\n      apply(pref);\n      dispatchEvent(new CustomEvent('smego:themechange', {\n        detail: { preference: pref, resolved: root.getAttribute(ATTR) }\n      }));\n    },\n\n    /** สลับระหว่าง light และ dark โดยตรง (ออกจากโหมด system) */\n    toggle: function () {\n      this.set(this.resolved() === 'dark' ? 'light' : 'dark');\n    }\n  };\n})();";
