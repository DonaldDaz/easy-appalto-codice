import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const FooterCustom = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/settings" && (
        <Container fluid className="footer-cont py-4 text-white">
          <Row className="flex-column flex-md-row mt-4 justify-content-between">
            <Col className="order-md-0 order-1">
              <ul className="list-unstyled d-flex flex-column align-items-center align-items-md-start mt-md-0 mt-2">
                <li>Contatti</li>
                <li>Assistenza Clienti</li>
                <li>Privacy</li>
                <li>Termini e condizioni</li>
                <li>Dicono di noi</li>
              </ul>
            </Col>
            <Col className="d-flex flex-column align-items-center mt-4 mt-md-0 order-md-0 order-3">
              <p className="text-center">
                Easyappalto S.r.l. - P. IVA 00000000000 <br></br> Tel.
                0984.0000000{" "}
              </p>
              <p className="text-center">
                87050 Figline Vegliaturo (CS) <br></br> C.S.: 10.000.000$
              </p>
            </Col>
            <Col className="mt-3 mt-md-0 d-flex flex-column align-items-center order-md-0 order-2 py-4 py-md-0">
              <h4>I nostri partner</h4>
              <div className="mt-2 logo-cont">
                <img
                  alt="logo1"
                  src="https://cdn.pixabay.com/photo/2023/02/01/00/54/company-7759278_1280.png"
                  width={100}
                  className="rounded-4"
                />
                <img
                  alt="logo2"
                  src="https://cdn.pixabay.com/photo/2023/02/01/00/54/company-7759278_1280.png"
                  width={100}
                  className="mx-2 rounded-4"
                />
                <img
                  alt="logo2"
                  src="https://cdn.pixabay.com/photo/2023/02/01/00/54/company-7759278_1280.png"
                  width={100}
                  className="rounded-4"
                />
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export { FooterCustom };
