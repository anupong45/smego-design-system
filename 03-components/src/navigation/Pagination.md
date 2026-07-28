# Pagination

**`@smego/ui`** · ชั้น 03 · [Pagination.tsx](./Pagination.tsx)

> สร้างใหม่ในเฟส 5 ตาม ASTRYX-PARITY.md §1.3 — ระบบมี `SearchResult` แต่**ไม่มี pagination เลย**ก่อนหน้านี้

---

## 1 · ภาพรวม

การแบ่งหน้าสำหรับหน้ารายการ · ปุ่มก่อนหน้า/ถัดไป + ตรงกลางที่เลือกรูปแบบได้

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| รายการสั้นกว่าหนึ่งหน้า | ไม่ต้องแสดงอะไร | แถบที่มีปุ่ม disable ทั้งคู่คือ noise |
| เลื่อนโหลดต่อเนื่อง | ปุ่ม "ดูเพิ่ม" | pagination สื่อว่ากระโดดหน้าได้ |
| สลับมุมมองของข้อมูลชุดเดียว | [`<SegmentedControl>`](./SegmentedControl.md) | คนละความหมาย |
| ขั้นตอนในฟอร์ม | `<CheckoutStepper>` | ขั้นตอนมีลำดับบังคับ หน้าไม่มี |

---

## 2 · React API

```tsx
import { Pagination } from '@smego/ui';

<Pagination
  page={page}
  totalItems={results.total}
  pageSize={20}
  onChange={setPage}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `page` | `number` | — | **บังคับ** · เริ่มที่ **1** ไม่ใช่ 0 |
| `onChange` | `(page: number) => void` | — | **บังคับ** |
| `totalItems` | `number` | — | คำนวณจำนวนหน้าร่วมกับ `pageSize` · **มีผลเหนือ** `totalPages` |
| `totalPages` | `number` | — | ใช้เมื่อรู้จำนวนหน้าแต่ไม่รู้จำนวนรายการ |
| `hasMore` | `boolean` | — | cursor-based · บังคับ `variant="none"` |
| `pageSize` | `number` | `20` | |
| `variant` | `'pages' \| 'count' \| 'compact' \| 'none'` | `'pages'` | ดู §3 |
| `siblingCount` | `number` | `1` | เลขหน้าข้างละกี่ตัว |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 36 / **44** / 48px — ดู §5 |
| `isDisabled` | `boolean` | `false` | |
| `label` | `string` | `'การแบ่งหน้า'` | ชื่อ landmark — **ต้องตั้งเมื่อมีสองอันในหน้าเดียว** |

**`pageSlots(page, totalPages, siblingCount)`** export แยกไว้ — ใช้เทสอัลกอริทึมหรือวาดเลขหน้าเอง

---

## 3 · Variants

| `variant` | ตรงกลาง | ใช้เมื่อ |
|---|---|---|
| `pages` | ปุ่มเลขหน้า + `…` | เดสก์ท็อป · ผู้ใช้อยากกระโดดหน้า |
| `count` | `21–40 จาก 240 รายการ` | เน้นว่าดูไปแล้วเท่าไร |
| `compact` | `หน้า 2 จาก 12` | จอแคบที่ปุ่มเลขหน้าไม่พอที่ |
| `none` | — | cursor-based หรือมีแค่ก่อนหน้า/ถัดไป |

### ★ ไม่มี `variant="dots"` ของ Astryx

จุดเล็กกว่าเกณฑ์ touch มาก และเป็น**สำนวนของ carousel** ซึ่ง §1.4 ตัดออกจากระบบไปแล้ว (ไม่มี template ที่ต้องใช้)

### ★★ อัลกอริทึมเลือกเลขหน้า

หน้าแรกและหน้าสุดท้าย**เห็นเสมอ** — กระโดดสุดทางได้ในหนึ่งกด

```
หน้า 10 จาก 20 →  1 … 9 [10] 11 … 20
หน้า 2 จาก 20  →  1 [2] 3 … 20
หน้า 4 จาก 20  →  1 2 3 [4] 5 … 20      ← ไม่ใส่ … แทนหน้า 2 หน้าเดียว
```

**ช่องว่างที่กินหน้าเดียวถูกแทนด้วยเลขหน้านั้น** — `…` ที่ซ่อนหน้าเดียวทำให้ผู้ใช้ต้องกดสองครั้งเพื่อไปหน้าที่อยู่ตรงหน้าต่อตา

---

## 4 · States

| state | ผล |
|---|---|
| หน้าแรก | ปุ่มก่อนหน้า `disabled` **จริง** ไม่ใช่แค่ดูจาง |
| หน้าสุดท้าย | ปุ่มถัดไป `disabled` |
| `hasMore={false}` | ปุ่มถัดไป `disabled` (ไม่รู้ยอดรวมแต่รู้ว่าหมดแล้ว) |
| หน้าปัจจุบัน | `aria-current="page"` + tint + ขอบแบรนด์ |
| `isDisabled` | ทั้งแถบกดไม่ได้ |

**กดหน้าปัจจุบันไม่เรียก `onChange`** — กันยิงคำขอซ้ำโดยไม่ได้อะไร

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| landmark | `<nav aria-label>` — กระโดดมาที่การแบ่งหน้าได้ตรง ๆ |
| **SC 2.5.8** | เป้ากดต่ำสุด **36px** ทุกขนาด — เกินเกณฑ์ 24px |
| **SC 2.5.3** | ชื่อปุ่มเป็น "หน้า 3" ไม่ใช่ "3" |
| **SC 1.4.12** | `min-h-*` ไม่ใช่ `h-*` — ข้อความยังโตได้ |
| **SC 4.1.2** | `aria-current="page"` บนหน้าปัจจุบัน |

### ★★★ ขนาดปุ่มของ Astryx ใช้ไม่ได้ทั้งชุด (เหตุผลเดียวกับ D1)

| `size` | เรา | Astryx |
|---|---|---|
| `sm` | **36px** | 28px |
| `md` | **44px** | 32px |
| `lg` | **48px** | 36px |

ปุ่มเลขหน้าคือ**เป้าที่เล็กที่สุดในหน้ารายการ** — เรียงติดกัน 5–7 อันบนมือถือ กดพลาดแล้วเสียตำแหน่งทั้งหน้า ทั้งสามขนาดของ Astryx ต่ำกว่าเกณฑ์ที่ระบบนี้ตัดสินไว้ว่า touch ใช้ไม่ได้

**ใช้ `min-h-*` / `min-w-*` ไม่ใช่ `h-*` / `w-*`** — เป็น**พื้น** ไม่ใช่ความสูงตายตัว ข้อความยังโตได้เมื่อผู้ใช้ขยายตัวอักษร (SC 1.4.12) ต่างจาก `h-11` ที่จะตัดข้อความทิ้ง

### ★★★ ชื่อปุ่มต้องเป็น "หน้า 3" ไม่ใช่ "3"

ตัวเลขลอย ๆ ไม่บอกอะไรกับผู้ใช้ screen reader · ระบบนี้ตัดสินเรื่องเดียวกันมาแล้วที่จำนวนในตะกร้า ([`TopNav`](./TopNav.md)) และปุ่มลบ chip ([`RemovableChip`](../data-display/Token.md))

หน้าปัจจุบันได้ **ทั้ง** `aria-current="page"` **และ** คำว่า "หน้าปัจจุบัน" ในชื่อ — ไม่พึ่ง `aria-current` เดียวเพราะ screen reader เก่าบางตัวไม่ประกาศมัน

### ★★ สอง Pagination ในหน้าเดียวต้องตั้ง `label` ให้ต่างกัน

pagination ที่อยู่ทั้งหัวและท้ายรายการเป็นรูปแบบที่พบบ่อย — ถ้าใช้ชื่อค่าเริ่มต้นทั้งคู่จะได้ **landmark ซ้ำ** และ axe ฟ้อง `landmark-unique`

```tsx
<Pagination … label="การแบ่งหน้า ด้านบน" />
…รายการ…
<Pagination … label="การแบ่งหน้า ด้านล่าง" />
```

ทางแก้คือ prop `label` **ไม่ใช่**การถอด `<nav>` ออก — landmark มีค่ากับผู้ใช้ screen reader มากกว่าความสะดวกของผู้เรียก · เทส `"สอง Pagination ในหน้าเดียว"` ล็อกทั้งสองฝั่งไว้

### ★★ ไม่มี live region ในตัวนี้โดยเจตนา

เมื่อเปลี่ยนหน้า สิ่งที่ผู้ใช้ต้องรู้คือ "ผลลัพธ์ใหม่มาแล้ว" ซึ่ง [`SearchResult`](../marketplace/SearchResult.md) ประกาศผ่าน live region ของจำนวนอยู่แล้ว — ถ้า Pagination ประกาศอีกจะได้ยินสองรอบ (เหตุผลเดียวกับ [`EmptyState`](../data-display/EmptyState.md) · D26)

### ★ `…` ไม่ใช่ปุ่ม

เป็น `<span aria-hidden>` **ไม่ใช่**ปุ่ม disabled — ปุ่มที่กดไม่ได้ในแถวทำให้ผู้ใช้คีย์บอร์ดต้องกด Tab ผ่านของที่ไม่ทำอะไร

---

## 6 · Tailwind implementation

```tsx
<nav aria-label={label ?? s.pagination.label}
  className="flex min-w-0 flex-wrap items-center justify-center gap-2">
```

`flex-wrap` เพราะแถวเลขหน้า 7 อันที่ 320px ล้นแน่ — ตัดบรรทัดดีกว่าเลื่อนแนวนอน (SC 1.4.10)

`<ol>` สำหรับเลขหน้าเพราะ **ลำดับมีความหมาย** และ screen reader จะบอกจำนวนรายการทั้งหมดให้ด้วย

### หน้าปัจจุบันไม่ใช้พื้นทึบน้ำเงิน

```
border-edge-brand bg-selected-surface text-selected-fg
```

"พื้นทึบน้ำเงิน = กดได้/CTA" ถูกสงวนไว้ให้ปุ่มหลัก (ข้อ 05) · หน้าปัจจุบันใช้ **tint + ขอบแบรนด์** เหมือน [`Token`](../data-display/Token.md) ที่เลือกอยู่ — สำนวนเดียวกันทั้งระบบ

`font-numeric tabular-nums` — ปุ่มไม่ขยับตอนเปลี่ยนจากหน้า 9 เป็น 10

---

## 7 · Figma Variant

Component set **`Pagination`**

| Property | Values |
|---|---|
| `Variant` | **`Pages`** · `Count` · `Compact` · `None` |
| `Size` | `sm (36)` · **`md (44)`** · `lg (48)` |
| `Position` | **`Middle`** · `First page` · `Last page` |

**`First page` / `Last page` ต้องแสดงปุ่มที่ disable จริง** — ถ้า Figma แสดงแต่สถานะกลาง นักพัฒนาจะลืมปิดปุ่มที่ขอบเขต

**ห้ามสร้าง variant `Dots`** — ถ้ามีคนขอ ให้ชี้ไปที่ §3

---

## 8 · Usage

```tsx
// หน้ารายการสินค้า — count บอกว่าดูไปแล้วเท่าไร
<SearchResult count={total} query={q}>
  <Grid preset="product">{items.map(…)}</Grid>
</SearchResult>

<Pagination
  page={page}
  totalItems={total}
  pageSize={20}
  onChange={(p) => { setPage(p); scrollToTop(); }}
/>
```

⚠️ **เลื่อนกลับขึ้นบนหลังเปลี่ยนหน้าเป็นหน้าที่ของผู้เรียก** — ถ้าไม่เลื่อน ผู้ใช้จะอยู่ท้ายรายการใหม่โดยไม่รู้ว่าเปลี่ยนหน้าแล้ว

```tsx
// จอแคบ — compact กินที่น้อยกว่าปุ่มเลขหน้า
<Pagination page={page} totalPages={pages} variant="compact" onChange={setPage} />
```

```tsx
// cursor-based — ไม่รู้ยอดรวม
<Pagination page={page} hasMore={data.hasNextPage} onChange={setPage} />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `page={0}` เป็นหน้าแรก | `page={1}` | สัญญาของ API คือเริ่มที่ 1 |
| `size` ตามค่า Astryx (28/32/36) | 36/44/48 | ต่ำกว่าเกณฑ์ touch (D1) |
| `h-11` | `min-h-11` | ตัดข้อความทิ้งเมื่อผู้ใช้ขยายตัวอักษร |
| `aria-label="3"` | `"หน้า 3"` | ตัวเลขลอย ๆ ไม่บอกอะไร |
| `…` เป็นปุ่ม disabled | `<span aria-hidden>` | ติด tab order โดยไม่ทำอะไร |
| สอง Pagination ชื่อเดียวกัน | ตั้ง `label` ต่างกัน | landmark ซ้ำ |
| `bg-primary-600` ที่หน้าปัจจุบัน | `bg-selected-surface` | น้ำเงินทึบสงวนให้ CTA |
| เพิ่ม live region ในตัวนี้ | ปล่อยให้ `SearchResult` ประกาศ | ได้ยินสองรอบ |
| แสดงเมื่อมีหน้าเดียว | ซ่อนทั้งแถบ | ปุ่ม disable ทั้งคู่คือ noise |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านทุก variant ใน `a11y/pagination.test.tsx` · เทส "ชื่อปุ่มเป็น หน้า 3 ไม่ใช่ 3" · "`…` ไม่ใช่ปุ่ม" · "สอง Pagination ต้องตั้ง label ต่างกัน" |
| ตอบสนอง (Responsive) | ✅ | `flex-wrap` — เลขหน้า 7 อันตัดบรรทัดที่ 320px ไม่เลื่อนแนวนอน (SC 1.4.10) · `variant="compact"` สำหรับจอแคบ |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ใช้ `px-*`/`gap-*` ไม่มีข้าง |
| คีย์บอร์ด (Keyboard) | ✅ | ปุ่มทุกอันเป็น `<button>` จาก RAC · `…` ไม่ติด tab order · ปุ่มขอบเขต `disabled` จริง — เทส "ปุ่มก่อนหน้าถูก disable จริง" |
| กำลังโหลด (Loading) | ✅ | `isDisabled` ปิดทั้งแถบระหว่างโหลดหน้าใหม่ — กันกดซ้ำ · เทส "isDisabled ปิดทั้งแถบ" |
| ข้อผิดพลาด (Error) | — | การแบ่งหน้าไม่มีสถานะผิดพลาดของตัวเอง · ถ้าโหลดหน้าใหม่ล้มเหลวให้ใช้ [`<Banner tone="danger">`](../feedback/Banner.md) |
| ว่างเปล่า (Empty) | — | ไม่แสดงเลยเมื่อมีหน้าเดียว — เป็นหน้าที่ผู้เรียก (§9) |
| Skeleton | — | แถบสั้นและความสูงคงที่ ไม่ทำให้ CLS |
| การเคลื่อนไหว (Animation) | ✅ | `transition-colors` เท่านั้น — อยู่ในรายการ ALLOW ของ reduced motion (`base.css §10`) |
| ประสิทธิภาพ (Performance) | ✅ | `tabular-nums` — ปุ่มไม่ขยับตอน 9→10 จึงไม่เกิด reflow · `min-h` ไม่ใช่ `h` (ไม่มีความสูงตายตัว) |
