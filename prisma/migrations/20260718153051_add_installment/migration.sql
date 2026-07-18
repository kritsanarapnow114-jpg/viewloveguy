-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "months" INTEGER NOT NULL,
    "monthlyAmount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "paidMonths" INTEGER NOT NULL DEFAULT 0,
    "paymentTransactionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);
