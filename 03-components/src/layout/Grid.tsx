import type { ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Grid + Container
   ───────────────────────────────────────────────────────────────────────────
   ★ กริดสินค้าใช้ `preset="product"` ไม่ใช่ตั้ง cols เอง
   จำนวนคอลัมน์ต่อ breakpoint คำนวณมาแล้วในข้อ 08 §4.1 และมีเงื่อนไขจริง:

     viewport   ไม่มีตัวกรอง   มีตัวกรอง 280px   ความกว้าง card
     320px          2              2 (drawer)        136px  ← แคบสุดที่ต้องรองรับ
     360px          2              2 (drawer)        156px
     768px          3              2 (drawer)        224px
     1024px         4              3                 202px
     1280px         5              4                 210px

   ★ ตัวกรองเป็น drawer จนถึง lg (1024px) ไม่ใช่ md
   คำนวณแล้วว่าที่ 768px การหั่น 720px เป็นตัวกรอง 280 + เนื้อหา 416
   ทำให้ card เหลือ 196px ต่อ 2 ใบ ซึ่ง **แคบกว่า** ตอนไม่มีตัวกรองที่ได้
   3 ใบ 224px — เสียทั้งจำนวนและขนาด

   ★ `min-w-0` บนทุก grid item
   ลูกของ grid มี `min-width: auto` ถ้าข้างในมี `overflow-x: auto`
   จะดัน body ให้เลื่อนแนวนอน = ไม่ผ่าน SC 1.4.10
   ═══════════════════════════════════════════════════════════════════════════ */

const gridStyles = cva(['grid', 'min-w-0', '[&>*]:min-w-0'], {
  variants: {
    /* preset ที่คำนวณไว้แล้ว — ใช้พวกนี้ก่อนตั้ง cols เอง */
    preset: {
      /** กริดสินค้าเต็มความกว้าง ไม่มีแถบตัวกรอง */
      product: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      /** กริดสินค้าที่มีแถบตัวกรองด้านข้าง — ตัวกรองเป็น drawer จนถึง lg */
      'product-filtered': 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      /** card ใหญ่ เช่น โครงการรัฐ แหล่งทุน */
      cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      /** สองคอลัมน์ที่ยุบเป็นหนึ่งบนมือถือ */
      split: 'grid-cols-1 lg:grid-cols-2',
      /** เนื้อหา + แถบข้าง 280px — แถบข้างโผล่ที่ lg */
      sidebar: 'grid-cols-1 lg:grid-cols-[17.5rem_1fr]',
      none: '',
    },
    /** gutter ตามข้อ 08 · 16px มือถือ → 24px แท็บเล็ตขึ้นไป */
    gutter: {
      responsive: 'gap-4 md:gap-6',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
      '8': 'gap-8',
    },
  },
  defaultVariants: {
    preset: 'product',
    gutter: 'responsive',
  },
});

export interface GridProps extends VariantProps<typeof gridStyles> {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Grid({ children, as: As = 'div', className, ...variants }: GridProps) {
  return <As className={cn(gridStyles(variants), className)}>{children}</As>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Container — ความกว้างและ padding ตามข้อ 08 §3
   ───────────────────────────────────────────────────────────────────────────── */

const containerStyles = cva(['mx-auto', 'w-full', 'min-w-0'], {
  variants: {
    size: {
      /** 560px — ฟอร์มเข้าสู่ระบบ ยืนยันตัวตน */
      form: 'max-w-(--container-form)',
      /** 768px — เนื้อหาอ่าน ฟอร์มขั้นตอนเดียว */
      narrow: 'max-w-(--container-narrow)',
      /** 1280px — ค่าเริ่มต้น */
      content: 'max-w-(--container-content)',
      /** 1440px — dashboard และตารางหนาแน่นเท่านั้น */
      wide: 'max-w-(--container-wide)',
      full: 'max-w-none',
    },
    /** 16px มือถือ → 24px แท็บเล็ต → 32px แล็ปท็อปขึ้นไป */
    padded: {
      true: 'px-4 md:px-6 lg:px-8',
      false: '',
    },
  },
  defaultVariants: { size: 'content', padded: true },
});

export interface ContainerProps extends VariantProps<typeof containerStyles> {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Container({ children, as: As = 'div', className, ...variants }: ContainerProps) {
  return <As className={cn(containerStyles(variants), className)}>{children}</As>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section — ระยะเดียวในระบบที่เปลี่ยนตาม breakpoint (48 → 64 → 80px)
   ───────────────────────────────────────────────────────────────────────────── */

export interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Section({ children, as: As = 'section', className }: SectionProps) {
  /* py-(--space-section) — ค่าเปลี่ยนเองตาม media query ใน semantic.css
     เหตุผลที่ responsive: 80px บนจอ 360px กินความสูงไปกว่า 20%
     ส่วน 48px บนจอ 1920px ทำให้ section ดูเชื่อมกันเป็นก้อนเดียว */
  return <As className={cn('py-(--space-section)', className)}>{children}</As>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Divider — เส้นคั่น · ขอบตกแต่ง ยกเว้นจาก SC 1.4.11
   ───────────────────────────────────────────────────────────────────────────── */

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <hr
      /* role="separator" มาจาก <hr> เอง · aria-orientation จำเป็นเมื่อเป็นแนวตั้ง */
      aria-orientation={orientation}
      className={cn(
        'border-0 bg-edge-subtle',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}

export { gridStyles, containerStyles };
