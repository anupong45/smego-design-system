import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, expectNoViolations } from './render';
import { Table, EmptyState, IconButton, type TableColumn } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Table
   ───────────────────────────────────────────────────────────────────────────
   ★ ใช้ `<table>` ปกติ ไม่ใช่ RAC Table (วัดแล้ว +44 KB gzip แลกกับของที่
   ขอบเขตตัดออก) จึงต้องทดสอบ semantic ที่ปกติ RAC จัดการให้เอง
   ═══════════════════════════════════════════════════════════════════════════ */

interface Order {
  id: string;
  product: string;
  amount: number;
  status: string;
}

const ROWS: Order[] = [
  { id: 'o1', product: 'เครื่องคั่วกาแฟ TR-500', amount: 185_000, status: 'รอชำระเงิน' },
  { id: 'o2', product: 'ผ้าฝ้ายทอมือ', amount: 12_400, status: 'จัดส่งแล้ว' },
];

const COLUMNS: TableColumn<Order>[] = [
  { key: 'product', header: 'สินค้า', isSortable: true },
  {
    key: 'amount',
    header: 'ยอดรวม',
    align: 'end',
    isSortable: true,
    render: (r) => <span className="font-numeric">{r.amount.toLocaleString('en-US')}</span>,
  },
  { key: 'status', header: 'สถานะ' },
];

function Fixture(props: Partial<React.ComponentProps<typeof Table<Order>>> = {}) {
  return (
    <Table
      label="คำสั่งซื้อของฉัน"
      columns={COLUMNS}
      rows={ROWS}
      rowKey={(r) => r.id}
      {...props}
    />
  );
}

describe('Table · semantic ของตาราง', () => {
  it('ไม่มี axe violation', async () => {
    const { container } = render(<Fixture />);
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('เป็นตารางที่มีชื่อ · มีหัวคอลัมน์ครบ', () => {
    render(<Fixture />);
    const table = screen.getByRole('table', { name: 'คำสั่งซื้อของฉัน' });
    expect(within(table).getAllByRole('columnheader').length).toBe(3);
    /* 1 หัวตาราง + 2 แถวข้อมูล */
    expect(within(table).getAllByRole('row').length).toBe(3);
  });

  it('★★★ role เขียนครบทุกชั้น — ห้ามลบ', () => {
    const { container } = render(<Fixture />);
    /* ★★★ Safari/VoiceOver **ทิ้ง semantic ของตาราง** เมื่อ `display` ถูก
       เปลี่ยน ซึ่งเกิดจริงที่ <lg ตอนแถวกลายเป็นการ์ด (`max-lg:grid`)
       role ที่เขียนไว้จึงเป็นสิ่งเดียวที่ทำให้ตารางยังเป็นตาราง
       — เหตุผลเดียวกับที่ CompareTable เขียน role ไว้ทุกตัว */
    expect(container.querySelector('table')?.getAttribute('role')).toBe('table');
    expect(container.querySelector('thead')?.getAttribute('role')).toBe('rowgroup');
    expect(container.querySelector('tbody')?.getAttribute('role')).toBe('rowgroup');
    expect(container.querySelector('tr')?.getAttribute('role')).toBe('row');
    expect(container.querySelector('th')?.getAttribute('role')).toBe('columnheader');
    expect(container.querySelector('td')?.getAttribute('role')).toBe('cell');
  });

  it('หัวคอลัมน์มี scope="col"', () => {
    const { container } = render(<Fixture />);
    for (const th of Array.from(container.querySelectorAll('th'))) {
      expect(th.getAttribute('scope')).toBe('col');
    }
  });

  it('★ ที่ <lg ชื่อคอลัมน์กลับมาผ่าน data-label', () => {
    const { container } = render(<Fixture />);
    /* thead ถูกซ่อนที่ <lg (`max-lg:hidden`) — ถ้าไม่มี data-label
       การ์ดจะเหลือแต่ตัวเลขลอย ๆ ที่ไม่บอกว่าเป็นอะไร */
    const cells = Array.from(container.querySelectorAll('tbody td'));
    expect(cells.map((c) => c.getAttribute('data-label'))).toEqual([
      'สินค้า', 'ยอดรวม', 'สถานะ',
      'สินค้า', 'ยอดรวม', 'สถานะ',
    ]);
  });
});

describe('Table · การเรียงลำดับ', () => {
  it('★★ aria-sort อยู่ที่ <th> ไม่ใช่ที่ปุ่ม', () => {
    const { container } = render(
      <Fixture sortBy="amount" sortDirection="descending" onSortChange={() => {}} />,
    );
    const ths = Array.from(container.querySelectorAll('th'));
    /* ★★ ARIA กำหนดว่า `aria-sort` เป็นคุณสมบัติของหัวคอลัมน์
       ใส่ที่ปุ่มข้างในแทน screen reader จะไม่ประกาศสถานะการเรียงเลย */
    expect(ths[1]!.getAttribute('aria-sort')).toBe('descending');
    expect(ths[0]!.getAttribute('aria-sort')).toBeNull();
    expect(ths[2]!.getAttribute('aria-sort')).toBeNull();
  });

  it('★ ชื่อปุ่มบอกสิ่งที่จะเกิด ไม่ใช่สถานะปัจจุบัน', () => {
    render(<Fixture sortBy="product" sortDirection="ascending" onSortChange={() => {}} />);
    /* กำลังเรียงน้อย→มาก · กดอีกครั้งต้องได้มาก→น้อย จึงต้องประกาศอย่างนั้น
       สถานะปัจจุบันอยู่ใน aria-sort แล้ว ถ้าปุ่มบอกซ้ำจะได้ยินสองครั้ง */
    expect(
      screen.getByRole('button', { name: 'เรียงตาม สินค้า จากมากไปน้อย' }),
    ).toBeTruthy();
  });

  it('กดสลับทิศทาง และส่ง key กับทิศทางที่ถูก', async () => {
    const user = userEvent.setup();
    const calls: [string, string][] = [];
    render(
      <Fixture
        sortBy="product"
        sortDirection="ascending"
        onSortChange={(k, d) => calls.push([k, d])}
      />,
    );
    await user.click(screen.getByRole('button', { name: /เรียงตาม สินค้า/ }));
    expect(calls).toEqual([['product', 'descending']]);

    /* คอลัมน์ที่ยังไม่ได้เรียง ต้องเริ่มจากน้อยไปมาก */
    await user.click(screen.getByRole('button', { name: /เรียงตาม ยอดรวม/ }));
    expect(calls[1]).toEqual(['amount', 'ascending']);
  });

  it('คอลัมน์ที่ไม่ sortable ไม่มีปุ่ม', () => {
    render(<Fixture onSortChange={() => {}} />);
    /* "สถานะ" ไม่ได้ตั้ง isSortable — ต้องเป็นข้อความเปล่า ไม่ใช่ปุ่มที่กดไม่ได้ */
    expect(screen.queryByRole('button', { name: /เรียงตาม สถานะ/ })).toBeNull();
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  it('ไม่ส่ง onSortChange = ไม่มีปุ่มเรียงเลย', () => {
    render(<Fixture />);
    expect(screen.queryAllByRole('button').length).toBe(0);
  });

  it('★★ ตัวชี้การเรียงเป็นรูปทรง ไม่ใช่สี (SC 1.4.1)', () => {
    const { container: asc } = render(
      <Fixture sortBy="amount" sortDirection="ascending" onSortChange={() => {}} />,
    );
    const up = asc.querySelectorAll('th svg').length;
    expect(up, 'คอลัมน์ที่เรียงต้องมีไอคอนลูกศร').toBe(1);
  });
});

describe('Table · คำสั่งต่อแถว', () => {
  it('★★ คำสั่งอยู่ในเซลล์ของตัวเอง — ไม่ใช่แถวที่กดได้ทั้งแถว', () => {
    const { container } = render(
      <Fixture
        rowAction={(r) => <IconButton name="more-vertical" label={`คำสั่งสำหรับ ${r.product}`} />}
      />,
    );
    /* ★★ แถวที่กดได้ทั้งแถวเป็นกับดัก: SR ไม่รู้ว่ากดได้ · คีย์บอร์ดต้อง Tab
       ผ่านทุกแถว · และการลากเลือกข้อความกลายเป็นการกด */
    for (const tr of Array.from(container.querySelectorAll('tbody tr'))) {
      expect(tr.getAttribute('onclick')).toBeNull();
      expect(tr.getAttribute('tabindex')).toBeNull();
      expect(tr.getAttribute('role')).toBe('row');
    }
    /* ปุ่มต้องบอกว่าเป็นของแถวไหน ไม่ใช่ "เพิ่มเติม" ลอย ๆ */
    expect(
      screen.getByRole('button', { name: 'คำสั่งสำหรับ เครื่องคั่วกาแฟ TR-500' }),
    ).toBeTruthy();
  });

  it('★ คอลัมน์คำสั่งมีหัวข้อจริง ไม่ปล่อยว่าง', () => {
    render(<Fixture rowAction={() => <span>x</span>} />);
    const table = screen.getByRole('table');
    /* คอลัมน์ไม่มีชื่อทำให้ SR อ่านว่า "column 4" เปล่า ๆ */
    expect(within(table).getByRole('columnheader', { name: 'คำสั่ง' })).toBeTruthy();
  });

  it('ไม่มี rowAction = ไม่มีคอลัมน์เกิน', () => {
    render(<Fixture />);
    expect(screen.getAllByRole('columnheader').length).toBe(3);
  });
});

describe('Table · ว่างเปล่า', () => {
  it('★ rows ว่างแล้วไม่ส่ง emptyState = ไม่ render อะไรเลย', () => {
    const { container } = render(<Fixture rows={[]} />);
    /* หัวคอลัมน์ลอย ๆ ทำให้ผู้ใช้รอว่าข้อมูลกำลังโหลดหรือไม่มีจริง */
    expect(container.querySelector('table')).toBeNull();
  });

  it('rows ว่างแล้วส่ง emptyState = แสดงตัวนั้น', () => {
    render(
      <Fixture
        rows={[]}
        emptyState={<EmptyState title="ยังไม่มีคำสั่งซื้อ" />}
      />,
    );
    expect(screen.getByText('ยังไม่มีคำสั่งซื้อ')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });
});
