-- Add the new per-month schedule column
ALTER TABLE "Installment" ADD COLUMN "amounts" DOUBLE PRECISION[] NOT NULL DEFAULT '{}';

-- Backfill existing rows: reconstruct each row's per-month schedule from the
-- old flat monthlyAmount, with the last month absorbing the rounding
-- remainder (this matches the payment logic that was already live).
UPDATE "Installment"
SET "amounts" = (
  SELECT array_agg(
    CASE
      WHEN gs = "months" THEN round((("totalAmount" - "monthlyAmount" * ("months" - 1)))::numeric, 2)::float8
      ELSE "monthlyAmount"
    END
    ORDER BY gs
  )
  FROM generate_series(1, "months") AS gs
);

-- Drop the old flat column now that every row has a full schedule
ALTER TABLE "Installment" DROP COLUMN "monthlyAmount";
