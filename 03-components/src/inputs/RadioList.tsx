import {
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  Radio as RACRadio,
  type RadioProps as RACRadioProps,
  Label,
  Text,
  FieldError,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';
import {
  statusTextClass,
  isErrorStatus,
  type InputStatus,
} from './fieldStyles';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · RadioList / Radio   (เดิมชื่อ RadioGroup — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `status` (เดิมชื่อ `errorMessage`) · `isOptional` (เดิมชื่อ `showOptional`)
   ไม่รับ `isLabelHidden` `size` `width` (D6) `labelTooltip` `htmlName` (D15)
          `disabledMessage` (D16) ของ Astryx — ไม่มี use case ใน marketplace
   ───────────────────────────────────────────────────────────────────────────
   ★ radio ใช้ **roving tabindex** ต่างจาก checkbox

   ทั้งกลุ่มกิน **หนึ่ง tab stop** · Tab เข้าที่ตัวที่เลือกไว้ (หรือตัวแรก
   ถ้ายังไม่เลือก) แล้วลูกศรเลื่อน **และเลือกทันที** (ข้อ 10 §1.2)
   RAC จัดการให้ทั้งหมด — ถ้าเขียนเองมักพลาดข้อนี้

   ★ radio เป็น **ข้อยกเว้นเดียว**ที่ใช้ `rounded-full` นอกเหนือจาก
   chip · badge · avatar · dot — เพราะวงกลมคือรูปทรงมาตรฐานสากล
   ที่แยก radio (เลือกได้อันเดียว) ออกจาก checkbox (เลือกได้หลายอัน)
   การทำ radio เป็นสี่เหลี่ยมจะทำให้ผู้ใช้เข้าใจพฤติกรรมผิด

   ★ เป้ารวมคือทั้งแถว เหมือน Checkbox
   `p-1` ทำให้แม้ radio โดด ๆ ก็ยังได้ 28×28 ✓

   ★ `card` variant สำหรับตัวเลือกที่ต้องอธิบายยาว
   ใช้กับการเลือกวิธีชำระเงิน — พร้อมเพย์ / โอน / เครดิตเทอม
   ซึ่งแต่ละตัวต้องมีคำอธิบายประกอบ
   ═══════════════════════════════════════════════════════════════════════════ */

export interface RadioProps extends Omit<RACRadioProps, 'children' | 'className' | 'style'> {
  children: ReactNode;
  description?: string;
  /** element เสริมท้ายแถว เช่น QR หรือโลโก้ธนาคาร */
  endSlot?: ReactNode;
  /**
   * `card` — ทั้งกล่องกดได้ มีขอบ ใช้เมื่อตัวเลือกต้องอธิบายยาว
   * `inline` — แถวธรรมดา
   */
  layout?: 'inline' | 'card';
  className?: string;
}

export function Radio({
  children,
  description,
  endSlot,
  layout = 'inline',
  className,
  ...rest
}: RadioProps) {
  return (
    <RACRadio
      className={({ isSelected, isDisabled, isInvalid }) =>
        cn(
          'group flex min-w-0 items-start gap-2 cursor-pointer',
          'data-disabled:cursor-not-allowed',
          layout === 'inline' && 'p-1',
          layout === 'card' && [
            'rounded-(--radius-container) border p-4',
            'transition-colors duration-fast ease-standard',
            isSelected
              ? 'border-edge-brand bg-selected-surface'
              : 'border-edge-strong bg-surface data-hovered:bg-sunken',
            isInvalid && 'border-edge-danger',
            isDisabled && 'border-edge bg-sunken',
          ],
          className,
        )
      }
      {...rest}
    >
      {({ isSelected, isDisabled, isInvalid }) => (
        <>
          {/* ★ วงกลม — ข้อยกเว้นที่อนุญาตของ rounded-full */}
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-full border',
              'transition-colors duration-fast ease-standard',
              isSelected ? 'border-edge-brand' : 'border-edge-strong',
              isInvalid && 'border-edge-danger',
              isDisabled ? 'bg-sunken' : 'bg-surface',
              !isSelected && !isDisabled && 'group-data-hovered:border-fg-muted',
            )}
          >
            {/* จุดกลาง — ขนาดต่างชัดเจน ไม่ใช่แค่สี */}
            {isSelected && (
              <span
                className={cn(
                  'size-2.5 rounded-full',
                  isDisabled ? 'bg-fg-disabled' : 'bg-primary-600',
                )}
              />
            )}
          </span>

          <span className="grid min-w-0 flex-1 gap-1">
            <span
              className={cn(
                'text-body-sm',
                /* ★ ตอนเลือกใน layout card พื้นเป็น selected-surface
                   ซึ่งในโหมดมืดเป็น blue-900 — `text-fg` (ขาว) อ่านได้
                   แต่ `text-selected-fg` ให้ 9.80:1 และสื่อความเป็นคู่กัน
                   ⚠️ ต้องกำหนดที่ **ตัวลูก** เพราะกำหนดที่กล่องนอกจะถูกทับ */
                isDisabled
                  ? 'text-fg-disabled'
                  : isSelected && layout === 'card'
                    ? 'text-selected-fg'
                    : 'text-fg',
              )}
            >
              {children}
            </span>
            {description && (
              <span
                className={cn(
                  'text-caption',
                  /* ★ `opacity-80` ใช้ได้ที่นี่ — **วัดค่าที่ composite แล้ว**:
                       สว่าง blue-800@80% บน blue-50  = 5.06 ✅
                       มืด   blue-100@80% บน blue-900 = 6.88 ✅
                     ไม่เพิ่ม token ใหม่เพราะเป็นลำดับชั้นภายใน component
                     ไม่ใช่บทบาทระดับระบบ

                     ⚠️ ค่านี้ขึ้นกับ `--color-selected-surface` — ถ้าเปลี่ยน
                     พื้น ต้องวัดซ้ำ เพราะค่าที่ composite แล้วมองไม่เห็น
                     จากตัว token และ linter ตรวจไม่ได้ */
                  isSelected && layout === 'card'
                    ? 'text-selected-fg opacity-80'
                    : 'text-fg-muted',
                )}
              >
                {description}
              </span>
            )}
          </span>

          {endSlot && <span className="shrink-0">{endSlot}</span>}
        </>
      )}
    </RACRadio>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RadioList
   ───────────────────────────────────────────────────────────────────────────── */

export interface RadioListProps
  extends Omit<
    RACRadioGroupProps,
    'children' | 'className' | 'style' | 'validationBehavior'
  > {
  label: string;
  children: ReactNode;
  description?: string;
  status?: InputStatus;
  isOptional?: boolean;
  /** เรียงแนวตั้ง (ค่าเริ่มต้น) หรือแนวนอน */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function RadioList({
  label,
  children,
  description,
  status,
  isOptional,
  orientation = 'vertical',
  className,
  ...rest
}: RadioListProps) {
  const s = useStrings();

  return (
    <RACRadioGroup
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
      orientation={orientation}
      className={cn('grid min-w-0 gap-2', className)}
      {...rest}
    >
      <Label className="text-label text-fg-secondary">
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      {description && (
        <Text slot="description" className="text-caption text-fg-muted">
          {description}
        </Text>
      )}

      <div
        className={cn(
          'grid gap-2',
          /* แนวนอนต้อง wrap เพราะข้อความไทยยาวกว่าอังกฤษ 20–40%
             ถ้าไม่ wrap จะล้นที่ 360px */
          orientation === 'horizontal' && 'flex flex-wrap items-start gap-4',
        )}
      >
        {children}
      </div>

      {isErrorStatus(status) ? (
        <FieldError className="text-caption text-danger-icon">{status?.message}</FieldError>
      ) : (
        status?.message && (
          <Text slot="description" className={statusTextClass[status.type]}>
            {status.message}
          </Text>
        )
      )}
    </RACRadioGroup>
  );
}
