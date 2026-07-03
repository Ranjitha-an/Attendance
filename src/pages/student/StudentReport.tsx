import { useCallback, useMemo, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbar,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Header from "../../components/Header";
import { applyColumnFilters, withFilterHeaders } from "../../components/GridColumnFilter";
import { MOCK_STUDENT_REPORT } from "../../data/mockData";

interface StudentReportRow {
  id: string;
  slNo: number;
  date: string;
  purpose: string;
  attendanceNo: string;
  present: "Y" | "N";
}

export default function StudentReport() {
  const navigate = useNavigate();
  const report = MOCK_STUDENT_REPORT;

  const rows = useMemo<StudentReportRow[]>(
    () =>
      report.records.map((record) => ({
        id: String(record.slNo),
        slNo: record.slNo,
        date: record.date,
        purpose: record.purpose,
        attendanceNo: record.attendanceNo,
        present: record.present,
      })),
    [report.records],
  );

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const displayedRows = applyColumnFilters(rows, columnFilters);

  const columns = useMemo<GridColDef<StudentReportRow>[]>(() => {
    const base: GridColDef<StudentReportRow>[] = [
      { field: "slNo", headerName: "Sl No", width: 70 },
      { field: "date", headerName: "Date", flex: 1, minWidth: 140 },
      { field: "purpose", headerName: "Purpose", flex: 1, minWidth: 110 },
      { field: "attendanceNo", headerName: "Attendance No", width: 130 },
      {
        field: "present",
        headerName: "Present",
        width: 100,
        renderCell: (params: GridRenderCellParams<StudentReportRow>) => (
          <span className={params.value === "Y" ? "status-present" : "status-absent"}>
            {params.value}
          </span>
        ),
      },
    ];
    return withFilterHeaders(base, handleFilterChange, showFilters);
  }, [handleFilterChange, showFilters]);

  return (
    <>
      <Header title="My Attendance Report" />
      <main className="app-main">
        <Container fluid className="px-4">
          <Card className="section-card">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-end p-2">
                <Button
                  variant="outline-brand"
                  size="sm"
                  onClick={() => {
                    setShowFilters((prev) => {
                      if (prev) setColumnFilters({});
                      return !prev;
                    });
                  }}
                >
                  {showFilters ? "Hide Column Filters" : "Show Column Filters"}
                </Button>
              </div>
              <Box className="data-grid-container">
                <DataGrid
                  rows={displayedRows}
                  columns={columns}
                  columnHeaderHeight={showFilters ? 80 : 56}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  pageSizeOptions={[10, 25]}
                  disableRowSelectionOnClick
                  disableColumnResize
                  autosizeOnMount
                  autosizeOptions={{ includeHeaders: false, includeOutliers: true, expand: true }}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                />
              </Box>
            </Card.Body>
          </Card>

          <div className="mt-3 d-flex gap-2">
            <Button className="btn-brand" onClick={() => navigate("/student")}>
              Back to Attendance
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
