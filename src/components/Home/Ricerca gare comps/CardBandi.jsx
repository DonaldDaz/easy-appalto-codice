import { Alert, Button, Skeleton } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LaunchIcon from "@mui/icons-material/Launch";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import card_bg from "../../../assets/media/img/card_bg.png";
import { format } from "date-fns";
import { data } from "react-router-dom";

const CardBandi = ({ bando, darkMode }) => {
  const [dataToShow, setDataToShow] = useState(null);
  const dispatch = useDispatch();
  const favs = useSelector((state) => state.favBandi);

  useEffect(() => {
    setTimeout(() => {
      setDataToShow(bando);
    }, 2500);
  }, []);

  return (
    <div
      className="d-flex flex-column shadow-btm rounded-4 mt-3 col-md-9 mx-auto col-12 text-black mt-5"
      style={{ border: darkMode ? "1px solid gray" : "" }}
    >
      <div
        className="px-3 rounded-top-4 d-flex flex-column card-bg-cont"
        style={{ backgroundColor: "#f4f1ef" }}
      >
        <img src={card_bg} alt="easyappalto-bg-image" />
        <h4 className="fw-bold fs-5">
          {dataToShow ? (
            dataToShow.denominazione_amministrazione_appaltante
          ) : (
            <Skeleton />
          )}
        </h4>
      </div>
      <div
        className="p-3 d-flex flex-column rounded-bottom-4"
        style={{ backgroundColor: "#f4f1ef" }}
      >
        <p>{dataToShow ? dataToShow.oggetto_gara : <Skeleton />}</p>
        <div className="d-flex align-items-center mt-3">
          <p style={{ color: "green" }} className="me-md-5">
            Pubblicato il:{" "}
            {dataToShow ? (
              format(new Date(dataToShow.data_pubblicazione), "dd/MM/yyyy")
            ) : (
              <Skeleton />
            )}
          </p>
          <p style={{ color: "	#c1440e" }}>
            Scadenza:{" "}
            {dataToShow ? (
              format(new Date(dataToShow.data_scadenza_offerta), "dd/MM/yyyy")
            ) : (
              <Skeleton />
            )}
          </p>
          {dataToShow && (
            <>
              {dataToShow.oggetto_principale_contratto === "LAVORI" ? (
                <Button
                  className="ms-auto rounded-4 shadow"
                  variant="outlined"
                  color="dark"
                >
                  Proponi avvalimento
                </Button>
              ) : (
                <p className="ms-auto">
                  Tipo:{" "}
                  <span className="fw-bold">
                    {dataToShow.oggetto_principale_contratto}
                  </span>
                </p>
              )}
            </>
          )}
        </div>
        <div className="bg-white d-flex align-items-center mt-4 rounded-3 shadow flex-wrap py-2 justify-content-around">
          <div className="d-flex flex-column mx-2 col-md-2 col-4">
            <p className="fw-bold">Importo</p>
            {dataToShow ? (
              <p>{dataToShow.importo_complessivo_gara} €</p>
            ) : (
              <Skeleton />
            )}
          </div>
          <hr
            style={{ height: "40px", border: "1px solid gray" }}
            className="mx-2"
          ></hr>
          <div className="d-flex flex-column mx-2 col-md-2 col-4">
            <p className="fw-bold">Città</p>
            {dataToShow ? <p>{dataToShow.citta}</p> : <Skeleton />}
          </div>
          <hr
            style={{ height: "40px", border: "1px solid gray" }}
            className="mx-2"
          ></hr>

          <div className="d-flex flex-column mx-2 col-md-3 col-6">
            {dataToShow ? (
              <>
                <p className="fw-bold">Procedura</p>
                <p>{dataToShow.tipo_scelta_contraente}</p>
              </>
            ) : (
              <Skeleton />
            )}
          </div>
          <hr
            style={{ height: "40px", border: "1px solid gray" }}
            className="mx-2"
          ></hr>
          <div className="d-flex flex-column mx-2 col-md-2 col-4">
            {dataToShow ? (
              <>
                <p className="fw-bold">CIG</p>
                <p>{dataToShow.cig}</p>
              </>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="my-3 bg-white rounded-3 shadow d-flex p-2 align-items-center">
          <div className="d-flex flex-column col-md-5">
            <p className="fw-bold">Indirizzo</p>
            {dataToShow ? (
              <p>
                {dataToShow.indirizzo}, {dataToShow.luogo_citta}
              </p>
            ) : (
              <Skeleton />
            )}
          </div>
          <hr
            style={{ height: "40px", border: "1px solid gray" }}
            className="mx-2"
          ></hr>
          <div className="d-flex flex-column mx-2 col-md-5">
            <p className="fw-bold">Categorie</p>
            {dataToShow ? (
              <div>
                {dataToShow.categoria_soa.map((cat, i) => {
                  return (
                    <span key={i}>
                      {" "}
                      {cat}
                      {i === dataToShow.categoria_soa.length - 1 ? "" : ","}
                    </span>
                  );
                })}
                {dataToShow.categoria_soa.length === 0 && (
                  <>
                    <span>Categoria SOA non disponibile</span>
                  </>
                )}
              </div>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="mb-3 bg-white rounded-3 shadow p-3 d-flex justify-content-between">
          {dataToShow ? (
            <>
              <div>
                <LaunchIcon className="me-2" />
                <a
                  href={dataToShow.link_sito_committente}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={darkMode ? "text-black" : ""}
                >
                  Link sito committente
                </a>
              </div>
              <div>
                <Button
                  disabled={favs.some((ban) => ban.id === bando.id)}
                  variant="outlined"
                  color="success"
                  className="rounded-4 shadow"
                  size="small"
                  onClick={() => {
                    dispatch({ type: "ADD_FAV_BANDO", payload: bando });
                  }}
                >
                  <StarBorderIcon />
                </Button>
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </div>
        <Alert severity="warning" className="rounded-4">
          Le categorie SOA indicate sono una stima automatica. Verifica sempre
          le informazioni ufficiali consultando il sito del committente tramite
          il link fornito.
        </Alert>{" "}
      </div>
    </div>
  );
};

export { CardBandi };
