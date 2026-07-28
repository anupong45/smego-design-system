import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { RadioList, Radio } from '../inputs/RadioList';
import { Button } from '../inputs/Button';
import { Icon } from '../icon/Icon';
import { useStrings, useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · PaymentMethodSelect · PromptPayQR · SlipUpload
   ───────────────────────────────────────────────────────────────────────────
   ⚠️⚠️ **ขอบเขตความรับผิดชอบ**

   component เหล่านี้ทำหน้าที่ **UI เท่านั้น** — การรับส่งข้อมูลบัตรเป็น
   เรื่องของ payment gateway ไม่ใช่ของ library นี้

   กฎที่ผูกกับ component จ่ายเงิน:
     • **ห้าม log** ค่าใด ๆ ที่ผู้ใช้กรอก
     • ห้ามเก็บเลขบัตรใน state นานกว่า render
     • **ต้องวางได้ทุกช่อง** รวม OTP (SC 3.3.8) — ห้าม `onPaste preventDefault`
     • `autocomplete` ต้องครบ (SC 1.3.5)

   ★★★ ลำดับช่องทางต้องตรงกับที่ SME ไทยใช้จริง

       พร้อมเพย์ QR → โอน + อัปโหลดสลิป → เครดิตเทอม → บัตรเครดิต

   การเอาบัตรขึ้นก่อนเป็น **สมมติฐานแบบ B2C ตะวันตก** ที่ไม่ตรงกับ B2B ไทย
   ผู้ประกอบการจำนวนมากไม่มีบัตรเครดิตนิติบุคคล และการโอนพร้อมสลิป
   ยังเป็นช่องทางหลักของการค้าส่ง

   ลำดับนี้ถูก**บังคับด้วยลำดับใน `PAYMENT_METHODS`** ไม่ใช่ปล่อยให้
   ผู้เรียกเรียงเอง เพื่อไม่ให้ drift ระหว่างหน้า
   ═══════════════════════════════════════════════════════════════════════════ */

export type PaymentMethod = 'promptpay' | 'transfer' | 'credit-term' | 'card';

export interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  /**
   * ช่องทางที่ใช้ไม่ได้ในคำสั่งซื้อนี้
   *
   * เช่นเครดิตเทอมที่ผู้ซื้อยังไม่ได้รับอนุมัติวงเงิน
   */
  disabledMethods?: PaymentMethod[];
  errorMessage?: string;
  className?: string;
}

export function PaymentMethodSelect({
  value,
  onChange,
  disabledMethods,
  errorMessage,
  className,
}: PaymentMethodSelectProps) {
  const s = useStrings();

  /* ★ ลำดับตายตัว — พร้อมเพย์ก่อน บัตรท้ายสุด */
  const methods: { id: PaymentMethod; label: string; description: string }[] = [
    { id: 'promptpay', label: s.payment.promptpay, description: s.payment.promptpayHelp },
    { id: 'transfer', label: s.payment.bankTransfer, description: s.payment.bankTransferHelp },
    { id: 'credit-term', label: s.payment.creditTerm, description: s.payment.creditTermHelp },
    { id: 'card', label: s.payment.card, description: '' },
  ];

  return (
    <RadioList
      label={s.payment.methodLabel}
      value={value}
      onChange={(v) => onChange(v as PaymentMethod)}
      status={errorMessage ? { type: 'error', message: errorMessage } : undefined}
      className={className}
    >
      {methods.map((m) => (
        <Radio
          key={m.id}
          value={m.id}
          layout="card"
          description={m.description || undefined}
          isDisabled={disabledMethods?.includes(m.id)}
        >
          {m.label}
        </Radio>
      ))}
    </RadioList>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PromptPayQR
   ───────────────────────────────────────────────────────────────────────────── */

export interface PromptPayQRProps {
  /** `data:` URI หรือ URL ของภาพ QR ที่ backend สร้าง */
  qrSrc: string;
  /** ยอดที่ต้องชำระ */
  amount: number;
  /** เลขอ้างอิงการชำระ — ผู้ใช้ต้องคัดลอกได้ */
  reference?: string;
  className?: string;
}

/**
 * ★★ QR ต้องมี **ทางเลือกที่เป็นข้อความ** เสมอ (SC 1.1.1)
 *
 * ผู้ใช้ที่มองไม่เห็นสแกน QR บนจอตัวเองไม่ได้ · ผู้ใช้ที่เปิดจากมือถือ
 * เครื่องเดียวกับที่จะสแกนก็สแกนตัวเองไม่ได้
 *
 * ยอดเงินและเลขอ้างอิงจึงเป็น**ข้อความจริงที่คัดลอกได้** ไม่ใช่อยู่ในภาพ
 *
 * ⚠️ `alt` ของภาพ QR **ไม่ควรพยายามอธิบายรหัส** — ใส่แค่ว่านี่คือ QR
 * สำหรับชำระเงิน แล้วให้ข้อมูลจริงอยู่ข้างนอกเป็นข้อความ
 *
 * ★ ห้ามใส่ countdown ที่หมดอายุแล้วหน้าเปลี่ยนเอง (SC 2.2.1)
 * ถ้า QR มีอายุ ต้องมีปุ่มขอใหม่ ไม่ใช่รีเฟรชอัตโนมัติ
 */
export function PromptPayQR({ qrSrc, amount, reference, className }: PromptPayQRProps) {
  const s = useStrings();
  const { locale } = useSmeGoLocale();
  const amountText = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div
      className={cn(
        'grid min-w-0 justify-items-center gap-3 rounded-(--radius-container) border p-4 md:p-6',
        'border-(--elevation-edge-raised) bg-(--elevation-surface-raised)',
        className,
      )}
    >
      {/* ★ `bg-scannable` = ขาวจริงทั้งสองธีม — QR ต้องมี contrast สูงสุด
         สำหรับกล้อง และ**ห้ามกลับสีในโหมดมืด** เพราะเครื่องอ่านจำนวนมาก
         อ่าน QR ที่กลับสีไม่ได้

         ใช้ token ไม่ใช่ `bg-white` เพราะ `--color-*: initial` ลบ palette
         ของ Tailwind ทิ้งแล้ว · และการมีชื่อทำให้ข้อยกเว้นนี้รีวิวได้ */}
      <div className="rounded-(--radius-sm) bg-scannable p-3">
        <img
          src={qrSrc}
          alt={s.payment.qrLabel}
          width={200}
          height={200}
          className="block size-50"
        />
      </div>

      {/* ★ ยอดเป็นข้อความจริง ไม่ได้อยู่ในภาพ */}
      <p className="text-title text-fg font-numeric">
        {amountText}
        <span className="ms-1 text-caption text-fg-muted">{s.common.currency}</span>
      </p>

      {reference && (
        <p className="text-caption text-fg-muted">
          {s.payment.reference}{' '}
          {/* เลือกทั้งก้อนได้ด้วยการดับเบิลคลิก */}
          <span className="select-all font-numeric text-fg-secondary">{reference}</span>
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SlipUpload
   ───────────────────────────────────────────────────────────────────────────── */

const MAX_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png'];

export interface SlipUploadProps {
  /** เรียกเมื่อผู้ใช้เลือกไฟล์ที่ผ่านการตรวจแล้ว */
  onSelect: (file: File) => void;
  /** ชื่อไฟล์ที่อัปโหลดแล้ว — แสดงสถานะสำเร็จ */
  uploadedName?: string;
  onRemove?: () => void;
  className?: string;
}

/**
 * ★★ ปุ่มเลือกไฟล์ต้องเป็น `<button>` ที่คุม `<input type="file">` ที่ซ่อนอยู่
 *
 * `<input type="file">` เองมี UI ของ browser ที่ style ไม่ได้ และ**ขึ้นภาษา
 * ตาม OS** — ผู้ใช้ที่ตั้งเครื่องเป็นอังกฤษจะเห็น "Choose File" กลางฟอร์มไทย
 * (เหตุผลเดียวกับที่ห้าม `validationBehavior="native"`)
 *
 * ⚠️ input ที่ซ่อนต้องซ่อนด้วย `sr-only` **ไม่ใช่ `display: none`**
 * เพราะ `display: none` ทำให้ focus ไปไม่ถึงและ screen reader มองไม่เห็น
 *
 * ★ ตรวจไฟล์ฝั่ง client เพื่อ**ให้ข้อความผิดพลาดเร็ว** ไม่ใช่เพื่อความปลอดภัย
 * — การตรวจจริงต้องทำที่ server เสมอ
 */
export function SlipUpload({ onSelect, uploadedName, onRemove, className }: SlipUploadProps) {
  const s = useStrings();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();
  const descId = useId();
  const labelId = useId();

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError(s.error.fileWrongType);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(s.error.fileTooLarge(MAX_MB));
      return;
    }
    setError(null);
    onSelect(file);
  };

  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <span id={labelId} className="text-label text-fg-secondary">
        {s.payment.uploadSlip}
      </span>
      <p id={descId} className="text-caption text-fg-muted">
        {s.payment.uploadSlipHelp}
      </p>

      {uploadedName ? (
        <div className="flex min-w-0 items-center gap-2 rounded-(--radius-control) border border-success-edge bg-success-surface p-3">
          <Icon name="circle-check" size={20} className="text-success-icon" />
          <span className="min-w-0 flex-1 truncate text-body-sm text-fg">{uploadedName}</span>
          {onRemove && (
            <Button variant="ghost" size="xs" onPress={onRemove}>
              {s.common.clear}
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* ★ input ซ่อนด้วย sr-only ไม่ใช่ display:none
             ⚠️ ยังต้องมี**ชื่อ** — `<span>` ที่มองเห็นไม่ได้ผูกกับ input เอง
             ผู้ใช้ screen reader ที่เข้า forms mode จะเจอ input ที่ไม่มีชื่อ
             (axe จับข้อนี้ให้: rule `label`) */}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            aria-labelledby={labelId}
            aria-describedby={cn(descId, error && errorId)}
            aria-invalid={error ? true : undefined}
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            variant="secondary"
            icon="upload"
            onPress={() => inputRef.current?.click()}
          >
            {s.payment.uploadSlip}
          </Button>
        </>
      )}

      {error && (
        /* ประกาศทันทีเพราะผู้ใช้เพิ่งทำสิ่งที่ล้มเหลว และต้องทำใหม่ */
        <p id={errorId} role="alert" className="text-caption text-danger-icon">
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PaymentFields — ช่องกรอกบัตร · `autocomplete` ครบตาม SC 1.3.5
   ───────────────────────────────────────────────────────────────────────────── */

export interface PaymentFieldsProps {
  children: ReactNode;
  className?: string;
}

/**
 * ตัวห่อสำหรับช่องกรอกบัตร — **ไม่เก็บค่าเอง**
 *
 * ⚠️ library นี้**ไม่มี** component ช่องกรอกเลขบัตร โดยตั้งใจ
 * เลขบัตรควรอยู่ใน iframe ของ payment gateway (Omise · 2C2P · GB Prime Pay)
 * เพื่อให้ขอบเขต PCI DSS ไม่ลามมาถึงแอปของเรา
 *
 * ถ้าจำเป็นต้องกรอกเองจริง ๆ ให้ใช้ `<TextField>` พร้อม:
 *
 *     autoComplete="cc-number"   inputMode="numeric"
 *     autoComplete="cc-exp"      autoComplete="cc-csc"
 *
 * และ **ห้าม** `onPaste={e => e.preventDefault()}` — ผู้ใช้ต้องวางได้
 * จากตัวจัดการรหัสผ่าน (SC 3.3.8)
 */
export function PaymentFields({ children, className }: PaymentFieldsProps) {
  return <div className={cn('grid min-w-0 gap-4', className)}>{children}</div>;
}
