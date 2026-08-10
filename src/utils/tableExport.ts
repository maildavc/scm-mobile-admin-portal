/** Client-side table export helpers (CSV + tabular PDF). */

function getTableMatrix(table: HTMLTableElement): string[][] {
  return Array.from(table.querySelectorAll("tr")).map((row) =>
    Array.from(row.querySelectorAll("th,td")).map((cell) => {
      // Prefer structured name/id cells over flattened whitespace
      const paragraphs = Array.from(cell.querySelectorAll("p"));
      if (paragraphs.length >= 2) {
        const primary = (paragraphs[0].textContent || "").trim();
        const secondary = (paragraphs[1].textContent || "").trim();
        if (primary && secondary) return `${primary} (${secondary})`;
      }
      return (cell.textContent || "").replace(/\s+/g, " ").trim();
    }),
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function estimateTextWidth(text: string, fontSize: number) {
  // Helvetica average glyph width approximation
  return text.length * fontSize * 0.5;
}

function truncateToWidth(text: string, maxWidth: number, fontSize: number) {
  if (estimateTextWidth(text, fontSize) <= maxWidth) return text;
  const ellipsis = "...";
  let end = text.length;
  while (end > 0 && estimateTextWidth(text.slice(0, end) + ellipsis, fontSize) > maxWidth) {
    end -= 1;
  }
  return `${text.slice(0, Math.max(end, 1))}${ellipsis}`;
}

function wrapText(text: string, maxWidth: number, fontSize: number, maxLines = 2): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (estimateTextWidth(candidate, fontSize) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    const leftover = words.join(" ").slice(last.length).trim();
    if (leftover || estimateTextWidth(last, fontSize) > maxWidth) {
      lines[maxLines - 1] = truncateToWidth(last, maxWidth, fontSize);
    }
  }

  return lines.length ? lines : [""];
}

/** Drop UI-only Action columns that only contain "Options". */
function formatCell(header: string, value: string) {
  if (/LAST UPDATED|DATE|UPDATED/i.test(header) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  return value;
}

function cleanMatrix(matrix: string[][]): string[][] {
  if (matrix.length === 0) return matrix;
  const colCount = Math.max(...matrix.map((row) => row.length));
  const keep: number[] = [];

  for (let c = 0; c < colCount; c++) {
    const header = (matrix[0]?.[c] || "").toUpperCase();
    const values = matrix.slice(1).map((row) => (row[c] || "").trim());
    const isOptionsColumn =
      header.includes("ACTION") && values.every((v) => !v || v.toLowerCase() === "options");
    if (!isOptionsColumn) keep.push(c);
  }

  const trimmed = matrix.map((row) => keep.map((c) => row[c] || ""));
  if (trimmed.length === 0) return trimmed;
  const headers = trimmed[0];
  return [
    headers,
    ...trimmed.slice(1).map((row) => row.map((cell, i) => formatCell(headers[i] || "", cell))),
  ];
}

function computeColumnWidths(
  matrix: string[][],
  usableWidth: number,
  fontSize: number,
): number[] {
  const colCount = matrix[0]?.length || 0;
  if (colCount === 0) return [];

  const weights = Array.from({ length: colCount }, (_, c) => {
    let max = 1;
    for (const row of matrix.slice(0, Math.min(matrix.length, 12))) {
      max = Math.max(max, (row[c] || "").length);
    }
    // Cap extreme ID-heavy columns so others still get space
    return Math.min(Math.max(max, 8), 42);
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  return weights.map((w) => (w / total) * usableWidth);
}

function buildTablePdf(matrix: string[][]): Blob {
  // Landscape letter for readable tables
  const pageWidth = 792;
  const pageHeight = 612;
  const marginX = 28;
  const marginTop = 36;
  const marginBottom = 28;
  const fontSize = 8;
  const headerFontSize = 8;
  const cellPadX = 4;
  const cellPadY = 4;
  const lineHeight = fontSize + 2;
  const usableWidth = pageWidth - marginX * 2;

  const data = cleanMatrix(matrix);
  if (data.length === 0) {
    data.push(["(empty table)"]);
  }

  const colWidths = computeColumnWidths(data, usableWidth, fontSize);
  const header = data[0] || [];
  const body = data.slice(1);

  type PreparedRow = { lines: string[][]; height: number; isHeader?: boolean };
  const prepareRow = (cells: string[], isHeader = false): PreparedRow => {
    const lines = cells.map((cell, i) =>
      wrapText(
        cell || "",
        Math.max(colWidths[i] - cellPadX * 2, 20),
        isHeader ? headerFontSize : fontSize,
        isHeader ? 2 : 3,
      ),
    );
    const height =
      Math.max(...lines.map((l) => l.length), 1) * lineHeight + cellPadY * 2;
    return { lines, height, isHeader };
  };

  const headerRow = prepareRow(header, true);
  const preparedBody = body.map((row) => prepareRow(row));

  const pages: PreparedRow[][] = [];
  let current: PreparedRow[] = [headerRow];
  let used = headerRow.height;

  const maxContentHeight = pageHeight - marginTop - marginBottom;

  for (const row of preparedBody) {
    if (used + row.height > maxContentHeight && current.length > 1) {
      pages.push(current);
      current = [headerRow, row];
      used = headerRow.height + row.height;
    } else {
      current.push(row);
      used += row.height;
    }
  }
  pages.push(current);

  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";

  let nextObj = 3;
  const fontRegular = nextObj++;
  const fontBold = nextObj++;
  objects[fontRegular] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[fontBold] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  const pageObjectNumbers: number[] = [];

  pages.forEach((pageRows, pageIndex) => {
    const contentObj = nextObj++;
    const pageObj = nextObj++;
    pageObjectNumbers.push(pageObj);

    const ops: string[] = [];
    // Title
    ops.push("BT");
    ops.push(`/F2 11 Tf`);
    ops.push(`${marginX} ${pageHeight - 22} Td`);
    ops.push(`(${escapePdfText("SCM Admin Export")}) Tj`);
    ops.push("ET");

    // Page number
    ops.push("BT");
    ops.push(`/F1 8 Tf`);
    ops.push(
      `${pageWidth - marginX - 40} ${pageHeight - 22} Td (${escapePdfText(`Page ${pageIndex + 1}/${pages.length}`)}) Tj`,
    );
    ops.push("ET");

    let y = pageHeight - marginTop;
    const tableLeft = marginX;
    const tableRight = marginX + usableWidth;

    for (const row of pageRows) {
      const rowTop = y;
      const rowBottom = y - row.height;

      // Header background
      if (row.isHeader) {
        ops.push("0.95 0.95 0.96 rg");
        ops.push(
          `${tableLeft} ${rowBottom} ${usableWidth} ${row.height} re f`,
        );
      }

      // Horizontal grid line (top of row)
      ops.push("0.75 0.75 0.78 RG");
      ops.push("0.5 w");
      ops.push(`${tableLeft} ${rowTop} m ${tableRight} ${rowTop} l S`);

      // Vertical lines + cell text
      let x = tableLeft;
      for (let c = 0; c < colWidths.length; c++) {
        const width = colWidths[c];
        ops.push(`${x} ${rowTop} m ${x} ${rowBottom} l S`);

        const cellLines = row.lines[c] || [""];
        let textY = rowTop - cellPadY - fontSize;
        for (const line of cellLines) {
          ops.push("BT");
          ops.push(row.isHeader ? "/F2 8 Tf" : "/F1 8 Tf");
          ops.push("0 0 0 rg");
          ops.push(`${x + cellPadX} ${textY} Td`);
          ops.push(`(${escapePdfText(line)}) Tj`);
          ops.push("ET");
          textY -= lineHeight;
        }
        x += width;
      }
      ops.push(`${tableRight} ${rowTop} m ${tableRight} ${rowBottom} l S`);

      y = rowBottom;
    }

    // Bottom border
    ops.push(`${tableLeft} ${y} m ${tableRight} ${y} l S`);

    const stream = ops.join("\n");
    objects[contentObj] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageObj] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      `/Contents ${contentObj} 0 R /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >>`;
  });

  objects[2] =
    `<< /Type /Pages /Kids [${pageObjectNumbers.map((n) => `${n} 0 R`).join(" ")}] ` +
    `/Count ${pageObjectNumbers.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 1; i < nextObj; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${nextObj}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < nextObj; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${nextObj} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function exportVisibleTableAsCsv(filenamePrefix = "scm-export") {
  const table = document.querySelector("main table") || document.querySelector("table");
  if (!table) return;

  const rows = cleanMatrix(getTableMatrix(table as HTMLTableElement)).map((row) =>
    row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
  );
  const csv = rows.join("\r\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenamePrefix}.csv`);
}

export function exportVisibleTableAsPdf(filenamePrefix = "scm-export") {
  const table = document.querySelector("main table") || document.querySelector("table");
  if (!table) return;

  const matrix = getTableMatrix(table as HTMLTableElement);
  downloadBlob(buildTablePdf(matrix), `${filenamePrefix}.pdf`);
}

export function runTableExportAction(label: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  if (label.toLowerCase().includes("pdf")) {
    exportVisibleTableAsPdf(`scm-export-${stamp}`);
    return;
  }
  exportVisibleTableAsCsv(`scm-export-${stamp}`);
}
