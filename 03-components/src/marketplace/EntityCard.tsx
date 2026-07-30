'use client';

import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Card, CardMedia } from '../data-display/Card';
import { Link } from '../inputs/Link';
import { useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · EntityCard — โครงร่วมของ card ทั้ง 5 ชนิด
   ───────────────────────────────────────────────────────────────────────────
   ProductCard · ServiceCard · ProgramCard · GrantCard · TrainingCard
   แชร์โครงกัน ~80% — media / heading / meta / จำนวนเงิน / trust badge / CTA

   ถ้าเขียนแยก 5 ตัวจะ **drift ทันทีที่แก้ครั้งแรก** — คนแก้ ProductCard
   จะไม่รู้ว่าต้องไปแก้อีก 4 ที่

   ★★ `amount` เป็น **slot ไม่ใช่ prop `price`**

   จำนวนเงินใน 5 บริบทนี้ **ต่างความหมายกันจริง**:
     ProductCard   ราคา            — จ่ายเท่านี้
     ServiceCard   ค่าบริการ        — อาจเป็นต่อโครงการ ต่อชั่วโมง หรือขอใบเสนอราคา
     ProgramCard   ไม่มีจำนวนเงิน   — มีแต่กำหนดปิดรับ
     GrantCard     วงเงินสูงสุด     — **เพดานที่ขอได้ ไม่ใช่ที่ได้รับ**
     TrainingCard  ค่าลงทะเบียน     — หรือ "ไม่มีค่าใช้จ่าย"

   ถ้ารับเป็น `price: number` ทั้งหมดจะถูกบีบให้แสดงเหมือนกัน แล้วผู้ใช้
   จะอ่าน "500,000 บาท" บน GrantCard ว่าเป็นเงินที่จะได้รับ ซึ่งผิด
   และเป็นความเข้าใจผิดที่มีผลทางการเงินจริง

   ★★ วงแหวน focus อยู่ที่ **การ์ด** ไม่ใช่ที่ลิงก์

   ชื่อสินค้าใช้ `line-clamp-2` ซึ่งต้องมี `overflow: hidden`
   ถ้าวงแหวนวาดรอบตัวลิงก์ (ซึ่งเป็น inline อยู่ใน element ที่ clamp)
   จะถูกตัด = **ไม่ผ่าน SC 2.4.7**

   ทางแก้: ปิดวงแหวนที่ลิงก์ แล้วให้การ์ดวาดแทนผ่าน `has-[…]`
   ซึ่งได้ผลดีกว่าด้วย — ผู้ใช้เห็นว่า **ทั้งใบ** คือเป้า ไม่ใช่แค่บรรทัดชื่อ

   ★ link overlay ไม่ใช่ `onClick` บนการ์ด
   ผู้ใช้ต้อง **เปิดแท็บใหม่ได้ · คัดลอก URL ได้ · screen reader ประกาศเป็นลิงก์**
   ซึ่ง `onClick` ให้ไม่ได้เลย · ปุ่มอื่นในการ์ดต้องมี `relative z-(--z-raised)`

   ★ เกณฑ์ผ่าน/ไม่ผ่าน: **ใช้งานได้ที่ 136px** (2 ใบที่ viewport 320px · ข้อ 08)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface EntityCardProps {
  /** ปลายทางของลิงก์ — การ์ดทั้งใบกดได้ผ่าน overlay */
  href: string;

  /** ชื่อรายการ */
  title: string;

  /** ระดับหัวข้อใน document outline · ค่าเริ่มต้น 3 */
  headingLevel?: 2 | 3 | 4 | 5;

  /** รูปภาพ — ห่อด้วย `<CardMedia>` ให้แล้ว ส่ง `<img>` เข้ามาได้เลย */
  media?: ReactNode;

  /** แถว badge เหนือชื่อ — สถานะ หมวด ใบรับรอง */
  eyebrow?: ReactNode;

  /** บรรทัดข้อมูลใต้ชื่อ — ใช้ `<EntityMeta>` */
  meta?: ReactNode;

  /**
   * จำนวนเงิน — **slot ไม่ใช่ prop `price`** ดูเหตุผลด้านบน
   * ใช้ `<EntityAmount>` เพื่อให้ label ถูกต้องตามบริบท
   */
  amount?: ReactNode;

  /** ปุ่มท้ายการ์ด — CTA */
  footer?: ReactNode;

  /**
   * ปุ่มลอยมุมขวาบน — บันทึก / เปรียบเทียบ
   *
   * ⚠️ ได้ `relative z-(--z-raised)` อัตโนมัติเพื่อไม่ให้ link overlay กลืน
   */
  actions?: ReactNode;

  /** เลือกอยู่ในการเปรียบเทียบ */
  isSelected?: boolean;

  /** ใช้ `'li'` เมื่ออยู่ในกริดที่เป็น `<ul>` */
  as?: ElementType;

  className?: string;
}

export function EntityCard({
  href,
  title,
  headingLevel = 3,
  media,
  eyebrow,
  meta,
  amount,
  footer,
  actions,
  isSelected,
  as = 'article',
  className,
}: EntityCardProps) {
  const Heading = `h${headingLevel}` as ElementType;

  return (
    <Card
      as={as}
      interactive
      selected={isSelected}
      padding="none"
      className={cn(
        'relative flex flex-col',
        /* ★ วงแหวนอยู่ที่การ์ด เพราะชื่อถูก line-clamp (overflow hidden)
           ค่าตรงกับ base.css เป๊ะ — 2px + offset 2px + halo 2px */
        'has-[a[data-focus-visible]]:outline-2',
        'has-[a[data-focus-visible]]:outline-(--color-focus-ring)',
        'has-[a[data-focus-visible]]:outline-offset-2',
        'has-[a[data-focus-visible]]:shadow-[0_0_0_2px_var(--color-focus-contrast)]',
        className,
      )}
    >
      {media && <CardMedia>{media}</CardMedia>}

      {actions && (
        /* z-(--z-raised) ยกเหนือ link overlay — ไม่งั้นกดปุ่มบันทึกแล้วเปิดหน้ารายการแทน */
        <div className="absolute end-2 top-2 z-(--z-raised) flex gap-1">{actions}</div>
      )}

      {/* padding อยู่ที่ส่วนเนื้อหา ไม่ใช่ที่การ์ด เพื่อให้รูปชนขอบได้
         p-3 ที่ 136px เหลือเนื้อหา 112px — พอสำหรับราคา 7 หลัก */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 md:gap-3 md:p-4">
        {eyebrow && <div className="flex min-w-0 flex-wrap gap-1">{eyebrow}</div>}

        <Heading className="text-body-sm text-fg">
          <Link
            href={href}
            quiet
            /* ★ ปิดวงแหวนที่ลิงก์ — การ์ดวาดแทน (ดูเหตุผลด้านบน)
               ต้องเป็น attribute ไม่ใช่ utility: `base.css` อยู่นอก @layer
               จึงชนะ `@layer utilities` เสมอ · `outline-none` ที่นี่ไม่มีผล
               วัดแล้วได้วงแหวนสองวงซ้อนกัน — ดู base.css §5b */
            data-focus-ring="deferred"
            className={cn(
              'block min-w-0 line-clamp-2',
              'after:absolute after:inset-0',
            )}
          >
            {title}
          </Link>
        </Heading>

        {meta}

        {/* mt-auto ดัน amount+footer ลงล่างเสมอ — การ์ดในแถวเดียวกัน
           จึงมีราคาตรงแนวกันแม้ชื่อยาวไม่เท่ากัน */}
        {(amount || footer) && (
          <div className="mt-auto flex min-w-0 flex-col gap-2 pt-1">
            {amount}
            {footer && <div className="relative z-(--z-raised)">{footer}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EntityAmount — จำนวนเงินพร้อม label ที่บอกความหมาย
   ───────────────────────────────────────────────────────────────────────────── */

export interface EntityAmountProps {
  /**
   * ความหมายของจำนวนนี้ — **บังคับ**
   *
   * "ราคา" · "วงเงินสูงสุด" · "ค่าลงทะเบียน" ไม่ใช่สิ่งเดียวกัน
   * และ label คือสิ่งเดียวที่บอกความต่าง
   */
  label: string;

  /** จำนวน — `null` = ไม่มีตัวเลข ใช้ `note` แทน เช่น "ขอใบเสนอราคา" */
  value: number | null;

  /** หน่วย · ค่าเริ่มต้น "บาท" */
  unit?: string;

  /** ต่อท้ายจำนวน เช่น "ต่อโครงการ" · หรือแทนจำนวนเมื่อ `value` เป็น null */
  note?: string;

  className?: string;
}

/**
 * ★ ราคาใช้ `font-numeric` และ **เลขอารบิกเสมอ** (ข้อ 03 §2)
 * เลขไทย ๐–๙ กว้างต่างกัน 36.6% em ทำให้ราคาในกริดไม่ตรงแนวกัน
 *
 * ★ label อยู่ **เหนือ** ตัวเลข ไม่ใช่ข้างหลัง
 * ที่ 136px การวางข้างกันทำให้ตัวใดตัวหนึ่งถูกตัด
 *
 * ★★★ ตัวเลขลดหนึ่งขั้นเมื่อ **กล่องแคบ** ไม่ใช่เมื่อ **จอแคบ**
 *
 * `1,250,000` ที่ `text-title` (24px) กว้าง 109.47px แต่กล่องในของการ์ด
 * ที่ 136px เหลือ 102px → ล้น 7.47px · เคสนี้เกิดที่ `preset="cards"`
 * บนจอ xl ด้วย จึงใช้ breakpoint ของหน้าตัดสินไม่ได้ — ต้องเป็น
 * container query ที่ถามว่า *กล่องนี้* กว้างเท่าไร
 *
 * ที่ `text-subtitle` (20px) ตัวเลขเดียวกันกว้าง ~91px ซึ่งพอดีกล่อง 102px
 */
export function EntityAmount({ label, value, unit, note, className }: EntityAmountProps) {
  const { locale } = useSmeGoLocale();

  return (
    <div className={cn('@container grid min-w-0 gap-0.5', className)}>
      <span className="text-caption text-fg-muted">{label}</span>
      {value === null ? (
        <span className="text-body-sm text-fg">{note}</span>
      ) : (
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-1">
          {/* ★ 7rem = 112px — เผื่อจากกล่องจริง 102px ไว้ให้หน่วยที่ตามมา */}
          <span className="text-title @max-[7rem]:text-subtitle text-fg font-numeric">
            {new Intl.NumberFormat(locale).format(value)}
          </span>
          <span className="text-caption text-fg-muted">
            {unit ?? 'บาท'}
            {note ? ` ${note}` : ''}
          </span>
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EntityMeta — คู่ชื่อ/ค่า · เป็น <dl> เพราะเป็นคู่จริง ๆ
   ───────────────────────────────────────────────────────────────────────────── */

export interface EntityMetaItem {
  /**
   * ชื่อของค่า — **ต้องไม่ว่าง**
   *
   * `<dt>` ที่ว่างเปล่าไม่ถูกต้องตาม HTML และทำให้ screen reader
   * ประกาศคู่ที่ไม่มีชื่อ · ข้อมูลที่อธิบายตัวเองได้ (เช่นชื่อผู้ผลิต
   * ที่มีคำว่า "ผู้ผลิต" อยู่ในค่าแล้ว) ให้วางเป็น `<p>` นอก `<dl>`
   */
  label: string;
  value: ReactNode;
}

export interface EntityMetaProps {
  items: EntityMetaItem[];
  className?: string;
}

/**
 * ★ ใช้ `<dl>` ไม่ใช่ `<div>` — screen reader ประกาศความสัมพันธ์
 * "สั่งขั้นต่ำ, 100 ชิ้น" ไม่ใช่ "สั่งขั้นต่ำ" แล้ว "100 ชิ้น" แยกกัน
 *
 * ★ ที่ 136px ซ้อนแนวตั้ง · ที่ md ขึ้นไปวางข้างกัน
 */
export function EntityMeta({ items, className }: EntityMetaProps) {
  /* `<dl>` เปล่าไม่มีความหมาย — ไม่ render ดีกว่าปล่อยกล่องว่าง */
  if (items.length === 0) return null;

  return (
    <dl className={cn('grid min-w-0 gap-1 text-caption', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-wrap gap-x-1">
          <dt className="text-fg-muted">{item.label}</dt>
          <dd className="min-w-0 text-fg-secondary">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
