import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════════════
   ฟอนต์ต้องโหลดจริงในเบราว์เซอร์จริง
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ทำไมต้องมีเทสนี้แยกจาก `check:fonts`

   `check:fonts` เป็นเกต **static** — ตรวจว่าไฟล์อยู่และ CSS ถูก แต่ตรวจไม่ได้ว่า
   **เบราว์เซอร์ใช้ฟอนต์นั้นจริงหรือเปล่า** · ฟอนต์ที่โหลดไม่สำเร็จไม่ throw
   ไม่ error — หน้าตกไปใช้ฟอนต์สำรองแล้วดูเหมือนใช้ได้

   และนี่ไม่ใช่ความกลัวเชิงทฤษฎี: จนถึง 2026-07-30 ระบบนี้ **ไม่เคยโหลด
   Anuphan เลย** ทั้งที่ `01-foundations/03-typography.md` parse ไฟล์ฟอนต์จริง
   มาเขียนไว้ 400 บรรทัด · ทุกตัวเลขความกว้างที่บันทึกไว้ก่อนวันนั้นเป็นค่าของ
   Noto Sans Thai / ฟอนต์ระบบ ไม่ใช่ของฟอนต์ที่ระบบประกาศว่าใช้

   วัดเทียบไว้เมื่อ 2026-07-30 (Chromium · 400 16px · "ขอสินเชื่อธุรกิจ 1,234,567 บาท"):

       Anuphan          205.47 px
       Noto Sans Thai   200.90 px   ← ฟอนต์สำรองที่ระบบใช้มาตลอดโดยไม่รู้ตัว
                        ─────────
       Anuphan กว้างกว่า  +2.3 %

   2.3% คือเหตุผลที่เทสความกว้างทั้ง 46 ตัวยังผ่านหลังเปลี่ยนมาใช้ฟอนต์จริง —
   margin ที่ตั้งไว้กว้างกว่านั้น · แต่ตอนนี้มันผ่านด้วยเหตุผลที่ถูก
   ═══════════════════════════════════════════════════════════════════════════ */

/* ⚠️ `baseURL` ของ playwright.config คือ **fixture :4321** ไม่ใช่ gallery
   ฉบับแรกของไฟล์นี้ตั้งค่าคงที่ชื่อ `GALLERY = '/index.html'` แล้วมันโหลด
   fixture — ตอนพิสูจน์ว่าเทสแดงได้ ผม rebuild แค่ gallery ส่วน `app.css`
   ยังมี @font-face เก่า **เทสจึงเขียวทั้งที่ฟอนต์ถูกถอนออกแล้ว**
   นั่นคือ "เกตอ่านไฟล์ผิดที่ก็เขียว" (CLAUDE.md §2) เกิดขึ้นสด ๆ

   ทั้งสองพื้นผิวเป็น artifact ที่ build แยกกัน — ต้องตรวจทั้งคู่ */
const SURFACES = [
  { name: 'fixture', url: 'http://127.0.0.1:4321/index.html' },
  { name: 'gallery', url: 'http://127.0.0.1:4400/index.html' },
] as const;

test.describe('Anuphan · การโหลดฟอนต์', () => {
  for (const s of SURFACES) {
    test(`★★★ ${s.name} · เบราว์เซอร์โหลด Anuphan จาก woff2 ของเราจริง`, async ({
      page,
    }) => {
      const fetched: string[] = [];
      page.on('response', (r) => {
        if (r.url().endsWith('.woff2') && r.status() === 200) {
          fetched.push(r.url().split('/').pop()!);
        }
      });

      await page.goto(s.url);
      await page.evaluate(() => document.fonts.ready);

      /* ★ ต้องยืนยันว่า **ดึงไฟล์จากเซิร์ฟเวอร์ของเรา** ไม่ใช่แค่ว่าชื่อ family
         resolve ได้ — `document.fonts.check()` คืน true ได้จากฟอนต์ที่
         **ติดตั้งในเครื่อง** ด้วย ซึ่งทำให้เทสเขียวบนเครื่องนักพัฒนาที่ลง
         Anuphan ไว้ ขณะที่เว็บจริงตกไปใช้ฟอนต์สำรอง */
      expect(
        fetched,
        `${s.name} ไม่ดึง woff2 ของเราเลย — @font-face หลุดจาก CSS ที่ build ` +
          'หรือ path ผิด (ลืม copy:assets) · ฟอนต์ที่โหลดไม่ได้ไม่ throw',
      ).not.toEqual([]);

      expect(
        await page.evaluate(() =>
          [...document.fonts].filter(
            (f) => f.family === 'Anuphan' && f.status === 'loaded',
          ).length,
        ),
        'ไม่มี @font-face ของ Anuphan ที่สถานะ loaded',
      ).toBeGreaterThan(0);
    });
  }

  test('★★ Anuphan อยู่หน้าสุดของ font stack ที่ render จริง', async ({ page }) => {
    await page.goto(SURFACES[0].url);
    await page.evaluate(() => document.fonts.ready);

    /* token `--sme-font-anuphan` ต้องไปถึง <body> จริง ไม่ใช่ค้างอยู่ใน :root
       — `base.css` ไม่อยู่ใน layer จึงชนะทุก utility และเคยกินคลาสอื่นมา 3 ครั้ง */
    const fam = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(fam, `body ได้ font stack: ${fam}`).toMatch(/^Anuphan|^"Anuphan"/);
  });

  test('★★ หน้าไทยโหลดแค่ subset ที่ใช้ — 52 KB ไม่ใช่ 83 KB', async ({ page }) => {
    const fetched: string[] = [];
    page.on('response', (r) => {
      const u = r.url();
      if (u.endsWith('.woff2') && r.status() === 200) {
        fetched.push(u.split('/').pop()!);
      }
    });

    await page.goto(SURFACES[1].url);
    await page.evaluate(() => document.fonts.ready);

    /* thai + latin ต้องมา — เนื้อหาเป็นไทยและมีตัวเลข/ราคา */
    expect(fetched, 'subset thai ไม่ถูกโหลด').toContain('anuphan-thai.woff2');
    expect(fetched, 'subset latin ไม่ถูกโหลด').toContain('anuphan-latin.woff2');

    /* latin-ext (23.2 KB) + vietnamese (8.4 KB) ต้อง **ไม่** มา —
       ถ้ามา แปลว่า unicode-range หลุด หรือมีใครยุบเป็นไฟล์เดียว
       (typography.md §215 วัดไว้ว่านั่นทำให้หน้าไทยล้วนโหลด 83 KB แทน 52 KB) */
    expect(
      fetched.filter((f) => /latin-ext|vietnamese/.test(f)),
      'โหลด subset ที่หน้าไทยล้วนไม่ได้ใช้ — unicode-range ไม่ทำงาน',
    ).toEqual([]);
  });

  test('Anuphan กว้างกว่าฟอนต์สำรอง — ยืนยันว่าวัดบนฟอนต์คนละตัวจริง', async ({
    page,
  }) => {
    await page.goto(SURFACES[0].url);
    await page.evaluate(() => document.fonts.ready);

    const { anuphan, fallback } = await page.evaluate(() => {
      const w = (family: string) => {
        const ctx = document.createElement('canvas').getContext('2d')!;
        ctx.font = `400 16px ${family}`;
        return ctx.measureText('ขอสินเชื่อธุรกิจ 1,234,567 บาท').width;
      };
      return { anuphan: w('"Anuphan"'), fallback: w('"Noto Sans Thai"') };
    });

    /* ถ้าสองค่านี้ **เท่ากัน** แปลว่า Anuphan ไม่ได้โหลดแล้วทั้งคู่ตกไปตัวเดียวกัน
       — ซึ่งเป็นสภาพที่เทสข้างบนควรจับได้ แต่ข้อนี้จับซ้ำจากอีกมุม
       เพราะ document.fonts.check เคยรายงาน true ได้จาก face ที่ยังไม่ใช้ */
    expect(
      Math.abs(anuphan - fallback),
      `Anuphan (${anuphan.toFixed(2)}) กับฟอนต์สำรอง (${fallback.toFixed(2)}) ` +
        'ให้ความกว้างเท่ากัน — น่าจะไม่ได้โหลด Anuphan จริง',
    ).toBeGreaterThan(1);
  });
});
