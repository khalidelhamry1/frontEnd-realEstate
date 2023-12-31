import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Box from "@mui/material/Box";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import Toolbar from "@mui/material/Toolbar";
import ListIcon from "@mui/icons-material/List";
import {
  Autocomplete,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

export default function AnonceFilter({ setisList, isList, setAnonces }) {
  const villes = React.useRef(null);
  //filter values
  const [categories, setCategories] = React.useState(null);
  const [minPrix, setMinPrix] = React.useState(0);
  const [maxPrix, setMaxPrix] = React.useState(100000000000000);
  const [chambres, setChambres] = React.useState(0);
  const [salles, setSalles] = React.useState(0);
  const [ville, setVille] = React.useState("");
  const [type, setType] = React.useState("-1");
  //Form values
  const [form_categories, setForm_Categories] = React.useState(null);
  const [form_minPrix, setForm_MinPrix] = React.useState(0);
  const [form_maxPrix, setForm_MaxPrix] = React.useState(0);
  const [form_chambres, setForm_Chambres] = React.useState(0);
  const [form_salles, setForm_Salles] = React.useState(0);
  const [form_ville, setForm_Ville] = React.useState("");
  const [form_type, setForm_Type] = React.useState("");
  //Dialogue state
  const [open, setOpen] = React.useState(false);

  const [Error_minPrix, setError_MinPrix] = React.useState(false);
  const [Error_maxPrix, setError_MaxPrix] = React.useState(false);
  const [Error_chambres, setError_Chambres] = React.useState(false);
  const [Error_salles, setError_Salles] = React.useState(false);

  React.useEffect(() => {
    init();
    if (categories == null) {
      fetch("http://localhost:8080/api/Search/categories")
        .then((res) => res.json())
        .then((data) => {
          const newData = data.map((ville) => {
            return { id: ville, state: false };
          });
          console.log(
            "data 0 : " +
              newData[0].id +
              " " +
              newData[0].state +
              " data 1 " +
              newData[1]
          );
          setCategories(newData);
        });
    }

    if (villes.current == null) {
      fetch("http://localhost:8080/api/Search/villes")
        .then((res) => res.json())
        .then((data) => (villes.current = data));
    }
  }, []);

  React.useEffect(() => {
    if (form_categories == null) setForm_Categories(categories);
  }, [categories]);

  const setCategorie = (id) => {
    setForm_Categories(
      form_categories.map((Categorie) =>
        Categorie.id == id
          ? { id: Categorie.id, state: !Categorie.state }
          : Categorie
      )
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const init = () => {
    setError_Chambres(false);
    setError_MaxPrix(false);
    setError_MinPrix(false);
    setError_Salles(false);
    setForm_Categories(categories);
    setForm_MinPrix(minPrix);
    setForm_MaxPrix(maxPrix);
    setForm_Chambres(chambres);
    setForm_Salles(salles);
    setForm_Ville(ville);
    setForm_Type(type);
  };

  const handleCloseCancel = () => {
    setOpen(false);
    init();
  };

  const handleCloseFilter = () => {
    handleClose();
    if (!Error_chambres && !Error_maxPrix && !Error_minPrix && !Error_salles) {
      setTimeout(() => setOpen(false), 500);
      setCategories(form_categories);
      setMinPrix(form_minPrix);
      setMaxPrix(form_maxPrix);
      setChambres(form_chambres);
      setSalles(form_salles);
      setVille(form_ville);
      setType(form_type);
      const categoriesArray = [];
      form_categories.forEach((element) => {
        if (element.state) {
          categoriesArray.push(element.id);
        }
      });
      console.log({
        minPrix: form_minPrix,
        maxPrix: form_maxPrix,
        chambres: form_chambres,
        salles: form_salles,
        categories: categoriesArray,
        ville: form_ville,
        type: form_type,
      });
      fetch("http://localhost:8080/api/Search/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minPrix: form_minPrix,
          maxPrix: form_maxPrix,
          chambres: form_chambres,
          salles: form_salles,
          categories: categoriesArray,
          ville: form_ville,
          type: form_type,
        }),
      })
        .then((res) => res.json())
        .then((data) => setAnonces(data));
    } else {
      alert("Erreur dans les champs saisie !");
      setOpen(false);
      setTimeout(init, 500);
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          zIndex: "1",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "10px",
          paddingTop: "0",
          paddingBottom: "0",
          flexWrap: "wrap",
          backgroundColor: "white",
        }}
      >
        <Button
          startIcon={<TuneOutlinedIcon />}
          variant="outlined"
          color="Black"
          size="medium"
          onClick={handleClickOpen}
          sx={{ minWidth: "fit-content", maxHeight: "31px" }}
        >
          Filter
        </Button>
        <Button
          startIcon={isList ? <FmdGoodRoundedIcon /> : <ListIcon />}
          variant="outlined"
          color="Black"
          size="medium"
          sx={{
            minWidth: "fit-content",
            maxHeight: "31px",
          }}
          onClick={() => {
            setisList(!isList);
          }}
        >
          {isList ? "Map" : "List"}
        </Button>
      </Toolbar>
      <Dialog open={open} onClose={handleCloseCancel} scroll="body">
        <DialogContent>
          <DialogTitle sx={{ padding: 0, paddingTop: "0", marginBottom: 0 }}>
            Prix
          </DialogTitle>
          <TextField
            autoFocus
            margin="dense"
            label="Min Prix"
            type="number"
            fullWidth
            variant="standard"
            value={form_minPrix}
            error={Error_minPrix}
            onChange={(e) => {
              setForm_MinPrix(e.target.value);
              if (e.target.value < 0) {
                setError_MinPrix(true);
              } else {
                setError_MinPrix(false);
              }
              if (e.target.value >= form_maxPrix)
                setForm_MaxPrix(parseInt(e.target.value) + 100);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Max Prix"
            type="number"
            fullWidth
            variant="standard"
            value={form_maxPrix}
            error={Error_maxPrix}
            onChange={(e) => {
              setForm_MaxPrix(e.target.value);
              if (e.target.value < 0) {
                setError_MaxPrix(true);
              } else {
                setError_MaxPrix(false);
              }
            }}
          />
          <DialogTitle sx={{ padding: 0, paddingTop: "20px", marginBottom: 0 }}>
            Chambres
          </DialogTitle>
          <TextField
            autoFocus
            margin="dense"
            label="Chambres"
            type="number"
            fullWidth
            variant="standard"
            value={form_chambres}
            error={Error_chambres}
            onChange={(e) => {
              setForm_Chambres(e.target.value);
              if (e.target.value < 0) {
                setError_Chambres(true);
              } else {
                setError_Chambres(false);
              }
            }}
          />
          <DialogTitle sx={{ padding: 0, paddingTop: "20px", marginBottom: 0 }}>
            Salles de bain
          </DialogTitle>
          <TextField
            autoFocus
            margin="dense"
            label="Salles de bain"
            type="number"
            fullWidth
            variant="standard"
            error={Error_salles}
            value={form_salles}
            onChange={(e) => {
              setForm_Salles(e.target.value);
              if (e.target.value < 0) {
                setError_Salles(true);
              } else {
                setError_Salles(false);
              }
            }}
          />
          <DialogTitle sx={{ padding: 0, paddingTop: "20px", marginBottom: 0 }}>
            Ville
          </DialogTitle>
          <Autocomplete
            options={villes.current}
            freeSolo
            inputValue={form_ville}
            onInputChange={(event, newInputValue) => {
              setForm_Ville(newInputValue);
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  autoFocus
                  margin="dense"
                  label="Ville"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              );
            }}
          />
          <DialogTitle sx={{ padding: 0, paddingTop: "20px", marginBottom: 0 }}>
            Type
          </DialogTitle>
          <RadioGroup
            name="type"
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <FormControlLabel
              value="0"
              control={<Radio />}
              onClick={(e) => {
                setForm_Type(e.target.value);
              }}
              checked={form_type == "0"}
              label="Louer"
            />
            <FormControlLabel
              value="1"
              control={<Radio />}
              onClick={(e) => {
                setForm_Type(e.target.value);
              }}
              checked={form_type == "1"}
              label="acheter"
            />
            <FormControlLabel
              value="-1"
              control={<Radio />}
              onClick={(e) => {
                setForm_Type(e.target.value);
              }}
              checked={form_type == "-1"}
              label="all"
            />
          </RadioGroup>
          <DialogTitle
            sx={{ padding: 0, paddingTop: "20px", marginBottom: "0px" }}
          >
            Categories
          </DialogTitle>
          <Box
            sx={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              padding: "10px 0",
              gap: "5px",
              rowGap: "10px",
              flexWrap: "wrap",
            }}
          >
            {form_categories != null ? (
              form_categories.map((categorie) => {
                return (
                  <Button
                    key={categorie.id}
                    size="small"
                    variant={categorie.state ? "contained" : "outlined"}
                    color={categorie.state ? "secondary" : "Black"}
                    sx={{
                      color: categorie.state ? "white" : "black",
                      margin: "0 10px 0 0 ",
                      minWidth: "fit-content",
                    }}
                    onClick={() => setCategorie(categorie.id)}
                  >
                    {categorie.id}
                  </Button>
                );
              })
            ) : (
              <></>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ paddingTop: "40px" }}>
          <Button
            onClick={handleCloseCancel}
            variant="outlined"
            color="error"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseFilter}
            variant="outlined"
            color="primary"
            size="small"
          >
            Filter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
