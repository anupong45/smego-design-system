import { Button as RACButton } from 'react-aria-components';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Pagination — ระบบยังไม่มี pagination เลยก่อนหน้านี้
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **ขนาดปุ่มของ Astryx ใช้ไม่ได้ทั้งชุด** (เหตุผลเดียวกับ D1)

   Astryx ให้ `sm`/`md`/`lg` = 28/32/36px · ทั้งสามต่ำกว่าเกณฑ์ที่ระบบนี้
   ตัดสินไว้ว่า touch ใช้ไม่ได้ และปุ่มเลขหน้าคือ **เป้าที่เล็กที่สุดใน
   หน้ารายการ** — เรียงติดกัน 5–7 อันบนมือถือ กดพลาดแล้วเสียตำแหน่งทั้งหน้า

   ของเราจึงเป็น **36 / 44 / 48** และใช้ `min-h-*`/`min-w-*` ไม่ใช่ `h-*`
   เพราะเป็น**พื้น** ไม่ใช่ความสูงตายตัว — ข้อความยังโตได้เมื่อผู้ใช้ขยาย
   ตัวอักษร (SC 1.4.12) ต่างจาก `h-11` ที่จะตัดข้อความทิ้ง

   ★★★ **ชื่อปุ่มต้องเป็น "หน้า 3" ไม่ใช่ "3"**

   ตัวเลขลอย ๆ ไม่บอกอะไรกับผู้ใช้ screen reader — ระบบนี้ตัดสินเรื่อง
   เดียวกันมาแล้วที่จำนวนในตะกร้า (`TopNav`) และปุ่มลบ chip (`RemovableChip`)

   หน้าปัจจุบันได้ทั้ง `aria-current="page"` **และ** ข้อความ "หน้าปัจจุบัน"
   ในชื่อ — ไม่พึ่ง `aria-current` เดียว เพราะ screen reader เก่าบางตัว
   ไม่ประกาศมัน

   ★★ **ไม่มี live region ในตัวนี้โดยเจตนา**

   เมื่อเปลี่ยนหน้า สิ่งที่ผู้ใช้ต้องรู้คือ "ผลลัพธ์ใหม่มาแล้ว" ซึ่ง
   `SearchResult` ประกาศผ่าน live region ของจำนวนอยู่แล้ว ถ้า Pagination
   ประกาศอีกจะได้ยินสองรอบ (เหตุผลเดียวกับ `EmptyState` · D26)

   ★ **`…` ต้องไม่อยู่ใน tab order และไม่ถูกอ่าน**
   เป็น `<span aria-hidden>` ไม่ใช่ปุ่ม disabled — ปุ่มที่กดไม่ได้ในแถว
   ทำให้ผู้ใช้คีย์บอร์ดต้องกด Tab ผ่านของที่ไม่ทำอะไร

   ── สิ่งที่ไม่รับจาก Astryx ─────────────────────────────────────────────
   `variant="dots"`   จุดเล็กกว่าเกณฑ์ touch มาก และเป็นสำนวนของ carousel
                      ซึ่ง §1.4 ตัดไปแล้ว
   `pageSizeOptions` · `onPageSizeChange`
                      ตัวเลือกจำนวนต่อหน้า — ไม่มี template ที่ต้องใช้ (D27)
   `changeAction`     event model ของ Astryx (D8)
   ═══════════════════════════════════════════════════════════════════════════ */

export type PaginationVariant = 'pages' | 'count' | 'compact' | 'none';
export type PaginationSize = 'sm' | 'md' | 'lg';

/**
 * ★ `min-h`/`min-w` ไม่ใช่ `h`/`w` — เป็นพื้นไม่ใช่เพดาน (SC 1.4.12)
 *
 * `md` = 44px คือเป้าที่กดสบายบนมือถือ · `sm` 36px สำหรับแถบเครื่องมือ
 * บนเดสก์ท็อปที่ผู้ใช้ใช้เมาส์ · ทั้งสามผ่าน SC 2.5.8 (24px)
 */
const SIZE: Record<PaginationSize, { target: string; text: string; icon: 16 | 20 }> = {
  sm: { target: 'min-h-9 min-w-9', text: 'text-caption', icon: 16 },
  md: { target: 'min-h-11 min-w-11', text: 'text-button', icon: 20 },
  lg: { target: 'min-h-12 min-w-12', text: 'text-button-lg', icon: 20 },
};

/** ช่องว่างในแถวเลขหน้า */
type PageSlot = number | 'gap';

/**
 * เลขหน้าที่จะแสดง พร้อมช่องว่างเมื่อหน้าเยอะเกินกว่าจะแสดงหมด
 *
 * กฎ: หน้าแรกและหน้าสุดท้าย**เห็นเสมอ** เพื่อให้กระโดดสุดทางได้ในหนึ่งกด
 * ส่วนกลางคือหน้าปัจจุบัน ± `siblingCount`
 *
 * ★ ถ้าช่องว่างกินหน้าเดียว จะแสดงเลขหน้านั้นแทน `…` — `…` ที่ซ่อนหน้าเดียว
 * ทำให้ผู้ใช้กดสองครั้งเพื่อไปหน้าที่อยู่ตรงหน้าต่อตา
 */
export function pageSlots(
  page: number,
  totalPages: number,
  siblingCount = 1,
): PageSlot[] {
  /* จำนวนช่องที่ต้องใช้เมื่อมีช่องว่างสองข้าง:
     หน้าแรก + ช่องว่าง + (sibling × 2 + ปัจจุบัน) + ช่องว่าง + หน้าสุดท้าย */
  const maxSlots = siblingCount * 2 + 5;

  if (totalPages <= maxSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, totalPages);
  const slots: PageSlot[] = [1];

  if (left > 2) {
    /* ช่องว่างกินหน้าเดียว → แสดงเลขนั้นแทน */
    slots.push(left === 3 ? 2 : 'gap');
  }

  for (let p = Math.max(left, 2); p <= Math.min(right, totalPages - 1); p++) {
    slots.push(p);
  }

  if (right < totalPages - 1) {
    slots.push(right === totalPages - 2 ? totalPages - 1 : 'gap');
  }

  slots.push(totalPages);
  return slots;
}

export interface PaginationProps {
  /** หน้าปัจจุบัน — **เริ่มที่ 1** ไม่ใช่ 0 */
  page: number;

  /** เรียกเมื่อเปลี่ยนหน้า */
  onChange: (page: number) => void;

  /**
   * จำนวนรายการทั้งหมด — ใช้คำนวณจำนวนหน้าร่วมกับ `pageSize`
   *
   * มีผลเหนือ `totalPages` ถ้าส่งมาทั้งคู่
   */
  totalItems?: number;

  /** จำนวนหน้าทั้งหมด — ใช้เมื่อรู้จำนวนหน้าแต่ไม่รู้จำนวนรายการ */
  totalPages?: number;

  /**
   * ยังมีหน้าถัดไปหรือไม่ — ใช้กับ pagination แบบ cursor ที่ไม่รู้ยอดรวม
   *
   * เมื่อใช้ข้อนี้ `variant` จะถูกบังคับเป็น `none` เพราะวาดเลขหน้าไม่ได้
   */
  hasMore?: boolean;

  /** จำนวนรายการต่อหน้า · ค่าเริ่มต้น 20 */
  pageSize?: number;

  /**
   * รูปแบบตรงกลางระหว่างปุ่มก่อนหน้า/ถัดไป
   *
   * `pages`   ปุ่มเลขหน้า (ค่าเริ่มต้น)
   * `count`   "1–20 จาก 240 รายการ"
   * `compact` "หน้า 2 จาก 12" — สำหรับจอแคบ
   * `none`    มีแต่ปุ่มก่อนหน้า/ถัดไป
   *
   * ⚠️ ไม่มี `dots` ของ Astryx — ดูหัวไฟล์
   */
  variant?: PaginationVariant;

  /** จำนวนเลขหน้าข้างหน้าปัจจุบันแต่ละด้าน · ค่าเริ่มต้น 1 */
  siblingCount?: number;

  /** ขนาดเป้ากด · ค่าเริ่มต้น `md` (44px — เป้าที่กดสบายบนมือถือ) */
  size?: PaginationSize;

  isDisabled?: boolean;

  /** ชื่อ landmark ของ `<nav>` · ค่าเริ่มต้น "การแบ่งหน้า" */
  label?: string;

  className?: string;
}

/**
 * การแบ่งหน้าสำหรับหน้ารายการ
 *
 * ⚠️ **ไม่ประกาศการเปลี่ยนหน้าเอง** — `SearchResult` ประกาศจำนวนผลลัพธ์
 * ผ่าน live region อยู่แล้ว ดูหัวไฟล์
 */
export function Pagination({
  page,
  onChange,
  totalItems,
  totalPages,
  hasMore,
  pageSize = 20,
  variant = 'pages',
  siblingCount = 1,
  size = 'md',
  isDisabled = false,
  label,
  className,
}: PaginationProps) {
  const s = useStrings();
  const { target, text, icon } = SIZE[size];

  /* totalItems มีผลเหนือ totalPages ตามสัญญาของ Astryx */
  const resolvedTotal =
    totalItems !== undefined ? Math.max(1, Math.ceil(totalItems / pageSize)) : totalPages;

  /* วาดเลขหน้าไม่ได้ถ้าไม่รู้ยอดรวม — บังคับเป็น none */
  const resolvedVariant: PaginationVariant =
    resolvedTotal === undefined ? 'none' : variant;

  const isFirst = page <= 1;
  const isLast =
    resolvedTotal !== undefined ? page >= resolvedTotal : hasMore === false;

  const go = (next: number) => {
    if (isDisabled) return;
    if (resolvedTotal !== undefined && (next < 1 || next > resolvedTotal)) return;
    if (next === page) return;
    onChange(next);
  };

  /* ปุ่มก่อนหน้า/ถัดไป — ไอคอนล้วนจึงต้องมีชื่อจาก strings */
  const arrow = (dir: 'prev' | 'next') => {
    const disabled = isDisabled || (dir === 'prev' ? isFirst : isLast);
    return (
      <RACButton
        aria-label={dir === 'prev' ? s.pagination.previous : s.pagination.next}
        isDisabled={disabled}
        onPress={() => go(dir === 'prev' ? page - 1 : page + 1)}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-(--radius-control) border border-edge-strong bg-surface',
          'text-fg-secondary',
          'transition-colors duration-fast ease-standard',
          'data-hovered:bg-sunken data-hovered:text-fg',
          'data-disabled:cursor-not-allowed data-disabled:border-edge',
          'data-disabled:bg-sunken data-disabled:text-fg-disabled',
          target,
        )}
      >
        <Icon name={dir === 'prev' ? 'chevron-left' : 'chevron-right'} size={icon} />
      </RACButton>
    );
  };

  return (
    /* landmark ให้ผู้ใช้ screen reader กระโดดมาที่การแบ่งหน้าได้ตรง ๆ */
    <nav
      aria-label={label ?? s.pagination.label}
      className={cn('flex min-w-0 flex-wrap items-center justify-center gap-2', className)}
    >
      {arrow('prev')}

      {resolvedVariant === 'pages' && resolvedTotal !== undefined && (
        /* ★ ใช้ <ol> เพราะลำดับของหน้ามีความหมาย — screen reader จะบอก
           จำนวนรายการทั้งหมดให้ด้วย */
        <ol className="flex min-w-0 items-center gap-1">
          {pageSlots(page, resolvedTotal, siblingCount).map((slot, i) =>
            slot === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden="true" className={cn('px-1 text-fg-muted', text)}>
                {/* ★ ไม่ใช่ปุ่ม disabled — ผู้ใช้คีย์บอร์ดจะต้อง Tab ผ่านของที่ไม่ทำอะไร */}
                …
              </li>
            ) : (
              <li key={slot}>
                <RACButton
                  /* ★ "หน้า 3" ไม่ใช่ "3" · หน้าปัจจุบันบอกด้วยว่าเป็นหน้าปัจจุบัน */
                  aria-label={
                    slot === page
                      ? s.pagination.currentPage(slot)
                      : s.pagination.page(slot)
                  }
                  aria-current={slot === page ? 'page' : undefined}
                  isDisabled={isDisabled}
                  onPress={() => go(slot)}
                  className={cn(
                    'inline-flex items-center justify-center',
                    'rounded-(--radius-control) border px-2',
                    'font-numeric tabular-nums',
                    'transition-colors duration-fast ease-standard',
                    'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
                    slot === page
                      ? /* ★ หน้าปัจจุบันไม่ใช้พื้นทึบน้ำเงิน — สงวนให้ CTA (ข้อ 05)
                           ใช้ tint + ขอบแบรนด์ เหมือน Token ที่เลือกอยู่ */
                        'border-edge-brand bg-selected-surface text-selected-fg'
                      : 'border-edge-strong bg-surface text-fg-secondary data-hovered:bg-sunken data-hovered:text-fg',
                    target,
                    text,
                  )}
                >
                  {slot.toLocaleString('en-US')}
                </RACButton>
              </li>
            ),
          )}
        </ol>
      )}

      {resolvedVariant === 'compact' && resolvedTotal !== undefined && (
        <span className={cn('px-2 text-fg-secondary font-numeric tabular-nums', text)}>
          {s.pagination.compact(page, resolvedTotal)}
        </span>
      )}

      {resolvedVariant === 'count' && totalItems !== undefined && (
        <span className={cn('px-2 text-fg-secondary font-numeric tabular-nums', text)}>
          {s.pagination.range(
            (page - 1) * pageSize + 1,
            Math.min(page * pageSize, totalItems),
            totalItems,
          )}
        </span>
      )}

      {arrow('next')}
    </nav>
  );
}
