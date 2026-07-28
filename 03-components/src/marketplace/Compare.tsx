import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from '../inputs/Button';
import { IconButton } from '../inputs/IconButton';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · CompareBar + CompareTable
   ───────────────────────────────────────────────────────────────────────────
   ★★★ CompareTable ที่ 320px **สลับเป็นแนวตั้ง** ไม่เลื่อนแนวนอน

   ⚠️ หมายเหตุที่ต้องแม่น: **SC 1.4.10 ยกเว้นตาราง** — ตัวบทเขียนว่า
   "except for parts of the content which require two-dimensional layout"
   ตารางข้อมูลเข้าข่ายข้อยกเว้นนั้น ดังนั้นตารางที่เลื่อนแนวนอนใน
   กล่องตัวเอง **ไม่ได้ผิดเกณฑ์**

   เหตุผลจริงที่เลือกแนวตั้งคือ **การใช้งาน ไม่ใช่การผ่านเกณฑ์**:
   การเทียบสินค้า 3 ตัวโดยเลื่อนแนวนอนบนจอ 320px แปลว่า
   **ไม่มีทางเห็นสองค่าพร้อมกันเลย** ซึ่งทำลายเหตุผลทั้งหมดของการเปรียบเทียบ

   วิธีที่ใช้: `<tr>` = **คุณสมบัติหนึ่งข้อ** · บนมือถือแต่ละแถวกลายเป็น
   บล็อกที่มีหัวข้อคุณสมบัติแล้วเรียงค่าของทุกสินค้าใต้กัน
   → เทียบ "ราคา" ของ 3 ตัวได้ในสายตาเดียว

   ★★ เปลี่ยน `display` แล้วต้อง **ใส่ role กลับเอง**

   Safari + VoiceOver **ทิ้ง semantic ของตาราง**เมื่อ `display` ไม่ใช่
   `table`/`table-row`/`table-cell` — เป็นบั๊กที่รู้กันมานานและยังไม่หาย
   component จึงประกาศ `role="table"` `role="row"` `role="cell"`
   `role="rowheader"` ไว้ทุกตัว **ห้ามลบ**

   ★★ CompareBar เป็น `fixed` ที่ก้นจอ — ต้องระวัง SC 2.4.11

   แถบที่ลอยอยู่ก้นจอ**ทับ element ที่ถูก focus ได้** เหมือน sticky header

   component นี้ประกาศ **เฉพาะ `--compare-bar-height` ของตัวเอง**
   `semantic.css` รวมทุกแถบเป็น `--bottom-inset` ด้วย `calc()` และ
   `base.css §5a` จองพื้นที่ท้ายเอกสารจากค่านั้น — หน้าที่ใช้ **ไม่ต้องทำอะไร**

   ห้ามแตะ `--bottom-nav-height` (ของ BottomNav) หรือ `body` โดยตรง
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CompareItem {
  id: string;
  name: string;
}

export interface CompareBarProps {
  items: CompareItem[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  /** เปิดหน้า/modal เปรียบเทียบ */
  onOpen: () => void;
  /** จำนวนสูงสุดที่เทียบได้ · ค่าเริ่มต้น 4 */
  maxItems?: number;
  /**
   * จองพื้นที่ท้ายหน้าเท่าความสูงแถบ · ค่าเริ่มต้น `true`
   *
   * ⚠️ ปิดได้เฉพาะเมื่อหน้าจัดการเองแล้ว — ไม่งั้นจะไม่ผ่าน SC 2.4.11
   * (ดูเหตุผลใน §5 ของ `Compare.md`)
   */
  reserveSpace?: boolean;
  className?: string;
}

export function CompareBar({
  items,
  onRemove,
  onClearAll,
  onOpen,
  maxItems = 4,
  reserveSpace = true,
  className,
}: CompareBarProps) {
  const s = useStrings();
  const ref = useRef<HTMLDivElement>(null);

  /**
   * ★★★ ประกาศ **เฉพาะความสูงของแถบนี้** — ห้ามแตะอย่างอื่น
   *
   * `--bottom-inset` ใน `semantic.css` รวมทุกแถบด้วย `calc()` และ
   * `base.css §5a` จองพื้นที่ท้ายเอกสารจากค่านั้น
   *
   * ⚠️ **เวอร์ชันก่อนหน้าเขียนทับ `--bottom-nav-height` และ
   * `body.style.paddingBottom` ตรง ๆ** ซึ่งพังทันทีที่มี `BottomNav` อยู่ด้วย:
   * ทั้งคู่เขียนตัวแปรเดียวกัน last-writer-wins → จองพื้นที่แค่แถบเดียว
   * → ปุ่มท้ายหน้าจมใต้แถบ = ไม่ผ่าน SC 2.4.11
   *
   * ตอนนี้เขียน `--compare-bar-height` ของตัวเองเท่านั้น จึงบวกกับแถบอื่นได้
   *
   * ใช้ `useLayoutEffect` เพื่อให้ค่าถูกตั้ง **ก่อน paint**
   */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !reserveSpace) return;
    const root = document.documentElement;

    const publish = () => {
      root.style.setProperty('--compare-bar-height', `${el.offsetHeight}px`);
    };
    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(el);

    return () => {
      observer.disconnect();
      /* คืนเป็น 0px ไม่ใช่ removeProperty — ให้ calc() ยังคำนวณได้ */
      root.style.setProperty('--compare-bar-height', '0px');
    };
  }, [items.length, reserveSpace]);

  /* ไม่ render เลยเมื่อว่าง — แถบเปล่าที่ก้นจอกินพื้นที่โดยไม่ให้อะไร
     ⚠️ hook อยู่**เหนือ** early return เสมอ ตามกฎของ React */
  if (items.length === 0) return null;

  return (
    <div
      ref={ref}
      /* `role="region"` + ชื่อ ทำให้ผู้ใช้ screen reader กระโดดมาที่แถบนี้ได้
         โดยไม่ต้องไล่ Tab ผ่านผลลัพธ์ทั้งหน้า */
      role="region"
      aria-label={s.compare.barLabel(items.length)}
      className={cn(
        'fixed inset-x-0 bottom-0 z-(--z-bar)',
        'border-t border-(--elevation-edge-overlay)',
        'bg-(--elevation-surface-overlay)',
        'shadow-(--elevation-overlay)',
        /* ★ เข้าด้วย opacity เท่านั้น — ไม่มี transform ที่กระตุ้นระบบทรงตัว */
        'animate-[fade-in_150ms_ease-out] motion-reduce:animate-none',
        /* กันชนขอบล่างบนมือถือที่มีแถบระบบ */
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <div className="mx-auto flex min-w-0 max-w-(--container-content) flex-col gap-3 p-3 md:flex-row md:items-center md:gap-4 md:p-4">
        <p className="text-body-sm text-fg" aria-live="polite">
          {s.compare.barLabel(items.length)}
          {items.length >= maxItems && (
            <span className="text-caption text-fg-muted"> · {s.compare.max(maxItems)}</span>
          )}
        </p>

        {/* รายการที่เลือก — เลื่อนแนวนอนได้ · p-1 เผื่อวงแหวน focus */}
        <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto p-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex shrink-0 items-center gap-1 rounded-full border border-edge bg-sunken py-1 pe-1 ps-3"
            >
              <span className="max-w-32 truncate text-caption text-fg-secondary">
                {it.name}
              </span>
              {/* ★ ชื่อปุ่มรวมชื่อสินค้า — ในแถวที่มี 4 ปุ่ม "นำออก"
                 ผู้ใช้ screen reader แยกไม่ออก (SC 2.5.3) */}
              <IconButton
                name="x"
                label={s.compare.removeItem(it.name)}
                size="sm"
                variant="ghost"
              />
            </li>
          ))}
        </ul>

        {/* ปุ่มซ้อนแนวตั้งบนมือถือ ปุ่มหลักอยู่บน (ข้อ 08 §7) */}
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
          <Button variant="ghost" size="sm" onPress={onClearAll}>
            {s.compare.clearAll}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onPress={onOpen}
            isDisabled={items.length < 2}
          >
            {s.compare.openCompare}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CompareTable
   ───────────────────────────────────────────────────────────────────────────── */

export interface CompareRow {
  /** ชื่อคุณสมบัติ เช่น "ราคา" "สั่งขั้นต่ำ" */
  label: string;
  /** ค่าของแต่ละสินค้า — เรียงตรงกับ `items` */
  values: ReactNode[];
}

export interface CompareTableProps {
  items: CompareItem[];
  rows: CompareRow[];
  onRemove?: (id: string) => void;
  className?: string;
}

export function CompareTable({ items, rows, onRemove, className }: CompareTableProps) {
  const s = useStrings();

  return (
    <table
      /* ★ role ชัดเจน — Safari/VoiceOver ทิ้ง semantic เมื่อ display เปลี่ยน */
      role="table"
      aria-label={s.compare.tableLabel}
      className={cn('w-full min-w-0 border-collapse text-body-sm', className)}
    >
      {/* หัวตารางซ่อนบนมือถือ — ชื่อสินค้ากลับมาผ่าน ::before ของแต่ละค่า */}
      <thead role="rowgroup" className="max-lg:hidden">
        <tr role="row">
          <th
            role="columnheader"
            scope="col"
            className="w-40 p-3 text-start align-bottom text-label text-fg-muted"
          >
            {s.compare.attribute}
          </th>
          {items.map((it) => (
            <th
              role="columnheader"
              scope="col"
              key={it.id}
              className="min-w-0 p-3 text-start align-bottom"
            >
              <span className="flex min-w-0 items-start justify-between gap-2">
                <span className="min-w-0 text-subtitle text-fg">{it.name}</span>
                {onRemove && (
                  <IconButton
                    name="x"
                    label={s.compare.removeItem(it.name)}
                    size="sm"
                    variant="ghost"
                    onPress={() => onRemove(it.id)}
                  />
                )}
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody role="rowgroup" className="max-lg:grid max-lg:min-w-0 max-lg:gap-4">
        {rows.map((row) => (
          <tr
            role="row"
            key={row.label}
            className={cn(
              'border-b border-edge-subtle last:border-b-0',
              /* ★ มือถือ: แถว = บล็อกของคุณสมบัติหนึ่งข้อ
                 ค่าของทุกสินค้าเรียงใต้กัน → เทียบได้ในสายตาเดียว */
              'max-lg:grid max-lg:min-w-0 max-lg:gap-1 max-lg:rounded-(--radius-container)',
              'max-lg:border max-lg:border-edge-subtle max-lg:p-3',
            )}
          >
            <th
              role="rowheader"
              scope="row"
              className={cn(
                'p-3 text-start align-top text-label text-fg-muted',
                'max-lg:p-0 max-lg:pb-1',
              )}
            >
              {row.label}
            </th>
            {row.values.map((v, i) => (
              <td
                role="cell"
                /* ค่า index ผูกกับ items ที่ตำแหน่งเดียวกัน — คีย์จึงใช้ id ได้ */
                key={items[i]?.id ?? i}
                /* ★ ชื่อสินค้ากลับมาบนมือถือผ่าน ::before
                   เป็นการตกแต่งล้วน — screen reader ได้ความสัมพันธ์
                   จาก scope="col"/"row" อยู่แล้ว จึงไม่อ่านซ้ำ */
                data-item={items[i]?.name}
                className={cn(
                  'min-w-0 p-3 align-top text-fg',
                  'max-lg:grid max-lg:grid-cols-[8rem_1fr] max-lg:gap-2 max-lg:p-0 max-lg:py-1',
                  "max-lg:before:content-[attr(data-item)] max-lg:before:min-w-0",
                  'max-lg:before:text-caption max-lg:before:text-fg-muted',
                )}
              >
                <span className="min-w-0">{v}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
