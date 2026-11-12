import { Box, Tab } from "@mui/material";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import { SignIn } from "./SignIn-Up/SignIn";
import { SignUp } from "./SignIn-Up/SignUp";
import logo from "../assets/media/img/logo_cut.jpeg";
import { useNavigate } from "react-router-dom";
import { nav } from "motion/react-client";
import { AnimatedText } from "./Animations/AnimatedText";

const SignInOrSignUp = () => {
  const [value, setValue] = useState("1");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container fluid className="signin-cont vh-100 bg-primary">
      <Row className="justify-content-center align-items-center flex-column pb-5">
        <Col className="p-0 shadow mb-md-5">
          <Navbar expand="lg" className="bg-white p-0">
            <Container>
              <Navbar.Brand>
                <img
                  src={logo}
                  width="70"
                  onClick={() => {
                    navigate("/");
                  }}
                  className="d-inline-block align-top pointer"
                  alt="Logo"
                  style={{ objectFit: "contain" }}
                />
              </Navbar.Brand>

              <AnimatedText text="EasyAppalto.it" />
            </Container>
          </Navbar>
        </Col>
        <Col className="bg-white col-11 col-md-6 rounded-4 p-0 pt-2 mt-5 shadow sign-in">
          <Box sx={{ width: "100%" }} className="border-0 text-primary">
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "success" }}>
                <TabList onChange={handleChange} aria-label="lab API tabs">
                  <Tab label="Accedi" value="1" className="ms-auto w-50" />
                  <Tab label="Registrati" value="2" className="me-auto w-50" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <SignIn />
              </TabPanel>
              <TabPanel value="2" className="px-2">
                <SignUp />
              </TabPanel>
            </TabContext>
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export { SignInOrSignUp };
