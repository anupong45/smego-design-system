import {
  Checkbox as RACCheckbox,
  type CheckboxProps as RACCheckboxProps,
  /* ★ RAC ยังเรียก `CheckboxGroup` — ชื่อ `CheckboxList` เป็นของ Astryx
     ที่เรารับมา (คู่กับ `RadioList`) จึง alias ตรงนี้ที่เดียว */
  CheckboxGroup as RACCheckboxList,
  type CheckboxGroupProps as RACCheckboxListProps,
  Label,
  Text,
  FieldError,
} from 'react-aria-components';
import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';
import {
  statusTextClass,
  isErrorStatus,
  type InputStatus,
} from './fieldStyles';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · CheckboxInput / CheckboxList   (เดิมชื่อ Checkbox — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `label` บังคับ (เดิมรับ `children`) · `isLabelHidden` (§8.1) ·
          `status` · `isOptional` (§3.1 กฎ 2–3 — พี่น้องทุกตัวมีแล้ว)
   ไม่รับ `size` (D1 · 28/32/36 ต่ำกว่าเกณฑ์ touch) · `labelIcon` (D16) ·
          `isLoading` (D8 — มีไว้คู่กับ `changeAction` แบบ async ของเขา) ·
          `width` (D6) · `htmlName` (D15) · `changeAction` (D8) ·
          `disabledMessage` (D16)
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

  /**
   * สถานะของช่อง — ใช้กับ checkbox เดี่ยวที่ต้องติ๊ก เช่นการยอมรับเงื่อนไข
   *
   * ⚠️ ถ้าอยู่ใน `<CheckboxList>` ให้ใส่ `status` ที่**กลุ่ม** ไม่ใช่รายตัว —
   * การตรวจความถูกต้องเป็นเรื่องของกลุ่ม (SC 3.3.1)
   */
  status?: InputStatus;

  /** ต่อท้าย label ว่า "(ไม่บังคับ)" */
  isOptional?: boolean;

  className?: string;
}

export function CheckboxInput({
  label,
  isLabelHidden,
  description,
  status,
  isOptional,
  className,
  ...rest
}: CheckboxInputProps) {
  const s = useStrings();
  const labelId = useId();
  const descId = useId();
  const statusId = useId();

  /* ★★ ผูกชื่อ/คำอธิบายเอง — เหตุผลเดียวกับ `Switch.tsx`
     RAC ครอบ input ด้วย `<label>` ทั้งก้อน ถ้าไม่ชี้ `aria-labelledby`
     accessible name จะเป็นข้อความทั้งแถวต่อกัน วัดจริงได้
     "ยอมรับเงื่อนไขอ่านก่อนติ๊กต้องยอมรับก่อน" — คำอธิบายและข้อความ error
     กลายเป็นส่วนหนึ่งของ**ชื่อ** ทั้งที่ควรเป็น description */
  const describedBy =
    [description && descId, status?.message && statusId].filter(Boolean).join(' ') ||
    undefined;

  return (
    <RACCheckbox
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      /* เฉพาะ error ที่ทำให้ invalid — warning/success ยังส่งฟอร์มได้ */
      isInvalid={isErrorStatus(status) || undefined}
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
            {/* ★ "(ไม่บังคับ)" อยู่**ใน**ชื่อโดยเจตนา — เป็นส่วนของสิ่งที่ถาม */}
            <span
              id={labelId}
              className={cn(
                'text-body-sm',
                isDisabled ? 'text-fg-disabled' : 'text-fg',
              )}
            >
              {label}
              {isOptional && (
                <span className="text-fg-muted"> ({s.common.optional})</span>
              )}
            </span>
            {description && !isLabelHidden && (
              <span id={descId} className="text-caption text-fg-muted">
                {description}
              </span>
            )}
            {status?.message && !isLabelHidden && (
              <span id={statusId} className={cn('text-caption', statusTextClass[status.type])}>
                {status.message}
              </span>
            )}
          </span>
        </>
      )}
    </RACCheckbox>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CheckboxList
   ───────────────────────────────────────────────────────────────────────────── */

export interface CheckboxListProps
  extends Omit<
    RACCheckboxListProps,
    'children' | 'className' | 'style' | 'validationBehavior'
  > {
  label: string;
  children: ReactNode;
  description?: string;
  status?: InputStatus;

  /**
   * ซ่อน label ของกลุ่มด้วยตา แต่ยังประกาศให้ screen reader (§8.1)
   *
   * ⚠️ เพิ่มทีหลัง 2026-07-29 — sweep §8.1 รอบแรกไล่ตาม 13 ตัวที่หัวข้อนั้น
   * ระบุไว้ ซึ่ง **ไม่รวมกลุ่ม checkbox** จึงได้ `isLabelHidden` บน `RadioList`
   * แต่ไม่ได้บนตัวนี้ · เจอเพราะ rename เป็น `CheckboxList` แล้ว gate เริ่ม
   * เทียบ prop กับ Astryx ได้ — ก่อนหน้านั้นมันอยู่นอกสายตาของเกตทั้งหมด
   */
  isLabelHidden?: boolean;

  /**
   * ต่อท้าย label ว่า "(ไม่บังคับ)"
   *
   * ★ Astryx มี `isOptional` บน `RadioList` แต่ **ไม่มี** บน `CheckboxList`
   * ซึ่งเป็นความไม่สม่ำเสมอของเขา · §3.1 ของเราบังคับว่าทุกกลุ่มต้องมี
   * จึงคงไว้และประกาศใน `propsOursOnly`
   */
  isOptional?: boolean;

  className?: string;
}

export function CheckboxList({
  label,
  children,
  description,
  status,
  isLabelHidden,
  isOptional,
  className,
  ...rest
}: CheckboxListProps) {
  const s = useStrings();

  return (
    <RACCheckboxList
      /* aria ไม่ใช่ native — ข้อความ validation ต้องเป็นภาษาไทยที่เราคุม */
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
      className={cn('grid min-w-0 gap-2', className)}
      {...rest}
    >
      {/* RAC ต่อ Label เข้ากับ group ด้วย aria-labelledby ให้เอง
         ทำให้ screen reader ประกาศชื่อกลุ่มก่อนอ่านตัวเลือกแต่ละตัว */}
      <Label
        className={cn('text-label text-fg-secondary', isLabelHidden && 'sr-only')}
      >
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      {description && (
        <Text slot="description" className="text-caption text-fg-muted">
          {description}
        </Text>
      )}

      {/* -ms-1 ชดเชย p-1 ของ Checkbox เพื่อให้กล่องตรงแนวกับ label ด้านบน */}
      <div className="-ms-1 grid gap-1">{children}</div>

      {isErrorStatus(status) ? (
        <FieldError className="text-caption text-danger-icon">{status?.message}</FieldError>
      ) : (
        status?.message && (
          <Text slot="description" className={statusTextClass[status.type]}>
            {status.message}
          </Text>
        )
      )}
    </RACCheckboxList>
  );
}
