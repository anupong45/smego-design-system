# OrderTimeline

**`@smego/ui`** · ชั้น 03 · [OrderTimeline.tsx](./OrderTimeline.tsx)

---

## 1 · ภาพรวม

สถานะคำสั่งซื้อตาม **ลำดับเอกสารจริงของ B2B ไทย** พร้อมลิงก์ดาวน์โหลดเอกสารแต่ละขั้น

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ขั้นตอนที่ผู้ใช้กำลังทำอยู่ | `<CheckoutStepper>` | timeline เป็นประวัติ ไม่ใช่การนำทาง |
| ประวัติการแก้ไข | รายการ + วันที่ | ไม่มีลำดับที่กำหนดไว้ล่วงหน้า |
| สถานะขนส่งแบบละเอียด | timeline แยกของผู้ขนส่ง | คนละระบบ |

---

## 2 · React API

```tsx
<OrderTimeline steps={[
  { id: 'q',  label: 'ใบเสนอราคา', date: '2026-07-01', status: 'done',
    documentHref: '/docs/qt-0042', documentName: 'ใบเสนอราคา QT-2569-0042',
    note: 'QT-2569-0042' },
  { id: 'tax', label: 'ใบกำกับภาษีอิเล็กทรอนิกส์', status: 'current' },
]} />
```

| prop | type | หมายเหตุ |
|---|---|---|
| `steps` | `OrderStep[]` | |

### OrderStep

| field | type | หมายเหตุ |
|---|---|---|
| `id` | `string` | |
| `label` | `string` | |
| `date` | `string` | ISO `YYYY-MM-DD` → แสดง **พ.ศ.** |
| `status` | `'done' \| 'current' \| 'pending'` | |
| `documentHref` | `string` | ลิงก์ดาวน์โหลด |
| `documentName` | `string` | ใช้ในชื่อลิงก์ |
| `note` | `string` | เลขที่เอกสาร |

---

## 3 · Variants

ไม่มี variant — ความต่างมาจาก `status`

| status | วงกลม | ข้อความ |
|---|---|---|
| `done` | `success-surface` + **เครื่องหมายถูก** | `text-fg` + `sr-only` "เสร็จสิ้น" |
| `current` | `primary-600` + **จุดทึบ** | `text-fg` + `aria-current="step"` |
| `pending` | `bg-surface` + **วงว่าง** | `text-fg-muted` + `sr-only` "รอดำเนินการ" |

### ★★★ ลำดับเอกสารต้องตรงกับกระบวนการจริงของ B2B ไทย

```
ใบเสนอราคา → ใบสั่งซื้อ → ชำระเงิน → ใบกำกับภาษี (e-Tax) → ใบเสร็จรับเงิน → ส่งมอบ
```

**ใบกำกับภาษีไม่ใช่ขั้นตอนเสริม** — ผู้ซื้อนิติบุคคลต้องใช้เพื่อขอคืน VAT และ e-Tax Invoice เป็นข้อกำหนดของกรมสรรพากร ไม่ใช่ทางเลือกของแพลตฟอร์ม

ระบบต่างประเทศที่รวบเป็น **"Paid → Shipped → Delivered"** ใช้กับ B2B ไทยไม่ได้ เพราะขาดขั้นตอนเอกสารที่มีผลทางบัญชี

⚠️ `steps` เป็น prop เพราะ **บางคำสั่งซื้อไม่มีใบเสนอราคา** (ซื้อทันที) — แต่ลำดับที่ส่งต้องเป็นชุดนี้เสมอ

---

## 4 · States

timeline ไม่มี interactive state · ลิงก์ดาวน์โหลดสืบทอดจาก `<Link>`

### ★ วงกลมต่างกันที่ **รูปทรง** ไม่ใช่แค่สี (SC 1.4.1)

- `done` → **เครื่องหมายถูก**
- `current` → **จุดทึบตรงกลาง**
- `pending` → **วงว่าง**

แม้พิมพ์ขาวดำหรือแยกสีไม่ได้ก็ยังบอกได้

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.3.1** | `<ol>` ใน `<nav aria-label="สถานะคำสั่งซื้อ">` |
| **SC 1.4.1** | สถานะมีทั้งรูปทรงและข้อความ `sr-only` |
| **SC 2.4.4** | ชื่อลิงก์ดาวน์โหลดรวมชื่อเอกสาร |
| **SC 4.1.2** | `aria-current="step"` เฉพาะขั้นปัจจุบัน |
| วันที่ | **พ.ศ.** ผ่าน `<DeadlineText>` |

### ★★ `aria-current="step"` เฉพาะขั้นที่**กำลังอยู่**

⚠️ **ห้ามใส่กับขั้นที่ทำไปแล้ว** — `step` หมายถึงขั้นที่กำลังอยู่เท่านั้น ถ้าใส่ทุกขั้นที่ done ผู้ใช้จะได้ยินว่าอยู่หลายที่พร้อมกัน

**วัดแล้ว:** มี `aria-current="step"` **1 อัน** จาก 6 ขั้น

### ★★ ชื่อลิงก์ดาวน์โหลดต้องรวมชื่อเอกสาร

```
❌ "ดาวน์โหลด" × 5
✅ "ดาวน์โหลด ใบเสนอราคา QT-2569-0042"
✅ "ดาวน์โหลด ใบสั่งซื้อ PO-2569-0088"
```

ผู้ใช้ที่ฟังรายการลิงก์ในหน้าจะได้ยิน "ดาวน์โหลด" 5 ครั้งโดยแยกไม่ออก (SC 2.4.4)

**วัดแล้ว:** ทั้งสองลิงก์มีชื่อต่างกันและระบุเอกสารชัด

### ★★ แต่ละขั้นต้องดาวน์โหลดเอกสารได้เมื่อพร้อม

timeline ที่บอกแค่สถานะโดยไม่ให้เอกสารทำให้ผู้ใช้ **ต้องไปหาในอีเมล** ซึ่งเป็นจุดที่ผู้ใช้เลิกใช้ระบบแล้วกลับไปทำงานผ่านอีเมลเหมือนเดิม

### ★ สถานะเป็นข้อความสำหรับ screen reader

**วัดแล้ว:** `"ใบกำกับภาษีอิเล็กทรอนิกส์ — ขั้นตอนปัจจุบัน"` · `"ใบเสร็จรับเงิน — รอดำเนินการ"`

---

## 6 · Tailwind implementation

```tsx
<li className="grid min-w-0 grid-cols-[1.5rem_1fr] gap-x-3">
  <div className="grid justify-items-center">
    <span aria-hidden="true" className={cn(
      'flex size-6 shrink-0 items-center justify-center rounded-full border',
      status === 'done' && 'border-success-edge bg-success-surface text-success-icon',
      status === 'current' && 'border-primary-outline bg-primary-600 text-on-brand',
      status === 'pending' && 'border-edge-strong bg-surface',
    )}>
      {icon ? <Icon name={icon} size={16} />
        : status === 'current' && <span className="size-2 rounded-full bg-on-brand" />}
    </span>

    {!isLast && <span aria-hidden="true" className={cn('w-px flex-1',
      status === 'done' ? 'bg-success-edge' : 'bg-edge')} />}
  </div>

  <div className={cn('grid min-w-0 gap-1', isLast ? 'pb-0' : 'pb-6')}>…</div>
</li>
```

`grid-cols-[1.5rem_1fr]` ทำให้เส้นเชื่อมตรงกลางวงกลมพอดีทุกขั้น · เส้นเป็น `flex-1` จึงยืดตามความสูงของเนื้อหาเอง ไม่ต้องคำนวณ

---

## 7 · Figma Variant

Component set **`OrderTimelineStep`**

| Property | Values |
|---|---|
| `Status` | `Done` · `Current` · `Pending` |
| `Date` | `True` · `False` |
| `Document` | `True` · `False` |
| `Note` | `True` · `False` |
| `Last` | `True` · `False` |

**วงกลมทั้งสามสถานะต้องต่างที่รูปทรง** — ถ้า Figma ใช้วงกลมทึบทั้งสามแล้วเปลี่ยนแค่สี นักพัฒนาจะทำตามและตก SC 1.4.1

**ต้องมี frame ตัวอย่างที่มีครบ 6 ขั้นตามลำดับเอกสารไทย** เพื่อไม่ให้มีใครออกแบบเป็น "จ่ายแล้ว → ส่งแล้ว → รับแล้ว"

---

## 8 · Usage

```tsx
<OrderTimeline steps={[
  { id: 'quotation', label: s.order.quotation, date: order.quotedAt, status: 'done',
    documentHref: order.quotationUrl, documentName: `ใบเสนอราคา ${order.quotationNo}`,
    note: order.quotationNo },
  { id: 'po', label: s.order.purchaseOrder, date: order.poAt, status: 'done',
    documentHref: order.poUrl, documentName: `ใบสั่งซื้อ ${order.poNo}`, note: order.poNo },
  { id: 'payment', label: s.order.payment, date: order.paidAt, status: 'done' },
  { id: 'tax', label: s.order.taxInvoice, status: 'current' },
  { id: 'receipt', label: s.order.receipt, status: 'pending' },
  { id: 'delivered', label: s.order.delivered, status: 'pending' },
]} />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| "Paid → Shipped → Delivered" | ลำดับเอกสารไทย 6 ขั้น | ขาดขั้นที่มีผลทางบัญชี |
| ใบกำกับภาษีเป็นขั้นตอนเสริม | เป็นขั้นบังคับ | ข้อกำหนดกรมสรรพากร · ผู้ซื้อใช้ขอคืน VAT |
| `aria-current="step"` ทุกขั้นที่ done | เฉพาะขั้นปัจจุบัน | ผู้ใช้ได้ยินว่าอยู่หลายที่พร้อมกัน |
| ลิงก์ชื่อ "ดาวน์โหลด" ทั้ง 5 อัน | รวมชื่อเอกสาร | แยกไม่ออก (SC 2.4.4) |
| timeline ไม่มีลิงก์เอกสาร | มีเมื่อพร้อม | ผู้ใช้กลับไปหาในอีเมล |
| วงกลมต่างแค่สี | ต่างที่รูปทรง | SC 1.4.1 |
| วันที่เป็น ค.ศ. | `<DeadlineText>` | เอกสารราชการต้องเป็น พ.ศ. |
| `<ul>` แทน `<ol>` | `<ol>` | ลำดับมีความหมาย |
| เลขที่เอกสารไม่ใช้ `font-numeric` | ใช้ | เลขที่เอกสารเรียงกันต้องตรงแนว |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` · เทส **"มี `aria-current="step"` เพียงหนึ่งเดียว"** · "ลิงก์ดาวน์โหลดแต่ละอันมีชื่อเอกสารกำกับ" (SC 2.4.4) |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` — ชื่อขั้นตอนและชื่อเอกสารยาวตัดบรรทัดแทนดันเส้นเวลาล้น |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | ลิงก์ดาวน์โหลดเป็น `<a>` จริงจึงอยู่ใน tab order (SC 4.1.2) · `aria-current` บอกตำแหน่งปัจจุบันให้ screen reader ไม่ใช่แค่จุดสีเข้ม |
| กำลังโหลด (Loading) | — | สถานะคำสั่งซื้อมาจากเซิร์ฟเวอร์แล้ว · การรอเป็นของหน้าที่โหลด |
| ข้อผิดพลาด (Error) | — | ขั้นตอนที่ล้มเหลวเป็น **สถานะของขั้นตอน** ไม่ใช่ error ของ component |
| ว่างเปล่า (Empty) | — | คำสั่งซื้อมีอย่างน้อยหนึ่งขั้นตอนเสมอ |
| Skeleton | — | เส้นเวลาสั้นและมาพร้อมข้อมูลคำสั่งซื้อ |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — `SC 1.4.1` ขั้นที่เสร็จแล้วต่างกันที่ไอคอนและข้อความ ไม่ใช่แค่สีหรือการเคลื่อนไหว |
| ประสิทธิภาพ (Performance) | ✅ | วันที่ผ่าน [`<DeadlineText>`](./Deadline.md) ซึ่งไม่มี timer · ไม่มีความสูงตายตัว |
