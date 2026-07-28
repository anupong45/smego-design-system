import {
  NumberField as RACNumberField,
  type NumberFieldProps as RACNumberFieldProps,
  Label,
  Input,
  Group,
  Button as RACButton,
  Text,
  FieldError,
} from 'react-aria-components';
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
   SME.GO · NumberInput   (เดิมชื่อ NumberField — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `status` (เดิมชื่อ `errorMessage`) · `isOptional` (เดิมชื่อ `showOptional`)
   คงไว้  `hideStepper` `suffix` (ours-only)
   ไม่รับ `min` `max` `units` `isIntegerOnly` `hasClear` `startIcon` ของ
          Astryx — RAC ให้ minValue/maxValue อยู่แล้ว ไม่มี use case อื่น
   ───────────────────────────────────────────────────────────────────────────
   ★★ ตัวเลขที่ต้องคำนวณต้องใช้ตัวนี้ **ไม่ใช่ `<TextField inputMode="numeric">`**

   RAC จัดการให้ทั้งชุด:
     • คั่นหลักพัน `1,250,000` ขณะพิมพ์ และถอดกลับเป็นตัวเลขให้ `onChange`
     • บังคับ min/max ตอน blur ไม่ใช่ตอนพิมพ์ (พิมพ์ 1 ก่อนจะเป็น 100 ได้)
     • ลูกศรขึ้น/ลง · PageUp/PageDown · Home/End
     • ปุ่มเพิ่ม/ลดที่มีชื่อจาก `@react-aria/numberfield`

   เขียนเองมักพลาดข้อ 2 — ผู้ใช้พิมพ์ "5" ในช่องที่ min=100 แล้วโดนเด้งเป็น 100
   ทันทีจนพิมพ์ 500 ไม่ได้

   ⚠️ **ช่องนี้ไม่ใช่ `role="spinbutton"`** — ตรวจแล้วใน RAC 1.19:
   input เป็น `type="text"` + `inputMode="numeric"` **ไม่มี role และไม่มี
   `aria-valuenow/min/max`**

   เป็นการตัดสินใจของ React Aria เอง เพราะ `role="spinbutton"` ทำให้
   screen reader หลายตัวเข้าโหมดอ่านค่าแทนโหมดแก้ข้อความ ผู้ใช้จึง
   พิมพ์ทับไม่ได้ · ขอบเขต min/max สื่อผ่าน **ข้อความ error และ
   `description`** แทน — ซึ่งเป็นเหตุผลที่ `description` ควรระบุช่วงที่รับได้

   ★★ `font-numeric` (tabular-nums) **จำเป็น ไม่ใช่ตกแต่ง**
   ช่องจำนวนเงินที่หลักไม่ตรงกันทำให้อ่านผิดหลัก (ข้อ 03 §2)

   ★ ปุ่มเพิ่ม/ลดเป็น **ทางเลือกที่ไม่ต้องพิมพ์** — ช่วยผู้ใช้ที่ควบคุม
   คีย์บอร์ดยาก · แต่ **ไม่ใช่ทางเลือกแทนการลาก** (นั่นคือ SC 2.5.7 ของ Slider)

   ⚠️ ปุ่มได้ `aria-hidden` ไม่ได้ — RAC ใส่ชื่อจาก `@react-aria/numberfield`
   ซึ่งแปลไทยแล้วใน `strings-rac.th.ts` ("เพิ่มค่า" / "ลดค่า")
   ═══════════════════════════════════════════════════════════════════════════ */

export interface NumberInputProps
  extends Omit<
    RACNumberFieldProps,
    'children' | 'className' | 'style' | 'validationBehavior'
  >,
    BaseFieldProps {
  /** หน่วยต่อท้ายในช่อง เช่น "บาท" "ชิ้น" */
  suffix?: string;
  /** ซ่อนปุ่มเพิ่ม/ลด — ใช้กับช่องที่ค่ากว้างมาก เช่นจำนวนเงิน */
  hideStepper?: boolean;
}

export function NumberInput({
  label,
  isLabelHidden,
  description,
  status,
  isOptional,
  suffix,
  hideStepper,
  size,
  className,
  ...rest
}: NumberInputProps) {
  const s = useStrings();

  return (
    <RACNumberField
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
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
          'flex items-center gap-1',
          'focus-within:border-edge-brand',
          'data-invalid:border-edge-danger',
        )}
      >
        <Input
          className={cn(
            'w-full min-w-0 border-0 bg-transparent p-0 outline-none',
            /* ★ tabular-nums — หลักต้องตรงกัน */
            'text-body text-fg font-numeric tabular-nums',
            'placeholder:text-fg-muted',
          )}
        />

        {suffix && (
          <span aria-hidden="true" className="shrink-0 text-caption text-fg-muted">
            {suffix}
          </span>
        )}

        {!hideStepper && (
          /* ★★ เรียง**แนวนอน** ไม่ใช่แนวตั้ง — วัดแล้วสองเหตุผล
             1. แนวตั้งได้ปุ่มละ **20×16** ซึ่ง **ไม่ผ่าน SC 2.5.8** (ต้อง 24×24)
             2. คอลัมน์สูง 32px ดันช่องเป็น **50px** ผิดจากความสูง control
                ที่ล็อกไว้ 46px (ข้อ 30) — ฟอร์มที่มี TextField คู่กันจะไม่ตรงแนว
             แนวนอน 24×24 เตี้ยกว่า line box 28px จึงไม่ดันความสูง */
          <div className="flex shrink-0 items-center gap-0.5">
            <RACButton
              slot="decrement"
              className={cn(
                'inline-flex size-6 shrink-0 items-center justify-center',
                'rounded-(--radius-xs)',
                'text-fg-muted',
                'transition-colors duration-fast ease-standard',
                'data-hovered:bg-sunken data-hovered:text-fg',
                'data-disabled:text-fg-disabled',
              )}
            >
              <Icon name="minus" size={16} />
            </RACButton>
            <RACButton
              slot="increment"
              className={cn(
                'inline-flex size-6 shrink-0 items-center justify-center',
                'rounded-(--radius-xs)',
                'text-fg-muted',
                'transition-colors duration-fast ease-standard',
                'data-hovered:bg-sunken data-hovered:text-fg',
                'data-disabled:text-fg-disabled',
              )}
            >
              <Icon name="plus" size={16} />
            </RACButton>
          </div>
        )}
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
    </RACNumberField>
  );
}
