// importiamo i dati del blog
// const blogPosts = require('../data/postsArray');

// Importiamo il file di connessione al database
const connection = require('../data/db');

function index(req, res) {

    res.json(blogPosts);
}

function show(req, res) {

    // recuperiamo l'id dall' URL e convertiamolo in un numero
    const id = parseInt(req.params.id)

    const post = blogPosts.find(post => post.id === id);

    //controllo
    if (!post) {

        //status 404
        res.status(404)

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }
    res.json(post);

}

function store(req, res) {
    console.log('dati:', req.body);

      // Creiamo un nuovo id tramite incremento all ultimo presente
    const newId = blogPosts[blogPosts.length - 1].id + 1;

    // Creiamo un nuovo post
    const newPost = {
        id: newId,
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        tags: req.body.tags
    }

    // Aggiungiamo il nuovo post nel blog
    blogPosts.push(newPost);

    // controllo
    console.log(blogPosts);


    // Restituiamo lo status corretto e il nuovo post
    res.status(201);
    res.json(newPost);
}

function update(req, res) {
    // recuperiamo l'id
    const id = parseInt(req.params.id)

    const post = blogPosts.find(post => post.id === id);

    //controllo
    if (!post) {
        res.status(404);

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // Aggiorniamo il post
    post.title = req.body.title;
    post.image = req.body.image;
    post.content = req.body.content;
    post.tags = req.body.tags;

    // Controllo
    console.log(blogPosts)

    // Restituiamo il post aggiornato
    res.json(post);
}

function modify(req, res) {

    const id = parseInt(req.params.id)

    const post = blogPosts.find(post => post.id === id);

    //controllo
    if (!post) {
        res.status(404);

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // Aggiorniamo il post
    req.body.title ? post.title = req.body.title : post.title = post.title;
    req.body.image ? post.image = req.body.image : post.image = post.image;
    req.body.content ? post.content = req.body.content : post.content = post.content;
    req.body.tags ? post.tags = req.body.tags : post.tags = post.tags;

    // Controllo
    console.log(blogPosts);

    // Restituiamo il post aggiornato
    res.json(post);
}

function destroy(req, res) {
    // recuperiamo l'id
    const id = parseInt(req.params.id)

    // cerchiamo il post tramite id
    const post = blogPosts.find(post => post.id === id);

    //controllo
    if (!post) {
        res.status(404);

        return res.json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // Rimuoviamo il post dal blog
    blogPosts.splice(blogPosts.indexOf(post), 1);

    //controllo in log in terminale
    console.log(blogPosts);

    // Restituiamo lo status per l eliminazione andata a buon fine
    res.sendStatus(204)
}

// esportiamo
module.exports = { index, show, store, update, modify, destroy }