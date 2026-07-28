import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/* ═══════════════════════════════════════════════════════════════════════════
   cn() — รวม class อย่างปลอดภัย
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ทำไมต้อง extendTailwindMerge ไม่ใช้ twMerge เปล่า ๆ

   tailwind-merge มีตาราง class group ในตัว และ **ไม่รู้จัก utility ที่ระบบเรา
   สร้างจาก @theme** ผลคือมันเดากลุ่มผิด และเกิด bug ที่หายเงียบ:

       twMerge('text-body', 'text-fg')  →  'text-fg'      ❌ กิน font-size ทิ้ง
       twMerge('text-fg', 'text-body')  →  'text-body'    ❌ กินสีทิ้ง

   สาเหตุ: ระบบนี้มี `text-body` (ขนาด) และ `text-fg` (สี) ใช้ prefix `text-`
   ร่วมกัน twMerge จึงยัดทั้งคู่ลงกลุ่มเดียว แล้วเหลือตัวหลังตัวเดียว

   และ duration/ease ก็ไม่ merge เลย เพราะมันคาด `duration-<number>` กับ
   `ease-<linear|in|out|in-out>` ส่วนของเราเป็นชื่อ:

       twMerge('duration-fast', 'duration-medium')
         → 'duration-fast duration-medium'                ❌ เหลือทั้งคู่

   พบทั้งสองข้อจากการรันจริงบน tailwind-merge 3.6.0 ก่อนเขียน component
   ═══════════════════════════════════════════════════════════════════════════ */

/** สเกลตัวอักษรจาก 02-tokens/src/semantic.css — ต้องตรงกันเสมอ */
const FONT_SIZES = [
  'display-lg', 'display-sm',
  'heading-lg', 'heading-sm',
  'title', 'subtitle',
  'body-lg', 'body', 'body-sm',
  'caption', 'label',
  'button-lg', 'button',
  'code',
] as const;

/** สีที่ใช้กับตัวอักษรได้ — ทุกตัวที่ `text-*` อ้างถึงในฐานะ "สี" */
const TEXT_COLORS = [
  'fg', 'fg-secondary', 'fg-muted', 'fg-disabled',
  'link', 'on-brand', 'on-accent',
  'canvas', 'surface', 'raised', 'sunken', 'inverse',
  'success-icon', 'warning-icon', 'danger-icon',
  'info-icon', 'info-fg', 'accent-fg',
  'edge', 'edge-subtle', 'edge-strong', 'edge-brand', 'edge-danger',
  'focus-ring', 'focus-contrast',
  ...Array.from({ length: 11 }, (_, i) =>
    `primary-${[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][i]}`),
] as const;

const DURATIONS = ['instant', 'fast', 'medium', 'slow', 'slower'] as const;
const EASINGS = ['standard', 'entering', 'exiting', 'emphasized', 'linear'] as const;

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      /* แยก font-size ออกจาก text color อย่างชัดเจน
         ชื่อ group ต้องตรงกับ DefaultClassGroupIds ของ tailwind-merge
         (`duration` และ `ease` ไม่ใช่ `transition-duration` / `transition-timing-function`
          — ตรวจจาก node_modules/tailwind-merge/dist/types.d.ts) */
      'font-size': [{ text: [...FONT_SIZES] }],
      'text-color': [{ text: [...TEXT_COLORS] }],
      duration: [{ duration: [...DURATIONS] }],
      ease: [{ ease: [...EASINGS] }],
    },
  },
});

/**
 * รวม class โดยแก้ความขัดแย้งให้ถูกต้อง
 *
 * ใช้แทน template string ทุกที่ที่มี className จากภายนอกเข้ามา
 * เพราะลำดับใน JSX ไม่ใช่ลำดับที่ CSS ใช้ตัดสิน
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
