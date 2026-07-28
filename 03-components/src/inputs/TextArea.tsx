import {
  TextField as RACTextField,
  type TextFieldProps as RACTextFieldProps,
  Label,
  /* ⚠️ ต้อง alias — ของ RAC ชื่อชนกับ component ที่ไฟล์นี้ export
     นี่คือกับดักที่ ASTRYX-PARITY.md §7 ข้อ 3 เตือนไว้: `Textarea` → `TextArea`
     ต่างกันแค่ตัวพิมพ์ บน macOS ที่ filesystem ไม่แยก case จะพลาดแบบเงียบ ๆ */
  TextArea as RACTextArea,
  Text,
  FieldError,
} from 'react-aria-components';
import { useState } from 'react';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';
import {
  fieldStyles,
  statusTextClass,
  isErrorStatus,
  type BaseFieldProps,
} from './fieldStyles';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · TextArea   (เดิมชื่อ Textarea — ดู ASTRYX-PARITY.md §1.2)
   ───────────────────────────────────────────────────────────────────────────
   เหตุผลเชิงโครงสร้างทั้งหมด (validationBehavior · Thai IME · ขอบ · label)
   เหมือน `TextInput.tsx` ทุกข้อ — อ่านที่นั่น ไม่คัดลอกมาซ้ำเพื่อไม่ให้
   สองไฟล์อธิบายคนละเวอร์ชันเมื่อมีการแก้
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TextAreaProps
  extends Omit<RACTextFieldProps, 'children' | 'className' | 'style' | 'validationBehavior'>,
    BaseFieldProps {
  placeholder?: string;
  /** จำนวนบรรทัดเริ่มต้น · ค่าเริ่มต้น 4 */
  rows?: number;
}

export function TextArea({
  label,
  isLabelHidden,
  description,
  status,
  isOptional,
  size,
  placeholder,
  rows = 4,
  className,
  onChange,
  ...rest
}: TextAreaProps) {
  const s = useStrings();
  const [isComposing, setComposing] = useState(false);

  return (
    <RACTextField
      validationBehavior="aria"
      isInvalid={isErrorStatus(status)}
      className={cn(fieldStyles.root, className)}
      {...rest}
    >
      <Label className={cn(fieldStyles.label, isLabelHidden && 'sr-only')}>
        {label}
        {isOptional && <span className="text-fg-muted"> ({s.common.optional})</span>}
      </Label>

      <RACTextArea
        rows={rows}
        placeholder={placeholder}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onChange={(e) => {
          if (!isComposing) onChange?.(e.target.value);
        }}
        className={cn(
          fieldStyles.control({ size }),
          'focus:border-edge-brand',
          /* ผู้ใช้ยืดได้เฉพาะแนวตั้ง — ยืดแนวนอนจะทำให้ layout พังที่ 320px */
          'resize-y',
          /* line-height 1.750 จาก text-body ทำให้ข้อความไทยหายใจได้
             วรรณยุกต์ไม่ชนกันระหว่างบรรทัด */
        )}
      />

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
    </RACTextField>
  );
}
