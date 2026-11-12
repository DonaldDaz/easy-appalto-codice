import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MobileStepper,
  OutlinedInput,
  TextField,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { showAlert } from "../../utils/constants/constants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import { supabase } from "../../supabase.js";
import {
  checkEmailExists,
  checkUsernameExists,
  signUpUserWithPassword,
} from "../../utils/functions/functions.js";
import { MuiOtpInput } from "mui-one-time-password-input";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [somethingMissing, setSomethingMissing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [dataInputs, setDataInputs] = useState({
    name: "",
    lastName: "",
    email: "",
    telNumber: "",
    birthPlace: "",
    birthDate: "",
    state: "",
    city: "",
    fullAddress: "",
    zipCode: "",
    prov: "",
    username: "",
    password: "",
    tocAccepted: false,
    otpCode: "",
  });

  const payload = [
    {
      name: dataInputs.name,
      lastName: dataInputs.lastName,
      email: dataInputs.email,
      telNumber: dataInputs.telNumber,
      birthPlace: dataInputs.birthPlace,
      birthDate: dataInputs.birthDate,
      state: dataInputs.state,
      city: dataInputs.city,
      fullAddress: dataInputs.fullAddress,
      zipCode: dataInputs.zipCode,
      prov: dataInputs.prov,
      username: dataInputs.username,
      photoUrl:
        "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-21.jpg",
    },
  ];

  const privatePayload = {
    email: dataInputs.email,
    password: dataInputs.password,
  };

  const requestOTP = async (email) => {
    if (checkUsername(dataInputs.username)) {
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        handleNext();
        return { success: true };
      } catch (err) {
        showErroBanner("Errore nell’invio dell’OTP, riprova fra poco.");
        return { success: false, error: err.message };
      }
    } else {
      showErroBanner("Username gia in uso");
      return false;
    }
  };

  const verifyOTP = async (email, token) => {
    try {
      const { error, data } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: "signup",
      });

      if (error) throw error;
      registerUser(
        privatePayload.email,
        privatePayload.password,
        payload,
        data.user.id
      );
      return {
        success: true,
        message: "Autenticazione riuscita",
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      showErroBanner("Auteticazione fallita, richiedi un nuovo coidce OTP.");
      return { success: false, message: error.message };
    }
  };

  const handleChangeOtp = (e) => {
    const newValue = e;

    // Verifica che il nuovo valore sia solo numerico
    if (/^\d*$/.test(newValue)) {
      setDataInputs({
        ...dataInputs,
        otpCode: newValue,
      });
    }
  };

  const checkUsername = async (username) => {
    if (!username) {
      return;
    }

    const result = await checkUsernameExists(username, supabase);

    if (result.exists) {
      return true;
    } else {
      return false;
    }
  };

  const checkEmail = async (email) => {
    if (!email) {
      return;
    }

    const result = await checkEmailExists(email, supabase);

    if (result.exists) {
      return true;
    } else {
      return false;
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //check for email field to be validated

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateEmail = (email) => emailRegex.test(email);

  //check for all the inputs fields to be filled before going to next step

  const checkFields1 = () => {
    if (
      dataInputs.name &&
      dataInputs.lastName &&
      dataInputs.email &&
      dataInputs.telNumber &&
      dataInputs.birthDate &&
      dataInputs.birthDate
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkFields2 = () => {
    if (
      dataInputs.state &&
      dataInputs.city &&
      dataInputs.fullAddress &&
      dataInputs.zipCode &&
      dataInputs.prov
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkFields3 = () => {
    if (dataInputs.username && dataInputs.password) {
      return true;
    } else {
      return false;
    }
  };

  const showErroBanner = (text) => {
    showAlert(dispatch, true, "error", text);
    setSomethingMissing(true);
    setTimeout(() => {
      showAlert(dispatch, false);
      setSomethingMissing(false);
    }, 3000);
  };

  const checkOnSteps = (stepNumber) => {
    if (stepNumber === 0) {
      if (checkFields1()) {
        if (validateEmail(dataInputs.email)) {
          setSomethingMissing(false);
          if (checkEmail(dataInputs.email)) {
            setSomethingMissing(false);
            handleNext();
          } else {
            showErroBanner("Email inserita gia utilizzata.");
          }
        } else {
          showErroBanner(
            "Email non valida, inserisci un formato accettabile: ES: email@domain.com"
          );
        }
      } else {
        showErroBanner("Compila i campi mancanti");
      }
    } else if (stepNumber === 1) {
      if (checkFields2()) {
        setSomethingMissing(false);
        handleNext();
      } else {
        showErroBanner("Compila i campi mancanti");
      }
    } else if (stepNumber === 2) {
      if (checkFields3()) {
        if (dataInputs.password.length < 8) {
          showErroBanner("Password troppo corta!");
          return;
        }
        if (!/[A-Z]/.test(dataInputs.password)) {
          showErroBanner(
            "La password deve contenere almeno una lettera maiucola!"
          );
          return;
        }
        if (!dataInputs.tocAccepted) {
          showErroBanner(
            "Accetta i termini e condizioni prima di registrarti."
          );
        } else {
          requestOTP(dataInputs.email);
        }
      } else {
        showErroBanner("Compila i campi mancanti");
      }
    } else if (stepNumber === 3) {
      if (!dataInputs.otpCode) {
        showErroBanner("Inserisci il codice OTP ricevuto via mail.");
      } else {
        //registerUser();
        verifyOTP(dataInputs.email, dataInputs.otpCode);
      }
    }
  };

  const registerUser = async (email, password, payload, id) => {
    setIsLoading(true);

    const { data: passwordData, error: passwordError } =
      await supabase.auth.updateUser({
        password,
      });

    if (passwordError) {
      showErroBanner("Errore nell'aggiornamento della password.");
      return null;
    }

    if (passwordData) {
      const userId = id;

      try {
        const uid = userId || supabase.auth.user()?.id;
        if (!uid) {
          showErroBanner("Errore: Utente non autenticato, riprova tra poco.");
          setIsLoading(false);
          return;
        }

        const formattedBirthDate =
          payload[0].birthDate instanceof Date
            ? payload[0].birthDate.toISOString().split("T")[0]
            : payload[0].birthDate;

        const { data, error } = await supabase.rpc(
          "insert_or_update_user_data",
          {
            p_id: uid,
            p_name: payload[0].name,
            p_last_name: payload[0].lastName,
            p_email: payload[0].email,
            p_tel_number: payload[0].telNumber,
            p_birth_place: payload[0].birthPlace,
            p_birth_date: formattedBirthDate,
            p_state: payload[0].state,
            p_city: payload[0].city,
            p_full_address: payload[0].fullAddress,
            p_zip_code: payload[0].zipCode,
            p_prov: payload[0].prov,
            p_username: payload[0].username,
            p_photo_url:
              payload[0].photoUrl ||
              "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-21.jpg",
          }
        );

        setTimeout(() => {
          navigate("/home");
          setIsLoading(false);
        }, 1000);

        if (error) throw error;
      } catch (error) {
        showErroBanner("Errore nella registrazione, riprova tra poco.");
        setIsLoading(false);
      }
    } else {
      showErroBanner("Errore nella registrazione, riprova tra poco.");
      setIsLoading(false);
    }
  };

  const stepComponents = [
    <Form
      key={0}
      className=" d-flex flex-column  px-md-5"
      style={{ height: "200px" }}
    >
      <div className="py-2">
        <p className="m-0">Informazioni preliminari</p>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <TextField
          value={dataInputs.name}
          label="Nome"
          variant="outlined"
          size="small"
          className={`flex-grow-1  ${
            dataInputs.name === "" && somethingMissing ? "error-border" : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, name: e.target.value })
          }
        />
        <TextField
          value={dataInputs.lastName}
          label="Cognome"
          variant="outlined"
          size="small"
          className={`flex-grow-1 ms-2 ${
            dataInputs.lastName === "" && somethingMissing ? "error-border" : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, lastName: e.target.value })
          }
        />
      </div>
      <div className="d-flex justify-content-between mb-3">
        <TextField
          value={dataInputs.email}
          label="Email"
          type="email"
          variant="outlined"
          size="small"
          color="success"
          className={`flex-grow-1 ${
            dataInputs.email === "" && somethingMissing ? "error-border" : ""
          }`}
          onChange={(e) =>
            setDataInputs({ ...dataInputs, email: e.target.value })
          }
        />

        <TextField
          value={dataInputs.telNumber}
          label="Telefono"
          type="number"
          variant="outlined"
          size="small"
          color="success"
          className={`flex-grow-1 ms-2 ${
            dataInputs.telNumber === "" && somethingMissing
              ? "error-border"
              : ""
          }`}
          onChange={(e) =>
            setDataInputs({
              ...dataInputs,
              telNumber: e.target.value.toString(),
            })
          }
        />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <TextField
          value={dataInputs.birthPlace}
          label="Luogo di nascita"
          variant="outlined"
          size="small"
          className={`flex-grow-1 ${
            dataInputs.birthPlace === "" && somethingMissing
              ? "error-border"
              : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, birthPlace: e.target.value })
          }
        />

        <TextField
          value={dataInputs.birthDate}
          label="Data di nascita"
          variant="outlined"
          size="small"
          className={`flex-grow-1 ms-2 ${
            dataInputs.birthDate === "" && somethingMissing
              ? "error-border"
              : ""
          }`}
          type="date"
          color="success"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) =>
            setDataInputs({ ...dataInputs, birthDate: e.target.value })
          }
        />
      </div>
    </Form>,
    <Form
      key={1}
      className=" d-flex flex-column  px-md-5"
      style={{ height: "200px" }}
    >
      <div className="py-2">
        <p className="m-0">Residenza</p>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <TextField
          value={dataInputs.state}
          label="Nazione"
          variant="outlined"
          size="small"
          className={`flex-grow-1 ${
            dataInputs.state === "" && somethingMissing ? "error-border" : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, state: e.target.value })
          }
        />
        <TextField
          value={dataInputs.city}
          label="Città"
          variant="outlined"
          size="small"
          className={`flex-grow-1 ms-2 ${
            dataInputs.city === "" && somethingMissing ? "error-border" : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, city: e.target.value })
          }
        />
      </div>
      <TextField
        value={dataInputs.fullAddress}
        label="Via (Es. Via Roma, 50)"
        variant="outlined"
        size="small"
        color="success"
        className={`mb-3 ${
          dataInputs.fullAddress === "" && somethingMissing
            ? "error-border"
            : ""
        }`}
        onChange={(e) =>
          setDataInputs({ ...dataInputs, fullAddress: e.target.value })
        }
      />

      <div className="d-flex justify-content-between mb-3">
        <TextField
          value={dataInputs.zipCode}
          label="CAP"
          variant="outlined"
          size="small"
          type="number"
          className={`${
            dataInputs.zipCode === "" && somethingMissing ? "error-border" : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, zipCode: e.target.value.toString() })
          }
        />

        <TextField
          label="Provincia"
          variant="outlined"
          value={dataInputs.prov}
          size="small"
          className={`ms-2 flex-grow-1 ${
            dataInputs.prov === "" && somethingMissing ? "error-border" : ""
          }`}
          color="success"
          onChange={(e) =>
            setDataInputs({ ...dataInputs, prov: e.target.value })
          }
        />
      </div>
    </Form>,
    <Form
      key={2}
      className=" d-flex flex-column  px-md-5"
      style={{ height: "200px" }}
    >
      <div className="py-2">
        <p className="m-0">Informazioni sul tuo account</p>
      </div>

      <div className="d-flex flex-column mb-3 pt-1">
        <TextField
          value={dataInputs.username}
          label="Username"
          variant="outlined"
          size="small"
          color="success"
          className={`${
            dataInputs.username === "" && somethingMissing ? "error-border" : ""
          }`}
          onChange={(e) =>
            setDataInputs({ ...dataInputs, username: e.target.value })
          }
        />
        <FormControl variant="outlined" className="mt-3">
          <InputLabel
            htmlFor="outlined-adornment-password_3"
            size="small"
            color="success"
          >
            Password
          </InputLabel>
          <OutlinedInput
            className={`${
              dataInputs.password === "" && somethingMissing
                ? "error-border"
                : ""
            }`}
            color="success"
            id="outlined-adornment-password_3"
            type={showPassword ? "text" : "password"}
            onChange={(e) =>
              setDataInputs({ ...dataInputs, password: e.target.value })
            }
            size="small"
            value={dataInputs.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <div className="mt-3 px-md-2">
            <p style={{ fontSize: "0.8em" }} className="text-secondary">
              La password deve contenere almeno una lettera maiuscoia ed un
              minimo di 8 caratteri.
            </p>
            <PasswordStrengthBar
              password={dataInputs.password}
              minLength={8}
              scoreWords={["Debole", "Debole", "Buona", "Ottima", "Perfetta"]}
              shortScoreWord="Troppo corta"
            />
          </div>

          <div className="d-flex align-items-center mt-0">
            <Checkbox
              className={`${
                !dataInputs.tocAccepted && somethingMissing
                  ? "error-border"
                  : ""
              }`}
              size="normal"
              color="success"
              checked={dataInputs.tocAccepted}
              onChange={(e) =>
                setDataInputs({ ...dataInputs, tocAccepted: e.target.checked })
              }
            />
            <p className="m-0 text-black" style={{ fontSize: "0.8em" }}>
              Ho letto e accetto i{" "}
              <span className="text-blue underline pointer">
                termini e condizioni.
              </span>{" "}
            </p>
          </div>
        </FormControl>
      </div>
    </Form>,
    <Form key={3} className="d-flex flex-column px-md-5">
      <h5 className="text-black text-center fw-light">
        Inserisci il codice OTP ricevuto via mail all indirizzo:<br></br>{" "}
        {dataInputs.email}
      </h5>
      <div className="mt-4 d-flex justify-content-center">
        <MuiOtpInput
          length={6}
          value={dataInputs.otpCode}
          onChange={handleChangeOtp}
        />
      </div>

      {/* <TextField
        value={dataInputs.otpCode === 0 ? "" : dataInputs.otpCode}
        label="Codice OTP"
        type="number"
        variant="outlined"
        size="small"
        color="success"
        className={`align-self-center mt-5 ${
          dataInputs.otpCode === 0 && somethingMissing ? "error-border" : ""
        }`}
        onChange={(e) =>
          setDataInputs({
            ...dataInputs,
            otpCode: e.target.value.toString(),
          })
        }
      /> */}
      {!isLoading ? (
        <Button
          variant="contained"
          color="success"
          className="rounded-3 shadow w-50 align-self-center mt-2 mt-md-4"
          onClick={() => checkOnSteps(activeStep)}
        >
          Registrati
        </Button>
      ) : (
        <LoadingButton
          fullWidth
          loading
          variant="contained"
          className="rounded-3 shadow w-50 align-self-center mt-2 mt-md-4"
        >
          {" "}
          Cerca
        </LoadingButton>
      )}
    </Form>,
  ];

  return (
    <div>
      {stepComponents[activeStep]}{" "}
      <MobileStepper
        variant="progress"
        color="success"
        steps={stepComponents.length}
        position="static"
        className="mt-5 sign-up-stepper"
        activeStep={activeStep}
        sx={{ flexGrow: 1 }}
        nextButton={
          <Button
            size="small"
            onClick={() => {
              checkOnSteps(activeStep);
            }}
            disabled={activeStep === stepComponents.length - 1}
            color="success"
          >
            Avanti
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            color="success"
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Indietro
          </Button>
        }
      />
    </div>
  );
};

export { SignUp };
