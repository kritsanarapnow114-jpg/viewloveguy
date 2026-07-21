-- Optional field: date the borrower told us they'd repay by. Purely informational
-- for reminders — late fee calculation always stays keyed off the original dueDate.
ALTER TABLE "Loan" ADD COLUMN "promisedReturnDate" TIMESTAMP(3);
