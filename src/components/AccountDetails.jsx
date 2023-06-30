import React from "react";
import { Stack, Button, Typography, TextField } from "@mui/material";

const AccountDetails = ({ Data }) => {
  const [confirmed, setConfirmed] = React.useState(false);

  const supprimer = () => {
    if (confirmed) {
      const jwt = window.localStorage.getItem("ESTATE_HUB_JWT");
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Bearer " + jwt,
        },
      };
      fetch("http://localhost:8080/api/Membre/Modify/User/supprimer", options)
        .then((res) => {
          if (!res.ok) throw new Error();
          window.localStorage.removeItem("ESTATE_HUB_JWT");
          window.location.assign("/");
        })
        .catch((e) => {
          alert("Error suppression!");
        });
    } else {
      setConfirmed(true);
    }
  };

  return Data != null ? (
    <Stack direction="column" gap={2}>
      <Stack direction="row" justifyContent="end" gap={3}>
        <Button
          onClick={() => {
            supprimer();
          }}
          variant="contained"
          color="error"
          disabled={Data.status == "removed"}
        >
          <Typography>{confirmed ? "confirmer" : "supprimer"}</Typography>
        </Button>
        <Button href="/modifier/user" variant="contained">
          <Typography>Modifier</Typography>
        </Button>
      </Stack>
      {Data != null ? (
        Object.keys(Data).map((key) => {
          return (
            <Stack direction={"row"} gap={1}>
              <Typography
                color={"primary"}
                sx={{
                  overflowWrap: "break-word",
                }}
              >
                {key.toUpperCase() + "  :"}
              </Typography>
              <Typography
                color={Data[key] ? "" : "error"}
                sx={{
                  overflowWrap: "break-word",
                }}
              >
                {Data[key] || "Modify to fill this field"}
              </Typography>
            </Stack>
          );
        })
      ) : (
        <></>
      )}
    </Stack>
  ) : (
    <></>
  );
};

export default AccountDetails;
