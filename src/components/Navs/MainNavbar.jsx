import { Container, Nav, Navbar, Badge, Modal } from "react-bootstrap";
import logo from "../../assets/media/img/logo_cut.png";
import { Sling as Hamburger } from "hamburger-react";
import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { persistor } from "../../redux/store";
import {
  AccountCircle,
  HeadsetMic,
  Logout,
  Notifications,
  Settings,
} from "@mui/icons-material";
import { AnimatedText } from "../Animations/AnimatedText";
import { news } from "../../utils/constants/constants";
import { motion } from "framer-motion";
import {
  Avatar,
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import home from "../../assets/media/img/home.svg";
import { Notifications as Notifs } from "../Home/Notifications";
import { cleanData } from "../../utils/functions/functions";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 30,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 0,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 28,
    height: 28,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

const MainNavbar = ({ darkMode }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [expand, setExpand] = useState(false);
  const excludePaths = location.pathname === "/settings";
  const closeSidebar = useSelector((state) => state.collapseSidebar);
  const [showConfirm, setShowConfirm] = useState(false);

  const userData = useSelector((state) => state.userData);

  const navigate = useNavigate();

  const collapseSB = (payload) => {
    dispatch({ type: "COLL_SIDE_BAR", payload: payload });
  };

  const toggleDarkMode = () => {
    dispatch({ type: "DARK_MODE", payload: !darkMode });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {userData.length > 0 && (
        <Navbar
          expand="md"
          className="fixed-top shadow main-nav p-0 justify-content-center"
          style={{
            backgroundColor: darkMode ? "#494A5D" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <Container fluid className="mx-md-0">
            <Navbar.Brand className="menu">
              {excludePaths ? (
                <Tooltip title="Torna alla home">
                  <div
                    style={{ width: "48px", height: "48px" }}
                    className="d-flex align-items-center pointer"
                    onClick={() => navigate("/home")}
                  >
                    <img alt="home-link" src={home} width={40} />
                  </div>
                </Tooltip>
              ) : (
                <Hamburger
                  color={darkMode ? "#ffff" : "#607489"}
                  toggled={!closeSidebar}
                  toggle={() => {
                    collapseSB(!closeSidebar);
                  }}
                />
              )}
            </Navbar.Brand>
            <Navbar.Brand onClick={() => navigate("/home")}>
              <img
                src={logo}
                width="55"
                className="d-inline-block align-top pointer logo"
                alt="Logo"
              />
            </Navbar.Brand>
            <div className="nav-text d-none d-lg-block">
              <AnimatedText text="EasyAppalto.it" darkMode={darkMode} />
            </div>
            <Nav className="d-flex align-items-center flex-grow-1">
              <div
                className="d-none d-md-inline flex-grow-1 overflow-hidden"
                style={{ whiteSpace: "nowrap" }}
              >
                <motion.p
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                  }}
                >
                  {news}
                </motion.p>
              </div>

              <Avatar
                alt="User"
                src={userData[0].photo_url}
                onClick={handleClick}
                className="pointer me-md-2 rounded-circle profile ms-md-1 ms-auto"
                style={{
                  border: darkMode ? "1px solid white" : "1px solid black",
                }}
              />

              <Menu
                disableScrollLock
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                aria-hidden={false}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => navigate("/settings")}>
                  <ListItemIcon>
                    <AccountCircle fontSize="medium" color="light" />
                  </ListItemIcon>
                  Account
                </MenuItem>
                <ListItemButton
                  className="d-flex align-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpand(!expand);
                  }}
                >
                  <ListItemIcon style={{ minWidth: "36px" }}>
                    <Settings fontSize="medium" color="light" />
                  </ListItemIcon>
                  <ListItemText primary="Impostazioni" />
                  {expand ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={expand} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 3 }}>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={darkMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDarkMode();
                            }}
                          />
                        }
                        label={darkMode ? "Dark mode" : "Light mode"}
                      />
                    </ListItemButton>
                  </List>
                  <hr></hr>
                </Collapse>

                <MenuItem
                  onClick={() =>
                    dispatch({ type: "SHOW_NOTIF", payload: true })
                  }
                >
                  <ListItemIcon>
                    <Notifications fontSize="medium" color="light" />
                  </ListItemIcon>
                  Notifiche
                  <Badge
                    bg="danger"
                    className="rounded-circle  d-flex align-items-center justify-content-center ms-3"
                    style={{
                      height: "21px",
                      width: "21px",
                      border: "1px solid #590707",
                    }}
                  >
                    2
                  </Badge>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <HeadsetMic fontSize="medium" />
                  </ListItemIcon>
                  Contattaci
                </MenuItem>

                <hr className="my-2"></hr>
                <MenuItem
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="medium" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Nav>
          </Container>
          <Modal
            show={showConfirm}
            onHide={() => {
              setShowConfirm(false);
            }}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              Sei sicuro di voler effettuare il logout? <br></br>
              Perderai eventuali preferiti salvati.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="contained"
                color="success"
                size="small"
                className="shadow rounded-4 me-2"
                onClick={() => {
                  setShowConfirm(false);
                }}
              >
                Annulla
              </Button>
              <Button
                onClick={() => {
                  navigate("/");
                  cleanData(dispatch);
                }}
                variant="contained"
                color="error"
                size="small"
                className="shadow rounded-4"
              >
                Conferma
              </Button>
            </Modal.Footer>
          </Modal>
          <Notifs />
        </Navbar>
      )}
    </>
  );
};

export { MainNavbar };
