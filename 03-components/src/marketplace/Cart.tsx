'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { EmptyState } from '../data-display/EmptyState';
import { Button, buttonStyles } from '../inputs/Button';
import { IconButton } from '../inputs/IconButton';
import { Link } from '../inputs/Link';
import { NumberInput } from '../inputs/NumberInput';
import { Banner } from '../feedback/Banner';
import { Dialog, DialogOverlay } from '../feedback/Dialog';
import { useStrings, useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Cart — ตะกร้าสินค้า
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **ตะกร้าเดียว หลายร้าน · ชำระเงินแยกร้าน**

   ผู้ซื้อ B2B ไทยเทียบผู้ขายหลายเจ้าในรอบเดียว — ตะกร้าต่อร้านบังคับให้
   เคลียร์ของเก่าทิ้งเพื่อดูของร้านใหม่ ซึ่งขัดกับ `Compare` และ `Wishlist`
   ที่ระบบมีอยู่แล้ว

   แต่ **การชำระเงินแยกร้าน** เพราะเงินเข้าบัญชีผู้ขายโดยตรง (พร้อมเพย์ ·
   โอนแล้วแนบสลิป) ไม่ได้ผ่าน gateway รวมศูนย์ · การรวมยอดเป็นก้อนเดียว
   จะทำให้สลิปหนึ่งใบจับคู่กับผู้ขายหลายรายไม่ได้ และเป็นข้อพิพาทเรื่องเงินจริง

   ผลต่อโครงสร้าง: `CartSellerGroup` เป็นหน่วยของการชำระเงิน **ไม่ใช่แค่
   หัวข้อจัดกลุ่ม** — ยอดรวมและปุ่มชำระอยู่ที่ระดับกลุ่ม ไม่ใช่ระดับตะกร้า

   ★★★ **บริการไม่เข้าตะกร้า**

   บริการไม่มีสต็อก ไม่มีค่าขนส่ง และขอบเขตงานต้องตกลงก่อนจึงจะรู้ราคา
   การยัดเข้าตะกร้าทำให้ `CheckoutSummary` แสดงค่าขนส่งและ VAT ของยอดที่
   ยังไม่นิ่ง = โกหกตัวเลข · `BuyBox` จึงให้ CTA คนละเส้น (ดู `BuyBox.tsx`)

   ★★ **แขกใส่ตะกร้าได้ · ตัวตนจำเป็นตอนชำระเงิน**

   บังคับเข้าสู่ระบบตอนกด "เพิ่มลงตะกร้า" คือการขอตัวตนก่อนให้คุณค่า
   ผู้ซื้อที่กำลังเทียบราคาจะออกจากหน้าไป · `guestNotice` บอกล่วงหน้าว่า
   ของในตะกร้าไม่หาย เพื่อไม่ให้ผู้ใช้ตกใจตอนเจอหน้าเข้าสู่ระบบ

   ★ ตะกร้าเป็น **drawer และหน้าเต็ม** ที่ประกอบจากชิ้นเดียวกัน
   drawer = ดูเร็วหลังกดเพิ่ม · หน้าเต็ม = แก้จำนวนหลายรายการหลายร้าน
   ทั้งสองใช้ `CartLineItem` และ `CartSellerGroup` ชุดเดียวกัน ไม่มีการเขียนซ้ำ
   ═══════════════════════════════════════════════════════════════════════════ */

function useMoney() {
  const { locale } = useSmeGoLocale();
  return (n: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
}

/* ─────────────────────────────────────────────────────────────────────────────
   CartLineItem
   ───────────────────────────────────────────────────────────────────────────── */

export interface CartLineItemProps {
  /** ชื่อสินค้า — เข้าไปอยู่ในชื่อของทุกปุ่มในแถวนี้ (SC 2.5.3) */
  name: string;

  /** ลิงก์กลับไปหน้ารายละเอียด — ผู้ซื้อต้องตรวจสเปกซ้ำได้จากในตะกร้า */
  href: string;

  /** รูปสินค้า — ส่ง `<img>` เข้ามาได้เลย */
  media?: ReactNode;

  /** ราคาต่อหน่วย */
  unitPrice: number;

  /** หน่วยนับ เช่น "เครื่อง" "ไลเซนส์" */
  unit?: string;

  quantity: number;
  onQuantityChange: (next: number) => void;

  /** สั่งขั้นต่ำ · ค่าเริ่มต้น 1 — ลดต่ำกว่านี้ไม่ได้ */
  minQuantity?: number;

  /** จำนวนที่ผู้ขายมี — `undefined` = ไม่จำกัด */
  maxQuantity?: number;

  onRemove: () => void;

  /** ใน drawer ที่แคบ — ซ่อนรูปและย่อระยะ */
  compact?: boolean;

  className?: string;
}

/**
 * ★★ ทุกปุ่มในแถวมีชื่อสินค้าอยู่ในชื่อ
 *
 * ตะกร้าที่มี 10 รายการมีปุ่ม "นำออก" 10 ปุ่มและช่อง "จำนวน" 10 ช่อง
 * ผู้ใช้ screen reader ที่ไล่ด้วยรายการปุ่มจะแยกไม่ออกเลยว่าอันไหนของอะไร
 *
 * ★★ ยอดรวมของแถวเป็น **ข้อความ ไม่ใช่การคำนวณในหัวผู้ใช้**
 *
 * ราคาต่อหน่วย × จำนวน เป็นเลขที่ผู้ซื้อต้องตรวจอยู่แล้วก่อนโอน
 * การให้คูณเองคือที่มาของการทักท้วงยอดหลังโอน
 *
 * ★ `<li>` เสมอ — ต้องอยู่ใน `<ul>` ของ `CartSellerGroup`
 */
export function CartLineItem({
  name,
  href,
  media,
  unitPrice,
  unit,
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity,
  onRemove,
  compact = false,
  className,
}: CartLineItemProps) {
  const s = useStrings();
  const money = useMoney();

  return (
    <li
      className={cn(
        'grid min-w-0 gap-3 border-b border-edge-subtle py-4 last:border-b-0',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {!compact && media && (
          <div className="size-16 shrink-0 overflow-hidden rounded-(--radius-xs) bg-sunken md:size-20">
            {media}
          </div>
        )}

        <div className="grid min-w-0 flex-1 gap-1">
          <p className="min-w-0 text-body-sm text-fg">
            <Link href={href} className="line-clamp-2">
              {name}
            </Link>
          </p>
          <p className="min-w-0 text-caption text-fg-muted">
            {s.cart.unitPrice}{' '}
            <span className="text-fg-secondary font-numeric tabular-nums">
              {money(unitPrice)}
            </span>{' '}
            {s.common.currency}
            {unit ? ` / ${unit}` : ''}
          </p>
        </div>

        {/* ★ ชื่อปุ่มรวมชื่อสินค้า — ปุ่ม "นำออก" ลอย ๆ แยกไม่ออกใน 10 แถว */}
        <IconButton
          name="x"
          label={s.cart.remove(name)}
          variant="ghost"
          size="md"
          onPress={onRemove}
          className="-me-2 -mt-2 shrink-0"
        />
      </div>

      <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
        <div className="w-32 min-w-0">
          <NumberInput
            /* ★ ป้ายที่เห็นคือ "จำนวน" ส่วนชื่อเต็มไปที่ a11y tree
               ชื่อที่เห็นเป็นส่วนหนึ่งของชื่อที่ประกาศ จึงยังผ่าน SC 2.5.3
               (ป้ายยาวเต็มชื่อสินค้าในทุกแถวอ่านไม่ไหวด้วยสายตา) */
            label={s.cart.quantity}
            aria-label={s.cart.quantityOf(name)}
            value={quantity}
            onChange={onQuantityChange}
            minValue={minQuantity}
            maxValue={maxQuantity}
            step={1}
            formatOptions={{ maximumFractionDigits: 0 }}
          />
        </div>

        <p className="min-w-0 text-end">
          <span className="block text-caption text-fg-muted">{s.cart.lineTotal}</span>
          <span className="text-subtitle text-fg font-numeric tabular-nums">
            {money(unitPrice * quantity)}
          </span>
          <span className="ms-1 text-caption text-fg-muted">{s.common.currency}</span>
        </p>
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CartSellerGroup — หน่วยของการชำระเงิน
   ───────────────────────────────────────────────────────────────────────────── */

export interface CartSellerGroupProps {
  /** ชื่อผู้ขาย — เป็นหัวข้อจริงของกลุ่ม ไม่ใช่ป้ายกำกับ */
  sellerName: string;

  /** ลิงก์ไปโปรไฟล์ผู้ขาย */
  sellerHref?: string;

  /** ยอดรวมของร้านนี้ก่อนภาษีและค่าขนส่ง */
  subtotal: number;

  /** `<CartLineItem>` ของร้านนี้ */
  children: ReactNode;

  /** ไปหน้าชำระเงินของร้านนี้ — **หนึ่งร้าน หนึ่งคำสั่งซื้อ หนึ่งการโอน** */
  onCheckout?: () => void;

  /** กำลังสร้างคำสั่งซื้อของร้านนี้ */
  isCheckingOut?: boolean;

  /** ระดับหัวข้อ · ค่าเริ่มต้น 3 (ใต้ `<h2>` "ตะกร้าสินค้า") */
  headingLevel?: 2 | 3 | 4;

  className?: string;
}

/**
 * ★★★ กลุ่มผู้ขายคือ **หน่วยของการชำระเงิน** ไม่ใช่แค่หัวข้อ
 *
 * ยอดรวมและปุ่มชำระอยู่ที่นี่ เพราะเงินเข้าบัญชีของร้านนี้โดยตรง
 * ตะกร้าไม่มี "ยอดรวมทั้งตะกร้า" ให้กดชำระ — โดยตั้งใจ
 */
export function CartSellerGroup({
  sellerName,
  sellerHref,
  subtotal,
  children,
  onCheckout,
  isCheckingOut = false,
  headingLevel = 3,
  className,
}: CartSellerGroupProps) {
  const s = useStrings();
  const money = useMoney();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';

  return (
    <section
      className={cn(
        'grid min-w-0 gap-2 rounded-(--radius-container) border p-4',
        'border-(--elevation-edge-raised) bg-(--elevation-surface-raised)',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon name="building" size={16} className="shrink-0 text-fg-muted" />
        <Heading className="min-w-0 text-label text-fg">
          {sellerHref ? <Link href={sellerHref}>{sellerName}</Link> : sellerName}
        </Heading>
      </div>

      <ul className="grid min-w-0">{children}</ul>

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-edge-subtle pt-3">
        <p className="min-w-0 text-body-sm text-fg-secondary">
          {s.cart.sellerSubtotal}{' '}
          <span className="text-fg font-numeric tabular-nums">{money(subtotal)}</span>{' '}
          {s.common.currency}
        </p>

        {onCheckout && (
          <Button
            variant="primary"
            size="sm"
            onPress={onCheckout}
            isLoading={isCheckingOut}
          >
            {/* ★ ชื่อปุ่มมีชื่อร้าน — ตะกร้าที่มี 3 ร้านมีปุ่มชำระ 3 ปุ่ม */}
            {s.cart.checkoutSeller(sellerName)}
          </Button>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CartList — ตัวห่อของทั้งตะกร้า
   ───────────────────────────────────────────────────────────────────────────── */

export interface CartListProps {
  /** `<CartSellerGroup>` ทั้งหมด */
  children?: ReactNode;

  /** จำนวนรายการรวมทุกร้าน — `0` แสดงสถานะว่าง */
  itemCount: number;

  /** จำนวนร้านในตะกร้า — มากกว่า 1 แสดงคำเตือนว่าชำระแยก */
  sellerCount: number;

  /** ผู้ใช้ยังไม่ได้เข้าสู่ระบบ — บอกล่วงหน้าว่าจะต้องเข้าสู่ระบบตอนชำระ */
  isGuest?: boolean;

  /** ปุ่มในสถานะว่าง เช่น "เลือกดูสินค้า" */
  emptyAction?: ReactNode;

  className?: string;
}

/**
 * ★ สถานะว่างบอก **วิธีทำให้ไม่ว่าง** ไม่ใช่แค่ว่าว่าง (ข้อ 01)
 *
 * ★★ คำเตือน "ชำระแยกร้าน" อยู่ **ในตะกร้า** ไม่ใช่ในหน้าชำระเงิน
 * ผู้ซื้อที่รู้ตอนหน้าชำระเงินว่าต้องโอนสามครั้งคือผู้ซื้อที่รู้สายเกินไป
 */
export function CartList({
  children,
  itemCount,
  sellerCount,
  isGuest = false,
  emptyAction,
  className,
}: CartListProps) {
  const s = useStrings();

  if (itemCount === 0) {
    return (
      <EmptyState
        icon={<Icon name="shopping-cart" size={32} />}
        title={s.cart.empty}
        description={s.cart.emptyHelp}
        actions={emptyAction}
        className={className}
      />
    );
  }

  return (
    <div className={cn('grid min-w-0 gap-4', className)}>
      {sellerCount > 1 && (
        <Banner tone="info" title={s.checkout.perSellerNotice}>
          {s.cart.sellerCount(sellerCount)} · {s.checkout.itemCount(itemCount)}
        </Banner>
      )}

      {children}

      {isGuest && (
        <p className="min-w-0 text-caption text-fg-muted">{s.cart.guestNotice}</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CartDrawer — ดูเร็วหลังกดเพิ่มลงตะกร้า
   ───────────────────────────────────────────────────────────────────────────── */

export interface CartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  /** เนื้อหา — ปกติคือ `<CartList>` ที่ประกอบด้วย `compact` line item */
  children: ReactNode;

  /** ไปหน้าตะกร้าเต็ม — **ต้องมีเสมอ** ดูเหตุผลด้านล่าง */
  fullCartHref: string;

  className?: string;
}

/**
 * ★★★ drawer **ต้องมีทางไปหน้าตะกร้าเต็มเสมอ**
 *
 * แผงกว้าง 560px แก้จำนวนของสามร้านพร้อมกันไม่ไหว และผู้ใช้ที่ขยายตัวอักษร
 * 200% (SC 1.4.4) เห็นได้ทีละรายการเดียว · ถ้าไม่มีทางออกไปหน้าเต็ม
 * งานนั้นจะทำไม่ได้เลยบนอุปกรณ์บางเครื่อง = ผิด A2
 *
 * ★ บนมือถือใช้ `sheet` (ขึ้นจากก้นจอ) ไม่ใช่ drawer ข้าง
 * แผงข้างที่กว้างเกือบเต็มจอบนมือถืออ่านเหมือน modal อยู่แล้ว แต่เสียระยะนิ้วโป้ง
 */
export function CartDrawer({
  isOpen,
  onOpenChange,
  children,
  fullCartHref,
  className,
}: CartDrawerProps) {
  const s = useStrings();

  return (
    <DialogOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      variant="drawer"
      side="end"
      size="md"
    >
      <Dialog
        title={s.cart.title}
        variant="drawer"
        className={cn('h-full grid-rows-[auto_1fr_auto]', className)}
        footer={
          <>
            <Button variant="secondary" onPress={() => onOpenChange(false)}>
              {s.cart.continueShopping}
            </Button>

            {/* ★★ การกระทำหลักของ drawer คือ **การนำทาง** จึงเป็น `<Link>` จริง
               ผู้ใช้ต้องเปิดแท็บใหม่และคัดลอก URL ได้ · screen reader ต้องได้ยิน
               "ลิงก์" ไม่ใช่ "ปุ่ม"

               ⚠️ `no-underline` ที่นี่เป็นข้อยกเว้นที่ตั้งชื่อไว้ — เหตุผลของ
               ขีดใต้คือสีอย่างเดียวบอกไม่ได้ว่ากดได้ (SC 1.4.1) ซึ่งบนพื้นทึบ
               แบรนด์ไม่เป็นจริง เพราะระบบประกาศเองว่า "พื้นทึบ = กดได้" (ข้อ 01) */}
            <Link
              href={fullCartHref}
              className={cn(buttonStyles({ variant: 'primary' }), 'no-underline')}
            >
              {s.cart.viewFullCart}
            </Link>
          </>
        }
      >
        {children}
      </Dialog>
    </DialogOverlay>
  );
}
