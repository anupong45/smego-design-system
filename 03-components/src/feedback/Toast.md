# Toast · ToastRegion

**`@smego/ui`** · ชั้น 03 · [Toast.tsx](./Toast.tsx)

---

## 1 · ภาพรวม

ข้อความยืนยันชั่วคราวที่ลอยอยู่มุมจอและ **หายไปเอง**

ระบบนี้ประกาศกฎ "ไม่มีอะไรหายไปตามเวลา" ไว้หลายที่ — Toast คือ **ข้อยกเว้นเดียว** และถูกจำกัดขอบเขตไว้แคบมากด้วย type ไม่ใช่ด้วยเอกสาร

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ข้อผิดพลาดทุกชนิด | [`<Banner tone="danger" isLive>`](./Banner.md) | ข้อความที่บอกว่าต้องทำอะไรต่อ ห้ามหายก่อนอ่านจบ |
| คำเตือนก่อนตัดสินใจ | `<Banner tone="warning">` | ต้องอยู่ค้างระหว่างที่ผู้ใช้คิด |
| ข้อมูลที่ไม่มีอยู่ที่อื่นในหน้า | วางในหน้า | toast ที่พลาดไปต้องไม่ทำให้เสียอะไร |
| ยืนยันการทำลายข้อมูล | `<Dialog>` | ต้องกดยืนยัน ไม่ใช่แจ้งให้ทราบ |

---

## 2 · React API

```tsx
// วางครั้งเดียวที่รากของแอป
<SmeGoProvider>
  <App />
  <ToastRegion />
</SmeGoProvider>

// เรียกจากที่ไหนก็ได้ ไม่ต้อง useContext
showToast({ title: s.buy.addedToCart('เครื่องคั่วกาแฟ TR-500') });
```

### showToast

| อาร์กิวเมนต์ | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `content.title` | `string` | — | **บังคับ** · ต้องบอกว่าเกิดอะไรกับ *อะไร* |
| `content.tone` | `'success' \| 'info'` | `'success'` | ★ ไม่มี `danger` / `warning` |
| `timeoutMs` | `number` | `6000` | ค่าที่ต่ำกว่า 6000 ถูกยกขึ้นเป็น 6000 |

### ToastRegion

| prop | type | หมายเหตุ |
|---|---|---|
| `className` | `string` | ทับตำแหน่งได้ แต่ห้ามทับ `z-(--z-toast)` |

---

## 3 · Variants

| tone | ไอคอน | ใช้กับ |
|---|---|---|
| `success` | วงกลม-ถูก | เพิ่มลงตะกร้า · บันทึกรายการ · คัดลอกเลขอ้างอิง |
| `info` | วงกลม-i | สถานะที่ผู้ใช้ไม่ได้สั่งโดยตรง เช่นซิงก์ตะกร้าจากอุปกรณ์อื่น |

**ไม่มี `danger` และ `warning` — และนี่คือทั้งหมดของการออกแบบ component นี้**

ถ้าอยากได้ toast สีแดง แปลว่าสิ่งนั้นไม่ใช่ toast

---

## 4 · States

| state | พฤติกรรม |
|---|---|
| เข้า | **ไม่มี animation** — ดูด้านล่าง |
| นับถอยหลัง | 6 วินาที |
| **hover / focus ที่ region** | **หยุดนับ** และเดินต่อเมื่อออก (SC 2.2.1) |
| กดปุ่มปิด | หายทันที ไม่มี animation ออก |
| เกิน 3 ใบ | ใบที่เกินรอคิว ไม่ซ้อนกันจนบังหน้า |

### ⚠️ ไม่มี animation เข้า/ออก — และเคยเขียนไว้ผิด

เดิมโค้ดมี `data-entering:animate-[fade-in_150ms]` กับ `data-exiting:animate-[fade-out_150ms]` และเอกสารบรรทัดนี้ก็บอกว่ามี · **วัดแล้วทั้งคู่เป็นโค้ดตาย**

`react-aria-components@1.19` **ไม่ปล่อย** `data-entering` / `data-exiting` บน `UNSTABLE_Toast` เลย — `Toast.mjs` มีแค่ `data-hovered` · `data-focused` · `data-focus-visible` และ DOM จริงที่วัดได้มีแค่

```
class · data-rac · role · aria-modal · aria-labelledby · tabindex
```

ตัดคลาสทั้งสองออกแล้ว และมี**เทสที่จะแดงถ้า RAC เพิ่ม attribute สองตัวนี้ในอนาคต** เพื่อเป็นสัญญาณให้กลับมาใส่ animation ได้อย่างถูกต้อง (`tests/a11y/toast.test.tsx`)

ผลกระทบต่อผู้ใช้: toast โผล่มาทันที ซึ่ง**ไม่ขัดข้อ 07** เพราะข้อ 07 ห้ามการเคลื่อนไหวที่ไม่จำเป็น ไม่ได้บังคับให้มี

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 2.2.1** | หยุดนับเมื่อ hover/focus · ปิดเองได้เสมอ · ขั้นต่ำ 6 วินาที |
| **SC 4.1.3** | ประกาศผ่าน `role="alert"` + `aria-atomic` ที่ **ToastContent** — ไม่มี `aria-live` ที่ไหนเลย (วัดแล้ว) |
| **SC 2.5.3** | ชื่อปุ่มปิดรวมข้อความของ toast ใบนั้น |
| **SC 1.4.1** | tone ต่างกันที่ **รูปทรงไอคอน** ไม่ใช่แค่สี |
| **SC 2.1.2** | region เป็น landmark เข้าถึงด้วย F6 ไม่ถูก focus trap ของ modal กัก |

### ★★★ ชื่อ region มาจาก RAC — **ห้ามเขียนทับ**

RAC ตั้ง `aria-label` ให้เองพร้อม **จำนวนใบที่ค้างอยู่** · วัดได้จริง:

```
1 ใบ → "มีการแจ้งเตือน 1 รายการ"
2 ใบ → "มีการแจ้งเตือน 2 รายการ"
```

เดิมโค้ดส่ง `aria-label={s.toast.regionLabel}` = `"ข้อความแจ้งเตือน"` ซึ่ง **ทับข้อมูลจำนวนทิ้งเงียบ ๆ** — ผู้ใช้ screen reader ที่กด F6 มาที่ landmark นี้จะไม่รู้ว่ามีกี่ใบรออยู่ · ตัดออกแล้ว พร้อมลบ `s.toast.regionLabel` ออกจาก dictionary

✅ **ข้อความนี้เป็นไทยโดยไม่ต้องทำอะไร** ตั้งแต่ 2026-07-28 — `SmeGoProvider` ติดตั้งคำแปลภายในของ RAC ให้เอง (ก่อนหน้านี้เป็น opt-in และถ้าแอปลืมเรียกจะได้ `"2 notifications."` ซึ่งวัดไว้แล้ว) · ปิดได้ด้วย `skipRacStrings` ถ้าแอปติดตั้งเอง — ดู [`SmeGoProvider.tsx`](../provider/SmeGoProvider.tsx)

### ★★ Toast **ไม่มีปุ่มการกระทำ** — และ `s.toast.undo` ถูกลบทิ้ง

"เลิกทำ" ในกล่องที่หายไปใน 6 วินาทีคือ **โอกาสที่มีเวลาจำกัด** ซึ่งเป็นสิ่งที่ SC 2.2.1 พูดถึงตรง ๆ · ผู้ใช้ที่อ่านช้า ใช้ screen reader หรือใช้สวิตช์เดียว จะไปไม่ถึงปุ่มทัน

ถ้ามีอะไรให้ทำ **นั่นไม่ใช่ toast** — ใช้ [`<Banner>`](./Banner.md) ที่อยู่ค้าง และทางเลิกทำต้องมีอยู่ที่อื่นบนหน้าด้วยเสมอ

### ★★★ เวลาขั้นต่ำ 6 วินาที ไม่ใช่ค่าที่เลือกตามความรู้สึก

⚠️ **RAC ไม่มีขั้นต่ำและไม่เตือนอะไรเลย** — วัดแล้ว `timeout: 1000` ผ่านฉลุย และ `console.warn` ถูกเรียก **0 ครั้ง** (เอกสารฉบับก่อนเขียนว่า "React Aria เตือนที่ต่ำกว่า 5 วินาที" ซึ่งไม่จริง)

6 วินาทีจึงเป็น**นโยบายของระบบนี้ล้วน ๆ** เหตุผล: ข้อความไทยยาวกว่าอังกฤษ **20–40%** ("เพิ่มลงตะกร้าแล้ว" vs "Added to cart") จึงต้องเผื่อเวลาอ่าน

`showToast` **ยกค่าที่ต่ำกว่าขึ้นให้อัตโนมัติ** — ตั้งผิดไม่ได้

### ★★★ เนื้อหาต้องซ้ำกับสิ่งที่เห็นอยู่แล้ว

toast เป็น *การยืนยัน* ไม่ใช่ *ช่องทางข้อมูล*

"เพิ่มเครื่องคั่วกาแฟ TR-500 ลงตะกร้าแล้ว" ใช้ได้ เพราะตัวเลขบนไอคอนตะกร้าใน [`TopNav`](../navigation/TopNav.md) เปลี่ยนไปแล้วด้วย และ [`CartDrawer`](../marketplace/Cart.md) เปิดให้เห็นของจริง

ผู้ใช้ที่พลาด toast ไปต้อง **ไม่เสียอะไรเลย**

### ★★ ทำไม toast อยู่เหนือ modal

`z-(--z-toast)` = 60 สูงกว่า `--z-modal` = 50 **โดยตั้งใจ** — toast ที่เกิดตอน modal เปิดต้องมองเห็น และ `ToastRegion` เป็น landmark ที่เข้าถึงด้วย F6 ได้ จึงไม่ถูก focus trap กัก

### ★ region ไม่จองพื้นที่ท้ายเอกสาร

ต่างจาก `CompareBar` ที่ประกาศ `--compare-bar-height` — toast เป็นของชั่วคราวที่ลอยทับ ถ้าจองพื้นที่ หน้าจะขยับทุกครั้งที่มี toast

---

## 6 · Tailwind implementation

```tsx
<RACToastRegion
  queue={toastQueue}
  /* ★★ ไม่ตั้ง aria-label เอง — ดู §5 */
  className="fixed inset-x-4 bottom-4 z-(--z-toast) flex flex-col gap-2
             md:inset-x-auto md:end-6 md:bottom-6 md:w-(--container-form)"
>
```

ก้นจอบนมือถือ = ระยะนิ้วโป้ง และไม่ทับช่องค้นหาด้านบน (ข้อ 08 §7) · มุมล่างขวาที่ md ขึ้นไป

พื้นและเงาใช้ `--elevation-*-overlay` ไม่ใช่ `shadow-lg` ตรง ๆ — ในโหมดมืด **ขอบรับหน้าที่แยกชั้น ไม่ใช่เงา**

---

## 7 · Figma Variant

Component set **`Toast`**

| Property | Values |
|---|---|
| `Tone` | **`Success`** · `Info` |
| `Length` | `1 บรรทัด` · `2 บรรทัด (ชื่อสินค้ายาว)` |

**ห้ามมี property `Tone = Error`** — ถ้ามีใน Figma นักพัฒนาจะสร้างขึ้นในโค้ด และเส้นแบ่งกับ `Banner` จะหายไปภายในสปรินต์เดียว

---

## 8 · Usage

```tsx
function ProductPage({ product }) {
  const s = useStrings();
  const [isAdding, setAdding] = useState(false);
  const [error, setError] = useState<string>();

  async function addToCart(quantity: number) {
    setAdding(true);
    setError(undefined);
    try {
      await api.addToCart(product.id, quantity);
      showToast({ title: s.buy.addedToCart(product.name) });
    } catch {
      /* ★ error ไม่ใช่ toast */
      setError(s.error.network);
    } finally {
      setAdding(false);
    }
  }

  return (
    <BuyBox
      kind="product"
      name={product.name}
      price={product.price}
      onAddToCart={addToCart}
      isAdding={isAdding}
      errorMessage={error}
    />
  );
}
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| toast แจ้ง error | `<Banner tone="danger" isLive>` | ข้อความที่ต้องลงมือทำห้ามหายเอง |
| `title: 'สำเร็จ'` | `'เพิ่ม X ลงตะกร้าแล้ว'` | "สำเร็จ" ไม่บอกว่าอะไรสำเร็จ |
| ข้อมูลที่มีอยู่ใน toast ที่เดียว | ให้ซ้ำกับหน้า | ผู้ใช้ที่พลาดไปต้องไม่เสียอะไร |
| `timeout: 2000` | 6000 ขึ้นไป | ข้อความไทยยาวกว่า 20–40% |
| toast ที่ปิดไม่ได้ | ปุ่มปิดเสมอ | SC 2.2.1 |
| ปุ่มปิดชื่อ "ปิด" | รวมข้อความของใบนั้น | มีได้ 3 ใบพร้อมกัน (SC 2.5.3) |
| `data-entering:` / `data-exiting:` บน Toast | ไม่ใส่ animation | RAC 1.19 ไม่ปล่อย attribute สองตัวนี้ — เป็นโค้ดตายที่ทำให้เอกสารโกหก (§4) |
| toast เลื่อนเข้าด้วย `translate` | ไม่เคลื่อนที่ | การเคลื่อนที่กระตุ้นระบบทรงตัว (ข้อ 07) |
| ตั้ง `aria-label` ให้ region เอง | ปล่อยให้ RAC ตั้ง | ของ RAC มี**จำนวนใบ**อยู่ด้วย — เขียนทับแล้วข้อมูลนั้นหาย (§5) |
| วาง `<ToastRegion>` หลายที่ | ที่รากที่เดียว | คิวเดียวทั้งแอป |
| `z-50` ดิบ | `z-(--z-toast)` | linter ปฏิเสธ · toast ต้องอยู่เหนือ modal |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/pass5.test.tsx` ตอนมี toast อยู่บนจอ · เทส "ปุ่มปิดมีข้อความของ toast ใบนั้นในชื่อ (SC 2.5.3)" |
| ตอบสนอง (Responsive) | ✅ | §6 `inset-x-4 bottom-4` เต็มความกว้างที่มือถือ → `md:end-6 md:w-(--container-form)` มุมล่างขวา · ความกว้างมาจาก token ไม่ใช่ค่าคงที่ |
| โหมดมืด (Dark Mode) | ✅ | §6 ใช้ `--elevation-*-overlay` ไม่ใช่ `shadow-lg` — ในโหมดมืดขอบรับหน้าที่แยกชั้นแทนเงา · `lint-quality.mjs` 0 จุด |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | §6 ใช้ `inset-x-4` และ `md:end-6` อยู่แล้ว · `lint-quality.mjs` 0 จุด |
| คีย์บอร์ด (Keyboard) | ✅ | §5 `SC 2.1.2` region เป็น landmark เข้าถึงด้วย **F6** และไม่ถูก focus trap ของ modal กัก · §4 focus ที่ region **หยุดนับถอยหลัง** (SC 2.2.1) |
| กำลังโหลด (Loading) | — | toast คือ**ผลลัพธ์**ที่เกิดหลังงานเสร็จแล้ว · สถานะกำลังทำงานอยู่ที่ปุ่มที่สั่ง (`isLoading` ของ [`Button`](../inputs/Button.md)) |
| ข้อผิดพลาด (Error) | — | **ห้ามโดยการออกแบบ ไม่ใช่เพราะยังไม่ได้ทำ** — §3 ไม่มี `danger`/`warning` · §7 ห้ามมี property `Tone = Error` ใน Figma · ใช้ [`<Banner tone="danger" isLive>`](./Banner.md) |
| ว่างเปล่า (Empty) | — | คิวว่าง = ไม่ render อะไรเลย · §5 region ไม่จองพื้นที่ท้ายเอกสาร จึงไม่มีกล่องว่างให้เห็น |
| Skeleton | — | toast ไม่ใช่ตัวแทนเนื้อหาที่กำลังมา — มันมาแล้วจึงจะมี toast |
| การเคลื่อนไหว (Animation) | — | §4 **ไม่มีโดยข้อจำกัดของ RAC 1.19** ซึ่งไม่ปล่อย `data-entering`/`data-exiting` · เคยเขียนว่ามีและเป็นเท็จ · มีเทสกันไม่ให้คลาสตายกลับมา |
| ประสิทธิภาพ (Performance) | ✅ | ไม่มี animation ให้คำนวณเลย · §4 จำกัด **3 ใบพร้อมกัน** ใบที่เกินรอคิว |
