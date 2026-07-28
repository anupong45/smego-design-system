import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Accordion, AccordionItem } from '../data-display/Accordion';
import { ChipRow, RemovableChip } from '../data-display/Chip';
import { Button } from '../inputs/Button';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · FilterPanel + FilterChipRow
   ───────────────────────────────────────────────────────────────────────────
   ★★ ตัวกรองที่เลือกไว้ต้อง **เห็นค้าง** ห้ามยุบเป็น "ตัวกรอง (3)"

   หลัก recognition over recall (ข้อ 01 §4.3) — ผู้ใช้ที่กรอง 4 เงื่อนไข
   ต้องเห็นทั้ง 4 ตลอดเวลา ไม่ใช่ต้องจำว่าเลือกอะไรไว้

   `FilterChipRow` จึงอยู่**เหนือผลลัพธ์** ไม่ใช่ในแผงตัวกรองที่ปิดได้
   — บนมือถือแผงเป็น drawer ที่ปิดไปแล้ว ถ้า chip อยู่ข้างในจะหายไปด้วย

   ★★ กลุ่มตัวกรองต้อง `allowsMultipleExpanded`

   ผู้ใช้ที่กรองหลายเงื่อนไขต้องเห็นทุกกลุ่มที่เปิดไว้พร้อมกัน
   ถ้าเปิดกลุ่ม "ราคา" แล้วกลุ่ม "หมวดหมู่" ปิดเอง = บังคับให้จำอีกครั้ง

   ★★ แผงเป็น **drawer จนถึง `lg` (1024px)** ไม่ใช่ `md` (ข้อ 08 §4.1)

   ที่ 768px การหั่น 720px เป็นตัวกรอง 280 + เนื้อหา 416 ทำให้ card
   เหลือ 196px ต่อ 2 ใบ ซึ่ง**แคบกว่า**ตอนไม่มีตัวกรองที่ได้ 3 ใบ 224px
   — เสียทั้งจำนวนและขนาดพร้อมกัน

   component นี้เป็นแค่เนื้อหาแผง · การห่อด้วย `<DialogOverlay variant="drawer">`
   บนมือถือเป็นหน้าที่ของ Template ในชั้น 05

   ★ ปุ่ม "ล้างตัวกรองทั้งหมด" ต้องมีเสมอเมื่อมีตัวกรองอยู่
   การกดยกเลิกทีละอันจาก 6 เงื่อนไขคือ 6 การกระทำ
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FilterGroup {
  /** คีย์ของกลุ่ม — ใช้กับ `defaultExpandedKeys` */
  id: string;
  /** ชื่อกลุ่ม เช่น "หมวดหมู่" "ช่วงราคา" */
  title: string;
  /** เนื้อหา — `<CheckboxGroup>` · `<Slider>` · `<RadioList>` */
  children: ReactNode;
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  /** กลุ่มที่เปิดไว้ตั้งแต่แรก · ค่าเริ่มต้น = เปิดทุกกลุ่ม */
  defaultExpandedKeys?: string[];
  /** แสดงปุ่มล้างทั้งหมด — ส่งเมื่อมีตัวกรองที่เลือกอยู่ */
  onClearAll?: () => void;
  /**
   * ปุ่ม "ดูผลลัพธ์ N รายการ" ท้าย drawer บนมือถือ
   *
   * ⚠️ บนเดสก์ท็อป**ไม่ควรมี** เพราะผลลัพธ์อัปเดตทันทีอยู่แล้ว
   * ปุ่มที่ไม่ทำอะไรเพิ่มคือปุ่มที่ทำให้ผู้ใช้ลังเล
   */
  footer?: ReactNode;
  className?: string;
}

export function FilterPanel({
  groups,
  defaultExpandedKeys,
  onClearAll,
  footer,
  className,
}: FilterPanelProps) {
  const s = useStrings();

  return (
    /* `<section>` + ชื่อ ทำให้ผู้ใช้ screen reader ข้ามทั้งแผงได้ด้วย
       การนำทางแบบ landmark — สำคัญเพราะแผงอยู่**ก่อน**ผลลัพธ์ใน DOM */
    <section
      aria-label={s.filter.title}
      className={cn('grid min-w-0 gap-3', className)}
    >
      <div className="flex min-w-0 items-baseline justify-between gap-2">
        <h2 className="text-subtitle text-fg">{s.filter.title}</h2>
        {onClearAll && (
          <Button variant="ghost" size="xs" onPress={onClearAll}>
            {s.filter.clearAll}
          </Button>
        )}
      </div>

      {/* ★ หลายกลุ่มเปิดพร้อมกันได้ — ไม่ใช่ accordion ที่ปิดตัวอื่นเอง */}
      <Accordion
        allowsMultipleExpanded
        defaultExpandedKeys={defaultExpandedKeys ?? groups.map((g) => g.id)}
      >
        {groups.map((g) => (
          <AccordionItem key={g.id} id={g.id} title={g.title} headingLevel={3}>
            {g.children}
          </AccordionItem>
        ))}
      </Accordion>

      {footer}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FilterChipRow — ตัวกรองที่เลือกไว้ · อยู่เหนือผลลัพธ์
   ───────────────────────────────────────────────────────────────────────────── */

export interface ActiveFilter {
  /** คีย์สำหรับลบ */
  id: string;
  /**
   * ข้อความบน chip — **ต้องบอกทั้งกลุ่มและค่า**
   *
   * "กรุงเทพฯ" ไม่พอเมื่อมีทั้งตัวกรอง "จังหวัดผู้ผลิต" และ "จังหวัดจัดส่ง"
   * ให้ส่ง "ผู้ผลิต: กรุงเทพฯ"
   */
  label: string;
}

export interface FilterChipRowProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

/**
 * ★ ไม่ render อะไรเลยเมื่อไม่มีตัวกรอง
 *
 * แถวเปล่าที่มีแต่ความสูงทำให้ผลลัพธ์ขยับตอนกรองครั้งแรก
 * ซึ่งเป็น layout shift ที่หลีกเลี่ยงได้
 */
export function FilterChipRow({
  filters,
  onRemove,
  onClearAll,
  className,
}: FilterChipRowProps) {
  const s = useStrings();

  if (filters.length === 0) return null;

  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <ChipRow label={s.filter.activeFilters} className="flex-1">
        {filters.map((f) => (
          <RemovableChip key={f.id} label={f.label} onRemove={() => onRemove(f.id)}>
            {f.label}
          </RemovableChip>
        ))}
      </ChipRow>

      {/* อยู่นอก ChipRow เพราะต้องไม่เลื่อนหายไปกับ chip */}
      {onClearAll && filters.length > 1 && (
        <Button variant="ghost" size="xs" onPress={onClearAll} className="shrink-0">
          {s.filter.clearAll}
        </Button>
      )}
    </div>
  );
}
