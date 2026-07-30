'use client';

import { ToggleButton as RACToggleButton } from 'react-aria-components';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { EmptyState } from '../data-display/EmptyState';
import { Grid } from '../layout/Grid';
import { Button } from '../inputs/Button';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · SaveButton + WishlistGrid
   ───────────────────────────────────────────────────────────────────────────
   ★★ ใช้ RAC `ToggleButton` — **ต้องมี `aria-pressed`**

   ปุ่มบันทึกมีสถานะค้าง ไม่ใช่การกระทำครั้งเดียว · ถ้าใช้ `<Button>` ธรรมดา
   ผู้ใช้ screen reader จะไม่รู้ว่ารายการนี้บันทึกไว้แล้วหรือยัง

   ★★ `aria-label` ต้อง **เปลี่ยนตามสถานะ และรวมชื่อรายการ**

     ยังไม่บันทึก → "บันทึก เครื่องคั่วกาแฟ TR-500 ไว้ดูภายหลัง"
     บันทึกแล้ว   → "นำ เครื่องคั่วกาแฟ TR-500 ออกจากรายการที่บันทึก"

   ในกริดที่มี 20 การ์ด ปุ่มที่ชื่อ "บันทึก" ทั้ง 20 อันแยกกันไม่ได้เลย
   (SC 2.5.3) และผู้ใช้ต้องรู้ว่ากดแล้วจะเกิดอะไร ไม่ใช่รู้ว่าตอนนี้เป็นอะไร

   ★★ หัวใจถูก **ทึบ vs โปร่ง** ไม่ใช่แค่เปลี่ยนสี (SC 1.4.1)
   `fill-current` ตอนบันทึกแล้ว · `fill-none` ตอนยังไม่บันทึก

   ★ ปุ่มอยู่บนการ์ดที่ทั้งใบเป็นลิงก์ → ต้องมี `relative z-(--z-raised)`
   `EntityCard` ใส่ให้แล้วผ่าน slot `actions`

   ★ เป้ากด: ไอคอน 20 + `p-2` = **36×36** ผ่าน SC 2.5.8
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SaveButtonProps {
  /** ชื่อรายการ — เข้าไปอยู่ใน `aria-label` */
  itemName: string;
  isSaved?: boolean;
  defaultSaved?: boolean;
  onChange?: (isSaved: boolean) => void;
  /** `icon` = ปุ่มไอคอนบนการ์ด · `full` = ปุ่มมีข้อความในหน้ารายละเอียด */
  variant?: 'icon' | 'full';
  isDisabled?: boolean;
  className?: string;
}

export function SaveButton({
  itemName,
  isSaved,
  defaultSaved,
  onChange,
  variant = 'icon',
  isDisabled,
  className,
}: SaveButtonProps) {
  const s = useStrings();

  /**
   * ⚠️ RAC รับ `aria-label` เป็น **string เท่านั้น** ไม่ใช่ render function
   * (ต่างจาก `className` และ `children` ที่รับได้) — `tsc` จับข้อนี้ให้
   *
   * ชื่อปุ่มต้องเปลี่ยนตามสถานะ จึงต้องรู้สถานะ**นอก** render prop
   * component จึงเก็บ state ภายในไว้สำหรับโหมด uncontrolled
   * และใช้ค่าจาก prop เมื่อเป็น controlled
   */
  const [internal, setInternal] = useState(defaultSaved ?? false);
  const selected = isSaved ?? internal;

  const handleChange = (next: boolean) => {
    if (isSaved === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <RACToggleButton
      isSelected={selected}
      onChange={handleChange}
      isDisabled={isDisabled}
      /* ★ ชื่อบอก**สิ่งที่จะเกิดขึ้น** และรวมชื่อรายการ */
      aria-label={
        selected ? s.wishlist.removeItem(itemName) : s.wishlist.saveItem(itemName)
      }
      className={({ isSelected }) =>
        cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-(--radius-control) border',
          'transition-colors duration-fast ease-standard',
          'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
          variant === 'icon'
            ? [
                /* 20 + p-2 = 36×36 */
                'p-2',
                'bg-surface border-edge-strong',
                'data-hovered:bg-sunken',
              ]
            : [
                'px-4 py-2 text-body-sm',
                'bg-surface border-edge-strong text-fg',
                'data-hovered:bg-sunken',
              ],
          isSelected && 'text-danger-icon',
          className,
        )
      }
    >
      {({ isSelected }) => (
        <>
          <Icon
            name="heart"
            size={20}
            /* ★ ทึบ vs โปร่ง — ไม่ใช่แค่เปลี่ยนสี */
            className={isSelected ? 'fill-current' : 'fill-none'}
          />
          {variant === 'full' && (
            <span>{isSelected ? s.wishlist.saved : s.wishlist.save}</span>
          )}
        </>
      )}
    </RACToggleButton>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WishlistGrid
   ───────────────────────────────────────────────────────────────────────────── */

export interface WishlistGridProps {
  /** การ์ดที่บันทึกไว้ */
  children?: ReactNode;
  /** จำนวนรายการ — `0` แสดงสถานะว่าง */
  count: number;
  /** ปุ่มในสถานะว่าง เช่น "เลือกดูสินค้า" */
  emptyAction?: ReactNode;
  className?: string;
}

/**
 * ★ สถานะว่างต้องบอก **วิธีทำให้ไม่ว่าง** (ข้อ 01)
 *
 * "ยังไม่มีรายการที่บันทึกไว้" อย่างเดียวไม่ช่วยอะไร
 * "กดปุ่มบันทึกบนรายการที่สนใจ เพื่อกลับมาดูภายหลัง" บอกวิธี
 *
 * ★ ใช้ `preset="product"` เดียวกับหน้ารายการ
 * ผู้ใช้เห็นการ์ดขนาดเดิมในตำแหน่งเดิม — ไม่ต้องเรียนรู้ layout ใหม่
 */
export function WishlistGrid({ children, count, emptyAction, className }: WishlistGridProps) {
  const s = useStrings();

  if (count === 0) {
    return (
      <EmptyState
        icon={<Icon name="heart" size={32} />}
        title={s.wishlist.empty}
        description={s.wishlist.emptyHelp}
        actions={emptyAction}
        className={className}
      />
    );
  }

  return (
    <Grid as="ul" preset="product" className={className}>
      {children}
    </Grid>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WishlistHeader — หัวข้อ + จำนวน
   ───────────────────────────────────────────────────────────────────────────── */

export interface WishlistHeaderProps {
  count: number;
  onClearAll?: () => void;
  /**
   * ระดับหัวข้อ · ค่าเริ่มต้น 1
   *
   * ⚠️ **การ์ดใน `WishlistGrid` ต้องเป็นระดับถัดไปเสมอ**
   * ค่าเริ่มต้นของการ์ดคือ `3` — ถ้าหัวข้อนี้เป็น `1` จะข้ามระดับ 2
   * ซึ่ง axe จับได้ (`heading-order`) และผู้ใช้ screen reader ที่สำรวจ
   * ด้วยโครงหัวข้อจะเจอช่องว่าง
   *
   * ใช้คู่กันแบบนี้: `<WishlistHeader />` + `<ProductCard headingLevel={2} />`
   */
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

/**
 * ★ จำนวนอยู่ใน `aria-live="polite"` เพราะเปลี่ยนเมื่อผู้ใช้นำรายการออก
 * โดยที่ focus ยังอยู่ที่ปุ่มในการ์ดที่กำลังหายไป (SC 4.1.3)
 */
export function WishlistHeader({
  count,
  onClearAll,
  headingLevel = 1,
  className,
}: WishlistHeaderProps) {
  const s = useStrings();
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';

  return (
    <div className={cn('flex min-w-0 flex-wrap items-baseline justify-between gap-3', className)}>
      <Heading className="text-heading-sm text-fg">{s.wishlist.title}</Heading>
      <div className="flex min-w-0 items-center gap-3">
        <span aria-live="polite" aria-atomic="true" className="text-body-sm text-fg-secondary">
          {s.checkout.itemCount(count)}
        </span>
        {onClearAll && count > 0 && (
          <Button variant="ghost" size="xs" onPress={onClearAll}>
            {s.compare.clearAll}
          </Button>
        )}
      </div>
    </div>
  );
}
