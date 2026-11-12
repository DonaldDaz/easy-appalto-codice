const getAllDataset = (
  regio,
  prov,
  comu,
  categs,
  importFrom,
  importTo,
  expDate
) => {
  fetch(
    `https://pubblicitalegale.anticorruzione.it/api/v0/avvisi?page=0&size=10&codiceScheda=7,8a,9&dataPubblicazioneEnd=30/01/2025&dataPubblicazioneStart=30/01/2025`
  );
};

export const openSidebar = (dispatch, payload) => {
  dispatch({ type: "COLL_SIDE_BAR", payload: payload });
};

export const checkUsernameExists = async (username, supabase) => {
  try {
    const { data, error } = await supabase
      .from("users") // Nome della tabella
      .select("username") // Campo da controllare
      .eq("username", username) // Filtro
      .limit(1); // Ottimizzazione: fermati al primo risultato

    if (error) {
      console.error(
        "Errore durante la verifica dello username:",
        error.message
      );
      return { exists: false, error: error.message };
    }

    if (data.length > 0) {
      return { exists: true };
    } else {
      return { exists: false };
    }
  } catch (err) {
    console.error("Errore inatteso:", err);
    return { exists: false, error: "Errore inatteso" };
  }
};

export const checkEmailExists = async (email, supabase) => {
  try {
    const { data, error } = await supabase
      .from("users") // Nome della tabella
      .select("email") // Campo da controllare
      .eq("email", email) // Filtro
      .limit(1); // Ottimizzazione: fermati al primo risultato

    if (error) {
      console.error(
        "Errore durante la verifica dello username:",
        error.message
      );
      return { exists: false, error: error.message };
    }

    if (data.length > 0) {
      return { exists: true };
    } else {
      return { exists: false };
    }
  } catch (err) {
    console.error("Errore inatteso:", err);
    return { exists: false, error: "Errore inatteso" };
  }
};

export async function insertOrUpdateUserData({ payload, userId, supabase }) {
  console.log(userId);
  try {
    // Se non viene fornito userId, usa l'utente corrente
    const uid = userId || supabase.auth.user()?.id;

    if (!uid) {
      return {
        status: false,
        msg: "Utente non autenticato",
        data: null,
      };
    }

    // Formatta la data di nascita
    const formattedBirthDate =
      payload.birthDate instanceof Date
        ? payload.birthDate.toISOString().split("T")[0]
        : payload.birthDate;

    // Chiamata alla funzione Supabase
    const { data, error } = await supabase.rpc("insert_or_update_user_data", {
      p_id: uid,
      p_name: payload.name,
      p_last_name: payload.lastName,
      p_email: payload.email,
      p_tel_number: payload.telNumber,
      p_birth_place: payload.birthPlace,
      p_birth_date: formattedBirthDate,
      p_state: payload.state,
      p_city: payload.city,
      p_full_address: payload.fullAddress,
      p_zip_code: payload.zipCode,
      p_prov: payload.prov,
      p_username: payload.username,
      p_photo_url:
        payload.photoUrl ||
        "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-21.jpg",
    });
    console.log(error);
    if (error) throw error;
    console.log(data);
    return data;
  } catch (error) {
    return {
      status: false,
      msg: `Errore nella chiamata di insert_or_update_user_data: ${error.message}`,
      data: null,
    };
  }
}

export async function signUpUserWithPassword(email, password, supabase) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Errore nella registrazione:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Utente registrato con successo!", data);
    return { success: true, data };
  } catch (err) {
    console.error("Errore imprevisto:", err);
    return { success: false, error: err.message };
  }
}

export const cleanData = (dispatch) => {
  dispatch({ type: "SET_USER", payload: [] });
  dispatch({ type: "REMOVE_ALL_BANDI", payload: [] });
  dispatch({ type: "SET_SIDE_ACT", payload: "DASH" });
  dispatch({ type: "ADD_SUBSCR", payload: [] });
};
