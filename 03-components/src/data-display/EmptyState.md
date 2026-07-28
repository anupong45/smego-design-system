# EmptyState

**`@smego/ui`** · ชั้น 03 · [EmptyState.tsx](./EmptyState.tsx)

> สร้างใหม่ในเฟส 5 ตาม ASTRYX-PARITY.md §1.3
>
> ⚠️ **§1.3 เดิมเขียนจำนวนผิด** — ระบุว่า hand-roll ใน 8 ไฟล์ · ตรวจกับโค้ดจริงแล้วมี **3 ไฟล์**: `Cart.tsx` · `Wishlist.tsx` · `SearchResult.tsx` (`Compare.tsx` เป็น `return null` โดยเจตนา · `Checkout` `Payment` `ProductCard` `OrderTimeline` ไม่มีสาขา empty เลย)

---

## 1 · ภาพรวม

ที่ว่างที่ **บอกทางออก** — ไม่ใช่แค่บอกว่าไม่มีอะไร

สกัดมาจาก 3 ที่ที่เขียนซ้ำกันแทบ byte-identical (icon 32 + หัวข้อ + คำอธิบาย + ปุ่ม)

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| แถบที่ไม่ควรมีเลยเมื่อว่าง | `return null` | `Compare` เลือกทางนี้ — แถบเปล่าที่มีแต่ความสูงทำให้เนื้อหาขยับ |
| ยังโหลดไม่เสร็จ | [`<Skeleton>`](../feedback/Skeleton.md) | "ว่าง" กับ "ยังไม่มา" คนละเรื่อง |
| โหลดล้มเหลว | [`<Banner tone="danger">`](../feedback/Banner.md) | ว่างเพราะพังไม่ใช่ว่างเพราะไม่มีข้อมูล |
| ช่องกรอกที่ยังไม่กรอก | `placeholder` ของ field | |

**เส้นแบ่งที่สำคัญที่สุด: "ว่าง" ≠ "ยังไม่มา" ≠ "พัง"** — ทั้งสามแสดงพื้นที่เปล่าเหมือนกันแต่ผู้ใช้ต้องทำคนละอย่าง

---

## 2 · React API

```tsx
import { EmptyState, Icon, Button } from '@smego/ui';

<EmptyState
  icon={<Icon name="search" size={32} />}
  title={s.search.noResults}
  description={s.search.noResultsHelp}
  actions={<Button variant="secondary">ล้างตัวกรอง</Button>}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `title` | `string` | — | **บังคับ** |
| `description` | `string` | — | **บอกทางออก** ไม่ใช่ขยายความว่าว่าง |
| `icon` | `ReactNode` | — | ธรรมเนียม: `<Icon name="…" size={32} />` |
| `actions` | `ReactNode` | — | ปุ่มทางออก |
| `headingLevel` | `1`–`6` | — | **ไม่ส่ง = ไม่เป็นหัวข้อ** ดู §5 |
| `isLive` | `boolean` | `false` | ดู §5 |
| `isCompact` | `boolean` | `false` | ระยะกระชับสำหรับพื้นที่แคบ |
| `className` | `string` | — | |

---

## 3 · Variants

| | `px` / `py` | ใช้เมื่อ |
|---|---|---|
| ปกติ | `px-4 py-12` | แทนเนื้อหาทั้งส่วน |
| `isCompact` | `px-3 py-6` | ในการ์ดหรือ drawer ที่พื้นที่จำกัด |

---

## 4 · States

ไม่มี state ของตัวเอง — การแสดง/ซ่อนเป็นหน้าที่ของผู้เรียก (`if (count === 0)`)

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 1.1.1** | ไอคอนเป็นของตกแต่ง — `Icon` ใส่ `aria-hidden` ให้เองเมื่อไม่มี `label` |
| **SC 1.3.1** | `title` **ไม่เป็นหัวข้อ**โดยค่าเริ่มต้น |
| **SC 4.1.3** | `isLive` เป็น opt-in ไม่ใช่ค่าเริ่มต้น |

### ★★★ `role="status"` เป็น opt-in — ต่างจาก Astryx โดยเจตนา (D26)

Astryx ตั้ง `role="status"` **ตายตัว** · เราทำไม่ได้เพราะ `SearchResult` มีคอมเมนต์กำกับไว้ก่อนหน้านี้แล้วว่าห้ามเป็น live region:

> "ไม่ใช่ live region — ข้อความจำนวนด้านบนประกาศไปแล้ว ถ้าประกาศซ้ำผู้ใช้จะได้ยินสองรอบ"

หน้าค้นหาประกาศ `"พบ 0 รายการ"` ผ่าน live region ของตัวเองอยู่แล้ว ถ้า `EmptyState` ประกาศอีก ผู้ใช้จะได้ยิน**สองรอบติดกัน**

นี่คือปัญหารูปเดียวกับ `role="alert"` ของ [`Banner`](../feedback/Banner.md) (§8.4) และระบบนี้ตอบเหมือนกันทุกครั้ง — **opt-in ชื่อ `isLive` ค่าเริ่มต้น `false`**

ตั้ง `isLive` เมื่อ **ทั้งสองข้อ** เป็นจริง:
1. ที่ว่างโผล่มา**ตอบการกระทำของผู้ใช้** (ลบรายการสุดท้ายออกจากตะกร้า)
2. **ไม่มี** live region อื่นประกาศเรื่องเดียวกันอยู่แล้ว

### ★★ `title` ไม่เป็นหัวข้อโดยค่าเริ่มต้น (Astryx ใช้ `headingLevel: 3`)

เหตุผลเดียวกับ [`Banner.titleAs`](../feedback/Banner.md) — ที่ว่างสามอันในหน้าเดียวจะฉีด `<h3>` สามอันเข้าไปปน `<h2>`/`<h3>` ของเนื้อหาจริง ทำให้ผู้ใช้ที่สำรวจหน้าตามหัวข้อเจอโครงที่อ่านไม่ออก

ตั้ง `headingLevel` เฉพาะเมื่อที่ว่าง**แทนเนื้อหาของส่วนที่มีหัวข้อจริง**

⚠️ **หนี้คำศัพท์ที่รู้ตัว:** `Banner` ใช้ `titleAs` (รับ `'h2'|'h3'|'h4'`) ส่วนตัวนี้ใช้ `headingLevel` (รับ `1`–`6`) เพราะเป็นชื่อของ Astryx และตัวนี้สร้างใหม่จึงไม่มี call site เดิมให้พัง — **สองชื่อนี้หมายถึงสิ่งเดียวกัน** ควรรวมเป็นชื่อเดียวในรอบถัดไป (บันทึกไว้ที่ D26)

---

## 6 · Tailwind implementation

```tsx
<div
  role={isLive ? 'status' : undefined}
  className={cn(
    'grid min-w-0 justify-items-center gap-3 text-center',
    isCompact ? 'px-3 py-6' : 'px-4 py-12',
  )}
>
  {icon && <span className="text-fg-muted">{icon}</span>}
  <TitleTag className="text-subtitle text-fg">{title}</TitleTag>
  {description && (
    <p className="max-w-(--container-form) text-body-sm text-fg-muted">{description}</p>
  )}
  {actions}
</div>
```

`max-w-(--container-form)` ที่ `description` — บรรทัดยาวเต็มจอกว้างอ่านยาก และ**ข้อความไทยไม่มีช่องว่างระหว่างคำ** จึงยิ่งหาบรรทัดถัดไปยากกว่าภาษาที่มีช่องว่าง

`text-fg-muted` อยู่ที่ตัวห่อไอคอน เพื่อให้ผู้เรียกไม่ต้องจำสีทุกครั้ง

---

## 7 · Figma Variant

Component set **`EmptyState`**

| Property | Values |
|---|---|
| `Icon` | **`True`** · `False` |
| `Description` | **`True`** · `False` |
| `Actions` | `None` · **`One button`** · `Two buttons` |
| `Density` | **`Default`** · `Compact` |

**ต้องเขียนใน description ว่า `description` ต้องบอกทางออก** — ถ้าตัวอย่างใน Figma เขียนว่า "ไม่มีข้อมูล" นักพัฒนาจะลอกไปใช้แล้วผู้ใช้ไม่รู้ว่าต้องทำอะไรต่อ

---

## 8 · Usage

```tsx
// ตะกร้าว่าง — CartList เรียกให้แล้ว
<CartList itemCount={0} emptyAction={<Button>ดูสินค้าทั้งหมด</Button>}>…</CartList>
```

```tsx
// ค้นหาไม่พบ — ★ ไม่ส่ง isLive เพราะจำนวนด้านบนประกาศแล้ว
<EmptyState
  icon={<Icon name="search" size={32} />}
  title={s.search.noResults}
  description={s.search.noResultsHelp}
/>
```

```tsx
// ★ ที่ว่างที่โผล่มาตอบการกระทำ และไม่มีใครประกาศแทน → isLive
<EmptyState
  isLive
  icon={<Icon name="filter" size={32} />}
  title="ไม่มีรายการที่ตรงกับตัวกรองใหม่"
  description="ลดจำนวนตัวกรองลงเพื่อดูรายการเพิ่ม"
  actions={<Button variant="secondary" onPress={clearAll}>ล้างตัวกรองทั้งหมด</Button>}
/>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `title="ไม่มีข้อมูล"` | บอกว่าไม่มี**อะไร** | "ข้อมูล" เป็นศัพท์ระบบ ไม่ใช่คำที่ผู้ใช้พูด |
| ไม่มี `description` | บอกทางออก | ที่ว่างที่ไม่บอกทางออกคือทางตัน |
| `isLive` ทุกครั้ง | เฉพาะที่ตรงเงื่อนไข §5 | ประกาศซ้ำกับจำนวนผลลัพธ์ |
| `headingLevel={3}` ทุกครั้ง | ไม่ส่ง | ฉีด h3 ปนโครงหัวข้อของหน้า |
| ใช้แทน [`<Skeleton>`](../feedback/Skeleton.md) | `Skeleton` | "ว่าง" ≠ "ยังไม่มา" |
| ใช้แทน [`<Banner tone="danger">`](../feedback/Banner.md) | `Banner` | "ว่าง" ≠ "พัง" |
| `<Icon size={20} />` | `size={32}` | เล็กเกินกว่าจะเป็นจุดนำสายตาในพื้นที่ว่าง |
| แถบเปล่าที่ render เมื่อว่าง | `return null` | `Compare` เลือกทางนั้นเพื่อกัน layout shift |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/emptystate.test.tsx` · เทส "ไม่มี role โดยค่าเริ่มต้น" และ "title ไม่เป็นหัวข้อโดยค่าเริ่มต้น" |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` + `max-w-(--container-form)` ที่ `description` — ข้อความไทยยาวตัดบรรทัดในกล่องตัวเอง ไม่ดันหน้าให้เลื่อน (SC 1.4.10) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — `text-fg` / `text-fg-muted` override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ใช้ `px-*`/`py-*` ซึ่งเป็นแกนไม่ใช่ข้าง |
| คีย์บอร์ด (Keyboard) | ✅ | ตัวมันไม่ใช่ตัวควบคุม · ปุ่มใน `actions` อยู่ใน tab order ตามปกติ — เทส "ปุ่มทางออกยังอยู่" |
| กำลังโหลด (Loading) | — | คนละสถานะกับ "ว่าง" — ใช้ [`<Skeleton>`](../feedback/Skeleton.md) · เส้นแบ่งอยู่ใน §1 |
| ข้อผิดพลาด (Error) | — | คนละสถานะกับ "ว่าง" — ใช้ [`<Banner tone="danger">`](../feedback/Banner.md) |
| ว่างเปล่า (Empty) | ✅ | **เป็นตัว empty เอง** |
| Skeleton | — | ที่ว่างไม่ต้องมีตัวแทนระหว่างโหลด |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` ในไฟล์นี้ · ที่ว่างต้องปรากฏทันที ไม่ fade เข้า (เหตุผลเดียวกับ `Skeleton`) |
| ประสิทธิภาพ (Performance) | ✅ | ไม่มีความสูงตายตัว — `py-*` + เนื้อหากำหนดความสูง (SC 1.4.12) |
