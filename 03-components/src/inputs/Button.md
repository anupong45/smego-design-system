# Button

**`@smego/ui`** · ชั้น 03 · [Button.tsx](./Button.tsx)

---

## 1 · ภาพรวม

ปุ่มสำหรับ **การกระทำ** — สิ่งที่เกิดขึ้นในหน้าปัจจุบันหรือส่งข้อมูล

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ไปหน้าอื่น | `<Link>` | ผู้ใช้ต้องเปิดแท็บใหม่ได้ · คัดลอก URL ได้ · screen reader ประกาศต่างกัน |
| ไอคอนล้วนไม่มีข้อความ | `<IconButton>` | ต้องบังคับ `aria-label` และเป็นเป้า ≥24×24 |
| เปิด/ปิดสถานะค้าง | `<ToggleButton>` | ต้องมี `aria-pressed` |
| กดแล้วเปิดเมนู | `<MenuTrigger>` | ต้องมี `aria-expanded` + `aria-haspopup` |

**ห้ามใช้ `variant="ghost"` แทน `<Link>`** เพราะดูเหมือนลิงก์ — ถ้ามันนำทาง มันต้องเป็น `<a href>`

---

## 2 · React API

```tsx
import { Button } from '@smego/ui';

<Button variant="primary" size="md" onPress={submit}>
  ยื่นคำขอสินเชื่อ
</Button>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | **ต้องบอกสิ่งที่จะเกิดขึ้น** ไม่ใช่ "ตกลง" / "ดำเนินการต่อ" |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success' \| 'accent'` | `'primary'` | ดูข้อ 3 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | `xs` **pointer เท่านั้น** |
| `icon` | `IconName` | — | ไอคอนตกแต่ง ได้ `aria-hidden` อัตโนมัติ |
| `iconPosition` | `'start' \| 'end'` | `'start'` | |
| `isLoading` | `boolean` | `false` | map ไป RAC `isPending` — ดูข้อ 4 |
| `isDisabled` | `boolean` | `false` | จาก RAC |
| `fullWidth` | `boolean` | `false` | ใช้กับ CTA บนมือถือ |
| `onPress` | `(e) => void` | — | **จาก RAC — ไม่ใช่ `onClick`** ครอบทั้ง pointer/keyboard/touch |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | |
| `className` | `string` | — | merge ด้วย `cn()` ซึ่งแก้ความขัดแย้งถูกต้อง |

**prop อื่นทั้งหมดของ RAC `Button` ส่งผ่านได้** — `autoFocus` `excludeFromTabOrder` `onHoverStart` ฯลฯ

### ทางหนีเมื่อ wrapper ไม่พอ

```tsx
import { Button as RACButton } from '@smego/ui/primitives';
import { buttonStyles } from '@smego/ui';

<RACButton className={buttonStyles({ variant: 'ghost', size: 'sm' })}>…</RACButton>
```

---

## 3 · Variants

| variant | พื้น | ตัวอักษร | ขอบ | ใช้เมื่อไร |
|---|---|---|---|---|
| `primary` | `primary-600` | `on-brand` (ขาว) | — | CTA หลัก · **หนึ่งตัวต่อหน้าจอ** |
| `secondary` | `surface` | `fg` | **`edge-strong`** | การกระทำรอง · "ยกเลิก" |
| `ghost` | โปร่งใส | `fg` | — | การกระทำใน toolbar และในแถวตาราง |
| `danger` | `danger-fill` | `on-brand` | — | ลบ · ปฏิเสธ · ยกเลิกคำสั่งซื้อ |
| `success` | `success-fill` | `on-brand` | — | อนุมัติ · ยืนยันการรับสินค้า |
| `accent` | `accent-fill` (ทอง) | **`on-accent` (เข้ม)** | **`accent-outline` จำเป็น** | **CTA แหล่งทุนเท่านั้น** |

### ค่า contrast ที่วัดจริงทั้ง 3 สถานะ

| variant | base | hover | active | เทียบ canvas |
|---|---|---|---|---|
| `primary` | 4.76 ✅ | 6.56 ✅ | 8.81 ✅ | 4.52 ✅ |
| `danger` | 5.97 ✅ | 8.10 ✅ | 10.60 ✅ | 5.66 ✅ |
| `success` | 5.96 ✅ | 8.05 ✅ | 11.04 ✅ | 5.66 ✅ |
| `accent` | 7.78 ✅ | 5.56 ✅ | 5.56 ✅ | **2.25 ❌ → ต้องมีขอบ** |

### ⚠️ สองข้อจำกัดที่ค้นพบจากการวัด ไม่ใช่การออกแบบ

**1 · ทองต้องมีขอบในโหมดสว่าง**
`gold-500` เทียบ canvas ได้ **2.25:1** ซึ่งไม่ผ่าน 3:1 ของ SC 1.4.11 (ขอบเขตของ UI component) → `accent-outline` = `gold-600` ให้ **3.14** ✅ · **ขอบนี้จำเป็น ไม่ใช่การตกแต่ง ห้ามลบ**

**2 · ทองหยุด active ที่ขั้น 600**
`gold-700` + ตัวอักษรเข้ม = **3.88 ❌** · + ตัวอักษรขาว = 4.75 ✅ แต่การสลับสีตัวอักษรตอน `:active` กระตุกและเป็นบ่อเกิดของ bug → `accent-active` = `gold-600` เท่ากับ hover **โดยตั้งใจ**

### ⚠️ โหมดมืด — ขอบรับน้ำหนักขอบเขต

`primary-600` ที่ 4.76:1 กับตัวอักษรขาว **ไม่มีที่เหลือให้เปลี่ยนพื้น** (ผลตรงจากข้อ 5 ที่ยึดสีแบรนด์ที่ขั้น 600) และการทำพื้นเข้มขึ้นตอน hover ในโหมดมืดทำให้ปุ่มกลืน canvas (`primary-700` vs canvas = 2.81 ❌)

ทางแก้ตรงกับหลักในข้อ 06: **`*-outline` เปลี่ยนเป็นขั้น 400 ในโหมดมืด**

| ขอบ | vs canvas | vs surface |
|---|---|---|
| `primary-400` | 7.18 ✅ | 6.30 ✅ |
| `red-400` | 5.91 ✅ | 5.19 ✅ |
| `green-400` | 8.78 ✅ | 7.70 ✅ |
| `gold-400` | 9.23 ✅ | 8.10 ✅ |

---

## 4 · States

**ความสูงมาจาก `line-height` + padding ไม่ได้ตั้ง `height`** — ดูเหตุผลใน `.tsx`

| size | text | padding | ความสูงจริง | ไอคอน |
|---|---|---|---|---|
| `xs` | `text-caption` 13/20 | `py-1 px-2` | **30px** | 16 |
| `sm` | `text-button` 14/20 | `py-2 px-3` | **38px** | 16 |
| **`md`** | `text-button` 14/20 | `py-3 px-4` | **46px** | 16 |
| `lg` | `text-button-lg` 16/24 | `py-3 px-6` | **50px** | 20 |

### 📌 แก้ตัวเลขจากที่ข้อ 30 ระบุไว้

ข้อ 30 คำนวณไว้เป็น **28/36/44/48** โดย **ไม่ได้นับ `border` 1px บน+ล่าง**
วัดใน browser จริงได้ **30/38/46/50** — ต่างกัน **+2px พอดี** ทุกขนาด

**ยอมรับค่าจริง ไม่ลด padding** เพราะ 1px ไม่มีในชุด spacing ที่อนุมัติ
และค่าใหม่ยังตรงเจตนา: ทุกขนาดเกิน 24×24 ของ SC 2.5.8 · `md` ที่ **46px**
ยังอยู่ในช่วง 44–48px ที่ผู้ใช้ไทยคุ้นจาก LINE/Shopee

border 1px นี้ **ลบไม่ได้** เพราะเป็นสิ่งที่ทำให้ปุ่มทองผ่าน SC 1.4.11
และทำให้ `*-outline` ทำงานในโหมดมืด

**⚠️ `xs` เป็น pointer-only** — 30px ยังเกิน 24×24 จึงผ่าน SC 2.5.8 แต่ต่ำกว่าที่ผู้ใช้ไทยคุ้นจาก LINE/Shopee ใช้เฉพาะแถวตารางบนเดสก์ท็อป

### 8 สถานะ แมปกับ `data-*` ที่ RAC ปล่อยออกมา

| สถานะ | selector | ผลที่เกิด |
|---|---|---|
| default | — | ตามตารางข้อ 3 |
| hover | `data-hovered` | พื้นเข้มขึ้นหนึ่งขั้น |
| focus-visible | `data-focus-visible` | **ไม่เขียนที่ component** — `base.css` จับ `:where(button):focus-visible` ให้แล้ว |
| active | `data-pressed` | พื้นเข้มขึ้นสองขั้น |
| selected | — | ไม่มีใน Button — ใช้ `ToggleButton` |
| disabled | `data-disabled` | `bg-sunken` + `text-fg-disabled` + `border-edge` |
| loading | `data-pending` | ดูด้านล่าง |
| invalid | — | ไม่มีใน Button — เป็นเรื่องของ field |

### disabled หน้าตาเหมือนกันทุก variant โดยตั้งใจ

ปุ่มลบที่ disabled ไม่ควรยังดูน่ากลัว และผู้ใช้ต้องแยก **"กดไม่ได้"** ออกจาก **"อันตราย"** ได้ · ข้อความ disabled ยกเว้นจาก SC 1.4.3

### loading ใช้ RAC `isPending` ไม่ใช่ `disabled`

| `isPending` ทำอะไร | ทำไมถูกกว่า `disabled` |
|---|---|
| ปิด press และ hover | ป้องกันการกดซ้ำ |
| **คง focusability ไว้** | `disabled` จะดีด focus หลุด ผู้ใช้คีย์บอร์ดจะหลงตำแหน่ง |
| **ประกาศสถานะให้ screen reader** | ผู้ใช้ที่มองไม่เห็นรู้ว่าระบบกำลังทำงาน |

**ความกว้างปุ่มไม่เปลี่ยน** — label ยังอยู่ใน DOM ด้วย `opacity-0` ไม่ใช่ `invisible` เพราะ `visibility: hidden` จะเอา label ออกจาก a11y tree ทำให้ปุ่มไม่มีชื่อระหว่างโหลด

spinner ใช้ `.spinner` จาก `base.css` ซึ่ง**มีข้อยกเว้น reduced-motion ให้หมุนต่อได้** เพราะเป็นการเคลื่อนไหวที่สื่อข้อมูลและพื้นที่เล็ก (ข้อ 07 §6.2)

---

## 5 · Accessibility

| เรื่อง | รายละเอียด |
|---|---|
| element | `<button type="button">` จริง — ไม่ใช่ `<div role="button">` |
| ชื่อ | จาก `children` · ถ้าใช้ `icon` ร่วม ไอคอนได้ `aria-hidden` จึงไม่รบกวนชื่อ |
| keyboard | `Enter` และ `Space` เปิดใช้งาน · `Tab` เข้า/ออก |
| focus | จาก `base.css` — วงแหวน 2 ชั้น `:focus-visible` เท่านั้น |
| `SC 2.4.7` | focus มองเห็นได้บน**ทุก variant** รวมพื้นทึบ เพราะวงแหวนมีชั้นในสีตรงข้าม |
| `SC 2.4.11` | `scroll-margin-top/-bottom` จาก `base.css` — focus ไม่ถูก header หรือแถบล่างทับ |
| `SC 2.5.8` | ทุก size ≥ 24×24 (เล็กสุด **30px**) |
| `SC 1.4.11` | ขอบเขตปุ่ม ≥3:1 ทุก variant — ทองต้องพึ่ง `accent-outline` |
| `SC 1.4.12` | ไม่ตั้ง `height` ปุ่มจึงยืดตามเนื้อหาเมื่อผู้ใช้บังคับระยะตัวอักษร |
| `SC 2.3.3` | animate เฉพาะสี — ไม่มี transform จึงไม่ถูก reduced-motion ตัด |

### ⚠️ `overflow: hidden` บน ancestor

วงแหวน focus ล้นออกนอกขอบ **4px** (`outline 2px` + `outline-offset 2px`) ถ้า parent มี `overflow-hidden` วงแหวนจะถูกตัด = **ไม่ผ่าน SC 2.4.7**

---

## 6 · Tailwind implementation

CVA จริงอยู่ใน [Button.tsx](./Button.tsx) — สรุปการตัดสินใจ

| การตัดสินใจ | เหตุผล |
|---|---|
| `border` เสมอทุก variant สีเป็น `transparent` ในตัวที่ไม่ต้องใช้ | ความกว้างไม่กระโดดระหว่าง variant และเปิดทางให้ `*-outline` ทำงานในโหมดมืด |
| `rounded-(--radius-control)` ไม่ใช่ `rounded-md` | เปลี่ยนปุ่มทั้งระบบเป็น 6px ได้ที่เดียว |
| `transition-colors` ไม่ใช่ `transition-all` | ไม่มี transform จึงไม่ถูก reduced-motion ตัด และไม่ animate สิ่งที่ไม่ต้องการ |
| ไม่มี `h-*` | spacing 7 (28px) ไม่อยู่ในชุดที่อนุมัติ และการตั้งความสูงคงที่ขัด SC 1.4.12 |

---

## 7 · Figma Variant

**Component set: `Button`** · property 4 ตัว

| property | values |
|---|---|
| `variant` | `primary` · `secondary` · `ghost` · `danger` · `success` · `accent` |
| `size` | `xs` · `sm` · `md` · `lg` |
| `state` | `default` · `hover` · `pressed` · `disabled` · **`focus`** · `loading` |
| `icon` | `none` · `start` · `end` |

**⚠️ `focus` ต้องเป็น variant จริงในชุด** ไม่ใช่ตัวอย่างแยก — ไม่เช่นนั้นนักพัฒนาจะไม่รู้ว่าวงแหวนหน้าตาอย่างไรบนพื้นทึบ

**⚠️ Corner smoothing = 0%** — CSS ไม่มี squircle

**⚠️ variant `accent` ต้องมีขอบทุก state** ในไฟล์ Figma ด้วย ไม่ใช่แค่ในโค้ด

**คำอธิบายที่ต้องใส่**

> `size=xs` — pointer only. 30px passes SC 2.5.8 but sits well below the 44–48px Thai users expect from LINE/Shopee. Desktop table rows only.
>
> `variant=accent` — the 1px border is REQUIRED, not decorative: gold-500 measures only 2.25:1 against the light canvas and fails SC 1.4.11 without it.

---

## 8 · Usage

```tsx
/* CTA หลัก — หนึ่งตัวต่อหน้าจอ */
<Button variant="primary" size="lg" icon="file-text" onPress={apply}>
  ยื่นคำขอสินเชื่อ
</Button>

/* CTA แหล่งทุน — ทองใช้ได้เฉพาะที่นี่ */
<Button variant="accent" icon="banknote" onPress={viewGrants}>
  ดูแหล่งทุนที่เข้าเกณฑ์
</Button>

/* ปุ่มคู่บนมือถือ — flex-col-reverse ให้ปุ่มหลักอยู่บนเมื่อซ้อน
   และอยู่ขวาเมื่อเรียงแนวนอน ตรงกับความคาดหวังทั้งสองกรณี (ข้อ 08 §7) */
<div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
  <Button variant="secondary" onPress={cancel}>ยกเลิก</Button>
  <Button variant="primary" onPress={confirm}>ยืนยันคำสั่งซื้อ</Button>
</div>

/* กำลังส่งข้อมูล — ความกว้างไม่เปลี่ยน · focus ไม่หลุด · SR รู้ */
<Button variant="primary" isLoading={isSubmitting} onPress={submit}>
  บันทึกร่าง
</Button>

/* ลบ — ต้องมีการยืนยันตาม SC 3.3.4 ก่อนถึงปุ่มนี้ */
<Button variant="danger" icon="trash" onPress={confirmDelete}>
  ลบรายการนี้
</Button>

/* ในแถวตาราง — xs ใช้ได้เพราะเป็นเดสก์ท็อป */
<Button variant="ghost" size="xs" onPress={edit}>แก้ไข</Button>
```

---

## 9 · Anti-patterns

| ❌ อย่าทำ | ✅ ทำแทน | ทำไม |
|---|---|---|
| `<Button onPress={() => router.push('/x')}>` | `<Link href="/x">` | ผู้ใช้เปิดแท็บใหม่ไม่ได้ · คัดลอก URL ไม่ได้ · SR ประกาศผิดประเภท |
| `className="rounded-full"` | ปล่อยให้เป็น `radius-control` | ข้อความปุ่มไทยยาวกว่าอังกฤษ 20–40% ปุ่มแคปซูลล้นที่ 360px (ข้อ 05 §4) |
| `className="text-white"` บน `accent` | `text-on-accent` (มีให้แล้ว) | ตัวอักษรขาวบนทองได้ **2.37:1** ไม่ผ่านทุกเกณฑ์ |
| `className="border-0"` บน `accent` | ห้ามลบขอบ | `gold-500` vs canvas = **2.25:1** ปุ่มจะไม่มีขอบเขตที่มองเห็น (SC 1.4.11) |
| `<Button variant="accent">อนุมัติ</Button>` | `variant="success"` | **ทองห้ามเป็นสถานะ** — ห่างจากเหลืองเตือนเพียง 1.43:1 (ข้อ 02 §9) |
| `isDisabled` ระหว่างรอ API | `isLoading` | `disabled` ดีด focus หลุดและไม่ประกาศให้ SR |
| `<Button>ตกลง</Button>` | `<Button>ยืนยันคำสั่งซื้อ</Button>` | ปุ่มต้องบอกสิ่งที่จะเกิดขึ้น (DESIGN-PRINCIPLES B2) |
| `size="xs"` บนมือถือ | `size="md"` (44px) | ต่ำกว่าที่ผู้ใช้ไทยคุ้น อัตรากดผิดสูงขึ้น |
| ปุ่ม primary สองตัวในสายตาเดียว | ตัวหนึ่งเป็น `secondary` | น้ำเงินทึบเกิน 12% ของหน้า = ผู้ใช้ไม่รู้ว่าต้องกดอะไร (ข้อ 01 §2.1) |
| `className="shadow-md"` | ไม่ใส่เงาบนปุ่ม | ปุ่มไม่ใช่พื้นผิวยกระดับ · และ `shadow-*` ตรงจะติดไปในโหมดมืด (ข้อ 06) |
| ครอบปุ่มด้วย `overflow-hidden` | ลบออก | วงแหวน focus ล้น 4px จะถูกตัด (SC 2.4.7) |
| `<Button className="uppercase">` | ไม่ทำ | ไทยไม่มีตัวพิมพ์ใหญ่ — เปลี่ยนแค่ละตินที่ปน ทำให้ label ไม่สม่ำเสมอ (ข้อ 03 §5) |
| `<Button icon="heart" />` ไม่มีข้อความ | `<IconButton label="…" />` | ปุ่มไอคอนล้วนต้องบังคับ `aria-label` (ข้อ 09 §6.2) |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` และ `a11y/rac-i18n.test.tsx` |
| ตอบสนอง (Responsive) | ✅ | `e2e/alert.spec.ts:132` ปุ่มใน `action` ซ้อนแนวตั้งที่ 320px ไม่ล้น (SC 1.4.10) · `fullWidth` สำหรับ CTA มือถือ |
| โหมดมืด (Dark Mode) | ✅ | §3 ตารางขอบขั้น 400 — วัดครบ 4 variant (7.18 · 5.91 · 8.78 · 9.23) |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | §5 · `Enter` และ `Space` เปิดใช้งาน · `e2e/wcag22.spec.ts:44` focus ไม่ถูกบังทั้งที่ 320px และ 1280px (SC 2.4.11) |
| กำลังโหลด (Loading) | ✅ | §4 `data-pending` · `a11y/pass5.test.tsx` "กำลังส่ง = กดซ้ำไม่ได้ แต่ปุ่มยังอยู่ใน a11y tree" |
| ข้อผิดพลาด (Error) | — | §4 ระบุไว้ว่า `invalid` **ไม่มีใน Button** — ความถูกต้องเป็นเรื่องของ field ปุ่มเป็นแค่ตัวส่ง |
| ว่างเปล่า (Empty) | — | `children` เป็น prop บังคับ · ปุ่มไม่มีชุดข้อมูลที่ว่างได้ |
| Skeleton | — | ปุ่มไม่เคยเป็นตัวแทนเนื้อหาที่กำลังโหลด · ระหว่างรอใช้ `isLoading` ซึ่ง**คงความกว้างและ focus ไว้** (§4) |
| การเคลื่อนไหว (Animation) | ✅ | §6 `transition-colors` เท่านั้น ไม่มี transform · `.spinner` ใช้ข้อยกเว้นที่ประกาศไว้ใน `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | animate เฉพาะสี — ไม่แตะ layout · ไม่มี `h-*` ความสูงมาจาก line-height + padding (§4) |
