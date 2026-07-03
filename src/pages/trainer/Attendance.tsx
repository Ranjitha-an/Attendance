import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Modal, ProgressBar, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Header from "../../components/Header";
import {
  DEFAULT_TIMER_SECONDS,
  EXTEND_SECONDS,
  generateGroups,
  getImageById,
  getRoundStats,
} from "../../data/mockData";
import type { AttendanceGroup } from "../../data/mockData";
import type { TrainerSetupState } from "../../types/attendance";

export default function Attendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const setupState = location.state as TrainerSetupState | null;
  const groupCount = setupState?.groupCount ?? 3;
  const currentRound = 1;

  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS);
  const [isActive, setIsActive] = useState(true);
  const [headCount, setHeadCount] = useState<number | "">("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [groups, setGroups] = useState<AttendanceGroup[]>(() =>
    setupState ? generateGroups(groupCount) : [],
  );
  const groupsGenerated = groups.length > 0;

  useEffect(() => {
    if (!isActive || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timerSeconds]);

  useEffect(() => {
    if (timerSeconds <= 0) setIsActive(false);
  }, [timerSeconds]);

  const stats = getRoundStats(currentRound);

  const handleRelaunch = () => {
    setGroups(generateGroups(groupCount));
    setTimerSeconds(DEFAULT_TIMER_SECONDS);
    setIsActive(true);
  };

  const handleExtend = () => {
    setTimerSeconds((prev) => prev + EXTEND_SECONDS);
    setIsActive(true);
  };

  const rasterizeImage = (src: string, size = 400): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });

  const handleDownloadPdf = async () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(16);
    pdf.text("Group Images", pageWidth / 2, 15, { align: "center" });

    const perRow = 3;
    const margin = 15;
    const gap = 12;
    const cellSize = (pageWidth - margin * 2 - gap * (perRow - 1)) / perRow;
    const rowHeight = cellSize + 25;
    let x = margin;
    let y = 25;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const image = getImageById(group.correctImageId);
      if (!image) continue;

      const png = await rasterizeImage(image.src);
      pdf.setFontSize(12);
      pdf.text(group.name, x + cellSize / 2, y + 5, { align: "center" });
      pdf.addImage(png, "PNG", x, y + 8, cellSize, cellSize);
      pdf.setFontSize(10);
      pdf.text(image.label, x + cellSize / 2, y + cellSize + 15, { align: "center" });

      if ((i + 1) % perRow === 0) {
        x = margin;
        y += rowHeight;
      } else {
        x += cellSize + gap;
      }
    }

    pdf.save("group-images.pdf");
  };

  return (
    <>
      <Header title="Attendance Dashboard" />
      <main className="app-main">
        <Container>
          {setupState && (
            <Card className="section-card mb-4">
              <Card.Body>
                <Row className="g-2">
                  <Col md={3}>
                    <span className="filter-label d-block">Course</span>
                    <strong>{setupState.course}</strong>
                  </Col>
                  <Col md={3}>
                    <span className="filter-label d-block">Batch</span>
                    <strong>{setupState.batches.join(", ")}</strong>
                  </Col>
                  <Col md={3}>
                    <span className="filter-label d-block">Purpose</span>
                    <strong>{setupState.purposeDetail}</strong>
                  </Col>
                  <Col md={3}>
                    <span className="filter-label d-block">Date</span>
                    <strong>{setupState.dateTime}</strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          <Card className="section-card mb-4">
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h2 className="page-title mb-0">Attendance No {currentRound}</h2>
                <Badge
                  bg={timerSeconds > 0 ? "primary" : "danger"}
                  className="timer-badge"
                >
                  {timerSeconds > 0 ? `${timerSeconds}s remaining` : "Time Up"}
                </Badge>
              </div>

              <ProgressBar className="mb-4">
                <ProgressBar variant="success" now={stats.presentPercent} label={`${stats.presentPercent}%`} />
                <ProgressBar variant="danger" now={stats.absentPercent} label={`${stats.absentPercent}%`} />
              </ProgressBar>

              <Row className="g-3 mb-4 align-items-end">
                <Col md={4}>
                  <Form.Label className="filter-label">Manual Head Count</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Enter number of students present"
                    value={headCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setHeadCount("");
                        return;
                      }
                      const num = Number(value);
                      if (!Number.isNaN(num) && num >= 0) setHeadCount(num);
                    }}
                  />
                  <Form.Text className="text-muted">
                    Count the students physically present and enter the total here.
                  </Form.Text>
                </Col>
                {headCount !== "" && (
                  <Col md={4}>
                    <div className="head-count-display rounded p-3">
                      <span className="filter-label d-block">Recorded Head Count</span>
                      <strong className="fs-4">{headCount}</strong>
                      <span className="text-muted ms-2">students present</span>
                    </div>
                  </Col>
                )}
              </Row>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <Button variant="outline-brand" onClick={handleExtend}>
                  Extend (+{EXTEND_SECONDS}s)
                </Button>
                <Button variant="outline-secondary" onClick={handleRelaunch}>
                  Relaunch
                </Button>
                {groupsGenerated && (
                  <Button variant="outline-brand" onClick={() => setShowPreviewModal(true)}>
                    Preview Images
                  </Button>
                )}
                <Button className="btn-brand" onClick={() => navigate("/trainer/report")}>
                  Report
                </Button>
              </div>

              {groupsGenerated && (
                <p className="text-muted mb-3">
                  Students split into {groups.length} group{groups.length > 1 ? "s" : ""}. Show
                  each group its image below.
                </p>
              )}

              {groupsGenerated && (
                <Row className="g-4">
                  {groups.map((group) => {
                    const correctImage = getImageById(group.correctImageId);
                    return (
                      <Col md={4} key={group.id}>
                        <Card className="group-card h-100">
                          <Card.Body className="text-center">
                            <h5 className="fw-bold mb-3">{group.name}</h5>
                            <p className="text-muted mb-2">
                              Students: {group.studentCount} | Show this image to group
                            </p>
                            {correctImage && (
                              <img
                                src={correctImage.src}
                                alt={correctImage.label}
                                className="trainer-shown-image mb-3"
                              />
                            )}
                            <div>
                              <Badge bg="success" className="me-2">
                                Present {stats.presentPercent}%
                              </Badge>
                              <Badge bg="danger">Absent {stats.absentPercent}%</Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}

              {!groupsGenerated && (
                <div className="text-center text-muted py-5">
                  Click &quot;Trigger Attendance&quot; to generate groups and release images.
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </main>

      <Modal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Group Images Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="preview-images-grid">
            <Row className="g-4 justify-content-center">
              {groups.map((group) => {
                const correctImage = getImageById(group.correctImageId);
                return (
                  <Col xs={6} md={4} key={group.id} className="text-center">
                    <h5 className="fw-bold mb-3">{group.name}</h5>
                    {correctImage && (
                      <img
                        src={correctImage.src}
                        alt={correctImage.label}
                        className="preview-group-image"
                      />
                    )}
                    <p className="text-muted mt-2 mb-0">{correctImage?.label}</p>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
          <Button className="btn-brand" onClick={handleDownloadPdf}>
            Download as PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
