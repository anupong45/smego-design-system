'use client';

import { Button as RACButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { Icon, type IconName, type IconSize } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · IconButton — ปุ่มไอคอนล้วน
   ───────────────────────────────────────────────────────────────────────────
   ★ `label` เป็น **prop บังคับ** ไม่ใช่ตัวเลือก
   ปุ่มไอคอนล้วนที่ไม่มีชื่อคือปุ่มที่ screen reader อ่านว่า "ปุ่ม" เฉย ๆ
   TypeScript บังคับให้ผ่าน — ลืมไม่ได้

   ★ ⚠️ ใช้ได้กับ **5 ไอคอนเท่านั้น** (ข้อ 09 §6.2)

     search · x · menu · arrow-left · more-vertical / more-horizontal

   นอกจากนี้ต้องมีข้อความกำกับ เพราะเนื้อหาของ SME.GO — เอกสาร ภาษี
   การรับรอง แหล่งทุน — **ไม่มีสัญลักษณ์สากลอยู่แล้ว** ไอคอนสำหรับ
   "ใบกำกับภาษีอิเล็กทรอนิกส์" ไม่มีทางสื่อความหมายได้เองไม่ว่าจะวาดดีแค่ไหน

   และผู้ใช้กลุ่มหลักคือเจ้าของกิจการอายุ 40–60 ปีที่ไม่ได้คุ้นเคยดิจิทัล
   ซึ่งมีคลังสัญลักษณ์ในหัวเล็กกว่าผู้ใช้แอปทั่วไป

   TypeScript บังคับข้อนี้ผ่าน `AllowedIconOnlyName` — ถ้าจำเป็นต้องใช้
   ไอคอนอื่นจริง ต้องใช้ `<Button icon>` ที่มีข้อความ

   ★ ขนาดเป้าคิดจาก **ไอคอน + padding** ไม่ใช่ค่าตายตัว
     16 + p-1  = 24×24  ✓ พอดีเกณฑ์ SC 2.5.8
     20 + p-2  = 36×36  ✓
     24 + p-2  = 40×40  ✓
   ไม่มีตัวเลือกที่ต่ำกว่า 24 — เลือกผิดไม่ได้
   ═══════════════════════════════════════════════════════════════════════════ */

/** 5 ไอคอนที่ใช้เป็นปุ่มล้วนได้ — บังคับด้วย type ไม่ใช่เอกสาร */
export type AllowedIconOnlyName =
  | 'search'
  | 'x'
  | 'menu'
  | 'arrow-left'
  | 'more-vertical'
  | 'more-horizontal';

const iconButtonStyles = cva(
  [
    'relative inline-flex items-center justify-center',
    'rounded-(--radius-control)',
    'border',
    'transition-colors duration-fast ease-standard',
    'data-disabled:text-fg-disabled data-disabled:border-edge',
    'data-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        /** โปร่งใส — ใช้ใน toolbar และหัว modal */
        ghost: [
          'bg-transparent text-fg border-transparent',
          'data-hovered:bg-sunken',
          'data-pressed:bg-sunken',
        ],
        /** มีขอบ — ใช้เมื่อต้องให้เห็นว่ากดได้ชัดเจน */
        outline: [
          'bg-surface text-fg border-edge-strong',
          'data-hovered:bg-sunken',
          'data-pressed:bg-sunken',
        ],
        /** พื้นทึบแบรนด์ — ใช้กับปุ่มค้นหาในแถบค้นหา */
        solid: [
          'bg-primary-600 text-on-brand border-primary-outline',
          'data-hovered:bg-primary-700',
          'data-pressed:bg-primary-800',
        ],
      },
      /* padding เลือกให้ขนาดเป้ารวมผ่าน 24×24 ทุกตัว */
      size: {
        /** ไอคอน 16 + p-1 → เป้า 24×24 พอดีเกณฑ์ */
        sm: 'p-1',
        /** ไอคอน 20 + p-2 → เป้า 36×36 */
        md: 'p-2',
        /** ไอคอน 24 + p-2 → เป้า 40×40 */
        lg: 'p-2',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

type IconButtonVariants = VariantProps<typeof iconButtonStyles>;

const ICON_FOR_SIZE: Record<NonNullable<IconButtonVariants['size']>, IconSize> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export interface IconButtonProps
  extends Omit<RACButtonProps, 'children' | 'className' | 'style' | 'aria-label'>,
    IconButtonVariants {
  /** จำกัดเป็น 5 ไอคอนที่ผู้ใช้ตีความตรงกันจริง */
  name: AllowedIconOnlyName;

  /**
   * ชื่อปุ่มสำหรับ screen reader — **บังคับ**
   *
   * ⚠️ ต้องเป็นภาษาไทย และถ้ามีข้อความที่มองเห็นเกี่ยวข้องอยู่ ต้องรวมด้วย
   * (SC 2.5.3 Label in Name) เช่นปุ่มลบในแถวของ "เครื่องคั่วกาแฟ"
   * ต้องเป็น `label="ลบ เครื่องคั่วกาแฟ"` ไม่ใช่ `label="ลบ"`
   */
  label: string;

  className?: string;
}

export function IconButton({
  name,
  label,
  variant,
  size,
  className,
  ...rest
}: IconButtonProps) {
  const resolved = size ?? 'md';

  return (
    <RACButton
      aria-label={label}
      className={cn(iconButtonStyles({ variant, size }), className)}
      {...rest}
    >
      {/* ไอคอนเป็นตกแต่ง — ชื่อปุ่มมาจาก aria-label แล้ว
         ถ้าใส่ label ที่ Icon ด้วยจะได้ชื่อซ้อนกันสองชั้น */}
      <Icon name={name} size={ICON_FOR_SIZE[resolved]} />
    </RACButton>
  );
}

export { iconButtonStyles };
