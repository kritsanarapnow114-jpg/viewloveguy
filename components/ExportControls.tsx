"use client";

import { ExportButtons } from "./PageHeader";
import { useToast } from "./ToastProvider";

export function ExportControls() {
  const { showToast } = useToast();
  return (
    <ExportButtons
      onExportPdf={() => showToast("กำลังส่งออกรายงาน PDF…")}
      onExportXls={() => showToast("กำลังส่งออกไฟล์ Excel…")}
    />
  );
}
