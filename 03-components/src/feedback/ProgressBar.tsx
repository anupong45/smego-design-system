'use client';

import { ProgressBar as RacProgressBar, Label } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useSmeGoLocale, useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ProgressBar — ความคืบหน้าที่รู้ค่า
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **ตัวเลขบังคับ แถบเป็นของแถม**

   แถบสีอย่างเดียวสื่อความหมายไม่ได้ (A1 · SC 1.4.1) และผู้ใช้ที่มองเห็น
   ก็อ่าน "ประมาณสามในสี่" ไม่ได้แม่นเท่า "780 จาก 1,000 ล้านบาท"
   component จึง **render ตัวเลขเสมอ ปิดไม่ได้** — ไม่มี prop `hideValue`

   ★★ **ห้ามใช้กับยอดเงินที่ผู้ใช้จะได้รับ**

   แถบที่ค่อย ๆ เต็มทำให้ตัวเลขดูเหมือนเงินที่กำลังไหลเข้ามาหาผู้ใช้
   ซึ่งเป็นความเข้าใจผิดที่ GrantCard §3 ถูกเขียนขึ้นมาเพื่อป้องกันโดยตรง
   ("วงเงินสูงสุด" ≠ "เงินที่จะได้รับ") · ใช้กับ**โควตาที่ถูกใช้ไปแล้ว**
   ของทั้งโครงการได้ ใช้กับวงเงินของผู้ใช้คนเดียวไม่ได้

   ★★ **โหมดมืด: `sunken` = `canvas` เป๊ะ (ratio 1.000)**

   ถ้าไม่มีขอบ รางจะหายไปทั้งเส้นเมื่อวางบน `bg-canvas` ในโหมดมืด
   (STYLE-GUIDELINE §5.4) · ราง**มีขอบ `edge-strong` เสมอ** ไม่ใช่การตกแต่ง
   วัดได้ 4.38 บน canvas มืด · 3.84 บน surface มืด · 4.20 บนขาว ✅ ทั้งหมด

   ★ **ไม่มีโหมด indeterminate** — ดู §1 ของเอกสาร
   งานที่ไม่รู้ระยะเวลาใช้ `<Skeleton>` · การเคลื่อนที่ซ้ำไปมาโดยไม่มีตัวเลข
   ขัดกฎข้อแรกของ component นี้

   ⚠️ ข้อจำกัดที่ค้นพบจากการวัด ไม่ใช่การออกแบบ
   **ไม่มี tone `warning`** — `warning-fill` (yellow-500) บนราง `sunken`
   ได้ **1.49:1** ในโหมดสว่าง ต่ำกว่าเกณฑ์ 3:1 มาก · ใช้ `danger` แทน
   ═══════════════════════════════════════════════════════════════════════════ */

const trackStyles = cva(
  [
    'block w-full overflow-hidden',
    'bg-sunken',
    /* ★ ขอบจำเป็น ไม่ใช่ตกแต่ง — โหมดมืด sunken = canvas */
    'border border-edge-strong',
    'rounded-(--radius-control)',
  ],
  {
    variants: {
      size: {
        /* ความสูงรวมขอบ = 8 + 1 + 1 = 10px */
        sm: 'h-2',
        /* ความสูงรวมขอบ = 12 + 1 + 1 = 14px */
        md: 'h-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const fillStyles = cva(
  [
    'block h-full',
    /* ALLOW ของ reduced motion คืน transition ให้เฉพาะรายการปลอดภัย
       — width ไม่อยู่ในนั้น จึงต้องประกาศเองแบบ motion-safe */
    'motion-safe:transition-[width] motion-safe:duration-(--transition-duration-medium)',
  ],
  {
    variants: {
      tone: {
        /* วัดบนราง sunken · สว่าง 4.28 · มืด 3.86 ✅ */
        brand: 'bg-primary-600',
        /* สว่าง 5.37 · มืด 3.09 ✅ */
        success: 'bg-success-fill',
        /* สว่าง 5.37 · มืด 3.09 ✅ */
        danger: 'bg-danger-fill',
      },
    },
    defaultVariants: { tone: 'brand' },
  },
);

export type ProgressFormat = 'percent' | 'ratio';

export interface ProgressBarProps
  extends VariantProps<typeof trackStyles>,
    VariantProps<typeof fillStyles> {
  /**
   * ชื่อของสิ่งที่กำลังวัด — **บังคับ**
   *
   * เป็นทั้ง `<label>` ที่มองเห็นและชื่อที่ screen reader ประกาศ
   * แถบที่ไม่มีชื่อบอกไม่ได้ว่ากำลังวัดอะไร
   */
  label: string;

  /**
   * ซ่อน label ด้วยตา แต่ยังประกาศให้ screen reader (§8.1)
   *
   * ใช้กับแถบที่อยู่ในบริบทที่บอกความหมายอยู่แล้ว เช่นในการ์ดที่มีหัวข้อ
   * กำกับด้านบน — แต่ **ห้าม**ใช้เพื่อซ่อนตัวเลข: `note` กับ `format`
   * เป็นคนละเรื่อง เพราะแถบที่ไม่มีทั้งป้ายและตัวเลขคือแถบที่อ่านไม่ได้
   */
  isLabelHidden?: boolean;
  /** ค่าปัจจุบัน — `null` = ยังไม่ทราบ (แสดงข้อความ ไม่ใช่แถบเปล่า) */
  value: number | null;
  /** ค่าสูงสุด · ค่าเริ่มต้น `100` */
  maxValue?: number;
  /**
   * รูปแบบตัวเลขที่แสดง
   *
   * `'percent'` → `78%` · `'ratio'` → `780 / 1,000 ล้านบาท`
   */
  format?: ProgressFormat;
  /** หน่วยที่ต่อท้ายเมื่อ `format="ratio"` */
  unit?: string;
  /** ข้อความอธิบายใต้แถบ เช่นวันที่อัปเดตข้อมูล (ข้อ 01 §4.2) */
  note?: ReactNode;
  /** ข้อความที่แสดงแทนตัวเลขเมื่อ `value` เป็น `null` */
  unknownLabel?: string;
  className?: string;
}

/**
 * แถบความคืบหน้าที่**รู้ค่า**
 *
 * ใช้กับ: โควตาทุนที่จัดสรรไปแล้ว · ความคืบหน้าการอัปโหลด ·
 * จำนวนที่นั่งที่ถูกจอง · ขั้นตอนที่ทำเสร็จแล้วจากทั้งหมด
 *
 * ไม่ใช้กับ: งานที่ไม่รู้ระยะเวลา (`<Skeleton>`) ·
 * ยอดเงินที่ผู้ใช้จะได้รับ (ดูหมายเหตุด้านบน)
 */
export function ProgressBar({
  label,
  isLabelHidden,
  value,
  maxValue = 100,
  format = 'percent',
  unit,
  note,
  unknownLabel,
  size,
  tone,
  className,
}: ProgressBarProps) {
  const { locale } = useSmeGoLocale();
  const s = useStrings();
  const nf = new Intl.NumberFormat(locale);

  /* ค่าที่เกินขอบเขตเป็นข้อผิดพลาดของข้อมูล ไม่ใช่ของผู้ใช้ —
     หนีบไว้เพื่อไม่ให้แถบล้นราง แต่ตัวเลขที่แสดงยังเป็นค่าจริง */
  const clamped = value === null ? 0 : Math.min(Math.max(value, 0), maxValue);
  const percent = maxValue === 0 ? 0 : (clamped / maxValue) * 100;

  const valueText =
    value === null
      ? (unknownLabel ?? s.progress.unknown)
      : format === 'percent'
        ? `${nf.format(Math.round(percent))}%`
        : `${nf.format(value)} / ${nf.format(maxValue)}${unit ? ` ${unit}` : ''}`;

  return (
    <RacProgressBar
      /* value === null → RAC ไม่ประกาศ aria-valuenow ซึ่งถูกต้อง:
         "ไม่ทราบค่า" ต่างจาก "ค่าเป็น 0" */
      value={value === null ? undefined : clamped}
      maxValue={maxValue}
      isIndeterminate={value === null}
      /* ข้อความที่ screen reader ได้ยินต้องตรงกับที่ตาเห็น (SC 2.5.3) */
      aria-valuetext={valueText}
      className={cn('grid min-w-0 gap-1', className)}
    >
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2">
        {/* ★ ต้องเป็น RAC `Label` ไม่ใช่ `<span>` — RAC ต่อ `aria-labelledby`
            ให้เอง · `<span>` ธรรมดาทำให้แถบไม่มีชื่อ (axe: progressbar-name) */}
        <Label
          className={cn(
            'text-body-sm text-fg-secondary',
            isLabelHidden && 'sr-only',
          )}
        >
          {label}
        </Label>
        <span className="text-body-sm text-fg font-numeric">{valueText}</span>
      </div>

      <div className={trackStyles({ size })}>
        {value !== null && (
          <span
            /* แถบเป็นภาพประกอบ — ค่าอยู่ที่ aria-valuetext แล้ว */
            aria-hidden="true"
            style={{ width: `${percent}%` }}
            className={fillStyles({ tone })}
          />
        )}
      </div>

      {note ? <span className="text-caption text-fg-muted">{note}</span> : null}
    </RacProgressBar>
  );
}

export { trackStyles as progressBarStyles };
