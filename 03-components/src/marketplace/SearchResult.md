# SearchResult

**`@smego/ui`** · ชั้น 03 · [SearchResult.tsx](./SearchResult.tsx)

---

## 1 · ภาพรวม

หัวผลการค้นหา — จำนวนที่พบ · แถบเครื่องมือ · และ **สถานะว่าง**

หน้าที่จริงของ component นี้คือ **ประกาศจำนวนผลลัพธ์ให้ผู้ใช้ screen reader** ซึ่งเป็นข้อกำหนดที่มองไม่เห็นและถูกลืมบ่อยที่สุดในหน้าค้นหา

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| รายการที่ไม่ได้มาจากการค้นหา/กรอง | `<Grid>` เปล่า | ไม่มีอะไรให้ประกาศ |
| ผลลัพธ์ที่โหลดทีละหน้า | + `<Pagination>` (Pass 4) | ต้องประกาศหน้าปัจจุบันด้วย |
| สถานะว่างที่ไม่ใช่ผลการค้นหา | `<EmptyState>` (Pass 3) | ข้อความช่วยเหลือคนละแบบ |

---

## 2 · React API

```tsx
<SearchResult count={128} query="เครื่องคั่วกาแฟ" toolbar={<SortSelect />}>
  <Grid as="ul" preset="product-filtered">…</Grid>
</SearchResult>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `count` | `number` | — | `undefined` = ยังไม่รู้ (โหลดครั้งแรก) |
| `isLoading` | `boolean` | `false` | ประกาศ "กำลังค้นหา" |
| `query` | `string` | — | แสดงต่อท้ายจำนวน |
| `toolbar` | `ReactNode` | — | ตัวเรียง · สลับมุมมอง |
| `children` | `ReactNode` | — | กริดผลลัพธ์ |
| `emptyAction` | `ReactNode` | — | ปุ่มในสถานะว่าง |

---

## 3 · Variants

ไม่มี variant — มี 3 สถานะที่มาจากข้อมูล

| สถานะ | เงื่อนไข | สิ่งที่เห็น |
|---|---|---|
| กำลังโหลด | `isLoading` | "กำลังค้นหา" + `children` (เช่น skeleton) |
| มีผลลัพธ์ | `count > 0` | "พบ 128 รายการ" + `children` |
| **ว่าง** | `count === 0` | ไอคอน + "ไม่พบรายการ" + **ทางออก** |

---

## 4 · States

### ★★ live region ต้อง **อยู่ใน DOM ตั้งแต่แรก** ไม่ใช่เพิ่งใส่เข้ามา

ถ้า element ที่มี `aria-live` ถูก mount **พร้อมกับ** ข้อความ screen reader ส่วนใหญ่ **จะไม่ประกาศ** เพราะมันเฝ้าดูการเปลี่ยนแปลง *ภายใน* region ที่มีอยู่แล้ว

component จึง render `<span aria-live="polite">` **เสมอ** แล้วเปลี่ยนแค่ข้อความข้างใน — ตอนยังไม่รู้จำนวนก็เป็นสตริงว่าง

นี่เป็นความผิดพลาดที่ทดสอบด้วยตาไม่มีทางเจอ

### ★ `aria-atomic="true"`

บังคับให้อ่าน **ทั้งข้อความ** ไม่ใช่เฉพาะส่วนที่เปลี่ยน — ถ้าไม่ใส่ ผู้ใช้อาจได้ยินแค่ "3" แทน "พบ 3 รายการ"

### ★ ตัวเลขที่แสดงกับที่ประกาศเป็น **ข้อความเดียวกัน**

```tsx
const statusText = isLoading ? s.search.searching
  : count === undefined ? '' : s.search.resultCount(count);
```

เขียนครั้งเดียว ใช้สองที่ — ไม่มีทางที่จอกับเสียงจะไม่ตรงกัน

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| **SC 4.1.3** | จำนวนผลลัพธ์ถูกประกาศโดยไม่ย้าย focus |
| **SC 3.3.1** | สถานะว่างบอกวิธีแก้ |
| **SC 1.4.3** | `fg-secondary` 5.74:1 · `fg-muted` 6.05:1 |

### ★★ SC 4.1.3 — ทำไมต้องประกาศ

ผู้ใช้ screen reader ที่กดตัวกรองแล้ว **ไม่ได้ยินอะไรเลย ไม่รู้ว่าเกิดอะไรขึ้น**

จำนวนอาจเปลี่ยนจาก 128 เป็น 3 โดยที่ focus ยังอยู่ที่ chip เดิม — ถ้าไม่ประกาศ ผู้ใช้ต้องเดินทางไปที่ผลลัพธ์เพื่อตรวจสอบทุกครั้งที่กรอง

`aria-live="polite"` ประกาศ **โดยไม่ต้องย้าย focus** ซึ่งเป็นหัวใจของข้อนี้ — การย้าย focus ไปที่ผลลัพธ์จะทำให้ผู้ใช้กรองต่อไม่ได้

⚠️ **ห้าม `assertive`** — จะขัดสิ่งที่ผู้ใช้กำลังฟังกลางประโยค และการกรองไม่ใช่เรื่องฉุกเฉิน

**วัดแล้วในเบราว์เซอร์:** `polite: "พบ 128 รายการ"` · `polite: "พบ 0 รายการ"`

### ★ บล็อกสถานะว่าง **ไม่ใช่** live region

ข้อความจำนวนด้านบนประกาศ "พบ 0 รายการ" ไปแล้ว — ถ้าบล็อกว่างประกาศซ้ำ ผู้ใช้จะได้ยินสองรอบ

### ★★ สถานะว่างต้องบอก **ทางออก** ไม่ใช่แค่บอกว่าไม่พบ (ข้อ 01)

> "ลองใช้คำค้นที่สั้นลง หรือลดจำนวนตัวกรอง"

ผู้ใช้ที่ค้นไม่เจอคือ **ผู้ใช้ที่กำลังจะออกจากเว็บ** · `emptyAction` ควรเป็นปุ่ม "ล้างตัวกรองทั้งหมด" เมื่อมีตัวกรองอยู่ เพราะนั่นคือสาเหตุที่พบบ่อยที่สุด

---

## 6 · Tailwind implementation

```tsx
<p className="text-body-sm text-fg-secondary">
  {/* ★ region อยู่ใน DOM เสมอ — เปลี่ยนแค่ข้อความข้างใน */}
  <span aria-live="polite" aria-atomic="true">{statusText}</span>
  {query && !isLoading && <span className="text-fg-muted"> · “{query}”</span>}
</p>
```

```tsx
<div className="grid min-w-0 justify-items-center gap-3 px-4 py-12 text-center">
  <Icon name="search" size={32} className="text-fg-muted" />
  <p className="text-subtitle text-fg">{s.search.noResults}</p>
  <p className="max-w-(--container-form) text-body-sm text-fg-muted">
    {s.search.noResultsHelp}
  </p>
  {emptyAction}
</div>
```

`max-w-(--container-form)` (560px) จำกัดความยาวบรรทัดข้อความช่วยเหลือ — ข้อความกลางหน้าที่ยาวเต็มจอ 1280px อ่านยาก

---

## 7 · Figma Variant

Component set **`SearchResult`**

| Property | Values |
|---|---|
| `State` | `Loading` · `Results` · **`Empty`** |
| `Query` | `True` · `False` |
| `Toolbar` | `True` · `False` |

**`Empty` frame ต้องมีข้อความช่วยเหลือและปุ่มจริง** ไม่ใช่แค่ไอคอนกับคำว่า "ไม่พบข้อมูล"

**ต้องเขียนใน description ว่าจำนวนถูกประกาศผ่าน `aria-live`** — เป็นพฤติกรรมที่มองไม่เห็นใน Figma แต่นักพัฒนาต้องรู้ว่าห้ามลบ

---

## 8 · Usage

```tsx
<SearchResult
  count={results.length}
  isLoading={isFetching}
  query={query}
  toolbar={<SortSelect value={sort} onChange={setSort} />}
  emptyAction={
    activeFilters.length > 0
      ? <Button variant="secondary" size="sm" onPress={clearAll}>ล้างตัวกรองทั้งหมด</Button>
      : undefined
  }
>
  <Grid as="ul" preset="product-filtered">
    {results.map((p) => <ProductCard key={p.id} as="li" {...p} />)}
  </Grid>
</SearchResult>
```

```tsx
// ระหว่างโหลด — skeleton เป็น children
<SearchResult isLoading>
  <SkeletonGroup isLoading>
    <Grid preset="product-filtered">…</Grid>
  </SkeletonGroup>
</SearchResult>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| mount live region พร้อมข้อความ | region อยู่ใน DOM เสมอ | screen reader ส่วนใหญ่ไม่ประกาศ |
| `aria-live="assertive"` | `"polite"` | ขัดสิ่งที่ผู้ใช้กำลังฟัง |
| ย้าย focus ไปผลลัพธ์หลังกรอง | ประกาศผ่าน live region | ผู้ใช้กรองต่อไม่ได้ |
| ไม่มี `aria-atomic` | `aria-atomic="true"` | ได้ยินแค่ "3" ไม่ใช่ "พบ 3 รายการ" |
| เขียนข้อความจำนวนสองที่ | ตัวแปรเดียว | จอกับเสียงไม่ตรงกันเมื่อแก้ที่เดียว |
| บล็อกว่างเป็น live region ด้วย | ไม่ใช่ | ประกาศซ้ำสองรอบ |
| "ไม่พบข้อมูล" เฉย ๆ | + วิธีแก้ + ปุ่ม | ผู้ใช้ที่ค้นไม่เจอกำลังจะออกจากเว็บ |
| ข้อความช่วยเหลือกว้างเต็มจอ | `max-w-(--container-form)` | บรรทัดยาว 1280px อ่านยาก |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` **ทั้งกรณีมีผลลัพธ์และกรณีว่าง** · `SC 4.1.3` จำนวนผลลัพธ์ประกาศผ่าน live region |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · กริดข้างในเป็น [`<Grid preset="product-filtered">`](../layout/Grid.md) ซึ่งวัดที่ 320px แล้ว (`e2e/pass4.spec.ts:123`) |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | `emptyAction` เป็นปุ่มจริงที่ `Tab` ถึงได้ — ทางออกจากผลลัพธ์ว่างต้องกดถึงด้วยคีย์บอร์ด |
| กำลังโหลด (Loading) | ✅ | **`isLoading` อยู่ที่นี่โดยตั้งใจ** — นี่คือชั้นที่รู้ว่ากริดกำลังโหลด ส่วนการ์ดแต่ละใบไม่รู้และไม่ควรรู้ |
| ข้อผิดพลาด (Error) | ✅ | `SC 3.3.1` คำค้นที่ผิดรูปแบบบอกเป็นข้อความพร้อมวิธีแก้ · `SC 1.4.3` ข้อความผ่าน contrast AA |
| ว่างเปล่า (Empty) | ✅ | **นี่คือหน้าที่หลักอย่างหนึ่งของ component นี้** — axe ผ่านกรณี `count={0}` พร้อม `emptyAction` ("ล้างตัวกรองทั้งหมด") · ผลลัพธ์ว่างต้องมี**ทางออก** ไม่ใช่แค่ข้อความ |
| Skeleton | ✅ | ระหว่าง `isLoading` แสดง [`<SkeletonGroup>`](../feedback/Skeleton.md) ที่ประกาศสถานะโหลดครั้งเดียว ไม่ใช่ประกาศทีละการ์ด |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — ผลลัพธ์ที่เปลี่ยนต้องอ่านได้ทันที ไม่ใช่ค่อย ๆ fade เข้า |
| ประสิทธิภาพ (Performance) | ✅ | จำนวนผลลัพธ์เป็นข้อความที่ส่งมา ไม่ได้นับจาก DOM · ไม่มีความสูงตายตัว |
