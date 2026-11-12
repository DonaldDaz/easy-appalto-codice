export const bkpts = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const goToAction = (dispatch, action) => {
  if (dispatch && action) {
    dispatch({ type: "SET_SIDE_ACT", payload: action });
  }
};

export const showAlert = (dispatch, show, type, text) => {
  if (!show) {
    dispatch({ type: "SHOW_ALERT", payload: false });
  } else {
    dispatch({ type: "SET_ALERT_TXT", payload: text });
    dispatch({ type: "SET_ALERT_TYPE", payload: type });
    dispatch({ type: "SHOW_ALERT", payload: true });
  }
};

export const italianLocale = {
  // Opzioni del menu filtro
  filterPanelOperator: "Operatore",
  filterPanelColumns: "Colonne",
  filterPanelInputLabel: "Valore",
  filterPanelInputPlaceholder: "Inserisci valore",

  // Operatori di filtro
  filterOperatorContains: "contiene",
  filterOperatorDoesNotContain: "non contiene",
  filterOperatorEquals: "è uguale a",
  filterOperatorDoesNotEqual: "non uguale a",
  filterOperatorStartsWith: "inizia con",
  filterOperatorEndsWith: "termina con",
  filterOperatorIsEmpty: "è vuoto",
  filterOperatorIsNotEmpty: "non è vuoto",
  filterOperatorIsAnyOf: "è uno di",

  // Altri messaggi
  columnMenuFilter: "Filtra",
  columnMenuSortAsc: "Ordina in modo crescente",
  columnMenuSortDesc: "Ordina in modo decrescente",
  columnMenuHideColumn: "Nascondi colonna",
  columnMenuShowColumns: "Mostra colonne",

  noRowsLabel: "Nessun risultato",
  noResultsOverlayLabel: "Nessun dato disponibile",
};

export const homeServices1 = [
  {
    icon: "bi bi-file-earmark-spreadsheet-fill fs-1",
    title: "Bandi Lavori",
    action: "BANDI",
  },
  {
    icon: "bi bi-list-check fs-1",
    title: "Forniture e servizi",
    action: "FORN",
  },
  {
    icon: "bi bi-pencil-fill fs-1",
    title: "Serv. di architettura",
    action: "ARCH",
  },
  {
    icon: "bi bi-hand-thumbs-up-fill fs-1",
    title: "Esiti di gara",
    action: "ESITI",
  },
];

export const homeServices2 = [
  {
    icon: "bi bi-gear-wide-connected fs-1",
    title: "Simulatore di gara semplice",
    action: "SIM-SIMP",
  },
  {
    icon: "bi bi-sliders2 fs-1",
    title: "Simulatore di gara avanzato",
    action: "SIM-ADV",
  },
  {
    icon: "bi bi-calculator fs-1",
    title: "Calcolo soglia anomalia",
    action: "CALC",
  },
];

// Only for test purposes
export const user = {
  name: "Luca",
  lastname: "Rossi",
  email: "luca.rossi@example.com",
  placeofbirth: "Milano",
  dateofbirth: "15/06/1981",
  country: "Italia",
  city: "Roma",
  fulladdress: "Via delle Rose, 123",
  zipcode: "00145",
  prov: "RM",
  username: "luca_rossi95",
  subscr_exp_date: "01/03/2025",
  societa: {
    ragioneSociale: "Rossi Costruzioni S.r.l.",
    sedeLegale: "Via Garibaldi, 50, 20121 Milano (MI)",
    partitaIVA: "12345678901",
    codiceFiscale: "12345678901",
    email: "info@rossicostruzioni.com",
    pec: "rossicostruzioni@pec.it",
    telefono: "+39 02 1234567",
    categorieSOA: [
      "OG1 - Edifici civili e industriali",
      "OG3 - Strade, autostrade e ponti",
      "OG6 - Acquedotti e fognature",
    ],
    classificheSOA: ["Classifica II", "Classifica III-bis"],
    documentiIdentita: {
      tesseraSanitaria: "tessera_sanitaria.pdf",
      cartaIdentita: "carta_identita.pdf",
      validazioneEntro: "2024-06-18",
    },
    posizioneAziendale: "Responsabile Tecnico",
  },
};

export const gareTest = [
  {
    id: 1,
    status: "Aperta",
    dataInizio: "2024-12-10",
    dataScadenza: "2025-01-15",
    CIG: "1234567890ABC",
    descrizioneGara:
      "Fornitura di materiali edili per la costruzione di edifici pubblici.",
    impresaAusiliaria: "Costruzioni Srl",
    aggiudicata: "No",
  },
  {
    id: 2,
    status: "Chiusa",
    dataInizio: "2024-09-01",
    dataScadenza: "2024-10-01",
    CIG: "0987654321DEF",
    descrizioneGara:
      "Manutenzione ordinaria e straordinaria delle reti stradali comunali.",
    impresaAusiliaria: "Strade Sicure Srl",
    aggiudicata: "No",
  },
  {
    id: 3,
    status: "In corso",
    dataInizio: "2024-11-01",
    dataScadenza: "2025-01-31",
    CIG: "1122334455GHI",
    descrizioneGara: "Servizio di pulizia per uffici e strutture scolastiche.",
    impresaAusiliaria: "Pulizie Efficienti Spa",
    aggiudicata: "No",
  },
  {
    id: 4,
    status: "Aperta",
    dataInizio: "2024-12-05",
    dataScadenza: "2025-02-28",
    CIG: "5566778899JKL",
    descrizioneGara:
      "Installazione di pannelli fotovoltaici in edifici comunali.",
    impresaAusiliaria: "Green Energy Solutions Srl",
    aggiudicata: "No",
  },
  {
    id: 5,
    status: "Chiusa",
    dataInizio: "2024-07-15",
    dataScadenza: "2024-09-01",
    CIG: "6677889900MNO",
    descrizioneGara: "Fornitura di arredi per scuole dell'infanzia e primarie.",
    impresaAusiliaria: "Arredi Moderni Srl",
    aggiudicata: "Si",
  },
  {
    id: 6,
    status: "Aperta",
    dataInizio: "2024-12-01",
    dataScadenza: "2025-01-20",
    CIG: "4455667788PQR",
    descrizioneGara:
      "Progettazione e costruzione di una nuova pista ciclabile urbana.",
    impresaAusiliaria: "Mobilità Sostenibile Spa",
    aggiudicata: "No",
  },
  {
    id: 7,
    status: "In corso",
    dataInizio: "2024-10-15",
    dataScadenza: "2024-12-31",
    CIG: "3344556677STU",
    descrizioneGara:
      "Rifacimento della segnaletica stradale orizzontale e verticale.",
    impresaAusiliaria: "Segnaletica Perfetta Srl",
    aggiudicata: "No",
  },
  {
    id: 8,
    status: "Chiusa",
    dataInizio: "2024-08-01",
    dataScadenza: "2024-09-15",
    CIG: "2233445566VWX",
    descrizioneGara:
      "Fornitura e manutenzione di attrezzature per parchi giochi comunali.",
    impresaAusiliaria: "Giochi Sicuri Spa",
    aggiudicata: "Si",
  },
  {
    id: 9,
    status: "Aperta",
    dataInizio: "2024-12-10",
    dataScadenza: "2025-03-01",
    CIG: "9988776655YZA",
    descrizioneGara:
      "Servizio di ristorazione per mense scolastiche e aziendali.",
    impresaAusiliaria: "Catering Gourmet Srl",
    aggiudicata: "No",
  },
  {
    id: 10,
    status: "In corso",
    dataInizio: "2024-11-20",
    dataScadenza: "2025-02-15",
    CIG: "8877665544BCD",
    descrizioneGara:
      "Riqualificazione energetica degli edifici storici comunali.",
    impresaAusiliaria: "Efficienza Energetica Srl",
    aggiudicata: "No",
  },
];

export const news = "Siamo work in progress a breve saremo disponibili! 🚀 🔥";

export const steps = {
  steps1: [
    {
      selector: null,
      position: "center",
      content:
        "Benvenuto, a quanto pare è la tua prima volta qui, iniziamo il tour interattivo? Clicca sulla sulla freccia a destra per continuare, altrimenti clicca sulla X per terminare il tour!",
    },
    {
      selector: ".logo",
      content:
        "Questo è il logo del sito. Puoi cliccarlo in qualsiasi momento per tornare alla homepage.",
    },
    {
      selector: ".menu",
      content:
        "Qui trovi il menu di navigazione. Clicca sull'icona per aprire la sidebar e accedere alle varie sezioni del sito.",
      action: null,
    },
    {
      selector: ".aside-bar",
      content:
        "Questa è la sidebar, troverai tutte le principali funzionalità del sito. Per accedervi puoi anche passare con il cursore sopra la barra.",
      actionAfter: null,
      position: "center",
    },
    {
      selector: ".profile",
      content:
        "Questa è l'area del tuo profilo. Da qui puoi gestire il tuo account, modificare le impostazioni e visualizzare il tuo stato di abbonamento.",
    },
    {
      selector: null,
      content:
        "🎉 Complimenti! Hai completato la prima parte del tour. Ora sei pronto per esplorare il sito!",
      position: "center",
    },
  ],
};
