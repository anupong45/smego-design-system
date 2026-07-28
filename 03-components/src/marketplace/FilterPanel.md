# FilterPanel · FilterChipRow

**`@smego/ui`** · ชั้น 03 · [FilterPanel.tsx](./FilterPanel.tsx)

---

## 1 · ภาพรวม

**สองส่วนที่แยกกันโดยตั้งใจ:**

- `FilterPanel` — แผงตัวกรอง (แถบข้างบนเดสก์ท็อป · drawer บนมือถือ)
- `FilterChipRow` — **ตัวกรองที่เลือกไว้ อยู่เหนือผลลัพธ์ ไม่ใช่ในแผง**

การแยกนี้คือทั้งหมดของการออกแบบ — ดู §5

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ตัวกรอง 1–2 ข้อ | `<ChipRow>` ที่มี `<Token>` | แผงทั้งแผงหนักเกินไป |
| เรียงลำดับ | `<Selector>` (Pass 2) | เรียงเลือกได้อันเดียว ไม่ใช่ตัวกรอง |
| ค้นหาในหมวด | `<SearchField>` (Pass 1) | |
| นำทางระหว่างหมวด | `<CategoryNav>` | หมวดคือตำแหน่ง ไม่ใช่ตัวกรอง |

---

## 2 · React API

```tsx
<FilterChipRow filters={active} onRemove={remove} onClearAll={clearAll} />

<FilterPanel
  onClearAll={clearAll}
  groups={[
    { id: 'cat',   title: 'หมวดหมู่ย่อย', children: <CheckboxList …/> },
    { id: 'price', title: 'ช่วงราคา',     children: <Slider …/> },
  ]}
/>
```

### FilterPanel

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `groups` | `FilterGroup[]` | — | `{ id, title, children }` |
| `defaultExpandedKeys` | `string[]` | **ทุกกลุ่ม** | ดู §3 |
| `onClearAll` | `() => void` | — | ส่งเมื่อมีตัวกรองอยู่ |
| `footer` | `ReactNode` | — | ปุ่ม "ดูผลลัพธ์" — **เฉพาะ drawer** |

### FilterChipRow

| prop | type | หมายเหตุ |
|---|---|---|
| `filters` | `ActiveFilter[]` | `{ id, label }` |
| `onRemove` | `(id: string) => void` | |
| `onClearAll` | `() => void` | ปุ่มโผล่เมื่อมี > 1 ตัวกรอง |

---

## 3 · Variants

ไม่มี variant · การเป็นแถบข้างหรือ drawer ถูกกำหนดโดย **ผู้เรียก** ไม่ใช่ prop

```tsx
// เดสก์ท็อป — คอลัมน์ในกริด
<Grid preset="sidebar"><FilterPanel …/><SearchResult …/></Grid>

// มือถือ — ห่อด้วย drawer (หน้าที่ของ **แอป** — ชั้น 05 ไม่ทำ)
<DialogOverlay variant="drawer">
  <Dialog variant="drawer" title="ตัวกรอง"><FilterPanel …/></Dialog>
</DialogOverlay>
```

### ★★ แผงเป็น **drawer จนถึง `lg` (1024px)** ไม่ใช่ `md` (ข้อ 08 §4.1)

ที่ 768px การหั่น 720px เป็น **ตัวกรอง 280 + เนื้อหา 416** ทำให้ card เหลือ **196px ต่อ 2 ใบ**

ซึ่ง **แคบกว่า** ตอนไม่มีตัวกรองที่ได้ **3 ใบ 224px** — เสียทั้งจำนวนและขนาดพร้อมกัน

`Grid preset="sidebar"` เข้ารหัสเรื่องนี้ไว้แล้ว (`lg:grid-cols-[17.5rem_1fr]`) · **วัดจริงที่ 1280px ได้ `280px 912px`**

### ★★ ทุกกลุ่มเปิดไว้ตั้งแต่แรก และเปิดพร้อมกันได้

`defaultExpandedKeys` มีค่าเริ่มต้นเป็น **ทุกกลุ่ม** — ตัวกรองที่ปิดอยู่คือตัวกรองที่ไม่มีใครใช้

`allowsMultipleExpanded` เปิดตายตัว: ถ้าเปิดกลุ่ม "ราคา" แล้วกลุ่ม "หมวดหมู่" ปิดเอง = **บังคับให้ผู้ใช้จำอีกครั้ง**

---

## 4 · States

`FilterChipRow` **ไม่ render อะไรเลยเมื่อไม่มีตัวกรอง** (`return null`)

แถวเปล่าที่มีแต่ความสูงทำให้ผลลัพธ์ **ขยับตอนกรองครั้งแรก** ซึ่งเป็น layout shift ที่หลีกเลี่ยงได้ฟรี

### ★ ปุ่ม "ล้างทั้งหมด" ใน `FilterChipRow` อยู่ **นอก** `ChipRow`

ถ้าอยู่ข้างในจะเลื่อนหายไปพร้อม chip เมื่อมีตัวกรองเยอะ — ซึ่งเป็นตอนที่ผู้ใช้ต้องการปุ่มนี้มากที่สุดพอดี

โผล่เมื่อมี **มากกว่า 1** ตัวกรอง — ตัวเดียวกดปุ่ม × บน chip ก็พอ

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| landmark | `<section aria-label="ตัวกรอง">` — **วัดแล้ว** |
| `ChipRow` | `role="group"` + `aria-label="ตัวกรองที่เลือก"` |
| **SC 2.4.1** | แผงอยู่**ก่อน**ผลลัพธ์ใน DOM → หน้าต้องมี skip link |
| **SC 2.4.7** | `p-1` ใน `ChipRow` เผื่อวงแหวน 4px |
| **SC 2.5.3** | ปุ่มลบ chip มีชื่อตัวกรองในชื่อปุ่ม |
| **SC 1.3.1** | กลุ่มเป็น `<h3>` ผ่าน `AccordionItem headingLevel={3}` |

### ★★★ ตัวกรองที่เลือกไว้ต้อง **เห็นค้าง** ห้ามยุบเป็น "ตัวกรอง (3)"

หลัก **recognition over recall** (ข้อ 01 §4.3) — ผู้ใช้ที่กรอง 4 เงื่อนไขต้องเห็นทั้ง 4 ตลอดเวลา ไม่ใช่ต้องจำว่าเลือกอะไรไว้

`FilterChipRow` จึงอยู่ **เหนือผลลัพธ์** ไม่ใช่ในแผงที่ปิดได้:

บนมือถือแผงเป็น **drawer ที่ปิดไปแล้ว** ถ้า chip อยู่ข้างในจะ **หายไปทั้งหมด** — ผู้ใช้เห็นผลลัพธ์ 3 รายการโดยไม่รู้ว่าทำไมถึงเหลือแค่นั้น

### ★★ `label` ของ chip ต้องบอก **ทั้งกลุ่มและค่า**

```
❌ "กรุงเทพฯ"
✅ "ผู้ผลิต: กรุงเทพฯ"
```

"กรุงเทพฯ" ไม่พอเมื่อมีทั้งตัวกรอง **"จังหวัดผู้ผลิต"** และ **"จังหวัดจัดส่ง"** — ผู้ใช้ที่เห็น chip เดียวไม่รู้ว่ากรองอะไรอยู่

และปุ่มลบใช้ `label` นี้ในชื่อ accessible → `"ลบตัวกรอง ผู้ผลิต: กรุงเทพฯ"`

### ★ `<section aria-label>` ทำให้ข้ามทั้งแผงได้

สำคัญเพราะแผงอยู่ **ก่อน** ผลลัพธ์ใน DOM — ผู้ใช้ screen reader ที่ไม่ต้องการกรองจะต้องฟังตัวกรอง 6 กลุ่มก่อนถึงสินค้า ถ้าไม่มี landmark

⚠️ Landmark **ไม่แทน skip link** — ผู้ใช้คีย์บอร์ดที่มองเห็น (ไม่ใช้ screen reader) ยังต้อง Tab ผ่านทุก checkbox · หน้าที่ใช้ FilterPanel จึงต้องมี [`<TopNav>`](../navigation/TopNav.md) + [`<Main>`](../layout/Main.md) ซึ่งให้ลิงก์ข้ามและเป้าของมันครบคู่ (เดิมบรรทัดนี้ฝากไว้กับชั้น 05 ที่ไม่ทำ)

---

## 6 · Tailwind implementation

```tsx
<section aria-label={s.filter.title} className="grid min-w-0 gap-3">
  <div className="flex min-w-0 items-baseline justify-between gap-2">
    <h2 className="text-subtitle text-fg">{s.filter.title}</h2>
    {onClearAll && <Button variant="ghost" size="xs" onPress={onClearAll}>
      {s.filter.clearAll}
    </Button>}
  </div>

  <Collapsible allowsMultipleExpanded
    defaultExpandedKeys={defaultExpandedKeys ?? groups.map((g) => g.id)}>
    {groups.map((g) => (
      <AccordionItem key={g.id} id={g.id} title={g.title} headingLevel={3}>
        {g.children}
      </AccordionItem>
    ))}
  </Collapsible>
  {footer}
</section>
```

```tsx
// FilterChipRow — ปุ่มล้างอยู่นอก ChipRow เพื่อไม่ให้เลื่อนหาย
<div className="flex min-w-0 items-center gap-2">
  <ChipRow label={s.filter.activeFilters} className="flex-1">…</ChipRow>
  {onClearAll && filters.length > 1 && (
    <Button variant="ghost" size="xs" onPress={onClearAll} className="shrink-0">
      {s.filter.clearAll}
    </Button>
  )}
</div>
```

---

## 7 · Figma Variant

Component set **`FilterPanel`**

| Property | Values |
|---|---|
| `Context` | `Sidebar` · `Drawer` |
| `Clear all` | `True` · `False` |
| `Footer` | `None` · `Apply button` |

Component set **`FilterChipRow`** — property `Count` = `1` · `3` · `6 (scrolling)`

**`Drawer` frame ต้องแสดงว่า `FilterChipRow` ยังอยู่ข้างนอก** ไม่ใช่ในกล่อง drawer — เป็นจุดที่นักออกแบบมักย้ายเข้าไปเพราะ "มันเกี่ยวกับตัวกรอง"

**ห้ามสร้าง variant "ตัวกรอง (3)" แบบยุบ** — ถ้ามีคนขอ ให้ชี้ไปที่ข้อ 01 §4.3

---

## 8 · Usage

```tsx
<>
  <FilterChipRow
    filters={active.map((f) => ({ id: f.id, label: `${f.groupName}: ${f.value}` }))}
    onRemove={remove}
    onClearAll={clearAll}
  />

  <Grid preset="sidebar" gutter="6">
    <FilterPanel
      onClearAll={active.length ? clearAll : undefined}
      groups={[
        { id: 'cat', title: 'หมวดหมู่ย่อย', children: (
          <CheckboxList label="หมวดหมู่ย่อย" value={cats} onChange={setCats}>
            <CheckboxInput value="roaster" label="เครื่องคั่วกาแฟ" />
            <CheckboxInput value="oven" label="เตาอบลมร้อน" />
          </CheckboxList>
        )},
        { id: 'price', title: 'ช่วงราคา', children: (
          <Slider label="ช่วงราคา" value={price} onChange={setPrice}
            min={0} max={5_000_000} step={10_000} />
        )},
      ]}
    />

    <SearchResult count={results.length}>…</SearchResult>
  </Grid>
</>
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| ยุบตัวกรองเป็น "ตัวกรอง (3)" | `<FilterChipRow>` เห็นค้าง | บังคับให้จำ — ขัดข้อ 01 §4.3 |
| `FilterChipRow` อยู่ใน drawer | อยู่เหนือผลลัพธ์ | บนมือถือ drawer ปิดแล้ว chip หายหมด |
| `label="กรุงเทพฯ"` | `"ผู้ผลิต: กรุงเทพฯ"` | มีทั้งจังหวัดผู้ผลิตและจังหวัดจัดส่ง |
| ตัวกรองเป็นคอลัมน์ที่ `md` | drawer จนถึง `lg` | ที่ 768px เสียทั้งจำนวน card และขนาด |
| กลุ่มปิดอยู่ตอนเปิดหน้า | เปิดทุกกลุ่ม | ตัวกรองที่ปิดคือตัวกรองที่ไม่มีใครใช้ |
| accordion ที่ปิดกลุ่มอื่นเอง | `allowsMultipleExpanded` | บังคับให้จำอีกครั้ง |
| ปุ่ม "ดูผลลัพธ์" บนเดสก์ท็อป | เฉพาะ drawer | ผลอัปเดตทันทีอยู่แล้ว — ปุ่มทำให้ลังเล |
| ปุ่มล้างอยู่ใน `ChipRow` | อยู่นอก | เลื่อนหายตอนมีตัวกรองเยอะ |
| แถว chip เปล่าเมื่อไม่มีตัวกรอง | `return null` | layout shift ตอนกรองครั้งแรก |
| ไม่มี landmark | `<section aria-label>` | ต้องฟังตัวกรอง 6 กลุ่มก่อนถึงสินค้า |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` ทั้ง `FilterPanel` และ `FilterChipRow` · `SC 2.4.1` ตัวกรองเป็น landmark ที่ข้ามได้ |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · แผงเป็นคอลัมน์ข้างที่จอกว้างและยุบเป็น drawer ที่จอแคบ · ตัวกรองที่เลือกแล้วสรุปเป็น `FilterChipRow` จึงเห็นได้โดยไม่ต้องเปิดแผง |
| โหมดมืด (Dark Mode) | ✅ | `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | ✅ | `SC 2.4.7` วงแหวน focus ไม่ถูกตัดแม้แผงจะเลื่อนได้ · ปุ่มลบของแต่ละ chip เป็น `<button>` แยกที่ `Tab` ถึงได้ (SC 2.5.3) |
| กำลังโหลด (Loading) | — | ตัวเลือกตัวกรองมาพร้อมหน้า · ผลลัพธ์ที่กำลังโหลดเป็นของ [`SearchResult`](./SearchResult.md) |
| ข้อผิดพลาด (Error) | — | ตัวกรองไม่มีค่าที่ผิดได้ — ทุกตัวเลือกถูกต้องเสมอ |
| ว่างเปล่า (Empty) | ✅ | เทส **"`FilterChipRow` ไม่ render อะไรเลยเมื่อไม่มีตัวกรอง"** — ไม่มีแถบว่างค้างอยู่กินพื้นที่ |
| Skeleton | — | ตัวเลือกเป็นข้อความสั้นที่มาพร้อมหน้า |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — จำนวนผลลัพธ์ที่เปลี่ยนต้องอ่านได้ทันที |
| ประสิทธิภาพ (Performance) | ✅ | การกรองไม่ทำให้แผงทั้งแผง re-render · ไม่มีความสูงตายตัว |
