import type { ReactNode } from 'react';
import { EntityCard, EntityAmount, EntityMeta } from './EntityCard';
import { DeadlineText } from './Deadline';
import { Badge } from '../data-display/Badge';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · TrainingCard — หลักสูตรอบรม
   ───────────────────────────────────────────────────────────────────────────
   ★★ **"ไม่มีค่าใช้จ่าย" ต้องเป็นคำ ไม่ใช่เลข 0**

   "0 บาท" อ่านแล้วสะดุด และในบริบทราชการอาจถูกตีความว่าข้อมูลยังไม่กรอก
   `isFree` จึงเป็น prop แยก ไม่ใช่ `fee === 0`

   ★★ ที่นั่งเหลือเป็น **สถานะ ไม่ใช่ตัวเลขเฉย ๆ**

   หลักสูตรฟรีของรัฐเต็มเร็วมาก ผู้ใช้ที่เห็น "เหลือ 3 ที่นั่ง" ตัดสินใจ
   ต่างจาก "เหลือ 80 ที่นั่ง" อย่างสิ้นเชิง

   เกณฑ์ "เหลือน้อย" เป็น **กฎธุรกิจ** จึงให้ผู้เรียกส่ง `seatsLow`
   มาเอง — เหมือนเหตุผลของ `status` ใน `Deadline.tsx`

   ★ กำหนดการต้องเป็น **พ.ศ.** — ผ่าน `<DeadlineText>` ตัวเดียวกับ
   ที่ ProgramCard และ GrantCard ใช้ จึงไม่มีทาง drift

   ★ รูปแบบการอบรม (onsite/online/hybrid) ต้องเป็น **ข้อความ**
   ไม่ใช่ไอคอน — ผู้ใช้กลุ่มหลักอายุ 40–60 ปีที่ไม่คุ้นเคยดิจิทัล
   ไม่มีคลังสัญลักษณ์สำหรับ "hybrid" (ข้อ 09)
   ═══════════════════════════════════════════════════════════════════════════ */

export type TrainingFormat = 'onsite' | 'online' | 'hybrid';

export interface TrainingCardProps {
  href: string;
  name: string;
  /** หน่วยงานหรือสถาบันผู้จัด */
  organizer: string;
  format: TrainingFormat;
  /** วันเริ่มอบรม ISO `YYYY-MM-DD` */
  startDate: string;
  /** วันสิ้นสุด — ไม่ต้องส่งเมื่ออบรมวันเดียว */
  endDate?: string;
  /** ค่าลงทะเบียน — ไม่ต้องส่งเมื่อ `isFree` */
  fee?: number;
  /** **แยกจาก `fee === 0`** — ดูเหตุผลด้านบน */
  isFree?: boolean;
  /** ที่นั่งคงเหลือ · `0` = เต็ม */
  seatsLeft?: number;
  /** ที่นั่งเหลือน้อยหรือไม่ — **กฎธุรกิจ ผู้เรียกตัดสิน** */
  seatsLow?: boolean;
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
  headingLevel?: 2 | 3 | 4 | 5;
  as?: 'article' | 'li';
  className?: string;
}

export function TrainingCard({
  href,
  name,
  organizer,
  format,
  startDate,
  endDate,
  fee,
  isFree,
  seatsLeft,
  seatsLow,
  media,
  actions,
  footer,
  isSelected,
  headingLevel,
  as,
  className,
}: TrainingCardProps) {
  const s = useStrings();

  const formatLabel = {
    onsite: s.card.formatOnsite,
    online: s.card.formatOnline,
    hybrid: s.card.formatHybrid,
  }[format];

  const isFull = seatsLeft === 0;

  return (
    <EntityCard
      href={href}
      title={name}
      headingLevel={headingLevel}
      as={as}
      media={media}
      actions={actions}
      isSelected={isSelected}
      className={className}
      eyebrow={
        <>
          {/* ที่นั่งเป็นสถานะ — รูปทรงต่างกันตามระดับ (SC 1.4.1) */}
          {isFull ? (
            <Badge variant="danger">{s.card.seatsFull}</Badge>
          ) : seatsLeft !== undefined ? (
            <Badge variant={seatsLow ? 'warning' : 'success'}>
              {s.card.seatsLeft(seatsLeft)}
            </Badge>
          ) : null}

          {/* รูปแบบการอบรมเป็นข้อความ ไม่ใช่ไอคอน */}
          <Badge variant="neutral" showIcon={false}>
            {formatLabel}
          </Badge>
        </>
      }
      meta={
        <>
          {/* ผู้จัดเป็น <p> ไม่ใช่คู่ใน <dl> — ดู ProductCard */}
          <p className="text-caption text-fg-secondary">{organizer}</p>
          <EntityMeta
          items={[
            {
              label: s.card.schedule,
              value: (
                <span className="flex flex-wrap items-baseline gap-x-1">
                  <DeadlineText date={startDate} />
                  {endDate && (
                    <>
                      <span aria-hidden="true">–</span>
                      <DeadlineText date={endDate} />
                    </>
                  )}
                </span>
              ),
            },
          ]}
          />
        </>
      }
      amount={
        <EntityAmount
          label={s.card.fee}
          /* ★ ฟรีเป็นคำ ไม่ใช่เลข 0 */
          value={isFree ? null : (fee ?? null)}
          note={isFree ? s.card.free : fee === undefined ? s.card.requestQuote : undefined}
        />
      }
      footer={footer}
    />
  );
}
