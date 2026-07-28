# Slider

**`@smego/ui`** · ชั้น 03 · [Slider.tsx](./Slider.tsx)

> เดิมชื่อ `RangeSlider` — เปลี่ยนตาม ASTRYX-PARITY.md §1.2 · `minValue`→`min` · `maxValue`→`max` ตาม §8

---

## 1 · ภาพรวม

ตัวกรองช่วงค่า — ในระบบนี้คือ **ช่วงราคา** เป็นหลัก

component นี้เป็นตัวอย่างที่ชัดที่สุดของ **SC 2.5.7 Dragging Movements** — ช่องกรอกตัวเลขสองช่องด้านล่างไม่ใช่ของแถม แต่เป็น **เงื่อนไขการผ่านเกณฑ์**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ค่าเดียวไม่ใช่ช่วง | `<Slider>` (RAC ตรง) | สอง thumb ที่ทับกันสับสน |
| ช่วงที่ผู้ใช้รู้ค่าแน่นอน | `<NumberInput>` สองช่อง | slider เพิ่มความซับซ้อนโดยไม่ช่วย |
| ช่วงวันที่ | `<DateRangePicker>` (Pass 2) | ต้องเป็น พ.ศ. |
| ตัวเลือกไม่ต่อเนื่อง (S/M/L) | `<RadioList>` | slider สื่อว่าค่าระหว่างกลางมีอยู่ |

---

## 2 · React API

```tsx
import { Slider } from '@smego/ui';

<Slider
  label="ช่วงราคา"
  value={price}
  onChange={setPrice}
  min={0}
  max={5_000_000}
  step={10_000}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `isLabelHidden` | `boolean` | `false` | ซ่อน label ด้วยตา แต่ยังประกาศให้ screen reader (§8.1) |
| `status` | `InputStatus` | — | `{ type: "error"\|"warning"\|"success", message? }` — `error` เท่านั้นที่ตั้ง `aria-invalid` |
| `isOptional` | `boolean` | `false` | ต่อท้าย label ว่า "(ไม่บังคับ)" |
| `value` | `[number, number]` | — | `[ต่ำสุด, สูงสุด]` |
| `onChange` | `(v: [number, number]) => void` | — | |
| `min` / `max` | `number` | — | |
| `step` | `number` | `1` | ต้องหยาบพอที่ 1px จะไม่กระโดดหลายค่า |
| `unit` | `string` | `s.common.currency` | |
| `minLabel` / `maxLabel` | `string` | จาก `strings.th.ts` | |
| `isDisabled` | `boolean` | `false` | |

`onChange` ยิงระหว่างลาก — ถ้าจะยิง API ให้ debounce ที่ฝั่งผู้เรียก **ไม่ใช่ที่ component** เพราะ output ที่แสดงต้องอัปเดตทันที

---

## 3 · Variants

Slider ไม่มี variant — **โดยตั้งใจ**

slider ที่มีหลายหน้าตาจะทำให้ผู้ใช้ต้องเรียนรู้ใหม่ทุกครั้ง และไม่มีเคสใช้งานจริงในระบบนี้ที่ต้องการหน้าตาต่าง

| ส่วน | ค่า |
|---|---|
| ราง | `h-1` · `bg-sunken` · `rounded-full` |
| ช่วงที่เลือก | `h-1` · `bg-primary-600` |
| thumb | `size-5` (20px) · `border-2 border-edge-brand` · `bg-surface` |
| พื้นที่กดราง | `py-2` — รางหนา 4px กดยากเกินไป |
| ช่องกรอก | `text-body-sm` · **`font-numeric`** · `border-edge-strong` |

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | thumb `border-edge-brand` บน `bg-surface` |
| hover ราง | — | `cursor-pointer` |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้นรอบ thumb |
| **dragging** | `data-dragging` | thumb `bg-primary-50` |
| disabled | `data-disabled` | `border-edge` · `bg-sunken` · ช่วงเป็น `bg-fg-disabled` |

### ★★ ขนาดเป้าของ thumb — 20px ที่มองเห็น แต่ 24×24 ที่กดได้

thumb วาดเป็น 20px เพื่อความสมส่วนกับรางหนา 4px แต่ **ขยายพื้นที่กดด้วย pseudo-element**:

```
'before:absolute before:left-1/2 before:top-1/2',
'before:size-6 before:-translate-x-1/2 before:-translate-y-1/2',
'before:content-[""]',
```

**ยืนยันด้วย `document.elementFromPoint` ในเบราว์เซอร์จริง:**

| จุดตรวจจากจุดกึ่งกลาง | ผลลัพธ์ |
|---|---|
| ±11px (ซ้าย ขวา บน ล่าง) | **thumb** ✅ |
| ±13px | element อื่น |

= เป้ากด **24×24 พอดี** ผ่าน SC 2.5.8 โดยไม่ต้องอ้างข้อยกเว้นเรื่องระยะห่าง

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `slider` × 2 จาก RAC · `group` สำหรับช่องกรอก |
| keyboard | ลูกศร ±`step` · Home/End · PageUp/PageDown |
| **SC 2.5.7** | **ช่องกรอกตัวเลข** — ดูด้านล่าง |
| **SC 2.5.8** | thumb 24×24 วัดแล้ว |
| **SC 1.4.11** | ขอบ thumb และช่องกรอก = `edge-strong`/`edge-brand` |
| **SC 4.1.2** | `aria-label` แยกต้นทาง/ปลายทาง |
| **SC 1.4.3** | `SliderOutput` เป็น `text-fg-muted` (6.05:1) |

### ★★ SC 2.5.7 — คีย์บอร์ด **ไม่นับ**

ตัวบท: ทุกอย่างที่ทำได้ด้วยการลาก **ต้องทำได้ด้วยการกดครั้งเดียวด้วย single pointer** ด้วย

⚠️ ลูกศรซ้าย/ขวาทำให้ผ่าน **SC 2.1.1 (Keyboard)** แต่ **2.5.7 พูดถึง pointer โดยเฉพาะ**

ผู้ใช้ที่ควบคุมการลากได้ยาก — **โรคสั่น · ใช้หัวชี้ · ใช้ switch พร้อม pointer emulation** — ต้องมีทางที่ไม่ต้องลาก

ระบบนี้ให้ **สองทาง ทั้งคู่เป็น single pointer**:

1. **กดบนราง** → thumb ที่ใกล้ที่สุดกระโดดไป (RAC ให้มาเอง)
2. **ช่องกรอกตัวเลข** ต้นทาง–ปลายทาง พร้อมปุ่มเพิ่ม/ลดของ `NumberInput`

### ★ ช่องกรอกยังจำเป็นเพื่อ **ความแม่นยำ** ด้วย

slider กว้าง 300px ที่ช่วง 0–5,000,000 บาท หมายถึง

```
1px ≈ 16,600 บาท
```

ซึ่ง **เลือกค่าที่ต้องการไม่ได้เลย** ไม่ว่าจะควบคุม pointer ได้ดีแค่ไหน

### ★ `aria-label` ต้องบอกว่าเป็นต้นทางหรือปลายทาง

```
❌ thumb ทั้งสองชื่อ "ช่วงราคา"
✅ "ราคาต่ำสุด" / "ราคาสูงสุด"
```

ผู้ใช้ screen reader จะแยกไม่ออกว่ากำลังปรับอันไหน

### ★ ราคาใช้ **เลขอารบิกเท่านั้น** (ข้อ 03 §2)

เลขไทย ๐–๙ กว้างต่างกันถึง **36.6% em** ทำให้ตัวเลขกระโดดขณะลาก

`Intl.NumberFormat('th-TH')` ให้เลขอารบิกอยู่แล้ว — ไม่ต้องบังคับ `-u-nu-latn`

`font-numeric` (tabular-nums) ทำให้ความกว้างคงที่เพิ่มอีกชั้น

---

## 6 · Tailwind implementation

```tsx
<SliderTrack className="relative w-full cursor-pointer py-2 data-disabled:cursor-not-allowed">
  {({ state }) => (
    <>
      <div className="h-1 w-full rounded-full bg-sunken" />
      <div
        className={cn('absolute top-1/2 h-1 -translate-y-1/2 rounded-full',
          isDisabled ? 'bg-fg-disabled' : 'bg-primary-600')}
        style={{
          insetInlineStart: `${state.getThumbPercent(0) * 100}%`,
          width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
        }}
      />
      {[0, 1].map((i) => (
        <SliderThumb key={i} index={i} aria-label={i === 0 ? lo : hi}
          className={cn(
            'top-1/2 size-5 rounded-full border-2 bg-surface',
            'border-edge-brand',
            'transition-colors duration-fast ease-standard',
            'data-disabled:border-edge data-disabled:bg-sunken',
            'data-dragging:bg-primary-50',
            /* ★ ขยายเป้ากดเป็น 24×24 โดยไม่เปลี่ยนขนาดที่มองเห็น */
            'before:absolute before:left-1/2 before:top-1/2',
            'before:size-6 before:-translate-x-1/2 before:-translate-y-1/2',
            'before:content-[""]',
          )}
        />
      ))}
    </>
  )}
</SliderTrack>
```

`py-2` บน `SliderTrack` ทำให้พื้นที่กดของ **ราง** สูงพอ — รางหนา 4px กดยากเกินไป

`insetInlineStart` ไม่ใช่ `left` — เตรียมไว้สำหรับ RTL

---

## 7 · Figma Variant

Component set **`Slider`**

| Property | Values |
|---|---|
| `State` | `Default` · **`Focus`** · `Dragging` · `Disabled` |

**ต้องมีช่องกรอกตัวเลขอยู่ใน component เสมอ ไม่ใช่ variant แยก**

ถ้าทำเป็น property `Number fields = True/False` จะมีคนตั้ง `False` แล้วส่งงานที่ **ไม่ผ่าน SC 2.5.7** — ข้อกำหนดที่ปิดได้คือข้อกำหนดที่จะถูกปิด

**ต้องระบุใน description ว่า thumb ที่วาด 20px มีพื้นที่กด 24px** ไม่เช่นนั้นนักออกแบบจะคิดว่า 20px คือเป้าและอาจขอให้ย่อลงอีก

---

## 8 · Usage

```tsx
const [price, setPrice] = useState<[number, number]>([50_000, 2_000_000]);

<Slider
  label="ช่วงราคา"
  value={price}
  onChange={setPrice}
  min={0}
  max={5_000_000}
  step={10_000}
/>
```

```tsx
// จำนวนสั่งซื้อขั้นต่ำ — หน่วยไม่ใช่บาท
<Slider
  label="จำนวนสั่งซื้อขั้นต่ำ"
  unit="ชิ้น"
  minLabel="อย่างน้อย"
  maxLabel="ไม่เกิน"
  value={moq}
  onChange={setMoq}
  min={1}
  max={10_000}
  step={10}
/>
```

```tsx
// ยิง API แบบ debounce ที่ฝั่งผู้เรียก ไม่ใช่ใน component
<Slider
  label="ช่วงราคา"
  value={price}
  onChange={(v) => { setPrice(v); debouncedSearch(v); }}
  min={0} max={5_000_000} step={10_000}
/>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| slider อย่างเดียวไม่มีช่องกรอก | มีทั้งคู่เสมอ | **ไม่ผ่าน SC 2.5.7** — คีย์บอร์ดไม่นับ |
| "มีลูกศรแล้วผ่าน 2.5.7" | ต้องมีทาง pointer | 2.5.7 พูดถึง pointer โดยเฉพาะ |
| `aria-label="ช่วงราคา"` ทั้งสอง thumb | "ราคาต่ำสุด" / "ราคาสูงสุด" | screen reader แยกไม่ออก |
| `step={1}` ที่ช่วง 0–5,000,000 | `step={10_000}` | 1px ≈ 16,600 บาท — step ละเอียดไม่ช่วย |
| `size-6` thumb เพื่อให้ถึง 24 | `size-5` + `before:size-6` | thumb 24px บนราง 4px ดูอึดอัด |
| `className="p-0"` บน `SliderTrack` | ปล่อย `py-2` | รางหนา 4px กดไม่โดน |
| เลขไทย ๐–๙ | เลขอารบิก + `font-numeric` | กว้างต่างกัน 36.6% em — ตัวเลขกระโดดขณะลาก |
| debounce `onChange` ใน component | debounce ที่ผู้เรียก | output ที่แสดงต้องอัปเดตทันที |
| `left`/`width` เป็น `px` | `insetInlineStart` เป็น `%` | ไม่รองรับ RTL และคำนวณผิดเมื่อ container ยืด |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · `e2e/wcag22.spec.ts:204` กดบนรางได้เลยไม่ต้องลาก ซึ่งสำคัญกว่าบนจอสัมผัสแคบ |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `left-1/2` ที่ [Slider.tsx:140](./Slider.tsx) เป็น**สำนวนจัดกึ่งกลาง**คู่กับ `-translate-x-1/2` ไม่ใช่การเลือกข้าง — `lint-quality.mjs` ยกเว้นไว้โดยตั้งใจ (Tailwind ไม่มี translate เชิงตรรกะ การเปลี่ยนเป็น `start-1/2` จะทำให้เยื้อง) |
| คีย์บอร์ด (Keyboard) | ✅ | `e2e/wcag22.spec.ts:167` คีย์บอร์ดเปลี่ยนค่าได้ (SC 2.1.1) · §4 `focus-visible` และ `dragging` แยกกัน |
| กำลังโหลด (Loading) | — | ช่วงค่ามาพร้อมหน้า |
| ข้อผิดพลาด (Error) | — | ค่าถูกบีบให้อยู่ในช่วงเสมอ — ไม่มีค่าที่ผิดได้ |
| ว่างเปล่า (Empty) | — | สไลเดอร์มีค่าเริ่มต้นเสมอ |
| Skeleton | — | รางและปุ่มเป็นโครงคงที่ |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) · §4 `dragging` เปลี่ยนเฉพาะสี |
| ประสิทธิภาพ (Performance) | ✅ | `e2e/wcag22.spec.ts:184` มีช่องกรอกตัวเลขเป็นทางเลือก (SC 2.5.7) จึงไม่ต้องพึ่ง pointer event ถี่ ๆ อย่างเดียว |
