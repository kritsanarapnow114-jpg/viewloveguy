-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "inWalletId" TEXT,
ADD COLUMN     "outWalletId" TEXT,
ADD COLUMN     "transferImage2" TEXT;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_outWalletId_fkey" FOREIGN KEY ("outWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_inWalletId_fkey" FOREIGN KEY ("inWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
