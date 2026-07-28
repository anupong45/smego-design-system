import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import {
  TabList,
  Tab,
  TabPanel,
  SegmentedControl,
  SegmentedControlItem,
  Badge,
  Icon,
} from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   เฟส 5 · TabList / SegmentedControl
   ───────────────────────────────────────────────────────────────────────────
   สองตัวนี้หน้าตาใกล้กันแต่ ARIA ต่างกันหมด — เทสชุดนี้ล็อก **เส้นแบ่ง**
   ไม่ใช่แค่ว่า render ได้:

     TabList          → tablist/tab/tabpanel · panel ที่ไม่ได้เลือกไม่อยู่ใน DOM
     SegmentedControl → radiogroup/radio · ไม่มี panel · label ไม่แสดงด้วยตา

   บวกข้อที่ผิดง่ายและเงียบ: tabpanel ซ้อนใน tablist (ผิด ARIA แต่ยัง render ได้)
   ═══════════════════════════════════════════════════════════════════════════ */

function TabHarness() {
  const [tab, setTab] = useState('detail');
  return (
    <TabList value={tab} onChange={setTab} label="ข้อมูลสินค้า">
      <Tab value="detail" label="รายละเอียด" />
      <Tab value="spec" label="สเปก" />
      <Tab value="review" label="รีวิว" endContent={<Badge>12</Badge>} />
      <TabPanel value="detail">เครื่องคั่วกาแฟขนาด 5 กิโลกรัม</TabPanel>
      <TabPanel value="spec">กำลังไฟ 3,500 วัตต์</TabPanel>
      <TabPanel value="review">ยังไม่มีรีวิว</TabPanel>
    </TabList>
  );
}

describe('TabList', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(<TabHarness />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('ได้ role ครบชุด tablist / tab / tabpanel', () => {
    render(<TabHarness />);
    expect(screen.getByRole('tablist', { name: 'ข้อมูลสินค้า' })).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });

  it('★★★ `tabpanel` ต้องไม่ซ้อนอยู่ใน `tablist`', () => {
    /* ถ้ายัด children ทั้งก้อนลง RACTabList จะได้ panel อยู่ในแถบ tab
       ผิด ARIA และ panel ไป render ในแถบ — แต่**ยัง render ได้** จึงเงียบ */
    render(<TabHarness />);
    const tablist = screen.getByRole('tablist');
    expect(tablist.querySelector('[role="tabpanel"]')).toBeNull();
  });

  it('★★★ panel ที่ไม่ได้เลือก**ไม่อยู่ใน DOM** — ไม่ใช่ซ่อนด้วย CSS', () => {
    render(<TabHarness />);
    /* นี่คือเส้นแบ่งกับ SegmentedControl · ถ้าซ่อนด้วย CSS ผู้ใช้ screen
       reader จะยังอ่านเนื้อหาที่ไม่ได้เลือกเจอ */
    expect(screen.getByText('เครื่องคั่วกาแฟขนาด 5 กิโลกรัม')).toBeTruthy();
    expect(screen.queryByText('กำลังไฟ 3,500 วัตต์')).toBeNull();
  });

  it('RAC ต่อ aria-controls / aria-labelledby ให้เอง', () => {
    render(<TabHarness />);
    const tab = screen.getByRole('tab', { name: 'รายละเอียด' });
    const panel = screen.getByRole('tabpanel');
    /* นี่คือเหตุผลที่ไม่ทำแถบเปล่าแบบ Astryx — ผู้เรียกจะลืมต่อ id */
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
  });

  it('tab ที่เลือกได้ aria-selected — ไม่พึ่งเส้นใต้เป็นตัวบอกเดียว (SC 1.4.1)', () => {
    render(<TabHarness />);
    expect(
      screen.getByRole('tab', { name: 'รายละเอียด' }).getAttribute('aria-selected'),
    ).toBe('true');
    expect(screen.getByRole('tab', { name: 'สเปก' }).getAttribute('aria-selected')).toBe(
      'false',
    );
  });

  it('★★ กด tab แล้วเปลี่ยน panel', async () => {
    render(<TabHarness />);
    await userEvent.click(screen.getByRole('tab', { name: 'สเปก' }));
    expect(screen.getByText('กำลังไฟ 3,500 วัตต์')).toBeTruthy();
    expect(screen.queryByText('เครื่องคั่วกาแฟขนาด 5 กิโลกรัม')).toBeNull();
  });

  it('★★ ลูกศรขวาเลื่อน tab ตาม WAI-ARIA APG — RAC ให้มาเอง', async () => {
    render(<TabHarness />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'รายละเอียด' }));

    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'สเปก' }));
  });

  it('★ แถบ tab กิน tab stop เดียว (roving tabindex) ไม่ใช่สามอัน', async () => {
    render(<TabHarness />);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'รายละเอียด' })).toBe(document.activeElement);
    /* Tab ครั้งที่สองต้องออกจากแถบไปที่ panel ไม่ใช่ไป tab อันถัดไป */
    await userEvent.tab();
    expect(screen.getAllByRole('tab')).not.toContain(document.activeElement);
  });

  it('isLabelHidden เหลือแต่ไอคอน แต่ยังมี accessible name', () => {
    render(
      <TabList value="a" onChange={() => {}} label="มุมมอง">
        <Tab value="a" label="ตาราง" isLabelHidden icon={<Icon name="layout-grid" size={20} />} />
        <TabPanel value="a">เนื้อหา</TabPanel>
      </TabList>,
    );
    const tab = screen.getByRole('tab', { name: 'ตาราง' });
    expect(tab.textContent).not.toContain('ตาราง');
  });

  it('endContent แสดงจำนวนได้ และไม่กลืน accessible name ของ tab', () => {
    render(<TabHarness />);
    /* ชื่อ tab รวม endContent ด้วยเพราะเป็นเนื้อหาในปุ่ม — ต้องยังหา
       ด้วยชื่อหลักได้ (SC 2.5.3 · ชื่อที่เห็นเป็นส่วนหนึ่งของชื่อที่ประกาศ) */
    expect(screen.getByRole('tab', { name: /รีวิว/ })).toBeTruthy();
  });

  it('★ tab ที่ปิดใช้งานกดไม่ได้', async () => {
    const onChange = vi.fn();
    render(
      <TabList value="a" onChange={onChange} label="ทดสอบ">
        <Tab value="a" label="หนึ่ง" />
        <Tab value="b" label="สอง" isDisabled />
        <TabPanel value="a">เนื้อหา ก</TabPanel>
        <TabPanel value="b">เนื้อหา ข</TabPanel>
      </TabList>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'สอง' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('★ ขนาดกำหนดจากพ่อแม่ — ใช้ min-h ไม่ใช่ h (SC 1.4.12)', () => {
    render(
      <TabList value="a" onChange={() => {}} label="ทดสอบ" size="md">
        <Tab value="a" label="หนึ่ง" />
        <TabPanel value="a">x</TabPanel>
      </TabList>,
    );
    const cls = screen.getByRole('tablist').className;
    expect(cls).toContain('[&>*]:min-h-11');
    expect(cls).not.toMatch(/(?<![\w-[])h-\d/);
  });
});

describe('SegmentedControl', () => {
  function SegHarness() {
    const [view, setView] = useState('grid');
    return (
      <SegmentedControl value={view} onChange={setView} label="รูปแบบการแสดงผล">
        <SegmentedControlItem value="grid" label="ตาราง" />
        <SegmentedControlItem value="list" label="รายการ" />
      </SegmentedControl>
    );
  }

  it('ไม่มี axe violation', async () => {
    const { container } = render(<SegHarness />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★★ เป็น radiogroup ไม่ใช่ tablist — ไม่มี panel ให้ควบคุม', () => {
    render(<SegHarness />);
    expect(screen.getByRole('radiogroup', { name: 'รูปแบบการแสดงผล' })).toBeTruthy();
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByRole('tabpanel')).toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('★★ label เป็น aria-label ที่**ไม่แสดงด้วยตา** — ต่างจาก RadioList', () => {
    const { container } = render(<SegHarness />);
    expect(screen.getByRole('radiogroup').getAttribute('aria-label')).toBe(
      'รูปแบบการแสดงผล',
    );
    /* RadioList แสดง label เป็นข้อความเพราะเป็นคำถามในฟอร์ม · ตัวนี้ไม่ใช่ */
    expect(container.textContent).not.toContain('รูปแบบการแสดงผล');
  });

  it('ตัวที่เลือกอยู่บอกสถานะผ่าน `checked` ของ input จริง (SC 1.4.1)', () => {
    render(<SegHarness />);
    /* ⚠️ RAC `Radio` render เป็น `<input type="radio">` จริง ไม่ใช่ div ที่มี
       `role="radio"` — สถานะจึงอยู่ที่ property `checked` **ไม่มี**
       `aria-checked` (native input ไม่ต้องมี) เหมือน `Switch` ในระบบนี้ */
    const grid = screen.getByRole('radio', { name: 'ตาราง' }) as HTMLInputElement;
    const list = screen.getByRole('radio', { name: 'รายการ' }) as HTMLInputElement;
    expect(grid.checked).toBe(true);
    expect(list.checked).toBe(false);
  });

  it('★★ กดแล้วเปลี่ยนค่าทันที ไม่มีปุ่มยืนยัน', async () => {
    render(<SegHarness />);
    await userEvent.click(screen.getByRole('radio', { name: 'รายการ' }));
    expect((screen.getByRole('radio', { name: 'รายการ' }) as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it('★ ลูกศรเลื่อนแล้วเลือกทันที (roving tabindex เหมือน RadioList)', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl value="grid" onChange={onChange} label="มุมมอง">
        <SegmentedControlItem value="grid" label="ตาราง" />
        <SegmentedControlItem value="list" label="รายการ" />
      </SegmentedControl>,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('★ ตัวที่เลือกไม่ใช้พื้นทึบน้ำเงิน — สงวนให้ CTA (ข้อ 05)', () => {
    render(<SegHarness />);
    /* ⚠️ className ไปอยู่ที่ `<label>` ที่ห่อ input ไม่ใช่ที่ input เอง
       (RAC ซ่อน input ไว้ข้างในแล้วให้ label เป็นตัวที่มองเห็น) */
    const wrapper = screen
      .getByRole('radio', { name: 'ตาราง' })
      .closest('label') as HTMLLabelElement;
    expect(wrapper.className).toContain('data-selected:bg-surface');
    expect(wrapper.className).not.toContain('bg-primary-600');
  });

  it('isLabelHidden เหลือแต่ไอคอน แต่ยังมี accessible name', () => {
    render(
      <SegmentedControl value="grid" onChange={() => {}} label="มุมมอง">
        <SegmentedControlItem
          value="grid"
          label="ตาราง"
          isLabelHidden
          icon={<Icon name="layout-grid" size={20} />}
        />
        <SegmentedControlItem
          value="list"
          label="รายการ"
          isLabelHidden
          icon={<Icon name="list" size={20} />}
        />
      </SegmentedControl>,
    );
    expect(screen.getByRole('radio', { name: 'ตาราง' }).textContent).not.toContain('ตาราง');
  });

  it('item ที่ปิดใช้งานกดไม่ได้', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl value="a" onChange={onChange} label="ทดสอบ">
        <SegmentedControlItem value="a" label="หนึ่ง" />
        <SegmentedControlItem value="b" label="สอง" isDisabled />
      </SegmentedControl>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'สอง' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('★ ขนาดกำหนดจากพ่อแม่ — item ในรางเดียวกันสูงเท่ากันเสมอ', () => {
    render(
      <SegmentedControl value="a" onChange={() => {}} label="ทดสอบ" size="lg">
        <SegmentedControlItem value="a" label="หนึ่ง" />
      </SegmentedControl>,
    );
    expect(screen.getByRole('radiogroup').className).toContain('[&>*]:min-h-12');
  });
});

describe('เส้นแบ่ง TabList ↔ SegmentedControl', () => {
  it('★★★ TabList เอาเนื้อหาออกจาก DOM · SegmentedControl ไม่มีเนื้อหาเลย', () => {
    const { container: tabs } = render(
      <TabList value="a" onChange={() => {}} label="t">
        <Tab value="a" label="ก" />
        <Tab value="b" label="ข" />
        <TabPanel value="a">เนื้อหา ก</TabPanel>
        <TabPanel value="b">เนื้อหา ข</TabPanel>
      </TabList>,
    );
    /* TabList เป็นเจ้าของเนื้อหา และตัดที่ไม่ได้เลือกออกจาก DOM */
    expect(tabs.textContent).toContain('เนื้อหา ก');
    expect(tabs.textContent).not.toContain('เนื้อหา ข');

    const { container: seg } = render(
      <SegmentedControl value="a" onChange={() => {}} label="s">
        <SegmentedControlItem value="a" label="ก" />
        <SegmentedControlItem value="b" label="ข" />
      </SegmentedControl>,
    );
    /* SegmentedControl ไม่มี panel — ผู้เรียกจัดการเนื้อหาเอง
       จึงไม่มี aria-controls ไปที่ไหน */
    expect(seg.querySelector('[aria-controls]')).toBeNull();
  });
});
