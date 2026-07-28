import type { ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Stack — จัดของเรียงกันด้วย gap ไม่ใช่ margin
   ───────────────────────────────────────────────────────────────────────────
   ★ ใช้ `gap` ไม่ใช่ margin (ข้อ 04)
   `gap` ไม่มีปัญหา margin collapse และไม่ต้องมี `:last-child` exception

   ★ `min-w-0` ติดมาโดยค่าเริ่มต้น
   ลูกของ flex มี `min-width: auto` ทำให้ไม่ยอมย่อต่ำกว่าความกว้างเนื้อหา
   ถ้าข้างในมีตารางที่ `overflow-x: auto` จะดัน body ให้เลื่อนแนวนอน
   = **ไม่ผ่าน SC 1.4.10** — พบจริงตอน render เอกสารยาว (วัดได้ 653px ที่ viewport 320)

   ★ ระยะเชิงกล่อง ≠ ระยะเชิงสายตา (ข้อ 04 §5)
   `body` มี line-height 28px บนตัวอักษร 16px = half-leading 6px ในกล่องเอง
   ดังนั้น `gap="2"` (8px) ระหว่างข้อความสองบล็อก **ตาเห็นเป็น ~20px**
   ข้อความซ้อนข้อความจึงใช้ระยะน้อยกว่าที่รู้สึก
   ═══════════════════════════════════════════════════════════════════════════ */

const stackStyles = cva(['flex', 'min-w-0'], {
  variants: {
    direction: {
      column: 'flex-col',
      row: 'flex-row',
      /* ★ ปุ่มคู่บนมือถือ — ปุ่มหลักอยู่บนเมื่อซ้อน อยู่ขวาเมื่อเรียงแนวนอน
         ตรงกับความคาดหวังของผู้ใช้ทั้งสองกรณี (ข้อ 08 §7) */
      'column-reverse': 'flex-col-reverse',
      'row-reverse': 'flex-row-reverse',
    },
    /* ค่าจากชุด spacing ที่อนุมัติเท่านั้น — ไม่มี 7 9 11 14 18 28 */
    gap: {
      '0': 'gap-0',
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '5': 'gap-5',
      '6': 'gap-6',
      '8': 'gap-8',
      '10': 'gap-10',
      '12': 'gap-12',
      '16': 'gap-16',
      '20': 'gap-20',
      '24': 'gap-24',
      '32': 'gap-32',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: '4',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

export interface StackProps extends VariantProps<typeof stackStyles> {
  children: ReactNode;
  /** element ที่ render · ใช้ `ul` `nav` `section` เพื่อความหมายที่ถูก */
  as?: ElementType;
  className?: string;
}

export function Stack({ children, as: As = 'div', className, ...variants }: StackProps) {
  return <As className={cn(stackStyles(variants), className)}>{children}</As>;
}

/** เรียงแนวตั้ง — ค่าเริ่มต้นของ Stack */
export function VStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="column" {...props} />;
}

/** เรียงแนวนอน · `wrap` เปิดไว้เพราะข้อความไทยยาวกว่าอังกฤษ 20–40% */
export function HStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="row" align="center" wrap {...props} />;
}

export { stackStyles };
