'use client';

import {
  ToggleButton as RACToggleButton,
  type ToggleButtonProps as RACToggleButtonProps,
  Button as RACButton,
} from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Token — ตัวกรองที่กดได้ · **มีสถานะเลือก/ไม่เลือก**   (เดิมชื่อ Chip — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ไม่ใช่ component ใหม่ข้าง Chip — Astryx มี `Token` แต่รอบ 2026-07-26
   ตัดสินไว้แล้วว่านี่คือ**ชื่อใหม่ของ Chip** เท่านั้น (§1.4 D9) ห้ามมีทั้ง
   Chip และ Token พร้อมกันในระบบ
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `label` บังคับ (เดิมรับ `children`) ตาม §8.1
   ไม่รับ `size` `color` `onRemove` `href` `endContent` `description`
          `isLabelHidden` ของ Astryx — `onRemove` มีอยู่แล้วใน `RemovableChip`
          แยกต่างหาก ไม่ใช่ prop ของ `Token`
   ───────────────────────────────────────────────────────────────────────────
   ★ ต่างจาก Badge: Chip **กดได้** จึงต้องเป็นเป้า ≥24×24 และมี focus + aria-pressed
   ถ้าเป็นข้อมูลอ่านอย่างเดียว ใช้ `<Badge>`

   ★ ใช้ RAC `ToggleButton` ไม่ใช่ `Button`
   ToggleButton ให้ `aria-pressed` และ `data-selected` มาเอง ซึ่งจำเป็น
   เพราะ chip ตัวกรองมีสถานะค้าง ไม่ใช่การกระทำครั้งเดียว

   ★ `rounded-full` ใช้ได้ที่นี่ (ข้อ 05)
   chip เป็นหนึ่งใน 4 อย่างที่อนุญาต เพราะ **ข้อความสั้นเสมอ**
   และความกว้างไม่คงที่ไม่ใช่ปัญหา — ต่างจากปุ่มที่ข้อความไทยยาว 20–40%
   แล้วทำให้แคปซูลล้นที่ 360px

   ★ ⚠️ chip ตัวกรองที่เลือกไว้ต้อง **เห็นค้าง** ห้ามยุบเป็น "ตัวกรอง (3)"
   หลัก recognition over recall ในข้อ 01 §4.3 — ผู้ใช้ที่กรองสินค้า 4 เงื่อนไข
   ต้องเห็นทั้ง 4 ตลอดเวลา ไม่ใช่ต้องจำว่าเลือกอะไรไว้

   ★ เป้า 24×24 · `py-1` + text-caption(20px) + border = 30px ✓
   บนมือถือแถว chip ควรเลื่อนแนวนอนได้พร้อม scroll-snap
   ไม่ใช่ตัดบรรทัด เพราะ chip ไทยกว้างกว่าและจะหลุดแถวเร็ว
   ═══════════════════════════════════════════════════════════════════════════ */

const chipStyles = cva(
  [
    'inline-flex items-center gap-1',
    'text-caption',
    'rounded-full',
    'border',
    'px-3 py-1',
    'w-auto max-w-full min-w-0',
    /* ยืดตามเนื้อหา — SC 1.4.12 */
    'transition-colors duration-fast ease-standard',
    'data-disabled:bg-sunken data-disabled:text-fg-disabled',
    'data-disabled:border-edge data-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      /* ไม่เลือก = พื้นผิว + ขอบ · เลือกแล้ว = tint แบรนด์ + ขอบแบรนด์
         **ไม่ใช้พื้นทึบน้ำเงิน** เพราะจะชนกฎ "น้ำเงินทึบ = กดได้" ที่สงวนไว้
         ให้ปุ่ม — chip ที่เลือกแล้วยังกดได้ (เพื่อยกเลิก) แต่ไม่ใช่ CTA */
      selected: {
        false: [
          'bg-surface text-fg-secondary border-edge-strong',
          'data-hovered:bg-sunken data-hovered:text-fg',
        ],
        true: [
          'bg-selected-surface text-selected-fg border-edge-brand',
          'data-hovered:bg-selected-hover',
        ],
      },
    },
    defaultVariants: { selected: false },
  },
);

export interface TokenProps
  extends Omit<RACToggleButtonProps, 'children' | 'className' | 'style'> {
  /** ข้อความบน token — บังคับเสมอเพื่อ accessible name (§8.1) */
  label: string;
  /** ไอคอนนำ — ตกแต่ง ได้ `aria-hidden` อัตโนมัติ */
  icon?: IconName;
  className?: string;
}

/**
 * Token แบบ toggle — ใช้กับตัวกรองที่เปิด/ปิดได้
 *
 * RAC `ToggleButton` ให้ `aria-pressed` และ `data-selected` มาเอง
 */
export function Token({ label, icon, className, ...rest }: TokenProps) {
  return (
    <RACToggleButton
      className={({ isSelected }) => cn(chipStyles({ selected: isSelected }), className)}
      {...rest}
    >
      {icon && <Icon name={icon} size={16} />}
      {label}
    </RACToggleButton>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RemovableChip — chip ที่ลบได้ · ใช้แสดงตัวกรองที่เลือกไว้
   ───────────────────────────────────────────────────────────────────────────── */

export interface RemovableChipProps {
  /** ข้อความบน chip */
  children: ReactNode;
  /**
   * ชื่อตัวกรองสำหรับ `aria-label` ของปุ่มลบ
   *
   * ถ้าไม่ส่ง จะใช้ `children` ที่เป็น string · **ต้องส่งเมื่อ children
   * ไม่ใช่ข้อความล้วน** ไม่เช่นนั้นปุ่มลบจะไม่มีชื่อที่มีความหมาย
   */
  label?: string;
  onRemove: () => void;
  icon?: IconName;
  className?: string;
}

export function RemovableChip({
  children,
  label,
  onRemove,
  icon,
  className,
}: RemovableChipProps) {
  const s = useStrings();
  const name = label ?? (typeof children === 'string' ? children : '');

  return (
    <span className={cn(chipStyles({ selected: true }), 'pe-1', className)}>
      {icon && <Icon name={icon} size={16} />}
      {children}

      {/* ปุ่มลบเป็นเป้าแยกจาก chip
         16 + p-1 = 24×24 ✓ พอดีเกณฑ์ SC 2.5.8

         ⚠️ aria-label รวมชื่อตัวกรองด้วย ไม่ใช่ "ลบ" เฉย ๆ —
         ในแถวที่มี chip 5 อัน ปุ่มที่ชื่อ "ลบ" ทั้ง 5 อันแยกกันไม่ได้
         สำหรับผู้ใช้ screen reader (SC 2.5.3) */}
      <RACButton
        aria-label={s.filter.removeFilter(name)}
        onPress={onRemove}
        className={cn(
          'ms-1 inline-flex items-center justify-center p-1',
          'rounded-full',
          'transition-colors duration-fast ease-standard',
          'data-hovered:bg-selected-strong',
        )}
      >
        <Icon name="x" size={16} />
      </RACButton>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ChipRow — แถว chip ที่เลื่อนแนวนอนได้บนมือถือ
   ───────────────────────────────────────────────────────────────────────────── */

export interface ChipRowProps {
  children: ReactNode;
  /** ป้ายกลุ่มสำหรับ screen reader เช่น "ตัวกรองที่เลือก" */
  label: string;
  className?: string;
}

/**
 * แถว chip ที่เลื่อนแนวนอนใน**กล่องตัวเอง**
 *
 * ⚠️ `overflow-x-auto` อยู่ที่นี่ ไม่ใช่ที่ body — ถ้า body เลื่อนแนวนอน
 * จะเป็นการเลื่อนสองทิศทาง = ไม่ผ่าน SC 1.4.10
 *
 * ⚠️ `min-w-0` จำเป็นเพราะถ้าเป็นลูกของ flex/grid จะไม่ยอมย่อ
 * แล้วดัน body ให้เลื่อน — พบจริงตอน render เอกสารยาว
 *
 * `scroll-snap` ทำให้ chip หยุดตรงขอบ ไม่ค้างครึ่งตัว
 */
export function ChipRow({ children, label, className }: ChipRowProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex min-w-0 items-center gap-2',
        'relative overflow-x-auto',
        'snap-x snap-mandatory',
        /* ซ่อน scrollbar บนเดสก์ท็อปแต่ยังเลื่อนได้ — บนมือถือไม่มีอยู่แล้ว */
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        /* ★ `p-1` = 4px รอบด้าน — เท่ากับที่วงแหวน focus ล้นออกนอกขอบพอดี
           (`outline 2px` + `outline-offset 2px`)

           `overflow-x: auto` สร้าง scroll container ที่ตัด overflow **ทั้งสองแกน**
           ไม่ใช่แค่แกนนอน ถ้าไม่มี padding นี้ วงแหวนของ chip จะถูกตัด
           ทั้งด้านบน-ล่าง และด้านซ้ายของ chip ตัวแรกตอน scrollLeft = 0
           = ไม่ผ่าน SC 2.4.7 (ข้อ 05 §5) */
        'p-1',
        '[&>*]:snap-start [&>*]:shrink-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export { chipStyles };
