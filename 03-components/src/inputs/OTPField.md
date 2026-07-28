# OTPField

**`@smego/ui`** · ชั้น 03 · [OTPField.tsx](./OTPField.tsx)

---

## 1 · ภาพรวม

ช่องกรอกรหัสยืนยัน 6 หลัก — ใช้กับการยืนยันตัวตนและการยืนยันการชำระเงิน

**เป็น component ที่ SC 3.3.8 บังคับพฤติกรรมโดยตรง** และเป็นรูปแบบที่พังข้อนี้บ่อยที่สุด

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| รหัสยาวกว่า ~8 หลัก | `<TextInput>` | กล่องแยกเกิน 8 อันสแกนด้วยตายาก |
| รหัสที่มีตัวอักษร | `<TextInput>` | `inputMode="numeric"` จะเปิดแป้นผิด |
| รหัสผ่าน | `<TextInput type="password">` | ต้องซ่อนค่าและให้ตัวจัดการรหัสผ่านกรอก |
| เลขบัตรเครดิต | iframe ของ gateway | ดู [Payment.md](../marketplace/Payment.md) |

---

## 2 · React API

```tsx
const [otp, setOtp] = useState('');

<OTPField value={otp} onChange={setOtp} onComplete={verify} />
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `value` | `string` | — | **บังคับ** — controlled เท่านั้น |
| `onChange` | `(v: string) => void` | — | **บังคับ** |
| `onComplete` | `(v: string) => void` | — | เรียกเมื่อครบทุกหลัก |
| `length` | `number` | `6` | |
| `label` | `string` | `s.payment.otpLabel` | |
| `description` | `string` | `s.payment.otpHelp` | |
| `errorMessage` | `string` | — | ประกาศผ่าน `role="alert"` |
| `isDisabled` | `boolean` | `false` | |

**controlled เท่านั้นโดยตั้งใจ** — รหัส OTP มีอายุสั้นและต้องล้างจากภายนอกได้เมื่อหมดเวลา

---

## 3 · Variants

ไม่มี variant

| ส่วน | ค่า |
|---|---|
| กล่องต่อหลัก | **44×48** |
| ตัวอักษร | `text-title` · `tabular-nums` · จัดกลาง |
| ขอบ | `border-edge-strong` → `edge-brand` ตอน focus |
| ระยะ | `gap-2` (8px) |

### ★ 44×48 ไม่ใช่ 24×24 ขั้นต่ำ

เกณฑ์ผ่านคือ 24 แต่ช่อง OTP ถูกกรอกด้วยนิ้วโป้งบนมือถือขณะที่ผู้ใช้กำลังสลับไปดู SMS — กล่องเล็กทำให้กดผิดช่อง

`text-title` (24px) ทำให้เห็นชัดว่ากรอกไปกี่หลักแล้วโดยไม่ต้องเพ่ง

---

## 4 · States

| state | สิ่งที่เปลี่ยน |
|---|---|
| default | `border-edge-strong` |
| focus | `border-edge-brand` + เลือกตัวเดิมอัตโนมัติ |
| invalid | `border-edge-danger` + `role="alert"` |
| disabled | `bg-sunken` · `text-fg-disabled` |

### ★ `onFocus` เรียก `select()`

ผู้ใช้ที่กดกลับไปช่องที่กรอกแล้วมักต้องการ **แทนที่** ไม่ใช่ต่อท้าย — การเลือกอัตโนมัติทำให้พิมพ์ทับได้เลย

### ★ Backspace มีสองพฤติกรรม

| ช่องปัจจุบัน | ผล |
|---|---|
| มีตัวเลข | ลบตัวในช่องนี้ ไม่ย้าย focus |
| ว่างอยู่แล้ว | ถอยไปช่องก่อนหน้าแล้วลบ |

ตรงกับที่ผู้ใช้คาดจากช่อง OTP ของแอปธนาคาร

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 3.3.8** | **ต้องวางได้** — ดูด้านล่าง |
| **SC 1.3.5** | `autocomplete="one-time-code"` |
| **SC 4.1.3** | ประกาศผลการวางผ่าน `aria-live` |
| **SC 2.5.8** | 44×48 |
| **SC 3.3.1** | error ผ่าน `role="alert"` |
| role | `group` ผูกช่องทั้งหมด · แต่ละช่องมีชื่อ |

### ★★★ SC 3.3.8 — ทำไมข้อนี้บังคับที่นี่

ตัวบท: ขั้นตอนยืนยันตัวตนต้องไม่บังคับให้ผู้ใช้ทำ **cognitive function test** (จำ · ถอดความ · คำนวณ) โดยไม่มีทางเลือก

การจำเลข 6 หลักจาก SMS แล้วพิมพ์ทีละช่อง **คือ** cognitive function test ทางออกที่ตัวบทยอมรับคือ **ต้องวางได้** และให้ตัวจัดการรหัสผ่านกรอกได้

⚠️ ช่อง OTP แบบ 6 กล่องแยกเป็นรูปแบบที่ **พังข้อนี้บ่อยที่สุด** เพราะนักพัฒนามักผูก `maxLength={1}` แล้วการวางจะได้แค่ตัวแรก

**ทางแก้:** ดัก `onPaste` ที่ระดับ **กลุ่ม** แล้วกระจายลงทุกช่อง

```tsx
<div role="group" onPaste={handlePaste}>
```

อยู่ที่กลุ่มจึงทำงานไม่ว่าผู้ใช้จะวางลงช่องไหน — **ทดสอบแล้วทั้งช่องแรกและช่องกลาง**

### ★★ ดึงเฉพาะตัวเลข — รองรับการคัดลอกทั้งประโยค

```
วาง: "รหัสยืนยันของคุณคือ 987654 หมดอายุใน 5 นาที"
ได้:  987654
```

ผู้ใช้จำนวนมาก **คัดลอกทั้งข้อความ SMS** ไม่ได้เลือกเฉพาะตัวเลข ถ้าไม่กรอง การวางจะไม่ได้อะไรเลยและผู้ใช้จะไม่รู้ว่าทำไม

### ★★ `autocomplete="one-time-code"` อยู่ที่ **ช่องแรกช่องเดียว**

ถ้าใส่ทุกช่อง iOS/Android จะเติม **เลขเดียวกันซ้ำ 6 ครั้ง**

**วัดแล้ว:** ช่อง 1 = `one-time-code` · ช่อง 2–6 = `off`

### ★ `inputMode="numeric"` ไม่ใช่ `type="number"`

`type="number"` ให้ปุ่มลูกศรที่ **ไม่มีความหมายกับ OTP** และ **ตัด leading zero ทิ้ง** — รหัส `012345` จะกลายเป็น `12345`

### ★ ทุกช่องมีชื่อที่ไม่ซ้ำกัน

```
"หลักที่ 1 จาก 6" … "หลักที่ 6 จาก 6"
```

ถ้าทุกช่องชื่อ "รหัสยืนยัน" เหมือนกัน ผู้ใช้ screen reader จะไม่รู้ว่าอยู่ช่องไหน

### ★ ประกาศผลการวาง

```tsx
<span aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</span>
```

ผู้ใช้ screen reader ที่วางรหัสต้องรู้ว่าเข้าไปครบไหม **โดยไม่ต้องไล่ฟังทีละช่อง**

---

## 6 · Tailwind implementation

```tsx
const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
  const text = e.clipboardData.getData('text/plain') || e.clipboardData.getData('text');
  const digits = text.match(/\d/g)?.join('') ?? '';
  if (!digits) return;

  /* preventDefault ที่นี่คือการ**แทนที่**พฤติกรรมด้วยของที่ดีกว่า
     ไม่ใช่การบล็อก — ถ้าไม่ทำ ช่องเดียวจะได้ทั้งสตริง */
  e.preventDefault();

  const next = commit(digits);
  setAnnouncement(s.payment.otpPasted(next.length));
  focusIndex(next.length);
};
```

```tsx
<input
  type="text"
  inputMode="numeric"
  autoComplete={i === 0 ? 'one-time-code' : 'off'}
  aria-label={s.payment.otpDigit(i + 1, length)}
  onFocus={(e) => e.target.select()}
  className={cn(
    'h-12 w-11 min-w-0 text-center',              /* 44×48 */
    'rounded-(--radius-control) border',
    'bg-surface text-title text-fg tabular-nums',
    'border-edge-strong focus:border-edge-brand',
    errorMessage && 'border-edge-danger',
  )}
/>
```

⚠️ อ่าน `text/plain` ก่อนแล้ว fallback `text` — ทั้งสองควรให้ค่าเดียวกันตามสเปก แต่การอ่านชื่อเต็มก่อนทนต่อ implementation ที่ไม่ normalize alias

---

## 7 · Figma Variant

Component set **`OTPField`**

| Property | Values |
|---|---|
| `Length` | `4` · `6` |
| `Filled` | `Empty` · `Partial` · `Complete` |
| `State` | `Default` · **`Focus`** · `Invalid` · `Disabled` |

**ต้องเขียนใน description ว่าการวางกระจายลงทุกช่อง** — เป็นพฤติกรรมที่มองไม่เห็นใน Figma แต่เป็นเงื่อนไขผ่าน SC 3.3.8 ถ้านักพัฒนาไม่รู้จะ implement เป็น `maxLength={1}` ธรรมดา

**ห้ามมี property `Mask`** — OTP ไม่ใช่รหัสผ่าน การซ่อนตัวเลขทำให้ผู้ใช้ตรวจสอบไม่ได้ว่ากรอกถูกไหม

---

## 8 · Usage

```tsx
const [otp, setOtp] = useState('');
const [error, setError] = useState<string>();

<OTPField
  value={otp}
  onChange={(v) => { setOtp(v); setError(undefined); }}
  onComplete={async (code) => {
    const ok = await verify(code);
    if (!ok) setError('รหัสยืนยันไม่ถูกต้อง — ขอรหัสใหม่หรือตรวจสอบข้อความอีกครั้ง');
  }}
  errorMessage={error}
/>
```

```tsx
// ยืนยันการชำระเงิน — ล้างจากภายนอกเมื่อหมดเวลา
useEffect(() => {
  if (expired) setOtp('');
}, [expired]);
```

```tsx
// รหัส 4 หลักสำหรับ PIN ยืนยันคำสั่งซื้อ
<OTPField length={4} label="รหัส PIN 4 หลัก" value={pin} onChange={setPin} />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `maxLength={1}` แล้วปล่อยการวางตามธรรมชาติ | ดัก `onPaste` ที่กลุ่ม | ได้แค่ตัวแรก = ไม่ผ่าน SC 3.3.8 |
| `onPaste={e => e.preventDefault()}` | กระจายลงทุกช่อง | บล็อกการวางคือการบังคับให้จำ |
| ดักการวางเฉพาะช่องแรก | ที่ระดับกลุ่ม | ผู้ใช้คลิกช่องไหนก็ได้ |
| รับเฉพาะสตริงตัวเลขล้วน | ดึงเฉพาะตัวเลขจากข้อความ | ผู้ใช้คัดลอกทั้ง SMS |
| `autocomplete="one-time-code"` ทุกช่อง | ช่องแรกช่องเดียว | ระบบเติมเลขเดียวกัน 6 ครั้ง |
| `type="number"` | `type="text"` + `inputMode="numeric"` | ลูกศรไร้ความหมาย · leading zero หาย |
| ทุกช่องชื่อเดียวกัน | "หลักที่ N จาก 6" | ผู้ใช้ screen reader ไม่รู้ว่าอยู่ช่องไหน |
| ไม่ประกาศผลการวาง | `aria-live="polite"` | ต้องไล่ฟังทีละช่องว่าเข้าครบไหม |
| ปิดบังตัวเลขแบบรหัสผ่าน | แสดงตรง ๆ | ผู้ใช้ตรวจไม่ได้ว่ากรอกถูก |
| uncontrolled | controlled | รหัสหมดอายุแล้วล้างจากภายนอกไม่ได้ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass2.test.tsx` · เทส "ทุกช่องมีชื่อบอกว่าเป็นหลักที่เท่าไร" · `SC 3.3.8` เทส "★★ วางเลข 6 หลักแล้วกระจายลงครบทุกช่อง" และ "★ ไม่มีช่องไหนบล็อกการวาง" |
| ตอบสนอง (Responsive) | ✅ | 6 ช่องเรียงพอดีที่ 320px · `inputMode="numeric"` เรียกแป้นตัวเลขบนมือถือ (เทสยืนยันว่าไม่ใช่ `type="number"`) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus` · ลูกศรซ้าย-ขวาเลื่อนช่อง · `Backspace` ถอยช่อง · `autoComplete="one-time-code"` อยู่ที่ช่องแรกช่องเดียว (เทสยืนยัน) |
| กำลังโหลด (Loading) | — | การยืนยันรหัสเป็นงานของปุ่มส่ง · `onComplete` ยิงทันทีที่ครบ 6 หลัก |
| ข้อผิดพลาด (Error) | ✅ | §4 `invalid` · `errorMessage` (SC 3.3.1) · รหัสผิดบอกเป็นข้อความและไม่ล้างช่องทิ้ง |
| ว่างเปล่า (Empty) | ✅ | §4 "ว่างอยู่แล้ว" เป็นสถานะที่ระบุไว้ — `Backspace` ในช่องว่างถอยไปช่องก่อนหน้า ไม่ใช่ไม่ทำอะไร |
| Skeleton | — | ช่องกรอก 6 ช่องเป็นโครงคงที่ ไม่ได้แทนเนื้อหาที่กำลังมา |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ⚠️ | `h-12` ตายตัวที่ [OTPField.tsx:181](./OTPField.tsx) — **หนี้ที่ยอมรับไว้:** ช่อง OTP เป็นสี่เหลี่ยม 44×48 ที่ต้องเท่ากันทั้ง 6 ช่อง แต่ขัด `SC 1.4.12` เมื่อผู้ใช้บังคับ line-height · `lint-quality.mjs` ฟ้องไว้เป็น warn ไม่ใช่ error |
