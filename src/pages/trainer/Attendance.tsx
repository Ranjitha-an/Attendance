import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, ProgressBar, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
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
                <ProgressBar variant="warning" now={33} label={`Attendance No ${currentRound}`} />
                <ProgressBar variant="success" now={stats.presentPercent} label={`${stats.presentPercent}%`} />
                <ProgressBar variant="danger" now={stats.absentPercent} label={`${stats.absentPercent}%`} />
              </ProgressBar>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <Button variant="outline-brand" onClick={handleExtend}>
                  Extend (+{EXTEND_SECONDS}s)
                </Button>
                <Button variant="outline-secondary" onClick={handleRelaunch}>
                  Relaunch
                </Button>
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
    </>
  );
}
