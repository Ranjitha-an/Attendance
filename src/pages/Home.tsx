import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero d-flex align-items-center">
      <Container>
        <Row className="justify-content-center align-items-center g-4">
          <Col lg={6} className="text-center text-lg-start">
            <h1 className="display-4 fw-bold home-hero-text mb-3">Exskilence</h1>
            <p className="home-tagline fs-4 mb-4">
              <em>...Because Opportunity is a Right</em>
            </p>
            <p className="home-hero-text fs-5 lh-base mb-0">
              Attendance system for trainers and students. Select your role to begin the
              attendance flow.
            </p>
          </Col>
          <Col lg={5}>
            <Row className="g-4">
              <Col sm={6}>
                <Card
                  className="section-card role-card h-100 text-center p-4"
                  onClick={() => navigate("/student")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/student")}
                >
                  <Card.Body>
                    <FaUserGraduate className="role-card-icon mb-3" />
                    <Card.Title className="fw-bold">Student</Card.Title>
                    <Card.Text className="text-muted">
                      Guess the trainer's image and mark your attendance
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6}>
                <Card
                  className="section-card role-card h-100 text-center p-4"
                  onClick={() => navigate("/trainer/setup")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/trainer/setup")}
                >
                  <Card.Body>
                    <FaChalkboardTeacher className="role-card-icon mb-3" />
                    <Card.Title className="fw-bold">Trainer</Card.Title>
                    <Card.Text className="text-muted">
                      Setup session, trigger attendance and view reports
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
