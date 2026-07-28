import { racStringsTh } from './strings-rac.th';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ติดตั้งคำแปลไทยของข้อความภายใน React Aria
   ───────────────────────────────────────────────────────────────────────────
   ★★★ กลไกจริงคือ **global สองตัวที่ผูกกับ Symbol** ไม่ใช่ props ไม่ใช่ context

       window[Symbol.for('react-aria.i18n.locale')]  = 'th-TH'
       window[Symbol.for('react-aria.i18n.strings')] = { [pkg]: { [key]: … } }

   `LocalizedStringDictionary.getGlobalDictionaryForPackage()` ใน
   `@internationalized/string` อ่านจากสองตัวนี้ · ปกติ RAC ตั้งค่าให้ผ่าน
   `<PackageLocalizationProvider>` ซึ่ง render เป็น `<script>` **ตอน SSR เท่านั้น**
   (โค้ดของมันขึ้นต้นด้วย `if (typeof document !== 'undefined') return null`)

   ═══ สิ่งที่ลองแล้ว **ไม่ได้ผล** ═══

   ❌ **แก้ `dictionary.strings['th-TH']`** จาก `react-aria-components/i18n`
      → วัดแล้ว: ปุ่มล้างค่าใน `SearchField` ยังเป็น `"Clear search"`
      component ใช้ `intlMessages` ที่ bundle มากับ package ตัวเอง
      ไม่ได้อ่านจาก dictionary ก้อนนั้น

   ❌ **`<LocalizedStringProvider>` ฝั่ง client**
      → วัดแล้ว: **ไม่ render อะไรเลย** (ปุ่มหายทั้งหมด) เพราะมันคือ
      SSR script injector ไม่ใช่ context provider

   บันทึกไว้เพราะทั้งสองทางดู "ถูก" จากชื่อ API และจะมีคนลองซ้ำ

   ═══ ข้อควรระวังที่สำคัญที่สุด ═══

   ⚠️ **ถ้ามี global แล้วแต่ package ไหนขาด → `throw`**

       Error: Strings for package "@react-aria/xyz" were not included…

   ไม่ใช่ fallback เงียบ ๆ แต่พังทั้งหน้า · ฟังก์ชันนี้จึงเติม **ทุก package**
   ที่ RAC รู้จัก โดยใช้ค่า `en-US` สำหรับอันที่ยังไม่ได้แปล

   ⚠️ **อ่านครั้งเดียวแล้ว cache** (`cachedGlobalStrings`) — ต้องตั้งค่า
   **ก่อน** React render ครั้งแรก · เรียกที่ระดับ module ไม่ใช่ใน effect

   ⚠️ **รองรับ locale เดียว** — global ไม่มีที่เก็บหลายภาษา
   ระบบนี้เป็นไทยล้วนตามข้อ 01 จึงไม่กระทบ · ถ้าวันหนึ่งต้องสลับภาษา
   ต้องเปลี่ยนไปใช้ SSR `PackageLocalizationProvider` แทน
   ═══════════════════════════════════════════════════════════════════════════ */

const LOCALE_SYMBOL = Symbol.for('react-aria.i18n.locale');
const STRINGS_SYMBOL = Symbol.for('react-aria.i18n.strings');

export const RAC_LOCALE = 'th-TH';

export interface InstallReport {
  installed: boolean;
  /** จำนวนข้อความที่เป็นภาษาไทยจริง */
  translated: number;
  /** จำนวนข้อความที่ยังเป็น en-US */
  fallback: number;
  /** package ที่แปลไว้แต่ RAC ไม่รู้จัก */
  unknownPackages: string[];
  /** key ที่แปลไว้แต่ไม่มีใน en-US */
  unknownKeys: string[];
  /** package ที่ยังไม่ได้แปลเลย */
  untranslatedPackages: { name: string; count: number }[];
  reason?: string;
}

type Messages = Record<string, unknown>;

/**
 * สร้างชุดข้อความที่**สมบูรณ์ทุก package** โดยใช้ไทยที่แปลไว้
 * และ en-US สำหรับที่เหลือ
 *
 * แยกออกมาเพื่อให้เทสตรวจได้โดยไม่ต้องแตะ global
 */
export function buildRacThaiStrings(reference: Record<string, Messages>) {
  const out: Record<string, Messages> = {};
  const unknownPackages: string[] = [];
  const unknownKeys: string[] = [];
  const untranslatedPackages: { name: string; count: number }[] = [];
  let translated = 0;
  let fallback = 0;

  for (const pkg of Object.keys(racStringsTh)) {
    if (!reference[pkg]) unknownPackages.push(pkg);
  }

  for (const [pkg, referenceMessages] of Object.entries(reference)) {
    const thai = racStringsTh[pkg];
    const bucket: Messages = {};

    if (!thai) {
      untranslatedPackages.push({ name: pkg, count: Object.keys(referenceMessages).length });
      Object.assign(bucket, referenceMessages);
      fallback += Object.keys(referenceMessages).length;
      out[pkg] = bucket;
      continue;
    }

    for (const key of Object.keys(thai)) {
      if (!(key in referenceMessages)) unknownKeys.push(`${pkg}.${key}`);
    }

    for (const [key, englishValue] of Object.entries(referenceMessages)) {
      if (key in thai) {
        bucket[key] = thai[key];
        translated++;
      } else {
        /* ★ ต้องเติม ไม่งั้น key นั้นหายไปและ component ที่เรียกจะพัง */
        bucket[key] = englishValue;
        fallback++;
      }
    }

    out[pkg] = bucket;
  }

  return { strings: out, translated, fallback, unknownPackages, unknownKeys, untranslatedPackages };
}

/**
 * ติดตั้งลง global — **ต้องเรียกก่อน React render ครั้งแรก**
 *
 * @param reference ชุดข้อความ `en-US` จาก `dictionary.strings['en-US']`
 *                  ของ `react-aria-components/i18n`
 */
export function installRacThaiStrings(reference: unknown): InstallReport {
  const base: InstallReport = {
    installed: false,
    translated: 0,
    fallback: 0,
    unknownPackages: [],
    unknownKeys: [],
    untranslatedPackages: [],
  };

  if (typeof window === 'undefined') {
    return { ...base, reason: 'ไม่มี window — ฝั่ง server ต้องใช้ PackageLocalizationProvider' };
  }
  if (!reference || typeof reference !== 'object') {
    return { ...base, reason: 'reference ไม่ใช่ object — โครงสร้างของ RAC เปลี่ยนไปแล้ว' };
  }

  const built = buildRacThaiStrings(reference as Record<string, Messages>);

  const w = window as unknown as Record<symbol, unknown>;
  w[LOCALE_SYMBOL] = RAC_LOCALE;
  w[STRINGS_SYMBOL] = built.strings;

  return {
    installed: true,
    translated: built.translated,
    fallback: built.fallback,
    unknownPackages: built.unknownPackages,
    unknownKeys: built.unknownKeys,
    untranslatedPackages: built.untranslatedPackages,
  };
}
