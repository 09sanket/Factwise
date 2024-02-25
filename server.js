// server.js


const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(cors()); // Enable CORS for all routes


const port = 3001;

app.use(bodyParser.json());

app.get('/api/persons', (req, res) => {
  const rawData = fs.readFileSync('./person.json');
  const data = JSON.parse(rawData);
  res.json(data);
});

app.post('/api/persons', (req, res) => {
  const newData = req.body;
  fs.writeFileSync('./person.json', JSON.stringify(newData, null, 2));
  res.json({ success: true });
});

app.delete('/api/persons/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const rawData = fs.readFileSync('./person.json');
  let data = JSON.parse(rawData);

  // Remove the person with the specified ID
  data = data.filter((person) => person.id !== idToDelete);

  // Write the updated data back to the file
  fs.writeFileSync('./person.json', JSON.stringify(data, null, 2));

  res.json({ success: true });
});

app.put('/api/persons/:id', (req, res) => {
  const idToUpdate = parseInt(req.params.id);
  const updatedPerson = req.body;

  const rawData = fs.readFileSync('./person.json');
  let data = JSON.parse(rawData);

  // Find the index of the person to be updated
  const index = data.findIndex((person) => person.id === idToUpdate);

  // Update the person details
  data[index] = updatedPerson;

  // Write the updated data back to the file
  fs.writeFileSync('./person.json', JSON.stringify(data, null, 2));

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
