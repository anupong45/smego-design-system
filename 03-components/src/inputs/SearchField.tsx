'use client';

import {
  SearchField as RACSearchField,
  type SearchFieldProps as RACSearchFieldProps,
  Label,
  Input,
  Group,
  Button as RACButton,
  Text,
  FieldError,
} from 'react-aria-components';
import { useState } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { fieldStyles } from './fieldStyles';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · SearchField
   ───────────────────────────────────────────────────────────────────────────
   ★★ RAC `SearchField` ให้สิ่งที่ `<TextField>` ให้ไม่ได้:
     • `type="search"` → `role="searchbox"` ที่ screen reader ประกาศต่างออกไป
     • **Escape ล้างค่า** — พฤติกรรมมาตรฐานที่ผู้ใช้คีย์บอร์ดคาดหวัง
     • ปุ่มล้างที่โผล่เมื่อมีค่าเท่านั้น พร้อมชื่อจาก RAC
       ("ล้างคำค้นหา" หลังติดตั้ง `installRacThaiStrings`)

   ★★ Thai IME — ปัญหาเดียวกับ TextField แต่**หนักกว่า**

   ช่องค้นหามักผูกกับการยิง API ทุก keystroke · ถ้าไม่กันช่วง composition
   ผู้ใช้ที่พิมพ์ "ที่" จะยิง API 3 ครั้งด้วยคำที่ยังประกอบไม่เสร็จ
   (ท → ที → ที่) ซึ่งเปลืองและทำให้ผลกระพริบ

   component กัน `onChange` ระหว่าง composition ให้แล้ว —
   **แต่การ debounce ยังเป็นหน้าที่ของผู้เรียก**

   ★ label ต้องมีเสมอ แม้จะซ่อนด้วยสายตา
   ช่องค้นหาที่มีแต่ placeholder คือช่องที่ screen reader อ่านว่า "searchbox"
   เฉย ๆ · ใช้ `labelHidden` เมื่อบริบทชัดจากไอคอนแว่นขยายอยู่แล้ว
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SearchFieldProps
  extends Omit<
    RACSearchFieldProps,
    'children' | 'className' | 'style' | 'validationBehavior'
  > {
  label?: string;
  /** ซ่อน label ด้วยสายตา — ยังอยู่ให้ screen reader */
  labelHidden?: boolean;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function SearchField({
  label,
  labelHidden,
  description,
  errorMessage,
  placeholder,
  size,
  className,
  onChange,
  ...rest
}: SearchFieldProps) {
  const s = useStrings();
  /* ★ กัน validate/ยิง API กลาง IME composition — ดู TextField.md §4 */
  const [isComposing, setComposing] = useState(false);

  return (
    <RACSearchField
      validationBehavior="aria"
      isInvalid={Boolean(errorMessage)}
      className={cn(fieldStyles.root, className)}
      {...rest}
    >
      <Label className={cn(fieldStyles.label, labelHidden && 'sr-only')}>
        {label ?? s.common.search}
      </Label>

      <Group
        className={cn(
          fieldStyles.control({ size }),
          'flex items-center gap-2',
          'focus-within:border-edge-brand',
          'data-invalid:border-edge-danger',
        )}
      >
        <Icon name="search" size={20} className="shrink-0 text-fg-muted" />

        <Input
          placeholder={placeholder ?? s.search.placeholder}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onChange={(e) => {
            if (!isComposing) onChange?.(e.target.value);
          }}
          className={cn(
            'w-full min-w-0 border-0 bg-transparent p-0 outline-none',
            'text-body text-fg',
            'placeholder:text-fg-muted',
            /* ซ่อนปุ่มกากบาทของ browser — เรามีปุ่มของเราที่ style ได้
               และมีชื่อภาษาไทย */
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
        />

        {/* RAC ซ่อนปุ่มนี้เองเมื่อค่าว่าง — ไม่ต้องเช็ค */}
        <RACButton
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            /* 16 + p-1 = 24×24 พอดีเกณฑ์ SC 2.5.8 */
            'rounded-full p-1',
            'text-fg-muted',
            'transition-colors duration-fast ease-standard',
            'data-hovered:bg-sunken data-hovered:text-fg',
          )}
        >
          <Icon name="x" size={16} />
        </RACButton>
      </Group>

      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </RACSearchField>
  );
}
