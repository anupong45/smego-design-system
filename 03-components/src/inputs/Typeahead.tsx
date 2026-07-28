import {
  ComboBox as RACComboBox,
  type ComboBoxProps as RACComboBoxProps,
  Label,
  Input,
  Group,
  Button as RACButton,
  Popover,
  ListBox,
  Text,
  FieldError,
} from 'react-aria-components';
import { useState } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import {
  fieldStyles,
  statusTextClass,
  isErrorStatus,
  type InputStatus,
  type BaseFieldProps,
} from './fieldStyles';
import { SelectItem, type SelectOption } from './Selector';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Typeahead — เลือกจากรายการโดยพิมพ์กรองได้ (เดิมชื่อ ComboBox — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `status` (เดิมชื่อ `errorMessage`) · `isOptional` (เดิมชื่อ `showOptional`)
   คงไว้  `options` (ours-only — ใช้ type เดียวกับ Selector แทน `searchSource` ของ Astryx)
   ไม่รับ `searchSource` `debounceMs` `renderItem` `maxMenuItems`
          `emptySearchResultsText` `onChangeQuery` ของ Astryx — เราไม่ทำ
          async search ในตัวนี้ (ถ้าต้องการค่อยแยก component)
   ───────────────────────────────────────────────────────────────────────────
   ★★★ Thai IME — **จุดที่ ComboBox ต่างจาก TextField อย่างมีนัยสำคัญ**

   ComboBox กรองรายการทุก keystroke · ระหว่างประกอบตัวอักษรไทย
   ("ก" → "กร" → "กรุ" → "กรุง") รายการจะกรองด้วยคำที่ยังไม่สมบูรณ์

   ต่างจาก TextField ตรงที่ **ผลลัพธ์เห็นได้ทันที** — ผู้ใช้พิมพ์ "กรุงเทพ"
   แล้วเห็นรายการกระพริบว่างเปล่ากลางทาง ทำให้คิดว่าไม่มีข้อมูล
   แล้วลบทิ้งพิมพ์ใหม่

   ⚠️ แต่ **กัน `onInputChange` ทั้งหมดไม่ได้** เหมือน TextField
   เพราะผู้ใช้ต้องเห็นสิ่งที่ตัวเองพิมพ์ในช่อง

   ทางแก้: ปล่อยให้ช่องแสดงข้อความตามปกติ แต่ **กันเฉพาะการกรอง**
   ระหว่าง composition — รายการจะค้างที่ผลของคำก่อนหน้าจนประกอบเสร็จ

   ★★ `allowsEmptyCollection` เปิดไว้ พร้อมข้อความ "ไม่พบตัวเลือกที่ตรงกัน"
   ถ้าไม่เปิด popover จะปิดเงียบ ๆ และผู้ใช้ไม่รู้ว่าพิมพ์ผิดหรือไม่มีข้อมูล

   ★ `menuTrigger="focus"` — เปิดรายการทันทีที่ focus
   ผู้ใช้ที่ไม่รู้ว่ามีตัวเลือกอะไรจะได้เห็นก่อนพิมพ์
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TypeaheadProps
  extends Omit<
    RACComboBoxProps<SelectOption>,
    'children' | 'className' | 'style' | 'validationBehavior' | 'items'
  >,
    BaseFieldProps {
  options: SelectOption[];
  placeholder?: string;
}

export function Typeahead({
  label,
  isLabelHidden,
  options,
  description,
  status,
  isOptional,
  placeholder,
  size,
  className,
  onInputChange,
  ...rest
}: TypeaheadProps) {
  const s = useStrings();
  const [isComposing, setComposing] = useState(false);

  return (
    <RACComboBox
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
      /* ★ ต้องเปิด ไม่งั้น popover ปิดเงียบเมื่อไม่มีผลลัพธ์ */
      allowsEmptyCollection
      menuTrigger="focus"
      className={cn(fieldStyles.root, className)}
      {...rest}
    >
      <Label className={cn(fieldStyles.label, isLabelHidden && 'sr-only')}>
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      <Group
        className={cn(
          fieldStyles.control({ size }),
          'flex items-center gap-2',
          'focus-within:border-edge-brand',
          'data-invalid:border-edge-danger',
        )}
      >
        <Input
          placeholder={placeholder}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={(e) => {
            setComposing(false);
            /* ★ กรองทีเดียวเมื่อประกอบเสร็จ — ไม่ใช่ทุก keystroke */
            onInputChange?.((e.target as HTMLInputElement).value);
          }}
          onChange={(e) => {
            /* ระหว่าง composition ช่องยังแสดงข้อความตามปกติ (React ควบคุมเอง)
               แต่**ไม่แจ้งการกรอง** จนกว่าจะประกอบเสร็จ */
            if (!isComposing) onInputChange?.(e.target.value);
          }}
          className={cn(
            'w-full min-w-0 border-0 bg-transparent p-0 outline-none',
            'text-body text-fg',
            'placeholder:text-fg-muted',
          )}
        />

        <RACButton
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            'rounded-(--radius-xs) p-1',
            'text-fg-muted',
            'transition-colors duration-fast ease-standard',
            'data-hovered:bg-sunken data-hovered:text-fg',
          )}
        >
          <Icon name="chevron-down" size={20} />
        </RACButton>
      </Group>

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
          /* ★ ข้อความเมื่อไม่มีผลลัพธ์ — ไม่ปล่อยกล่องว่าง */
          renderEmptyState={() => (
            <p className="px-3 py-4 text-center text-body-sm text-fg-muted">
              {s.common.noMatches}
            </p>
          )}
          className="max-h-64 overflow-auto p-1 outline-none"
        >
          {(item) => (
            <SelectItem id={item.id} textValue={item.label} isDisabled={item.isDisabled}>
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
    </RACComboBox>
  );
}
