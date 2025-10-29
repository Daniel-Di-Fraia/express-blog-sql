// importiamo i dati del blog
// const blogPosts = require('../data/postsArray');

// Importiamo il file di connessione al database
const connection = require('../data/db');

function index(req, res) {

    // prepariamo la query
    const sql = 'SELECT * FROM posts';

    // eseguiamo la query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}


function show(req, res) {

    // recuperiamo l'id 
    const id = req.params.id

    // prima query di rireca di singolo post
    const postSql = 'SELECT * FROM posts WHERE id = ?';

    // Prepariamo la query per i tags con join e where
    const tagsSql = `
    SELECT T.*
    FROM tags AS T
    JOIN post_tag AS PT ON T.id = PT.tag_id
    WHERE PT.post_id = ? `;

    // Eseguiamo la prima query per il post
    connection.query(postSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (postResults.length === 0) return res.status(404).json({ error: 'Post not found' });

        // Recuperiamo il post
        const post = postResults[0];

        // eseguiamo la seconda query per i tags
        connection.query(tagsSql, [id], (err, tagsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });

            // Aggoiungiamo i tag ai post
            post.tags = tagsResults;
            res.json(post);
        });
    });

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
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id = ?'

    //Eliminiamo il post dal blog                      
    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete post' });
        res.sendStatus(204)
    });
}

// esportiamo
module.exports = { index, show, store, update, modify, destroy }