# SellerProfile · CertificationBadge

**`@smego/ui`** · ชั้น 03 · [SellerProfile.tsx](./SellerProfile.tsx)

---

## 1 · ภาพรวม

โปรไฟล์ผู้ขายและใบรับรองมาตรฐาน

**ใบรับรองคือแกนความน่าเชื่อถือของแพลตฟอร์มรัฐ** — ผู้ซื้อ B2B ตัดสินใจจาก "เชื่อถือได้ไหม" ก่อน "ราคาเท่าไร" โดยเฉพาะกับผู้ขายที่ไม่เคยซื้อมาก่อน

### ❌ เมื่อไรที่ไม่ควรใช้

| สถานการณ์ | ใช้อะไรแทน | เหตุผล |
|---|---|---|
| ผู้ขายในกริดผลการค้นหา | `<EntityCard>` ที่ประกอบเอง | โปรไฟล์เต็มยาวเกินสำหรับกริด |
| ใบรับรองบนการ์ดสินค้า | `<Badge showIcon={false}>` | การ์ดมีที่แค่ชื่อ ไม่มีที่บอกสถานะยืนยัน |
| ข้อมูลติดต่อ | [`<DescriptionList>`](../data-display/DescriptionList.md) | คู่ชื่อ/ค่าระดับหน้า ไม่ใช่ระดับการ์ด |

---

## 2 · React API

```tsx
<SellerProfile
  name="บริษัท ไทยโรสเตอร์ แมชชีนเนอรี่ จำกัด"
  registrationNumber="0105561234567"
  isVerified
  location="กรุงเทพมหานคร"
  memberSinceYear={2021}
  responseTime="ภายใน 2 ชั่วโมง"
  certifications={certs}
  actions={<Button size="sm" variant="secondary">ติดต่อผู้ขาย</Button>}
/>
```

| prop | type | ค่าเริ่มต้น | หมายเหตุ |
|---|---|---|---|
| `name` | `string` | — | **บังคับ** |
| `registrationNumber` | `string` | — | 13 หลัก · คัดลอกได้ |
| `isVerified` | `boolean` | `false` | ยืนยันกับ DBD/ThaID |
| `isVatRegistered` | `boolean \| null` | — | ★★ **บังคับ** · `null` = ยังไม่ระบุ ห้ามเดา |
| `taxId` | `string` | — | เลขประจำตัวผู้เสียภาษี 13 หลัก |
| `canIssueETax` | `boolean` | — | ออกใบกำกับภาษีอิเล็กทรอนิกส์ได้หรือไม่ |
| `location` | `string` | — | |
| `memberSinceYear` | `number` | — | **ค.ศ.** → แสดง พ.ศ. |
| `responseTime` | `string` | — | |
| `certifications` | `Certification[]` | — | |
| `avatar` · `actions` | `ReactNode` | — | `avatar` ควรเป็น [`<Avatar>`](../data-display/Avatar.md) — ดู §8 |
| `headingLevel` | `1 \| 2 \| 3` | `2` | |

### Certification

| field | type | หมายเหตุ |
|---|---|---|
| `id` · `name` | `string` | ชื่อเต็ม เช่น "มอก. 2456-2562" |
| `isVerified` | `boolean` | **`false` = ผู้ขายแจ้งเอง** ไม่ใช่ "รอตรวจสอบ" |
| `expiresAt` | `string` | ISO — ใบที่หมดอายุไม่ควรส่ง `isVerified: true` |

---

## 2.1 · ข้อมูลภาษี

### ★★ ทำไม `isVatRegistered` ถึงบังคับ และอยู่ระดับ badge

ผู้ขายที่ไม่จดทะเบียน VAT ทำให้ผู้ซื้อ **ขอคืนภาษีซื้อไม่ได้** — ต้นทุนจริงต่างกัน **7%** ซึ่งเปลี่ยนคำตอบว่า "ซื้อเจ้านี้ไหม" โดยตรง จึงเข้าเกณฑ์ **B1 Fast Decision Making** เต็ม ๆ และห้ามจมอยู่ในรายการ

ตรรกะ `null` เหมือน `coPaymentPercent` ของ `GrantCard` และ `collateral` ของ `FundingCard` — **ไม่แสดง ≠ ไม่ได้จด**

| ค่า | ป้าย | ข้อความเสริม |
|---|---|---|
| `true` | `success` "จดทะเบียน VAT แล้ว" | — |
| `false` | `warning` "ไม่ได้จดทะเบียน VAT" | ★ **"ผู้ซื้อขอคืนภาษีซื้อจากรายการนี้ไม่ได้"** |
| `null` | `neutral` "สถานะภาษีมูลค่าเพิ่ม · ยังไม่ระบุ" | — |

★ กรณี `false` **บอกผลที่ตามมา ไม่ใช่แค่สถานะ** — ผู้ใช้ไม่ต้องรู้กฎภาษีเองว่า "ไม่จด VAT" แปลว่าอะไรกับตัวเขา

### รายละเอียดอยู่ใน `<DescriptionList>`

`taxId` และ `canIssueETax` แสดงผ่าน [`<DescriptionList layout="inline">`](../data-display/DescriptionList.md) — เป็นข้อมูลระดับหน้าสำหรับคนที่จะเอาไปตรวจต่อ ไม่ใช่สิ่งที่ต้องเห็นตอนกวาดตา

⚠️ **ทำไมไม่ใช้ `EntityMeta`** — `EntityMeta` ปรับมาสำหรับในการ์ดที่ต้องอ่านออกที่ 136px ส่วนบล็อกนี้อยู่ในหน้า มีที่ให้หายใจ · ใช้สลับกันจะเล็กจนอ่านยากบนเดสก์ท็อป

---

## 3 · Variants

`CertificationBadge` มีสองสถานะ

| `isVerified` | ขอบ + พื้น | ข้อความกำกับ |
|---|---|---|
| `true` | `success-edge` / `success-surface` | **"ยืนยันโดยหน่วยงานที่ออกให้"** |
| `false` | `edge` / `sunken` | **"ผู้ขายแจ้งเอง · ยังไม่ยืนยัน"** |

### ★★★ ต้องแยก "ยืนยันแล้ว" กับ "ผู้ขายแจ้งเอง"

สองอย่างนี้ **มีน้ำหนักต่างกันสิ้นเชิง** · การแสดงเหมือนกันคือการทำให้ข้อมูลที่ตรวจสอบแล้วเสียค่า และทำให้ข้อมูลที่ยังไม่ตรวจ **ดูน่าเชื่อเกินจริง** — ซึ่งบนแพลตฟอร์มรัฐเป็นปัญหาความรับผิดชอบ ไม่ใช่แค่ UX

⚠️ `isVerified: false` **ไม่ได้แปลว่า "รอตรวจสอบ"** — ข้อความจึงเป็น "ผู้ขายแจ้งเอง" ซึ่งบอกตรง ๆ ว่าใครเป็นแหล่งข้อมูล

**ตัวแยกคือข้อความ ไม่ใช่สี** — วัดแล้ว:

```
"มอก. 2456-2562 | ยืนยันโดยหน่วยงานที่ออกให้"
"GMP            | ผู้ขายแจ้งเอง · ยังไม่ยืนยัน"
```

### ★★★ ไอคอนโดเมนไทยยังไม่มี — **ใช้ข้อความแทน** (ข้อ 09)

มอก. · ฮาลาล · GMP · HACCP · DBD · ThaID · e-Tax ไม่มีไอคอนในระบบ และ **ห้ามหยิบไอคอน Lucide ที่ใกล้เคียงมาใช้**

เหตุผลไม่ใช่ความสวยงาม: โล่หรือเครื่องหมายถูกที่สื่อว่า "ผ่านการรับรอง" ทั้งที่เป็นแค่ไอคอนตกแต่ง คือ **การอ้างสิทธิ์ที่ไม่มีใครรับรอง** ซึ่งกับมาตรฐานสินค้าอาจมีผลทางกฎหมาย

**วัดแล้ว:** จำนวน `<svg>` ใน badge ใบรับรอง = **0**

(ไอคอน `shield-check` ที่หัวข้อ "ใบรับรองและมาตรฐาน" เป็นการตกแต่งของ *หัวข้อ* ไม่ได้อ้างสถานะของใบใดใบหนึ่ง)

---

## 4 · States

ไม่มี interactive state — `SellerProfile` เป็นการแสดงผล · ปุ่มมาจาก `actions`

---

## 5 · Accessibility

| เรื่อง | ข้อกำหนด |
|---|---|
| landmark | `<section aria-label={name}>` |
| **SC 1.3.1** | `<h2>` ชื่อผู้ขาย · `<h3>` ใบรับรอง · `<ul>` รายการใบรับรอง |
| **SC 1.4.1** | สถานะใบรับรองเป็น**ข้อความ** ไม่ใช่สี |
| **SC 1.4.3** | ตัวอักษรทุกตัววัดแล้ว |
| ปี | **พ.ศ.** — 2021 → **2564** |

### ค่า contrast ที่วัดจริง

| | สว่าง | มืด |
|---|---|---|
| ชื่อใบรับรอง (ยืนยันแล้ว) | **15.29** | **13.77** |
| ข้อความกำกับ (ยืนยันแล้ว) | **5.65** | **7.30** |
| ชื่อใบรับรอง (แจ้งเอง) | **7.76** | **11.81** |
| ข้อความกำกับ (แจ้งเอง) | **5.44** | **7.27** |

ทั้งหมด ✅ AA

### ★ ขอบของ badge วัดได้ 1.56–2.71 — **ได้รับยกเว้นจาก SC 1.4.11**

SC 1.4.11 ใช้กับ **(ก) UI component ที่โต้ตอบได้** และ **(ข) graphical object ที่จำเป็นต่อการเข้าใจเนื้อหา**

`CertificationBadge` **ไม่โต้ตอบ** และการแยกยืนยันแล้ว/แจ้งเอง **มาจากข้อความ ไม่ใช่จากขอบ** → ขอบเป็นการตกแต่ง จึงยกเว้น

เป็นเหตุผลเดียวกับ `Divider` (ดู [Grid.md §5](../layout/Grid.md))

⚠️ **ข้อยกเว้นนี้ขึ้นอยู่กับการที่ข้อความยังอยู่** — ถ้าใครเอาข้อความกำกับออกแล้วเหลือแต่สีขอบ ข้อยกเว้นหายทันทีและกลายเป็นทั้ง SC 1.4.11 และ SC 1.4.1 ที่ไม่ผ่าน

### ★★ เลขทะเบียนนิติบุคคลต้องคัดลอกได้และใช้ `font-numeric`

ผู้ซื้อเอาไปตรวจกับ DBD ต่อ — **13 หลักที่พิมพ์ตามผิดคือเสียเวลาเปล่า**

`select-all` ทำให้ดับเบิลคลิกเลือกทั้งก้อน ไม่ต้องลากทีละตัว

**วัดแล้ว:** `user-select: all` · `font-variant-numeric: tabular-nums`

### ★ ปีสมาชิกเป็น พ.ศ.

`memberSinceYear` รับเป็น **ค.ศ.** ตามมาตรฐานข้อมูล แล้วบวก 543 ตอนแสดง — ปีเดี่ยวไม่ต้องผ่าน `Intl` เพราะไม่มีเดือน/วันให้จัดรูปแบบ

**วัดแล้ว:** `2021` → `2564`

---

## 6 · Tailwind implementation

```tsx
<span className={cn(
  'inline-flex min-w-0 flex-col gap-0.5',
  'rounded-(--radius-control) border px-3 py-2',
  isVerified ? 'border-success-edge bg-success-surface' : 'border-edge bg-sunken',
)}>
  <span className={cn('text-caption', isVerified ? 'text-fg' : 'text-fg-secondary')}>
    {name}
  </span>
  {/* ★ ข้อความกำกับคือตัวแยก ไม่ใช่สี */}
  <span className={cn('text-caption',
    isVerified ? 'text-success-icon' : 'text-fg-muted')}>
    {isVerified ? s.seller.certVerified : s.seller.certSelfDeclared}
  </span>
</span>
```

```tsx
{/* wrap เพราะชื่อใบรับรองไทยยาวไม่เท่ากัน */}
<ul className="flex min-w-0 flex-wrap gap-2">
  {certifications.map((c) => (
    <li key={c.id} className="min-w-0"><CertificationBadge certification={c} /></li>
  ))}
</ul>
```

`flex-col` ใน badge ทำให้ชื่อกับสถานะซ้อนกัน — ที่ 320px การวางข้างกันจะทำให้ตัวใดตัวหนึ่งถูกตัด

---

## 7 · Figma Variant

Component set **`CertificationBadge`**

| Property | Values |
|---|---|
| `Verified` | `True` · **`False (self-declared)`** |

**ชื่อ value ต้องเขียนว่า `self-declared` ไม่ใช่ `pending`** — ความหมายต่างกันและนักพัฒนาจะเขียนข้อความตามชื่อ variant

**ห้ามสร้างไอคอนสำหรับ มอก. / ฮาลาล / GMP / HACCP** — ถ้ามีคนวาดขึ้นมา จะมีคน implement และกลายเป็นการอ้างการรับรองด้วยสัญลักษณ์ที่ไม่มีใครรับรอง

Component set **`SellerProfile`**

| Property | Values |
|---|---|
| `Verified` | `True` · `False` |
| `Avatar` | `True` · `False` |
| `Certifications` | `0` · `2` · `4` |
| `Actions` | `None` · `Button` |

**ตัวอย่างต้องใช้ชื่อบริษัทเต็มจริง** ("บริษัท ไทยโรสเตอร์ แมชชีนเนอรี่ จำกัด") ไม่ใช่ "Seller Name" — ชื่อนิติบุคคลไทยยาวและ wrap หลายบรรทัดที่ 320px

---

## 8 · Usage

```tsx
<SellerProfile
  name={seller.legalName}
  registrationNumber={seller.dbdNumber}
  isVerified={seller.identityVerified}
  location={seller.province}
  memberSinceYear={seller.joinedYear}
  responseTime={seller.avgResponseTime}
  certifications={seller.certifications.map((c) => ({
    id: c.id,
    name: c.fullName,
    /* ★ ยืนยันแล้วเฉพาะเมื่อหน่วยงานตรวจ **และ** ยังไม่หมดอายุ */
    isVerified: c.verifiedByIssuer && !isExpired(c.expiresAt),
    expiresAt: c.expiresAt,
  }))}
  /* ★ ใช้ <Avatar> ไม่ใช่ <img> เอง — มีทางถอยเมื่อโลโก้โหลดไม่ขึ้น
     และตัวย่อไทยที่ไม่ตัดสระ/วรรณยุกต์ทิ้ง (ดู Avatar.md §6)
     ไม่ส่ง alt เพราะชื่อผู้ขายเป็นหัวข้ออยู่ในการ์ดแล้ว */
  avatar={<Avatar src={seller.logo} name={seller.name} size="lg" />}
  actions={<Button size="sm" variant="secondary">{s.seller.contact}</Button>}
/>
```

```tsx
// ในหน้ารายละเอียดสินค้า — เป็น h3 ใต้ h2 "ข้อมูลผู้ขาย"
<SellerProfile headingLevel={3} name={seller.legalName} … />
```

---

## 9 · Anti-patterns

| ❌ | ✅ | ทำไม |
|---|---|---|
| ไอคอนโล่/เครื่องหมายถูกข้างชื่อใบรับรอง | ข้อความล้วน | อ้างการรับรองด้วยสัญลักษณ์ที่ไม่มีใครรับรอง |
| แสดงใบที่ยืนยันแล้วกับที่แจ้งเองเหมือนกัน | แยกด้วยข้อความ | ทำให้ข้อมูลที่ตรวจแล้วเสียค่า |
| `isVerified: false` = "รอตรวจสอบ" | "ผู้ขายแจ้งเอง" | คนละความหมาย — อันหนึ่งบอกว่ากำลังจะยืนยัน |
| แยกสถานะด้วยสีขอบอย่างเดียว | ข้อความกำกับ | ยกเว้น SC 1.4.11 หายทันที + ตก SC 1.4.1 |
| ใบรับรองหมดอายุยัง `isVerified: true` | ตรวจ `expiresAt` ด้วย | ใบหมดอายุไม่ใช่ใบที่ใช้ได้ |
| เลขนิติบุคคลเป็นข้อความธรรมดา | `select-all` + `font-numeric` | ผู้ซื้อเอาไปตรวจ DBD ต่อ |
| ปีสมาชิกเป็น ค.ศ. | + 543 | 2021 อ่านผิดในบริบทไทย |
| ชื่อผู้ขายเป็น `<h1>` ในหน้าสินค้า | `headingLevel={3}` | ลำดับหัวข้อกระโดด |
| `alt={seller.name}` บนโลโก้ | `alt=""` | ชื่ออยู่ในหัวข้อข้างล่างแล้ว |
| badge วางชื่อกับสถานะข้างกัน | `flex-col` | ที่ 320px ตัวใดตัวหนึ่งถูกตัด |

---

## 10 · Quality Checklist

**หลักฐาน ไม่ใช่ความตั้งใจ** — ทุกแถวชี้ไปที่หัวข้อในไฟล์นี้หรือชื่อเทสที่รันได้จริง ไม่มีแถวไหนอธิบายพฤติกรรมซ้ำ (นั่นคืองานของ §4 และ §5)

| รายการ | สถานะ | หลักฐาน |
|---|---|---|
| การเข้าถึง (Accessibility) | ✅ | §5 · axe ผ่านใน `a11y/marketplace.test.tsx` และ `a11y/pass4.test.tsx` · เทส **"★★ ไม่จด VAT ต้องบอกผลที่ตามมา ไม่ใช่แค่สถานะ"** · `CertificationBadge` แยก "ยืนยันแล้ว/แจ้งเอง" ด้วย**ข้อความ** ไม่ใช่สี (SC 1.4.1) |
| ตอบสนอง (Responsive) | ✅ | `min-w-0` · ข้อมูลผู้ขายเป็น `<dl>` ที่ยุบเป็นคอลัมน์เดียวที่จอแคบ (กลไกเดียวกับ [`DescriptionList`](../data-display/DescriptionList.md) ที่ `e2e/pass3.spec.ts:147` วัดไว้) |
| โหมดมืด (Dark Mode) | ✅ | ใช้ `--elevation-*` · `SC 1.4.11` ขอบของป้ายรับรอง ≥3:1 · `lint-classes.mjs` 0 จุด — ทุกสีมาจาก token ที่ override ในโหมดมืดแล้ว |
| คุณสมบัติเชิงตรรกะ (Logical properties) | ✅ | `lint-quality.mjs` 0 จุด — ไม่มี `ml-`/`pl-`/`left-` ในไฟล์นี้ |
| คีย์บอร์ด (Keyboard) | — | โปรไฟล์เป็นข้อมูลอ่านอย่างเดียว · ปุ่มติดต่อที่ส่งเข้ามาทาง `actions` มีสถานะของตัวเอง |
| กำลังโหลด (Loading) | — | ข้อมูลผู้ขายมาพร้อมหน้า |
| ข้อผิดพลาด (Error) | — | โปรไฟล์ไม่ยิง request เอง |
| ว่างเปล่า (Empty) | ✅ | เทส **"★ `null` = ยังไม่ระบุ ต่างจากไม่ได้จด"** — ค่าที่ขาดไม่ถูกแปลงเป็น "ไม่มี" ซึ่งจะเป็นการกล่าวหาผู้ขาย |
| Skeleton | — | ตัวแทนระหว่างโหลดใช้ [`<SkeletonText>`](../feedback/Skeleton.md) ที่ระดับหน้า |
| การเคลื่อนไหว (Animation) | — | ไม่มี `transition` หรือ `animate` ในไฟล์นี้เลย — ข้อมูลความน่าเชื่อถือต้องอยู่นิ่งและอ่านได้ทันที |
| ประสิทธิภาพ (Performance) | ✅ | เทส "เลขผู้เสียภาษีอยู่ใน `<dl>` พร้อม `font-numeric`" — เลข 13 หลักไม่ขยับ · ไม่มีความสูงตายตัว |
