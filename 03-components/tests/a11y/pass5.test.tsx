import { describe, it, expect } from 'vitest';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import {
  AppHeader,
  BuyBox,
  CartDrawer,
  CartLineItem,
  CartList,
  CartSellerGroup,
  CheckoutSummary,
  ImageGallery,
  ToastRegion,
  showToast,
} from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 5 · เส้นทางซื้อ
   AppHeader · BuyBox · Cart* · ImageGallery · Toast · Checkout CTA states
   ═══════════════════════════════════════════════════════════════════════════ */

describe('AppHeader', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <AppHeader cartCount={3} onOpenCart={() => {}} />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ ลิงก์ข้ามไปเนื้อหาเป็นลิงก์แรกใน DOM (SC 2.4.1)', () => {
    render(<AppHeader />);
    const links = screen.getAllByRole('link');
    expect(links[0]?.textContent).toBe('ข้ามไปยังเนื้อหาหลัก');
    expect(links[0]?.getAttribute('href')).toBe('#main');
  });

  it('★★★ จำนวนในตะกร้าอยู่ในชื่อปุ่ม ไม่ใช่แค่ตัวเลขในวงกลม', () => {
    render(<AppHeader cartCount={3} onOpenCart={() => {}} />);
    expect(screen.getByRole('button', { name: 'เปิดตะกร้าสินค้า มี 3 รายการ' })).toBeTruthy();
  });

  it('★ ตะกร้าว่างยังมีปุ่มอยู่ที่เดิม ไม่ถูกซ่อน', () => {
    render(<AppHeader cartCount={0} onOpenCart={() => {}} />);
    expect(screen.getByRole('button', { name: 'เปิดตะกร้าสินค้า' })).toBeTruthy();
  });

  it('★★ แขกเห็นลิงก์เข้าสู่ระบบ · ตะกร้ายังใช้ได้', () => {
    render(<AppHeader cartCount={1} onOpenCart={() => {}} />);
    expect(screen.getByRole('link', { name: 'เข้าสู่ระบบ' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /เปิดตะกร้าสินค้า/ })).toBeTruthy();
  });

  it('★ ชื่อแบรนด์เป็นลิงก์ ไม่ใช่ h1 — ทุกหน้าต้องมี h1 ของตัวเอง', () => {
    render(<AppHeader />);
    expect(screen.getByRole('link', { name: 'SME.GO หน้าแรก' })).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });
});

describe('BuyBox', () => {
  const product = {
    kind: 'product' as const,
    name: 'เครื่องคั่วกาแฟ TR-500',
    price: 1_250_000,
    unit: 'เครื่อง',
  };

  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <BuyBox {...product} stock={4} onAddToCart={() => {}} />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ สินค้ามีปุ่มเพิ่มลงตะกร้า', () => {
    render(<BuyBox {...product} stock={4} onAddToCart={() => {}} />);
    expect(screen.getByRole('button', { name: 'เพิ่มลงตะกร้า' })).toBeTruthy();
  });

  it('★★★ บริการไม่มีปุ่มเพิ่มลงตะกร้าเลย และบอกเหตุผล', () => {
    render(
      <BuyBox
        kind="service"
        name="ออกแบบบรรจุภัณฑ์"
        price={null}
        onContact={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: 'เพิ่มลงตะกร้า' })).toBeNull();
    expect(screen.getByRole('button', { name: 'ติดต่อผู้ขาย' })).toBeTruthy();
    expect(
      screen.getByText('บริการนี้ตกลงขอบเขตงานกับผู้ขายก่อน จึงไม่มีการเพิ่มลงตะกร้า'),
    ).toBeTruthy();
  });

  it('★★ สินค้าหมด → ปุ่มเปลี่ยนหน้าที่ ไม่ใช่ปุ่มเทาที่กดไม่ได้', () => {
    render(<BuyBox {...product} stock={0} onContact={() => {}} onAddToCart={() => {}} />);
    const contact = screen.getByRole('button', { name: 'สอบถามกำหนดมีของ' });
    expect(contact.getAttribute('disabled')).toBeNull();
    expect(screen.queryByRole('button', { name: 'เพิ่มลงตะกร้า' })).toBeNull();
    expect(screen.getByText('สินค้าหมด')).toBeTruthy();
  });

  it('★★ สั่งขั้นต่ำเป็นข้อความ ไม่ใช่แค่ minValue', () => {
    render(<BuyBox {...product} stock={500} moq={100} onAddToCart={() => {}} />);
    expect(screen.getByText('สั่งขั้นต่ำ 100 เครื่อง')).toBeTruthy();
  });

  it('★★ ข้อผิดพลาดเป็น Alert ที่ประกาศทันที ไม่ใช่ toast', () => {
    render(
      <BuyBox
        {...product}
        stock={4}
        onAddToCart={() => {}}
        errorMessage="เชื่อมต่อไม่ได้ ลองอีกครั้ง"
      />,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('★ ราคา null แสดง "ขอใบเสนอราคา" ไม่ใช่ 0', () => {
    render(<BuyBox kind="service" name="งานที่ปรึกษา" price={null} onContact={() => {}} />);
    expect(screen.getByText('ขอใบเสนอราคา')).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
  });
});

describe('Cart', () => {
  const line = {
    name: 'เครื่องคั่วกาแฟ TR-500',
    href: '/p/tr-500',
    unitPrice: 1_250_000,
    unit: 'เครื่อง',
    quantity: 2,
    onQuantityChange: () => {},
    onRemove: () => {},
  };

  function TwoSellers() {
    return (
      <CartList itemCount={2} sellerCount={2} isGuest>
        <CartSellerGroup sellerName="บจก. ไทยโรสเตอร์" subtotal={2_500_000} onCheckout={() => {}}>
          <CartLineItem {...line} />
        </CartSellerGroup>
        <CartSellerGroup sellerName="หจก. บีนส์แอนด์บาร์" subtotal={45_000} onCheckout={() => {}}>
          <CartLineItem {...line} name="เครื่องบดกาแฟ GX-2" href="/p/gx-2" unitPrice={45_000} quantity={1} />
        </CartSellerGroup>
      </CartList>
    );
  }

  it('ไม่มี axe violation', async () => {
    const { container } = render(<TwoSellers />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ ปุ่มชำระเงินมีปุ่มละร้าน และชื่อร้านอยู่ในชื่อปุ่ม', () => {
    render(<TwoSellers />);
    expect(screen.getByRole('button', { name: 'ชำระเงินร้าน บจก. ไทยโรสเตอร์' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ชำระเงินร้าน หจก. บีนส์แอนด์บาร์' })).toBeTruthy();
  });

  it('★★★ หลายร้าน → บอกว่าชำระแยกตั้งแต่ในตะกร้า', () => {
    render(<TwoSellers />);
    expect(
      screen.getByText(
        'ชำระเงินแยกตามผู้ขาย — แต่ละร้านเป็นคนละคำสั่งซื้อและคนละการโอน',
      ),
    ).toBeTruthy();
  });

  it('★★★ ทุกปุ่มในแถวมีชื่อสินค้า (SC 2.5.3)', () => {
    render(<TwoSellers />);
    expect(
      screen.getByRole('button', { name: 'นำ เครื่องคั่วกาแฟ TR-500 ออกจากตะกร้า' }),
    ).toBeTruthy();
    expect(screen.getByLabelText('จำนวนของ เครื่องคั่วกาแฟ TR-500')).toBeTruthy();
  });

  it('★★ ยอดรวมของแถวแสดงเป็นข้อความ ไม่ให้ผู้ใช้คูณเอง', () => {
    render(<TwoSellers />);
    /* 1,250,000 × 2 = 2,500,000 · โผล่สองที่: ยอดของแถว และยอดของร้าน */
    expect(screen.getAllByText('2,500,000.00')).toHaveLength(2);
  });

  it('★★ แขกได้รับแจ้งว่าของในตะกร้าจะไม่หาย', () => {
    render(<TwoSellers />);
    expect(
      screen.getByText('เข้าสู่ระบบเมื่อถึงขั้นตอนชำระเงิน สินค้าในตะกร้าจะยังอยู่'),
    ).toBeTruthy();
  });

  it('★ ร้านเดียวไม่ขึ้นคำเตือนชำระแยก', () => {
    render(
      <CartList itemCount={1} sellerCount={1}>
        <CartSellerGroup sellerName="บจก. ไทยโรสเตอร์" subtotal={1_250_000}>
          <CartLineItem {...line} quantity={1} />
        </CartSellerGroup>
      </CartList>,
    );
    expect(screen.queryByText(/ชำระเงินแยกตามผู้ขาย/)).toBeNull();
  });

  it('★ ตะกร้าว่างบอกวิธีทำให้ไม่ว่าง', () => {
    render(<CartList itemCount={0} sellerCount={0} />);
    expect(screen.getByText('ยังไม่มีสินค้าในตะกร้า')).toBeTruthy();
    expect(
      screen.getByText('เลือกสินค้าที่ต้องการแล้วกดเพิ่มลงตะกร้า จะกลับมาสั่งซื้อได้ที่นี่'),
    ).toBeTruthy();
  });

  it('★★★ drawer มีทางไปหน้าตะกร้าเต็ม และเป็นลิงก์จริง', () => {
    render(
      <CartDrawer isOpen onOpenChange={() => {}} fullCartHref="/cart">
        <CartList itemCount={0} sellerCount={0} />
      </CartDrawer>,
    );
    const link = screen.getByRole('link', { name: 'ดูตะกร้าทั้งหมด' });
    expect(link.getAttribute('href')).toBe('/cart');
  });
});

describe('ImageGallery', () => {
  const images = [
    { src: '/1.jpg', alt: 'เครื่องคั่วกาแฟ TR-500 ด้านหน้า' },
    { src: '/2.jpg' },
    { src: '/3.jpg' },
  ];

  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <ImageGallery images={images} itemName="เครื่องคั่วกาแฟ TR-500" />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ รูปย่อเป็นปุ่มจริง และชื่อบอกตำแหน่ง', () => {
    render(<ImageGallery images={images} itemName="เครื่องคั่วกาแฟ TR-500" />);
    expect(screen.getByRole('button', { name: 'รูปที่ 2 จาก 3' })).toBeTruthy();
  });

  it('★★★ รูปที่ผู้ขายไม่ได้กรอกคำบรรยายได้ alt ที่บอกตำแหน่ง ไม่ใช่ว่าง', async () => {
    render(<ImageGallery images={images} itemName="เครื่องคั่วกาแฟ TR-500" />);
    await userEvent.click(screen.getByRole('button', { name: 'รูปที่ 2 จาก 3' }));
    expect(screen.getByAltText('เครื่องคั่วกาแฟ TR-500 รูปที่ 2')).toBeTruthy();
  });

  it('★★ รูปเดียวไม่มีแถวรูปย่อ', () => {
    render(<ImageGallery images={[images[0]!]} itemName="เครื่องคั่วกาแฟ TR-500" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('★ รูปที่เลือกอยู่ประกาศด้วย aria-current ไม่ใช่แค่สีขอบ', () => {
    render(<ImageGallery images={images} itemName="เครื่องคั่วกาแฟ TR-500" />);
    const first = screen.getByRole('button', { name: 'รูปที่ 1 จาก 3' });
    expect(first.getAttribute('aria-current')).toBe('true');
  });
});

describe('CheckoutSummary · สถานะปุ่มยืนยัน', () => {
  const base = {
    itemCount: 2,
    subtotal: 1_250_000,
    vat: 87_500,
    total: 1_337_500,
  };

  it('ไม่มี axe violation ตอนมีทั้ง error และปุ่ม', async () => {
    const { container } = render(
      <CheckoutSummary {...base} onSubmit={() => {}} errorMessage="ลองอีกครั้ง" />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ onSubmit สร้างปุ่มยืนยันให้เอง', () => {
    render(<CheckoutSummary {...base} onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: 'ยืนยันคำสั่งซื้อ' })).toBeTruthy();
  });

  it('★★★ กำลังส่ง = กดซ้ำไม่ได้ แต่ปุ่มยังอยู่ใน a11y tree', async () => {
    let presses = 0;
    render(<CheckoutSummary {...base} onSubmit={() => presses++} isSubmitting />);
    const button = screen.getByRole('button', { name: 'ยืนยันคำสั่งซื้อ' });
    await userEvent.click(button);
    expect(presses).toBe(0);
  });

  it('★★★ ข้อผิดพลาดเป็น Alert ที่ประกาศทันที ไม่ใช่ toast', () => {
    render(
      <CheckoutSummary {...base} onSubmit={() => {}} errorMessage="เชื่อมต่อไม่ได้" />,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('ยืนยันคำสั่งซื้อไม่สำเร็จ');
    expect(alert.textContent).toContain('เชื่อมต่อไม่ได้');
  });

  it('★ ไม่ส่ง onSubmit = ไม่มีปุ่ม (ยังใช้ action เองได้)', () => {
    render(<CheckoutSummary {...base} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Toast', () => {
  it('ไม่มี axe violation เมื่อมี toast อยู่บนจอ', async () => {
    const { container } = render(<ToastRegion />);
    act(() => showToast({ title: 'เพิ่ม เครื่องคั่วกาแฟ TR-500 ลงตะกร้าแล้ว' }));
    await screen.findByText('เพิ่ม เครื่องคั่วกาแฟ TR-500 ลงตะกร้าแล้ว');
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ ปุ่มปิดมีข้อความของ toast ใบนั้นในชื่อ (SC 2.5.3)', async () => {
    render(<ToastRegion />);
    act(() => showToast({ title: 'บันทึกรายการแล้ว' }));
    expect(
      await screen.findByRole('button', { name: 'ปิด: บันทึกรายการแล้ว' }),
    ).toBeTruthy();
  });
});
