import type { ReactNode } from 'react';
import { EntityCard, EntityAmount, EntityMeta } from './EntityCard';
import { Badge } from '../data-display/Badge';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ProductCard
   ───────────────────────────────────────────────────────────────────────────
   ★ MOQ (สั่งขั้นต่ำ) เป็นข้อมูลระดับเดียวกับราคาใน B2B

   ผู้ซื้อ B2B ที่เห็นราคา 250 บาทแล้วพบทีหลังว่าต้องสั่งขั้นต่ำ 500 ชิ้น
   คือผู้ซื้อที่เสียเวลาไปแล้ว — MOQ จึงอยู่ใน `meta` ของการ์ด
   **ไม่ใช่ในหน้ารายละเอียดอย่างเดียว**

   ★ ใบรับรองใช้ **ข้อความล้วน ไม่มีไอคอน** (ข้อ 09)
   ไอคอนโดเมนไทย (มอก. · ฮาลาล · GMP) ยังไม่มี และการหยิบไอคอน Lucide
   ที่ใกล้เคียงมาใช้แย่กว่าไม่มีไอคอน — โดยเฉพาะกับการรับรองมาตรฐาน
   ที่ความหมายผิดมีผลทางกฎหมาย

   ★ สถานะสต็อกต้องมีทั้ง**รูปทรงและข้อความ** (SC 1.4.1)
   `<Badge>` ผูกไอคอนกับ variant ให้แล้ว
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ProductCardProps {
  href: string;
  name: string;
  /** ราคาต่อหน่วย · `null` = ขอใบเสนอราคา */
  price: number | null;
  /** หน่วยนับ เช่น "ชิ้น" "กิโลกรัม" */
  unit?: string;
  /** จำนวนสั่งขั้นต่ำ */
  moq?: number;
  /** ชื่อผู้ผลิต */
  sellerName: string;
  inStock?: boolean;
  /** ชื่อใบรับรอง เช่น `['มอก. 2456-2562', 'ฮาลาล']` */
  certifications?: string[];
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
  headingLevel?: 2 | 3 | 4 | 5;
  as?: 'article' | 'li';
  className?: string;
}

export function ProductCard({
  href,
  name,
  price,
  unit,
  moq,
  sellerName,
  inStock = true,
  certifications,
  media,
  actions,
  footer,
  isSelected,
  headingLevel,
  as,
  className,
}: ProductCardProps) {
  const s = useStrings();

  /* ชื่อผู้ผลิตอธิบายตัวเองอยู่แล้ว ("ผู้ผลิต บจก. …") จึงเป็น <p>
     ไม่ใช่คู่ใน <dl> — `<dt>` ที่ว่างเปล่าไม่ถูกต้องตาม HTML */
  const meta =
    moq !== undefined
      ? [{ label: s.card.moq, value: `${moq.toLocaleString('en-US')} ${unit ?? s.card.unit}` }]
      : [];

  return (
    <EntityCard
      href={href}
      title={name}
      headingLevel={headingLevel}
      as={as}
      media={media}
      actions={actions}
      isSelected={isSelected}
      className={className}
      eyebrow={
        <>
          <Badge variant={inStock ? 'success' : 'neutral'} label={inStock ? s.card.inStock : s.card.outOfStock} />
          {/* ใบรับรอง — ข้อความล้วน ไม่มีไอคอนที่สื่อความหมายผิด */}
          {certifications?.map((c) => (
            <Badge key={c} variant="neutral" showIcon={false} label={c} />
          ))}
        </>
      }
      meta={
        <>
          <p className="text-caption text-fg-secondary">{s.card.bySeller(sellerName)}</p>
          <EntityMeta items={meta} />
        </>
      }
      amount={
        <EntityAmount
          label={s.card.price}
          value={price}
          note={price === null ? s.card.requestQuote : unit ? `/${unit}` : undefined}
        />
      }
      footer={footer}
    />
  );
}
