import { Badge, Box, Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Col, Modal } from "react-bootstrap";
import { RicercaLavori } from "./Ricerca gare comps/RicercaLavori";
import { RicercaServizi } from "./Ricerca gare comps/RicercaServizi";
import { useDispatch, useSelector } from "react-redux";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const RicercaGare = ({ darkMode }) => {
  const [value, setValue] = useState("one");
  const bandi = useSelector((state) => state.favBandi);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Col className="mt-5 me-md-4 d-flex flex-column px-0 px-md-2 py-2">
      <Box className="align-self-center">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="ricerca gare tabs"
          indicatorColor="inherit"
          textColor="inherit"
          sx={{
            "& .MuiTab-root": {
              color: "gray", // Colore testo dei tab non selezionati
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
          <Tab value="one" label="Lavori" />
          <Tab value="two" label="Forniture e servizi" />
        </Tabs>
      </Box>
      {value === "one" && <RicercaLavori darkMode={darkMode} />}
      {value === "two" && <RicercaServizi darkMode={darkMode} />}
    </Col>
  );
};

export { RicercaGare };
