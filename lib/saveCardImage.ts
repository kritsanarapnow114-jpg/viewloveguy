import { toBlob } from "html-to-image";

export async function saveCardAsImage(el: HTMLElement, filename: string) {
  const blob = await toBlob(el, { pixelRatio: 2 });
  if (!blob) throw new Error("สร้างรูปภาพไม่สำเร็จ");

  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      // fall through to download if sharing failed for another reason
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
