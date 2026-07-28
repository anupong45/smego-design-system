/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · Icon registry
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ ต้องเป็น **static import map** ห้ามใช้ dynamic import ด้วยตัวแปร
   ไม่เช่นนั้น bundler จะรวมไอคอน Lucide ทั้ง ~1,600 ตัวเข้า bundle

   ไอคอนในนี้คือชุดที่ marketplace ใช้จริงเท่านั้น — เพิ่มได้ตามต้องการ
   แต่ทุกตัวต้องถูก import แบบระบุชื่อตรง ๆ

   ⚠️ Lucide **ไม่มี**ไอคอนสำหรับสิ่งที่ SME.GO เป็นเรื่องเกี่ยวกับจริง
   (ThaID · PromptPay · e-Tax · DBD · มอก. · ฮาลาล · GMP)
   ตามข้อ 09: **ใช้ข้อความแทน ห้ามหยิบไอคอนที่ใกล้เคียงมาใช้**
   เพราะไอคอนที่ความหมายผิดแย่กว่าไม่มีไอคอน โดยเฉพาะกับการรับรองมาตรฐาน
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  /* ── 5 ตัวที่ใช้เป็นปุ่มไอคอนล้วนได้ (ข้อ 09) ─────────────────────────── */
  Search, X, Menu, ArrowLeft, MoreVertical, MoreHorizontal,

  /* ── ทิศทาง ─────────────────────────────────────────────────────────────── */
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,

  /* ── สถานะ · แต่ละตัวรูปทรงต่างกันจริง ไม่ใช่แค่สี (SC 1.4.1) ─────────── */
  CircleCheck,      // สำเร็จ — วงกลม
  TriangleAlert,    // เตือน  — สามเหลี่ยม ★ สำคัญเพราะทองกับเหลืองห่างแค่ 1.43:1
  CircleX,          // ผิดพลาด — วงกลม + กากบาท
  Info,             // ข้อมูล — วงกลม + i
  Check,

  /* ── หมวดเนื้อหาของ marketplace ─────────────────────────────────────────── */
  Package,          // สินค้า
  Briefcase,        // บริการ
  Landmark,         // โครงการรัฐ
  Banknote,         // แหล่งทุน
  GraduationCap,    // การอบรม

  /* ── การกระทำของผู้ใช้ ──────────────────────────────────────────────────── */
  Heart, Scale, ShoppingCart, Plus, Minus, Trash2, ExternalLink, Download, Upload,

  /* ── ตัวกรองและมุมมอง ───────────────────────────────────────────────────── */
  Filter, SlidersHorizontal, LayoutGrid, List,

  /* ── ผู้ขายและความน่าเชื่อถือ ───────────────────────────────────────────── */
  Building2, MapPin, ShieldCheck, Star, Clock, Calendar,

  /* ── เอกสารและการชำระเงิน ───────────────────────────────────────────────── */
  FileText, Receipt, QrCode, CreditCard, Landmark as Bank,

  /* ── สถานะการโหลด ───────────────────────────────────────────────────────── */
  LoaderCircle,

  type LucideIcon,
} from 'lucide-react';

/**
 * ชื่อไอคอนที่ระบบรู้จัก — ตั้งชื่อแบบ kebab-case ตาม lucide.dev
 * เพื่อให้หาจากเอกสารของ Lucide ได้ตรง
 */
export const iconRegistry = {
  /* ปุ่มไอคอนล้วน */
  search: Search,
  x: X,
  menu: Menu,
  'arrow-left': ArrowLeft,
  'more-vertical': MoreVertical,
  'more-horizontal': MoreHorizontal,

  /* ทิศทาง */
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,

  /* สถานะ */
  'circle-check': CircleCheck,
  'triangle-alert': TriangleAlert,
  'circle-x': CircleX,
  info: Info,
  check: Check,

  /* หมวดเนื้อหา */
  package: Package,
  briefcase: Briefcase,
  landmark: Landmark,
  banknote: Banknote,
  'graduation-cap': GraduationCap,

  /* การกระทำ */
  heart: Heart,
  scale: Scale,
  'shopping-cart': ShoppingCart,
  plus: Plus,
  minus: Minus,
  trash: Trash2,
  'external-link': ExternalLink,
  download: Download,
  upload: Upload,

  /* ตัวกรองและมุมมอง */
  filter: Filter,
  sliders: SlidersHorizontal,
  'layout-grid': LayoutGrid,
  list: List,

  /* ผู้ขาย */
  building: Building2,
  'map-pin': MapPin,
  'shield-check': ShieldCheck,
  star: Star,
  clock: Clock,
  calendar: Calendar,

  /* เอกสารและการชำระเงิน */
  'file-text': FileText,
  receipt: Receipt,
  'qr-code': QrCode,
  'credit-card': CreditCard,
  bank: Bank,

  /* โหลด */
  loader: LoaderCircle,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
