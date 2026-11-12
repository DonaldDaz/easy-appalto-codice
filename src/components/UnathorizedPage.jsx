import { Button, Col, Container, Row } from "react-bootstrap";
import noauth from "../assets/media/img/noauth.jpg";
import logo from "../assets/media/img/logo_cut.jpeg";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Row className="align-items-center justify-content-center pb-5">
        <div className="align-self-start mb-4 mb-md-0 d-flex align-items-center py-1">
          <img alt="logo" src={logo} width={70} />
          <h2 className="text-primary ms-3">EasyAppalto.it</h2>
        </div>
        <Col className="col-10 d-flex flex-column align-items-center mt-5 pt-md-5">
          <h2 className="text-center">
            Ops! Non sei autorizzato a vedere questa pagina. 😰
            <br></br>
            Torna alla home ed effettua il login.
          </h2>
          <img alt="not found" src={noauth} width={300} />
          <Button
            variant="warning"
            className="shadow rounded-4 mt-2"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export { UnauthorizedPage };
