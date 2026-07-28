# TabList · Tab · TabPanel

**`@smego/ui`** · ชั้น 03 · [TabList.tsx](./TabList.tsx)

> สร้างใหม่ในเฟส 5 · Astryx เรียก `Tabs` ว่า **`TabList`** (`renameNewBuild` ใน §4.1)

---

## 1 · ภาพรวม

สลับระหว่าง **panel คนละชุด** — เนื้อหาต่างกันจริง ไม่ใช่มุมมองต่างกัน

### ★★★ กฎแบ่งเขต 4 ทาง

สี่ตัวนี้หน้าตาใกล้กันแต่ **ความหมายกับ ARIA ต่างกันหมด** ถ้าเส้นแบ่งหายจะได้ปัญหาเดียวกับ capsule สี่ตัวที่ §1.4 D9 ตัดทิ้งไปแล้ว

| | ทำอะไร | ARIA |
|---|---|---|
| **`TabList`** | สลับ **panel คนละชุด** — เนื้อหาต่างกันจริง | `tablist` / `tab` / `tabpanel` |
| [**`SegmentedControl`**](./SegmentedControl.md) | สลับ **มุมมองของเนื้อหาเดิม** — ตาราง/รายการ | `radiogroup` / `radio` |
| [**`RadioList`**](../inputs/RadioList.md) | **ค่าในฟอร์ม** ที่รอกดส่ง | `radiogroup` + `label` ที่เห็นได้ |
| [**`Token`**](../data-display/Token.md) | **ตัวกรอง** ที่เลือกได้หลายอัน | `button` + `aria-pressed` |

**คำถามที่แยกได้เร็วที่สุด:**

```
"เนื้อหาที่ไม่ได้เลือกยังต้องอยู่ใน DOM ไหม"  → ไม่  = TabList
"มีผลเมื่อกดบันทึกไหม"                       → ใช่  = RadioList
"เลือกได้หลายอันไหม"                         → ใช่  = Token
ที่เหลือ                                      →       SegmentedControl
```

กฎนี้เขียนไว้ทั้งใน `TabList.tsx` และ `SegmentedControl.tsx` แบบอ้างถึงกัน — **แก้ทั้งคู่เสมอ**

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| สลับมุมมองของข้อมูลชุดเดิม | [`<SegmentedControl>`](./SegmentedControl.md) | ไม่มี panel ให้ควบคุม |
| เนื้อหาที่ต้องอ่านต่อเนื่องทั้งหมด | [`<Collapsible>`](../data-display/Collapsible.md) | tab ซ่อนเนื้อหาที่ผู้ใช้ต้องเทียบกัน |
| ขั้นตอนที่มีลำดับบังคับ | `<CheckoutStepper>` | tab กระโดดได้อิสระ ขั้นตอนไม่ได้ |
| นำทางระหว่างหน้า | [`<TopNav>`](./TopNav.md) หรือลิงก์ | tab ไม่เปลี่ยน URL |

---

## 2 · React API

```tsx
import { TabList, Tab, TabPanel } from '@smego/ui';

<TabList value={tab} onChange={setTab} label="ข้อมูลสินค้า">
  <Tab value="detail" label="รายละเอียด" />
  <Tab value="spec" label="สเปก" />
  <Tab value="review" label="รีวิว" endContent={<Badge label="12" />} />

  <TabPanel value="detail">…</TabPanel>
  <TabPanel value="spec">…</TabPanel>
  <TabPanel value="review">…</TabPanel>
</TabList>
```

⚠️ **`<Tab>` และ `<TabPanel>` ต้องเป็นลูกตรงของ `<TabList>`** — ห่อด้วย fragment หรือ `.map()` ได้ แต่ห่อด้วย `<div>` ไม่ได้ (component แยกทั้งสองชนิดออกจากกันด้วย `child.type`)

### TabList

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `value` | `string` | — | **บังคับ** |
| `onChange` | `(value: string) => void` | — | **บังคับ** |
| `label` | `string` | — | **บังคับ** · ชื่อ accessible ของแถบ (D28) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 36 / **44** / 48px — ดู §5 |
| `layout` | `'hug' \| 'fill'` | `'hug'` | |
| `hasDivider` | `boolean` | `false` | เส้นคั่นใต้แถบ |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | คุมว่าลูกศรปุ่มไหนเลื่อน |
| `isDisabled` | `boolean` | `false` | ปิดทั้งแถบ (D28) |

### Tab

| prop | type | หมายเหตุ |
|---|---|---|
| `value` | `string` | จับคู่กับ `value` ของ `TabList` |
| `label` | `string` | **บังคับ** (§8.1) |
| `isLabelHidden` | `boolean` | เหลือแต่ไอคอน — ยังเป็น accessible name |
| `icon` · `endContent` | `ReactNode` | |
| `isDisabled` | `boolean` | |

### TabPanel

| prop | type | หมายเหตุ |
|---|---|---|
| `value` | `string` | จับคู่กับ `<Tab value>` |
| `children` | `ReactNode` | |

---

## 3 · Variants

| `layout` | ผล |
|---|---|
| `hug` | tab กว้างตามข้อความ |
| `fill` | tab แบ่งความกว้างเท่ากัน — ใช้เมื่อมี 2–3 tab บนมือถือ |

`orientation="vertical"` เปลี่ยนเป็นแถบข้าง และลูกศรขึ้น/ลงเลื่อนแทนซ้าย/ขวา

---

## 4 · States

| state | ผล |
|---|---|
| ที่เลือกอยู่ | `aria-selected="true"` + สีข้อความเข้ม + เส้นใต้ |
| hover | พื้น `bg-sunken` |
| focus-visible | วงแหวน 2 ชั้นจาก `base.css` |
| disabled | `text-fg-disabled` · กดไม่ได้จริง |

**panel ที่ไม่ได้เลือก ไม่อยู่ใน DOM** — ดู §5

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `tablist` / `tab` / `tabpanel` จาก RAC |
| keyboard | แถบกิน **หนึ่ง tab stop** · ลูกศรเลื่อนตาม WAI-ARIA APG |
| **SC 2.5.8** | เป้ากดต่ำสุด 36px ทุกขนาด |
| **SC 1.4.12** | `min-h-*` ไม่ใช่ `h-*` |
| **SC 1.4.1** | ที่เลือกเปลี่ยน**ทั้งสีข้อความและเส้นใต้** + มี `aria-selected` |
| **SC 1.4.10** | แถบเลื่อนแนวนอนในกล่องตัวเอง ไม่ใช่ทั้งหน้า |

### ★★★ สร้างบน RAC เต็มตัว ไม่ใช่แถบเปล่าแบบ Astryx (D28)

Astryx ให้ `TabList` เป็นแถบ tab อย่างเดียว **ไม่มี panel** — แต่ ARIA บังคับว่า `role="tab"` ต้องมี `aria-controls` ชี้ไป `tabpanel` และ panel ต้องมี `aria-labelledby` ย้อนกลับ

ถ้าแถบไม่ได้เป็นเจ้าของ panel ผู้เรียกต้องต่อ id เองทุกครั้ง ซึ่ง **เป็นสิ่งที่จะถูกลืม** แล้ว tab จะกลายเป็นปุ่มเฉย ๆ สำหรับผู้ใช้ screen reader **โดยไม่มี error ให้เห็น**

จึงใช้ `Tabs` / `TabList` / `Tab` / `TabPanel` ของ RAC ซึ่งต่อให้ครบทั้ง `aria-controls` · `aria-labelledby` · roving tabindex · ลูกศรซ้าย/ขวา — เหตุผลเดียวกับ **D8** (ไม่พัง RAC เพื่อความเหมือนผิวเผิน)

เทส `"RAC ต่อ aria-controls / aria-labelledby ให้เอง"` ล็อกข้อนี้ไว้

### ★★★ panel ที่ไม่ได้เลือกไม่อยู่ใน DOM

RAC **ไม่ render** panel ที่ไม่ได้เลือก — ต่างจากการซ่อนด้วย `display: none` หรือ `hidden` ที่ผู้ใช้ screen reader **ยังอ่านเจอ** ในบางโหมดการนำทาง

นี่คือเส้นแบ่งที่วัดได้กับ [`SegmentedControl`](./SegmentedControl.md) ซึ่งไม่มี panel เลย · เทส `"panel ที่ไม่ได้เลือกไม่อยู่ใน DOM"` และ `"เส้นแบ่ง TabList ↔ SegmentedControl"` ล็อกทั้งสองฝั่ง

### ★★ ขนาดเป้ากด — เหมือน `Pagination` (D1)

| `size` | เรา | Astryx |
|---|---|---|
| `sm` | **36px** | 28px |
| `md` | **44px** | 32px |
| `lg` | **48px** | 36px |

ขนาดกำหนดจาก **พ่อแม่ผ่าน child selector** (`[&>*]:min-h-11`) — `Tab` จึงไม่รับ `size` มาซ้ำ และเป็นไปไม่ได้ที่ tab ในแถบเดียวกันจะสูงไม่เท่ากัน

### ★ แถบเลื่อนแนวนอนในกล่องตัวเอง

tab ไทย 5 อันล้นแน่ที่ 320px และ **tab ตัดบรรทัดไม่ได้** (ต่างจาก `Pagination` ที่ `flex-wrap` ได้) จึงใช้ `overflow-x-auto` + `p-1` กันวงแหวน focus ถูกตัด — สำนวนเดียวกับ [`ChipRow`](../data-display/Token.md) (ข้อ 05 §5)

---

## 6 · Tailwind implementation

```tsx
/* ★★ แยก Tab ออกจาก TabPanel — ห้ามยัดทั้งสองลงใน RACTabList */
const items = Children.toArray(children);
const tabs = items.filter((c) => isValidElement(c) && c.type === Tab);
const panels = items.filter((c) => isValidElement(c) && c.type === TabPanel);
```

ถ้ายัด `children` ทั้งก้อนลง `RACTabList` จะได้ `role="tabpanel"` **ซ้อนใน** `role="tablist"` ซึ่งผิด ARIA และ panel ไป render อยู่ในแถบ tab — **แต่ยัง render ได้** จึงเป็นบั๊กที่เงียบ · เทส `"tabpanel ต้องไม่ซ้อนอยู่ใน tablist"` ล็อกไว้

เส้นใต้ tab ที่เลือกใช้ `inset` shadow ไม่ใช่ `border-b` เพื่อไม่ให้ความสูงของ tab ขยับตอนเลือก:

```
data-selected:shadow-[inset_0_-2px_0_0_var(--color-primary-600)]
```

---

## 7 · Figma Variant

Component set **`TabList`**

| Property | Values |
|---|---|
| `Size` | `sm (36)` · **`md (44)`** · `lg (48)` |
| `Layout` | **`Hug`** · `Fill` |
| `Divider` | `True` · **`False`** |
| `Orientation` | **`Horizontal`** · `Vertical` |

Component set **`Tab`** — property `State` = `Default` · `Hover` · **`Selected`** · `Focus` · `Disabled` · property `Content` = `Label` · `Icon + label` · `Icon only` · `Label + badge`

**ต้องมี frame ที่แสดงแถบยาวเกินจอ** — ถ้า Figma แสดงแต่ 3 tab ที่พอดี นักพัฒนาจะไม่รู้ว่าต้องเลื่อนได้

---

## 8 · Usage

```tsx
// หน้ารายละเอียดสินค้า — เนื้อหาต่างกันจริงในแต่ละ tab
const [tab, setTab] = useState('detail');

<TabList value={tab} onChange={setTab} label={s.product.infoTabs} hasDivider>
  <Tab value="detail" label="รายละเอียด" />
  <Tab value="spec" label="สเปก" />
  <Tab value="seller" label="ผู้ขาย" />

  <TabPanel value="detail"><ProductDetail … /></TabPanel>
  <TabPanel value="spec"><DescriptionList … /></TabPanel>
  <TabPanel value="seller"><SellerProfile … /></TabPanel>
</TabList>
```

```tsx
// 2 tab บนมือถือ — fill ให้กดง่ายขึ้น
<TabList value={tab} onChange={setTab} label="มุมมอง" layout="fill">…</TabList>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<TabList>` สลับมุมมองของข้อมูลเดิม | [`<SegmentedControl>`](./SegmentedControl.md) | §1 · ไม่มี panel ให้ควบคุม |
| ไม่ส่ง `label` | ส่งเสมอ | แถบไม่มีชื่อ = landmark ที่ข้ามไปหาไม่ได้ |
| `<div>` ห่อ `<Tab>` | ลูกตรงหรือ fragment | component แยกชนิดด้วย `child.type` |
| ซ่อน panel ด้วย `hidden` เอง | ปล่อยให้ RAC จัดการ | SR ยังอ่านเนื้อหาที่ไม่ได้เลือกเจอ |
| `h-11` | `min-h-11` | ตัดข้อความเมื่อผู้ใช้ขยายตัวอักษร |
| `size` ตามค่า Astryx (28/32/36) | 36/44/48 | ต่ำกว่าเกณฑ์ touch (D1) |
| `border-b` ที่ tab ที่เลือก | `inset` shadow | ความสูงขยับตอนเลือก |
| ใช้แทนขั้นตอนในฟอร์ม | `<CheckoutStepper>` | tab กระโดดได้ ขั้นตอนไม่ได้ |
| `<Tab>` ที่ `label` เป็น JSX | `label: string` | accessible name ต้องตรงกับที่ตาเห็น (SC 2.5.3) |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/tabs.test.tsx` · เทส "tabpanel ต้องไม่ซ้อนอยู่ใน tablist" · "RAC ต่อ aria-controls ให้เอง" · "panel ที่ไม่ได้เลือกไม่อยู่ใน DOM" |
| ตอบสนอง (Responsive) | ✅ | `overflow-x-auto` ในกล่องตัวเอง (SC 1.4.10) · `layout="fill"` สำหรับจอแคบ · `min-w-0` ที่แถบ |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — เส้นใต้ใช้ `var(--color-primary-600)` ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`left-` |
| คีย์บอร์ด (Keyboard) | ✅ | §5 · เทส "ลูกศรขวาเลื่อน tab ตาม APG" และ "แถบกิน tab stop เดียว" |
| กำลังโหลด (Loading) | — | tab เป็นตัวนำทาง · เนื้อหาใน panel จัดการ loading เอง ([`<Skeleton>`](../feedback/Skeleton.md)) |
| ข้อผิดพลาด (Error) | — | ไม่มีสถานะผิดพลาดของตัวเอง · error ของเนื้อหาอยู่ใน panel |
| ว่างเปล่า (Empty) | — | แถบที่มี tab เดียวไม่ควรมีอยู่ — แสดงเนื้อหาตรง ๆ |
| Skeleton | — | แถบสั้น ความสูงคงที่ ไม่ทำให้ CLS |
| การเคลื่อนไหว (Animation) | ✅ | `transition-colors` เท่านั้น — อยู่ในรายการ ALLOW ของ `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | เส้นใต้เป็น `inset` shadow ไม่ใช่ `border` จึงไม่ทำให้ layout ขยับตอนเลือก · panel ที่ไม่ได้เลือกไม่ถูก render เลย |
