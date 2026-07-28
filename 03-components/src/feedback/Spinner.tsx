import { cn } from '../lib/cn';
import { Icon, type IconSize } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Spinner — การกระทำที่รอผลโดยไม่รู้เวลา
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **เขตแดนกับ `Skeleton` ถูกตัดสินไว้แล้ว** (ASTRYX-PARITY.md §8.5)

     `Skeleton` → โหลด**เนื้อหาที่รู้รูปร่างล่วงหน้า** — การ์ด รายการ ตาราง
     `Spinner`  → **การกระทำที่รอผลโดยไม่รู้เวลา** — ปุ่มกำลัง submit,
                  ยืนยันการชำระเงิน

   ห้ามใช้ `Spinner` แทนการโหลดเนื้อหา และห้ามใช้ `Skeleton` กับการกระทำ
   กฎนี้เขียนไว้ทั้งใน `Spinner.md` และ `Skeleton.md` แบบอ้างถึงกัน เพราะ
   ถ้าเส้นแบ่งหาย จะได้ตัวหมุนกลางหน้าเปล่าซึ่งบอกผู้ใช้ว่า "รอ" โดยไม่บอก
   ว่ารออะไรและจะได้อะไร

   ★★★ **ต้องใช้ class `.spinner` ไม่ใช่ `animate-spin`**

   `base.css §10` ปิด animation ทุกตัวด้วย `animation-iteration-count: 1
   !important` แล้ว**คืนให้เฉพาะ `.spinner`** ในรายการ ALLOW (เพราะเป็น
   การเคลื่อนไหวที่สื่อข้อมูลและกินพื้นที่เล็ก · ข้อ 07 §6.2)

   ⚠️ `animate-spin` ของ Tailwind **ไม่ได้อยู่ในรายการนั้น** — ตัวที่ใช้มัน
   จะหมุนรอบเดียวใน 1ms แล้วค้างเมื่อผู้ใช้เปิด reduced motion กลายเป็น
   ไอคอนนิ่งที่ดูเหมือนของตกแต่ง **โดยไม่มี error ให้เห็น**
   (พบจริงใน `TextInput.tsx` ตอนสร้าง component นี้ — แก้ไปแล้ว)

   ★★ **ตัวหมุนอย่างเดียวไม่สื่ออะไรกับผู้ใช้ screen reader**

   จึงมีสามโหมด และผู้เรียกต้องเลือกอย่างตั้งใจ:

     ไม่ส่ง `label`            → `aria-hidden` ทั้งตัว · **ผู้เรียกเป็นเจ้าของ
                                 ชื่อ** เช่นใน `<Button isLoading>` ที่ข้อความ
                                 ปุ่มประกาศอยู่แล้ว — ถ้าประกาศอีกจะได้ยินซ้ำ
     `label`                  → ข้อความเห็นได้ใต้ตัวหมุน + `role="status"`
     `label` + `isLabelHidden` → `sr-only` + `role="status"` — ใช้เมื่อไม่มี
                                 ที่ว่างให้ข้อความ เช่นในช่องกรอก

   `role="status"` เป็น **polite** ไม่ใช่ `alert` — การโหลดไม่ใช่เรื่องด่วน
   และ assertive จะขัดสิ่งที่ผู้ใช้กำลังฟังอยู่ (เหตุผลเดียวกับ `SkeletonGroup`)

   ★ ขนาดผูกกับสเกลไอคอน ไม่ใช่ค่าของ Astryx
   Astryx ให้ 10/14/18/36px ส่วนเราใช้ 16/20/24/32 ซึ่งเป็นขนาดที่ **มี
   stroke ล็อกไว้** ใน `Icon` แล้ว (`tokens.json` §icon) — 36px ไม่มี
   ค่า stroke ในระบบเรา และ 10px บางเกินกว่าจะผ่าน 3:1 บนจอ 1x
   ═══════════════════════════════════════════════════════════════════════════ */

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * เฉดสี — ชื่อค่าเดียวกับ Astryx แต่ map เข้า token ของเรา
 *
 * `inherit` ไม่ใส่คลาสสีเลย จึงรับ `currentColor` ของพ่อแม่ — ใช้ในปุ่มที่
 * พื้นเปลี่ยนตาม variant ทำให้วงแหวนตรงกับสีตัวอักษรที่ resolve แล้วเสมอ
 */
export type SpinnerShade = 'default' | 'onMedia' | 'subtle' | 'inherit';

/** ขนาดที่ `Icon` มี stroke ล็อกไว้ — ห้ามใส่ค่าที่ไม่อยู่ใน IconSize */
const ICON_SIZE: Record<SpinnerSize, IconSize> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const SHADE: Record<SpinnerShade, string> = {
  default: 'text-primary-600',
  onMedia: 'text-on-brand',
  subtle: 'text-fg-muted',
  /* ว่างโดยเจตนา — รับ currentColor ของพ่อแม่ */
  inherit: '',
};

export interface SpinnerProps {
  /** ขนาด · ค่าเริ่มต้น `md` (20px) */
  size?: SpinnerSize;

  /** เฉดสี · ค่าเริ่มต้น `default` */
  shade?: SpinnerShade;

  /**
   * ข้อความบอกว่ากำลังรออะไร
   *
   * ⚠️ **ไม่ส่ง = ตัวหมุนเป็นของตกแต่ง** (`aria-hidden`) และผู้เรียกต้องมี
   * ชื่อให้ผู้ใช้ screen reader เองจากที่อื่น
   */
  label?: string;

  /**
   * ซ่อน `label` ด้วยตา แต่ยังประกาศให้ screen reader
   *
   * ใช้เมื่อไม่มีที่ว่างสำหรับข้อความ เช่นตัวหมุนในช่องกรอก
   * (ชื่อ prop เดียวกับ `TextInput` / `CheckboxInput` — ดู §8.1)
   */
  isLabelHidden?: boolean;

  className?: string;
}

/**
 * ตัวหมุนสำหรับ **การกระทำที่รอผลโดยไม่รู้เวลา**
 *
 * ใช้กับ: ปุ่มกำลัง submit · ยืนยันการชำระเงิน · ตรวจเลขนิติบุคคลกับกรมพัฒน์
 *
 * ไม่ใช้กับ: การโหลดเนื้อหาที่รู้รูปร่าง (`<Skeleton>`) · ความคืบหน้าที่
 * วัดเป็นตัวเลขได้ (`<ProgressBar>`)
 */
export function Spinner({
  size = 'md',
  shade = 'default',
  label,
  isLabelHidden = false,
  className,
}: SpinnerProps) {
  /* ★ .spinner ไม่ใช่ animate-spin — ดูหัวไฟล์ */
  const ring = (
    <Icon
      name="loader"
      size={ICON_SIZE[size]}
      aria-hidden="true"
      className={cn('spinner', SHADE[shade])}
    />
  );

  /* ไม่มี label = ของตกแต่ง · ผู้เรียกเป็นเจ้าของชื่อ (เช่น Button isLoading) */
  if (!label) {
    return <span className={cn('inline-flex', className)}>{ring}</span>;
  }

  return (
    <span
      role="status"
      className={cn(
        isLabelHidden
          ? 'inline-flex'
          : /* ตัวหมุนอยู่บน ข้อความอยู่ล่าง — จัดกลางทั้งคู่ */
            'grid min-w-0 justify-items-center gap-2',
        className,
      )}
    >
      {ring}
      <span className={cn(isLabelHidden ? 'sr-only' : 'text-body-sm text-fg-secondary')}>
        {label}
      </span>
    </span>
  );
}
