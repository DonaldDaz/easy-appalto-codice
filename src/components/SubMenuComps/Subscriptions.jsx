import { Button } from "@mui/material";
import abbonamenti from "../../utils/json/abbonamento.json";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Modal } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { addDays, addMonths, format, parseISO } from "date-fns";
import { da, it } from "date-fns/locale";
import { supabase } from "../../supabase.js";
const Subscriptions = () => {
  const user = useSelector((state) => state.userData);
  const subscription = useSelector((state) => state.subscription);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState(null);
  const dispatch = useDispatch();

  async function insertFreeSubscription() {
    setLoading(true);
    try {
      // Se non viene fornito userId, usa l'utente corrente
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        navigate("/unauthorized");
        return {
          status: false,
          msg: "Utente non autenticato",
          data: null,
        };
      }
      const uid = userData.user.id;
      const now = new Date();
      const enddate = addDays(now, 30);

      // Formatta le date
      const formattedStartDate =
        now instanceof Date ? now.toISOString().split("T")[0] : now;

      const formattedEndDate =
        enddate instanceof Date ? enddate.toISOString().split("T")[0] : enddate;

      // Chiamata alla funzione Supabase
      const { data, error } = await supabase.rpc(
        "insert_or_update_subscription",
        {
          p_user_id: uid,
          p_is_subscribed: true,
          p_subscription_type: 0,
          p_subscription_start_date: formattedStartDate,
          p_subscription_end_date: formattedEndDate,
        }
      );

      if (error) throw error;
      setTimeout(() => {
        dispatch({ type: "ADD_SUBSCR", payload: [data.data] });
        setLoading(false);
        setTipo(null);
      }, 2000);
      return data;
    } catch (error) {
      setLoading(false);
      setTipo(null);
      return {
        status: false,
        msg: `Errore nella chiamata di insert_or_update_subscription: ${error.message}`,
        data: null,
      };
    }
  }

  const openModal = (type) => {
    if (type) {
      if (type === "cancel") {
        setModalType("cancel");
      } else if (type === "bills") {
        setModalData([]);
        setModalType("bills");
      }

      setShowModal(true);
    }
  };

  const getSubscription2 = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        navigate("/unauthorized");
        return { status: false, msg: "Utente non autenticato", data: null };
      }

      const uid = userData.user.id;

      // Query diretta sulla tabella subscriptions
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", uid)
        .single();

      if (error) throw error;

      dispatch({ type: "ADD_SUBSCR", payload: [data] });
      return { status: true, msg: "Dati recuperati con successo", data };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        msg: `Errore nella chiamata di get_subscription: ${error.message}`,
        data: null,
      };
    }
  };

  useEffect(() => {
    if (!user.length > 0) {
      navigate("/nowhere");
    }
    if (!subscription.length > 0) {
      getSubscription2();
    }
    //insertFreeSubscription();
  }, []);

  return (
    <div className="mt-5 d-flex flex-column flex-md-row py-5 align-items-center subscription-section row justify-content-around">
      {subscription.length > 0 ? (
        <div className="d-flex flex-column flex-grow-1">
          <h3 className="text-center">Gestisci il tuo abbonamento</h3>
          <div className="mt-3 rounded-4 shadow py-4">
            <div className="d-flex justify-content-between px-md-5 flex-wrap px-3">
              <div>
                <p>Stato abbonamento</p>
                <p className="fw-bold text-success">Attivo</p>
              </div>
              <div>
                <p>Tipo abbonamento</p>
                <p className="fw-bold">
                  {subscription[0].subscription_type === 1
                    ? "Mensile"
                    : subscription[0].subscription_type === 2
                    ? "Trimestrale"
                    : subscription[0].subscription_type === 3
                    ? "Annuale"
                    : "Trial 30 giorni"}
                </p>
              </div>

              <div>
                <p>Scadenza</p>
                <p className="fw-bold text-danger">
                  {format(
                    parseISO(subscription[0].subscription_end_date),
                    "dd/MM/yyyy"
                  )}
                </p>
              </div>
            </div>
            <hr className="mx-auto" style={{ width: "90%" }}></hr>
            <div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: show ? "100px" : "0px" }}
                transition={{ duration: 0.3 }}
              >
                {show && (
                  <>
                    <div className="px-md-5 d-flex px-4 justify-content-between mx-auto flex-wrap">
                      <div>
                        <p>Costo</p>
                        <p className="fw-bold">
                          {subscription[0].subscription_type === 1
                            ? "100 €"
                            : subscription[0].subscription_type === 2
                            ? "300 €"
                            : subscription[0].subscription_type === 3
                            ? "400 €"
                            : "Gratuito"}
                        </p>
                      </div>
                      <div>
                        <p>Data abbonamento</p>
                        <p className="fw-bold">
                          {format(
                            parseISO(subscription[0].subscription_start_date),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      </div>
                      <div className="d-flex flex-column mt-3 mt-md-0">
                        <p
                          className="text-decoration-underline pointer"
                          onClick={() => openModal("bills")}
                        >
                          Fatturazioni
                        </p>
                        <p
                          className="text-decoration-underline text-success pointer"
                          onClick={() => {
                            openModal("cancel");
                          }}
                        >
                          Modifica il tuo piano
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {modalType === "cancel"
                      ? "Modifica il tuo piano"
                      : "Le tue fatturazioni"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {modalType === "cancel"
                    ? "Sei sicuro di voler eliminare il tuo abbonamento? Cliccando sul tasto conferma perderai tutti i tuoi vantaggi!"
                    : "fatture"}
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
                  {modalType === "cancel" && (
                    <Button
                      variant="outlined"
                      color="error"
                      className="rounded-4 shadow"
                      onClick={() => {
                        setShowModal(false);
                      }}
                    >
                      Conferma
                    </Button>
                  )}
                </Modal.Footer>
              </Modal>
            </div>
            <div
              className="mt-5 mt-md-0 ms-2 text-center pointer"
              onClick={() => {
                setShow(!show);
              }}
            >
              <p className="mb-2">Gestisci abbonamento</p>
              <ArrowBackIosIcon
                className={show ? "rotate-up fs-2" : "rotate-down fs-2"}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <h4 className="text-center mb-3">
            Attiva ora il tuo piano gratuito da 30 giorni...
          </h4>
          {abbonamenti.slice(0, 1).map((abbo, i) => {
            return (
              <motion.div
                key={i}
                className="d-flex flex-column p-4 rounded-4 shadow mt-1 mb-5 mx-2 col-12"
                style={{
                  height: "300px",
                }}
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 className="text-center">{abbo.tipoAbbonamento}</h3>

                <div className="mt-4 col-md-4 mx-auto">
                  {loading && tipo === 0 ? (
                    <LoadingButton
                      fullWidth
                      loading
                      variant="contained"
                      className="rounded-4 shadow"
                      color="error"
                    >
                      Inizia ora
                    </LoadingButton>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      className="rounded-4 shadow"
                      onClick={() => {
                        setTipo(0);
                        insertFreeSubscription();
                      }}
                    >
                      Inizia ora
                    </Button>
                  )}
                </div>
                <div className="mt-5">
                  <p>Cosa è incluso?</p>
                  <ul className="list-unstyled mt-4 fw-light">
                    {abbo.serviziInclusi.map((serv, i) => {
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
          <>
            <h4 className="text-center mb-3">
              Oppure scegli il piano che fa per te!
            </h4>
            {abbonamenti.slice(1, 4).map((abb, i) => {
              return (
                <motion.div
                  key={i}
                  className="d-flex flex-column p-4 rounded-4 shadow mt-5 mt-md-2 mx-2 col-md-3 col-8 col-lg-3"
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
                  <div className="mt-4">
                    {loading && i === tipo ? (
                      <LoadingButton
                        fullWidth
                        loading
                        variant="contained"
                        className="rounded-4 shadow"
                        color="error"
                      >
                        {" "}
                        Inizia ora
                      </LoadingButton>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        className="rounded-4 shadow"
                        onClick={() => {
                          setTipo(i);
                        }}
                      >
                        Inizia ora
                      </Button>
                    )}
                  </div>
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
          </>
        </>
      )}
    </div>
  );
};

export { Subscriptions };
