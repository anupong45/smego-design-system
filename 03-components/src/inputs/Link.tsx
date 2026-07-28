import { Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Link — สำหรับ **การนำทาง** ไม่ใช่การกระทำ
   ───────────────────────────────────────────────────────────────────────────
   ★ ต้องมีขีดใต้ ไม่ใช่ทางเลือก (SC 1.4.1)

   `--color-link` = blue-700 ได้ 6.56:1 กับพื้นขาว ซึ่งผ่าน AA สำหรับตัวอักษร
   **แต่** contrast ระหว่างลิงก์กับข้อความรอบข้าง (`neutral-900`) ต่ำกว่า 3:1
   ดังนั้นสีอย่างเดียวบอกไม่ได้ว่านี่คือลิงก์ → ต้องมีตัวชี้ที่ไม่ใช่สี

   `base.css` ใส่ขีดใต้ให้ `:where(a[href])` อยู่แล้ว — component นี้จึงไม่
   ต้องเพิ่ม และ **ห้ามลบ** ด้วย `no-underline`

   ★ ถ้าเป็นการกระทำ ให้ใช้ `<Button>` ไม่ใช่ Link ที่หน้าตาเหมือนปุ่ม
   ผู้ใช้ต้องเปิดแท็บใหม่ได้และคัดลอก URL ได้ · screen reader ประกาศต่างกัน
   ("ลิงก์" vs "ปุ่ม") · Enter ทำงานกับลิงก์ ส่วน Space ไม่ทำงาน

   ★ ลิงก์ออกนอกเว็บต้องบอกให้รู้
   `external` เพิ่มไอคอนและข้อความซ่อนสำหรับ screen reader
   ═══════════════════════════════════════════════════════════════════════════ */

const linkStyles = cva(
  [
    'inline-flex items-center gap-1',
    'min-w-0',
    /* สีจาก base.css แล้ว แต่ระบุซ้ำเพื่อให้ variant ทับได้ */
    'text-link',
    'transition-colors duration-fast ease-standard',
    'data-hovered:text-primary-800',
    'data-disabled:text-fg-disabled data-disabled:no-underline',
    'data-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      /** ขนาดตามสเกลตัวอักษร — ไม่มีค่าลอย */
      size: {
        caption: 'text-caption',
        'body-sm': 'text-body-sm',
        body: 'text-body',
        inherit: '',
      },
      /**
       * `quiet` — ใช้สีข้อความปกติ ไม่ใช่สีลิงก์
       *
       * ⚠️ ใช้ได้เฉพาะที่ **บริบทบอกอยู่แล้วว่าเป็นลิงก์** เช่นใน breadcrumb
       * หรือรายการนำทาง · ห้ามใช้กับลิงก์ที่ฝังในย่อหน้า เพราะจะไม่มีอะไร
       * บอกว่ากดได้เลย
       */
      quiet: {
        true: 'text-fg-secondary no-underline data-hovered:text-fg data-hovered:underline',
        false: '',
      },
    },
    defaultVariants: { size: 'inherit', quiet: false },
  },
);

export interface LinkProps
  extends Omit<RACLinkProps, 'children' | 'className' | 'style'>,
    VariantProps<typeof linkStyles> {
  children: ReactNode;

  /**
   * ลิงก์ออกนอกเว็บ — เพิ่มไอคอนและข้อความซ่อน "เปิดในแท็บใหม่"
   *
   * ⚠️ ถ้าตั้ง `external` ต้องตั้ง `target="_blank"` เองด้วย —
   * component ไม่ตั้งให้อัตโนมัติ เพราะการเปิดแท็บใหม่เป็นการตัดสินใจ
   * ระดับผลิตภัณฑ์ ไม่ใช่ผลข้างเคียงของการมีไอคอน
   */
  external?: boolean;

  className?: string;
}

export function Link({ children, external, size, quiet, className, ...rest }: LinkProps) {
  const s = useStrings();

  return (
    <RACLink className={cn(linkStyles({ size, quiet }), className)} {...rest}>
      {children}
      {external && (
        <>
          <Icon name="external-link" size={16} />
          {/* ข้อความซ่อน — ผู้ใช้ screen reader ต้องรู้ว่าจะเปิดแท็บใหม่
             ก่อนกด ไม่ใช่หลังกด */}
          <span className="sr-only">{` (${s.common.opensInNewTab})`}</span>
        </>
      )}
    </RACLink>
  );
}

export { linkStyles };
