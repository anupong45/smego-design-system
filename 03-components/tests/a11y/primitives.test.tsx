import { describe, it, expect } from 'vitest';
import { render, expectNoViolations } from './render';

import {
  Button, IconButton, Link, Icon,
  Card, CardMedia, Badge, Dot, Token, RemovableChip, ChipRow,
  Skeleton, SkeletonGroup, SkeletonText,
  TextInput, TextArea, CheckboxInput, CheckboxGroup, Radio, RadioList, Slider,
  Collapsible, AccordionItem, Tooltip, TooltipTrigger,
  Dialog, DialogOverlay, DialogTrigger,
  Stack, VStack, HStack, Grid, Container, Section, Divider,
} from '../../src/index';

/* ═══════════════════════════════════════════════════════════════════════════
   Pass A · 18 primitive — axe ต่อ component
   ───────────────────────────────────────────────────────────────────────────
   ทุกเคสใช้**ข้อความไทยจริง** ไม่ใช่ lorem ipsum เพราะข้อความไทยยาวกว่า
   อังกฤษ 20–40% และปัญหา layout จะไม่โผล่ถ้าทดสอบด้วยข้อความสั้น
   ═══════════════════════════════════════════════════════════════════════════ */

/** เคสละหนึ่งรายการ — [ชื่อ, element] */
const cases: [string, React.ReactElement][] = [
  ['Button · primary', <Button>ยื่นคำขอสินเชื่อ</Button>],
  ['Button · loading', <Button isLoading>ยื่นคำขอสินเชื่อ</Button>],
  ['Button · disabled', <Button isDisabled>ยื่นคำขอสินเชื่อ</Button>],
  ['Button · accent', <Button variant="accent" icon="banknote">ยื่นคำขอทุน</Button>],

  ['IconButton', <IconButton name="search" label="ค้นหา" variant="solid" />],
  ['Link', <Link href="/programs">ดูรายละเอียดโครงการ</Link>],
  ['Link · external', <Link href="https://sme.go.th" external target="_blank">เว็บไซต์ สสว.</Link>],
  ['Icon', <Icon name="shield-check" size={20} label="ยืนยันแล้ว" />],

  [
    'Card',
    <Card as="article" interactive>
      <CardMedia>
        <img src="/x.jpg" alt="" className="aspect-4/3 w-full" />
      </CardMedia>
      <h3>เครื่องคั่วกาแฟ 5 กก.</h3>
    </Card>,
  ],

  ['Badge · success', <Badge variant="success">อนุมัติแล้ว</Badge>],
  ['Badge · warning', <Badge variant="warning">ใกล้ปิดรับ</Badge>],
  ['Dot', <Dot variant="success" label="ตอบกลับภายใน 1 ชั่วโมง" />],

  ['Token', <Token label="มีใบรับรอง" defaultSelected icon="check" />],
  [
    'ChipRow · removable',
    <ChipRow label="ตัวกรองที่เลือก">
      <RemovableChip label="ผู้ผลิต: กรุงเทพฯ" onRemove={() => {}}>
        ผู้ผลิต: กรุงเทพฯ
      </RemovableChip>
    </ChipRow>,
  ],

  [
    'Skeleton',
    <SkeletonGroup isLoading label="กำลังโหลดรายการสินค้า">
      <Skeleton shape="media" lines="none" className="h-24" />
      <SkeletonText lines={2} size="body-sm" />
    </SkeletonGroup>,
  ],

  [
    'TextInput',
    <TextInput
      label="เลขทะเบียนนิติบุคคล"
      description="ตัวเลข 13 หลักจากหนังสือรับรอง DBD"
      placeholder="0105561234567"
    />,
  ],
  [
    'TextInput · invalid',
    <TextInput
      label="เลขทะเบียนนิติบุคคล"
      status={{
        type: 'error',
        message:
          'เลขนิติบุคคลไม่ถูกต้อง — ต้องเป็นตัวเลข 13 หลัก ตรวจสอบได้จากหนังสือรับรองนิติบุคคล',
      }}
    />,
  ],
  [
    /* warning ต้องไม่ตั้ง aria-invalid — ช่องยังส่งฟอร์มได้ (fieldStyles.ts) */
    'TextInput · warning',
    <TextInput
      label="วันปิดรับสมัคร"
      status={{ type: 'warning', message: 'เหลือเวลาอีก 2 วัน' }}
    />,
  ],
  ['TextArea', <TextArea label="รายละเอียดธุรกิจ" rows={3} isOptional />],

  [
    'CheckboxGroup',
    <CheckboxGroup label="ใบรับรองที่มี" description="เลือกได้มากกว่าหนึ่ง">
      <CheckboxInput value="tis" label="มาตรฐานผลิตภัณฑ์อุตสาหกรรม" />
      <CheckboxInput value="halal" label="ฮาลาล" description="สำหรับสินค้าอาหารและเครื่องดื่ม" />
    </CheckboxGroup>,
  ],
  [
    'CheckboxInput · label ซ่อนด้วยตา',
    <CheckboxInput label="เลือกสินค้าทั้งหมดในหน้านี้" isLabelHidden isIndeterminate />,
  ],

  [
    'RadioList · card',
    <RadioList label="วิธีชำระเงิน" defaultValue="promptpay">
      <Radio value="promptpay" layout="card" description="สแกน QR ด้วยแอปธนาคาร">
        พร้อมเพย์
      </Radio>
      <Radio value="transfer" layout="card" description="โอนแล้วอัปโหลดสลิปเพื่อยืนยัน">
        โอนผ่านธนาคาร
      </Radio>
    </RadioList>,
  ],

  [
    'Slider',
    <Slider
      label="ช่วงราคา"
      value={[50_000, 2_000_000]}
      onChange={() => {}}
      min={0}
      max={5_000_000}
      step={10_000}
    />,
  ],

  [
    'Collapsible',
    <Collapsible allowsMultipleExpanded defaultExpandedKeys={["a"]}>
      <AccordionItem id="a" title="คุณสมบัติผู้สมัคร">
        <p>เป็นนิติบุคคลที่จดทะเบียนในประเทศไทย</p>
      </AccordionItem>
      <AccordionItem id="b" title="เอกสารที่ต้องใช้">
        <p>หนังสือรับรองนิติบุคคล</p>
      </AccordionItem>
    </Collapsible>,
  ],

  [
    'Layout',
    <Container size="content">
      <Section>
        <Grid preset="cards">
          <VStack gap="3">
            <h2>สินค้าจากผู้ผลิตไทย</h2>
            <Divider />
            <HStack gap="2" justify="between">
              <span>1,250,000</span>
              <span>บาท</span>
            </HStack>
          </VStack>
        </Grid>
      </Section>
    </Container>,
  ],

  [
    'Stack · ปุ่มคู่',
    <Stack direction="column-reverse" gap="3" className="md:flex-row md:justify-end">
      <Button variant="secondary">ยกเลิก</Button>
      <Button variant="primary">ยืนยัน</Button>
    </Stack>,
  ],
];

describe('Pass A · axe', () => {
  it.each(cases)('%s ไม่มี violation', async (_name, element) => {
    const { container } = render(element);
    const results = await expectNoViolations(container);
    expect(results).toHaveNoViolations();
  });
});

/* ── overlay ต้องเปิดก่อนถึงจะตรวจได้ ─────────────────────────────────────── */

describe('Pass A · overlay', () => {
  it('Dialog ที่เปิดอยู่ไม่มี violation', async () => {
    const { container } = render(
      <DialogTrigger defaultOpen>
        <Button variant="danger">ลบรายการนี้</Button>
        <DialogOverlay size="sm">
          <Dialog
            title="ยืนยันการลบรายการ"
            footer={
              <>
                <Button variant="secondary" slot="close">ยกเลิก</Button>
                <Button variant="danger">ลบถาวร</Button>
              </>
            }
          >
            <p>เครื่องคั่วกาแฟ 5 กก. จะถูกลบออกจากรายการสินค้าของคุณ</p>
          </Dialog>
        </DialogOverlay>
      </DialogTrigger>,
    );
    /* modal render ใน portal — ตรวจทั้ง body */
    const results = await expectNoViolations(document.body);
    expect(results).toHaveNoViolations();
    expect(container).toBeDefined();
  });

  it('TooltipTrigger ไม่มี violation ตอนปิด', async () => {
    const { container } = render(
      <TooltipTrigger delay={0}>
        <Button variant="secondary" icon="info">วงเงินสูงสุด</Button>
        <Tooltip content="เพดานที่ขอได้ ไม่ใช่จำนวนที่ได้รับจริง" />
      </TooltipTrigger>,
    );
    const results = await expectNoViolations(container);
    expect(results).toHaveNoViolations();
  });
});
