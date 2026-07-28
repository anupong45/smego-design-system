# ComboBox

**`@smego/ui`** · ชั้น 03 · [ComboBox.tsx](./ComboBox.tsx)

---

## 1 · ภาพรวม

เลือกจากรายการโดย **พิมพ์กรองได้** — จังหวัด 77 รายการ · หมวดสินค้า · ชื่อผู้ขาย

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| รายการสั้น (≤ ~10) | `<Select>` | การพิมพ์ไม่ช่วยอะไร |
| ค้นหาอิสระ ไม่ใช่ชุดปิด | `<SearchField>` | ComboBox บังคับเลือกจากรายการ |
| เลือกหลายค่า | `<CheckboxGroup>` หรือ `<Chip>` | |
| รายการมาจาก API แบบ async | ComboBox + จัดการ loading เอง | component นี้รับ `options` ที่พร้อมแล้ว |

---

## 2 · React API

```tsx
<ComboBox
  label="จังหวัดที่จัดส่ง"
  options={provinces}
  placeholder="พิมพ์เพื่อค้นหาจังหวัด"
  selectedKey={province}
  onSelectionChange={setProvince}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `options` | `SelectOption[]` | — | ใช้ type เดียวกับ `<Select>` |
| `placeholder` · `description` · `errorMessage` · `showOptional` | | | |
| `size` | `'md' \| 'lg'` | `'md'` | |
| `selectedKey` / `onSelectionChange` / `inputValue` / `onInputChange` | | | จาก RAC |

`allowsEmptyCollection` และ `menuTrigger="focus"` ถูกตั้งไว้ตายตัว — ดู §3

---

## 3 · Variants

ไม่มี variant · หน้าตาเหมือน `<Select>` ทุกอย่างยกเว้นช่องพิมพ์ได้

`SelectItem` ถูกใช้ซ้ำจาก `Select.tsx` — รายการในสองตัวนี้ต้องหน้าตาเหมือนกัน ไม่งั้นผู้ใช้จะคิดว่าเป็นคนละอย่าง

### ★★ `allowsEmptyCollection` เปิดไว้ พร้อมข้อความ "ไม่พบตัวเลือกที่ตรงกัน"

ถ้าไม่เปิด popover จะ **ปิดเงียบ ๆ** เมื่อไม่มีผลลัพธ์ — ผู้ใช้ไม่รู้ว่าพิมพ์ผิด ไม่มีข้อมูล หรือระบบค้าง

```tsx
renderEmptyState={() => (
  <p className="px-3 py-4 text-center text-body-sm text-fg-muted">
    {s.common.noMatches}
  </p>
)}
```

### ★ `menuTrigger="focus"` — เปิดรายการทันทีที่ focus

ผู้ใช้ที่ไม่รู้ว่ามีตัวเลือกอะไรจะได้เห็นก่อนพิมพ์ · ต่างจากค่าเริ่มต้นของ RAC ที่รอให้พิมพ์ก่อน

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `border-edge-strong` |
| focus-within | `border-edge-brand` + popover เปิด |
| กำลังพิมพ์ | รายการกรองตามคำ |
| ไม่พบผลลัพธ์ | "ไม่พบตัวเลือกที่ตรงกัน" |
| invalid | `border-edge-danger` |

### ★★★ Thai IME — จุดที่ ComboBox ต่างจาก `TextField` อย่างมีนัยสำคัญ

ComboBox กรองรายการ **ทุก keystroke** · ระหว่างประกอบตัวอักษรไทย รายการจะกรองด้วยคำที่ยังไม่สมบูรณ์:

```
ก → กร → กรุ → กรุง → กรุงเ → … → กรุงเทพ
```

ต่างจาก `TextField` ตรงที่ **ผลลัพธ์เห็นได้ทันที** — ผู้ใช้เห็นรายการกระพริบว่างเปล่ากลางทาง แล้วคิดว่าไม่มีข้อมูล จึงลบทิ้งพิมพ์ใหม่

⚠️ **แต่กัน `onInputChange` ทั้งหมดไม่ได้** เหมือน TextField เพราะผู้ใช้ต้องเห็นสิ่งที่ตัวเองพิมพ์ในช่อง

**ทางแก้:** ปล่อยให้ช่องแสดงข้อความตามปกติ แต่ **กันเฉพาะการกรอง** ระหว่าง composition แล้วกรองทีเดียวตอน `onCompositionEnd`

```tsx
onCompositionStart={() => setComposing(true)}
onCompositionEnd={(e) => {
  setComposing(false);
  onInputChange?.((e.target as HTMLInputElement).value);   /* กรองทีเดียว */
}}
onChange={(e) => { if (!isComposing) onInputChange?.(e.target.value); }}
```

รายการจะค้างที่ผลของคำก่อนหน้าจนประกอบเสร็จ — นิ่งกว่ากระพริบมาก

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `combobox` — **วัดแล้ว** `role="combobox"` บน input |
| keyboard | ลูกศรเลื่อน · Enter เลือก · Esc ปิด |
| **SC 4.1.3** | RAC ประกาศจำนวนตัวเลือกผ่าน live region ของตัวเอง |
| **SC 1.4.1** | selected มีเครื่องหมายถูก (จาก `SelectItem`) |
| **SC 2.4.7** | `p-1` ใน listbox |

### ★ ข้อความประกาศของ RAC แปลไทยแล้ว

`@react-aria/combobox` มี 5 ข้อความ — `countAnnouncement` · `focusAnnouncement` · `selectedAnnouncement` · `buttonLabel` · `listboxLabel`

แปลไว้ใน `strings-rac.th.ts` แล้ว · จะเป็นภาษาไทยเมื่อเรียก `installRacThaiStrings` ที่ root ของแอป (ดู [SmeGoProvider](../provider/SmeGoProvider.tsx))

**ถ้าไม่เรียก** ผู้ใช้ TalkBack ไทยจะได้ยิน "5 options available" เป็นภาษาอังกฤษ

### ★ `description` ควรบอกว่าพิมพ์ค้นหาได้

ผู้ใช้จำนวนมากไม่รู้ว่า combobox ต่างจาก select — `placeholder="พิมพ์เพื่อค้นหาจังหวัด"` ทำหน้าที่นี้

---

## 6 · Tailwind implementation

```tsx
<RACComboBox
  validationBehavior="aria"
  allowsEmptyCollection      /* ★ ไม่งั้น popover ปิดเงียบ */
  menuTrigger="focus"        /* ★ เห็นตัวเลือกก่อนพิมพ์ */
>
```

```tsx
<ListBox
  items={options}
  renderEmptyState={() => (
    <p className="px-3 py-4 text-center text-body-sm text-fg-muted">
      {s.common.noMatches}
    </p>
  )}
  className="max-h-64 overflow-auto p-1 outline-none"
>
  {(item) => <SelectItem id={item.id} textValue={item.label} …>…</SelectItem>}
</ListBox>
```

`textValue` จำเป็นเมื่อ `children` ไม่ใช่ข้อความล้วน — RAC ใช้ค่านี้ทั้งในการกรองด้วยการพิมพ์และในการประกาศ

---

## 7 · Figma Variant

Component set **`ComboBox`**

| Property | Values |
|---|---|
| `State` | `Default` · **`Focus`** · `Open` · `Invalid` · `Disabled` |
| `Results` | `Filtered` · **`Empty (ไม่พบ)`** |

**`Empty` frame ต้องมี** — ถ้าไม่มี นักพัฒนาจะไม่ตั้ง `allowsEmptyCollection` แล้ว popover จะปิดเงียบ

**ต้องเขียนใน description ว่ากรองเฉพาะตอน composition จบ** — เป็นพฤติกรรมที่มองไม่เห็นแต่ห้ามลบ

---

## 8 · Usage

```tsx
<ComboBox
  label="จังหวัดที่จัดส่ง"
  placeholder="พิมพ์เพื่อค้นหาจังหวัด"
  options={provinces}
  selectedKey={province}
  onSelectionChange={(k) => setProvince(String(k))}
/>
```

```tsx
// กรองเองที่ฝั่งผู้เรียก — เมื่อรายการมาจาก API
const [query, setQuery] = useState('');
const filtered = useMemo(
  () => all.filter((p) => p.label.includes(query)),
  [all, query],
);

<ComboBox
  label="ชื่อผู้ขาย"
  options={filtered}
  inputValue={query}
  onInputChange={setQuery}
/>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| กรองทุก keystroke ระหว่าง IME | กรองตอน `onCompositionEnd` | รายการกระพริบว่างกลางคำ |
| กัน `onChange` ทั้งหมดแบบ TextField | กันเฉพาะการกรอง | ผู้ใช้ไม่เห็นสิ่งที่ตัวเองพิมพ์ |
| ไม่ตั้ง `allowsEmptyCollection` | ตั้ง (ตายตัวแล้ว) | popover ปิดเงียบเมื่อไม่พบ |
| ไม่มีข้อความ "ไม่พบ" | `renderEmptyState` | ผู้ใช้ไม่รู้ว่าพิมพ์ผิดหรือไม่มีข้อมูล |
| ComboBox กับ 5 ตัวเลือก | `<Select>` | การพิมพ์ไม่ช่วยอะไร |
| ใช้แทน `<SearchField>` | `<SearchField>` | ComboBox บังคับเลือกจากรายการ |
| รายการหน้าตาต่างจาก Select | ใช้ `SelectItem` ร่วมกัน | ผู้ใช้คิดว่าเป็นคนละอย่าง |
| ลืม `textValue` | ใส่เสมอ | การกรองด้วยการพิมพ์และการประกาศพัง |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · `SC 4.1.3` ประกาศจำนวนผลลัพธ์ |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` ทุกชั้น · listbox ใช้ `max-h-64` เป็น**เพดาน** ไม่ใช่ความสูงตายตัว จึงยืดตามเนื้อหาได้ |
| โหมดมืด (Dark Mode) | ✅ | เงาของ popover มาจาก `--elevation-*` ไม่ใช่ `shadow-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-within` · ลูกศรขึ้น/ลงเลื่อนตัวเลือก · `Esc` ปิด · `Enter` เลือก (RAC จัดการครบ) |
| กำลังโหลด (Loading) | ✅ | §4 "กำลังพิมพ์" — ผลลัพธ์ที่ยังไม่มาไม่ถูกแสดงเป็นรายการว่าง |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `errorMessage` (SC 3.3.1) |
| ว่างเปล่า (Empty) | ✅ | §4 **"ไม่พบผลลัพธ์"** เป็นสถานะที่ออกแบบไว้ ไม่ใช่ listbox เปล่า |
| Skeleton | — | รายการตัวเลือกสั้นและมาพร้อมกันทั้งชุด · แถบสีเทาแทนที่จะทำให้เมนูกระพริบ |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) · เข้า/ออกด้วย `fade` opacity ล้วน |
| ประสิทธิภาพ (Performance) | ✅ | กรองในหน่วยความจำ ไม่มี layout thrash · popover ถูก portal ออกไปจึงไม่ทำให้ฟอร์ม reflow |
