import { Button, Card, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { MOCK_STUDENT_REPORT } from "../../data/mockData";

export default function StudentReport() {
  const navigate = useNavigate();
  const report = MOCK_STUDENT_REPORT;

  return (
    <>
      <Header title="My Attendance Report" />
      <main className="app-main">
        <Container fluid className="px-4">
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
                    </tr>
                  </thead>
                  <tbody>
                    {report.records.map((record) => (
                      <tr key={record.slNo}>
                        <td>{record.slNo}</td>
                        <td>{record.date}</td>
                        <td>{record.purpose}</td>
                        <td>{record.attendanceNo}</td>
                        <td className={record.present === "Y" ? "status-present" : "status-absent"}>
                          {record.present}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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
