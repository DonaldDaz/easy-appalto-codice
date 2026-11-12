import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import categorieSOA from "../../utils/json/categorie_lav.json";
import classificheSOA from "../../utils/json/classisifiche_SOA.json";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import useAutocomplete from "@mui/material/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import iso_class from "../../utils/json/cert_iso.json";
import tipi_soc from "../../utils/json/tipi_soc.json";

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 14px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  font-size: 1.2em;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
  
    border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    border-radius: 4px;
    padding: 1px;
    display: flex;
    flex-wrap: wrap;

  
    &:hover {
      border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#dddd"};
    }
  
    &.focused {
      border-color: ${theme.palette.mode === "dark" ? "#198754" : "#198754"};
      box-shadow: 0 0 0 2px #198754;
    }
  
    & input {
      background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
      color: ${
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.65)"
          : "rgba(0,0,0,.85)"
      };
      height: 34px;
      box-sizing: border-box;
      padding: 4px 6px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `
);

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

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"
  };
  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 25px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 70%;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  z-index: 100;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
      font-size: 25px
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

const AdditionalInfo = () => {
  const [lines, setLines] = useState([{ id: 1 }]); // Inizializza con una riga

  const addLine = () => {
    const maxId =
      lines.length > 0 ? Math.max(...lines.map((line) => line.id)) : 0;
    setLines([...lines, { id: maxId + 1 }]); // Usa l'ID progressivo
  };

  const removeLine = (id) => {
    setLines(lines.filter((line) => line.id !== id)); // Rimuove la riga selezionata
  };

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo2",
    defaultValue: [],
    multiple: true,
    options: iso_class,
    // value: categs, add value later
    getOptionLabel: (option) => option.title,
  });

  return (
    <div className="mt-5 d-flex flex-column pb-5 px-md-5 additional-info-section">
      <div className="d-flex flex-column px-md-5">
        <h5 className="text-center my-3">
          Aggiungi le info realtive alla tua azienda
        </h5>
        <FormControl fullWidth className="mb-3">
          <InputLabel
            id="demo-simple-select-label2"
            size="small"
            color="success"
          >
            Tipo Società
          </InputLabel>
          <Select
            color="success"
            size="small"
            labelId="demo-simple-select-label2"
            id="demo-simple-select2"
            // value={age}
            label="Age"
            // onChange={handleChange}
          >
            {tipi_soc.map((soc, i) => {
              return (
                <MenuItem key={i} value={soc.sigla}>
                  {soc.sigla} - {soc.descrizione}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          label="Ragione Sociale"
          // placeholder={dataInputs.name}
          variant="outlined"
          size="small"
          color="success"
          // value={inputFields.name}
          // onChange={(e) =>
          //   setInputFields({ ...inputFields, name: e.target.value })
          // }
        />
        <TextField
          label="Sede Legale"
          // value={inputFields.lastName}
          // placeholder={dataInputs.lastName}
          variant="outlined"
          size="small"
          color="success"
          className="my-3"
          // onChange={(e) =>
          //   setInputFields({ ...inputFields, lastName: e.target.value })
          // }
        />
        <TextField
          // value={inputFields.email}
          label="P.Iva"
          // placeholder={dataInputs.email}
          variant="outlined"
          size="small"
          color="success"
          type="text"
          // onChange={(e) =>
          //   setInputFields({ ...inputFields, email: e.target.value })
          // }
        />
        <TextField
          // value={inputFields.telNumber}
          label="Cod. Fiscale Società"
          // placeholder={dataInputs.telNumber}
          variant="outlined"
          size="small"
          color="success"
          type="number"
          className="my-3"
          // onChange={(e) =>
          //   setInputFields({
          //     ...inputFields,
          //     telNumber: e.target.value.toString(),
          //   })
          // }
        />
        <TextField
          // value={inputFields.birthPlace}
          label="Email Società"
          // placeholder={dataInputs.birthPlace}
          variant="outlined"
          size="small"
          color="success"
          type="email"
          // onChange={(e) =>
          //   setInputFields({
          //     ...inputFields,
          //     birthPlace: e.target.value.toString(),
          //   })
          // }
        />
        <Root className="w-100 my-3">
          <div {...getRootProps()} className="w-100">
            <Label {...getInputLabelProps()} className="iso-label mb-1">
              Certificazioni ISO possedute
            </Label>
            <InputWrapper
              ref={setAnchorEl}
              className={focused ? "focused" : ""}
            >
              {value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <StyledTag
                    key={key}
                    {...tagProps}
                    label={option.certificazione}
                  />
                );
              })}
              <input {...getInputProps()} />
            </InputWrapper>
          </div>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {groupedOptions.map((option, index) => {
                const { key, ...optionProps } = getOptionProps({
                  option,
                  index,
                });
                return (
                  <li key={key} {...optionProps}>
                    <span>
                      {option.certificazione} - {option.descrizione}
                    </span>
                    <CheckIcon fontSize="large" />
                  </li>
                );
              })}
            </Listbox>
          ) : null}
        </Root>
        <div className="mt-2 d-flex flex-column">
          <p>Categorie e classifiche SOA possedute</p>
          {lines.map((line, i) => {
            return (
              <div
                key={line.id}
                className="d-flex justify-content-between align-items-center"
              >
                <FormControl size="small" className="my-3 categ-form">
                  <InputLabel id="demo-select-small-label2" color="success">
                    Categoria
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label2"
                    id="demo-select-small2"
                    // value={age}
                    label="Age"
                    color="success"
                    // onChange={handleChange}
                  >
                    {categorieSOA.map((cat, i) => {
                      return (
                        <MenuItem key={i} value={cat.categoria}>
                          {cat.categoria}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl size="small" className="my-3 class-form">
                  <InputLabel id="demo-select-small-label2" color="success">
                    Classifica
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label2"
                    id="demo-select-small2"
                    // value={age}
                    label="Age"
                    color="success"
                    // onChange={handleChange}
                  >
                    {classificheSOA.map((clas, i) => {
                      return (
                        <MenuItem key={i} value={clas.classifica}>
                          {clas.id} - {clas.classifica}, {clas.descrizione}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <DeleteIcon
                  color="error"
                  className="fs-3 pointer"
                  onClick={() => removeLine(line.id)}
                />
              </div>
            );
          })}

          <Button
            className="rounded-4 shadow ms-auto"
            variant="outlined"
            color="success"
            onClick={addLine}
          >
            <AddIcon /> Aggiungi nuova riga
          </Button>
        </div>

        <TextField
          className="mt-3"
          // value={inputFields.birthPlace}
          label="Codice SDI"
          // placeholder={dataInputs.birthPlace}
          variant="outlined"
          size="small"
          color="success"
          type="text"
          // onChange={(e) =>
          //   setInputFields({
          //     ...inputFields,
          //     birthPlace: e.target.value.toString(),
          //   })
          // }
        />
        <TextField
          className="my-3"
          // value={inputFields.birthPlace}
          label="PEC"
          // placeholder={dataInputs.birthPlace}
          variant="outlined"
          size="small"
          color="success"
          type="email"
          // onChange={(e) =>
          //   setInputFields({
          //     ...inputFields,
          //     birthPlace: e.target.value.toString(),
          //   })
          // }
        />
        <TextField
          label="Posizione nei confronti dell’azienda"
          // placeholder={dataInputs.name}
          variant="outlined"
          size="small"
          color="success"
          // value={inputFields.name}
          // onChange={(e) =>
          //   setInputFields({ ...inputFields, name: e.target.value })
          // }
        />

        <div className="mt-3">
          <Button
            className="rounded-4 shadow"
            variant="outlined"
            color="success"
          >
            Aggiorna informazioni
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AdditionalInfo };
