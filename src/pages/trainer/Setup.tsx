import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import {
  BATCHES,
  BOOTCAMP_BATCH,
  BOOTCAMP_STUDENT_COUNT,
  BOOTCAMPS,
  computeGroupSplit,
  COURSES,
  formatCurrentDate,
  getCurrentTime,
  getTestsForType,
  getTotalStudentsForBatches,
  MAX_GROUPS,
  SUBJECTS,
  TEST_TYPES,
} from "../../data/mockData";
import type { SetupMode, TrainerSetupState } from "../../types/attendance";

export default function Setup() {
  const navigate = useNavigate();
  const currentDate = formatCurrentDate();
  const [setupMode, setSetupMode] = useState<SetupMode>("bootcamp");
  const [bootcamp, setBootcamp] = useState(BOOTCAMPS[0]);
  const [course, setCourse] = useState(COURSES[0]);
  const [batches, setBatches] = useState<string[]>([BATCHES[0]]);
  const [testType, setTestType] = useState(TEST_TYPES[0]);
  const [selectedTest, setSelectedTest] = useState(() => getTestsForType(TEST_TYPES[0])[0] ?? "");
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [time, setTime] = useState(getCurrentTime());
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [splitError, setSplitError] = useState("");

  const filteredTests = useMemo(() => getTestsForType(testType), [testType]);

  useEffect(() => {
    if (!filteredTests.includes(selectedTest)) {
      setSelectedTest(filteredTests[0] ?? "");
    }
  }, [filteredTests, selectedTest]);

  const totalStudents = useMemo(() => {
    if (setupMode === "bootcamp") return BOOTCAMP_STUDENT_COUNT;
    return getTotalStudentsForBatches(batches);
  }, [setupMode, batches]);

  const groupSizes = useMemo(
    () => (totalStudents > 0 ? computeGroupSplit(totalStudents) : []),
    [totalStudents],
  );

  const handleOpenGroupModal = () => {
    setSplitError("");

    if (setupMode !== "bootcamp" && batches.length === 0) {
      setSplitError("Please select at least one batch.");
      setShowGroupModal(true);
      return;
    }

    if (totalStudents <= 0) {
      setSplitError("No students found for the selected batch(es).");
      setShowGroupModal(true);
      return;
    }

    if (groupSizes.length > MAX_GROUPS) {
      setSplitError(
        `Cannot split ${totalStudents} students (max ${MAX_GROUPS} groups; ${totalStudents > MAX_GROUPS * 20 ? `reduce batch selection or split into multiple sessions` : `max 20 students per group`}).`,
      );
      setShowGroupModal(true);
      return;
    }

    setShowGroupModal(true);
  };

  const handleGenerateGroups = () => {
    if (splitError || groupSizes.length === 0) return;

    const setupState: TrainerSetupState = {
      setupMode,
      course: setupMode === "bootcamp" ? bootcamp : course,
      batches: setupMode === "bootcamp" ? [BOOTCAMP_BATCH] : batches,
      purposeDetail:
        setupMode === "test"
          ? selectedTest
          : setupMode === "onsite"
            ? selectedSubject
            : bootcamp,
      testType: setupMode === "test" ? testType : undefined,
      dateTime: `${currentDate} ${time}`,
      totalStudents,
      groupSizes,
      groupCount: groupSizes.length,
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
                  <Form.Label className="filter-label">Session Type</Form.Label>
                  <Form.Select
                    value={setupMode}
                    onChange={(e) => setSetupMode(e.target.value as SetupMode)}
                  >
                    <option value="bootcamp">Bootcamp</option>
                    <option value="test">Test</option>
                    <option value="onsite">Onsite Workshop</option>
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

              {setupMode === "bootcamp" && (
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

              {setupMode === "test" && (
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
                      <Form.Label className="filter-label">Batch (multiple selection)</Form.Label>
                      <MultiSelectDropdown
                        options={BATCHES}
                        selected={batches}
                        onChange={setBatches}
                        placeholder="Select batches"
                      />
                    </Col>
                  </Row>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label className="filter-label">Test Type</Form.Label>
                      <Form.Select value={testType} onChange={(e) => setTestType(e.target.value)}>
                        {TEST_TYPES.map((tt) => (
                          <option key={tt} value={tt}>
                            {tt}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="filter-label">Select Test</Form.Label>
                      <Form.Select
                        value={selectedTest}
                        onChange={(e) => setSelectedTest(e.target.value)}
                      >
                        {filteredTests.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </>
              )}

              {setupMode === "onsite" && (
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
                      <Form.Label className="filter-label">Batch (multiple selection)</Form.Label>
                      <MultiSelectDropdown
                        options={BATCHES}
                        selected={batches}
                        onChange={setBatches}
                        placeholder="Select batches"
                      />
                    </Col>
                  </Row>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label className="filter-label">Select Subject</Form.Label>
                      <Form.Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </>
              )}

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Button className="btn-brand" onClick={handleOpenGroupModal}>
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
          <Modal.Title>Automatic Group Split</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {splitError ? (
            <Alert variant="danger" className="mb-0">
              {splitError}
            </Alert>
          ) : (
            <>
              <p className="mb-2">
                <strong>{totalStudents}</strong> students will be split into{" "}
                <strong>{groupSizes.length}</strong> group{groupSizes.length !== 1 ? "s" : ""} (max
                20 students per group):
              </p>
              <p className="text-muted mb-0">
                {groupSizes.map((size, i) => `Group ${i + 1}: ${size}`).join(" · ")}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowGroupModal(false)}>
            Cancel
          </Button>
          <Button
            className="btn-brand"
            onClick={handleGenerateGroups}
            disabled={!!splitError || groupSizes.length === 0}
          >
            Generate Groups
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
