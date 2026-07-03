import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  ATTENDANCE_IMAGES,
  buildStudentImageSet,
  DEFAULT_TIMER_SECONDS,
} from "../../data/mockData";

type AttendanceResult = "present" | "absent" | null;

function pickRandomImageId(): string {
  return ATTENDANCE_IMAGES[Math.floor(Math.random() * ATTENDANCE_IMAGES.length)].id;
}

export default function StudentAttendance() {
  const navigate = useNavigate();

  const [correctImageId, setCorrectImageId] = useState<string>(() => pickRandomImageId());
  const imageSet = useMemo(() => buildStudentImageSet(correctImageId), [correctImageId]);

  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS);
  const [isActive, setIsActive] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [result, setResult] = useState<AttendanceResult>(null);

  useEffect(() => {
    if (!isActive || timerSeconds <= 0 || result) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timerSeconds, result]);

  useEffect(() => {
    if (timerSeconds <= 0 && !result && isActive) {
      setResult("absent");
      setIsActive(false);
    }
  }, [timerSeconds, result, isActive]);

  const handleImageSelect = (imageId: string) => {
    if (result) return;
    setSelectedImageId(imageId);
    setResult(imageId === correctImageId ? "present" : "absent");
    setIsActive(false);
  };

  const handleRetry = () => {
    setCorrectImageId(pickRandomImageId());
    setSelectedImageId(null);
    setResult(null);
    setTimerSeconds(DEFAULT_TIMER_SECONDS);
    setIsActive(true);
  };

  return (
    <>
      <Header title="Mark Attendance" />
      <main className="app-main">
        <Container>
          <Card className="section-card">
            <Card.Body className="p-4 text-center">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h2 className="page-title mb-0">Mark Your Attendance</h2>
                <Badge
                  bg={timerSeconds > 0 && !result ? "primary" : "secondary"}
                  className="timer-badge"
                >
                  {result
                    ? "Completed"
                    : timerSeconds > 0
                      ? `${timerSeconds}s remaining`
                      : "Time Up"}
                </Badge>
              </div>

              <p className="text-muted mb-4">
                Your trainer is showing an image live in the class. Select the image below
                that matches the one the trainer is showing.
              </p>

              <Row className="g-4 justify-content-center mb-4">
                {imageSet.map((img) => {
                  const isSelected = selectedImageId === img.id;
                  let tileClass = "attendance-image-tile";
                  if (isSelected && result === "present") tileClass += " correct";
                  if (isSelected && result === "absent") tileClass += " wrong";
                  if (isSelected) tileClass += " selected";

                  return (
                    <Col xs={6} md={4} lg={3} key={img.id} className="text-center">
                      <img
                        src={img.src}
                        alt="Attendance option"
                        className={tileClass}
                        onClick={() => handleImageSelect(img.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleImageSelect(img.id)}
                      />
                    </Col>
                  );
                })}
              </Row>

              {result === "present" && (
                <Alert variant="success" className="fw-bold">
                  Attendance Marked — Present
                </Alert>
              )}
              {result === "absent" && (
                <Alert variant="danger" className="fw-bold">
                  Attendance Not Marked — Absent
                  {selectedImageId && selectedImageId !== correctImageId && (
                    <span className="d-block fw-normal mt-1">Reason: Selected wrong image</span>
                  )}
                  {!selectedImageId && (
                    <span className="d-block fw-normal mt-1">Reason: Time ran out</span>
                  )}
                </Alert>
              )}

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                {result && (
                  <Button className="btn-brand" onClick={handleRetry}>
                    Try Again
                  </Button>
                )}
                <Button variant="outline-brand" onClick={() => navigate("/student/report")}>
                  View My Report
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>
    </>
  );
}
