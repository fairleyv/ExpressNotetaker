const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid')


const PORT = process.env.PORT || 3001;

const app = express ();

app.use(express.static('public'));
app.use(express.json());
app.use (express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });


app.get ('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });

app.get ('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
  });
  console.info(`${req.method} request received to get Notes`);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
  
          parsedNotes.push(newNote);
  
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

  app.delete('/api/notes/:note_id', (req, res) => {
    console.log("DELETE Request Called for /api endpoint")
    res.send("DELETE Request Called")
 })

app.use ((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
