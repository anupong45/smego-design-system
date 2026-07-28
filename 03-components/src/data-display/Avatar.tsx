import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Avatar — โลโก้หรือรูปประจำตัวผู้ขาย
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **ตัวย่อจากชื่อไทยไม่ทำงานแบบเดียวกับชื่อฝรั่ง** — นี่คือทั้งหมด
        ของเหตุผลที่ component นี้มีอยู่

   ปัญหาสองชั้นที่วัดจากชื่อจริงในระบบ:

   **1 · ตัดสตริงดิบทำให้สระและวรรณยุกต์หลุด**
   ```
   "กำแพงเพชร"[0]        → "ก"   ✗ สระ ำ หลุด
   "ห้างหุ้นส่วน…"[0]    → "ห"   ✗ วรรณยุกต์ ้ หลุด
   ```
   ต้องใช้ `Intl.Segmenter` granularity `grapheme` เพื่อเอา **cluster** ทั้งก้อน
   ไม่ใช่ code unit แรก (`"กำแพงเพชร"` → `"กำ"` · `"ห้าง…"` → `"ห้"`)

   **2 · ชื่อนิติบุคคลไทยขึ้นต้นด้วยคำบอกประเภทกิจการ**
   ```
   "บริษัท ไทยโรสเตอร์ จำกัด"      → "บ"  ← จาก "บริษัท"
   "ห้างหุ้นส่วนจำกัด สมชายการค้า" → "ห้" ← จาก "ห้างหุ้นส่วนจำกัด"
   ```
   ผู้ขายไทยส่วนใหญ่จึงได้ตัวเดียวกันหมด — avatar ที่แยกกันไม่ออกคือ avatar
   ที่ไม่ทำงาน จึง **ตัดคำบอกประเภทออกก่อน** แล้วค่อยเอา cluster แรก
   (`"บริษัท ไทยโรสเตอร์ จำกัด"` → `"ไ"` จาก "ไทยโรสเตอร์")

   ★★ **ค่าเริ่มต้นของ `alt` คือ `""` (ของตกแต่ง) ไม่ใช่ `name`**

   ต่างจาก Astryx ที่ให้ `alt` ถอยไปใช้ `name` (D25) · เคสที่พบจริงเกือบทั้งหมด
   คือ avatar วางข้างชื่อที่เป็นข้อความอยู่แล้ว (`SellerProfile` · `CartSellerGroup`)
   ถ้า `alt` = ชื่อ ผู้ใช้ screen reader จะได้ยินชื่อผู้ขาย **สองครั้งติดกัน**

   ระบบนี้ตัดสินเรื่องเดียวกันนี้มาแล้วสามที่: จำนวนในตะกร้า (`TopNav`) ·
   ปุ่มปิด `Banner` · ปุ่มลบ `RemovableChip` — ทุกที่เลือก "ประกาศครั้งเดียว"

   ⚠️ ผลที่ตามมา: ถ้าแสดง avatar **โดยไม่มีชื่อ** อยู่ใกล้ ๆ ผู้เรียก**ต้องส่ง
   `alt` เอง** ไม่งั้นข้อมูลหาย — เขียนไว้ใน §9 ของเอกสารแล้ว

   ★ ไม่ใช้สีแบรนด์เป็นพื้น initials
   `bg-sunken` เพราะ "พื้นทึบน้ำเงิน = กดได้" ถูกสงวนไว้ให้ปุ่ม (ข้อ 05)
   avatar กดไม่ได้ — ถ้าอยู่ในลิงก์ ตัวลิงก์เป็นคนรับ affordance ไม่ใช่ avatar
   ═══════════════════════════════════════════════════════════════════════════ */

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * ขนาดอยู่บนกริด 4px และเลือกจากที่ใช้จริง
 *
 * Astryx ให้ทั้งชื่อ (`xsm`…`xl`) และตัวเลข 14 ค่า — เราให้ชื่ออย่างเดียว
 * ด้วยเหตุผลเดียวกับ `Grid preset` (D22): ระบบตัดสินให้แล้ว ไม่ส่งคำถาม
 * กลับไปที่ call site · `xsm` 20px ของเขาถูกตัดเพราะ cluster ไทยที่มีสระ
 * บนล่างอ่านไม่ออกที่ขนาดนั้น
 */
const SIZE: Record<AvatarSize, { box: string; text: string; icon: 16 | 20 | 24 | 32 }> = {
  /** 24px — ในแถวรายการ */
  sm: { box: 'size-6', text: 'text-caption', icon: 16 },
  /** 40px — ในการ์ด (ค่าเริ่มต้น) */
  md: { box: 'size-10', text: 'text-body-sm', icon: 20 },
  /** 48px — หัวโปรไฟล์ผู้ขาย · ขนาดที่ใช้อยู่เดิม (`size-12`) */
  lg: { box: 'size-12', text: 'text-body', icon: 24 },
  /** 96px — หน้าโปรไฟล์เต็ม */
  xl: { box: 'size-24', text: 'text-title', icon: 32 },
};

/**
 * คำบอกประเภทกิจการที่ต้องตัดก่อนหา cluster แรก
 *
 * เรียงจาก**ยาวไปสั้น** เพราะ "ห้างหุ้นส่วนจำกัด" ต้องชนก่อน "ห้างหุ้นส่วน"
 * ไม่งั้นจะเหลือ "จำกัด" ค้างอยู่แล้วได้ "จ"
 */
const ENTITY_PREFIXES = [
  'ห้างหุ้นส่วนจำกัด',
  'ห้างหุ้นส่วนสามัญ',
  'ห้างหุ้นส่วน',
  'บริษัทจำกัด',
  'บริษัท',
  'หจก.',
  'หจก',
  'บมจ.',
  'บมจ',
  'บจก.',
  'บจก',
  'บจ.',
  'ร้าน',
  'กลุ่ม',
  'วิสาหกิจชุมชน',
  'สหกรณ์',
];

/** คำต่อท้ายแบบฝรั่งที่ไม่ควรกลายเป็นตัวย่อ */
const LATIN_SUFFIXES = /^(co|ltd|inc|corp|llc|plc|company|limited)\.?$/i;

/** ชื่อมีอักษรไทยไหม — ตัดสินวิธีทำตัวย่อ */
const hasThai = (s: string) => /[฀-๿]/.test(s);

/** cluster แรกแบบปลอดภัย — ไม่ตัดสระหรือวรรณยุกต์ทิ้ง */
function firstGrapheme(text: string): string {
  /* Intl.Segmenter มีใน Node 18+ และเบราว์เซอร์ปัจจุบันทั้งหมด
     แต่ถอยไปใช้ตัดดิบไว้ด้วยเพื่อไม่ให้ crash ในสภาพแวดล้อมเก่า */
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('th', { granularity: 'grapheme' });
    return [...seg.segment(text)][0]?.segment ?? '';
  }
  return text.slice(0, 1);
}

/**
 * ตัวย่อจากชื่อ — คนละกฎสำหรับไทยกับฝรั่ง
 *
 * ไทย  → **cluster เดียว** หลังตัดคำบอกประเภทกิจการ
 *         (ตัวย่อสองตัวแบบฝรั่งไม่ใช่ธรรมเนียมไทย และสระบนล่างซ้อนกันสองตัว
 *          จะล้นวงกลม)
 * ฝรั่ง → **สองตัวแรกของสองคำแรก** หลังตัดคำต่อท้ายอย่าง Co. / Ltd.
 */
export function initialsFromName(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return '';

  if (hasThai(cleaned)) {
    /* ตัดคำบอกประเภทกิจการออก แล้วตัดช่องว่าง/จุลภาคที่ค้างอยู่ */
    let rest = cleaned;
    for (const prefix of ENTITY_PREFIXES) {
      if (rest.startsWith(prefix)) {
        rest = rest.slice(prefix.length).replace(/^[\s·,.]+/, '');
        break;
      }
    }
    /* ถ้าตัดแล้วไม่เหลืออะไร (ชื่อเป็นคำบอกประเภทล้วน) ให้ใช้ชื่อเดิม */
    return firstGrapheme(rest || cleaned);
  }

  const words = cleaned
    .split(/\s+/)
    .filter((w) => !LATIN_SUFFIXES.test(w.replace(/[^\w.]/g, '')));

  const source = words.length ? words : cleaned.split(/\s+/);
  return source
    .slice(0, 2)
    .map((w) => firstGrapheme(w).toUpperCase())
    .join('');
}

export interface AvatarProps {
  /** URL รูป */
  src?: string;

  /** URL สำรองเมื่อ `src` โหลดไม่ขึ้น — ถ้าพังทั้งคู่จะถอยไปใช้ตัวย่อ */
  fallbackSrc?: string;

  /**
   * ชื่อผู้ขาย — ใช้ทำตัวย่อเมื่อไม่มีรูป
   *
   * ⚠️ **ไม่** กลายเป็น `alt` โดยอัตโนมัติ (ต่างจาก Astryx · D25) ดูหัวไฟล์
   */
  name?: string;

  /**
   * ข้อความแทนรูปสำหรับ screen reader
   *
   * ค่าเริ่มต้น `''` = **ของตกแต่ง** เพราะเคสปกติมีชื่ออยู่ข้าง ๆ แล้ว
   * ส่งค่านี้เมื่อ avatar อยู่โดยไม่มีชื่อเป็นข้อความใกล้ ๆ
   */
  alt?: string;

  /** ขนาด · ค่าเริ่มต้น `md` (40px) */
  size?: AvatarSize;

  /** เนื้อหามุมล่างขวา เช่นจุดสถานะหรือป้ายยืนยันตัวตน */
  status?: ReactNode;

  className?: string;
}

/**
 * โลโก้หรือรูปประจำตัว พร้อมทางถอย 3 ชั้น
 *
 * `src` → `fallbackSrc` → ตัวย่อจาก `name` → ไอคอนคน
 */
export function Avatar({
  src,
  fallbackSrc,
  name,
  alt = '',
  size = 'md',
  status,
  className,
}: AvatarProps) {
  /* นับว่ารูปพังไปกี่ชั้นแล้ว — 0 = ยังไม่พัง · 1 = src พัง · 2 = พังทั้งคู่ */
  const [failed, setFailed] = useState(0);

  const { box, text, icon } = SIZE[size];
  const activeSrc = failed === 0 ? src : failed === 1 ? fallbackSrc : undefined;
  const initials = name ? initialsFromName(name) : '';

  return (
    /* ⚠️ `overflow-hidden` อยู่ที่ **ชั้นใน** ไม่ใช่ชั้นนอก
       ถ้าอยู่ชั้นนอก `status` ที่วางล้นขอบออกไปจะถูกตัดหายไปทั้งอัน */
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center',
          'overflow-hidden rounded-full',
          /* พื้นกลาง ไม่ใช่สีแบรนด์ — avatar กดไม่ได้ (ดูหัวไฟล์) */
          'bg-sunken text-fg-secondary',
          /* ขอบบางกันรูปสีอ่อนละลายไปกับพื้นการ์ด */
          'border border-edge',
          box,
        )}
      >
        {activeSrc ? (
          <img
            src={activeSrc}
            alt={alt}
            /* ★ onError เลื่อนชั้นทางถอย — ไม่ใช่ซ่อนรูปเปล่า ๆ */
            onError={() => setFailed((n) => n + 1)}
            className="size-full object-cover"
          />
        ) : initials ? (
          <span
            /* ตัวย่อเป็นภาพแทนชื่อ ไม่ใช่ข้อมูลใหม่ — ชื่อจริงอยู่ข้าง ๆ แล้ว
               ถ้าไม่ซ่อน ผู้ใช้ screen reader จะได้ยิน "ไ" ลอย ๆ */
            aria-hidden="true"
            className={cn(text, 'font-medium leading-none')}
          >
            {initials}
          </span>
        ) : (
          /* ★ `building` ไม่ใช่ `user` — ผู้ขายใน SME.GO เป็นนิติบุคคล
             ไม่ใช่บุคคล (และ registry ไม่มีไอคอน `user` อยู่แล้ว) */
          <Icon name="building" size={icon} aria-hidden="true" className="text-fg-muted" />
        )}

        {/* ★ alt ยังต้องประกาศแม้รูปจะถอยไปเป็นตัวย่อ/ไอคอน
           ไม่งั้นผู้เรียกที่ส่ง alt มาจะเสียข้อมูลตอนรูปพัง */}
        {alt && !activeSrc && <span className="sr-only">{alt}</span>}
      </span>

      {status && (
        /* มุมล่างขวาในโหมด LTR — ใช้ end ไม่ใช่ right เพื่อให้กลับด้านได้ */
        <span className="absolute -bottom-0.5 -end-0.5 inline-flex">{status}</span>
      )}
    </span>
  );
}
