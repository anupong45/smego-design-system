/* ชนิดสำหรับ `gen-theme-init.mjs` — สคริปต์เป็น `.mjs` ธรรมดาโดยเจตนา
   (รันด้วย node ตรง ๆ ไม่ต้อง transpile) แต่ `theme-init.test.ts` import
   `extractIife` จากมันเพื่อไม่ให้มีตรรกะการตัด IIFE สองชุด · TS จึงต้องมี
   ไฟล์ชนิดคู่ ไม่งั้นได้ `any` แบบ implicit ซึ่ง `strict` ปฏิเสธ */

/** ตัดเอาเฉพาะ IIFE หลักออกจากเนื้อไฟล์ `02-tokens/theme-init.js` */
export function extractIife(src: string): string;
