import "bootstrap/dist/css/bootstrap.min.css";
import "react-multi-carousel/lib/styles.css";
import "./App.css";
import "./style/custom.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { FooterCustom } from "./components/FooterCustom";
import { SignInOrSignUp } from "./components/SignInOrSignUp";
import { HomePage } from "./components/Home/HomePage";
import { NotFound } from "./components/NotFound";
import { AlertBanner } from "./components/AlertBanner";
import { SettingsPage } from "./components/SubMenuComps/SettingsPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { CookiesBanner } from "./components/CookiesBanner";
import { useDispatch, useSelector } from "react-redux";
import { TourProvider, useTour } from "@reactour/tour";
import { openSidebar } from "./utils/functions/functions";
import { Notifications } from "./components/Home/Notifications";
import { UnauthorizedPage } from "./components/UnathorizedPage";

const theme = createTheme({
  palette: {
    warning: {
      main: "#FFC107",
      light: "#FFECB3",
      dark: "#FFC101",
      contrastText: "black",
    },
  },
});
function App() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const { setIsOpen } = useTour();

  const updatedSteps1 = [
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
      actionAfter: () => openSidebar(dispatch, false),
    },
    {
      selector: ".aside-bar",
      content:
        "Questa è la sidebar, troverai tutte le principali funzionalità del sito. Per accedervi puoi anche passare con il cursore sopra la barra.",
      actionAfter: () => openSidebar(dispatch, true),
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
  ];

  const updatedSteps2 = [
    // Profilo
    {
      selector: ".profile-section",
      content:
        "Benvenuto nella sezione Profilo! Qui puoi aggiornare le tue informazioni personali e caricare la tua foto profilo.",
      action: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "one",
        }),
    },

    {
      selector: ".profile-picture-upload",
      content:
        "Clicca qui per caricare la tua foto profilo. Questo renderà il tuo profilo più personale.",
      action: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "one",
        }),
      actionAfter: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "two",
        }),
    },

    // Info Aggiuntive
    {
      selector: ".additional-info-section",
      content:
        "In questa sezione puoi aggiornare le informazioni relative alla tua azienda.",
      action: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "two",
        }),
      actionAfter: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "three",
        }),
    },

    // Documenti
    {
      selector: ".documents-section",
      content: "Qui puoi caricare i tuoi documenti di riconoscimento.",
      action: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "three",
        }),
      actionAfter: () =>
        dispatch({ type: "SET_TAB_VALUE_SETTINGS", payload: "four" }),
    },

    // Sicurezza
    {
      selector: ".security-section",
      content:
        "In questa sezione puoi modificare la tua email e password, e gestire le notifiche e la privacy.",
      actionAfter: () =>
        dispatch({ type: "SET_TAB_VALUE_SETTINGS", payload: "five" }),
      position: "top",
      action: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "four",
        }),
    },

    // Abbonamento
    {
      selector: ".subscription-section", // Selettore della sezione Abbonamento
      content:
        "In questa sezione puoi acquistare e gestire il tuo abbonamento, scegli un piano di abbonamento che meglio si adatta alle tue esigenze.",
      action: () =>
        dispatch({
          type: "SET_TAB_VALUE_SETTINGS",
          payload: "five",
        }),
    },
    {
      selector: null, // Selettore della sezione Abbonamento
      content:
        "🎉 Complimenti! Hai completato la seconda parte del tour. Ora sei pronto per esplorare il sito!",
      position: "center",
    },
  ];

  const updateUserTourStats = () => {
    if (location === "/home") {
      dispatch({ type: "SET_STEP1_OK", payload: true });
      setIsOpen(false);
    } else if (location === "/settings") {
      dispatch({ type: "SET_STEP2_OK", payload: true });
      setIsOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <TourProvider showBadge={false} beforeClose={() => updateUserTourStats()}>
        <BrowserRouter>
          <AlertBanner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignInOrSignUp />} />
            <Route path="/home" element={<HomePage steps={updatedSteps1} />} />
            <Route
              path="/settings"
              element={<SettingsPage steps={updatedSteps2} />}
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
          <CookiesBanner />
          <FooterCustom />
        </BrowserRouter>
      </TourProvider>
    </ThemeProvider>
  );
}

export default App;
