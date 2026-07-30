'use client';

import type { ReactNode } from 'react';
import { EntityCard, EntityAmount, EntityMeta } from './EntityCard';
import { DeadlineBadge, DeadlineText, type DeadlineStatus } from './Deadline';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · GrantCard — แหล่งทุน
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **เงินที่ไม่ต้องคืนเท่านั้น** — ถ้าต้องคืนเงินต้น ใช้ `<FundingCard>`

   ทุนให้เปล่า · เงินอุดหนุน · เงินร่วมจ่าย → GrantCard
   สินเชื่อทุกชนิดรวมดอกเบี้ย 0% → **FundingCard**
   **เมื่อไม่แน่ใจ ใช้ FundingCard**

   📌 ขอบเขตเดิมของไฟล์นี้เคยรวม "สินเชื่อดอกเบี้ยพิเศษ" ไว้ด้วย ซึ่งทำให้
   เงินให้เปล่ากับหนี้แสดงด้วยรูปแบบเดียวกันเป๊ะ (`วงเงินสูงสุด 500,000`)
   ผู้ใช้ที่กวาดตาผ่านหน้ารวมแยกไม่ออกว่าอันไหนต้องคืน — ตัดออกแล้ว

   ★★★ **"วงเงินสูงสุด" ไม่ใช่ "ราคา"** — จุดที่ผิดพลาดแล้วเสียหายจริง

   ตัวเลข 500,000 บาทบนการ์ดแหล่งทุนหมายถึง **เพดานที่ขอได้**
   ไม่ใช่จำนวนที่จะได้รับ · ผู้สมัครส่วนใหญ่ได้น้อยกว่าเพดานมาก

   `EntityAmount` จึงบังคับ `label` เป็น prop จำเป็น และ GrantCard ส่ง
   `s.card.fundingCeiling` = "วงเงินสูงสุด" ซึ่ง**อยู่เหนือตัวเลขเสมอ**
   ไม่ใช่ต่อท้ายที่อาจถูกตัดที่ 136px

   ★★ **สัดส่วนร่วมจ่ายต้องอยู่บนการ์ด ไม่ใช่ในหน้ารายละเอียด**

   ทุนที่ให้ 500,000 แต่ต้องร่วมจ่าย 50% หมายความว่า SME ต้องมีเงินสด
   500,000 ของตัวเอง — ซึ่งเปลี่ยนคำตอบว่า "สมัครได้ไหม" ทั้งหมด

   ข้อมูลที่เปลี่ยนการตัดสินใจขนาดนี้ **ห้ามซ่อน** (ข้อ 01 §4.3)
   และห้ามอยู่ใน tooltip เพราะผู้ใช้ touch เข้าไม่ถึง

   ★ ทองใช้ได้ที่นี่ — **CTA แหล่งทุนคือกรณีเดียวที่อนุญาต** (ข้อ 02 §9)
   แต่ปุ่มส่งมาจากผู้เรียกผ่าน `footer` การ์ดไม่บังคับสี
   ═══════════════════════════════════════════════════════════════════════════ */

export interface GrantCardProps {
  href: string;
  name: string;
  agency: string;
  /** **เพดานที่ขอได้** ไม่ใช่จำนวนที่ได้รับ */
  fundingCeiling: number;
  /**
   * สัดส่วนที่ผู้ขอต้องร่วมจ่าย เป็นเปอร์เซ็นต์ · `0` = ไม่ต้องร่วมจ่าย
   *
   * ⚠️ **ต้องส่งเสมอ** แม้เป็น 0 — การไม่แสดงกับการแสดง "0%"
   * ให้ข้อมูลต่างกันคนละเรื่อง
   */
  coPaymentPercent: number;
  deadline: string;
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

export function GrantCard({
  href,
  name,
  agency,
  fundingCeiling,
  coPaymentPercent,
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
}: GrantCardProps) {
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
      eyebrow={<DeadlineBadge status={status} daysLeft={daysLeft} />}
      meta={
        <EntityMeta
          items={[
            { label: s.card.agency, value: agency },
            {
              label: s.card.deadline,
              value: <DeadlineText date={deadline} />,
            },
            {
              /* ★ ข้อมูลที่เปลี่ยนคำตอบว่า "สมัครได้ไหม" — ห้ามซ่อน */
              label: s.card.coPayment,
              value: <span className="font-numeric">{coPaymentPercent}%</span>,
            },
          ]}
        />
      }
      amount={
        /* ★★ label = "วงเงินสูงสุด" ไม่ใช่ "ราคา" — อยู่เหนือตัวเลขเสมอ */
        <EntityAmount label={s.card.fundingCeiling} value={fundingCeiling} />
      }
      footer={footer}
    />
  );
}
