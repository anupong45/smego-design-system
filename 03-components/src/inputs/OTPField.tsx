import { useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · OTPField — รหัสยืนยัน
   ───────────────────────────────────────────────────────────────────────────
   ★★★ SC 3.3.8 Accessible Authentication — **ต้องวางได้**

   ตัวบท: ขั้นตอนยืนยันตัวตนต้องไม่บังคับให้ผู้ใช้ทำ "cognitive function test"
   (จำ · ถอดความ · คำนวณ) โดยไม่มีทางเลือก

   การจำเลข 6 หลักจาก SMS แล้วพิมพ์ทีละช่อง **คือ** cognitive function test
   ทางออกที่ตัวบทยอมรับคือ **ต้องวางได้** และให้ตัวจัดการรหัสผ่านกรอกได้

   ⚠️ ช่อง OTP แบบ 6 กล่องแยกเป็นรูปแบบที่ **พังข้อนี้บ่อยที่สุด** เพราะ
   นักพัฒนามักผูก `maxLength={1}` แล้วการวางจะได้แค่ตัวแรก

   component นี้ดักที่ `onPaste` ระดับกลุ่มแล้ว **กระจายลงทุกช่อง**
   และ **ห้ามใส่ `onPaste preventDefault` ที่ไหนก็ตาม**

   ★★ `autoComplete="one-time-code"` ให้ iOS/Android เติมจาก SMS อัตโนมัติ
   ใส่ที่ **ช่องแรกช่องเดียว** — ถ้าใส่ทุกช่องระบบจะเติมเลขเดียวกันซ้ำ 6 ครั้ง

   ★ `inputMode="numeric"` เปิดแป้นตัวเลขบนมือถือ
   **ไม่ใช่** `type="number"` ซึ่งได้ปุ่มลูกศรที่ไม่มีความหมายกับ OTP
   และตัด leading zero ทิ้ง

   ★ ประกาศผลการวางผ่าน `aria-live` — ผู้ใช้ screen reader ที่วางรหัส
   ต้องรู้ว่าเข้าไปครบหรือไม่ โดยไม่ต้องไล่ฟังทีละช่อง
   ═══════════════════════════════════════════════════════════════════════════ */

export interface OTPFieldProps {
  /** จำนวนหลัก · ค่าเริ่มต้น 6 */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** เรียกเมื่อกรอกครบทุกหลัก */
  onComplete?: (value: string) => void;
  label?: string;
  description?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  className?: string;
}

const DIGITS = /\d/g;

export function OTPField({
  length = 6,
  value,
  onChange,
  onComplete,
  label,
  description,
  errorMessage,
  isDisabled,
  className,
}: OTPFieldProps) {
  const s = useStrings();
  const groupId = useId();
  const descId = useId();
  const errorId = useId();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [announcement, setAnnouncement] = useState('');

  const chars = value.slice(0, length).split('');

  const commit = (next: string) => {
    const trimmed = next.slice(0, length);
    onChange(trimmed);
    if (trimmed.length === length) onComplete?.(trimmed);
    return trimmed;
  };

  const focusIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(length - 1, i));
    refs.current[clamped]?.focus();
    refs.current[clamped]?.select();
  };

  /**
   * ★★★ หัวใจของ SC 3.3.8 — กระจายรหัสที่วางลงทุกช่อง
   *
   * ดักที่ระดับ**กลุ่ม** จึงทำงานไม่ว่าผู้ใช้จะวางลงช่องไหน
   * และดึงเฉพาะตัวเลข — ผู้ใช้ที่คัดลอกทั้งประโยคจาก SMS
   * ("รหัสของคุณคือ 123456") ก็ยังใช้ได้
   */
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    /* อ่าน `text/plain` ก่อน แล้วค่อย fallback ไป `text`
       ทั้งสองควรให้ค่าเดียวกันตามสเปก แต่การอ่านชื่อเต็มก่อน
       ทนต่อ implementation ที่ไม่ normalize alias ให้ */
    const text =
      e.clipboardData.getData('text/plain') || e.clipboardData.getData('text');
    const digits = text.match(DIGITS)?.join('') ?? '';
    if (!digits) return;

    /* preventDefault ที่นี่คือการ**แทนที่**พฤติกรรมด้วยของที่ดีกว่า
       ไม่ใช่การบล็อก — ถ้าไม่ทำ ช่องเดียวจะได้ทั้งสตริง */
    e.preventDefault();

    const next = commit(digits);
    setAnnouncement(s.payment.otpPasted(next.length));
    focusIndex(next.length);
  };

  const handleKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (chars[i]) {
        /* ลบตัวในช่องนี้ */
        commit(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        /* ช่องว่างอยู่แล้ว — ถอยไปลบช่องก่อนหน้า */
        commit(value.slice(0, i - 1) + value.slice(i));
        focusIndex(i - 1);
      }
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusIndex(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusIndex(i + 1);
    }
  };

  const handleInput = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.match(DIGITS)?.join('') ?? '';
    if (!digits) return;

    /* พิมพ์ทีละตัว หรือระบบเติม OTP จาก SMS ทั้งก้อน */
    const next = value.slice(0, i) + digits + value.slice(i + digits.length);
    const committed = commit(next);
    focusIndex(i + digits.length);
    if (committed.length === length) setAnnouncement(s.payment.otpComplete);
  };

  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <span id={groupId} className="text-label text-fg-secondary">
        {label ?? s.payment.otpLabel}
      </span>

      <p id={descId} className="text-caption text-fg-muted">
        {description ?? s.payment.otpHelp}
      </p>

      {/* `role="group"` ผูกช่องทั้งหมดเข้าด้วยกัน — screen reader ประกาศ
         ชื่อกลุ่มครั้งเดียวแทนที่จะอ่านซ้ำ 6 รอบ */}
      <div
        role="group"
        aria-labelledby={groupId}
        aria-describedby={cn(descId, errorMessage && errorId)}
        onPaste={handlePaste}
        className="flex min-w-0 gap-2"
      >
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            /* ★ ไม่ใช่ type="number" — ลูกศรไม่มีความหมายกับ OTP
               และ leading zero จะหาย */
            type="text"
            inputMode="numeric"
            /* ★ ช่องแรกช่องเดียว ไม่งั้นระบบเติมเลขเดียวกัน 6 ครั้ง */
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={s.payment.otpDigit(i + 1, length)}
            aria-invalid={errorMessage ? true : undefined}
            value={chars[i] ?? ''}
            disabled={isDisabled}
            onChange={handleInput(i)}
            onKeyDown={handleKeyDown(i)}
            onFocus={(e) => e.target.select()}
            className={cn(
              /* 44×48 — ใหญ่พอสำหรับนิ้วโป้งและมองเห็นชัดขณะกรอก
                 ★ `min-h-12` ไม่ใช่ `h-12` (แก้หนี้ 2.5 เมื่อ 2026-07-29)
                 ความสูงตายตัวจะตัดตัวเลขทิ้งเมื่อผู้ใช้ตั้งขนาดตัวอักษร
                 ใหญ่ขึ้น ซึ่ง SC 1.4.4 ให้ทำได้ถึง 200% · `min-h` ยืดตาม
                 เนื้อหาแล้วยังคงพื้น 48px ไว้เท่าเดิม */
              'min-h-12 w-11 min-w-0 text-center',
              'rounded-(--radius-control) border',
              'bg-surface text-title text-fg tabular-nums',
              'transition-colors duration-fast ease-standard',
              'border-edge-strong',
              'focus:border-edge-brand',
              errorMessage && 'border-edge-danger',
              'disabled:bg-sunken disabled:text-fg-disabled disabled:border-edge',
              'disabled:cursor-not-allowed',
            )}
          />
        ))}
      </div>

      {/* ★ ประกาศผลการวาง — ผู้ใช้ screen reader ไม่ต้องไล่ฟังทีละช่อง */}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </span>

      {errorMessage && (
        <p id={errorId} role="alert" className="text-caption text-danger-icon">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
