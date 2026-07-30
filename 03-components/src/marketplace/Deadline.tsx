'use client';

import { cn } from '../lib/cn';
import { Badge } from '../data-display/Badge';
import { useStrings, useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Deadline — กำหนดปิดรับ + สถานะ
   ───────────────────────────────────────────────────────────────────────────
   ใช้ร่วมกันโดย ProgramCard · GrantCard · TrainingCard

   ★★ วันที่ต้องเป็น **พ.ศ.** — 2569 ไม่ใช่ 2026

   `th-TH` resolve เป็น calendar `buddhist` อยู่แล้ว (ตรวจในเบราว์เซอร์จริง:
   `new Intl.DateTimeFormat('th-TH').format(new Date())` → "25 กรกฎาคม 2569")
   ระบบยังระบุ `th-TH-u-ca-buddhist` ให้ชัดเจนเพื่อไม่ต้องพึ่งค่าเริ่มต้น
   ของ CLDR ที่อาจเปลี่ยน

   ⚠️ **ห้ามใช้ `th-TH-u-ca-gregory`** — จะได้ ค.ศ. ซึ่งผู้ใช้ไทยอ่านผิด
   ทันทีในบริบทเอกสารราชการ

   ★★ `status` เป็น **prop ไม่ใช่ค่าที่คำนวณในนี้**

   สองเหตุผล:

   1. **SSR hydration** — ถ้าคำนวณจาก `Date.now()` ตอน render ค่าที่ server
      กับ client ได้อาจต่างกัน ทำให้ React เตือนและ DOM กระพริบ

   2. **"ใกล้ปิดรับ" คือกฎธุรกิจ ไม่ใช่กฎ UI** — บางโครงการนับ 7 วัน
      บางทุนนับ 30 วัน เพราะเตรียมเอกสารนานกว่า · component ไม่ควรตัดสินแทน

   ★ สถานะต้องมี **รูปทรง + ข้อความ** ไม่ใช่แค่สี (SC 1.4.1)
   `<Badge>` ผูกไอคอนกับ variant ให้อยู่แล้ว — วงกลม / สามเหลี่ยม / กากบาท
   ═══════════════════════════════════════════════════════════════════════════ */

export type DeadlineStatus = 'open' | 'closing-soon' | 'closed';

const VARIANT_FOR_STATUS = {
  open: 'success',
  'closing-soon': 'warning',
  closed: 'danger',
} as const;

export interface DeadlineBadgeProps {
  status: DeadlineStatus;
  /** จำนวนวันที่เหลือ — แสดงต่อท้ายเมื่อ `closing-soon` */
  daysLeft?: number;
  className?: string;
}

export function DeadlineBadge({ status, daysLeft, className }: DeadlineBadgeProps) {
  const s = useStrings();

  const text =
    status === 'open'
      ? s.card.statusOpen
      : status === 'closed'
        ? s.card.statusClosed
        : daysLeft === undefined
          ? s.card.statusClosingSoon
          : `${s.card.statusClosingSoon} · ${s.card.daysLeft(daysLeft)}`;

  return (
    <Badge variant={VARIANT_FOR_STATUS[status]} className={className} label={text} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DeadlineText — วันที่แบบ พ.ศ. ใน <time>
   ───────────────────────────────────────────────────────────────────────────── */

export interface DeadlineTextProps {
  /** วันที่ในรูปแบบ ISO `YYYY-MM-DD` — เป็น ค.ศ. ตามมาตรฐานข้อมูล */
  date: string;
  /** `short` = 31 ธ.ค. 2569 · `long` = 31 ธันวาคม 2569 */
  format?: 'short' | 'long';
  className?: string;
}

/**
 * ★ `<time dateTime>` เก็บค่า ISO (ค.ศ.) ไว้ให้เครื่องอ่าน
 * ส่วนข้อความที่แสดงเป็น พ.ศ. สำหรับคน — **ทั้งสองอย่างต้องมี**
 *
 * ถ้าเก็บ พ.ศ. ใน `dateTime` จะผิดมาตรฐาน HTML และเครื่องมืออื่นอ่านผิดปี 543 ปี
 */
export function DeadlineText({ date, format = 'short', className }: DeadlineTextProps) {
  const { locale } = useSmeGoLocale();

  const formatted = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(`${date}T00:00:00+07:00`));

  return (
    <time dateTime={date} className={cn('font-numeric', className)}>
      {formatted}
    </time>
  );
}
