import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { EmptyState } from '../data-display/EmptyState';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · SearchResult — หัวผลการค้นหา + สถานะว่าง
   ───────────────────────────────────────────────────────────────────────────
   ★★ SC 4.1.3 Status Messages — จำนวนผลลัพธ์ต้องถูก**ประกาศ**

   ผู้ใช้ screen reader ที่กดตัวกรองแล้วไม่ได้ยินอะไรเลย **ไม่รู้ว่าเกิดอะไรขึ้น**
   จำนวนอาจเปลี่ยนจาก 128 เป็น 3 โดยที่ focus ยังอยู่ที่ chip เดิม

   `aria-live="polite"` ประกาศโดย**ไม่ต้องย้าย focus** ซึ่งเป็นหัวใจของข้อนี้
   — การย้าย focus ไปที่ผลลัพธ์จะทำให้ผู้ใช้กรองต่อไม่ได้

   ⚠️ **ห้าม `assertive`** — จะขัดสิ่งที่ผู้ใช้กำลังฟังกลางประโยค
   และการกรองไม่ใช่เรื่องฉุกเฉิน

   ★★ live region ต้อง **อยู่ใน DOM ตั้งแต่แรก** ไม่ใช่เพิ่งใส่เข้ามา

   ถ้า element ที่มี `aria-live` ถูก mount พร้อมกับข้อความ screen reader
   ส่วนใหญ่ **จะไม่ประกาศ** เพราะมันเฝ้าดูการเปลี่ยนแปลง*ภายใน* region
   ที่มีอยู่แล้ว · component นี้จึง render region เสมอ แล้วเปลี่ยนแค่ข้อความ
   ข้างใน

   ★ ตัวเลขที่แสดงกับตัวเลขที่ประกาศเป็น**ข้อความเดียวกัน**
   ไม่ใช่เขียนสองที่ให้ต่างกันได้

   ★ สถานะว่างต้องบอก **ทางออก** ไม่ใช่แค่บอกว่าไม่พบ (ข้อ 01)
   "ลองใช้คำค้นที่สั้นลง หรือลดจำนวนตัวกรอง" — ผู้ใช้ที่ค้นไม่เจอ
   คือผู้ใช้ที่กำลังจะออกจากเว็บ
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SearchResultProps {
  /** จำนวนผลลัพธ์ · `undefined` ระหว่างโหลดครั้งแรก */
  count?: number;

  /** กำลังค้นหาอยู่ */
  isLoading?: boolean;

  /** คำค้นที่ใช้ — แสดงในหัวเรื่องเมื่อมี */
  query?: string;

  /** ตัวเรียงลำดับหรือปุ่มสลับมุมมอง — วางขวาของหัว */
  toolbar?: ReactNode;

  /** เนื้อหาผลลัพธ์ — กริดการ์ด */
  children?: ReactNode;

  /** แสดงเมื่อไม่พบผลลัพธ์ — ค่าเริ่มต้นมีข้อความช่วยเหลืออยู่แล้ว */
  emptyAction?: ReactNode;

  className?: string;
}

export function SearchResult({
  count,
  isLoading,
  query,
  toolbar,
  children,
  emptyAction,
  className,
}: SearchResultProps) {
  const s = useStrings();

  const isEmpty = !isLoading && count === 0;

  /* ข้อความเดียว ใช้ทั้งที่แสดงและที่ประกาศ — ไม่มีทาง drift */
  const statusText = isLoading
    ? s.search.searching
    : count === undefined
      ? ''
      : s.search.resultCount(count);

  return (
    <div className={cn('grid min-w-0 gap-4', className)}>
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-3">
        <p className="text-body-sm text-fg-secondary">
          {/* ★ region อยู่ใน DOM เสมอ — เปลี่ยนแค่ข้อความข้างใน
             ถ้า mount พร้อมข้อความ screen reader ส่วนใหญ่จะไม่ประกาศ */}
          <span aria-live="polite" aria-atomic="true">
            {statusText}
          </span>
          {query && !isLoading && (
            <span className="text-fg-muted"> · “{query}”</span>
          )}
        </p>
        {toolbar && <div className="flex min-w-0 items-center gap-2">{toolbar}</div>}
      </div>

      {isEmpty ? (
        /* ★★ ไม่ส่ง `isLive` โดยเจตนา — ข้อความจำนวนด้านบนประกาศไปแล้ว
           ถ้า EmptyState ประกาศอีกผู้ใช้จะได้ยินสองรอบ
           (นี่คือเหตุผลที่ `role="status"` ของ Astryx เป็น opt-in ที่นี่ · D26)

           `description` บอกทางออก ไม่ใช่แค่บอกว่าไม่พบ */
        <EmptyState
          icon={<Icon name="search" size={32} />}
          title={s.search.noResults}
          description={s.search.noResultsHelp}
          actions={emptyAction}
        />
      ) : (
        children
      )}
    </div>
  );
}
