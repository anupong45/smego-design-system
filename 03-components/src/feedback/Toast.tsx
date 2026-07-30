'use client';

import {
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  UNSTABLE_ToastQueue as RACToastQueue,
  UNSTABLE_ToastRegion as RACToastRegion,
  Text,
} from 'react-aria-components';
import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';
import { IconButton } from '../inputs/IconButton';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Toast — การยืนยันที่หายไปเองได้
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **Toast หายเอง · Banner ไม่หาย** — นี่คือเส้นแบ่งทั้งหมด (`Banner.md`)

   ผลที่ตามมาซึ่งบังคับด้วย **type ไม่ใช่เอกสาร**: `tone` มีแค่
   `success` กับ `info` — **ไม่มี `danger` และไม่มี `warning`**

   ข้อความที่บอกว่าผู้ใช้ต้องทำอะไรต่อ ห้ามหายก่อนที่ผู้ใช้จะอ่านจบ
   ถ้าอยากได้ toast สีแดง แปลว่าสิ่งนั้นคือ `<Banner tone="danger" isLive>`

   ★★★ **เนื้อหาต้องซ้ำกับสิ่งที่เห็นบนหน้าอยู่แล้ว**

   toast เป็น *การยืนยัน* ไม่ใช่ *ช่องทางข้อมูล* — ผู้ใช้ที่พลาดมันไป
   ต้องไม่เสียอะไรเลย · "เพิ่มเครื่องคั่วกาแฟลงตะกร้าแล้ว" ใช้ได้เพราะ
   ตัวเลขบนไอคอนตะกร้าเปลี่ยนไปแล้วด้วย

   ★★ **หยุดนับเมื่อชี้เมาส์หรือ focus เข้ามา** — SC 2.2.1

   `ToastQueue` ของ React Aria หยุดเวลาถอยหลังเมื่อ region ถูก hover
   หรือ focus และเดินต่อเมื่อออก · ทุก toast **ปิดเองได้ด้วยปุ่ม** เสมอ
   ไม่มีทางเลือกให้ปิดปุ่มนั้นทิ้ง

   เวลาขั้นต่ำคือ **6 วินาที** ซึ่งเป็น**นโยบายของเราล้วน ๆ**
   ⚠️ วัดแล้ว: `timeout: 1000` ผ่านฉลุย · `console.warn` ถูกเรียก **0 ครั้ง**
   RAC ไม่มีขั้นต่ำและไม่เตือนอะไรเลย · `showToast` จึงยกค่าขึ้นให้เอง
   เหตุผลของ 6 วินาที: ข้อความไทยยาวกว่าอังกฤษ 20–40%

   ★★ region อยู่ที่ `z-(--z-toast)` = 60 ซึ่ง **เหนือ modal โดยตั้งใจ**
   toast ที่เกิดตอน modal เปิดต้องมองเห็น · `ToastRegion` เป็น landmark
   ที่เข้าถึงด้วย F6 ได้ จึงไม่ถูก focus trap ของ modal กัก (ดู semantic.css)

   ⚠️ region **ไม่จองพื้นที่ท้ายเอกสาร** ต่างจาก `CompareBar` — ของชั่วคราว
   ที่ลอยทับ ถ้าจองจะทำให้หน้าขยับทุกครั้งที่มี toast
   ═══════════════════════════════════════════════════════════════════════════ */

/** ★ ไม่มี `danger` และ `warning` โดยตั้งใจ — นั่นคือ `<Banner>` */
export type ToastTone = 'success' | 'info';

export interface ToastContent {
  /**
   * ข้อความ — **บังคับ** และต้องบอกสิ่งที่เกิดขึ้นกับ *อะไร*
   *
   * ❌ "สำเร็จ" · ✅ "เพิ่มเครื่องคั่วกาแฟ TR-500 ลงตะกร้าแล้ว"
   */
  title: string;
  tone?: ToastTone;
}

/** เวลาขั้นต่ำที่ระบบยอมรับ — ดูเหตุผลด้านบน */
const MIN_TIMEOUT_MS = 6_000;

/**
 * คิวเดียวของทั้งแอป
 *
 * ★ `maxVisibleToasts: 3` — เกินสามใบพร้อมกันแปลว่ามีอะไรผิดที่ต้นทาง
 * ไม่ใช่ปัญหาของการแสดงผล
 */
export const toastQueue = new RACToastQueue<ToastContent>({
  maxVisibleToasts: 3,
});

/**
 * แสดงการยืนยันชั่วคราว
 *
 * ⚠️ **ห้ามใช้กับ error** — ใช้ `<Banner tone="danger" isLive>` แทน
 *
 * ```tsx
 * showToast({ title: s.buy.addedToCart(product.name) });
 * ```
 */
export function showToast(content: ToastContent, timeoutMs = MIN_TIMEOUT_MS) {
  return toastQueue.add(content, {
    timeout: Math.max(timeoutMs, MIN_TIMEOUT_MS),
  });
}

const TONE_ICON: Record<ToastTone, IconName> = {
  success: 'circle-check',
  info: 'info',
};

const TONE_ICON_COLOR: Record<ToastTone, string> = {
  success: 'text-success-icon',
  info: 'text-info-icon',
};

export interface ToastRegionProps {
  className?: string;
}

/**
 * วางไว้ **ครั้งเดียวที่ราก** ของแอป — คู่กับ `<SmeGoProvider>`
 *
 * ★ ตำแหน่ง: ก้นจอบนมือถือ · มุมล่างขวาที่ md ขึ้นไป
 * ก้นจอคือระยะนิ้วโป้ง และไม่ทับแถบค้นหาด้านบน (ข้อ 08 §7)
 */
export function ToastRegion({ className }: ToastRegionProps) {
  const s = useStrings();

  return (
    <RACToastRegion
      queue={toastQueue}
      /* ★★ **ไม่ตั้ง `aria-label` เอง** — RAC ตั้งให้พร้อม**จำนวนใบที่ค้างอยู่**
         วัดแล้ว: "มีการแจ้งเตือน 2 รายการ" ซึ่งบอกผู้ใช้ screen reader ว่า
         มีอะไรรออยู่กี่อัน · การเขียนทับด้วยข้อความคงที่ทำให้ข้อมูลนั้นหายไป

         ⚠️ ข้อความนี้เป็นไทยก็ต่อเมื่อแอปเรียก `installRacThaiStrings()`
         ที่ระดับ module — ถ้าไม่เรียกจะได้ "2 notifications." (วัดแล้ว)
         ซึ่งเป็นเงื่อนไขเดียวกับปุ่มล้างค่าของ `SearchField` ทั้งระบบ */
      className={cn(
        'fixed inset-x-4 bottom-4 z-(--z-toast) flex flex-col gap-2',
        'md:inset-x-auto md:end-6 md:bottom-6 md:w-(--container-form) md:max-w-[calc(100vw-3rem)]',
        className,
      )}
    >
      {({ toast }) => {
        const tone = toast.content.tone ?? 'success';

        return (
          <RACToast
            toast={toast}
            className={cn(
              'flex min-w-0 items-start gap-3',
              'rounded-(--radius-container) border p-3 md:p-4',
              'bg-(--elevation-surface-overlay)',
              'border-(--elevation-edge-overlay)',
              'shadow-(--elevation-overlay)',
              /* ⚠️ **ไม่มี animation เข้า/ออก** — เคยเขียน
                 `data-entering:` / `data-exiting:` ไว้ตรงนี้ แต่**วัดแล้ว
                 RAC 1.19 ไม่ปล่อย data attribute สองตัวนั้นเลย**
                 (`Toast.mjs` มีแค่ data-hovered · data-focused ·
                  data-focus-visible · และ DOM จริงมีแค่
                  class · data-rac · role · aria-modal · aria-labelledby · tabindex)
                 คลาสสองบรรทัดนั้นจึงเป็นโค้ดตายที่ทำให้เอกสารโกหก
                 ถ้าจะเพิ่ม animation ต้องทำเองด้วย state ไม่ใช่ผ่าน RAC */
              'data-focus-visible:outline-2',
              'data-focus-visible:outline-(--color-focus-ring)',
              'data-focus-visible:outline-offset-2',
            )}
          >
            {/* ★ รูปทรงต่างกันจริง ไม่ใช่แค่สี (SC 1.4.1) */}
            <Icon
              name={TONE_ICON[tone]}
              size={20}
              className={cn('mt-0.5 shrink-0', TONE_ICON_COLOR[tone])}
            />

            <RACToastContent className="min-w-0 flex-1">
              {/* ข้อความเป็น `text-fg` ทุก tone — สีสถานะอยู่ที่ไอคอน
                 เหตุผลเดียวกับ Banner (ดู `Banner.tsx` หัวไฟล์) */}
              <Text slot="title" className="block min-w-0 text-body-sm text-fg">
                {toast.content.title}
              </Text>
            </RACToastContent>

            {/* ★ ปิดได้เสมอ — ไม่ใช่ prop ที่ปิดทิ้งได้ (SC 2.2.1)
               ชื่อปุ่มรวมข้อความ เพราะมี toast ได้ถึง 3 ใบพร้อมกัน (SC 2.5.3) */}
            <IconButton
              slot="close"
              name="x"
              label={`${s.common.close}: ${toast.content.title}`}
              variant="ghost"
              size="md"
              className="-me-2 -mt-2 shrink-0"
            />
          </RACToast>
        );
      }}
    </RACToastRegion>
  );
}
