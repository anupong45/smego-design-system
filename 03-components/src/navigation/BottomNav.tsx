'use client';

import { useLayoutEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { Icon, type IconName } from '../icon/Icon';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · BottomNav — แถบนำทางยึดก้นจอ (มือถือเท่านั้น)
   ───────────────────────────────────────────────────────────────────────────
   ★★★ ประกาศ **เฉพาะ `--bottom-nav-height` ของตัวเอง**

   `--bottom-inset` ใน `semantic.css` รวมทุกแถบด้วย `calc()` แล้ว `base.css §5a`
   จองพื้นที่ท้ายเอกสารจากค่านั้น · แถบนี้จึงห้ามแตะ `--compare-bar-height`
   `--action-bar-height` หรือ `body.style` — `lint-classes.mjs` ปฏิเสธไว้แล้ว

   นี่คือบั๊กที่ `CompareBar` เคยเป็น: เขียนทับตัวแปรของแถบอื่น + `body`
   ตรง ๆ แล้ว last-writer-wins ทำให้จองพื้นที่แค่แถบเดียว ปุ่มท้ายหน้าจม
   ใต้แถบ = ไม่ผ่าน SC 2.4.11 · มองไม่เห็นเลยจนกว่าจะมีสองแถบพร้อมกัน
   (`Compare.md` §5)

   ★★ **มือถือเท่านั้น** — `md:hidden`

   บนเดสก์ท็อป `TopNav` ทำหน้าที่นี้อยู่แล้ว การมีทั้งสองแถบคือเมนูหลัก
   สองชุดในหน้าเดียว ซึ่งทำให้ผู้ใช้ screen reader ได้ยิน landmark นำทาง
   ซ้ำสองและต้องเดาว่าอันไหนคืออันจริง

   ★★ **สูงสุด 5 รายการ** — บังคับด้วย type ไม่ใช่คำเตือนในเอกสาร

   ข้อความไทยยาวกว่าอังกฤษ 20–40% · วัดที่ 320px: 5 รายการได้ช่องละ 64px
   ซึ่งพอสำหรับคำสั้นอย่าง "หน้าแรก" "ตะกร้า" แต่ 6 รายการเหลือ 53px
   ทำให้ต้องตัดคำ และป้ายที่ตัดคำแล้วอ่านไม่ออกก็ไม่ต่างจากไม่มีป้าย

   ★ เป้ากด 56px ตามสเปกในข้อ 08 · สูงกว่าเกณฑ์ 44px ของ SC 2.5.8 เพราะ
   แถบก้นจอถูกกดด้วยนิ้วโป้งขณะถือมือเดียว ซึ่งแม่นน้อยกว่าการกดด้วยชี้

   ★ `env(safe-area-inset-bottom)` — ไม่เผื่อจะถูก home indicator ของ iOS ทับ
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BottomNavItem {
  /** ป้ายที่เห็น — **สั้น** คำเดียวหรือสองคำ (ดู §2 ใน .md) */
  label: string;
  icon: IconName;
  href: string;
  /** หน้าที่กำลังอยู่ — ได้ `aria-current="page"` */
  isCurrent?: boolean;
  /**
   * ตัวเลขมุมขวา เช่นจำนวนในตะกร้า
   *
   * ⚠️ ตัวเลขลอย ๆ ไม่บอกอะไรกับ screen reader — ชื่อ accessible จึงถูก
   * ประกอบเป็น "ตะกร้า 3 รายการ" ไม่ใช่ "ตะกร้า 3" (หลักเดียวกับ `TopNav`)
   */
  count?: number;
}

/** 1–5 รายการ · เกินนี้ type ปฏิเสธ (ดูเหตุผลในหัวไฟล์) */
type UpTo5 =
  | [BottomNavItem]
  | [BottomNavItem, BottomNavItem]
  | [BottomNavItem, BottomNavItem, BottomNavItem]
  | [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem]
  | [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem];

export interface BottomNavProps {
  items: UpTo5;
  /**
   * ชื่อ landmark · ค่าเริ่มต้นจาก strings
   *
   * ⚠️ ถ้าหน้ามี `<nav>` มากกว่าหนึ่ง **ทุกตัวต้องมีชื่อต่างกัน**
   * ไม่เช่นนั้น axe จะฟ้อง `landmark-unique` และผู้ใช้จะแยกไม่ออก
   * (เคสเดียวกับ `Pagination` บน+ล่างในหน้าเดียว)
   */
  label?: string;
  /**
   * ประกาศความสูงเข้า `--bottom-nav-height` · ค่าเริ่มต้น `true`
   *
   * ตั้ง `false` เฉพาะตอนวาดใน gallery/สตอรี่ที่แถบไม่ได้ยึดจอจริง
   * มิฉะนั้นหน้าจะจองพื้นที่ท้ายเอกสารทั้งที่ไม่มีอะไรมาทับ
   */
  reserveSpace?: boolean;
  className?: string;
}

export function BottomNav({
  items,
  label,
  reserveSpace = true,
  className,
}: BottomNavProps) {
  const s = useStrings();
  const ref = useRef<HTMLElement>(null);

  /* ★ `useLayoutEffect` ไม่ใช่ `useEffect` — ค่าต้องถูกตั้งก่อน paint
     ไม่เช่นนั้นเฟรมแรกจะไม่มีพื้นที่จอง แล้วหน้ากระตุกตอนแถบโผล่ */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !reserveSpace) return;
    const root = document.documentElement;

    const publish = () => {
      root.style.setProperty('--bottom-nav-height', `${el.offsetHeight}px`);
    };
    publish();

    /* ความสูงเปลี่ยนได้จริงเมื่อป้ายขึ้นบรรทัดที่สองบนจอแคบ */
    const observer = new ResizeObserver(publish);
    observer.observe(el);

    return () => {
      observer.disconnect();
      /* คืนเป็น 0px ไม่ใช่ removeProperty — ให้ calc() ยังคำนวณได้ */
      root.style.setProperty('--bottom-nav-height', '0px');
    };
  }, [items.length, reserveSpace]);

  return (
    <nav
      ref={ref}
      aria-label={label ?? s.bottomNav.label}
      className={cn(
        'fixed inset-x-0 bottom-0 z-(--z-bar)',
        /* ★★ เดสก์ท็อปใช้ TopNav — สองแถบพร้อมกันคือเมนูหลักสองชุด */
        'md:hidden',
        'border-t border-(--elevation-edge-overlay)',
        'bg-(--elevation-surface-overlay)',
        /* safe area ของ iOS — ไม่เผื่อจะถูก home indicator ทับ */
        'pb-[env(safe-area-inset-bottom,0px)]',
        className,
      )}
    >
      <ul className="flex">
        {items.map((item) => (
          <li key={item.href} className="min-w-0 flex-1">
            <a
              href={item.href}
              /* ★ `aria-current="page"` ไม่ใช่ `aria-selected` — นี่คือลิงก์
                 ไม่ใช่ tab · และไม่พึ่งสีเดียวในการบอกหน้าปัจจุบัน (ดู §4) */
              aria-current={item.isCurrent ? 'page' : undefined}
              aria-label={
                item.count === undefined
                  ? undefined
                  : s.bottomNav.itemWithCount(item.label, item.count)
              }
              className={cn(
                'group relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-1',
                'transition-colors duration-fast ease-standard',
                item.isCurrent
                  ? 'text-selected-fg'
                  : 'text-fg-muted data-hovered:text-fg',
              )}
            >
              <span className="relative">
                <Icon name={item.icon} size={24} />
                {item.count !== undefined && item.count > 0 && (
                  /* ★ `aria-hidden` เพราะจำนวนอยู่ในชื่อ accessible แล้ว —
                     ปล่อยให้อ่านซ้ำจะได้ "ตะกร้า 3 รายการ 3" */
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -end-2 -top-1 min-w-4 rounded-full px-1',
                      /* ★★ `bg-primary-600` ไม่ใช่ `bg-danger-icon`
                         ────────────────────────────────────────────────────
                         สองเหตุผล และทั้งคู่สำคัญ:

                         1 · **contrast** — ฉบับแรกใช้ `bg-danger-icon` แล้ว
                             contrast sweep จับได้ว่าโหมดมืดเหลือ **3.11:1**
                             (ขาวบน rgb(239,102,97)) ต่ำกว่า 4.5:1
                             คอมเมนต์ใน `semantic.css` ที่ว่า "ขาวบน
                             danger-600 = 5.66 ✅" เป็นค่าของ**โหมดสว่าง**
                             ในโหมดมืด ramp ถูก override เป็นแดงอ่อนกว่า
                             — กับดัก "วัดค่าที่ composite แล้ว" ตัวเดียวกับ
                             ที่ `RadioList.tsx` เตือนไว้

                         2 · **ความหมาย** — จำนวนในตะกร้าไม่ใช่ข้อผิดพลาด
                             สีแดงบอกว่ามีอะไรผิด ซึ่งไม่จริง
                             `TopNav` ใช้ `bg-primary-600` กับจำนวนตะกร้า
                             อยู่แล้ว จึงตรงกันทั้งระบบ */
                      'bg-primary-600 text-on-brand',
                      'text-center text-caption font-numeric leading-4',
                    )}
                  >
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </span>

              {/* ★ ป้ายต้องเห็นเสมอ ไม่ซ่อนเหลือแต่ไอคอน — ไอคอน 5 ตัวเรียงกัน
                 โดยไม่มีคำกำกับทำให้ผู้ใช้ต้องเดา และข้อ 09 อนุญาตไอคอนล้วน
                 เฉพาะ 5 ตัวที่เป็นสัญลักษณ์สากลจริง */}
              <span className="max-w-full truncate text-caption">{item.label}</span>

              {/* ★★ ตัวชี้หน้าปัจจุบันที่ **ไม่ใช่สี** — ขีดบนขอบล่าง (SC 1.4.1)
                 ผู้ใช้ตาบอดสีต้องแยกออกได้โดยไม่ต้องอาศัยความต่างของสี */}
              {item.isCurrent && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary-600"
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
