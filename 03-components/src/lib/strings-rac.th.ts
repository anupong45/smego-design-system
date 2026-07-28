/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · คำแปลภาษาไทยของข้อความภายใน React Aria
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ทำไมไฟล์นี้ต้องมี

   React Aria ส่งชุดแปลมา **34 locale และไม่มี `th-TH`**
   ภาษาเอเชียที่มีคือ ja-JP · ko-KR · zh-CN · zh-TW เท่านั้น

   ผลถ้าไม่แก้: ผู้ใช้ TalkBack ภาษาไทย — ซึ่งเป็นกลุ่มผู้ใช้หลักตามข้อ 01 —
   จะได้ยิน **ภาษาอังกฤษ** เมื่อ React Aria ประกาศเอง เช่น
   จำนวนตัวเลือกใน Typeahead · ทิศทางการเรียงในตาราง · ปุ่มปิด Toast
   ซึ่งเป็นข้อความที่ผู้ใช้ไม่เห็นบนจอ แต่ screen reader อ่านออกเสียง

   วิธีแก้: ตั้ง global ที่ `@internationalized/string` อ่าน —
   ดูกลไกและสิ่งที่ลองแล้วไม่ได้ผลใน `install-rac-th.ts`

   **ทดสอบแล้วใช้ได้จริง** บน react-aria-components 1.19.0 ·
   `tests/a11y/rac-i18n.test.tsx` ยืนยันว่าปุ่มล้างค่าใน `SearchField`
   ประกาศว่า "ล้างคำค้นหา" แทน "Clear search"

   ═══ ขอบเขตของไฟล์นี้ ═══
   แปลเฉพาะ package ที่ระบบเราใช้จริง — **42 จาก 146 ข้อความ** ที่ RAC มี
   ที่เหลือ 104 ข้อความ fallback เป็น en-US โดยอัตโนมัติ

   ยังไม่แปล: calendar · datepicker (Pass 2) · color · dnd · tree
   ถ้าเพิ่ม component ที่ใช้ package เหล่านั้น ต้องกลับมาเติมที่นี่
   — เทส `รายงานความครอบคลุม` จะ fail ถ้า RAC เพิ่ม package ใหม่
   ═══════════════════════════════════════════════════════════════════════════ */

/** ข้อความหนึ่งตัว — เป็น string ตรง ๆ หรือฟังก์ชันที่รับตัวแปร */
type RacString = string | ((args: Record<string, unknown>) => string);

/**
 * คำแปลไทย เรียงตาม package ของ React Aria
 * โครงสร้างต้องตรงกับ `dictionary.strings[locale][packageName][key]`
 */
export const racStringsTh: Record<string, Record<string, RacString>> = {
  /* Dialog · Popover · Tooltip — ปุ่มปิด overlay */
  '@react-aria/overlays': {
    dismiss: 'ปิด',
  },

  /* CompareTable และตารางข้อมูลทั้งหมด */
  '@react-aria/table': {
    select: 'เลือก',
    selectAll: 'เลือกทั้งหมด',
    sortable: 'คอลัมน์ที่เรียงลำดับได้',
    ascending: 'จากน้อยไปมาก',
    descending: 'จากมากไปน้อย',
    ascendingSort: (a) => `เรียงตาม ${a['columnName']} จากน้อยไปมาก`,
    descendingSort: (a) => `เรียงตาม ${a['columnName']} จากมากไปน้อย`,
    columnSize: (a) => `${a['value']} พิกเซล`,
    resizerDescription: 'กด Enter เพื่อเริ่มปรับความกว้าง',
    expand: 'ขยาย',
    collapse: 'ย่อ',
  },

  /* การเลือกหลายรายการ — ใช้กับ WishlistGrid และ CompareTable */
  '@react-aria/grid': {
    deselectedItem: (a) => `ยกเลิกการเลือก ${a['item']}`,
    select: 'เลือก',
    selectedCount: (a) => `เลือกแล้ว ${a['count']} รายการ`,
    selectedAll: 'เลือกทุกรายการแล้ว',
    selectedItem: (a) => `เลือก ${a['item']}`,
    longPressToSelect: 'กดค้างเพื่อเข้าโหมดเลือกรายการ',
  },

  '@react-aria/gridlist': {
    hasActionAnnouncement: 'แถวนี้กดได้',
    hasLinkAnnouncement: (a) => `แถวนี้เป็นลิงก์ไปที่ ${a['link']}`,
  },

  /* Chip ที่ลบได้ — FilterChipRow */
  '@react-aria/tag': {
    removeDescription: 'กด Delete เพื่อลบ',
    removeButtonLabel: 'ลบ',
  },

  '@react-aria/toast': {
    close: 'ปิดการแจ้งเตือน',
    notifications: (a) => `มีการแจ้งเตือน ${a['count']} รายการ`,
  },

  /* SearchField ในหน้าค้นหาและ FilterPanel */
  '@react-aria/searchfield': {
    'Clear search': 'ล้างคำค้นหา',
  },

  /* NumberField — ช่องกรอกช่วงราคา (ทางเลือกแทนการลาก slider · SC 2.5.7) */
  '@react-aria/numberfield': {
    decrease: (a) => `ลดค่า ${a['fieldLabel'] ?? ''}`.trim(),
    increase: (a) => `เพิ่มค่า ${a['fieldLabel'] ?? ''}`.trim(),
    numberField: 'ช่องกรอกตัวเลข',
  },

  '@react-aria/spinbutton': {
    Empty: 'ว่าง',
  },

  '@react-aria/menu': {
    longPressMessage: 'กดค้าง หรือกด Alt + ลูกศรลง เพื่อเปิดเมนู',
  },

  /* CategoryNav breadcrumb */
  '@react-aria/breadcrumbs': {
    breadcrumbs: 'ตำแหน่งที่อยู่ในเว็บไซต์',
  },

  '@react-aria/autocomplete': {
    collectionLabel: 'คำแนะนำ',
  },

  /* Typeahead — ช่องค้นหาแบบมีคำแนะนำ */
  '@react-aria/combobox': {
    focusAnnouncement: (a) =>
      a['isGroupChange']
        ? `กลุ่ม ${a['groupTitle']} มี ${a['groupCount']} รายการ`
        : String(a['focusedItem'] ?? ''),
    countAnnouncement: (a) => `มี ${a['optionCount']} ตัวเลือก`,
    selectedAnnouncement: (a) => `เลือก ${a['selectedItem']} แล้ว`,
    buttonLabel: 'แสดงคำแนะนำ',
    listboxLabel: 'คำแนะนำ',
  },

  'react-aria-components': {
    selectPlaceholder: 'เลือกรายการ',
    tableResizer: 'ตัวปรับความกว้าง',
    dropzoneLabel: 'พื้นที่วางไฟล์',
    colorSwatchPicker: 'ตัวเลือกสี',
  },

  /* CheckoutStepper */
  '@react-aria/steplist': {
    steplist: 'ลำดับขั้นตอน',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   ยังไม่แปล — ต้องเติมเมื่อเพิ่ม component ที่ใช้
   ───────────────────────────────────────────────────────────────────────────
   @react-aria/calendar        12 ข้อความ  ← Pass 2 · DatePicker
   @react-aria/datepicker      16 ข้อความ  ← Pass 2 · DatePicker
   @react-stately/datepicker    4 ข้อความ  ← Pass 2 · ข้อความ validation ของวันที่
   @react-aria/dnd             27 ข้อความ  ← ยังไม่มี component ที่ลากได้
   @react-aria/color           43 ข้อความ  ← ไม่มีในระบบนี้
   @react-aria/tree             2 ข้อความ  ← ยังไม่มี

   หมายเหตุ: `Slider` ของ RAC และ `Slider` ของเรา (เดิม `RangeSlider`)
   **ไม่มีข้อความภายใน** จึงไม่ต้องแปล
   ค่า min/max ที่ screen reader อ่านมาจาก `aria-label` ที่เราส่งให้เอง
   ═══════════════════════════════════════════════════════════════════════════ */
