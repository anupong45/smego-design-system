import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Table — ตารางข้อมูล อ่าน + เรียงลำดับ + คำสั่งต่อแถว
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ใช้ `<table>` ปกติ **ไม่ใช่** RAC `Table` — วัดแล้วตัดสินแล้ว

   RAC `Table` เพิ่ม **+44 KB gzip** บน baseline 30.5 KB คือ **เกินเท่าตัว**
   อยู่ในลีกเดียวกับ `Typeahead` (+43) และ `Selector` (+40)

   สิ่งที่ได้มาแลกกับ 44 KB คือ selection · การเดินด้วยลูกศรแบบ 2 มิติ ·
   drag-and-drop — ซึ่งเป็น **ของที่ขอบเขตตัดออกไปทั้งชุด** (คำตัดสิน
   2026-07-26: read + sort + row action · selection เลื่อนไปก่อน)

   แย่กว่านั้น RAC ประกาศ `role="grid"` ซึ่งเปลี่ยนพฤติกรรม screen reader
   เป็นแบบ application ผู้ใช้ต้องเรียนรู้การเดินด้วยลูกศร · ตารางอ่านอย่างเดียว
   ที่ใช้ semantic ของ `<table>` จริง screen reader รองรับดีกว่าและไม่มีต้นทุน

   และ `CompareTable` ใช้ `<table>` ปกติอยู่แล้ว — ถ้าตัวนี้ใช้ RAC ระบบจะมี
   ตารางสองแบบที่ผู้ใช้ screen reader เจอคนละโมเดล ซึ่งเป็น "สองวิธีทำสิ่ง
   เดียวกัน" ที่ระบบนี้ปฏิเสธซ้ำ ๆ (D15 · D22 · D33)

   ★★★ `role` ต้องเขียนครบทุกชั้น **ห้ามลบ**

   Safari/VoiceOver **ทิ้ง semantic ของตาราง** เมื่อ `display` ถูกเปลี่ยน
   ซึ่งเกิดขึ้นจริงที่ <lg ตอนแต่ละแถวกลายเป็นการ์ด · เหตุผลเดียวกับที่
   `CompareTable` เขียน role ไว้ทุกตัว

   ★★ **ไม่มีแถวที่กดได้ทั้งแถว** — คำสั่งอยู่ในคอลัมน์ของตัวเอง

   แถวที่กดได้ทั้งแถวเป็นกับดัก: ผู้ใช้ screen reader ไม่รู้ว่ากดได้ · ผู้ใช้
   คีย์บอร์ดต้อง Tab ผ่านทุกแถว · และการเลือกข้อความในเซลล์จะกลายเป็นการกด
   `rowAction` จึงรับ element มาวางในเซลล์สุดท้าย ให้เป็นปุ่มหรือเมนูจริง
   (ดู `DropdownMenu`) — เป้าที่ประกาศตัวเองได้

   ★ ที่ <lg แต่ละแถวกลายเป็น **การ์ด** ไม่ใช่การสลับแกนแบบ `CompareTable`
   เพราะแถวของตารางข้อมูลเป็น **คนละ entity** ส่วนแถวของ CompareTable เป็น
   ค่าของคุณสมบัติเดียวกัน (คำตัดสิน 2026-07-26)
   ชื่อคอลัมน์กลับมาผ่าน `::before` ที่อ่านจาก `data-label`
   ═══════════════════════════════════════════════════════════════════════════ */

export type TableAlign = 'start' | 'end';
export type SortDirection = 'ascending' | 'descending';

export interface TableColumn<T> {
  /** key ที่ใช้อ้างในการเรียงลำดับ · ต้องไม่ซ้ำ */
  key: string;
  /** หัวคอลัมน์ที่เห็นและที่ screen reader อ่าน */
  header: string;
  /**
   * `end` สำหรับตัวเลขและจำนวนเงิน — ทศนิยมจะเรียงตรงกันเมื่อชิดขวา
   * ใช้คู่กับ `font-numeric` ในตัว `render`
   */
  align?: TableAlign;
  /** เรียงลำดับตามคอลัมน์นี้ได้ */
  isSortable?: boolean;
  /** วาดเซลล์ · ค่าเริ่มต้นอ่านจาก `row[key]` แบบ string */
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  /**
   * ชื่อตาราง — บังคับเพื่อ accessible name (SC 4.1.2)
   *
   * ⚠️ ถ้าหน้ามีหลายตาราง **ชื่อต้องต่างกัน** ไม่เช่นนั้นผู้ใช้ screen reader
   * แยกไม่ออกว่ากระโดดมาที่ตารางไหน (เคสเดียวกับ `Pagination` บน+ล่าง)
   */
  label: string;
  columns: TableColumn<T>[];
  rows: T[];
  /** key ของแต่ละแถว — ต้องไม่ซ้ำ */
  rowKey: (row: T) => string;

  /** key ของคอลัมน์ที่กำลังเรียง */
  sortBy?: string;
  sortDirection?: SortDirection;
  /**
   * ★ การเรียงเป็นแบบ **controlled** เท่านั้น — ไม่มี state ในตัว
   *
   * ข้อมูลจริงมาจาก API ที่เรียงฝั่งเซิร์ฟเวอร์เป็นส่วนใหญ่ · การเก็บ state
   * ไว้ในตารางจะทำให้เกิดสองแหล่งความจริงทันทีที่ต่อ API
   */
  onSortChange?: (key: string, direction: SortDirection) => void;

  /** element คำสั่งของแถว — วางในเซลล์สุดท้าย (ดูหัวไฟล์ว่าทำไมไม่ใช่ทั้งแถว) */
  rowAction?: (row: T) => ReactNode;
  /** ชื่อคอลัมน์คำสั่ง · ค่าเริ่มต้นจาก strings */
  rowActionLabel?: string;

  /** แสดงเมื่อ `rows` ว่าง — ถ้าไม่ส่ง ตารางจะไม่ render เลย */
  emptyState?: ReactNode;

  className?: string;
}

export function Table<T>({
  label,
  columns,
  rows,
  rowKey,
  sortBy,
  sortDirection,
  onSortChange,
  rowAction,
  rowActionLabel,
  emptyState,
  className,
}: TableProps<T>) {
  const s = useStrings();

  /* ตารางเปล่าไม่ให้ข้อมูลอะไร — หัวคอลัมน์ลอย ๆ ทำให้ผู้ใช้รอว่าข้อมูล
     กำลังโหลดอยู่หรือไม่มีจริง · ให้ผู้เรียกส่ง EmptyState มาแทน */
  if (rows.length === 0) return emptyState ?? null;

  const cellPad = 'px-3 py-2';

  return (
    <table
      /* ★★★ role ชัดเจนทุกชั้น — Safari/VoiceOver ทิ้ง semantic เมื่อ display
         เปลี่ยน ซึ่งเกิดจริงที่ <lg ตอนแถวกลายเป็นการ์ด · ห้ามลบ */
      role="table"
      aria-label={label}
      className={cn('w-full min-w-0 border-collapse text-body-sm', className)}
    >
      <thead role="rowgroup" className="max-lg:hidden">
        <tr role="row" className="border-b border-edge">
          {columns.map((col) => {
            const isSorted = sortBy === col.key;
            /* ★★ ทิศทางที่จะได้ **เมื่อกด** ไม่ใช่ทิศทางปัจจุบัน
               ต้องตรงกับสิ่งที่ `onClick` ทำจริงเป๊ะ ๆ — ฉบับแรกคำนวณกลับข้าง
               ทำให้ปุ่มประกาศว่า "จากน้อยไปมาก" ทั้งที่กดแล้วได้มากไปน้อย
               ซึ่งเป็นการโกหกผู้ใช้ screen reader โดยที่ตายังเห็นถูก */
            const next: SortDirection =
              isSorted && sortDirection === 'ascending' ? 'descending' : 'ascending';

            return (
              <th
                role="columnheader"
                scope="col"
                key={col.key}
                /* ★★ `aria-sort` อยู่ที่ `<th>` ไม่ใช่ที่ปุ่ม — ARIA กำหนดไว้
                   ว่าเป็นคุณสมบัติของหัวคอลัมน์ · ใส่ผิดที่ SR ไม่ประกาศ */
                aria-sort={isSorted ? sortDirection ?? 'ascending' : undefined}
                className={cn(
                  'text-label text-fg-secondary',
                  col.align === 'end' ? 'text-end' : 'text-start',
                  !col.isSortable && cellPad,
                )}
              >
                {col.isSortable && onSortChange ? (
                  <button
                    type="button"
                    onClick={() =>
                      /* ★ ใช้ `next` ตัวเดียวกับที่ประกาศในชื่อปุ่ม —
                         คำนวณสองที่คือทางที่ทำให้สองอย่างหลุดจากกัน */
                      onSortChange(col.key, next)
                    }
                    /* ★ ชื่อปุ่มบอก **สิ่งที่จะเกิด** ไม่ใช่สถานะปัจจุบัน —
                       สถานะอยู่ใน `aria-sort` ของ `<th>` แล้ว ถ้าปุ่มบอก
                       สถานะซ้ำ ผู้ใช้จะได้ยินสองครั้งและสับสนว่ากดแล้วได้อะไร */
                    aria-label={
                      next === 'ascending'
                        ? s.table.sortAscending(col.header)
                        : s.table.sortDescending(col.header)
                    }
                    className={cn(
                      'flex min-h-11 w-full items-center gap-1',
                      cellPad,
                      col.align === 'end' && 'justify-end',
                      'cursor-pointer rounded-(--radius-sm)',
                      'transition-colors duration-fast ease-standard',
                      'hover:bg-sunken',
                    )}
                  >
                    <span>{col.header}</span>
                    {/* ★★ ตัวชี้การเรียงเป็น **รูปทรง** ไม่ใช่สี (SC 1.4.1)
                       ลูกศรขึ้น/ลง ต่างกันชัด · ตอนไม่ได้เรียงไม่มีไอคอนเลย
                       จึงไม่ต้องเดาว่าลูกศรจาง ๆ หมายถึงอะไร */}
                    {isSorted && (
                      <Icon
                        name={sortDirection === 'descending' ? 'chevron-down' : 'chevron-up'}
                        size={16}
                      />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}

          {rowAction && (
            <th
              role="columnheader"
              scope="col"
              className={cn('text-end text-label text-fg-secondary', cellPad)}
            >
              {/* ★ หัวคอลัมน์คำสั่งต้องมีข้อความจริง ไม่ปล่อยว่าง — คอลัมน์
                 ที่ไม่มีชื่อทำให้ SR อ่านว่า "column 5" เปล่า ๆ */}
              {rowActionLabel ?? s.table.actions}
            </th>
          )}
        </tr>
      </thead>

      <tbody role="rowgroup" className="max-lg:grid max-lg:min-w-0 max-lg:gap-3">
        {rows.map((row) => (
          <tr
            role="row"
            key={rowKey(row)}
            className={cn(
              'border-b border-edge',
              /* ★ ที่ <lg แต่ละแถวเป็นการ์ด — คนละ entity จึงแยกกล่องกัน
                 ไม่ใช่สลับแกนแบบ CompareTable ที่แถวเป็นค่าของแกนเดียว */
              'max-lg:grid max-lg:min-w-0 max-lg:gap-1',
              'max-lg:rounded-(--radius-container) max-lg:border max-lg:p-3',
            )}
          >
            {columns.map((col) => (
              <td
                role="cell"
                key={col.key}
                /* ★ ชื่อคอลัมน์กลับมาผ่าน ::before ที่ <lg เพราะ thead ซ่อน
                   — ตัวเลขลอย ๆ ในการ์ดไม่บอกว่าเป็นอะไร */
                data-label={col.header}
                className={cn(
                  cellPad,
                  'align-top',
                  col.align === 'end' ? 'text-end' : 'text-start',
                  'max-lg:flex max-lg:min-w-0 max-lg:justify-between max-lg:gap-3 max-lg:px-0 max-lg:py-0.5',
                  'max-lg:before:text-caption max-lg:before:text-fg-muted',
                  'max-lg:before:content-[attr(data-label)]',
                )}
              >
                {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
              </td>
            ))}

            {rowAction && (
              <td
                role="cell"
                className={cn(
                  cellPad,
                  'text-end align-top',
                  'max-lg:px-0 max-lg:pt-2 max-lg:pb-0',
                )}
              >
                {rowAction(row)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
