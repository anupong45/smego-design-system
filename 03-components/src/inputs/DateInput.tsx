import {
  DatePicker as RACDatePicker,
  type DatePickerProps as RACDatePickerProps,
  DateInput as RACDateInput,
  DateSegment,
  Group,
  Label,
  Text,
  FieldError,
  Popover,
  Dialog as RACDialog,
  Calendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  Heading,
  Button as RACButton,
} from 'react-aria-components';
import { BuddhistCalendar } from '@internationalized/date';
import type { DateValue } from 'react-aria-components';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import {
  fieldStyles,
  statusTextClass,
  isErrorStatus,
  type InputStatus,
} from './fieldStyles';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · DateInput — ปฏิทิน พ.ศ.   (เดิมชื่อ DatePicker — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ชื่อชนกับ `DateInput` ของ React Aria เอง (segment ภายใน) — RAC import
   ถูก alias เป็น `RACDateInput` เพื่อไม่ให้ชนกับชื่อ export ของเรา
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `status` (เดิมชื่อ `errorMessage`) · `isOptional` (เดิมชื่อ `showOptional`)
   ไม่รับ `min` `max` `dateConstraints` `numberOfMonths` `hasClear`
          `placeholder` ของ Astryx — ไม่มี use case ใน marketplace ตอนนี้
   ───────────────────────────────────────────────────────────────────────────
   ★★★ นี่คือเหตุผลที่ระบบเลือก React Aria แทน Radix (ข้อ 21)

   `BuddhistCalendar` จาก `@internationalized/date` ทำให้ **พ.ศ. ได้มาฟรี**
   ทั้งการแสดงผล การพิมพ์ และการนำทางในปฏิทิน
   Radix ไม่มี date picker เลย · ไลบรารีอื่นต้องเขียนตัวแปลงปีเอง
   ซึ่งพังที่ขอบปี (31 ธ.ค. / 1 ม.ค.) เสมอ

   ยืนยันแล้ว: `2026-07-26` → ปี **2569** era `BE`

   ★★ `createCalendar` ต้องคืน `BuddhistCalendar` **เสมอ**

   ถ้าปล่อยให้ `I18nProvider` ตัดสินเอง จะได้ปฏิทินตาม locale string
   ซึ่งเราตั้งเป็น `th-TH-u-ca-buddhist` อยู่แล้ว **แต่**พึ่งค่าเริ่มต้น
   ของ CLDR ไม่ได้ — component จึงบังคับตรง ๆ

   ⚠️ ห้ามส่ง `createCalendar` ที่คืน Gregorian มาทับ — ผู้ใช้ไทยจะเห็น
   ค.ศ. ในบริบทเอกสารราชการซึ่งอ่านผิดทันที

   ★★ ค่าที่เก็บยังเป็น **ค.ศ.** เสมอ

   `DateValue` ที่ `onChange` ส่งออกอยู่ในปฏิทินที่ผู้ใช้เห็น (พ.ศ.)
   แต่ `.toString()` ให้ ISO ที่เป็น ค.ศ. — **ส่งค่านั้นขึ้น API**
   ห้ามส่งเลข 2569 เข้าฐานข้อมูล

   ★ segment แต่ละช่องเป็น spin button ที่แยก focus ได้
   ผู้ใช้พิมพ์ `26/07/2569` ได้ตรง ๆ โดยไม่ต้องเปิดปฏิทิน — สำคัญมาก
   เพราะการกรอกวันเกิดหรือวันจดทะเบียนด้วยปฏิทินคือการคลิก 30 ครั้ง
   ═══════════════════════════════════════════════════════════════════════════ */

/** บังคับปฏิทินพุทธ — ไม่รับ override */
function createBuddhistCalendar() {
  return new BuddhistCalendar();
}

export interface DateInputProps<T extends DateValue>
  extends Omit<
    RACDatePickerProps<T>,
    'children' | 'className' | 'style' | 'validationBehavior'
  > {
  label: string;
  description?: string;
  status?: InputStatus;
  isOptional?: boolean;
  className?: string;
}

export function DateInput<T extends DateValue>({
  label,
  description,
  status,
  isOptional,
  className,
  ...rest
}: DateInputProps<T>) {
  const s = useStrings();

  return (
    <RACDatePicker
      /* aria ไม่ใช่ native — เหตุผลเดียวกับ TextInput (ข้อ 25) */
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
      className={cn(fieldStyles.root, className)}
      {...rest}
    >
      <Label className={fieldStyles.label}>
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      <Group
        className={cn(
          fieldStyles.control({ size: 'md' }),
          'flex items-center gap-2',
          /* focus-within เพราะ focus จริงอยู่ที่ segment ข้างใน */
          'focus-within:border-edge-brand',
          'data-invalid:border-edge-danger',
        )}
      >
        {/* ★ พิมพ์ได้ตรง ๆ ไม่ต้องเปิดปฏิทิน */}
        <RACDateInput className="flex flex-1 items-center gap-0.5">
          {(segment) => (
            <DateSegment
              segment={segment}
              className={cn(
                'rounded-(--radius-xs) px-0.5 tabular-nums',
                'text-body text-fg',
                'outline-none',
                /* segment ที่ยังไม่กรอกต้องอ่านออก — fg-muted 6.05:1 */
                'data-placeholder:text-fg-muted',
                'data-focused:bg-primary-600 data-focused:text-on-brand',
                'data-disabled:text-fg-disabled',
              )}
            />
          )}
        </RACDateInput>

        <RACButton
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            /* ไอคอน 20 + p-1 = 28×28 ผ่าน SC 2.5.8 */
            'rounded-(--radius-control) p-1',
            'text-fg-muted',
            'transition-colors duration-fast ease-standard',
            'data-hovered:bg-sunken data-hovered:text-fg',
          )}
        >
          <Icon name="calendar" size={20} />
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
        placement="bottom start"
        offset={8}
        className={cn(
          'rounded-(--radius-overlay)',
          'border border-(--elevation-edge-floating)',
          'bg-(--elevation-surface-floating)',
          'shadow-(--elevation-floating)',
          'p-4',
          /* opacity เท่านั้น — ไม่มี transform (ข้อ 07) */
          'data-entering:animate-[fade-in_150ms_ease-out]',
          'data-exiting:animate-[fade-out_150ms_ease-in]',
        )}
      >
        <RACDialog className="outline-none">
          {/* ★ createCalendar บังคับพุทธ — ไม่รับ override */}
          <Calendar createCalendar={createBuddhistCalendar} className="min-w-0">
            <header className="flex items-center justify-between gap-2 pb-3">
              <RACButton
                slot="previous"
                className={cn(
                  'inline-flex items-center justify-center rounded-(--radius-control) p-1',
                  'text-fg-secondary',
                  'data-hovered:bg-sunken data-hovered:text-fg',
                )}
              >
                <Icon name="chevron-left" size={20} />
              </RACButton>

              {/* RAC ใส่ชื่อเดือน+ปี พ.ศ. ให้เอง จาก createCalendar */}
              <Heading className="text-subtitle text-fg" />

              <RACButton
                slot="next"
                className={cn(
                  'inline-flex items-center justify-center rounded-(--radius-control) p-1',
                  'text-fg-secondary',
                  'data-hovered:bg-sunken data-hovered:text-fg',
                )}
              >
                <Icon name="chevron-right" size={20} />
              </RACButton>
            </header>

            <CalendarGrid className="border-collapse">
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className="pb-1 text-caption text-fg-muted">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>

              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={cn(
                      /* ★ 36×36 — เป้ากดในปฏิทินอยู่ชิดกันมาก
                         24 ขั้นต่ำผ่านก็จริง แต่บนมือถือกดพลาดง่าย */
                      'flex size-9 cursor-pointer items-center justify-center',
                      'rounded-(--radius-control)',
                      'text-body-sm text-fg tabular-nums',
                      'transition-colors duration-fast ease-standard',
                      'data-hovered:bg-sunken',
                      'data-selected:bg-primary-600 data-selected:text-on-brand',
                      /* วันนี้ต่างด้วย **ขอบ** ไม่ใช่แค่สี (SC 1.4.1) */
                      'data-[today]:border data-[today]:border-edge-brand',
                      'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
                      'data-outside-month:text-fg-disabled',
                    )}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </RACDialog>
      </Popover>
    </RACDatePicker>
  );
}

export { createBuddhistCalendar };
