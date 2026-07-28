import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Skeleton
   ───────────────────────────────────────────────────────────────────────────
   ★ ต้อง **ปรากฏทันที ไม่ fade เข้า** (ข้อ 07 §7.3)
   การ fade เข้าของ skeleton = การหน่วงสัญญาณว่ากำลังโหลด ซึ่งกลับหัวกลับหาง
   กับหน้าที่ของมัน

   ★ radius ต้องตรงกับ element จริง
   ไม่เช่นนั้นจะเห็นมุมกระตุกตอน content โหลดเสร็จ

   ★ reduced motion: **เปลี่ยนเป็นพื้นนิ่ง ไม่ใช่ชะลอ**
   `base.css` มีกฎ `.skeleton { animation: none; background-image: none;
   background-color: var(--color-sunken) }` อยู่แล้ว — การเคลื่อนไหวแบบ
   แถบไล่สีที่เลื่อนเป็นการตกแต่ง ไม่ได้สื่อข้อมูลที่หาจากที่อื่นไม่ได้
   จึงอยู่ในรายการ DENY ไม่ใช่ ALLOW (ต่างจาก spinner และ progress bar)

   ★ `aria-hidden` + ข้อความใน live region
   skeleton เป็นภาพแทนที่ไม่มีความหมายกับ screen reader
   สิ่งที่ผู้ใช้ที่มองไม่เห็นต้องได้ยินคือ **"กำลังโหลด"** ครั้งเดียว
   ไม่ใช่กล่องเปล่า 20 กล่อง
   ═══════════════════════════════════════════════════════════════════════════ */

const skeletonStyles = cva(
  [
    /* .skeleton ให้ base.css จับได้สำหรับกฎ reduced-motion */
    'skeleton',
    'block',
    'bg-sunken',
    /* แถบไล่สีที่เลื่อน — ถูกปิดทั้งหมดใน reduced motion */
    'motion-safe:animate-pulse',
  ],
  {
    variants: {
      /** ต้องตรงกับ radius ของ element จริงที่จะมาแทน */
      shape: {
        text: 'rounded-(--radius-control)',
        card: 'rounded-(--radius-container)',
        circle: 'rounded-full',
        media: 'rounded-(--radius-container)',
      },
      /** ความสูงอิงจาก line-height ของสเกลตัวอักษร ไม่ใช่ค่าลอย ๆ */
      lines: {
        /** = text-caption / label line-height 20px */
        caption: 'h-5',
        /** = text-body-sm line-height 24px */
        'body-sm': 'h-6',
        /** = text-body line-height 28px */
        body: 'h-7',
        /** = text-title line-height 32px */
        title: 'h-8',
        none: '',
      },
    },
    defaultVariants: { shape: 'text', lines: 'body' },
  },
);

export interface SkeletonProps extends VariantProps<typeof skeletonStyles> {
  /** ความกว้าง — ใช้ % เพื่อให้ดูเป็นข้อความจริงที่ยาวไม่เท่ากัน */
  width?: string;
  className?: string;
}

export function Skeleton({ width, className, ...variants }: SkeletonProps) {
  return (
    <span
      /* ไม่มีความหมายกับ screen reader — ข้อความอยู่ที่ SkeletonGroup */
      aria-hidden="true"
      style={width ? { width } : undefined}
      className={cn(skeletonStyles(variants), !width && 'w-full', className)}
    />
  );
}

export interface SkeletonGroupProps {
  children: React.ReactNode;
  /** ยังโหลดอยู่หรือไม่ — ควบคุม `aria-busy` และการประกาศ */
  isLoading: boolean;
  /** ข้อความที่ screen reader จะได้ยิน · ค่าเริ่มต้น "กำลังโหลด" */
  label?: string;
  className?: string;
}

/**
 * ห่อกลุ่ม skeleton เพื่อประกาศสถานะโหลด **ครั้งเดียว**
 *
 * ถ้าไม่ห่อ ผู้ใช้ screen reader จะเจอกล่องเปล่าจำนวนมากโดยไม่รู้ว่าเกิดอะไร
 * หรือแย่กว่านั้นคือไม่ได้ยินอะไรเลย
 *
 * `aria-live="polite"` ไม่ใช่ `assertive` เพราะการโหลดไม่ใช่เรื่องด่วน
 * และ `assertive` จะขัดสิ่งที่ผู้ใช้กำลังฟังอยู่
 */
export function SkeletonGroup({ children, isLoading, label, className }: SkeletonGroupProps) {
  const s = useStrings();

  return (
    <div aria-busy={isLoading} className={cn('min-w-0', className)}>
      <span className="sr-only" aria-live="polite">
        {isLoading ? (label ?? s.common.loading) : ''}
      </span>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SkeletonText — หลายบรรทัดที่ยาวไม่เท่ากัน
   ───────────────────────────────────────────────────────────────────────────── */

export interface SkeletonTextProps {
  /** จำนวนบรรทัด */
  lines?: number;
  /** ขนาดตัวอักษรที่จะมาแทน */
  size?: NonNullable<VariantProps<typeof skeletonStyles>['lines']>;
  className?: string;
}

export function SkeletonText({ lines = 3, size = 'body', className }: SkeletonTextProps) {
  /* บรรทัดสุดท้ายสั้นกว่า เพราะข้อความจริงมักไม่เต็มบรรทัด
     ทำให้ skeleton ดูเป็นข้อความ ไม่ใช่แถบสีเรียงกัน */
  return (
    <span className={cn('grid gap-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          shape="text"
          lines={size}
          width={i === lines - 1 ? '62%' : undefined}
        />
      ))}
    </span>
  );
}

export { skeletonStyles };
