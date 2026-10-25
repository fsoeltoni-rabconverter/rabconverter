# User Experience Specification

## Reference model

Use remove.bg as a reference for interaction simplicity: one clear primary action, upload/progress feedback and a visible result. Do not copy its logo, illustrations, copy or exact visual design.

## Main flow

1. Landing / workspace: concise promise and clear “Upload tender document” action.
2. Upload: drag-and-drop and browse; display allowed types, size limits and privacy notice.
3. Job created: show filename, project name if detected, received timestamp and “original preserved”.
4. Processing: staged progress such as validating → detecting format → extracting tables → normalizing → checking. Do not fake a percentage if exact progress is unavailable.
5. Review: dominant spreadsheet-like table with sections, item code, description, unit, quantity, unit price and amount. Let user edit values inline. Identify uncertain cells visibly and provide source context.
6. Exceptions panel: list missing fields, arithmetic mismatches, repeated headers, likely duplicate rows, unsupported pages and revision warnings. Clicking an issue locates its row/source.
7. Export: choose XLSX or CSV; optional original-template mapping when supported. Summarize what is included and outstanding warnings before downloading.
8. History: recent jobs with state, filename, created time, row count and output link. Users can delete a job and its source/derived files according to retention policy.

## Design priorities

- Desktop-first editing efficiency, responsive enough for mobile upload and review.
- Minimize modal dialogs; keep the primary action visible.
- Dense data tables should remain legible; descriptions may wrap while numeric columns align consistently.
- Never hide source uncertainty behind an overall “success” state.
- Autosave edits with explicit save state and conflict handling; don't lose review edits on navigation.
- Clear error copy: explain what failed, which file/section was affected, and what the user can do next.
- Use keyboard navigation, accessible labels, focus state, contrast and reduced-motion preferences.

## Key states

- Empty workspace.
- Dragging a valid file.
- Wrong/unsupported type.
- File too large.
- Uploading/retrying.
- Processing queued/running.
- Partial extraction / review required.
- Completed with warnings.
- Completed with no detected issues.
- Failed with retry available.
- Exporting / export ready / export failed.
- Deleting job.
- Expired or missing output.

## UX anti-patterns to avoid

- “100% accurate” claims.
- Fake progress bars.
- Automatically pricing unknown items.
- Removing blank rows/section structure without a reviewable audit.
- Silent conversion from source locale to different numeric convention.
- Treating a subtotal or section title as a work item.
- Overbuilding dashboards before the upload → review → export loop is reliable.
