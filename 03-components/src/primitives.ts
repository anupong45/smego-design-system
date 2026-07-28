/* ═══════════════════════════════════════════════════════════════════════════
   @smego/ui/primitives — ทางหนีเมื่อ wrapper ไม่พอ
   ───────────────────────────────────────────────────────────────────────────
   การตัดสินใจข้อ 24: **wrapper เป็นค่าเริ่มต้น · primitive เป็นทางหนี**

   wrapper ครอบ ~90% ของงานจริงและบังคับความสม่ำเสมอ แต่ 10% ที่เหลือ
   ต้องประกอบเอง — ถ้าไม่มีทางหนี ทีมจะ fork component หรือดึง RAC มาใช้
   ตรง ๆ ซึ่งทั้งสองทางออกจากระบบไปเลย

   ═══ ใช้เมื่อไร ═══
   • wrapper ไม่รองรับโครงสร้างที่ต้องการ เช่น label มี tooltip ข้าง
     หรือ error อยู่เหนือช่องแทนใต้ช่อง
   • ต้องใช้ RAC component ที่ระบบยังไม่ได้ห่อ

   ═══ ใช้แล้วต้องรับผิดชอบอะไร ═══
   ⚠️ **`base.css` ยังทำงานให้อยู่** — focus ring · reduced motion ·
      reset italic ยังได้อัตโนมัติเพราะเป็นกฎระดับ global

   ⚠️ **แต่สิ่งเหล่านี้ไม่ได้มาเอง** ต้องทำเองทั้งหมด:
      • `validationBehavior="aria"` — ถ้าลืม จะได้ tooltip ของ browser
        ที่ style ไม่ได้และขึ้นภาษาตาม OS ไม่ใช่ภาษาไทย
      • การกัน validate กลาง Thai IME composition
      • ขอบ input ต้องเป็น `border-edge-strong` ไม่ใช่ `border-edge`
      • ขนาดเป้า ≥24×24
      • สถานะต้องมีรูปทรง ไม่ใช่แค่สี

   ใช้ `styles` ที่ export จาก wrapper เพื่อไม่ต้องเขียน class ใหม่:

       import { TextField as RACTextField, Input, Label } from '@smego/ui/primitives';
       import { fieldStyles } from '@smego/ui';

       <RACTextField validationBehavior="aria" className={fieldStyles.root}>
         <Label className={fieldStyles.label}>เลขนิติบุคคล</Label>
         <Input className={fieldStyles.control({ size: 'md' })} />
       </RACTextField>
   ═══════════════════════════════════════════════════════════════════════════ */

export * from 'react-aria-components';
