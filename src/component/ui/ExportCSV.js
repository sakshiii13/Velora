import * as XLSX from "xlsx";

export const getCellValue = (col, row) => {
  let val = row[col.field];
  if (col.valueGetter) {
    try {
      val = col.valueGetter(val, row, col);
    } catch (e) {
      try {
        // Fallback for older MUI DataGrid signatures if someone used `(params)`
        val = col.valueGetter({ value: val, row, field: col.field });
      } catch (err) {
        val = row[col.field];
      }
    }
  }
  if (typeof val === "object" && val !== null) {
    if (val.name) return val.name;
    if (col.field === "user") return val.name || val.email || "Unknown";
    return JSON.stringify(val);
  }
  return val;
};

export const exportCSV = (columns, rows, fileName = "Data") => {
  const exportableCols = columns.filter((col) => col.field !== "actions");
  
  const formattedRows = rows.map((row) => {
    const obj = {};
    exportableCols.forEach((col) => {
      obj[col.headerName || col.field] = getCellValue(col, row);
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${fileName}.csv`);
};