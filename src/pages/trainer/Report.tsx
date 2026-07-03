import { useCallback, useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbar,
  type GridColDef,
  type GridRowParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Header from "../../components/Header";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { applyColumnFilters, withFilterHeaders } from "../../components/GridColumnFilter";
import { BATCHES, BRANCHES, COLLEGES, COURSES, MOCK_ATTENDANCE_REPORT } from "../../data/mockData";
import type { AttendanceReportRow } from "../../data/mockData";

const PURPOSES = Array.from(new Set(MOCK_ATTENDANCE_REPORT.map((row) => row.purpose)));

interface FlatReportRow {
  id: string;
  slNo: number;
  date: string;
  purpose: string;
  course: string;
  batch: string;
  branch: string;
  name: string;
  attendanceNo: string;
  totalPresent: string;
  absent: string;
  reportRow: AttendanceReportRow;
}

export default function Report() {
  const navigate = useNavigate();

  const [course, setCourse] = useState("All");
  const [batches, setBatches] = useState<string[]>([]);
  const [college, setCollege] = useState(COLLEGES[0]);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [purpose, setPurpose] = useState("All");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const flatRows = useMemo<FlatReportRow[]>(() => {
    return MOCK_ATTENDANCE_REPORT.flatMap((row) =>
      row.attendanceRounds.map((round) => ({
        id: `${row.slNo}-${round.roundNo}`,
        slNo: row.slNo,
        date: row.date,
        purpose: row.purpose,
        course: row.course,
        batch: row.batch,
        branch: row.branch,
        name: row.name ?? "",
        attendanceNo: round.label,
        totalPresent: `${round.total} / ${Math.round((round.presentPercent / 100) * round.total)} (${round.presentPercent}%)`,
        absent: `${Math.round((round.absentPercent / 100) * round.total)} (${round.absentPercent}%)`,
        reportRow: row,
      })),
    );
  }, []);

  const filteredRows = flatRows.filter((row) => {
    if (course !== "All" && row.course !== course) return false;
    if (batches.length > 0 && !batches.includes(row.batch)) return false;
    if (college !== "All Colleges" && college !== "All" && row.batch !== college.replace(" College", "")) return false;
    if (branch !== "All" && row.branch !== branch) return false;
    if (purpose !== "All" && row.purpose !== purpose) return false;
    return true;
  });

  const displayedRows = applyColumnFilters(filteredRows, columnFilters);

  const handleRowClick = (params: GridRowParams<FlatReportRow>) => {
    navigate("/trainer/report/student", {
      state: {
        reportRow: params.row.reportRow,
        attendanceNo: params.row.attendanceNo,
      },
    });
  };

  const columns = useMemo<GridColDef<FlatReportRow>[]>(() => {
    const base: GridColDef<FlatReportRow>[] = [
      { field: "slNo", headerName: "Sl No", width: 70 },
      { field: "date", headerName: "Date", width: 140 },
      { field: "purpose", headerName: "Purpose", width: 110 },
      { field: "course", headerName: "Course", width: 150 },
      { field: "batch", headerName: "Batch", width: 100 },
      { field: "branch", headerName: "Branch", width: 90 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 130 },
      { field: "attendanceNo", headerName: "Attendance No", width: 120 },
      { field: "totalPresent", headerName: "Total / Present", width: 160 },
      { field: "absent", headerName: "Absent", width: 120 },
    ];
    return withFilterHeaders(base, handleFilterChange, showFilters);
  }, [handleFilterChange, showFilters]);

  return (
    <>
      <Header title="Attendance Report" />
      <main className="app-main">
        <Container fluid className="px-4">
          <Card className="section-card mb-4">
            <Card.Body>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Label className="filter-label">Course</Form.Label>
                  <Form.Select value={course} onChange={(e) => setCourse(e.target.value)}>
                    <option value="All">All Courses</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="filter-label">Batch (multiple selection)</Form.Label>
                  <MultiSelectDropdown
                    options={BATCHES}
                    selected={batches}
                    onChange={setBatches}
                    placeholder="All batches"
                  />
                </Col>
                <Col md={3}>
                  <Form.Label className="filter-label">College</Form.Label>
                  <Form.Select value={college} onChange={(e) => setCollege(e.target.value)}>
                    {COLLEGES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="filter-label">Branch</Form.Label>
                  <Form.Select value={branch} onChange={(e) => setBranch(e.target.value)}>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="filter-label">Purpose</Form.Label>
                  <Form.Select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                    <option value="All">All Purposes</option>
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <p className="text-muted mb-0 mt-3">
                Records start from the latest. Click any row for student-wise breakup.
              </p>
            </Card.Body>
          </Card>

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
                  onRowClick={handleRowClick}
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
            <Button variant="outline-secondary" onClick={() => navigate("/trainer/setup")}>
              Back to Setup
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
