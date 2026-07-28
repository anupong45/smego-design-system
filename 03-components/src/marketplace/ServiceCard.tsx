import type { ReactNode } from 'react';
import { EntityCard, EntityAmount, EntityMeta } from './EntityCard';
import { Badge } from '../data-display/Badge';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ServiceCard
   ───────────────────────────────────────────────────────────────────────────
   ★★ ค่าบริการมี **5 รูปแบบที่ต่างกันเชิงโครงสร้าง** ไม่ใช่แค่ตัวเลขต่างกัน

     `per-project`  ราคาเหมา — ผู้ซื้อรู้ยอดสุดท้าย
     `per-hour`     ราคาต่อชั่วโมง — **ยอดสุดท้ายยังไม่รู้**
     `per-month`    ★ **ภาระผูกพันต่อเนื่อง** — ไม่มีวันจบ
     `per-year`     ★ ภาระผูกพันต่อเนื่อง รอบปี
     `quote`        ต้องคุยก่อน — ไม่มีตัวเลขเลย

   ถ้าแสดงทั้งห้าแบบเป็น "12,000 บาท" เหมือนกัน ผู้ซื้อจะเปรียบเทียบผิด
   `pricingModel` จึงเป็น prop จำเป็น ไม่มีค่าเริ่มต้น — **เลือกไม่ได้ว่าจะไม่ระบุ**

   ★★★ **subscription บังคับแสดงยอดรวมต่อปี**

   SME ที่เห็น "990 บาท" แล้วเข้าใจว่าจ่ายครั้งเดียว จะเจอบิลปีละ 11,880
   ซึ่งเป็นความเสียหายทางการเงินแบบเดียวกับที่ GrantCard ป้องกัน แค่กลับทิศ
   — ที่นั่นตัวเลขดูใหญ่เกินจริง ที่นี่ดูเล็กเกินจริง

   ยอดรวมต่อปีอยู่ใน `<EntityMeta>` **พร้อมชื่อกำกับ** ไม่ใช่ต่อท้ายตัวเลข
   เพราะที่ 136px ท้ายบรรทัดถูกตัดก่อน (`GrantCard.md §9`)

   ★ `quote` ไม่ใช่ "ราคา 0" และไม่ใช่ค่าว่าง
   เป็นสถานะของตัวมันเอง — การ์ดแสดงคำว่า "ขอใบเสนอราคา" ในตำแหน่งที่
   ราคาควรอยู่ เพื่อให้สแกนกริดแล้วยังเทียบกันได้

   ★ ระยะเวลาดำเนินการ (lead time) สำคัญเท่าราคาสำหรับบริการ
   ผู้ซื้อที่ต้องส่งงานใน 2 สัปดาห์ไม่สนใจบริการที่ใช้เวลา 2 เดือน
   ไม่ว่าราคาจะดีแค่ไหน
   ═══════════════════════════════════════════════════════════════════════════ */

export type ServicePricingModel =
  | 'per-project'
  | 'per-hour'
  | 'per-month'
  | 'per-year'
  | 'quote';

/** รูปแบบที่เป็นภาระผูกพันต่อเนื่อง — ต้องแสดงยอดรวมต่อปี */
const SUBSCRIPTION_MODELS: ServicePricingModel[] = ['per-month', 'per-year'];

export interface ServiceCardProps {
  href: string;
  name: string;
  /** **บังคับ** — ดูเหตุผลด้านบน */
  pricingModel: ServicePricingModel;
  /** ค่าบริการ — ไม่ต้องส่งเมื่อ `pricingModel` เป็น `'quote'` */
  fee?: number;
  /** ระยะเวลาดำเนินการ เช่น "2–3 สัปดาห์" */
  leadTime?: string;
  /** ชื่อผู้ให้บริการ */
  sellerName: string;
  certifications?: string[];
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
  headingLevel?: 2 | 3 | 4 | 5;
  as?: 'article' | 'li';
  className?: string;
}

export function ServiceCard({
  href,
  name,
  pricingModel,
  fee,
  leadTime,
  sellerName,
  certifications,
  media,
  actions,
  footer,
  isSelected,
  headingLevel,
  as,
  className,
}: ServiceCardProps) {
  const s = useStrings();

  const note =
    pricingModel === 'quote'
      ? s.card.requestQuote
      : pricingModel === 'per-hour'
        ? s.card.perHour
        : pricingModel === 'per-month'
          ? s.card.perMonth
          : pricingModel === 'per-year'
            ? s.card.perYear
            : s.card.perProject;

  /* ผู้ให้บริการเป็น <p> ไม่ใช่คู่ใน <dl> — ดู ProductCard */
  const meta: { label: string; value: ReactNode }[] = leadTime
    ? [{ label: s.card.leadTime, value: leadTime }]
    : [];

  /* ★★★ ยอดรวมต่อปีบังคับสำหรับ subscription — ผู้ซื้อต้องเห็นภาระจริง
     ไม่ใช่ยอดต่องวดที่ดูเล็ก · อยู่ใน <dl> พร้อมชื่อ ไม่ต่อท้ายตัวเลข */
  if (SUBSCRIPTION_MODELS.includes(pricingModel) && fee !== undefined) {
    const yearly = pricingModel === 'per-month' ? fee * 12 : fee;
    meta.unshift({
      label: s.card.perYear,
      value: (
        <span className="font-numeric">
          {new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(yearly)}{' '}
          {s.common.currency}
        </span>
      ),
    });
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
          <Badge variant="info" showIcon={false}>
            บริการ
          </Badge>
          {certifications?.map((c) => (
            <Badge key={c} variant="neutral" showIcon={false}>
              {c}
            </Badge>
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
          label={s.card.serviceFee}
          /* quote ไม่มีตัวเลข — null ทำให้ EntityAmount แสดง note แทน */
          value={pricingModel === 'quote' ? null : (fee ?? null)}
          note={note}
        />
      }
      footer={footer}
    />
  );
}
