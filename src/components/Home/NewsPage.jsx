import { Button, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { LoadingButton } from "@mui/lab";
import { showAlert } from "../../utils/constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid #cbcccd",
  borderRadius: "10px",
  backgroundColor: "#ffff",
  "&:hover": {
    backgroundColor: "#fff",
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "black",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "18ch",
      "&:hover": {
        width: "30ch",
      },
    },
  },
}));

const NewsPage = ({ darkMode }) => {
  const [newsToshow, setNewsToShow] = useState(null);
  const key = import.meta.env.VITE_NEWS_KEY;
  const [keyword, setKeyword] = useState("appalti");
  const [loading, setLoading] = useState(false);
  const location = useSelector((state) => state.gpsLocation);
  const permission = useSelector((state) => state.hasUserGrantedLocation);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const shareContent = async (data) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: "Dai un'occhiata a questa pagina",
          url: data.link,
        });
        console.log("Contenuto condiviso con successo");
      } catch (error) {
        console.error("Errore nella condivisione:", error);
      }
    } else {
      alert("La condivisione non è supportata su questo browser");
    }
  };

  const icons = {
    0: "☀️", // Sole
    1: "🌤️",
    2: "🌤️",
    3: "🌤️", // Poco nuvoloso
    45: "🌫️",
    48: "🌫️", // Nebbia
    51: "🌦️",
    53: "🌦️",
    55: "🌦️", // Pioviggine
    61: "🌧️",
    63: "🌧️",
    65: "🌧️", // Pioggia
    66: "❄️",
    67: "❄️", // Pioggia gelata
    71: "🌨️",
    73: "🌨️",
    75: "🌨️", // Neve
    95: "⛈️",
    96: "⛈️",
    99: "⛈️", // Temporale
  };

  const getWeather = (lat, lon, county) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&models=icon_seamless`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then((data) => {
        dispatch({
          type: "SET_GPS_LOCATION",
          payload: {
            lat: lat,
            lon: lon,
            city: county,
          },
        });
        setWeather({
          city: county,
          temperature: data.current.temperature_2m,
          icon: icons[data.current.weather_code],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLocation = () => {
    let city;
    let lat = 0;
    let lon = 0;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          )
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                throw new Error();
              }
            })
            .then((data) => {
              city = data.address.county;
              getWeather(lat, lon, city);
            })
            .catch((err) => {
              console.log(err);
            });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocalizzazione non supportata dal browser.");
    }
  };

  const loadData = (page) => {
    setLoading(true);
    setNewsToShow(null);

    if (keyword === "") {
      setKeyword("appalti");
    }

    if (!page) {
      fetch(`https://newsdata.io/api/1/latest?apikey=${key}&q=${keyword}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.error("error fetching data");
          }
        })
        .then((data) => {
          if (!data.results.length > 0) {
            setTimeout(() => {
              showAlert(
                dispatch,
                true,
                "error",
                `Non abbiamo trovato articoli per la parola chiave ${keyword}`
              );
              setTimeout(() => {
                showAlert(dispatch, false);
                setLoading(false);
              }, 2000);
            }, 2000);
            return;
          }
          setTimeout(() => {
            setNewsToShow(data);
            setLoading(false);
          }, 1500);
        })
        .catch((err) => {
          setLoading(false);

          setTimeout(() => {
            showAlert(
              dispatch,
              true,
              "error",
              "C'è stato un errore nella ricerca, riprova più tardi!"
            );
            setTimeout(() => {
              showAlert(dispatch, false);
            }, 2000);
          }, 2000);
        });
    } else {
      fetch(
        `https://newsdata.io/api/1/latest?apikey=${key}&q=${keyword}&page=${page}`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.error("error fetching data");
          }
        })
        .then((data) => {
          if (!data.results.length > 0) {
            setTimeout(() => {
              showAlert(
                dispatch,
                true,
                "error",
                `Non abbiamo trovato articoli per la parola chiave ${keyword}`
              );
              setTimeout(() => {
                showAlert(dispatch, false);
                setLoading(false);
              }, 2000);
            }, 2000);
            return;
          }
          setTimeout(() => {
            setNewsToShow(data);
            setLoading(false);
          }, 1500);
        })
        .catch((err) => {
          setLoading(false);

          setTimeout(() => {
            showAlert(
              dispatch,
              true,
              "error",
              "C'è stato un errore nella ricerca, riprova più tardi!"
            );
            setTimeout(() => {
              showAlert(dispatch, false);
            }, 2000);
          }, 2000);
        });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!newsToshow) {
      loadData();
    }
    if (permission && !weather) {
      getLocation();
    }
  }, []);

  return (
    <Col className="mt-5 me-md-4 d-flex flex-column overflow-x-hidden px-2 px-md-5 py-3 pb-5">
      {permission === "" && (
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 100, opacity: 1 }}
          exit={{ y: -200, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-white p-2 rounded-4 shadow text-center ms-md-auto me-md-5 fixed-top mx-3 col-md-3"
        >
          <h5 className="text-lg font-semibold mb-4">
            📍 Vuoi attivare la localizzazione?
          </h5>
          <p className="text-gray-600 mb-6">
            Per offrirti un'esperienza personalizzata, la nostra app richiede
            l'accesso alla tua posizione.
          </p>
          <div className="flex justify-between my-3">
            <Button
              variant="outlined"
              className="me-2 rounded-4 shadow"
              onClick={() => {
                dispatch({ type: "GRANT_ACCESS_LOCATION", payload: "denied" });
              }}
            >
              Annulla
            </Button>
            <Button
              variant="outlined"
              color="success"
              className="rounded-4 shadow"
              onClick={() => {
                dispatch({ type: "GRANT_ACCESS_LOCATION", payload: "granted" });
                getLocation();
              }}
            >
              Conferma
            </Button>
          </div>
        </motion.div>
      )}

      <h4 className="text-center">Le ultime notizie dal mondo</h4>
      <div className="d-flex  mt-4 align-items-center">
        <div className="d-flex justify-content-center align-items-center ms-auto me-auto">
          {" "}
          <Search className="shadow">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Cerca articoli.."
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
          </Search>
          {loading ? (
            <LoadingButton
              size="small"
              loading
              variant="contained"
              className="ms-md-2 rounded-4 shadow ms-2"
              color="error"
            >
              Cerca
            </LoadingButton>
          ) : (
            <Button
              size="small"
              variant="outlined"
              className="ms-md-2 rounded-4 shadow ms-2"
              color={darkMode ? "light" : "success"}
              onClick={() => {
                loadData();
              }}
            >
              Cerca
            </Button>
          )}
        </div>
        {weather && (
          <div
            className="d-flex p-2 rounded-3 shadow ms-2 ms-md-0"
            style={{ backgroundColor: darkMode ? "#494a5d" : "#e2e2e5" }}
          >
            <div>
              <h1>{weather.icon}</h1>
            </div>
            <div className="ms-2">
              <p className="fw-bold">{weather.city}</p>
              <p>{weather.temperature}°C</p>
            </div>
          </div>
        )}
      </div>
      {newsToshow && (
        <div
          style={{ backgroundColor: darkMode ? "#494a5d" : "#e2e2e5" }}
          className="d-flex flex-column rounded-4 mt-5"
        >
          <div className="d-flex flex-column flex-md-row py-4">
            {newsToshow.results.slice(0, 1).map((item) => (
              <div
                key={item.id}
                className="d-flex flex-column mx-md-5 mx-auto col-10 col-md-5"
              >
                <img
                  src={
                    item.image_url
                      ? item.image_url
                      : "https://www.ostwal.in/wp-content/uploads/2021/03/news-featured-img.png"
                  }
                  alt={item.title}
                  className="rounded-4 mb-3 shadow"
                  style={{ width: "100%" }}
                />
                <h4
                  className="news-title"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  {item.title}
                </h4>
                <p>{item.source_name}</p>
              </div>
            ))}

            <div className="d-flex flex-column justify-content-around px-md-5 mx-auto mx-md-0 mt-4 mt-md-0 col-10 col-md-6">
              {newsToshow.results.slice(1, 4).map((item) => (
                <div key={item.id} className="my-2 my-md-0">
                  <h5
                    className="fw-bold news-title"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    {item.title}
                  </h5>
                  <p>{item.source_name}</p>
                </div>
              ))}
            </div>
          </div>
          <hr className="mx-5"></hr>
          <div className="d-flex mt-4 flex-column flex-md-row py-4">
            {newsToshow.results.slice(4, 5).map((item) => (
              <div
                key={item.id}
                className="d-flex flex-column mx-md-5 mx-auto col-10 col-md-5"
              >
                <img
                  src={
                    item.image_url
                      ? item.image_url
                      : "https://www.ostwal.in/wp-content/uploads/2021/03/news-featured-img.png"
                  }
                  alt={item.title}
                  className="rounded-4 mb-3 shadow"
                  style={{ width: "100%" }}
                />
                <h4
                  className="news-title"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  {item.title}
                </h4>
                <p>{item.source_name}</p>
              </div>
            ))}

            <div className="d-flex flex-column justify-content-around px-md-5 mx-auto mx-md-0 mt-4 mt-md-0 col-10 col-md-6">
              {newsToshow.results.slice(5, 8).map((item) => (
                <div key={item.id} className="my-2 my-md-0">
                  <h5
                    className="fw-bold news-title"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    {item.title}
                  </h5>
                  <p>{item.source_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!newsToshow && loading && (
        <div
          style={{ backgroundColor: darkMode ? "#494a5d" : "#e2e2e5" }}
          className="d-flex flex-column rounded-4 mt-5"
        >
          <div className="d-flex flex-column flex-md-row py-4">
            {Array.from({ length: 1 }, (_, i) => i).map((item) => (
              <div
                key={item.id}
                className="d-flex flex-column mx-md-5 mx-auto col-10 col-md-5"
              >
                <Skeleton variant="rounded" width="100%" height={190} />
                <Skeleton width="100%" height={50} />
                <Skeleton width="100%" height={50} />
              </div>
            ))}

            <div className="d-flex flex-column justify-content-around px-md-5 mx-auto mx-md-0 mt-4 mt-md-0 col-10 col-md-6">
              {Array.from({ length: 3 }, (_, i) => i).map((item) => (
                <div key={item.id} className="my-2 my-md-0">
                  <Skeleton width="100%" height={35} />
                  <Skeleton width="100%" height={35} />
                </div>
              ))}
            </div>
          </div>
          <hr></hr>
          <div className="d-flex flex-column flex-md-row py-4">
            {Array.from({ length: 1 }, (_, i) => i).map((item) => (
              <div
                key={item.id}
                className="d-flex flex-column mx-md-5 mx-auto col-10 col-md-5"
              >
                <Skeleton variant="rounded" width={450} height={190} />
                <Skeleton width={450} height={50} />
                <Skeleton width={450} height={50} />
              </div>
            ))}

            <div className="d-flex flex-column justify-content-around px-md-5 mx-auto mx-md-0 mt-4 mt-md-0 col-10 col-md-6">
              {Array.from({ length: 3 }, (_, i) => i).map((item) => (
                <div key={item.id} className="my-2 my-md-0">
                  <Skeleton width={450} height={35} />
                  <Skeleton width={450} height={35} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Col>
  );
};

export { NewsPage };
