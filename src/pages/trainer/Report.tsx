import { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { BATCHES, BRANCHES, COLLEGES, COURSES, MOCK_ATTENDANCE_REPORT } from "../../data/mockData";

const PURPOSES = Array.from(new Set(MOCK_ATTENDANCE_REPORT.map((row) => row.purpose)));

export default function Report() {
  const navigate = useNavigate();

  const [course, setCourse] = useState("All");
  const [batches, setBatches] = useState<string[]>([]);
  const [college, setCollege] = useState(COLLEGES[0]);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [purpose, setPurpose] = useState("All");

  const filteredRows = MOCK_ATTENDANCE_REPORT.filter((row) => {
    if (course !== "All" && row.course !== course) return false;
    if (batches.length > 0 && !batches.includes(row.batch)) return false;
    if (branch !== "All" && row.branch !== branch) return false;
    if (purpose !== "All" && row.purpose !== purpose) return false;
    return true;
  });

  const handleRowClick = (row: (typeof MOCK_ATTENDANCE_REPORT)[0]) => {
    navigate("/trainer/report/student", {
      state: {
        reportRow: row,
      },
    });
  };

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
              <div className="table-responsive">
                <Table bordered hover className="mb-0">
                  <thead className="table-header-dark">
                    <tr>
                      <th rowSpan={2}>Sl No</th>
                      <th rowSpan={2}>Date</th>
                      <th rowSpan={2}>Purpose</th>
                      <th rowSpan={2}>Course</th>
                      <th rowSpan={2}>Batch</th>
                      <th rowSpan={2}>Branch</th>
                      <th rowSpan={2}>Name</th>
                      <th colSpan={3} className="text-center">
                        Attendance Summary
                      </th>
                    </tr>
                    <tr>
                      <th>Attendance No</th>
                      <th>Total / Present</th>
                      <th>Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={10} className="text-center text-muted py-4">
                          No records match the selected filters.
                        </td>
                      </tr>
                    )}
                    {filteredRows.map((row) =>
                      row.attendanceRounds.map((round, idx) => (
                        <tr
                          key={`${row.slNo}-${round.roundNo}`}
                          className={`report-row-clickable ${idx > 0 ? "nested-attendance-row" : ""}`}
                          onClick={() => handleRowClick(row)}
                        >
                          {idx === 0 && (
                            <>
                              <td rowSpan={row.attendanceRounds.length}>{row.slNo}</td>
                              <td rowSpan={row.attendanceRounds.length}>{row.date}</td>
                              <td rowSpan={row.attendanceRounds.length}>{row.purpose}</td>
                              <td rowSpan={row.attendanceRounds.length}>{row.course}</td>
                              <td rowSpan={row.attendanceRounds.length}>{row.batch}</td>
                              <td rowSpan={row.attendanceRounds.length}>{row.branch}</td>
                              <td rowSpan={row.attendanceRounds.length}>{row.name}</td>
                            </>
                          )}
                          <td>{round.label}</td>
                          <td>
                            {round.total} / {Math.round((round.presentPercent / 100) * round.total)} (
                            {round.presentPercent}%)
                          </td>
                          <td>
                            {Math.round((round.absentPercent / 100) * round.total)} (
                            {round.absentPercent}%)
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </Table>
              </div>
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
