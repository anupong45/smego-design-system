'use client';

import {
  RadioGroup as RACRadioGroup,
  Radio as RACRadio,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · SegmentedControl — สลับ **มุมมองของเนื้อหาเดิม**
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **กฎแบ่งเขต 4 ทาง** (ฉบับเดียวกับที่ `TabList.tsx` เขียนไว้ — แก้ทั้งคู่เสมอ)

     `TabList`           สลับ **panel คนละชุด** — เนื้อหาต่างกันจริง
                         เนื้อหาที่ไม่ได้เลือก**ไม่อยู่ใน DOM**
     `SegmentedControl`  สลับ **มุมมองของเนื้อหาเดิม** — ตาราง/รายการ ·
                         เรียงตามราคา/ตามใหม่ · ข้อมูลชุดเดิมแสดงคนละแบบ
     `RadioList`         **ค่าในฟอร์ม** ที่รอกดส่ง — มี label · error · ส่งกับฟอร์ม
     `Token`             **ตัวกรอง** ที่เลือกได้หลายอัน · `aria-pressed`

   คำถามที่แยกได้เร็วที่สุด:
     "เนื้อหาที่ไม่ได้เลือกยังต้องอยู่ใน DOM ไหม" → ไม่ = TabList
     "มีผลเมื่อกดบันทึกไหม"                      → ใช่ = RadioList
     "เลือกได้หลายอันไหม"                        → ใช่ = Token
     ที่เหลือ                                     → SegmentedControl

   ★★ **เป็น `radiogroup` ไม่ใช่ `tablist`** (ตาม Astryx)

   เพราะไม่มี panel ให้ควบคุม — มันคือ **การเลือกหนึ่งจากหลายตัว** ที่มีผล
   ทันที · ใช้ RAC `RadioGroup` ซึ่งให้ roving tabindex + ลูกศรเลื่อนแล้วเลือก
   ทันทีมาให้ (เหมือน `RadioList` เพราะเป็น pattern เดียวกันในระดับ ARIA)

   ⚠️ **ต่างจาก `RadioList` ที่ระดับ API ไม่ใช่ระดับ ARIA** — `RadioList` มี
   `label` ที่มองเห็น · `status` · `isOptional` เพราะเป็นช่องกรอกในฟอร์ม
   ส่วนตัวนี้ `label` เป็น `aria-label` ที่**ไม่แสดง** เพราะมันเป็นตัวควบคุม
   มุมมอง ไม่ใช่คำถามที่รอคำตอบ

   ★★ **มีผลทันที ไม่มีปุ่มยืนยัน**
   เหมือน `Switch` (ดู `Switch.tsx` หัวไฟล์: "Switch → มีผลทันที ·
   CheckboxInput → รอกดบันทึก") — ถ้าสิ่งที่เลือกต้องรอกดบันทึก นั่นคือ
   `RadioList` ไม่ใช่ตัวนี้

   ★ **พื้นของตัวที่เลือกไม่ใช่น้ำเงินทึบ**
   "พื้นทึบน้ำเงิน = CTA" ถูกสงวนไว้ให้ปุ่มหลัก (ข้อ 05) · ตัวที่เลือกใช้
   `bg-surface` ยกตัวขึ้นจากรางที่เป็น `bg-sunken` — สำนวนเดียวกับ
   segmented control ของ iOS/macOS ที่ผู้ใช้คุ้นอยู่แล้ว
   ═══════════════════════════════════════════════════════════════════════════ */

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

/** ★ `min-h-*` ไม่ใช่ `h-*` — เหมือน `Pagination` และ `TabList` (D1 · SC 1.4.12) */
const SIZE: Record<SegmentedControlSize, string> = {
  sm: '[&>*]:min-h-9 [&>*]:text-caption',
  md: '[&>*]:min-h-11 [&>*]:text-button',
  lg: '[&>*]:min-h-12 [&>*]:text-button-lg',
};

export interface SegmentedControlProps {
  /** ค่าที่เลือกอยู่ */
  value: string;

  /** เรียกเมื่อเลือก — **มีผลทันที** ไม่มีปุ่มยืนยัน */
  onChange: (value: string) => void;

  /**
   * ชื่อ accessible ของกลุ่ม — **บังคับ** และ **ไม่แสดงด้วยตา**
   *
   * ต่างจาก `RadioList` ที่ `label` เป็นข้อความที่เห็นได้ เพราะตัวนี้เป็น
   * ตัวควบคุมมุมมอง ไม่ใช่คำถามในฟอร์ม
   */
  label: string;

  /** `<SegmentedControlItem>` */
  children: ReactNode;

  /** ขนาดเป้ากด · ค่าเริ่มต้น `md` (44px) */
  size?: SegmentedControlSize;

  /** `hug` = กว้างตามเนื้อหา (ค่าเริ่มต้น) · `fill` = แบ่งเท่ากันเต็มความกว้าง */
  layout?: 'hug' | 'fill';

  isDisabled?: boolean;

  className?: string;
}

export function SegmentedControl({
  value,
  onChange,
  label,
  children,
  size = 'md',
  layout = 'hug',
  isDisabled = false,
  className,
}: SegmentedControlProps) {
  return (
    <RACRadioGroup
      aria-label={label}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      orientation="horizontal"
      className={cn(
        /* รางเป็นพื้นจม — ตัวที่เลือกจะยกขึ้นมาจากราง */
        'inline-flex min-w-0 items-stretch gap-1',
        'rounded-(--radius-control) border border-edge bg-sunken p-1',
        layout === 'fill' && 'w-full [&>*]:flex-1',
        /* ★ ขนาดกำหนดจากพ่อแม่ — item ทุกอันในรางเดียวกันต้องสูงเท่ากัน
           ถ้าให้ item รับ `size` เองจะเปิดช่องให้สูงไม่เท่ากันแล้วรางเบี้ยว */
        SIZE[size],
        className,
      )}
    >
      {children}
    </RACRadioGroup>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SegmentedControlItem
   ───────────────────────────────────────────────────────────────────────────── */

export interface SegmentedControlItemProps {
  /** ค่าที่จับคู่กับ `value` ของ `SegmentedControl` */
  value: string;

  /** ข้อความบนปุ่ม — **บังคับ** (§8.1) */
  label: string;

  /** ซ่อน label ด้วยตา เหลือแต่ไอคอน — ยังเป็น accessible name */
  isLabelHidden?: boolean;

  /** ไอคอนนำ */
  icon?: ReactNode;

  isDisabled?: boolean;

  className?: string;
}

export function SegmentedControlItem({
  value,
  label,
  isLabelHidden = false,
  icon,
  isDisabled = false,
  className,
}: SegmentedControlItemProps) {
  return (
    <RACRadio
      value={value}
      aria-label={isLabelHidden ? label : undefined}
      isDisabled={isDisabled}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
        'rounded-(--radius-xs) px-3',
        'text-fg-secondary',
        'transition-colors duration-fast ease-standard',
        'data-hovered:text-fg',
        /* ★ ที่เลือกอยู่ **ยกขึ้นจากราง** ด้วยพื้น + เงา ไม่ใช่น้ำเงินทึบ
           (ข้อ 05 สงวนน้ำเงินทึบให้ CTA) · RAC ให้ aria-checked มาแล้ว
           จึงไม่พึ่งสีเป็นตัวบอกสถานะเดียว (SC 1.4.1) */
        'data-selected:bg-surface data-selected:text-fg data-selected:font-medium',
        'data-selected:shadow-(--elevation-raised)',
        'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
        'data-focus-visible:outline-2',
        className,
      )}
    >
      {icon}
      {!isLabelHidden && <span className="min-w-0">{label}</span>}
    </RACRadio>
  );
}
