import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { Button } from '../inputs/Button';
import { Alert } from '../feedback/Alert';
import { useStrings, useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · CheckoutSummary + CheckoutStepper
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ขอบเขต: **component ไม่ใช่หน้า** — หน้าสั่งซื้อเต็มเป็นชั้น 05 Templates

   ★★ ภาษีมูลค่าเพิ่มต้องแยกบรรทัด **เสมอ** ไม่ใช่รวมในราคา

   ผู้ซื้อ B2B ไทยต้องการใบกำกับภาษีเพื่อขอคืน VAT — ยอดที่ไม่แยกภาษี
   ทำให้ต้องคำนวณเองทุกครั้ง และเป็นสาเหตุอันดับต้นของการโต้แย้งใบแจ้งหนี้

   ★★ ตัวเลขต้องเรียงขวาและใช้ `font-numeric`

   `tabular-nums` ทำให้หลักตรงกันทุกบรรทัด — ยอด 1,250,000 กับ 87,500
   ที่หลักไม่ตรงกันทำให้ผู้ใช้อ่านผิดหลักได้ ซึ่งกับเงินคือความผิดพลาด
   ที่ยอมรับไม่ได้ (ข้อ 03 §2)

   ⚠️ **ห้ามเลขไทย ๐–๙** — กว้างต่างกัน 36.6% em

   ★★ ยอดรวมต้องต่างจากบรรทัดอื่นด้วย **มากกว่าสี**
   ขนาดตัวอักษร + เส้นคั่น + น้ำหนัก — ไม่ใช่แค่ทำให้เข้มขึ้น (SC 1.4.1)

   ★ Stepper ใช้ `<ol>` + `aria-current="step"`
   ไม่ใช่ `aria-selected` ซึ่งเป็นของ tab · ขั้นตอนคือลำดับ ไม่ใช่ตัวเลือก

   ★★★ **ปุ่มยืนยันเป็นของ component นี้ ไม่ใช่ slot เปล่า**

   เดิมมีแต่ `action` เป็น `ReactNode` ผลคือทุกหน้าที่ใช้ต้องคิดเรื่อง
   สถานะกำลังส่งและสถานะผิดพลาดเอง ซึ่งไม่มีใครทำ — และปุ่มชำระเงินที่
   ไม่บอกว่าระบบรับคำสั่งแล้วหรือยังคือที่มาของ **การกดซ้ำ** ซึ่งกับเงิน
   แปลว่าโอนสองรอบ

   `onSubmit` + `isSubmitting` จึงเป็น API หลัก · RAC `isPending` ปิดการกด
   โดย **คง focus ไว้** และประกาศสถานะให้ screen reader (ดู `Button.md`)

   ★★ **ข้อผิดพลาดใช้ `Alert` ไม่ใช่ `Toast`** (`Alert.md`)
   ข้อความที่บอกว่าต้องทำอะไรต่อห้ามหายไปเอง · Alert อยู่**เหนือ**ปุ่ม
   เพราะผู้ใช้ที่กำลังมองปุ่มต้องเห็นเหตุผลก่อนกดอีกครั้ง
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SummaryLine {
  label: string;
  /** จำนวนเงิน · `null` = ยังคำนวณไม่ได้ (เช่นค่าขนส่งที่รอที่อยู่) */
  value: number | null;
  /** ข้อความแทนตัวเลขเมื่อ `value` เป็น `null` */
  note?: string;
}

export interface CheckoutSummaryProps {
  /** จำนวนรายการ */
  itemCount: number;
  /** ราคาสินค้ารวมก่อนภาษี */
  subtotal: number;
  /** ภาษีมูลค่าเพิ่ม — **ต้องส่งเสมอ** แม้เป็น 0 */
  vat: number;
  /** ค่าขนส่ง · `null` = รอที่อยู่ */
  shipping?: number | null;
  /** บรรทัดเพิ่มเติม เช่นส่วนลด */
  extraLines?: SummaryLine[];
  /** ยอดรวมทั้งสิ้น */
  total: number;

  /**
   * ยืนยันคำสั่งซื้อ — เมื่อส่งมา component จะ render ปุ่มพร้อมสถานะครบเอง
   *
   * ใช้ตัวนี้แทน `action` ทุกครั้งที่ทำได้
   */
  onSubmit?: () => void;

  /** ข้อความบนปุ่ม · ค่าเริ่มต้น "ยืนยันคำสั่งซื้อ" */
  submitLabel?: string;

  /**
   * กำลังส่งคำสั่งซื้อ — ปุ่มขึ้น spinner และ **กดซ้ำไม่ได้**
   *
   * ⚠️ ต้องตั้งเป็น `true` ตั้งแต่ก่อนเรียก API ไม่ใช่หลังได้คำตอบ
   */
  isSubmitting?: boolean;

  /** ปิดปุ่มด้วยเหตุอื่น เช่นยังไม่เลือกที่อยู่จัดส่ง */
  isSubmitDisabled?: boolean;

  /**
   * ข้อผิดพลาดจากการยืนยัน — แสดงเป็น `<Alert tone="danger" isLive>` เหนือปุ่ม
   *
   * ตามสูตร **อะไรผิด → ทำไม → แก้อย่างไร** · ห้ามใช้ Toast (`Alert.md`)
   */
  errorMessage?: string;

  /**
   * ปุ่มยืนยันแบบกำหนดเอง
   *
   * ⚠️ ใช้เมื่อ `onSubmit` ไม่พอเท่านั้น — **ผู้เรียกรับผิดชอบสถานะกำลังส่ง
   * และสถานะผิดพลาดเองทั้งหมด** ซึ่งเป็นช่องว่างที่ `onSubmit` ปิดไว้ให้แล้ว
   */
  action?: ReactNode;
  className?: string;
}

export function CheckoutSummary({
  itemCount,
  subtotal,
  vat,
  shipping,
  extraLines,
  total,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  isSubmitDisabled = false,
  errorMessage,
  action,
  className,
}: CheckoutSummaryProps) {
  const s = useStrings();
  const { locale } = useSmeGoLocale();

  /* เลขอารบิกเสมอ — `th-TH` ให้เลขอารบิกอยู่แล้ว */
  const fmt = (n: number) => new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

  const lines: SummaryLine[] = [
    { label: s.checkout.subtotal, value: subtotal },
    ...(extraLines ?? []),
    /* ★ VAT แยกบรรทัดเสมอ */
    { label: s.checkout.vat, value: vat },
    ...(shipping !== undefined
      ? [{ label: s.checkout.shipping, value: shipping, note: s.common.calculating }]
      : []),
  ];

  return (
    <section
      aria-label={s.checkout.summaryTitle}
      className={cn(
        'grid min-w-0 gap-4 rounded-(--radius-container) border p-4 md:p-6',
        'border-(--elevation-edge-raised) bg-(--elevation-surface-raised)',
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline justify-between gap-2">
        <h2 className="text-subtitle text-fg">{s.checkout.summaryTitle}</h2>
        <span className="text-caption text-fg-muted">
          {s.checkout.itemCount(itemCount)}
        </span>
      </div>

      {/* `<dl>` เพราะเป็นคู่ชื่อ/จำนวนจริง — screen reader อ่าน
         "ภาษีมูลค่าเพิ่ม 7%, 87,500.00 บาท" เป็นคู่ */}
      <dl className="grid min-w-0 gap-2 text-body-sm">
        {lines.map((line) => (
          <div key={line.label} className="flex min-w-0 items-baseline justify-between gap-3">
            <dt className="min-w-0 text-fg-secondary">{line.label}</dt>
            <dd className="shrink-0 text-fg font-numeric tabular-nums">
              {line.value === null ? (
                <span className="text-caption text-fg-muted">{line.note}</span>
              ) : (
                fmt(line.value)
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* ★ ยอดรวมต่างด้วยเส้นคั่น + ขนาด ไม่ใช่แค่สี (SC 1.4.1) */}
      <div className="border-t border-edge-subtle pt-4">
        <dl className="flex min-w-0 items-baseline justify-between gap-3">
          <dt className="min-w-0 text-subtitle text-fg">{s.checkout.total}</dt>
          <dd className="shrink-0 text-title text-fg font-numeric tabular-nums">
            {fmt(total)}
            <span className="ms-1 text-caption text-fg-muted">{s.common.currency}</span>
          </dd>
        </dl>
      </div>

      {/* ★ error อยู่เหนือปุ่ม — ผู้ใช้ต้องเห็นเหตุผลก่อนกดอีกครั้ง
         `isLive` เพราะ Alert นี้โผล่มาตอบการกระทำของผู้ใช้ (SC 4.1.3) */}
      {errorMessage && (
        <Alert isLive tone="danger" title={s.checkout.submitFailed}>
          {errorMessage}
        </Alert>
      )}

      {onSubmit && (
        <Button
          variant="primary"
          fullWidth
          onPress={onSubmit}
          isLoading={isSubmitting}
          isDisabled={isSubmitDisabled}
        >
          {submitLabel ?? s.checkout.proceed}
        </Button>
      )}

      {action}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CheckoutStepper
   ───────────────────────────────────────────────────────────────────────────── */

export interface CheckoutStep {
  id: string;
  label: string;
}

export interface CheckoutStepperProps {
  steps: CheckoutStep[];
  /** index ของขั้นตอนปัจจุบัน (เริ่มที่ 0) */
  currentIndex: number;
  className?: string;
}

/**
 * ★ `<ol>` + `aria-current="step"` — ขั้นตอนคือ**ลำดับ** ไม่ใช่ tab
 *
 * ⚠️ ห้ามใช้ `aria-selected` (ของ tab) หรือ `aria-pressed` (ของ toggle)
 *
 * ★ สถานะต้องอ่านได้จาก**ข้อความ** ไม่ใช่แค่สีวงกลม (SC 1.4.1)
 * ขั้นที่เสร็จแล้วมีเครื่องหมายถูก + `sr-only` ว่า "เสร็จสิ้น"
 * ขั้นปัจจุบันมี `sr-only` ว่า "ขั้นตอนปัจจุบัน"
 *
 * ★ บนมือถือแสดง **ขั้นปัจจุบันเป็นข้อความ** แทนวงกลมทั้งแถว
 * 5 ขั้นที่ 320px ได้วงกลมละ 40px โดยไม่มีที่ให้ป้ายชื่อเลย
 */
export function CheckoutStepper({ steps, currentIndex, className }: CheckoutStepperProps) {
  const s = useStrings();

  return (
    <nav aria-label={s.checkout.stepperLabel} className={cn('min-w-0', className)}>
      {/* มือถือ: ข้อความบอกตำแหน่ง — อ่านง่ายกว่าวงกลม 5 อันที่ไม่มีป้าย */}
      <p className="text-body-sm text-fg-secondary md:hidden">
        <span className="font-numeric">
          {currentIndex + 1}/{steps.length}
        </span>
        <span className="ms-2 text-fg">{steps[currentIndex]?.label}</span>
      </p>

      <ol className="hidden min-w-0 items-center gap-2 md:flex">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-caption font-numeric',
                  isDone && 'border-success-edge bg-success-surface text-success-icon',
                  isCurrent && 'border-primary-outline bg-primary-600 text-on-brand',
                  !isDone && !isCurrent && 'border-edge-strong bg-surface text-fg-muted',
                )}
              >
                {isDone ? <Icon name="check" size={16} /> : i + 1}
              </span>

              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'min-w-0 text-caption',
                  isCurrent ? 'text-fg' : 'text-fg-muted',
                )}
              >
                {step.label}
                {/* ★ สถานะเป็นข้อความ ไม่พึ่งสี */}
                <span className="sr-only">
                  {isDone
                    ? ` — ${s.order.stepDone}`
                    : isCurrent
                      ? ` — ${s.order.stepCurrent}`
                      : ` — ${s.order.stepPending}`}
                </span>
              </span>

              {/* เส้นเชื่อม — ตกแต่งล้วน */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-px min-w-4 flex-1',
                    isDone ? 'bg-success-edge' : 'bg-edge',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
