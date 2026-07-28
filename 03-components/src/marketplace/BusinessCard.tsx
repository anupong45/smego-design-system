import type { ReactNode } from 'react';
import { EntityCard, EntityMeta, type EntityMetaItem } from './EntityCard';
import { Badge } from '../data-display/Badge';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · BusinessCard — ธุรกิจหนึ่งราย
   ───────────────────────────────────────────────────────────────────────────
   ★★ **การ์ดที่หายไปจริง ๆ ของมาร์เก็ตเพลส B2B**

   ระบบมีการ์ดสำหรับ สินค้า · บริการ · โครงการ · ทุน · สินเชื่อ · อบรม
   แต่ไม่มีการ์ดสำหรับ **ธุรกิจ** ทั้งที่ผู้ขายทุกรายคือธุรกิจ
   `EntityCard.md §8` สาธิต `SupplierCard` ไว้เป็นต้นแบบแล้ว — นี่คือตัวจริง

   ★★ **ไม่มี slot `amount` เลย — ธุรกิจไม่มีราคา**

   ตัดออกทั้งช่อง ไม่ใช่ส่งค่าว่าง (แบบเดียวกับ `ProgramCard`)
   ถ้าอยากแสดงราคาสินค้าของเจ้านี้ นั่นคือ `<ProductCard>` คนละใบกัน

   ★★★ **`matchReason` ต้องเป็นข้อเท็จจริงที่ตรวจสอบได้**

   ✅ "อยู่ในหมวดเดียวกัน · จังหวัดเดียวกัน" · "เคยผลิตให้ลูกค้าในหมวดของคุณ"
   ❌ "เหมาะกับคุณ 92%" · "AI แนะนำ" · "ตรงกับความต้องการของคุณมาก"

   ข้อ 01 กำหนดว่า **ตัวเลขทุกตัวต้องบอกที่มาได้** คะแนนความเหมาะสม
   ที่ไม่มีสูตรเปิดเผยคือตัวเลขที่บอกที่มาไม่ได้ และมันสร้างความเชื่อถือปลอม
   ในบริบทที่ผู้ใช้กำลังจะฝากงานผลิตจริงให้คนแปลกหน้า

   ★ **`isRecommended` เป็นกรณีเดียวที่ทองปรากฏบนการ์ดนี้**

   `Badge variant="accent"` ถูกจองไว้สำหรับ "แนะนำ · ใหม่ · คัดสรร" อยู่แล้ว
   (Badge.tsx) · จำกัด **1–2 ใบต่อหน้า** — ทองหลายใบแย่งกัน = ไม่มีอะไรเด่น
   (`GrantCard.md §9` · ข้อ 02 §9)

   ★ ใบรับรองเป็นข้อความล้วน ไม่มีไอคอน — ไอคอนโดเมนไทย 14 ตัวยังไม่วาด
   (ข้อ 09 §8.2) และการหยิบไอคอนโล่/ดาวมาใส่คือการอ้างการรับรอง
   ด้วยสัญลักษณ์ที่ไม่มีใครรับรอง (`ProductCard.md §9`)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BusinessCardProps {
  href: string;
  /** ชื่อธุรกิจตามที่จดทะเบียน */
  name: string;
  /**
   * ยืนยันตัวตนกับ DBD/ThaID แล้วหรือไม่
   *
   * ⚠️ **ต้องส่งเสมอ** · `false` = "ยังไม่ยืนยัน" ซึ่งเป็นข้อมูล
   * ไม่ใช่การไม่มีข้อมูล (ตรรกะเดียวกับ `CertificationBadge`)
   */
  isVerified: boolean;
  /** หมวดธุรกิจหลัก เช่น "รับจ้างผลิตอาหาร" */
  category: string;
  /** จังหวัดที่ตั้ง */
  province: string;
  /**
   * เหตุผลที่ระบบเสนอธุรกิจรายนี้
   *
   * ★★★ **ต้องเป็นข้อเท็จจริงที่ตรวจสอบได้** ห้ามเป็นคะแนนความเหมาะสม
   */
  matchReason?: string;
  /** ป้าย "แนะนำ" — ทอง · จำกัด 1–2 ใบต่อหน้า */
  isRecommended?: boolean;
  /** ชื่อใบรับรอง เช่น `['มอก. 2456-2562', 'GMP']` */
  certifications?: string[];
  /** ช่วงจำนวนพนักงาน เช่น "10–50 คน" */
  employeeRange?: string;
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
  headingLevel?: 2 | 3 | 4 | 5;
  as?: 'article' | 'li';
  className?: string;
}

/**
 * การ์ดธุรกิจหนึ่งราย
 *
 * ใช้กับ: ผลการจับคู่ธุรกิจ · รายชื่อผู้ผลิตที่แนะนำ · ไดเรกทอรีซัพพลายเออร์
 *
 * ไม่ใช้กับ: โปรไฟล์เต็มของผู้ขาย → `<SellerProfile>` ·
 * สินค้าของธุรกิจ → `<ProductCard>` · โครงการจับคู่ของรัฐ → `<ProgramCard>`
 */
export function BusinessCard({
  href,
  name,
  isVerified,
  category,
  province,
  matchReason,
  isRecommended,
  certifications,
  employeeRange,
  media,
  actions,
  footer,
  isSelected,
  headingLevel,
  as,
  className,
}: BusinessCardProps) {
  const s = useStrings();

  const items: EntityMetaItem[] = [
    { label: s.card.businessCategory, value: category },
    { label: s.card.province, value: province },
  ];

  if (employeeRange) {
    items.push({ label: s.card.employeeRange, value: employeeRange });
  }

  if (matchReason) {
    /* ★ อยู่ใน <dl> พร้อมชื่อกำกับ — ผู้ใช้ต้องรู้ว่านี่คือ "เหตุผลที่เสนอ"
       ไม่ใช่คำโฆษณาของผู้ขายเอง */
    items.push({ label: s.card.matchReason, value: matchReason });
  }

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
          {isRecommended && <Badge variant="accent">{s.card.recommended}</Badge>}
          {/* ยืนยันแล้ว vs ยังไม่ยืนยัน — ทั้งสองสถานะแสดง ไม่ใช่ซ่อนอันหลัง */}
          <Badge variant={isVerified ? 'success' : 'neutral'}>
            {isVerified ? s.seller.verified : s.seller.unverified}
          </Badge>
          {certifications?.map((c) => (
            <Badge key={c} variant="neutral" showIcon={false}>
              {c}
            </Badge>
          ))}
        </>
      }
      meta={<EntityMeta items={items} />}
      /* ★★ ไม่ส่ง amount — ธุรกิจไม่มีราคา */
      footer={footer}
    />
  );
}
