import {
  TextField as RACTextField,
  type TextFieldProps as RACTextFieldProps,
  Label,
  Input,
  Text,
  FieldError,
  Button as RACButton,
} from 'react-aria-components';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';
import { Icon } from '../icon/Icon';
import { Spinner } from '../feedback/Spinner';
import {
  fieldStyles,
  statusTextClass,
  isErrorStatus,
  type BaseFieldProps,
} from './fieldStyles';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · TextInput   (เดิมชื่อ TextField — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   ★ `validationBehavior="aria"` **ห้ามใช้ `"native"`**

   โหมด native ใช้ constraint validation ของ browser ซึ่งแสดง tooltip
   ของ browser เอง — **style ไม่ได้ และขึ้นภาษาตาม OS ไม่ใช่ภาษาไทย**
   สำหรับแพลตฟอร์มภาษาไทยมีทางเลือกเดียว (ข้อ 25)

   ★ ⚠️ Thai IME — ห้าม validate กลาง composition

   ผู้ใช้ไทยพิมพ์ผ่าน input method ที่ประกอบหลาย code point เป็นหนึ่งตัว
   (ที่ = ท + ี + ่) ระหว่างประกอบ `onChange` ยิงหลายครั้งด้วยค่าที่ยังไม่
   สมบูรณ์ ถ้าตรวจทันทีทุก keystroke ผู้ใช้จะเห็น error **กระพริบขึ้น
   ระหว่างพิมพ์คำที่ถูกต้อง** ซึ่งบั่นทอนความมั่นใจในระบบ และขัดหลัก
   "ความน่าเชื่อถือมาก่อนความสวยงาม" ในข้อ 01 โดยตรง

   component นี้จัดการให้แล้วด้วย `onCompositionStart/End` —
   ปัญหานี้ **ไม่ปรากฏเลยเมื่อทดสอบด้วยภาษาอังกฤษ**

   ★ ขอบต้องเป็น `border-edge-strong` (SC 1.4.11)
   ขอบ input คือขอบเขตของ UI component ต้องผ่าน 3:1
   `neutral-300` ที่ 1.56:1 ใช้ไม่ได้ — เป็นความผิดพลาดที่ระบบส่วนใหญ่
   พลาดแบบเงียบ ๆ เพราะมันดู "นุ่มพอดี"

   ★ label อยู่ **เหนือ** input เสมอทุก breakpoint (ข้อ 08 §7)
   ไม่ใช่แค่บนมือถือ — เพราะ label ไทยยาว ("เลขทะเบียนนิติบุคคล 13 หลัก")
   และการวางข้างจะบีบ input ให้แคบลงอย่างคาดเดาไม่ได้

   ★ RAC ต่อ `aria-describedby` ระหว่าง Input · Text · FieldError ให้เอง
   wrapper นี้ **ห้ามกลืน** การเชื่อมนั้น จึงใช้ slot ของ RAC ตรง ๆ

   ── สิ่งที่รับมาจาก Astryx และสิ่งที่ไม่รับ ──────────────────────────────
   รับ    `label` บังคับ · `isLabelHidden` · `status` · `isOptional` ·
          `startIcon` (เดิมชื่อ `prefix`) · `isLoading` · `hasClear`
   ไม่รับ `changeAction` (D8) · `htmlName` (D15) · `width` (D6) ·
          `changeAction` (D8) · `htmlName` (D15) · `width` (D6) ·
          `labelTooltip` `disabledMessage` `onEnter` `hasAutoFocus` (D16)

   ★ `size` **มีทั้งสองฝั่งแต่คนละค่า** — ของ Astryx คือ 18/26px ซึ่งต่ำกว่า
     เกณฑ์ touch ของระบบนี้ ส่วนของเราคือ `md`/`lg` = 38/46px (D1)
     ⚠️ เดิมบรรทัด "ไม่รับ" เขียนรวม `size` ไว้ ซึ่งอ่านได้ว่า "ไม่มี prop นี้"
     ทั้งที่มี · เกต lint-api-comments จับได้เมื่อ 2026-07-29
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TextInputProps
  extends Omit<RACTextFieldProps, 'children' | 'className' | 'style' | 'validationBehavior'>,
    BaseFieldProps {
  /** ตัวอย่างข้อความในช่อง — **ไม่ใช่** ที่แทน label */
  placeholder?: string;

  /** element นำหน้าในช่อง เช่นไอคอนค้นหา (เดิมชื่อ `prefix`) */
  startIcon?: ReactNode;

  /**
   * กำลังตรวจค่าอยู่ เช่นเช็คเลขนิติบุคคลกับกรมพัฒน์
   *
   * ไม่ปิดการพิมพ์ — ผู้ใช้ยังแก้ค่าได้ระหว่างรอ การล็อกช่องระหว่าง
   * ตรวจสอบเบื้องหลังทำให้ผู้ใช้รู้สึกว่าระบบค้าง
   */
  isLoading?: boolean;

  /** ปุ่มล้างค่าในช่อง — คืน focus กลับที่ input หลังกด */
  hasClear?: boolean;
}

export function TextInput({
  label,
  isLabelHidden,
  description,
  status,
  isOptional,
  size,
  placeholder,
  startIcon,
  isLoading,
  hasClear,
  className,
  value,
  onChange,
  ...rest
}: TextInputProps) {
  const s = useStrings();
  /* ★ กัน validate กลาง IME composition — ดูเหตุผลด้านบน */
  const [isComposing, setComposing] = useState(false);
  const [uncontrolled, setUncontrolled] = useState('');

  const current = value ?? uncontrolled;
  const showClear = Boolean(hasClear && current);
  /* startIcon · ปุ่มล้าง · ตัวหมุน ล้วนต้องอยู่ในกล่องเดียวกับ input
     จึงต้องมี wrapper เมื่อมีอย่างใดอย่างหนึ่ง */
  const needsBox = Boolean(startIcon || showClear || isLoading);

  const handleChange = (v: string) => {
    if (value === undefined) setUncontrolled(v);
    if (!isComposing) onChange?.(v);
  };

  const input = (
    <Input
      placeholder={placeholder}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
      onChange={(e) => handleChange(e.target.value)}
      className={
        needsBox
          ? /* input ข้างในไม่มีขอบเอง — กล่องนอกเป็นขอบเขต */
            'w-full min-w-0 border-0 bg-transparent p-0 outline-none placeholder:text-fg-muted'
          : cn(fieldStyles.control({ size }), 'focus:border-edge-brand')
      }
    />
  );

  return (
    <RACTextField
      /* ★ aria ไม่ใช่ native — browser tooltip style ไม่ได้และขึ้นภาษาตาม OS */
      validationBehavior="aria"
      /* เฉพาะ error เท่านั้นที่ทำให้ invalid — warning/success ยังส่งฟอร์มได้ */
      isInvalid={isErrorStatus(status)}
      value={value}
      className={cn(fieldStyles.root, className)}
      {...rest}
    >
      <Label className={cn(fieldStyles.label, isLabelHidden && 'sr-only')}>
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      {needsBox ? (
        <div
          className={cn(
            fieldStyles.control({ size }),
            'flex items-center gap-2',
            /* focus-within เพราะ input จริงอยู่ข้างใน — ผู้ใช้คีย์บอร์ด
               ต้องเห็นว่ากล่องทั้งกล่องกำลังถูก focus */
            'focus-within:border-edge-brand',
          )}
        >
          {startIcon && (
            <span aria-hidden="true" className="text-fg-muted">
              {startIcon}
            </span>
          )}

          {input}

          {isLoading && (
            /* ★ เดิมเป็น `animate-spin` ซึ่ง **ไม่อยู่ในรายการ ALLOW** ของ
               `base.css §10` — ตัวหมุนจึงค้างนิ่งเมื่อผู้ใช้เปิด reduced motion
               `<Spinner>` ใช้ `.spinner` ที่ได้รับการยกเว้นไว้ (ดู `Spinner.tsx`)

               `isLabelHidden` เพราะไม่มีที่ว่างในช่อง — แต่ยังต้องประกาศ
               เพราะการหมุนอย่างเดียวไม่สื่ออะไรกับผู้ใช้ screen reader */
            <Spinner size="sm" shade="subtle" label={s.common.loading} isLabelHidden />
          )}

          {showClear && (
            <RACButton
              /* ★ ไม่ใช้ <Button> ของเรา — ปุ่มในช่องต้องไม่มีพื้นและขอบ
                 พื้นที่กดยังได้ 24×24 จาก p-1 + ไอคอน 16 (SC 2.5.8) */
              aria-label={s.common.clear}
              onPress={() => handleChange('')}
              className="rounded-(--radius-sm) p-1 text-fg-muted data-hovered:text-fg data-focus-visible:outline-2"
            >
              <Icon name="x" size={16} aria-hidden="true" />
            </RACButton>
          )}
        </div>
      ) : (
        input
      )}

      {/* slot="description" ทำให้ RAC เชื่อม aria-describedby ให้เอง */}
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}

      {/* error ใช้ FieldError เพื่อให้ RAC เชื่อม aria-describedby
          ส่วน warning/success ไม่ใช่ error จึงต้องประกาศเอง */}
      {isErrorStatus(status) ? (
        <FieldError className={fieldStyles.error}>{status?.message}</FieldError>
      ) : (
        status?.message && (
          <Text slot="description" className={statusTextClass[status.type]}>
            {status.message}
          </Text>
        )
      )}
    </RACTextField>
  );
}
