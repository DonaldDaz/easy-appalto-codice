import {
  Card,
  Col,
  Container,
  Form,
  Modal,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import logo from "../assets/media/img/logo_cut.jpeg";
import auction from "../assets/media/img/auction.jpg";
import payment from "../assets/media/img/payment.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { motion } from "motion/react";
import services from "../utils/json/services.json";
import about from "../utils/json/about.json";
import company from "../assets/media/img/company.svg";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import Filter4Icon from "@mui/icons-material/Filter4";
import contacts from "../assets/media/img/contacts.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedText } from "./Animations/AnimatedText";
import CheckIcon from "@mui/icons-material/Check";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
} from "@mui/material";
import abbonamenti from "../utils/json/abbonamento.json";
import { Button as MuiButton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./CarouselComps/EmblaCarouselArrowButtons";
import {
  DotButton,
  useDotButton,
} from "./CarouselComps/EmblaCarouselDotButton";
import "../style/embla.css";
import img1 from "../assets/media/img/id1.jpg";
import img2 from "../assets/media/img/id2.jpg";
import img3 from "../assets/media/img/id3.jpg";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [details, setDetails] = useState(null);
  const options = { dragFree: true, loop: true };
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const accordionRef = useRef(null);
  const iconToShow = (index) => {
    switch (index) {
      case 1:
        return <Filter1Icon />;
      case 2:
        return <Filter2Icon />;
      case 3:
        return <Filter3Icon />;
      case 4:
        return <Filter4Icon />;
    }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__parallax__layer");
    });
  }, []);

  const TWEEN_FACTOR_BASE = 0.2;

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const handleShowMoreDetails = (serv) => {
    setDetails(serv.details);
    setShowMore(true);
  };

  const tweenParallax = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
        const tweenNode = tweenNodes.current[slideIndex];
        tweenNode.style.transform = `translateX(${translate}%)`;
      });
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("slideFocus", tweenParallax);
  }, [emblaApi, tweenParallax]);

  return (
    <Container fluid className="landing-cont">
      <Row className="flex-column landing-row bg-primary overflow-x-hidden">
        <Col className="p-0 landing-nav-cont  sticky-top shadow">
          <Navbar expand="lg" className="bg-white p-0">
            <Container>
              <Navbar.Brand>
                <img
                  src={logo}
                  width="70"
                  // height="65"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                  style={{ objectFit: "contain" }}
                />
              </Navbar.Brand>
              <AnimatedText text="EasyAppalto.it" />
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="landing-nav">
                <Nav className="ms-auto">
                  <Nav.Link href="#servizi" className="me-lg-3 ms-auto ms-md-0">
                    Servizi
                  </Nav.Link>
                  <Nav.Link href="#costi" className="me-lg-3 ms-auto ms-md-0">
                    Costi
                  </Nav.Link>
                  <Nav.Link href="#about" className="me-lg-3 ms-auto ms-md-0">
                    Su di noi
                  </Nav.Link>
                  <Nav.Link
                    href="#contatti"
                    className="me-lg-3 ms-auto ms-md-0"
                  >
                    Contatti
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
        <Col className="mt-1 py-5 d-flex flex-column flex-md-row align-items-center justify-content-around">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <div className="text-center text-md-start text-white">
              <h1>Tutto sugli appalti</h1>
              <p>
                Unisciti al network che semplifica l’accesso ai bandi pubblici
                per le PMI
              </p>
            </div>
            <div className="mt-3">
              <MuiButton
                variant="contained"
                color="warning"
                className="warning rounded-4 me-3 shadow"
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                Accedi o registrati
              </MuiButton>
            </div>
          </div>
          <div>
            <img
              alt="construction"
              src={auction}
              width="300"
              height="300"
              className="rounded-circle mt-md-0 mt-4"
              style={{ border: "3px solid white", objectFit: "cover" }}
            />
          </div>
        </Col>
        <Col className="col py-4 pb-5 px-0" id="servizi">
          <h3 className="text-white my-3 ms-3 mb-4">
            Esplora i nostri servizi
          </h3>
          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container py-3">
                {services.map((serv, index) => (
                  <div className="embla__slide" key={index}>
                    <div className="embla__parallax shadow">
                      <div
                        className="embla__parallax__layer d-flex flex-column"
                        style={{
                          backgroundImage: `url(${
                            index === 0 ? img1 : index === 1 ? img2 : img3
                          })`,
                          height: "320px",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPositionY: "50%",
                        }}
                      >
                        <div className="mt-auto text-white p-3 text-carousel">
                          <h5
                            className="fw-bold"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            {serv.title}
                          </h5>
                          <p className="fw-light">{serv.subtitle}</p>
                          <div className="mt-2 ms-auto me-2">
                            <MuiButton
                              variant="outlined"
                              color="dark"
                              className="rounded-4 shadow"
                              onClick={() => handleShowMoreDetails(serv)}
                            >
                              Scopri di più
                            </MuiButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="embla__controls">
              <div className="embla__buttons">
                <PrevButton
                  onClick={onPrevButtonClick}
                  disabled={prevBtnDisabled}
                />
                <NextButton
                  onClick={onNextButtonClick}
                  disabled={nextBtnDisabled}
                />
              </div>

              <div className="embla__dots">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={"embla__dot".concat(
                      index === selectedIndex ? " embla__dot--selected" : ""
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </Col>
        <Col
          className="d-flex flex-md-row flex-column bg-white align-items-center justify-content-md-around pt-4 pt-md-5"
          id="costi"
        >
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, stiffness: 100, type: "spring" }}
            className="d-flex flex-column align-items-center mt-md-0 mt-5"
          >
            <h2 className="text-primary">Meno costi.</h2>
            <h2>Scegli il piano perfetto per te</h2>
            <p className="w-75 text-center">
              Inizia gratis, esplora i servizi e scegli l’abbonamento su misura
              per la tua impresa.
            </p>
            <MuiButton
              className="rounded-4 shadow mt-3"
              variant="outlined"
              color="success"
              onClick={() => {
                setShowPaymentDetails(!showPaymentDetails);
                setTimeout(() => {
                  accordionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }}
            >
              Vai ai prezzi
            </MuiButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              stiffness: 100,
              type: "spring",
              delay: 0.3,
            }}
            className="d-flex flex-column justify-content-center align-items-center justify-content-center"
          >
            <img alt="payment" src={payment} width="300" />
          </motion.div>
        </Col>
        <Accordion
          expanded={showPaymentDetails}
          className="accordion-landing bg-white pb-4"
          ref={accordionRef}
        >
          <AccordionSummary></AccordionSummary>
          <AccordionDetails className="d-flex align-items-center justify-content-around flex-md-row flex-column">
            {abbonamenti.slice(1, 4).map((abb, i) => {
              return (
                <motion.div
                  key={i}
                  className="d-flex flex-column p-4 rounded-4 shadow mt-5 mt-md-2 mx-2 col-md-3 col-10 col-lg-3"
                  style={{
                    height: "520px",
                  }}
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h3>{abb.tipoAbbonamento}</h3>
                  <div className="mt-4">
                    <h1 className="fw-bold">{abb.costo}€</h1>
                    <p>{abb.descrizione}</p>
                  </div>
                  <MuiButton
                    fullWidth
                    variant="outlined"
                    color="success"
                    className="rounded-4 shadow mt-3"
                    onClick={() => {
                      navigate("/sign-in");
                    }}
                  >
                    Inizia ora
                  </MuiButton>
                  <div className="mt-5">
                    <p>Cosa è incluso?</p>
                    <ul className="list-unstyled mt-4 fw-light">
                      {abb.serviziInclusi.map((serv, i) => {
                        return (
                          <li key={i} className="d-flex align-items-center">
                            <CheckIcon className="me-2" color="success" />{" "}
                            <span style={{ fontSize: "0.9em" }}>{serv}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </AccordionDetails>
        </Accordion>
        <Col id="about" className="col py-4 px-4 px-md-2">
          <h2 className="text-white text-center mt-4">Su di noi</h2>
          <div className="d-flex flex-md-row flex-column align-items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, stiffness: 100, type: "spring" }}
              className="d-flex justify-content-center"
            >
              <img alt="company" src={company} width="350" />
            </motion.div>
            <div className="d-flex flex-column flex-md-row flex-wrap">
              {about.map((section, i) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      stiffness: 50,
                      type: "spring",
                      delay: i * 0.2,
                    }}
                    key={section.id}
                    className="ms-md-3 w-45 mt-4 mt-md-3"
                  >
                    <div className="d-flex align-items-center">
                      {iconToShow(section.id)}
                      <p className="text-white fw-bold ms-2">{section.title}</p>
                    </div>

                    <p className="text-white">{section.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Col>
        <Col
          id="contatti"
          className="col py-4 pb-5 bg-white d-flex flex-md-row flex-column justify-content-around align-items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              stiffness: 50,
              type: "spring",
            }}
            className=" text-center"
          >
            <h2 className="text-center mt-4">Contattaci</h2>
            <img alt="contacts" src={contacts} width="300" />
          </motion.div>
          <div className="w-45">
            <Form className="mt-4 d-flex flex-column">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <TextField
                  label="Nome"
                  variant="outlined"
                  required
                  size="small"
                  color="success"
                  fullWidth
                />
                <TextField
                  label="Cognome"
                  variant="outlined"
                  required
                  size="small"
                  color="success"
                  className="my-3"
                  fullWidth
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  required
                  size="small"
                  color="success"
                  fullWidth
                  type="email"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <TextField
                  color="success"
                  fullWidth
                  id="outlined-multiline-static"
                  label="Il tuo messaggio"
                  multiline
                  rows={4}
                  required
                />
              </Form.Group>
              <MuiButton
                className="rounded-4 shadow w-50 align-self-center"
                type="submit"
                variant="outlined"
                color="success"
              >
                Invia
              </MuiButton>
            </Form>
          </div>
        </Col>

        {scrollY > 30 && (
          <motion.div
            style={{ zIndex: 102 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            className="go-up rounded-circle shadow d-flex align-items-center justify-content-center bg-warning border border-black"
          >
            <ArrowUpwardIcon />
          </motion.div>
        )}
        <>
          {details && showMore && (
            <Modal show={showMore} size="lg">
              <Modal.Title className="p-3 text-center">
                <h4 className="fw-light">{details.mainTitle}</h4>
              </Modal.Title>

              <Modal.Body className="py-5">
                <ul className="list-unstyled">
                  {details.args.map((arg, i) => {
                    return (
                      <li key={i} className="d-flex align-items-center my-3">
                        <CheckCircleOutlineIcon
                          color="success"
                          className="me-2"
                        />
                        {arg}
                      </li>
                    );
                  })}
                </ul>
              </Modal.Body>
              <div
                style={{ backgroundColor: "#D4D4D4" }}
                className="py-2 d-flex rounded-bottom-3"
              >
                <MuiButton
                  onClick={() => {
                    setShowMore(false);
                  }}
                  variant="contained"
                  className="rounded-4 shadow ms-auto me-3"
                  color="success"
                >
                  Chiudi
                </MuiButton>
              </div>
            </Modal>
          )}
        </>
      </Row>
    </Container>
  );
};

export { LandingPage };
