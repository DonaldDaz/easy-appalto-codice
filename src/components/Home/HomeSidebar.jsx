import { useEffect, useState } from "react";
import {
  BorderRight,
  Calculate,
  Gavel,
  Grading,
  KeyboardDoubleArrowRight,
  ManageSearch,
  Newspaper,
  RequestPage,
  Settings,
  SpaceDashboard,
} from "@mui/icons-material";
import { Col } from "react-bootstrap";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";
import { Badge, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { goToAction } from "../../utils/constants/constants";

const HomeSidebar = ({ darkMode }) => {
  const closeSidebar = useSelector((state) => state.collapseSidebar);
  const [rtl, setRtl] = useState(false);
  const [theme, setTheme] = useState("dark");
  const sidebarAction = useSelector((state) => state.sideBarAction);
  const dispatch = useDispatch();
  const favs = useSelector((state) => state.favBandi);

  const collapseSB = (payload) => {
    dispatch({ type: "COLL_SIDE_BAR", payload: payload });
  };

  const themes = {
    light: {
      sidebar: {
        backgroundColor: "#ffffff",
        color: "#607489",
      },
      menu: {
        menuContent: "#fbfcfd",
        icon: "#0098e5",
        hover: {
          backgroundColor: "#3B8B87",
          color: "white",
        },
        disabled: {
          color: "#9fb6cf",
        },
      },
    },
    dark: {
      sidebar: {
        backgroundColor: "#494A5D",
        color: "#ffffff",
        BorderRight: "0px",
      },
      menu: {
        menuContent: "black",
        icon: "#59d0ff",
        hover: {
          backgroundColor: "#fbfcfd",
          color: "black",
        },
        disabled: {
          color: "#3e5e7e",
        },
      },
    },
  };

  useEffect(() => {
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Sidebar
      onMouseEnter={() => {
        collapseSB(false);
      }}
      onMouseLeave={() => collapseSB(true)}
      className="shadow aside-bar me-md-3 p-0"
      backgroundColor={themes[theme].sidebar.backgroundColor}
      collapsed={closeSidebar}
      rtl={rtl}
      rootStyles={{
        color: themes[theme].sidebar.color,
        borderRight: themes[theme].sidebar.BorderRight,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: "24px", marginTop: "16px" }} />
        <div style={{ flex: 1, marginBottom: "32px" }}>
          <div style={{ padding: "0 24px", marginBottom: "8px" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              style={{
                opacity: closeSidebar ? 0 : 0.9,
                letterSpacing: "0.5px",
              }}
            >
              Menu
            </Typography>
          </div>

          <Menu
            menuItemStyles={{
              button: {
                [`&:hover`]: {
                  backgroundColor: themes[theme].menu.hover.backgroundColor,
                  color: themes[theme].menu.hover.color,
                },
              },
            }}
          >
            <MenuItem
              icon={
                favs.length > 0 ? (
                  <Badge badgeContent={favs.length} color="error">
                    <SpaceDashboard />
                  </Badge>
                ) : (
                  <SpaceDashboard />
                )
              }
              className={sidebarAction === "DASH" && "fw-bold"}
              onClick={() => {
                goToAction(dispatch, "DASH");
                collapseSB(true);
              }}
            >
              {" "}
              Dashboard
            </MenuItem>
            {closeSidebar && sidebarAction === "DASH" && (
              <hr
                className={`m-0 border border-1 w-50 mx-auto ${
                  darkMode ? "border-white" : "border-black"
                }`}
              ></hr>
            )}
            <MenuItem
              icon={<ManageSearch />}
              className={sidebarAction === "GARE" && "fw-bold"}
              onClick={() => {
                goToAction(dispatch, "GARE");
                collapseSB(true);
              }}
            >
              Ricerca gare attive
            </MenuItem>
            {closeSidebar && sidebarAction === "GARE" && (
              <hr
                className={`m-0 border border-1 w-50 mx-auto ${
                  darkMode ? "border-white" : "border-black"
                }`}
              ></hr>
            )}
            <MenuItem
              icon={<Gavel />}
              className={sidebarAction === "ESITI" && "fw-bold"}
              onClick={() => {
                goToAction(dispatch, "ESITI");
                collapseSB(true);
              }}
            >
              {" "}
              Esiti di gara
            </MenuItem>
            {closeSidebar && sidebarAction === "ESITI" && (
              <hr
                className={`m-0 border border-1 w-50 mx-auto ${
                  darkMode ? "border-white" : "border-black"
                }`}
              ></hr>
            )}
            <MenuItem
              icon={<RequestPage />}
              className={sidebarAction === "AVVAL" && "fw-bold"}
              onClick={() => {
                goToAction(dispatch, "AVVAL");
                collapseSB(true);
              }}
            >
              Richiesta avvalimento
            </MenuItem>
            {closeSidebar && sidebarAction === "AVVAL" && (
              <hr
                className={`m-0 border border-1 w-50 mx-auto ${
                  darkMode ? "border-white" : "border-black"
                }`}
              ></hr>
            )}
            <MenuItem
              icon={<Calculate />}
              className={sidebarAction === "CALC" && "fw-bold"}
              onClick={() => {
                goToAction(dispatch, "CALC");
                collapseSB(true);
              }}
            >
              Calcolo soglia anomala
            </MenuItem>
            {closeSidebar && sidebarAction === "CALC" && (
              <hr
                className={`m-0 border border-1 w-50 mx-auto ${
                  darkMode ? "border-white" : "border-black"
                }`}
              ></hr>
            )}
            <SubMenu
              label="Simulatori"
              icon={<Grading />}
              rootStyles={{
                ["." + menuClasses.subMenuContent]: {
                  backgroundColor: themes[theme].sidebar.backgroundColor,
                },
              }}
            >
              <MenuItem
                className={sidebarAction === "SIM_SIMP" && "fw-bold"}
                icon={<Settings />}
                onClick={() => {
                  goToAction(dispatch, "SIM_SIMP");
                  collapseSB(true);
                }}
              >
                {" "}
                Simulatore semplice
              </MenuItem>
              <MenuItem
                className={sidebarAction === "SIM_ADV" && "fw-bold"}
                icon={<Settings />}
                onClick={() => {
                  goToAction(dispatch, "SIM_ADV");
                  collapseSB(true);
                }}
              >
                {" "}
                Simulatore avanzato
              </MenuItem>
            </SubMenu>
            {closeSidebar &&
              (sidebarAction === "SIM_SIMP" || sidebarAction === "SIM_ADV") && (
                <hr
                  className={`m-0 border border-1 w-50 mx-auto ${
                    darkMode ? "border-white" : "border-black"
                  }`}
                ></hr>
              )}
            <MenuItem
              icon={<Newspaper />}
              className={sidebarAction === "NEWS" && "fw-bold"}
              onClick={() => {
                goToAction(dispatch, "NEWS");
                collapseSB(true);
              }}
            >
              Notizie
            </MenuItem>
            {closeSidebar && sidebarAction === "NEWS" && (
              <hr
                className={`m-0 border border-1 w-50 mx-auto ${
                  darkMode ? "border-white" : "border-black"
                }`}
              ></hr>
            )}
          </Menu>
        </div>
      </div>
    </Sidebar>
  );
};

export { HomeSidebar };
