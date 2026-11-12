import { Container, Row } from "react-bootstrap";
import { MainNavbar } from "../Navs/MainNavbar";
import { useEffect, useState } from "react";
import { HomeSidebar } from "./HomeSidebar";
import { useDispatch, useSelector } from "react-redux";
import { Dashboard } from "./DashBoard";
import { RicercaGare } from "./RicercaGare";
import { useLocation, useNavigate } from "react-router-dom";
import { NewsPage } from "./NewsPage";
import { useTour } from "@reactour/tour";
import { supabase } from "../../supabase.js";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";

const HomePage = ({ steps }) => {
  const sidebarAction = useSelector((state) => state.sideBarAction);
  const [isLoading, setIsLoading] = useState(false);
  const goForStep1 = useSelector(
    (state) => state.tutorial.hasUserCompletedFirstStep
  );
  const notify = (text) => toast(text);

  const user = useSelector((state) => state.userData);
  const navigate = useNavigate();
  const { setIsOpen } = useTour();
  const { setSteps } = useTour();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);

  async function getUserData() {
    setIsLoading(true);
    try {
      let uid = null;
      if (!uid) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          navigate("/unauthorized");
          return {
            status: false,
            msg: "Utente non autenticato",
            data: null,
          };
        }
        uid = data.user.id;
      }

      const { data, error } = await supabase.rpc("get_user_data", {
        user_id: uid,
      });

      if (error) throw error;
      setTimeout(() => {
        dispatch({ type: "SET_USER", payload: [data.data] });
        setIsLoading(false);
        setTimeout(() => {
          notify(`🚀 Bentornato, ${data.data.name}`);
        }, 2000);
      }, 2000);

      return data;
    } catch (error) {
      setIsLoading(false);
      return {
        status: false,
        msg: `Errore nella chiamata di get_user_data: ${error.message}`,
        data: null,
      };
    }
  }

  useEffect(() => {
    dispatch({ type: "SET_LOCATION", payload: "/home" });
    if (user.length > 0) {
      if (!goForStep1) {
        if (steps.length > 0) {
          setSteps(steps);
          setTimeout(() => {
            setIsOpen(true);
          }, 3000);
        }
      }
    }
  }, [steps]);

  useEffect(() => {
    if (!user.length > 0) {
      getUserData();
    }
  }, []);

  return (
    <>
      {user.length > 0 && (
        <>
          <MainNavbar darkMode={darkMode} />
          <Container fluid className={darkMode && "back-dark"}>
            <Row className="d-flex main-row">
              <ToastContainer
                position="top-center"
                autoClose={4000}
                pauseOnHover={false}
              />
              <HomeSidebar darkMode={darkMode} />
              {sidebarAction === "DASH" && <Dashboard darkMode={darkMode} />}
              {sidebarAction === "GARE" && <RicercaGare darkMode={darkMode} />}
              {sidebarAction === "NEWS" && <NewsPage darkMode={darkMode} />}
            </Row>
          </Container>
        </>
      )}

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export { HomePage };
