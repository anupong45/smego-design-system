# 07 · Motion / ระบบการเคลื่อนไหว

**SME.GO Marketplace** · Foundation Layer · WCAG 2.2 AA

---

## ภาพรวม / Overview

ในระบบนี้ **duration + easing เป็นภาษาหลัก** และ **Framer Motion เป็นเครื่องมือเสริม** ไม่ใช่กลับกัน

**เหตุผล:** จุดแข็งที่สุดของ Framer Motion คือ spring physics แต่ค่า spring (`stiffness`, `damping`, `mass`) **เขียนเป็น CSS variable ไม่ได้ · แสดงเป็น Figma variable ไม่ได้ · และ component ที่ใช้ CSS ล้วนอ่านไม่ได้** ถ้าให้ spring เป็นภาษาหลัก ระบบจะมีการเคลื่อนไหวสองชุดที่ไม่ตรงกัน — ชุดที่ tokenize ได้กับชุดที่ tokenize ไม่ได้

ระบบจึงกำหนดให้ **ทุกการเคลื่อนไหวอ้างค่าจาก token ชุดเดียว** และ Framer ใช้ค่าเดียวกันนั้น

---

## 1 · Duration

| Token | ค่า | ใช้กับอะไร |
|---|---|---|
| `duration-instant` | **0ms** | การเปลี่ยนที่ต้องรู้สึกทันที — focus ring · การกดปุ่ม |
| `duration-fast` | **150ms** | **การเปลี่ยนสถานะ** — hover · checked · การปิดทุกชนิด |
| `duration-medium` | **250ms** | **การเปิดของที่ลอย** — dropdown · modal · toast · accordion |
| `duration-slow` | **400ms** | การเคลื่อนไหวพื้นที่ใหญ่ — bottom sheet · การเปลี่ยนหน้า |
| `duration-slower` | **600ms** | ลูปที่ทำซ้ำ — skeleton (แต่ดูข้อ 6) |

### 1.1 กฎ: การปิดเร็วกว่าการเปิดเสมอ

| การกระทำ | Duration |
|---|---|
| เปิด dropdown | `medium` 250 |
| **ปิด dropdown** | **`fast` 150** |
| เปิด modal | `medium` 250 |
| **ปิด modal** | **`fast` 150** |
| toast เข้า | `medium` 250 |
| **toast ออก** | **`fast` 150** |

**เหตุผล:** ผู้ใช้ที่สั่งปิดแล้วต้องการให้มันหายไป การรอ animation ปิด 250ms รู้สึกเหมือนระบบช้า ส่วนการเปิดต้องช้าพอให้ตาตามได้ว่าของโผล่มาจากไหน

---

## 2 · Easing

| Token | cubic-bezier | ใช้กับอะไร |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | **ค่าเริ่มต้น** — การเปลี่ยนสถานะทั้งหมด สี ขนาด เงา |
| `ease-entering` | `cubic-bezier(0, 0, 0.2, 1)` | ของที่**เข้ามา** — เริ่มเร็ว จบนุ่ม (decelerate) |
| `ease-exiting` | `cubic-bezier(0.4, 0, 1, 1)` | ของที่**ออกไป** — เริ่มนุ่ม จบเร็ว (accelerate) |
| `ease-emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | การเปลี่ยนสำคัญ/พื้นที่ใหญ่ — modal · bottom sheet · เปลี่ยนหน้า |
| `ease-linear` | `linear` | ตัวบ่งชี้ความคืบหน้าจริง · spinner เท่านั้น |

**หลักการ:** ของที่เข้ามาต้อง **decelerate** (มาถึงแล้วนิ่ง) ของที่ออกไปต้อง **accelerate** (ออกไปเลยไม่ต้องลังเล) — ถ้าสลับกันจะรู้สึกว่าระบบฝืด

---

## 3 · ตารางแมปครบทุก interaction

| Interaction | Duration | Easing | คุณสมบัติที่ animate |
|---|---|---|---|
| Focus ring ปรากฏ | `instant` | — | ไม่ animate |
| Hover สี/พื้น | `fast` | `standard` | `background-color` `color` `border-color` |
| Hover เงา (card) | `fast` | `standard` | `box-shadow` |
| กดปุ่ม (active) | `instant` | — | ไม่ animate |
| CheckboxInput / Radio / Toggle | `fast` | `standard` | `opacity` `transform` |
| Tooltip เข้า | `fast` | `entering` | `opacity` + `transform: translateY(2px→0)` |
| Tooltip ออก | `fast` | `exiting` | `opacity` |
| Dropdown / Selector เปิด | `medium` | `entering` | `opacity` + `scale(.98→1)` |
| Dropdown / Selector ปิด | `fast` | `exiting` | `opacity` |
| Popover / Combobox เปิด | `medium` | `entering` | `opacity` + `scale(.98→1)` |
| Modal เปิด | `medium` | `emphasized` | `opacity` + `scale(.96→1)` |
| Modal ปิด | `fast` | `exiting` | `opacity` |
| Backdrop | ตรงกับ modal | `standard` | `opacity` เท่านั้น |
| Bottom sheet เปิด | `slow` | `emphasized` | `transform: translateY(100%→0)` |
| Bottom sheet ปิด | `medium` | `exiting` | `transform` |
| Drawer ด้านข้าง | `medium` | `emphasized` | `transform: translateX` |
| Toast เข้า | `medium` | `entering` | `opacity` + `translateY` |
| Toast ออก | `fast` | `exiting` | `opacity` |
| Collapsible เปิด/ปิด | `medium` | `standard` | `grid-template-rows` (ดูข้อ 5.2) |
| Tab indicator ย้าย | `medium` | `emphasized` | `transform` |
| เปลี่ยนหน้า | `slow` | `emphasized` | `opacity` |
| Skeleton | `slower` ลูป | `linear` | ดูข้อ 6 |
| Progress bar (ความคืบหน้าจริง) | `medium` | `linear` | `transform: scaleX` |

---

## 4 · สัญญาการใช้ Framer Motion

### 4.1 ใช้ได้เฉพาะสิ่งที่ CSS ทำไม่ได้

| ✅ ใช้ Framer | เหตุผล |
|---|---|
| **Exit animation** (`AnimatePresence`) | CSS ไม่สามารถ animate element ที่กำลังถูก unmount |
| **Layout / shared-element** (`layout`, `layoutId`) | เช่น card ที่ขยายเป็นหน้ารายละเอียด · tab indicator ที่เลื่อนตาม |
| **Gesture** (`drag`, `onPan`) | ลาก bottom sheet ลงเพื่อปิด · ปัดเพื่อลบ |
| **Stagger รายการ** (`staggerChildren`) | เข้าแบบไล่ลำดับ — แต่ดูข้อ 4.4 |

| ❌ ห้ามใช้ Framer | ใช้อะไรแทน |
|---|---|
| hover · focus · active | CSS `transition` |
| checked · expanded · selected | CSS `transition` |
| การเปลี่ยนสี | CSS `transition` |
| เงาตอน hover | CSS `transition` |
| การเปิดของที่ลอย (ที่ไม่ต้อง exit animation) | CSS + `@starting-style` |

### 4.2 Framer ต้องใช้ค่าจาก token

```ts
// motion-tokens.ts — อ่านจาก CSS variable ตัวเดียวกับที่ CSS ใช้
const read = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const duration = {
  instant: 0,
  fast:    0.15,
  medium:  0.25,
  slow:    0.40,
  slower:  0.60,
} as const;

export const ease = {
  standard:   [0.2, 0, 0, 1],
  entering:   [0, 0, 0.2, 1],
  exiting:    [0.4, 0, 1, 1],
  emphasized: [0.05, 0.7, 0.1, 1],
} as const;
```

**ห้ามเขียน `duration: 0.3` หรือ `ease: "easeInOut"` ตรงใน component** — ถ้าค่าที่ต้องการไม่มีใน token แปลว่า token ผิด แก้ที่ token

### 4.3 Spring — ชุดปิด มีแค่ 2 ค่า

```ts
export const spring = {
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  gentle: { type: "spring", stiffness: 200, damping: 26, mass: 1.0 },
} as const;
```

| Preset | ใช้กับอะไร |
|---|---|
| `spring.snappy` | การเคลื่อนไหวที่ตามนิ้ว — ลาก bottom sheet · ปัด |
| `spring.gentle` | layout shift — `layoutId` · tab indicator |

**spring config อื่นทั้งหมดถือว่าไม่ผ่าน review** ไม่มี `stiffness: 350` ไม่มี `bounce: 0.4` — ถ้ารู้สึกว่าต้องใช้ค่าใหม่จริง ให้เพิ่มเข้า preset พร้อมเหตุผล ไม่ใช่เขียน inline

### 4.4 ⚠️ Framer Motion ต้อง code-split

Framer Motion เป็น **dependency ที่ใหญ่ที่สุดใน stack นี้** และเกณฑ์อุปกรณ์อ้างอิงในข้อ 01 คือ Android ระดับล่างบนเน็ต 4G ต่างจังหวัด

**กฎ**

1. **ห้าม import ใน route ที่ไม่ใช้** — ใช้ `dynamic()` / `React.lazy()` แยกตาม route
2. **หน้ารายการสินค้าและหน้าค้นหาห้ามพึ่ง Framer** เพราะเป็นหน้าที่ต้องเร็วที่สุดและใช้ CSS ได้ครบ
3. **Stagger ในรายการยาวห้ามใช้** — 40 card × animation = งานหนักบนเครื่องเป้าหมาย และทำให้ผู้ใช้ต้องรอเห็นเนื้อหาที่มีอยู่แล้ว

---

## 5 · คุณสมบัติที่ animate ได้

### 5.1 กฎเหล็ก: `transform` และ `opacity` เท่านั้น

สองคุณสมบัตินี้ทำงานบน compositor ไม่ต้อง layout ใหม่ ไม่ต้อง paint ใหม่

| ✅ animate ได้ | ❌ ห้าม animate | ทำไม |
|---|---|---|
| `transform` | `width` `height` | บังคับ layout ใหม่ทั้งต้นไม้ |
| `opacity` | `top` `left` `right` `bottom` | บังคับ layout ใหม่ |
| `color` `background-color` `border-color`¹ | `margin` `padding` | บังคับ layout ใหม่ |
| `box-shadow`¹ | `font-size` | บังคับ layout ใหม่ + reflow ข้อความ |
| | `filter` `backdrop-filter` | แพงที่สุด ห้ามในรายการ |

¹ สีและเงาต้อง paint ใหม่แต่ไม่ต้อง layout — ยอมรับได้ที่ `duration-fast` บน element เดี่ยว **ห้ามทำพร้อมกันหลายสิบตัว**

### 5.2 Collapsible — ข้อยกเว้นที่ต้องระวัง

การขยาย accordion ต้องเปลี่ยนความสูง ซึ่งไม่มีวิธีทำด้วย `transform` อย่างเดียว

**วิธีที่ใช้** — `grid-template-rows` จาก `0fr` ไป `1fr` ซึ่ง browser ปัจจุบัน animate ได้และถูกกว่า `height: auto`

```css
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-duration-medium) var(--ease-standard);
}
.accordion-panel[data-open="true"] { grid-template-rows: 1fr; }
.accordion-panel > * { overflow: hidden; }
```

**⚠️ `overflow: hidden` ที่นี่ขัดกับกฎในข้อ 05** ถ้าใน panel มี element ที่ focus ได้ วงแหวน focus จะถูกตัดตอนกำลัง animate — ตั้ง `overflow: visible` เมื่อ animation จบด้วย `transitionend`

**ห้ามใช้ `max-height` แบบเดาค่า** เพราะต้องกำหนดค่าที่มากเกินจริง ทำให้ความเร็ว animation ไม่คงที่ตามความยาวเนื้อหา

---

## 6 · ⚠️ Reduced Motion — allow / deny list

ข้อ 17 ของสถาปัตยกรรมกำหนดว่าต้องมีรายการนี้ชัดเจน ไม่ใช่แค่หลักการ — **นี่คือรายการนั้น**

**หลักการ:** ความผิดปกติของระบบทรงตัว (vestibular disorder) ถูกกระตุ้นด้วย **การเคลื่อนที่** ไม่ใช่การเปลี่ยนความทึบแสง จึงตัดการเคลื่อนที่ แต่คงการ crossfade ไว้เพื่อให้ยังรู้ว่าสถานะเปลี่ยน

### 6.1 ❌ DENY — ต้องปิดทั้งหมด

| สิ่งที่ต้องปิด | ทำอย่างไร |
|---|---|
| `transform: translate` ทุกทิศ | ตัดออก แสดงที่ตำแหน่งปลายทางเลย |
| `transform: scale` | ตัดออก แสดงขนาดจริงเลย |
| `transform: rotate` | ตัดออก — **ยกเว้น spinner ที่บอกว่าระบบกำลังทำงาน** |
| Parallax · การเคลื่อนไหวที่ผูกกับ scroll | ตัดออกทั้งหมด |
| Carousel ที่เลื่อนเอง · slideshow อัตโนมัติ | หยุด แสดงภาพแรกค้าง |
| Framer `layout` · `layoutId` | ปิด — ให้ element กระโดดไปตำแหน่งใหม่ |
| Stagger ในรายการ | ปิด — แสดงทั้งรายการพร้อมกัน |
| Skeleton shimmer (แถบไล่สีที่เลื่อน) | เปลี่ยนเป็นพื้นสีนิ่ง ไม่มีการเคลื่อนไหว |
| Animation เรียกความสนใจแบบลูป (pulse · bounce · ping) | ปิดทั้งหมด |
| การนับตัวเลขขึ้น (count-up) | **ห้ามอยู่แล้วตั้งแต่ข้อ 01** — ดูข้อ 7.2 |
| การเคลื่อนไหวที่ตามนิ้ว (drag-follow) | ยังลากได้ แต่ไม่มี spring ตามหลัง |

### 6.2 ✅ ALLOW — คงไว้ที่ `duration-fast`

| สิ่งที่คงไว้ | เหตุผล |
|---|---|
| `opacity` crossfade | ไม่มีการเคลื่อนที่ ไม่กระตุ้นระบบทรงตัว และจำเป็นเพื่อให้เห็นว่าสถานะเปลี่ยน |
| `background-color` `color` `border-color` | ไม่มีการเคลื่อนที่ |
| `box-shadow` | ไม่มีการเคลื่อนที่ |
| Focus ring ปรากฏ | ทันทีอยู่แล้ว |
| **Progress bar ที่บอกความคืบหน้าจริง** | เป็นการเคลื่อนที่ที่ **สื่อข้อมูล** ไม่ใช่การตกแต่ง และเป็นพื้นที่เล็ก — ถ้าตัดออก ผู้ใช้จะไม่รู้ว่าการอัปโหลดคืบหน้าไปเท่าไร |
| Spinner ที่บอกว่าระบบกำลังทำงาน | เหตุผลเดียวกัน — เป็นข้อมูล ไม่ใช่การตกแต่ง |

**ข้อแยกแยะที่สำคัญ:** การเคลื่อนไหวที่ **สื่อข้อมูลที่หาจากที่อื่นไม่ได้** (ความคืบหน้า สถานะกำลังทำงาน) ยังคงไว้ แต่ต้องเป็นพื้นที่เล็ก ไม่ใช่การเคลื่อนไหวเต็มหน้าจอ

### 6.3 การ implement

```css
@media (prefers-reduced-motion: reduce) {
  /* ปิดทุกอย่างเป็นค่าเริ่มต้น */
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }

  /* คืน crossfade และการเปลี่ยนสีให้ทำงานที่ duration-fast */
  *, *::before, *::after {
    transition-property: opacity, color, background-color, border-color, box-shadow, fill, stroke !important;
    transition-duration: var(--transition-duration-fast) !important;
  }

  /* ปิดการเคลื่อนที่ทั้งหมด */
  .motion-slide, .motion-scale, [data-motion="transform"] { transform: none !important; }

  /* skeleton เป็นพื้นนิ่ง */
  .skeleton { animation: none !important; background: var(--color-sunken) !important; }

  /* ยกเว้น: ตัวบ่งชี้ที่สื่อข้อมูล */
  .spinner, .progress-indicator {
    animation-duration: revert !important;
    transition-duration: revert !important;
  }
}
```

**⚠️ `!important` ที่นี่เป็นข้อยกเว้นเดียวในระบบ** — ข้อ 01 ห้าม `!important` ทุกกรณี แต่ block นี้ต้องชนะทุก declaration รวมถึง inline style ที่ Framer Motion เขียนเข้ามา จึงเป็นข้อยกเว้นที่ต้องบันทึกไว้

```ts
// ฝั่ง JS — Framer ต้องเคารพด้วย
import { useReducedMotion } from "motion/react";

const reduce = useReducedMotion();

<motion.div
  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: reduce ? duration.fast : duration.medium, ease: ease.entering }}
/>
```

**`useReducedMotion()` จำเป็น** เพราะ inline style ที่ Framer เขียนไม่ถูก CSS media query ครอบได้ทั้งหมด — ต้องปิดที่ต้นทาง

---

## 7 · กฎเฉพาะบริบทของ SME.GO

### 7.1 ⚠️ ห้ามเปิดเผยข้อความไทยทีละตัวอักษร

**ห้าม typewriter effect · ห้าม reveal ทีละอักขระ · ห้าม stagger ระดับตัวอักษร กับข้อความไทย**

**เหตุผลทางเทคนิค:** อักษรไทยประกอบด้วยหลาย code point ที่รวมกันเป็น grapheme cluster หนึ่งตัว เช่น

```
ที่  =  ท (U+0E17) + ี (U+0E35) + ่ (U+0E48)
```

การเปิดเผยทีละ code point จะทำให้เห็น **สระและวรรณยุกต์ลอยอยู่โดยไม่มีพยัญชนะ** ก่อนตัวอักษรจะสมบูรณ์ ซึ่งดูเหมือนระบบพัง ไม่ใช่ effect

และภาษาไทย **ไม่มีช่องว่างระหว่างคำ** จึงไม่มีจุดตัดตามธรรมชาติสำหรับการ reveal ทีละคำด้วย

**ถ้าต้องการเน้นข้อความ** ใช้ `opacity` crossfade ของบล็อกทั้งบล็อก

### 7.2 ห้ามนับตัวเลขขึ้น (count-up)

ข้อ 01 ระบุไว้แล้วภายใต้หลัก *"ความน่าเชื่อถือมาก่อนความสวยงาม"* — ย้ำที่นี่เพราะเป็น motion pattern

**เหตุผล:** ตัวเลขที่วิ่งขึ้นทำให้ดูเหมือนตัวเลข **ไม่นิ่ง** ซึ่งเป็นสิ่งที่แย่ที่สุดสำหรับวงเงินสินเชื่อ ยอดขาย และอัตราดอกเบี้ยบนแพลตฟอร์มภาครัฐ — ผู้ใช้ต้องเชื่อว่าตัวเลขที่เห็นคือตัวเลขจริง ไม่ใช่ animation ที่ยังไม่จบ

**ยกเว้น:** ตัวเลขที่เปลี่ยนเพราะข้อมูลเปลี่ยนจริง (เช่น จำนวนผลการค้นหาหลังกรองใหม่) ให้ **crossfade** ไม่ใช่นับ

### 7.3 การเคลื่อนไหวห้ามหน่วงการใช้งาน

| กฎ | เหตุผล |
|---|---|
| Focus ต้องย้ายเข้า modal **ทันทีที่ mount** ไม่ใช่หลัง animation จบ | ผู้ใช้ screen reader และคีย์บอร์ดต้องไม่ต้องรอ |
| ปุ่มต้องกดได้ตั้งแต่เฟรมแรกของ animation เข้า | ห้ามตั้ง `pointer-events: none` ระหว่างเข้า |
| `aria-live` ต้องประกาศทันที ไม่ผูกกับ animation | |
| Skeleton ต้องปรากฏทันที ไม่ fade เข้า | การ fade เข้าของ skeleton = หน่วงการบอกว่ากำลังโหลด |

---

## 🎨 Designer Notes

- **การปิดเร็วกว่าการเปิดเสมอ** เปิด 250ms ปิด 150ms — ถ้าออกแบบให้เท่ากันจะรู้สึกว่าระบบช้าตอนปิด
- **ของเข้าใช้ `entering` ของออกใช้ `exiting`** ถ้าสลับกันจะรู้สึกฝืด
- **ระบุ duration และ easing เป็นชื่อ token ในไฟล์ Figma** ไม่ใช่ "250ms ease-out" เพราะ Figma กับ CSS ตีความ ease-out ไม่เหมือนกัน
- **ห้ามออกแบบ animation ที่ตัวเลขวิ่งขึ้น** ขัดกับหลักความน่าเชื่อถือในข้อ 01
- **ห้ามออกแบบ typewriter effect กับข้อความไทย** สระและวรรณยุกต์จะลอยก่อนพยัญชนะ
- **หน้ารายการสินค้าและหน้าค้นหาต้องไม่มี animation ที่ต้องใช้ JS** เป็นหน้าที่ต้องเร็วที่สุด
- **ห้าม stagger ในรายการยาว** 40 card ที่เข้าไล่ลำดับทำให้ผู้ใช้ต้องรอเห็นเนื้อหาที่โหลดเสร็จแล้ว
- **ออกแบบสถานะ reduced motion ไปด้วย** ทุก animation ต้องมีคำตอบว่า "ถ้าปิดการเคลื่อนไหวแล้วหน้าตาเป็นอย่างไร"

---

## 💻 Developer Notes

- **animate ได้แค่ `transform` และ `opacity`** สีและเงายอมรับได้ที่ `duration-fast` บน element เดี่ยว — ห้าม `width` `height` `top` `left` `margin` `padding` `font-size`
- **Framer ใช้เฉพาะ 4 กรณี** exit animation · layout/shared-element · gesture · stagger (ที่ไม่ใช่รายการยาว) — hover/focus/active/checked ใช้ CSS ทั้งหมด
- **Framer ต้อง code-split ตาม route** และห้าม import ในหน้ารายการสินค้ากับหน้าค้นหา
- **ห้ามเขียน `duration: 0.3` หรือ `ease: "easeInOut"` inline** อ่านจาก `motion-tokens.ts` เท่านั้น
- **spring มีแค่ `snappy` และ `gentle`** ค่าอื่นไม่ผ่าน review
- **ต้องใช้ทั้ง media query และ `useReducedMotion()`** — inline style ที่ Framer เขียนไม่ถูก CSS ครอบได้ทั้งหมด
- **`!important` ใน block `prefers-reduced-motion` เป็นข้อยกเว้นเดียวของระบบ** ต้องชนะ inline style ของ Framer — บันทึกไว้ในเอกสารแล้ว
- **Collapsible ใช้ `grid-template-rows: 0fr → 1fr`** ห้าม `max-height` แบบเดาค่า และต้องคืน `overflow: visible` ตอน `transitionend` เพื่อไม่ให้ตัด focus ring
- **Focus ต้องย้ายทันทีที่ mount** ห้ามรอ animation จบ · ห้าม `pointer-events: none` ระหว่าง animation เข้า
- **Skeleton ปรากฏทันที ไม่ fade** เพราะการ fade เข้าคือการหน่วงสัญญาณว่ากำลังโหลด
- **ใช้ `@starting-style`** สำหรับ enter animation ของ `<dialog>` และ popover เพื่อไม่ต้องใช้ JS

---

## Figma Variables

| Collection | Group | ชื่อ | ค่า |
|---|---|---|---|
| `4. Scale` | `duration` | `duration/instant` | `0` |
| `4. Scale` | `duration` | `duration/fast` | `150` |
| `4. Scale` | `duration` | `duration/medium` | `250` |
| `4. Scale` | `duration` | `duration/slow` | `400` |
| `4. Scale` | `duration` | `duration/slower` | `600` |

**⚠️ Figma variable รองรับแต่ตัวเลข — easing เก็บเป็น variable ไม่ได้** ต้องบันทึกในเอกสารและใน description ของ prototype interaction แทน

**Figma prototype settings ที่ต้องใช้**

| Interaction | Figma easing | ตรงกับ token |
|---|---|---|
| ของเข้า | Custom `0, 0, 0.2, 1` | `ease-entering` |
| ของออก | Custom `0.4, 0, 1, 1` | `ease-exiting` |
| modal · sheet | Custom `0.05, 0.7, 0.1, 1` | `ease-emphasized` |
| เปลี่ยนสถานะ | Custom `0.2, 0, 0, 1` | `ease-standard` |

**ห้ามใช้ Ease In / Ease Out / Ease In Out ที่ Figma ให้มา** เพราะค่าไม่ตรงกับ token และงานที่ implement จะรู้สึกต่างจาก prototype

---

## Tailwind v4 Mapping

### 📌 แก้ความแม่นยำ — namespace ของ duration

ฉบับแรกของเอกสารนี้ประกาศ `--duration-fast` ใน `@theme` โดยคาดว่าจะสร้าง utility `duration-fast`

**ตรวจแล้วด้วยการ build จริงบน Tailwind v4.3.3 — ไม่สร้างอะไรเลย** v4 **ไม่มี** theme namespace ชื่อ `--duration-*` · utility `duration-*` รับค่าเป็นตัวเลขล้วน (`duration-150`)

namespace ที่ถูกคือ **`--transition-duration-*`**

| ชื่อ token ที่ใช้จริง | utility | เดิมเขียนไว้ว่า |
|---|---|---|
| `--transition-duration-fast` | `duration-fast` ✅ | ~~`--duration-fast`~~ (ไม่สร้าง utility) |
| `--transition-duration-medium` | `duration-medium` ✅ | ~~`--duration-medium`~~ |
| `--ease-emphasized` | `ease-emphasized` ✅ | ถูกอยู่แล้ว — `--ease-*` เป็น namespace จริง |

**ใช้ชื่อนี้ชื่อเดียวทั้งระบบ ไม่มี alias `--duration-*`** เพื่อไม่ให้มีสองชื่อของสิ่งเดียว ซึ่งเป็นจุดที่นักพัฒนาจะ override ผิดตัว


```css
@theme {
  --transition-duration-instant: 0ms;
  --transition-duration-fast:    150ms;
  --transition-duration-medium:  250ms;
  --transition-duration-slow:    400ms;
  --transition-duration-slower:  600ms;

  --ease-standard:   cubic-bezier(0.2, 0, 0, 1);
  --ease-entering:   cubic-bezier(0, 0, 0.2, 1);
  --ease-exiting:    cubic-bezier(0.4, 0, 1, 1);
  --ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1);
}
```

| ต้องการ | Utility |
|---|---|
| hover เปลี่ยนสี | `transition-colors duration-fast ease-standard` |
| เงาตอน hover | `transition-shadow duration-fast ease-standard` |
| dropdown เปิด | `duration-medium ease-entering` |
| modal เปิด | `duration-medium ease-emphasized` |
| bottom sheet | `duration-slow ease-emphasized` |

```html
<button class="transition-colors duration-fast ease-standard hover:bg-primary-700">
  ยื่นคำขอสินเชื่อ
</button>
```

---

## Design Token Example

```css
/* ═══ tier 1 · primitive ═══ */
:root {
  --sme-ms-0:   0ms;
  --sme-ms-150: 150ms;
  --sme-ms-250: 250ms;
  --sme-ms-400: 400ms;
  --sme-ms-600: 600ms;

  --sme-curve-standard:   cubic-bezier(0.2, 0, 0, 1);
  --sme-curve-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --sme-curve-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --sme-curve-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1);
}

/* ═══ tier 2 · semantic ═══ */
@theme {
  --transition-duration-instant: var(--sme-ms-0);
  --transition-duration-fast:    var(--sme-ms-150);
  --transition-duration-medium:  var(--sme-ms-250);
  --transition-duration-slow:    var(--sme-ms-400);
  --transition-duration-slower:  var(--sme-ms-600);

  --ease-standard:   var(--sme-curve-standard);
  --ease-entering:   var(--sme-curve-decelerate);
  --ease-exiting:    var(--sme-curve-accelerate);
  --ease-emphasized: var(--sme-curve-emphasized);
}

/* ═══ tier 2 · บทบาท — component อ้างพวกนี้ ═══ */
:root {
  --motion-state:   var(--transition-duration-fast)   var(--ease-standard);
  --motion-enter:   var(--transition-duration-medium) var(--ease-entering);
  --motion-exit:    var(--transition-duration-fast)   var(--ease-exiting);
  --motion-overlay: var(--transition-duration-medium) var(--ease-emphasized);
  --motion-sheet:   var(--transition-duration-slow)   var(--ease-emphasized);
}

/* ═══ ตัวอย่างการใช้ ═══ */
.button { transition: background-color var(--motion-state), box-shadow var(--motion-state); }

.dropdown        { transition: opacity var(--motion-exit),  transform var(--motion-exit); }
.dropdown[data-open="true"] { transition: opacity var(--motion-enter), transform var(--motion-enter); }

/* ═══ reduced motion — ข้อยกเว้นเดียวที่ใช้ !important ═══ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
  *, *::before, *::after {
    transition-property: opacity, color, background-color, border-color, box-shadow, fill, stroke !important;
    transition-duration: var(--transition-duration-fast) !important;
  }
  [data-motion="transform"] { transform: none !important; }
  .skeleton { animation: none !important; background: var(--color-sunken) !important; }

  /* ยกเว้น: การเคลื่อนไหวที่สื่อข้อมูล */
  .spinner, .progress-indicator {
    animation-duration: revert !important;
    transition-duration: revert !important;
  }
}
```

---

## 🧠 Decision Rationale

### ทำไม duration + easing เป็นภาษาหลัก ไม่ใช่ spring
เพราะ stack ที่โจทย์กำหนดมี **Design Tokens · CSS Variables · Figma Variables** อยู่ด้วย และค่า spring (`stiffness`, `damping`, `mass`) เขียนเป็นค่าใดค่าหนึ่งในสามอย่างนั้นไม่ได้เลย ถ้าให้ spring เป็นภาษาหลัก จะได้ระบบการเคลื่อนไหวสองชุด — ชุดที่อยู่ใน token กับชุดที่อยู่ในโค้ด JS เท่านั้น และ component ที่ใช้ CSS ล้วนจะเคลื่อนไหวไม่เหมือน component ที่ใช้ Framer

ราคาที่จ่ายคือเสียความรู้สึกออร์แกนิกของ spring ไปบางส่วน แต่ได้ระบบที่ **ตรวจสอบได้ · แสดงใน Figma ได้ · และทำงานได้โดยไม่ต้องมี JavaScript** ซึ่งสำคัญกว่าสำหรับเกณฑ์อุปกรณ์ในข้อ 01

### ทำไมการปิดเร็วกว่าการเปิด
เพราะเจตนาของผู้ใช้ต่างกัน การเปิดคือการที่ระบบแนะนำของใหม่เข้ามา — ตาต้องมีเวลาหาว่ามันมาจากไหน 250ms ให้เวลานั้น การปิดคือผู้ใช้ตัดสินใจแล้วว่าไม่ต้องการ — การรอ 250ms รู้สึกเหมือนระบบขัดขืน 150ms ยังเห็นว่ามันหายไปแต่ไม่รู้สึกว่ารอ

### ทำไม Framer ถูกจำกัดแค่ 4 กรณี
เพราะทั้ง 4 กรณีเป็นสิ่งที่ CSS ทำไม่ได้จริง — CSS ไม่สามารถ animate element ที่กำลังถูก unmount, ไม่สามารถทำ shared-element transition ระหว่างสอง element คนละที่, ไม่สามารถผูกการเคลื่อนไหวกับ gesture ได้อย่างต่อเนื่อง ส่วน hover/focus/checked นั้น CSS ทำได้และทำได้ดีกว่า เพราะไม่ต้องรอ JavaScript hydrate

ผลที่ได้คือหน้าที่สำคัญที่สุดสองหน้า — รายการสินค้าและหน้าค้นหา — ไม่ต้องโหลด Framer เลย

### ทำไม spring มีแค่ 2 ค่า
เพราะ spring config เป็นสิ่งที่เขียน inline ได้ง่ายที่สุดและตรวจจับได้ยากที่สุด ถ้าไม่จำกัดเป็นชุดปิด ระบบจะค่อย ๆ มี `stiffness: 350`, `stiffness: 380`, `bounce: 0.3` กระจายอยู่ทั่ว codebase โดยไม่มีใครตั้งใจ และการเคลื่อนไหวจะเริ่มไม่สม่ำเสมอในแบบที่หาต้นตอไม่ได้ — สองค่าครอบคลุมกรณีที่มีจริง (ตามนิ้ว กับ layout shift) และการบังคับให้เพิ่มเข้า preset ทำให้ทุกค่าใหม่ต้องผ่านการอธิบายเหตุผล

### ทำไมต้องยกเว้น progress bar และ spinner ใน reduced motion
เพราะเจตนาของ SC 2.3.3 และของ `prefers-reduced-motion` คือลดการเคลื่อนไหวที่ **ไม่จำเป็น** ไม่ใช่ตัดข้อมูล progress bar ที่บอกว่าอัปโหลดไปแล้ว 60% เป็นการเคลื่อนไหวที่สื่อข้อมูลซึ่งหาจากที่อื่นไม่ได้ และเป็นพื้นที่เล็กที่ไม่กระตุ้นระบบทรงตัว

ถ้าตัดออก ผู้ใช้ที่เปิด reduced motion จะไม่รู้ว่าการยื่นเอกสารขอสินเชื่อคืบหน้าไปถึงไหน ซึ่งแย่กว่าปัญหาที่พยายามแก้ — แต่ยกเว้นนี้จำกัดที่ **พื้นที่เล็กและสื่อข้อมูล** เท่านั้น ไม่ใช่ข้ออ้างให้ animation ตกแต่งรอด

### ทำไมต้องห้าม typewriter effect เป็นพิเศษ
เพราะเป็น pattern ที่นิยมและดูเหมือนไม่มีอันตราย แต่ **พังเฉพาะกับภาษาไทย** อักษรไทยหนึ่งตัวประกอบจากหลาย code point (ที่ = ท + ี + ่) การเปิดเผยทีละ code point จะเห็นสระและวรรณยุกต์ลอยอยู่ก่อนพยัญชนะ ซึ่งดูเหมือนฟอนต์เสียหรือระบบพัง ไม่ใช่ effect

และเพราะภาษาไทยไม่มีช่องว่างระหว่างคำ การ reveal ทีละคำก็ไม่มีจุดตัดตามธรรมชาติ — เป็นข้อจำกัดที่ไม่มีใน design system ภาษาอังกฤษ จึงต้องเขียนไว้ให้ชัด ไม่ใช่หวังว่าใครจะสังเกตเอง

### ทำไม `!important` ได้รับการยกเว้นที่นี่
ข้อ 01 ห้าม `!important` ทุกกรณี แต่ block `prefers-reduced-motion` ต้องชนะ **inline style ที่ Framer Motion เขียนเข้า DOM ตอน runtime** ซึ่งมี specificity สูงสุดและไม่มีทางเอาชนะด้วย selector ปกติ

การไม่ยกเว้นจะทำให้ผู้ใช้ที่เปิด reduced motion ยังได้รับการเคลื่อนไหวจาก Framer อยู่ ซึ่งเป็นการไม่ผ่าน SC 2.3.3 จริง — จึงเป็นการยกเว้นที่ **มีเหตุผลด้านการเข้าถึงรองรับ** และถูกจำกัดอยู่ใน block เดียวที่ระบุไว้ในเอกสาร ไม่ใช่การเปิดช่องให้ใช้ทั่วไป

---

**ถัดไป:** `08-breakpoints.md` — breakpoints 640/768/1024/1280/1536 · grid 4/8/12 คอลัมน์ · container 1280 · และพื้นล่าง 360px ที่ข้อ 11 กำหนด
