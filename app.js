const express = require("express");
const app = express();
const port = 3000;

// usiamo il middleware static di express per file statici
app.use(express.static('public'));

// registro il body-parser
app.use(express.json());

// importiamo modulo router blog
const router = require("./routers/posts");

// importiamo globalmente il middleware di gestione errore server
const errorServer = require("./middlewares/errorServer");

// importiamo globalmente il middleware notfound 404 per rotta inesistente
const notFound = require("./middlewares/notFound");

// impostiamo la rotta di index
app.get("/", (req, res) => {
    res.send('<h1>Server del mio blog</h1>')
});

app.use("/posts", router);

// richiamo middleware gestione errori server
app.use(errorServer);

// richiamo middleware gestione errore 404 rotta non esistente
app.use(notFound);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});