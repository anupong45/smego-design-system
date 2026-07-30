'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { Badge } from '../data-display/Badge';
import { EntityMeta } from './EntityCard';
import { DescriptionList } from '../data-display/DescriptionList';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · SellerProfile + CertificationBadge
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ใบรับรองคือแกนความน่าเชื่อถือของแพลตฟอร์มรัฐ

   ผู้ซื้อ B2B ตัดสินใจจาก "เชื่อถือได้ไหม" ก่อน "ราคาเท่าไร" — โดยเฉพาะ
   กับผู้ขายที่ไม่เคยซื้อมาก่อน · การรับรองจึงไม่ใช่ badge ตกแต่ง
   แต่เป็นข้อมูลที่มีผลทางกฎหมายและทางการค้า

   ★★★ **ไอคอนโดเมนไทย 14 ตัวยังไม่มี — ใช้ข้อความแทน** (ข้อ 09)

   มอก. · ฮาลาล · GMP · HACCP · DBD · ThaID · e-Tax ฯลฯ ไม่มีไอคอน
   ในระบบ และ **ห้ามหยิบไอคอน Lucide ที่ใกล้เคียงมาใช้**

   เหตุผลไม่ใช่ความสวยงาม: โล่หรือเครื่องหมายถูกที่สื่อว่า "ผ่านการรับรอง"
   ทั้งที่เป็นแค่ไอคอนตกแต่ง คือ **การอ้างสิทธิ์ที่ไม่มีใครรับรอง**
   ซึ่งกับมาตรฐานสินค้าอาจมีผลทางกฎหมาย

   ★★ ใบรับรองต้องแยก **"ยืนยันแล้ว" กับ "ผู้ขายแจ้งเอง"**

   สองอย่างนี้มีน้ำหนักต่างกันสิ้นเชิง · การแสดงเหมือนกันคือการทำให้
   ข้อมูลที่ตรวจสอบแล้วเสียค่า และทำให้ข้อมูลที่ยังไม่ตรวจดูน่าเชื่อเกินจริง

   ★ เลขทะเบียนนิติบุคคลต้องคัดลอกได้และใช้ `font-numeric`
   ผู้ซื้อเอาไปตรวจกับ DBD ต่อ — 13 หลักที่พิมพ์ตามผิดคือเสียเวลาเปล่า
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Certification {
  id: string;
  /** ชื่อเต็มของใบรับรอง เช่น "มอก. 2456-2562" */
  name: string;
  /**
   * ยืนยันโดยหน่วยงานที่ออกให้แล้วหรือยัง
   *
   * ⚠️ `false` = **ผู้ขายแจ้งเอง** ไม่ใช่ "รอตรวจสอบ" —
   * ต้องแสดงต่างกันชัดเจน
   */
  isVerified: boolean;
  /** วันหมดอายุ ISO — ใบรับรองหมดอายุแล้วไม่ควรแสดงเป็นยืนยันแล้ว */
  expiresAt?: string;
}

export interface CertificationBadgeProps {
  certification: Certification;
  className?: string;
}

/**
 * ★ ไม่มีไอคอน — ข้อความล้วน (ข้อ 09)
 *
 * ตัวแยก "ยืนยันแล้ว" ออกจาก "ผู้ขายแจ้งเอง" คือ **ข้อความกำกับ**
 * ไม่ใช่สี ไม่ใช่ไอคอน
 */
export function CertificationBadge({ certification, className }: CertificationBadgeProps) {
  const s = useStrings();
  const { name, isVerified } = certification;

  return (
    <span
      className={cn(
        'inline-flex min-w-0 flex-col gap-0.5',
        'rounded-(--radius-control) border px-3 py-2',
        isVerified
          ? 'border-success-edge bg-success-surface'
          : 'border-edge bg-sunken',
        className,
      )}
    >
      <span className={cn('text-caption', isVerified ? 'text-fg' : 'text-fg-secondary')}>
        {name}
      </span>
      {/* ★ ข้อความกำกับคือตัวแยก ไม่ใช่สี */}
      <span
        className={cn(
          'text-caption',
          isVerified ? 'text-success-icon' : 'text-fg-muted',
        )}
      >
        {isVerified ? s.seller.certVerified : s.seller.certSelfDeclared}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SellerProfile
   ───────────────────────────────────────────────────────────────────────────── */

export interface SellerProfileProps {
  name: string;
  /** เลขทะเบียนนิติบุคคล 13 หลัก */
  registrationNumber?: string;
  /** ยืนยันตัวตนกับ DBD/ThaID แล้ว */
  isVerified?: boolean;
  /**
   * จดทะเบียนภาษีมูลค่าเพิ่มหรือไม่
   *
   * ⚠️ **ต้องส่งเสมอ** · `null` = ยังไม่ระบุ ห้ามเดา
   *
   * ★★ ผู้ขายที่ไม่จด VAT ทำให้ผู้ซื้อขอคืนภาษีซื้อไม่ได้ — ต้นทุนจริง
   * ต่างกัน 7% ซึ่งเปลี่ยนคำตอบว่า "ซื้อเจ้านี้ไหม" จึงอยู่ระดับ badge
   * ไม่จมอยู่ในรายการ (B1)
   */
  isVatRegistered: boolean | null;
  /** เลขประจำตัวผู้เสียภาษี 13 หลัก */
  taxId?: string;
  /** ออกใบกำกับภาษีอิเล็กทรอนิกส์ได้หรือไม่ */
  canIssueETax?: boolean;
  /** จังหวัดหรือที่ตั้ง */
  location?: string;
  /** ปีที่เข้าร่วม (ค.ศ.) — แสดงเป็น พ.ศ. */
  memberSinceYear?: number;
  /** เวลาตอบกลับเฉลี่ย เช่น "ภายใน 2 ชั่วโมง" */
  responseTime?: string;
  certifications?: Certification[];
  /** โลโก้หรือรูปประจำตัว */
  avatar?: ReactNode;
  /** ปุ่มติดต่อ / ดูโปรไฟล์ */
  actions?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

export function SellerProfile({
  name,
  registrationNumber,
  isVerified,
  isVatRegistered,
  taxId,
  canIssueETax,
  location,
  memberSinceYear,
  responseTime,
  certifications,
  avatar,
  actions,
  headingLevel = 2,
  className,
}: SellerProfileProps) {
  const s = useStrings();
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';

  const meta = [
    ...(location ? [{ label: s.seller.location, value: location }] : []),
    ...(memberSinceYear !== undefined
      ? [
          {
            label: s.seller.memberSinceLabel,
            /* พ.ศ. = ค.ศ. + 543 · ปีเดี่ยวไม่ต้องผ่าน Intl */
            value: (
              <span className="font-numeric">{memberSinceYear + 543}</span>
            ),
          },
        ]
      : []),
    ...(responseTime ? [{ label: s.seller.responseTime, value: responseTime }] : []),
  ];

  const taxDetails = [
    ...(taxId
      ? [{ label: s.seller.taxId, value: taxId, numeric: true }]
      : []),
    ...(canIssueETax !== undefined
      ? [
          {
            label: s.seller.eTax,
            value: canIssueETax ? s.seller.eTaxYes : s.seller.eTaxNo,
          },
        ]
      : []),
  ];

  return (
    <section
      aria-label={name}
      className={cn(
        'grid min-w-0 gap-4 rounded-(--radius-container) border p-4 md:p-6',
        'border-(--elevation-edge-raised) bg-(--elevation-surface-raised)',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {avatar && <div className="shrink-0">{avatar}</div>}

        <div className="grid min-w-0 flex-1 gap-1">
          <Heading className="text-subtitle text-fg">{name}</Heading>

          {/* ★ สองป้ายนี้ตอบคำถามคนละข้อ — ตัวตนจริงไหม กับ ขอคืนภาษีได้ไหม
              ป้าย VAT แสดง**ทุกกรณี** รวมทั้งตอนไม่ได้จด เพราะ
              "ไม่แสดง" ผู้ซื้อจะสมมติว่าจดแล้ว ซึ่งเป็นสมมติฐานที่แพง 7% */}
          <span className="flex min-w-0 flex-wrap justify-self-start gap-2">
            {isVerified && <Badge variant="success" label={s.seller.verified} />}
            {isVatRegistered === null ? (
              <Badge variant="neutral" label={<>{`${s.seller.vatStatus} · ${s.seller.vatUnknown}`}</>} />
            ) : isVatRegistered ? (
              <Badge variant="success" label={s.seller.vatRegistered} />
            ) : (
              <Badge variant="warning" label={s.seller.vatNotRegistered} />
            )}
          </span>

          {isVatRegistered === false && (
            /* ★ บอกผลที่ตามมา ไม่ใช่แค่สถานะ — ผู้ใช้ไม่ต้องรู้กฎภาษีเอง */
            <p className="text-caption text-fg-secondary">
              {s.seller.vatNotRegisteredHelp}
            </p>
          )}

          {registrationNumber && (
            <p className="text-caption text-fg-muted">
              {s.seller.registrationNumber}{' '}
              {/* ★ คัดลอกได้ด้วยดับเบิลคลิก — ผู้ซื้อเอาไปตรวจกับ DBD ต่อ */}
              <span className="select-all font-numeric text-fg-secondary">
                {registrationNumber}
              </span>
            </p>
          )}
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      {meta.length > 0 && <EntityMeta items={meta} />}

      {/* รายละเอียดภาษี — ระดับหน้า จึงเป็น DescriptionList ไม่ใช่ EntityMeta
          สถานะที่สำคัญที่สุด (จด VAT ไหม) อยู่เป็น badge ด้านบนแล้ว
          ที่นี่คือรายละเอียดสำหรับคนที่จะเอาไปตรวจต่อ */}
      {taxDetails.length > 0 && <DescriptionList layout="inline" items={taxDetails} />}

      {certifications && certifications.length > 0 && (
        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <h3 className="text-label text-fg-secondary">{s.seller.certifications}</h3>
            <Icon name="shield-check" size={16} className="text-fg-muted" />
          </div>

          <p className="text-caption text-fg-muted">{s.seller.certificationHelp}</p>

          {/* wrap เพราะชื่อใบรับรองไทยยาวไม่เท่ากัน */}
          <ul className="flex min-w-0 flex-wrap gap-2">
            {certifications.map((c) => (
              <li key={c.id} className="min-w-0">
                <CertificationBadge certification={c} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
