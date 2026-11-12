import { Alert, AlertTitle } from "@mui/material";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const AlertBanner = () => {
  const show = useSelector((state) => state.alertBanner.show);
  const text = useSelector((state) => state.alertBanner.message);
  const type = useSelector((state) => state.alertBanner.type);

  const slideAnimation = {
    initial: { y: -100, opacity: 0 }, // Inizialmente fuori dallo schermo sopra
    animate: { y: 0, opacity: 1 }, // Entra scorrendo verso il basso
    exit: { y: -100, opacity: 0 }, // Esce scorrendo verso l'alto
    transition: { duration: 0.5, ease: "easeInOut" }, // Durata e easing
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="alert"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideAnimation}
          style={{
            zIndex: 20,
            position: "fixed",
            top: "10%",
            left: "10%",
            right: "10%",
            width: "80%",
          }}
        >
          <Alert className="rounded-4 shadow" severity={type}>
            <AlertTitle>
              {type === "success"
                ? "Operazione completata con successo!"
                : "C'è stato un errore!"}
            </AlertTitle>
            {text}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { AlertBanner };
