import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { FundingCard, BusinessCard, ServiceCard, SellerProfile } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 4 · การ์ดใหม่และการขยายของเดิม
   FundingCard · BusinessCard · ServiceCard subscription · SellerProfile ภาษี
   ═══════════════════════════════════════════════════════════════════════════ */

describe('FundingCard', () => {
  const base = {
    href: '/f/1',
    name: 'สินเชื่อ SME D-Scale',
    agency: 'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม',
    loanCeiling: 500_000,
    interestRate: 3,
    termMonths: 84,
    collateral: 'bsy' as const,
    status: 'open' as const,
  };

  it('ไม่มี axe violation', async () => {
    const { container } = render(<FundingCard {...base} />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★ label เป็น "วงเงินกู้สูงสุด" ไม่ใช่ "วงเงินสูงสุด"', () => {
    render(<FundingCard {...base} />);
    expect(screen.getByText('วงเงินกู้สูงสุด')).toBeTruthy();
    expect(screen.queryByText('วงเงินสูงสุด')).toBeNull();
  });

  it('★ หลักประกัน "บสย. ค้ำแทนได้" ไม่ถูกยุบเป็น "ต้องมีหลักประกัน"', () => {
    render(<FundingCard {...base} />);
    expect(screen.getByText('ใช้ บสย. ค้ำประกันแทนได้')).toBeTruthy();
    expect(screen.queryByText('ต้องมีหลักประกัน')).toBeNull();
  });

  it('★★ null แสดง "ยังไม่ประกาศ" ทั้งสามช่อง ไม่ใช่ละไว้', () => {
    render(
      <FundingCard {...base} interestRate={null} termMonths={null} collateral={null} />,
    );
    expect(screen.getAllByText('ยังไม่ประกาศ')).toHaveLength(3);
    /* ชื่อช่องยังอยู่ครบ — ผู้ใช้ต้องรู้ว่ามีเงื่อนไขนี้อยู่ */
    expect(screen.getByText('อัตราดอกเบี้ย')).toBeTruthy();
    expect(screen.getByText('ระยะเวลาผ่อนชำระ')).toBeTruthy();
    expect(screen.getByText('หลักประกัน')).toBeTruthy();
  });

  it('★ ดอกเบี้ย 0 แสดง "ไม่มีดอกเบี้ย" ต่างจาก "ยังไม่ประกาศ"', () => {
    render(<FundingCard {...base} interestRate={0} />);
    expect(screen.getByText('ไม่มีดอกเบี้ย')).toBeTruthy();
    expect(screen.queryByText('ยังไม่ประกาศ')).toBeNull();
  });

  it('อัตราดอกเบี้ยมีหน่วยเวลากำกับเสมอ — ต่อเดือนกับต่อปีต่างกัน 12 เท่า', () => {
    render(<FundingCard {...base} interestRate={3} />);
    expect(screen.getByText('3% ต่อปี')).toBeTruthy();
  });

  it('ระยะเวลาที่หารด้วย 12 ลงตัวแสดงเป็นปี', () => {
    render(<FundingCard {...base} termMonths={84} />);
    expect(screen.getByText('7 ปี')).toBeTruthy();
  });

  it('สินเชื่อที่เปิดตลอด (ไม่มี deadline) ไม่แสดงแถวปิดรับสมัคร', () => {
    render(<FundingCard {...base} />);
    expect(screen.queryByText('ปิดรับสมัคร')).toBeNull();
  });
});

describe('BusinessCard', () => {
  const base = {
    href: '/b/1',
    name: 'บริษัท ไทยฟู้ดโปรเซสซิ่ง จำกัด',
    isVerified: true,
    category: 'รับจ้างผลิตอาหาร',
    province: 'สมุทรสาคร',
  };

  it('ไม่มี axe violation', async () => {
    const { container } = render(<BusinessCard {...base} />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★ ไม่มี slot amount — ธุรกิจไม่มีราคา', () => {
    render(<BusinessCard {...base} />);
    expect(screen.queryByText('บาท')).toBeNull();
    expect(screen.queryByText(/ราคา|วงเงิน|ค่าบริการ/)).toBeNull();
  });

  it('★ ยังไม่ยืนยันก็ยังแสดงป้าย ไม่ใช่ซ่อน', () => {
    render(<BusinessCard {...base} isVerified={false} />);
    expect(screen.getByText('ยังไม่ยืนยันตัวตน')).toBeTruthy();
  });

  it('matchReason มีชื่อกำกับ — ไม่ใช่ข้อความลอยที่อ่านเป็นคำโฆษณา', () => {
    render(<BusinessCard {...base} matchReason="อยู่ในหมวดเดียวกันและจังหวัดเดียวกัน" />);
    expect(screen.getByText('เหตุผลที่เสนอ')).toBeTruthy();
    expect(screen.getByText('อยู่ในหมวดเดียวกันและจังหวัดเดียวกัน')).toBeTruthy();
  });

  it('ป้าย "แนะนำ" ปรากฏเฉพาะเมื่อ isRecommended', () => {
    const { rerender } = render(<BusinessCard {...base} />);
    expect(screen.queryByText('แนะนำ')).toBeNull();
    rerender(<BusinessCard {...base} isRecommended />);
    expect(screen.getByText('แนะนำ')).toBeTruthy();
  });

  it('ใบรับรองเป็นข้อความล้วน ไม่มีไอคอน', () => {
    const { container } = render(
      <BusinessCard {...base} certifications={['มอก. 2456-2562', 'GMP']} />,
    );
    const badge = screen.getByText('มอก. 2456-2562').closest('span');
    expect(badge?.querySelector('svg')).toBeNull();
    expect(container).toBeTruthy();
  });
});

describe('ServiceCard · subscription', () => {
  const base = {
    href: '/s/1',
    name: 'โปรแกรมบัญชีออนไลน์สำหรับ SME',
    sellerName: 'บจก. ไทยซอฟต์',
  };

  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <ServiceCard {...base} pricingModel="per-month" fee={990} />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ per-month บังคับแสดงยอดรวมต่อปี', () => {
    render(<ServiceCard {...base} pricingModel="per-month" fee={990} />);
    /* EntityAmount ต่อหน่วยกับ note เป็นก้อนเดียว → "บาท ต่อเดือน" */
    expect(screen.getByText('บาท ต่อเดือน')).toBeTruthy();
    /* 990 × 12 = 11,880 — ภาระจริงที่ผู้ซื้อต้องเห็น */
    expect(screen.getByText('11,880 บาท')).toBeTruthy();
  });

  it('ยอดรวมต่อปีมีชื่อกำกับ ไม่ใช่ต่อท้ายตัวเลข (ถูกตัดที่ 136px)', () => {
    render(<ServiceCard {...base} pricingModel="per-month" fee={990} />);
    const label = screen.getAllByText('ต่อปี')[0];
    expect(label?.tagName).toBe('DT');
  });

  it('per-year แสดงยอดเดิม ไม่คูณ 12', () => {
    render(<ServiceCard {...base} pricingModel="per-year" fee={9_900} />);
    expect(screen.getByText('9,900 บาท')).toBeTruthy();
  });

  it('per-project ไม่แสดงยอดต่อปี — ไม่ใช่ภาระผูกพันต่อเนื่อง', () => {
    render(<ServiceCard {...base} pricingModel="per-project" fee={80_000} />);
    expect(screen.queryByText('ต่อปี')).toBeNull();
  });
});

describe('SellerProfile · ข้อมูลภาษี', () => {
  const base = {
    name: 'บจก. ไทยโรสเตอร์',
    isVerified: true,
  };

  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <SellerProfile {...base} isVatRegistered taxId="0105561234567" canIssueETax />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★ ไม่จด VAT ต้องบอกผลที่ตามมา ไม่ใช่แค่สถานะ', () => {
    render(<SellerProfile {...base} isVatRegistered={false} />);
    expect(screen.getByText('ไม่ได้จดทะเบียน VAT')).toBeTruthy();
    expect(screen.getByText('ผู้ซื้อขอคืนภาษีซื้อจากรายการนี้ไม่ได้')).toBeTruthy();
  });

  it('★ null = ยังไม่ระบุ ต่างจากไม่ได้จด', () => {
    render(<SellerProfile {...base} isVatRegistered={null} />);
    expect(screen.getByText(/ยังไม่ระบุ/)).toBeTruthy();
    expect(screen.queryByText('ไม่ได้จดทะเบียน VAT')).toBeNull();
  });

  it('เลขผู้เสียภาษีอยู่ใน <dl> พร้อม font-numeric', () => {
    const { container } = render(
      <SellerProfile {...base} isVatRegistered taxId="0105561234567" />,
    );
    const dd = [...container.querySelectorAll('dd')].find(
      (d) => d.textContent === '0105561234567',
    );
    expect(dd).toBeTruthy();
    expect(dd?.className).toContain('font-numeric');
  });
});
