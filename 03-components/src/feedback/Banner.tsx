import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';
import { IconButton } from '../inputs/IconButton';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Banner — ข้อความที่อยู่ค้างจนผู้ใช้จัดการ   (เดิมชื่อ Alert — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ rename ชื่ออย่างเดียว — ไม่รับ `defaultIsExpanded`/`container` ของ
   Astryx Banner เพราะขัดกฎ "error ใช้ Banner ห้ามใช้ Toast" (§8.4 · D13)
   Banner ที่ยุบข้อความ error ได้จะขัดกับเหตุผลที่ component นี้มีอยู่
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **Banner ไม่หายเอง · Toast หายเอง** — นี่คือเส้นแบ่งทั้งหมด

   ระบบนี้ประกาศกฎ "ไม่มีอะไรหายไปตามเวลา" ไว้สามที่ (Tooltip SC 1.4.13 ·
   นับถอยหลัง QR SC 2.2.1 · เหตุผลที่แบน native validation) · Banner คือ
   component ที่ **รักษากฎนั้น** และ Toast คือข้อยกเว้นที่ถูกจำกัดขอบเขตไว้แคบ

   ผลที่ตามมาซึ่งบังคับใช้จริง: **error ใช้ Banner ห้ามใช้ Toast**
   ข้อความที่บอกว่าผู้ใช้ต้องทำอะไรต่อ ห้ามหายไปก่อนที่ผู้ใช้จะอ่านจบ

   ★★★ **`role="alert"` ไม่ใช่ค่าเริ่มต้น และนี่คือการตัดสินใจ**

   `isLive` เป็น `false` โดยค่าเริ่มต้น เพราะ Banner ส่วนใหญ่ถูก render
   มาพร้อมหน้า (แจ้งช่วงเวลาปิดรับสมัคร · แจ้งว่าผู้ขายไม่จด VAT)
   `role="alert"` บน element ที่มีอยู่ตั้งแต่ตอนโหลด ทำให้ screen reader
   บางคู่ประกาศข้อความนั้น **แทรกก่อนชื่อหน้า** ผู้ใช้จึงได้ยินข้อความ
   ลอย ๆ โดยไม่รู้ว่าตัวเองอยู่หน้าอะไร

   ตั้ง `isLive` เป็น `true` **เฉพาะเมื่อ Banner โผล่มาตอบการกระทำของผู้ใช้**
   เช่นกดบันทึกแล้ว server ปฏิเสธ (SC 4.1.3)

   ★★ **ข้อความตัวเนื้อหาเป็น `text-fg` ไม่ใช่สีตามสถานะ**

   ไม่มี `--color-warning-fg` ในระบบ **โดยตั้งใจ** — yellow ทุกขั้นที่อ่านได้
   บนพื้นสว่างเข้มเกินกว่าจะต่างจาก `text-fg` อย่างมีความหมาย และ
   `warning-500` ได้ **1.66:1** ซึ่งใช้เป็นข้อความไม่ได้เลย (ข้อ 02)

   สีสถานะจึงอยู่ที่ **ไอคอนกับขอบ** เท่านั้น · ข้อความคือ `text-fg`

   วัดแล้วบนพื้น tint ของแต่ละ tone (`text-fg` / `text-fg-secondary` / ไอคอน):
   ```
   สว่าง  info 15.14 / 8.08 / 6.15   success 15.29 / 8.16 / 5.65
          warning 15.59 / 8.32 / 5.35  danger 14.66 / 7.83 / 5.42
   มืด    info 13.72 / 9.78 / 5.95   success 13.77 / 9.82 / 7.30
          warning 11.90 / 8.49 / 8.80  danger 15.48 / 11.04 / 5.53
   ```
   ผ่าน AA ทั้ง 24 ค่า · ค่าต่ำสุดคือไอคอน `warning` ที่ 5.35 ในโหมดสว่าง

   ★★ **กล่องแทบมองไม่เห็นในโหมดสว่าง — และเป็นเรื่องที่ยอมรับได้**

   พื้น tint เทียบ canvas ได้แค่ **1.00–1.05** (`warning` 1.02) และขอบ
   `--color-*-edge` ได้ **1.27–1.99** · กล่องจึงอ่านเป็นย่อหน้าที่มีไอคอน
   มากกว่าเป็นกล่อง

   **ไม่ใช่บั๊ก** เพราะตัวเลขนี้อยู่ในย่านเดียวกับ `--color-edge` (1.56) และ
   `--color-edge-subtle` (1.27) ที่ระบบประกาศเองว่าเป็น **ขอบตกแต่ง** และ
   Card ตอนพักก็ใช้ค่านั้น · Banner ไม่ใช่ control จึงไม่อยู่ในขอบเขต SC 1.4.11
   และความหมายมาจาก **ไอคอน + ข้อความ** ตาม SC 1.4.1 อยู่แล้ว

   ⚠️ ผลที่ตามมาซึ่งต้องรู้: **ห้ามพึ่งกล่องเป็นตัวสื่อความรุนแรง**
   `title` ต้องบอกสิ่งที่เกิดขึ้นด้วยตัวเอง — ผู้ใช้ที่ไม่เห็นกล่องต้องเข้าใจครบ

   ★★ **ไอคอน 4 ตัวรูปทรงต่างกันจริง** (SC 1.4.1)
   วงกลม-ถูก · สามเหลี่ยม · วงกลม-กากบาท · วงกลม-i
   ข้อนี้สำคัญกับ SME.GO เป็นพิเศษเพราะ **ทองกับเหลืองห่างกันแค่ 12°**
   ผู้ใช้ที่แยกเหลืองจากส้มไม่ได้ต้องอ่านออกจากรูปทรง

   ★ **ปุ่มปิดเป็นทางเลือก และผู้เรียกต้องคืน focus เอง**

   เมื่อกดปิด element ที่ถือ focus หายจาก DOM → focus ตกไปที่ `<body>`
   ผู้ใช้คีย์บอร์ดจึงหลุดกลับไปต้นหน้า · component รู้ไม่ได้ว่าควรคืน focus
   ไปไหน จึงเป็นหน้าที่ผู้เรียก (ดู §5 ของเอกสาร) — และเป็นเหตุผลที่
   **Banner ที่บอกว่าต้องแก้อะไร ไม่ควรปิดได้เลย**
   ═══════════════════════════════════════════════════════════════════════════ */

const alertStyles = cva(
  [
    'grid min-w-0 gap-2',
    'rounded-(--radius-container) border',
    'p-3 md:p-4',
    /* ★ ข้อความเป็น text-fg ทุก tone — สีสถานะอยู่ที่ไอคอนกับขอบ */
    'text-fg',
  ],
  {
    variants: {
      tone: {
        /* ขอบเป็น**ขอบตกแต่ง** (1.27–1.99 บน canvas) ตัวเลขครบอยู่หัวไฟล์
           ความหมายมาจากไอคอน + ข้อความ ไม่ใช่จากกล่อง */
        info: 'bg-info-surface border-info-edge',
        success: 'bg-success-surface border-success-edge',
        warning: 'bg-warning-surface border-warning-edge',
        danger: 'bg-danger-surface border-danger-edge',
      },
    },
    defaultVariants: { tone: 'info' },
  },
);

/** ★ รูปทรงต่างกันจริง ไม่ใช่ไอคอนเดียวเปลี่ยนสี (SC 1.4.1) */
const TONE_ICON: Record<BannerTone, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

const TONE_ICON_COLOR: Record<BannerTone, string> = {
  info: 'text-info-icon',
  success: 'text-success-icon',
  warning: 'text-warning-icon',
  danger: 'text-danger-icon',
};

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

export interface BannerProps extends VariantProps<typeof alertStyles> {
  /**
   * บรรทัดแรก — **บังคับ**
   *
   * ต้องบอก**สิ่งที่เกิดขึ้น** ไม่ใช่ระดับความรุนแรง
   * ❌ "ข้อผิดพลาด" · ✅ "บันทึกไม่สำเร็จ"
   */
  title: string;

  /**
   * รายละเอียด — สำหรับ error ให้ตามสูตร **ทำไม → แก้อย่างไร**
   * (`title` รับหน้าที่ "อะไรผิด" ไปแล้ว)
   */
  children?: ReactNode;

  /**
   * ประกาศให้ screen reader ทันทีที่โผล่มา — ค่าเริ่มต้น `false`
   *
   * ⚠️ ตั้ง `true` **เฉพาะ** Banner ที่โผล่มาตอบการกระทำของผู้ใช้
   * Banner ที่ถูก render มาพร้อมหน้าต้องเป็น `false` (ดูหมายเหตุด้านบน)
   *
   * `danger` และ `warning` → `role="alert"` (assertive)
   * `info` และ `success`  → `role="status"` (polite)
   */
  isLive?: boolean;

  /**
   * ปุ่มการกระทำ เช่น "ลองอีกครั้ง" — ซ้อนแนวตั้งบนมือถือ (ข้อ 08 §7)
   *
   * ⚠️ ห้ามเป็นทางเดียวที่ทำสิ่งนั้นได้ ถ้า Banner ปิดได้
   */
  action?: ReactNode;

  /**
   * ทำให้ปิดได้
   *
   * ⚠️ ผู้เรียกต้องคืน focus หลังปิด · **ห้ามใส่กับ Banner ที่บอกว่าต้องแก้อะไร**
   */
  onDismiss?: () => void;

  /**
   * ระดับหัวข้อของ `title` — ค่าเริ่มต้นคือ **ไม่เป็นหัวข้อ**
   *
   * Banner ไม่ใช่ส่วนหนึ่งของโครงหัวข้อของหน้า · ตั้งค่านี้เฉพาะเมื่อ Banner
   * ทำหน้าที่เป็นหัวของส่วนเนื้อหาจริง ๆ ไม่ใช่เพื่อให้ตัวอักษรหนาขึ้น
   */
  titleAs?: 'h2' | 'h3' | 'h4';

  className?: string;
}

/**
 * ข้อความที่**อยู่ค้างจนผู้ใช้จัดการ**
 *
 * ใช้กับ: error จากการส่งฟอร์ม · ข้อจำกัดของสิทธิ์ · เงื่อนไขที่ต้องรู้
 * ก่อนกรอก · ผลลัพธ์ที่ผู้ใช้ต้องอ่านให้จบ
 *
 * ไม่ใช้กับ: การยืนยันซ้ำของสิ่งที่ผู้ใช้เห็นผลอยู่แล้ว (`<Toast>`) ·
 * คำอธิบายช่องกรอก (`description` ของ field เอง)
 */
export function Banner({
  title,
  children,
  tone = 'info',
  isLive = false,
  action,
  onDismiss,
  titleAs,
  className,
}: BannerProps) {
  const s = useStrings();
  const resolvedTone = tone ?? 'info';
  const TitleTag = titleAs ?? 'p';

  /* ★ assertive เฉพาะ tone ที่ขัดจังหวะแล้วสมเหตุสมผล */
  const role = !isLive
    ? undefined
    : resolvedTone === 'danger' || resolvedTone === 'warning'
      ? 'alert'
      : 'status';

  return (
    <div role={role} className={cn(alertStyles({ tone: resolvedTone }), className)}>
      <div className="flex min-w-0 items-start gap-3">
        {/* ไอคอนเป็นตัวเสริมรูปทรง ข้อความข้าง ๆ สื่อความหมายครบอยู่แล้ว */}
        <Icon
          name={TONE_ICON[resolvedTone]}
          size={20}
          className={cn('mt-0.5 shrink-0', TONE_ICON_COLOR[resolvedTone])}
        />

        <div className="grid min-w-0 flex-1 gap-1">
          <TitleTag className="text-label text-fg">{title}</TitleTag>
          {children && (
            <div className="text-body-sm text-fg-secondary">{children}</div>
          )}
        </div>

        {onDismiss && (
          /* ★ ชื่อปุ่มรวม title — ในหน้าที่มี 3 Banner ปุ่ม "ปิด" 3 อัน
             แยกกันไม่ได้เลย (SC 2.5.3) */
          <IconButton
            name="x"
            label={`${s.common.close}: ${title}`}
            variant="ghost"
            size="md"
            onPress={onDismiss}
            /* ★ size md = เป้า 36×36 ไม่ใช่ sm ที่ได้ 24×24 พอดีเกณฑ์ —
               Banner ไม่ใช่ component แน่น จึงไม่มีเหตุให้บีบลงถึงขั้นต่ำ */
            className="-me-1.5 -mt-1.5 shrink-0"
          />
        )}
      </div>

      {action && (
        /* ★ ซ้อนแนวตั้งบนมือถือ · reverse เพราะการกระทำหลักอยู่ท้าย DOM
           แต่ต้องอยู่บนสุดที่จอแคบ (ข้อ 08 §7) */
        <div className="flex flex-col-reverse gap-2 ps-8 sm:flex-row sm:items-center">
          {action}
        </div>
      )}
    </div>
  );
}

export { alertStyles };
