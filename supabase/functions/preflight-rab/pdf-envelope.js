const HEADER_WINDOW_BYTES = 1024;
const EOF_SEARCH_WINDOW_BYTES = 4096;

/**
 * A cheap envelope sanity check before handing untrusted bytes to the PDF parser.
 * This is not cryptographic validation and does not replace PDFDocument.load.
 */
export function hasPdfHeader(bytes) {
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, HEADER_WINDOW_BYTES));
  return head.includes("%PDF-");
}

export function hasPdfTerminator(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength < 16) return false;
  const tail = new TextDecoder("latin1").decode(
    bytes.subarray(Math.max(0, bytes.byteLength - EOF_SEARCH_WINDOW_BYTES)),
  );
  const eofIndex = tail.lastIndexOf("%%EOF");
  if (eofIndex < 0) return false;

  // startxref is near the end of a conventional PDF. Require it before EOF so a
  // file containing only "%PDF-" cannot be accepted as a structurally valid PDF.
  const nearEnd = tail.slice(Math.max(0, eofIndex - 2048), eofIndex);
  return /startxref\s+\d+\s*$/s.test(nearEnd.trim());
}
