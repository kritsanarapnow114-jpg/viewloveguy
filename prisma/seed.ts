import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { username: "admin", password: "1234", name: "สมชาย ผู้ดูแล", role: "ADMIN" },
      { username: "staff", password: "1234", name: "มานี พนักงาน", role: "STAFF" },
    ],
  });

  // Opening balances are backed out so that, after the seed transactions below
  // are applied, each account lands on the same balance as the original design mock.
  const a1 = await prisma.account.create({
    data: { name: "ธนาคารกสิกรไทย", type: "BANK", number: "xxx-x-x1234-x", openingBalance: 478300 },
  });
  const a2 = await prisma.account.create({
    data: { name: "ธนาคารไทยพาณิชย์", type: "BANK", number: "xxx-x-x7788-x", openingBalance: 115200 },
  });
  const a3 = await prisma.account.create({
    data: { name: "เงินสดในมือ", type: "CASH", number: "ลิ้นชักหน้าร้าน", openingBalance: 32400 },
  });

  await prisma.transaction.createMany({
    data: [
      { kind: "INCOME", date: new Date("2026-07-10"), category: "ดอกเบี้ยเงินกู้", accountId: a1.id, amount: 12000, note: "ดอกเบี้ยรับ - คุณวิชัย" },
      { kind: "INCOME", date: new Date("2026-07-06"), category: "รับชำระหนี้", accountId: a1.id, amount: 50000, note: "รับคืนเงินต้น - คุณสมหญิง" },
      { kind: "INCOME", date: new Date("2026-07-02"), category: "เงินเดือน/รายได้", accountId: a2.id, amount: 45000, note: "รายได้กิจการ" },
      { kind: "INCOME", date: new Date("2026-06-24"), category: "ขายสินค้า", accountId: a3.id, amount: 8600, note: "ขายหน้าร้าน" },
      { kind: "INCOME", date: new Date("2026-06-11"), category: "ดอกเบี้ยเงินกู้", accountId: a1.id, amount: 9500, note: "ดอกเบี้ยรับ - คุณอนันต์" },
      { kind: "INCOME", date: new Date("2026-05-15"), category: "รายได้อื่นๆ", accountId: a2.id, amount: 15000, note: "เงินปันผล" },
      { kind: "INCOME", date: new Date("2026-04-20"), category: "เงินเดือน/รายได้", accountId: a2.id, amount: 45000, note: "รายได้กิจการ" },

      { kind: "EXPENSE", date: new Date("2026-07-09"), category: "ค่าเช่า/สาธารณูปโภค", accountId: a1.id, amount: 18500, note: "ค่าเช่าสำนักงาน" },
      { kind: "EXPENSE", date: new Date("2026-07-05"), category: "ปล่อยเงินกู้", accountId: a1.id, amount: 80000, note: "ปล่อยกู้ - คุณประเสริฐ" },
      { kind: "EXPENSE", date: new Date("2026-07-01"), category: "เงินเดือนพนักงาน", accountId: a2.id, amount: 32000, note: "เงินเดือน ก.ค." },
      { kind: "EXPENSE", date: new Date("2026-06-18"), category: "ซื้อสินค้า", accountId: a3.id, amount: 6200, note: "วัสดุสิ้นเปลือง" },
      { kind: "EXPENSE", date: new Date("2026-06-08"), category: "ค่าใช้จ่ายอื่นๆ", accountId: a1.id, amount: 4300, note: "ค่าน้ำมันรถ" },
      { kind: "EXPENSE", date: new Date("2026-05-28"), category: "ค่าเช่า/สาธารณูปโภค", accountId: a1.id, amount: 18500, note: "ค่าเช่าสำนักงาน" },
      { kind: "EXPENSE", date: new Date("2026-04-12"), category: "เงินเดือนพนักงาน", accountId: a2.id, amount: 32000, note: "เงินเดือน เม.ย." },
    ],
  });

  await prisma.loan.createMany({
    data: [
      { borrower: "คุณวิชัย รุ่งเรือง", borrowDate: new Date("2026-06-01"), amount: 100000, interest: 6000, dueDate: new Date("2026-07-01"), penalty: 200, paid: false },
      { borrower: "คุณสมหญิง ใจดี", borrowDate: new Date("2026-06-20"), amount: 50000, interest: 3000, dueDate: new Date("2026-07-15"), penalty: 150, paid: false },
      { borrower: "คุณอนันต์ พานิช", borrowDate: new Date("2026-07-02"), amount: 80000, interest: 5000, dueDate: new Date("2026-08-02"), penalty: 200, paid: false },
      { borrower: "คุณประเสริฐ มั่งมี", borrowDate: new Date("2026-07-05"), amount: 80000, interest: 4800, dueDate: new Date("2026-08-05"), penalty: 250, paid: false },
      { borrower: "คุณดวงใจ ทองแท้", borrowDate: new Date("2026-05-10"), amount: 40000, interest: 2400, dueDate: new Date("2026-06-10"), penalty: 100, paid: true, paidDate: new Date("2026-06-09") },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
