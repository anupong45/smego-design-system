# Tooltip · TooltipTrigger

**`@smego/ui`** · ชั้น 03 · [Tooltip.tsx](./Tooltip.tsx)

---

## 1 · ภาพรวม

ข้อความสั้นที่ปรากฏเมื่อ **hover หรือ focus** ตัวกระตุ้น

component ที่ **ใช้ผิดบ่อยที่สุดในทุกระบบ** — เพราะมันดูเหมือนที่เก็บข้อมูลที่ไม่มีที่วาง แต่จริง ๆ แล้วผู้ใช้จำนวนมากเข้าไม่ถึงเลย

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| **ข้อมูลจำเป็นต่อการตัดสินใจ** | ข้อความในหน้า หรือ `<Dialog>` | ผู้ใช้ touch ไม่มี hover — เข้าไม่ถึงเลย |
| ชื่อของปุ่มไอคอน | `aria-label` ผ่าน `<IconButton label>` | tooltip ไม่ใช่ชื่อ accessible |
| ข้อความยาวกว่า 2 บรรทัด | `<Dialog>` | อ่านไม่ทันก่อนเมาส์เลื่อนออก |
| มีลิงก์หรือปุ่มข้างใน | `<Dialog>` | ผู้ใช้คีย์บอร์ดเข้าไปถึงไม่ได้ |

> **ทำไมถึงเป็น `<Dialog>` ไม่ใช่ `<Popover>`** — ระบบนี้**ไม่มี** `Popover` เป็น component ของตัวเอง (`ASTRYX-PARITY.md` §1.4 ตัดออกโดยเจตนา) สิ่งที่ต้องการจริงคือ **ที่เก็บเนื้อหาที่เปิดด้วยการกดและเก็บ focus ไว้ได้** ซึ่ง `<Dialog>` ให้ครบแล้ว
>
> ถ้าจำเป็นต้องได้ popover ที่ลอยติดกับ trigger จริง ๆ ใช้ทางหนี `@smego/ui/primitives` ซึ่งเปิด RAC ทั้งชุด แล้วรับผิดชอบ a11y เองตามที่ §5 เขียนไว้
| ข้อความผิดพลาดในฟอร์ม | `errorMessage` prop | ต้องอยู่ถาวรและเชื่อม `aria-describedby` |

**⚠️ ในระบบนี้เนื้อหาส่วนใหญ่เป็นข้อมูลจำเป็น** — เงื่อนไขคุณสมบัติของโครงการ · สัดส่วนร่วมจ่ายของแหล่งทุน · เกณฑ์การรับรอง สิ่งเหล่านี้ **ห้ามอยู่ใน tooltip**

---

## 2 · React API

```tsx
import { Tooltip, TooltipTrigger, Button } from '@smego/ui';

<TooltipTrigger delay={200}>
  <Button variant="secondary" icon="info">วงเงินสูงสุด</Button>
  <Tooltip content="เพดานที่ขอได้ ไม่ใช่จำนวนที่ได้รับจริง" />
</TooltipTrigger>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `content` | `ReactNode` | — | **ข้อความสั้น** — ห้ามลิงก์ ปุ่ม หรือข้อมูลจำเป็น |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` … | `'top'` | จาก RAC |
| `className` | `string` | — | |

`offset` ถูกตั้งเป็น **8px** ตายตัว — ให้ลูกศรมีที่พอโดยไม่ห่างจนดูไม่เกี่ยวกัน

`TooltipTrigger` คือ RAC `TooltipTrigger` ตรง ๆ — รับ `delay` / `closeDelay` / `isDisabled`

---

## 3 · Variants

Tooltip ไม่มี variant — **โดยตั้งใจ**

tooltip หลายสีจะกลายเป็นระบบสถานะที่สอง ซึ่งซ้ำกับ `<Badge>` และ `<Banner>` และผู้ใช้เข้าถึงไม่ได้บน touch

| ส่วน | ค่า |
|---|---|
| พื้น | `bg-inverse` |
| ตัวอักษร | `text-canvas` |
| ขนาด | `text-caption` |
| padding | `px-3 py-2` |
| มุม | `rounded-(--radius-sm)` |
| ความกว้างสูงสุด | `max-w-64` (256px) |

### ★ พื้น `bg-inverse` — สลับกับสีข้อความหลัก

โหมดสว่างได้ **พื้นเข้ม ตัวอักษรอ่อน** · โหมดมืดกลับกัน — **ทั้งคู่ผ่าน AAA**

การสลับขั้วทำให้ tooltip แยกจากพื้นผิวอื่นทุกชนิดในระบบโดยไม่ต้องมีขอบ

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เกิด |
|---|---|---|
| entering | `data-entering` | `animate-[fade-in_150ms_ease-out]` |
| open | — | อยู่จนกว่าจะ hover ออก · focus ออก · หรือกด Esc |
| exiting | `data-exiting` | `animate-[fade-out_150ms_ease-in]` |

### ★ เข้า/ออกด้วย **opacity เท่านั้น** — ไม่มี transform

จึงไม่ถูก reduced-motion ตัด และ **ไม่กระตุ้นระบบทรงตัว** (ข้อ 07)

tooltip ที่เลื่อนขึ้นมาเป็นหนึ่งในสาเหตุที่พบบ่อยของอาการเวียนศีรษะจาก UI เพราะมันปรากฏใกล้จุดที่ตากำลังจ้องอยู่พอดี

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `tooltip` จาก RAC · เชื่อมด้วย `aria-describedby` |
| keyboard | ปรากฏเมื่อ focus · **ปิดด้วย Esc** |
| **SC 1.4.13** | ต้องครบ 3 ข้อ — ดูด้านล่าง |
| **SC 2.3.3** | opacity ล้วน · ไม่มี transform |
| **SC 1.4.3** | `bg-inverse` / `text-canvas` ผ่าน AAA ทั้งสองธีม |
| **SC 1.4.4** | `max-w-64` ไม่ตัดข้อความเมื่อซูม 200% |

### ★★ SC 1.4.13 Content on Hover or Focus — ต้องครบ 3 ข้อ

1. **Dismissable** — ปิดด้วย Esc ได้โดยไม่ต้องย้ายเมาส์หรือ focus
2. **Hoverable** — เลื่อนเมาส์เข้าไปใน tooltip ได้โดยที่มันไม่หาย
3. **Persistent** — อยู่จนกว่าจะ hover ออก · focus ออก · หรือกด Esc

RAC ให้ครบทั้งสามข้อ — **แต่ข้อ 3 พังได้ง่ายที่สุด**

⚠️ **ห้ามใส่ `setTimeout` ให้ tooltip หายเอง**

เป็นความผิดพลาดที่พบบ่อยที่สุดของข้อนี้ · ผู้ใช้ที่อ่านช้า ใช้แว่นขยาย หรือใช้ screen magnifier **จะอ่านไม่ทัน**

### ★★ tooltip **ไม่ใช่ที่เก็บข้อมูลจำเป็น**

เนื้อหาใน tooltip เข้าถึงได้เฉพาะเมื่อ hover หรือ focus

ผู้ใช้ touch บนมือถือ **ไม่มี hover** และอาจเข้าไม่ถึงเลย — บนหน้าจอสัมผัส RAC จะแสดง tooltip เมื่อ long-press ซึ่งผู้ใช้ส่วนใหญ่ไม่รู้ว่าทำได้

ถ้าข้อมูลจำเป็นต่อการตัดสินใจ ให้แสดงเป็น **ข้อความในหน้า** หรือใช้ **`<Dialog>` ที่เปิดด้วยการกด** (ดูกล่องหมายเหตุใน §1 ว่าทำไมไม่ใช่ `Popover`)

### ★★ ห้ามใส่สิ่งที่กดได้ใน tooltip

ผู้ใช้คีย์บอร์ดเข้าไปถึงไม่ได้ เพราะ **tooltip หายเมื่อ focus ย้าย**

ถ้าต้องมีลิงก์ ให้ใช้ `<Dialog>` ซึ่งเก็บ focus ไว้ได้

### ★ tooltip ไม่ใช่ชื่อ accessible

`aria-describedby` **ไม่ใช่** `aria-labelledby` — screen reader อ่าน tooltip เป็น **คำอธิบายเพิ่มเติม** หลังจากอ่านชื่อปุ่มแล้ว

ปุ่มไอคอนล้วนที่มีแค่ tooltip จะถูกอ่านว่า "ปุ่ม" เฉย ๆ — ต้องใช้ `<IconButton label>` ซึ่งบังคับ `aria-label`

---

## 6 · Tailwind implementation

```tsx
<RACTooltip
  offset={8}
  className={cn(
    'max-w-64',
    'rounded-(--radius-sm)',
    'bg-inverse text-canvas',
    'px-3 py-2',
    'text-caption',
    /* ★ opacity เท่านั้น — ไม่มี transform */
    'data-entering:animate-[fade-in_150ms_ease-out]',
    'data-exiting:animate-[fade-out_150ms_ease-in]',
  )}
>
  <OverlayArrow>
    <svg width={8} height={8} viewBox="0 0 8 8" aria-hidden="true"
      className="fill-inverse group-data-[placement=bottom]:rotate-180">
      <path d="M0 0 L4 4 L8 0" />
    </svg>
  </OverlayArrow>
  {children}
</RACTooltip>
```

keyframes `fade-in` / `fade-out` ประกาศใน `02-tokens/src/base.css` — ใช้ร่วมกับ `Dialog`

ลูกศรใช้ `fill-inverse` ตัวเดียวกับพื้น จึงไม่มีทาง drift

---

## 7 · Figma Variant

Component set **`Tooltip`**

| Property | Values |
|---|---|
| `Placement` | `Top` · `Bottom` · `Start` · `End` |

**ไม่มี `Variant` property** — ถ้ามีคนขอ tooltip สีแดงสำหรับ error ให้ชี้ไปที่ `errorMessage` ของ field

**ต้องมีหมายเหตุใน description:**

> tooltip ไม่ใช่ที่เก็บข้อมูลจำเป็น · ผู้ใช้ touch เข้าไม่ถึง · ห้ามใส่ลิงก์หรือปุ่ม · ห้ามตั้งเวลาให้หายเอง

เพราะข้อจำกัดเหล่านี้เป็น **การตัดสินใจเชิงเนื้อหา** ที่นักออกแบบต้องรู้ตอนวางเลย์เอาต์ ไม่ใช่ตอน handoff

---

## 8 · Usage

```tsx
// ข้อมูลเสริมที่ไม่จำเป็นต่อการตัดสินใจ
<TooltipTrigger delay={200}>
  <Button variant="secondary" icon="info">วงเงินสูงสุด</Button>
  <Tooltip content="เพดานที่ขอได้ ไม่ใช่จำนวนที่ได้รับจริง" />
</TooltipTrigger>
```

```tsx
// อธิบายว่าทำไมปุ่มถึงกดไม่ได้ — trigger ต้องไม่ disabled
// (element ที่ disabled ไม่ยิง event ใด ๆ tooltip จะไม่ขึ้น)
<TooltipTrigger>
  <Button variant="primary" isDisabled={false} onPress={warn}>
    ยื่นคำขอ
  </Button>
  <Tooltip content="ต้องยืนยันตัวตนด้วย ThaID ก่อนยื่นคำขอ" />
</TooltipTrigger>
```

```tsx
// ❌ แบบนี้ผิด — ข้อมูลจำเป็นต่อการตัดสินใจ
// <Tooltip content="ต้องร่วมจ่าย 30% ของวงเงินที่ได้รับ" />
// ✅ แสดงเป็นข้อความในหน้า
<VStack gap="1">
  <span className="text-label text-fg-secondary">สัดส่วนร่วมจ่าย</span>
  <span className="text-body text-fg font-numeric">30%</span>
</VStack>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `setTimeout(() => hide(), 3000)` | ปล่อยให้อยู่จนกว่าจะออก | ไม่ผ่าน SC 1.4.13 ข้อ 3 |
| เงื่อนไขคุณสมบัติใน tooltip | ข้อความในหน้า | ผู้ใช้ touch เข้าไม่ถึงเลย |
| `<Tooltip content={<Link>อ่านเพิ่ม</Link>} />` | `<Dialog>` | tooltip หายเมื่อ focus ย้าย |
| `<IconButton>` ที่ชื่อมาจาก tooltip | `label` prop | `aria-describedby` ≠ ชื่อ accessible |
| tooltip บนปุ่มที่ `isDisabled` | ห่อด้วย `<span>` หรือใช้ปุ่มที่กดได้ | element ที่ disabled ไม่ยิง event |
| `data-entering:animate-[slide-up]` | fade อย่างเดียว | transform ใกล้จุดจ้อง = กระตุ้นระบบทรงตัว |
| tooltip ยาว 4 บรรทัด | `<Dialog>` | อ่านไม่ทันก่อนเมาส์เลื่อนออก |
| `delay={0}` | `delay={200}` ขึ้นไป | tooltip โผล่ทุกครั้งที่เมาส์ผ่านคือเสียงรบกวน |
| tooltip แสดงข้อความ error | `errorMessage` prop | error ต้องอยู่ถาวรและเชื่อม `aria-describedby` |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` · `SC 1.4.13` ปิดด้วย `Esc` ได้และไม่หายเมื่อเลื่อนเมาส์เข้าไปในตัว tooltip |
| ตอบสนอง (Responsive) | ⚠️ | ไม่มี `min-w-0` และไม่มี breakpoint — tooltip พึ่งการวางตำแหน่งอัตโนมัติของ RAC ทั้งหมด · **หนี้:** ยังไม่ได้วัดที่ 320px ว่าข้อความยาวสุดที่ยอมรับได้กว้างเท่าไร |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §5 `SC 1.4.13` เปิดด้วย `focus` ไม่ใช่แค่ `hover` — ผู้ใช้คีย์บอร์ดเห็นได้ · `Esc` ปิด |
| กำลังโหลด (Loading) | — | ข้อความ tooltip มาพร้อม DOM |
| ข้อผิดพลาด (Error) | — | tooltip เป็นคำอธิบายเสริม · ห้ามใช้แจ้งข้อผิดพลาดเพราะผู้ใช้สัมผัสอาจไม่มีวันเห็น |
| ว่างเปล่า (Empty) | — | ไม่มีข้อความ = ไม่ render tooltip |
| Skeleton | — | ข้อความสั้นบรรทัดเดียว |
| การเคลื่อนไหว (Animation) | ✅ | §4 `entering`/`exiting` ใช้ `fade` **opacity ล้วน** · `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) · §5 `SC 2.3.3` |
| ประสิทธิภาพ (Performance) | ✅ | render เฉพาะตอนเปิด · opacity อยู่บน compositor |
