/**
 * Extract only one requested PDF page at a time. No rendering or OCR.
 * Keep both item count and output text bounded to avoid accumulating a whole PDF in memory.
 */
export const MAX_TEXT_ITEMS_PER_PAGE = 12_000;
export const MAX_TEXT_CHARS_PER_PAGE = 40_000;

export async function extractPageText(
  page,
  options = {},
) {
  const maxItems = Math.max(1, Math.min(options.maxItems ?? MAX_TEXT_ITEMS_PER_PAGE, MAX_TEXT_ITEMS_PER_PAGE));
  const maxChars = Math.max(1, Math.min(options.maxChars ?? MAX_TEXT_CHARS_PER_PAGE, MAX_TEXT_CHARS_PER_PAGE));
  const content = await page.getTextContent();
  const items = Array.isArray(content?.items) ? content.items : [];
  const chunks = [];
  let characterCount = 0;
  let processedItems = 0;
  let truncated = false;

  for (const item of items) {
    processedItems += 1;
    if (processedItems > maxItems) {
      truncated = true;
      break;
    }

    const rawText = typeof item?.str === "string" ? item.str.replace(/\u0000/g, "") : "";
    if (rawText) {
      const remaining = maxChars - characterCount;
      if (remaining <= 0) {
        truncated = true;
        break;
      }
      const value = rawText.slice(0, remaining);
      chunks.push(value);
      characterCount += value.length;
      if (value.length < rawText.length) {
        truncated = true;
        break;
      }
    }

    // PDF.js exposes line boundaries through hasEOL. Preserve those boundaries
    // so the deterministic classifier can look for repeated numeric item rows.
    chunks.push(item?.hasEOL ? "\n" : " ");
  }

  const text = chunks.join("")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n[\t ]+/g, "\n")
    .replace(/[\t ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    text,
    textChars: text.length,
    itemCount: Math.min(items.length, maxItems),
    truncated: truncated || items.length > processedItems,
  };
}
