# 05 · Radius / ระบบความโค้งมุม

**SME.GO Marketplace** · Foundation Layer · WCAG 2.2 AA

---

## ภาพรวม / Overview

Radius เป็น **หน้าปัดบุคลิกที่ผู้ใช้อ่านได้เร็วที่สุด** — เร็วกว่าสี เร็วกว่าตัวอักษร

โจทย์ของ SME.GO คือต้องอยู่ระหว่างสองขั้ว: มุมคมเกินไปทำให้แพลตฟอร์มรัฐดูเป็นระบบราชการที่น่ากลัวสำหรับเจ้าของกิจการที่เพิ่งเริ่มใช้ระบบดิจิทัล มุมโค้งเกินไปทำให้เสียน้ำหนักที่ทำให้คนกล้าอัปโหลดงบการเงินและยื่นขอสินเชื่อ

ระบบเลือก **ระดับกลาง** — ตรงกับหน้าปัดบุคลิกในข้อ 01: Modern 7/10 · Friendly 6/10 · Playful 2/10

---

## 1 · สเกล / The Scale

| Token | px | rem | Tailwind | ใช้กับอะไร |
|---|---|---|---|---|
| `radius-none` | **0** | 0 | `rounded-none` | ตาราง · เส้นคั่น · element ที่ชนขอบจอ |
| `radius-xs` | **4** | 0.25 | `rounded-xs` | element ซ้อนใน card · แถบ progress · swatch สี |
| `radius-sm` | **6** | 0.375 | `rounded-sm` | checkbox · tag · tooltip · inline code |
| **`radius-md`** | **8** | 0.5 | `rounded-md` | **ปุ่ม · input · select · textarea · dropdown item** |
| `radius-lg` | **12** | 0.75 | `rounded-lg` | **card · panel · alert · banner** |
| `radius-xl` | **16** | 1 | `rounded-xl` | **modal · drawer · bottom sheet · popover** |
| `radius-2xl` | **24** | 1.5 | `rounded-2xl` | hero · card โปรโมชัน · section ที่มีพื้นสี |
| `radius-full` | **9999** | — | `rounded-full` | **chip · badge · avatar · dot เท่านั้น** |

### 1.1 การกำหนดให้ component

| Component | Radius | เหตุผล |
|---|---|---|
| Button (ทุกขนาด) | `md` 8 | ดูข้อ 4 เรื่องทำไมไม่ใช้ `full` |
| Input · Selector · TextArea | `md` 8 | ตรงกับปุ่ม เพื่อให้ฟอร์มดูเป็นชุดเดียว |
| CheckboxInput | `sm` 6 | เล็กกว่า input เพราะกล่องเล็กกว่า — ดูข้อ 3 |
| Radio | `full` | วงกลม เป็นข้อยกเว้นตามหลักสากล |
| Card สินค้า/บริการ | `lg` 12 | |
| Banner · Info tint | `lg` 12 | เดิมเขียน ~~Alert~~ · Banner คู่กัน — หลัง rename เป็นตัวเดียวกัน |
| Modal · Dialog | `xl` 16 | |
| Bottom sheet (มือถือ) | `xl` 16 **มุมบนเท่านั้น** | มุมล่างชนขอบจอ ต้องเป็น 0 |
| Drawer ด้านข้าง | `xl` 16 **ด้านที่ไม่ชนขอบ** | |
| Dropdown · Popover · Menu | `xl` 16 | |
| รายการใน dropdown | `md` 8 | |
| Token ตัวกรอง · Tag สถานะ | `full` | ข้อความสั้นเสมอ ไม่มีปัญหาความยาว |
| Badge · Dot แจ้งเตือน | `full` | |
| Avatar | `full` | |
| Logo ธุรกิจใน card | `md` 8 | ไม่ใช้ `full` เพราะโลโก้ SME มักเป็นสี่เหลี่ยม |
| Table (ตัว container) | `lg` 12 | |
| Table cell | `none` | ดูข้อ 6 |
| Thumbnail สินค้าใน card | ดูข้อ 5 | |
| Tooltip | `sm` 6 | |
| Progress bar · Slider track | `full` | |
| Skeleton loader | ตรงกับ element จริง | |

---

## 2 · กฎ Radius ซ้อน / Nested radius

เมื่อวาง element ที่มีมุมโค้งไว้ในอีกอันที่มีมุมโค้ง มุมทั้งสองต้อง **ศูนย์กลางร่วม (concentric)** ไม่เช่นนั้นจะเห็นช่องว่างรูปเสี้ยวที่มุม

**สูตร:** `radius ชั้นใน = radius ชั้นนอก − padding`

### 2.1 ตารางค่าที่ใช้ได้จริง

**ผลตรวจ: ทุกคู่ที่คำนวณได้ตกลงบนขั้นจริงของ scale พอดี** — ไม่มีคู่ไหนที่ต้องใช้ค่านอก scale

| Radius นอก | Padding | Radius ใน | ตรงกับ token |
|---|---|---|---|
| `2xl` 24 | `space-2` 8 | 16 | `xl` ✅ |
| `2xl` 24 | `space-3` 12 | 12 | `lg` ✅ |
| `2xl` 24 | `space-4` 16 | 8 | `md` ✅ |
| `xl` 16 | `space-1` 4 | 12 | `lg` ✅ |
| `xl` 16 | `space-2` 8 | 8 | `md` ✅ |
| `xl` 16 | `space-3` 12 | 4 | `xs` ✅ |
| `lg` 12 | `space-1` 4 | 8 | `md` ✅ |
| `lg` 12 | `space-2` 8 | 4 | `xs` ✅ |
| `md` 8 | `space-1` 4 | 4 | `xs` ✅ |

### 2.2 เมื่อไรไม่ต้องคำนวณ

ถ้า **padding ≥ radius ชั้นนอก** มุมชั้นในไม่ได้อยู่ใกล้มุมชั้นนอกพอที่จะเห็นความคลาด — เลือก radius ชั้นในได้อิสระตามบทบาทของ element

**ตัวอย่าง:** card `lg` 12 ที่มี padding `space-4` 16 → 16 ≥ 12 → input ข้างในใช้ `md` 8 ได้ตามปกติ ไม่ต้องเป็น 0

**นี่คือกรณีที่พบบ่อยที่สุด** เพราะ padding มาตรฐานของ card คือ 16px (มือถือ) และ 24px (เดสก์ท็อป) ซึ่งใหญ่กว่า radius 12 ทั้งคู่ — กฎ concentric จึงมีผลเฉพาะกับ element ที่แนบขอบ เช่น รูปภาพเต็มความกว้างใน card

### 2.3 `radius-sm` 6 ไม่เข้าสูตร concentric

6 − 4 = 2 ซึ่งไม่มีใน scale (2 เป็นข้อยกเว้นที่ใช้ได้แค่ focus ring ตามข้อ 04)

**`sm` จึงเป็นค่าสำหรับ element ที่ยืนเดี่ยว** — checkbox, tag, tooltip, inline code ห้ามใช้เป็นชั้นนอกของ element ที่มีอะไรซ้อนอยู่แนบขอบ

---

## 3 · กฎเพดาน: radius ต้องไม่เกินครึ่งของด้านที่สั้นที่สุด

ถ้า radius เกินครึ่งของด้านสั้น มุมจะกลายเป็นครึ่งวงกลมและ element จะกลายเป็นแคปซูลโดยไม่ได้ตั้งใจ

| Element | ขนาด | radius สูงสุดที่ใช้ได้ | ที่กำหนด |
|---|---|---|---|
| CheckboxInput | 24×24 | 12 | `sm` 6 ✅ |
| ปุ่มไอคอน (ไอคอน 16 + `space-1`) | 24×24 | 12 | `md` 8 ✅ |
| ปุ่มมาตรฐาน | สูง 36 | 18 | `md` 8 ✅ |
| Input | สูง 44 | 22 | `md` 8 ✅ |
| แถบ progress | สูง 8 | 4 | `full` → ได้ 4 จริง ✅ |

**`rounded-full` บน element ที่เตี้ยจะกลายเป็น radius = ครึ่งความสูงโดยอัตโนมัติ** ซึ่งเป็นพฤติกรรมที่ต้องการสำหรับ progress bar และ chip — ไม่ใช่ bug

---

## 4 · ⚠️ ทำไมปุ่มเป็น `md` 8 ไม่ใช่ `full`

ปุ่มแคปซูลดูสมัยใหม่และทำให้ SME.GO ต่างจากเว็บราชการอื่นชัดเจน แต่มีปัญหาที่วัดได้กับภาษาไทย

### 4.1 ข้อความไทยยาวกว่าอังกฤษ 20–40%

| อังกฤษ | ไทย | ต่างกัน |
|---|---|---|
| Apply | ยื่นคำขอ | +60% |
| Apply for funding | ยื่นคำขอสินเชื่อ | +6% |
| Contact supplier | ติดต่อผู้ผลิต | −12% |
| Compare | เปรียบเทียบ | +33% |
| Download document | ดาวน์โหลดเอกสาร | +6% |
| Register your business | ลงทะเบียนธุรกิจของคุณ | +5% |

ปุ่มแคปซูลต้องมี padding แนวนอนมากกว่าปุ่มมุมโค้งปกติเพื่อให้ข้อความไม่ชิดส่วนโค้ง — เมื่อบวกกับข้อความไทยที่ยาวกว่า ปุ่มจะกว้างเกินพื้นที่บนหน้าจอ 360px

### 4.2 ปุ่มเต็มความกว้างบนมือถือ

CTA บนมือถือมักเป็น `width: 100%` — ปุ่มแคปซูลกว้าง 328px สูง 44px จะมีส่วนโค้ง 22px ที่ปลายทั้งสองข้าง ทำให้ดูเหมือนแถบยากับปุ่ม และเสียความรู้สึกเป็นทางการที่แพลตฟอร์มรัฐต้องการ

### 4.3 การจัดแนวกับ input

ปุ่มแคปซูล 44px วางข้าง input มุม 8px ในแถบค้นหาจะจัดแนวสายตาไม่ลงตัว ต้องแก้เป็นราย ๆ ไป

**สรุป:** `full` ถูกจำกัดให้ใช้เฉพาะ element ที่ **ข้อความสั้นเสมอ และความกว้างไม่คงที่ไม่ใช่ปัญหา** — chip, badge, tag, avatar, dot

---

## 5 · Radius กับ `overflow: hidden` — ความขัดแย้งที่ต้องแก้ตั้งแต่ต้น

นี่คือจุดที่ radius ชนกับ focus ring ในข้อ 15 ของสถาปัตยกรรม

### 5.1 ปัญหา

Card สินค้าที่มีรูปเต็มความกว้างต้องใช้ `overflow: hidden` เพื่อให้รูปถูกตัดตามมุมโค้งของ card

แต่ focus ring ในข้อ 15 คือ `outline: 2px` + `outline-offset: 2px` = ล้นออกนอกขอบ **4px** — ถ้า card มี `overflow: hidden` แล้วมี element ที่ focus ได้อยู่ข้างใน **วงแหวน focus จะถูกตัดหาย** ซึ่งเป็นการไม่ผ่าน SC 2.4.7 (Focus Visible) จริง

### 5.2 กฎที่ต้องใช้

> **`overflow: hidden` ห้ามอยู่บน element ที่มี focusable descendant** — ให้ใส่บนตัวห่อรูปภาพเท่านั้น

**ผิด**

```html
<article class="rounded-lg overflow-hidden bg-surface">
  <img src="product.jpg">
  <div class="p-4">
    <a href="#">ชื่อสินค้า</a>   <!-- focus ring ถูกตัด ❌ -->
  </div>
</article>
```

**ถูก**

```html
<article class="rounded-lg bg-surface">
  <div class="rounded-t-lg overflow-hidden">   <!-- ตัดเฉพาะรูป -->
    <img src="product.jpg">
  </div>
  <div class="p-4">
    <a href="#">ชื่อสินค้า</a>   <!-- focus ring ครบ ✅ -->
  </div>
</article>
```

### 5.3 ทางเลือกที่ดีกว่าในหลายกรณี

ใส่ radius ที่ **ตัวรูปเอง** แทนการตัดด้วย container — ไม่ต้องใช้ `overflow` เลย

```html
<article class="rounded-lg bg-surface p-2">
  <img src="product.jpg" class="rounded-md w-full">   <!-- 12 − 8 = 8 = md ✅ -->
  <div class="pt-2">…</div>
</article>
```

วิธีนี้ได้ concentric radius ที่ถูกต้องตามข้อ 2 ด้วย และไม่มี stacking context เพิ่มขึ้นมา

### 5.4 `outline` โค้งตาม radius โดยอัตโนมัติ

Browser ปัจจุบันทำให้ `outline` ตามความโค้งของ `border-radius` เอง ไม่ต้องกำหนด radius ของ outline แยก — เป็นเหตุผลอีกข้อที่ระบบใช้ `outline` ไม่ใช่ `box-shadow` เป็นวงแหวนชั้นนอก

---

## 6 · Radius ในตาราง

**Table cell ต้องเป็น `none`** — cell ที่มีมุมโค้งจะทำให้เส้นตารางขาดและอ่านแถวยาก

radius ใส่ที่ **container ของตาราง** เท่านั้น

```html
<div class="rounded-lg border border-edge-subtle overflow-hidden">
  <table class="w-full">…</table>
</div>
```

**⚠️ `overflow: hidden` ที่นี่ขัดกับกฎข้อ 5** ถ้าตารางมีปุ่มจัดการในแถว (ซึ่งมีเกือบทุกครั้งใน marketplace) focus ring ของปุ่มจะถูกตัดที่ขอบตาราง

**ทางแก้ที่ต้องใช้** — ไม่ใช้ `overflow: hidden` แล้วใส่ radius ที่ cell แรกและ cell สุดท้ายของแถวแรกและแถวสุดท้ายแทน

```css
table :where(thead tr:first-child) > :first-child { border-start-start-radius: var(--radius-lg); }
table :where(thead tr:first-child) > :last-child  { border-start-end-radius:   var(--radius-lg); }
table :where(tbody tr:last-child)  > :first-child { border-end-start-radius:   var(--radius-lg); }
table :where(tbody tr:last-child)  > :last-child  { border-end-end-radius:     var(--radius-lg); }
```

ใช้ logical property (`border-start-start-*`) เพื่อรองรับ RTL ในอนาคตถ้าขยายไปตลาดที่ใช้ภาษาอาหรับ

---

## 7 · Radius ไม่เปลี่ยนตาม breakpoint

ระบบนี้ radius **คงที่ทุกขนาดหน้าจอ** ต่างจาก spacing ที่ระยะ section เปลี่ยนตาม breakpoint

**ยกเว้นเดียว: element ที่ชนขอบจอ** ต้องเป็น 0 ที่ด้านที่ชน

| Element | มือถือ | แท็บเล็ต+ |
|---|---|---|
| Bottom sheet | `rounded-t-xl` (มุมล่าง 0) | ไม่ใช้ — เป็น modal `rounded-xl` |
| Drawer ซ้าย | `rounded-e-xl` (ด้านซ้าย 0) | เหมือนกัน |
| Card เต็มความกว้าง | `rounded-none` ถ้าชนขอบซ้าย-ขวา | `rounded-lg` |
| Modal | `rounded-xl` | `rounded-xl` |

---

## 🎨 Designer Notes

- **ตั้ง Corner smoothing = 0% ใน Figma** — Figma มีฟีเจอร์ squircle (corner smoothing) ที่ **CSS ทำไม่ได้** ถ้าตั้งไว้ที่ 60% แบบ iOS งานที่ implement จะไม่ตรงกับ Figma และแก้ไม่ได้
- **`full` ใช้ได้แค่ 4 อย่าง** chip · badge · avatar · dot ถ้าเห็นปุ่มแคปซูลในไฟล์ นั่นคือการหลุดจากระบบ
- **radius ต้องไม่เกินครึ่งของด้านสั้น** checkbox 24×24 ใช้ได้สูงสุด 12 — ที่กำหนดคือ 6
- **padding 16px ขึ้นไปไม่ต้องคำนวณ concentric** เพราะไกลจากมุมพอ — กฎนี้มีผลเฉพาะกับรูปหรือ element ที่แนบขอบ card
- **`sm` 6 ใช้กับของที่ยืนเดี่ยว** ห้ามใช้เป็นชั้นนอกของอะไร เพราะ 6 − 4 = 2 ซึ่งไม่มีใน scale
- **cell ในตารางเป็น 0 เสมอ** radius ใส่ที่มุมของ cell แรก/สุดท้ายของแถวแรก/สุดท้ายเท่านั้น
- **ห้ามครอบ card ที่มีลิงก์ด้วย `overflow: hidden`** วงแหวน focus จะถูกตัด — ตัดเฉพาะตัวห่อรูป หรือใส่ radius ที่รูปเลย

---

## 💻 Developer Notes

- **`overflow: hidden` ห้ามอยู่บน ancestor ของ focusable element** เพราะ focus ring ล้น 4px จะถูกตัด → ไม่ผ่าน SC 2.4.7 · เขียน lint rule เตือนเมื่อ `overflow-hidden` อยู่บน element เดียวกับที่มี `<a>`, `<button>`, `<input>` เป็นลูก
- **ทางเลือกที่สะอาดกว่า** ใส่ `rounded-*` ที่ตัว `<img>` เองแทนการตัดด้วย container — ได้ concentric radius ถูกต้องและไม่สร้าง stacking context เพิ่ม
- **ใช้ logical property** `border-start-start-radius` ไม่ใช่ `border-top-left-radius` เพื่อรองรับ RTL ในอนาคต — Tailwind v4 ใช้ `rounded-ss-*` / `rounded-se-*` / `rounded-es-*` / `rounded-ee-*`
- **ไม่ต้องกำหนด radius ของ `outline`** browser ทำให้โค้งตาม `border-radius` เอง — เป็นเหตุผลที่วงแหวนชั้นนอกใช้ `outline` ไม่ใช่ `box-shadow`
- **`rounded-full` บน element เตี้ยได้ radius = ครึ่งความสูงโดยอัตโนมัติ** ตั้งใจให้เป็นอย่างนั้นสำหรับ progress bar และ chip
- **Skeleton ต้องมี radius ตรงกับ element จริง** ไม่เช่นนั้นจะเห็นมุมกระตุกตอน content โหลดเสร็จ
- **ห้าม arbitrary radius** `rounded-[10px]` — ถ้าต้องการค่าที่ scale ไม่มี แปลว่าออกแบบผิด

---

## Figma Variables

| Collection | Group | ชื่อ | ค่า |
|---|---|---|---|
| `4. Scale` | `radius` | `radius/none` | `0` |
| `4. Scale` | `radius` | `radius/xs` | `4` |
| `4. Scale` | `radius` | `radius/sm` | `6` |
| `4. Scale` | `radius` | `radius/md` | `8` |
| `4. Scale` | `radius` | `radius/lg` | `12` |
| `4. Scale` | `radius` | `radius/xl` | `16` |
| `4. Scale` | `radius` | `radius/2xl` | `24` |
| `4. Scale` | `radius` | `radius/full` | `9999` |

**คำอธิบายที่ต้องใส่ใน Figma**

| Variable | Description |
|---|---|
| `radius/md` | `Default for buttons, inputs, selects. NOT radius/full — Thai button labels run 20–40% longer than English and pill buttons break at 360px full width.` |
| `radius/sm` | `Standalone elements only (checkbox, tag, tooltip). Cannot be an outer radius — 6 − 4 = 2, which is off-scale.` |
| `radius/full` | `chip · badge · avatar · dot ONLY. Never buttons.` |
| `radius/lg` | `Cards, alerts, banners. Do NOT pair with overflow:hidden if the card contains links — clips the focus ring.` |

**⚠️ กฎบังคับสำหรับทุก component ใน Figma: Corner smoothing = 0%** — CSS ไม่มี squircle การตั้งค่าอื่นทำให้ Figma กับ production ไม่ตรงกันอย่างแก้ไม่ได้

---

## Tailwind v4 Mapping

```css
@theme {
  --radius-none: 0;
  --radius-xs:   0.25rem;    /*  4px */
  --radius-sm:   0.375rem;   /*  6px */
  --radius-md:   0.5rem;     /*  8px */
  --radius-lg:   0.75rem;    /* 12px */
  --radius-xl:   1rem;       /* 16px */
  --radius-2xl:  1.5rem;     /* 24px */
  --radius-full: 9999px;
}
```

| ต้องการ | Utility |
|---|---|
| ปุ่ม · input | `rounded-md` |
| card · alert | `rounded-lg` |
| modal · popover | `rounded-xl` |
| bottom sheet | `rounded-t-xl` |
| drawer ซ้าย (logical) | `rounded-e-xl` |
| chip · avatar | `rounded-full` |
| มุมบนของตัวห่อรูป (logical) | `rounded-ss-lg rounded-se-lg` |

---

## Design Token Example

```css
/* ═══ tier 1 · primitive ═══ */
:root {
  --sme-radius-0:    0;
  --sme-radius-4:    0.25rem;
  --sme-radius-6:    0.375rem;
  --sme-radius-8:    0.5rem;
  --sme-radius-12:   0.75rem;
  --sme-radius-16:   1rem;
  --sme-radius-24:   1.5rem;
  --sme-radius-pill: 9999px;
}

/* ═══ tier 2 · semantic ═══ */
@theme {
  --radius-none: var(--sme-radius-0);
  --radius-xs:   var(--sme-radius-4);
  --radius-sm:   var(--sme-radius-6);
  --radius-md:   var(--sme-radius-8);
  --radius-lg:   var(--sme-radius-12);
  --radius-xl:   var(--sme-radius-16);
  --radius-2xl:  var(--sme-radius-24);
  --radius-full: var(--sme-radius-pill);

  /* บทบาท — component อ้างชื่อพวกนี้ ไม่ใช่ขนาด */
  --radius-control:   var(--radius-md);    /* ปุ่ม input select   */
  --radius-container: var(--radius-lg);    /* card panel alert    */
  --radius-overlay:   var(--radius-xl);    /* modal popover sheet */
  --radius-pill:      var(--radius-full);  /* chip badge avatar   */
}

/* ═══ ตาราง — radius ที่มุมนอกสุด ไม่ใช้ overflow:hidden ═══ */
table :where(thead tr:first-child) > :first-child { border-start-start-radius: var(--radius-container); }
table :where(thead tr:first-child) > :last-child  { border-start-end-radius:   var(--radius-container); }
table :where(tbody tr:last-child)  > :first-child { border-end-start-radius:   var(--radius-container); }
table :where(tbody tr:last-child)  > :last-child  { border-end-end-radius:     var(--radius-container); }
```

**สังเกต:** มี token เชิงบทบาท 4 ตัว (`control` `container` `overlay` `pill`) ทับบนค่าขนาด — component ควรอ้าง `--radius-control` ไม่ใช่ `--radius-md` เพราะถ้าวันหนึ่งตัดสินใจเปลี่ยนปุ่มทั้งระบบเป็น 6px จะแก้ที่เดียว

---

## 🧠 Decision Rationale

### ทำไมสเกลกลาง ไม่ใช่ 2/4/6 หรือ 8/12/16
สเกลแน่น (2/4/6/8) เป็นภาษาของ GOV.UK และ USWDS ให้อำนาจสูงสุดและรบกวนสายตาน้อยที่สุดในตารางข้อมูลหนาแน่น แต่วัดได้ว่าเย็นชาและเข้าถึงยากกว่า ซึ่งขัดกับบุคลิก Friendly 6/10 และ Digital-first ในโจทย์ — และดูเก่ากว่าแอปที่ SME ไทยใช้ทุกวันอย่างชัดเจน

สเกลนุ่ม (8/12/16/20) ใกล้โลกของ Shopee/Lazada/LINE ซึ่งผู้ใช้คุ้นที่สุด แต่ทำลายน้ำหนักที่จำเป็นบนหน้าสินเชื่อ หน้าปฏิบัติตามกฎ และหน้าโครงการรัฐ ซึ่งเป็นหน้าที่มูลค่าสูงสุดของแพลตฟอร์ม

4/6/8/12/16/24 อยู่ตรงกลาง อ่านว่าเป็นมืออาชีพและร่วมสมัยโดยไม่ตกไปทางแอปผู้บริโภค และ **ทุกค่าอยู่บน sub-grid 2px** ทำให้สูตร concentric คำนวณได้ลงตัวทุกคู่

### ทำไมสูตร concentric ลงตัวทุกคู่ — และทำไมนั่นสำคัญ
เมื่อตรวจทุกคู่ที่เป็นไปได้ระหว่าง radius กับ padding มาตรฐาน ผลลัพธ์ตกบนขั้นจริงของ scale **ทั้งหมด** (24−8=16, 16−8=8, 12−4=8, 12−8=4, 8−4=4) ไม่มีคู่ไหนต้องใช้ค่านอก scale

นี่ไม่ใช่ความบังเอิญ แต่เป็นผลจากการเลือกให้ทั้ง radius และ spacing อยู่บน grid ที่เข้ากัน — และมีผลจริงคือ**นักออกแบบไม่ต้องคำนวณเอง** ดูตารางในข้อ 2.1 แล้วเลือกได้เลย ซึ่งเป็นสิ่งที่ทำให้กฎถูกทำตามจริง ต่างจากกฎที่ต้องเปิดเครื่องคิดเลข

### ทำไมปุ่มไม่เป็นแคปซูล
เพราะโจทย์เป็นภาษาไทย ข้อความปุ่มไทยยาวกว่าอังกฤษ 20–40% (ยื่นคำขอ vs Apply = +60%) ปุ่มแคปซูลต้องมี padding แนวนอนมากกว่าปุ่มปกติเพื่อไม่ให้ข้อความชิดส่วนโค้ง เมื่อบวกกันบนหน้าจอ 360px ปุ่มจะกว้างเกินพื้นที่ และ CTA เต็มความกว้างสูง 44px ที่มีส่วนโค้ง 22px สองข้างจะดูเหมือนแถบยา ไม่ใช่ปุ่มของแพลตฟอร์มรัฐ

นี่คือตัวอย่างที่ชัดว่าการเลือก radius **ไม่ใช่เรื่องรสนิยม** เมื่อภาษาหลักไม่ใช่อังกฤษ

### ทำไมต้องเขียนกฎ `overflow: hidden` ไว้ในข้อ radius
เพราะเป็นความขัดแย้งที่เกิดจากการตัดสินใจสองข้อที่ถูกทั้งคู่ — radius 12px บน card สินค้า และ focus ring ที่ล้นออกนอกขอบ 4px ตามข้อ 15 ทั้งสองข้อสมเหตุสมผลเอง แต่ใช้ร่วมกันแล้วทำให้ focus ring ถูกตัด ซึ่งเป็นการไม่ผ่าน SC 2.4.7 จริง ไม่ใช่เรื่องความสวย

ถ้าไม่เขียนไว้ที่นี่ นักพัฒนาจะเขียน `rounded-lg overflow-hidden` บน card สินค้าตามสัญชาตญาณ และไม่มีใครเห็นปัญหาจนกว่าจะทดสอบด้วยคีย์บอร์ด — ซึ่งมักเป็นขั้นตอนสุดท้ายก่อนปล่อย

### ทำไม Corner smoothing ต้องเป็น 0%
Figma รองรับ squircle แบบ iOS ผ่าน corner smoothing แต่ **CSS ไม่มีคุณสมบัตินี้** และไม่มีวิธีทำเลียนแบบที่ใช้ได้จริงกับ element ที่มีเนื้อหาเปลี่ยนขนาดได้ ถ้าไฟล์ออกแบบตั้ง 60% ไว้ งานที่ implement จะดูต่างจากแบบทุกมุมของทุก component และเป็นความต่างที่ **แก้ไม่ได้** — จึงต้องล็อกเป็น 0% ตั้งแต่ต้น ไม่ใช่มาพบตอน handoff

---

**ถัดไป:** `06-shadow.md` — สเกลเงา xs–2xl สำหรับโหมดสว่าง และกลไกยกระดับด้วยความสว่างพื้นผิวสำหรับโหมดมืด ภายใต้ token ชุดเดียว
