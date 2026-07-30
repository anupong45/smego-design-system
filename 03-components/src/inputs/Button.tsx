'use client';

import { Button as RACButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon, type IconName, type IconSize } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Button
   ───────────────────────────────────────────────────────────────────────────
   ★ ความสูงมาจาก line-height + padding ไม่ได้ตั้ง `height` ตรง ๆ

   เหตุผลสองข้อ
   1. ค่าที่ล็อกไว้ในข้อ 30 ถูก *derive* จาก padding อยู่แล้ว:
        text-caption   20px + py-1 (4×2)  + border 2 = 30  (xs · pointer เท่านั้น)
        text-button    20px + py-2 (8×2)  + border 2 = 38  (sm)
        text-button    20px + py-3 (12×2) + border 2 = 46  (md · ค่าเริ่มต้น)
        text-button-lg 24px + py-3 (12×2) + border 2 = 50  (lg)

      ⚠️ ข้อ 30 คำนวณไว้เป็น 28/36/44/48 โดย **ไม่ได้นับ border 1px บน+ล่าง**
         ค่าจริงจากการ render คือ 30/38/46/50 — วัดใน browser แล้ว
         ยอมรับค่าจริง ไม่ลด padding เพราะ 1px ไม่มีในชุด spacing ที่อนุมัติ
         และทุกค่ายังเกิน 24×24 ของ SC 2.5.8 · md ที่ 46px ยังตรงเจตนาเดิม
         คือใกล้เคียง 44–48px ที่ผู้ใช้ไทยคุ้นจาก LINE/Shopee

      และถ้าจะตั้ง `h-*` ก็ทำไม่ได้อยู่ดี — 28px ต้องใช้ spacing 7 ซึ่ง
      **ไม่อยู่ในชุดที่อนุมัติ** {0 0.5 1 2 3 4 5 6 8 10 12 16 20 24 32}

   2. **SC 1.4.12 Text Spacing** — ปุ่มต้องยืดตามเนื้อหาเมื่อผู้ใช้บังคับ
      line-height 1.5 หรือ letter-spacing 0.12em การตั้งความสูงคงที่จะตัดข้อความ

   ★ focus ring ไม่ต้องเขียนที่นี่
   `base.css` ของชั้น 02 จับ `:where(button):focus-visible` ให้แล้ว —
   วงแหวน 2 ชั้น + scroll-margin ครบทั้ง SC 2.4.7 และ 2.4.11

   ★ ห้าม rounded-full (ข้อ 05)
   ข้อความปุ่มไทยยาวกว่าอังกฤษ 20–40% ("ยื่นคำขอ" vs "Apply" = +60%)
   ปุ่มแคปซูลต้องมี padding แนวนอนมากกว่าปกติ เมื่อบวกกันบนจอ 360px จะล้น
   ═══════════════════════════════════════════════════════════════════════════ */

const buttonStyles = cva(
  [
    /* relative เพื่อวาง spinner ทับตอน loading โดยไม่ทำให้ความกว้างเปลี่ยน */
    'relative inline-flex items-center justify-center',
    'rounded-(--radius-control)',
    /* border 1px เสมอทุก variant — สีเป็น transparent ในตัวที่ไม่ต้องใช้
       ทำให้ความกว้างไม่กระโดดระหว่าง variant และเปิดทางให้ *-outline ทำงาน */
    'border',
    'select-none',
    /* เปลี่ยนเฉพาะสีและเงา — ไม่มี transform จึงไม่ถูก reduced-motion ตัด
       และ base.css คืน transition ของสีให้ทำงานอยู่แล้วใน reduce mode */
    'transition-colors duration-fast ease-standard',
    /* ★ disabled หน้าตาเหมือนกันทุก variant โดยตั้งใจ —
       ปุ่มลบที่ disabled ไม่ควรยังดูน่ากลัว และผู้ใช้ต้องแยก "กดไม่ได้" ออกจาก
       "อันตราย" ได้ · ข้อความ disabled ยกเว้นจาก SC 1.4.3 */
    'data-disabled:bg-sunken data-disabled:text-fg-disabled',
    'data-disabled:border-edge data-disabled:cursor-not-allowed',
    /* RAC isPending ปิด press และ hover แต่ **คง focus ไว้** และประกาศให้ SR */
    'data-pending:cursor-wait',
  ],
  {
    variants: {
      variant: {
        /* พื้นทึบ = กดได้ ตามกฎในข้อ 01 · น้ำเงินทึบห้ามใช้กับของที่กดไม่ได้ */
        primary: [
          'bg-primary-600 text-on-brand border-primary-outline',
          'data-hovered:bg-primary-700',
          'data-pressed:bg-primary-800',
        ],
        /* พื้นผิว + ขอบ edge-strong เพราะเป็นขอบเขตของ UI component (SC 1.4.11)
           neutral-300 ที่ 1.56:1 ใช้ไม่ได้ */
        secondary: [
          'bg-surface text-fg border-edge-strong',
          'data-hovered:bg-sunken',
          'data-pressed:bg-sunken',
        ],
        ghost: [
          'bg-transparent text-fg border-transparent',
          'data-hovered:bg-sunken',
          'data-pressed:bg-sunken',
        ],
        danger: [
          'bg-danger-fill text-on-brand border-danger-outline',
          'data-hovered:bg-danger-hover',
          'data-pressed:bg-danger-active',
        ],
        success: [
          'bg-success-fill text-on-brand border-success-outline',
          'data-hovered:bg-success-hover',
          'data-pressed:bg-success-active',
        ],
        /* ★ ทอง — จุดเน้นแบรนด์เท่านั้น ห้ามเป็นสถานะ (ข้อ 02 §9)
           ตัวอักษรต้องเป็น text-on-accent (เข้ม) — ขาวได้แค่ 2.37:1
           ขอบ accent-outline **จำเป็น** ไม่ใช่ตกแต่ง: gold-500 เทียบ canvas
           ได้ 2.25:1 ซึ่งไม่ผ่าน 3:1 ของ SC 1.4.11 · gold-600 ให้ 3.14
           active หยุดที่ 600 เพราะ gold-700 + ตัวอักษรเข้มได้ 3.88 ✗ */
        accent: [
          'bg-accent-fill text-on-accent border-accent-outline',
          'data-hovered:bg-accent-hover',
          'data-pressed:bg-accent-active',
        ],
      },
      size: {
        /* ⚠️ pointer-only — ห้ามใช้บน viewport ที่เป็น touch
           30px ยังเกิน 24×24 จึงผ่าน SC 2.5.8 แต่ต่ำกว่าที่ผู้ใช้ไทยคุ้น */
        xs: 'text-caption px-2 py-1 gap-1',
        sm: 'text-button px-3 py-2 gap-2',
        md: 'text-button px-4 py-3 gap-2',
        lg: 'text-button-lg px-6 py-3 gap-2',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonStyles>;

/** ขนาดไอคอนเลือกจาก **font-size** ของ label ไม่ใช่ line-height (ข้อ 09 §3) */
const ICON_FOR_SIZE: Record<NonNullable<ButtonVariants['size']>, IconSize> = {
  xs: 16, // label 13px → 16 (1.23×)
  sm: 16, // label 14px → 16 (1.14×)
  md: 16, // label 14px → 16 (1.14×)
  lg: 20, // label 16px → 20 (1.25×)
};

export interface ButtonProps
  extends Omit<RACButtonProps, 'children' | 'className' | 'style' | 'isPending'>,
    ButtonVariants {
  /** ข้อความบนปุ่ม — ต้องบอกสิ่งที่จะเกิดขึ้น ไม่ใช่ "ตกลง" (ข้อ 01 §1.2) */
  children: ReactNode;

  /** ไอคอนประกอบ — เป็นไอคอนตกแต่ง จึงได้ `aria-hidden` อัตโนมัติ */
  icon?: IconName;

  /** ตำแหน่งไอคอน · ค่าเริ่มต้น `start` */
  iconPosition?: 'start' | 'end';

  /**
   * กำลังทำงาน — map ไป RAC `isPending`
   *
   * RAC จะปิด press และ hover แต่ **คง focus ไว้** และประกาศสถานะให้
   * screen reader เอง ซึ่งถูกต้องกว่าการตั้ง `disabled` ที่จะดีด focus หลุด
   *
   * ความกว้างปุ่มไม่เปลี่ยน — label ยังอยู่ใน DOM ด้วย `opacity-0`
   * (ไม่ใช้ `invisible` เพราะ `visibility: hidden` จะเอา label ออกจาก a11y tree)
   */
  isLoading?: boolean;

  className?: string;
}

export function Button({
  children,
  icon,
  iconPosition = 'start',
  isLoading = false,
  variant,
  size,
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  const resolvedSize = size ?? 'md';
  const iconSize = ICON_FOR_SIZE[resolvedSize];

  return (
    <RACButton
      isPending={isLoading}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {/* label ยังอยู่ใน a11y tree ตอน loading — opacity ไม่ใช่ visibility */}
      <span
        className={cn(
          'inline-flex items-center',
          resolvedSize === 'xs' ? 'gap-1' : 'gap-2',
          isLoading && 'opacity-0',
        )}
      >
        {icon && iconPosition === 'start' && <Icon name={icon} size={iconSize} />}
        {children}
        {icon && iconPosition === 'end' && <Icon name={icon} size={iconSize} />}
      </span>

      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          {/* .spinner จาก base.css — มีข้อยกเว้น reduced-motion ให้หมุนต่อได้
             เพราะเป็นการเคลื่อนไหวที่ "สื่อข้อมูล" และพื้นที่เล็ก (ข้อ 07 §6.2) */}
          <Icon name="loader" size={iconSize} className="spinner" />
        </span>
      )}
    </RACButton>
  );
}

export { buttonStyles };
