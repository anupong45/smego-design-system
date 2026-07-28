# DropdownMenu

> เมนู **คำสั่ง** ที่เปิดจากปุ่ม — trigger อยู่ข้างนอก ไม่ใช่ prop

---

## 1 · เส้นแบ่งจาก `Selector` — สั่งทำ กับ เลือกค่า

| | ใช้เมื่อ |
|---|---|
| `DropdownMenu` | รายการ **คำสั่ง** · กดแล้ว **มีอะไรเกิดขึ้น** ไม่มีสถานะ "ที่เลือกไว้" ค้างอยู่ |
| [`Selector`](../inputs/Selector.md) | รายการ **ค่า** ของฟอร์ม · กดแล้วค่าถูกจำไว้และส่งไปกับฟอร์ม |

ใช้สลับกันแล้วผู้ใช้จะรอว่า "ค่าที่เลือกไปไหน" หรือกดคำสั่งซ้ำโดยไม่ตั้งใจ

⚠️ ถ้าเปิดมาแล้วต้องมีรายการ **ติ๊กค้างไว้** นั่นคือ `Selector` หรือ [`CheckboxList`](../inputs/CheckboxInput.md) ไม่ใช่เมนู

| อยากได้ | ใช้ |
|---|---|
| สลับมุมมองของเนื้อหาเดียวกัน | [`TabList`](./TabList.md) · [`SegmentedControl`](./SegmentedControl.md) |
| ยืนยันการกระทำที่ย้อนไม่ได้ | [`Dialog`](../feedback/Dialog.md) — เมนูไม่ใช่ที่ยืนยัน |
| ตัวกรอง | [`Token`](../data-display/Token.md) · [`FilterPanel`](../marketplace/FilterPanel.md) |

---

## 2 · การใช้งาน

```tsx
<DropdownMenuTrigger>
  <IconButton name="more-vertical" label="คำสั่งสำหรับ เครื่องคั่วกาแฟ TR-500" />
  <DropdownMenu onAction={handle}>
    <DropdownMenuSection title="แก้ไข">
      <DropdownMenuItem id="edit" label="แก้ไขรายละเอียดสินค้า" icon="file-text" />
      <DropdownMenuItem
        id="dup"
        label="ทำสำเนา"
        description="สร้างรายการใหม่จากรายการนี้"
      />
    </DropdownMenuSection>
    <DropdownMenuSeparator />
    <DropdownMenuItem id="del" label="ลบรายการถาวร" isDestructive />
  </DropdownMenu>
</DropdownMenuTrigger>
```

---

## 3 · Props

### `DropdownMenu`

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `onAction` | `(key) => void` | — | จาก RAC · `id` ของ item เป็น key |
| `width` | `'auto' \| 'trigger'` | `'auto'` | `trigger` = กว้างเท่าปุ่มที่เปิดมัน |
| `disabledKeys` | `Iterable<Key>` | — | จาก RAC |

⚠️ **`aria-label` และ `aria-labelledby` ถูกถอดออกจาก type** — ดู §5

### `DropdownMenuItem`

| prop | type | หมายเหตุ |
|---|---|---|
| `label` | `string` | **บังคับ** — accessible name (§8.1) · ใช้เป็น `textValue` ให้ typeahead ด้วย |
| `id` | `Key` | ค่าที่ส่งเข้า `onAction` |
| `description` | `string` | คำอธิบายใต้ข้อความ |
| `icon` | `IconName` | ไอคอนตกแต่ง |
| `endContent` | `ReactNode` | ท้ายแถว เช่นคีย์ลัด |
| `isDestructive` | `boolean` | สีแดง **+ ไอคอนถังขยะ** (ดู §6) |
| `isDisabled` | `boolean` | จาก RAC |

### `DropdownMenuSection` · `DropdownMenuSeparator`

`title` ของ section **บังคับ** — หมวดที่ไม่มีชื่อคือเส้นแบ่ง ให้ใช้ `<DropdownMenuSeparator>` แทน · `MenuSection` ที่ไม่มี `Header` ประกาศเป็นกลุ่มไม่มีชื่อ ซึ่ง screen reader อ่านว่า "group" เปล่า ๆ

---

## 4 · trigger อยู่ข้างนอก — ต่างจาก Astryx

Astryx รับ `button` เป็น prop แล้ว render ปุ่มให้เอง พร้อม `isMenuOpen` / `onOpenChange` บนตัวเมนู · ของเราใช้ `<DropdownMenuTrigger>` ครอบปุ่มกับเมนูไว้ด้วยกันตามแบบ RAC — รูปเดียวกับที่ [`Dialog`](../feedback/Dialog.md) และ [`Tooltip`](../feedback/Tooltip.md) ทำอยู่แล้ว

บันทึกใน `ASTRYX-PARITY.md` เป็น **`layerDiff`** ไม่ใช่ prop ที่ขาด — เรามีครบ แต่อยู่คนละชั้น:

| Astryx | ของเรา |
|---|---|
| `<DropdownMenu button={…} isMenuOpen onOpenChange>` | `<DropdownMenuTrigger isOpen onOpenChange>` ครอบปุ่ม + เมนู |

**เหตุผลที่ไม่รับแบบเขา** — ปุ่มในระบบนี้มี [`Button`](../inputs/Button.md) กับ [`IconButton`](../inputs/IconButton.md) ที่ต่างกันจริงทั้ง API และเกณฑ์เป้ากด การยัดลงใน prop เดียวจะต้องเลือกอย่างใดอย่างหนึ่งแล้วอีกอันใช้ไม่ได้

---

## 5 · ★★★ ชื่อเมนูมาจากปุ่ม — ตั้งเองไม่ได้

RAC ตั้ง **ทั้งสองอย่าง** บนตัวเมนู: `aria-label` ตามที่ส่งมา และ `aria-labelledby` ที่ชี้ไปปุ่มที่เปิดมัน · ตามลำดับความสำคัญของ ARIA **`aria-labelledby` ชนะ**

**วัดจริงก่อนแก้:** ส่ง `aria-label="คำสั่งสำหรับรายการนี้"` แต่ชื่อที่ได้จริงคือ **"จัดการรายการ"** ซึ่งเป็นข้อความบนปุ่ม

API ที่รับ prop แล้วทิ้งเงียบ ๆ แย่กว่าไม่รับ เพราะผู้เรียกเชื่อว่าตั้งชื่อไปแล้ว · และค่าเริ่มต้นของ RAC **ถูกอยู่แล้ว** — เมนูควรชื่อเดียวกับปุ่มที่ผู้ใช้กด ไม่ใช่ชื่อที่นักพัฒนาคิดขึ้นใหม่

⇒ ถอดทั้งสอง prop ออกจาก type · **ปุ่มต้องมีชื่อที่อ่านรู้เรื่อง**

```tsx
{/* ❌ เมนูจะชื่อ "เพิ่มเติม" ซึ่งไม่บอกว่าของรายการไหน */}
<IconButton name="more-vertical" label="เพิ่มเติม" />

{/* ✅ */}
<IconButton name="more-vertical" label="คำสั่งสำหรับ เครื่องคั่วกาแฟ TR-500" />
```

หลักเดียวกับที่ปุ่มปิดของ [`Toast`](../feedback/Toast.md) ต้องมีข้อความของ toast ใบนั้นในชื่อ (SC 2.5.3)

---

## 6 · คำสั่งอันตรายไม่บอกด้วยสีเดียว (SC 1.4.1)

`isDestructive` ให้ทั้ง **สีแดง** และ **ไอคอนถังขยะโดยปริยาย** — สีอย่างเดียวผู้ใช้ตาบอดสีแยกไม่ออกว่าอันไหนลบถาวร

ส่ง `icon` มาทับได้ แต่ต้องเป็นไอคอนที่สื่อการทำลายเช่นกัน

⚠️ เมนูไม่ใช่ที่ยืนยัน — คำสั่งที่ย้อนไม่ได้ต้องเปิด [`Dialog`](../feedback/Dialog.md) ต่อ

---

## 7 · ข้อความไทยยาว — ตัดบรรทัดได้ ไม่ truncate

ข้อความไทยยาวกว่าอังกฤษ 20–40% · ป้ายคำสั่งที่ถูกตัดจนเหลือ `"ยกเลิกคำสั่งซื้อแล…"` **อ่านไม่ออกว่าจะเกิดอะไรขึ้น** ซึ่งอันตรายกว่าเมนูสูงขึ้นสองบรรทัด

ต่างจาก [`BottomNav`](./BottomNav.md) ที่ตัดได้ เพราะมีไอคอนกำกับและป้ายสั้นอยู่แล้ว

เมนูมี `max-h-80` + เลื่อนได้ — ไม่ใช่ความสูงตายตัว เพราะเมนู 20 รายการบนจอสูง 568px จะล้นออกนอกจอ

---

## 8 · คีย์บอร์ด

| ปุ่ม | ผล |
|---|---|
| ↓ ↑ | เลื่อนโฟกัส · **ข้ามรายการที่ปิดใช้งาน** |
| พิมพ์ตัวอักษร | typeahead — ทำได้เพราะส่ง `textValue={label}` ให้ RAC |
| Enter · Space | เรียก `onAction` แล้วปิดเมนู |
| Escape | ปิดเมนู · **คืนโฟกัสไปที่ปุ่ม (หนึ่ง tick ถัดมา ไม่ใช่ทันที)** |

★ `textValue` สำคัญกว่าที่เห็น — ถ้าไม่ส่ง RAC จะอ่านจาก children ที่เป็น element แล้วได้ค่าว่าง ทำให้ **พิมพ์หาไม่เจอ** · ล็อกไว้ด้วยเทสแล้ว

---

## 9 · กับดัก

| อย่าทำ | ทำแบบนี้ | เพราะ |
|---|---|---|
| ใช้เก็บค่าที่ต้องติ๊กค้าง | `Selector` / `CheckboxList` | เมนูคือคำสั่ง ไม่ใช่ค่า (§1) |
| `aria-label` ที่ตัวเมนู | ตั้งชื่อที่ **ปุ่ม** | prop ถูกถอดจาก type แล้ว (§5) |
| `label="เพิ่มเติม"` ที่ปุ่ม | ระบุว่าของรายการไหน | เมนูรับชื่อจากปุ่ม |
| `isDestructive` แล้วลบทันที | เปิด `Dialog` ยืนยันต่อ | เมนูไม่ใช่ที่ยืนยัน |
| `truncate` ป้ายคำสั่ง | ให้ตัดบรรทัด | อ่านไม่ออกว่าจะเกิดอะไร (§7) |
| section ไม่มี `title` | `DropdownMenuSeparator` | กลุ่มไม่มีชื่อ = "group" เปล่า ๆ |
| ความสูงตายตัว | `max-h-80` + เลื่อน | 20 รายการล้นจอ 568px |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 §6 · axe ผ่านตอนเปิดใน `a11y/dropdownmenu.test.tsx` · เทส "ชื่อเมนูมาจากปุ่ม" · "หมวดมีชื่อประกาศจริง" · "อันตรายมีไอคอนไม่ใช่สีเดียว" · "isDisabled ประกาศจริง" |
| ตอบสนอง (Responsive) | ✅ | §7 ตัดบรรทัดได้ ไม่ truncate · `max-h-80` + เลื่อน · `width="trigger"` เมื่อต้องกว้างเท่าปุ่ม |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — พื้นใช้ `--elevation-surface-overlay` · อยู่ใน contrast sweep ทั้งสองโหมด (popover ถูกเปิดจริงตอน sweep) |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — `px-2`/`gap-2` ไม่มีข้าง |
| คีย์บอร์ด (Keyboard) | ✅ | §8 · เทส "ลูกศรข้ามรายการที่ปิดใช้งาน" · "typeahead ต้องมี textValue" · "Escape คืนโฟกัสไปที่ปุ่ม" |
| กำลังโหลด (Loading) | — | เมนูคำสั่งไม่มีสถานะโหลด · คำสั่งที่ใช้เวลาให้ปิดเมนูแล้วแสดง [`Spinner`](../feedback/Spinner.md) ที่ปุ่มต้นทาง |
| ข้อผิดพลาด (Error) | — | ไม่มีสถานะผิดพลาดของตัวเอง · คำสั่งที่ล้มเหลวรายงานด้วย [`Banner`](../feedback/Banner.md) หรือ [`Toast`](../feedback/Toast.md) |
| ว่างเปล่า (Empty) | — | เมนูที่ไม่มีคำสั่งไม่ควรมีปุ่มเปิด — เป็นหน้าที่ผู้เรียก |
| Skeleton | — | เปิดจากการกด ไม่ได้โหลดมาพร้อมหน้า |
| การเคลื่อนไหว (Animation) | ✅ | `entering:` + `fade-in` opacity เท่านั้น ไม่มี transform (ข้อ 07) · `base.css §10` ตัดใน reduced motion |
| ประสิทธิภาพ (Performance) | ✅ | RAC render เมนูตอนเปิดเท่านั้น (portal) — ไม่มีอยู่ใน DOM ตอนปิด · `min-h` ไม่ใช่ `h` |
