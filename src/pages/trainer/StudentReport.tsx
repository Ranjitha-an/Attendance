import { useCallback, useMemo, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbar,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Header from "../../components/Header";
import { applyColumnFilters, withFilterHeaders } from "../../components/GridColumnFilter";
import {
  MOCK_BATCH_STUDENT_REPORT,
  REMARK_OPTIONS,
} from "../../data/mockData";
import type { AttendanceReportRow } from "../../data/mockData";

interface BatchStudentRow {
  id: string;
  slNo: number;
  studentName: string;
  studentId: string;
  date: string;
  purpose: string;
  attendanceNo: string;
  present: "Y" | "N";
  remark: string;
}

export default function StudentReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRow = location.state?.reportRow as AttendanceReportRow | undefined;
  const attendanceNo = location.state?.attendanceNo as string | undefined;

  const initialRows = useMemo<BatchStudentRow[]>(() => {
    let slNo = 1;
    return MOCK_BATCH_STUDENT_REPORT.students.flatMap((student) =>
      student.records
        .filter((record) => !attendanceNo || record.attendanceNo === attendanceNo)
        .map((record) => ({
          id: `${student.studentId}-${record.attendanceNo}`,
          slNo: slNo++,
          studentName: student.studentName,
          studentId: student.studentId,
          date: record.date,
          purpose: record.purpose,
          attendanceNo: record.attendanceNo,
          present: record.present,
          remark: record.remark,
        })),
    );
  }, [attendanceNo]);

  const [rows, setRows] = useState<BatchStudentRow[]>(initialRows);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleRemarkChange = useCallback((rowId: string, remark: string) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, remark } : r)));
  }, []);

  const displayedRows = applyColumnFilters(rows, columnFilters);

  const columns = useMemo<GridColDef<BatchStudentRow>[]>(() => {
    const base: GridColDef<BatchStudentRow>[] = [
      { field: "slNo", headerName: "Sl No", width: 70 },
      { field: "studentName", headerName: "Student Name", flex: 1, minWidth: 140 },
      { field: "studentId", headerName: "Student Id", width: 120 },
      {
        field: "present",
        headerName: "Present",
        width: 90,
        renderCell: (params: GridRenderCellParams<BatchStudentRow>) => (
          <span className={params.value === "Y" ? "status-present" : "status-absent"}>
            {params.value}
          </span>
        ),
      },
      {
        field: "remark",
        headerName: "Remark",
        flex: 1,
        minWidth: 180,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<BatchStudentRow>) => {
          if (params.row.present === "Y") {
            return <span className="text-muted">-</span>;
          }
          return (
            <FormControl size="small" fullWidth>
              <Select
                value={params.row.remark}
                displayEmpty
                onChange={(e) => handleRemarkChange(params.row.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem value="">
                  <em>Select remark</em>
                </MenuItem>
                {REMARK_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
      },
    ];
    return withFilterHeaders(base, handleFilterChange, showFilters, ["remark"]);
  }, [handleFilterChange, handleRemarkChange, showFilters]);

  return (
    <>
      <Header title="Studentwise Attendance Report" />
      <main className="app-main">
        <Container fluid className="px-4">
          <Card className="section-card mb-4">
            <Card.Body>
              <div className="d-flex flex-wrap gap-4">
                <div>
                  <span className="filter-label d-block">Course</span>
                  <strong>{MOCK_BATCH_STUDENT_REPORT.course}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">Batch</span>
                  <strong>{MOCK_BATCH_STUDENT_REPORT.batch}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">College</span>
                  <strong>{MOCK_BATCH_STUDENT_REPORT.college}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">Stream</span>
                  <strong>{MOCK_BATCH_STUDENT_REPORT.stream}</strong>
                </div>
                {reportRow && (
                  <>
                    <div>
                      <span className="filter-label d-block">Date</span>
                      <strong>{reportRow.date}</strong>
                    </div>
                    <div>
                      <span className="filter-label d-block">Purpose</span>
                      <strong>{reportRow.purpose}</strong>
                    </div>
                  </>
                )}
                {attendanceNo && (
                  <div>
                    <span className="filter-label d-block">Attendance</span>
                    <strong>{attendanceNo}</strong>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          <div className="summary-bar d-flex flex-wrap gap-5 mb-4 rounded">
            <span>Overall Attendance %: {MOCK_BATCH_STUDENT_REPORT.overallAttendancePercent}%</span>
            <span>Batch Average: {MOCK_BATCH_STUDENT_REPORT.batchAverage}%</span>
            <span>Total Students: {MOCK_BATCH_STUDENT_REPORT.students.length}</span>
          </div>

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
                  pageSizeOptions={[10, 25, 50]}
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

          <div className="mt-3">
            <Button variant="outline-secondary" onClick={() => navigate("/trainer/report")}>
              Back to Report
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
