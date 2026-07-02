import { useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { MOCK_STUDENT_REPORT, REMARK_OPTIONS } from "../../data/mockData";
import type { AttendanceReportRow } from "../../data/mockData";

export default function StudentReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRow = location.state?.reportRow as AttendanceReportRow | undefined;
  const [records, setRecords] = useState(MOCK_STUDENT_REPORT.records);

  const handleRemarkChange = (slNo: number, remark: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.slNo === slNo ? { ...r, remark } : r)),
    );
  };

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
                  <strong>{MOCK_STUDENT_REPORT.course}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">Batch</span>
                  <strong>{MOCK_STUDENT_REPORT.batch}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">College</span>
                  <strong>{MOCK_STUDENT_REPORT.college}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">Stream</span>
                  <strong>{MOCK_STUDENT_REPORT.stream}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">Student Name</span>
                  <strong>{MOCK_STUDENT_REPORT.studentName}</strong>
                </div>
                <div>
                  <span className="filter-label d-block">Student Id</span>
                  <strong>{MOCK_STUDENT_REPORT.studentId}</strong>
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
              </div>
            </Card.Body>
          </Card>

          <div className="summary-bar d-flex flex-wrap gap-5 mb-4 rounded">
            <span>Overall Attendance %: {MOCK_STUDENT_REPORT.overallAttendancePercent}%</span>
            <span>Batch Average: {MOCK_STUDENT_REPORT.batchAverage}%</span>
          </div>

          <Card className="section-card">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table bordered className="mb-0">
                  <thead className="table-header-dark">
                    <tr>
                      <th>Sl No</th>
                      <th>Date</th>
                      <th>Purpose</th>
                      <th>Attendance No</th>
                      <th>Present</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.slNo}>
                        <td>{record.slNo}</td>
                        <td>{record.date}</td>
                        <td>{record.purpose}</td>
                        <td>{record.attendanceNo}</td>
                        <td className={record.present === "Y" ? "status-present" : "status-absent"}>
                          {record.present}
                        </td>
                        <td>
                          {record.present === "N" ? (
                            <Form.Select
                              size="sm"
                              value={record.remark}
                              onChange={(e) => handleRemarkChange(record.slNo, e.target.value)}
                            >
                              <option value="">Select remark</option>
                              {REMARK_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Form.Select>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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
