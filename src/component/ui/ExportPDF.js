import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getCellValue } from "./ExportCSV";

export const exportPDF = (columns, rows, title = "Data") => {
  const doc = new jsPDF();

  doc.text(title, 14, 15);

  const exportableCols = columns.filter((col) => col.field !== "actions");

  autoTable(doc, {
    head: [exportableCols.map((col) => col.headerName || col.field)],
    body: rows.map((row) =>
      exportableCols.map((col) => getCellValue(col, row))
    ),
  });

  doc.save(`${title}.pdf`);
};