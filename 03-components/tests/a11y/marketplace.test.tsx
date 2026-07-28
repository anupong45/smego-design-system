import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';

import {
  ProductCard, ServiceCard, ProgramCard, GrantCard, TrainingCard,
  SearchResult, FilterPanel, FilterChipRow, CategoryNav, CategoryBreadcrumb,
  CompareBar, CompareTable,
  CheckoutSummary, CheckoutStepper,
  PaymentMethodSelect, PromptPayQR, SlipUpload,
  OrderTimeline, SaveButton, WishlistGrid, WishlistHeader,
  SellerProfile, CertificationBadge,
  Grid, Button, CheckboxGroup, Checkbox,
} from '../../src/index';

const compareItems = [
  { id: 'a', name: 'เครื่องคั่วกาแฟ TR-500' },
  { id: 'b', name: 'เครื่องคั่วกาแฟ HX-300' },
];

const certs = [
  { id: '1', name: 'มอก. 2456-2562', isVerified: true },
  { id: '2', name: 'GMP', isVerified: false },
];

const cases: [string, React.ReactElement][] = [
  [
    'ProductCard',
    <Grid as="ul" preset="product">
      <ProductCard
        as="li"
        href="/p/1"
        name="เครื่องคั่วกาแฟกึ่งอัตโนมัติ 5 กิโลกรัม รุ่น TR-500"
        price={1_250_000}
        unit="เครื่อง"
        moq={1}
        sellerName="บจก. ไทยโรสเตอร์"
        certifications={['มอก. 2456-2562']}
        media={<img src="/x.jpg" alt="" className="aspect-4/3 w-full" />}
        actions={<SaveButton itemName="เครื่องคั่วกาแฟ TR-500" />}
        footer={<Button size="sm" fullWidth>ดูรายละเอียด</Button>}
      />
    </Grid>,
  ],
  [
    'ProductCard · ขอใบเสนอราคา · สินค้าหมด',
    <ProductCard
      href="/p/2"
      name="ถุงกระดาษคราฟท์พิมพ์โลโก้"
      price={null}
      unit="ใบ"
      moq={500}
      sellerName="บจก. กรีนแพ็ค"
      inStock={false}
    />,
  ],
  [
    'ServiceCard · quote',
    <ServiceCard
      href="/s/1"
      name="ที่ปรึกษาระบบบัญชีและภาษีสำหรับ SME"
      pricingModel="quote"
      leadTime="ตามข้อตกลง"
      sellerName="บจก. แอคเคาท์โปร"
    />,
  ],
  [
    'ProgramCard',
    <ProgramCard
      href="/pg/1"
      name="โครงการยกระดับผู้ประกอบการสู่ตลาดสากล ปี 2569"
      agency="สำนักงานส่งเสริมวิสาหกิจขนาดกลางและขนาดย่อม"
      eligibility="นิติบุคคลจดทะเบียนในไทย ยอดขายไม่เกิน 500 ล้านบาทต่อปี"
      deadline="2026-12-31"
      status="open"
    />,
  ],
  [
    'GrantCard · ใกล้ปิดรับ',
    <GrantCard
      href="/g/1"
      name="ทุนสนับสนุนการปรับเปลี่ยนเครื่องจักรสู่ระบบอัตโนมัติ"
      agency="กรมส่งเสริมอุตสาหกรรม"
      fundingCeiling={500_000}
      coPaymentPercent={50}
      deadline="2026-09-30"
      status="closing-soon"
      daysLeft={5}
      footer={<Button size="sm" variant="accent" fullWidth>ยื่นคำขอ</Button>}
    />,
  ],
  [
    'TrainingCard · ฟรี · ที่นั่งเหลือน้อย',
    <TrainingCard
      href="/t/1"
      name="การทำบัญชีและภาษีสำหรับผู้ประกอบการรายใหม่"
      organizer="สถาบันพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม"
      format="hybrid"
      startDate="2026-08-15"
      endDate="2026-08-16"
      isFree
      seatsLeft={3}
      seatsLow
    />,
  ],

  [
    'SearchResult · มีผลลัพธ์',
    <SearchResult count={128} query="เครื่องคั่วกาแฟ">
      <Grid as="ul" preset="product-filtered">
        <ProductCard as="li" href="/p/1" name="เตาอบลมร้อน 20 ถาด"
          price={340_000} unit="เครื่อง" sellerName="บจก. ไทยเบเกอรี่" />
      </Grid>
    </SearchResult>,
  ],
  [
    'SearchResult · ว่าง',
    <SearchResult count={0} query="เครื่องคั่วกาแฟไฟฟ้าแรงสูงพิเศษ"
      emptyAction={<Button variant="secondary" size="sm">ล้างตัวกรองทั้งหมด</Button>} />,
  ],

  [
    'FilterPanel',
    <FilterPanel
      onClearAll={() => {}}
      groups={[
        {
          id: 'cat',
          title: 'หมวดหมู่ย่อย',
          children: (
            <CheckboxGroup label="หมวดหมู่ย่อย">
              <Checkbox value="roaster">เครื่องคั่วกาแฟ</Checkbox>
              <Checkbox value="oven">เตาอบลมร้อน</Checkbox>
            </CheckboxGroup>
          ),
        },
      ]}
    />,
  ],
  [
    'FilterChipRow',
    <FilterChipRow
      filters={[
        { id: 'f1', label: 'ผู้ผลิต: กรุงเทพฯ' },
        { id: 'f2', label: 'มีใบรับรอง' },
      ]}
      onRemove={() => {}}
      onClearAll={() => {}}
    />,
  ],

  [
    'CategoryNav',
    <CategoryNav
      currentId="roast"
      allHref="/c/food"
      items={[
        { id: 'roast', name: 'เครื่องคั่วและอบ', href: '/c/food/roast', count: 128 },
        { id: 'mix', name: 'เครื่องผสมและนวด', href: '/c/food/mix', count: 64 },
      ]}
    />,
  ],
  [
    'CategoryBreadcrumb',
    <CategoryBreadcrumb
      items={[
        { name: 'หน้าแรก', href: '/' },
        { name: 'เครื่องจักรและอุปกรณ์อุตสาหกรรม', href: '/c/machinery' },
        { name: 'เครื่องแปรรูปอาหารและเครื่องดื่ม' },
      ]}
    />,
  ],

  [
    'CompareBar',
    <CompareBar items={compareItems} onRemove={() => {}} onClearAll={() => {}} onOpen={() => {}} />,
  ],
  [
    'CompareTable',
    <CompareTable
      items={compareItems}
      rows={[
        { label: 'ราคา', values: ['1,250,000 บาท', '890,000 บาท'] },
        { label: 'ใบรับรอง', values: ['มอก. 2456-2562', 'ไม่มี'] },
      ]}
      onRemove={() => {}}
    />,
  ],

  [
    'CheckoutStepper',
    <CheckoutStepper
      currentIndex={1}
      steps={[
        { id: 'cart', label: 'ตะกร้าสินค้า' },
        { id: 'address', label: 'ที่อยู่จัดส่ง' },
        { id: 'pay', label: 'ชำระเงิน' },
      ]}
    />,
  ],
  [
    'CheckoutSummary',
    <CheckoutSummary
      itemCount={3}
      subtotal={1_250_000}
      vat={87_500}
      shipping={null}
      total={1_337_500}
      action={<Button variant="primary" fullWidth>ยืนยันคำสั่งซื้อ</Button>}
    />,
  ],

  [
    'PaymentMethodSelect',
    <PaymentMethodSelect value="promptpay" onChange={() => {}} disabledMethods={['credit-term']} />,
  ],
  [
    'PromptPayQR',
    <PromptPayQR qrSrc="data:image/gif;base64,R0lGODlhAQABAAAAACw=" amount={1_337_500}
      reference="0105561234567-2569-0042" />,
  ],
  ['SlipUpload', <SlipUpload onSelect={() => {}} />],
  ['SlipUpload · อัปโหลดแล้ว', <SlipUpload onSelect={() => {}} uploadedName="slip-2569-07-08.jpg" onRemove={() => {}} />],

  [
    'OrderTimeline',
    <OrderTimeline
      steps={[
        {
          id: 'q', label: 'ใบเสนอราคา', date: '2026-07-01', status: 'done',
          documentHref: '/d/qt', documentName: 'ใบเสนอราคา QT-2569-0042', note: 'QT-2569-0042',
        },
        { id: 'tax', label: 'ใบกำกับภาษีอิเล็กทรอนิกส์', status: 'current' },
        { id: 'rc', label: 'ใบเสร็จรับเงิน', status: 'pending' },
      ]}
    />,
  ],

  ['SaveButton · icon', <SaveButton itemName="เครื่องคั่วกาแฟ TR-500" />],
  ['SaveButton · full · saved', <SaveButton itemName="เครื่องคั่วกาแฟ TR-500" variant="full" defaultSaved />],
  [
    'Wishlist',
    <>
      <WishlistHeader count={1} onClearAll={() => {}} />
      <WishlistGrid count={1}>
        {/* ★ h1 → h2 ห้ามข้ามไป h3 (ค่าเริ่มต้นของการ์ด) */}
        <ProductCard as="li" headingLevel={2} href="/p/1" name="เตาอบลมร้อน 20 ถาด"
          price={340_000} unit="เครื่อง" sellerName="บจก. ไทยเบเกอรี่" />
      </WishlistGrid>
    </>,
  ],
  [
    'WishlistGrid · ว่าง',
    <WishlistGrid count={0} emptyAction={<Button variant="secondary" size="sm">เลือกดูสินค้า</Button>} />,
  ],

  [
    'SellerProfile',
    <SellerProfile
      name="บริษัท ไทยโรสเตอร์ แมชชีนเนอรี่ จำกัด"
      registrationNumber="0105561234567"
      isVerified
      isVatRegistered
      taxId="0105561234567"
      canIssueETax
      location="กรุงเทพมหานคร"
      memberSinceYear={2021}
      responseTime="ภายใน 2 ชั่วโมง"
      certifications={certs}
      actions={<Button size="sm" variant="secondary">ติดต่อผู้ขาย</Button>}
    />,
  ],
  ['CertificationBadge · แจ้งเอง', <CertificationBadge certification={certs[1]!} />],
];

describe('Pass B · axe', () => {
  it.each(cases)('%s ไม่มี violation', async (_name, element) => {
    const { container } = render(element);
    const results = await expectNoViolations(container);
    expect(results).toHaveNoViolations();
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   ข้อกำหนดที่ axe จับไม่ได้ แต่ตรวจใน jsdom ได้ — เป็นเรื่องของ markup
   ═══════════════════════════════════════════════════════════════════════════ */

describe('Pass B · กฎเฉพาะโดเมน', () => {
  it('วันที่แสดงเป็น พ.ศ. แต่ dateTime เก็บ ค.ศ.', () => {
    render(
      <GrantCard href="/g/1" name="ทุนทดสอบ" agency="กรมทดสอบ"
        fundingCeiling={500_000} coPaymentPercent={50}
        deadline="2026-09-30" status="open" />,
    );
    const time = document.querySelector('time')!;
    expect(time.getAttribute('datetime')).toBe('2026-09-30');
    expect(time.textContent).toContain('2569');
    expect(time.textContent).not.toContain('2026');
  });

  it('GrantCard แสดง "วงเงินสูงสุด" ไม่ใช่ "ราคา"', () => {
    render(
      <GrantCard href="/g/1" name="ทุนทดสอบ" agency="กรมทดสอบ"
        fundingCeiling={500_000} coPaymentPercent={0}
        deadline="2026-09-30" status="open" />,
    );
    expect(screen.getByText('วงเงินสูงสุด')).toBeDefined();
    expect(screen.queryByText('ราคา')).toBeNull();
    /* ★ 0% ต้องแสดงจริง ไม่ใช่ซ่อน */
    expect(screen.getByText('0%')).toBeDefined();
  });

  it('PaymentMethodSelect เรียงพร้อมเพย์ก่อน บัตรท้ายสุด', () => {
    render(<PaymentMethodSelect value="promptpay" onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    const names = radios.map((r) => r.closest('label')?.textContent ?? '');
    expect(names[0]).toContain('พร้อมเพย์');
    expect(names[3]).toContain('บัตรเครดิต');
  });

  it('OrderTimeline มี aria-current="step" เพียงหนึ่งเดียว', () => {
    const { container } = render(
      <OrderTimeline steps={[
        { id: 'a', label: 'ใบเสนอราคา', status: 'done' },
        { id: 'b', label: 'ใบกำกับภาษี', status: 'current' },
        { id: 'c', label: 'ใบเสร็จ', status: 'pending' },
      ]} />,
    );
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });

  it('ลิงก์ดาวน์โหลดแต่ละอันมีชื่อเอกสารกำกับ', () => {
    render(
      <OrderTimeline steps={[
        { id: 'a', label: 'ใบเสนอราคา', status: 'done',
          documentHref: '/1', documentName: 'ใบเสนอราคา QT-2569-0042' },
        { id: 'b', label: 'ใบสั่งซื้อ', status: 'done',
          documentHref: '/2', documentName: 'ใบสั่งซื้อ PO-2569-0088' },
      ]} />,
    );
    const links = screen.getAllByRole('link');
    const names = links.map((l) => l.textContent);
    expect(new Set(names).size).toBe(links.length);
    expect(names[0]).toContain('QT-2569-0042');
  });

  it('SaveButton มี aria-pressed และชื่อรวมชื่อรายการ', () => {
    render(<SaveButton itemName="เครื่องคั่วกาแฟ TR-500" defaultSaved />);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toContain('เครื่องคั่วกาแฟ TR-500');
  });

  it('CertificationBadge แยกยืนยันแล้ว/แจ้งเอง ด้วยข้อความ ไม่ใช่สี', () => {
    const { container } = render(
      <>
        <CertificationBadge certification={certs[0]!} />
        <CertificationBadge certification={certs[1]!} />
      </>,
    );
    expect(screen.getByText('ยืนยันโดยหน่วยงานที่ออกให้')).toBeDefined();
    expect(screen.getByText('ผู้ขายแจ้งเอง · ยังไม่ยืนยัน')).toBeDefined();
    /* ★ ห้ามมีไอคอนใน badge ใบรับรอง (ข้อ 09) */
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('CheckoutSummary แยกบรรทัด VAT เสมอ', () => {
    render(<CheckoutSummary itemCount={1} subtotal={100} vat={7} total={107} />);
    expect(screen.getByText('ภาษีมูลค่าเพิ่ม 7%')).toBeDefined();
  });

  it('CompareTable ประกาศ role ครบ เพื่อกันการเปลี่ยน display', () => {
    const { container } = render(
      <CompareTable items={compareItems}
        rows={[{ label: 'ราคา', values: ['1,250,000', '890,000'] }]} />,
    );
    expect(container.querySelector('[role="table"]')).toBeTruthy();
    expect(container.querySelector('[role="row"]')).toBeTruthy();
    expect(container.querySelector('[role="cell"]')).toBeTruthy();
    expect(container.querySelector('[role="rowheader"]')).toBeTruthy();
    expect(container.querySelector('[role="columnheader"]')).toBeTruthy();
  });

  it('ไม่มีเลขไทย ๐–๙ ในตัวเลขใด ๆ', () => {
    const { container } = render(
      <>
        <CheckoutSummary itemCount={3} subtotal={1_250_000} vat={87_500} total={1_337_500} />
        <ProductCard href="/p" name="สินค้า" price={1_250_000} sellerName="ผู้ผลิต" moq={500} />
      </>,
    );
    expect(container.textContent).not.toMatch(/[๐-๙]/);
  });

  it('FilterChipRow ไม่ render อะไรเลยเมื่อไม่มีตัวกรอง', () => {
    const { container } = render(<FilterChipRow filters={[]} onRemove={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('CompareBar ไม่ render เมื่อว่าง', () => {
    const { container } = render(
      <CompareBar items={[]} onRemove={() => {}} onClearAll={() => {}} onOpen={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('EntityCard ยกวงแหวน focus ให้การ์ดวาดแทน', () => {
    const { container } = render(
      <ProductCard href="/p/1" name="สินค้าทดสอบ" price={100} sellerName="ผู้ผลิต" />,
    );
    const link = container.querySelector('a')!;
    expect(link.getAttribute('data-focus-ring')).toBe('deferred');
    /* การ์ดต้องมีกฎ has-[…] มาวาดแทน ไม่งั้นวงแหวนหายไปเฉย ๆ */
    expect(link.closest('article')!.className).toContain('has-[a[data-focus-visible]]:outline-2');
  });
});
