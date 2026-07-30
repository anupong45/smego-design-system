# SmeGoProvider

**`@smego/ui`** · ชั้น 03 · `src/provider/SmeGoProvider.tsx`

Provider เดียวที่ต้องครอบทั้งแอป — locale · timezone · dictionary ไทย · คำแปลภายในของ RAC

> ⚠️ **ไฟล์นี้ไม่มีเอกสารมาตลอด** จนถึง 2026-07-30 · `CLAUDE.md §4` เขียนว่า
> ".tsx ทุกตัวต้องมี .md คู่" แต่ `lint:docs` วนจาก `.md` ไปหา `.tsx` **ทางเดียว**
> ⇒ `.tsx` ที่ไม่มี `.md` เลยมองไม่เห็น · ปิดช่องแล้วด้วยกฎข้อ 3ก
> **เกตที่ตรวจทางเดียวคือเกตที่ตรวจครึ่งเดียว**

---

## 1 · ภาพรวม

ทำ 3 อย่าง และทั้งสามอย่างต้องเกิด **ก่อน** component ตัวแรก render

1. **locale = `th-TH-u-ca-buddhist`** → `DateFormatter` ทุกตัวใน RAC ให้ **พ.ศ.**
2. **dictionary ไทยของเราเอง** ผ่าน context → อ่านด้วย `useStrings()`
3. **timezone = `Asia/Bangkok`** → กำหนดปิดรับสมัครคำนวณตามเวลาไทย ไม่ใช่ UTC
   (ต่างกัน 7 ชั่วโมง และทำให้ "เหลือ 1 วัน" ผิดได้จริง)

**ไม่ทำ** — ไม่ตั้ง `data-theme` · นั่นเป็นหน้าที่ของ `THEME_INIT_SCRIPT` ที่รันก่อน
first paint ถ้า Provider ทำ จะเกิดการกระพริบเพราะ React hydrate ทีหลัง
(ดู [`ThemeToggle`](./ThemeToggle.md))

---

## 2 · React API

```tsx
import { SmeGoProvider, useStrings, useSmeGoLocale } from '@smego/ui';
```

| prop | ชนิด | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `children` | `ReactNode` | — | |
| `strings` | `PartialStrings` | — | override **บางส่วน** ได้ · merge ระดับหมวด |
| `skipRacStrings` | `boolean` | `false` | ปิดการติดตั้งคำแปลไทยภายใน RAC |
| `locale` | `string` | `'th-TH-u-ca-buddhist'` | |
| `timeZone` | `string` | `'Asia/Bangkok'` | |

### hooks

| hook | คืนค่า |
|---|---|
| `useStrings()` | `Strings` — เรียกนอก Provider ได้ ได้ค่าเริ่มต้นไทย **ไม่ throw** |
| `useSmeGoLocale()` | `{ locale, timeZone }` |

★ **`useStrings()` คือ `useContext` ที่ห่อไว้** และถูกเรียกใน **47 ไฟล์** รวมการ์ด
marketplace ทั้ง 20 ⇒ ทุกไฟล์นั้น **ต้องเป็น client component** ใน Next App Router
เป็นราคาที่ยอมจ่ายเพื่อให้แอป override ข้อความได้ (คำตัดสิน 2026-07-30 ข้อ 14)
ทางเลือก `setStrings()` แบบ global ถูกปฏิเสธเพราะเป็น last-writer-wins บนสถานะร่วม

---

## 3 · Variants

ไม่มี — Provider มีรูปแบบเดียว

---

## 4 · States

ไม่มีสถานะเชิงภาพ · สถานะเดียวที่มีคือ **ติดตั้งคำแปล RAC แล้วหรือยัง** ซึ่งเป็น
module-level flag เพราะ global ของ RAC ต้องตั้งครั้งเดียวต่อหน้า

---

## 5 · Accessibility

- **คำแปลภายในของ RAC ถูกติดตั้งให้เอง** — RAC ส่งชุดแปลมา 34 locale และ **ไม่มี th-TH**
  (เอเชียมีแค่ ja-JP · ko-KR · zh-CN · zh-TW) ถ้าไม่ติดตั้ง **ผู้ใช้ TalkBack ไทย
  ได้ยินภาษาอังกฤษ** ซึ่งบนแพลตฟอร์มภาครัฐไม่ควรเป็นค่าเริ่มต้น
- ยืนยันแล้วว่าปุ่มล้างค่าใน `SearchField` ประกาศว่า "ล้างคำค้นหา"
- ⚠️ **ต้องเติมทุก package ไม่ใช่แค่ที่เราแปล** — ถ้า global มีแล้วแต่ package ไหนขาด
  `LocalizedStringDictionary` จะ **throw แล้วพังทั้งหน้า** ไม่ใช่ fallback เงียบ ๆ
  และมันอ่าน global ด้วย `for...in` **ครั้งเดียว** แล้ว snapshot จึงดัก Proxy ไม่ได้

---

## 6 · Tailwind implementation

ไม่มีคลาสเลย — Provider ไม่ render element ที่มองเห็น

---

## 7 · Figma Variant

ไม่มี — Provider ไม่มีตัวตนในงานออกแบบ

---

## 8 · Usage

```tsx
<SmeGoProvider>
  <App />
</SmeGoProvider>
```

override ข้อความบางคำ — ไม่ต้องส่งหมวดมาครบ

```tsx
<SmeGoProvider strings={{ cart: { empty: 'ตะกร้ายังว่าง' } }}>
```

---

## 9 · Anti-patterns

| ❌ | ทำไมผิด | ✅ |
|---|---|---|
| ครอบ Provider ซ้อนหลายชั้น | global ของ RAC ตั้งซ้ำไม่พัง แต่ context ชั้นในทับชั้นนอกโดยไม่ตั้งใจ | ครอบครั้งเดียวที่ราก |
| ตั้ง `data-theme` ใน Provider | React hydrate ทีหลัง = เห็น theme ผิดกระพริบ | `THEME_INIT_SCRIPT` ใน `<head>` |
| `skipRacStrings` โดยไม่ติดตั้งเอง | ผู้ใช้ screen reader ไทยได้ยินภาษาอังกฤษ | ปล่อยค่าเริ่มต้น หรือติดตั้งเองจริง ๆ |
| อัปเกรด RAC แล้วไม่ `gen:rac-fallback` | ตารางขาด key = **หน้าขาวทั้งหน้า** | รัน แล้วให้ `rac-fallback.test.ts` ยืนยัน |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · `a11y/rac-fallback.test.ts` 5 ข้อ — ครบทุก package/key/ชนิด และเรียกฟังก์ชัน ICU ได้จริง |
| ตอบสนอง (Responsive) | — | ไม่ render element ที่มองเห็น จึงไม่มีพฤติกรรมตามความกว้าง |
| โหมดมืด (Dark Mode) | — | ไม่มีคลาสและไม่ตั้ง `data-theme` โดยเจตนา (§1) — นั่นเป็นหน้าที่ของ `THEME_INIT_SCRIPT` |
| คุณสมบัติเชิงตรรกะ (Logical properties) | — | ไม่มี CSS เลย |
| คีย์บอร์ด (Keyboard) | — | ไม่มีตัวควบคุมของตัวเอง |
| กำลังโหลด (Loading) | — | ทำงาน synchronous ในเนื้อ component ไม่มีสถานะรอ |
| ข้อผิดพลาด (Error) | ✅ | `useStrings()` นอก Provider **ไม่ throw** — คืนค่าเริ่มต้นไทย เพื่อให้ unit test ที่ไม่ครอบ Provider ทำงานได้ |
| ว่างเปล่า (Empty) | — | `children` ว่างไม่ใช่สถานะที่ต้องออกแบบ |
| Skeleton | — | ไม่มีพื้นที่ทางภาพ |
| การเคลื่อนไหว (Animation) | — | ไม่มี |
| ประสิทธิภาพ (Performance) | ✅ | ตาราง `RAC_EN_FALLBACK` **~1.3 KB gzip** (22 package · 146 key) — ไม่ใช่ 59 KB ของทั้ง 34 locale · `useMemo` กัน context value เปลี่ยนทุก render |
