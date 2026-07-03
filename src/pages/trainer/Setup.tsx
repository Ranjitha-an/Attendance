import { useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import {
  BATCHES,
  BOOTCAMP_BATCH,
  BOOTCAMPS,
  COURSES,
  formatCurrentDate,
  getCurrentTime,
  LIVE_CLASSES,
  MAX_GROUPS,
  PURPOSE_OPTIONS,
  SUBJECTS,
  TESTS,
} from "../../data/mockData";
import type { TrainerSetupState } from "../../types/attendance";

export default function Setup() {
  const navigate = useNavigate();
  const currentDate = formatCurrentDate();
  const [mode, setMode] = useState<"bootcamp" | "others">("bootcamp");
  const [bootcamp, setBootcamp] = useState(BOOTCAMPS[0]);
  const [course, setCourse] = useState(COURSES[0]);
  const [batches, setBatches] = useState<string[]>([BATCHES[0]]);
  const [purpose, setPurpose] = useState("test");
  const [purposeDetail, setPurposeDetail] = useState(TESTS[0]);
  const [time, setTime] = useState(getCurrentTime());
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupCount, setGroupCount] = useState(3);

  const handlePurposeChange = (value: string) => {
    setPurpose(value);
    if (value === "onsite") setPurposeDetail(SUBJECTS[0]);
    else if (value === "test") setPurposeDetail(TESTS[0]);
    else if (value === "live") setPurposeDetail(LIVE_CLASSES[0]);
    else setPurposeDetail("General");
  };

  const handleGenerateGroups = () => {
    const setupState: TrainerSetupState = {
      mode,
      course: mode === "bootcamp" ? bootcamp : course,
      batches: mode === "bootcamp" ? [BOOTCAMP_BATCH] : batches,
      purpose,
      purposeDetail,
      dateTime: `${currentDate} ${time}`,
      groupCount,
    };
    navigate("/trainer/attendance", { state: setupState });
  };

  return (
    <>
      <Header title="Attendance" />
      <main className="app-main">
        <Container>
          <Card className="section-card">
            <Card.Body className="p-4">
              <h2 className="page-title mb-4">Attendance Setup</h2>

              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Label className="filter-label">Bootcamp / Others</Form.Label>
                  <Form.Select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "bootcamp" | "others")}
                  >
                    <option value="bootcamp">Bootcamp</option>
                    <option value="others">Others</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="filter-label">Date</Form.Label>
                  <Form.Control type="text" value={currentDate} readOnly />
                </Col>
                <Col md={3}>
                  <Form.Label className="filter-label">Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Col>
              </Row>

              {mode === "bootcamp" && (
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Label className="filter-label">Select Bootcamp</Form.Label>
                    <Form.Select value={bootcamp} onChange={(e) => setBootcamp(e.target.value)}>
                      {BOOTCAMPS.map((bc) => (
                        <option key={bc} value={bc}>
                          {bc}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              )}

              {mode === "others" && (
                <>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label className="filter-label">Course</Form.Label>
                      <Form.Select value={course} onChange={(e) => setCourse(e.target.value)}>
                        {COURSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="filter-label">Purpose</Form.Label>
                      <Form.Select value={purpose} onChange={(e) => handlePurposeChange(e.target.value)}>
                        {PURPOSE_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>

                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label className="filter-label">Batch (multiple selection)</Form.Label>
                      <MultiSelectDropdown
                        options={BATCHES}
                        selected={batches}
                        onChange={setBatches}
                        placeholder="Select batches"
                      />
                    </Col>
                    <Col md={6}>
                      {purpose === "onsite" && (
                        <>
                          <Form.Label className="filter-label">Select Subject</Form.Label>
                          <Form.Select
                            value={purposeDetail}
                            onChange={(e) => setPurposeDetail(e.target.value)}
                          >
                            {SUBJECTS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </Form.Select>
                        </>
                      )}
                      {purpose === "test" && (
                        <>
                          <Form.Label className="filter-label">Select Test</Form.Label>
                          <Form.Select
                            value={purposeDetail}
                            onChange={(e) => setPurposeDetail(e.target.value)}
                          >
                            {TESTS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </Form.Select>
                        </>
                      )}
                      {purpose === "live" && (
                        <>
                          <Form.Label className="filter-label">Select Live Classes</Form.Label>
                          <Form.Select
                            value={purposeDetail}
                            onChange={(e) => setPurposeDetail(e.target.value)}
                          >
                            {LIVE_CLASSES.map((lc) => (
                              <option key={lc} value={lc}>
                                {lc}
                              </option>
                            ))}
                          </Form.Select>
                        </>
                      )}
                      {purpose === "others" && (
                        <>
                          <Form.Label className="filter-label">Purpose Detail</Form.Label>
                          <Form.Control
                            type="text"
                            value={purposeDetail}
                            onChange={(e) => setPurposeDetail(e.target.value)}
                            placeholder="Enter purpose"
                          />
                        </>
                      )}
                    </Col>
                  </Row>
                </>
              )}

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Button className="btn-brand" onClick={() => setShowGroupModal(true)}>
                  Trigger Attendance
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/trainer/report")}
                >
                  View Report
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>

      <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Split into Groups</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label className="filter-label">
            How many groups do you want to split the students into?
          </Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={MAX_GROUPS}
            value={groupCount}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (Number.isNaN(value)) return;
              setGroupCount(Math.max(1, Math.min(value, MAX_GROUPS)));
            }}
          />
          <Form.Text className="text-muted">
            You can create between 1 and {MAX_GROUPS} groups. Each group gets its own image to
            show.
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowGroupModal(false)}>
            Cancel
          </Button>
          <Button className="btn-brand" onClick={handleGenerateGroups}>
            Generate Groups
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
