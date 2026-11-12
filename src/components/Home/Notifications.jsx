import {
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Notifications = () => {
  const dispatch = useDispatch();
  const showNotif = useSelector((state) => state.showNotifications);

  return (
    <Drawer
      anchor="right"
      open={showNotif}
      onClose={() => dispatch({ type: "SHOW_NOTIF", payload: false })}
    >
      <div className="d-flex align-items-center py-2 mt-2">
        <CloseIcon
          className="me-auto ms-2 fs-2 pointer"
          onClick={() => {
            dispatch({ type: "SHOW_NOTIF", payload: false });
          }}
        />
        <h4 className="text-center fw-light text-secondary m-0 me-auto">
          Notifiche <NotificationsIcon color="error" className="mb-1" />
        </h4>
      </div>

      <hr></hr>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Richiesta avvalimento"
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.primary", display: "inline" }}
                >
                  Società SRL
                </Typography>
                {"Clicca per dettagli.."}
              </>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Summer BBQ"
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.primary", display: "inline" }}
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Oui Oui"
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.primary", display: "inline" }}
                >
                  Sandra Adams
                </Typography>
                {" — Do you have Paris recommendations? Have you ever…"}
              </>
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export { Notifications };
