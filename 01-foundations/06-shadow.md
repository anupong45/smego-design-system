# 06 · Shadow & Elevation / เงาและการยกระดับ

**SME.GO Marketplace** · Foundation Layer · WCAG 2.2 AA

ค่า contrast ทุกค่าในเอกสารนี้ **คำนวณจริง** จากค่าสีในข้อ 02

---

## ภาพรวม / Overview

**เงาใช้ในโหมดมืดไม่ได้** — เงาคือการทำให้พื้นที่รอบ ๆ มืดลง ซึ่งบนพื้นที่มืดอยู่แล้วมองไม่เห็นอะไรเลย

ระบบจึงมี **2 กลไก** ใต้ token ชุดเดียว

| โหมด | กลไกที่สร้างลำดับชั้น |
|---|---|
| **สว่าง** | เงา (shadow) + เส้นขอบบาง |
| **มืด** | ความสว่างพื้นผิว + **เส้นขอบที่รับน้ำหนักจริง** |

**Component ต้องอ้าง `--elevation-*` เท่านั้น** ห้ามอ้าง `--shadow-md` โดยตรง — เพราะ component ที่อ้างเงาตรงจะพังในโหมดมืดโดยไม่มีใครรู้

---

## 1 · บันไดยกระดับ / The elevation ladder

| Level | Semantic token | ใช้กับอะไร |
|---|---|---|
| 0 | `--elevation-flat` | เนื้อหาในหน้า · แถวตาราง · พื้นหลัง |
| 1 | `--elevation-raised` | card · panel · alert |
| 2 | `--elevation-floating` | dropdown · select menu · tooltip |
| 3 | `--elevation-overlay` | popover · combobox · date picker |
| 4 | `--elevation-modal` | modal · dialog · drawer · bottom sheet |

---

## 2 · โหมดสว่าง — สเกลเงา

**สีเงาไม่ใช่ดำสนิท** ใช้ `rgb(18 20 26)` ซึ่งคือค่าของ `neutral-950` — เงาโทนน้ำเงินเข้ากับพื้นผิว hue 220 ในข้อ 02 ส่วนเงาดำสนิทบนพื้นโทนเย็นจะออกเทาสกปรก

เงาทุกขั้นมี **2 ชั้น** — ชั้นแรกคือเงาสัมผัส (contact) แคบและคม ชั้นที่สองคือเงาบรรยากาศ (ambient) กว้างและนุ่ม

| Token | ค่า | ใช้กับอะไร |
|---|---|---|
| `shadow-xs` | `0 1px 2px 0 rgb(18 20 26 / .05)` | chip · badge ที่วางบนพื้นผิว |
| `shadow-sm` | `0 1px 2px 0 rgb(18 20 26 / .06),`<br>`0 1px 3px 0 rgb(18 20 26 / .10)` | **card ตอนพัก** |
| `shadow-md` | `0 2px 4px -1px rgb(18 20 26 / .06),`<br>`0 4px 8px -2px rgb(18 20 26 / .10)` | **card ตอน hover · dropdown** |
| `shadow-lg` | `0 4px 8px -2px rgb(18 20 26 / .08),`<br>`0 12px 20px -4px rgb(18 20 26 / .12)` | **popover · menu · combobox** |
| `shadow-xl` | `0 8px 16px -4px rgb(18 20 26 / .10),`<br>`0 20px 32px -8px rgb(18 20 26 / .14)` | **modal · dialog** |
| `shadow-2xl` | `0 16px 32px -8px rgb(18 20 26 / .12),`<br>`0 32px 64px -16px rgb(18 20 26 / .18)` | command palette · overlay เต็มจอ |

### 2.1 เงาคู่กับเส้นขอบเสมอ

โหมดสว่างใช้ **เงา + เส้นขอบบาง 1px** ไม่ใช่เงาเพียว ๆ

**เหตุผล:** บนจอที่สว่างจัด (ใช้งานกลางแจ้ง ซึ่งเกิดขึ้นจริงกับ SME ที่ขายของหน้าร้าน) เงาอ่อน 5–10% จะมองไม่เห็นเลย ขอบ 1px ทำให้ card ยังมีขอบเขตชัดในทุกสภาพแสง

```css
/* card ตอนพัก */
box-shadow: var(--shadow-sm);
border: 1px solid var(--color-edge-subtle);   /* neutral-200 */
```

---

## 3 · ⚠️ โหมดมืด — ความสว่างพื้นผิวไม่พอ

นี่คือผลตรวจที่เปลี่ยนวิธีสร้างโหมดมืดของระบบนี้

### 3.1 ผลวัดบันไดพื้นผิว

| ขั้น | HEX | contrast กับขั้นก่อนหน้า |
|---|---|---|
| `neutral-950` (canvas) | `#12141A` | — |
| `neutral-900` (raised) | `#1D2128` | **1.14:1** |
| `neutral-850` (floating) | `#262B33` | **1.14:1** |
| `neutral-800` (modal) | `#31363F` | **1.17:1** |

**ทุกขั้นห่างกันเพียง ~1.14:1** — ต่ำกว่าเกณฑ์ 3:1 อย่างมาก

### 3.2 ข้อสรุปที่ต้องแก้จากสถาปัตยกรรมเดิม

สถาปัตยกรรมข้อ 9 ระบุว่าโหมดมืดสร้างลำดับชั้นจาก **ความสว่างพื้นผิว** พร้อมเส้นขอบที่สว่างขึ้น — ตอนนี้ผลวัดบอกว่าลำดับความสำคัญกลับกัน

> **ในโหมดมืด ความสว่างพื้นผิวเป็นเพียงสัญญาณเชิงสุนทรียะ — เส้นขอบคือสิ่งที่รับน้ำหนักการแยกจริง**

### 3.3 เส้นขอบที่ต้องใช้ในโหมดมืด

คำนวณว่าขอบสีไหนได้ 3:1 บนพื้น `neutral-900`

| ขอบ | บน `neutral-950` | บน `neutral-900` | ใช้ได้ไหม |
|---|---|---|---|
| `neutral-700` | 2.13 | 1.41 | ❌ ตกแต่งเท่านั้น |
| `neutral-600` | 3.05 ✅ | 2.67 ❌ | ⚠️ ผ่านบน canvas ไม่ผ่านบน surface |
| **`neutral-500`** | **4.38 ✅** | **3.84 ✅** | ✅ **ผ่านทั้งสองพื้น** |

### 3.4 กฎที่ตามมา

| ประเภท | ขอบในโหมดมืด | เหตุผล |
|---|---|---|
| **Card · panel** (อยู่ในกระแสของหน้า) | `neutral-800` | ขอบตกแต่ง — ยกเว้นจาก SC 1.4.11 ตำแหน่งของ card ชัดจาก layout อยู่แล้ว |
| **Overlay ที่ลอยทับเนื้อหา** (dropdown · popover · menu · combobox) | **`neutral-500`** | **ต้องผ่าน 3:1** เพราะถ้าแยกจากเนื้อหาข้างหลังไม่ออก ผู้ใช้จะไม่รู้ว่าเมนูเปิดอยู่ |
| **Modal · dialog** | **`neutral-500`** | เหตุผลเดียวกัน + ดูข้อ 3.5 |

### 3.5 ⚠️ Backdrop ช่วยโหมดมืดไม่ได้

Modal ในโหมดสว่างพึ่ง backdrop สีเข้มทำให้พื้นหลังมืดลง แล้ว modal สีขาวจึงเด่นชัดขึ้นมาก

**ในโหมดมืดกลไกนี้ใช้ไม่ได้** เพราะพื้นหลังมืดอยู่แล้ว

| | โหมดสว่าง | โหมดมืด |
|---|---|---|
| พื้นหลังก่อนใส่ backdrop | `neutral-50` | `neutral-950` |
| หลังใส่ backdrop | เข้มลงมาก | **แทบไม่เปลี่ยน** |
| Modal vs พื้นหลังที่มี backdrop | ~11:1 | **~1.7:1** |

**ผลที่ตามมา:** โหมดมืด modal ต้องพึ่ง **ขอบ `neutral-500`** เป็นตัวแยกหลัก ไม่ใช่ backdrop — backdrop ยังคงมีไว้เพื่อบอกว่าพื้นหลังกดไม่ได้ (affordance) ไม่ใช่เพื่อสร้าง contrast

---

## 4 · ตารางแมป elevation ทั้งสองโหมด

| Level | โหมดสว่าง | โหมดมืด |
|---|---|---|
| `flat` | พื้น `bg-canvas` · ไม่มีเงา ไม่มีขอบ | พื้น `neutral-950` |
| `raised` | `bg-surface` (white)<br>`shadow-sm`<br>ขอบ `neutral-200` | พื้น `neutral-900`<br>**ไม่มีเงา**<br>ขอบ `neutral-800` |
| `floating` | `bg-surface`<br>`shadow-md`<br>ขอบ `neutral-200` | พื้น `neutral-850`<br>**ไม่มีเงา**<br>ขอบ **`neutral-500`** |
| `overlay` | `bg-surface`<br>`shadow-lg`<br>ไม่มีขอบ (เงาแรงพอ) | พื้น `neutral-850`<br>**ไม่มีเงา**<br>ขอบ **`neutral-500`** |
| `modal` | `bg-surface`<br>`shadow-xl`<br>ไม่มีขอบ | พื้น `neutral-800`<br>**ไม่มีเงา**<br>ขอบ **`neutral-500`** |

**โหมดมืดตั้ง opacity ของเงาเป็น 0** ไม่ใช่ลบ property ออก — เพื่อให้ transition ระหว่างสถานะยังทำงานได้ปกติและไม่มี layout shift

---

## 5 · ⚠️ ประสิทธิภาพ — เงาในรายการยาว

Marketplace แสดง card 20–60 ใบต่อหน้า และเงา 2 ชั้นต่อใบหมายถึง blur operation 40–120 ครั้งต่อการ repaint หนึ่งครั้ง — บน Android ระดับล่างซึ่งเป็นเกณฑ์อ้างอิงในข้อ 01 ต้นทุนนี้เห็นผลจริงตอน scroll

### กฎสำหรับ grid สินค้า

> **Card ใน grid ตอนพักใช้ขอบเท่านั้น ไม่มีเงา** — เงาปรากฏตอน hover และ focus

```css
.product-card {
  border: 1px solid var(--color-edge-subtle);
  box-shadow: none;                             /* พัก — ไม่มีเงา */
  transition: box-shadow var(--transition-duration-fast) var(--ease-standard);
}
.product-card:hover,
.product-card:focus-within {
  box-shadow: var(--shadow-md);                 /* hover — มีเงา */
}
```

**ได้ประโยชน์สองทาง** — เร็วขึ้นตอน scroll และตัว hover ที่ชัดเจนกว่าเดิม เพราะการเปลี่ยนจาก "ไม่มีเงา" เป็น "มีเงา" อ่านง่ายกว่าการเปลี่ยนจาก sm เป็น md

### ข้อห้ามด้านประสิทธิภาพ

| ห้าม | เหตุผล |
|---|---|
| `backdrop-filter: blur()` ในรายการ | แพงที่สุดใน CSS ทั้งหมด ทำให้ scroll กระตุกบน Android ระดับล่าง |
| เงามากกว่า 2 ชั้น | ต้นทุนเพิ่มเป็นเชิงเส้นแต่ตาแยกไม่ออก |
| animate `box-shadow` ของหลาย element พร้อมกัน | ทำให้ repaint ทั้งชั้น — ใช้ `opacity` ของ pseudo-element ถ้าต้องการ |
| เงาบนแถวตาราง | ตารางใช้เส้นคั่นสร้างลำดับชั้น ไม่ใช่เงา |

---

## 6 · Backdrop / Scrim

| Token | โหมดสว่าง | โหมดมืด |
|---|---|---|
| `--color-backdrop` | `rgb(18 20 26 / .50)` | `rgb(0 0 0 / .70)` |

**โหมดมืดใช้ค่าเข้มกว่า** ไม่ใช่เพื่อสร้าง contrast (ซึ่งทำไม่ได้ ดูข้อ 3.5) แต่เพื่อให้สัญญาณว่า "พื้นหลังกดไม่ได้" ยังชัดเจน

**⚠️ Backdrop ต้องเคารพ reduced motion** — fade เข้าออกด้วย `opacity` ที่ `--transition-duration-fast` เท่านั้น ห้ามมี transform หรือ blur

---

## 7 · สิ่งที่ระบบนี้ไม่ใช้

| ไม่ใช้ | เหตุผล |
|---|---|
| **เงาสี** (เงาน้ำเงินใต้ปุ่มน้ำเงิน) | ดูเป็นแอปผู้บริโภค ขัดกับ Professional 8/10 และทำให้ contrast ของขอบคาดเดาไม่ได้ |
| **`inset` shadow เพื่อยกระดับ** | ใช้ได้เฉพาะพื้นจม (input ที่กดอยู่ · well) ไม่ใช่กลไกยกระดับ |
| **Glassmorphism** | `backdrop-filter` แพงเกินไปสำหรับเกณฑ์อุปกรณ์ในข้อ 01 และ contrast ของข้อความบนพื้นโปร่งคาดเดาไม่ได้ |
| **Neumorphism** | พึ่งเงาสองทิศเพื่อสร้างรูปทรง ใช้ในโหมดมืดไม่ได้เลย และ contrast ไม่ผ่าน |
| **เงาบน `flat` level** | ถ้าทุกอย่างมีเงา ไม่มีอะไรดูยกขึ้น |

---

## 🎨 Designer Notes

- **โหมดมืดไม่มีเงาเลย** ถ้าไฟล์ Figma ของโหมดมืดมี drop shadow นั่นคือความเข้าใจผิด — ใช้ **ความสว่างพื้นผิว + ขอบ** แทน
- **ในโหมดมืด ขอบคือตัวแยกจริง ไม่ใช่พื้นผิว** — ขั้นพื้นผิวห่างกันแค่ 1.14:1 ซึ่งเป็นแค่สัญญาณเบา ๆ overlay และ modal ต้องใช้ขอบ `neutral-500` ที่ผ่าน 3:1
- **card ใน grid ตอนพักไม่มีเงา** มีแค่ขอบ — เงาโผล่ตอน hover เท่านั้น ทั้งเร็วกว่าและ hover ชัดกว่า
- **โหมดสว่างใช้เงาคู่กับขอบเสมอ** เพราะเงา 5–10% มองไม่เห็นบนจอที่ใช้กลางแจ้ง ซึ่งเป็นสถานการณ์จริงของ SME ที่ขายของหน้าร้าน
- **สีเงาเป็น `rgb(18 20 26)` ไม่ใช่ดำสนิท** เงาดำบนพื้นโทนเย็น hue 220 จะออกเทาสกปรก
- **เงาสูงสุด 2 ชั้น** ชั้นที่ 3 ขึ้นไปตาแยกไม่ออกแต่จ่ายค่า performance
- **ห้ามเงาสี** ไม่มีเงาน้ำเงินใต้ปุ่มน้ำเงิน

---

## 💻 Developer Notes

- **Component อ้าง `--elevation-*` เท่านั้น** ห้ามอ้าง `--shadow-md` ตรง ๆ — เขียน lint rule ห้าม `shadow-{xs,sm,md,lg,xl,2xl}` ใน component ให้ใช้ `elevation-raised` เป็นต้น
- **โหมดมืดตั้ง `--shadow-*` เป็น opacity 0 ไม่ใช่ `none`** เพื่อให้ transition ทำงานปกติและไม่มี layout shift
- **`box-shadow` โค้งตาม `border-radius` เอง** ไม่ต้องกำหนดแยก
- **Card ใน grid: `box-shadow: none` ตอนพัก** แล้ว transition ไปที่ `shadow-md` ตอน `:hover` และ `:focus-within` — ใช้ `:focus-within` ด้วย ไม่ใช่ `:hover` เดียว เพราะผู้ใช้คีย์บอร์ดต้องเห็นสัญญาณเดียวกัน
- **ห้าม `backdrop-filter`** ทุกกรณีในรายการที่ scroll ได้
- **ห้าม animate `box-shadow` ของหลาย element พร้อมกัน** ถ้าจำเป็นให้ใส่เงาไว้ที่ `::after` แล้ว animate `opacity` แทน — เข้า compositor ได้ ไม่ต้อง repaint
- **Backdrop fade ด้วย `opacity` เท่านั้น** ตามข้อ 17 เรื่อง reduced motion — ห้าม transform ห้าม blur
- **ตรวจโหมดมืดด้วยตาจริงทุก overlay** ถ้าเปิด dropdown แล้วแยกจากพื้นหลังไม่ออก แปลว่าขอบยังไม่ถึง `neutral-500`

---

## Figma Variables

| Collection | Group | ชื่อ | Light | Dark |
|---|---|---|---|---|
| `2. Semantic` | `elevation` | `elevation/flat` | ไม่มี effect | ไม่มี effect |
| `2. Semantic` | `elevation` | `elevation/raised` | shadow-sm | ไม่มี effect |
| `2. Semantic` | `elevation` | `elevation/floating` | shadow-md | ไม่มี effect |
| `2. Semantic` | `elevation` | `elevation/overlay` | shadow-lg | ไม่มี effect |
| `2. Semantic` | `elevation` | `elevation/modal` | shadow-xl | ไม่มี effect |
| `2. Semantic` | `backdrop` | `backdrop/default` | `#12141A` 50% | `#000000` 70% |

**Figma Effect Styles ที่ต้องสร้าง** (โหมดสว่างเท่านั้น)

```
Elevation/Raised     ← shadow-sm  (2 ชั้น)
Elevation/Floating   ← shadow-md  (2 ชั้น)
Elevation/Overlay    ← shadow-lg  (2 ชั้น)
Elevation/Modal      ← shadow-xl  (2 ชั้น)
Elevation/Badge      ← shadow-xs  (1 ชั้น)
```

**คำอธิบายที่ต้องใส่ใน Figma**

| Style / Variable | Description |
|---|---|
| `Elevation/Raised` | `LIGHT MODE ONLY. Dark mode uses surface lightness + border instead — never apply a shadow in dark mode.` |
| `elevation/floating` | `Dark mode border MUST be neutral/500 (3.84:1 on neutral/900). neutral/600 fails at 2.67:1.` |
| `backdrop/default` | `Dark mode value is stronger, but it does NOT create contrast — the base is already dark. Separation comes from the neutral/500 border.` |

**⚠️ Figma ไม่มีวิธีแสดงว่า effect ควรหายไปใน dark mode** — ต้องสร้าง component variant แยกสำหรับโหมดมืดที่ไม่ผูก effect style ไว้

---

## Tailwind v4 Mapping

```css
@theme {
  --shadow-xs:  0 1px 2px 0 rgb(18 20 26 / .05);
  --shadow-sm:  0 1px 2px 0 rgb(18 20 26 / .06), 0 1px 3px 0 rgb(18 20 26 / .10);
  --shadow-md:  0 2px 4px -1px rgb(18 20 26 / .06), 0 4px 8px -2px rgb(18 20 26 / .10);
  --shadow-lg:  0 4px 8px -2px rgb(18 20 26 / .08), 0 12px 20px -4px rgb(18 20 26 / .12);
  --shadow-xl:  0 8px 16px -4px rgb(18 20 26 / .10), 0 20px 32px -8px rgb(18 20 26 / .14);
  --shadow-2xl: 0 16px 32px -8px rgb(18 20 26 / .12), 0 32px 64px -16px rgb(18 20 26 / .18);
}
```

| ต้องการ | ใช้ | ห้ามใช้ |
|---|---|---|
| card | `shadow-(--elevation-raised)` | ~~`shadow-sm`~~ |
| dropdown | `shadow-(--elevation-floating)` | ~~`shadow-md`~~ |
| modal | `shadow-(--elevation-modal)` | ~~`shadow-xl`~~ |

**เหตุผลที่ใช้ `shadow-(--elevation-*)` ไม่ใช่ `shadow-md`** — เพราะ `--elevation-*` เป็นค่าที่เปลี่ยนตาม `[data-theme]` ส่วน `shadow-md` เป็นค่าคงที่ที่จะติดมาในโหมดมืดด้วย

---

## Design Token Example

```css
/* ═══ tier 1 · primitive — สีเงา ═══ */
:root {
  --sme-shadow-color: 18 20 26;   /* = neutral-950, ใช้เป็น rgb() channel */
}

/* ═══ tier 2 · semantic — สเกลเงา (โหมดสว่าง) ═══ */
@theme {
  --shadow-xs:  0 1px 2px 0 rgb(var(--sme-shadow-color) / .05);
  --shadow-sm:  0 1px 2px 0 rgb(var(--sme-shadow-color) / .06),
                0 1px 3px 0 rgb(var(--sme-shadow-color) / .10);
  --shadow-md:  0 2px 4px -1px rgb(var(--sme-shadow-color) / .06),
                0 4px 8px -2px rgb(var(--sme-shadow-color) / .10);
  --shadow-lg:  0 4px 8px -2px rgb(var(--sme-shadow-color) / .08),
                0 12px 20px -4px rgb(var(--sme-shadow-color) / .12);
  --shadow-xl:  0 8px 16px -4px rgb(var(--sme-shadow-color) / .10),
                0 20px 32px -8px rgb(var(--sme-shadow-color) / .14);
  --shadow-2xl: 0 16px 32px -8px rgb(var(--sme-shadow-color) / .12),
                0 32px 64px -16px rgb(var(--sme-shadow-color) / .18);
}

/* ═══ tier 2 · elevation — สิ่งเดียวที่ component อ้างได้ ═══ */
:root {
  --elevation-flat:      none;
  --elevation-raised:    var(--shadow-sm);
  --elevation-floating:  var(--shadow-md);
  --elevation-overlay:   var(--shadow-lg);
  --elevation-modal:     var(--shadow-xl);

  --elevation-surface-raised:   var(--color-surface);
  --elevation-surface-floating: var(--color-surface);
  --elevation-surface-modal:    var(--color-surface);

  --elevation-border-raised:    var(--sme-neutral-200);
  --elevation-border-floating:  var(--sme-neutral-200);
  --elevation-border-overlay:   transparent;   /* เงาแรงพอแล้ว */

  --color-backdrop: rgb(var(--sme-shadow-color) / .50);
}

/* ═══ โหมดมืด — เงาเป็น 0, พื้นผิวและขอบรับหน้าที่ ═══ */
[data-theme="dark"] {
  --elevation-raised:    0 0 0 0 rgb(0 0 0 / 0);
  --elevation-floating:  0 0 0 0 rgb(0 0 0 / 0);
  --elevation-overlay:   0 0 0 0 rgb(0 0 0 / 0);
  --elevation-modal:     0 0 0 0 rgb(0 0 0 / 0);

  --elevation-surface-raised:   var(--sme-neutral-900);   /* 1.14:1 vs canvas */
  --elevation-surface-floating: var(--sme-neutral-850);
  --elevation-surface-modal:    var(--sme-neutral-800);

  /* ⚠️ ขอบคือตัวแยกจริงในโหมดมืด ไม่ใช่พื้นผิว */
  --elevation-border-raised:    var(--sme-neutral-800);   /* ตกแต่ง */
  --elevation-border-floating:  var(--sme-neutral-500);   /* 3.84:1 ✅ */
  --elevation-border-overlay:   var(--sme-neutral-500);   /* 3.84:1 ✅ */

  --color-backdrop: rgb(0 0 0 / .70);
}

/* ═══ card ใน grid — ไม่มีเงาตอนพัก เพื่อ performance ═══ */
.card-grid > * {
  background: var(--elevation-surface-raised);
  border: 1px solid var(--elevation-border-raised);
  box-shadow: none;
  transition: box-shadow var(--transition-duration-fast) var(--ease-standard);
}
.card-grid > *:hover,
.card-grid > *:focus-within {
  box-shadow: var(--elevation-floating);
}

@media (prefers-reduced-motion: reduce) {
  .card-grid > * { transition: none; }
}
```

---

## 🧠 Decision Rationale

### ทำไม component ห้ามอ้างเงาโดยตรง
เพราะเงาเป็นค่าที่ **ถูกต้องในโหมดเดียว** component ที่เขียน `shadow-md` จะได้เงาติดไปในโหมดมืดด้วย ซึ่งมองไม่เห็นแต่ยังจ่ายค่า render และสำคัญกว่านั้นคือ component นั้นจะ **ไม่มีกลไกแยกตัวเองจากพื้นหลังในโหมดมืดเลย** เพราะไม่ได้ตั้งพื้นผิวและขอบไว้ การบังคับให้อ้าง `--elevation-*` ทำให้ทั้งสองโหมดถูกกำหนดพร้อมกันโดยโครงสร้าง ไม่ใช่โดยความจำของนักพัฒนา

### ทำไมต้องแก้ลำดับความสำคัญของโหมดมืด
สถาปัตยกรรมข้อ 9 วางความสว่างพื้นผิวเป็นกลไกหลักและขอบเป็นตัวเสริม **ผลวัดบอกว่ากลับกัน** — ขั้นพื้นผิวห่างกันเพียง 1.14:1 ซึ่งเป็นความต่างที่รู้สึกได้แต่ไม่ถึงเกณฑ์ที่ WCAG ถือว่ามองเห็น (3:1) ถ้าปล่อยให้พื้นผิวรับหน้าที่หลัก dropdown ในโหมดมืดจะแยกจากเนื้อหาข้างหลังไม่ออก ซึ่งไม่ใช่แค่เรื่องสวยงามแต่ทำให้ผู้ใช้ไม่รู้ว่าเมนูเปิดอยู่จริง ๆ

การเพิ่มขั้นพื้นผิวให้ห่างขึ้นก็ไม่ใช่ทางออก เพราะจะทำให้ modal ในโหมดมืดสว่างจนดูเหมือนโหมดสว่าง เสียเหตุผลของการมีโหมดมืดไป — **ขอบจึงต้องรับหน้าที่นี้**

### ทำไม backdrop ช่วยโหมดมืดไม่ได้
เพราะ backdrop ทำงานโดยลดความสว่างของสิ่งที่อยู่ข้างหลัง ในโหมดสว่างพื้นหลังเริ่มที่ `neutral-50` จึงมีที่ให้มืดลงได้มาก ทำให้ modal สีขาวเด่นขึ้นเป็น ~11:1 แต่ในโหมดมืดพื้นหลังเริ่มที่ `neutral-950` ซึ่งมืดเกือบสุดแล้ว การใส่ backdrop จึงแทบไม่เปลี่ยนอะไร — modal vs พื้นหลังเหลือประมาณ 1.7:1

นี่เป็นเหตุผลที่ระบบเก็บ backdrop ไว้ในโหมดมืดด้วย **แต่เปลี่ยนคำอธิบายบทบาท** จาก "สร้าง contrast" เป็น "บอกว่าพื้นหลังกดไม่ได้" — บทบาทที่สองยังทำงานได้จริง

### ทำไม card ใน grid ไม่มีเงาตอนพัก
เกณฑ์อุปกรณ์อ้างอิงในข้อ 01 คือ Android ระดับล่างบนเน็ต 4G ต่างจังหวัด หน้ารายการสินค้าแสดง card 20–60 ใบ เงา 2 ชั้นต่อใบ = blur operation 40–120 ครั้งต่อ repaint ซึ่งเห็นผลจริงตอน scroll บนเครื่องเหล่านั้น

และเมื่อลองแล้วพบว่า **ได้ประโยชน์ด้านการออกแบบด้วย** — การเปลี่ยนจาก "ไม่มีเงา" เป็น "มีเงา" ตอน hover เป็นสัญญาณที่ตาอ่านได้ชัดกว่าการเปลี่ยนจากเงา sm เป็น md มาก เป็นกรณีที่ข้อจำกัดด้าน performance ทำให้ได้ผลลัพธ์ที่ดีกว่า ไม่ใช่การประนีประนอม

### ทำไมสีเงาไม่ใช่ดำ
เงาดำสนิท `rgb(0 0 0)` ที่ opacity ต่ำวางบนพื้นผิวโทนเย็น hue 220 จะได้เทาที่ดูไม่สะอาด เพราะไม่มีความสัมพันธ์ทางสีกับพื้นผิว การใช้ `rgb(18 20 26)` ซึ่งเป็นค่าของ `neutral-950` เอง ทำให้เงาเป็นเหมือน "พื้นผิวเดียวกันแต่มืดลง" ซึ่งเป็นสิ่งที่เงาควรเป็นจริง ๆ ในเชิงกายภาพ

### ทำไมโหมดสว่างต้องมีขอบคู่กับเงา
เพราะกลุ่มผู้ใช้จริงรวมถึงคนที่ใช้มือถือกลางแจ้งขณะขายของหน้าร้าน ในสภาพแสงนั้นเงาที่ opacity 5–10% มองไม่เห็นเลย card จะดูเหมือนลอยไม่มีขอบเขต ขอบ 1px `neutral-200` ให้ขอบเขตที่ยังอยู่ในทุกสภาพแสง โดยไม่ทำให้หน้าดูเป็น wireframe ในสภาพแสงปกติ

---

**ถัดไป:** `07-motion.md` — duration และ easing เป็นภาษาหลัก · สัญญาการใช้ Framer Motion · และ allow/deny list ของ reduced motion ที่ข้อ 17 กำหนดว่าต้องมี
