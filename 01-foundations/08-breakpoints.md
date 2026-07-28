# 08 · Breakpoints & Grid / จุดตัดหน้าจอและกริด

**SME.GO Marketplace** · Foundation Layer · WCAG 2.2 AA

---

## ภาพรวม / Overview

ระบบใช้ **ค่า breakpoint ของ Tailwind ตรง ๆ** ไม่แก้ไข แล้วตั้งชื่อเชิงความหมายทับไว้เพื่อให้เอกสารอ่านง่าย

**เหตุผลที่ไม่ fork ค่าของ Tailwind:** ถ้าเปลี่ยน `md` จาก 768 เป็น 800 ทุก component ของบุคคลที่สาม ทุก Tailwind UI block และความจำของนักพัฒนาทุกคนจะผิดทันที ต้นทุนนี้สูงกว่าประโยชน์ที่ได้จากการปรับค่าให้ตรงสถิติอุปกรณ์

**สองตัวเลขที่ต่างกันและต้องไม่สับสน**

| | ค่า | หมายถึง |
|---|---|---|
| **พื้นออกแบบ** | **360px** | ความกว้างที่ **ออกแบบและทดสอบ** เป็นค่าแรกเสมอ |
| **พื้นข้อกำหนด** | **320px** | ความกว้างที่ **ต้องใช้งานได้** เพื่อผ่าน SC 1.4.10 Reflow |

---

## 1 · Breakpoints

| Token | ค่า | ชื่อเชิงความหมาย | Tailwind | อุปกรณ์จริง |
|---|---|---|---|---|
| — | `< 640px` | **mobile** | (ค่าเริ่มต้น) | Android 360–412px · iPhone SE 375px |
| `bp-sm` | **640px** | **mobile-lg** | `sm:` | มือถือจอใหญ่แนวนอน |
| `bp-md` | **768px** | **tablet** | `md:` | iPad แนวตั้ง 768px |
| `bp-lg` | **1024px** | **laptop** | `lg:` | iPad แนวนอน · โน้ตบุ๊กเล็ก |
| `bp-xl` | **1280px** | **desktop** | `xl:` | โน้ตบุ๊กทั่วไป 1366–1440px |
| `bp-2xl` | **1536px** | **wide** | `2xl:` | จอแยก 1920px+ |

**Mobile-first เท่านั้น** — เขียน CSS สำหรับมือถือก่อนโดยไม่มี media query แล้วเพิ่มด้วย `min-width` ขึ้นไป **ห้ามใช้ `max-width` media query** เพราะจะได้ระบบสองทิศที่ขัดกันเอง

### 1.1 ข้อสังเกตเรื่อง `sm: 640px`

640px ไม่ตรงกับกลุ่มอุปกรณ์จริงกลุ่มไหน — เป็นค่าที่สืบทอดมาจาก Tailwind

**วิธีใช้จริง:** ข้าม `sm:` ในกรณีส่วนใหญ่ ใช้ **mobile → `md:` (768) → `lg:` (1024) → `xl:` (1280)** เป็นหลัก `sm:` เก็บไว้สำหรับกรณีเฉพาะเช่นมือถือแนวนอนหรือ modal ที่ต้องเปลี่ยนจากเต็มจอเป็นกล่องกลาง

---

## 2 · ⚠️ พื้น 360px กับพื้นข้อกำหนด 320px

### 2.1 ทำไมออกแบบที่ 360px ไม่ใช่ 375px

375px คือ iPhone SE/mini ซึ่งเป็น**อุปกรณ์ของนักออกแบบ** ไม่ใช่ของผู้ใช้กลุ่มหลัก Android ระดับราคาประหยัดที่เจ้าของ SME ไทยจำนวนมากใช้มีความกว้าง **360px**

การออกแบบที่ 375px แล้วเจอ 360px จริงทำให้ layout แตกทีละ 15px ทั่วระบบ — ปุ่มล้น ตัวเลขราคาขึ้นบรรทัดใหม่ chip ตัวกรองหลุดแถว ซึ่งเป็นความเสียหายที่กระจายและหาต้นตอยาก

### 2.2 320px คือข้อกำหนด ไม่ใช่ทางเลือก

**SC 1.4.10 Reflow (ระดับ AA)** กำหนดว่าเนื้อหาต้องแสดงได้โดย**ไม่ต้องเลื่อนสองทิศทาง** ที่ความกว้างเทียบเท่า **320 CSS px**

320px เกิดขึ้นจริงในสองสถานการณ์

1. อุปกรณ์เก่ามาก (iPhone SE รุ่นแรก 320px)
2. **การซูม 400% บนจอ 1280px** — ซึ่งพบบ่อยกว่าข้อแรกมาก และเป็นสิ่งที่ผู้ใช้สายตาเลือนใช้จริง

| ความกว้างจอ | ซูม | ความกว้างเทียบเท่า |
|---|---|---|
| 1280px | 100% | 1280px |
| 1280px | 200% | 640px |
| 1280px | **400%** | **320px** |

**กฎ**

| ค่า | ทำอะไรที่ค่านี้ |
|---|---|
| **360px** | ออกแบบ · ทำ mockup · ทดสอบเป็นค่าแรก |
| **320px** | **ต้องไม่มี horizontal scroll · ไม่มีเนื้อหาถูกตัด · ปุ่มยังกดได้ครบ** |

**สิ่งที่มักพังที่ 320px** — ตารางที่มีคอลัมน์ตายตัว · ปุ่มสองอันเรียงแนวนอนที่ไม่ยอมขึ้นบรรทัดใหม่ · ตัวเลขราคาที่ใช้ `white-space: nowrap` · แถบ chip ตัวกรอง · modal ที่ตั้ง `min-width` เป็น px

---

## 3 · Container

| Token | ค่า | ใช้เมื่อไร |
|---|---|---|
| `container-content` | **1280px** | **ค่าเริ่มต้น** — หน้ารายการ หน้ารายละเอียด หน้าโครงการ |
| `container-wide` | **1440px** | เลือกใช้เฉพาะ dashboard และตารางข้อมูลหนาแน่น |
| `container-narrow` | **768px** | หน้าที่เป็นเนื้อหาอ่าน · ฟอร์มขั้นตอนเดียว |
| `container-form` | **560px** | ฟอร์มเข้าสู่ระบบ · ฟอร์มยืนยันตัวตน |

### 3.1 Padding ของ container

| Breakpoint | Padding ซ้าย-ขวา |
|---|---|
| mobile | `space-4` **16px** |
| `md:` tablet | `space-6` **24px** |
| `lg:` laptop+ | `space-8` **32px** |

**ความกว้างเนื้อหาที่ใช้ได้จริง**

| Viewport | Container | Padding | เนื้อหา |
|---|---|---|---|
| 320px | เต็มจอ | 16 × 2 | **288px** |
| 360px | เต็มจอ | 16 × 2 | **328px** |
| 768px | เต็มจอ | 24 × 2 | **720px** |
| 1024px | เต็มจอ | 32 × 2 | **960px** |
| 1280px+ | 1280px | 32 × 2 | **1216px** |

---

## 4 · Grid

| Breakpoint | คอลัมน์ | Gutter |
|---|---|---|
| mobile | **4** | `space-4` 16px |
| `md:` tablet | **8** | `space-6` 24px |
| `lg:` laptop+ | **12** | `space-6` 24px |

**คอลัมน์ 4/8/12 หารกันลงตัว** — element ที่กิน 2/4 บนมือถือ กิน 4/8 บนแท็บเล็ต และ 6/12 บนเดสก์ท็อป ได้ครึ่งความกว้างเท่ากันทุกขนาด ไม่ต้องคิดใหม่

### 4.1 กริดสินค้าใน marketplace

| Viewport | ไม่มีแถบตัวกรอง | มีแถบตัวกรอง (280px) |
|---|---|---|
| 320px | **2** ใบ | 2 (ตัวกรองเป็น drawer) |
| 360px | **2** ใบ | 2 (ตัวกรองเป็น drawer) |
| 768px | **3** ใบ | 2 (ตัวกรองเป็น drawer) |
| 1024px | **4** ใบ | **3** ใบ |
| 1280px | **5** ใบ | **4** ใบ |
| 1536px | **5** ใบ | **4** ใบ |

**ความกว้าง card ที่ได้**

| Viewport | สูตร | ความกว้าง card |
|---|---|---|
| 320px | (288 − 16) / 2 | **136px** |
| 360px | (328 − 16) / 2 | **156px** |
| 768px | (720 − 48) / 3 | **224px** |
| 1024px | (960 − 280 − 24 − 48) / 3 | **202px** |
| 1280px | (1216 − 280 − 24 − 72) / 4 | **210px** |

**136px คือความกว้างที่แคบที่สุดที่ card สินค้าต้องรองรับ** — ต้องทดสอบว่าราคา ชื่อสินค้า และ badge ยังแสดงได้ที่ความกว้างนี้

**แถบตัวกรองเป็น drawer จนถึง `lg:` (1024px)** เพราะที่ 768px การหั่น 720px ออกเป็นตัวกรอง 280 + เนื้อหา 416 ทำให้ card เหลือ 196px ต่อ 2 ใบ ซึ่งแคบกว่าตอนไม่มีตัวกรองที่ 3 ใบ 224px — ไม่ได้ประโยชน์

---

## 5 · Header ค้าง กับ SC 2.4.11

ข้อ 15 ของสถาปัตยกรรมกำหนดให้ทุก focusable element มี `scroll-margin-top` เท่ากับความสูง header ที่ค้างอยู่ เพื่อผ่าน **SC 2.4.11 Focus Not Obscured (ระดับ AA)**

| Breakpoint | `--header-height` |
|---|---|
| mobile | **56px** |
| `md:` tablet+ | **64px** |

```css
:root { --header-height: 3.5rem; }                        /* 56px */
@media (min-width: 768px) { :root { --header-height: 4rem; } }  /* 64px */

:where(a, button, input, select, textarea, [tabindex]) {
  scroll-margin-top: calc(var(--header-height) + var(--spacing) * 2);
}
```

### 5.1 ⚠️ แถบนำทางล่างบนมือถือก็ทำให้ focus ถูกทับ

SC 2.4.11 ไม่ได้จำกัดแค่การถูกทับจากด้านบน ถ้ามีแถบนำทางค้างที่ด้านล่างบนมือถือ element ที่ focus ใกล้ปลายหน้าจะถูกทับจากด้านล่าง

```css
:root {
  /* แต่ละแถบประกาศความสูงตัวเอง — ค่าเริ่มต้น 0px ให้ calc() คำนวณได้เสมอ */
  --bottom-nav-height:  0px;
  --compare-bar-height: 0px;
  --action-bar-height:  0px;

  /* อ่านที่เดียว เขียนไม่ได้ — รวมทุกแถบที่ยึดก้นจอ */
  --bottom-inset: calc(
    var(--bottom-nav-height) + var(--compare-bar-height) + var(--action-bar-height)
  );
}

:where(a, button, input, select, textarea, [tabindex]) {
  scroll-margin-bottom: calc(var(--bottom-inset) + var(--spacing) * 2);
}

/* ★ scroll-margin ไม่พอ — element ท้ายเอกสารไม่มีที่ให้เลื่อน จึงต้องจองจริง */
body { padding-bottom: var(--bottom-inset); }
```

### 5.2 Safe area บน iOS

แถบนำทางล่างต้องเผื่อพื้นที่ home indicator ไม่เช่นนั้นปุ่มจะถูกทับ

```css
.bottom-nav {
  padding-bottom: calc(var(--spacing) * 2 + env(safe-area-inset-bottom, 0px));
}
```

---

## 6 · Container query อยู่ที่ชั้น component ไม่ใช่ชั้นนี้

Breakpoint ในเอกสารนี้ตอบเรื่อง **layout ระดับหน้า** — จำนวนคอลัมน์ ความกว้าง container ระยะ section

แต่ card สินค้าใบเดียวปรากฏใน 3 บริบทที่กว้างต่างกัน

| บริบท | ความกว้างที่ card ได้ |
|---|---|
| กริดเต็มความกว้าง (เดสก์ท็อป) | ~210px |
| แถบข้าง "สินค้าที่เกี่ยวข้อง" | ~250px |
| modal เปรียบเทียบ | ~180px |

**Viewport breakpoint แก้เรื่องนี้ไม่ได้** เพราะ viewport เป็น 1280px ทั้งสามกรณี — ต้องใช้ container query

```css
.product-card { container-type: inline-size; }

@container (min-width: 200px) { .product-card__meta { display: block; } }
@container (max-width: 199px) { .product-card__meta { display: none; } }
```

**ชั้นนี้กำหนดแค่กฎ: component ที่ใช้ซ้ำในหลายบริบทต้องตอบสนองต่อ container ไม่ใช่ viewport** — รายละเอียดของแต่ละ component อยู่ในชั้น 03

---

## 7 · ผลกระทบจากความยาวข้อความไทยที่ 360px

เนื้อหาที่ใช้ได้ที่ 360px คือ **328px** และข้อความไทยยาวกว่าอังกฤษ 20–40% ตามที่วัดไว้ในข้อ 05

| กรณี | ปัญหา | ทางแก้ |
|---|---|---|
| ปุ่มสองอันเรียงแนวนอน | "ยกเลิก" + "ยื่นคำขอสินเชื่อ" ล้น 328px | ซ้อนแนวตั้งบนมือถือ ปุ่มหลักอยู่บน |
| แถบ chip ตัวกรอง | chip ไทยกว้างกว่า หลุดแถว | เลื่อนแนวนอนได้ พร้อม `scroll-snap` |
| หัวคอลัมน์ตาราง | "วันที่อัปเดตล่าสุด" ยาวกว่า "Updated" | บนมือถือเปลี่ยนตารางเป็น card ต่อแถว |
| ราคา + หน่วย | "1,250,000 บาท" ขึ้นบรรทัดใหม่กลางเลข | `white-space: nowrap` เฉพาะกลุ่มเลข+หน่วย ไม่ใช่ทั้งบรรทัด |
| Label ในฟอร์ม | "เลขทะเบียนนิติบุคคล 13 หลัก" ยาวเกิน | label อยู่เหนือ input เสมอ ห้ามวางข้าง |

**Label ต้องอยู่เหนือ input เสมอในทุก breakpoint** — ไม่ใช่แค่บนมือถือ เพราะ label ไทยยาวและการวางข้างจะบีบ input ให้แคบลงอย่างคาดเดาไม่ได้

---

## 🎨 Designer Notes

- **เริ่มที่ 360px ทุกครั้ง** ไม่ใช่ 375px — และตรวจว่าใช้งานได้ที่ **320px** ด้วย เพราะเป็นข้อกำหนดของ SC 1.4.10 ไม่ใช่ทางเลือก
- **card สินค้าต้องทำงานที่ 136px** เป็นความกว้างที่แคบสุดที่ระบบสร้างได้ (2 ใบที่ 320px)
- **ข้าม `sm:` 640px ในกรณีส่วนใหญ่** ใช้ mobile → 768 → 1024 → 1280 เป็นหลัก
- **ตัวกรองเป็น drawer จนถึง 1024px** ที่ 768px การมีแถบตัวกรองทำให้ card แคบกว่าตอนไม่มี — ไม่ได้ประโยชน์
- **ปุ่มบนมือถือซ้อนแนวตั้ง** ปุ่มไทยสองอันเรียงแนวนอนล้น 328px แน่นอน
- **label อยู่เหนือ input เสมอทุกขนาดจอ** ไม่ใช่แค่มือถือ
- **เผื่อ safe area ด้านล่างบน iOS** แถบนำทางล่างที่ไม่เผื่อจะถูก home indicator ทับ
- **ทดสอบด้วยข้อความไทยที่ยาวจริง** ไม่ใช่ "Product Name"

---

## 💻 Developer Notes

- **Mobile-first เท่านั้น** ห้าม `max-width` media query — ระบบสองทิศจะขัดกันเองและ debug ยาก
- **ทดสอบที่ 320px ทุก PR** เป็นเกณฑ์ผ่าน/ไม่ผ่านของ SC 1.4.10 ไม่ใช่ nice-to-have — ตั้ง viewport 320px ใน visual regression test
- **`--header-height` และ `--bottom-inset` ต้องเป็น token** เพราะ `scroll-margin-top`/`-bottom` ของทุก focusable อ้างค่านี้เพื่อผ่าน SC 2.4.11 — ถ้า hardcode แล้วความสูงเปลี่ยน จะไม่ผ่านโดยไม่มีใครรู้ · `--bottom-inset` เป็นผลรวมของทุกแถบ ไม่ใช่แถบเดียว
- **`env(safe-area-inset-bottom)`** สำหรับแถบนำทางล่าง และต้องมี `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- **ห้าม `min-width` เป็น px บน modal และ dialog** ใช้ `min(90vw, 560px)` เพื่อไม่ให้พังที่ 320px
- **`white-space: nowrap` ใช้เฉพาะกลุ่มเลข+หน่วย** ไม่ใช่ทั้งบรรทัด — ห่อด้วย `<span class="whitespace-nowrap">1,250,000 บาท</span>`
- **ตารางบนมือถือเปลี่ยนเป็น card ต่อแถว** ห้ามให้เลื่อนแนวนอน เพราะเป็นการเลื่อนสองทิศทางซึ่งไม่ผ่าน SC 1.4.10
- **Component ที่ใช้ซ้ำหลายบริบทต้องใช้ container query** ไม่ใช่ viewport breakpoint
- **ห้ามซ่อนเนื้อหาด้วย `display: none` ตาม breakpoint แล้วไม่มีทางเข้าถึงอีก** เนื้อหาที่ซ่อนบนมือถือต้องมีทางเข้าถึงเสมอ (SC 1.4.10)

---

## Figma Variables

| Collection | Group | ชื่อ | ค่า |
|---|---|---|---|
| `4. Scale` | `breakpoint` | `breakpoint/sm` | `640` |
| `4. Scale` | `breakpoint` | `breakpoint/md` | `768` |
| `4. Scale` | `breakpoint` | `breakpoint/lg` | `1024` |
| `4. Scale` | `breakpoint` | `breakpoint/xl` | `1280` |
| `4. Scale` | `breakpoint` | `breakpoint/2xl` | `1536` |
| `4. Scale` | `container` | `container/content` | `1280` |
| `4. Scale` | `container` | `container/wide` | `1440` |
| `4. Scale` | `container` | `container/narrow` | `768` |
| `4. Scale` | `container` | `container/form` | `560` |
| `4. Scale` | `layout` | `header/height` | `56` (mobile) · `64` (tablet+) |
| `4. Scale` | `layout` | `bottomNav/height` | `56` |

**Figma frame ที่ต้องมีสำหรับทุกหน้า**

```
320  × auto   ← ข้อกำหนด SC 1.4.10 · ต้องมีทุกหน้า
360  × 800    ← พื้นออกแบบ · เริ่มที่นี่
768  × 1024   ← tablet
1280 × 900    ← desktop
1440 × 900    ← wide (เฉพาะ dashboard)
```

**Figma layout grid**

| Frame | Columns | Gutter | Margin |
|---|---|---|---|
| 320 · 360 | 4 | 16 | 16 |
| 768 | 8 | 24 | 24 |
| 1280 · 1440 | 12 | 24 | 32 |

**คำอธิบายที่ต้องใส่ใน Figma**

| Variable | Description |
|---|---|
| `breakpoint/sm` | `640px — inherited from Tailwind, matches no real device class. Skip it in most designs; go mobile → md → lg → xl.` |
| `container/content` | `Default 1280px. Use container/wide 1440 only for dashboards and dense data tables.` |
| `header/height` | `Load-bearing for SC 2.4.11 — every focusable element's scroll-margin-top references this. Changing it changes conformance.` |

**⚠️ frame 320px ต้องมีทุกหน้า** ไม่ใช่ทางเลือก — เป็นความกว้างที่ SC 1.4.10 กำหนด และเกิดขึ้นจริงเมื่อผู้ใช้ซูม 400% บนจอ 1280px

---

## Tailwind v4 Mapping

```css
@theme {
  --breakpoint-sm:  40rem;    /*  640px */
  --breakpoint-md:  48rem;    /*  768px */
  --breakpoint-lg:  64rem;    /* 1024px */
  --breakpoint-xl:  80rem;    /* 1280px */
  --breakpoint-2xl: 96rem;    /* 1536px */

  --container-form:    35rem;  /*  560px */
  --container-narrow:  48rem;  /*  768px */
  --container-content: 80rem;  /* 1280px */
  --container-wide:    90rem;  /* 1440px */
}
```

**ค่าเป็น `rem` โดยตั้งใจ** — breakpoint ที่เป็น `rem` จะขยายตามการตั้งค่าขนาดตัวอักษรของผู้ใช้ ซึ่งช่วยผู้ใช้สายตาเลือนที่ตั้งฟอนต์ระบบใหญ่ขึ้น

| ต้องการ | Utility |
|---|---|
| container มาตรฐาน | `mx-auto max-w-(--container-content) px-4 md:px-6 lg:px-8` |
| กริดสินค้า | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6` |
| กริดสินค้า (มีตัวกรอง) | `grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6` |
| ปุ่มซ้อนบนมือถือ | `flex flex-col-reverse md:flex-row md:justify-end gap-3` |
| ตัวกรอง drawer → sidebar | `hidden lg:block lg:w-70` |

**`flex-col-reverse` บนมือถือ** เพื่อให้ปุ่มหลักอยู่**ด้านบน**เมื่อซ้อนแนวตั้ง แต่อยู่**ด้านขวา**เมื่อเรียงแนวนอน — ตรงกับความคาดหวังของผู้ใช้ในทั้งสองกรณี

---

## Design Token Example

```css
/* ═══ tier 1 · primitive ═══ */
:root {
  --sme-bp-640:  40rem;
  --sme-bp-768:  48rem;
  --sme-bp-1024: 64rem;
  --sme-bp-1280: 80rem;
  --sme-bp-1536: 96rem;
}

/* ═══ tier 2 · semantic ═══ */
@theme {
  --breakpoint-sm:  var(--sme-bp-640);
  --breakpoint-md:  var(--sme-bp-768);
  --breakpoint-lg:  var(--sme-bp-1024);
  --breakpoint-xl:  var(--sme-bp-1280);
  --breakpoint-2xl: var(--sme-bp-1536);

  --container-content: var(--sme-bp-1280);
  --container-narrow:  var(--sme-bp-768);
  --container-wide:    90rem;
  --container-form:    35rem;
}

/* ═══ tier 2 · layout ที่ SC 2.4.11 พึ่งพา ═══ */
:root {
  --header-height:     3.5rem;   /* 56px */
  --bottom-nav-height: 0px;      /* BottomNav ประกาศเองตอน runtime */
  --sidebar-width:     17.5rem;  /* 280px */
}
@media (min-width: 48rem) {
  :root { --header-height: 4rem; }   /* 64px */
}

/* ═══ SC 2.4.11 — focus ต้องไม่ถูกทับทั้งบนและล่าง ═══ */
:where(a, button, input, select, textarea, summary, [tabindex]) {
  scroll-margin-top:    calc(var(--header-height) + var(--spacing) * 2);
  scroll-margin-bottom: calc(var(--bottom-inset) + var(--spacing) * 2);
}

/* ═══ safe area บน iOS ═══ */
.bottom-nav {
  padding-bottom: calc(var(--spacing) * 2 + env(safe-area-inset-bottom, 0px));
}

/* ═══ modal ต้องไม่พังที่ 320px ═══ */
.modal { width: min(90vw, var(--container-form)); }
```

---

## 🧠 Decision Rationale

### ทำไมไม่ปรับ breakpoint ให้ตรงสถิติอุปกรณ์ไทย
มีเหตุผลจริงที่จะปรับ — คลัสเตอร์โน้ตบุ๊ก 1366px ถูก `xl: 1280` คร่อมอย่างไม่ลงตัว และ 640px ไม่ตรงกับอุปกรณ์กลุ่มไหน

แต่การ fork ค่าของ Tailwind ทำให้ component ของบุคคลที่สามทุกตัว ทุก Tailwind UI block และความจำของนักพัฒนาทุกคนผิดพร้อมกัน และตอนนี้ยังไม่มีข้อมูล traffic จริงมาสนับสนุนว่าค่าใหม่ควรเป็นเท่าไร — การปรับโดยเดาแล้วผิดแพงกว่าการใช้ค่ามาตรฐานที่คนคุ้น

ทางออกคือ **ตั้งชื่อเชิงความหมายทับ** เพื่อให้เอกสารอ่านรู้เรื่อง โดยไม่แตะค่าที่ระบบนิเวศพึ่งพา

### ทำไมต้องแยก "พื้นออกแบบ 360" กับ "พื้นข้อกำหนด 320"
เพราะเป็นสองเรื่องที่คนละวัตถุประสงค์และมักถูกรวมกันจนพลาด

360px คือความกว้างที่ **ผู้ใช้กลุ่มหลักใช้จริง** จึงเป็นที่ที่การออกแบบควรเริ่มและถูกตัดสินว่าดีหรือไม่

320px คือความกว้างที่ **SC 1.4.10 บังคับ** ซึ่งเกิดจากการซูม 400% บนจอ 1280px — เป็นสิ่งที่ผู้ใช้สายตาเลือนใช้จริงและพบบ่อยกว่าอุปกรณ์ 320px เสียด้วย ที่ความกว้างนี้ไม่ต้องสวย แต่**ต้องใช้งานได้ครบและไม่มีการเลื่อนสองทิศทาง**

ถ้ามีตัวเลขเดียว จะเกิดหนึ่งในสองอย่าง — ออกแบบที่ 320 แล้วเสียคุณภาพให้ผู้ใช้ 95% หรือรองรับแค่ 360 แล้วไม่ผ่าน AA

### ทำไมตัวกรองเป็น drawer จนถึง 1024px ไม่ใช่ 768px
คำนวณจริงแล้วพบว่าที่ 768px การหั่นพื้นที่ 720px ออกเป็นตัวกรอง 280px + เนื้อหา 416px ทำให้ card เหลือ 196px ต่อ 2 ใบ ซึ่ง**แคบกว่า**ตอนไม่มีตัวกรองที่ได้ 3 ใบ 224px

แปลว่าการแสดงตัวกรองที่ 768px ทำให้ผู้ใช้เห็นสินค้าน้อยลง**และ**แต่ละใบเล็กลง — เสียทั้งสองทาง เกณฑ์ตัดสินจึงเป็นตัวเลข ไม่ใช่ความรู้สึกว่า "แท็บเล็ตน่าจะมีที่พอ"

### ทำไม breakpoint เป็น `rem` ไม่ใช่ `px`
เพราะ breakpoint ที่เป็น `rem` จะขยายตามการตั้งค่าขนาดตัวอักษรของ browser ผู้ใช้ที่ตั้งฟอนต์ระบบใหญ่ขึ้น (ซึ่งเป็นสิ่งที่ผู้ใช้สายตาเลือนทำ และเป็นกลุ่มที่มีอยู่จริงในผู้ใช้ SME อายุ 40–60) จะได้ layout แบบมือถือบนหน้าจอที่กว้างขึ้น ซึ่งเป็นพฤติกรรมที่ถูก — เนื้อหาต่อบรรทัดน้อยลงตามที่ควรเป็น ถ้าใช้ `px` layout จะยังบีบเนื้อหาลง grid 12 คอลัมน์ทั้งที่ตัวอักษรใหญ่ขึ้น

### ทำไม `--header-height` ต้องเป็น token ไม่ใช่ค่าใน component
เพราะ `scroll-margin-top` ของ **ทุก focusable element ในระบบ** อ้างค่านี้เพื่อผ่าน SC 2.4.11 ถ้าใครแก้ความสูง header ใน component โดยไม่แก้ token ระบบจะไม่ผ่าน SC 2.4.11 ทันทีทั้งระบบ และเป็นความล้มเหลวที่**มองไม่เห็นด้วยตา** — ต้องทดสอบด้วยการกด Tab แล้วสังเกตว่า element ที่ focus ถูก header ทับหรือไม่ ซึ่งไม่ใช่สิ่งที่ใครทำทุกครั้ง การผูกไว้ที่ token เดียวทำให้ความสัมพันธ์นี้ชัดเจนและแก้ที่เดียว

### ทำไมแถบนำทางล่างก็ต้องมี `scroll-margin-bottom`
เพราะตัวบทของ SC 2.4.11 พูดถึงการที่ element ที่ได้รับ focus **ถูกบดบัง** โดยเนื้อหาอื่น ไม่ได้ระบุทิศทาง แถบนำทางค้างที่ด้านล่างบนมือถือทับ element ที่ focus ใกล้ปลายหน้าได้เหมือนกับที่ header ทับด้านบน

ข้อนี้ถูกมองข้ามบ่อยกว่าเรื่อง header มาก เพราะการทดสอบด้วย Tab มักเริ่มจากด้านบนของหน้าและหยุดก่อนถึงปลาย

---

**ถัดไป:** `09-iconography.md` — ตาราง Lucide ขนาด/stroke ที่ผูกกัน · สเปกของ Icon wrapper · และสัญญาการวาดไอคอนโดเมนไทย (ThaID · PromptPay · e-Tax · DBD)
