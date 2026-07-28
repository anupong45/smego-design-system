# FileInput

**`@smego/ui`** · ชั้น 03 · [FileInput.tsx](./FileInput.tsx)

> เดิมชื่อ `FileUpload` — เปลี่ยนตาม ASTRYX-PARITY.md §1.2 · `files`→`value` · `onSelect`→`onChange` · `multiple`→`isMultiple` · `maxSizeMb`→`maxSize` ตาม §8

---

## 1 · ภาพรวม

อัปโหลดเอกสาร — หนังสือรับรอง · งบการเงิน · ใบรับรองมาตรฐาน · รูปสินค้า

**พื้นที่ลากวางเป็นของเสริม ไม่ใช่ทางเดียว** — นั่นคือทั้งหมดของการออกแบบตัวนี้

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| สลิปการโอนเงิน | `<SlipUpload>` | มีการตรวจและสถานะเฉพาะ |
| รูปโปรไฟล์ | ตัวตัดรูป + FileInput | ต้อง crop ก่อนส่ง |
| ไฟล์ขนาดใหญ่มาก | อัปโหลดแบบ chunk | ต้องมีความคืบหน้าและ resume |

---

## 2 · React API

```tsx
<FileInput
  label="เอกสารประกอบการสมัคร"
  description="หนังสือรับรองนิติบุคคล และงบการเงินย้อนหลัง 2 ปี"
  isMultiple
  value={files}
  onChange={upload}
  onRemove={remove}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | — | **บังคับ** |
| `isLabelHidden` | `boolean` | `false` | ซ่อน label ด้วยตา แต่ยังประกาศให้ screen reader (§8.1) |
| `status` | `InputStatus` | — | `{ type: "error"\|"warning"\|"success", message? }` — `error` เท่านั้นที่ตั้ง `aria-invalid` |
| `isOptional` | `boolean` | `false` | ต่อท้าย label ว่า "(ไม่บังคับ)" |
| `description` | `string` | `s.common.uploadHelp(maxSize)` | |
| `accept` | `string[]` | JPEG · PNG · PDF | MIME types |
| `maxSize` | `number` | `5` | ต่อไฟล์ |
| `isMultiple` | `boolean` | `false` | |
| `value` | `UploadedFile[]` | — | `{ id, name, size }` |
| `onChange` | `(files: File[]) => void` | — | **บังคับ** · เรียกหลังตรวจผ่าน |
| `onRemove` | `(id: string) => void` | — | |
| `isDisabled` | `boolean` | `false` | |

---

## 3 · Variants

ไม่มี variant

| ส่วน | ค่า |
|---|---|
| พื้นที่ลาก | `border-dashed` · `p-6` |
| ตอนลากอยู่เหนือ | `border-edge-brand` · `bg-primary-50` |
| รายการไฟล์ | `border-edge` · `p-3` · ชื่อ `truncate` |
| ขนาดไฟล์ | `font-numeric` |

### ★★★ SC 2.5.7 — พื้นที่ลากวางเป็นรูปแบบที่ละเมิดข้อนี้บ่อยที่สุด

ผู้ใช้ที่ควบคุมการลากได้ยาก (**โรคสั่น · ใช้หัวชี้ · switch + pointer emulation**) ต้องมีทาง **กดครั้งเดียว** ที่ทำสิ่งเดียวกันได้

component จึงมี **ปุ่ม "เลือกไฟล์" เสมอ** — และปุ่มนั้น **ไม่ใช่ของสำรอง** แต่เป็นทางหลักบนมือถือซึ่งลากไม่ได้อยู่แล้ว

**มีเทสยืนยัน:**

```
✓ ★ FileInput มีปุ่มเลือกไฟล์เสมอ — ไม่ใช่แค่พื้นที่ลาก (SC 2.5.7)
```

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `border-edge-strong` เส้นประ |
| **กำลังลากเหนือ** | `border-edge-brand` · `bg-primary-50` |
| มีไฟล์แล้ว | รายการไฟล์ใต้พื้นที่ลาก |
| error | `role="alert"` + ข้อความ |
| disabled | `border-edge` · `bg-sunken` |

### ★ ไฮไลต์ตอนลากเป็น **ของแถมสำหรับผู้ที่มองเห็น**

ผู้ใช้ที่มองไม่เห็นไม่รู้ว่าลากอยู่เหนือพื้นที่ไหน — การลากวางจึงประกาศไม่ได้จริง

ตัวที่ประกาศได้คือ **ปุ่ม** ซึ่งเป็นเหตุผลอีกข้อว่าทำไมปุ่มต้องมี

### ★ ล้าง `e.target.value` หลังเลือก

```tsx
onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
```

ถ้าไม่ล้าง ผู้ใช้ที่ลบไฟล์แล้วเลือก **ไฟล์เดิมซ้ำ** จะไม่เกิด `change` event เพราะค่าไม่เปลี่ยน

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 2.5.7** | ปุ่มเลือกไฟล์มีเสมอ |
| **SC 2.5.3** | ปุ่มลบมีชื่อไฟล์ในชื่อปุ่ม |
| **SC 4.1.3** | error ผ่าน `role="alert"` |
| input | `sr-only` + `aria-labelledby` |

### ★★★ **ห้ามใช้ `<input type="file">` ดิบ**

UI ของมัน **style ไม่ได้และขึ้นภาษาตาม OS** — ผู้ใช้ที่ตั้งเครื่องเป็นอังกฤษจะเห็น **"Choose File · No file chosen"** กลางฟอร์มไทย

เหตุผลเดียวกับ `<select>` และ `validationBehavior="native"`

### ★★ input ที่ซ่อนต้อง `sr-only` **ไม่ใช่ `display: none`** และ **ยังต้องมีชื่อ**

`display: none` ทำให้ **focus ไปไม่ถึง** — กดด้วยคีย์บอร์ดไม่ได้

และ `<span>` ที่มองเห็นข้างบน **ไม่ได้ผูกกับ input เอง** → ต้องมี `aria-labelledby`

⚠️ ข้อหลัง **axe จับได้ตอนเขียน `SlipUpload`** (rule `label`) — เป็นความผิดพลาดที่เห็นด้วยตาไม่ได้เลย

**วัดแล้ว:** `display: block` · `width: 1px` · `aria-labelledby` มี ✅

### ★★ ปุ่มลบต้องมีชื่อไฟล์

```
❌ "ลบ" × 5
✅ "นำไฟล์ หนังสือรับรองนิติบุคคล.pdf ออก"
```

ในรายการ 5 ไฟล์ ปุ่มที่ชื่อ "ลบ" ทั้ง 5 อันแยกกันไม่ได้ (SC 2.5.3) — **มีเทสยืนยันว่าชื่อไม่ซ้ำกัน**

### ★ ตรวจไฟล์ฝั่ง client เพื่อ **ความเร็ว** ไม่ใช่ความปลอดภัย

การตรวจจริงต้องทำที่ server เสมอ — client-side check มีไว้ให้ผู้ใช้รู้ผลทันทีโดยไม่ต้องรออัปโหลด 5MB

---

## 6 · Tailwind implementation

```tsx
<div
  onDragOver={(e) => { e.preventDefault(); if (!isDisabled) setDragging(true); }}
  onDragLeave={() => setDragging(false)}
  onDrop={handleDrop}
  className={cn(
    'grid min-w-0 justify-items-center gap-3',
    'rounded-(--radius-container) border border-dashed p-6',
    'transition-colors duration-fast ease-standard',
    isDragging ? 'border-edge-brand bg-primary-50' : 'border-edge-strong bg-surface',
    isDisabled && 'border-edge bg-sunken',
  )}
>
  <Icon name="upload" size={32} className="text-fg-muted" />
  <p className="text-center text-body-sm text-fg-secondary">{s.common.dropFilesHere}</p>

  {/* ★★ ทางที่ไม่ต้องลาก (SC 2.5.7) */}
  <input ref={inputRef} type="file" aria-labelledby={labelId} className="sr-only" … />
  <Button variant="secondary" size="sm" onPress={() => inputRef.current?.click()}>
    {s.common.chooseFile}
  </Button>
</div>
```

ไม่มี `role` บนพื้นที่ลาก — การลากไม่ใช่ interaction ที่ประกาศได้ · ตัวที่ประกาศได้คือปุ่มข้างใน

---

## 7 · Figma Variant

Component set **`FileInput`**

| Property | Values |
|---|---|
| `State` | `Empty` · **`Dragging`** · `Has files` · `Error` · `Disabled` |
| `Multiple` | `True` · `False` |

**ปุ่ม "เลือกไฟล์" ต้องอยู่ในทุก frame รวมถึง `Dragging`** — ถ้านักออกแบบวาดแค่พื้นที่ลากในบาง frame นักพัฒนาจะตัดปุ่มออกและตก SC 2.5.7

**ห้ามวาด `<input type="file">` แบบ native** ในตัวอย่าง

---

## 8 · Usage

```tsx
const [files, setFiles] = useState<UploadedFile[]>([]);

<FileInput
  label="เอกสารประกอบการสมัคร"
  description="หนังสือรับรองนิติบุคคล และงบการเงินย้อนหลัง 2 ปี — ไฟล์ PDF ไม่เกิน 5 เมกะไบต์"
  accept={['application/pdf']}
  maxSize={5}
  isMultiple
  value={files}
  onChange={async (selected) => {
    const uploaded = await Promise.all(selected.map(upload));
    setFiles((prev) => [...prev, ...uploaded]);
  }}
  onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
/>
```

```tsx
// รูปสินค้า — จำกัดชนิดและขนาดต่างออกไป
<FileInput
  label="รูปสินค้า"
  accept={['image/jpeg', 'image/png']}
  maxSize={2}
  isMultiple
  value={images}
  onChange={uploadImages}
  onRemove={removeImage}
/>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| พื้นที่ลากอย่างเดียว | + ปุ่มเลือกไฟล์เสมอ | **ไม่ผ่าน SC 2.5.7** · มือถือลากไม่ได้ |
| `<input type="file">` ดิบ | ปุ่มคุม input ที่ซ่อน | UI ขึ้นภาษาตาม OS |
| `display: none` บน input | `sr-only` | focus ไปไม่ถึง |
| input ซ่อนไม่มี `aria-labelledby` | มี | forms mode เจอ input ไม่มีชื่อ (axe จับได้) |
| ปุ่มลบชื่อ "ลบ" | รวมชื่อไฟล์ | 5 ปุ่มชื่อเดียวกัน (SC 2.5.3) |
| ไม่ล้าง `e.target.value` | ล้างหลังเลือก | เลือกไฟล์เดิมซ้ำไม่ได้ |
| เชื่อการตรวจฝั่ง client | ตรวจที่ server ด้วย | client check มีไว้เพื่อความเร็วเท่านั้น |
| ไฮไลต์ตอนลากเป็น feedback เดียว | ปุ่มคือตัวที่ประกาศได้ | ผู้ใช้ที่มองไม่เห็นไม่รู้ว่าลากอยู่ตรงไหน |
| ขนาดไฟล์ไม่ใช้ `font-numeric` | ใช้ | ตัวเลขในรายการไม่ตรงแนว |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · เทส "ซ่อน input ด้วย `sr-only` ไม่ใช่ `display:none` และมีชื่อ" · "ปุ่มลบมีชื่อไฟล์ในชื่อปุ่ม" (SC 2.5.3) |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` — ชื่อไฟล์ยาวตัดด้วย ellipsis แทนดันกล่องล้นที่ 320px |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §5 `SC 2.5.7` เทส "มีปุ่มเลือกไฟล์เสมอ — ไม่ใช่แค่พื้นที่ลาก" · ผู้ใช้คีย์บอร์ดอัปโหลดได้โดยไม่ต้องลาก |
| กำลังโหลด (Loading) | ⚠️ | ความคืบหน้าการอัปโหลดยังไม่มีใน component นี้ — ประกอบเองด้วย [`<ProgressBar>`](../feedback/ProgressBar.md) · **หนี้:** ยังไม่มีสถานะ "กำลังอัปโหลด" ใน §4 |
| ข้อผิดพลาด (Error) | ✅ | §4 `error` — ไฟล์ผิดชนิดหรือใหญ่เกินบอกเป็นข้อความพร้อมเกณฑ์ที่รับได้ |
| ว่างเปล่า (Empty) | ✅ | §4 `default` = ยังไม่มีไฟล์ ซึ่งบอกชนิดและขนาดที่รับได้ ไม่ใช่กรอบเปล่า |
| Skeleton | — | พื้นที่วางไฟล์เป็นโครงคงที่ ไม่ได้แทนเนื้อหาที่กำลังโหลด |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | ไม่อ่านไฟล์เข้าหน่วยความจำเพื่อทำ preview · ไม่มีความสูงตายตัว |
