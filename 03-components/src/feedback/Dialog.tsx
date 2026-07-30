'use client';

import {
  DialogTrigger as RACDialogTrigger,
  Modal as RACModal,
  ModalOverlay as RACModalOverlay,
  Dialog as RACDialog,
  Heading,
  type ModalOverlayProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { IconButton } from '../inputs/IconButton';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Dialog / Modal / Drawer
   ───────────────────────────────────────────────────────────────────────────
   ★★ โหมดมืด — **backdrop ช่วยไม่ได้เลย** (ข้อ 06 §3.5)

   โหมดสว่าง backdrop ทำให้พื้นหลังมืดลง แล้ว modal สีขาวเด่นขึ้นเป็น ~11:1
   โหมดมืดพื้นหลังมืดอยู่แล้ว การใส่ backdrop **แทบไม่เปลี่ยนอะไร** —
   modal vs พื้นหลังเหลือประมาณ **1.7:1**

   ทางแก้: `--elevation-edge-modal` เป็น `neutral-500` ในโหมดมืด
   ซึ่งได้ 3.84:1 บน surface และ 4.38:1 บน canvas — **ขอบรับน้ำหนักการแยก
   ไม่ใช่ backdrop** และ backdrop ยังมีไว้บอกว่า "พื้นหลังกดไม่ได้" เท่านั้น

   ★ focus ต้องย้ายเข้า modal **ทันทีที่ mount** ไม่ใช่หลัง animation จบ
   (ข้อ 07 §7.3) — RAC จัดการให้ และคืน focus กลับที่ตัวเปิดเมื่อปิดด้วย

   ★ Esc ต้องออกได้เสมอ (SC 2.1.2) แม้ modal จะกัก focus ไว้
   RAC ให้พฤติกรรมนี้มาเอง · เป็น 1 ใน 4 เคสที่ Playwright ต้องตรวจ

   ★ ปุ่มปิดต้องมี `aria-label` ภาษาไทย
   `IconButton` บังคับ `label` เป็น prop จำเป็น จึงลืมไม่ได้

   ★ bottom sheet บนมือถือ — มุมบนโค้ง มุมล่างเป็น 0 เพราะชนขอบจอ (ข้อ 05 §7)
   และการลากปิดต้อง**มีปุ่มปิดคู่เสมอ** (SC 2.5.7)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DialogProps {
  /** หัวข้อ — เชื่อมกับ dialog ด้วย `aria-labelledby` โดย RAC */
  title: string;
  children: ReactNode;
  /** แถวปุ่มด้านล่าง */
  footer?: ReactNode;
  /**
   * `modal` — กล่องกลางจอ (ค่าเริ่มต้น)
   * `sheet` — เลื่อนขึ้นจากด้านล่าง ใช้บนมือถือ
   * `drawer` — เลื่อนเข้าจากด้านข้าง ใช้กับตัวกรอง
   */
  variant?: 'modal' | 'sheet' | 'drawer';
  size?: 'sm' | 'md' | 'lg';
  /** ซ่อนปุ่มปิด — ใช้เฉพาะ dialog ที่บังคับให้เลือก */
  hideClose?: boolean;
  className?: string;
}

const sizeClass = {
  sm: 'max-w-(--container-form)',
  md: 'max-w-(--container-narrow)',
  lg: 'max-w-(--container-content)',
} as const;

export function Dialog({
  title,
  children,
  footer,
  variant = 'modal',
  size = 'md',
  hideClose,
  className,
}: DialogProps) {
  const s = useStrings();

  return (
    <RACDialog
      className={cn(
        'grid min-w-0 gap-4 outline-none',
        /* ⚠️ ไม่มี overflow-hidden — วงแหวน focus ของ element ข้างในจะถูกตัด
           (ข้อ 05 §5) ถ้าเนื้อหายาวให้ scroll ที่ส่วน body ไม่ใช่ทั้ง dialog */
        variant === 'sheet' ? 'p-4 pb-8' : 'p-6',
        className,
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-start justify-between gap-4">
            {/* RAC เชื่อม Heading เข้ากับ dialog ด้วย aria-labelledby ให้เอง */}
            <Heading slot="title" className="text-title text-fg">
              {title}
            </Heading>
            {!hideClose && (
              <IconButton
                name="x"
                label={s.common.close}
                variant="ghost"
                size="sm"
                onPress={close}
                className="-me-1 -mt-1"
              />
            )}
          </div>

          {/* เนื้อหาเลื่อนในกล่องตัวเอง — body ไม่เลื่อน
             p-1 -m-1 เผื่อที่ให้วงแหวน focus 4px ไม่ถูก overflow ตัด */}
          <div className="-m-1 max-h-[60vh] min-w-0 overflow-y-auto p-1">{children}</div>

          {footer && (
            /* ปุ่มซ้อนแนวตั้งบนมือถือ ปุ่มหลักอยู่บน (ข้อ 08 §7) */
            <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
              {footer}
            </div>
          )}
        </>
      )}
    </RACDialog>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DialogOverlay — backdrop + ตำแหน่ง
   ───────────────────────────────────────────────────────────────────────────── */

export interface DialogOverlayProps extends Omit<ModalOverlayProps, 'className' | 'children'> {
  children: ReactNode;
  variant?: 'modal' | 'sheet' | 'drawer';
  size?: 'sm' | 'md' | 'lg';
  /**
   * ด้านที่ drawer เลื่อนเข้ามา · ค่าเริ่มต้น `start`
   *
   * ★ ตะกร้าใช้ `end` เพราะปุ่มเปิดอยู่มุมขวาบนของ `TopNav` —
   * แผงที่โผล่คนละฝั่งกับปุ่มที่กดทำให้ผู้ใช้ต้องกวาดตาหาว่าอะไรเปลี่ยน
   *
   * ตัวกรองใช้ `start` เพราะบนจอกว้างมันคือแถบข้างซ้ายอยู่แล้ว
   */
  side?: 'start' | 'end';
}

/** drawer ที่ไม่ระบุ `size` = แถบข้าง 280px เท่าเดิม (ตัวกรอง) */
const drawerSizeClass = {
  sm: 'max-w-(--sidebar-width)',
  md: 'max-w-(--container-form)',
  lg: 'max-w-(--container-narrow)',
} as const;

export function DialogOverlay({
  children,
  variant = 'modal',
  size,
  side = 'start',
  ...rest
}: DialogOverlayProps) {
  return (
    <RACModalOverlay
      className={cn(
        'fixed inset-0 z-(--z-modal) flex',
        'bg-backdrop',
        /* ★ backdrop fade ด้วย opacity เท่านั้น — ไม่มี transform ไม่มี blur
           `backdrop-filter` แพงเกินไปสำหรับ Android ระดับล่าง (ข้อ 07 §5.1) */
        'data-entering:animate-[fade-in_150ms_ease-out]',
        variant === 'modal' && 'items-center justify-center p-4',
        variant === 'sheet' && 'items-end justify-center',
        variant === 'drawer' && 'items-stretch',
        variant === 'drawer' && (side === 'end' ? 'justify-end' : 'justify-start'),
      )}
      {...rest}
    >
      <RACModal
        className={cn(
          'w-full min-w-0',
          'bg-(--elevation-surface-modal)',
          /* ★ ขอบคือตัวแยกจริงในโหมดมืด ไม่ใช่ backdrop */
          'border border-(--elevation-edge-modal)',
          'shadow-(--elevation-modal)',
          variant === 'modal' && ['rounded-(--radius-overlay)', sizeClass[size ?? 'md']],
          /* มุมบนโค้ง มุมล่าง 0 เพราะชนขอบจอ (ข้อ 05 §7) */
          variant === 'sheet' && [
            'rounded-ss-(--radius-overlay) rounded-se-(--radius-overlay)',
            'border-b-0',
            'max-h-[90vh]',
          ],
          variant === 'drawer' && [
            'h-full',
            size ? drawerSizeClass[size] : 'max-w-(--sidebar-width)',
            /* มุมโค้งเฉพาะด้านที่หันเข้าหาเนื้อหา — อีกด้านชนขอบจอ (ข้อ 05 §7) */
            side === 'end'
              ? 'rounded-ss-(--radius-overlay) rounded-es-(--radius-overlay) border-e-0'
              : 'rounded-se-(--radius-overlay) rounded-ee-(--radius-overlay) border-s-0',
          ],
        )}
      >
        {children}
      </RACModal>
    </RACModalOverlay>
  );
}

export { RACDialogTrigger as DialogTrigger };
