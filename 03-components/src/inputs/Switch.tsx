import {
  Switch as RACSwitch,
  type SwitchProps as RACSwitchProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

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
   ระบบ แต่จำกัดสิ่งที่แสดง · ใช้ `<Chip>` หรือ `<Checkbox>`

   ★★ สถานะต้องอ่านได้จาก **ตำแหน่งของปุ่ม** ไม่ใช่แค่สีราง (SC 1.4.1)
   ปุ่มเลื่อนซ้าย/ขวาคือตัวชี้ที่ไม่ใช่สี · จึงไม่ต้องมีข้อความ "เปิด/ปิด"
   กำกับเหมือน badge

   ★ เป้ากด = ทั้งแถว เหมือน Checkbox · `p-1` ทำให้ switch โดด ๆ ยังได้ 36×28
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SwitchProps
  extends Omit<RACSwitchProps, 'children' | 'className' | 'style'> {
  children?: ReactNode;
  /** คำอธิบายใต้ข้อความ — บอกผลของการเปิด */
  description?: string;
  /** วางปุ่มไว้ท้ายแถว — ใช้ในรายการตั้งค่า */
  align?: 'start' | 'end';
  className?: string;
}

export function Switch({
  children,
  description,
  align = 'start',
  className,
  ...rest
}: SwitchProps) {
  return (
    <RACSwitch
      className={cn(
        'group flex min-w-0 items-start gap-3',
        'p-1',
        'cursor-pointer data-disabled:cursor-not-allowed',
        align === 'end' && 'justify-between',
        className,
      )}
      {...rest}
    >
      {({ isSelected, isDisabled }) => (
        <>
          {align === 'end' && children && (
            <SwitchLabel
              isDisabled={isDisabled}
              description={description}
            >
              {children}
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

          {align === 'start' && children && (
            <SwitchLabel isDisabled={isDisabled} description={description}>
              {children}
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
}: {
  children: ReactNode;
  description?: string;
  isDisabled: boolean;
}) {
  return (
    <span className="grid min-w-0 gap-1">
      <span className={cn('text-body-sm', isDisabled ? 'text-fg-disabled' : 'text-fg')}>
        {children}
      </span>
      {description && <span className="text-caption text-fg-muted">{description}</span>}
    </span>
  );
}
