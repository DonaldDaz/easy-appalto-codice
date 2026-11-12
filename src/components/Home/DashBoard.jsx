import { Button, Col, Modal } from "react-bootstrap";
import {
  italianLocale,
  user as userData,
} from "../../utils/constants/constants";
import { gareTest as gare } from "../../utils/constants/constants";
import { Box, Breadcrumbs, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Favourites } from "./Favourites";
const Dashboard = ({ darkMode }) => {
  const [open, setOpen] = useState(false);
  const [dataToShow, setDataToShow] = useState(null);

  const now = new Date();

  const showData = (value) => {
    setDataToShow(value);
    setOpen(true);
  };

  const columns = [
    { field: "id", headerName: "N.", width: 20 },
    {
      field: "status",
      headerName: "Stato",
      width: 150,
      editable: true,
    },
    {
      field: "aggiudicata",
      headerName: "Aggiudicata",
      width: 70,
      editable: true,
    },
    {
      field: "dataInizio",
      headerName: "Data inizio",
      width: 150,
      editable: true,
    },
    {
      field: "dataScadenza",
      headerName: "Data scadenza",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "CIG",
      headerName: "CIG",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "descrizioneGara",
      headerName: "Descrizione",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 220,
    },
    {
      field: "impresaAusiliaria",
      headerName: "Impresa Ausiliaria",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 200,
    },
  ];

  return (
    <Col className="mt-5 me-md-4 d-flex flex-column overflow-x-hidden px-2 px-md-2">
      <Favourites darkMode={darkMode} />
      <h4 className="mb-3 mt-3">Le gare a cui hai partecipato di recente</h4>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          sx={{
            borderRadius: "15px",
            border: darkMode ? "0.5px solid #494A5D" : 0,
            "& .MuiDataGrid-cell": {
              color: darkMode ? "#a1a4ae" : "black",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "black",
            },
            "& .MuiTablePagination-root": {
              color: darkMode ? "white" : "black",
            },
            "& .MuiTablePagination-actions button": {
              color: darkMode ? "white" : "black",
            },
            "& .MuiDataGrid-footerContainer": {
              color: darkMode ? "white" : "black",
            },
          }}
          className="shadow"
          localeText={italianLocale}
          rows={gare}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[3]}
          onRowClick={(e) => {
            showData(e);
          }}
        />
      </Box>

      {gare && (
        <div className="shadow rounded-4 my-5  py-4 px-2 gradient-2">
          <div className="overflow-hidden text-start ms-2 d-flex flex-column align-items-center">
            <h3 className="text-white me-auto">Overview delle gare</h3>
            <p className="text-white text-center me-auto mt-3">
              <span className="text-success fw-bold">
                {"(+"}
                {
                  gare.filter(
                    (gara) =>
                      gara.aggiudicata === "Si" &&
                      gara.dataInizio.includes(now.getFullYear())
                  ).length
                }
                {") "}
              </span>
              Gare aggiudicate nell'ultimo anno.
            </p>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  area: true,
                },
              ]}
              width={600}
              height={300}
            />
          </div>
        </div>
      )}

      {dataToShow && (
        <Modal show={open} onHide={() => setOpen(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Dettagli Gara</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <li>
                <span className="fw-bold">Descrizione: </span>
                {dataToShow.row.descrizioneGara}
              </li>
              <li>
                <span className="fw-bold">Data inizio: </span>
                {dataToShow.row.dataInizio}
              </li>
              <li>
                <span className="fw-bold">Scadenza: </span>
                {dataToShow.row.dataScadenza}
              </li>
              <li>
                <span className="fw-bold">CIG: </span>
                {dataToShow.row.CIG}
              </li>
              <li>
                <span className="fw-bold">Imp. ausiliaria: </span>
                {dataToShow.row.impresaAusiliaria}
              </li>
              <li>
                <span className="fw-bold">Aggiudicata:</span>
                {dataToShow.row.aggiudicata}
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="shadow-btm rounded-4"
              onClick={() => setOpen(false)}
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Col>
  );
};

export { Dashboard };
