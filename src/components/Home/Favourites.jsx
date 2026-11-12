import { useDispatch, useSelector } from "react-redux";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Badge, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
const Favourites = ({ darkMode }) => {
  const favs = useSelector((state) => state.favBandi);
  const dispatch = useDispatch();

  return (
    <>
      <h4 className={darkMode && "text-white"}>
        I bandi che hai aggiunto ai preferiti{" "}
        {favs.length > 0 ? (
          <Badge
            className="ms-2 mb-1"
            badgeContent={favs.length}
            color="error"
          ></Badge>
        ) : (
          <></>
        )}
      </h4>
      <div
        className={`my-3 ${darkMode && "text-black rounded-4"}`}
        style={{ backgroundColor: darkMode && "#494A5D" }}
      >
        <div className="shadow py-2 rounded-3 px-3">
          {!favs.length > 0 && (
            <p>
              Non hai alcuna gara aggiunta ai preferiti al momento, per
              aggiungerne qualcuna clicca sul pulsante <StarBorderIcon /> sul
              bando che ti interessa.
            </p>
          )}
          {favs.length > 0 && (
            <>
              {favs.map((fav, i) => {
                return (
                  <div
                    key={i}
                    style={{ backgroundColor: "#F8F9FA" }}
                    className="my-3 p-3 rounded-3 d-flex align-items-center"
                  >
                    <div>
                      <p className="fw-bold">
                        Amm. Appaltante:{" "}
                        <span className="fw-light">
                          {" "}
                          {fav.amministrazione_appaltante}
                        </span>
                      </p>
                      <p className="fw-bold">
                        Città:{" "}
                        <span className="fw-light"> {fav.luogo_citta}</span>
                      </p>
                      <p className="fw-bold">
                        Regione:{" "}
                        <span className="fw-light"> {fav.luogo_regione}</span>
                      </p>
                      <p className="fw-bold">
                        Importo:{" "}
                        <span className="fw-light">
                          {" "}
                          {fav.importo_valore_stimato} {fav.importo_currency}
                        </span>
                      </p>
                      <details>
                        <summary>Categorie:</summary>
                        <ul>
                          {fav.categorie.map((cat, i) => {
                            return (
                              <li key={i}>
                                {" "}
                                {cat.id_categoria} {`(${cat.cod_tipo})`}{" "}
                              </li>
                            );
                          })}
                        </ul>
                      </details>
                    </div>
                    <div className="ms-auto mb-auto d-flex flex-column">
                      <Button
                        color="error"
                        className="rounded-4"
                        onClick={() => {
                          dispatch({
                            type: "REMOVE_FAV_BANDO",
                            payload: fav.id,
                          });
                        }}
                      >
                        <DeleteIcon /> Rimuovi
                      </Button>
                      <Button color="success" className="rounded-4">
                        <CallMissedOutgoingIcon /> Vai al bando
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { Favourites };
