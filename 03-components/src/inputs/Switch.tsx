'use client';

import {
  Switch as RACSwitch,
  type SwitchProps as RACSwitchProps,
} from 'react-aria-components';
import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';
import {
  statusTextClass,
  isErrorStatus,
  type InputStatus,
} from './fieldStyles';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Switch
   ───────────────────────────────────────────────────────────────────────────
   ★★★ เส้นแบ่งจาก `<Checkbox>` — **มีผลทันทีหรือรอกดบันทึก**

     Switch    → เปลี่ยนแล้ว **มีผลทันที** ไม่มีปุ่มบันทึก
     Checkbox  → เป็นค่าในฟอร์มที่ **มีผลเมื่อกดบันทึก**

   ผู้ใช้เรียนรู้ความต่างนี้จากแอปอื่นมาแล้ว · การใช้สลับกันทำให้ผู้ใช้
   กดบันทึกแล้วไม่มีอะไรเกิด หรือแย่กว่านั้นคือเปลี่ยนค่าโดยไม่ตั้งใจ

   ⚠️ ถ้ามีผลทันที **ต้องมี feedback ทันที** — ไม่ใช่แค่ตัว switch ขยับ
   ให้ผู้เรียกแสดง toast หรือข้อความสถานะ (SC 4.1.3)

   ★★ **ห้ามใช้ `role="switch"` เป็นตัวกรอง** — ตัวกรองไม่ได้ "เปิด/ปิด"
   ระบบ แต่จำกัดสิ่งที่แสดง · ใช้ `<Token>` หรือ `<Checkbox>`

   ★★ สถานะต้องอ่านได้จาก **ตำแหน่งของปุ่ม** ไม่ใช่แค่สีราง (SC 1.4.1)
   ปุ่มเลื่อนซ้าย/ขวาคือตัวชี้ที่ไม่ใช่สี · จึงไม่ต้องมีข้อความ "เปิด/ปิด"
   กำกับเหมือน badge

   ★ เป้ากด = ทั้งแถว เหมือน Checkbox · `p-1` ทำให้ switch โดด ๆ ยังได้ 36×28

   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `label: string` บังคับ (เดิมรับ `children`) · `isLabelHidden` ·
          `status` · `isOptional` — ทั้งสี่มาจาก §8.1 · `labelPosition` +
          `labelSpacing` แทน `align` เดิมของเรา
   ไม่รับ `labelIcon` (D35) · `isLoading` `isRequired` และที่เหลือ
          อยู่นอกขอบเขต parity (คำตัดสิน 2026-07-28 ข้อ 1)

   ★★ `align` ของเราเดิม**ทำสองอย่างพร้อมกัน** ซึ่งเป็นเหตุที่ต้องแยก:
      `align="end"` ทั้งย้ายป้ายไปหน้าแถว **และ** ดันสองฝั่งออกจากกัน
      ผู้เรียกที่อยากได้แค่อย่างใดอย่างหนึ่งทำไม่ได้ · ตอนนี้เป็น
      `labelPosition` (ป้ายอยู่ฝั่งไหน) กับ `labelSpacing` (ชิดหรือดันออก)
      ซึ่งตรงกับที่ Astryx แยกไว้อยู่แล้ว
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SwitchProps
  extends Omit<RACSwitchProps, 'children' | 'className' | 'style'> {
  /** ข้อความข้างปุ่ม — บังคับเสมอเพื่อ accessible name (SC 4.1.2, §8.1) */
  label: string;
  /** ซ่อน label ด้วยตา แต่ยังประกาศให้ screen reader */
  isLabelHidden?: boolean;
  /** คำอธิบายใต้ข้อความ — บอกผลของการเปิด */
  description?: string;

  /**
   * สถานะ — ใช้เมื่อการสลับ**ล้มเหลว** เช่นเซิร์ฟเวอร์ปฏิเสธ
   *
   * ⚠️ switch มีผลทันที จึงไม่มี validation แบบฟอร์ม · `status` ที่นี่คือ
   * การรายงานผลย้อนกลับ ไม่ใช่การบอกว่ากรอกผิด (SC 4.1.3)
   */
  status?: InputStatus;

  /** ต่อท้าย label ว่า "(ไม่บังคับ)" */
  isOptional?: boolean;

  /** ป้ายอยู่ฝั่งไหนของปุ่ม — `end` (ค่าเริ่มต้น) คือปุ่มก่อนแล้วป้ายตาม */
  labelPosition?: 'start' | 'end';

  /** `spread` ดันป้ายกับปุ่มไปสุดสองฝั่ง — ใช้ในรายการตั้งค่า */
  labelSpacing?: 'compact' | 'spread';

  className?: string;
}

export function Switch({
  label,
  isLabelHidden,
  description,
  status,
  isOptional,
  labelPosition = 'end',
  labelSpacing = 'compact',
  className,
  ...rest
}: SwitchProps) {
  const s = useStrings();
  const labelId = useId();
  const descId = useId();
  const statusId = useId();

  /* ★★ ต้องผูกชื่อ/คำอธิบาย **เอง** — ไม่ปล่อยให้เบราว์เซอร์คำนวณ

     RAC ครอบ input ด้วย `<label>` ทั้งก้อน ดังนั้นถ้าไม่ทำอะไร accessible
     name จะกลายเป็น **ข้อความทุกอย่างในแถวต่อกัน** — วัดจริงได้
     "รับการแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่บันทึกไม่สำเร็จ" ติดกันเป็นพรวน
     ซึ่ง screen reader จะอ่านทั้งหมดเป็นชื่อของปุ่ม

     จึงชี้ `aria-labelledby` ไปที่ป้ายเท่านั้น แล้วส่งคำอธิบายกับสถานะ
     ผ่าน `aria-describedby` ตามบทบาทที่ถูก */
  const describedBy =
    [description && descId, status?.message && statusId].filter(Boolean).join(' ') ||
    undefined;

  return (
    <RACSwitch
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      className={cn(
        'group flex min-w-0 items-start gap-3',
        'p-1',
        'cursor-pointer data-disabled:cursor-not-allowed',
        labelSpacing === 'spread' && 'w-full justify-between',
        className,
      )}
      {...rest}
    >
      {({ isSelected, isDisabled }) => (
        <>
          {labelPosition === 'start' && (
            <SwitchLabel
              isDisabled={isDisabled}
              description={description}
              status={status}
              isOptional={isOptional}
              isLabelHidden={isLabelHidden}
              optionalText={s.common.optional}
              labelId={labelId}
              descId={descId}
              statusId={statusId}
            >
              {label}
            </SwitchLabel>
          )}

          {/* ราง — `rounded-full` ใช้ได้ เพราะเป็นรูปทรงมาตรฐานสากล
             ของ switch เหมือนที่ radio เป็นวงกลม (ข้อ 05) */}
          <span
            className={cn(
              'flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5',
              'transition-colors duration-fast ease-standard',
              isSelected
                ? 'border-primary-outline bg-primary-600'
                : 'border-edge-strong bg-sunken',
              isDisabled && 'border-edge bg-sunken',
              !isSelected && !isDisabled && 'group-data-hovered:border-fg-muted',
            )}
          >
            {/* ★ ปุ่มเลื่อน — ตำแหน่งคือตัวบอกสถานะ ไม่ใช่สี */}
            <span
              className={cn(
                'size-5 rounded-full bg-surface',
                'transition-transform duration-fast ease-standard',
                /* transform ถูกตัดใน reduced motion — ไม่เป็นไร
                   เพราะตำแหน่งสุดท้ายยังต่างกัน แค่ไม่มีการเคลื่อนไหว */
                'motion-reduce:transition-none',
                isSelected ? 'translate-x-5' : 'translate-x-0',
                isDisabled && 'bg-fg-disabled',
              )}
            />
          </span>

          {labelPosition === 'end' && (
            <SwitchLabel
              isDisabled={isDisabled}
              description={description}
              status={status}
              isOptional={isOptional}
              isLabelHidden={isLabelHidden}
              optionalText={s.common.optional}
              labelId={labelId}
              descId={descId}
              statusId={statusId}
            >
              {label}
            </SwitchLabel>
          )}
        </>
      )}
    </RACSwitch>
  );
}

function SwitchLabel({
  children,
  description,
  isDisabled,
  status,
  isOptional,
  isLabelHidden,
  optionalText,
  labelId,
  descId,
  statusId,
}: {
  children: ReactNode;
  description?: string;
  isDisabled: boolean;
  status?: InputStatus;
  isOptional?: boolean;
  isLabelHidden?: boolean;
  optionalText: string;
  labelId: string;
  descId: string;
  statusId: string;
}) {
  return (
    <span className={cn('grid min-w-0 gap-1', isLabelHidden && 'sr-only')}>
      {/* ★ "(ไม่บังคับ)" อยู่**ใน**ชื่อโดยเจตนา — เป็นส่วนหนึ่งของสิ่งที่ถาม
         ต่างจาก description/status ที่เป็นข้อมูลประกอบ */}
      <span
        id={labelId}
        className={cn('text-body-sm', isDisabled ? 'text-fg-disabled' : 'text-fg')}
      >
        {children}
        {isOptional && <span className="text-fg-muted"> ({optionalText})</span>}
      </span>
      {description && (
        <span id={descId} className="text-caption text-fg-muted">
          {description}
        </span>
      )}
      {status?.message && (
        <span
          id={statusId}
          /* ★ switch มีผลทันที ผลลัพธ์ที่ล้มเหลวจึงต้องประกาศเอง
             ไม่มีการ submit ที่จะพา error ไปประกาศให้ (SC 4.1.3) */
          role={isErrorStatus(status) ? 'alert' : undefined}
          className={cn('text-caption', statusTextClass[status.type])}
        >
          {status.message}
        </span>
      )}
    </span>
  );
}
