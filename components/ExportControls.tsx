"use client";

import { ExportButtons } from "./PageHeader";
import { useToast } from "./ToastProvider";
import { exportRowsToXlsx } from "@/lib/exportXlsx";

export function ExportControls({
  rows,
  filename,
  sheetName,
}: {
  rows: Record<string, string | number>[];
  filename: string;
  sheetName?: string;
}) {
  const { showToast } = useToast();
  return (
    <ExportButtons
      onExportPdf={() => showToast("ยังไม่รองรับส่งออก PDF ในตอนนี้")}
      onExportXls={() => {
        if (rows.length === 0) {
          showToast("ไม่มีข้อมูลให้ส่งออกในช่วงที่เลือก");
          return;
        }
        exportRowsToXlsx(rows, filename, sheetName);
        showToast(`ส่งออกไฟล์ Excel แล้ว (${rows.length} รายการ)`);
      }}
    />
  );
}
