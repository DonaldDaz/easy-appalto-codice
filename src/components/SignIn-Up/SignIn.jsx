import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { supabase } from "../../supabase.js";
import { em } from "motion/react-client";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showAlert } from "../../utils/constants/constants.js";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateEmail = (email) => emailRegex.test(email);

  const showErrorBanner = (text) => {
    showAlert(dispatch, true, "error", text);
    setTimeout(() => {
      showAlert(dispatch, false);
      setIsLoading(false);
    }, 3000);
  };

  async function loginUser(email, password) {
    setIsLoading(true);
    if (!validateEmail(email)) {
      showErrorBanner("Formato Email non valido, controlla che sia corretto.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.code === "invalid_credentials") {
        showErrorBanner("Email o password errate, controlla i dati inseriti.");
      } else {
        showErrorBanner("Errore nel login, riprova fra poco.");
      }

      return { success: false, error: error.message };
    }

    setTimeout(() => {
      navigate("/home");
      setIsLoading(false);
    }, 2000);

    return { success: true, user: data.user };
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const getUsersCount = async () => {
    try {
      const { data, error, count } = await supabase
        .from("users") // Nome della tua tabella, modificalo se necessario
        .select("*", { count: "exact" }); // Il parametro { count: 'exact' } restituirà il numero esatto di righe

      if (error) {
        throw error;
      }

      console.log("Numero di utenti nel DB:", count, data); // Stampiamo il numero di utenti nel DB
      return count;
    } catch (error) {
      console.error(
        "Errore nel recupero del conteggio degli utenti:",
        error.message
      );
    }
  };
  const deleteAllUsers = async (supabase) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .gt("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        console.log("Errore nell'eliminazione degli utenti:", error.message);
        return { success: false, message: error.message };
      }

      console.log("Tutti gli utenti sono stati eliminati con successo.");
      return { success: true, message: "Tutti gli utenti eliminati." };
    } catch (err) {
      console.log("Errore inatteso:", err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <div>
      <Form className="mt-4 d-flex flex-column px-2 px-md-5">
        <TextField
          label="Email"
          variant="outlined"
          className="mb-3"
          size="small"
          color="success"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-password_2"
            size="small"
            color="success"
          >
            Password
          </InputLabel>
          <OutlinedInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            color="success"
            id="outlined-adornment-password_2"
            type={showPassword ? "text" : "password"}
            size="small"
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
        </FormControl>
        <div>
          <p
            className="mt-2 text-blue"
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Hai dimenticato la password?
          </p>
        </div>
        {isLoading ? (
          <LoadingButton
            fullWidth
            loading
            variant="contained"
            className="rounded-4 shadow btn-warning w-50 align-self-center mt-3"
          >
            {" "}
            Accedi
          </LoadingButton>
        ) : (
          <Button
            className="rounded-4 shadow btn-warning w-50 align-self-center mt-3"
            type="submit"
            variant="warning"
            onClick={(e) => {
              e.preventDefault();
              loginUser(email, password);
            }}
          >
            Accedi
          </Button>
        )}
      </Form>
    </div>
  );
};

export { SignIn };
