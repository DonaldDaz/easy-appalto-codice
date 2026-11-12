import { act, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Modal } from "react-bootstrap";
import { Button, Switch } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PolicyIcon from "@mui/icons-material/Policy";
import NoEncryptionOutlinedIcon from "@mui/icons-material/NoEncryptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
const Security = () => {
  const user = useSelector((state) => state.userData);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");

  useEffect(() => {
    if (!user.length > 0) {
      navigate("/nowhere");
    }
  }, []);

  return (
    <div className="mt-5 d-flex flex-column pb-5 px-md-5 security-section">
      <p className="fs-4 d-flex align-items-center">
        <ManageAccountsOutlinedIcon className="fs-3 me-2" /> Sicurezza
        dell'account
      </p>
      <div className="d-flex justify-content-between mt-3 col-md-6 mx-md-auto align-items-center">
        <p>Email di registrazione:</p>
        <p>
          {user[0].email}{" "}
          <BorderColorIcon
            className="fs-2 ms-2 border border-1 p-1 rounded-3 pointer"
            onClick={() => {
              setAction("email");
              setShowModal(true);
            }}
          />
        </p>
      </div>
      <div className="d-flex justify-content-between mt-2 col-md-6 mx-md-auto">
        <p>Password:</p>
        <p
          className="text-decoration-underline text-primary pointer"
          onClick={() => {
            setAction("password");
            setShowModal(true);
          }}
        >
          Reset Password
        </p>
      </div>
      <hr className="my-3"></hr>
      <p className="fs-4 d-flex align-items-center">
        <FactCheckOutlinedIcon className="fs-3 me-2" /> Controllo Accessi e
        Notifiche
      </p>
      <div className="d-flex justify-content-between mt-3 col-md-6 mx-md-auto align-items-center">
        <p>Notifiche di sicurezza via email</p>
        <Switch color="success" />
      </div>
      <div className="d-flex justify-content-between mt-2 col-md-6 mx-md-auto align-items-center">
        <p>Notifiche bandi giornalieri via email</p>
        <Switch color="success" />
      </div>
      <div className="d-flex justify-content-between mt-2 col-md-6 mx-md-auto align-items-center">
        <p>Sessioni attive</p>
        <p className="text-decoration-underline text-secondary pointer me-2 d-flex align-items-center">
          Visualizza
          <PolicyIcon />
        </p>
      </div>
      <hr className="my-3"></hr>
      <p className="fs-4 d-flex align-items-center">
        <NoEncryptionOutlinedIcon className="fs-3 me-2" />
        Gestione account
      </p>
      <div className="d-flex justify-content-between mt-3 col-md-6 mx-md-auto align-items-center">
        <p>
          Stato Account: <span className="text-success">Attivo</span>
        </p>
        <p className="text-decoration-underline text-danger pointer">
          Elimina account <WarningAmberIcon />
        </p>
      </div>
      <div className="d-flex justify-content-between mt-2 col-md-6 mx-md-auto align-items-center">
        <p>Email di recupero:</p>
        <BorderColorIcon
          className="fs-2 ms-2 border border-1 p-1 rounded-3 pointer"
          onClick={() => {
            setAction("email");
            setShowModal(true);
          }}
        />
      </div>
      <div className="d-flex justify-content-between mt-2 col-md-6 mx-md-auto align-items-center">
        <p>Scarica una copia dei tuoi dati</p>
        <p className="text-decoration-underline text-secondary pointer me-2 d-flex align-items-center">
          Scarica
          <FileDownloadOutlinedIcon />
        </p>
      </div>
      <hr className="my-3"></hr>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p>
              {action === "email"
                ? "Aggiorna il tuo indirizzo email"
                : "Reset della password"}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {action === "password" && (
            <p>Vuoi effettuare il reset della password?</p>
          )}
          {action === "email" && <p>Vuoi effettuare il reset dell'email?</p>}
          Clicca sul tasto conferma e apri il link inviato all'indirizzo email
          che usi attualmente.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outlined"
            color="success"
            className="rounded-4 shadow me-2"
            onClick={() => setShowModal(false)}
          >
            Chiudi
          </Button>

          <Button variant="outlined" color="error" className="rounded-4 shadow">
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { Security };
