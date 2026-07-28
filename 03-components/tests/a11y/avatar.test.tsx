import { describe, it, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { render, expectNoViolations } from './render';
import { Avatar, initialsFromName, Badge } from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   เฟส 5 · Avatar
   ───────────────────────────────────────────────────────────────────────────
   หัวใจของเทสชุดนี้คือ **ตัวย่อจากชื่อไทย** ซึ่งพังได้สองแบบและเงียบทั้งคู่:
   สระ/วรรณยุกต์หลุดจากการตัดสตริงดิบ · ผู้ขายไทยได้ตัวย่อเดียวกันหมดเพราะ
   ชื่อขึ้นต้นด้วยคำบอกประเภทกิจการ
   ═══════════════════════════════════════════════════════════════════════════ */

describe('Avatar · ตัวย่อจากชื่อไทย', () => {
  it('★★★ ไม่ตัดสระหรือวรรณยุกต์ทิ้ง — ต้องได้ grapheme cluster ทั้งก้อน', () => {
    /* ค่าที่วัดจริง: "กำแพงเพชร"[0] = "ก" (สระ ำ หลุด)
                     "ห้างหุ้นส่วน…"[0] = "ห" (วรรณยุกต์ ้ หลุด) */
    expect(initialsFromName('กำแพงเพชรอาหารสัตว์')).toBe('กำ');
    expect(initialsFromName('ห้างทองไทยเจริญ')).toBe('ห้');

    /* พิสูจน์ว่าต่างจากการตัดดิบจริง ไม่ใช่เทสที่ผ่านโดยบังเอิญ */
    expect(initialsFromName('กำแพงเพชรอาหารสัตว์')).not.toBe('กำแพงเพชรอาหารสัตว์'[0]);
  });

  it('★★★ ตัดคำบอกประเภทกิจการก่อน — ไม่งั้นผู้ขายไทยได้ตัวย่อเดียวกันหมด', () => {
    /* ถ้าไม่ตัด "บริษัท" ทุกรายจะได้ "บ" และ avatar จะแยกกันไม่ออก */
    expect(initialsFromName('บริษัท ไทยโรสเตอร์ จำกัด')).toBe('ไ');
    expect(initialsFromName('ห้างหุ้นส่วนจำกัด สมชายการค้า')).toBe('ส');
    expect(initialsFromName('บจก. เชียงใหม่ฟู้ดส์')).toBe('เ');
    expect(initialsFromName('หจก. ขอนแก่นเกษตร')).toBe('ข');
    expect(initialsFromName('ร้านกาแฟดอยคำ')).toBe('ก');
  });

  it('★ สองผู้ขายที่ขึ้นต้นด้วย "บริษัท" ต้องได้ตัวย่อ**ต่างกัน**', () => {
    const a = initialsFromName('บริษัท ไทยโรสเตอร์ จำกัด');
    const b = initialsFromName('บริษัท ขอนแก่นเกษตร จำกัด');
    expect(a).not.toBe(b);
  });

  it('เรียงคำบอกประเภทจากยาวไปสั้น — "ห้างหุ้นส่วนจำกัด" ต้องชนก่อน "ห้างหุ้นส่วน"', () => {
    /* ถ้าเรียงผิด จะเหลือ "จำกัด สมชาย…" แล้วได้ "จ" */
    expect(initialsFromName('ห้างหุ้นส่วนจำกัด สมชายการค้า')).not.toBe('จ');
  });

  it('ชื่อที่เป็นคำบอกประเภทล้วน ไม่คืนค่าว่าง', () => {
    expect(initialsFromName('บริษัท')).toBe('บ');
    /* "ร้าน" → "ร้" ไม่ใช่ "ร" — วรรณยุกต์ ้ อยู่ใน cluster เดียวกับ ร
       ("ร" เฉย ๆ คือคำตอบของการตัดดิบซึ่งเป็นบั๊กที่ component นี้กันไว้) */
    expect(initialsFromName('ร้าน')).toBe('ร้');
  });

  it('ชื่อฝรั่งได้สองตัวย่อ และตัดคำต่อท้ายอย่าง Co./Ltd. ออก', () => {
    expect(initialsFromName('Thai Roaster Co.')).toBe('TR');
    expect(initialsFromName('Bangkok Coffee Limited')).toBe('BC');
    expect(initialsFromName('Acme')).toBe('A');
  });

  it('ชื่อว่างหรือช่องว่างล้วนไม่ทำให้พัง', () => {
    expect(initialsFromName('')).toBe('');
    expect(initialsFromName('   ')).toBe('');
  });
});

describe('Avatar · a11y', () => {
  it('ไม่มี axe violation ทุกทางถอย', async () => {
    const { container } = render(
      <>
        <Avatar src="/logo.png" alt="โลโก้ บริษัท ไทยโรสเตอร์" />
        <Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" />
        <Avatar />
        <Avatar name="ไทยโรสเตอร์" status={<Badge variant="success" label="ยืนยันแล้ว" />} />
      </>,
    );
    const results = await expectNoViolations(container);
    expect(results.violations).toEqual([]);
  });

  it('★★ ค่าเริ่มต้นเป็นของตกแต่ง — ไม่ประกาศชื่อซ้ำกับหัวข้อที่อยู่ข้าง ๆ', () => {
    const { container } = render(
      <>
        <Avatar src="/logo.png" name="บริษัท ไทยโรสเตอร์ จำกัด" />
        <h3>บริษัท ไทยโรสเตอร์ จำกัด</h3>
      </>,
    );
    /* alt ต้องเป็น "" ไม่ใช่ name — ไม่งั้นได้ยินชื่อสองครั้งติดกัน */
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('ส่ง alt เองได้เมื่อ avatar อยู่โดยไม่มีชื่อใกล้ ๆ', () => {
    render(<Avatar src="/logo.png" alt="โลโก้ ไทยโรสเตอร์" />);
    expect(screen.getByAltText('โลโก้ ไทยโรสเตอร์')).toBeTruthy();
  });

  it('ตัวย่อเป็น aria-hidden — ผู้ใช้ SR ต้องไม่ได้ยิน "ไ" ลอย ๆ', () => {
    render(<Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" />);
    const initials = screen.getByText('ไ');
    expect(initials.getAttribute('aria-hidden')).toBe('true');
  });

  it('★ alt ยังประกาศแม้ไม่มีรูป — ผู้เรียกที่ส่ง alt ต้องไม่เสียข้อมูล', () => {
    render(<Avatar name="ไทยโรสเตอร์" alt="โลโก้ ไทยโรสเตอร์" />);
    /* ไม่มี src เลย → ตัวย่อ + sr-only alt */
    expect(screen.getByText('โลโก้ ไทยโรสเตอร์').className).toContain('sr-only');
  });

  it('ไม่มีทั้ง src และ name → ไอคอน building (ไม่ใช่ user — ผู้ขายเป็นนิติบุคคล)', () => {
    const { container } = render(<Avatar />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    /* registry ไม่มี `user` — ถ้าใครเปลี่ยนไปใช้ จะได้ undefined เงียบ ๆ */
    expect(svg.getAttribute('width')).toBeTruthy();
  });
});

describe('Avatar · ทางถอยเมื่อรูปพัง', () => {
  it('★★ src พัง → ใช้ fallbackSrc', () => {
    const { container } = render(
      <Avatar src="/broken.png" fallbackSrc="/backup.png" name="ไทยโรสเตอร์" />,
    );
    const img = container.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('/broken.png');

    fireEvent.error(img);

    expect(container.querySelector('img')?.getAttribute('src')).toBe('/backup.png');
  });

  it('★★ พังทั้งคู่ → ถอยไปตัวย่อ ไม่ใช่กล่องเปล่า', () => {
    const { container } = render(
      <Avatar src="/broken.png" fallbackSrc="/also-broken.png" name="บริษัท ไทยโรสเตอร์ จำกัด" />,
    );

    fireEvent.error(container.querySelector('img')!);
    fireEvent.error(container.querySelector('img')!);

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('ไ')).toBeTruthy();
  });

  it('พังหมดและไม่มี name → ไอคอน ไม่ใช่กล่องเปล่า', () => {
    const { container } = render(<Avatar src="/broken.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

describe('Avatar · status', () => {
  it('★★ status ต้องไม่ถูกตัด — overflow-hidden อยู่ชั้นในไม่ใช่ชั้นนอก', () => {
    const { container } = render(
      <Avatar name="ไทยโรสเตอร์" status={<Badge variant="success" label="ยืนยันแล้ว" />} />,
    );
    const root = container.firstElementChild as HTMLElement;
    /* ถ้า overflow-hidden ขึ้นมาอยู่ชั้นนอก ป้ายที่วางล้นขอบจะหายทั้งอัน */
    expect(root.className).not.toContain('overflow-hidden');
    expect(screen.getByText('ยืนยันแล้ว')).toBeTruthy();
  });

  it('ใช้ -end-* ไม่ใช่ -right-* เพื่อให้กลับด้านได้', () => {
    const { container } = render(<Avatar name="ก" status={<span>•</span>} />);
    const html = container.innerHTML;
    expect(html).toContain('-end-');
    expect(html).not.toContain('-right-');
  });
});
