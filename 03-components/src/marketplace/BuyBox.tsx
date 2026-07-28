import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from '../inputs/Button';
import { NumberInput } from '../inputs/NumberInput';
import { Banner } from '../feedback/Banner';
import { Badge } from '../data-display/Badge';
import { useStrings, useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · BuyBox — กล่องสั่งซื้อในหน้ารายละเอียด
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ขอบเขต: **component ไม่ใช่หน้า** — หน้ารายละเอียดประกอบเองจาก
   `<ImageGallery>` · `<SellerProfile>` · `<DescriptionList>` · กล่องนี้

   ★★★ **สินค้ากับบริการมี CTA คนละเส้น และนี่คือทั้งหมดของ component นี้**

     สินค้า  → จำนวน + "เพิ่มลงตะกร้า"      → เข้าตะกร้า
     บริการ  → "ติดต่อผู้ขาย"                → **ไม่เข้าตะกร้า**

   บริการไม่มีสต็อก ไม่มีค่าขนส่ง และราคาขึ้นกับขอบเขตงานที่ยังไม่ตกลง
   การให้ "เพิ่มลงตะกร้า" กับบริการทำให้ `CheckoutSummary` คำนวณ VAT และ
   ค่าขนส่งจากยอดที่ยังไม่นิ่ง — ตัวเลขที่ผิดเรื่องเงินคือความเสียหายจริง
   ไม่ใช่แค่ UX ที่ไม่สวย

   `kind` จึงเป็น prop **บังคับ** ไม่มีค่าเริ่มต้น — เลือกผิดต้องรู้ตัวตอนเขียน

   ★★ **สินค้าหมดไม่ทำให้กล่องนี้ disabled ทั้งใบ** (`ProductCard.md`)

   ผู้ซื้อ B2B ยังต้องดูสเปก เทียบราคา และถามว่าจะมีของเมื่อไร ·
   ปุ่มจึง **เปลี่ยนหน้าที่** เป็น "สอบถามกำหนดมีของ" ไม่ใช่ปุ่มเทาที่กดไม่ได้

   ★★ **สั่งขั้นต่ำเป็นข้อความ ไม่ใช่แค่ `minValue`**

   ช่องที่เด้งกลับเป็น 100 เงียบ ๆ ทำให้ผู้ใช้คิดว่าระบบพัง · ข้อความบอก
   ล่วงหน้าว่าทำไมลดต่ำกว่านี้ไม่ได้

   ★ ราคาที่นี่ **ไม่ใช่ `<EntityAmount>`** — ในหน้ารายละเอียดมีราคาเดียว
   และไม่ต้องตรงแนวกับการ์ดใบอื่น จึงใช้สเกลใหญ่เต็มที่ได้
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BuyBoxProps {
  /** ★ ไม่มีค่าเริ่มต้น — การเลือกผิดเปลี่ยนเส้นทางการซื้อทั้งเส้น */
  kind: 'product' | 'service';

  /** ชื่อรายการ — เข้าไปอยู่ในข้อความยืนยันหลังเพิ่มลงตะกร้า */
  name: string;

  /**
   * ราคา · `null` = ยังไม่มีตัวเลข (บริการที่ต้องขอใบเสนอราคา)
   *
   * ⚠️ `0` แปลว่า **ฟรีจริง** ห้ามใช้แทน "ยังไม่รู้ราคา"
   */
  price: number | null;

  /** หน่วยนับ เช่น "เครื่อง" · แสดงต่อท้ายราคา */
  unit?: string;

  /** ข้อความต่อท้ายราคา เช่น "ต่อโครงการ" หรือแทนราคาเมื่อ `price` เป็น `null` */
  priceNote?: string;

  /** สั่งขั้นต่ำ · ค่าเริ่มต้น 1 — เฉพาะ `kind="product"` */
  moq?: number;

  /** จำนวนที่มี · `0` = สินค้าหมด · `undefined` = ผู้ขายไม่ได้ระบุ */
  stock?: number;

  /** เพิ่มลงตะกร้า — ได้จำนวนที่ผู้ใช้เลือกไปด้วย */
  onAddToCart?: (quantity: number) => void;

  /** กำลังเพิ่มลงตะกร้า — ปุ่มขึ้น spinner และกดซ้ำไม่ได้ */
  isAdding?: boolean;

  /** ติดต่อผู้ขาย — เส้นทางของบริการ และของสินค้าที่หมด */
  onContact?: () => void;

  /** ข้อผิดพลาดจากการเพิ่มลงตะกร้า — `<Banner>` ไม่ใช่ `<Toast>` */
  errorMessage?: string;

  /** ปุ่มรอง เช่น `<SaveButton variant="full">` */
  secondaryAction?: ReactNode;

  className?: string;
}

export function BuyBox({
  kind,
  name,
  price,
  unit,
  priceNote,
  moq = 1,
  stock,
  onAddToCart,
  isAdding = false,
  onContact,
  errorMessage,
  secondaryAction,
  className,
}: BuyBoxProps) {
  const s = useStrings();
  const { locale } = useSmeGoLocale();
  const [quantity, setQuantity] = useState(moq);

  const isOutOfStock = stock === 0;
  const isProduct = kind === 'product';

  return (
    <section
      aria-label={name}
      className={cn(
        'grid min-w-0 gap-4 rounded-(--radius-container) border p-4 md:p-6',
        'border-(--elevation-edge-raised) bg-(--elevation-surface-raised)',
        className,
      )}
    >
      <div className="grid min-w-0 gap-1">
        <span className="text-caption text-fg-muted">
          {isProduct ? s.card.price : s.card.serviceFee}
        </span>

        {price === null ? (
          <span className="text-subtitle text-fg">{priceNote ?? s.card.requestQuote}</span>
        ) : (
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className="text-heading-sm text-fg font-numeric tabular-nums">
              {new Intl.NumberFormat(locale).format(price)}
            </span>
            <span className="text-body-sm text-fg-muted">
              {s.common.currency}
              {unit ? ` / ${unit}` : ''}
              {priceNote ? ` ${priceNote}` : ''}
            </span>
          </span>
        )}
      </div>

      {/* ★ สถานะสต็อกมีทั้งรูปแบบและข้อความ ไม่ใช่สีอย่างเดียว (SC 1.4.1) */}
      {isProduct && stock !== undefined && (
        <p className="min-w-0">
          <Badge variant={isOutOfStock ? 'neutral' : 'success'}>
            {isOutOfStock ? s.card.outOfStock : s.card.inStock}
          </Badge>
        </p>
      )}

      {isProduct && !isOutOfStock && (
        <>
          <div className="w-40 min-w-0">
            <NumberInput
              label={s.cart.quantity}
              value={quantity}
              onChange={setQuantity}
              minValue={moq}
              maxValue={stock}
              step={1}
              suffix={unit}
              formatOptions={{ maximumFractionDigits: 0 }}
              /* ★ เหตุผลของขั้นต่ำเป็นข้อความ — ไม่ใช่ให้ผู้ใช้เดาจากการเด้ง */
              description={moq > 1 ? s.buy.moqNotice(moq, unit ?? s.card.unit) : undefined}
            />
          </div>

          {errorMessage && (
            /* ★ error ค้างจนผู้ใช้จัดการ — ห้ามเป็น Toast (`Banner.md`) */
            <Banner isLive tone="danger" title={s.error.network}>
              {errorMessage}
            </Banner>
          )}

          {onAddToCart && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon="shopping-cart"
              isLoading={isAdding}
              onPress={() => onAddToCart(quantity)}
            >
              {s.buy.addToCart}
            </Button>
          )}
        </>
      )}

      {/* ★★ บริการ และสินค้าที่หมด ใช้เส้นทางเดียวกัน: คุยกับผู้ขายก่อน */}
      {(!isProduct || isOutOfStock) && onContact && (
        <Button variant="primary" size="lg" fullWidth onPress={onContact}>
          {isProduct ? s.buy.outOfStockAction : s.buy.contactSeller}
        </Button>
      )}

      {!isProduct && (
        <p className="min-w-0 text-caption text-fg-muted">{s.buy.serviceNoCart}</p>
      )}

      {secondaryAction}
    </section>
  );
}
