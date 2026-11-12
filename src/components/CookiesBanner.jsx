import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import cookieImg from "../assets/media/img/cookie.png";

const CookiesBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const cookiesAccpted = useSelector((state) => state.cookiesAccepted);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === "/home" || location.pathname === "/settings") {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, []);

  return (
    <>
      {showBanner && !cookiesAccpted && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ backgroundColor: "#283553", width: "93%" }}
          className="fixed-bottom py-5 pt-4 text-white d-flex flex-column flex-md-row shadow-top px-md-3 mx-auto rounded-top-5"
        >
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex align-items-center me-md-auto mb-md-3">
              <img alt="cookie-banner-logo" src={cookieImg} width={50} />
              <p className="fs-3">Questo sito utilizza i cookies </p>
            </div>

            <p className="px-3 text-center">
              Utilizziamo i cookie per migliorare la tua esperienza di
              navigazione, analizzare il traffico del sito e personalizzare i
              contenuti. <br></br>Cliccando su 'Accetta', acconsenti all'uso di
              tutti i cookie. Puoi gestire le tue preferenze in qualsiasi
              momento.
            </p>
          </div>

          <div className="d-flex align-items-center ms-md-auto me-md-3 justify-content-center mt-4 mt-md-0">
            <Button
              className="rounded-4 shadow"
              variant="contained"
              color="success"
              onClick={() => {
                setTimeout(() => {
                  dispatch({ type: "ACCEPT_COOKIES", payload: true });
                }, 150);
              }}
            >
              Accetta
            </Button>
            <Button
              className="rounded-4 shadow ms-2"
              variant="contained"
              color="error"
            >
              Rifiuta
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export { CookiesBanner };
