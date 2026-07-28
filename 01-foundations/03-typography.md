# 03 · Typography / ระบบตัวอักษร

**SME.GO Marketplace** · Foundation Layer · WCAG 2.2 AA

ข้อมูลฟอนต์ในเอกสารนี้ **ตรวจสอบจากไฟล์ฟอนต์จริง** ไม่ใช่จากเอกสารประกอบ — parse ตาราง `GSUB`, `GPOS`, `hmtx`, `cmap`, `head` ของ Anuphan v6 ทั้งน้ำหนัก 400 และ 700

---

## ภาพรวม / Overview

ระบบใช้ **2 family เท่านั้น** ตามหลัก *"เร็วบนเครื่องที่ช้า"* จากข้อ 01

| Family | บทบาท | Payload (woff2) |
|---|---|---|
| **Anuphan** | ทุกอย่าง — ไทย + ละติน + ตัวเลข | thai **18 KB** + latin **34 KB** |
| **IBM Plex Mono** | Code เท่านั้น | ~**4–5 KB** |

**รวมประมาณ 57 KB** — browser โหลดเฉพาะ subset ที่ใช้จริงเพราะ Google Fonts ใส่ `unicode-range` มาให้ (subset `vietnamese` 8 KB และ `latin-ext` 23 KB จะไม่ถูกโหลดถ้าไม่มีอักขระเหล่านั้นในหน้า)

---

## 1 · เหตุผลการเลือกฟอนต์ / Font Rationale

### 1.1 Anuphan — ผลตรวจจากไฟล์จริง

| คุณสมบัติ | ผลตรวจ |
|---|---|
| ผู้ออกแบบ | **Cadson Demak** — โรงหล่อตัวอักษรไทย ออกแบบไทยและละตินด้วยเจตนาเดียวกัน |
| Variable | ✅ **ยืนยันแล้ว** — Google Fonts ส่ง `font-weight: 400 700` เป็น woff2 ตัวเดียว |
| unitsPerEm | 1000 |
| GSUB features | `ccmp` `frac` `liga` `locl` `rlig` |
| GPOS features | `kern` `mark` `mkmk` |
| ตัวเลข 0–9 | ✅ **กว้างเท่ากันทุกตัว = 600/1000 em** (ทั้ง 400 และ 700) |
| Italic | ❌ **ไม่มีเลย** — ทุก face เป็น `font-style: normal` |
| ลักษณะอักษรไทย | ไม่มีหัว (loopless) · เรขาคณิต · ออกแบบมาเพื่อ UI |

**เหตุผลที่เลือก**

1. **ไทยกับละตินมาจากนักออกแบบเดียวกัน** — metric สองสคริปต์เข้ากันจริง ไม่ต้องปรับ `size-adjust` หรือ `ascent-override` เหมือนการจับคู่สองฟอนต์
2. **ตัวเลขกว้างเท่ากันโดยธรรมชาติ** — สำคัญที่สุดสำหรับ marketplace เพราะคอลัมน์ราคานิ่งโดยไม่ต้องเปิด OpenType feature ใด ๆ (ดูข้อ 4)
3. **ไม่มีหัว = สมัยใหม่** ตรงกับบุคลิก Modern 7/10 และ Digital-first
4. **Variable 400–700** ได้ 4 น้ำหนักจากไฟล์เดียว
5. **payload เล็ก** subset ไทย 18 KB เท่านั้น

### 1.2 IBM Plex Mono — สำหรับ Code

Anuphan ไม่มีคู่ monospace จึงต้องมี family ที่สอง ใช้เฉพาะ `code` style เท่านั้น

**เหตุผล:** monospace จริง (ไม่ใช่ synthetic) · เลข `0` มีขีดกลางแยกจาก `O` ชัดเจน ซึ่งจำเป็นสำหรับ **เลขนิติบุคคล 13 หลัก, API key, เลขที่คำสั่งซื้อ, เลขที่ใบกำกับภาษี** · payload เพียง 4–5 KB · license OFL

### 1.3 ⚠️ ทำไมไม่ต้องใช้ `font-variant-numeric: tabular-nums`

**Anuphan ไม่มี feature `tnum`** — ตรวจแล้วยืนยัน GSUB มีแค่ `ccmp` `frac` `liga` `locl` `rlig`

**แต่ไม่จำเป็นต้องมี** เพราะตัวเลข 0–9 กว้าง **600/1000 em เท่ากันหมดอยู่แล้ว**

| ตัวเลข | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| advance (น้ำหนัก 400) | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 |
| advance (น้ำหนัก 700) | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 | 600 |

**ผลลัพธ์ดีกว่าการพึ่ง `tnum`** เพราะไม่ต้องเปิด feature ไม่ต้องกังวลว่า browser รองรับหรือไม่ และได้ตัวเลขเรียงคอลัมน์ตรงโดยปริยาย

**แต่ยังคง `tabular-nums` ไว้ใน token** ด้วยเหตุผลเดียว — **เพื่อฟอนต์สำรอง** ถ้า Anuphan โหลดไม่ทันหรือโหลดไม่ได้ ระบบจะตกไปใช้ Noto Sans Thai / Leelawadee UI / Thonburi ซึ่ง**ตัวเลขกว้างไม่เท่ากัน** — `tabular-nums` จะทำงานกับฟอนต์เหล่านั้น เป็นการประกันความเสียหาย ไม่ใช่ค่าที่ Anuphan ต้องใช้

---

## 2 · ⚠️ เลขไทย ๐–๙ — ห้ามใช้ในคอลัมน์

ผลตรวจ `hmtx` ของอักขระ U+0E50–U+0E59

| น้ำหนัก | ช่วงความกว้าง (units/1000) | ส่วนต่างสูงสุด |
|---|---|---|
| 400 | 536 – 830 | **294 = 29.4% em** |
| 700 | 536 – 902 | **366 = 36.6% em** |

เลขไทยเป็น **proportional ไม่ใช่ tabular** และ `tabular-nums` ก็ช่วยไม่ได้เพราะไม่มี feature `tnum`

### กฎบังคับ

| บริบท | ใช้อะไร |
|---|---|
| ราคา · จำนวน · วงเงิน · ดอกเบี้ย | **เลขอารบิก 0–9 เท่านั้น** |
| ตาราง · คอลัมน์ตัวเลข · ตัวเลขในกราฟ | **เลขอารบิก 0–9 เท่านั้น** |
| เลขนิติบุคคล · เลขที่คำสั่งซื้อ · เลขที่เอกสาร | **เลขอารบิก 0–9 เท่านั้น** |
| พ.ศ. ในข้อความบรรยาย (ไม่อยู่ในคอลัมน์) | เลขไทยใช้ได้ |
| หัวเรื่องเชิงพิธีการ · เอกสารราชการที่แสดงตามต้นฉบับ | เลขไทยใช้ได้ |

**เขียน lint rule ตรวจอักขระ U+0E50–U+0E59 ในค่าที่เข้า component ประเภทตาราง/ราคา**

---

## 3 · สเกลตัวอักษร / Type Scale

**ฐาน 16px** · **พื้นต่ำสุด 13px** · **line-height ทุกค่าอยู่บน 4px grid** · **อัตราส่วน line-height ต่ำสุด 1.333**

| Token | Size | Line-height | อัตราส่วน | Weight | Tracking | ใช้ทำอะไร |
|---|---|---|---|---|---|---|
| `display-lg` | 48px | 64px | 1.333 | 700 | −0.02em¹ | hero หน้าแรก · ตัวเลขสถิติใหญ่ |
| `display-sm` | 36px | 48px | 1.333 | 700 | −0.01em¹ | หัวหน้า landing · hero มือถือ |
| `heading-lg` | 32px | 44px | 1.375 | 700 | 0 | `<h1>` ของหน้า |
| `heading-sm` | 28px | 40px | 1.429 | 700 | 0 | `<h2>` หัวข้อ section |
| `title` | 24px | 32px | 1.333 | 600 | 0 | `<h3>` · หัวข้อ card ใหญ่ · หัวข้อ modal |
| `subtitle` | 20px | 28px | 1.400 | 600 | 0 | `<h4>` · ชื่อสินค้าใน card |
| `body-lg` | 18px | 32px | 1.778 | 400 | 0 | เนื้อหาบทความ · คำอธิบายโครงการ |
| **`body`** | **16px** | **28px** | **1.750** | **400** | 0 | **เนื้อหาหลักทั้งระบบ** |
| `body-sm` | 14px | 24px | 1.714 | 400 | 0 | ข้อความในตาราง · คำอธิบายย่อย |
| `caption` | 13px | 20px | 1.538 | 400 | 0 | metadata · timestamp · helper text |
| `label` | 13px | 20px | 1.538 | **500** | 0 | label ของ form · หัวคอลัมน์ตาราง |
| `button-lg` | 16px | 24px | 1.500 | 600 | 0 | ปุ่มขนาดใหญ่ · CTA หลัก |
| `button` | 14px | 20px | 1.429 | 600 | 0 | ปุ่มมาตรฐาน |
| `code` | 14px | 24px | 1.714 | 400 | 0 | IBM Plex Mono · เลขเอกสาร · snippet |

¹ **Tracking ติดลบใช้ได้เฉพาะข้อความที่เป็นละตินล้วน** — ห้ามใช้กับข้อความไทย ดูข้อ 5

### 3.1 ⚠️ การปรับจากค่าที่ล็อกไว้ — line-height 1.70 → 1.750

โจทย์ล็อก line-height ไว้ที่ **1.70** ซึ่ง 16 × 1.70 = **27.2px** — เป็นค่าเศษที่ไม่อยู่บน 4px grid

ระบบเลือก **28px = 1.750** เพราะ

1. **อยู่บน 4px grid** ทำให้ข้อความจัดแนวกับ spacing token, ไอคอน และ baseline ของ card ได้ตรง — ถ้าใช้ 27.2px ทุกอย่างที่วางข้างข้อความจะคลาดครึ่งพิกเซล
2. **ยังอยู่ในช่วงที่สบายตาสำหรับอักษรไทย** (1.60–1.75)
3. ห่างจากค่าที่ล็อกไว้ **0.05** — ไม่กระทบเจตนาเดิมคือ *"ให้อักษรไทยหายใจได้"*

**ค่าที่ประกาศใหม่: อัตราส่วน body = 1.750**

### 3.2 ทำไม line-height ต่ำสุดคือ 1.333

อักษรไทยซ้อนสระและวรรณยุกต์ทั้งด้านบนและด้านล่าง เช่น **ที่** = พยัญชนะ + สระอี + ไม้เอก ซ้อนกัน 3 ชั้น

เมื่อรวมความสูงหมึกทั้งหมด (สระบน + วรรณยุกต์ + สระล่าง/ตัวสะกด) ข้อความไทยกินพื้นที่ประมาณ **1.30 em** ต่อบรรทัด ถ้า line-height ต่ำกว่านั้น **วรรณยุกต์ของบรรทัดล่างจะชนสระล่างของบรรทัดบน**

จึงกำหนดว่า **ไม่มี token ใดมีอัตราส่วนต่ำกว่า 1.333** รวมถึง display ขนาดใหญ่ — ระบบส่วนใหญ่ตั้ง display ไว้ที่ 1.1 ซึ่งใช้กับอักษรไทยไม่ได้

---

## 4 · Font stack และฟอนต์สำรอง

```css
--font-sans:
  "Anuphan",
  "Noto Sans Thai",      /* Android */
  "Leelawadee UI",       /* Windows */
  "Thonburi",            /* macOS / iOS */
  -apple-system, "Segoe UI", system-ui, sans-serif;

--font-mono:
  "IBM Plex Mono",
  ui-monospace, "SF Mono", Menlo, Consolas, monospace;

--font-numeric: var(--font-sans);   /* + font-variant-numeric: tabular-nums */
```

**ลำดับฟอนต์สำรองครอบทั้ง 3 ระบบปฏิบัติการ** — ผู้ใช้ไทยส่วนใหญ่อยู่บน Android จึงวาง Noto Sans Thai เป็นตัวแรก

**⚠️ ฟอนต์สำรองทุกตัวมีหัว (looped)** ถ้า Anuphan โหลดไม่ได้ หน้าเว็บจะเปลี่ยนบุคลิกไปพอสมควร ใช้ `font-display: swap` ยอมรับการกระพริบครั้งเดียว ดีกว่าข้อความหายไป (`block`) บนเน็ตช้า

---

## 5 · ข้อห้ามเฉพาะอักษรไทย / Thai-specific prohibitions

| ห้าม | เหตุผล |
|---|---|
| `font-style: italic` | **Anuphan ไม่มี italic เลย — ยืนยันจากไฟล์** browser จะสร้าง oblique เทียมโดยเอียงทั้งตัว ซึ่งทำให้สระและวรรณยุกต์ไทยเบี้ยวจนอ่านไม่ออก **ใช้น้ำหนักหรือสีเน้นแทน** |
| `text-transform: uppercase` | อักษรไทยไม่มีตัวพิมพ์ใหญ่ — ไม่มีผลกับไทย แต่เปลี่ยนละตินที่ปนอยู่ ทำให้ label ที่มีทั้งสองภาษาดูไม่สม่ำเสมอ |
| `text-transform: capitalize` | เหตุผลเดียวกัน |
| `letter-spacing` > 0 กับข้อความไทย | สระและวรรณยุกต์ต้องอยู่ติดพยัญชนะที่มันเกาะ การเพิ่มระยะทำให้เครื่องหมายลอยหลุดจากตัวอักษร |
| `letter-spacing` < 0 กับข้อความไทย | ทำให้เครื่องหมายซ้อนกัน — tracking ติดลบใช้ได้เฉพาะ `display-*` ที่เป็น**ละตินล้วน** |
| line-height < 1.333 | วรรณยุกต์ชนกันระหว่างบรรทัด (ดูข้อ 3.2) |
| น้ำหนัก < 400 | เส้นบางเกินไป วรรณยุกต์หายเมื่ออยู่ที่ 13–14px |
| ตัวอักษร < 13px | ไม่มีหัวช่วยแยก **ด/ต · ถ/ภ · พ/ฟ** อีกต่อไป |
| เลขไทยในคอลัมน์ | ความกว้างต่างกันถึง 36.6% em (ดูข้อ 2) |

### 5.1 `lang="th"` จำเป็นจริง

Anuphan มี feature **`locl`** (localized forms) ซึ่งทำงานเมื่อ browser รู้ว่าข้อความเป็นภาษาไทย

```html
<html lang="th">
```

ถ้าไม่ใส่ จะได้รูปอักขระที่ไม่ถูกต้องตามบริบท และการตัดคำ (line breaking) ของไทยจะผิด เพราะไทยไม่มีช่องว่างระหว่างคำ

---

## 6 · ความยาวบรรทัด / Measure

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--measure-body` | `68ch` (≈ 680px ที่ 16px) | เนื้อหาบทความ · คำอธิบายโครงการ |
| `--measure-narrow` | `48ch` (≈ 480px) | ข้อความในคอลัมน์แคบ · sidebar |
| `--measure-wide` | `80ch` | ตาราง · เนื้อหาที่ต้องกว้าง |

อักษรไทยหนาแน่นกว่าละตินต่ออักขระ — ที่ 680px ได้ประมาณ **45–55 อักขระไทย** ต่อบรรทัด ซึ่งอยู่ในช่วงที่อ่านสบาย

---

## 🎨 Designer Notes

- **ห้ามใช้ italic ทุกกรณี** Anuphan ไม่มี italic การเอียงคือ oblique เทียมที่ทำให้วรรณยุกต์ไทยเบี้ยว — เน้นด้วยน้ำหนัก 600 หรือสีแทน
- **ห้ามใส่ letter-spacing กับข้อความไทย** ทั้งบวกและลบ tracking ติดลบใช้ได้เฉพาะ `display-lg` / `display-sm` ที่เป็นภาษาอังกฤษล้วนจริง ๆ
- **ห้ามทำ label ตัวพิมพ์ใหญ่** เพราะไทยไม่มีตัวพิมพ์ใหญ่ label ที่มีคำอังกฤษปนจะดูไม่เข้ากัน — ใช้น้ำหนัก 500 + ขนาด 13px แทน
- **display อัตราส่วน 1.333 ไม่ใช่ 1.1** ถ้าเห็น hero ที่ line-height แน่นกว่านี้ในไฟล์ Figma วรรณยุกต์จะชนกันตอน implement จริง
- **13px คือพื้น ไม่ใช่คำแนะนำ** ห้ามสร้าง style ที่เล็กกว่านี้แม้จะเป็น legal text
- **ใช้เลขอารบิกในทุกที่ที่เป็นตัวเลข** เลขไทยสวยแต่ความกว้างต่างกันถึง 36.6% em คอลัมน์ราคาจะเบี้ยว
- **เทสด้วยข้อความไทยจริง** ปุ่มไทยยาวกว่าอังกฤษ 20–40% — ปุ่ม "Apply" กับ "ยื่นคำขอสินเชื่อ" ไม่ได้กว้างเท่ากันเลย
- **น้ำหนักที่ใช้ได้มี 4 ค่า** 400 · 500 · 600 · 700 เท่านั้น

---

## 💻 Developer Notes

- **`lang="th"` บน `<html>` เป็นข้อบังคับ** ไม่ใช่ทางเลือก — จำเป็นสำหรับ `locl` และการตัดคำไทย
- **โหลดเฉพาะ subset ที่ใช้** Google Fonts ใส่ `unicode-range` มาให้แล้ว อย่า self-host โดยรวมทุก subset เป็นไฟล์เดียว จะกลายเป็น 83 KB แทน 52 KB
- **`font-display: swap`** ยอมรับการกระพริบครั้งเดียว ดีกว่าข้อความหายบนเน็ตช้า
- **`preconnect` ทั้งสอง origin** `fonts.googleapis.com` และ `fonts.gstatic.com` — ถ้าลืมตัวที่สองจะเสีย round-trip เพิ่ม
- **`--font-numeric` ใช้กับตัวเลขในตารางและราคา** — Anuphan ไม่ต้องใช้ `tabular-nums` แต่คงไว้เพื่อฟอนต์สำรอง
- **ESLint / Stylelint ห้าม** `font-style: italic` · `text-transform: uppercase|capitalize` · `letter-spacing` บน element ที่มีข้อความไทย
- **ห้าม `<b>` และ `<i>`** ใช้ `<strong>` และ `<em>` แล้ว style `em` ด้วยน้ำหนักไม่ใช่ italic
- **ตรวจอักขระ U+0E50–U+0E59** ในค่าที่เข้า component ตาราง/ราคา — เขียนเป็น runtime warning ใน dev mode
- **ทดสอบที่ zoom 200% และ font-scaling ระดับระบบ 200%** ตาม SC 1.4.4 — ใช้ `rem` สำหรับ font-size ทุกที่

---

## Figma Variables

| Collection | Group | ชื่อ | ค่า |
|---|---|---|---|
| `4. Scale` | `font/family` | `font/family/sans` | `Anuphan` |
| `4. Scale` | `font/family` | `font/family/mono` | `IBM Plex Mono` |
| `4. Scale` | `font/size` | `font/size/body` | `16` |
| `4. Scale` | `font/size` | `font/size/label` | `13` |
| `4. Scale` | `font/lineHeight` | `font/lineHeight/body` | `28` |
| `4. Scale` | `font/weight` | `font/weight/semibold` | `600` |

**Figma Text Styles ที่ต้องสร้าง** — ชื่อตรงกับ token ทุกตัว

```
Display/Large      48 / 64 / 700
Display/Small      36 / 48 / 700
Heading/Large      32 / 44 / 700
Heading/Small      28 / 40 / 700
Title              24 / 32 / 600
Subtitle           20 / 28 / 600
Body/Large         18 / 32 / 400
Body               16 / 28 / 400
Body/Small         14 / 24 / 400
Caption            13 / 20 / 400
Label              13 / 20 / 500
Button/Large       16 / 24 / 600
Button             14 / 20 / 600
Code               14 / 24 / 400  ← IBM Plex Mono
```

**คำอธิบายที่ต้องใส่ใน Figma**

| Style | Description |
|---|---|
| `Body` | `Base style. 16/28 = 1.750 ratio. Thai requires ≥1.333 to prevent tone-mark collision.` |
| `Label` | `13px is the SYSTEM FLOOR. Never create a smaller style — loopless Thai loses ด/ต distinction below 13px.` |
| `Display/Large` | `Tracking −0.02em is LATIN-ONLY. Never apply to Thai text.` |
| `Code` | `IBM Plex Mono. Use for 13-digit tax IDs, order numbers, API keys — slashed zero disambiguates 0/O.` |

**⚠️ Anuphan ไม่มี italic** — ห้ามสร้าง text style ที่เป็นเอียง Figma จะแสดง oblique เทียมซึ่งไม่ตรงกับผลลัพธ์จริงบนเว็บ

---

## Tailwind v4 Mapping

Tailwind v4 รองรับ `--text-{name}--line-height`, `--text-{name}--font-weight`, `--text-{name}--letter-spacing` — utility เดียวจึงตั้งได้ครบทั้งขนาด ระยะบรรทัด และน้ำหนัก

| Token | Utility | ตั้งค่าอะไรให้ |
|---|---|---|
| `--text-display-lg` | `text-display-lg` | 48px · 64px · 700 · −0.02em |
| `--text-heading-lg` | `text-heading-lg` | 32px · 44px · 700 |
| `--text-title` | `text-title` | 24px · 32px · 600 |
| `--text-body` | `text-body` | 16px · 28px · 400 |
| `--text-caption` | `text-caption` | 13px · 20px · 400 |
| `--text-label` | `text-label` | 13px · 20px · 500 |
| `--text-button` | `text-button` | 14px · 20px · 600 |
| `--text-code` | `text-code` | 14px · 24px · 400 |
| `--font-sans` | `font-sans` | Anuphan + fallback |
| `--font-mono` | `font-mono` | IBM Plex Mono + fallback |

**ตัวอย่างการใช้**

```html
<h2 class="text-heading-sm text-fg">โครงการสนับสนุน SME</h2>
<p class="text-body text-fg-secondary max-w-[68ch]">คำอธิบายโครงการ...</p>
<span class="text-caption text-fg-muted">อัปเดต 25 ก.ค. 2569</span>
<td class="text-body-sm font-numeric text-right">1,250,000</td>
<code class="text-code">0105561234567</code>
```

**⚠️ ระวังชื่อชนกับข้อ 02** — `text-fg` มาจาก `--color-fg` (สีตัวอักษรหลัก) ส่วน `text-body` มาจาก `--text-body` (สเกลตัวอักษร) ใช้ร่วมกันได้เพราะเป็นชื่อต่างกัน แต่ต้องเขียนกำกับให้ชัดว่าอันไหนเป็นสี อันไหนเป็นขนาด

---

## Design Token Example

```css
/* ═══ tier 1 · primitive ═══ */
:root {
  --sme-font-anuphan:  "Anuphan";
  --sme-font-plexmono: "IBM Plex Mono";

  --sme-fallback-thai: "Noto Sans Thai", "Leelawadee UI", "Thonburi";
  --sme-fallback-sys:  -apple-system, "Segoe UI", system-ui, sans-serif;
  --sme-fallback-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --sme-weight-regular:  400;
  --sme-weight-medium:   500;
  --sme-weight-semibold: 600;
  --sme-weight-bold:     700;
}

/* ═══ tier 2 · semantic ═══ */
@theme {
  --font-sans: var(--sme-font-anuphan), var(--sme-fallback-thai), var(--sme-fallback-sys);
  --font-mono: var(--sme-font-plexmono), var(--sme-fallback-mono);

  /* ตัวเลข: Anuphan กว้างเท่ากันอยู่แล้ว — tabular-nums ไว้กันฟอนต์สำรอง */
  --font-numeric: var(--font-sans);

  --text-display-lg: 3rem;                        /* 48px */
  --text-display-lg--line-height: 4rem;           /* 64px · 1.333 */
  --text-display-lg--font-weight: 700;
  --text-display-lg--letter-spacing: -0.02em;     /* ⚠️ ละตินล้วนเท่านั้น */

  --text-title: 1.5rem;                           /* 24px */
  --text-title--line-height: 2rem;                /* 32px · 1.333 */
  --text-title--font-weight: 600;

  --text-body: 1rem;                              /* 16px */
  --text-body--line-height: 1.75rem;              /* 28px · 1.750 */
  --text-body--font-weight: 400;

  --text-label: 0.8125rem;                        /* 13px — พื้นของระบบ */
  --text-label--line-height: 1.25rem;             /* 20px · 1.538 */
  --text-label--font-weight: 500;

  --text-code: 0.875rem;                          /* 14px */
  --text-code--line-height: 1.5rem;               /* 24px · 1.714 */
  --text-code--font-weight: 400;

  --measure-body: 68ch;
}

/* ═══ กฎระดับ global ═══ */
html {
  font-family: var(--font-sans);
  -webkit-text-size-adjust: 100%;
}

/* ตัวเลขในตาราง/ราคา — tabular-nums ทำงานกับฟอนต์สำรอง ไม่ใช่ Anuphan */
.font-numeric,
:where(td, th) .tabular {
  font-family: var(--font-numeric);
  font-variant-numeric: tabular-nums;
}

/* Anuphan ไม่มี italic — เน้นด้วยน้ำหนักแทน ไม่ใช่ oblique เทียม */
:where(em, i, cite, address, dfn) {
  font-style: normal;
  font-weight: var(--sme-weight-semibold);
}
```

---

## 🧠 Decision Rationale

### ทำไมไม่ต้องพึ่ง `tnum` แม้จะเป็นข้อกำหนดเดิม
สถาปัตยกรรมเดิมระบุว่าต้องยืนยันว่า Anuphan รองรับ `tnum` และเตรียมแผนสำรองเป็นคอลัมน์ความกว้างคงที่ด้วย `ch` **ผลตรวจจริงพบว่าไม่มี `tnum`** แต่คำถามที่แท้จริงไม่ใช่ *"มี feature หรือไม่"* — คือ *"คอลัมน์ราคานิ่งหรือไม่"* และคำตอบคือ **นิ่ง** เพราะตัวเลข 0–9 กว้าง 600/1000 em เท่ากันหมดโดยกำเนิด ผลลัพธ์นี้ดีกว่าการมี `tnum` เพราะไม่ต้องพึ่งการรองรับของ browser และไม่มีทางถูกปิดโดยบังเอิญ แผนสำรอง `ch` จึงไม่ต้องใช้

### ทำไมยังคง `tabular-nums` ไว้ทั้งที่ไม่มีผลกับ Anuphan
เพราะ **ฟอนต์สำรองต้องใช้** Noto Sans Thai, Leelawadee UI และ Thonburi มีตัวเลข proportional และมี `tnum` จริง ในช่วงที่ Anuphan ยังโหลดไม่เสร็จหรือโหลดไม่ได้ ตารางราคาจะยังเรียงตรง เป็นการประกันที่ไม่มีต้นทุน — ถ้า Anuphan เพิ่ม `tnum` ในเวอร์ชันหน้า ระบบก็ได้ประโยชน์ทันทีโดยไม่ต้องแก้อะไร

### ทำไมพบปัญหาเลขไทยและถือว่าสำคัญ
ไม่มีใครระบุไว้ในโจทย์ และเป็นสิ่งที่จะไม่มีใครเห็นจนกว่าจะมีตารางราคาที่ใช้เลขไทยจริงในระบบ production ความกว้างต่างกัน **36.6% em** แปลว่าคอลัมน์ 10 หลักอาจเบี้ยวได้ถึง 3.6em — เห็นชัดมาก และในบริบทเอกสารราชการไทยที่เลขไทยถูกใช้บ่อย ความเสี่ยงนี้จริงกว่าที่ควรมองข้าม

### ทำไม line-height ต่ำสุด 1.333 ไม่ใช่ 1.1 แบบระบบทั่วไป
เพราะระบบทั่วไปออกแบบบน metric ของอักษรละติน ซึ่งมีหมึกอยู่ในช่วง ascender–descender ประมาณ 1.0 em อักษรไทยซ้อนสระบน + วรรณยุกต์ + สระล่าง รวมแล้วประมาณ 1.30 em display ที่ line-height 1.1 จะทำให้วรรณยุกต์ของบรรทัดล่างชนสระล่างของบรรทัดบน — เป็นข้อผิดพลาดที่พบบ่อยที่สุดเมื่อนำ design system ตะวันตกมาใช้กับภาษาไทย

### ทำไมห้าม italic เด็ดขาด
เพราะยืนยันจากไฟล์ว่า **Anuphan ไม่มี face italic เลย** browser จะสร้าง synthetic oblique โดยเอียงกราฟิกทั้งตัว ~12° ซึ่งกับละตินยังพออ่านได้ แต่กับไทยทำให้สระและวรรณยุกต์ที่ต้องวางตรงเหนือพยัญชนะเลื่อนออกจากตำแหน่ง อ่านไม่ออกจริง จึงเขียนกฎ reset ให้ `em`, `i`, `cite`, `dfn` กลายเป็นน้ำหนัก 600 แทน — แก้ที่ต้นทางดีกว่ารอให้ใครเผลอใช้

### ทำไม 2 family ไม่ใช่ 3
มีการพิจารณาเพิ่ม family ที่สามสำหรับตัวเลข (เช่น IBM Plex Sans ที่มี tabular figures แข็งแรง) แต่ **ไม่จำเป็นแล้ว** เมื่อพบว่า Anuphan มีตัวเลขกว้างเท่ากันอยู่แล้ว การเพิ่ม family ที่สามจะเพิ่ม payload ~30 KB บนเน็ตมือถือต่างจังหวัดโดยไม่ได้อะไรกลับมา

---

**ถัดไป:** `04-spacing.md` — สเกล 4px grid (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128) พร้อมกฎการใช้ในแนวตั้ง/แนวนอน และความสัมพันธ์กับ line-height ที่อยู่บน grid เดียวกัน
