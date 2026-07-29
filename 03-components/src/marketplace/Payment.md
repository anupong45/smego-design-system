# PaymentMethodSelect · PromptPayQR · SlipUpload · PaymentFields

**`@smego/ui`** · ชั้น 03 · [Payment.tsx](./Payment.tsx)

---

## 1 · ภาพรวม

การเลือกและดำเนินการชำระเงินสำหรับ **B2B ไทย**

### ⚠️⚠️ ขอบเขตความรับผิดชอบ

component เหล่านี้ทำหน้าที่ **UI เท่านั้น** — การรับส่งข้อมูลบัตรเป็นเรื่องของ payment gateway ไม่ใช่ของ library นี้

**กฎที่ผูกกับ component จ่ายเงิน:**

- **ห้าม log** ค่าใด ๆ ที่ผู้ใช้กรอก
- ห้ามเก็บเลขบัตรใน state นานกว่า render
- **ต้องวางได้ทุกช่อง** รวม OTP (SC 3.3.8) — ห้าม `onPaste preventDefault`
- `autocomplete` ต้องครบ (SC 1.3.5)

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| **ช่องกรอกเลขบัตร** | iframe ของ gateway | กันขอบเขต PCI DSS ไม่ให้ลามมาถึงแอป |
| ยืนยัน OTP | `<OTPField>` (Pass 2) | ต้องวางเลข 6 หลักได้ |
| แสดงสถานะการชำระ | `<OrderTimeline>` | |

---

## 2 · React API

```tsx
<PaymentMethodSelect value={method} onChange={setMethod} />
<PromptPayQR qrSrc={qr} amount={1_337_500} reference="0105561234567-2569-0042" />
<SlipUpload onSelect={upload} uploadedName={name} onRemove={remove} />
```

### PaymentMethodSelect

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `value` | `PaymentMethod` | — | `'promptpay' \| 'transfer' \| 'credit-term' \| 'card'` |
| `onChange` | `(v) => void` | — | |
| `disabledMethods` | `PaymentMethod[]` | — | เช่นเครดิตเทอมที่ยังไม่อนุมัติวงเงิน |
| `errorMessage` | `string` | — | |

**ไม่มี prop `methods`** — ลำดับถูกบังคับไว้ในตัว component ดู §3

### PromptPayQR

| prop | type | หมายเหตุ |
|---|---|---|
| `qrSrc` | `string` | `data:` URI หรือ URL จาก backend |
| `amount` | `number` | **แสดงเป็นข้อความ ไม่ใช่ในภาพ** |
| `reference` | `string` | คัดลอกได้ |

### SlipUpload

| prop | type | หมายเหตุ |
|---|---|---|
| `onSelect` | `(file: File) => void` | เรียกหลังตรวจผ่าน |
| `uploadedName` | `string` | แสดงสถานะสำเร็จ |
| `onRemove` | `() => void` | |

---

## 3 · Variants

### ★★★ ลำดับช่องทางต้องตรงกับที่ SME ไทยใช้จริง

```
พร้อมเพย์ QR → โอน + อัปโหลดสลิป → เครดิตเทอม → บัตรเครดิต
```

การเอาบัตรขึ้นก่อนเป็น **สมมติฐานแบบ B2C ตะวันตก** ที่ไม่ตรงกับ B2B ไทย

ผู้ประกอบการจำนวนมาก **ไม่มีบัตรเครดิตนิติบุคคล** และการโอนพร้อมสลิปยังเป็นช่องทางหลักของการค้าส่ง

ลำดับนี้ถูกบังคับด้วย **ลำดับใน array ภายใน component** ไม่ใช่ปล่อยให้ผู้เรียกเรียงเอง — เพื่อไม่ให้ drift ระหว่างหน้า

**วัดแล้ว:** พร้อมเพย์อยู่บนสุด · บัตรอยู่ล่างสุด · เครดิตเทอม disabled ได้

### ★ ใช้ `<Radio layout="card">`

แต่ละช่องทางต้องมีคำอธิบาย ("โอนแล้วอัปโหลดสลิปเพื่อยืนยัน") — layout `card` ให้ที่พอและทำให้ทั้งกล่องกดได้ (**วัดได้ 596×82px**)

---

## 4 · States

| component | states |
|---|---|
| `PaymentMethodSelect` | สืบทอดจาก `RadioList` — default · hover · focus · selected · disabled · invalid |
| `SlipUpload` | ยังไม่เลือก · **อัปโหลดแล้ว** (พื้น success + ชื่อไฟล์) · **error** (`role="alert"`) |
| `PromptPayQR` | ไม่มี state |

### ★ error ของ `SlipUpload` ใช้ `role="alert"`

ต่างจากจำนวนผลลัพธ์ที่ใช้ `aria-live="polite"` — ที่นี่ผู้ใช้ **เพิ่งทำสิ่งที่ล้มเหลวและต้องทำใหม่ทันที** การรอให้ประกาศเมื่อว่างทำให้ผู้ใช้กดอัปโหลดซ้ำโดยไม่รู้ว่าพลาดอะไร

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.1.1** | QR มีทางเลือกเป็นข้อความ |
| **SC 1.3.5** | `autocomplete` ครบสำหรับช่องบัตร |
| **SC 3.3.8** | วางได้ทุกช่อง — **ห้าม** `onPaste preventDefault` |
| **SC 2.2.1** | ห้าม countdown ที่รีเฟรชเอง |
| **SC 4.1.3** | error ประกาศผ่าน `role="alert"` |

### ★★★ QR ต้องมีทางเลือกที่เป็นข้อความเสมอ (SC 1.1.1)

ผู้ใช้ที่มองไม่เห็น **สแกน QR บนจอตัวเองไม่ได้** · ผู้ใช้ที่เปิดจากมือถือเครื่องเดียวกับที่จะสแกนก็ **สแกนตัวเองไม่ได้**

ยอดเงินและเลขอ้างอิงจึงเป็น **ข้อความจริงที่คัดลอกได้** ไม่ใช่อยู่ในภาพ

`alt` ของภาพ QR **ไม่พยายามอธิบายรหัส** — ใส่แค่ว่านี่คือ QR สำหรับชำระเงิน แล้วให้ข้อมูลจริงอยู่ข้างนอก

**วัดแล้ว:** `alt="คิวอาร์โคดพร้อมเพย์สำหรับชำระเงิน"` + ยอด `1,337,500.00` เป็นข้อความ

### ★★ QR อยู่บนพื้นขาวตายตัว — **ห้ามกลับสีในโหมดมืด**

`bg-white` เขียนตรง ไม่ใช่ token · QR ต้องมี contrast สูงสุดสำหรับกล้อง และ **เครื่องอ่านจำนวนมากอ่าน QR ที่กลับสีไม่ได้**

**วัดแล้ว:** พื้นเป็น `rgb(255, 255, 255)` ทั้งสองธีม

นี่เป็นข้อยกเว้นที่ถูกต้องของกฎ "ห้ามใช้สีดิบ" — และเป็นเหตุผลที่ต้องเขียนกำกับไว้

### ★★ input ที่ซ่อนอยู่ **ยังต้องมีชื่อ**

`<span>` ที่มองเห็นข้างบนไม่ได้ผูกกับ input เอง — ผู้ใช้ screen reader ที่เข้า **forms mode** จะเจอ input ที่ไม่มีชื่อ

**axe จับข้อนี้ให้** (rule `label`) ตอนรันเทสชุดแรก · แก้ด้วย `aria-labelledby` ชี้ไปที่ `<span>` นั้น

```tsx
<span id={labelId} className="text-label text-fg-secondary">{s.payment.uploadSlip}</span>
<input type="file" aria-labelledby={labelId} className="sr-only" … />
```

### ★★ `<input type="file">` ต้องซ่อนด้วย `sr-only` ไม่ใช่ `display: none`

`display: none` ทำให้ **focus ไปไม่ถึงและ screen reader มองไม่เห็น** — ปุ่มจะกดไม่ได้ด้วยคีย์บอร์ด

และเหตุผลที่ต้องซ่อนเลย: UI ของ `<input type="file">` **style ไม่ได้ และขึ้นภาษาตาม OS** — ผู้ใช้ที่ตั้งเครื่องเป็นอังกฤษจะเห็น "Choose File" กลางฟอร์มไทย

(เหตุผลเดียวกับที่ห้าม `validationBehavior="native"` — ดู [TextInput.md §5](../inputs/TextInput.md))

### ★ ห้าม countdown ที่หมดอายุแล้วหน้าเปลี่ยนเอง (SC 2.2.1)

ถ้า QR มีอายุ ต้องมี **ปุ่มขอใหม่** ไม่ใช่รีเฟรชอัตโนมัติ — ผู้ใช้ที่กำลังเปิดแอปธนาคารอยู่จะกลับมาเจอ QR คนละอัน

### ★ ตรวจไฟล์ฝั่ง client เพื่อ**ความเร็ว** ไม่ใช่ความปลอดภัย

การตรวจจริงต้องทำที่ server เสมอ — client-side check มีไว้ให้ผู้ใช้รู้ผลทันทีโดยไม่ต้องรอ upload 5MB

---

## 6 · Tailwind implementation

```tsx
/* ★ ลำดับตายตัว */
const methods = [
  { id: 'promptpay',   label: s.payment.promptpay,    description: s.payment.promptpayHelp },
  { id: 'transfer',    label: s.payment.bankTransfer, description: s.payment.bankTransferHelp },
  { id: 'credit-term', label: s.payment.creditTerm,   description: s.payment.creditTermHelp },
  { id: 'card',        label: s.payment.card,         description: '' },
];
```

```tsx
{/* ★ พื้นขาวตายตัว — ห้ามกลับสีในโหมดมืด */}
<div className="rounded-(--radius-sm) bg-white p-3">
  <img src={qrSrc} alt={s.payment.qrLabel} width={200} height={200} className="block size-50" />
</div>
```

```tsx
{/* ★ input ซ่อนด้วย sr-only ไม่ใช่ display:none */}
<input ref={inputRef} type="file" accept="image/jpeg,image/png"
  aria-describedby={cn(descId, error && errorId)}
  aria-invalid={error ? true : undefined}
  className="sr-only"
  onChange={(e) => handleFile(e.target.files?.[0])} />
<Button variant="secondary" icon="upload" onPress={() => inputRef.current?.click()}>
  {s.payment.uploadSlip}
</Button>
```

`select-all` บนเลขอ้างอิง — ดับเบิลคลิกเลือกทั้งก้อน ไม่ต้องลากทีละตัว

---

## 7 · Figma Variant

Component set **`PaymentMethodSelect`**

| Property | Values |
|---|---|
| `Selected` | `PromptPay` · `Transfer` · `Credit term` · `Card` |
| `Disabled methods` | `None` · `Credit term` |

**ลำดับใน Figma ต้องตรงกับโค้ด** — ถ้านักออกแบบเรียงบัตรขึ้นก่อนเพราะ "ดูคุ้นตา" จะขัดกับ component ทันที

Component set **`PromptPayQR`** — property `Reference` = `True` · `False`
**พื้นหลัง QR ต้องเป็นขาวใน mode มืดด้วย** ห้ามผูกกับตัวแปรพื้นผิว

Component set **`SlipUpload`** — property `State` = `Empty` · **`Uploaded`** · **`Error`**

---

## 8 · Usage

```tsx
<PaymentMethodSelect
  value={method}
  onChange={setMethod}
  disabledMethods={creditApproved ? [] : ['credit-term']}
  errorMessage={submitted && !method ? 'กรุณาเลือกวิธีชำระเงิน' : undefined}
/>

{method === 'promptpay' && (
  <PromptPayQR qrSrc={qr.src} amount={total} reference={qr.reference} />
)}

{method === 'transfer' && (
  <SlipUpload onSelect={uploadSlip} uploadedName={slip?.name} onRemove={removeSlip} />
)}
```

```tsx
// ช่องบัตร — ใช้ iframe ของ gateway เป็นค่าเริ่มต้น
<PaymentFields>
  <div ref={omiseCardFieldRef} />
</PaymentFields>

// ถ้าจำเป็นต้องกรอกเอง — autocomplete ครบ และห้ามบล็อกการวาง
<TextInput label="เลขบัตร" autoComplete="cc-number" inputMode="numeric" />
<TextInput label="วันหมดอายุ" autoComplete="cc-exp" inputMode="numeric" />
<TextInput label="รหัสหลังบัตร" autoComplete="cc-csc" inputMode="numeric" />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| บัตรเครดิตเป็นตัวเลือกแรก | พร้อมเพย์ก่อน | SME ไทยจำนวนมากไม่มีบัตรนิติบุคคล |
| ให้ผู้เรียกส่ง `methods` เอง | ลำดับตายตัวใน component | drift ระหว่างหน้า |
| ยอดเงินอยู่ในภาพ QR อย่างเดียว | ข้อความข้างนอกด้วย | ผู้ใช้ที่มองไม่เห็นสแกนจอตัวเองไม่ได้ |
| QR กลับสีในโหมดมืด | `bg-white` ตายตัว | เครื่องอ่านหลายรุ่นอ่านไม่ได้ |
| `alt` อธิบายรหัสใน QR | `alt` บอกว่านี่คือ QR ชำระเงิน | ข้อมูลจริงต้องเป็นข้อความ |
| `display: none` บน file input | `sr-only` | focus ไปไม่ถึง กดด้วยคีย์บอร์ดไม่ได้ |
| input ที่ซ่อนไม่มี `aria-labelledby` | ชี้ไปที่ `<span>` ที่แสดงอยู่ | forms mode เจอ input ไม่มีชื่อ (axe: `label`) |
| ใช้ `<input type="file">` ดิบ | ปุ่มคุม input ที่ซ่อน | UI ขึ้นภาษาตาม OS |
| `onPaste={e => e.preventDefault()}` | ปล่อยให้วางได้ | ไม่ผ่าน SC 3.3.8 |
| QR countdown แล้วรีเฟรชเอง | ปุ่มขอใหม่ | SC 2.2.1 |
| เก็บเลขบัตรใน state | iframe ของ gateway | ขอบเขต PCI DSS ลามมาถึงแอป |
| `console.log(cardNumber)` | ไม่ log อะไรเลย | |
| error ใช้ `aria-live="polite"` | `role="alert"` | ผู้ใช้ต้องทำใหม่ทันที |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` ครบทั้ง 3 ตัว · เทส **"เรียงพร้อมเพย์ก่อน บัตรท้ายสุด"** ตรงกับวิธีจ่ายจริงของ SME ไทย · `SC 1.1.1` QR มีคำบรรยาย |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · QR เป็นสี่เหลี่ยมจัตุรัสที่ย่อตามกล่องได้ · รายการวิธีชำระซ้อนแนวตั้งเสมอ |
| โหมดมืด (Dark Mode) | ✅ | `bg-scannable` สำหรับพื้น QR ซึ่ง**ต้องขาวทั้งสองโหมด** เพราะกล้องอ่านจากคอนทราสต์จริง · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | `SC 3.3.8` และ `SC 1.3.5` — เลขอ้างอิงคัดลอกและวางได้ · `SlipUpload` มีปุ่มเลือกไฟล์เสมอ ไม่ใช่แค่พื้นที่ลาก |
| กำลังโหลด (Loading) | — | `SlipUpload` ไม่มีสถานะ "กำลังอัปโหลด" ในตัว **โดยเจตนา** — `isLoading` ของ Astryx อยู่นอกขอบเขต parity ตามคำตัดสิน 2026-07-28 ข้อ 1 (ขอบเขต = ชื่อ + prop สี่ตัวของ §8) · การแสดงความคืบหน้าเป็นของหน้าที่ประกอบด้วย [`<ProgressBar>`](../feedback/ProgressBar.md) ซึ่งมี `unknown` สำหรับงานที่ยังไม่รู้ระยะ · ปิดหนี้ 2.3 เมื่อ 2026-07-29 |
| ข้อผิดพลาด (Error) | ✅ | `errorMessage` · สลิปที่อ่านไม่ออกหรือยอดไม่ตรงบอกเป็นข้อความพร้อมวิธีแก้ |
| ว่างเปล่า (Empty) | ✅ | `SlipUpload` ก่อนอัปโหลดบอกชนิดและขนาดไฟล์ที่รับได้ (axe ผ่านทั้งสองสถานะ) · วิธีชำระที่ใช้ไม่ได้ใช้ `disabledMethods` พร้อมเหตุผล ไม่ใช่ซ่อนทิ้ง |
| Skeleton | — | ขั้นตอนชำระเงินต้องแสดงของจริงเท่านั้น |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — `SC 2.2.1` เวลานับถอยหลังของ QR แสดงเป็นตัวเลข ไม่ใช่แถบที่วิ่ง และต่ออายุได้ |
| ประสิทธิภาพ (Performance) | ✅ | QR เป็นภาพที่ส่งมาแล้ว ไม่ได้ generate ในเบราว์เซอร์ · ไม่มีความสูงตายตัว |
