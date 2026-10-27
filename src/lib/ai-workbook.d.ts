import type { AiRabConversionResult } from "./ai-conversion.js";

export declare function buildAiRabWorkbook(
  result: AiRabConversionResult,
  originalFileName: string,
): { bytes: Uint8Array; fileName: string; mimeType: string };

export declare function downloadAiWorkbook(
  result: AiRabConversionResult,
  originalFileName: string,
): { fileName: string; byteLength: number };
