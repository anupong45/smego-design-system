import {
  Slider as RACSlider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  Label,
  NumberField,
  Input as RACInput,
  Group,
} from 'react-aria-components';
import { useId } from 'react';
import { cn } from '../lib/cn';
import { useStrings, useSmeGoLocale } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · RangeSlider — ตัวกรองช่วงราคา
   ───────────────────────────────────────────────────────────────────────────
   ★★ SC 2.5.7 Dragging Movements — **ช่องกรอกตัวเลขไม่ใช่ของแถม**

   ตัวบท: ทุกอย่างที่ทำได้ด้วยการลาก **ต้องทำได้ด้วยการกดครั้งเดียว**
   ด้วย single pointer ด้วย

   ⚠️ **คีย์บอร์ดไม่นับ** สำหรับข้อนี้ — ลูกศรซ้าย/ขวาทำให้ผ่าน SC 2.1.1
   (Keyboard) แต่ 2.5.7 พูดถึง *pointer* โดยเฉพาะ ผู้ใช้ที่ควบคุมการลาก
   ได้ยาก (โรคสั่น · ใช้หัวชี้ · ใช้ switch พร้อม pointer emulation)
   ต้องมีทางที่ไม่ต้องลาก

   ระบบนี้จึงให้ **สองทาง** ทั้งคู่เป็น single pointer:
     1. กดบนราง → thumb ที่ใกล้ที่สุดกระโดดไป (RAC ให้มาเอง)
     2. **ช่องกรอกตัวเลข** ต้นทาง–ปลายทาง พร้อมปุ่มเพิ่ม/ลด

   ช่องกรอกยัง**จำเป็นเพื่อความแม่นยำ**ด้วย — slider กว้าง 300px ที่ช่วง
   0–5,000,000 บาท หมายถึง 1px ≈ 16,600 บาท ซึ่งเลือกค่าที่ต้องการไม่ได้เลย

   ★ ราคาแสดงด้วย `font-numeric` และ **เลขอารบิกเท่านั้น**
   เลขไทย ๐–๙ กว้างต่างกันถึง 36.6% em ทำให้ตัวเลขกระโดดขณะลาก (ข้อ 03 §2)

   ★ `aria-label` ของแต่ละ thumb ต้องบอกว่าเป็นต้นทางหรือปลายทาง
   ไม่ใช่ "ช่วงราคา" ทั้งคู่ — ผู้ใช้ screen reader จะแยกไม่ออกว่ากำลัง
   ปรับอันไหน
   ═══════════════════════════════════════════════════════════════════════════ */

export interface RangeSliderProps {
  label: string;
  /** ค่าปัจจุบัน [ต่ำสุด, สูงสุด] */
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minValue: number;
  maxValue: number;
  step?: number;
  /** หน่วยต่อท้ายตัวเลข เช่น "บาท" */
  unit?: string;
  /** ป้ายของช่องกรอกต้นทาง · ค่าเริ่มต้นจาก strings */
  minLabel?: string;
  maxLabel?: string;
  isDisabled?: boolean;
  className?: string;
}

export function RangeSlider({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  unit,
  minLabel,
  maxLabel,
  isDisabled,
  className,
}: RangeSliderProps) {
  const s = useStrings();
  const { locale } = useSmeGoLocale();
  const groupId = useId();

  const lo = minLabel ?? s.filter.priceMin;
  const hi = maxLabel ?? s.filter.priceMax;
  const currency = unit ?? s.common.currency;

  /* เลขอารบิกเสมอ — `th-TH` ให้เลขอารบิกอยู่แล้ว ไม่ใช่เลขไทย */
  const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);

  const setLo = (n: number) => onChange([Math.min(n, value[1]), value[1]]);
  const setHi = (n: number) => onChange([value[0], Math.max(n, value[0])]);

  return (
    <div className={cn('grid min-w-0 gap-3', className)}>
      <RACSlider
        value={value}
        onChange={(v) => onChange(v as [number, number])}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        isDisabled={isDisabled}
        className="grid min-w-0 gap-2"
      >
        <div className="flex items-baseline justify-between gap-2">
          <Label className="text-label text-fg-secondary">{label}</Label>
          {/* ค่าปัจจุบันเป็นข้อความ — ผู้ใช้เห็นตัวเลขโดยไม่ต้องอ่านจาก thumb */}
          <SliderOutput className="text-caption text-fg-muted font-numeric">
            {({ state }) =>
              `${fmt(Number(state.values[0]))} – ${fmt(Number(state.values[1]))} ${currency}`
            }
          </SliderOutput>
        </div>

        {/* ★ กดบนรางได้เลย ไม่ต้องลาก — RAC ให้พฤติกรรมนี้มาเอง
           py-2 ทำให้พื้นที่กดของรางสูงพอ (รางหนา 4px กดยากเกินไป) */}
        <SliderTrack className="relative w-full cursor-pointer py-2 data-disabled:cursor-not-allowed">
          {({ state }) => (
            <>
              {/* รางพื้นหลัง — rounded-full ใช้ได้ เพราะเตี้ยจนกลายเป็นครึ่งความสูง */}
              <div className="h-1 w-full rounded-full bg-sunken" />
              {/* ช่วงที่เลือก */}
              <div
                className={cn(
                  'absolute top-1/2 h-1 -translate-y-1/2 rounded-full',
                  isDisabled ? 'bg-fg-disabled' : 'bg-primary-600',
                )}
                style={{
                  insetInlineStart: `${state.getThumbPercent(0) * 100}%`,
                  width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
                }}
              />
              {/* ★ thumb 20px + ไม่มี padding = เป้า 20×20 ซึ่งต่ำกว่า 24
                 จึงขยายพื้นที่กดด้วย pseudo-element ให้ถึง 24×24
                 โดยไม่เปลี่ยนขนาดที่มองเห็น (ข้อ 09 §4) */}
              {[0, 1].map((i) => (
                <SliderThumb
                  key={i}
                  index={i}
                  aria-label={i === 0 ? lo : hi}
                  className={cn(
                    'top-1/2 size-5 rounded-full border-2 bg-surface',
                    'border-edge-brand',
                    'transition-colors duration-fast ease-standard',
                    'data-disabled:border-edge data-disabled:bg-sunken',
                    'data-dragging:bg-selected-surface',
                    'before:absolute before:left-1/2 before:top-1/2',
                    'before:size-6 before:-translate-x-1/2 before:-translate-y-1/2',
                    'before:content-[""]',
                  )}
                />
              ))}
            </>
          )}
        </SliderTrack>
      </RACSlider>

      {/* ═══ ทางเลือกที่ไม่ต้องลาก — SC 2.5.7 ═══
         ไม่ใช่ของแถม เป็นเงื่อนไขการผ่านเกณฑ์ */}
      <Group
        aria-labelledby={groupId}
        className="grid grid-cols-2 gap-3"
      >
        <span id={groupId} className="sr-only">
          {label}
        </span>

        <NumberField
          value={value[0]}
          onChange={setLo}
          minValue={minValue}
          maxValue={value[1]}
          step={step}
          isDisabled={isDisabled}
          formatOptions={{ useGrouping: true }}
          className="grid min-w-0 gap-1"
        >
          <Label className="text-caption text-fg-muted">{lo}</Label>
          <RACInput
            className={cn(
              'w-full min-w-0 rounded-(--radius-control) border border-edge-strong',
              'bg-surface px-3 py-2 text-body-sm text-fg font-numeric',
              'transition-colors duration-fast ease-standard',
              'focus:border-edge-brand',
              'disabled:bg-sunken disabled:text-fg-disabled disabled:border-edge',
            )}
          />
        </NumberField>

        <NumberField
          value={value[1]}
          onChange={setHi}
          minValue={value[0]}
          maxValue={maxValue}
          step={step}
          isDisabled={isDisabled}
          formatOptions={{ useGrouping: true }}
          className="grid min-w-0 gap-1"
        >
          <Label className="text-caption text-fg-muted">{hi}</Label>
          <RACInput
            className={cn(
              'w-full min-w-0 rounded-(--radius-control) border border-edge-strong',
              'bg-surface px-3 py-2 text-body-sm text-fg font-numeric',
              'transition-colors duration-fast ease-standard',
              'focus:border-edge-brand',
              'disabled:bg-sunken disabled:text-fg-disabled disabled:border-edge',
            )}
          />
        </NumberField>
      </Group>
    </div>
  );
}
