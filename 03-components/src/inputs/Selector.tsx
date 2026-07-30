'use client';

import {
  Select as RACSelect,
  type SelectProps as RACSelectProps,
  SelectValue,
  Label,
  Button as RACButton,
  Popover,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Text,
  FieldError,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import {
  fieldStyles,
  statusTextClass,
  isErrorStatus,
  type InputStatus,
  type BaseFieldProps,
} from './fieldStyles';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Selector   (เดิมชื่อ Select — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `status` (เดิมชื่อ `errorMessage`) · `isOptional` (เดิมชื่อ `showOptional`)
   ไม่รับ `hasSearch` `hasClear` `renderOption` `placement` `startIcon`
          `isDefaultOpen` ของ Astryx — ไม่มี use case ใน marketplace ตอนนี้
   ───────────────────────────────────────────────────────────────────────────
   ★★ ใช้เมื่อ **ตัวเลือกเป็นชุดปิดและผู้ใช้รู้ว่าจะเลือกอะไร**

   ถ้าผู้ใช้ต้องค้นหาจากรายการยาว → `<Typeahead>` ที่พิมพ์กรองได้
   ถ้ามีไม่เกิน ~7 ตัวและต้องเห็นพร้อมกัน → `<RadioList>`

   ★★★ **ห้ามใช้ `<select>` ของ browser**

   ไม่ใช่เรื่องความสวยงาม — UI ของ `<select>` **ขึ้นภาษาตาม OS**
   ผู้ใช้ที่ตั้งเครื่องเป็นอังกฤษจะเห็นข้อความระบบเป็นอังกฤษกลางฟอร์มไทย
   และ style ไม่ได้เลยบน Windows/Android (เหตุผลเดียวกับที่ห้าม
   `validationBehavior="native"` และ `<input type="file">` ดิบ)

   ★★ รายการยาวต้อง **มีความสูงจำกัดและเลื่อนในกล่องตัวเอง**
   `max-h-64` + `overflow-auto` — ถ้าปล่อยยาว popover จะล้นจอบนมือถือ
   และผู้ใช้เลื่อนหน้าแทนที่จะเลื่อนรายการ

   ⚠️ `overflow-auto` ตัดวงแหวน focus ทั้งสองแกน → ต้องมี `p-1`
   เหมือน `ChipRow` (ข้อ 05 §5)

   ★ ความกว้าง popover ผูกกับปุ่มด้วย `--trigger-width`
   ถ้าไม่ผูก รายการจะกว้างตามข้อความยาวสุดแล้วดูไม่เกี่ยวกับช่อง
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
  isDisabled?: boolean;
}

export interface SelectorProps
  extends Omit<
    RACSelectProps<SelectOption>,
    'children' | 'className' | 'style' | 'validationBehavior' | 'items'
  >,
    BaseFieldProps {
  options: SelectOption[];
  /** ข้อความเมื่อยังไม่เลือก */
  placeholder?: string;
}

export function Selector({
  label,
  isLabelHidden,
  options,
  description,
  status,
  isOptional,
  placeholder,
  size,
  className,
  ...rest
}: SelectorProps) {
  const s = useStrings();

  return (
    <RACSelect
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
      placeholder={placeholder ?? s.common.selectPlaceholder}
      className={cn(fieldStyles.root, className)}
      {...rest}
    >
      <Label className={cn(fieldStyles.label, isLabelHidden && 'sr-only')}>
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      <RACButton
        className={cn(
          fieldStyles.control({ size }),
          'flex items-center justify-between gap-2 text-start',
          'cursor-pointer',
          'data-focus-visible:border-edge-brand',
          'data-invalid:border-edge-danger',
          'data-disabled:cursor-not-allowed',
        )}
      >
        {/* SelectValue แสดง placeholder เองเมื่อยังไม่เลือก */}
        <SelectValue className="min-w-0 truncate data-placeholder:text-fg-muted" />
        <Icon name="chevron-down" size={20} className="shrink-0 text-fg-muted" />
      </RACButton>

      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}

      {isErrorStatus(status) ? (
        <FieldError className={fieldStyles.error}>{status?.message}</FieldError>
      ) : (
        status?.message && (
          <Text slot="description" className={statusTextClass[status.type]}>
            {status.message}
          </Text>
        )
      )}

      <Popover
        offset={4}
        className={cn(
          /* ★ กว้างเท่าปุ่ม — ไม่ใช่กว้างตามข้อความยาวสุด */
          'w-(--trigger-width)',
          'rounded-(--radius-control)',
          'border border-(--elevation-edge-floating)',
          'bg-(--elevation-surface-floating)',
          'shadow-(--elevation-floating)',
          'data-entering:animate-[fade-in_150ms_ease-out]',
          'data-exiting:animate-[fade-out_150ms_ease-in]',
        )}
      >
        <ListBox
          items={options}
          className={cn(
            'relative max-h-64 overflow-auto outline-none',
            /* วงแหวน focus 4px — `overflow-auto` ตัดทั้งสองแกน */
            'p-1',
          )}
        >
          {(item) => (
            <SelectItem
              id={item.id}
              textValue={item.label}
              isDisabled={item.isDisabled}
            >
              <span className="grid min-w-0 gap-0.5">
                <span className="min-w-0">{item.label}</span>
                {item.description && (
                  <span className="text-caption text-fg-muted">{item.description}</span>
                )}
              </span>
            </SelectItem>
          )}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SelectItem — ใช้ร่วมกับ Typeahead ด้วย
   ───────────────────────────────────────────────────────────────────────────── */

export interface SelectItemProps extends Omit<ListBoxItemProps, 'className'> {
  children: ReactNode;
  className?: string;
}

/**
 * ★ ตัวที่เลือกอยู่มี **เครื่องหมายถูก** ไม่ใช่แค่พื้นสี (SC 1.4.1)
 * เพราะพื้น hover กับพื้น selected ต่างกันไม่มากพอเมื่อแยกสีไม่ได้
 */
export function SelectItem({ children, className, ...rest }: SelectItemProps) {
  return (
    <ListBoxItem
      className={cn(
        'flex min-w-0 cursor-pointer items-start justify-between gap-2',
        /* เป้ากด 40px — รายการในเมนูอยู่ชิดกัน */
        'rounded-(--radius-xs) px-3 py-2',
        'text-body-sm text-fg',
        'outline-none',
        'data-focused:bg-sunken',
        'data-selected:bg-selected-surface data-selected:text-selected-fg',
        'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
        className,
      )}
      {...rest}
    >
      {({ isSelected }) => (
        <>
          {children}
          {isSelected && (
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary-600" />
          )}
        </>
      )}
    </ListBoxItem>
  );
}
