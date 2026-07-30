'use client';

import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';
import { Link } from '../inputs/Link';
import { DeadlineText } from './Deadline';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · OrderTimeline
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ลำดับเอกสารต้องตรงกับ **กระบวนการจริงของ B2B ไทย**

       ใบเสนอราคา → ใบสั่งซื้อ → ชำระเงิน → **ใบกำกับภาษี (e-Tax)**
       → ใบเสร็จรับเงิน → ส่งมอบ

   **ใบกำกับภาษีไม่ใช่ขั้นตอนเสริม** — ผู้ซื้อนิติบุคคลต้องใช้เพื่อขอคืน VAT
   และ e-Tax Invoice เป็นข้อกำหนดของกรมสรรพากร ไม่ใช่ทางเลือกของแพลตฟอร์ม

   ระบบต่างประเทศที่รวบเป็น "Paid → Shipped → Delivered" ใช้กับ B2B ไทยไม่ได้
   เพราะขาดขั้นตอนเอกสารที่มีผลทางบัญชี

   ★★ แต่ละขั้นต้อง **ดาวน์โหลดเอกสารได้** เมื่อพร้อม
   timeline ที่บอกแค่สถานะโดยไม่ให้เอกสารทำให้ผู้ใช้ต้องไปหาในอีเมล

   ★ ใช้ `<ol>` — เป็นลำดับที่มีความหมาย ไม่ใช่รายการทั่วไป
   ⚠️ ห้ามใช้ `aria-current="step"` กับขั้นที่**ทำไปแล้ว**
   `step` หมายถึงขั้นที่กำลังอยู่เท่านั้น

   ★ สถานะต้องอ่านได้จาก**ข้อความ** ไม่ใช่แค่สีจุด (SC 1.4.1)
   ═══════════════════════════════════════════════════════════════════════════ */

export type OrderStepStatus = 'done' | 'current' | 'pending';

export interface OrderStep {
  id: string;
  label: string;
  /** วันที่ ISO `YYYY-MM-DD` — แสดงเป็น พ.ศ. */
  date?: string;
  status: OrderStepStatus;
  /** ลิงก์ดาวน์โหลดเอกสารของขั้นนี้ */
  documentHref?: string;
  /** ชื่อเอกสารสำหรับ `aria-label` ของลิงก์ดาวน์โหลด */
  documentName?: string;
  /** หมายเหตุ เช่น เลขที่เอกสาร */
  note?: string;
}

export interface OrderTimelineProps {
  steps: OrderStep[];
  className?: string;
}

const ICON_FOR_STATUS: Record<OrderStepStatus, IconName | null> = {
  done: 'circle-check',
  current: null,
  pending: null,
};

export function OrderTimeline({ steps, className }: OrderTimelineProps) {
  const s = useStrings();

  const statusText: Record<OrderStepStatus, string> = {
    done: s.order.stepDone,
    current: s.order.stepCurrent,
    pending: s.order.stepPending,
  };

  return (
    <nav aria-label={s.order.timelineLabel} className={cn('min-w-0', className)}>
      <ol className="grid min-w-0 gap-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const icon = ICON_FOR_STATUS[step.status];

          return (
            <li key={step.id} className="grid min-w-0 grid-cols-[1.5rem_1fr] gap-x-3">
              {/* คอลัมน์สัญลักษณ์ */}
              <div className="grid justify-items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border',
                    step.status === 'done' &&
                      'border-success-edge bg-success-surface text-success-icon',
                    step.status === 'current' &&
                      'border-primary-outline bg-primary-600 text-on-brand',
                    step.status === 'pending' && 'border-edge-strong bg-surface',
                  )}
                >
                  {icon ? (
                    <Icon name={icon} size={16} />
                  ) : (
                    /* ขั้นปัจจุบัน = จุดทึบ · ขั้นที่ยังไม่ถึง = วงว่าง
                       ต่างกันที่**รูปทรง** ไม่ใช่แค่สี */
                    step.status === 'current' && (
                      <span className="size-2 rounded-full bg-on-brand" />
                    )
                  )}
                </span>

                {/* เส้นเชื่อม — ตกแต่งล้วน */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'w-px flex-1',
                      step.status === 'done' ? 'bg-success-edge' : 'bg-edge',
                    )}
                  />
                )}
              </div>

              {/* เนื้อหา — pb เว้นระยะก่อนขั้นถัดไป */}
              <div className={cn('grid min-w-0 gap-1', isLast ? 'pb-0' : 'pb-6')}>
                <p
                  /* ★ `step` ใช้กับขั้นที่กำลังอยู่เท่านั้น */
                  aria-current={step.status === 'current' ? 'step' : undefined}
                  className={cn(
                    'text-body-sm',
                    step.status === 'pending' ? 'text-fg-muted' : 'text-fg',
                  )}
                >
                  {step.label}
                  {/* ★ สถานะเป็นข้อความ ไม่พึ่งสี */}
                  <span className="sr-only">{` — ${statusText[step.status]}`}</span>
                </p>

                {step.date && (
                  <p className="text-caption text-fg-muted">
                    <DeadlineText date={step.date} />
                  </p>
                )}

                {step.note && (
                  <p className="text-caption text-fg-muted font-numeric">{step.note}</p>
                )}

                {step.documentHref && (
                  <p>
                    <Link href={step.documentHref} size="caption">
                      <Icon name="download" size={16} />
                      {/* ★ ชื่อลิงก์รวมชื่อเอกสาร — ในหน้าที่มี 5 ลิงก์
                         "ดาวน์โหลด" ผู้ใช้ screen reader แยกไม่ออก (SC 2.4.4) */}
                      {s.order.downloadDocument(step.documentName ?? step.label)}
                    </Link>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
