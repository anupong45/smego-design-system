# `@smego/lint`

เกตของ SME.GO Design System ที่ **รีโปแอปรันได้** — ไม่ต้อง clone รีโป design system

```bash
npx smego-lint-classes src app
npx smego-lint-quality src app
```

ไม่ส่ง path = สแกน `03-components/src` (โหมดในรีโป design system)
ส่ง path = สแกนเทียบ `cwd`

---

## ทำไมแอปต้องรันด้วย

กฎพวกนี้ **พังเหมือนกันไม่ว่าจะเขียนที่รีโปไหน** — hex ดิบในโค้ดหน้าเว็บทำให้โหมดมืดเสีย
เท่ากับ hex ในไลบรารี · `shadow-md` ติดไปในโหมดมืดเหมือนกัน · `overflow-x-auto` ที่ไม่มี
`relative` ทำให้ทั้งหน้าเลื่อนแนวนอนเหมือนกัน

แต่เกตพวกนี้เคยรันเฉพาะในรีโป design system ⇒ ทีมแอปคนละรีโปเขียนอะไรก็ได้

---

## ★★★ ขอบเขต — อ่านก่อนเชื่อว่าถูกคุ้มครอง

**เกตนี้ไม่ได้บังคับกฎทั้งหมดของระบบ** และการเข้าใจผิดเรื่องนี้อันตรายกว่าไม่มีเกต
เพราะมันหยุดการตรวจด้วยตา

### บังคับได้ ✅

| เกต | จับอะไร |
|---|---|
| `smego-lint-classes` | สี palette ของ Tailwind ที่ถูกลบด้วย `--color-*: initial` (`bg-red-500` `text-white` …) · สีดิบใน `[]` (`bg-[#0077C1]`) · ramp `50/100/200` เป็นพื้น (โหมดมืดได้ ~1.04:1) · `z-<number>` · `body.style.padding*` |
| `smego-lint-quality` | logical properties (`ml-` → `ms-`) · เงาดิบ (`shadow-md`) · **scroll container ที่ไม่มี `relative`** · `import` จาก `lucide-react` · `italic`/`uppercase`/`capitalize`/`tracking-*` · `!important` · `rounded-full` บนปุ่มข้อความ · เลขไทย `๐–๙` · ความสูงตายตัว (warn) · motion ที่หลุดตัวกัน (warn) |

### **ยังไม่บังคับ** ⚠️ — ต้องตรวจด้วยตา

| กฎ | ทำไมยังไม่มี |
|---|---|
| `border-neutral-*` บน input/select/textarea/checkbox/radio | ต้องรู้ว่า element นั้นเป็น input หรือเปล่า — regex ล้วนแยกไม่ออก (`neutral-300` ได้ 1.56:1 ไม่ผ่าน SC 1.4.11) |
| `text-white` บนพื้นทอง/เหลือง | ต้องรู้สีพื้นของ element นั้น (ขาวบนทองได้ 2.37 · บนเหลือง 1.66) |
| `overflow-hidden` บน element ที่มี focusable เป็นลูก | ต้องรู้ว่ามี focusable เป็นลูกไหม — วงแหวน focus ล้น 4px จะถูกตัด (SC 2.4.7) |
| spacing/radius นอกชุดที่อนุมัติ · arbitrary value | ยังไม่เขียน |
| `p-0.5` / `gap-0.5` | **กฎนี้ขัดกับชุด spacing ที่อนุมัติของระบบเอง** ซึ่งระบุ `0.5` ว่าใช้ได้ · รอการตัดสิน |

การเขียนสามข้อแรกแบบ regex ล้วนจะได้ **false negative** ซึ่งหลอกกว่าไม่มีกฎ

---

## แนะนำให้ผูกใน CI ของแอป

```yaml
- run: npx smego-lint-classes src app
- run: npx smego-lint-quality src app
```

ทั้งสองตัว exit 1 เมื่อพบ error · `--strict` ทำให้ warning นับเป็น fail ด้วย
· `--json` (เฉพาะ `lint-quality`) ให้ผลเป็น JSON

---

## ⚠️ กฎที่เกตนี้บังคับไม่ได้เลยและสำคัญมาก

- **`@source` ต้องชี้ไปที่ `dist` ของแพ็กเกจ** ไม่งั้น Tailwind purge คลาสของ component
  ทิ้งทั้งหมด **แบบเงียบ** — หน้าออกมาเป็น HTML เปลือยโดยไม่มี error
- **`THEME_INIT_SCRIPT` ต้อง inline ใน `<head>` แบบ synchronous** ไม่งั้นเห็น theme
  ผิดกระพริบ และ `ThemeToggle` จะปิดตาย
- **`lang="th"` บน `<html>`** จำเป็นสำหรับ feature `locl` ของ Anuphan และการตัดคำไทย
- **`suppressHydrationWarning` บน `<html>`** เพราะ theme script แก้ attribute ก่อน hydrate
