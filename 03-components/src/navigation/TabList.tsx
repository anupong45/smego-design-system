'use client';

import {
  Tabs as RACTabs,
  TabList as RACTabList,
  Tab as RACTab,
  TabPanel as RACTabPanel,
  type TabPanelProps as RACTabPanelProps,
} from 'react-aria-components';
import { Children, isValidElement, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · TabList / Tab / TabPanel   (Astryx เรียก Tabs ว่า TabList — §1.3)
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **กฎแบ่งเขต 4 ทาง** — ต้องอ่านก่อนเลือกใช้

   สี่ตัวนี้หน้าตาใกล้กันแต่ **ความหมายกับ ARIA ต่างกันหมด** ถ้าเส้นแบ่งหาย
   จะได้ปัญหาเดียวกับ capsule สี่ตัวที่ §1.4 D9 ตัดทิ้งไปแล้ว:

     `TabList`           สลับ **panel คนละชุด** — เนื้อหาต่างกันจริง
                         `role="tablist"` + `tabpanel` · เนื้อหาที่ไม่ได้เลือก
                         **ไม่อยู่ใน DOM**
     `SegmentedControl`  สลับ **มุมมองของเนื้อหาเดิม** — ตาราง/รายการ
                         `role="radiogroup"` · ข้อมูลชุดเดิม แสดงคนละแบบ
     `RadioList`         **ค่าในฟอร์ม** ที่รอกดส่ง — มี label · error · ส่งกับฟอร์ม
     `Token`             **ตัวกรอง** ที่เลือกได้หลายอัน · `aria-pressed`

   คำถามที่แยกได้เร็วที่สุด:
     "เนื้อหาที่ไม่ได้เลือกยังต้องอยู่ใน DOM ไหม" → ไม่ = TabList
     "มีผลเมื่อกดบันทึกไหม"                      → ใช่ = RadioList
     "เลือกได้หลายอันไหม"                        → ใช่ = Token
     ที่เหลือ                                     → SegmentedControl

   ★★★ **สร้างบน RAC เต็มตัว ไม่ใช่แค่แถบเปล่าแบบ Astryx**

   Astryx ให้ `TabList` เป็นแถบ tab อย่างเดียว ไม่มี panel — แต่ ARIA บังคับว่า
   `role="tab"` ต้องมี `aria-controls` ชี้ไป `tabpanel` และ panel ต้องมี
   `aria-labelledby` ย้อนกลับ ถ้าแถบไม่ได้เป็นเจ้าของ panel ผู้เรียกต้องต่อ
   id เองทุกครั้ง ซึ่ง**เป็นสิ่งที่จะถูกลืม** แล้ว tab จะกลายเป็นปุ่มเฉย ๆ
   สำหรับผู้ใช้ screen reader โดยไม่มี error ให้เห็น

   จึงใช้ `Tabs` / `TabList` / `Tab` / `TabPanel` ของ RAC ซึ่งต่อให้ครบทั้ง
   `aria-controls` · `aria-labelledby` · roving tabindex · ลูกศรซ้าย/ขวา
   ตาม WAI-ARIA APG — เหตุผลเดียวกับ D8 (ไม่พัง RAC เพื่อความเหมือนผิวเผิน)

   ผลคือเรามี `Tab` และ `TabPanel` เกินจาก Astryx → D28

   ★★ **`Tab` ใช้ `label: string` บังคับ ไม่ใช่ `children`**
   ตาม §8.1 เหมือน input ทุกตัว — ชื่อ tab ต้องเป็นข้อความล้วนเพื่อให้
   accessible name ตรงกับที่ตาเห็น (SC 2.5.3) และ `isLabelHidden` สำหรับ
   tab ที่มีแต่ไอคอน

   ★ **เส้นใต้ tab ที่เลือกไม่ใช่ตัวบอกสถานะเพียงอย่างเดียว** (SC 1.4.1)
   RAC ให้ `aria-selected` มาแล้ว และสีข้อความเปลี่ยนด้วย ไม่ได้พึ่งเส้นใต้
   ═══════════════════════════════════════════════════════════════════════════ */

export type TabListSize = 'sm' | 'md' | 'lg';

/**
 * ★ เป้ากดของ tab — `min-h-*` ไม่ใช่ `h-*` (เหตุผลเดียวกับ `Pagination`)
 *
 * Astryx ให้ 28/32/36px · ทั้งสามต่ำกว่าเกณฑ์ touch ที่ระบบนี้ตัดสินไว้ (D1)
 * ของเราจึงเป็น 36/44/48 เหมือน `Pagination`
 */
const SIZE: Record<TabListSize, string> = {
  sm: '[&>*]:min-h-9 [&>*]:text-caption',
  md: '[&>*]:min-h-11 [&>*]:text-button',
  lg: '[&>*]:min-h-12 [&>*]:text-button-lg',
};

export interface TabListProps {
  /** ค่าของ tab ที่เลือกอยู่ */
  value: string;

  /** เรียกเมื่อเปลี่ยน tab */
  onChange: (value: string) => void;

  /**
   * `<Tab>` และ `<TabPanel>`
   *
   * ★ ทั้งคู่อยู่ใน `children` เดียวกันได้ — RAC หา `TabList`/`TabPanel`
   * จากโครงเองและต่อ id ให้
   */
  children: ReactNode;

  /** ชื่อ accessible ของแถบ tab — **บังคับ** เพราะเป็นการนำทาง */
  label: string;

  /** ขนาดเป้ากด · ค่าเริ่มต้น `md` (44px) */
  size?: TabListSize;

  /** `hug` = กว้างตามเนื้อหา (ค่าเริ่มต้น) · `fill` = แบ่งเท่ากันเต็มความกว้าง */
  layout?: 'hug' | 'fill';

  /** เส้นคั่นใต้แถบ tab */
  hasDivider?: boolean;

  /** แนวของแถบ — คุมว่าลูกศรปุ่มไหนเลื่อน focus */
  orientation?: 'horizontal' | 'vertical';

  isDisabled?: boolean;

  className?: string;
}

/**
 * แถบ tab สำหรับสลับ **panel คนละชุด**
 *
 * ⚠️ ถ้าเนื้อหาเหมือนกันแค่แสดงคนละแบบ ใช้ [`<SegmentedControl>`](./SegmentedControl.md)
 * — ดูกฎแบ่งเขต 4 ทางที่หัวไฟล์
 */
export function TabList({
  value,
  onChange,
  children,
  label,
  size = 'md',
  layout = 'hug',
  hasDivider = false,
  orientation = 'horizontal',
  isDisabled = false,
  className,
}: TabListProps) {
  /* ★★ แยก `<Tab>` ออกจาก `<TabPanel>` — ห้ามยัดทั้งสองลงใน `RACTabList`
     เพราะจะได้ `role="tabpanel"` ซ้อนใน `role="tablist"` ซึ่งผิด ARIA
     และ panel จะไป render อยู่ในแถบ tab

     ⚠️ ข้อจำกัดที่ตามมา: `<Tab>` และ `<TabPanel>` ต้องเป็น **ลูกตรง**
     ห่อด้วย fragment หรือ `.map()` ได้ แต่ห่อด้วย `<div>` ไม่ได้ */
  const items = Children.toArray(children);
  const tabs = items.filter((c) => isValidElement(c) && c.type === Tab);
  const panels = items.filter((c) => isValidElement(c) && c.type === TabPanel);

  return (
    <RACTabs
      selectedKey={value}
      onSelectionChange={(key) => onChange(String(key))}
      orientation={orientation}
      isDisabled={isDisabled}
      className={cn('grid min-w-0 gap-4', className)}
    >
      <RACTabList
        aria-label={label}
        className={cn(
          'flex min-w-0 items-stretch',
          orientation === 'vertical' ? 'flex-col gap-1' : 'gap-1',
          /* ★ เลื่อนแนวนอนในกล่องตัวเอง ไม่ใช่ทั้งหน้า (SC 1.4.10)
             tab ไทย 5 อันล้นแน่ที่ 320px และ tab ตัดบรรทัดไม่ได้
             (ต่างจาก Pagination ที่ wrap ได้) */
          orientation === 'horizontal' && [
            'relative overflow-x-auto',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            /* p-1 กันวงแหวน focus ถูก overflow ตัด — เหมือน ChipRow (ข้อ 05 §5) */
            'p-1',
          ],
          hasDivider && orientation === 'horizontal' && 'border-b border-edge',
          layout === 'fill' && '[&>*]:flex-1',
          /* ★ ขนาดกำหนดจากพ่อแม่ผ่าน child selector — `Tab` จึงไม่ต้องรับ
             `size` มาซ้ำ และเป็นไปไม่ได้ที่ tab ในแถบเดียวกันจะขนาดต่างกัน */
          SIZE[size],
        )}
      >
        {tabs}
      </RACTabList>

      {panels}
    </RACTabs>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Tab — หนึ่งหัวข้อในแถบ
   ───────────────────────────────────────────────────────────────────────────── */

export interface TabProps {
  /** ค่าที่จับคู่กับ `value` ของ `TabList` */
  value: string;

  /** ข้อความบน tab — **บังคับ** (§8.1) */
  label: string;

  /** ซ่อน label ด้วยตา เหลือแต่ไอคอน — ยังเป็น accessible name */
  isLabelHidden?: boolean;

  /** ไอคอนนำ */
  icon?: ReactNode;

  /** เนื้อหาท้าย เช่น `<Badge>` จำนวน */
  endContent?: ReactNode;

  isDisabled?: boolean;

  className?: string;
}

export function Tab({
  value,
  label,
  isLabelHidden = false,
  icon,
  endContent,
  isDisabled = false,
  className,
}: TabProps) {
  return (
    <RACTab
      id={value}
      /* label เป็น string ล้วน จึงใช้เป็น accessible name ได้ตรง ๆ
         ตอน isLabelHidden — ไม่ต้องเดาจาก ReactNode */
      aria-label={isLabelHidden ? label : undefined}
      isDisabled={isDisabled}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
        'rounded-(--radius-control) px-3',
        'text-fg-secondary',
        'transition-colors duration-fast ease-standard',
        'data-hovered:bg-sunken data-hovered:text-fg',
        /* ★ ที่เลือกอยู่เปลี่ยน **ทั้งสีข้อความและเส้นใต้** ไม่พึ่งอย่างเดียว
           (SC 1.4.1) · RAC ให้ aria-selected มาแล้วด้วย */
        'data-selected:text-fg data-selected:font-medium',
        'data-selected:shadow-[inset_0_-2px_0_0_var(--color-primary-600)]',
        'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
        'data-focus-visible:outline-2',
        className,
      )}
    >
      {icon}
      {!isLabelHidden && <span className="min-w-0">{label}</span>}
      {endContent}
    </RACTab>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TabPanel — เนื้อหาของ tab · เกินจาก Astryx โดยเจตนา (D28)
   ───────────────────────────────────────────────────────────────────────────── */

export interface TabPanelProps
  extends Omit<RACTabPanelProps, 'id' | 'className' | 'style'> {
  /** ค่าที่จับคู่กับ `<Tab value>` */
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * เนื้อหาของ tab
 *
 * RAC ต่อ `aria-labelledby` กลับไปที่ `<Tab>` ให้เอง และ **ไม่ render
 * panel ที่ไม่ได้เลือก** — เนื้อหาที่ซ่อนจึงไม่อยู่ใน DOM ต่างจากการซ่อน
 * ด้วย CSS ที่ผู้ใช้ screen reader ยังอ่านเจอ
 */
export function TabPanel({ value, children, className, ...rest }: TabPanelProps) {
  return (
    <RACTabPanel
      id={value}
      className={cn('min-w-0 outline-none data-focus-visible:outline-2', className)}
      {...rest}
    >
      {children}
    </RACTabPanel>
  );
}
