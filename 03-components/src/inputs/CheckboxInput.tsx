import {
  Checkbox as RACCheckbox,
  type CheckboxProps as RACCheckboxProps,
  CheckboxGroup as RACCheckboxGroup,
  type CheckboxGroupProps as RACCheckboxGroupProps,
  Label,
  Text,
  FieldError,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · CheckboxInput / CheckboxGroup   (เดิมชื่อ Checkbox — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `label` บังคับ (เดิมรับ `children`) · `isLabelHidden` (§8.1)
   ไม่รับ `size` `labelIcon` `width` `isOptional` `isLoading` `htmlName`
          `changeAction` (D8) `disabledMessage` (D16) ของ Astryx — ไม่มี
          use case ใน marketplace ตอนนี้
   ───────────────────────────────────────────────────────────────────────────
   ★ กล่อง 20px แต่ **เป้ารวมคือทั้งแถว** ไม่ใช่แค่กล่อง

   `<label>` ครอบทั้งกล่องและข้อความ ดังนั้นพื้นที่กดคือทั้งแถว
   ซึ่งกว้างและสูงเกิน 24×24 มาก — ผ่าน SC 2.5.8 อย่างสบาย

   ⚠️ ถ้าใช้ checkbox โดด ๆ **ไม่มีข้อความ** (เช่นในหัวตารางเพื่อเลือกทั้งหมด)
   เป้าจะเหลือ 20×20 ซึ่ง **ต่ำกว่าเกณฑ์** ต้องเพิ่ม `p-1` ที่ตัว label
   → ใช้ `<Checkbox aria-label>` ที่มี padding ในตัวแล้ว

   ★ checkbox **ไม่ใช้ roving tabindex** ต่างจาก radio
   แต่ละตัวเป็น tab stop ของตัวเอง เพราะเลือกได้หลายตัวพร้อมกัน
   (ข้อ 10 §1.2) — RAC จัดการให้ถูกอยู่แล้ว

   ★ สถานะ indeterminate ต้องมีรูปทรงต่างจาก checked
   เครื่องหมายถูก vs ขีดกลาง — ไม่ใช่แค่สีอ่อนกว่า (SC 1.4.1)

   ★ ขอบกล่องใช้ `border-edge-strong` (SC 1.4.11)
   checkbox คือ UI component ขอบเขตต้องผ่าน 3:1
   ═══════════════════════════════════════════════════════════════════════════ */

const boxBase = [
  'flex shrink-0 items-center justify-center',
  'size-5',
  'rounded-(--radius-sm)',
  'border',
  'transition-colors duration-fast ease-standard',
].join(' ');

export interface CheckboxInputProps
  extends Omit<RACCheckboxProps, 'children' | 'className' | 'style'> {
  /** ข้อความข้างกล่อง — บังคับเสมอเพื่อ accessible name (SC 4.1.2, §8.1) */
  label: string;
  /** ซ่อน label ด้วยตา แต่ยังอ่านได้ด้วย screen reader — ใช้แทน `aria-label` เดิม */
  isLabelHidden?: boolean;
  /** คำอธิบายใต้ข้อความ */
  description?: string;
  className?: string;
}

export function CheckboxInput({
  label,
  isLabelHidden,
  description,
  className,
  ...rest
}: CheckboxInputProps) {
  return (
    <RACCheckbox
      className={cn(
        'group flex min-w-0 items-start gap-2',
        /* ★ ถ้าไม่มีข้อความ เป้าจะเหลือ 20×20 — p-1 ทำให้เป็น 28×28 ✓
           ใช้ padding เสมอเพื่อไม่ต้องจำว่าเคสไหนต้องเพิ่ม */
        'p-1',
        'cursor-pointer data-disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      {({ isSelected, isIndeterminate, isDisabled, isInvalid }) => (
        <>
          <span
            className={cn(
              boxBase,
              /* ขอบเขตของ UI component ต้องผ่าน 3:1 */
              !isSelected && !isIndeterminate && 'border-edge-strong bg-surface',
              (isSelected || isIndeterminate) &&
                'border-primary-outline bg-primary-600 text-on-brand',
              isInvalid && 'border-edge-danger',
              isDisabled && 'border-edge bg-sunken text-fg-disabled',
              /* hover เฉพาะตอนยังไม่เลือก — ตอนเลือกแล้วพื้นเป็นสีแบรนด์อยู่ */
              !isSelected && !isDisabled && 'group-data-hovered:border-fg-muted',
            )}
          >
            {/* ★ รูปทรงต่างกัน ไม่ใช่แค่สี — ถูก vs ขีดกลาง (SC 1.4.1) */}
            {isIndeterminate ? (
              <Icon name="minus" size={16} />
            ) : isSelected ? (
              <Icon name="check" size={16} />
            ) : null}
          </span>

          <span className={cn('grid min-w-0 gap-1', isLabelHidden && 'sr-only')}>
            <span
              className={cn(
                'text-body-sm',
                isDisabled ? 'text-fg-disabled' : 'text-fg',
              )}
            >
              {label}
            </span>
            {description && !isLabelHidden && (
              <span className="text-caption text-fg-muted">{description}</span>
            )}
          </span>
        </>
      )}
    </RACCheckbox>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CheckboxGroup
   ───────────────────────────────────────────────────────────────────────────── */

export interface CheckboxGroupProps
  extends Omit<
    RACCheckboxGroupProps,
    'children' | 'className' | 'style' | 'validationBehavior'
  > {
  label: string;
  children: ReactNode;
  description?: string;
  errorMessage?: string;
  showOptional?: boolean;
  className?: string;
}

export function CheckboxGroup({
  label,
  children,
  description,
  errorMessage,
  showOptional,
  className,
  ...rest
}: CheckboxGroupProps) {
  const s = useStrings();

  return (
    <RACCheckboxGroup
      /* aria ไม่ใช่ native — ข้อความ validation ต้องเป็นภาษาไทยที่เราคุม */
      validationBehavior="aria"
      isInvalid={Boolean(errorMessage)}
      className={cn('grid min-w-0 gap-2', className)}
      {...rest}
    >
      {/* RAC ต่อ Label เข้ากับ group ด้วย aria-labelledby ให้เอง
         ทำให้ screen reader ประกาศชื่อกลุ่มก่อนอ่านตัวเลือกแต่ละตัว */}
      <Label className="text-label text-fg-secondary">
        {label}
        {showOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      {description && (
        <Text slot="description" className="text-caption text-fg-muted">
          {description}
        </Text>
      )}

      {/* -ms-1 ชดเชย p-1 ของ Checkbox เพื่อให้กล่องตรงแนวกับ label ด้านบน */}
      <div className="-ms-1 grid gap-1">{children}</div>

      <FieldError className="text-caption text-danger-icon">{errorMessage}</FieldError>
    </RACCheckboxGroup>
  );
}
