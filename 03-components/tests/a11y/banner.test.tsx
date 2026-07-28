import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import { Banner, Button } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass 3 · Banner
   ───────────────────────────────────────────────────────────────────────────
   เทสที่มีค่าที่นี่ไม่ใช่ "render ได้ไหม" แต่เป็นข้อที่ **ผิดง่ายและเงียบ**:
   role ที่ไม่ควรมีตอนโหลดหน้า · ไอคอนที่ต่างกันจริง · ชื่อปุ่มปิดที่แยกกันได้
   ═══════════════════════════════════════════════════════════════════════════ */

describe('Banner', () => {
  it('ไม่มี axe violation ทั้ง 4 tone', async () => {
    const { container } = render(
      <>
        <Banner tone="info" title="ปิดรับสมัครวันที่ 30 กันยายน 2569" />
        <Banner tone="success" title="บันทึกข้อมูลผู้ขายแล้ว" />
        <Banner tone="warning" title="ผู้ขายรายนี้ไม่ได้จดทะเบียนภาษีมูลค่าเพิ่ม">
          ผู้ซื้อจะขอคืนภาษีซื้อไม่ได้ ต้นทุนจริงต่างจากราคาที่แสดง 7%
        </Banner>
        <Banner tone="danger" title="บันทึกไม่สำเร็จ">
          เชื่อมต่อไม่ได้ — ตรวจสอบสัญญาณอินเทอร์เน็ตแล้วลองอีกครั้ง
        </Banner>
      </>,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  /* ── role ─────────────────────────────────────────────────────────────── */

  it('★★★ ไม่มี live role โดยค่าเริ่มต้น — Banner ที่มาพร้อมหน้าห้ามแทรกก่อนชื่อหน้า', () => {
    const { container } = render(<Banner tone="danger" title="บันทึกไม่สำเร็จ" />);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it('isLive + danger/warning → role="alert" (assertive)', () => {
    render(
      <>
        <Banner isLive tone="danger" title="บันทึกไม่สำเร็จ" />
        <Banner isLive tone="warning" title="ที่นั่งเหลือ 2 ที่" />
      </>,
    );
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('isLive + info/success → role="status" (polite) ไม่ใช่ assertive', () => {
    render(
      <>
        <Banner isLive tone="info" title="ระบบจะปิดปรับปรุงคืนนี้" />
        <Banner isLive tone="success" title="ส่งใบเสนอราคาแล้ว" />
      </>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  /* ── SC 1.4.1 ─────────────────────────────────────────────────────────── */

  it('★★ ไอคอนของ 4 tone เป็นรูปทรงต่างกันจริง ไม่ใช่ตัวเดียวเปลี่ยนสี', () => {
    const paths = (['info', 'success', 'warning', 'danger'] as const).map((tone) => {
      const { container, unmount } = render(<Banner tone={tone} title="ทดสอบ" />);
      const svg = container.querySelector('svg');
      const d = svg?.innerHTML ?? '';
      unmount();
      return d;
    });
    expect(new Set(paths).size).toBe(4);
    expect(paths.every((p) => p.length > 0)).toBe(true);
  });

  it('ไอคอนเป็นตกแต่ง — ไม่โผล่ใน a11y tree ซ้อนกับข้อความ', () => {
    const { container } = render(<Banner tone="danger" title="บันทึกไม่สำเร็จ" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  /* ── หัวข้อ ───────────────────────────────────────────────────────────── */

  it('★ title ไม่เป็นหัวข้อโดยค่าเริ่มต้น — ไม่ปนโครงหัวข้อของหน้า', () => {
    render(<Banner tone="info" title="ปิดรับสมัคร 30 กันยายน 2569" />);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('titleAs ทำให้เป็นหัวข้อได้เมื่อจำเป็น', () => {
    render(<Banner tone="info" titleAs="h3" title="เงื่อนไขการสมัคร" />);
    expect(screen.getByRole('heading', { level: 3, name: 'เงื่อนไขการสมัคร' })).toBeTruthy();
  });

  /* ── ปุ่มปิด ──────────────────────────────────────────────────────────── */

  it('★★ ชื่อปุ่มปิดรวม title — สาม Banner ในหน้าเดียวต้องแยกกันได้ (SC 2.5.3)', () => {
    render(
      <>
        <Banner tone="info" title="แจ้งกำหนดปิดรับ" onDismiss={() => {}} />
        <Banner tone="success" title="บันทึกร่างแล้ว" onDismiss={() => {}} />
      </>,
    );
    expect(screen.getByRole('button', { name: 'ปิด: แจ้งกำหนดปิดรับ' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ปิด: บันทึกร่างแล้ว' })).toBeTruthy();
  });

  it('ไม่มีปุ่มปิดถ้าไม่ส่ง onDismiss', () => {
    render(<Banner tone="danger" title="กรอกเลขนิติบุคคลไม่ถูกต้อง" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('กดปุ่มปิดเรียก onDismiss ครั้งเดียว', async () => {
    const onDismiss = vi.fn();
    render(<Banner tone="info" title="แจ้งกำหนดปิดรับ" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: /ปิด/ }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  /* ── action ───────────────────────────────────────────────────────────── */

  it('action อยู่ใน DOM และกดถึงด้วยคีย์บอร์ดได้', async () => {
    const onPress = vi.fn();
    render(
      <Banner isLive tone="danger" title="บันทึกไม่สำเร็จ" action={<Button onPress={onPress}>ลองอีกครั้ง</Button>}>
        เชื่อมต่อไม่ได้ — ตรวจสอบสัญญาณอินเทอร์เน็ต
      </Banner>,
    );
    /* Tab เข้าไป ไม่ใช่ .focus() — พิสูจน์ว่าปุ่มอยู่ใน tab order จริง
       และเลี่ยง state update นอก act() ที่ RAC จะเตือน */
    await userEvent.tab();
    const btn = screen.getByRole('button', { name: 'ลองอีกครั้ง' });
    expect(document.activeElement).toBe(btn);
    await userEvent.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('รายละเอียดอ่านได้ทั้งก้อน ไม่ถูกตัดจาก title', () => {
    render(
      <Banner tone="danger" title="บันทึกไม่สำเร็จ">
        เชื่อมต่อไม่ได้ — ตรวจสอบสัญญาณอินเทอร์เน็ตแล้วลองอีกครั้ง
      </Banner>,
    );
    expect(screen.getByText(/ตรวจสอบสัญญาณอินเทอร์เน็ต/)).toBeTruthy();
  });
});
