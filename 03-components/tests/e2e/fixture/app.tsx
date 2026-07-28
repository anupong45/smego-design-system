import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  SmeGoProvider, Container, Section, Button, TextInput, RangeSlider,
  Dialog, DialogOverlay, DialogTrigger, CompareBar, Link, Grid, ProductCard,
  ProgressBar, DescriptionList, FundingCard, BusinessCard, Alert,
  AppHeader, SearchField, BuyBox, ImageGallery, CheckoutSummary,
  CartDrawer, CartList, CartSellerGroup, CartLineItem,
  ToastRegion, showToast, useStrings,
} from '../../../src/index';

/* เส้นทางซื้อของ Pass 5 — ต้องอยู่ในหน้าเดียวกับของเดิม
   เพราะเทส SC 2.4.11 วัดจาก header จริงที่ sticky อยู่ */
function BuyPath() {
  const s = useStrings();
  const [isCartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(2);
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <div data-testid="buy-path" className="mt-8 grid gap-6">
      <div className="max-w-sm" data-testid="gallery">
        <ImageGallery
          itemName="เครื่องคั่วกาแฟ TR-500"
          images={[
            { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'เครื่องคั่วกาแฟ TR-500 ด้านหน้า' },
            { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' },
            { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' },
          ]}
        />
      </div>

      <div className="max-w-sm" data-testid="buybox">
        <BuyBox
          kind="product"
          name="เครื่องคั่วกาแฟ TR-500"
          price={1_250_000}
          unit="เครื่อง"
          stock={4}
          onAddToCart={() => {
            showToast({ title: s.buy.addedToCart('เครื่องคั่วกาแฟ TR-500') });
            setCartOpen(true);
          }}
        />
      </div>

      <div className="max-w-sm" data-testid="service-buybox">
        <BuyBox
          kind="service"
          name="ออกแบบบรรจุภัณฑ์อาหารส่งออก"
          price={null}
          onContact={() => {}}
        />
      </div>

      <div className="max-w-sm" data-testid="checkout-summary">
        <CheckoutSummary
          itemCount={2}
          subtotal={2_500_000}
          vat={175_000}
          shipping={null}
          total={2_675_000}
          isSubmitting={isSubmitting}
          onSubmit={() => setSubmitting(true)}
          errorMessage="เชื่อมต่อไม่ได้ — ตรวจสอบสัญญาณอินเทอร์เน็ตแล้วลองอีกครั้ง"
        />
      </div>

      <CartDrawer isOpen={isCartOpen} onOpenChange={setCartOpen} fullCartHref="/cart">
        <CartList itemCount={1} sellerCount={2} isGuest>
          <CartSellerGroup
            sellerName="บจก. ไทยโรสเตอร์"
            subtotal={1_250_000 * quantity}
            onCheckout={() => {}}
          >
            <CartLineItem
              name="เครื่องคั่วกาแฟ TR-500"
              href="/p/tr-500"
              unitPrice={1_250_000}
              unit="เครื่อง"
              quantity={quantity}
              onQuantityChange={setQuantity}
              onRemove={() => {}}
              compact
            />
          </CartSellerGroup>
        </CartList>
      </CartDrawer>
    </div>
  );
}

function App() {
  const [price, setPrice] = useState<[number, number]>([50_000, 2_000_000]);
  const [taxId, setTaxId] = useState('');
  return (
    <>
      {/* sticky header — ตัวที่ทำให้ SC 2.4.11 พังได้ */}
      <div data-testid="header">
        <AppHeader
          cartCount={3}
          onOpenCart={() => {}}
          search={<SearchField labelHidden placeholder="ค้นหาสินค้า บริการ หรือโครงการ" />}
        />
      </div>

      {/* ปลายทางของลิงก์ข้ามเนื้อหาใน AppHeader (SC 2.4.1) */}
      <main id="main">
      <Container size="content">
        <Section>
          <h1 className="text-heading-lg text-fg">หน้าทดสอบ WCAG 2.2</h1>

          <div className="mt-6 max-w-md">
            <TextInput
              label="เลขทะเบียนนิติบุคคล"
              description="ตัวเลข 13 หลักจากหนังสือรับรอง DBD"
              value={taxId}
              onChange={setTaxId}
            />
          </div>

          <div className="mt-6 max-w-md" data-testid="slider-block">
            <RangeSlider
              label="ช่วงราคา"
              value={price}
              onChange={setPrice}
              minValue={0}
              maxValue={5_000_000}
              step={10_000}
            />
          </div>
          <p className="mt-2 text-caption text-fg-muted" data-testid="price-readout">
            {price[0]}-{price[1]}
          </p>

          <div className="mt-6">
            <DialogTrigger>
              <Button variant="danger" data-testid="open-dialog">ลบรายการนี้</Button>
              <DialogOverlay size="sm">
                <Dialog
                  title="ยืนยันการลบรายการ"
                  footer={
                    <>
                      <Button variant="secondary" slot="close">ยกเลิก</Button>
                      <Button variant="danger">ลบถาวร</Button>
                    </>
                  }
                >
                  <p className="text-body-sm text-fg-secondary">
                    เครื่องคั่วกาแฟ 5 กก. จะถูกลบออกจากรายการสินค้าของคุณ
                  </p>
                </Dialog>
              </DialogOverlay>
            </DialogTrigger>
          </div>

          {/* Pass 3 · primitive ที่ต้องวัดจากการ render จริง
              ★ วางบน canvas โดยตั้งใจ — โหมดมืด sunken = canvas เป๊ะ
                ถ้ารางไม่มีขอบ จะหายทั้งเส้นตรงนี้ */}
          <div className="mt-8 max-w-md" data-testid="progress-block">
            <ProgressBar
              label="วงเงินโครงการที่จัดสรรแล้ว"
              value={780}
              maxValue={1000}
              format="ratio"
              unit="ล้านบาท"
              note="ข้อมูล ณ 25 กรกฎาคม 2569"
            />
          </div>

          {/* ★ Alert ทั้ง 4 tone — ตรวจว่า utility ของ tint generate จริง
              ไม่ใช่ class ที่ไม่มี CSS (บทเรียนจาก bg-primary-50 ในโหมดมืด) */}
          <div className="mt-8 grid max-w-md gap-3" data-testid="alert-block">
            <Alert tone="info" title="ปิดรับสมัครวันที่ 30 กันยายน 2569" />
            <Alert tone="success" title="ส่งคำสั่งซื้อแล้ว" />
            <Alert tone="warning" title="ผู้ขายรายนี้ไม่ได้จดทะเบียนภาษีมูลค่าเพิ่ม">
              ผู้ซื้อจะขอคืนภาษีซื้อไม่ได้ ต้นทุนจริงต่างจากราคาที่แสดงประมาณ 7%
            </Alert>
            <Alert
              isLive
              tone="danger"
              title="บันทึกไม่สำเร็จ"
              onDismiss={() => {}}
              action={<Button size="sm">ลองบันทึกอีกครั้ง</Button>}
            >
              เชื่อมต่อไม่ได้ — ตรวจสอบสัญญาณอินเทอร์เน็ตแล้วลองอีกครั้ง
            </Alert>
          </div>

          <div className="mt-6 max-w-md" data-testid="desclist-block">
            <DescriptionList
              layout="inline"
              items={[
                { label: 'เลขทะเบียนนิติบุคคล', value: '0105558012345', numeric: true },
                { label: 'สถานะภาษีมูลค่าเพิ่ม', value: 'จดทะเบียนแล้ว' },
                { label: 'หน่วยงานที่รับรอง', value: 'กรมพัฒนาธุรกิจการค้า (DBD)' },
              ]}
            />
          </div>

          {/* ★★ 136px คือความกว้างที่แคบที่สุดจริงของการ์ดในกริด
              สัญญาของ EntityCard — ทุกการ์ดต้องอ่านออกที่นี่ */}
          <div className="mt-8 flex gap-4" data-testid="narrow-cards">
            <div className="w-[136px] shrink-0" data-testid="narrow-funding">
              <FundingCard
                href="/f/1"
                name="สินเชื่อ SME D-Scale ดอกเบี้ยพิเศษ"
                agency="ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม"
                loanCeiling={1_250_000}
                interestRate={3}
                termMonths={84}
                collateral="bsy"
                status="closing-soon"
                daysLeft={7}
              />
            </div>
            <div className="w-[136px] shrink-0" data-testid="narrow-business">
              <BusinessCard
                href="/b/1"
                name="บริษัท ไทยฟู้ดโปรเซสซิ่ง แอนด์ แพ็คเกจจิ้ง จำกัด"
                isVerified
                isRecommended
                category="รับจ้างผลิตอาหาร"
                province="สมุทรสาคร"
                matchReason="อยู่ในหมวดเดียวกันและจังหวัดเดียวกัน"
              />
            </div>
          </div>

          {/* เนื้อหายาว ๆ ให้มีอะไรให้ scroll */}
          <Grid as="ul" preset="product" className="mt-8">
            {Array.from({ length: 12 }, (_, i) => (
              <ProductCard
                key={i}
                as="li"
                href={`/p/${i}`}
                name={`เครื่องคั่วกาแฟกึ่งอัตโนมัติ รุ่นทดสอบ ${i + 1}`}
                price={1_250_000}
                unit="เครื่อง"
                moq={1}
                sellerName="บจก. ไทยโรสเตอร์"
                footer={<Button size="sm" fullWidth>ดูรายละเอียด</Button>}
              />
            ))}
          </Grid>

          <p className="mt-8">
            <Link href="#" data-testid="last-link">ลิงก์สุดท้ายของหน้า</Link>
          </p>
          <BuyPath />
        </Section>
      </Container>
      </main>

      <ToastRegion />

      <CompareBar
        items={[
          { id: 'a', name: 'เครื่องคั่วกาแฟ TR-500' },
          { id: 'b', name: 'เครื่องคั่วกาแฟ HX-300' },
        ]}
        onRemove={() => {}}
        onClearAll={() => {}}
        onOpen={() => {}}
      />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <SmeGoProvider><App /></SmeGoProvider>,
);
