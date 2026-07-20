import { toPng } from "html-to-image";

export async function saveCardAsImage(el: HTMLElement, filename: string) {
  const dataUrl = await toPng(el, { pixelRatio: 2 });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
