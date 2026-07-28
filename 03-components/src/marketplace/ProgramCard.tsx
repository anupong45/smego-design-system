import type { ReactNode } from 'react';
import { EntityCard, EntityMeta } from './EntityCard';
import { DeadlineBadge, DeadlineText, type DeadlineStatus } from './Deadline';
import { Badge } from '../data-display/Badge';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ProgramCard — โครงการภาครัฐ
   ───────────────────────────────────────────────────────────────────────────
   ★★ **ไม่มีจำนวนเงิน** — และนั่นคือความต่างหลักจาก GrantCard

   โครงการรัฐจำนวนมากให้ "สิ่งที่ไม่ใช่เงิน": ที่ปรึกษา · การจับคู่ธุรกิจ ·
   พื้นที่ออกงาน · การรับรองมาตรฐาน

   ถ้าการ์ดมีช่องราคาว่างไว้ ผู้ใช้จะคิดว่าข้อมูลไม่ครบ — จึงตัด slot
   `amount` ออกทั้งหมด ไม่ใช่ส่งค่าว่างเข้าไป

   ★★ **หน่วยงานคือข้อมูลความน่าเชื่อถือ ไม่ใช่ metadata**

   บนแพลตฟอร์มภาครัฐ ผู้ใช้ตัดสินใจจาก "ใครเป็นเจ้าของโครงการ" ก่อนอ่าน
   รายละเอียด — สสว. กับ กรมส่งเสริมอุตสาหกรรม มีเงื่อนไขและความเข้มงวด
   ต่างกัน · หน่วยงานจึงอยู่ **บรรทัดแรกของ meta** ไม่ใช่ท้ายสุด

   ★ คุณสมบัติผู้สมัครถูกตัดที่ 2 บรรทัด **โดยตั้งใจ**
   เกณฑ์เต็มยาวเกินกว่าจะอยู่ในการ์ด และการอ่านครึ่งเดียวอันตรายกว่าไม่อ่าน
   — การ์ดบอกแค่ "มีเงื่อนไข" แล้วให้ไปอ่านเต็มในหน้ารายละเอียด
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ProgramCardProps {
  href: string;
  name: string;
  /** หน่วยงานเจ้าของโครงการ เช่น "สสว." */
  agency: string;
  /** สรุปคุณสมบัติสั้น ๆ — ไม่ใช่เกณฑ์เต็ม */
  eligibility?: string;
  /** วันปิดรับ ISO `YYYY-MM-DD` */
  deadline: string;
  /** **prop ไม่ใช่ค่าที่คำนวณ** — ดู `Deadline.tsx` */
  status: DeadlineStatus;
  daysLeft?: number;
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
  headingLevel?: 2 | 3 | 4 | 5;
  as?: 'article' | 'li';
  className?: string;
}

export function ProgramCard({
  href,
  name,
  agency,
  eligibility,
  deadline,
  status,
  daysLeft,
  media,
  actions,
  footer,
  isSelected,
  headingLevel,
  as,
  className,
}: ProgramCardProps) {
  const s = useStrings();

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
          <DeadlineBadge status={status} daysLeft={daysLeft} />
          <Badge variant="neutral" showIcon={false} label="โครงการรัฐ" />
        </>
      }
      meta={
        <EntityMeta
          items={[
            /* หน่วยงานมาก่อน — เป็นข้อมูลความน่าเชื่อถือ */
            { label: s.card.agency, value: agency },
            {
              label: s.card.deadline,
              value: <DeadlineText date={deadline} />,
            },
            ...(eligibility
              ? [
                  {
                    label: s.card.eligibility,
                    /* ตัด 2 บรรทัด — เกณฑ์เต็มอยู่ในหน้ารายละเอียด */
                    value: <span className="line-clamp-2">{eligibility}</span>,
                  },
                ]
              : []),
          ]}
        />
      }
      /* ★ ไม่ส่ง amount เลย — โครงการรัฐไม่ใช่ทุกโครงการที่ให้เงิน */
      footer={footer}
    />
  );
}
