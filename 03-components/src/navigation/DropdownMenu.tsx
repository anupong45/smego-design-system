import {
  Menu as RACMenu,
  type MenuProps as RACMenuProps,
  MenuItem as RACMenuItem,
  type MenuItemProps as RACMenuItemProps,
  MenuSection as RACMenuSection,
  Header,
  Separator,
  Popover,
  MenuTrigger,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · DropdownMenu — เมนูคำสั่งที่เปิดจากปุ่ม
   ───────────────────────────────────────────────────────────────────────────
   ★★★ เส้นแบ่งจาก `Selector` — **สั่งทำ** กับ **เลือกค่า**

     DropdownMenu → รายการ **คำสั่ง** · กดแล้ว **มีอะไรเกิดขึ้น**
                    ไม่มีสถานะ "ที่เลือกไว้" ค้างอยู่
     Selector     → รายการ **ค่า** ของฟอร์ม · กดแล้วค่าถูกจำไว้และส่งไปกับฟอร์ม

   ใช้สลับกันแล้วผู้ใช้จะรอว่า "ค่าที่เลือกไปไหน" หรือกดคำสั่งซ้ำโดยไม่ตั้งใจ
   ⚠️ ถ้าเปิดมาแล้วต้องมีรายการติ๊กค้างไว้ นั่นคือ `Selector` หรือ
   `CheckboxGroup` ไม่ใช่เมนู

   ★★ **trigger อยู่ข้างนอก ไม่ใช่ prop** — ต่างจาก Astryx

   ของ Astryx รับ `button` เป็น prop แล้ว render ปุ่มให้เอง พร้อม
   `isMenuOpen` / `onOpenChange` บนตัวเมนู · ของเราใช้ `<DropdownMenuTrigger>`
   ครอบปุ่มกับเมนูไว้ด้วยกันตามแบบ RAC ซึ่งเป็นรูปเดียวกับที่ `Dialog` และ
   `Tooltip` ทำอยู่แล้ว — บันทึกไว้เป็น `layerDiff` ใน `ASTRYX-PARITY.md`
   ไม่ใช่ prop ที่ขาด (เรามีครบ แต่อยู่คนละชั้น)

   เหตุผลที่ไม่รับแบบเขา: ปุ่มในระบบนี้มี `Button` กับ `IconButton` ที่ต่างกัน
   จริงทั้ง API และเกณฑ์เป้ากด การยัดลงใน prop เดียวจะต้องเลือกอย่างใด
   อย่างหนึ่งแล้วอีกอันใช้ไม่ได้

   ★★ **คำสั่งอันตรายไม่ได้บอกด้วยสีเดียว** (SC 1.4.1)

   `isDestructive` ให้ทั้งสีแดง **และ** ไอคอนถังขยะโดยปริยาย — สีอย่างเดียว
   ผู้ใช้ตาบอดสีแยกไม่ออกว่าอันไหนลบถาวร

   ★ ข้อความไทยยาวกว่าอังกฤษ 20–40% จึง **ให้ตัดบรรทัดได้** ไม่ `truncate`
   ป้ายคำสั่งที่ถูกตัดจนเหลือ "ยกเลิกคำสั่งซื้อแล..." อ่านไม่ออกว่าจะเกิดอะไร
   ต่างจาก `BottomNav` ที่ตัดได้เพราะมีไอคอนกำกับและป้ายสั้นอยู่แล้ว

   ★ เป้ากด `min-h-11` = 44px ตามเกณฑ์ SC 2.5.8 · ไม่ใช่ 32px ของ Astryx (D1)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DropdownMenuProps<T extends object>
  extends Omit<
    RACMenuProps<T>,
    /* ★★★ ถอด `aria-label`/`aria-labelledby` ออกจาก API โดยเจตนา

       RAC ตั้ง **ทั้งสองอย่าง** บนตัวเมนู: `aria-label` ตามที่ส่งมา และ
       `aria-labelledby` ที่ชี้ไปปุ่มที่เปิดมัน · ตามลำดับความสำคัญของ ARIA
       **`aria-labelledby` ชนะ** ดังนั้น `aria-label` ที่ผู้เรียกส่งมาจะถูก
       ทิ้งเงียบ ๆ (วัดแล้ว: ส่ง "คำสั่งสำหรับรายการนี้" แต่ชื่อจริงที่ได้
       คือ "จัดการรายการ" ซึ่งเป็นข้อความบนปุ่ม)

       API ที่รับ prop แล้วทิ้งเงียบ ๆ แย่กว่าไม่รับ เพราะผู้เรียกเชื่อว่า
       ตั้งชื่อไปแล้ว · และค่าเริ่มต้นของ RAC **ถูกอยู่แล้ว** — เมนูควรชื่อ
       เดียวกับปุ่มที่ผู้ใช้กด ไม่ใช่ชื่อที่นักพัฒนาคิดขึ้นใหม่

       ⇒ ชื่อของเมนูมาจาก **ปุ่ม** เสมอ ดังนั้นปุ่มต้องมีชื่อที่อ่านรู้เรื่อง
         (`<IconButton label>` หรือข้อความใน `<Button>`) */
    'className' | 'style' | 'aria-label' | 'aria-labelledby'
  > {
  /**
   * ความกว้างของเมนู · ค่าเริ่มต้นกว้างตามเนื้อหา
   *
   * `trigger` = กว้างเท่าปุ่มที่เปิดมัน — ใช้เมื่อเมนูเป็นส่วนขยายของปุ่ม
   * ทางสายตา เช่นปุ่มเรียงลำดับที่แสดงค่าปัจจุบันอยู่
   */
  width?: 'auto' | 'trigger';
  className?: string;
}

export function DropdownMenu<T extends object>({
  width = 'auto',
  className,
  ...rest
}: DropdownMenuProps<T>) {
  return (
    <Popover
      /* ★ 4px — ชิดพอให้เห็นว่าเป็นของปุ่มนั้น แต่ไม่ทับขอบโฟกัสของปุ่ม */
      offset={4}
      className={cn(
        'rounded-(--radius-container) border p-1',
        'border-(--elevation-edge-overlay)',
        'bg-(--elevation-surface-overlay)',
        'shadow-(--elevation-overlay)',
        /* ★ เข้าด้วย opacity เท่านั้น ไม่มี transform — ข้อ 07
           `base.css §10` ตัด animation ใน reduced motion ให้อยู่แล้ว */
        'entering:animate-[fade-in_120ms_ease-out]',
        width === 'trigger' && 'w-(--trigger-width)',
        /* ★ เพดานความสูงแล้วเลื่อนได้ — ไม่ใช่ความสูงตายตัว
           เมนู 20 รายการบนจอ 568px สูงจะล้นออกนอกจอ */
        'max-h-80 overflow-y-auto',
      )}
    >
      <RACMenu
        className={cn('min-w-40 outline-hidden', className)}
        {...rest}
      />
    </Popover>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DropdownMenuItem
   ───────────────────────────────────────────────────────────────────────────── */

export interface DropdownMenuItemProps
  extends Omit<RACMenuItemProps, 'children' | 'className' | 'style'> {
  /** ข้อความคำสั่ง — บังคับเพื่อ accessible name (§8.1) */
  label: string;
  /** คำอธิบายใต้ข้อความ — บอกผลของคำสั่งเมื่อชื่อสั้นไม่พอ */
  description?: string;
  icon?: IconName;
  /** element ท้ายแถว เช่นคีย์ลัดหรือจำนวน */
  endContent?: ReactNode;
  /**
   * คำสั่งที่ทำลายข้อมูล เช่นลบถาวร
   *
   * ให้ทั้ง **สีแดงและไอคอนถังขยะ** โดยปริยาย (SC 1.4.1) · ถ้าส่ง `icon`
   * มาด้วยจะใช้ตัวที่ส่งมา แต่ต้องเป็นไอคอนที่สื่อการทำลายเช่นกัน
   */
  isDestructive?: boolean;
  className?: string;
}

export function DropdownMenuItem({
  label,
  description,
  icon,
  endContent,
  isDestructive,
  className,
  ...rest
}: DropdownMenuItemProps) {
  /* ★★ อันตราย = สี **บวก** ไอคอน ไม่ใช่สีเดียว (SC 1.4.1) */
  const resolvedIcon = icon ?? (isDestructive ? 'trash' : undefined);

  return (
    <RACMenuItem
      /* ★ RAC ใช้ `textValue` สำหรับ typeahead — ถ้าไม่ส่ง มันจะอ่านจาก
         children ที่เป็น element แล้วได้ค่าว่าง ทำให้พิมพ์หาไม่เจอ */
      textValue={label}
      className={cn(
        'group flex min-h-11 min-w-0 cursor-pointer items-start gap-2',
        'rounded-(--radius-sm) px-2 py-2',
        'outline-hidden',
        'transition-colors duration-fast ease-standard',
        /* โฟกัสของเมนูมาจากคีย์บอร์ดและเมาส์รวมกัน — RAC ให้ data-focused */
        isDestructive
          ? 'text-danger-icon data-focused:bg-danger-surface'
          : 'text-fg data-focused:bg-sunken',
        'data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
        className,
      )}
      {...rest}
    >
      {resolvedIcon && (
        /* ★ ไอคอนตกแต่ง — ความหมายอยู่ในข้อความแล้ว จึงไม่ส่ง label
           mt-0.5 จัดให้ตรงบรรทัดแรกเมื่อข้อความขึ้นสองบรรทัด */
        <Icon name={resolvedIcon} size={20} className="mt-0.5 shrink-0" />
      )}

      <span className="grid min-w-0 flex-1 gap-0.5">
        {/* ★ ไม่ `truncate` — ข้อความไทยยาว ป้ายคำสั่งที่ถูกตัดอ่านไม่ออก
           ว่าจะเกิดอะไรขึ้น ซึ่งอันตรายกว่าเมนูสูงขึ้นสองบรรทัด */}
        <span className="text-body-sm">{label}</span>
        {description && (
          <span
            className={cn(
              'text-caption',
              isDestructive ? 'text-danger-icon' : 'text-fg-muted',
            )}
          >
            {description}
          </span>
        )}
      </span>

      {endContent && (
        <span className="shrink-0 text-caption text-fg-muted">{endContent}</span>
      )}
    </RACMenuItem>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   หมวดและเส้นแบ่ง
   ───────────────────────────────────────────────────────────────────────────── */

export interface DropdownMenuSectionProps {
  /**
   * หัวข้อหมวด
   *
   * ★ ต้องมีเสมอ — หมวดที่ไม่มีชื่อคือเส้นแบ่ง ให้ใช้
   * `<DropdownMenuSeparator>` แทน · `RACMenuSection` ที่ไม่มี `Header`
   * ประกาศเป็นกลุ่มไม่มีชื่อ ซึ่ง screen reader อ่านว่า "group" เปล่า ๆ
   */
  title: string;
  children: ReactNode;
  className?: string;
}

export function DropdownMenuSection({
  title,
  children,
  className,
}: DropdownMenuSectionProps) {
  return (
    <RACMenuSection className={cn('py-1', className)}>
      <Header className="px-2 py-1 text-label text-fg-secondary">{title}</Header>
      {children}
    </RACMenuSection>
  );
}

/** เส้นแบ่งกลุ่มคำสั่งที่ไม่ต้องมีชื่อหมวด */
export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <Separator className={cn('my-1 h-px bg-edge', className)} />;
}

/* ★ trigger ของ RAC ส่งออกใต้ชื่อของระบบ — `isMenuOpen`/`onOpenChange` ของ
   Astryx อยู่ที่นี่ (`isOpen`/`onOpenChange`) ไม่ใช่บนตัวเมนู ดู layerDiff */
export { MenuTrigger as DropdownMenuTrigger };
