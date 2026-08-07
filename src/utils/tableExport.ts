/** Client-side table export helpers (CSV + minimal PDF). */

function getTableMatrix(table: HTMLTableElement): string[][] {
  return Array.from(table.querySelectorAll("tr")).map((row) =>
    Array.from(row.querySelectorAll("th,td")).map((cell) =>
      (cell.textContent || "").replace(/\s+/g, " ").trim(),
    ),
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
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Builds a simple multi-line text PDF without external dependencies. */
function buildSimplePdf(lines: string[]): Blob {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const lineHeight = 12;
  const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    pages.push(lines.slice(i, i + maxLinesPerPage));
  }
  if (pages.length === 0) pages.push(["(empty table)"]);

  const objects: string[] = [];
  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;

  const pageObjectNumbers: number[] = [];
  let nextObj = 3;

  const fontObj = nextObj++;
  objects[fontObj] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;

  const contentObjectNumbers: number[] = [];
  for (const pageLines of pages) {
    const contentObj = nextObj++;
    contentObjectNumbers.push(contentObj);
    const pageObj = nextObj++;
    pageObjectNumbers.push(pageObj);

    let y = pageHeight - margin;
    const streamParts = ["BT", "/F1 9 Tf", `50 ${y} Td`];
    pageLines.forEach((line, index) => {
      if (index === 0) {
        streamParts.push(`(${escapePdfText(line)}) Tj`);
      } else {
        streamParts.push(`0 -${lineHeight} Td (${escapePdfText(line)}) Tj`);
      }
    });
    streamParts.push("ET");
    const stream = streamParts.join("\n");
    objects[contentObj] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageObj] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      `/Contents ${contentObj} 0 R /Resources << /Font << /F1 ${fontObj} 0 R >> >> >>`;
  }

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

  const rows = getTableMatrix(table as HTMLTableElement).map((row) =>
    row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
  );
  const csv = rows.join("\r\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenamePrefix}.csv`);
}

export function exportVisibleTableAsPdf(filenamePrefix = "scm-export") {
  const table = document.querySelector("main table") || document.querySelector("table");
  if (!table) return;

  const matrix = getTableMatrix(table as HTMLTableElement);
  const lines = matrix.map((row) => row.join(" | "));
  downloadBlob(buildSimplePdf(lines), `${filenamePrefix}.pdf`);
}

export function runTableExportAction(label: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  if (label.toLowerCase().includes("pdf")) {
    exportVisibleTableAsPdf(`scm-export-${stamp}`);
    return;
  }
  exportVisibleTableAsCsv(`scm-export-${stamp}`);
}
