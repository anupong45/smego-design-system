import { cva } from 'class-variance-authority';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · สไตล์และชนิดที่ใช้ร่วมกันทุก field
   ───────────────────────────────────────────────────────────────────────────
   เดิมของพวกนี้อยู่ใน `TextField.tsx` แล้ว Select · ComboBox · NumberField ·
   DatePicker · SearchField `import { fieldStyles } from './TextField'`
   ซึ่งทำให้ทุกตัวผูกกับไฟล์ของ component อื่นโดยไม่มีเหตุผล
   ตอน rename เป็น `TextInput` จึงย้ายออกมาไว้ตรงกลางเสียเลย

   ★ `status` แทน `errorMessage` — ตาม Astryx (ASTRYX-PARITY.md §8.1)

   ของเดิมรับได้แค่ error ทั้งที่ระบบมี token ครบสามระดับอยู่แล้ว
   (`danger` · `warning` · `success` ทั้ง -icon และ -edge)
   `warning` มีค่ากับ marketplace จริง: "ใกล้หมดเขตรับสมัคร" ไม่ใช่ error
   ที่ต้องกันไม่ให้ส่งฟอร์ม แต่ก็ไม่ใช่สถานะปกติ
   ═══════════════════════════════════════════════════════════════════════════ */

/** ระดับของสถานะช่องกรอก — `error` เท่านั้นที่กันการส่งฟอร์ม */
export type InputStatusType = 'error' | 'warning' | 'success';

/**
 * สถานะของช่องกรอก
 *
 * `type: 'error'` ทำให้ RAC ตั้ง `aria-invalid` และเชื่อม `aria-describedby`
 * ให้เอง ส่วน `warning` กับ `success` เป็นข้อมูลประกอบ ไม่ตั้ง `aria-invalid`
 * เพราะช่องยัง valid อยู่ — การประกาศว่า invalid ทั้งที่ส่งฟอร์มได้
 * จะทำให้ screen reader บอกความจริงคนละอย่างกับที่ตาเห็น
 */
export interface InputStatus {
  type: InputStatusType;
  /** ข้อความ — ตามสูตร อะไรผิด → ทำไม → แก้อย่างไร (SC 3.3.3) */
  message?: string;
}

export const fieldStyles = {
  root: 'grid min-w-0 gap-2',

  label: 'text-label text-fg-secondary',

  control: cva(
    [
      'w-full min-w-0',
      'rounded-(--radius-control)',
      'border',
      'bg-surface text-fg',
      'text-body',
      /* placeholder ต้องอ่านได้ — fg-muted (6.05:1) ไม่ใช่ fg-disabled (2.53:1) */
      'placeholder:text-fg-muted',
      'transition-colors duration-fast ease-standard',
      /* ★ ขอบเขตของ UI component — 4.20:1 ผ่าน SC 1.4.11 */
      'border-edge-strong',
      'data-hovered:border-fg-muted',
      /* invalid: ขอบ danger + ไม่พึ่งสีเดียว — มีข้อความ error กำกับด้วย */
      'data-invalid:border-edge-danger',
      'data-disabled:bg-sunken data-disabled:text-fg-disabled',
      'data-disabled:border-edge data-disabled:cursor-not-allowed',
      /* ⚠️ ไม่ตั้ง height — ความสูงมาจาก line-height + padding
         เพื่อให้ยืดตามเนื้อหาเมื่อผู้ใช้บังคับระยะตัวอักษร (SC 1.4.12)

         ⚠️ ห้ามรับ size ของ Astryx (sm 18px · md 26px) — ต่ำกว่าเกณฑ์
         touch ทั้งคู่ ดู ASTRYX-PARITY.md D1 */
    ],
    {
      variants: {
        size: {
          /* text-body(28px) + py-2(16) + border(2) = 46px — ตรงกับ md ของ Button */
          md: 'px-3 py-2',
          /* text-body(28px) + py-3(24) + border(2) = 54px */
          lg: 'px-4 py-3',
        },
      },
      defaultVariants: { size: 'md' },
    },
  ),

  description: 'text-caption text-fg-muted',

  /** ข้อความ error ต้องผ่าน AA — danger-icon = red-600 (5.97:1) */
  error: 'text-caption text-danger-icon',
};

/** สีข้อความตามระดับสถานะ — ทั้งสามค่าเป็น -icon ซึ่งผ่าน AA บนพื้น surface */
export const statusTextClass: Record<InputStatusType, string> = {
  error: 'text-caption text-danger-icon',
  warning: 'text-caption text-warning-icon',
  success: 'text-caption text-success-icon',
};

/** ขอบตามระดับสถานะ — ใช้กับ control ที่ไม่ได้พึ่ง `data-invalid` ของ RAC */
export const statusBorderClass: Record<InputStatusType, string> = {
  error: 'border-edge-danger',
  warning: 'border-warning-edge',
  success: 'border-success-edge',
};

/** สถานะที่กันการส่งฟอร์ม — มีแค่ `error` */
export const isErrorStatus = (s?: InputStatus): boolean => s?.type === 'error';

/** ชนิดที่ทุก field ใช้ร่วมกัน */
export interface BaseFieldProps {
  /** ข้อความ label — อยู่เหนือ input เสมอ บังคับเพื่อการันตี accessible name */
  label: string;

  /**
   * ซ่อน label จากสายตา แต่ยังอยู่ให้ screen reader
   *
   * ⚠️ ใช้เมื่อบริบทรอบข้างบอกความหมายชัดแล้วเท่านั้น การซ่อน label
   * ทำให้ผู้ใช้ที่มีปัญหาด้านความจำระยะสั้นเสียที่ยึด
   */
  isLabelHidden?: boolean;

  /**
   * คำอธิบายใต้ช่อง — บอกรูปแบบที่ต้องกรอก **ก่อน** ผู้ใช้กรอกผิด
   * ไม่ใช่รอให้ผิดแล้วค่อยบอก
   */
  description?: string;

  /** สถานะของช่อง — `error` เท่านั้นที่ทำให้ `aria-invalid` */
  status?: InputStatus;

  /** แสดงคำว่า "ไม่บังคับ" ต่อท้าย label เมื่อช่องไม่จำเป็น */
  isOptional?: boolean;

  size?: 'md' | 'lg';
  className?: string;
}
