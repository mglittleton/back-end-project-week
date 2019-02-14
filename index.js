const cl = console.log;
const express = require("express");
const cors = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();

const db = require("./middleware/helpers");
const PORT = 4700;
const server = express();

server.use(express.json(), cors());

server.get("/notes", (req, res) => {
  db.getNotes()
    .then(notes => {
      res.json(notes);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.getNotes(id)
    .then(note => {
      res.json(note);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post("/notes/create", (req, res) => {
  const note = req.body;
  db.addNote(note)
    .then(ids => {
      res.status(201).json(ids[0]);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.delete("/notes/delete/:id", (req, res) => {
  const { id } = req.params;
  db.deleteNote(id)
    .then(count => {
      res.json(count);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.put('/notes/edit/:id', (req, res) => {
  const {id} = req.params;
  const note = req.body;
  cl(1)
  db.editNote(id, note).then(count => {
    cl(2)
    if (count) {
      db.getNotes(id).then(note => {
        cl(3)
        res.json(note)
      }).catch(err => {
        res.status(500).send(err)
      })
    } else {
      res.status(404).send("the selected note was not updated")
    }
  }).catch(err => {
    res.status(500).send(err)
  })
})

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
