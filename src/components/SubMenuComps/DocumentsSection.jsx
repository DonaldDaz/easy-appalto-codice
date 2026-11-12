import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "styled-components";
import { Box, Button, LinearProgress, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
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

const DocumentsSection = () => {
  const [fileUploaded, setFileUploaded] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const documentsToShow = [
    "Documento di riconoscimento",
    "Codice Fiscale",
    "Visura Camerale",
    "Certificazioni SOA",
    "Certificazioni ISO",
    "White List",
    "DURC",
    "Elenco mezzi ed attrezzature",
  ];

  const handleUpload = async (event, docName) => {
    setUploadingDoc(docName); // Blocca gli altri bottoni

    const files = event.target.files;
    if (!files.length) return;

    setTimeout(() => {
      setUploadingDoc(null); // Riabilita i bottoni
    }, 2000);
  };

  return (
    <div className="d-flex justify-content-center flex-column mt-5 documents-section">
      <h4 className="text-center">Carica i tuoi documenti in questa sezione</h4>

      <div className="d-flex flex-column mt-5">
        {documentsToShow.map((doc) => (
          <>
            <div
              key={doc}
              className="d-flex align-items-center mt-1  col-12 justify-content-between"
            >
              <p className="doc-title col-md-3">{doc}</p>
              <div className="d-flex align-items-center col-md-3 ms-auto md-md-0">
                <p>Stato:</p>
                <Tooltip title="Non caricato">
                  <PriorityHighIcon color="warning" className="pointer" />
                </Tooltip>
              </div>

              {uploadingDoc === doc ? (
                <LoadingButton
                  size="medium"
                  loading
                  variant="contained"
                  className="rounded-4"
                  color="error"
                  startIcon={<CloudUploadIcon />}
                >
                  Carica
                </LoadingButton>
              ) : (
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  className="rounded-4 shadow"
                  color="warning"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingDoc !== null}
                >
                  Carica
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => handleUpload(event, doc)}
                    multiple
                  />
                </Button>
              )}
            </div>
            <hr className="m-2"></hr>
          </>
        ))}
      </div>
      <div className="mt-5">
        <p className="fw-bold">Legenda stato documento</p>
        <div className="d-flex align-items-center">
          <PriorityHighIcon color="warning" className="pointer" />
          <p>= Non caricato</p>
        </div>
        <div className="d-flex align-items-center">
          <DoneIcon color="success" className="pointer" />
          <p>= Caricato</p>
        </div>
        <div className="d-flex align-items-center">
          <CloseIcon color="error" className="pointer" />
          <p>= Errore sul file</p>
        </div>
      </div>
    </div>
  );
};

export { DocumentsSection };
