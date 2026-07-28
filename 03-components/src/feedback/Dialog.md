# Dialog · DialogOverlay · DialogTrigger

**`@smego/ui`** · ชั้น 03 · [Dialog.tsx](./Dialog.tsx)

---

## 1 · ภาพรวม

หน้าต่างที่ **กักความสนใจ** — กลางจอ (`modal`) · เลื่อนขึ้นจากล่าง (`sheet`) · เลื่อนเข้าจากข้าง (`drawer`)

ทั้งสามใช้กลไกเดียวกัน ต่างกันแค่ตำแหน่งและมุมโค้ง เพราะ **focus trap · Esc · การคืน focus** ต้องเหมือนกันทุกกรณี

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ข้อมูลเสริมสั้น ๆ | `<Tooltip>` / `<Popover>` | modal กักความสนใจโดยไม่จำเป็น |
| แจ้งผลลัพธ์ของการกระทำ | `<Toast>` (Pass 3) | ไม่ควรบังคับให้ผู้ใช้กดปิด |
| ฟอร์มยาวหลายขั้นตอน | หน้าเต็ม | modal สูงเกิน 60vh ต้องเลื่อนในกล่องซ้อนกล่อง |
| เนื้อหาที่ต้อง bookmark / แชร์ | หน้าที่มี URL | modal ไม่มี URL — กด Back แล้วหลุดหน้า |

---

## 2 · React API

```tsx
import { Dialog, DialogOverlay, DialogTrigger, Button } from '@smego/ui';

<DialogTrigger>
  <Button variant="danger">ลบรายการนี้</Button>
  <DialogOverlay size="sm">
    <Dialog title="ยืนยันการลบรายการ" footer={…}>…</Dialog>
  </DialogOverlay>
</DialogTrigger>
```

### Dialog

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `title` | `string` | — | **บังคับ** · RAC เชื่อม `aria-labelledby` ให้ |
| `children` | `ReactNode` | — | เนื้อหา |
| `footer` | `ReactNode` | — | แถวปุ่ม |
| `variant` | `'modal' \| 'sheet' \| 'drawer'` | `'modal'` | คุม padding |
| `hideClose` | `boolean` | `false` | ใช้เฉพาะ dialog ที่บังคับให้เลือก |

### DialogOverlay

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `variant` | `'modal' \| 'sheet' \| 'drawer'` | `'modal'` | **ต้องตรงกับของ `Dialog`** |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 560 / 768 / 1280 |
| prop อื่นของ RAC `ModalOverlay` | | | `isDismissable` ฯลฯ |

`DialogTrigger` คือ RAC `DialogTrigger` ตรง ๆ — รับ `<Button>` เป็นลูกแรก

ปุ่มปิดจากภายใน: `<Button slot="close">` หรือ render prop `{({ close }) => …}`

---

## 3 · Variants

| variant | ตำแหน่ง | มุม | ขนาด |
|---|---|---|---|
| `modal` | กลางจอ · `p-4` รอบนอก | `--radius-overlay` ทุกมุม | ตาม `size` |
| `sheet` | ชิดล่าง | **มุมบนโค้ง มุมล่าง 0** · `border-b-0` | `max-h-[90vh]` |
| `drawer` | ชิดซ้าย เต็มความสูง | มุมขวาโค้ง · `border-s-0` | `max-w-(--sidebar-width)` |

### ★ `sheet` มุมล่างเป็น 0 เพราะ **ชนขอบจอ** (ข้อ 05 §7)

มุมโค้งที่ชนขอบจอทำให้เห็นแถบพื้นหลังบาง ๆ ตรงมุม ซึ่งดูเหมือนบั๊กมากกว่าการตกแต่ง — เหตุผลเดียวกับที่ `border-b-0`

### ★★ โหมดมืด — **backdrop ช่วยไม่ได้เลย** (ข้อ 06 §3.5)

โหมดสว่าง backdrop ทำให้พื้นหลังมืดลง แล้ว modal สีขาวเด่นขึ้นเป็น **~11:1**

โหมดมืดพื้นหลังมืดอยู่แล้ว การใส่ backdrop **แทบไม่เปลี่ยนอะไร** — modal vs พื้นหลังเหลือประมาณ **1.7:1**

**ทางแก้:** `--elevation-edge-modal` เป็น `neutral-500` ในโหมดมืด ซึ่งได้ **3.84:1 บน surface** และ **4.38:1 บน canvas**

**ขอบรับน้ำหนักการแยก ไม่ใช่ backdrop** — backdrop เหลือหน้าที่เดียวคือบอกว่า "พื้นหลังกดไม่ได้"

---

## 4 · States

| state | `data-*` จาก RAC | สิ่งที่เกิด |
|---|---|---|
| entering | `data-entering` | `animate-[fade-in_150ms_ease-out]` บน backdrop |
| open | — | focus อยู่ใน dialog · พื้นหลัง inert |
| exiting | `data-exiting` | RAC รอ animation จบก่อน unmount |

### ★ เข้า/ออกด้วย **opacity เท่านั้น** — ไม่มี transform ไม่มี blur

`backdrop-filter` **แพงเกินไปสำหรับ Android ระดับล่าง** (ข้อ 07 §5.1) ซึ่งเป็นเกณฑ์อุปกรณ์ของโครงการ

opacity ล้วนยังทำงานภายใต้ reduced motion (ข้อ 17 ระบุ ALLOW สำหรับ crossfade)

### ★★ focus ต้องย้ายเข้า modal **ทันทีที่ mount** ไม่ใช่หลัง animation จบ

(ข้อ 07 §7.3) ถ้ารอ 150ms ผู้ใช้คีย์บอร์ดจะกดปุ่มได้ในช่วงที่ focus ยังอยู่ข้างหลัง

RAC จัดการให้ **และคืน focus กลับที่ตัวเปิดเมื่อปิด** ด้วย

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| role | `dialog` + `aria-modal="true"` จาก RAC |
| ชื่อ | `<Heading slot="title">` → `aria-labelledby` อัตโนมัติ |
| **SC 2.1.2** | **Esc ออกได้เสมอ** แม้ modal กัก focus |
| **SC 2.4.3** | focus คืนกลับที่ตัวเปิด |
| **SC 1.4.11** | ขอบ modal ในโหมดมืด 3.84:1 บน surface ✅ |
| **SC 2.4.7** | ⚠️ **ไม่มี `overflow-hidden` บน Dialog** — ดูด้านล่าง |
| **SC 2.5.7** | bottom sheet ที่ลากปิดได้ **ต้องมีปุ่มปิดคู่เสมอ** |
| **SC 1.3.1** | ปุ่มปิดมี `aria-label` ภาษาไทยจาก `strings.th.ts` |

### ★★ ไม่มี `overflow-hidden` บนตัว Dialog

วงแหวน focus ของ element ข้างในจะถูกตัด 4px (ข้อ 05 §5)

ถ้าเนื้อหายาว ให้ **scroll ที่ส่วน body เท่านั้น** และเผื่อที่ให้วงแหวน:

```
'-m-1 max-h-[60vh] min-w-0 overflow-y-auto p-1'
```

`p-1` (4px) เผื่อวงแหวน · `-m-1` ดึงกลับเพื่อไม่ให้ layout ขยับ

### ★ ปุ่มปิดต้องมี `aria-label` ภาษาไทย

`IconButton` บังคับ `label` เป็น **prop จำเป็น** จึงลืมไม่ได้ — ข้อความมาจาก `s.common.close`

### ★ ปุ่มซ้อนแนวตั้งบนมือถือ ปุ่มหลักอยู่บน (ข้อ 08 §7)

```
'flex flex-col-reverse gap-3 md:flex-row md:justify-end'
```

`flex-col-reverse` ทำให้ปุ่มหลักที่อยู่ **หลัง** ใน DOM ปรากฏ **บน** จอ

ผู้ใช้คีย์บอร์ดยังเจอ "ยกเลิก" ก่อน "ลบถาวร" ซึ่ง **เป็นพฤติกรรมที่ต้องการ** สำหรับปุ่มทำลาย

### ⚠️ `hideClose` ใช้ได้เมื่อไร

เฉพาะ dialog ที่ **บังคับให้เลือก** เช่นยอมรับเงื่อนไขก่อนใช้งานครั้งแรก

แม้ในกรณีนั้น **Esc ยังต้องทำงาน** (SC 2.1.2) — ถ้าต้องปิด Esc ด้วย แปลว่าไม่ควรเป็น modal ตั้งแต่แรก

---

## 6 · Tailwind implementation

```tsx
<RACModalOverlay className={cn(
  'fixed inset-0 z-50 flex',
  'bg-backdrop',
  'data-entering:animate-[fade-in_150ms_ease-out]',
  variant === 'modal'  && 'items-center justify-center p-4',
  variant === 'sheet'  && 'items-end justify-center',
  variant === 'drawer' && 'items-stretch justify-start',
)}>
  <RACModal className={cn(
    'w-full min-w-0',
    'bg-(--elevation-surface-modal)',
    'border border-(--elevation-edge-modal)',   /* ★ ขอบคือตัวแยกจริงในโหมดมืด */
    'shadow-(--elevation-modal)',
    variant === 'modal' && ['rounded-(--radius-overlay)', sizeClass[size]],
    variant === 'sheet' && [
      'rounded-ss-(--radius-overlay) rounded-se-(--radius-overlay)',
      'border-b-0', 'max-h-[90vh]',
    ],
    variant === 'drawer' && [
      'h-full max-w-(--sidebar-width)',
      'rounded-se-(--radius-overlay) rounded-ee-(--radius-overlay)',
      'border-s-0',
    ],
  )}>
```

`sizeClass` ผูกกับ container token ที่ใช้ทั้งระบบ:

```ts
const sizeClass = {
  sm: 'max-w-(--container-form)',      /*  560px */
  md: 'max-w-(--container-narrow)',    /*  768px */
  lg: 'max-w-(--container-content)',   /* 1280px */
} as const;
```

---

## 7 · Figma Variant

Component set **`Dialog`**

| Property | Values |
|---|---|
| `Variant` | `Modal` · `Sheet` · `Drawer` |
| `Size` | `SM` · `MD` · `LG` |
| `Close button` | `True` · `False` |
| `Footer` | `None` · `1 button` · `2 buttons` |

**ต้องมีทั้งสอง mode สี** — โหมดมืดต้องแสดง **ขอบ `neutral-500` ที่ชัดเจน** ถ้านักออกแบบวาดโหมดมืดด้วยเงาอย่างเดียว modal จะแยกจากพื้นหลังไม่ได้ (1.7:1)

**`Footer / 2 buttons` ต้องมี 2 frame** — มือถือ (ซ้อนแนวตั้ง ปุ่มหลักบน) และเดสก์ท็อป (แนวนอน ชิดขวา)

**ต้องมี `Focus` state ของ element ข้างใน** เพื่อให้เห็นว่าวงแหวนล้นออก 4px และต้องเผื่อที่

---

## 8 · Usage

```tsx
// ยืนยันการลบ — ปุ่มทำลายอยู่ท้าย DOM แต่บนจอมือถือ
<DialogTrigger>
  <Button variant="danger" icon="trash">ลบรายการนี้</Button>
  <DialogOverlay size="sm">
    <Dialog
      title="ยืนยันการลบรายการ"
      footer={
        <>
          <Button variant="secondary" slot="close">ยกเลิก</Button>
          <Button variant="danger" onPress={doDelete}>ลบถาวร</Button>
        </>
      }
    >
      <p className="text-body-sm text-fg-secondary">
        เครื่องคั่วกาแฟ 5 กก. จะถูกลบออกจากรายการสินค้าของคุณ การลบนี้ย้อนกลับไม่ได้
      </p>
    </Dialog>
  </DialogOverlay>
</DialogTrigger>
```

```tsx
// ตัวกรองบนมือถือ — drawer
<DialogTrigger>
  <Button variant="secondary" icon="sliders-horizontal">ตัวกรอง</Button>
  <DialogOverlay variant="drawer">
    <Dialog variant="drawer" title="ตัวกรอง"
      footer={<Button fullWidth slot="close">ดูผลลัพธ์ 128 รายการ</Button>}>
      <FilterPanel />
    </Dialog>
  </DialogOverlay>
</DialogTrigger>
```

```tsx
// bottom sheet บนมือถือ — ต้องมีปุ่มปิดคู่กับการลาก (SC 2.5.7)
<DialogOverlay variant="sheet" isDismissable>
  <Dialog variant="sheet" title="เลือกวิธีชำระเงิน">…</Dialog>
</DialogOverlay>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| `<Dialog className="overflow-hidden">` | scroll ที่ body + `p-1` | ตัดวงแหวน focus = ไม่ผ่าน SC 2.4.7 |
| `backdrop-blur-sm` | opacity ล้วน | `backdrop-filter` แพงเกินไปบน Android ระดับล่าง |
| โหมดมืดพึ่ง backdrop แยก modal | ขอบ `--elevation-edge-modal` | 1.7:1 — modal จมกับพื้นหลัง |
| ปิด Esc ด้วย `preventDefault` | ปล่อยให้ทำงาน | ไม่ผ่าน SC 2.1.2 |
| bottom sheet ที่ปิดได้ด้วยการลากอย่างเดียว | มีปุ่มปิดคู่ | ไม่ผ่าน SC 2.5.7 |
| `<div>` เป็นหัวข้อ | `<Heading slot="title">` | ไม่มี `aria-labelledby` = dialog ไม่มีชื่อ |
| ย้าย focus หลัง animation จบ | ทันทีที่ mount | ผู้ใช้กดปุ่มหลัง modal ได้ในช่วงนั้น |
| ปุ่มหลักอยู่ล่างบนมือถือ | `flex-col-reverse` | ปุ่มหลักต้องอยู่ในระยะนิ้วโป้ง (ข้อ 08 §7) |
| modal สำหรับฟอร์ม 5 ขั้นตอน | หน้าเต็ม | 60vh + กล่องซ้อนกล่อง = เลื่อนสองชั้น |
| `hideClose` เพื่อความสวย | ปล่อยปุ่มปิดไว้ | ผู้ใช้ touch ที่ไม่รู้ว่ากดนอกกล่องได้จะติดค้าง |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/primitives.test.tsx` ตอนเปิดอยู่ · `SC 2.4.3` ลำดับ focus |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · เต็มจอที่มือถือแล้วเป็นกล่องกลางจอที่ `md` ขึ้นไป |
| โหมดมืด (Dark Mode) | ✅ | ฉากหลังและกล่องใช้ `--elevation-*-overlay` · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | ใช้คู่ `ms-`/`me-` อยู่แล้ว · `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | `e2e/wcag22.spec.ts:228` `Esc` ปิดแล้ว**คืน focus ที่ตัวเปิด** · `:250` `Tab` วนอยู่ข้างในไม่หลุดไปหลังฉาก · `:268` ปุ่มปิดในหัวคืน focus (SC 2.1.2) |
| กำลังโหลด (Loading) | — | เนื้อหาใน dialog เป็นของผู้เรียก — สถานะกำลังส่งอยู่ที่ปุ่มยืนยันใน `footer` |
| ข้อผิดพลาด (Error) | — | dialog เป็นภาชนะ · ข้อผิดพลาดของฟอร์มข้างในใช้ [`<Alert>`](./Alert.md) |
| ว่างเปล่า (Empty) | — | dialog ที่ไม่มีเนื้อหาคือ dialog ที่ไม่ควรเปิด |
| Skeleton | — | ถ้าเนื้อหายังไม่มา ไม่ควรเปิด dialog ตั้งแต่แรก — ผู้ใช้ถูกกัก focus ไว้ในกล่องว่าง |
| การเคลื่อนไหว (Animation) | ✅ | §4 `entering`/`exiting` ใช้ `fade` **opacity ล้วน ไม่มี transform** · `base.css §10` ครอบ `*` ด้วย `!important` — ไม่มีการเคลื่อนไหวที่หลุดตัวกัน (`lint-quality.mjs` 0 จุด) |
| ประสิทธิภาพ (Performance) | ✅ | ฉากหลังใช้ opacity ซึ่งอยู่บน compositor · ไม่มีความสูงตายตัว |
