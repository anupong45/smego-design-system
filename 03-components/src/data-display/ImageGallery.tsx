import { useState } from 'react';
import { cn } from '../lib/cn';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · ImageGallery — รูปสินค้าในหน้ารายละเอียด
   ───────────────────────────────────────────────────────────────────────────
   ★★★ **รูปย่อเป็นปุ่มจริง ไม่ใช่ `<div onClick>`**

   ผู้ใช้คีย์บอร์ดต้อง Tab เข้าถึงได้ · screen reader ต้องได้ยินว่า "ปุ่ม"
   และได้ยินว่าอันไหน **เลือกอยู่** ซึ่งมาจาก `aria-current` ไม่ใช่จากขอบสีน้ำเงิน

   ★★★ **ไม่มี carousel ที่เลื่อนเอง**

   ระบบประกาศกฎ "ไม่มีอะไรหายไปตามเวลา" ไว้แล้ว (`Alert.md`) · รูปที่เลื่อน
   เองละเมิด SC 2.2.2 และทำให้ผู้ใช้ที่กำลังดูรายละเอียดสินค้าเสียตำแหน่ง
   การเปลี่ยนรูปเกิดจากการกดเท่านั้น

   ★★ **`alt` ต้องมีเสมอ และห้ามเป็น "รูปภาพ"**

   ผู้ขายจำนวนมากไม่กรอกคำบรรยาย · component จึงเติมให้เป็น
   "ชื่อสินค้า รูปที่ 2" ซึ่งอย่างน้อยบอกตำแหน่งและว่ากำลังดูอะไรอยู่
   — ดีกว่า `alt=""` ที่ทำให้รูปหลักหายไปจาก a11y tree ทั้งใบ

   ★★ **ประกาศตำแหน่งผ่าน `aria-live`** (SC 4.1.3)
   ผู้ใช้ที่กดรูปย่อแล้วไม่เห็นภาพต้องรู้ว่าอะไรเปลี่ยน — "รูปที่ 2 จาก 5"

   ★ ไม่มี lightbox ในรอบนี้ — ถ้าต้องซูม ให้เปิด `<Dialog>` ที่ระดับหน้า
   การซ้อน modal ไว้ในกล่องรูปทำให้ focus กลับผิดที่เมื่อปิด
   ═══════════════════════════════════════════════════════════════════════════ */

export interface GalleryImage {
  /** URL รูปเต็ม */
  src: string;

  /**
   * คำบรรยายจากผู้ขาย — ถ้าไม่มีจะเติมให้เป็น "ชื่อสินค้า รูปที่ n"
   *
   * ⚠️ ห้ามส่ง `''` เพื่อ "ให้เงียบ" — รูปหลักเป็นเนื้อหา ไม่ใช่ของตกแต่ง
   */
  alt?: string;

  /** URL รูปย่อ · ไม่ส่ง = ใช้ `src` */
  thumbnailSrc?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];

  /** ชื่อสินค้า — ใช้เติม `alt` ที่ผู้ขายไม่ได้กรอก */
  itemName: string;

  className?: string;
}

export function ImageGallery({ images, itemName, className }: ImageGalleryProps) {
  const s = useStrings();
  const [index, setIndex] = useState(0);

  /* กล่องรูปเปล่าไม่ให้อะไร — หน้ารายละเอียดตัดสินใจเองว่าจะวางอะไรแทน */
  if (images.length === 0) return null;

  const current = images[index]!;
  const altOf = (image: GalleryImage, i: number) =>
    image.alt ?? s.gallery.fallbackAlt(itemName, i + 1);

  return (
    <div
      role="group"
      aria-label={s.gallery.label}
      className={cn('grid min-w-0 gap-3', className)}
    >
      <div className="overflow-hidden rounded-(--radius-container) border border-edge-subtle bg-sunken">
        <img
          src={current.src}
          alt={altOf(current, index)}
          className="aspect-square w-full object-contain"
        />
      </div>

      {/* ★ ประกาศตำแหน่งให้ผู้ใช้ที่ไม่เห็นภาพ (SC 4.1.3) */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {s.gallery.position(index + 1, images.length)}
      </p>

      {images.length > 1 && (
        <ul
          aria-label={s.gallery.thumbnails}
          /* p-1 -m-1 เผื่อที่ให้วงแหวน focus 4px ไม่ถูกกล่องที่เลื่อนได้ตัด */
          className="-m-1 flex min-w-0 gap-2 overflow-x-auto p-1"
        >
          {images.map((image, i) => {
            const isCurrent = i === index;

            return (
              <li key={image.src} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  /* ★ "เลือกอยู่" มาจาก aria-current ไม่ใช่จากสีขอบ */
                  aria-current={isCurrent ? 'true' : undefined}
                  /* ชื่อปุ่มบอกตำแหน่ง — "รูปที่ 3 จาก 5" ไม่ใช่ "รูปภาพ" */
                  aria-label={s.gallery.position(i + 1, images.length)}
                  className={cn(
                    'block size-16 shrink-0 overflow-hidden rounded-(--radius-xs)',
                    'border-2 bg-sunken',
                    'transition-colors duration-fast ease-standard',
                    /* ขอบ 2px ทั้งสองสถานะ — ความกว้างไม่กระโดดตอนเลือก */
                    isCurrent ? 'border-edge-brand' : 'border-edge hover:border-edge-strong',
                  )}
                >
                  <img
                    src={image.thumbnailSrc ?? image.src}
                    /* ★ รูปย่อเป็นของตกแต่ง — ชื่อปุ่มพูดแทนไปแล้ว
                       ถ้าใส่ alt ด้วยจะได้ชื่อซ้อนกันสองชั้น */
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
