/* ═══════════════════════════════════════════════════════════════════════════
   SME.GO Component Library — หน้าเดียวจบ ดู component ทุกตัวได้ในเบราว์เซอร์

       npm run gallery          # build + เปิด server ที่ :4400
       npm run gallery:build    # build อย่างเดียว

   ไฟล์นี้ import จาก ../src/index โดยตรง — ไม่มี copy, ไม่มี mock
   เห็นอะไรที่นี่ = ของจริงจาก @smego/ui
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  SmeGoProvider, ToastRegion, showToast,
  Stack, HStack, Grid, Container, Divider,
  Icon, iconRegistry, type IconName,
  Button, IconButton, Link, TextInput, TextArea, CheckboxInput, CheckboxGroup,
  Radio, RadioList, Slider, DateInput, OTPField, NumberInput,
  SearchField, Switch, Selector, Typeahead, FileInput,
  Card, CardMedia, Badge, Dot, Token, RemovableChip, ChipRow, Avatar,
  Collapsible, AccordionItem, ImageGallery, DescriptionList,
  Banner, ProgressBar, Skeleton, SkeletonText, Spinner, Dialog, DialogTrigger,
  Tooltip, TooltipTrigger,
  TopNav, BottomNav, Pagination, TabList, Tab, TabPanel,
  SegmentedControl, SegmentedControlItem,
  EntityCard, EntityAmount, EntityMeta, DeadlineBadge, DeadlineText,
  ProductCard, ServiceCard, ProgramCard, GrantCard, FundingCard,
  BusinessCard, TrainingCard, SearchResult,
  FilterPanel, FilterChipRow, CategoryNav, CategoryBreadcrumb,
  CheckoutSummary, CheckoutStepper, BuyBox,
  CartList, CartSellerGroup, CartLineItem, CartDrawer,
  PaymentMethodSelect, PromptPayQR, SlipUpload,
  OrderTimeline, SaveButton, WishlistGrid, WishlistHeader,
  SellerProfile, CertificationBadge, CompareBar, CompareTable,
} from '../src/index';

/* ── โครงหน้า ─────────────────────────────────────────────────────────────── */

const PX = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="%23cbd5e1"/></svg>'
);

function Thumb({ ratio = 'aspect-4/3' }: { ratio?: string }) {
  return <img src={PX} alt="" className={`${ratio} w-full object-cover`} />;
}

/** หนึ่ง component = หนึ่ง Specimen — มีหัวข้อ คำอธิบาย และตัวอย่าง */
function Specimen({
  name, note, children, wide = false,
}: { name: string; note?: string; children: ReactNode; wide?: boolean }) {
  return (
    <section id={slug(name)} className="scroll-mt-24">
      <div className="mb-3">
        <h3 className="text-h4 text-fg">{name}</h3>
        {note && <p className="text-caption text-fg-muted mt-1">{note}</p>}
      </div>
      <div className={`rounded-(--radius-container) border border-edge bg-surface p-4 md:p-6 ${wide ? '' : 'max-w-2xl'}`}>
        {children}
      </div>
    </section>
  );
}

/** แถวย่อยในหนึ่ง Specimen — ใช้โชว์ variant */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 py-3 first:pt-0 last:pb-0 border-b border-edge-subtle last:border-b-0">
      <span className="text-caption text-fg-muted font-mono">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}

function Group({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 grid gap-8">
      <div>
        <h2 className="text-h2 text-fg">{title}</h2>
        <Divider />
      </div>
      {children}
    </section>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/* ── หมวด 1 · Foundations ─────────────────────────────────────────────────── */

const ICON_NAMES = Object.keys(iconRegistry) as IconName[];

function Foundations() {
  return (
    <Group id="foundations" title="1 · Foundations">
      <Specimen name="Icon" note={`${ICON_NAMES.length} ตัวใน registry — ขนาด 16 / 20 / 24`} wide>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
          {ICON_NAMES.map((n) => (
            <div key={n} className="grid justify-items-center gap-1 rounded-(--radius-control) border border-edge-subtle p-3">
              <Icon name={n} size={24} />
              <span className="text-caption text-fg-muted font-mono text-center break-all">{n}</span>
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen name="Stack / HStack" note="flex wrapper — direction · gap · align · justify · wrap">
        <Stack gap="3">
          <HStack gap="2"><Badge label="หนึ่ง" /><Badge label="สอง" /><Badge label="สาม" /></HStack>
          <HStack gap="6" justify="between"><span className="text-body">ซ้าย</span><span className="text-body">ขวา</span></HStack>
        </Stack>
      </Specimen>

      <Specimen name="Grid" note="preset: product · cards · split · sidebar" wide>
        <Grid preset="cards">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="sm"><span className="text-body">การ์ด {i}</span></Card>
          ))}
        </Grid>
      </Specimen>

      <Specimen name="Divider" note="horizontal · vertical">
        <Stack gap="3">
          <Divider />
          <HStack gap="3" align="center">
            <span className="text-body">ก</span><Divider orientation="vertical" /><span className="text-body">ข</span>
          </HStack>
        </Stack>
      </Specimen>
    </Group>
  );
}

/* ── หมวด 2 · Inputs ──────────────────────────────────────────────────────── */

function Inputs() {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('a');
  const [range, setRange] = useState<[number, number]>([20000, 180000]);
  const [otp, setOtp] = useState('');
  const [num, setNum] = useState(3);
  const [q, setQ] = useState('');
  const [on, setOn] = useState(true);
  const [sel, setSel] = useState<string | null>('bkk');
  const [files, setFiles] = useState<{ id: string; name: string; size: number }[]>([]);

  const provinces = [
    { id: 'bkk', label: 'กรุงเทพมหานคร' },
    { id: 'cnx', label: 'เชียงใหม่' },
    { id: 'kkn', label: 'ขอนแก่น', description: 'ภาคตะวันออกเฉียงเหนือ' },
    { id: 'hdy', label: 'สงขลา', isDisabled: true },
  ];

  return (
    <Group id="inputs" title="2 · Inputs">
      <Specimen name="Button" note="6 variant × 4 size · icon · loading · disabled">
        <Row label="variant">
          <Button variant="primary">หลัก</Button>
          <Button variant="secondary">รอง</Button>
          <Button variant="ghost">โปร่ง</Button>
          <Button variant="danger">ลบ</Button>
          <Button variant="success">ยืนยัน</Button>
          <Button variant="accent">เน้น</Button>
        </Row>
        <Row label="size">
          <Button size="xs">xs</Button><Button size="sm">sm</Button>
          <Button size="md">md</Button><Button size="lg">lg</Button>
        </Row>
        <Row label="icon">
          <Button icon="search">ค้นหา</Button>
          <Button icon="chevron-right" iconPosition="end" variant="secondary">ถัดไป</Button>
        </Row>
        <Row label="state">
          <Button isLoading>กำลังบันทึก</Button>
          <Button isDisabled>ปิดใช้งาน</Button>
          <Button fullWidth variant="secondary">เต็มความกว้าง</Button>
        </Row>
      </Specimen>

      <Specimen name="IconButton" note="ต้องมี label เสมอ · ghost / outline / solid">
        <Row label="variant">
          <IconButton name="search" label="ค้นหา" />
          <IconButton name="menu" label="เมนู" variant="outline" />
          <IconButton name="x" label="ปิด" variant="solid" />
        </Row>
        <Row label="size">
          <IconButton name="more-vertical" label="เพิ่มเติม" size="sm" />
          <IconButton name="more-vertical" label="เพิ่มเติม" size="md" />
          <IconButton name="more-vertical" label="เพิ่มเติม" size="lg" />
        </Row>
      </Specimen>

      <Specimen name="Link" note="ภายใน · ภายนอก (มีไอคอน + คำเตือน) · quiet">
        <Row label="variant">
          <Link href="#inputs">ลิงก์ภายใน</Link>
          <Link href="https://www.sme.go.th" external>เว็บไซต์ สสว.</Link>
          <Link href="#inputs" quiet>แบบเงียบ</Link>
        </Row>
      </Specimen>

      <Specimen name="TextInput / TextArea" note="label · description · error · prefix · size">
        <Stack gap="4">
          <TextInput label="ชื่อกิจการ" value={text} onChange={setText} placeholder="เช่น ร้านกาแฟดอยคำ" description="ตามที่จดทะเบียน" />
          <TextInput label="เลขนิติบุคคล" status={{ type: 'error', message: 'ต้องมี 13 หลัก' }} defaultValue="012" />
          <TextInput label="ราคา" startIcon="฿" size="lg" defaultValue="1250000" />
          <TextInput label="อีเมล" isOptional />
          <TextArea label="รายละเอียดสินค้า" rows={3} placeholder="อธิบายสั้น ๆ" />
          <TextInput label="ปิดใช้งาน" isDisabled defaultValue="แก้ไขไม่ได้" />
        </Stack>
      </Specimen>

      <Specimen name="CheckboxInput / CheckboxGroup">
        <Stack gap="4">
          <CheckboxInput
            label="จดจำการค้นหานี้"
            isSelected={checked}
            onChange={setChecked}
            description="ระบบจะบันทึกไว้ในบัญชีของคุณ"
          />
          <CheckboxGroup label="มาตรฐานที่ต้องการ" description="เลือกได้มากกว่าหนึ่ง">
            <CheckboxInput value="gmp" label="GMP" />
            <CheckboxInput value="haccp" label="HACCP" />
            <CheckboxInput value="halal" label="ฮาลาล" />
          </CheckboxGroup>
          <CheckboxGroup label="ประเภท" status={{ type: 'error', message: 'เลือกอย่างน้อยหนึ่งรายการ' }}>
            <CheckboxInput value="a" label="สินค้า" />
            <CheckboxInput value="b" label="บริการ" />
          </CheckboxGroup>
        </Stack>
      </Specimen>

      <Specimen name="RadioList" note="layout inline · card · แนวนอน">
        <Stack gap="5">
          <RadioList label="รูปแบบการรับสินค้า" value={radio} onChange={setRadio}>
            <Radio value="a" description="ส่งภายใน 3–5 วันทำการ">จัดส่ง</Radio>
            <Radio value="b" description="รับที่โรงงาน จ.เชียงใหม่">รับเอง</Radio>
          </RadioList>
          <RadioList label="ขนาดกิจการ" orientation="horizontal" defaultValue="s">
            <Radio value="s">เล็ก</Radio><Radio value="m">กลาง</Radio><Radio value="l">ใหญ่</Radio>
          </RadioList>
          <RadioList label="แผนการใช้งาน" defaultValue="free">
            <Radio value="free" layout="card" description="ลงสินค้าได้ 10 รายการ" endSlot={<Badge variant="success" label="ฟรี" />}>เริ่มต้น</Radio>
            <Radio value="pro" layout="card" description="ไม่จำกัดรายการ + สถิติ" endSlot={<span className="text-body-strong">฿590/เดือน</span>}>มืออาชีพ</Radio>
          </RadioList>
        </Stack>
      </Specimen>

      <Specimen name="Slider" note="สองหัวจับ · หน่วยไทย">
        <Slider label="ช่วงราคา" value={range} onChange={setRange} min={0} max={500000} step={5000} unit="บาท" />
      </Specimen>

      <Specimen name="DateInput" note="ปฏิทินพุทธศักราช (พ.ศ.)">
        <DateInput label="วันปิดรับสมัคร" description="เลือกจากปฏิทิน พ.ศ." />
      </Specimen>

      <Specimen name="OTPField" note="6 หลัก · วางทั้งชุดได้ (SC 3.3.8)">
        <OTPField label="รหัสยืนยัน" value={otp} onChange={setOtp} description="ส่งไปที่เบอร์ลงท้าย 4567" />
      </Specimen>

      <Specimen name="NumberInput / SearchField / Switch">
        <Stack gap="4">
          <NumberInput label="จำนวน" value={num} onChange={setNum} minValue={1} suffix="ชิ้น" />
          <NumberInput label="ไม่มีปุ่มเพิ่ม-ลด" defaultValue={12} hideStepper suffix="กก." />
          <SearchField label="ค้นหาสินค้า" value={q} onChange={setQ} placeholder="เครื่องคั่วกาแฟ" />
          <Switch isSelected={on} onChange={setOn} label="รับการแจ้งเตือน" description="แจ้งเตือนเมื่อมีคำสั่งซื้อใหม่" />
        </Stack>
      </Specimen>

      <Specimen name="Selector / Typeahead" note="Selector = เลือกจากรายการ · Typeahead = พิมพ์กรองได้">
        <Stack gap="4">
          <Selector label="จังหวัด" options={provinces} selectedKey={sel} onSelectionChange={(k) => setSel(k as string)} />
          <Selector label="หมวดหมู่" options={provinces} placeholder="เลือกหมวดหมู่" status={{ type: 'error', message: 'กรุณาเลือกหมวดหมู่' }} />
          <Typeahead label="ค้นหาจังหวัด" options={provinces} description="พิมพ์เพื่อกรอง" />
        </Stack>
      </Specimen>

      <Specimen name="FileInput" note="ลากวาง · จำกัดชนิดและขนาด">
        <FileInput
          label="เอกสารรับรอง"
          description="PDF หรือรูปภาพ ไม่เกิน 5 MB"
          accept={['application/pdf', 'image/*']}
          maxSize={5}
          isMultiple
          value={files}
          onChange={(fs) => setFiles((p) => [...p, ...fs.map((f, i) => ({ id: `${f.name}-${i}`, name: f.name, size: f.size }))])}
          onRemove={(id) => setFiles((p) => p.filter((f) => f.id !== id))}
        />
      </Specimen>
    </Group>
  );
}

/* ── หมวด 3 · Data display ────────────────────────────────────────────────── */

function DataDisplay() {
  const [chips, setChips] = useState(['GMP', 'ฮาลาล', 'เชียงใหม่']);

  return (
    <Group id="data-display" title="3 · Data display">
      <Specimen name="Card" note="elevation flat · raised · floating · overlay">
        <Row label="elevation">
          <Card elevation="flat" padding="sm">flat</Card>
          <Card elevation="raised" padding="sm">raised</Card>
          <Card elevation="floating" padding="sm">floating</Card>
        </Row>
        <Row label="interactive / selected">
          <Card interactive padding="sm">คลิกได้</Card>
          <Card selected padding="sm">ถูกเลือก</Card>
        </Row>
        <Row label="CardMedia">
          <Card padding="none" className="w-56">
            <CardMedia position="top"><Thumb /></CardMedia>
            <div className="p-4 text-body">มีภาพด้านบน</div>
          </Card>
        </Row>
      </Specimen>

      <Specimen name="Badge / Dot">
        <Row label="variant">
          <Badge variant="neutral" label="ทั่วไป" />
          <Badge variant="info" label="ข้อมูล" />
          <Badge variant="success" label="เปิดรับ" />
          <Badge variant="warning" label="ใกล้ปิด" />
          <Badge variant="danger" label="ปิดแล้ว" />
          <Badge variant="accent" label="แนะนำ" />
        </Row>
        <Row label="showIcon">
          <Badge variant="success" showIcon label="ยืนยันตัวตนแล้ว" />
          <Badge variant="warning" showIcon label="รอตรวจสอบ" />
        </Row>
        <Row label="Dot">
          <Dot variant="success" label="ออนไลน์" />
          <Dot variant="warning" label="ไม่อยู่" />
          <Dot variant="danger" label="ออฟไลน์" />
        </Row>
      </Specimen>

      <Specimen name="Avatar" note="ทางถอย 3 ชั้น · ตัวย่อไทยไม่ตัดสระ/วรรณยุกต์">
        <Row label="size">
          <Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" size="sm" />
          <Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" size="md" />
          <Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" size="lg" />
          <Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" size="xl" />
        </Row>
        <Row label="ตัวย่อไทย — ตัดคำบอกประเภทกิจการก่อน">
          <Avatar name="บริษัท ไทยโรสเตอร์ จำกัด" size="lg" />
          <Avatar name="ห้างหุ้นส่วนจำกัด สมชายการค้า" size="lg" />
          <Avatar name="กำแพงเพชรอาหารสัตว์" size="lg" />
          <Avatar name="ห้างทองไทยเจริญ" size="lg" />
          <Avatar name="Thai Roaster Co." size="lg" />
        </Row>
        <Row label="ทางถอย">
          <Avatar src={PX} name="มีรูป" size="lg" />
          <Avatar src="/broken.png" name="รูปพัง ใช้ตัวย่อ" size="lg" />
          <Avatar size="lg" />
        </Row>
        <Row label="status (ต้องไม่ถูกตัด)">
          <Avatar
            name="ไทยโรสเตอร์"
            size="lg"
            status={<Dot variant="success" label="ยืนยันตัวตนแล้ว" />}
          />
        </Row>
      </Specimen>

      <Specimen name="Token / RemovableChip / ChipRow">
        <Row label="Token">
          <Token label="ทั้งหมด" />
          <Token label="อาหารแปรรูป" isSelected />
          <Token label="ภาคเหนือ" icon="map-pin" />
        </Row>
        <Row label="ChipRow + RemovableChip">
          <ChipRow label="ตัวกรองที่ใช้อยู่">
            {chips.map((c) => (
              <RemovableChip key={c} label={`ลบตัวกรอง ${c}`} onRemove={() => setChips((p) => p.filter((x) => x !== c))}>
                {c}
              </RemovableChip>
            ))}
          </ChipRow>
        </Row>
      </Specimen>

      <Specimen name="Collapsible">
        <Collapsible>
          <AccordionItem id="a" title="เอกสารที่ต้องเตรียม">
            <p className="text-body">สำเนาหนังสือรับรองนิติบุคคล · ภ.พ.20 · งบการเงินปีล่าสุด</p>
          </AccordionItem>
          <AccordionItem id="b" title="ระยะเวลาพิจารณา">
            <p className="text-body">ประมาณ 15 วันทำการนับจากวันที่เอกสารครบถ้วน</p>
          </AccordionItem>
        </Collapsible>
      </Specimen>

      <Specimen name="DescriptionList" note="stacked · inline · divided · numeric">
        <Stack gap="5">
          <DescriptionList
            layout="inline"
            divided
            items={[
              { label: 'เลขทะเบียนนิติบุคคล', value: '0105558012345' },
              { label: 'ทุนจดทะเบียน', value: '5,000,000 บาท', numeric: true },
              { label: 'ที่ตั้ง', value: 'อ.สันทราย จ.เชียงใหม่' },
            ]}
          />
        </Stack>
      </Specimen>

      <Specimen name="ImageGallery" note="ภาพหลัก + thumbnail · คีย์บอร์ดใช้ได้">
        <div className="max-w-sm">
          <ImageGallery
            itemName="เครื่องคั่วกาแฟ TR-500"
            images={[
              { src: `${PX}#1`, alt: 'เครื่องคั่วกาแฟ TR-500 ด้านหน้า' },
              { src: `${PX}#2`, alt: 'ด้านข้าง' },
              { src: `${PX}#3`, alt: 'แผงควบคุม' },
            ]}
          />
        </div>
      </Specimen>
    </Group>
  );
}

/* ── หมวด 4 · Feedback ────────────────────────────────────────────────────── */

function Feedback() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <Group id="feedback" title="4 · Feedback">
      <Specimen name="Banner" note="4 tone · action · dismiss · isLive">
        <Stack gap="3">
          <Banner tone="info" title="ระบบจะปิดปรับปรุง">วันอาทิตย์ที่ 3 ส.ค. เวลา 01:00–03:00 น.</Banner>
          <Banner tone="success" title="ยืนยันตัวตนสำเร็จ" />
          <Banner tone="warning" title="ใกล้ครบกำหนดชำระ" action={<Button size="sm" variant="secondary">ชำระเงิน</Button>}>
            ครบกำหนดวันที่ 31 ก.ค. 2569
          </Banner>
          {!dismissed && (
            <Banner tone="danger" title="อัปโหลดเอกสารไม่สำเร็จ" onDismiss={() => setDismissed(true)}>
              ไฟล์มีขนาดเกิน 5 MB — ลองบีบอัดแล้วอัปโหลดใหม่
            </Banner>
          )}
        </Stack>
      </Specimen>

      <Specimen name="ProgressBar" note="format · tone · ค่าไม่ทราบ (indeterminate)">
        <Stack gap="4">
          <ProgressBar label="ความคืบหน้าโปรไฟล์" value={72} />
          <ProgressBar label="ยอดระดมทุน" value={3_200_000} maxValue={5_000_000} format="ratio" unit="บาท" tone="success" note="เหลืออีก 12 วัน" />
          <ProgressBar label="พื้นที่ใช้งาน" value={92} tone="danger" size="sm" />
          <ProgressBar label="กำลังอัปโหลด" value={null} />
        </Stack>
      </Specimen>

      <Specimen name="Skeleton" note="shape text · card · circle · media">
        <Stack gap="3">
          <HStack gap="3" align="center">
            <Skeleton shape="circle" width="3rem" className="h-12" />
            <div className="grid flex-1 gap-2">
              <Skeleton lines="title" width="60%" />
              <SkeletonText lines={2} />
            </div>
          </HStack>
          <Skeleton shape="media" className="h-32" />
        </Stack>
      </Specimen>

      <Specimen name="Spinner" note="การกระทำที่รอผลโดยไม่รู้เวลา — คนละเขตกับ Skeleton (§8.5)">
        <Row label="size">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </Row>
        <Row label="shade">
          <Spinner shade="default" />
          <Spinner shade="subtle" />
          <span className="inline-flex rounded-(--radius-control) bg-primary-600 p-2">
            <Spinner shade="onMedia" />
          </span>
          <span className="inline-flex text-danger-icon">
            <Spinner shade="inherit" />
          </span>
        </Row>
        <Row label="label (เห็นได้)">
          <Spinner size="lg" label="กำลังยืนยันการชำระเงิน" />
        </Row>
      </Specimen>

      <Specimen name="Dialog" note="modal · sheet · drawer">
        <Row label="variant">
          <DialogTrigger>
            <Button variant="secondary">เปิด modal</Button>
            <Dialog title="ยืนยันการลบรายการ" footer={<HStack gap="2" justify="end"><Button variant="ghost" slot="close">ยกเลิก</Button><Button variant="danger">ลบ</Button></HStack>}>
              <p className="text-body">รายการนี้จะถูกลบถาวรและกู้คืนไม่ได้</p>
            </Dialog>
          </DialogTrigger>
        </Row>
      </Specimen>

      <Specimen name="Tooltip">
        <Row label="hover / focus">
          <TooltipTrigger>
            <IconButton name="more-vertical" label="ตัวเลือกเพิ่มเติม" />
            <Tooltip content="ตัวเลือกเพิ่มเติม" />
          </TooltipTrigger>
        </Row>
      </Specimen>

      <Specimen name="Toast" note="ToastRegion อยู่ท้ายหน้า · เคารพ --bottom-inset">
        <Row label="tone">
          <Button variant="secondary" onPress={() => showToast({ title: 'เพิ่มลงตะกร้าแล้ว', tone: 'success' })}>success</Button>
          <Button variant="secondary" onPress={() => showToast({ title: 'บันทึกฉบับร่างแล้ว', tone: 'info' })}>info</Button>
        </Row>
      </Specimen>
    </Group>
  );
}

/* ── หมวด 5 · Marketplace ─────────────────────────────────────────────────── */

const CERTS = [
  { id: 'gmp', name: 'GMP', isVerified: true, expiresAt: '2027-03-31' },
  { id: 'halal', name: 'ฮาลาล', isVerified: true },
  { id: 'iso', name: 'ISO 9001', isVerified: false },
];

function Marketplace() {
  const [compare, setCompare] = useState([
    { id: '1', name: 'เครื่องคั่วกาแฟ TR-500' },
    { id: '2', name: 'เครื่องคั่วกาแฟ HB-200' },
  ]);
  const [pay, setPay] = useState<'promptpay' | 'transfer' | 'credit-term' | 'card'>('promptpay');
  const [cartOpen, setCartOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [qty, setQty] = useState(2);

  return (
    <Group id="marketplace" title="5 · Marketplace">
      <Specimen name="EntityCard" note="ฐานร่วมของการ์ดทุกใบ — media · eyebrow · meta · amount · footer · actions">
        <div className="max-w-sm">
          <EntityCard
            href="#"
            title="เครื่องคั่วกาแฟ TR-500"
            media={<Thumb />}
            eyebrow={<Badge variant="accent" label="แนะนำ" />}
            meta={<EntityMeta items={[{ label: 'ผู้ขาย', value: 'ดอยคำโรสเตอร์' }, { label: 'จังหวัด', value: 'เชียงใหม่' }]} />}
            amount={<EntityAmount label="ราคา" value={1_250_000} unit="เครื่อง" />}
            footer={<span className="text-caption text-fg-muted">พร้อมส่ง 4 เครื่อง</span>}
          />
        </div>
      </Specimen>

      <Specimen name="การ์ด 7 ชนิด" note="ProductCard · ServiceCard · ProgramCard · GrantCard · FundingCard · TrainingCard · BusinessCard" wide>
        <Grid preset="cards">
          <ProductCard href="#" name="เครื่องคั่วกาแฟ TR-500" price={1_250_000} unit="เครื่อง" moq={1}
            sellerName="ดอยคำโรสเตอร์" inStock certifications={['GMP']} media={<Thumb />} />
          <ServiceCard href="#" name="ออกแบบบรรจุภัณฑ์อาหารส่งออก" pricingModel="quote"
            leadTime="14 วัน" sellerName="สตูดิโอกล่องดี" media={<Thumb />} />
          <ProgramCard href="#" name="โครงการยกระดับ SME สู่ตลาดสากล" agency="สสว."
            eligibility="นิติบุคคลจดทะเบียนไม่น้อยกว่า 1 ปี" deadline="2026-09-30" status="open" daysLeft={64} />
          <GrantCard href="#" name="ทุนพัฒนาผลิตภัณฑ์ใหม่" agency="สสว." fundingCeiling={500_000}
            coPaymentPercent={50} deadline="2026-08-15" status="closing-soon" daysLeft={19} />
          <FundingCard href="#" name="สินเชื่อ SME เสริมสภาพคล่อง" agency="ธพว." loanCeiling={5_000_000}
            interestRate={4.5} termMonths={84} collateral="bsy" gracePeriodMonths={12}
            deadline="2026-12-31" status="open" />
          <TrainingCard href="#" name="อบรมมาตรฐาน GMP สำหรับโรงงานอาหาร" organizer="สถาบันอาหาร"
            format="hybrid" startDate="2026-08-20" endDate="2026-08-21" fee={3_500} seatsLeft={6} seatsLow />
          <BusinessCard href="#" name="ดอยคำโรสเตอร์ จำกัด" isVerified category="อาหารและเครื่องดื่ม"
            province="เชียงใหม่" employeeRange="10–49 คน" certifications={['GMP', 'ฮาลาล']}
            isRecommended matchReason="ตรงกับหมวดที่คุณดูบ่อย" media={<Thumb />} />
        </Grid>
      </Specimen>

      <Specimen name="Deadline" note="DeadlineBadge · DeadlineText">
        <Row label="status">
          <DeadlineBadge status="open" />
          <DeadlineBadge status="closing-soon" daysLeft={5} />
          <DeadlineBadge status="closed" />
        </Row>
        <Row label="DeadlineText">
          <DeadlineText date="2026-09-30" />
          <DeadlineText date="2026-09-30" format="long" />
        </Row>
      </Specimen>

      <Specimen name="CategoryNav / CategoryBreadcrumb" wide>
        <Stack gap="4">
          <CategoryBreadcrumb items={[{ name: 'หน้าแรก', href: '#' }, { name: 'อาหารแปรรูป', href: '#' }, { name: 'เครื่องคั่วกาแฟ' }]} />
          <CategoryNav
            currentId="c2"
            items={[
              { id: 'c1', name: 'เกษตรแปรรูป', href: '#', count: 128 },
              { id: 'c2', name: 'อาหารและเครื่องดื่ม', href: '#', count: 342 },
              { id: 'c3', name: 'สิ่งทอ', href: '#', count: 87 },
              { id: 'c4', name: 'เครื่องจักร', href: '#', count: 54 },
            ]}
          />
        </Stack>
      </Specimen>

      <Specimen name="FilterPanel / FilterChipRow" note="accordion ต่อกลุ่ม + แถบตัวกรองที่ใช้อยู่">
        <Stack gap="4">
          <FilterChipRow
            filters={[{ id: 'f1', label: 'GMP' }, { id: 'f2', label: 'เชียงใหม่' }]}
            onRemove={() => {}}
            onClearAll={() => {}}
          />
          <FilterPanel
            onClearAll={() => {}}
            defaultExpandedKeys={['g1']}
            groups={[
              { id: 'g1', title: 'มาตรฐาน', children: (
                <CheckboxGroup label="มาตรฐาน" className="[&>*:first-child]:sr-only">
                  <CheckboxInput value="gmp" label="GMP" /><CheckboxInput value="haccp" label="HACCP" />
                </CheckboxGroup>
              ) },
              { id: 'g2', title: 'ราคา', children: <span className="text-body">ช่วงราคา…</span> },
            ]}
          />
        </Stack>
      </Specimen>

      <Specimen name="SearchResult" note="ครอบผลลัพธ์ — นับจำนวน · loading · ว่างเปล่า" wide>
        <Stack gap="6">
          <SearchResult count={2} query="เครื่องคั่วกาแฟ" toolbar={<Selector label="เรียงตาม" options={[{ id: 'rel', label: 'ตรงที่สุด' }, { id: 'new', label: 'ใหม่ล่าสุด' }]} defaultSelectedKey="rel" />}>
            <Grid preset="cards">
              <ProductCard href="#" name="เครื่องคั่วกาแฟ TR-500" price={1_250_000} sellerName="ดอยคำ" as="li" media={<Thumb />} />
              <ProductCard href="#" name="เครื่องคั่วกาแฟ HB-200" price={880_000} sellerName="ฮิลล์บีน" as="li" media={<Thumb />} />
            </Grid>
          </SearchResult>
          <SearchResult count={0} query="เครื่องอัดเม็ดพลาสติก" emptyAction={<Button variant="secondary">ล้างตัวกรอง</Button>} />
        </Stack>
      </Specimen>

      <Specimen name="BuyBox" note="สินค้า (มีจำนวน + ตะกร้า) · บริการ (ขอใบเสนอราคา)">
        <Stack gap="4">
          <BuyBox kind="product" name="เครื่องคั่วกาแฟ TR-500" price={1_250_000} unit="เครื่อง" stock={4} moq={1}
            onAddToCart={() => { showToast({ title: 'เพิ่มลงตะกร้าแล้ว', tone: 'success' }); setCartOpen(true); }} />
          <BuyBox kind="service" name="ออกแบบบรรจุภัณฑ์" price={null} priceNote="ประเมินตามขอบเขตงาน" onContact={() => {}} />
        </Stack>
      </Specimen>

      <Specimen name="Cart" note="CartList › CartSellerGroup › CartLineItem · CartDrawer">
        <Stack gap="4">
          <CartList itemCount={2} sellerCount={1}>
            <CartSellerGroup sellerName="ดอยคำโรสเตอร์" subtotal={2_500_000} onCheckout={() => {}}>
              <CartLineItem href="#" name="เครื่องคั่วกาแฟ TR-500" unitPrice={1_250_000} unit="เครื่อง"
                quantity={qty} onQuantityChange={setQty} onRemove={() => {}} media={<Thumb />} />
            </CartSellerGroup>
          </CartList>
          <Button variant="secondary" onPress={() => setCartOpen(true)}>เปิด CartDrawer</Button>
          <CartDrawer isOpen={cartOpen} onOpenChange={setCartOpen} fullCartHref="#">
            <CartList itemCount={1} sellerCount={1}>
              <CartSellerGroup sellerName="ดอยคำโรสเตอร์" subtotal={1_250_000}>
                <CartLineItem href="#" name="เครื่องคั่วกาแฟ TR-500" unitPrice={1_250_000}
                  quantity={1} onQuantityChange={() => {}} onRemove={() => {}} compact />
              </CartSellerGroup>
            </CartList>
          </CartDrawer>
        </Stack>
      </Specimen>

      <Specimen name="Checkout" note="CheckoutStepper · CheckoutSummary">
        <Stack gap="5">
          <CheckoutStepper currentIndex={1} steps={[{ id: '1', label: 'ตะกร้า' }, { id: '2', label: 'ที่อยู่จัดส่ง' }, { id: '3', label: 'ชำระเงิน' }]} />
          <CheckoutSummary itemCount={2} subtotal={2_500_000} vat={175_000} shipping={0} total={2_675_000}
            onSubmit={() => {}} submitLabel="ไปหน้าชำระเงิน" />
        </Stack>
      </Specimen>

      <Specimen name="Payment" note="PaymentMethodSelect · PromptPayQR · SlipUpload">
        <Stack gap="5">
          <PaymentMethodSelect value={pay} onChange={setPay} disabledMethods={['credit-term']} />
          <PromptPayQR qrSrc={PX} amount={2_675_000} reference="SMEGO-2026-000481" />
          <SlipUpload onSelect={() => {}} />
        </Stack>
      </Specimen>

      <Specimen name="OrderTimeline">
        <OrderTimeline steps={[
          { id: '1', label: 'รับคำสั่งซื้อ', date: '2026-07-20', status: 'done' },
          { id: '2', label: 'ชำระเงินแล้ว', date: '2026-07-21', status: 'done', documentHref: '#', documentName: 'ใบเสร็จรับเงิน' },
          { id: '3', label: 'กำลังจัดส่ง', date: '2026-07-25', status: 'current', note: 'เลขพัสดุ TH1234567890' },
          { id: '4', label: 'ได้รับสินค้า', status: 'pending' },
        ]} />
      </Specimen>

      <Specimen name="Wishlist" note="SaveButton · WishlistHeader · WishlistGrid" wide>
        <Stack gap="4">
          <Row label="SaveButton">
            <SaveButton itemName="เครื่องคั่วกาแฟ TR-500" />
            <SaveButton itemName="เครื่องคั่วกาแฟ TR-500" variant="full" defaultSaved />
          </Row>
          <WishlistHeader count={2} onClearAll={() => {}} />
          <WishlistGrid count={2}>
            <ProductCard href="#" name="เครื่องคั่วกาแฟ TR-500" price={1_250_000} sellerName="ดอยคำ" as="li" media={<Thumb />} />
            <ProductCard href="#" name="เครื่องบดกาแฟ G-90" price={62_000} sellerName="ฮิลล์บีน" as="li" media={<Thumb />} />
          </WishlistGrid>
        </Stack>
      </Specimen>

      <Specimen name="SellerProfile / CertificationBadge">
        <Stack gap="4">
          <Row label="CertificationBadge">
            {CERTS.map((c) => <CertificationBadge key={c.id} certification={c} />)}
          </Row>
          <SellerProfile
            name="ดอยคำโรสเตอร์ จำกัด"
            registrationNumber="0505558001234"
            isVerified
            isVatRegistered
            taxId="0505558001234"
            canIssueETax
            location="อ.สันทราย จ.เชียงใหม่"
            memberSinceYear={2562}
            responseTime="ตอบกลับภายใน 2 ชั่วโมง"
            certifications={CERTS}
            actions={<Button size="sm" variant="secondary">ติดต่อผู้ขาย</Button>}
          />
        </Stack>
      </Specimen>

      <Specimen name="Compare" note="CompareBar ยึดล่างจอ (ใช้ --bottom-inset) · CompareTable" wide>
        <Stack gap="5">
          <CompareTable
            items={compare}
            onRemove={(id) => setCompare((p) => p.filter((i) => i.id !== id))}
            rows={[
              { label: 'ราคา', values: ['฿1,250,000', '฿880,000'] },
              { label: 'กำลังผลิต', values: ['5 กก./ชม.', '2 กก./ชม.'] },
              { label: 'รับประกัน', values: ['2 ปี', '1 ปี'] },
            ]}
          />
          {/* CompareBar ยึดล่างจอจริง — ให้กดเปิด/ปิดเอง จะได้ไม่บังหน้าอื่นตลอดเวลา */}
          <Switch isSelected={showBar} onChange={setShowBar} label="แสดง CompareBar (ยึดล่างจอ)" />
          {showBar && (
            <CompareBar
              items={compare}
              onRemove={(id) => setCompare((p) => p.filter((i) => i.id !== id))}
              onClearAll={() => { setCompare([]); setShowBar(false); }}
              onOpen={() => {}}
            />
          )}
        </Stack>
      </Specimen>
    </Group>
  );
}

/* ── หมวด 6 · Navigation ──────────────────────────────────────────────────── */

function Navigation() {
  const [tab, setTab] = useState('detail');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(3);

  return (
    <Group id="navigation" title="6 · Navigation">
      <Specimen name="TabList" note="สลับ panel คนละชุด — panel ที่ไม่ได้เลือกไม่อยู่ใน DOM" wide>
        <TabList value={tab} onChange={setTab} label="ข้อมูลสินค้า" hasDivider>
          <Tab value="detail" label="รายละเอียด" />
          <Tab value="spec" label="สเปก" />
          <Tab value="review" label="รีวิว" endContent={<Badge label="12" />} />
          <TabPanel value="detail">เครื่องคั่วกาแฟขนาด 5 กิโลกรัม สำหรับร้านกาแฟขนาดกลาง</TabPanel>
          <TabPanel value="spec">กำลังไฟ 3,500 วัตต์ · ความจุถัง 5 กก. · ใช้ไฟ 220V</TabPanel>
          <TabPanel value="review">ยังไม่มีรีวิวสำหรับสินค้านี้</TabPanel>
        </TabList>
      </Specimen>

      <Specimen name="SegmentedControl" note="สลับมุมมองของเนื้อหาเดิม — radiogroup ไม่ใช่ tablist">
        <Row label="hug">
          <SegmentedControl value={view} onChange={setView} label="รูปแบบการแสดงผล">
            <SegmentedControlItem value="grid" label="ตาราง" icon={<Icon name="layout-grid" size={20} />} />
            <SegmentedControlItem value="list" label="รายการ" icon={<Icon name="list" size={20} />} />
          </SegmentedControl>
        </Row>
        <Row label="fill + ไอคอนล้วน">
          <div className="w-full max-w-sm">
            <SegmentedControl value={view} onChange={setView} label="รูปแบบการแสดงผล" layout="fill">
              <SegmentedControlItem value="grid" label="ตาราง" isLabelHidden icon={<Icon name="layout-grid" size={20} />} />
              <SegmentedControlItem value="list" label="รายการ" isLabelHidden icon={<Icon name="list" size={20} />} />
            </SegmentedControl>
          </div>
        </Row>
      </Specimen>

      <Specimen name="Pagination" note="ปุ่ม 44px (ไม่ใช่ 32 ของ Astryx) · ชื่อปุ่มเป็น &quot;หน้า 3&quot;" wide>
        <Row label="pages">
          <Pagination page={page} totalPages={12} onChange={setPage} label="การแบ่งหน้า ตัวอย่าง" />
        </Row>
        <Row label="count">
          <Pagination page={page} totalItems={240} pageSize={20} variant="count" onChange={setPage} label="การแบ่งหน้า แบบนับ" />
        </Row>
        <Row label="compact (จอแคบ)">
          <Pagination page={page} totalPages={12} variant="compact" onChange={setPage} label="การแบ่งหน้า แบบกระชับ" />
        </Row>
      </Specimen>

      <Specimen name="TopNav" note="sticky จริงอยู่บนสุดของหน้านี้แล้ว — นี่คือสำเนาแบบอยู่กับที่" wide>
        <div className="relative">
          <TopNav
            homeHref="#"
            cartCount={3}
            onOpenCart={() => {}}
            signInHref="#"
            search={<SearchField label="ค้นหาสินค้าและบริการ" labelHidden placeholder="ค้นหาสินค้าและบริการ" />}
            className="!static"
          />
        </div>
      </Specimen>

      <Specimen
        name="BottomNav"
        note="มือถือเท่านั้น (md:hidden) — ที่นี่ปลด fixed เพื่อให้เห็น · reserveSpace ปิดไว้เพราะไม่ได้ยึดจอจริง"
        wide
      >
        <div className="relative max-w-sm overflow-hidden rounded-(--radius-container) border border-edge">
          <BottomNav
            reserveSpace={false}
            label="เมนูหลัก ตัวอย่าง"
            className="!static !block"
            items={[
              { label: 'หน้าแรก', icon: 'layout-grid', href: '#', isCurrent: true },
              { label: 'ค้นหา', icon: 'search', href: '#s' },
              { label: 'ตะกร้า', icon: 'shopping-cart', href: '#c', count: 3 },
              { label: 'รายการโปรด', icon: 'heart', href: '#w' },
              { label: 'บัญชี', icon: 'building', href: '#a' },
            ]}
          />
        </div>
      </Specimen>
    </Group>
  );
}

/* ── สารบัญ + สลับธีม ─────────────────────────────────────────────────────── */

const NAV: { id: string; label: string }[] = [
  { id: 'foundations', label: '1 · Foundations' },
  { id: 'inputs', label: '2 · Inputs' },
  { id: 'data-display', label: '3 · Data display' },
  { id: 'feedback', label: '4 · Feedback' },
  { id: 'marketplace', label: '5 · Marketplace' },
  { id: 'navigation', label: '6 · Navigation' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <Switch
      isSelected={dark}
      onChange={(v) => {
        setDark(v);
        document.documentElement.dataset.theme = v ? 'dark' : 'light';
      }}
      label="โหมดมืด"
    />
  );
}

function App() {
  return (
    <SmeGoProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-(--z-modal) focus:m-2 focus:rounded-(--radius-control) focus:bg-surface focus:p-3">
        ข้ามไปเนื้อหาหลัก
      </a>

      <header className="sticky top-0 z-(--z-sticky) border-b border-edge bg-surface/95 backdrop-blur">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="text-h4 text-fg">SME.GO Component Library</p>
              <p className="text-caption text-fg-muted">@smego/ui · React Aria + Tailwind v4 · WCAG 2.2 AA</p>
            </div>
            <ThemeToggle />
          </div>
          <nav aria-label="สารบัญ" className="flex flex-wrap gap-2 pb-3">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}
                className="rounded-(--radius-control) border border-edge px-3 py-1.5 text-caption text-fg-secondary hover:bg-sunken">
                {n.label}
              </a>
            ))}
          </nav>
        </Container>
      </header>

      <main id="main" className="py-8">
        <Container size="wide">
          <Stack gap="10">
            <Foundations />
            <Inputs />
            <DataDisplay />
            <Feedback />
            <Marketplace />
            <Navigation />
          </Stack>
        </Container>
      </main>

      <ToastRegion />
    </SmeGoProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
