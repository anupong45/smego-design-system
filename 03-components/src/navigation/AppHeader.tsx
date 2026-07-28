import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { Link } from '../inputs/Link';
import { Button } from '../inputs/Button';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · AppHeader — แถบบนสุดของทุกหน้า
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **ความสูงมาจาก `--header-height` เท่านั้น**

   `base.css` ตั้ง `scroll-margin-top` ของทุก element ที่ focus ได้จากค่านี้
   (SC 2.4.11) · ถ้า header ตั้งความสูงเองด้วยตัวเลขอื่น ทุก element ที่
   ผู้ใช้ Tab ไปถึงจะโผล่มาครึ่งเดียวใต้แถบ — และเป็นความล้มเหลวที่
   **มองไม่เห็นด้วยตา** จนกว่าจะลอง Tab จริงในหน้าที่เลื่อนได้

   ค่าเปลี่ยนเองที่ md (56 → 64px) ในชั้น token · component ไม่ต้องรู้

   ★★★ **ลิงก์ข้ามไปเนื้อหาเป็นชิ้นแรกใน DOM** (SC 2.4.1)

   ซ่อนจนกว่าจะ focus — ไม่ใช่ `display: none` ซึ่งจะทำให้ Tab ไม่ถึง

   ผู้ใช้คีย์บอร์ดในหน้ารายการสินค้าต้องกด Tab ผ่านช่องค้นหา ตะกร้า และ
   เมนูบัญชีทุกครั้งที่เปลี่ยนหน้า ถ้าไม่มีลิงก์นี้

   ★★★ **จำนวนในตะกร้าอยู่ในชื่อปุ่ม ไม่ใช่แค่ตัวเลขในวงกลม**

   วงกลมสีที่มีเลข 3 บอกผู้ใช้ screen reader ว่า "3" ลอย ๆ · ชื่อปุ่มจึงเป็น
   "เปิดตะกร้าสินค้า มี 3 รายการ" และตัวเลขที่มองเห็นได้ `aria-hidden`
   ไม่งั้นจะได้ยินเลขซ้ำสองครั้ง

   จำนวนอยู่ใน `aria-live="polite"` เพราะเปลี่ยนตอนผู้ใช้กดเพิ่มลงตะกร้า
   จากที่อื่นในหน้า โดย focus ยังไม่ได้อยู่ที่ปุ่มนี้ (SC 4.1.3)

   ★★ **แขกเห็น "เข้าสู่ระบบ" · ตะกร้าใช้ได้ทั้งสองสถานะ**

   ตะกร้าไม่เคยถูกซ่อนหรือ disabled สำหรับผู้ที่ยังไม่เข้าสู่ระบบ —
   การขอตัวตนก่อนให้คุณค่าคือจุดที่ผู้ซื้อเลิกใช้ (ดู `Cart.tsx`)

   ★ ชื่อแบรนด์เป็น **ลิงก์กลับหน้าแรก** ไม่ใช่ `<h1>`
   `<h1>` ของทุกหน้าคือชื่อหน้านั้น ไม่ใช่ชื่อเว็บ — ถ้า header ถือ `<h1>`
   ทุกหน้าจะมีหัวข้อระดับ 1 สองอัน และโครงหัวข้อของหน้าจะอ่านไม่ได้
   ═══════════════════════════════════════════════════════════════════════════ */

export interface AppHeaderProps {
  /** ปลายทางของชื่อแบรนด์ · ค่าเริ่มต้น `/` */
  homeHref?: string;

  /**
   * โลโก้ — ไม่ส่งมาจะใช้ชื่อ "SME.GO" เป็นตัวอักษร
   *
   * ⚠️ ถ้าส่ง `<img>` ต้องมี `alt` ที่เป็นชื่อเว็บ ไม่ใช่ `alt="โลโก้"`
   */
  logo?: ReactNode;

  /** ช่องค้นหา — ปกติคือ `<SearchField labelHidden>` */
  search?: ReactNode;

  /**
   * จำนวนรายการในตะกร้า
   *
   * `0` = ไม่แสดงตัวเลข แต่ **ปุ่มยังอยู่** — ผู้ใช้ต้องหาตะกร้าเจอที่เดิมเสมอ
   */
  cartCount?: number;

  /** เปิดตะกร้า — ปกติคือเปิด `<CartDrawer>` */
  onOpenCart?: () => void;

  /**
   * ส่วนบัญชีผู้ใช้ — ปุ่มเมนูของผู้ที่เข้าสู่ระบบแล้ว
   *
   * ไม่ส่งมา = แขก → แสดงลิงก์ "เข้าสู่ระบบ" จาก `signInHref`
   */
  account?: ReactNode;

  /** ปลายทางของลิงก์เข้าสู่ระบบสำหรับแขก · ค่าเริ่มต้น `/signin` */
  signInHref?: string;

  /** id ของเนื้อหาหลักที่ลิงก์ข้ามชี้ไป · ค่าเริ่มต้น `main` */
  mainId?: string;

  className?: string;
}

export function AppHeader({
  homeHref = '/',
  logo,
  search,
  cartCount = 0,
  onOpenCart,
  account,
  signInHref = '/signin',
  mainId = 'main',
  className,
}: AppHeaderProps) {
  const s = useStrings();

  return (
    <header
      className={cn(
        'sticky top-0 z-(--z-sticky)',
        'border-b border-edge bg-surface',
        className,
      )}
    >
      {/* ★ ชิ้นแรกใน DOM · เห็นเมื่อ focus เท่านั้น (SC 2.4.1)
         ไม่ใช้ `hidden` เพราะ element ที่ถูกซ่อนจริงจะ Tab ไม่ถึง */}
      <a
        href={`#${mainId}`}
        className={cn(
          'sr-only',
          'focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-(--z-overlay)',
          'focus:rounded-(--radius-control) focus:bg-surface focus:px-4 focus:py-2',
          'focus:text-body-sm focus:text-fg',
        )}
      >
        {s.header.skipToContent}
      </a>

      <div className="mx-auto flex h-(--header-height) w-full min-w-0 max-w-(--container-content) items-center gap-3 px-4 md:gap-4 md:px-6 lg:px-8">
        <Link href={homeHref} quiet aria-label={s.header.homeLabel} className="shrink-0">
          {logo ?? <span className="text-subtitle text-fg">SME.GO</span>}
        </Link>

        {/* ★ ช่องค้นหาซ่อนที่จอแคบ — หน้าที่มีการค้นหาเป็นหลักวางช่องไว้
           ในเนื้อหาแทน · ยัดทุกอย่างลงแถบ 56px ทำให้ทุกอันเล็กเกินกด */}
        {search && <div className="hidden min-w-0 flex-1 md:block">{search}</div>}

        <div className="ms-auto flex min-w-0 shrink-0 items-center gap-2">
          {onOpenCart && (
            <Button
              variant="ghost"
              size="sm"
              onPress={onOpenCart}
              /* ★ จำนวนอยู่ในชื่อปุ่ม ไม่ใช่แค่ในวงกลม */
              aria-label={
                cartCount > 0 ? s.cart.openWithCount(cartCount) : s.cart.open
              }
              className="relative"
            >
              <Icon name="shopping-cart" size={20} />
              {cartCount > 0 && (
                /* ตัวเลขที่เห็น `aria-hidden` — ชื่อปุ่มพูดไปแล้ว
                   ไม่งั้น screen reader อ่าน "3" ซ้ำอีกครั้ง */
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -end-1 -top-1 min-w-5 rounded-(--radius-pill-role)',
                    'bg-primary-600 px-1 text-caption text-on-brand font-numeric',
                  )}
                >
                  {cartCount}
                </span>
              )}
            </Button>
          )}

          {/* ★ จำนวนประกาศแยกจากปุ่ม — เปลี่ยนได้ขณะ focus อยู่ที่อื่น */}
          <span aria-live="polite" aria-atomic="true" className="sr-only">
            {cartCount > 0 ? s.checkout.itemCount(cartCount) : ''}
          </span>

          {account ?? (
            <Link href={signInHref} size="body-sm" className="shrink-0">
              {s.header.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
