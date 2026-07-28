import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { ProgressBar, DescriptionList } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 3 · primitive ที่ชั้น marketplace รออยู่
   ProgressBar · DescriptionList
   ═══════════════════════════════════════════════════════════════════════════ */

describe('ProgressBar', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(
      <ProgressBar label="โควตาที่จัดสรรแล้ว" value={78} />,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★ ตัวเลขต้องแสดงเสมอ — ปิดไม่ได้', () => {
    render(<ProgressBar label="โควตาที่จัดสรรแล้ว" value={78} />);
    /* ตัวเลขที่ตาเห็น ไม่ใช่แค่ aria */
    expect(screen.getByText('78%')).toBeTruthy();
  });

  it('★ ข้อความที่ SR ได้ยินตรงกับที่ตาเห็น (SC 2.5.3)', () => {
    render(<ProgressBar label="โควตาที่จัดสรรแล้ว" value={78} />);
    const bar = screen.getByRole('progressbar', { name: /โควตา/ });
    expect(bar.getAttribute('aria-valuetext')).toBe('78%');
  });

  it('format="ratio" แสดงทั้งค่าและเพดานพร้อมหน่วย', () => {
    render(
      <ProgressBar
        label="วงเงินโครงการที่จัดสรรแล้ว"
        value={780}
        maxValue={1000}
        format="ratio"
        unit="ล้านบาท"
      />,
    );
    expect(screen.getByText('780 / 1,000 ล้านบาท')).toBeTruthy();
  });

  it('★★ value=null ต่างจาก 0 — ไม่ประกาศ valuenow และไม่วาดแถบ', () => {
    const { container } = render(
      <ProgressBar label="โควตาที่จัดสรรแล้ว" value={null} />,
    );
    const bar = screen.getByRole('progressbar', { name: /โควตา/ });

    /* "ไม่ทราบ" ≠ "0%" — ห้ามประกาศตัวเลขที่ไม่รู้ */
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
    expect(screen.getByText('ยังไม่ทราบ')).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('value=0 ประกาศ 0 จริง ไม่ใช่ "ยังไม่ทราบ"', () => {
    render(<ProgressBar label="โควตาที่จัดสรรแล้ว" value={0} />);
    const bar = screen.getByRole('progressbar', { name: /โควตา/ });
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(screen.getByText('0%')).toBeTruthy();
  });

  it('ค่าที่เกินเพดานถูกหนีบไม่ให้แถบล้นราง', () => {
    const { container } = render(
      <ProgressBar label="โควตาที่จัดสรรแล้ว" value={150} maxValue={100} />,
    );
    const fill = container.querySelector<HTMLElement>('[aria-hidden="true"]');
    expect(fill?.style.width).toBe('100%');
  });

  it('รางมีขอบเสมอ — โหมดมืด sunken = canvas', () => {
    const { container } = render(
      <ProgressBar label="โควตาที่จัดสรรแล้ว" value={40} />,
    );
    const track = container.querySelector('.bg-sunken');
    expect(track?.className).toContain('border-edge-strong');
  });
});

describe('DescriptionList', () => {
  const items = [
    { label: 'เลขทะเบียนนิติบุคคล', value: '0105558012345', numeric: true },
    { label: 'สถานะภาษีมูลค่าเพิ่ม', value: 'จดทะเบียนแล้ว' },
  ];

  it('ไม่มี axe violation', async () => {
    const { container } = render(<DescriptionList items={items} />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('เป็น <dl> จริง ไม่ใช่ <div> — SR ประกาศความสัมพันธ์เป็นคู่', () => {
    const { container } = render(<DescriptionList items={items} />);
    const dl = container.querySelector('dl');
    expect(dl).toBeTruthy();
    expect(dl?.querySelectorAll('dt').length).toBe(2);
    expect(dl?.querySelectorAll('dd').length).toBe(2);
  });

  it('★ ไม่มี <dt> ว่าง', () => {
    const { container } = render(<DescriptionList items={items} />);
    for (const dt of container.querySelectorAll('dt')) {
      expect(dt.textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  it('numeric ได้ font-numeric — หลักตรงกันหลายบรรทัด', () => {
    const { container } = render(<DescriptionList items={items} />);
    const dds = [...container.querySelectorAll('dd')];
    expect(dds[0]?.className).toContain('font-numeric');
    expect(dds[1]?.className).not.toContain('font-numeric');
  });

  it('รายการว่างไม่ render <dl> เปล่า', () => {
    const { container } = render(<DescriptionList items={[]} />);
    expect(container.querySelector('dl')).toBeNull();
  });

  it('layout="inline" ยุบเป็นซ้อนแนวตั้งใต้ md', () => {
    const { container } = render(<DescriptionList items={items} layout="inline" />);
    /* คอลัมน์คู่เกิดที่ md ขึ้นไปเท่านั้น */
    expect(container.querySelector('dl')?.className).toContain('md:grid-cols-');
  });
});
