# TopNav

**`@smego/ui`** · ชั้น 03 · [TopNav.tsx](./TopNav.tsx)

> เดิมชื่อ `AppHeader` — เปลี่ยนตาม ASTRYX-PARITY.md §1.2/§8.3 · รับ slot props ของ Astryx (`heading` `startContent` `centerContent` `endContent` `label`) เป็นส่วนเสริม (§8.3 · D12) — ของ Astryx เป็น shell เปล่า ของเรารู้เรื่อง marketplace อยู่แล้วและคง 9 props เดิมไว้ทั้งหมด

---

## 1 · ภาพรวม

แถบบนสุดที่อยู่ทุกหน้า — ชื่อแบรนด์ · ช่องค้นหา · ตะกร้าพร้อมจำนวน · ส่วนบัญชี

เป็น component ตัวเดียวที่ **รับน้ำหนัก SC 2.4.11 ของทั้งระบบ** เพราะ `scroll-margin-top` ของทุก element ที่ focus ได้คำนวณจากความสูงของแถบนี้

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| แถบเครื่องมือในหน้า | วางในเนื้อหา | ไม่ควรแย่งพื้นที่แถบหลัก |
| นำทางหมวดสินค้า | [`<CategoryNav>`](../marketplace/CategoryNav.md) | คนละระดับของการนำทาง |
| แถบยึดก้นจอบนมือถือ | `<BottomNav>` (ยังไม่มี) | ต้องประกาศ `--bottom-nav-height` ของตัวเอง |

---

## 2 · React API

```tsx
<TopNav
  search={<SearchField labelHidden placeholder={s.search.placeholder} />}
  cartCount={cart.items.length}
  onOpenCart={() => setCartOpen(true)}
  account={user ? <AccountMenu user={user} /> : undefined}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `heading` | `ReactNode` | — | slot ของ Astryx — ไม่ใช่ `<h1>` |
| `startContent` | `ReactNode` | — | slot ของ Astryx — ก่อนชื่อแบรนด์ |
| `centerContent` | `ReactNode` | — | slot ของ Astryx — ข้าง `search` |
| `endContent` | `ReactNode` | — | slot ของ Astryx — หลังตะกร้า/บัญชี |
| `label` | `string` | — | slot ของ Astryx — `aria-label` ของแถบทั้งแถบ |
| `homeHref` | `string` | `'/'` | |
| `logo` | `ReactNode` | ข้อความ "SME.GO" | `<img>` ต้องมี `alt` เป็นชื่อเว็บ |
| `search` | `ReactNode` | — | ซ่อนต่ำกว่า `md` |
| `cartCount` | `number` | `0` | `0` = ไม่มีตัวเลข แต่ปุ่มยังอยู่ |
| `onOpenCart` | `() => void` | — | ไม่ส่ง = ไม่มีปุ่มตะกร้า |
| `account` | `ReactNode` | — | ไม่ส่ง = แขก → ลิงก์ "เข้าสู่ระบบ" |
| `signInHref` | `string` | `'/signin'` | |
| `mainId` | `string` | `'main'` | ปลายทางของลิงก์ข้าม |

---

## 3 · Variants

ไม่มี variant · เปลี่ยนตาม breakpoint และสถานะการเข้าสู่ระบบ

| | `< md` | `≥ md` |
|---|---|---|
| ความสูง | 56px | 64px (จาก token) |
| ช่องค้นหา | **ซ่อน** | แสดงเต็มพื้นที่กลาง |

### ★ ทำไมช่องค้นหาหายบนมือถือ

แถบสูง 56px ที่ยัดโลโก้ + ช่องค้นหา + ตะกร้า + บัญชี ทำให้ทุกอันเล็กจนต่ำกว่า 24×24 · หน้าที่การค้นหาเป็นงานหลัก (หน้ารายการ) วางช่องไว้ในเนื้อหาแทน ซึ่งได้พื้นที่เต็มความกว้าง

---

## 4 · States

| state | ผล |
|---|---|
| ตะกร้าว่าง | ปุ่มยังอยู่ · ไม่มีตัวเลข · ชื่อ "เปิดตะกร้าสินค้า" |
| ตะกร้ามีของ | วงกลมตัวเลข + ชื่อ "เปิดตะกร้าสินค้า มี 3 รายการ" |
| จำนวนเปลี่ยน | ประกาศผ่าน `aria-live="polite"` |
| แขก | ลิงก์ "เข้าสู่ระบบ" |
| เข้าสู่ระบบแล้ว | `account` ที่ส่งเข้ามา |
| focus ที่ลิงก์ข้าม | ลิงก์โผล่มุมบนซ้าย |

**ตะกร้าไม่เคยถูกซ่อนหรือ disabled สำหรับแขก** — การขอตัวตนก่อนให้คุณค่าคือจุดที่ผู้ซื้อเลิกใช้ (ดู [`Cart.md`](../marketplace/Cart.md))

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 2.4.1** | ลิงก์ข้ามไปเนื้อหาเป็นชิ้นแรกใน DOM |
| **SC 2.4.11** | ความสูงมาจาก `--header-height` เท่านั้น |
| **SC 4.1.3** | จำนวนในตะกร้าประกาศผ่าน live region |
| **SC 1.3.1** | `<header>` เป็น landmark · ชื่อแบรนด์เป็นลิงก์ ไม่ใช่ `<h1>` |
| **SC 2.5.3** | จำนวนอยู่ในชื่อปุ่มตะกร้า |

### ★★★ ความสูงมาจาก token เท่านั้น

`base.css` ตั้ง `scroll-margin-top: calc(var(--header-height) + var(--spacing) * 2)` ให้ทุก element ที่ focus ได้

ถ้าแถบนี้ตั้งความสูงเองด้วยตัวเลขอื่น ทุก element ที่ผู้ใช้ Tab ไปถึงในหน้าที่เลื่อนได้จะ **โผล่มาครึ่งเดียวใต้แถบ** — และเป็นความล้มเหลวที่มองไม่เห็นด้วยตาจนกว่าจะลอง Tab จริง

ค่าเปลี่ยนเองที่ md (56 → 64px) ในชั้น token · component ไม่ต้องรู้เรื่องนี้เลย

### ★★★ ลิงก์ข้ามต้อง `sr-only` ไม่ใช่ `hidden`

element ที่ถูกซ่อนจริง **Tab ไม่ถึง** · `sr-only` + `focus:not-sr-only` ทำให้ลิงก์อยู่ใน tab order ตลอดเวลาแต่เห็นเฉพาะตอน focus

ถ้าไม่มีลิงก์นี้ ผู้ใช้คีย์บอร์ดต้องกด Tab ผ่านช่องค้นหา ตะกร้า และเมนูบัญชีใหม่ **ทุกครั้งที่เปลี่ยนหน้า**

### ★★★ จำนวนอยู่ในชื่อปุ่ม ไม่ใช่แค่ในวงกลม

วงกลมที่มีเลข 3 บอกผู้ใช้ screen reader ว่า "3" ลอย ๆ

ชื่อปุ่มจึงเป็น **"เปิดตะกร้าสินค้า มี 3 รายการ"** และตัวเลขที่มองเห็นได้ `aria-hidden` — ไม่งั้นจะได้ยินเลขซ้ำสองครั้ง

จำนวนยังประกาศแยกผ่าน `aria-live="polite"` เพราะเปลี่ยนตอนผู้ใช้กดเพิ่มลงตะกร้าจากที่อื่นในหน้า ขณะที่ focus ไม่ได้อยู่ที่ปุ่มนี้

### ★ ชื่อแบรนด์เป็นลิงก์ ไม่ใช่ `<h1>`

`<h1>` ของแต่ละหน้าคือชื่อหน้านั้น · ถ้า header ถือ `<h1>` ทุกหน้าจะมีหัวข้อระดับ 1 สองอันและโครงหัวข้อจะอ่านไม่ได้ (axe จับเป็น `page-has-heading-one` ผ่าน แต่ผู้ใช้จริงสับสน)

---

## 6 · Tailwind implementation

```tsx
<header className="sticky top-0 z-(--z-sticky) border-b border-edge bg-surface">
  <div className="mx-auto flex h-(--header-height) … max-w-(--container-content)">
```

`z-(--z-sticky)` = 20 · ต่ำกว่า drawer (`--z-overlay` 40) และ modal (50) โดยตั้งใจ — ตะกร้าที่เปิดจากปุ่มในแถบนี้ต้องอยู่เหนือแถบ

`bg-surface` ไม่ใช่ `bg-canvas` — แถบต้องแยกจากพื้นหลังของหน้า และ `bg-sunken` ที่อยู่ข้างในจะไม่เห็นถ้าวางบน canvas (ดู `semantic.css`)

---

## 7 · Figma Variant

Component set **`TopNav`**

| Property | Values |
|---|---|
| `Breakpoint` | **`Mobile (56px, ไม่มีช่องค้นหา)`** · `Desktop (64px)` |
| `Cart` | `ว่าง` · **`มี 3 รายการ`** |
| `Auth` | **`แขก`** · `เข้าสู่ระบบแล้ว` |

**ต้องเขียนใน description ว่าความสูงผูกกับ `--header-height`** — ถ้านักออกแบบเปลี่ยนเป็น 72px ต้องแก้ที่ token ไม่ใช่ที่ frame ไม่งั้น `scroll-margin` ทั้งระบบจะผิด

---

## 8 · Usage

```tsx
export function Layout({ children }) {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <>
      <TopNav
        search={<SearchField labelHidden placeholder={s.search.placeholder} />}
        cartCount={cart.count}
        onOpenCart={() => setCartOpen(true)}
        account={user ? <AccountMenu /> : undefined}
      />

      <main id="main">{children}</main>

      <CartDrawer isOpen={isCartOpen} onOpenChange={setCartOpen} fullCartHref="/cart">
        <CartList …>…</CartList>
      </CartDrawer>

      <ToastRegion />
    </>
  );
}
```

⚠️ `<main id="main">` ต้องมีจริง — ลิงก์ข้ามชี้ไปที่นี่

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `h-14` ตายตัว | `h-(--header-height)` | `scroll-margin` ทั้งระบบผิด (SC 2.4.11) |
| ไม่มีลิงก์ข้าม | มีเป็นชิ้นแรกใน DOM | Tab ผ่านแถบใหม่ทุกหน้า |
| ลิงก์ข้ามเป็น `hidden` | `sr-only` + `focus:not-sr-only` | ของที่ซ่อนจริง Tab ไม่ถึง |
| ตัวเลขตะกร้าในวงกลมอย่างเดียว | อยู่ในชื่อปุ่มด้วย | SR ได้ยิน "3" ลอย ๆ |
| ตัวเลขไม่ `aria-hidden` | ซ่อนจาก SR | ได้ยินเลขซ้ำสองครั้ง |
| ซ่อนตะกร้าสำหรับแขก | แสดงเสมอ | ขอตัวตนก่อนให้คุณค่า |
| ชื่อแบรนด์เป็น `<h1>` | ลิงก์ | ทุกหน้าจะมี h1 สองอัน |
| `z-30` ดิบ | `z-(--z-sticky)` | linter ปฏิเสธ |
| ยัดช่องค้นหาลงแถบมือถือ | ซ่อนต่ำกว่า md | ทุกเป้ากดเล็กเกินเกณฑ์ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass5.test.tsx` · เทส "★★★ ลิงก์ข้ามไปเนื้อหาเป็นลิงก์แรกใน DOM" (SC 2.4.1) · "★ ชื่อแบรนด์เป็นลิงก์ ไม่ใช่ `h1`" |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · แถบยึดบนสุดและยุบเมนูที่จอแคบ · `e2e/wcag22.spec.ts:81` แถบประกาศความสูงจริงเข้าตัวแปรของตัวเอง |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | `e2e/wcag22.spec.ts:44` `Tab` ทั้งหน้าที่ 320px และ 1280px แล้ว**ไม่มี element ไหนถูกแถบบังจนมิด** (SC 2.4.11) — นี่คือเหตุผลที่แถบต้องประกาศความสูงของตัวเอง |
| กำลังโหลด (Loading) | — | จำนวนในตะกร้ามาจาก store ที่ resolve แล้ว |
| ข้อผิดพลาด (Error) | — | แถบไม่ยิง request เอง |
| ว่างเปล่า (Empty) | ✅ | เทส "★ ตะกร้าว่างยังมีปุ่มอยู่ที่เดิม ไม่ถูกซ่อน" — ตำแหน่งปุ่มไม่ขยับตามจำนวน · §4 "แขก" กับ "เข้าสู่ระบบแล้ว" แยกกัน |
| Skeleton | — | แถบเป็นโครงคงที่ที่ต้องใช้ได้ทันทีตั้งแต่เฟรมแรก |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — แถบที่ยึดอยู่กับที่ห้ามขยับ |
| ประสิทธิภาพ (Performance) | ✅ | §4 "จำนวนเปลี่ยน" ประกาศผ่าน live region ไม่ใช่ re-render ทั้งแถบ · เขียนเฉพาะตัวแปรความสูงของตัวเอง (`e2e/wcag22.spec.ts:369` ยืนยันว่าไม่แตะของแถบอื่น) |
