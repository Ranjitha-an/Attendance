import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import EUImage from "../assets/EU.png";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <Navbar fixed="top" expand="lg" className="app-header px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center p-0">
          <div className="brand-logo-box d-flex align-items-center justify-content-center fw-bold p-0 pe-2 flex-shrink-0">
            <img src={EUImage} alt="EU" className="brand-logo-img" />
            <div className="brand-logo-text d-flex flex-column">
              <span>EXSKILENCE</span>
              <span>UPSKILLING</span>
            </div>
          </div>
        </Navbar.Brand>
        {title && (
          <Navbar.Text className="ms-3 page-title d-none d-md-block">{title}</Navbar.Text>
        )}
      </Container>
    </Navbar>
  );
}
