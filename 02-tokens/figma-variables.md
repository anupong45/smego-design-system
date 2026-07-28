# Figma Variables · SME.GO Design System

> ⚠️ **ไฟล์นี้สร้างจาก `tokens.json` ด้วย `node 02-tokens/gen-figma.js`**
> ห้ามแก้ไฟล์นี้ตรง ๆ — แก้ `tokens.json` แล้วสร้างใหม่ ไม่เช่นนั้นจะไม่ตรงกัน

---

## ข้อจำกัดของ Figma Variables ที่ต้องรู้ก่อนเริ่ม

Figma รองรับ variable เพียง 4 ชนิด: **COLOR · FLOAT · STRING · BOOLEAN**

| สิ่งที่ระบบมี | เก็บเป็น variable ได้ไหม | ทำอย่างไร |
|---|---|---|
| สี | ✅ COLOR | ตามตารางด้านล่าง |
| ระยะ · radius · ขนาด | ✅ FLOAT (หน่วย px) | Figma ไม่รู้จัก rem — ตารางนี้แปลงเป็น px ให้แล้ว (1rem = 16px) |
| duration | ✅ FLOAT (หน่วย ms) | |
| font family · weight | ✅ STRING / FLOAT | |
| **easing (cubic-bezier)** | ❌ **ไม่ได้** | ต้องตั้งใน prototype interaction ทีละอัน — ดูตารางท้ายไฟล์ |
| **เงา** | ❌ **ไม่ได้** | ต้องเป็น **Effect Style** — ดูตารางท้ายไฟล์ |
| **typography** | ❌ **ไม่ได้** | ต้องเป็น **Text Style** — ดูตารางท้ายไฟล์ |

**ค่าที่แสดงเป็น px ทั้งหมด** ยกเว้นที่ระบุไว้เป็นอย่างอื่น

---

## Collection `1. Primitive`

**mode เดียว** — ค่าดิบไม่เปลี่ยนตาม theme สิ่งที่เปลี่ยนคือ *บทบาท* ในชั้น 2

| Figma name | ค่า | CSS variable |
|---|---|---|
| `color/blue/50` | `#F0F9FE` | `--sme-blue-50` |
| `color/blue/100` | `#DDF1FD` | `--sme-blue-100` |
| `color/blue/200` | `#B8E0F9` | `--sme-blue-200` |
| `color/blue/300` | `#88C9F2` | `--sme-blue-300` |
| `color/blue/400` | `#50AAE2` | `--sme-blue-400` |
| `color/blue/500` | `#1290DE` | `--sme-blue-500` |
| `color/blue/600` | `#0077C1` | `--sme-blue-600` |
| `color/blue/700` | `#00619E` | `--sme-blue-700` |
| `color/blue/800` | `#034E7C` | `--sme-blue-800` |
| `color/blue/900` | `#063D60` | `--sme-blue-900` |
| `color/blue/950` | `#05283D` | `--sme-blue-950` |
| `color/neutral/0` | `#FFFFFF` | `--sme-neutral-0` |
| `color/neutral/50` | `#F8F9FB` | `--sme-neutral-50` |
| `color/neutral/100` | `#F1F3F6` | `--sme-neutral-100` |
| `color/neutral/200` | `#E1E4EA` | `--sme-neutral-200` |
| `color/neutral/300` | `#CCCFD7` | `--sme-neutral-300` |
| `color/neutral/400` | `#9DA3AF` | `--sme-neutral-400` |
| `color/neutral/500` | `#747C8B` | `--sme-neutral-500` |
| `color/neutral/600` | `#5C6370` | `--sme-neutral-600` |
| `color/neutral/700` | `#464C58` | `--sme-neutral-700` |
| `color/neutral/800` | `#31363F` | `--sme-neutral-800` |
| `color/neutral/850` | `#262B33` | `--sme-neutral-850` |
| `color/neutral/900` | `#1D2128` | `--sme-neutral-900` |
| `color/neutral/950` | `#12141A` | `--sme-neutral-950` |
| `color/gold/50` | `#FEF9F1` | `--sme-gold-50` |
| `color/gold/100` | `#FDEED9` | `--sme-gold-100` |
| `color/gold/200` | `#FBDBAD` | `--sme-gold-200` |
| `color/gold/300` | `#F6C479` | `--sme-gold-300` |
| `color/gold/400` | `#F0AA42` | `--sme-gold-400` |
| `color/gold/500` | `#EC9513` | `--sme-gold-500` |
| `color/gold/600` | `#C67D10` | `--sme-gold-600` |
| `color/gold/700` | `#A1660C` | `--sme-gold-700` |
| `color/gold/800` | `#815108` | `--sme-gold-800` |
| `color/gold/900` | `#653F06` | `--sme-gold-900` |
| `color/gold/950` | `#3E2704` | `--sme-gold-950` |
| `color/yellow/50` | `#FEFBF0` | `--sme-yellow-50` |
| `color/yellow/100` | `#FDF6D8` | `--sme-yellow-100` |
| `color/yellow/200` | `#FCECAC` | `--sme-yellow-200` |
| `color/yellow/300` | `#F8DE77` | `--sme-yellow-300` |
| `color/yellow/400` | `#F5D03D` | `--sme-yellow-400` |
| `color/yellow/500` | `#F2C40D` | `--sme-yellow-500` |
| `color/yellow/600` | `#C9A40D` | `--sme-yellow-600` |
| `color/yellow/700` | `#9E810A` | `--sme-yellow-700` |
| `color/yellow/800` | `#7E6607` | `--sme-yellow-800` |
| `color/yellow/900` | `#614F05` | `--sme-yellow-900` |
| `color/yellow/950` | `#3A2F03` | `--sme-yellow-950` |
| `color/green/50` | `#EEFCF5` | `--sme-green-50` |
| `color/green/100` | `#D8F8E9` | `--sme-green-100` |
| `color/green/200` | `#B5EED3` | `--sme-green-200` |
| `color/green/300` | `#88DDB5` | `--sme-green-300` |
| `color/green/400` | `#51C890` | `--sme-green-400` |
| `color/green/500` | `#29AE70` | `--sme-green-500` |
| `color/green/600` | `#198F58` | `--sme-green-600` |
| `color/green/700` | `#137245` | `--sme-green-700` |
| `color/green/800` | `#0F5C38` | `--sme-green-800` |
| `color/green/900` | `#0C452B` | `--sme-green-900` |
| `color/green/950` | `#082B1B` | `--sme-green-950` |
| `color/red/50` | `#FEF1F1` | `--sme-red-50` |
| `color/red/100` | `#FDE3E2` | `--sme-red-100` |
| `color/red/200` | `#FBC3C1` | `--sme-red-200` |
| `color/red/300` | `#F79A97` | `--sme-red-300` |
| `color/red/400` | `#EF6661` | `--sme-red-400` |
| `color/red/500` | `#E72E27` | `--sme-red-500` |
| `color/red/600` | `#C31E18` | `--sme-red-600` |
| `color/red/700` | `#9D1A15` | `--sme-red-700` |
| `color/red/800` | `#7C1613` | `--sme-red-800` |
| `color/red/900` | `#5F1311` | `--sme-red-900` |
| `color/red/950` | `#380B0A` | `--sme-red-950` |
| `color/shadow/10` | `#12141A1A` | `--sme-shadow-10` |
| `color/shadow/12` | `#12141A1F` | `--sme-shadow-12` |
| `color/shadow/14` | `#12141A24` | `--sme-shadow-14` |
| `color/shadow/18` | `#12141A2E` | `--sme-shadow-18` |
| `color/shadow/50` | `#12141A80` | `--sme-shadow-50` |
| `color/shadow/05` | `#12141A0D` | `--sme-shadow-05` |
| `color/shadow/06` | `#12141A0F` | `--sme-shadow-06` |
| `color/shadow/08` | `#12141A14` | `--sme-shadow-08` |
| `color/black/70` | `#000000B3` | `--sme-black-70` |
| `color/transparent` | `#00000000` | `--sme-transparent` |

### Font (Collection `1. Primitive`)

| Figma name | ค่า | ชนิด |
|---|---|---|
| `font/family/anuphan` | `Anuphan` | STRING |
| `font/family/plexMono` | `IBM Plex Mono` | STRING |
| `font/weight/regular` | `400` | FLOAT |
| `font/weight/medium` | `500` | FLOAT |
| `font/weight/semibold` | `600` | FLOAT |
| `font/weight/bold` | `700` | FLOAT |

---

## Collection `4. Scale`

**mode เดียว** — ค่าตัวเลขที่ไม่ขึ้นกับ theme

### `space`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `space/0` | `0` | `--spacing-0` |
| `space/1` | `4` | `--spacing-1` |
| `space/2` | `8` | `--spacing-2` |
| `space/3` | `12` | `--spacing-3` |
| `space/4` | `16` | `--spacing-4` |
| `space/5` | `20` | `--spacing-5` |
| `space/6` | `24` | `--spacing-6` |
| `space/8` | `32` | `--spacing-8` |
| `space/10` | `40` | `--spacing-10` |
| `space/12` | `48` | `--spacing-12` |
| `space/16` | `64` | `--spacing-16` |
| `space/20` | `80` | `--spacing-20` |
| `space/24` | `96` | `--spacing-24` |
| `space/32` | `128` | `--spacing-32` |
| `space/0.5` | `2` | `--spacing-0.5` |

### `radius`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `radius/none` | `0` | `--radius-none` |
| `radius/xs` | `4` | `--radius-xs` |
| `radius/sm` | `6` | `--radius-sm` |
| `radius/md` | `8` | `--radius-md` |
| `radius/lg` | `12` | `--radius-lg` |
| `radius/xl` | `16` | `--radius-xl` |
| `radius/2xl` | `24` | `--radius-2xl` |
| `radius/full` | `9999` | `--radius-full` |

### `fontSize`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `fontSize/13` | `13` | `--text-13` |
| `fontSize/14` | `14` | `--text-14` |
| `fontSize/16` | `16` | `--text-16` |
| `fontSize/18` | `18` | `--text-18` |
| `fontSize/20` | `20` | `--text-20` |
| `fontSize/24` | `24` | `--text-24` |
| `fontSize/28` | `28` | `--text-28` |
| `fontSize/32` | `32` | `--text-32` |
| `fontSize/36` | `36` | `--text-36` |
| `fontSize/48` | `48` | `--text-48` |

### `lineHeight`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `lineHeight/16` | `16` | `--leading-16` |
| `lineHeight/20` | `20` | `--leading-20` |
| `lineHeight/24` | `24` | `--leading-24` |
| `lineHeight/28` | `28` | `--leading-28` |
| `lineHeight/32` | `32` | `--leading-32` |
| `lineHeight/36` | `36` | `--leading-36` |
| `lineHeight/40` | `40` | `--leading-40` |
| `lineHeight/44` | `44` | `--leading-44` |
| `lineHeight/48` | `48` | `--leading-48` |
| `lineHeight/64` | `64` | `--leading-64` |

### `letterSpacing`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `letterSpacing/tight` | `-0.02em` | `--tracking-tight` |
| `letterSpacing/snug` | `-0.01em` | `--tracking-snug` |
| `letterSpacing/normal` | `0` | `--tracking-normal` |

### `duration`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `duration/instant` | `0` | `--transition-duration-instant` |
| `duration/fast` | `150` | `--transition-duration-fast` |
| `duration/medium` | `250` | `--transition-duration-medium` |
| `duration/slow` | `400` | `--transition-duration-slow` |
| `duration/slower` | `600` | `--transition-duration-slower` |

### `breakpoint`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `breakpoint/sm` | `640` | `--breakpoint-sm` |
| `breakpoint/md` | `768` | `--breakpoint-md` |
| `breakpoint/lg` | `1024` | `--breakpoint-lg` |
| `breakpoint/xl` | `1280` | `--breakpoint-xl` |
| `breakpoint/2xl` | `1536` | `--breakpoint-2xl` |

### `container`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `container/form` | `560` | `--container-form` |
| `container/narrow` | `768` | `--container-narrow` |
| `container/content` | `1280` | `--container-content` |
| `container/wide` | `1440` | `--container-wide` |

### `viewport`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `viewport/designFloor` | `360` | — |
| `viewport/conformanceFloor` | `320` | — |

### `layout`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `layout/headerHeight` | `56` | — |
| `layout/headerHeightMd` | `64` | — |
| `layout/bottomNavHeight` | `56` | — |
| `layout/sidebarWidth` | `280` | — |

### `measure`

| Figma name | ค่า (px / ms) | CSS variable |
|---|---|---|
| `measure/narrow` | `48ch` | — |
| `measure/body` | `68ch` | — |
| `measure/wide` | `80ch` | — |

### `icon`

| Figma name | ค่า | หมายเหตุ |
|---|---|---|
| `icon/size/16` | `16` |  |
| `icon/size/20` | `20` |  |
| `icon/size/24` | `24` |  |
| `icon/size/32` | `32` |  |
| `icon/size/48` | `48` |  |
| `icon/stroke/16` | `1.5` | ⚠️ ผูกกับขนาด — ห้ามตั้งเอง |
| `icon/stroke/20` | `1.75` | ⚠️ ผูกกับขนาด — ห้ามตั้งเอง |
| `icon/stroke/24` | `2` | ⚠️ ผูกกับขนาด — ห้ามตั้งเอง |
| `icon/stroke/32` | `2.5` | ⚠️ ผูกกับขนาด — ห้ามตั้งเอง |
| `icon/stroke/48` | `2.5` | ⚠️ ผูกกับขนาด — ห้ามตั้งเอง |

---

## Collection `2. Semantic` — **2 modes: Light · Dark**

นี่คือ collection เดียวที่มี 2 mode
ค่าที่ช่อง Dark ว่าง = **ใช้ค่าเดียวกับ Light** ไม่ต้องตั้งซ้ำใน Figma

| Figma name | Light | Dark | CSS variable |
|---|---|---|---|
| `color/primary/50` | `#F0F9FE` | — | `--color-primary-50` |
| `color/primary/100` | `#DDF1FD` | — | `--color-primary-100` |
| `color/primary/200` | `#B8E0F9` | — | `--color-primary-200` |
| `color/primary/300` | `#88C9F2` | — | `--color-primary-300` |
| `color/primary/400` | `#50AAE2` | — | `--color-primary-400` |
| `color/primary/500` | `#1290DE` | — | `--color-primary-500` |
| `color/primary/600` | `#0077C1` | — | `--color-primary-600` |
| `color/primary/700` | `#00619E` | — | `--color-primary-700` |
| `color/primary/800` | `#034E7C` | — | `--color-primary-800` |
| `color/primary/900` | `#063D60` | — | `--color-primary-900` |
| `color/primary/950` | `#05283D` | — | `--color-primary-950` |
| `color/canvas` | `#F8F9FB` | `#12141A` | `--color-canvas` |
| `color/surface` | `#FFFFFF` | `#1D2128` | `--color-surface` |
| `color/sunken` | `#F1F3F6` | `#12141A` | `--color-sunken` |
| `color/selected-surface` | `#F0F9FE` | `#063D60` | `--color-selected-surface` |
| `color/selected-fg` | `#034E7C` | `#DDF1FD` | `--color-selected-fg` |
| `color/selected-hover` | `#DDF1FD` | `#034E7C` | `--color-selected-hover` |
| `color/selected-strong` | `#B8E0F9` | `#00619E` | `--color-selected-strong` |
| `color/inverse` | `#1D2128` | `#F1F3F6` | `--color-inverse` |
| `color/fg` | `#1D2128` | `#F1F3F6` | `--color-fg` |
| `color/fg/secondary` | `#464C58` | `#CCCFD7` | `--color-fg-secondary` |
| `color/fg/muted` | `#5C6370` | `#9DA3AF` | `--color-fg-muted` |
| `color/fg/disabled` | `#9DA3AF` | `#5C6370` | `--color-fg-disabled` |
| `color/link` | `#00619E` | `#50AAE2` | `--color-link` |
| `color/on-brand` | `#FFFFFF` | — | `--color-on-brand` |
| `color/on-accent` | `#12141A` | — | `--color-on-accent` |
| `color/edge/subtle` | `#E1E4EA` | `#31363F` | `--color-edge-subtle` |
| `color/edge` | `#CCCFD7` | `#464C58` | `--color-edge` |
| `color/edge/strong` | `#747C8B` | `#747C8B` | `--color-edge-strong` |
| `color/edge/brand` | `#0077C1` | — | `--color-edge-brand` |
| `color/edge/danger` | `#E72E27` | `#EF6661` | `--color-edge-danger` |
| `color/focus/ring` | `#0077C1` | `#50AAE2` | `--color-focus-ring` |
| `color/focus/contrast` | `#FFFFFF` | `#12141A` | `--color-focus-contrast` |
| `color/success/surface` | `#EEFCF5` | `#082B1B` | `--color-success-surface` |
| `color/success/edge` | `#88DDB5` | `#137245` | `--color-success-edge` |
| `color/success/icon` | `#137245` | `#51C890` | `--color-success-icon` |
| `color/success/fill` | `#137245` | — | `--color-success-fill` |
| `color/success/hover` | `#0F5C38` | — | `--color-success-hover` |
| `color/success/active` | `#0C452B` | — | `--color-success-active` |
| `color/warning/surface` | `#FEFBF0` | `#3A2F03` | `--color-warning-surface` |
| `color/warning/edge` | `#F8DE77` | `#9E810A` | `--color-warning-edge` |
| `color/warning/icon` | `#7E6607` | `#F5D03D` | `--color-warning-icon` |
| `color/warning/fill` | `#F2C40D` | — | `--color-warning-fill` |
| `color/danger/surface` | `#FEF1F1` | `#380B0A` | `--color-danger-surface` |
| `color/danger/edge` | `#F79A97` | `#9D1A15` | `--color-danger-edge` |
| `color/danger/icon` | `#C31E18` | `#EF6661` | `--color-danger-icon` |
| `color/danger/fill` | `#C31E18` | — | `--color-danger-fill` |
| `color/danger/hover` | `#9D1A15` | — | `--color-danger-hover` |
| `color/danger/active` | `#7C1613` | — | `--color-danger-active` |
| `color/info/surface` | `#F0F9FE` | `#05283D` | `--color-info-surface` |
| `color/info/edge` | `#88C9F2` | `#00619E` | `--color-info-edge` |
| `color/info/icon` | `#00619E` | `#50AAE2` | `--color-info-icon` |
| `color/info/fg` | `#1D2128` | `#F1F3F6` | `--color-info-fg` |
| `color/accent/fill` | `#EC9513` | — | `--color-accent-fill` |
| `color/accent/hover` | `#C67D10` | — | `--color-accent-hover` |
| `color/accent/fg` | `#815108` | `#F0AA42` | `--color-accent-fg` |
| `color/accent/surface` | `#FEF9F1` | `#3E2704` | `--color-accent-surface` |
| `color/accent/edge` | `#F6C479` | `#A1660C` | `--color-accent-edge` |
| `color/accent/active` | `#C67D10` | — | `--color-accent-active` |
| `color/backdrop` | `#12141A80` | `#000000B3` | `--color-backdrop` |
| `color/scannable` | `#FFFFFF` | — | `--color-scannable` |
| `color/primary-outline` | `#00000000` | `#50AAE2` | `--color-primary-outline` |
| `color/danger-outline` | `#00000000` | `#EF6661` | `--color-danger-outline` |
| `color/success-outline` | `#00000000` | `#51C890` | `--color-success-outline` |
| `color/accent-outline` | `#C67D10` | `#F0AA42` | `--color-accent-outline` |

### `elevation` (Collection `2. Semantic`)

⚠️ **ค่า shadow เก็บเป็น variable ไม่ได้** — เก็บได้เฉพาะ surface และ edge
shadow ต้องเป็น Effect Style และ **ต้องไม่ผูกกับ variant โหมดมืด**

| Figma name | Light | Dark | CSS variable |
|---|---|---|---|
| `elevation/surface/raised` | `#FFFFFF` | `#1D2128` | `--elevation-surface-raised` |
| `elevation/surface/floating` | `#FFFFFF` | `#262B33` | `--elevation-surface-floating` |
| `elevation/surface/overlay` | `#FFFFFF` | `#262B33` | `--elevation-surface-overlay` |
| `elevation/surface/modal` | `#FFFFFF` | `#31363F` | `--elevation-surface-modal` |
| `elevation/edge/raised` | `#E1E4EA` | `#31363F` | `--elevation-edge-raised` |
| `elevation/edge/floating` | `#E1E4EA` | `#747C8B` | `--elevation-edge-floating` |
| `elevation/edge/overlay` | `#E1E4EA` | `#747C8B` | `--elevation-edge-overlay` |
| `elevation/edge/modal` | `#E1E4EA` | `#747C8B` | `--elevation-edge-modal` |

---

## คำอธิบาย (Description) ที่ต้องใส่ใน Figma

ใส่เฉพาะ variable ที่มีกับดักจริง — คำอธิบายที่ไม่บอกอะไรใหม่จะถูกเมิน

| Figma variable | Description ที่ต้องวาง |
|---|---|
| `color/blue/200` | 1.39:1 on white — too faint to read as a border. Use 300 for the Info tint edge. |
| `color/blue/300` | 10.24:1 on neutral-950. |
| `color/blue/400` | 7.18:1 on neutral-950 (AAA). THE dark-mode text/link/icon step — 600 fails there. |
| `color/blue/500` | 3.46:1 on white — passes 3:1 non-text only. |
| `color/blue/600` | BRAND COLOUR. 4.76:1 on white (AA, +0.26 margin). FAILS as text on dark (3.86:1) — use blue-400. |
| `color/blue/700` | 6.56:1 on white. Body-link colour and primary-button hover. |
| `color/blue` | hue 203. blue-600 IS the SME.GO brand colour. |
| `color/neutral/100` | 16.56:1 on neutral-950 — dark-mode primary text. |
| `color/neutral/200` | 1.27:1 on white. Decorative borders only — exempt from SC 1.4.11. |
| `color/neutral/300` | 1.56:1 on white. NOT valid as an input border — fails SC 1.4.11. Decorative only. |
| `color/neutral/400` | 2.53:1 on white — disabled text only (SC 1.4.3 exempt). 7.27:1 on dark — dark-mode muted text. |
| `color/neutral/500` | MINIMUM border for UI components: 4.20:1 on white, 3.84:1 on neutral-900, 3.39:1 on neutral-850. NOT valid as text (fails AA). |
| `color/neutral/600` | 6.05:1 on white — the lightest valid muted text. As a dark-mode border it fails at 2.67:1 on neutral-900. |
| `color/neutral/850` | Not in the original brief. Added because the dark elevation ladder needs three steps (950 canvas -> 900 surface -> 850 raised). Dark mode only. |
| `color/neutral/900` | 16.15:1 on white — light-mode primary text. Also the dark-mode surface. |
| `color/neutral/950` | Dark-mode canvas. Also the text colour required on gold and yellow fills. |
| `color/neutral` | hue 220, saturation held to 4–12% at steps 300–700 so surfaces harmonise with the brand without distorting adjacent product photography. Must never become Tailwind slate. |
| `color/gold/400` | 9.23:1 on neutral-950 — dark-mode gold text/icon. |
| `color/gold/500` | Fill only. REQUIRES neutral-950 text (7.78:1). White text FAILS at 2.37:1. |
| `color/gold/600` | 3.31:1 on white — passes 3:1 non-text by a small margin. |
| `color/gold/700` | 4.75:1 on white — minimum gold text step. Passes AA by 0.25. |
| `color/gold/800` | 6.74:1 on white — the RECOMMENDED gold text step. |
| `color/gold` | hue 36 (orange-gold). BRAND ACCENT ONLY — never a status. Moved from hue 40 because 40 sat only 8 degrees from warning, which is not separable and collapses under deuteranopia. |
| `color/yellow/400` | 12.25:1 on neutral-950 — dark-mode warning text/icon. |
| `color/yellow/500` | FILL ONLY. 1.66:1 on white — unusable as text or icon, and white text on it also fails at 1.66:1. Requires neutral-950 text (11.11:1). |
| `color/yellow/700` | 3.75:1 on white — FAILS AA for text. Border/large-icon use only. |
| `color/yellow/800` | 5.54:1 on white — minimum warning TEXT step. |
| `color/yellow` | hue 48 (yellow-amber). Powers the Warning role. Moved here from hue 32 so it separates from gold by luminance as well as hue. NOTE: gold-500 vs yellow-500 measures only 1.43:1 — colour alone is NOT sufficient separation; shape and text carry the meaning. |
| `color/green/400` | 8.78:1 on neutral-950 — dark-mode success text/icon. |
| `color/green/500` | 2.84:1 on white — fails 3:1. Large icons and progress fills only. |
| `color/green/600` | 3.11:1 on white. White text on this fill measures 4.11:1 and FAILS AA — use green-700 for filled success buttons. |
| `color/green/700` | 5.96:1 on white. Filled success buttons and success text. |
| `color/green` | hue 152. Powers the Success role. |
| `color/red/400` | 5.91:1 on neutral-950 — dark-mode danger text/icon and invalid-input border. |
| `color/red/500` | 4.36:1 on white — invalid-input border. |
| `color/red/600` | 5.97:1 on white. Filled destructive buttons and error text. |
| `color/red` | hue 2. Powers the Danger role. LOCKED near 0-4 degrees — must not drift toward orange now that warning occupies hue 48. |
| `color/shadow` | Shadow tint. Equals neutral-950 rather than pure black — black at low opacity over hue-220 surfaces reads as dirty grey. |
| `color/black/70` | Dark-mode backdrop. Stronger than the light-mode value, but it does NOT create contrast — the base is already dark. Separation comes from the neutral-500 overlay border. |
| `color/transparent` | Used by *-outline in light mode where the fill itself already clears 3:1. |
| `color/primary/400` | THE dark-mode text/link/icon step. 7.18:1 on neutral-950. |
| `color/primary/600` | BRAND COLOUR #0077C1. 4.76:1 on white. Forbidden as text on dark (3.86:1) — use 400. |
| `color/primary` | The primary ramp is exposed at tier 2 because buttons and states must select specific steps. 600 IS the brand colour, not 500. Identical in both themes — what changes per theme is which step plays which role, not the step's value. |
| `color/selected-surface` | Background for the selected state (chips, list items, radio cards, current nav item). MUST be overridden in dark mode — the primary ramp deliberately is not, so primary-50 stays near-white and gives 1.04:1 against --color-fg. The border (edge-brand) carries the selection signal; this tint only aids scanning. |
| `color/selected-fg` | Text on --color-selected-surface. 8.26:1 on blue-50 (light), 9.80:1 on blue-900 (dark). |
| `color/selected-hover` | Hover on a selected item. 7.58:1 with selected-fg. |
| `color/selected-strong` | Nested control inside a selected surface (chip remove button). 6.32:1. |
| `color/fg` | 16.15:1 (AAA). |
| `color/fg/secondary` | 8.62:1 (AAA). |
| `color/fg/muted` | 6.05:1 (AA). NOT neutral-500 — that measures 4.20:1 and fails AA, the single most common mistake in this area. |
| `color/fg/disabled` | 2.53:1 — exempt from SC 1.4.3 as disabled text. |
| `color/link` | 6.56:1. MUST carry an underline: link-vs-surrounding-text contrast is under 3:1, so SC 1.4.1 requires a non-colour cue. |
| `color/on-brand` | 4.76:1 on blue-600. |
| `color/on-accent` | EXISTS TO PREVENT A SPECIFIC BUG. Use on gold and yellow fills (7.78:1 and 11.11:1). White text on those measures 2.37:1 and 1.66:1 and fails everything. |
| `color/edge/subtle` | Dividers. Decorative — exempt from SC 1.4.11. |
| `color/edge` | Card edges. Decorative — exempt. NOT valid for inputs. |
| `color/edge/strong` | REQUIRED for input, select, textarea, checkbox and radio borders — these bound a UI component and must clear 3:1 per SC 1.4.11. neutral-300 at 1.56:1 is the industry-standard silent failure. |
| `color/focus/contrast` | Inner halo. Makes the ring readable on saturated fills where the outer ring alone would vanish — blue ring on a blue button. |
| `color/success/fill` | 700, not 600 — white text on green-600 measures 4.11:1 and fails AA. |
| `color/success/hover` | White text measures 8.05:1 here. |
| `color/success/active` | White text measures 11.04:1 here. |
| `color/warning/icon` | 800, not 500 — yellow-500 measures 1.66:1 on white. |
| `color/warning/fill` | Fill only, and requires text.onAccent. |
| `color/danger/hover` | White text measures 8.10:1 here. |
| `color/danger/active` | White text measures 10.60:1 here. |
| `color/info` | Info ALIASES the primary ramp — there is no separate Info ramp. Saves ~11 tokens and avoids two indistinguishable blues. The cost is a rule that must hold 100%: Info renders ONLY as tint + border + icon, NEVER as a solid fill, so that solid blue always means interactive. |
| `color/info/edge` | Was blue-200 in the brief; changed because 1.39:1 is too faint to read as an edge. |
| `color/info/icon` | Icon AND text colour for the info tint. blue-700 = 6.15:1 on blue-50. Was blue-600 (4.47:1) which failed AA for text — Badge uses this as text, not just an icon, so the bar is 4.5 not 3.0. |
| `color/accent` | Gold. BRAND ACCENT ONLY — never a status. Enforced by rule, not by chroma: gold-500 and yellow-500 measure only 1.43:1 apart. |
| `color/accent/fg` | 6.74:1. gold-700 also passes at 4.75:1 but with only 0.25 of margin. |
| `color/accent/active` | DELIBERATELY the same as hover. Gold cannot darken further: gold-700 with the required dark text measures only 3.88:1, and switching to white text at gold-700 (4.75:1) would mean the text colour changes on :active — jarring and a bug magnet. Gold's active state therefore stops at 600. |
| `color/scannable` | White surface for machine-readable graphics (PromptPay QR, barcodes). MUST stay pure white in dark mode — many QR scanners cannot read inverted codes. This is the only sanctioned white after --color-*: initial removed Tailwind's palette. |
| `color/accent-outline` | REQUIRED, not decorative. SC 1.4.11 needs 3:1 for a UI component's boundary. Measured against the light canvas (#F8F9FB): primary-600 4.52 OK, danger-600 5.66 OK, success-700 5.66 OK, but gold-500 only 2.25 — the gold CTA has no visible boundary without this border. gold-600 gives 3.14. |

---

## ❌ สิ่งที่เก็บเป็น Figma Variable ไม่ได้

### Text Styles — ต้องสร้างเป็น Text Style

| Figma Text Style | Font | Size / Line-height / Weight | Tracking |
|---|---|---|---|
| `Display/Lg` | Anuphan | 48 / 64 / 700 | `-0.02em` ⚠️ ละตินล้วน |
| `Display/Sm` | Anuphan | 36 / 48 / 700 | `-0.01em` ⚠️ ละตินล้วน |
| `Heading/Lg` | Anuphan | 32 / 44 / 700 | — |
| `Heading/Sm` | Anuphan | 28 / 40 / 700 | — |
| `Title` | Anuphan | 24 / 32 / 600 | — |
| `Subtitle` | Anuphan | 20 / 28 / 600 | — |
| `Body/Lg` | Anuphan | 18 / 32 / 400 | — |
| `Body` | Anuphan | 16 / 28 / 400 | — |
| `Body/Sm` | Anuphan | 14 / 24 / 400 | — |
| `Caption` | Anuphan | 13 / 20 / 400 | — |
| `Label` | Anuphan | 13 / 20 / 500 | — |
| `Button/Lg` | Anuphan | 16 / 24 / 600 | — |
| `Button` | Anuphan | 14 / 20 / 600 | — |
| `Code` | IBM Plex Mono | 14 / 24 / 400 | — |

### Effect Styles — ต้องสร้างเป็น Effect Style (โหมดสว่างเท่านั้น)

| Figma Effect Style | ชั้น | ค่า |
|---|---|---|
| `Elevation/xs` | 1 | x 0 · y 1 · blur 2 · spread 0 · `#12141A0D` |
| `Elevation/sm` | 1 | x 0 · y 1 · blur 2 · spread 0 · `#12141A0F` |
|  | 2 | x 0 · y 1 · blur 3 · spread 0 · `#12141A1A` |
| `Elevation/md` | 1 | x 0 · y 2 · blur 4 · spread -1 · `#12141A0F` |
|  | 2 | x 0 · y 4 · blur 8 · spread -2 · `#12141A1A` |
| `Elevation/lg` | 1 | x 0 · y 4 · blur 8 · spread -2 · `#12141A14` |
|  | 2 | x 0 · y 12 · blur 20 · spread -4 · `#12141A1F` |
| `Elevation/xl` | 1 | x 0 · y 8 · blur 16 · spread -4 · `#12141A1A` |
|  | 2 | x 0 · y 20 · blur 32 · spread -8 · `#12141A24` |
| `Elevation/2xl` | 1 | x 0 · y 16 · blur 32 · spread -8 · `#12141A1F` |
|  | 2 | x 0 · y 32 · blur 64 · spread -16 · `#12141A2E` |

⚠️ **โหมดมืดต้องไม่มี effect เลย** — Figma ไม่มีวิธีบอกว่า effect ควรหายไปตาม mode
ต้องสร้าง component variant แยกสำหรับโหมดมืดที่ไม่ผูก effect style ไว้

### Easing — ต้องตั้งใน Prototype Interaction ทีละอัน

| ใช้กับ | Figma easing (Custom) | CSS variable |
|---|---|---|
| standard | `0.2, 0, 0, 1` | `--ease-standard` |
| entering | `0, 0, 0.2, 1` | `--ease-entering` |
| exiting | `0.4, 0, 1, 1` | `--ease-exiting` |
| emphasized | `0.05, 0.7, 0.1, 1` | `--ease-emphasized` |
| linear | `0, 0, 1, 1` | `--ease-linear` |

⚠️ **ห้ามใช้ Ease In / Ease Out / Ease In Out ที่ Figma ให้มา** — ค่าไม่ตรงกับ token
และงานที่ implement จะรู้สึกต่างจาก prototype

---

## โครงสร้างหน้าในไฟล์ Figma

```
📄 00 · Cover
📄 01 · Brand Principles
📄 02 · Color
📄 03 · Typography
📄 04 · Spacing & Grid
📄 05 · Radius & Elevation
📄 06 · Motion
📄 07 · Iconography
📄 08 · Accessibility
```

## Frame ที่ต้องมีทุกหน้า

| Frame | ทำไม |
|---|---|
| **320 × auto** | **ข้อกำหนด SC 1.4.10** — ไม่ใช่ทางเลือก เกิดจากผู้ใช้ซูม 400% บนจอ 1280 |
| 360 × 800 | พื้นออกแบบ — เริ่มที่นี่ |
| 768 × 1024 | tablet |
| 1280 × 900 | desktop |
| 1440 × 900 | wide — เฉพาะ dashboard |

## Layout Grid

| Frame | Columns | Gutter | Margin |
|---|---|---|---|
| 320 · 360 | 4 | 16 | 16 |
| 768 | 8 | 24 | 24 |
| 1280 · 1440 | 12 | 24 | 32 |

## ⚠️ กฎบังคับใน Figma

1. **Corner smoothing = 0%** ทุก component — CSS ไม่มี squircle ถ้าตั้ง 60% แบบ iOS งานจริงจะไม่ตรงกับแบบทุกมุม และ **แก้ไม่ได้**
2. **`1. Primitive` มี mode เดียว** — ห้ามให้เปลี่ยนตาม theme สีน้ำเงิน 600 เป็นสีเดียวกันทั้งสองโหมด
3. **Icon เป็น component set ที่มี variant `size`** โดยแต่ละ variant ตั้ง stroke ไว้แล้ว — Figma ไม่มีวิธีบังคับให้ stroke ผูกกับขนาด
4. **โหมดมืดไม่มี drop shadow เลย** — ใช้ surface + edge แทน
5. **Focus variant ต้องมีในทุก component set** ไม่ใช่ตัวอย่างแยก
6. **Annotation `aria-label` ภาษาไทย** สำหรับปุ่มไอคอนล้วนทุกตัว
