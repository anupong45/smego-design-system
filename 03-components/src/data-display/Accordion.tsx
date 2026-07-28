import {
  Disclosure as RACDisclosure,
  DisclosurePanel as RACDisclosurePanel,
  DisclosureGroup as RACDisclosureGroup,
  type DisclosureProps as RACDisclosureProps,
  type DisclosureGroupProps as RACDisclosureGroupProps,
  Button as RACButton,
  Heading,
} from 'react-aria-components';
import { useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Accordion
   ───────────────────────────────────────────────────────────────────────────
   ★★ ความขัดแย้งที่ต้องแก้: `overflow-hidden` vs วงแหวน focus

   การขยาย accordion ต้องเปลี่ยนความสูง ซึ่งทำด้วย `transform` อย่างเดียว
   ไม่ได้ · วิธีที่ใช้คือ `grid-template-rows: 0fr → 1fr` ซึ่งถูกกว่า
   `height: auto` และ animate ได้จริง

   **แต่** เทคนิคนี้ต้องมี `overflow: hidden` ที่ลูก ซึ่งจะ**ตัดวงแหวน focus
   ของ element ข้างใน panel** = ไม่ผ่าน SC 2.4.7 (ข้อ 07 §5.2)

   ทางแก้: คืน `overflow: visible` เมื่อ animation จบด้วย `transitionend`
   — component นี้ทำให้แล้วผ่าน ref และ event listener

   ⚠️ **ห้ามใช้ `max-height` แบบเดาค่า** เพราะต้องตั้งค่าที่มากเกินจริง
   ทำให้ความเร็ว animation ไม่คงที่ตามความยาวเนื้อหา — เนื้อหาสั้นจะดูช้า
   เนื้อหายาวจะดูกระตุก

   ★ หัวข้อต้องอยู่ใน `<Heading>` ที่ระดับถูกต้อง
   ไม่ใช่ `<div>` — โครงสร้างหัวข้อคือวิธีที่ผู้ใช้ screen reader ใช้
   สำรวจหน้า (SC 1.3.1) · RAC ให้ `aria-expanded` และ `aria-controls` มาเอง

   ★ ไอคอนหมุนได้ แต่เป็น `transform` จึงถูกตัดใน reduced motion
   ซึ่งถูกต้อง — สถานะยัง**อ่านได้จาก `aria-expanded`** และจากตัว panel
   ที่ปรากฏ/หายไป ไม่ได้พึ่งการหมุนเป็นตัวบอกสถานะเพียงอย่างเดียว
   ═══════════════════════════════════════════════════════════════════════════ */

export interface AccordionItemProps
  extends Omit<RACDisclosureProps, 'children' | 'className' | 'style'> {
  /** หัวข้อ */
  title: ReactNode;
  children: ReactNode;
  /** ระดับหัวข้อใน document outline · ค่าเริ่มต้น 3 */
  headingLevel?: 2 | 3 | 4 | 5;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  headingLevel = 3,
  className,
  ...rest
}: AccordionItemProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * คืน `overflow: visible` เมื่อ animation จบ
   *
   * ระหว่าง animate ต้อง hidden เพื่อให้ `0fr → 1fr` ตัดเนื้อหาได้
   * แต่พอจบแล้วต้องเปิด ไม่เช่นนั้นวงแหวน focus ของลิงก์หรือปุ่มใน panel
   * จะถูกตัด 4px = ไม่ผ่าน SC 2.4.7
   */
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'grid-template-rows') return;
    const el = panelRef.current;
    if (!el) return;
    const isOpen = el.closest('[data-expanded]') !== null;
    el.style.overflow = isOpen ? 'visible' : 'hidden';
  };

  return (
    <RACDisclosure
      className={cn(
        'group min-w-0 border-b border-edge-subtle last:border-b-0',
        className,
      )}
      {...rest}
    >
      <Heading level={headingLevel}>
        <RACButton
          slot="trigger"
          className={cn(
            'flex w-full min-w-0 items-center justify-between gap-3',
            /* เป้ากดคือทั้งแถว — สูงเกิน 24×24 มาก */
            'py-4 text-start',
            'text-body-sm text-fg',
            'transition-colors duration-fast ease-standard',
            'data-hovered:text-link',
            'data-disabled:text-fg-disabled data-disabled:cursor-not-allowed',
          )}
        >
          <span className="min-w-0">{title}</span>
          {/* transform ถูกตัดใน reduced motion — ไม่เป็นไรเพราะสถานะอ่านได้
             จาก aria-expanded และจากตัว panel เอง ไม่ได้พึ่งการหมุน */}
          <Icon
            name="chevron-down"
            size={20}
            className={cn(
              'shrink-0 text-fg-muted',
              'transition-transform duration-fast ease-standard',
              'group-data-[expanded]:rotate-180',
              'motion-reduce:transition-none',
            )}
          />
        </RACButton>
      </Heading>

      <RACDisclosurePanel
        className={cn(
          'grid',
          'transition-[grid-template-rows] duration-medium ease-standard',
          'grid-rows-[0fr] group-data-[expanded]:grid-rows-[1fr]',
          'motion-reduce:transition-none',
        )}
      >
        <div
          ref={panelRef}
          onTransitionEnd={handleTransitionEnd}
          /* hidden ระหว่าง animate · เปลี่ยนเป็น visible เมื่อจบ */
          style={{ overflow: 'hidden' }}
          className="min-w-0"
        >
          <div className="pb-4 text-body-sm text-fg-secondary">{children}</div>
        </div>
      </RACDisclosurePanel>
    </RACDisclosure>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Accordion — กลุ่มของ AccordionItem
   ───────────────────────────────────────────────────────────────────────────── */

export interface AccordionProps
  extends Omit<RACDisclosureGroupProps, 'children' | 'className' | 'style'> {
  children: ReactNode;
  className?: string;
}

/**
 * กลุ่ม accordion
 *
 * `allowsMultipleExpanded` เปิดไว้เป็นค่าเริ่มต้นของ RAC หรือไม่ก็ตาม
 * **ควรเปิดสำหรับตัวกรอง** — ผู้ใช้ที่กรองหลายเงื่อนไขต้องเห็นทุกกลุ่ม
 * ที่เปิดไว้พร้อมกัน ไม่ใช่ให้กลุ่มก่อนหน้าปิดเอง ซึ่งขัดหลัก
 * recognition over recall ในข้อ 01 §4.3
 */
export function Accordion({ children, className, ...rest }: AccordionProps) {
  return (
    <RACDisclosureGroup className={cn('min-w-0', className)} {...rest}>
      {children}
    </RACDisclosureGroup>
  );
}
