'use client';

import type { ReactNode } from 'react';
import { EntityCard, EntityAmount, EntityMeta, type EntityMetaItem } from './EntityCard';
import { DeadlineBadge, DeadlineText, type DeadlineStatus } from './Deadline';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · FundingCard — สินเชื่อ · เงินที่ต้องคืน
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **เส้นแบ่งกับ GrantCard มีข้อเดียว: ผู้รับต้องคืนเงินต้นหรือไม่**

   คืน → FundingCard · ไม่คืน → GrantCard
   **เมื่อไม่แน่ใจ ใช้ FundingCard**

   กฎ "เมื่อไม่แน่ใจ" ไม่ใช่ความขี้เกียจ — เป็นการเลือกทิศทางของความผิดพลาด
   อย่างตั้งใจ · เห็น "ทุน" แล้วรู้ทีหลังว่าเป็นหนี้ เสียหายกว่าเห็น "สินเชื่อ"
   แล้วรู้ทีหลังว่าไม่ต้องคืน · เคสที่ตัดสินไว้แล้ว:

     สินเชื่อดอกเบี้ย 0% ปลอดต้น 2 ปี      → FundingCard (ยังคืนเงินต้น)
     ทุนที่ต้องคืนถ้าโครงการล้มเหลว        → FundingCard (กฎเมื่อไม่แน่ใจ)
     สินเชื่อที่ยกหนี้ให้ถ้าจ้างงานครบเป้า → FundingCard (กฎเมื่อไม่แน่ใจ)
     เงินอุดหนุนร่วมจ่าย 50%               → GrantCard  (ร่วมจ่าย ≠ คืน)

   ★★ **`label` = "วงเงินกู้สูงสุด" ไม่ใช่ "วงเงินสูงสุด"**

   คำว่า "กู้" คือทั้งหมดของความต่างที่ผู้ใช้จะเห็นตอนกวาดตาผ่านหน้ารวม
   ที่มีทั้งทุนและสินเชื่อปนกัน · ห้ามย่อ (บทเรียนเดียวกับ GrantCard §9
   ที่ห้ามย่อ "วงเงินสูงสุด" เหลือ "วงเงิน")

   ★★ **สามค่าบังคับ และ `null` แปลว่า "ยังไม่ประกาศ" ไม่ใช่ "ไม่มี"**

   `interestRate` · `termMonths` · `collateral` ต้องส่งเสมอ เพราะการไม่แสดง
   กับการแสดงให้ข้อมูลต่างกันคนละเรื่อง (ตรรกะเดียวกับ `coPaymentPercent`
   ของ GrantCard) · แต่แหล่งข้อมูลจริงของหน่วยงานมักไม่ครบ จึงรับ `null`
   ที่**แสดงออกมาตรง ๆ ว่ายังไม่ประกาศ** ไม่ใช่ละไว้เงียบ ๆ

   ⚠️ ห้ามเดา — เดา `collateral: 'none'` เพราะดูปลอดภัยดี คือการบอกผู้ใช้
   ว่ากู้ได้โดยไม่ต้องมีหลักประกัน ซึ่งอาจไม่จริงและทำให้เสียเวลาทั้งกระบวนการ
   (ขัดข้อ 01 §4.1 "บอกเงื่อนไขก่อนขอข้อมูล")

   ★ **`collateral` เป็น union 3 ค่า ไม่ใช่ `boolean`**

   "ใช้ บสย. ค้ำแทนได้" คือทางออกจริงของ SME ที่ไม่มีที่ดินค้ำ · `boolean`
   จะบีบเคสนี้ให้กลายเป็น `true` (ต้องมี) ทำให้คนที่กู้ได้จริงเลิกสนใจไปเลย
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * เงื่อนไขหลักประกัน
 *
 * `null` = ยังไม่ประกาศ · **ห้ามเดาเป็น `'none'`**
 */
export type CollateralRequirement = 'none' | 'required' | 'bsy';

export interface FundingCardProps {
  href: string;
  name: string;
  /** ธนาคารหรือหน่วยงานเจ้าของโครงการ */
  agency: string;
  /** **เพดานที่กู้ได้** ไม่ใช่จำนวนที่จะได้รับจริง */
  loanCeiling: number;
  /**
   * อัตราดอกเบี้ยต่อปี เป็นเปอร์เซ็นต์ · `0` = ไม่มีดอกเบี้ย
   *
   * ⚠️ **ต้องส่งเสมอ** · `null` = ยังไม่ประกาศ ห้ามเดา
   */
  interestRate: number | null;
  /**
   * ระยะเวลาผ่อนชำระเป็นเดือน
   *
   * ⚠️ **ต้องส่งเสมอ** · 500,000 ผ่อน 3 ปี กับ 10 ปี ยอดต่องวดต่างกัน 3 เท่า
   */
  termMonths: number | null;
  /**
   * เงื่อนไขหลักประกัน
   *
   * ⚠️ **ต้องส่งเสมอ** · ตัวตัดสินอันดับหนึ่งว่า SME รายนี้กู้ได้จริงหรือไม่
   */
  collateral: CollateralRequirement | null;
  /** ปลอดชำระเงินต้นกี่เดือน — ไม่ใช่ทุกโครงการมี */
  gracePeriodMonths?: number;
  /** ค่าธรรมเนียมค้ำประกัน บสย. ต่อปี เป็นเปอร์เซ็นต์ */
  guaranteeFeePercent?: number;
  /** ISO `YYYY-MM-DD` (ค.ศ.) — สินเชื่อที่เปิดตลอดไม่ต้องส่ง */
  deadline?: string;
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

/**
 * การ์ดสินเชื่อ — เงินที่ผู้รับต้องคืนเงินต้น
 *
 * ใช้กับ: สินเชื่อดอกเบี้ยพิเศษของรัฐ · soft loan · สินเชื่อ SME ของธนาคาร ·
 * ทุนที่มีเงื่อนไขต้องคืน
 *
 * ไม่ใช้กับ: ทุนให้เปล่าและเงินอุดหนุน → `<GrantCard>` ·
 * โครงการที่ไม่ให้เงิน → `<ProgramCard>`
 */
export function FundingCard({
  href,
  name,
  agency,
  loanCeiling,
  interestRate,
  termMonths,
  collateral,
  gracePeriodMonths,
  guaranteeFeePercent,
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
}: FundingCardProps) {
  const s = useStrings();

  const collateralText =
    collateral === null
      ? s.card.notAnnounced
      : collateral === 'none'
        ? s.card.collateralNone
        : collateral === 'bsy'
          ? s.card.collateralBsy
          : s.card.collateralRequired;

  const items: EntityMetaItem[] = [
    { label: s.card.agency, value: agency },
    {
      /* ★ "ไม่มีดอกเบี้ย" ต่างจาก "ยังไม่ประกาศ" — ห้ามยุบเป็นช่องว่าง */
      label: s.card.interestRate,
      value:
        interestRate === null ? (
          s.card.notAnnounced
        ) : interestRate === 0 ? (
          s.card.interestRateZero
        ) : (
          <span className="font-numeric">{s.card.interestRateValue(interestRate)}</span>
        ),
    },
    {
      label: s.card.term,
      value:
        termMonths === null ? (
          s.card.notAnnounced
        ) : (
          <span className="font-numeric">{s.card.termValue(termMonths)}</span>
        ),
    },
    {
      /* ★★ ตัวตัดสินอันดับหนึ่งว่ากู้ได้จริงไหม — ห้ามซ่อน (B1) */
      label: s.card.collateral,
      value: collateralText,
    },
  ];

  if (deadline) {
    items.splice(1, 0, {
      label: s.card.deadline,
      value: <DeadlineText date={deadline} />,
    });
  }

  if (gracePeriodMonths !== undefined) {
    items.push({
      label: s.card.gracePeriod,
      value: <span className="font-numeric">{s.card.termValue(gracePeriodMonths)}</span>,
    });
  }

  if (guaranteeFeePercent !== undefined) {
    items.push({
      label: s.card.guaranteeFee,
      value: <span className="font-numeric">{guaranteeFeePercent}%</span>,
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
      eyebrow={<DeadlineBadge status={status} daysLeft={daysLeft} />}
      meta={<EntityMeta items={items} />}
      amount={
        /* ★★ "วงเงินกู้สูงสุด" — คำว่า "กู้" แยกการ์ดนี้ออกจาก GrantCard */
        <EntityAmount label={s.card.loanCeiling} value={loanCeiling} />
      }
      footer={footer}
    />
  );
}
