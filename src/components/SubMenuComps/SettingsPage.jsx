import { Col, Container, Row } from "react-bootstrap";
import { MainNavbar } from "../Navs/MainNavbar";
import { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { ProfileSection } from "./ProfileSection";
import { AdditionalInfo } from "./AdditionalInfo";
import { DocumentsSection } from "./DocumentsSection";
import { Subscriptions } from "./Subscriptions";
import { Security } from "./Security";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TourProvider, useTour } from "@reactour/tour";

const SettingsPage = ({ steps }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData);
  const navigate = useNavigate();
  const value = useSelector((state) => state.settingsTabValue);
  const { setIsOpen } = useTour();
  const { setSteps } = useTour();
  const darkMode = useSelector((state) => state.darkMode);

  const goForStep2 = useSelector(
    (state) => state.tutorial.hasUserCompletedSecondStep
  );

  const handleChange = (event, newValue) => {
    dispatch({ type: "SET_TAB_VALUE_SETTINGS", payload: newValue });
  };

  useEffect(() => {
    dispatch({ type: "SET_LOCATION", payload: "/settings" });
    if (user.length > 0) {
      if (steps.length > 0 && !goForStep2) {
        setSteps(steps);
        setTimeout(() => {
          setIsOpen(true);
        }, 2000);
      }
    } else {
      navigate("/nowhere");
    }
    return () => {
      dispatch({ type: "SET_TAB_VALUE_SETTINGS", payload: "one" });
    };
  }, []);

  return (
    <>
      <MainNavbar darkMode={darkMode} />
      <Container
        fluid
        className={`pt-4 pb-3 px-md-5 ${darkMode && "back-dark"}`}
      >
        <Row className="mt-5 flex-column">
          <Col className="d-flex flex-column">
            <Box
              sx={{ maxWidth: { xs: 400, sm: 890 } }}
              className="align-self-center"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="ricerca gare tabs"
                allowScrollButtonsMobile
                scrollButtons
                variant="scrollable"
                indicatorColor="inherit"
                textColor="inherit"
                sx={{
                  "& .MuiTab-root": {
                    color: "gray",
                  },
                  "& .Mui-selected": {
                    color: darkMode ? "#ffff" : "#17726d",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: darkMode ? "#ffff" : "#17726d",
                  },
                  "& .MuiTabs-indicatorSpan": {
                    backgroundColor: "#635ee7",
                  },
                }}
              >
                <Tab value="one" label="Profilo" />
                <Tab value="two" label="Info aggiuntive" />
                <Tab value="three" label="Documenti" />
                <Tab value="four" label="Sicurezza" />
                <Tab value="five" label="Abbonamento" />
              </Tabs>
            </Box>
          </Col>
          <Col>
            {value === "one" && <ProfileSection darkMode={darkMode} />}
            {value === "two" && <AdditionalInfo />}
            {value === "three" && <DocumentsSection />}
            {value === "four" && <Security />}
            {value === "five" && <Subscriptions />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export { SettingsPage };
