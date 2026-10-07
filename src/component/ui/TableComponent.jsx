import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography, Fade } from "@mui/material";
import { Search, FileSpreadsheet, FileText, Inbox, X } from "lucide-react";

import { exportCSV, getCellValue } from "./ExportCSV";
import { exportPDF } from "./ExportPDF";

/* ---------- empty state ---------- */
const NoRows = () => (
  <Box className="flex h-full flex-col items-center justify-center gap-2 py-10">
    <Box
      className="flex h-12 w-12 items-center justify-center rounded-2xl"
      sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
    >
      <Inbox size={20} />
    </Box>
    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
      Nothing to show yet
    </Typography>
    <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)" }}>
      New entries will appear here as soon as they're added
    </Typography>
  </Box>
);

const TableComponent = ({ title = "Data", rows = [], columns = [], loading = false, autoHeight = true }) => {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    return rows.filter((row) =>
      columns.some((column) => {
        const value = getCellValue(column, row);
        return String(value ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [rows, columns, search]);

  const finalColumns = useMemo(() => {
    // Any column that doesn't set its own minWidth gets a safe default.
    // Without this, flex columns get crushed to near-zero width on small
    // screens/viewports and text wraps letter-by-letter instead of the
    // grid falling back to its own horizontal scrollbar.
    const normalizedColumns = columns.map((col) => ({
      minWidth: 140,
      ...col,
    }));

    return [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        minWidth: 70,
        sortable: false,
        filterable: false,
        valueGetter: (params, row) => {
          const actualRow = row || params?.row || params;
          const idx = filteredRows.findIndex(r => (r.id || r._id) === (actualRow?.id || actualRow?._id));
          return idx >= 0 ? idx + 1 : "";
        },
      },
      ...normalizedColumns
    ];
  }, [columns, filteredRows]);

  return (
    <Paper
      elevation={0}
      className="!rounded-[22px] !border !p-5 sm:!p-6"
      sx={{ borderColor: "var(--whiold-border)", background: "var(--whiold-bg)", boxShadow: "var(--whiold-shadow-card)" }}
    >
      {/* Header */}
      <Box className="mb-5 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        <Box className="flex items-center gap-2.5">
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--whiold-text-heading)" }}>{title}</Typography>
          <span
            className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
          >
            {filteredRows.length} {filteredRows.length === 1 ? "row" : "rows"}
          </span>
        </Box>

        <Box className="flex items-center gap-2.5">
          {/* Search */}
          <Box className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--whiold-text-muted)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-10 w-full rounded-full border pl-10 pr-9 text-[13.5px] outline-none transition-all sm:w-60"
              style={{
                borderColor: "var(--whiold-border)",
                background: "var(--whiold-bg-input, #FAF8F6)",
                color: "var(--whiold-text-heading)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--whiold-border-focus)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--whiold-border)")}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--whiold-text-muted)" }}
              >
                <X size={14} />
              </button>
            )}
          </Box>

          {/* Export pill group */}
          <Box className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: "var(--whiold-border)" }}>
            <button
              type="button"
              onClick={() => exportCSV(finalColumns, filteredRows, title)}
              title="Export CSV"
              className="group flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-colors"
              style={{ color: "#0F9D58" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,157,88,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <FileSpreadsheet size={14} />
              CSV
            </button>
            <span className="h-4 w-px" style={{ background: "var(--whiold-border)" }} />
            <button
              type="button"
              onClick={() => exportPDF(finalColumns, filteredRows, title)}
              title="Export PDF"
              className="group flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-colors"
              style={{ color: "#F43F5E" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <FileText size={14} />
              PDF
            </button>
          </Box>
        </Box>
      </Box>

      {/* Grid */}
      <Fade in timeout={300}>
        <Box sx={{ height: autoHeight ? "auto" : "560px", width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={filteredRows}
            columns={finalColumns}
            loading={loading}
            getRowId={(row) => row.id || row._id}
            disableRowSelectionOnClick
            slots={{ noRowsOverlay: NoRows }}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            getRowHeight={() => "auto"}
            columnHeaderHeight={56}
            autoHeight={autoHeight}
           
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "whiold-row-even" : "whiold-row-odd"
            }
            sx={{
              border: "none",
              borderRadius: "16px",
              overflow: "hidden",
              fontSize: "13.5px",
              backgroundColor: "var(--whiold-bg)",

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--whiold-bg-soft, #FAF3F0)",
                color: "var(--whiold-text-heading)",
                fontWeight: 700,
                fontSize: "12.5px",
                borderBottom: "1px solid var(--whiold-border)",
              },
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
              "& .MuiDataGrid-columnSeparator": { display: "none" },
              "& .MuiDataGrid-columnHeader": {
                padding: "0 20px",
              },

              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid var(--whiold-border)",
                color: "var(--whiold-text-body)",
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                whiteSpace: "normal !important",
                wordBreak: "break-word",
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": { outline: "none" },

              "& .MuiDataGrid-row": {
                transition: "background-color 0.15s ease",
              },
              "& .MuiDataGrid-row:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              "& .whiold-row-odd": { backgroundColor: "rgba(0,0,0,0.028)" },

              "& .MuiDataGrid-virtualScrollerContent": {
                backgroundColor: "var(--whiold-bg)",
              },

              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid var(--whiold-border)",
                minHeight: "56px",
              },
              "& .MuiTablePagination-root": { 
                color: "var(--whiold-text-muted)",
                fontSize: "12.5px",
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "transparent",
              },
            }}
          />
        </Box>
      </Fade>
    </Paper>
  );
};

export default TableComponent;