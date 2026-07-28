import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { I18nProvider } from 'react-aria-components';
import { stringsTh, type Strings, type PartialStrings } from '../lib/strings.th';
import { installRacThaiStrings } from '../lib/install-rac-th';
import { RAC_EN_FALLBACK } from '../lib/rac-en-fallback';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Provider
   ───────────────────────────────────────────────────────────────────────────
   ทำ 3 อย่าง

   1. ตั้ง locale ให้ React Aria เป็น `th-TH-u-ca-buddhist`
      → DateFormatter ทุกตัวใน RAC จะให้ **พ.ศ.** โดยอัตโนมัติ
        ยืนยันแล้ว: today('Asia/Bangkok') 2026 → 2569 · "25 กรกฎาคม 2569"

   2. ให้ dictionary ข้อความไทยของเราเองผ่าน context
      → component อ่านด้วย useStrings()

   3. ตั้ง timezone เริ่มต้นเป็น Asia/Bangkok
      → กำหนดปิดรับสมัครของ Grant/Program คำนวณตามเวลาไทย ไม่ใช่ UTC
        ซึ่งต่างกัน 7 ชั่วโมง และทำให้ "เหลือ 1 วัน" ผิดได้จริง

   ⚠️ Provider **ไม่** ตั้ง data-theme — theme-init.js ในชั้น 02 ทำก่อน first paint
      ถ้า Provider ทำ จะเกิดการกระพริบเพราะ React hydrate ทีหลัง
   ═══════════════════════════════════════════════════════════════════════════ */

/** locale ที่ทำให้ RAC ให้ พ.ศ. — ยืนยันด้วย @internationalized/date 3.12.2 */
export const SMEGO_LOCALE = 'th-TH-u-ca-buddhist';

/** เขตเวลาที่ใช้คำนวณกำหนดปิดรับสมัครและกำหนดการอบรม */
export const SMEGO_TIMEZONE = 'Asia/Bangkok';

interface SmeGoContextValue {
  strings: Strings;
  locale: string;
  timeZone: string;
}

const SmeGoContext = createContext<SmeGoContextValue | null>(null);

export interface SmeGoProviderProps {
  children: ReactNode;

  /**
   * override ข้อความเป็นบางส่วน — ไม่ต้องส่งครบทุกคำ
   * merge ระดับหมวด (shallow ต่อกลุ่ม) กับ stringsTh
   */
  strings?: PartialStrings;

  /**
   * ปิดการติดตั้งคำแปลไทยของข้อความภายใน RAC
   *
   * ค่าเริ่มต้นคือ **ติดตั้งให้เอง** (ดูกล่องท้ายไฟล์) · ตั้ง `true`
   * เมื่อแอปติดตั้งเองด้วย reference ของตัวเอง หรือทำ SSR ด้วย
   * `PackageLocalizationProvider` — เรียกซ้ำไม่พังแต่ก็ไม่มีประโยชน์
   */
  skipRacStrings?: boolean;

  /**
   * locale · ค่าเริ่มต้น `th-TH-u-ca-buddhist`
   *
   * 📌 **แก้ความแม่นยำ** — ฉบับแรกของคอมเมนต์นี้เขียนว่า "ถ้าใช้ `th-TH` เฉย ๆ
   *    จะได้ ค.ศ." ซึ่ง **ผิด** ทดสอบใน browser จริงแล้วพบว่า
   *
   *      th-TH               → calendar 'buddhist' → "25 กรกฎาคม 2569"
   *      th-TH-u-ca-buddhist → calendar 'buddhist' → "25 กรกฎาคม 2569"
   *      th-TH-u-ca-gregory  → calendar 'gregory'  → "25 กรกฎาคม ค.ศ. 2026"
   *
   *    **CLDR กำหนดให้ปฏิทินเริ่มต้นของภาษาไทยเป็นพุทธศักราชอยู่แล้ว**
   *    ดังนั้น `-u-ca-buddhist` **ไม่จำเป็น** สำหรับการจัดรูปแบบ
   *
   *    เหตุผลที่ยังคงไว้: **เขียนเจตนาให้เห็นในโค้ด** — คนที่อ่าน
   *    `th-TH-u-ca-buddhist` รู้ทันทีว่า พ.ศ. เป็นข้อกำหนด ไม่ใช่ผลข้างเคียง
   *    และกันไว้ถ้าค่าเริ่มต้นของ CLDR เปลี่ยนในอนาคต
   *
   *    ⚠️ ถ้าต้องการ ค.ศ. จริง ๆ (เช่นสัญญาระหว่างประเทศ) ต้องระบุ
   *    `th-TH-u-ca-gregory` — ไม่ใช่ `th-TH`
   */
  locale?: string;

  /** เขตเวลา · ค่าเริ่มต้น `Asia/Bangkok` */
  timeZone?: string;
}

/* ★ ติดตั้งครั้งเดียวต่อหน้า — ตัวแปรระดับ module ไม่ใช่ state
   เพราะ `@internationalized/string` cache ทันทีที่อ่านครั้งแรก
   การเรียกซ้ำจึงไม่มีผล และ Provider อาจถูก mount หลายตัวได้ */
let racInstalled = false;

export function SmeGoProvider({
  children,
  strings,
  locale = SMEGO_LOCALE,
  timeZone = SMEGO_TIMEZONE,
  skipRacStrings = false,
}: SmeGoProviderProps) {
  /* ★★ เรียก**ในเนื้อ component ก่อน return** ไม่ใช่ใน effect

     ต้องตั้ง global ให้เสร็จก่อน RAC component ตัวแรก render · เนื้อของ
     Provider ทำงานก่อน children ทุกตัวใน render รอบแรก จึงทันพอดี
     ส่วน effect จะสายไป เพราะ effect ยิงหลัง children render แล้ว */
  if (!racInstalled && !skipRacStrings) {
    racInstalled = true;
    installRacThaiStrings(RAC_EN_FALLBACK);
  }
  const value = useMemo<SmeGoContextValue>(() => {
    if (!strings) return { strings: stringsTh, locale, timeZone };

    /* merge ทีละหมวด เพื่อให้ override บางคำได้โดยไม่ต้องส่งหมวดมาครบ */
    const merged = { ...stringsTh } as Record<string, unknown>;
    for (const [group, overrides] of Object.entries(strings)) {
      if (!overrides) continue;
      merged[group] = {
        ...(stringsTh as Record<string, Record<string, unknown>>)[group],
        ...overrides,
      };
    }
    return { strings: merged as Strings, locale, timeZone };
  }, [strings, locale, timeZone]);

  return (
    <SmeGoContext.Provider value={value}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </SmeGoContext.Provider>
  );
}

/**
 * อ่าน dictionary ข้อความไทย
 *
 * เรียกใช้นอก SmeGoProvider จะได้ค่าเริ่มต้นภาษาไทย — ไม่ throw
 * เพื่อให้ component ทำงานได้ใน unit test ที่ไม่ได้ครอบ Provider
 */
export function useStrings(): Strings {
  return useContext(SmeGoContext)?.strings ?? stringsTh;
}

/** อ่าน locale และ timezone ที่ตั้งไว้ — ใช้กับการจัดรูปแบบวันที่และจำนวนเงิน */
export function useSmeGoLocale(): { locale: string; timeZone: string } {
  const ctx = useContext(SmeGoContext);
  return {
    locale: ctx?.locale ?? SMEGO_LOCALE,
    timeZone: ctx?.timeZone ?? SMEGO_TIMEZONE,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ข้อความภายในของ React Aria — ต่อเข้าไทยแล้ว แต่ **ต้องเรียกเอง**
   ───────────────────────────────────────────────────────────────────────────
   `I18nProvider locale="th-TH-u-ca-buddhist"` ทำให้ **การจัดรูปแบบวันที่และ
   ตัวเลข** เป็นไทยและเป็น พ.ศ. ถูกต้อง

   แต่ **ข้อความที่ RAC พูดกับ screen reader เอง** ไม่ได้มาจาก `I18nProvider`
   React Aria ส่งชุดแปลมา 34 locale และ **ไม่มี th-TH**
   (ภาษาเอเชียมีแค่ ja-JP · ko-KR · zh-CN · zh-TW)

   ═══ สถานะ: ติดตั้งให้เองแล้ว (เปลี่ยนเมื่อ 2026-07-28) ═══

   `SmeGoProvider` **เรียก `installRacThaiStrings(RAC_EN_FALLBACK)` ให้เอง**
   ในเนื้อ component ก่อน return — ทันก่อน RAC component ตัวแรก render
   ปิดได้ด้วย `skipRacStrings`

   ★ ทำไมเปลี่ยนจาก opt-in

   เดิมบังคับให้แอปส่ง `dictionary.strings['en-US']` เข้ามาเอง โดยให้เหตุผลว่า
   `react-aria-components/i18n` ลากชุดแปลทั้ง 34 locale เข้า bundle ซึ่งขัดกับ
   เกณฑ์อุปกรณ์ในข้อ 01 — **ข้อเท็จจริงถูก แต่ข้อสรุปผิด**

   วัดจริง (2026-07-28):
     · ทั้ง 34 locale       355 KB raw · **59 KB gzip** — ใหญ่กว่าไลบรารีทั้งก้อน
                            (35 KB gzip) เกือบ 1.7 เท่า → รับไม่ได้จริง
     · **en-US locale เดียว  22 package · 146 key · ~4 KB raw · ~1.3 KB gzip**

   ตารางที่จำเป็นจริงคือก้อนหลัง ซึ่งเล็กจนฝังไว้ในไลบรารีได้เกือบฟรี
   เอกสารเดิมตัดสินด้วยขนาดของ 34 locale แทนขนาดของ locale เดียว จึงผลัก
   ภาระไปให้แอป และผลคือ **ผู้ใช้ TalkBack ไทยได้ยินภาษาอังกฤษถ้าแอปลืมเรียก**
   ซึ่งบนแพลตฟอร์มภาครัฐไม่ควรเป็นค่าเริ่มต้น

   ⚠️ เหตุผลที่ต้องเติม **ทุก** package ไม่ใช่แค่ที่เราแปล: ถ้า global มีแล้วแต่
   package ไหนขาด `LocalizedStringDictionary` จะ **throw แล้วพังทั้งหน้า**
   ไม่ใช่ fallback เงียบ ๆ · และมันอ่าน global ด้วย `for...in` **ครั้งเดียว**
   แล้ว snapshot เป็น plain object (`private/LocalizedStringDictionary.js:36,41`)
   จึงดัก Proxy ไม่ได้ — ต้องเป็นตารางที่ครบจริงเท่านั้น

   ⚠️ ตารางจึงเก่าได้ถ้า RAC เพิ่ม package/key —
   `tests/a11y/rac-fallback.test.ts` เทียบกับ RAC ที่ติดตั้งจริงทุกครั้งที่
   `verify` รัน เปลี่ยนความพังตอน runtime เป็นความแดงตอน build
   อัปเกรด RAC แล้วรัน `npm run gen:rac-fallback`

   ยืนยันว่าปุ่มล้างค่าใน `SearchField` ประกาศว่า "ล้างคำค้นหา"
   ═══════════════════════════════════════════════════════════════════════════ */
