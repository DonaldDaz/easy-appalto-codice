import { Button, TextField } from "@mui/material";
import styled from "styled-components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../../utils/constants/constants";

const ProfileSection = ({ darkMode }) => {
  const user_data = useSelector((state) => state.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [enabledInput, setEnabledInput] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputFields, setInputFields] = useState({
    name: "",
    last_name: "",
    tel_number: 0,
    birth_place: "",
    birth_date: "",
    state: "",
    city: "",
    full_address: "",
    zip_code: 0,
    prov: "",
  });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const fillInputs = () => {
    if (user_data.length > 0) {
      setUser(user_data[0]);
      setInputFields({
        name: user_data[0].name,
        last_name: user_data[0].last_name,
        tel_number: user_data[0].tel_number,
        birth_place: user_data[0].birth_place,
        birth_date: user_data[0].birth_date,
        state: user_data[0].state,
        city: user_data[0].city,
        full_address: user_data[0].full_address,
        zip_code: user_data[0].zip_code,
        prov: user_data[0].prov,
      });
    }
  };

  const checkVariations = (payload) => {
    if (!user_data || !user_data.length > 0) {
      return false;
    }
    if (
      payload.name === user_data[0].name &&
      payload.last_name === user_data[0].last_name &&
      payload.tel_number === user_data[0].tel_number &&
      payload.birth_place === user_data[0].birth_place &&
      payload.birth_date === user_data[0].birth_date &&
      payload.state === user_data[0].state &&
      payload.city === user_data[0].city &&
      payload.full_address === user_data[0].full_address &&
      payload.zip_code === user_data[0].zip_code &&
      payload.prov === user_data[0].prov
    ) {
      return false;
    } else return true;
  };

  const editField = (field) => {
    setEnabledInput((prev) => (prev === field ? "" : field));
  };

  const showErroBanner = (text) => {
    showAlert(dispatch, true, "error", text);
    setTimeout(() => {
      showAlert(dispatch, false);
    }, 3000);
  };

  const showSuccessbanner = (text) => {
    showAlert(dispatch, true, "success", text);
    setTimeout(() => {
      showAlert(dispatch, false);
    }, 3000);
  };

  const updateUserData = async (payload) => {
    setIsLoading(true);
    setEnabledInput("");
    try {
      // Ottieni l'ID utente
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

      // Formattazione della data di nascita
      const formattedBirthDate =
        payload.birth_date instanceof Date
          ? payload.birth_date.toISOString().split("T")[0]
          : payload.birth_date;

      const { data, error } = await supabase.rpc("insert_or_update_user_data", {
        p_birth_date: formattedBirthDate,
        p_birth_place: payload.birth_place,
        p_city: payload.city,
        p_email: userData.user.email,
        p_full_address: payload.full_address,
        p_id: uid,
        p_last_name: payload.last_name,
        p_name: payload.name,
        p_photo_url:
          "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-21.jpg",
        p_prov: payload.prov,
        p_state: payload.state,
        p_tel_number: payload.tel_number,
        p_username: user_data[0].username,
        p_zip_code: payload.zip_code,
      });

      if (error) throw error;

      setTimeout(() => {
        setIsLoading(false);
        dispatch({ type: "SET_USER", payload: [data.data] });
        showSuccessbanner("Campi aggiornati correttamente!");
        setUser(data.data);
      }, 2000);
    } catch (error) {
      showErroBanner(
        "Errore durante la fase di aggiornamento dei campi, riprova tra poco."
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fillInputs();
  }, []);

  return (
    <div className="d-flex flex-column mt-5 profile-section">
      {user && (
        <>
          <div
            className="d-flex p-4 rounded-4 flex-column flex-md-row align-items-center shadow"
            style={{ backgroundColor: "#EFECE9" }}
          >
            <div className="d-flex flex-column align-items-center me-md-auto mb-3">
              <p>La tua foto profilo</p>
              <div
                className="rounded-circle my-3"
                style={{ border: "dashed 2px" }}
              >
                <img
                  alt="user-pic"
                  src={user.photo_url}
                  width={100}
                  className="rounded-circle"
                />
              </div>
              <Button
                component="label"
                color="warning"
                role={undefined}
                variant="contained"
                className="rounded-4 shadow profile-picture-upload"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Carica foto
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => console.log(event.target.files)}
                  multiple
                />
              </Button>
            </div>
            <div
              className="d-flex align-items-center me-md-auto rounded-4 p-4 align-self-center"
              style={{
                backgroundImage:
                  "url(https://cdn.dribbble.com/users/118246/screenshots/5343519/wifi.gif)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "180px",
                backgroundPositionY: "55%",
              }}
            >
              <div className="blur py-2">
                <h2>Bentornato, {user.name}</h2>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row mt-4">
            <div className="d-flex flex-column flex-grow-1 me-md-2">
              <p className="mb-2">Generali</p>
              <div className="d-flex align-items-center">
                <TextField
                  disabled={enabledInput !== "name"}
                  fullWidth
                  label="Nome"
                  variant="outlined"
                  size="small"
                  color="success"
                  value={inputFields.name}
                  onChange={(e) =>
                    setInputFields({ ...inputFields, name: e.target.value })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("name")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center mt-3">
                <TextField
                  disabled={enabledInput !== "lastName"}
                  fullWidth
                  label="Cognome"
                  value={inputFields.last_name}
                  variant="outlined"
                  size="small"
                  color="success"
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      last_name: e.target.value,
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("lastName")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center my-3">
                <TextField
                  disabled={enabledInput !== "telNumber"}
                  fullWidth
                  value={inputFields.tel_number}
                  label="N. Telefonico"
                  variant="outlined"
                  size="small"
                  color="success"
                  type="number"
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      tel_number: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("telNumber")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <TextField
                  disabled={enabledInput !== "birthPlace"}
                  value={inputFields.birth_place}
                  label="Luogo di nascita"
                  variant="outlined"
                  size="small"
                  color="success"
                  type="text"
                  fullWidth
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      birth_place: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("birthPlace")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center my-3">
                <TextField
                  disabled={enabledInput !== "birthDate"}
                  value={inputFields.birth_date}
                  label="Data di nascita"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="date"
                  color="success"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      birth_date: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("birthDate")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
            </div>
            <div className="d-flex flex-column flex-grow-1 mt-3 mt-md-0 ms-md-2">
              <p className="mb-2">Residenza</p>
              <div className="d-flex align-items-center">
                <TextField
                  fullWidth
                  disabled={enabledInput !== "state"}
                  value={inputFields.state}
                  label="Nazione"
                  variant="outlined"
                  size="small"
                  color="success"
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      state: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("state")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center my-3">
                <TextField
                  disabled={enabledInput !== "city"}
                  value={inputFields.city}
                  fullWidth
                  label="Città"
                  variant="outlined"
                  size="small"
                  color="success"
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      city: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("city")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <TextField
                  disabled={enabledInput !== "fullAddress"}
                  value={inputFields.full_address}
                  label="Indirizzo"
                  fullWidth
                  variant="outlined"
                  size="small"
                  color="success"
                  type="text"
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      full_address: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("fullAddress")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center my-3">
                <TextField
                  disabled={enabledInput !== "zipCode"}
                  value={inputFields.zip_code}
                  label="CAP"
                  variant="outlined"
                  size="small"
                  color="success"
                  type="number"
                  fullWidth
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      zip_code: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("zipCode")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <TextField
                  disabled={enabledInput !== "prov"}
                  value={inputFields.prov}
                  label="Provincia"
                  variant="outlined"
                  size="small"
                  color="success"
                  type="text"
                  fullWidth
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      prov: e.target.value.toString(),
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="dark"
                  className="ms-2 rounded-3 shadow"
                  onClick={() => editField("prov")}
                >
                  <EditIcon style={{ fill: "#8b8b8b" }} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <LoadingButton
                size="medium"
                loading
                variant="contained"
                className="rounded-4"
                color="error"
                startIcon={<SearchIcon />}
              >
                Aggiorna Informazioni
              </LoadingButton>
            ) : (
              <Button
                disabled={!checkVariations(inputFields)}
                variant="outlined"
                color="success"
                className="rounded-4 shadow"
                onClick={() => {
                  updateUserData(inputFields);
                }}
              >
                Aggiorna Informazioni
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export { ProfileSection };
