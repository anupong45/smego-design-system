import type { SVGProps } from 'react';
import { cn } from '../lib/cn';
import { iconRegistry, type IconName } from './registry';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Icon
   ───────────────────────────────────────────────────────────────────────────
   ★ stroke ผูกกับขนาดโดยบังคับ — ไม่มี prop ให้ override

   Lucide วาดบนตาราง 24px ด้วย stroke 2 ถ้าใช้ stroke 2 ทุกขนาด สัดส่วนเส้น
   ต่อกล่องจะห่างกัน 3 เท่า (12.50% ที่ 16px → 4.17% ที่ 48px) ทำให้ไอคอน
   16px ดูหนากว่าตัวอักษร label 13px ที่วางข้างกัน ซึ่งกลับลำดับความสำคัญ

   ตารางนี้ให้ช่วงห่าง 1.8 เท่า (9.38% → 5.21%) — สม่ำเสมอกว่าอย่างวัดได้

   ไม่ทำให้คงที่เป๊ะ (8.33%) โดยตั้งใจ:
   • 16px ต้องใช้ 1.33 ซึ่งบนจอ 1× DPI จะถูกปัดบางกว่า 1px และเสี่ยงไม่ผ่าน 3:1
   • 48px ต้องใช้ 4 ซึ่งทำให้ไอคอนกลายเป็นภาพประกอบหนา ๆ ไม่ใช่สัญลักษณ์

   ⚠️ `import { X } from 'lucide-react'` ถูกห้ามด้วย lint
      ต้องใช้ <Icon name="x" /> เท่านั้น
   ═══════════════════════════════════════════════════════════════════════════ */

export type IconSize = 16 | 20 | 24 | 32 | 48;

/** stroke ต่อขนาด — ค่าเดียวกับ --icon-stroke-* ใน 02-tokens/src/semantic.css */
const STROKE: Record<IconSize, number> = {
  16: 1.5,
  20: 1.75,
  24: 2,
  32: 2.5,
  48: 2.5,
};

type SvgPassthrough = Omit<
  SVGProps<SVGSVGElement>,
  'width' | 'height' | 'strokeWidth' | 'stroke' | 'fill' | 'children' | 'aria-label' | 'role'
>;

export interface IconProps extends SvgPassthrough {
  /** ชื่อจาก registry — ดู src/icon/registry.ts */
  name: IconName;

  /**
   * ขนาด px · stroke ถูกกำหนดจากค่านี้โดยอัตโนมัติ
   *
   * เลือกจาก **font-size** ของข้อความข้าง ๆ ไม่ใช่ line-height
   * 13–14px → 16 · 16–18px → 20 · 20px → 24 · 24px → 24 · 28–32px → 32
   */
  size?: IconSize;

  /**
   * มีค่า = ไอคอน **สื่อความหมาย** → ได้ `role="img"` + `aria-label`
   *          และต้องผ่าน contrast 3:1 (SC 1.4.11)
   *          ที่ 16px แนะนำ ≥4.5:1 เพราะ stroke 1.5px บางกว่าตัวอักษร
   *
   * ไม่มีค่า = ไอคอน **ตกแต่ง** → ได้ `aria-hidden="true"` อัตโนมัติ
   *            ใช้เมื่อมีข้อความอยู่ข้าง ๆ แล้ว
   *
   * ⚠️ ต้องเป็นภาษาไทย และถ้ามีข้อความที่มองเห็นอยู่ ต้องรวมข้อความนั้นด้วย
   *    (SC 2.5.3 Label in Name)
   */
  label?: string;
}

export function Icon({ name, size = 20, label, className, ...rest }: IconProps) {
  const Glyph = iconRegistry[name];

  return (
    <Glyph
      /* data-icon ให้ base.css จับได้: stroke=currentColor · fill=none · flex-shrink=0
         flex-shrink สำคัญเพราะไอคอนใน flex ที่มีข้อความไทยยาวจะถูกบีบจนเบี้ยว
         ซึ่งเกิดบ่อยที่ 320–360px */
      data-icon=""
      width={size}
      height={size}
      /* ★ ไม่มีทางให้ override — เป็นการตัดสินใจของ API ไม่ใช่การละเลย */
      strokeWidth={STROKE[size]}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      /* ป้องกัน SVG ติด tab order ใน browser เก่า */
      focusable="false"
      className={cn(className)}
      {...rest}
    />
  );
}

export type { IconName };
