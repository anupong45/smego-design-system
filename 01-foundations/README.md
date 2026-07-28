# SME.GO Design System — 01 Foundations

ชั้นรากฐาน (Foundation layer) ของ SME.GO Marketplace — แพลตฟอร์มตลาดกลางที่รัฐสนับสนุน ช่วย SME ไทยเข้าถึงสินค้า บริการ แหล่งทุน การอบรม ซัพพลายเออร์ ผู้ซื้อ และโครงการภาครัฐ

ชั้นนี้ **ไม่มี React component** — เป็นการกำหนด "กฎ" และ "ค่า" ที่ทุกชั้นถัดไปต้องอ้างอิง

---

## สถานะ / Status

| # | Section | ไฟล์ | สถานะ |
|---|---|---|---|
| 01 | Brand Principles | [`01-brand.md`](01-brand.md) | ✅ เสร็จ |
| 02 | Color System | [`02-color.md`](02-color.md) | ✅ เสร็จ |
| 03 | Typography | [`03-typography.md`](03-typography.md) | ✅ เสร็จ |
| 04 | Spacing | [`04-spacing.md`](04-spacing.md) | ✅ เสร็จ |
| 05 | Radius | [`05-radius.md`](05-radius.md) | ✅ เสร็จ |
| 06 | Shadow & Elevation | [`06-shadow.md`](06-shadow.md) | ✅ เสร็จ |
| 07 | Motion | [`07-motion.md`](07-motion.md) | ✅ เสร็จ |
| 08 | Breakpoints & Grid | [`08-breakpoints.md`](08-breakpoints.md) | ✅ เสร็จ |
| 09 | Iconography | [`09-iconography.md`](09-iconography.md) | ✅ เสร็จ |
| 10 | Accessibility Rules | [`10-accessibility.md`](10-accessibility.md) | ✅ เสร็จ |

**✅ ชั้น Foundation เสร็จสมบูรณ์ทั้ง 10 ข้อ** — ผลการตรวจความสอดคล้องข้ามทุกข้ออยู่ใน [`10-accessibility.md` §9](10-accessibility.md)

| ผลการตรวจ | จำนวน |
|---|---|
| ความขัดแย้งระหว่างกฎที่ถูกทั้งคู่ | **3** จุด — แก้และบันทึกแล้ว |
| ค่าที่ต่างจากที่ล็อกไว้ตอนต้น | **8** จุด — มีเหตุผลกำกับทุกจุด |
| กฎที่พึ่งพากันข้ามข้อ (ห้ามแก้ข้างเดียว) | **8** รายการ |
| ความเสี่ยงที่ยอมรับไว้ | **7** ข้อ |

---

## ข้อกำหนดที่ล็อกแล้ว / Locked constraints

ค่าเหล่านี้ตัดสินแล้ว ทุก section ต้องสอดคล้อง ห้ามขัดแย้ง

| หัวข้อ | ค่าที่ล็อก |
|---|---|
| **ลำดับแพ้ชนะของหลักการ** | [`DESIGN-PRINCIPLES.md`](../DESIGN-PRINCIPLES.md) ระดับ root — **A1–A5 Constraints ไม่แพ้ข้อใด · B1–B4 Principles ข้อบนชนะ** · เมื่อสองหลักขัดกัน ตัดสินที่ไฟล์นั้น ไม่ใช่ที่ข้อ 01 |
| ภาษาหลัก | ไทยเป็นหลัก อังกฤษเป็นรอง — type scale สร้างบน metric ของอักษรไทย |
| ฟอนต์ | **Anuphan** (Thai + Latin, variable) · **IBM Plex Mono** สำหรับ Code เท่านั้น · น้ำหนัก 400/500/600/700 |
| Type base | 16px · line-height **1.750** (28px — ปรับจาก 1.70 ให้อยู่บน 4px grid) · **พื้นต่ำสุด 13px** · **อัตราส่วน line-height ต่ำสุด 1.333** ทุก token |
| ตัวเลข | Anuphan ตัวเลข 0–9 กว้าง **600/1000 em เท่ากันหมด** (ตรวจจากไฟล์) — ไม่มี `tnum` แต่ไม่ต้องใช้ · **ห้ามใช้เลขไทย ๐–๙ ในคอลัมน์** (กว้างต่างกัน 36.6% em) |
| ข้อห้ามไทย | ห้าม `italic` (Anuphan ไม่มี) · ห้าม `uppercase` · ห้าม `letter-spacing` กับข้อความไทย · `lang="th"` เป็นข้อบังคับ |
| สีแบรนด์ | `primary-600` = **#0077C1** (วัดได้ 4.76:1 บนพื้นขาว) |
| Secondary | ทองอมส้ม hue 36° `gold-500 = #EC9513` — **brand accent เท่านั้น ห้ามใช้เป็นสถานะ** · ต้องใช้ตัวอักษร `neutral-950` |
| Warning | เหลือง-อำพัน hue 48° `warning-500 = #F2C40D` — **fill-only** ตัวอักษรต้องเป็น `warning-800` ขึ้นไป |
| Info | alias ทับ Primary — **ใช้เป็น tint เท่านั้น ห้ามเป็นพื้นทึบ** |
| ขอบ input | `neutral-500` **เท่านั้น** (4.20:1 ผ่าน SC 1.4.11) — `neutral-300` ที่ 1.56:1 ไม่ผ่าน |
| Neutral | โทนเย็นเกือบกลาง hue ~220 · saturation จำกัด 4–12% |
| Elevation | 2 กลไกใต้ token ชุดเดียว · **component อ้าง `--elevation-*` เท่านั้น ห้ามอ้าง `--shadow-*`** · light = เงา + ขอบ 1px · **dark = ขอบรับน้ำหนักจริง** (พื้นผิวห่างกันแค่ 1.14:1) overlay/modal ต้องใช้ขอบ `neutral-500` |
| เงาใน grid | **card ตอนพักไม่มีเงา มีแค่ขอบ** — เงาโผล่ตอน hover/focus-within (performance + hover ชัดกว่า) |
| Radius | 0 · 4 · 6 · 8 · 12 · 16 · 24 · full — ปุ่ม/input **8** · card **12** · overlay **16** · `full` เฉพาะ chip/badge/avatar/dot · **Figma corner smoothing = 0%** (CSS ไม่มี squircle) |
| Radius ซ้อน | `radius ใน = radius นอก − padding` — ทุกคู่ตกบนขั้นจริงของ scale พอดี · ไม่ต้องคำนวณถ้า padding ≥ radius นอก |
| `overflow: hidden` | **ห้ามอยู่บน ancestor ของ focusable element** — focus ring ล้น 4px จะถูกตัด ไม่ผ่าน SC 2.4.7 |
| Breakpoints | 640 / 768 / 1024 / 1280 / 1536 (ตรงกับ Tailwind, หน่วย `rem`) · container 1280 · grid 4/8/12 |
| สองพื้นที่ต่างกัน | **360px = พื้นออกแบบ** (ออกแบบ/ทดสอบเริ่มที่นี่) · **320px = พื้นข้อกำหนด** ต้องใช้งานได้ ไม่มี horizontal scroll (SC 1.4.10 · เกิดจากซูม 400% บนจอ 1280) |
| SC 2.4.11 | `--header-height` และ `--bottom-inset` **ต้องเป็น token** เพราะ `scroll-margin-top/-bottom` ของทุก focusable อ้างค่านี้ — แถบล่างก็ทับ focus ได้เหมือน header · `--bottom-inset` รวมทุกแถบด้วย `calc()` |
| Motion | 0 / 150 / 250 / 400 / 600ms + easing 4 ตัว — duration+easing เป็นภาษาหลัก, Framer เป็นตัวรอง |
| Icon | Lucide เท่านั้น · stroke **ผูกกับขนาด** 16/1.5 · 20/1.75 · 24/2 · 32/2.5 · 48/2.5 · บังคับผ่าน `<Icon>` wrapper (ไม่มี prop override) + `no-restricted-imports` |
| ขนาดไอคอน | เลือกจาก **font-size** ไม่ใช่ line-height — 13px→16 · 16px→20 · 20px→24 · ไอคอน 16px ที่กดได้ต้องมี padding 4px |
| Contrast ไอคอน | 3:1 ตามข้อกำหนด แต่ **16px ควรใช้ ≥4.5:1** (stroke 1.5px บางกว่าตัวอักษร) · `warning-500` **ห้ามเป็นสีไอคอน** (1.66:1) · โหมดมืดใช้ขั้น 400 ทุกสี |
| Focus ring | วงแหวน 2 ชั้นแบบไม่มีเงื่อนไข · `:focus-visible` เท่านั้น |
| Spacing | 4px grid · ประกาศ `--spacing: 0.25rem` บรรทัดเดียว ใช้เลขของ Tailwind เป็นภาษากลาง · ค่าอนุมัติ `{0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32}` · **2px ใช้ได้เฉพาะ focus ring** |
| Touch target | **24×24 CSS px ขั้นต่ำ** — เป้า 24×24 ผ่าน SC 2.5.8 โดยตรง ไม่ต้องตรวจระยะห่าง · ภาระที่แท้จริงคือ **ห้ามมีเป้าเล็กกว่า 24px** (ไอคอน 16px ต้องมี padding ≥ 4px) |
| Reduced motion | ตัดการเคลื่อนที่ · **คง opacity crossfade ไว้** · ยกเว้น progress bar และ spinner (สื่อข้อมูล พื้นที่เล็ก) · **`!important` ใน block นี้เป็นข้อยกเว้นเดียวของระบบ** เพราะต้องชนะ inline style ของ Framer |
| ข้อห้าม motion | **ห้าม typewriter/reveal ทีละอักขระกับข้อความไทย** (สระ+วรรณยุกต์ลอยก่อนพยัญชนะ) · **ห้ามนับตัวเลขขึ้น** · animate ได้แค่ `transform` + `opacity` |
| Tailwind | **v4, CSS-first** — primitives ใน `:root`, semantics ใน `@theme` |
| มาตรฐาน | **WCAG 2.2 ระดับ AA** — รวมเกณฑ์ใหม่ 4 ข้อที่กระทบตรง: **2.4.11** focus ไม่ถูกทับ · **2.5.7** ทุกอย่างที่ลากได้ต้องมีปุ่ม · **3.3.7** ห้ามขอข้อมูลซ้ำ · **3.3.8 ต้องวางลงช่อง OTP และรหัสผ่านได้** |
| กฎเฉพาะภาษาไทย | ห้าม single-character shortcut (สลับ layout ไทย-อังกฤษ) · ห้ามตรวจฟอร์มระหว่าง IME composition · `aria-label` ต้องเป็นไทยและมีข้อความที่แสดงอยู่รวมด้วย · หลีกเลี่ยงคำย่อใน `aria-label` (TTS ไทยอ่าน "ภ.พ.30" ไม่ดี) |

---

## โครงสร้างเอกสารแต่ละ section / Per-file structure

ทุกไฟล์เรียงลำดับเหมือนกัน เพื่อให้หาข้อมูลได้เร็ว

1. ภาพรวม (ไทย)
2. ตารางข้อกำหนด (ค่าเป็นอังกฤษ)
3. 🎨 **Designer Notes**
4. 💻 **Developer Notes**
5. **Figma Variables**
6. **Tailwind v4 Mapping**
7. **Design Token Example**
8. 🧠 **Decision Rationale**

**หลักการเขียน:** คำอธิบายและเหตุผลเป็นภาษาไทย · ชื่อ token, โค้ด, ค่า HEX/RGB, class ของ Tailwind, path ของ Figma **เป็นภาษาอังกฤษทั้งหมด** เพราะต้องตรงกับ codebase ตัวอักษรต่อตัวอักษร

---

## ชั้นถัดไป / Next layers

| Layer | ขอบเขต |
|---|---|
| 02 Design Tokens | `tokens.json` (DTCG) · CSS Variables 3 ชั้น · `theme.css` · Figma Variables · Dark Mode · Naming Convention |
| 03 React UI Library | Inputs · Navigation · Feedback · Data Display · Marketplace · Layout |
| 04 Marketplace Pattern | ✅ **สร้างแล้ว** — [`04-patterns/`](../04-patterns/README.md) · เลือกการ์ด · ความน่าเชื่อถือ · เงินและภาระผูกพัน · กริดรายการ |
| 05 Templates | หน้าตั้งต้นสำหรับแต่ละ domain |
| 06 Documentation | คู่มือการใช้งานและ governance |
| 07 Tailwind Theme | ชุด preset พร้อมใช้ |

---

## หมายเหตุเรื่องเอกสารอ้างอิง / Note on the Astryx reference

เอกสารชุดนี้ใช้สถาปัตยกรรม token 3 ชั้น (primitive → semantic → component) ตามรูปแบบ DTCG และโครงสร้างเอกสารมาตรฐานของ design system ระดับ production

**ข้อจำกัดที่ต้องระบุตรง ๆ:** ยังไม่ได้อ่านเอกสารต้นฉบับของ @astryxdesign จึงเรียกว่า *"แนวทาง Astryx-style"* ไม่ใช่การอ้างว่าตรงตามสเปกจริงของเขา — หากมีเอกสารต้นฉบับ ส่งมาได้ จะปรับให้ตรงตามนั้น

ส่วน **visual language ทั้งหมดเป็นของ SME.GO เอง** ไม่ได้ลอกจากที่ใด
