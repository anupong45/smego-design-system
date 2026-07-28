import type { ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Card
   ───────────────────────────────────────────────────────────────────────────
   ★ ตอนพัก **ไม่มีเงา มีแค่ขอบ** — เงาโผล่ตอน hover/focus-within

   เกณฑ์อุปกรณ์ในข้อ 01 คือ Android ระดับล่างบนเน็ต 4G ต่างจังหวัด
   หน้ารายการแสดง card 20–60 ใบ · เงา 2 ชั้นต่อใบ = blur 40–120 ครั้ง
   ต่อ repaint ซึ่งเห็นผลจริงตอน scroll

   และได้ประโยชน์ด้านการออกแบบด้วย — การเปลี่ยนจาก "ไม่มีเงา" เป็น "มีเงา"
   ตาอ่านชัดกว่าการเปลี่ยนจาก sm เป็น md มาก (ข้อ 06 §5)

   ★ ห้ามใช้ `overflow-hidden` บน Card ที่มีลิงก์ข้างใน
   วงแหวน focus ล้นออกนอกขอบ 4px จะถูกตัด = **ไม่ผ่าน SC 2.4.7**
   ใส่ radius ที่ตัว `<img>` เองแทน — ได้ concentric radius ถูกต้องด้วย
   (ข้อ 05 §5 · `radius ใน = radius นอก − padding` · 12 − 8 = 4 = xs)

   ★ ใช้ `--elevation-*` ไม่ใช่ `shadow-*` ตรง
   component ที่เขียน `shadow-md` จะได้เงาติดไปในโหมดมืดซึ่งมองไม่เห็น
   และ **ไม่มีกลไกแยกตัวเองจากพื้นหลังในโหมดมืดเลย**
   `--elevation-*` กำหนดทั้งเงา (สว่าง) และพื้นผิว+ขอบ (มืด) พร้อมกัน
   ═══════════════════════════════════════════════════════════════════════════ */

const cardStyles = cva(
  [
    'min-w-0',
    'rounded-(--radius-container)',
    'border',
    'bg-(--elevation-surface-raised)',
    'border-(--elevation-edge-raised)',
  ],
  {
    variants: {
      /** ระดับการยกขึ้น — ค่าที่ component อ้างได้เท่านั้น */
      elevation: {
        /** อยู่ในกระแสของหน้า · ไม่มีเงาเลย */
        flat: 'shadow-none',
        /** card ตอนพัก · **ไม่มีเงา** ตามเหตุผลด้านบน */
        raised: 'shadow-none',
        /** dropdown · popover · ของที่ลอยทับเนื้อหา */
        floating: [
          'shadow-(--elevation-floating)',
          'bg-(--elevation-surface-floating)',
          'border-(--elevation-edge-floating)',
        ],
        overlay: [
          'shadow-(--elevation-overlay)',
          'bg-(--elevation-surface-overlay)',
          'border-(--elevation-edge-overlay)',
        ],
      },
      /** padding ภายใน · 16px มือถือ → 24px แท็บเล็ตขึ้นไป */
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4 md:p-6',
        lg: 'p-6 md:p-8',
      },
      /**
       * กดได้ทั้งใบ — เงาโผล่ตอน hover **และ focus-within**
       *
       * `focus-within` จำเป็น ไม่ใช่ทางเลือก: ผู้ใช้คีย์บอร์ดต้องได้สัญญาณ
       * เดียวกับผู้ใช้เมาส์ ถ้ามีแค่ `hover` ผู้ใช้ Tab จะไม่เห็นอะไรเลย
       */
      interactive: {
        true: [
          'transition-shadow duration-fast ease-standard',
          'hover:shadow-(--elevation-floating)',
          'focus-within:shadow-(--elevation-floating)',
        ],
        false: '',
      },
      /** เลือกอยู่ — ขอบเป็นสีแบรนด์ (4.76 สว่าง · 3.86 มืด ผ่าน 3:1) */
      selected: {
        true: 'border-edge-brand',
        false: '',
      },
    },
    defaultVariants: {
      elevation: 'raised',
      padding: 'md',
      interactive: false,
      selected: false,
    },
  },
);

export interface CardProps extends VariantProps<typeof cardStyles> {
  children: ReactNode;
  /** ใช้ `article` สำหรับ card สินค้า · `li` เมื่ออยู่ในรายการ */
  as?: ElementType;
  className?: string;
}

export function Card({ children, as: As = 'div', className, ...variants }: CardProps) {
  return <As className={cn(cardStyles(variants), className)}>{children}</As>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CardMedia — ตัวห่อรูปที่ตัดมุมได้อย่างปลอดภัย
   ───────────────────────────────────────────────────────────────────────────── */

export interface CardMediaProps {
  children: ReactNode;
  /** ตำแหน่งในการ์ด — กำหนดว่ามุมไหนโค้ง */
  position?: 'top' | 'full';
  className?: string;
}

/**
 * ห่อรูปใน Card โดย**ไม่ทำให้วงแหวน focus ถูกตัด**
 *
 * `overflow-hidden` อยู่ที่ตัวห่อรูปเท่านั้น ไม่ได้อยู่บน Card
 * จึงตัดเฉพาะรูป ไม่ตัดวงแหวนของลิงก์ที่อยู่ในส่วนเนื้อหา
 *
 * ใช้ logical property (`rounded-ss/se`) เพื่อรองรับ RTL ในอนาคต
 */
export function CardMedia({ children, position = 'top', className }: CardMediaProps) {
  return (
    <div
      className={cn(
        'overflow-hidden',
        position === 'top'
          ? 'rounded-ss-(--radius-container) rounded-se-(--radius-container)'
          : 'rounded-(--radius-container)',
        className,
      )}
    >
      {children}
    </div>
  );
}

export { cardStyles };
