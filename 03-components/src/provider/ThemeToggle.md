# ThemeToggle

**`@smego/ui`** · ชั้น 03 · `src/provider/ThemeToggle.tsx`

ตัวสลับโหมดสว่าง/มืด · 3 ตัวเลือก `สว่าง` `มืด` `ตามระบบ`

---

## 1 · ภาพรวม

> ★★★ **จนถึง 2026-07-30 โหมดมืดของระบบนี้ไม่มีใครเปิดใช้ได้**
>
> `02-tokens/theme-init.js` (9.9 KB) **ไม่มี call site แม้แต่ที่เดียว** ในรีโปทั้งหมด ·
> ไม่มีไฟล์ไหนอ่านหรือเขียน `smego-theme` · `gallery/index.html` hardcode
> `data-theme="light"` ⇒ โหมดมืดถูกพิสูจน์ว่า **ค่าสีถูก** (contrast sweep วัดทั้งสองโหมด
> พร้อม guard `>150` element) แต่ **เส้นทางจาก "ผู้ใช้กด" ถึง `data-theme` ไม่มีปลายทั้งสองข้าง**
>
> ไฟล์นี้คือปลายข้างผู้ใช้ · `THEME_INIT_SCRIPT` คือปลายข้าง `<head>`

**ทำไมปุ่มนี้อยู่ในไลบรารี ไม่ใช่ในแอป** — `data-theme` กับ `localStorage['smego-theme']`
เป็น **สถานะร่วม** ถ้าปล่อยให้แอปเขียนเอง แอปที่สองจะเขียนคนละ key หรือเขียน attribute
ตรง ๆ โดยไม่ผ่าน localStorage แล้วผู้ใช้เห็น theme ไม่ตรงกันข้ามหน้า — **last-writer-wins**
รูปแบบเดียวกับที่ [`CLAUDE.md §4`](../../../CLAUDE.md) ห้าม `body.style.padding*` ไว้

**ตรรกะไม่อยู่ในไฟล์นี้** — component เป็นแค่หน้าตา อ่าน/เขียนผ่าน `window.smegoTheme`
ที่ `theme-init.js` ติดตั้งไว้ เพราะการ resolve `'system'` · การกัน exception ของ
localStorage (Safari private mode · iOS ที่ปิดคุกกี้ · iframe ที่ถูกบล็อก) · การฟัง
`matchMedia` · การซิงก์ข้ามแท็บ **มีอยู่แล้วครบใน script นั้น** การเขียนซ้ำจะได้ตรรกะ
สองชุดที่หลุดจากกัน

---

## 2 · React API

```tsx
import { ThemeToggle, useTheme, THEME_INIT_SCRIPT } from '@smego/ui';
```

### `<ThemeToggle />`

| prop | ชนิด | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `label` | `string` | `'ธีมการแสดงผล'` | ชื่อกลุ่ม (SC 1.3.1) · มาจาก `stringsTh.theme.label` |
| `isLabelHidden` | `boolean` | `false` | ซ่อนจากตา ยังอยู่กับ screen reader |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | ส่งต่อให้ `SegmentedControl` |
| `layout` | `'hug' \| 'fill'` | `'hug'` | `'fill'` สำหรับเมนูบนจอแคบ |
| `className` | `string` | — | |

### `useTheme()`

```ts
const { preference, resolved, isReady, setPreference } = useTheme();
```

| ค่า | ชนิด | หมายเหตุ |
|---|---|---|
| `preference` | `'light' \| 'dark' \| 'system'` | ค่าที่ผู้ใช้เลือก · **เป็น `'system'` ตอน render ครั้งแรกเสมอ** |
| `resolved` | `'light' \| 'dark'` | ค่าที่ใช้จริง — CSS เห็นแค่สองค่านี้ |
| `isReady` | `boolean` | sync กับ `window.smegoTheme` แล้วหรือยัง |
| `setPreference` | `(p) => void` | ไม่มี API → `console.error` ใน dev แล้วไม่ทำอะไร |

### `THEME_INIT_SCRIPT`

สตริง IIFE ที่ **generate จาก `02-tokens/theme-init.js`** ด้วย `npm run gen:theme-init`
— ห้ามพิมพ์เอง · `tests/a11y/theme-init.test.ts` ยืนยันว่าตรงกับต้นฉบับ

---

## 3 · Variants

ไม่มี variant เชิงรูปลักษณ์ — ปุ่มนี้มีหน้าตาเดียว ปรับได้แค่ `size` และ `layout`
ที่ส่งต่อให้ [`SegmentedControl`](../navigation/SegmentedControl.md)

**ใช้ข้อความไม่ใช้ไอคอน** — Lucide ไม่มี sun/moon ใน [ทะเบียนไอคอน](../icon/registry.ts)
ของเรา และตามข้อ 09 การหยิบไอคอนใกล้เคียงมาใช้เป็นสิ่งที่ห้าม · คำไทยสามคำนี้สั้น
และตรงกว่าไอคอนอยู่แล้ว และไม่ทำให้ bundle โตขึ้นเลย

---

## 4 · States

| สถานะ | เกิดเมื่อ | ผล |
|---|---|---|
| ปกติ | แอป inline `THEME_INIT_SCRIPT` แล้ว | กดได้ · ตัวเลือกที่เลือกไฮไลต์ |
| **ยังไม่ sync** | render ครั้งแรก ก่อน effect | `isDisabled` — ยังไม่รู้ค่าจริง |
| **ไม่มี API** | แอปลืม inline script | `isDisabled` ค้าง + `console.error` ใน dev |

★ เลือก **ปิด** ไม่ใช่ **กดแล้วเงียบ** — ผู้ใช้ไม่ควรกดของที่ไม่ทำอะไรโดยไม่มีคำอธิบาย
และการ fallback ไปเขียน localStorage เองคือการสร้างตรรกะชุดที่สองเงียบ ๆ ซึ่งแย่กว่า
การบอกตรง ๆ ว่าติดตั้งไม่ครบ

---

## 5 · Accessibility

- **`radiogroup` ที่มีชื่อ** ไม่ใช่ปุ่มลอย ๆ — สามตัวเลือกเป็น `radio` จริงจาก RAC
- **อ่านออกด้วยข้อความ** ทั้งสามตัวเลือก (SC 1.4.1) — ไม่พึ่งสีหรือไอคอน
- **คีย์บอร์ด** roving tabindex + ลูกศรเลือกทันที มาจาก `SegmentedControl`
- **`axe` ผ่าน** — `a11y/theme-toggle.test.tsx`
- ⚠️ **ห้ามอ่าน theme ตอน render ครั้งแรก** — server ไม่รู้ค่า จะได้ HTML ไม่ตรงกับ client
  `theme-init.js` เขียนกฎนี้ไว้เองที่ท้ายไฟล์ · การกระพริบของ **ตัวเลือกที่ไฮไลต์**
  ยอมรับได้ เพราะ **สีของหน้าไม่กระพริบ** — script ตั้ง `data-theme` ไปแล้วก่อน paint

---

## 6 · Tailwind implementation

ไม่มีคลาสของตัวเอง — ทั้งหมดมาจาก `SegmentedControl` · ไฟล์นี้ไม่แตะสีหรือระยะเลย

---

## 7 · Figma Variant

ไม่มี — ปุ่มนี้เป็นตัวควบคุมของระบบ ไม่ใช่ component ที่นักออกแบบวางในหน้า
ใน Figma ให้ใช้ `SegmentedControl` 3 ช่องพร้อมข้อความสามคำนั้น

---

## 8 · Usage

**`app/layout.tsx`** — ต้อง inline script ก่อน first paint

```tsx
import { THEME_INIT_SCRIPT } from '@smego/ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**ในเมนูผู้ใช้**

```tsx
<ThemeToggle layout="fill" size="sm" />
```

**อ่านค่าไปใช้ที่อื่น** — เช่นเลือกภาพประกอบให้เข้ากับโหมด

```tsx
const { resolved } = useTheme();
<img src={resolved === 'dark' ? heroDark : heroLight} alt="" />
```

---

## 9 · Anti-patterns

| ❌ | ทำไมผิด | ✅ |
|---|---|---|
| แอปเขียน `data-theme` เอง | last-writer-wins · ไม่ผ่าน localStorage = ข้ามหน้าไม่ตรงกัน | `useTheme().setPreference` |
| `<script src="/theme-init.js">` | network request ทำให้ paint เกิดก่อน = เห็น theme ผิดกระพริบ | inline `THEME_INIT_SCRIPT` |
| `defer` / `async` บน script นั้น | เหตุผลเดียวกัน | synchronous เท่านั้น |
| อ่าน `localStorage` ตอน render | hydration mismatch | `useTheme()` ซึ่งอ่านใน effect |
| เก็บค่าที่ resolve แล้วแทน `'system'` | ผู้ใช้หลุดจากโหมดตามระบบโดยไม่ได้สั่ง · OS ที่เปลี่ยนทีหลังไม่มีผล | ส่ง `'system'` ตรง ๆ |
| ไม่ใส่ `suppressHydrationWarning` บน `<html>` | React เตือนเพราะ script แก้ attribute ก่อน hydrate | ใส่ |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/theme-toggle.test.tsx` · เทส "เป็น radiogroup ที่มีชื่อ" · สามตัวเลือกอ่านออกด้วยข้อความ (SC 1.4.1) |
| ตอบสนอง (Responsive) | ✅ | `layout="fill"` สำหรับจอแคบ · ไม่มีความกว้างตายตัว · ข้อความไทยสามคำสั้นสุด 4 อักขระ |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ไม่มีคลาสของตัวเองเลย (§6) · และปุ่มนี้**คือ**กลไกที่ทำให้โหมดมืดใช้ได้ |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`left-` |
| คีย์บอร์ด (Keyboard) | ✅ | §5 · roving tabindex จาก `SegmentedControl` · เทส "กดแล้วเปลี่ยน data-theme" ใช้ `userEvent` |
| กำลังโหลด (Loading) | ✅ | §4 · `isDisabled` ระหว่างยังไม่ sync — เทส "แอปไม่ inline script → ปุ่มปิด" |
| ข้อผิดพลาด (Error) | — | ไม่มีสถานะผิดพลาด · การติดตั้งไม่ครบแสดงเป็น disabled + `console.error` ใน dev ไม่ใช่ error ในหน้า |
| ว่างเปล่า (Empty) | — | ตัวเลือกคงที่ 3 ค่า ไม่มีทางว่าง |
| Skeleton | — | ความสูงคงที่จาก `min-h-*` ของ `SegmentedControl` ไม่ทำให้ CLS |
| การเคลื่อนไหว (Animation) | ✅ | `transition-colors` ที่สืบมาจาก `SegmentedControl` — อยู่ในรายการ ALLOW ของ `base.css §10` |
| ประสิทธิภาพ (Performance) | ✅ | ไม่เพิ่ม dependency · ไม่มีไอคอน (§3) · ตรรกะอยู่ใน script 4.0 KB ที่ inline อยู่แล้วเพื่อกันการกระพริบ |
