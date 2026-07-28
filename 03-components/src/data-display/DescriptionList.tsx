import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · DescriptionList — คู่ชื่อ/ค่าระดับหน้า
   ───────────────────────────────────────────────────────────────────────────
   ★★ **ต่างจาก `EntityMeta` ที่ขอบเขต ไม่ใช่ที่หน้าตา**

   ทั้งคู่เป็น `<dl>` และรับ `{ label, value }[]` เหมือนกัน แต่:

     EntityMeta        อยู่**ในการ์ด** · text-caption · ต้องอ่านออกที่ 136px
     DescriptionList   อยู่**ในหน้าหรือบล็อก** · text-body-sm · มีที่ให้หายใจ

   ห้ามใช้สลับกัน — `DescriptionList` ในการ์ดจะดันการ์ดสูงจนกริดเสียจังหวะ
   ส่วน `EntityMeta` ในหน้าจะเล็กจนอ่านยากบนจอเดสก์ท็อป

   ★★ **`<dt>` ห้ามว่าง**

   `<dt>` ที่ว่างเปล่าไม่ถูกต้องตาม HTML และทำให้ screen reader ประกาศคู่
   ที่ไม่มีชื่อ · ค่าที่อธิบายตัวเองได้ให้วางเป็น `<p>` นอก `<dl>`
   (กฎเดียวกับ `EntityMeta` — ดู EntityCard.tsx)

   ★ **`layout="inline"` ยุบเป็นซ้อนแนวตั้งใต้ md**

   คู่ชื่อ/ค่าแบบ 2 คอลัมน์ที่ 320px ทำให้คอลัมน์ค่าเหลือกว้างไม่พอ
   สำหรับเลข 13 หลักหรือชื่อหน่วยงานยาว ๆ (A2)

   ★ ตัวเลขใช้ `font-numeric` — เลขทะเบียน เลขผู้เสียภาษี และจำนวนเงิน
   ต้องหลักตรงกันเมื่ออยู่หลายบรรทัด (A3)
   ═══════════════════════════════════════════════════════════════════════════ */

const listStyles = cva('min-w-0', {
  variants: {
    layout: {
      /** ชื่ออยู่เหนือค่า — ปลอดภัยทุกความกว้าง */
      stacked: 'grid gap-3',
      /** ชื่อซ้าย ค่าขวา ที่ md ขึ้นไป · ใต้ md ซ้อนแนวตั้ง */
      inline: 'grid gap-3 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] md:gap-x-6 md:gap-y-2',
    },
    divided: {
      true: '',
      false: '',
    },
  },
  defaultVariants: { layout: 'stacked', divided: false },
});

export interface DescriptionListItem {
  /**
   * ชื่อของค่า — **ต้องไม่ว่าง**
   *
   * `<dt>` ว่างไม่ถูกต้องตาม HTML · ค่าที่อธิบายตัวเองได้ให้อยู่นอก `<dl>`
   */
  label: string;
  value: ReactNode;
  /**
   * ค่านี้เป็นตัวเลขที่ต้องหลักตรงกันหรือไม่
   *
   * เลขทะเบียน · เลขผู้เสียภาษี · จำนวนเงิน → `true`
   */
  numeric?: boolean;
}

export interface DescriptionListProps extends VariantProps<typeof listStyles> {
  items: DescriptionListItem[];
  className?: string;
}

/**
 * คู่ชื่อ/ค่าสำหรับแสดงข้อมูลอ้างอิงในหน้า
 *
 * ใช้กับ: ข้อมูลภาษีของผู้ขาย · รายละเอียดคำสั่งซื้อ · เงื่อนไขโครงการ
 *
 * ไม่ใช้กับ: ข้อมูลย่อในการ์ด (`<EntityMeta>`) ·
 * ข้อมูลที่เปรียบเทียบกันหลายรายการ (`<CompareTable>`)
 */
export function DescriptionList({ items, layout, divided, className }: DescriptionListProps) {
  /* `<dl>` เปล่าไม่มีความหมาย — ไม่ render ดีกว่าปล่อยกล่องว่าง
     (พฤติกรรมเดียวกับ EntityMeta) */
  if (items.length === 0) return null;

  return (
    <dl className={cn(listStyles({ layout, divided }), className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'grid min-w-0 gap-0.5',
            layout === 'inline' && 'md:col-span-2 md:grid-cols-subgrid md:gap-0',
            divided && 'border-edge-subtle border-b pb-3 last:border-b-0 last:pb-0',
          )}
        >
          <dt className="text-body-sm text-fg-muted">{item.label}</dt>
          <dd className={cn('text-body-sm text-fg min-w-0', item.numeric && 'font-numeric')}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export { listStyles as descriptionListStyles };
