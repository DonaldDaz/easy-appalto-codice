const initialState = {
  userData: [],
  subscription: [],
  sideBarAction: "DASH",
  collapseSidebar: true,
  hasUserGrantedLocation: "",
  gpsLocation: null,
  alertBanner: {
    show: false,
    type: "success",
    message: "Sample alert text",
  },
  favBandi: [],
  showNotifications: false,
  darkMode: false,
  savedFilters: [],
  cookiesAccepted: false,
  settingsTabValue: "one",
  tutorial: {
    hasUserCompletedFirstStep: false,
    hasUserCompletedSecondStep: false,
  },
  location: "",
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        userData: action.payload,
      };
    case "SET_SIDE_ACT":
      return {
        ...state,
        sideBarAction: action.payload,
      };
    case "COLL_SIDE_BAR":
      return {
        ...state,
        collapseSidebar: action.payload,
      };
    case "SHOW_ALERT":
      return {
        ...state,
        alertBanner: {
          ...state.alertBanner,
          show: action.payload,
        },
      };
    case "SET_ALERT_TXT":
      return {
        ...state,
        alertBanner: {
          ...state.alertBanner,
          message: action.payload,
        },
      };
    case "SET_ALERT_TYPE":
      return {
        ...state,
        alertBanner: {
          ...state.alertBanner,
          type: action.payload,
        },
      };

    case "ADD_FAV_BANDO":
      // Controlla se il bando esiste già per evitare duplicati
      if (!state.favBandi.some((bando) => bando.id === action.payload.id)) {
        return {
          ...state,
          favBandi: [...state.favBandi, action.payload],
        };
      }
      return state; // Se esiste già, non fa nulla

    case "REMOVE_FAV_BANDO":
      return {
        ...state,
        favBandi: state.favBandi.filter((bando) => bando.id !== action.payload),
      };
    case "REMOVE_ALL_BANDI":
      return {
        ...state,
        favBandi: action.payload,
      };
    case "SHOW_NOTIF":
      return {
        ...state,
        showNotifications: action.payload,
      };
    case "DARK_MODE":
      return {
        ...state,
        darkMode: action.payload,
      };
    case "ADD_SUBSCR":
      return {
        ...state,
        subscription: action.payload,
      };
    case "ADD_FAV_FILTER": {
      return {
        ...state,
        savedFilters: [...state.savedFilters, action.payload],
      };
    }
    case "REMOVE_FAV_FILTER":
      return {
        ...state,
        savedFilters: state.savedFilters.filter(
          (filter) => filter.id !== action.payload
        ),
      };
    case "ACCEPT_COOKIES":
      return {
        ...state,
        cookiesAccepted: action.payload,
      };
    case "SET_TAB_VALUE_SETTINGS":
      return {
        ...state,
        settingsTabValue: action.payload,
      };
    case "SET_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "SET_STEP1_OK":
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          hasUserCompletedFirstStep: action.payload,
        },
      };
    case "SET_STEP2_OK":
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          hasUserCompletedSecondStep: action.payload,
        },
      };
    case "GRANT_ACCESS_LOCATION":
      return {
        ...state,
        hasUserGrantedLocation: action.payload,
      };
    case "SET_GPS_LOCATION":
      return {
        ...state,
        gpsLocation: action.payload,
      };

    default:
      return state;
  }
};

export default mainReducer;
