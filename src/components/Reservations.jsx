import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Typography } from "@mui/material";

const Reservations = ({ reservations, setReservations }) => {
  const handleCancel = (id) => {
    const jwt = window.localStorage.getItem("ESTATE_HUB_JWT");
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Bearer " + jwt,
      },
    };
    fetch(
      "http://localhost:8080/api/Membre/Reservations/cancel?id=" + id,
      options
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        alert("Cancelation successful !");
        setReservations(
          reservations.map((res) => {
            if (res.id == id) {
              res = { ...res, status: "cancelled" };
            }
            return res;
          })
        );
      })
      .catch((e) => {
        alert("Cancelation failed !");
      });
  };

  const handleUnCancel = (id) => {
    const jwt = window.localStorage.getItem("ESTATE_HUB_JWT");
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Bearer " + jwt,
      },
    };
    fetch(
      "http://localhost:8080/api/Membre/Reservations/uncancel?id=" + id,
      options
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        alert("UnCancelation successful !");
        setReservations(
          reservations.map((res) => {
            if (res.id == id) {
              res = { ...res, status: "pending" };
            }
            return res;
          })
        );
      })
      .catch((e) => {
        alert("Cannot uncancel !");
      });
  };

  return reservations == null ? (
    <></>
  ) : (
    <Table aria-label="simple table" sx={{ width: "100%", overflow: "hidden" }}>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography>Nom Anonce</Typography>
          </TableCell>
          <TableCell>
            <Typography>Email</Typography>
          </TableCell>
          <TableCell>
            <Typography>Date Arrive</Typography>
          </TableCell>
          <TableCell>
            <Typography>Date depart</Typography>
          </TableCell>
          <TableCell>
            <Typography>Enfants</Typography>
          </TableCell>
          <TableCell>
            <Typography>Adultes</Typography>
          </TableCell>
          <TableCell>
            <Typography>Etat</Typography>
          </TableCell>
          <TableCell>
            <Typography>Cancel</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reservations.map((row) => (
          <TableRow
            key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              <a href={`/Anonce/${row.setAnonces}`}>{row.anonceName}</a>
            </TableCell>
            <TableCell>
              <Typography>{row.emailClient}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{row.DateReservationArrive}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{row.DateReservationDepart}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{row.nbrEnfants}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{row.nbrAdultes}</Typography>
            </TableCell>
            <TableCell>
              <Typography
                color={
                  row.status == "cancelled" || row.status == "refused"
                    ? "error"
                    : row.status == "accepted"
                    ? "success"
                    : "primary"
                }
              >
                {row.status}
              </Typography>
            </TableCell>
            <TableCell>
              <Button
                color="error"
                disabled={row.status == "accepted" || row.status == "refused"}
                onClick={() => {
                  row.status == "cancelled"
                    ? handleUnCancel(row.id)
                    : handleCancel(row.id);
                }}
              >
                {row.status == "cancelled" ? "enable" : "cancel"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Reservations;
