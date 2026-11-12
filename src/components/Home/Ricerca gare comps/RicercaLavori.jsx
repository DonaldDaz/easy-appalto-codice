import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import regioni_prov from "../../../utils/json/dati_prov.json";
import comuni_file from "../../../utils/json/comuni.json";
import { da, it } from "date-fns/locale";
import SearchIcon from "@mui/icons-material/Search";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../../utils/constants/constants";
import { format, parseISO } from "date-fns";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Col, Modal, Row } from "react-bootstrap";
import { CardBandi } from "./CardBandi";
import { styled, alpha } from "@mui/material/styles";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import PropTypes, { array } from "prop-types";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { supabase } from "../../../supabase.js";
import Papa from "papaparse";

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

const RicercaLavori = ({ darkMode }) => {
  const [regioni, setRegioni] = useState([]);
  const [comuni, setComuni] = useState(null);
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);
  const [textToShow, setTextToshow] = useState("");

  const [counter, setCounter] = useState(0);
  const [cpvList, setCpvList] = useState("");

  const [tendersToShow, setTendersToShow] = useState([]);

  const user = useSelector((state) => state.userData);

  const savedFilters = useSelector((state) => state.savedFilters);

  //hook for accordion
  const [expanded, setExpanded] = useState(false);

  //hook for favs modal

  const [showModalFilters, setShowModalFilters] = useState(false);
  const [showFaveModal, setShowFaveModal] = useState(false);

  //hooks for input fiels in search sections
  const [regio, setRegio] = useState("");
  const [prov, setProv] = useState("");
  const [comu, setComu] = useState("");
  const [categs, setCategs] = useState([]);
  const [importfrom, setImportFrom] = useState(0);
  const [importTo, setImportTo] = useState(0);
  const [dataScad, setDataScad] = useState("");
  const [cig, setCig] = useState("");
  //end hooks for input fiels in search sections

  //hook for csv data
  const [cpvData, setCpvData] = useState([]);

  const checkInputFields = () => {
    if (
      regio === "" &&
      comu === "" &&
      cig === "" &&
      (importfrom === 0 || Number.isNaN(importfrom)) &&
      (importTo === 0 || Number.isNaN(importTo)) &&
      dataScad === "" &&
      cpvList === ""
    ) {
      return false;
    } else return true;
  };

  const [filterName, setFilterName] = useState("");
  const [youMadeAnError, setYouMadeAnError] = useState(false);

  const [page, setPage] = useState(1);

  const saveFilterToredux = () => {
    const now = new Date();
    const newId =
      savedFilters.length > 0
        ? Math.max(...savedFilters.map((f) => f.id)) + 1
        : 1;

    const payload = {
      id: newId,
      saveDate: format(now, "dd/MM/yyyy", { locale: it }),
      filterName: filterName,
      data: {
        regio: regio,
        prov: prov,
        comu: comu,
        categs: categs,
        importfrom: importfrom,
        importTo: importTo,
        dataScad: dataScad,
        cig: cig,
      },
    };

    if (filterName !== "") {
      dispatch({ type: "ADD_FAV_FILTER", payload: payload });
      setShowFaveModal(false);
      setFilterName("");
      handleClickSnack();
    } else {
      setYouMadeAnError(true);
      setTimeout(() => {
        setYouMadeAnError(false);
      }, 2000);
    }
  };

  const loadSavedFilter = (variant) => {
    if (variant) {
      setRegio(variant.regio);
      setProv(variant.prov);
      setComu(variant.comu);
      setImportFrom(variant.importfrom);
      setImportTo(variant.importTo);
      setDataScad(variant.dataScad);
      setCig(variant.cig);
      setCategs(variant.categs);
      setShowModalFilters(false);
      showAlert(dispatch, true, "success", "Ricerca caricata con successo!");
      setTimeout(() => {
        setIsLoading(false);
        showAlert(dispatch, false);
      }, 3000);
    } else {
      console.log("variante non valida", variant);
    }
  };

  const resetFilters = () => {
    setRegio("");
    setProv("");
    setComu("");
    setCpvList("");
    setImportFrom(0);
    setImportTo(0);
    setDataScad("");
    setCig("");
  };
  //hooks for action menu for searchbar

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl2);
  const handleClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl2(null);
  };

  //hooks for snackbar

  const [openSnack, setOpenSnack] = useState(false);

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  //hooks for snackbar

  const showProvs = (param) => {
    if (param !== null) {
      const filteredArray = comuni_file
        .filter((reg) => reg.regione.nome === param)
        .map((item) => item.nome)
        .sort();

      setComuni(filteredArray);
    }
  };

  //test tenders start

  //test2
  async function searchTendersWithCount(
    regione,
    citta,
    cig,
    imp_min,
    imp_max,
    data_scad,
    cpv_list
  ) {
    setIsLoading(true);

    if (!checkInputFields()) {
      showAlert(
        dispatch,
        true,
        "error",
        "Inserisci almeno un parametro di ricerca!"
      );
      setTimeout(() => {
        showAlert(dispatch, false);
        setIsLoading(false);
      }, 2000);

      return;
    }
    setTendersToShow([]);

    if (!imp_min || imp_min === 0) {
      imp_min = null;
    }
    if (!imp_max || imp_max === 0) {
      imp_max = null;
    }

    if (!regione || regione === "Tutte") {
      regione = null;
    } else {
      regione = regione.toUpperCase();
    }

    let cigArray = cig ? [cig] : null;

    if (!data_scad) {
      data_scad = null;
    }

    let cpvArray = [];
    if (cpv_list !== "") {
      cpvArray.push(cpv_list);
    }

    const { data, error } = await supabase.rpc("search_tenders_with_count", {
      p_regione: regione,
      p_citta: citta,
      p_cig: cigArray,
      p_importo_min: imp_min,
      p_importo_max: imp_max,
      p_data_scadenza: data_scad,
      p_data_pubblicazione_da: null,
      p_data_pubblicazione_a: null,
      p_cpv_codes: cpvArray.length > 0 ? cpvArray : null,
      p_amministrazione: null,
      p_oggetto: "LAVORI",
      p_tipo_contratto: null,
      p_limit: 10,
      p_offset: 0,
    });

    if (!data || data.length === 0) {
      setTimeout(() => {
        showAlert(
          dispatch,
          true,
          "error",
          "Non è stato trovato alcun risultato"
        );
        setTimeout(() => {
          showAlert(dispatch, false);
          setIsLoading(false);
        }, 2000);
      }, 2000);
    } else {
      const enrichedTenders = data.map((bando) => {
        const codiciCpv =
          bando.cpv_list?.map((c) => c.cod_cpv).filter(Boolean) || [];

        // Cerca tutte le categorie corrispondenti
        const categorie = codiciCpv
          .map((codice) => {
            const categoria = getCategoriaFromCpv(codice, cpvData);
            return categoria ? categoria["Categoria SOA"] : null;
          })
          .filter((cat) => cat !== null);

        // Rendi uniche le categorie
        const categorieUniche = [...new Set(categorie)];

        return {
          ...bando,
          categoria_soa: categorieUniche,
        };
      });

      setTextToshow("Bandi trovati per la tua ricerca");
      setTimeout(() => {
        setTendersToShow(enrichedTenders);
        setIsLoading(false);
        setExpanded(false);
      }, 500);
    }

    if (error) {
      setIsLoading(false);
      console.log("Errore durante il fetch:", error);
      showAlert(
        dispatch,
        true,
        "error",
        "Errore imprevisto durante la ricerca, riprova fra poco."
      );
      setTimeout(() => {
        showAlert(dispatch, false);
      }, 2000);
      return null;
    }

    return data;
  }

  async function getSuggestedTenders(regione) {
    setIsLoading(true);

    const { data, error } = await supabase.rpc("search_tenders_with_count", {
      p_regione: regione,
      p_citta: null,
      p_cig: null,
      p_importo_min: null,
      p_importo_max: null,
      p_data_scadenza: null,
      p_data_pubblicazione_da: null,
      p_data_pubblicazione_a: null,
      p_cpv_codes: null,
      p_amministrazione: null,
      p_oggetto: "LAVORI",
      p_tipo_contratto: null,
      p_limit: 10,
      p_offset: 0,
    });

    if (!data || data.length === 0) {
      setTimeout(() => {
        showAlert(
          dispatch,
          true,
          "error",
          "Non è stato trovato alcun risultato"
        );
        setTimeout(() => {
          showAlert(dispatch, false);
          setIsLoading(false);
        }, 2000);
      }, 2000);
    } else {
      const enrichedTenders = data.map((bando) => {
        const codiciCpv =
          bando.cpv_list?.map((c) => c.cod_cpv).filter(Boolean) || [];

        // Cerca tutte le categorie corrispondenti
        const categorie = codiciCpv
          .map((codice) => {
            const categoria = getCategoriaFromCpv(codice, cpvData);
            return categoria ? categoria["Categoria SOA"] : null;
          })
          .filter((cat) => cat !== null);

        // Rendi uniche le categorie
        const categorieUniche = [...new Set(categorie)];

        return {
          ...bando,
          categoria_soa: categorieUniche,
        };
      });

      setTextToshow("Bandi suggeriti per te");
      setTimeout(() => {
        setTendersToShow(enrichedTenders);
        setIsLoading(false);
        setExpanded(false);
      }, 500);
    }

    if (error) {
      setIsLoading(false);
      console.log("Errore durante il fetch:", error);
      showAlert(
        dispatch,
        true,
        "error",
        "Errore imprevisto durante la ricerca, riprova fra poco."
      );
      setTimeout(() => {
        showAlert(dispatch, false);
      }, 2000);
      return null;
    }

    return data;
  }

  //cpv conversion to soa

  async function loadCpvData() {
    const response = await fetch("/public/mapping_soa.csv");
    const text = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (err) => reject(err),
      });
    });
  }

  function getCategoriaFromCpv(cpvCode, cpvData) {
    if (!cpvCode || !cpvData.length) return null;
    const match = cpvData.find((row) => row.CODE.trim() === cpvCode.trim());
    return match || null;
  }

  const getRegioneByProvincia = (nomeProvincia) => {
    const comune = comuni_file.find((c) => c.nome === nomeProvincia);
    return comune ? comune.regione.nome : "Provincia non trovata";
  };

  const filteredRegioni = [
    ...new Set(regioni_prov.map((item) => item.regione).sort()),
  ];

  useEffect(() => {
    setRegioni(filteredRegioni);
    if (cpvData.length === 0) {
      loadCpvData().then(setCpvData).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!tendersToShow.length > 0) {
      let regione = getRegioneByProvincia(user[0].city);
      if (regione) {
        getSuggestedTenders(regione.toUpperCase());
      }
    }
  }, []);

  return (
    <>
      <Accordion
        onChange={() => {
          setExpanded(!expanded);
        }}
        className="mt-3 shadow rounded-4 me-2 me-md-0"
        style={{ position: "unset", backgroundColor: "#f4f1ef" }}
        expanded={expanded}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">
            Ricerca Bandi Lavori <ManageSearchIcon />
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          style={{ backgroundColor: "#f4f1ef" }}
          className="rounded-bottom-4"
        >
          <div className="d-flex flex-column rounded-4 py-3 align-items-center">
            <div className="d-flex w-100 py-2">
              <h3 className="m-0 ms-auto">Filtri ricerca gare</h3>
              <div className="ms-auto">
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="outlined"
                  color="success"
                  className="rounded-4 shadow"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Opzioni
                </Button>
                <StyledMenu
                  disableScrollLock
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl2}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setShowFaveModal(true);
                    }}
                    disableRipple
                  >
                    <SaveAsIcon />
                    Salva ricerca
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setShowModalFilters(true);
                      handleClose();
                    }}
                    disableRipple
                  >
                    <FileCopyIcon />
                    Ricerche salvate
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      resetFilters();
                      handleClose();
                    }}
                    disableRipple
                  >
                    <DeleteForeverIcon className="fs-5" />
                    Reset filtri
                  </MenuItem>
                </StyledMenu>
              </div>
            </div>

            {/* Filters section */}

            <div className=" d-flex py-4 flex-column flex-lg-row px-2 px-md-0 w-100 justify-content-between align-items-lg-center">
              {/* PRIMO FILTRO -- LUOGO */}
              <div className="d-flex flex-column col-md-3 mb-md-4">
                <p className="text-center mb-2 ">Luogo</p>
                <FormControl fullWidth>
                  <InputLabel
                    id="regio-select-label"
                    color="success"
                    size="small"
                  >
                    Regione
                  </InputLabel>
                  <Select
                    labelId="regio-select-label"
                    size="small"
                    label="Regione"
                    id="regio-select"
                    color="success"
                    defaultValue={30}
                    onChange={(e) => {
                      setRegio(e.target.value);
                      showProvs(e.target.value);
                    }}
                    value={regio}
                  >
                    <MenuItem value={"Tutte"} color="success">
                      Tutte
                    </MenuItem>
                    {regioni.map((reg, i) => {
                      return (
                        <MenuItem key={i} value={reg} color="success">
                          {reg}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl className="mt-4">
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={comuni ? comuni : ["Seleziona una regione"]}
                    onChange={(e) => setComu(e.target.textContent)}
                    renderInput={(params) => (
                      <TextField {...params} label="Comune" color="success" />
                    )}
                  />
                </FormControl>
              </div>
              {/* SECONDO FILTRO CATEG. */}
              <div className="col-md-5 mt-2px-md-5 my-3 my-md-0 d-flex justify-content-center flex-column align-items-center">
                <FormControl sx={{ m: 1 }} className="mb-3 categ-cont">
                  <InputLabel
                    htmlFor="outlined-adornment-amount_2"
                    color="success"
                    size="small"
                  >
                    CIG
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    color="success"
                    id="outlined-adornment-amount_2"
                    label="Amount"
                    onChange={(e) => {
                      setCig(e.target.value.toString());
                    }}
                    value={cig}
                    size="small"
                    style={{ background: "white" }}
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }} className="mb-3 categ-cont">
                  <InputLabel
                    htmlFor="outlined-adornment-amount_2"
                    color="success"
                    size="small"
                  >
                    CPV
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    color="success"
                    id="outlined-adornment-amount_2"
                    label="Amount"
                    onChange={(e) => {
                      setCpvList(e.target.value.toString());
                    }}
                    value={cpvList}
                    size="small"
                    style={{ background: "white" }}
                  />
                </FormControl>
              </div>

              {/* TERZO FILTRO - IMPORTI & DATA */}
              <div className="d-flex flex-column px-2 px-md-0 col-md-3">
                <p className="text-center mb-2">Importo e date</p>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel
                    htmlFor="outlined-adornment-amount"
                    color="success"
                  >
                    Importo da:
                  </InputLabel>
                  <OutlinedInput
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setImportFrom(value === "NaN" ? 0 : value);
                    }}
                    color="success"
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">€</InputAdornment>
                    }
                    label="Amount"
                    type="number"
                    value={importfrom}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel
                    htmlFor="outlined-adornment-amount_2"
                    color="success"
                  >
                    Importo a:
                  </InputLabel>
                  <OutlinedInput
                    color="success"
                    id="outlined-adornment-amount_2"
                    startAdornment={
                      <InputAdornment position="start">€</InputAdornment>
                    }
                    label="Amount"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setImportTo(value === "" ? 0 : value);
                    }}
                    value={importTo}
                    type="number"
                  />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }} className="mt-3">
                  <TextField
                    label="Data scadenza"
                    variant="outlined"
                    type="date"
                    color="success"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={dataScad}
                    onChange={(e) => {
                      const dataISO = e.target.value;
                      if (dataISO) {
                        const dataFormattata = format(
                          parseISO(dataISO),
                          "yyyy-MM-dd"
                        );

                        setDataScad(dataFormattata); //here i save the date formatted with the value requested in the api
                      }
                    }}
                  />
                </FormControl>
              </div>
            </div>
            {/* Button section */}
            <div className="d-flex justify-content-center w-50">
              {!loading ? (
                <Button
                  fullWidth
                  className="rounded-4"
                  color="success"
                  size="large"
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => {
                    searchTendersWithCount(
                      regio,
                      comu,
                      cig,
                      importTo,
                      importfrom,
                      dataScad,
                      cpvList
                    );
                  }}
                >
                  Cerca
                </Button>
              ) : (
                <LoadingButton
                  fullWidth
                  size="large"
                  loading
                  variant="contained"
                  className="rounded-4"
                  color="error"
                  startIcon={<SearchIcon />}
                >
                  {" "}
                  Cerca
                </LoadingButton>
              )}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Row className="mb-5 flex-column">
        {tendersToShow.length > 0 && (
          <Col className="px-4">
            <h3 className="text-center ms-auto mt-4">{textToShow}</h3>
            <Col className="d-flex justify-content-center mt-5">
              {tendersToShow.length > 0 &&
                textToShow !== "Bandi suggeriti per te" &&
                textToShow !== "" && (
                  <div>
                    <Button
                      color="success"
                      variant="outlined"
                      className="me-3 rounded-4 shadow"
                      onClick={() => {
                        setPage((prev) => Math.max(prev - 1, 1));
                        // fetchTenders();
                      }}
                      disabled={page === 1}
                    >
                      ← Indietro
                    </Button>
                    <span> Pagina {page} </span>
                    <Button
                      color="success"
                      className="ms-3 rounded-4 shadow"
                      variant="outlined"
                      disabled={tendersToShow.length < 10}
                      onClick={() => {
                        setPage((prev) => prev + 1);
                        // fetchTenders();
                      }}
                    >
                      Avanti →
                    </Button>
                  </div>
                )}
            </Col>
            {/* <p className="text-end mt-5">
              N. Bandi trovati: <span className="fw-bold">{counter} </span>
              {"- "}
              Mostrati: <span className="fw-bold"> {tendersToShow.length}</span>
            </p> */}
            {tendersToShow.map((bando, i) => {
              return <CardBandi key={i} bando={bando} darkMode={darkMode} />;
            })}
          </Col>
        )}
        <Col className="d-flex justify-content-center mt-5">
          {tendersToShow.length > 0 && (
            <div>
              <Button
                color="success"
                variant="outlined"
                className="me-3 rounded-4 shadow"
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                  // fetchTenders();
                }}
                disabled={page === 1}
              >
                ← Indietro
              </Button>
              <span> Pagina {page} </span>
              <Button
                color="success"
                className="ms-3 rounded-4 shadow"
                variant="outlined"
                disabled={tendersToShow.length < 10}
                onClick={() => {
                  setPage((prev) => prev + 1);
                  // fetchTenders();
                }}
              >
                Avanti →
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {/* MODAL FOR FAV FILTERS */}
      <Modal
        show={showModalFilters}
        onHide={() => setShowModalFilters(false)}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ricerche salvate</Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-y-scroll">
          {savedFilters.length > 0 ? (
            <>
              {savedFilters.map((ban, i) => {
                return (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-between my-2 py-1"
                  >
                    <div className="d-flex">
                      <p className="fw-bold">{ban.id} - </p>
                      <p className="me-auto ms-2">{ban.filterName} </p>
                      <p>
                        - Data: <span>{ban.saveDate}</span>
                      </p>
                    </div>

                    <div>
                      <Tooltip title="Carica ricerca">
                        <IconButton>
                          <PostAddIcon
                            className="pointer"
                            onClick={() => loadSavedFilter(ban.data)}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina ricerca">
                        <IconButton>
                          <DeleteForeverIcon
                            className="pointer"
                            color="error"
                            onClick={() => {
                              dispatch({
                                type: "REMOVE_FAV_FILTER",
                                payload: ban.id,
                              });
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            "Non hai alcuna ricerca salvata"
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outlined"
            className="rounded-4 shadow"
            size="small"
            color="error"
            onClick={() => setShowModalFilters(false)}
          >
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* MODAL FOR FAVE SAVING */}
      <Modal show={showFaveModal} onHide={() => setShowFaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dai un nome alla ricerca da salvare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="outlined-basic"
            label={
              youMadeAnError
                ? "Inserisci un nome prima di salvare!"
                : "Es. Ricerca Gara N.123"
            }
            variant="outlined"
            color={youMadeAnError ? "error" : "success"}
            className={youMadeAnError ? "error-border" : ""}
            autoFocus
            fullWidth
            size="small"
            onChange={(e) => setFilterName(e.target.value)}
            value={filterName}
          />
        </Modal.Body>
        <Modal.Footer className="py-3">
          <Button
            variant="contained"
            className="rounded-4 shadow me-2"
            color="error"
            onClick={() => setShowFaveModal(false)}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            color="success"
            className="rounded-4 shadow"
            onClick={saveFilterToredux}
          >
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
      <>
        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          onClose={handleCloseSnack}
          message="Ricerca salvata!"
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnack}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      </>
    </>
  );
};

export { RicercaLavori };
