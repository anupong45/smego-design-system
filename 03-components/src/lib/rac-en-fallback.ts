/* ═══════════════════════════════════════════════════════════════════════════
   RAC en-US fallback — **ไฟล์นี้ถูกสร้างด้วยสคริปต์ ห้ามแก้มือ**
   ───────────────────────────────────────────────────────────────────────────
   สร้างด้วย:  npm run gen:rac-fallback   ·  react-aria-components 1.19.0
   ตอนนี้: 22 package · 146 key · 3990 bytes (gzip ~1.3 KB)

   ★★ ทำไมต้องฝังตารางนี้ไว้ในไลบรารี

   `installRacThaiStrings` ต้องเติม **ทุก package** ที่ RAC รู้จัก ไม่ใช่แค่
   ตัวที่เราแปล เพราะถ้า global มีแล้วแต่ package ไหนขาด
   `LocalizedStringDictionary` จะ **throw แล้วพังทั้งหน้า** ไม่ใช่ fallback เงียบ
   (ดู `private/LocalizedStringDictionary.js:41`)

   เดิมจึงบังคับให้แอปส่ง `dictionary.strings['en-US']` เข้ามาเอง — แต่ import
   `react-aria-components/i18n` ลาก **ทั้ง 34 locale** วัดแล้ว
   **355 KB raw / 59 KB gzip** ซึ่งใหญ่กว่าไลบรารีทั้งก้อน (35 KB gzip) เกือบ
   1.7 เท่า จึงถูกทำเป็น opt-in — และผลคือผู้ใช้ TalkBack ไทยได้ยินภาษาอังกฤษ
   ตลอดมาถ้าแอปลืมเรียก

   ★ แต่ **locale เดียวเล็กมาก** (ตัวเลขด้านบน) การฝังไว้จึงเกือบฟรี และทำให้
   `SmeGoProvider` เรียกให้เองเป็นค่าเริ่มต้นได้ — เอกสารเดิมสรุปผิดเพราะเอา
   ขนาดของ 34 locale มาตัดสินแทนขนาดของ locale เดียว

   ⚠️ ถ้า RAC เพิ่ม package/key ใหม่ ตารางนี้จะเก่า และหน้าจะพังตอน runtime
   `tests/a11y/rac-fallback.test.ts` เทียบตารางนี้กับ RAC ที่ติดตั้งจริง
   จึงเปลี่ยนความพังตอน runtime เป็นความแดงตอน build
   ═══════════════════════════════════════════════════════════════════════════ */

/* ฟังก์ชัน ICU ของ RAC รับ shape ต่างกันทุกตัว (e.date · e.count · e.columnName)
   การไล่ประกาศชนิดจริงต้อง mirror ทั้ง 37 ตัว และจะเก่าทุกครั้งที่ RAC เปลี่ยน
   จึงปล่อยพารามิเตอร์เป็น any — ค่าคืนยังผูกเป็น string อยู่ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RacMessage = string | ((...args: any[]) => string);

export const RAC_EN_FALLBACK: Record<string, Record<string, RacMessage>> = {
  "@react-aria/autocomplete": {
    "collectionLabel": "Suggestions",
  },
  "@react-aria/breadcrumbs": {
    "breadcrumbs": "Breadcrumbs",
  },
  "@react-aria/calendar": {
    "dateRange": e=>`${e.startDate} to ${e.endDate}`,
    "dateSelected": e=>`${e.date} selected`,
    "finishRangeSelectionPrompt": "Click to finish selecting date range",
    "maximumDate": "Last available date",
    "minimumDate": "First available date",
    "next": "Next",
    "previous": "Previous",
    "selectedDateDescription": e=>`Selected Date: ${e.date}`,
    "selectedRangeDescription": e=>`Selected Range: ${e.dateRange}`,
    "startRangeSelectionPrompt": "Click to start selecting date range",
    "todayDate": e=>`Today, ${e.date}`,
    "todayDateSelected": e=>`Today, ${e.date} selected`,
  },
  "@react-aria/color": {
    "colorInputLabel": e=>`${e.label}, ${e.channelLabel}`,
    "colorNameAndValue": e=>`${e.name}: ${e.value}`,
    "colorPicker": "Color picker",
    "colorSwatch": "color swatch",
    "transparent": "transparent",
    "twoDimensionalSlider": "2D slider",
  },
  "@react-aria/combobox": {
    "buttonLabel": "Show suggestions",
    "countAnnouncement": (e,t)=>`${t.plural(e.optionCount,{one:()=>`${t.number(e.optionCount)} option`,other:()=>`${t.number(e.optionCount)} options`})} available.`,
    "focusAnnouncement": (e,t)=>`${t.select({true:()=>`Entered group ${e.groupTitle}, with ${t.plural(e.groupCount,{one:()=>`${t.number(e.groupCount)} option`,other:()=>`${t.number(e.groupCount)} options`})}. `,other:""},e.isGroupChange)}${e.optionText}${t.select({true:", selected",other:""},e.isSelected)}`,
    "listboxLabel": "Suggestions",
    "selectedAnnouncement": e=>`${e.optionText}, selected`,
  },
  "@react-aria/datepicker": {
    "calendar": "Calendar",
    "day": "day",
    "dayPeriod": "AM/PM",
    "endDate": "End Date",
    "era": "era",
    "hour": "hour",
    "minute": "minute",
    "month": "month",
    "second": "second",
    "selectedDateDescription": e=>`Selected Date: ${e.date}`,
    "selectedRangeDescription": e=>`Selected Range: ${e.startDate} to ${e.endDate}`,
    "selectedTimeDescription": e=>`Selected Time: ${e.time}`,
    "startDate": "Start Date",
    "timeZoneName": "time zone",
    "weekday": "day of the week",
    "year": "year",
  },
  "@react-aria/dnd": {
    "dragDescriptionKeyboard": "Press Enter to start dragging.",
    "dragDescriptionKeyboardAlt": "Press Alt + Enter to start dragging.",
    "dragDescriptionLongPress": "Long press to start dragging.",
    "dragDescriptionTouch": "Double tap to start dragging.",
    "dragDescriptionVirtual": "Click to start dragging.",
    "dragItem": e=>`Drag ${e.itemText}`,
    "dragSelectedItems": (e,t)=>`Drag ${t.plural(e.count,{one:()=>`${t.number(e.count)} selected item`,other:()=>`${t.number(e.count)} selected items`})}`,
    "dragSelectedKeyboard": (e,t)=>`Press Enter to drag ${t.plural(e.count,{one:()=>`${t.number(e.count)} selected item`,other:()=>`${t.number(e.count)} selected items`})}.`,
    "dragSelectedKeyboardAlt": (e,t)=>`Press Alt + Enter to drag ${t.plural(e.count,{one:()=>`${t.number(e.count)} selected item`,other:()=>`${t.number(e.count)} selected items`})}.`,
    "dragSelectedLongPress": (e,t)=>`Long press to drag ${t.plural(e.count,{one:()=>`${t.number(e.count)} selected item`,other:()=>`${t.number(e.count)} selected items`})}.`,
    "dragStartedKeyboard": "Started dragging. Press Tab to navigate to a drop target, then press Enter to drop, or press Escape to cancel.",
    "dragStartedTouch": "Started dragging. Navigate to a drop target, then double tap to drop.",
    "dragStartedVirtual": "Started dragging. Navigate to a drop target, then click or press Enter to drop.",
    "dropCanceled": "Drop canceled.",
    "dropComplete": "Drop complete.",
    "dropDescriptionKeyboard": "Press Enter to drop. Press Escape to cancel drag.",
    "dropDescriptionTouch": "Double tap to drop.",
    "dropDescriptionVirtual": "Click to drop.",
    "dropIndicator": "drop indicator",
    "dropOnItem": e=>`Drop on ${e.itemText}`,
    "dropOnRoot": "Drop on",
    "endDragKeyboard": "Dragging. Press Enter to cancel drag.",
    "endDragTouch": "Dragging. Double tap to cancel drag.",
    "endDragVirtual": "Dragging. Click to cancel drag.",
    "insertAfter": e=>`Insert after ${e.itemText}`,
    "insertBefore": e=>`Insert before ${e.itemText}`,
    "insertBetween": e=>`Insert between ${e.beforeItemText} and ${e.afterItemText}`,
  },
  "@react-aria/grid": {
    "deselectedItem": e=>`${e.item} not selected.`,
    "longPressToSelect": "Long press to enter selection mode.",
    "select": "Select",
    "selectedAll": "All items selected.",
    "selectedCount": (e,t)=>`${t.plural(e.count,{"=0":"No items selected",one:()=>`${t.number(e.count)} item selected`,other:()=>`${t.number(e.count)} items selected`})}.`,
    "selectedItem": e=>`${e.item} selected.`,
  },
  "@react-aria/gridlist": {
    "hasActionAnnouncement": "row has action",
    "hasLinkAnnouncement": e=>`row has link: ${e.link}`,
  },
  "@react-aria/menu": {
    "longPressMessage": "Long press or press Alt + ArrowDown to open menu",
  },
  "@react-aria/numberfield": {
    "decrease": e=>`Decrease ${e.fieldLabel}`,
    "increase": e=>`Increase ${e.fieldLabel}`,
    "numberField": "Number field",
  },
  "@react-aria/overlays": {
    "dismiss": "Dismiss",
  },
  "@react-aria/searchfield": {
    "Clear search": "Clear search",
  },
  "@react-aria/spinbutton": {
    "Empty": "Empty",
  },
  "@react-aria/steplist": {
    "steplist": "Step List",
  },
  "@react-aria/table": {
    "ascending": "ascending",
    "ascendingSort": e=>`sorted by column ${e.columnName} in ascending order`,
    "collapse": "Collapse",
    "columnSize": e=>`${e.value} pixels`,
    "descending": "descending",
    "descendingSort": e=>`sorted by column ${e.columnName} in descending order`,
    "expand": "Expand",
    "resizerDescription": "Press Enter to start resizing",
    "select": "Select",
    "selectAll": "Select All",
    "sortable": "sortable column",
  },
  "@react-aria/tag": {
    "removeButtonLabel": "Remove",
    "removeDescription": "Press Delete to remove tag.",
  },
  "@react-aria/toast": {
    "close": "Close",
    "notifications": (e,t)=>`${t.plural(e.count,{one:()=>`${t.number(e.count)} notification`,other:()=>`${t.number(e.count)} notifications`})}.`,
  },
  "@react-aria/tree": {
    "collapse": "Collapse",
    "expand": "Expand",
  },
  "@react-stately/color": {
    "alpha": "Alpha",
    "black": "black",
    "blue": "Blue",
    "blue purple": "blue purple",
    "brightness": "Brightness",
    "brown": "brown",
    "brown yellow": "brown yellow",
    "colorName": e=>`${e.lightness} ${e.chroma} ${e.hue}`,
    "cyan": "cyan",
    "cyan blue": "cyan blue",
    "dark": "dark",
    "gray": "gray",
    "grayish": "grayish",
    "green": "Green",
    "green cyan": "green cyan",
    "hue": "Hue",
    "light": "light",
    "lightness": "Lightness",
    "magenta": "magenta",
    "magenta pink": "magenta pink",
    "orange": "orange",
    "orange yellow": "orange yellow",
    "pale": "pale",
    "pink": "pink",
    "pink red": "pink red",
    "purple": "purple",
    "purple magenta": "purple magenta",
    "red": "Red",
    "red orange": "red orange",
    "saturation": "Saturation",
    "transparentColorName": e=>`${e.lightness} ${e.chroma} ${e.hue}, ${e.percentTransparent} transparent`,
    "very dark": "very dark",
    "very light": "very light",
    "vibrant": "vibrant",
    "white": "white",
    "yellow": "yellow",
    "yellow green": "yellow green",
  },
  "@react-stately/datepicker": {
    "rangeOverflow": e=>`Value must be ${e.maxValue} or earlier.`,
    "rangeReversed": "Start date must be before end date.",
    "rangeUnderflow": e=>`Value must be ${e.minValue} or later.`,
    "unavailableDate": "Selected date unavailable.",
  },
  "react-aria-components": {
    "colorSwatchPicker": "Color swatches",
    "dropzoneLabel": "DropZone",
    "selectPlaceholder": "Select an item",
    "tableResizer": "Resizer",
  },
};
