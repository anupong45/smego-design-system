import { useId, useRef, useState, type DragEvent } from 'react';
import { cn } from '../lib/cn';
import { Icon } from '../icon/Icon';
import { Button } from './Button';
import { useStrings } from '../provider/SmeGoProvider';

/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO · FileUpload
   ───────────────────────────────────────────────────────────────────────────
   ★★★ SC 2.5.7 Dragging Movements — **ลากวางต้องไม่ใช่ทางเดียว**

   พื้นที่ลากวางเป็นรูปแบบที่ละเมิดข้อนี้บ่อยที่สุด · ผู้ใช้ที่ควบคุม
   การลากได้ยาก (โรคสั่น · ใช้หัวชี้ · switch + pointer emulation)
   ต้องมีทาง **กดครั้งเดียว** ที่ทำสิ่งเดียวกันได้

   component จึงมี **ปุ่มเลือกไฟล์เสมอ** ไม่ใช่แค่พื้นที่ลาก
   และปุ่มนั้นไม่ใช่ของสำรอง — เป็นทางหลักบนมือถือซึ่งลากไม่ได้อยู่แล้ว

   ★★★ **ห้ามใช้ `<input type="file">` ดิบ**

   UI ของมัน **style ไม่ได้และขึ้นภาษาตาม OS** — ผู้ใช้ที่ตั้งเครื่องเป็น
   อังกฤษจะเห็น "Choose File · No file chosen" กลางฟอร์มไทย
   (เหตุผลเดียวกับ `<select>` และ `validationBehavior="native"`)

   ⚠️ input ที่ซ่อนต้องซ่อนด้วย `sr-only` **ไม่ใช่ `display: none`**
   เพราะ `display: none` ทำให้ focus ไปไม่ถึง · และ**ยังต้องมีชื่อ**
   ผ่าน `aria-labelledby` — axe จับข้อนี้ได้ตอนเขียน `SlipUpload`

   ★★ การลากวางต้องไม่พึ่ง `dragover` อย่างเดียวสำหรับ feedback
   ผู้ใช้ที่มองไม่เห็นไม่รู้ว่าลากอยู่เหนือพื้นที่ไหน — ปุ่มจึงเป็นทาง
   ที่ประกาศได้จริง ส่วนไฮไลต์ตอนลากเป็นของแถมสำหรับผู้ที่มองเห็น

   ★ ตรวจไฟล์ฝั่ง client เพื่อ**ความเร็ว** ไม่ใช่ความปลอดภัย
   การตรวจจริงต้องทำที่ server เสมอ
   ═══════════════════════════════════════════════════════════════════════════ */

export interface UploadedFile {
  id: string;
  name: string;
  /** ขนาดเป็น byte */
  size: number;
}

export interface FileUploadProps {
  label: string;
  description?: string;
  /** MIME types ที่รับ */
  accept?: string[];
  /** ขนาดสูงสุดต่อไฟล์ (เมกะไบต์) */
  maxSizeMb?: number;
  /** รับหลายไฟล์ */
  multiple?: boolean;
  /** ไฟล์ที่อัปโหลดแล้ว */
  files?: UploadedFile[];
  onSelect: (files: File[]) => void;
  onRemove?: (id: string) => void;
  isDisabled?: boolean;
  className?: string;
}

const DEFAULT_ACCEPT = ['image/jpeg', 'image/png', 'application/pdf'];

/** แสดงขนาดไฟล์แบบอ่านง่าย — เลขอารบิกเสมอ */
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function FileUpload({
  label,
  description,
  accept = DEFAULT_ACCEPT,
  maxSizeMb = 5,
  multiple,
  files,
  onSelect,
  onRemove,
  isDisabled,
  className,
}: FileUploadProps) {
  const s = useStrings();
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const descId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setDragging] = useState(false);

  const validate = (list: File[]) => {
    const accepted: File[] = [];
    for (const file of list) {
      if (accept.length && !accept.includes(file.type)) {
        setError(s.error.fileWrongType);
        return null;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(s.error.fileTooLarge(maxSizeMb));
        return null;
      }
      accepted.push(file);
    }
    setError(null);
    return accepted;
  };

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const accepted = validate([...list]);
    if (accepted) onSelect(accepted);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (isDisabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <span id={labelId} className="text-label text-fg-secondary">
        {label}
      </span>
      <p id={descId} className="text-caption text-fg-muted">
        {description ?? s.common.uploadHelp(maxSizeMb)}
      </p>

      {/* พื้นที่ลากวาง — เป็น **ของเสริม** ไม่ใช่ทางเดียว
         ไม่มี role เพราะการลากไม่ใช่ interaction ที่ประกาศได้
         ตัวที่ประกาศได้คือปุ่มข้างใน */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'grid min-w-0 justify-items-center gap-3',
          'rounded-(--radius-container) border border-dashed p-6',
          'transition-colors duration-fast ease-standard',
          isDragging
            ? 'border-edge-brand bg-selected-surface text-selected-fg'
            : 'border-edge-strong bg-surface',
          isDisabled && 'border-edge bg-sunken',
        )}
      >
        <Icon name="upload" size={32} className="text-fg-muted" />

        <p className="text-center text-body-sm text-fg-secondary">
          {s.common.dropFilesHere}
        </p>

        {/* ★★ ทางที่ไม่ต้องลาก — กดครั้งเดียว (SC 2.5.7)
           ไม่ใช่ของสำรอง แต่เป็นทางหลักบนมือถือ */}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept.join(',')}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-describedby={cn(descId, error && errorId)}
          aria-invalid={error ? true : undefined}
          /* sr-only ไม่ใช่ display:none — focus ต้องไปถึง */
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            /* ล้างค่าเพื่อให้เลือกไฟล์เดิมซ้ำได้ */
            e.target.value = '';
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          isDisabled={isDisabled}
          onPress={() => inputRef.current?.click()}
        >
          {s.common.chooseFile}
        </Button>
      </div>

      {files && files.length > 0 && (
        <ul className="grid min-w-0 gap-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex min-w-0 items-center gap-2 rounded-(--radius-control) border border-edge bg-surface p-3"
            >
              <Icon name="file-text" size={20} className="shrink-0 text-fg-muted" />
              <span className="min-w-0 flex-1 truncate text-body-sm text-fg">
                {f.name}
              </span>
              <span className="shrink-0 text-caption text-fg-muted font-numeric">
                {formatSize(f.size)}
              </span>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="xs"
                  onPress={() => onRemove(f.id)}
                  /* ★ ชื่อรวมชื่อไฟล์ — ในรายการ 5 ไฟล์ ปุ่ม "ลบ"
                     ทั้ง 5 อันแยกไม่ออก (SC 2.5.3) */
                  aria-label={s.common.removeFile(f.name)}
                >
                  <Icon name="x" size={16} />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-caption text-danger-icon">
          {error}
        </p>
      )}
    </div>
  );
}
