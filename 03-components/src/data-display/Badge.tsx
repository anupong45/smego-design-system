import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Badge — ป้ายบอกสถานะหรือหมวด · **กดไม่ได้**
   ───────────────────────────────────────────────────────────────────────────
   ★ ถ้ากดได้ ให้ใช้ `<Chip>` ไม่ใช่ Badge
   Badge เป็นข้อมูลอ่านอย่างเดียว จึงไม่ต้องเป็นเป้า 24×24 และไม่มี focus

   ★ สถานะต้องต่างกันที่ **รูปทรง** ไม่ใช่แค่สี (SC 1.4.1)
   เพราะทอง (hue 36) กับเหลืองเตือน (hue 48) ห่างกันเพียง **1.43:1**
   ทางความสว่าง และ 12° ทาง hue ซึ่งไม่ใช่การแยกที่แข็งแรง

   `icon` จึงถูกกำหนดมาให้ตาม variant โดยอัตโนมัติ:
     success → circle-check   (วงกลม)
     warning → triangle-alert (**สามเหลี่ยม** ← ตัวแยกจริง)
     danger  → circle-x       (วงกลม + กากบาท)
     info    → info           (วงกลม + i)

   ★ ทองห้ามเป็นสถานะ (ข้อ 02 §9)
   `variant="accent"` มีไว้สำหรับป้ายแบรนด์เท่านั้น เช่น "แนะนำ" "ใหม่"
   ห้ามใช้แทน warning

   ★ Badge เป็น tint ทั้งหมด ไม่มีพื้นทึบ
   เพราะกฎ "พื้นทึบ = กดได้" ในข้อ 01 ต้องเป็นจริงทุกที่
   ═══════════════════════════════════════════════════════════════════════════ */

const badgeStyles = cva(
  [
    'inline-flex items-center gap-1',
    'text-caption',
    /* rounded-full ใช้ได้ — Badge เป็นหนึ่งใน 4 อย่างที่อนุญาต
       (chip · badge · avatar · dot) เพราะข้อความสั้นเสมอ (ข้อ 05) */
    'rounded-full',
    'border',
    'px-2 py-0.5',
    /* ยืดตามเนื้อหา — SC 1.4.12 ให้ผู้ใช้บังคับระยะตัวอักษรได้ */
    'w-auto max-w-full',
  ],
  {
    variants: {
      variant: {
        neutral: 'bg-sunken text-fg-secondary border-edge',
        info: 'bg-info-surface text-info-icon border-info-edge',
        success: 'bg-success-surface text-success-icon border-success-edge',
        /* ตัวอักษรเป็น warning-icon = yellow-800 (5.54:1)
           **ไม่ใช่ yellow-500** ที่ได้เพียง 1.66:1 */
        warning: 'bg-warning-surface text-warning-icon border-warning-edge',
        danger: 'bg-danger-surface text-danger-icon border-danger-edge',
        /* ★ ป้ายแบรนด์ ไม่ใช่สถานะ · ตัวอักษร gold-800 (6.74:1) */
        accent: 'bg-accent-surface text-accent-fg border-accent-edge',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

type BadgeVariant = NonNullable<VariantProps<typeof badgeStyles>['variant']>;

/**
 * ไอคอนที่ผูกกับ variant — ทำให้ SC 1.4.1 ผ่านโดยโครงสร้าง
 * ไม่ใช่โดยการหวังว่านักพัฒนาจะจำใส่เอง
 */
const ICON_FOR_VARIANT: Partial<Record<BadgeVariant, IconName>> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

export interface BadgeProps extends VariantProps<typeof badgeStyles> {
  children: ReactNode;

  /**
   * แสดงไอคอนตาม variant · ค่าเริ่มต้น `true` สำหรับ status variant
   *
   * ⚠️ ตั้ง `false` ได้เฉพาะเมื่อ **มีตัวชี้ที่ไม่ใช่สีอย่างอื่นอยู่แล้ว**
   * ไม่เช่นนั้นจะไม่ผ่าน SC 1.4.1
   */
  showIcon?: boolean;

  /** ไอคอนกำหนดเอง — ทับตัวที่ผูกกับ variant */
  icon?: IconName;

  className?: string;
}

export function Badge({ children, variant, showIcon = true, icon, className }: BadgeProps) {
  const resolved = icon ?? ICON_FOR_VARIANT[variant ?? 'neutral'];

  return (
    <span className={cn(badgeStyles({ variant }), className)}>
      {showIcon && resolved && <Icon name={resolved} size={16} />}
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Dot — จุดแจ้งเตือน · ต้องมีข้อความคู่เสมอ
   ───────────────────────────────────────────────────────────────────────────── */

export interface DotProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  /**
   * ข้อความสำหรับ screen reader — **บังคับ**
   *
   * จุดสีอย่างเดียวสื่อความหมายไม่ได้ทั้งกับ SC 1.4.1 และกับ screen reader
   * ที่มองไม่เห็นสีเลย
   */
  label: string;
  className?: string;
}

export function Dot({ variant = 'info', label, className }: DotProps) {
  const fill = {
    info: 'bg-info-icon',
    success: 'bg-success-icon',
    warning: 'bg-warning-icon',
    danger: 'bg-danger-icon',
  }[variant];

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span aria-hidden="true" className={cn('size-2 rounded-full', fill)} />
      <span className="text-caption text-fg-secondary">{label}</span>
    </span>
  );
}

export { badgeStyles };
