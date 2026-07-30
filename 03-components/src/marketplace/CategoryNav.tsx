'use client';

import { cn } from '../lib/cn';
import { Link } from '../inputs/Link';
import { Icon } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · CategoryNav + CategoryBreadcrumb
   ───────────────────────────────────────────────────────────────────────────
   ★★ เป็น **ลิงก์ ไม่ใช่ปุ่ม** — หมวดหมู่คือ URL

   ผู้ใช้ต้อง bookmark หมวดได้ · แชร์ลิงก์หมวดให้เพื่อนร่วมงานได้ ·
   กด Back กลับหมวดก่อนหน้าได้ · เปิดหลายหมวดในหลายแท็บเพื่อเทียบได้

   ทั้งหมดนี้ `onClick` ให้ไม่ได้เลย และเป็นพฤติกรรมจริงของผู้ซื้อ B2B
   ที่เปรียบเทียบข้ามหมวด

   ★★ ต่างจาก `<Token>` ตรงที่ **หมวดไม่ใช่ตัวกรอง**

   ตัวกรองเลือกหลายอันพร้อมกันได้และยกเลิกได้ · หมวดคือ**ตำแหน่งที่อยู่**
   เลือกได้ทีละอันและ "ยกเลิก" หมายถึงกลับไปหมวดแม่
   จึงใช้ `aria-current="page"` ไม่ใช่ `aria-pressed`

   ★ นับจำนวนต่อหมวดช่วยให้ผู้ใช้ไม่กดเข้าไปเจอหน้าว่าง
   เป็นข้อมูลที่ถูกกว่ามากเมื่อเทียบกับการเสียเที่ยว

   ★ บนมือถือเลื่อนแนวนอน **ไม่ใช่ตัดบรรทัด**
   ชื่อหมวดไทยยาว ("เครื่องจักรและอุปกรณ์อุตสาหกรรม") การตัดบรรทัด
   จะกินความสูง 4–5 แถวก่อนถึงเนื้อหาจริง
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CategoryItem {
  id: string;
  name: string;
  href: string;
  /** จำนวนรายการในหมวด */
  count?: number;
}

export interface CategoryNavProps {
  items: CategoryItem[];
  /** id ของหมวดที่อยู่ตอนนี้ */
  currentId?: string;
  /** ลิงก์ "ทุกหมวดหมู่" นำหน้า */
  allHref?: string;
  /** `scroll` = แถวเลื่อนแนวนอน · `list` = รายการแนวตั้งในแถบข้าง */
  layout?: 'scroll' | 'list';
  className?: string;
}

export function CategoryNav({
  items,
  currentId,
  allHref,
  layout = 'scroll',
  className,
}: CategoryNavProps) {
  const s = useStrings();

  const isScroll = layout === 'scroll';

  const entries = [
    ...(allHref ? [{ id: '', name: s.category.allCategories, href: allHref }] : []),
    ...items,
  ];

  return (
    <nav aria-label={s.category.title} className={cn('min-w-0', className)}>
      <ul
        className={cn(
          'flex min-w-0',
          isScroll
            ? [
                'items-center gap-2',
                'relative overflow-x-auto snap-x',
                '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                /* p-1 = 4px — เท่ากับที่วงแหวน focus ล้นออกนอกขอบพอดี
                   `overflow-x: auto` ตัดทั้งสองแกน (ดู Chip.md §5) */
                'p-1',
                '[&>li]:shrink-0 [&>li]:snap-start',
              ]
            : 'flex-col gap-0.5',
        )}
      >
        {entries.map((item) => {
          const isCurrent = item.id === (currentId ?? '');
          return (
            <li key={item.id || 'all'} className="min-w-0">
              <Link
                href={item.href}
                quiet
                size="body-sm"
                /* ★ หมวดคือตำแหน่งที่อยู่ ไม่ใช่สถานะเปิด/ปิด
                   `aria-current="page"` ไม่ใช่ `aria-pressed` */
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-1',
                  /* py-2 ทำให้เป้ากดสูง ≥40px ทั้งสอง layout */
                  'rounded-(--radius-control) px-3 py-2',
                  'transition-colors duration-fast ease-standard',
                  isCurrent
                    ? 'bg-selected-surface text-selected-fg'
                    : 'text-fg-secondary data-hovered:bg-sunken data-hovered:text-fg',
                  /* ห้าม truncate ในโหมด list — ชื่อหมวดต้องอ่านครบ */
                  isScroll ? 'whitespace-nowrap' : 'min-w-0',
                )}
              >
                <span className={isScroll ? '' : 'min-w-0'}>{item.name}</span>
                {item.count !== undefined && (
                  <>
                    {/* ★ ตัวเลขที่มองเห็นถูกซ่อนจาก screen reader
                       เพราะชื่อ accessible จะต่อกันเป็น "เครื่องคั่วและอบ128"
                       (ไม่มีช่องว่างระหว่าง element) และ "128" เฉย ๆ
                       ก็ไม่บอกว่า 128 อะไร — วัดเจอจริงในเบราว์เซอร์ */}
                    <span
                      aria-hidden="true"
                      className="text-caption text-fg-muted font-numeric"
                    >
                      {item.count.toLocaleString('en-US')}
                    </span>
                    <span className="sr-only">{` ${s.category.itemCount(item.count)}`}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CategoryBreadcrumb — เส้นทางหมวด
   ───────────────────────────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string;
  /** ไม่มี `href` = รายการปัจจุบัน */
  href?: string;
}

export interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * ★ รายการสุดท้ายไม่ใช่ลิงก์ — เป็นหน้าที่อยู่ตอนนี้
 * ลิงก์ที่ชี้มาที่ตัวเองทำให้ผู้ใช้ screen reader สับสน
 *
 * ★ ตัวคั่นอยู่ใน `aria-hidden` — screen reader ได้โครงสร้างจาก `<ol>` อยู่แล้ว
 * ถ้าไม่ซ่อน ผู้ใช้จะได้ยิน "สแลช" ทุกขั้น
 *
 * ★ เลื่อนแนวนอนได้บนมือถือ · ห้ามยุบเป็น "…" ตรงกลาง
 * ผู้ใช้ต้องเห็นว่าตัวเองอยู่ตรงไหนของโครงสร้าง (ข้อ 01 §4.3)
 */
export function CategoryBreadcrumb({ items, className }: CategoryBreadcrumbProps) {
  const s = useStrings();

  return (
    <nav aria-label={s.category.breadcrumbLabel} className={cn('min-w-0', className)}>
      <ol
        className={cn(
          'flex min-w-0 items-center gap-1',
          'relative overflow-x-auto',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'p-1',
          '[&>li]:shrink-0',
        )}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} quiet size="caption" className="whitespace-nowrap">
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="whitespace-nowrap text-caption text-fg"
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <Icon
                  name="chevron-right"
                  size={16}
                  className="shrink-0 text-fg-muted"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
