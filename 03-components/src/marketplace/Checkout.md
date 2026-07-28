# CheckoutSummary · CheckoutStepper

**`@smego/ui`** · ชั้น 03 · [Checkout.tsx](./Checkout.tsx)

---

## 1 · ภาพรวม

สรุปยอดคำสั่งซื้อ และแถบขั้นตอน

⚠️ **ขอบเขต: component ไม่ใช่หน้า** — หน้าสั่งซื้อเต็มเป็นชั้น 05 Templates

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ใบเสนอราคาที่พิมพ์ได้ | เอกสาร PDF จาก backend | ต้องมีเลขที่และลายเซ็น |
| สถานะหลังสั่งซื้อ | `<OrderTimeline>` | ขั้นตอนเอกสารคนละชุด |
| ตะกร้าสินค้าแบบแก้ไขได้ | ตาราง + `<NumberField>` | Summary อ่านอย่างเดียว |

---

## 2 · React API

```tsx
<CheckoutStepper currentIndex={1} steps={steps} />

<CheckoutSummary
  itemCount={3}
  subtotal={1_250_000}
  vat={87_500}
  shipping={null}
  total={1_337_500}
  onSubmit={submit}
  isSubmitting={isSubmitting}
  errorMessage={error}
/>
```

### CheckoutSummary

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `itemCount` | `number` | — | |
| `subtotal` | `number` | — | ก่อนภาษี |
| `vat` | `number` | — | **บังคับแม้เป็น 0** |
| `shipping` | `number \| null` | — | `null` = "รอคำนวณ" |
| `extraLines` | `SummaryLine[]` | — | ส่วนลด ฯลฯ |
| `total` | `number` | — | |
| `onSubmit` | `() => void` | — | ★ ใช้ตัวนี้แทน `action` ทุกครั้งที่ทำได้ |
| `submitLabel` | `string` | `'ยืนยันคำสั่งซื้อ'` | |
| `isSubmitting` | `boolean` | `false` | spinner + กดซ้ำไม่ได้ |
| `isSubmitDisabled` | `boolean` | `false` | ยังกรอกไม่ครบ |
| `errorMessage` | `string` | — | `<Alert tone="danger" isLive>` เหนือปุ่ม |
| `action` | `ReactNode` | — | ⚠️ ปุ่มกำหนดเอง — ผู้เรียกรับผิดชอบสถานะเองทั้งหมด |

### CheckoutStepper

| prop | type | หมายเหตุ |
|---|---|---|
| `steps` | `CheckoutStep[]` | `{ id, label }` |
| `currentIndex` | `number` | เริ่มที่ 0 |

---

## 3 · Variants

ไม่มี variant · `CheckoutStepper` เปลี่ยน layout ตาม breakpoint

| breakpoint | รูปแบบ |
|---|---|
| `< md` | ข้อความ `2/4 ที่อยู่จัดส่ง` |
| `≥ md` | วงกลม + ป้ายชื่อ + เส้นเชื่อม |

### ★ บนมือถือแสดงข้อความ ไม่ใช่วงกลมทั้งแถว

5 ขั้นที่ 320px ได้วงกลมละ 40px โดย **ไม่มีที่ให้ป้ายชื่อเลย** — วงกลมเปล่าที่ไม่มีชื่อบอกอะไรไม่ได้

`2/4 ที่อยู่จัดส่ง` ให้ข้อมูลครบกว่าในพื้นที่น้อยกว่า

---

## 4 · States

### CheckoutStepper

| state | ที่มา | วงกลม |
|---|---|---|
| เสร็จแล้ว | `i < currentIndex` | `success-surface` + เครื่องหมายถูก |
| **ปัจจุบัน** | `i === currentIndex` | `primary-600` + เลขขั้น + `aria-current="step"` |
| ยังไม่ถึง | `i > currentIndex` | `bg-surface` + เลขขั้น |

**วัดแล้ว:** มี `aria-current="step"` **หนึ่งอันเท่านั้น** ในทั้ง stepper

### CheckoutSummary · ปุ่มยืนยัน

| state | ที่มา | ผล |
|---|---|---|
| พร้อมยืนยัน | ค่าเริ่มต้น | ปุ่ม `primary` เต็มความกว้าง |
| **กำลังส่ง** | `isSubmitting` | spinner ทับ label · **กดซ้ำไม่ได้** · label ยังอยู่ใน a11y tree |
| ยังกรอกไม่ครบ | `isSubmitDisabled` | ปุ่ม disabled — ต้องมีข้อความบอกว่าขาดอะไรอยู่ในหน้า |
| **ผิดพลาด** | `errorMessage` | `<Alert tone="danger" isLive>` **เหนือ** ปุ่ม · ปุ่มกลับมากดได้ |
| ค่าขนส่งยังไม่รู้ | `shipping === null` | "รอคำนวณ" — ยอดรวมยังแสดงตามที่รู้ |

### ★★★ กดซ้ำ = โอนซ้ำ

ปุ่มชำระเงินที่ไม่บอกว่าระบบรับคำสั่งแล้วหรือยัง คือที่มาของการกดซ้ำ — ซึ่งกับเงินแปลว่าคำสั่งซื้อสองใบ

`isSubmitting` map ไป RAC `isPending` ซึ่งปิดการกดแต่ **คง focus ไว้** และประกาศสถานะให้ screen reader · ถ้าใช้ `isDisabled` แทน focus จะตกไปที่ `<body>` และผู้ใช้คีย์บอร์ดหลุดกลับต้นหน้าทันทีที่กดยืนยัน

⚠️ ต้องตั้ง `isSubmitting` **ก่อน** เรียก API ไม่ใช่หลังได้คำตอบ

### ★★★ ข้อผิดพลาดเป็น Alert อยู่เหนือปุ่ม

ไม่ใช่ Toast — ข้อความที่บอกว่าต้องทำอะไรต่อห้ามหายไปเอง ([`Alert.md`](../feedback/Alert.md))

อยู่ **เหนือ** ปุ่มเพราะผู้ใช้ที่กำลังมองปุ่มต้องเห็นเหตุผลก่อนกดอีกครั้ง · `isLive` เพราะ Alert นี้โผล่มาตอบการกระทำของผู้ใช้ (SC 4.1.3)

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.3.1** | Summary เป็น `<dl>` · Stepper เป็น `<ol>` ใน `<nav>` |
| **SC 1.4.1** | สถานะขั้นตอนมี `sr-only` เป็นข้อความ |
| **SC 4.1.2** | `aria-current="step"` ไม่ใช่ `aria-selected` |

### ★★★ ภาษีมูลค่าเพิ่มต้องแยกบรรทัด **เสมอ**

ผู้ซื้อ B2B ไทยต้องการใบกำกับภาษีเพื่อ **ขอคืน VAT** — ยอดที่ไม่แยกภาษีทำให้ต้องคำนวณเองทุกครั้ง และเป็นสาเหตุอันดับต้นของการโต้แย้งใบแจ้งหนี้

`vat` จึงเป็น **prop จำเป็น** ไม่มี `?` — แม้สินค้าที่ยกเว้นภาษีก็ต้องส่ง `0` เพื่อให้ผู้ใช้เห็นว่ายกเว้นจริง ไม่ใช่ลืมคิด

**วัดแล้ว:** `ภาษีมูลค่าเพิ่ม 7% = 87,500.00`

### ★★ ตัวเลขเรียงขวา + `tabular-nums`

`tabular-nums` ทำให้หลักตรงกันทุกบรรทัด — ยอด **1,250,000** กับ **87,500** ที่หลักไม่ตรงกันทำให้ผู้ใช้ **อ่านผิดหลักได้** ซึ่งกับเงินคือความผิดพลาดที่ยอมรับไม่ได้ (ข้อ 03 §2)

**วัดแล้ว:** `font-variant-numeric: tabular-nums` · ไม่มีเลขไทย ๐–๙ ในหน้า

### ★★ ยอดรวมต่างด้วย **มากกว่าสี** (SC 1.4.1)

เส้นคั่น `border-t` + ขนาด `text-title` + label `text-subtitle` — ไม่ใช่แค่ทำให้เข้มขึ้น

ผู้ใช้ที่แยกสีไม่ได้ยังเห็นว่าบรรทัดนี้ต่างจากบรรทัดอื่น

### ★ `shipping: null` แสดง "รอคำนวณ" ไม่ใช่ 0

ค่าขนส่งที่ยังไม่รู้ต่างจากค่าขนส่งฟรี — `0.00` บอกว่าฟรี ซึ่งอาจไม่จริง

**วัดแล้ว:** `ค่าขนส่ง = รอคำนวณ`

### ★ `<dl>` ทำให้อ่านเป็นคู่

screen reader อ่าน **"ภาษีมูลค่าเพิ่ม 7%, 87,500.00"** เป็นคู่ ไม่ใช่แยกกันคนละที่

---

## 6 · Tailwind implementation

```tsx
<dl className="grid min-w-0 gap-2 text-body-sm">
  {lines.map((line) => (
    <div key={line.label} className="flex min-w-0 items-baseline justify-between gap-3">
      <dt className="min-w-0 text-fg-secondary">{line.label}</dt>
      <dd className="shrink-0 text-fg font-numeric tabular-nums">
        {line.value === null
          ? <span className="text-caption text-fg-muted">{line.note}</span>
          : fmt(line.value)}
      </dd>
    </div>
  ))}
</dl>

{/* ★ ยอดรวมต่างด้วยเส้นคั่น + ขนาด */}
<div className="border-t border-edge-subtle pt-4">
  <dl className="flex min-w-0 items-baseline justify-between gap-3">
    <dt className="min-w-0 text-subtitle text-fg">{s.checkout.total}</dt>
    <dd className="shrink-0 text-title text-fg font-numeric tabular-nums">…</dd>
  </dl>
</div>
```

`Intl.NumberFormat` ตั้ง `minimumFractionDigits: 2` — เงินต้องมีสองตำแหน่งเสมอ ไม่ใช่ `1,250,000` บ้าง `1,250,000.50` บ้าง

---

## 7 · Figma Variant

Component set **`CheckoutSummary`**

| Property | Values |
|---|---|
| `Shipping` | `Amount` · **`Pending`** · `None` |
| `Extra lines` | `0` · `1 (discount)` |

Component set **`CheckoutStepper`**

| Property | Values |
|---|---|
| `Breakpoint` | **`Mobile (text)`** · `Desktop (dots)` |
| `Current` | `1` · `2` · `3` · `4` |

**`Mobile (text)` frame ต้องมีจริง** — ถ้ามีแค่แบบวงกลม นักพัฒนาจะย่อวงกลมให้พอดี 320px แล้วได้แถวที่ไม่มีป้ายชื่อ

**บรรทัด VAT ห้ามซ่อนใน variant ใด** — ไม่มี property `Show VAT`

---

## 8 · Usage

```tsx
<CheckoutStepper
  currentIndex={step}
  steps={[
    { id: 'cart', label: 'ตะกร้าสินค้า' },
    { id: 'address', label: 'ที่อยู่จัดส่ง' },
    { id: 'pay', label: 'ชำระเงิน' },
    { id: 'done', label: 'ยืนยันคำสั่งซื้อ' },
  ]}
/>

<CheckoutSummary
  itemCount={cart.length}
  subtotal={subtotal}
  vat={subtotal * 0.07}
  shipping={address ? shippingCost : null}
  extraLines={discount ? [{ label: 'ส่วนลด', value: -discount }] : undefined}
  total={total}
  onSubmit={submit}
  isSubmitting={isSubmitting}
  isSubmitDisabled={!address}
  errorMessage={error}
/>
```

```tsx
async function submit() {
  setSubmitting(true);          /* ★ ก่อนเรียก API ไม่ใช่หลัง */
  setError(undefined);
  try {
    await api.placeOrder(sellerId, cart);
    router.push(`/pay/${sellerId}`);
  } catch {
    setError(s.error.network);  /* ★ Alert ไม่ใช่ Toast */
  } finally {
    setSubmitting(false);
  }
}
```

⚠️ **หนึ่งร้าน หนึ่งคำสั่งซื้อ** — ตะกร้าที่มีหลายร้านเรียก `CheckoutSummary` คนละใบต่อร้าน (ดู [`04-patterns/05-cart-and-checkout.md`](../../../04-patterns/05-cart-and-checkout.md))

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| รวม VAT ในราคา | แยกบรรทัด | ผู้ซื้อ B2B ต้องใช้ขอคืน VAT |
| `vat` เป็น optional | บังคับเสมอ | ไม่แสดง ≠ ยกเว้นภาษี |
| `shipping={0}` ตอนยังไม่รู้ | `null` | `0.00` บอกว่าฟรี ซึ่งอาจไม่จริง |
| ตัวเลขไม่มี `tabular-nums` | มี | หลักไม่ตรง → อ่านผิดหลัก |
| ยอดรวมเด่นด้วยสีอย่างเดียว | + เส้นคั่น + ขนาด | SC 1.4.1 |
| เลขไทย ๐–๙ | เลขอารบิก | กว้างต่างกัน 36.6% em |
| วงกลม 5 อันที่ 320px | ข้อความ `2/4` | ไม่มีที่ให้ป้ายชื่อ |
| `aria-selected` บนขั้นตอน | `aria-current="step"` | `selected` เป็นของ tab |
| สถานะขั้นตอนเป็นสีอย่างเดียว | + `sr-only` | SC 1.4.1 |
| ปุ่มยืนยันเป็น `action` เปล่าที่ไม่มีสถานะ | `onSubmit` + `isSubmitting` | กดซ้ำ = คำสั่งซื้อสองใบ |
| `isDisabled` ตอนกำลังส่ง | `isLoading` (RAC `isPending`) | `disabled` ดีด focus ไปที่ `<body>` |
| error จากการยืนยันเป็น toast | `<Alert isLive>` เหนือปุ่ม | ข้อความที่ต้องลงมือทำห้ามหายเอง |
| รวมยอดหลายร้านเป็นปุ่มเดียว | หนึ่งร้าน หนึ่ง summary | สลิปใบเดียวจับคู่หลายร้านไม่ได้ |
| ทศนิยมบ้างไม่มีบ้าง | `minimumFractionDigits: 2` | คอลัมน์เงินไม่ตรงแนว |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` และ `a11y/pass5.test.tsx` รวมกรณีที่มีทั้ง error และปุ่มพร้อมกัน · `SC 4.1.3` ขั้นตอนที่เปลี่ยนถูกประกาศ |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · สรุปยอดเป็นคอลัมน์ข้างที่จอกว้างและย้ายไปอยู่บนปุ่มยืนยันที่จอแคบ |
| โหมดมืด (Dark Mode) | ✅ | ใช้ `--elevation-*` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | เทส **"★★★ กำลังส่ง = กดซ้ำไม่ได้ แต่ปุ่มยังอยู่ใน a11y tree"** — ผู้ใช้คีย์บอร์ดไม่หลุดตำแหน่งระหว่างรอ (เหตุผลเดียวกับ [`Button §4`](../inputs/Button.md)) |
| กำลังโหลด (Loading) | ✅ | §4 "กำลังส่ง" · `isSubmitting` · เทสยืนยันว่ากดซ้ำแล้ว `onSubmit` ไม่ถูกเรียกเพิ่ม |
| ข้อผิดพลาด (Error) | ✅ | §4 "ผิดพลาด" · เทส **"★★★ ข้อผิดพลาดเป็น `Alert` ที่ประกาศทันที ไม่ใช่ toast"** — การชำระเงินที่ล้มเหลวห้ามแจ้งด้วยของที่หายเอง |
| ว่างเปล่า (Empty) | ✅ | §4 "ยังกรอกไม่ครบ" และ "ค่าขนส่งยังไม่รู้" แยกจากกัน — **ยังไม่รู้** ไม่ใช่ **เป็นศูนย์** · เทส "แยกบรรทัด VAT เสมอ" ทำให้ยอดที่ยังไม่ครบยังอ่านออกว่าขาดอะไร |
| Skeleton | — | หน้าชำระเงินต้องแสดงยอดจริงเท่านั้น · แถบสีเทาแทนตัวเลขเงินคือการเชิญให้เข้าใจผิด |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — ยอดที่ต้องจ่ายห้ามขยับ |
| ประสิทธิภาพ (Performance) | ✅ | เทส "★ ไม่ส่ง `onSubmit` = ไม่มีปุ่ม" — ไม่ render ตัวควบคุมที่ไม่มีปลายทาง · ยอดรวมส่งมาเป็นค่า |
