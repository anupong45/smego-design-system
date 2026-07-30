/* ═══════════════════════════════════════════════════════════════════════════
   @smego/ui — barrel export
   ───────────────────────────────────────────────────────────────────────────
   `sideEffects: false` ใน package.json ทำให้ bundler tree-shake ได้
   การ import จาก barrel จึงไม่ดึงทั้ง library เข้ามา

   ═══ วัดแล้ว: import จาก barrel ปลอดภัย ═══

   เคยเขียนไว้ที่นี่ว่าหน้ารายการสินค้า "ต้อง import จาก path ตรง"
   **วัดจริงแล้วไม่จำเป็น** — หน้ารายการสินค้าชุดเดียวกันได้ขนาดเท่ากันเป๊ะ
   ทั้งจาก barrel และจาก path ตรง · tree-shaking ทำงานอยู่แล้ว

   ⚠️ ตัวเลข **33 KB** ที่เคยเขียนไว้ตรงนี้ค้างมานาน — วัดจริง 2026-07-30 ได้
   **44.5 KB gzip** (ดู `scripts/check-bundle.mjs` ซึ่งเป็นแหล่งความจริง
   เพราะมันวัดทุกครั้งที่ `verify` รัน ต่างจากคอมเมนต์ที่ไม่มีใครตรวจ)

   ⚠️ **สิ่งที่ต้องระวังจริงคือ 3 ตัวนี้** (ส่วนเพิ่มจากฐาน ~43 KB):

       DateInput   +58.6 KB gzip   (ฐานเปล่า 42.7 → 101.3)
       Typeahead   +43 KB
       Selector    +40 KB

   ที่เหลือทั้งหมดอยู่ที่ **+0 ถึง +6 KB** (Switch · CheckboxInput · OTPField ·
   FileInput · Dialog · Collapsible · Tooltip) — ไม่ต้องกังวล

   ═══ ★★★ 2026-07-30 — คำแนะนำ `lazy()` ที่เคยอยู่ตรงนี้ถูก **ถอนออก** ═══

   คอมเมนต์เดิมแนะนำให้ห่อสามตัวนั้นด้วย `React.lazy` **ทำแล้ว วัดแล้ว ไม่ช่วย**:

     · ของหนักคือ `DatePicker` เอง ไม่ใช่ `Calendar` (`Calendar.mjs` = 4.3 KB)
       ส่วนที่หนักคือ `@internationalized/date` + เลขคณิตวันที่ของ react-stately
       ซึ่ง `DatePicker` ลากมาเองไม่ว่าจะแยกหรือไม่
     · esbuild ยก input ที่ทั้ง entry และ chunk lazy เข้าถึงได้ขึ้นไปอยู่ใน
       **shared chunk ที่ entry static import** ⇒ initial ไม่ลด
       และ **หน้ารายการสินค้าโต 44.5 → 67.1 KB** เพราะต้องแบกโค้ดปฏิทินที่ไม่ใช้
     · lazy ทั้ง `DateInput` ก็เหมือนกัน — entry import RAC สำหรับ `TextInput`
       อยู่แล้ว และ RAC เป็น module graph เดียว

   40 KB ของ `DateInput` บนหน้าฟอร์มหายได้เฉพาะเมื่อหน้านั้น **ไม่อ้างถึงมันเลย**
   ⇒ เป็นเรื่องของ **route-level splitting ในรีโปแอป** ซึ่ง Next ทำให้เองอยู่แล้ว
   ไม่ใช่เรื่องที่ไลบรารีแก้ได้ · รายละเอียดทั้งหมดอยู่ในหัว `check-bundle.mjs`

   ⚠️ ห้ามใส่ `lazy()` กลับมาโดยไม่วัดใหม่ทั้งสามหน้า

   ทางหนีเมื่อ wrapper ไม่พอ: `@smego/ui/primitives` เปิด RAC ทั้งชุด
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── ฐาน ──────────────────────────────────────────────────────────────────── */
export { cn, twMerge } from './lib/cn';
export { stringsTh, type Strings, type PartialStrings } from './lib/strings.th';
export { racStringsTh } from './lib/strings-rac.th';
export {
  installRacThaiStrings,
  buildRacThaiStrings,
  RAC_LOCALE,
  type InstallReport,
} from './lib/install-rac-th';

export {
  SmeGoProvider,
  useStrings,
  useSmeGoLocale,
  SMEGO_LOCALE,
  SMEGO_TIMEZONE,
  type SmeGoProviderProps,
} from './provider/SmeGoProvider';

export {
  ThemeToggle,
  useTheme,
  type ThemeToggleProps,
  type ThemePreference,
  type SmegoThemeApi,
} from './provider/ThemeToggle';

/* IIFE ที่แอปต้อง inline ใน <head> ก่อน first paint — generate จาก
   `02-tokens/theme-init.js` ซึ่งเป็นแหล่งความจริงเดียว ห้ามพิมพ์สตริงเอง */
export { THEME_INIT_SCRIPT } from './lib/theme-init.generated';

export { Icon, type IconProps, type IconName, type IconSize } from './icon/Icon';
export { iconRegistry } from './icon/registry';

/* ── Layout ───────────────────────────────────────────────────────────────── */
export { Stack, VStack, HStack, stackStyles, type StackProps } from './layout/Stack';
export {
  Grid,
  Container,
  Section,
  Divider,
  gridStyles,
  containerStyles,
  type GridProps,
  type ContainerProps,
  type SectionProps,
  type DividerProps,
} from './layout/Grid';
export { Main, type MainProps } from './layout/Main';

/* ── Inputs ───────────────────────────────────────────────────────────────── */
export { Button, buttonStyles, type ButtonProps } from './inputs/Button';
export {
  IconButton,
  iconButtonStyles,
  type IconButtonProps,
  type AllowedIconOnlyName,
} from './inputs/IconButton';
export { Link, linkStyles, type LinkProps } from './inputs/Link';
export { TextInput, type TextInputProps } from './inputs/TextInput';
export { TextArea, type TextAreaProps } from './inputs/TextArea';
export {
  fieldStyles,
  statusTextClass,
  statusBorderClass,
  isErrorStatus,
  type InputStatus,
  type InputStatusType,
  type BaseFieldProps,
} from './inputs/fieldStyles';

/* ── ไม่มี alias ชื่อเก่า ────────────────────────────────────────────────────
   เคยมี `TextField` / `Textarea` เป็น alias `@deprecated` อยู่ตรงนี้
   **คำตัดสิน 2026-07-28 กลับนโยบาย** — rename หักดิบ ไม่มี alias แล้วขยับเป็น
   0.2.0 เลย เพราะยังไม่มี consumer นอกรีโป (04-patterns เป็น .md ล้วน)
   หน้าต่างที่หัก API ได้ฟรีจึงยังเปิดอยู่ และจะปิดทันทีที่มีคนแรกมา import

   alias ยังส่งต่อแค่ *ชื่อ* ไม่ได้ส่งต่อ API เดิมอยู่แล้ว (`errorMessage` →
   `status` · `showOptional` → `isOptional`) มันจึงไม่เคยกันของพังได้จริง
   มีแต่ทำให้บาร์เรลมีชื่อคู่ · `lint:parity` กฎ 3b บังคับข้อนี้ */

export {
  CheckboxInput,
  CheckboxList,
  type CheckboxInputProps,
  type CheckboxListProps,
} from './inputs/CheckboxInput';
export {
  Radio,
  RadioList,
  type RadioProps,
  type RadioListProps,
} from './inputs/RadioList';
export { Slider, type SliderProps } from './inputs/Slider';
export {
  DateInput,
  createBuddhistCalendar,
  type DateInputProps,
} from './inputs/DateInput';
export { OTPField, type OTPFieldProps } from './inputs/OTPField';
export { NumberInput, type NumberInputProps } from './inputs/NumberInput';
export { SearchField, type SearchFieldProps } from './inputs/SearchField';
export { Switch, type SwitchProps } from './inputs/Switch';
export {
  Selector,
  SelectItem,
  type SelectorProps,
  type SelectItemProps,
  type SelectOption,
} from './inputs/Selector';
export { Typeahead, type TypeaheadProps } from './inputs/Typeahead';
export {
  FileInput,
  type FileInputProps,
  type UploadedFile,
} from './inputs/FileInput';

/* ── Data display ─────────────────────────────────────────────────────────── */
export { Card, CardMedia, cardStyles, type CardProps, type CardMediaProps } from './data-display/Card';
export { Badge, Dot, badgeStyles, type BadgeProps, type DotProps } from './data-display/Badge';
export {
  Token,
  RemovableChip,
  ChipRow,
  chipStyles,
  type TokenProps,
  type RemovableChipProps,
  type ChipRowProps,
} from './data-display/Token';
export {
  Avatar,
  initialsFromName,
  type AvatarProps,
  type AvatarSize,
} from './data-display/Avatar';
export { EmptyState, type EmptyStateProps } from './data-display/EmptyState';
export {
  Table,
  type TableProps,
  type TableColumn,
  type TableAlign,
  type SortDirection,
} from './data-display/Table';
export {
  Collapsible,
  AccordionItem,
  type CollapsibleProps,
  type AccordionItemProps,
} from './data-display/Collapsible';
export {
  ImageGallery,
  type ImageGalleryProps,
  type GalleryImage,
} from './data-display/ImageGallery';
export {
  DescriptionList,
  descriptionListStyles,
  type DescriptionListProps,
  type DescriptionListItem,
} from './data-display/DescriptionList';

/* ── Feedback ─────────────────────────────────────────────────────────────── */
export {
  Banner,
  alertStyles,
  type BannerProps,
  type BannerTone,
} from './feedback/Banner';
export {
  ProgressBar,
  progressBarStyles,
  type ProgressBarProps,
  type ProgressFormat,
} from './feedback/ProgressBar';
export {
  Skeleton,
  SkeletonGroup,
  SkeletonText,
  skeletonStyles,
  type SkeletonProps,
  type SkeletonGroupProps,
  type SkeletonTextProps,
} from './feedback/Skeleton';
export {
  Spinner,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerShade,
} from './feedback/Spinner';
export {
  Dialog,
  DialogOverlay,
  DialogTrigger,
  type DialogProps,
  type DialogOverlayProps,
} from './feedback/Dialog';
export { Tooltip, TooltipTrigger, type TooltipProps } from './feedback/Tooltip';
export {
  ToastRegion,
  showToast,
  toastQueue,
  type ToastContent,
  type ToastTone,
  type ToastRegionProps,
} from './feedback/Toast';

/* ── Navigation ───────────────────────────────────────────────────────────── */
export { TopNav, type TopNavProps } from './navigation/TopNav';
export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type DropdownMenuProps,
  type DropdownMenuItemProps,
  type DropdownMenuSectionProps,
} from './navigation/DropdownMenu';
export {
  BottomNav,
  type BottomNavProps,
  type BottomNavItem,
} from './navigation/BottomNav';
export {
  Pagination,
  pageSlots,
  type PaginationProps,
  type PaginationVariant,
  type PaginationSize,
} from './navigation/Pagination';
export {
  TabList,
  Tab,
  TabPanel,
  type TabListProps,
  type TabProps,
  type TabPanelProps,
  type TabListSize,
} from './navigation/TabList';
export {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlProps,
  type SegmentedControlItemProps,
  type SegmentedControlSize,
} from './navigation/SegmentedControl';

/* ── Marketplace ──────────────────────────────────────────────────────────── */
export {
  EntityCard,
  EntityAmount,
  EntityMeta,
  type EntityCardProps,
  type EntityAmountProps,
  type EntityMetaProps,
  type EntityMetaItem,
} from './marketplace/EntityCard';
export {
  DeadlineBadge,
  DeadlineText,
  type DeadlineStatus,
  type DeadlineBadgeProps,
  type DeadlineTextProps,
} from './marketplace/Deadline';
export { ProductCard, type ProductCardProps } from './marketplace/ProductCard';
export {
  ServiceCard,
  type ServiceCardProps,
  type ServicePricingModel,
} from './marketplace/ServiceCard';
export { ProgramCard, type ProgramCardProps } from './marketplace/ProgramCard';
export { GrantCard, type GrantCardProps } from './marketplace/GrantCard';
export {
  FundingCard,
  type FundingCardProps,
  type CollateralRequirement,
} from './marketplace/FundingCard';
export { BusinessCard, type BusinessCardProps } from './marketplace/BusinessCard';
export {
  TrainingCard,
  type TrainingCardProps,
  type TrainingFormat,
} from './marketplace/TrainingCard';
export { SearchResult, type SearchResultProps } from './marketplace/SearchResult';
export {
  FilterPanel,
  FilterChipRow,
  type FilterPanelProps,
  type FilterChipRowProps,
  type FilterGroup,
  type ActiveFilter,
} from './marketplace/FilterPanel';
export {
  CategoryNav,
  CategoryBreadcrumb,
  type CategoryNavProps,
  type CategoryBreadcrumbProps,
  type CategoryItem,
  type BreadcrumbItem,
} from './marketplace/CategoryNav';
export {
  CheckoutSummary,
  CheckoutStepper,
  type CheckoutSummaryProps,
  type CheckoutStepperProps,
  type CheckoutStep,
  type SummaryLine,
} from './marketplace/Checkout';
export {
  CartLineItem,
  CartSellerGroup,
  CartList,
  CartDrawer,
  type CartLineItemProps,
  type CartSellerGroupProps,
  type CartListProps,
  type CartDrawerProps,
} from './marketplace/Cart';
export { BuyBox, type BuyBoxProps } from './marketplace/BuyBox';
export {
  PaymentMethodSelect,
  PromptPayQR,
  SlipUpload,
  PaymentFields,
  type PaymentMethod,
  type PaymentMethodSelectProps,
  type PromptPayQRProps,
  type SlipUploadProps,
} from './marketplace/Payment';
export {
  OrderTimeline,
  type OrderTimelineProps,
  type OrderStep,
  type OrderStepStatus,
} from './marketplace/OrderTimeline';
export {
  SaveButton,
  WishlistGrid,
  WishlistHeader,
  type SaveButtonProps,
  type WishlistGridProps,
  type WishlistHeaderProps,
} from './marketplace/Wishlist';
export {
  SellerProfile,
  CertificationBadge,
  type SellerProfileProps,
  type CertificationBadgeProps,
  type Certification,
} from './marketplace/SellerProfile';
export {
  CompareBar,
  CompareTable,
  type CompareBarProps,
  type CompareTableProps,
  type CompareItem,
  type CompareRow,
} from './marketplace/Compare';
