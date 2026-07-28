# Link

**`@smego/ui`** · ชั้น 03 · [Link.tsx](./Link.tsx)

---

## 1 · ภาพรวม

สำหรับ **การนำทาง** — ไปที่อื่น เปลี่ยน URL

ไม่ใช่สำหรับการกระทำ นี่เป็นเส้นแบ่งที่ห้ามข้าม ไม่ใช่เรื่องรสนิยม

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ส่งฟอร์ม · ลบ · บันทึก | `<Button>` | Space ไม่ทำงานกับลิงก์ · screen reader ประกาศ "ลิงก์" |
| เปิด modal | `<DialogTrigger>` + `<Button>` | ไม่ได้เปลี่ยน URL — ผู้ใช้จะกด Back แล้วหลุดหน้า |
| ต้องการปุ่มที่ดูเหมือนลิงก์ | `<Button variant="ghost">` | ถ้ามันทำการกระทำ มันต้องเป็นปุ่ม |
| นำทางที่หน้าตาเหมือนปุ่ม | `<Link>` + `linkStyles` ทับด้วย `buttonStyles` | ยังต้องเป็น `<a href>` ข้างใน |

**กฎเดียว: ถ้ามันเปลี่ยน URL มันคือลิงก์ · ถ้ามันเปลี่ยนข้อมูล มันคือปุ่ม**

---

## 2 · React API

```tsx
import { Link } from '@smego/ui';

<Link href="/programs/2569-sme-transform">ดูรายละเอียดโครงการ</Link>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | **ต้องบอกปลายทาง** ไม่ใช่ "คลิกที่นี่" |
| `href` | `string` | — | ถ้าไม่มี `href` RAC จะ render เป็น `<span role="link">` |
| `size` | `'caption' \| 'body-sm' \| 'body' \| 'inherit'` | `'inherit'` | `inherit` = สืบขนาดจากย่อหน้า |
| `quiet` | `boolean` | `false` | ⚠️ ใช้ได้เฉพาะที่บริบทบอกอยู่แล้ว — ดู §3 |
| `external` | `boolean` | `false` | เพิ่มไอคอน + ข้อความซ่อน · **ไม่ตั้ง `target` ให้** |
| `newTabLabel` | `string` | จาก `s.common.opensInNewTab` | ข้อความ SR ต่อท้ายลิงก์ภายนอก · ชื่อ prop ตาม Astryx |
| `target` | `string` | — | ต้องตั้งเองถ้าจะเปิดแท็บใหม่ |
| `isDisabled` | `boolean` | `false` | จาก RAC |
| `onPress` | `(e) => void` | — | จาก RAC · ใช้กับ client-side router |

**prop อื่นของ RAC `Link` ส่งผ่านได้ทั้งหมด**

### ทางหนีเมื่อ wrapper ไม่พอ

```tsx
import { linkStyles } from '@smego/ui';
<NextLink href="/x" className={linkStyles({ size: 'body-sm' })}>…</NextLink>
```

---

## 3 · Variants

| variant | สี | ขีดใต้ | ใช้เมื่อไร |
|---|---|---|---|
| default | `text-link` (blue-700) | **มี** | ลิงก์ในย่อหน้า · ทุกที่โดยทั่วไป |
| `quiet` | `fg-secondary` | ไม่มี (มีตอน hover) | breadcrumb · รายการนำทาง |

### ★★ ขีดใต้ไม่ใช่ทางเลือก (SC 1.4.1)

`--color-link` = blue-700 ได้ **6.56:1** กับพื้นขาว — ผ่าน AA สำหรับตัวอักษร

**แต่** contrast ระหว่าง **ลิงก์กับข้อความรอบข้าง** (`neutral-900`) **ต่ำกว่า 3:1**

ดังนั้นสีอย่างเดียว **บอกไม่ได้ว่านี่คือลิงก์** → ต้องมีตัวชี้ที่ไม่ใช่สี = ขีดใต้

`base.css` ใส่ขีดใต้ให้ `:where(a[href])` อยู่แล้ว — component นี้จึงไม่ต้องเพิ่ม และ **ห้ามลบด้วย `no-underline`**

### ★ `quiet` มีเงื่อนไขการใช้ที่แคบมาก

ใช้ได้ **เฉพาะที่บริบทบอกอยู่แล้วว่าเป็นลิงก์** — breadcrumb, รายการนำทาง, เมนู

**ห้ามใช้กับลิงก์ที่ฝังในย่อหน้า** เพราะจะไม่มีอะไรบอกว่ากดได้เลย ทั้งสีก็ไม่ต่าง ทั้งขีดใต้ก็ไม่มี

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เปลี่ยน |
|---|---|---|
| default | — | `text-link` + ขีดใต้ |
| hover | `data-hovered` | `text-primary-800` |
| focus-visible | `data-focus-visible` | วงแหวน 2 ชั้นจาก `base.css` |
| pressed | `data-pressed` | — |
| visited | `:visited` | **ไม่เปลี่ยน** — ดูด้านล่าง |
| disabled | `data-disabled` | `text-fg-disabled` · ไม่มีขีดใต้ · `cursor-not-allowed` |

### ★ ไม่มีสี `:visited`

ในมาร์เก็ตเพลสที่ผู้ใช้ดูสินค้าหลายสิบรายการ สี visited ทำให้กริดดูเลอะและไม่ช่วยตัดสินใจ — ต่างจากเว็บเอกสารที่มันมีประโยชน์จริง

ถ้าต้องการบอกว่า "เคยดูแล้ว" ให้ใช้ป้ายที่ชัดเจน (`<Badge label="ดูแล้ว" />`) ซึ่ง screen reader อ่านได้ด้วย

### ⚠️ `isDisabled` กับลิงก์

ลิงก์ที่ disabled แทบไม่มีเหตุผลที่ดี — ถ้าไปที่นั่นไม่ได้ ให้ **ไม่ render ลิงก์** แล้วแสดงข้อความอธิบายแทน

RAC ให้ `isDisabled` มา จึงส่งผ่านไว้ แต่ใช้แล้วต้องอธิบายได้ว่าทำไม

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `link` จาก `<a href>` |
| keyboard | **Enter เท่านั้น** · Space ไม่ทำงาน (ต่างจากปุ่ม) |
| **SC 1.4.1** | ขีดใต้บังคับ — สีลิงก์ vs ข้อความรอบข้าง < 3:1 |
| **SC 1.4.3** | `text-link` = 6.56:1 บนขาว · วัดในเบราว์เซอร์ได้ **6.22** บน `canvas` |
| **SC 2.4.4** | `children` ต้องบอกปลายทางได้ด้วยตัวเอง |
| **SC 3.2.5** | `external` ต้องบอกก่อนกด ไม่ใช่หลังกด |
| **SC 2.5.8** | ⚠️ ลิงก์ในย่อหน้าได้รับ **ยกเว้น inline** |

### ★ ลิงก์ในย่อหน้าและข้อยกเว้น SC 2.5.8

ลิงก์ `<Link size="caption">หน้าแรก</Link>` วัดได้ **43×20px** ซึ่งสูงไม่ถึง 24

**นี่ผ่าน** เพราะ SC 2.5.8 ยกเว้นเป้าที่อยู่ในบรรทัดข้อความ (inline) ซึ่งขนาดถูกกำหนดโดยขนาดตัวอักษร

**แต่ลิงก์ที่ยืนเดี่ยว** (ในรายการนำทาง, ท้ายการ์ด, ในแถบเมนู) **ไม่ได้รับข้อยกเว้นนี้** ต้องมี `py-1` หรือมากกว่าให้ถึง 24px

### ★★ `external` บอกก่อนกด

```tsx
<Link href="https://sme.go.th" external target="_blank">เว็บไซต์ สสว.</Link>
```

ได้ทั้ง **ไอคอน** (สำหรับผู้ที่มองเห็น) และ **`<span className="sr-only">` "(เปิดในแท็บใหม่)"** (สำหรับ screen reader)

⚠️ `external` **ไม่ตั้ง `target="_blank"` ให้อัตโนมัติ** — การเปิดแท็บใหม่เป็น **การตัดสินใจระดับผลิตภัณฑ์** ไม่ใช่ผลข้างเคียงของการมีไอคอน

---

## 6 · Tailwind implementation

```ts
const linkStyles = cva(
  [
    'inline-flex items-center gap-1',
    'min-w-0',
    'text-link',                     /* ระบุซ้ำเพื่อให้ variant ทับได้ */
    'transition-colors duration-fast ease-standard',
    'data-hovered:text-primary-800',
    'data-disabled:text-fg-disabled data-disabled:no-underline',
    'data-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        caption:   'text-caption',
        'body-sm': 'text-body-sm',
        body:      'text-body',
        inherit:   '',
      },
      quiet: {
        true:  'text-fg-secondary no-underline data-hovered:text-fg data-hovered:underline',
        false: '',
      },
    },
    defaultVariants: { size: 'inherit', quiet: false },
  },
);
```

ขีดใต้ **ไม่ได้อยู่ใน CVA** — มาจาก `base.css`:

```css
:where(a[href]) { text-decoration: underline; }
```

เขียนด้วย `:where()` ให้ specificity เป็น 0 จึงทับได้ด้วย `quiet` แต่ **ไม่ถูกทับโดยบังเอิญ** จาก reset ของไลบรารีอื่น

---

## 7 · Figma Variant

Component set **`Link`**

| Property | Values |
|---|---|
| `Size` | `Caption` · `Body SM` · `Body` |
| `Quiet` | `True` · `False` |
| `External` | `True` · `False` |
| `State` | `Default` · `Hover` · **`Focus`** · `Disabled` |

**ขีดใต้ต้องอยู่ใน component จริง ๆ** ไม่ใช่แค่ในภาพตัวอย่าง — ถ้านักออกแบบปิดขีดใต้ใน Figma นักพัฒนาจะใส่ `no-underline` แล้วตกข้อ SC 1.4.1

**`External` ต้องมีไอคอนในตัว variant** ไม่ใช่ให้แปะเอง

---

## 8 · Usage

```tsx
// ลิงก์ในย่อหน้า
<p className="text-body text-fg-secondary">
  เอกสารที่ต้องใช้ระบุไว้ใน <Link href="/docs/grant-2569">ประกาศหลักเกณฑ์</Link> ข้อ 4
</p>
```

```tsx
// ลิงก์ออกนอกเว็บ
<Link href="https://www.sme.go.th" external target="_blank" rel="noopener">
  เว็บไซต์ สสว.
</Link>
```

```tsx
// breadcrumb — quiet ใช้ได้เพราะบริบทบอกอยู่แล้ว
<nav aria-label="เส้นทางนำทาง">
  <Link href="/" quiet size="caption">หน้าแรก</Link>
  <span aria-hidden="true"> / </span>
  <Link href="/machines" quiet size="caption">เครื่องจักร</Link>
</nav>
```

```tsx
// การ์ดที่กดได้ทั้งใบ — ยังเป็นลิงก์จริง
<Card as="article" interactive className="relative">
  <h3 className="text-subtitle">
    <Link href={url} className="after:absolute after:inset-0">{title}</Link>
  </h3>
</Card>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Link onPress={deleteItem}>` | `<Button variant="danger">` | Space ไม่ทำงาน · screen reader ประกาศ "ลิงก์" ผิดความคาดหวัง |
| `<Button variant="ghost" onPress={router.push}>` | `<Link href>` | เปิดแท็บใหม่ไม่ได้ คัดลอก URL ไม่ได้ |
| `<Link className="no-underline">` | `quiet` (ถ้าบริบทเหมาะ) | สีลิงก์ vs ข้อความรอบข้าง < 3:1 = ไม่ผ่าน SC 1.4.1 |
| `<Link quiet>` ในย่อหน้า | default | ไม่มีทั้งสีและขีดใต้ = ไม่มีอะไรบอกว่ากดได้ |
| `<Link>คลิกที่นี่</Link>` | `<Link>ประกาศหลักเกณฑ์</Link>` | ผู้ใช้ที่ฟังรายการลิงก์ได้ยิน "คลิกที่นี่" 12 ครั้ง (SC 2.4.4) |
| `target="_blank"` โดยไม่มี `external` | ใส่ทั้งคู่ | เปิดแท็บใหม่โดยไม่บอก = ไม่ผ่าน SC 3.2.5 |
| `external` แล้วคาดว่าจะเปิดแท็บใหม่เอง | ตั้ง `target` เองด้วย | ไอคอนไม่ควรเปลี่ยนพฤติกรรม |
| ลิงก์ยืนเดี่ยวสูง 20px | เพิ่ม `py-1` | ข้อยกเว้น inline ของ SC 2.5.8 ใช้กับลิงก์ในบรรทัดข้อความเท่านั้น |
| `a:visited { color: purple }` | `<Badge label="ดูแล้ว" />` | สี visited ทำให้กริดสินค้าเลอะ และ screen reader ไม่ได้ยิน |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` · `SC 2.4.4` ชื่อลิงก์บอกปลายทางได้ด้วยตัวเอง |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` — ลิงก์ไทยยาวตัดบรรทัดได้ ไม่ดันแถวล้นที่ 320px |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §4 `focus-visible` · เป็น `<a href>` จริงจึงอยู่ใน tab order และเปิดแท็บใหม่ได้ตามปกติ |
| กำลังโหลด (Loading) | — | การนำทางเป็นหน้าที่ของ router — ถ้าต้องรอ ให้สถานะอยู่ที่หน้าปลายทาง |
| ข้อผิดพลาด (Error) | — | ลิงก์ไม่ถือความถูกต้องของข้อมูล |
| ว่างเปล่า (Empty) | — | ลิงก์ที่ไม่มีข้อความคือลิงก์ที่ไม่ควร render |
| Skeleton | — | ข้อความบรรทัดเดียวไม่ต้องมีตัวแทนระหว่างโหลด |
| การเคลื่อนไหว (Animation) | ✅ | `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี · ไม่มีความสูงตายตัว |
