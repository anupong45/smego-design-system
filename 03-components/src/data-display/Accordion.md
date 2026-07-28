# Accordion · AccordionItem

**`@smego/ui`** · ชั้น 03 · [Accordion.tsx](./Accordion.tsx)

---

## 1 · ภาพรวม

ย่อ/ขยายเนื้อหาเป็นกลุ่ม — ใช้กับ **คำถามที่พบบ่อย · เงื่อนไขโครงการ · กลุ่มตัวกรอง**

component นี้มีความขัดแย้งทางเทคนิคที่ต้องแก้ตรง ๆ: **เทคนิค animate ความสูงต้องการ `overflow: hidden` ซึ่งตัดวงแหวน focus**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| เนื้อหาที่ผู้ใช้ต้องอ่านทุกคน | แสดงเลย | ซ่อนไว้ = คนส่วนใหญ่ไม่เปิด |
| สลับมุมมองของข้อมูลเดียวกัน | `<Tabs>` (Pass 4) | accordion เปิดหลายอันพร้อมกันได้ |
| ขั้นตอนที่ต้องทำตามลำดับ | `<Stepper>` (Pass 4) | accordion ไม่บอกความคืบหน้า |
| เนื้อหาชิ้นเดียว | แสดงเลย หรือ `<Disclosure>` เดี่ยว | กลุ่มที่มีสมาชิกเดียวไม่ใช่กลุ่ม |
| ข้อมูลสำคัญต่อการตัดสินใจซื้อ | แสดงเลย | ราคาและเงื่อนไขห้ามซ่อน |

---

## 2 · React API

```tsx
import { Accordion, AccordionItem } from '@smego/ui';

<Accordion allowsMultipleExpanded defaultExpandedKeys={['a']}>
  <AccordionItem id="a" title="คุณสมบัติผู้สมัคร">…</AccordionItem>
</Accordion>
```

### AccordionItem

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `id` | `Key` | — | **บังคับเมื่ออยู่ในกลุ่ม** |
| `title` | `ReactNode` | — | หัวข้อในปุ่ม |
| `children` | `ReactNode` | — | เนื้อหาใน panel |
| `headingLevel` | `2 \| 3 \| 4 \| 5` | `3` | **ต้องตรงกับลำดับจริงในหน้า** |
| `isExpanded` / `defaultExpanded` | `boolean` | — | จาก RAC |
| `isDisabled` | `boolean` | `false` | |

### Accordion

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `allowsMultipleExpanded` | `boolean` | จาก RAC | **ควรเปิดสำหรับตัวกรอง** |
| `expandedKeys` / `defaultExpandedKeys` | `Iterable<Key>` | — | |
| `onExpandedChange` | `(keys: Set<Key>) => void` | — | |

---

## 3 · Variants

Accordion ไม่มี variant — เส้นคั่นระหว่างรายการมาจาก `border-b border-edge-subtle last:border-b-0`

| ส่วน | ค่า |
|---|---|
| ปุ่มหัวข้อ | `py-4` · `text-body-sm text-fg` · เต็มความกว้าง |
| ความสูงปุ่ม | วัดได้ **56px** (24 lh + 32 padding) |
| hover | `text-link` |
| ไอคอน | `chevron-down` 20px · หมุน 180° ตอนเปิด |
| panel | `text-body-sm text-fg-secondary` · `pb-4` |

### ★ เป้ากดคือ **ทั้งแถว** — 56px สูง

เกินเกณฑ์ 24×24 มาก และตรงกับความคาดหวังจากแอปที่ผู้ใช้ไทยคุ้นเคย

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เปลี่ยน |
|---|---|---|
| collapsed | — | `grid-rows-[0fr]` · ไอคอนชี้ลง |
| **expanded** | `data-expanded` บน `<Disclosure>` | `grid-rows-[1fr]` · ไอคอนหมุน 180° |
| hover | `data-hovered` | `text-link` |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้น |
| disabled | `data-disabled` | `text-fg-disabled` · `cursor-not-allowed` |

### ★★ animate ความสูงด้วย `grid-template-rows: 0fr → 1fr`

การขยาย accordion ต้องเปลี่ยน**ความสูง** ซึ่งทำด้วย `transform` อย่างเดียวไม่ได้

วิธีที่ใช้คือ `grid-template-rows: 0fr → 1fr` ซึ่ง **ถูกกว่า `height: auto` และ animate ได้จริง**

⚠️ **ห้ามใช้ `max-height` แบบเดาค่า** เพราะต้องตั้งค่าที่มากเกินจริง ทำให้ความเร็ว animation ไม่คงที่ตามความยาวเนื้อหา — **เนื้อหาสั้นจะดูช้า เนื้อหายาวจะดูกระตุก**

### ★★ ความขัดแย้ง: `overflow-hidden` vs วงแหวน focus — และวิธีแก้

เทคนิค `0fr → 1fr` **ต้องมี `overflow: hidden` ที่ลูก** ซึ่งจะตัดวงแหวน focus ของ element ข้างใน panel = **ไม่ผ่าน SC 2.4.7** (ข้อ 07 §5.2)

**ทางแก้:** คืน `overflow: visible` เมื่อ animation จบ

```tsx
const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
  if (e.propertyName !== 'grid-template-rows') return;
  const el = panelRef.current;
  if (!el) return;
  const isOpen = el.closest('[data-expanded]') !== null;
  el.style.overflow = isOpen ? 'visible' : 'hidden';
};
```

ระหว่าง animate ต้อง `hidden` เพื่อให้ `0fr → 1fr` ตัดเนื้อหาได้ · พอจบแล้วต้องเปิด ไม่เช่นนั้นวงแหวนของลิงก์หรือปุ่มใน panel จะถูกตัด 4px

⚠️ กรอง `propertyName` เพราะ `transitionend` ยิงหนึ่งครั้งต่อ property ที่ animate — ถ้าไม่กรอง จะทำงานหลายรอบโดยไม่จำเป็น

### ★ ไอคอนหมุนถูกตัดใน reduced motion — และนั่นถูกต้อง

`rotate-180` เป็น `transform` จึงถูกตัดโดย `motion-reduce:transition-none`

**ไม่เป็นไร** เพราะสถานะยัง **อ่านได้จาก `aria-expanded`** และจากตัว panel ที่ปรากฏ/หายไป — ไม่ได้พึ่งการหมุนเป็นตัวบอกสถานะเพียงอย่างเดียว (SC 1.4.1)

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `button` + `aria-expanded` + `aria-controls` จาก RAC |
| keyboard | Tab เข้าทุกหัวข้อ · Enter/Space สลับ |
| **SC 1.3.1** | หัวข้อต้องอยู่ใน `<Heading>` ที่ระดับถูก |
| **SC 2.4.7** | คืน `overflow: visible` หลัง transition |
| **SC 2.3.3** | `motion-reduce:transition-none` ทั้งไอคอนและ panel |
| **SC 1.4.1** | สถานะอ่านได้จาก `aria-expanded` ไม่พึ่งการหมุน |
| **SC 2.5.8** | ปุ่มหัวข้อ 56px สูง เต็มความกว้าง |

### ★★ หัวข้อต้องอยู่ใน `<Heading>` ไม่ใช่ `<div>`

**โครงสร้างหัวข้อคือวิธีที่ผู้ใช้ screen reader ใช้สำรวจหน้า** (SC 1.3.1)

ผู้ใช้ที่กด H เพื่อข้ามไปหัวข้อถัดไปต้องเจอหัวข้อของ accordion ด้วย ไม่ใช่ข้ามผ่านไปทั้งบล็อก

`headingLevel` ต้องตรงกับลำดับจริงในหน้า — ในหน้าที่มี `<h1>` และ `<h2>` accordion ควรเป็น `3` (ค่าเริ่มต้น) แต่ในการ์ดที่อยู่ใต้ `<h3>` ต้องเป็น `4`

RAC ให้ `aria-expanded` และ `aria-controls` มาเอง

### ★ `allowsMultipleExpanded` ควรเปิดสำหรับตัวกรอง

ผู้ใช้ที่กรองหลายเงื่อนไขต้องเห็น **ทุกกลุ่มที่เปิดไว้พร้อมกัน** ไม่ใช่ให้กลุ่มก่อนหน้าปิดเอง

ซึ่งขัดหลัก **recognition over recall** ในข้อ 01 §4.3 โดยตรง

สำหรับ FAQ การปิดอัตโนมัติยอมรับได้ เพราะผู้ใช้อ่านทีละคำถาม

---

## 6 · Tailwind implementation

```tsx
<RACDisclosure className={cn('group min-w-0 border-b border-edge-subtle last:border-b-0')}>
  <Heading level={headingLevel}>
    <RACButton slot="trigger" className={cn(
      'flex w-full min-w-0 items-center justify-between gap-3',
      'py-4 text-start',
      'text-body-sm text-fg',
      'transition-colors duration-fast ease-standard',
      'data-hovered:text-link',
      'data-disabled:text-fg-disabled data-disabled:cursor-not-allowed',
    )}>
      <span className="min-w-0">{title}</span>
      <Icon name="chevron-down" size={20} className={cn(
        'shrink-0 text-fg-muted',
        'transition-transform duration-fast ease-standard',
        'group-data-[expanded]:rotate-180',
        'motion-reduce:transition-none',
      )} />
    </RACButton>
  </Heading>

  <RACDisclosurePanel className={cn(
    'grid',
    'transition-[grid-template-rows] duration-medium ease-standard',
    'grid-rows-[0fr] group-data-[expanded]:grid-rows-[1fr]',
    'motion-reduce:transition-none',
  )}>
    <div
      ref={panelRef}
      onTransitionEnd={handleTransitionEnd}
      style={{ overflow: 'hidden' }}    /* ← เปลี่ยนเป็น visible เมื่อจบ */
      className="min-w-0"
    >
      <div className="pb-4 text-body-sm text-fg-secondary">{children}</div>
    </div>
  </RACDisclosurePanel>
</RACDisclosure>
```

`duration-medium` (250ms) ไม่ใช่ `fast` — การเปลี่ยนความสูงเป็นการเปลี่ยน layout ที่ตาต้องตามทัน

---

## 7 · Figma Variant

Component set **`AccordionItem`**

| Property | Values |
|---|---|
| `Expanded` | `True` · `False` |
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |
| `Heading level` | `H2` · `H3` · `H4` · `H5` |

**`Heading level` ต้องเป็น property ที่มองเห็นได้** แม้จะไม่เปลี่ยนหน้าตาเลย — เพื่อบังคับให้นักออกแบบคิดเรื่องลำดับหัวข้อตอนวางเลย์เอาต์ ไม่ใช่ปล่อยให้นักพัฒนาเดา

**ต้องมี frame `Expanded` ที่มีลิงก์ใน panel + `Focus` ring ที่ล้นออกนอกขอบ** เพื่อสื่อว่าทำไมต้องมีกลไก `transitionend`

**ห้ามใช้ Smart Animate ที่ย่อ/ขยายด้วย scale** — ระบบใช้ `grid-template-rows` ซึ่งเนื้อหาไม่ถูกบีบ

---

## 8 · Usage

```tsx
// เงื่อนไขโครงการ — FAQ ปิดอัตโนมัติได้
<Accordion defaultExpandedKeys={['eligibility']}>
  <AccordionItem id="eligibility" title="คุณสมบัติผู้สมัคร">
    <p>
      เป็นนิติบุคคลที่จดทะเบียนในประเทศไทย มียอดขายไม่เกิน 500 ล้านบาทต่อปี
      และไม่เคยได้รับทุนจากโครงการนี้มาก่อน
    </p>
  </AccordionItem>
  <AccordionItem id="documents" title="เอกสารที่ต้องใช้">
    <p>
      หนังสือรับรองนิติบุคคล งบการเงินย้อนหลัง 2 ปี และแผนธุรกิจ{' '}
      <Link href="/forms/grant-2569">ดาวน์โหลดแบบฟอร์ม</Link>
    </p>
  </AccordionItem>
</Accordion>
```

```tsx
// กลุ่มตัวกรอง — ต้องเปิดหลายกลุ่มพร้อมกันได้
<Accordion allowsMultipleExpanded defaultExpandedKeys={['category', 'price']}>
  <AccordionItem id="category" title="หมวดหมู่" headingLevel={3}>
    <CheckboxGroup label="หมวดหมู่" aria-label="หมวดหมู่">…</CheckboxGroup>
  </AccordionItem>
  <AccordionItem id="price" title="ช่วงราคา" headingLevel={3}>
    <RangeSlider label="ช่วงราคา" … />
  </AccordionItem>
</Accordion>
```

```tsx
// อยู่ใต้ h3 ในการ์ด — ต้องเป็น h4
<AccordionItem id="specs" title="ข้อมูลจำเพาะ" headingLevel={4}>…</AccordionItem>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `max-height: 1000px` | `grid-template-rows: 0fr → 1fr` | ความเร็วไม่คงที่ — สั้นดูช้า ยาวดูกระตุก |
| `overflow-hidden` ค้างไว้ตลอด | คืน `visible` ที่ `transitionend` | ตัดวงแหวน focus ใน panel = SC 2.4.7 |
| ไม่กรอง `e.propertyName` | กรอง `'grid-template-rows'` | handler ทำงานหลายรอบต่อการเปิดหนึ่งครั้ง |
| `<div>` เป็นหัวข้อ | `<Heading level={n}>` | ผู้ใช้กด H สำรวจหน้าไม่เจอ (SC 1.3.1) |
| `headingLevel={2}` ทุกที่ | ตรงกับลำดับจริง | ลำดับหัวข้อกระโดด = โครงหน้าอ่านไม่รู้เรื่อง |
| ปิดกลุ่มอื่นอัตโนมัติในตัวกรอง | `allowsMultipleExpanded` | ผู้ใช้ต้องจำว่าเลือกอะไรไว้ (ข้อ 01 §4.3) |
| ราคาหรือเงื่อนไขซื้อใน accordion | แสดงเลย | ข้อมูลตัดสินใจที่ซ่อนไว้ = คนส่วนใหญ่ไม่เห็น |
| การหมุนไอคอนเป็นตัวบอกสถานะเดียว | + `aria-expanded` (มีแล้ว) | reduced motion ตัดการหมุนทิ้ง |
| `duration-fast` | `duration-medium` | 150ms เร็วเกินไปสำหรับการเปลี่ยน layout |
| `<Accordion>` ที่มี item เดียว | แสดงเลย หรือ `<Disclosure>` | กลุ่มที่มีสมาชิกเดียวไม่ใช่กลุ่ม |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` · `SC 1.3.1` หัวข้อเป็น heading จริงที่ครอบปุ่ม |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` — หัวข้อไทยยาวตัดบรรทัดแทนดันกล่องล้น |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · `Enter`/`Space` พับ-กาง · `Tab` ผ่านทีละหัวข้อ |
| กำลังโหลด (Loading) | — | เนื้อหาข้างในมาพร้อม DOM · ถ้าต้องโหลดตอนกาง ให้ผู้เรียกใส่ [`<Skeleton>`](../feedback/Skeleton.md) ในเนื้อหา |
| ข้อผิดพลาด (Error) | — | accordion เป็นภาชนะ ไม่ถือความถูกต้องของข้อมูล |
| ว่างเปล่า (Empty) | — | หัวข้อที่ไม่มีเนื้อหาคือหัวข้อที่ไม่ควร render |
| Skeleton | — | โครงหัวข้อวาดได้ทันที ส่วนเนื้อหาถูกซ่อนอยู่แล้วตอนพับ |
| การเคลื่อนไหว (Animation) | ✅ | §5 `SC 2.3.3` · `transition-transform` ของลูกศรถูก `base.css §10` ตัดออกจาก `transition-property` ให้ — ลูกศรยัง**หมุนทันที** เพราะเป็นตัวบอกสถานะ · `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | เนื้อหาที่พับอยู่ไม่ถูก render · ไม่มีการวัดความสูงด้วย JS |
