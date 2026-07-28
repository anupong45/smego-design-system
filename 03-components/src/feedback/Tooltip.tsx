import {
  TooltipTrigger as RACTooltipTrigger,
  Tooltip as RACTooltip,
  OverlayArrow,
  type TooltipProps as RACTooltipProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Tooltip
   ───────────────────────────────────────────────────────────────────────────
   ★★ SC 1.4.13 Content on Hover or Focus — ต้องครบ 3 ข้อ

     1. **Dismissable** — ปิดด้วย Esc ได้โดยไม่ต้องย้ายเมาส์หรือ focus
     2. **Hoverable** — เลื่อนเมาส์เข้าไปใน tooltip ได้โดยที่มันไม่หาย
     3. **Persistent** — อยู่จนกว่าจะ hover ออก · focus ออก · หรือกด Esc

   RAC ให้ครบทั้งสามข้อ — **แต่ข้อ 3 พังได้ง่ายที่สุด**

   ⚠️ **ห้ามใส่ `setTimeout` ให้ tooltip หายเอง** เป็นความผิดพลาดที่พบบ่อย
   ที่สุดของข้อนี้ · ผู้ใช้ที่อ่านช้า ใช้แว่นขยาย หรือใช้ screen magnifier
   จะอ่านไม่ทัน

   ★ tooltip **ไม่ใช่ที่เก็บข้อมูลจำเป็น**

   เนื้อหาใน tooltip เข้าถึงได้เฉพาะเมื่อ hover หรือ focus — ผู้ใช้ touch
   บนมือถือ **ไม่มี hover** และอาจเข้าไม่ถึงเลย

   ถ้าข้อมูลจำเป็นต่อการตัดสินใจ (เช่นเงื่อนไขคุณสมบัติของโครงการ
   หรือสัดส่วนร่วมจ่ายของแหล่งทุน) ให้แสดงเป็น **ข้อความในหน้า** หรือใช้
   `<Popover>` ที่เปิดด้วยการกด ไม่ใช่ tooltip

   ★ ห้ามใส่สิ่งที่กดได้ใน tooltip
   ผู้ใช้คีย์บอร์ดเข้าไปถึงไม่ได้ เพราะ tooltip หายเมื่อ focus ย้าย

   ★ พื้น `bg-inverse` — สลับกับสีข้อความหลัก
   โหมดสว่างได้พื้นเข้มตัวอักษรอ่อน · โหมดมืดกลับกัน · ทั้งคู่ผ่าน AAA
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TooltipProps extends Omit<RACTooltipProps, 'children' | 'className' | 'style'> {
  /**
   * ข้อความสั้น — **ห้ามใส่ลิงก์ ปุ่ม หรือข้อมูลที่จำเป็นต่อการตัดสินใจ**
   */
  children: ReactNode;
  className?: string;
}

export function Tooltip({ children, className, ...rest }: TooltipProps) {
  return (
    <RACTooltip
      /* ระยะห่างจาก trigger — 8px ให้ลูกศรมีที่พอโดยไม่ห่างจนดูไม่เกี่ยวกัน */
      offset={8}
      className={cn(
        'max-w-64',
        'rounded-(--radius-sm)',
        'bg-inverse text-canvas',
        'px-3 py-2',
        'text-caption',
        /* ★ เข้า/ออกด้วย opacity เท่านั้น — ไม่มี transform
           จึงไม่ถูก reduced-motion ตัด และไม่กระตุ้นระบบทรงตัว (ข้อ 07) */
        'data-entering:animate-[fade-in_150ms_ease-out]',
        'data-exiting:animate-[fade-out_150ms_ease-in]',
        className,
      )}
      {...rest}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          aria-hidden="true"
          className="fill-inverse group-data-[placement=bottom]:rotate-180"
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </RACTooltip>
  );
}

export { RACTooltipTrigger as TooltipTrigger };
