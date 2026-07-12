-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "inAccountId" TEXT,
ADD COLUMN     "inTransactionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "outAccountId" TEXT,
ADD COLUMN     "outTransactionId" TEXT;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_outAccountId_fkey" FOREIGN KEY ("outAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_inAccountId_fkey" FOREIGN KEY ("inAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
