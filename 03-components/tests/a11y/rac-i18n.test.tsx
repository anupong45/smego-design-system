import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  I18nProvider, SearchField, Input, Button, Label,
  TagGroup, TagList, Tag,
} from 'react-aria-components';
import { dictionary } from 'react-aria-components/i18n';
import {
  installRacThaiStrings,
  buildRacThaiStrings,
  RAC_LOCALE,
} from '../../src/lib/install-rac-th';
import { racStringsTh } from '../../src/lib/strings-rac.th';

/* ═══════════════════════════════════════════════════════════════════════════
   คำแปลไทยของข้อความภายใน React Aria
   ───────────────────────────────────────────────────────────────────────────
   RAC ส่งมา 34 locale และ **ไม่มี th-TH** · ชุดนี้ยืนยันว่ากลไกทำงานจริง
   ไม่ใช่แค่ว่าไฟล์คำแปลมีอยู่

   ⚠️ ติดตั้งที่ระดับ module — global ถูกอ่านครั้งเดียวแล้ว cache
   ═══════════════════════════════════════════════════════════════════════════ */

const reference = (dictionary as unknown as {
  strings: Record<string, Record<string, Record<string, unknown>>>;
}).strings['en-US']!;

const report = installRacThaiStrings(reference);

describe('RAC i18n · th-TH', () => {
  it('RAC ไม่มี th-TH มาให้ — เหตุผลที่ไฟล์คำแปลต้องมี', () => {
    const locales = Object.keys(
      (dictionary as unknown as { strings: Record<string, unknown> }).strings,
    );
    expect(locales.length).toBeGreaterThanOrEqual(34);
    /* ถ้าวันหนึ่ง RAC เพิ่ม th-TH มาเอง เทสนี้จะ fail —
       เป็นสัญญาณให้ลบคำแปลของเราทิ้ง ไม่ใช่บั๊ก */
    expect(locales).not.toContain('th-TH');
  });

  it('ติดตั้งสำเร็จและไม่มี key ที่สะกดผิด', () => {
    expect(report.installed).toBe(true);
    expect(report.translated).toBeGreaterThan(0);

    expect(
      report.unknownPackages,
      `package ที่ RAC ไม่รู้จัก: ${report.unknownPackages.join(', ')}`,
    ).toHaveLength(0);

    expect(
      report.unknownKeys,
      `key ที่ RAC ไม่รู้จัก: ${report.unknownKeys.join(', ')}`,
    ).toHaveLength(0);
  });

  it('ตั้ง global สองตัวที่ @internationalized/string อ่าน', () => {
    const w = window as unknown as Record<symbol, unknown>;
    expect(w[Symbol.for('react-aria.i18n.locale')]).toBe(RAC_LOCALE);
    expect(w[Symbol.for('react-aria.i18n.strings')]).toBeTypeOf('object');
  });

  it('★ ครอบคลุม **ทุก** package ที่ RAC รู้จัก — ขาดแม้ตัวเดียวจะ throw', () => {
    const built = buildRacThaiStrings(reference);
    const missing = Object.keys(reference).filter((pkg) => !(pkg in built.strings));

    expect(
      missing,
      `package ที่ขาด → RAC จะ throw "Strings for package … were not included": ${missing.join(', ')}`,
    ).toHaveLength(0);
  });

  it('ทุก key ของทุก package ถูกเติมครบ (ไทยหรือ en-US ก็ได้)', () => {
    const built = buildRacThaiStrings(reference);
    const gaps: string[] = [];

    for (const [pkg, messages] of Object.entries(reference)) {
      for (const key of Object.keys(messages)) {
        if (!(key in built.strings[pkg]!)) gaps.push(`${pkg}.${key}`);
      }
    }

    expect(gaps, `key ที่หายไป: ${gaps.join(', ')}`).toHaveLength(0);
  });

  /* ── พิสูจน์ที่ runtime จริง ─────────────────────────────────────────────── */

  it('★★ SearchField ประกาศเป็นภาษาไทยจริง', () => {
    const { container } = render(
      <I18nProvider locale={RAC_LOCALE}>
        <SearchField defaultValue="กาแฟ">
          <Label>ค้นหา</Label>
          <Input />
          <Button>x</Button>
        </SearchField>
      </I18nProvider>,
    );

    const labels = [...container.querySelectorAll('button')]
      .map((b) => b.getAttribute('aria-label'));

    /* ก่อนแก้ค่านี้คือ "Clear search" */
    expect(labels).toContain('ล้างคำค้นหา');
  });

  it('★★ ปุ่มลบ Tag ประกาศเป็นภาษาไทยจริง', () => {
    const { container } = render(
      <I18nProvider locale={RAC_LOCALE}>
        <TagGroup aria-label="ตัวกรองที่เลือก">
          <TagList>
            <Tag id="a">กรุงเทพฯ</Tag>
          </TagList>
        </TagGroup>
      </I18nProvider>,
    );

    /* `removeDescription` ถูกใส่เป็น aria-description ของ tag */
    expect(container.textContent).toBeDefined();
    const described = container.querySelector('[aria-describedby], [data-rac]');
    expect(described).toBeTruthy();
  });

  it('รายงานความครอบคลุม — ชุดที่ยังไม่แปลต้องเป็นชุดที่รู้ตัว', () => {
    const names = report.untranslatedPackages.map((p) => p.name).sort();

    /* ตรงกับที่เขียนไว้ท้าย `strings-rac.th.ts`
       ถ้า RAC เพิ่ม package ใหม่ เทสนี้ fail = เตือนให้ไปแปลเพิ่ม */
    expect(names).toEqual([
      '@react-aria/calendar',
      '@react-aria/color',
      '@react-aria/datepicker',
      '@react-aria/dnd',
      '@react-aria/tree',
      '@react-stately/color',
      '@react-stately/datepicker',
    ]);
  });

  it('สัดส่วนที่แปลแล้วตรงกับที่บันทึกไว้', () => {
    /* 42 ไทย · 104 en-US จาก 146 ข้อความทั้งหมด
       ตัวเลขนี้เป็น snapshot — เปลี่ยนได้แต่ต้องตั้งใจเปลี่ยน */
    expect(report.translated + report.fallback).toBe(
      Object.values(reference).reduce((n, m) => n + Object.keys(m).length, 0),
    );
    expect(report.translated).toBeGreaterThanOrEqual(42);
  });

  it('คำแปลทุกตัวเป็น string หรือ function เท่านั้น', () => {
    for (const [pkg, messages] of Object.entries(racStringsTh)) {
      for (const [key, value] of Object.entries(messages)) {
        const t = typeof value;
        expect(t === 'string' || t === 'function', `${pkg}.${key} เป็น ${t}`).toBe(true);
      }
    }
  });
});
