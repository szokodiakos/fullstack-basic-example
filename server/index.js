const express = require('express');

const PORT = 3000;

const app = express();
const animals = [{
    name: 'cat',
    type: 'mammal',
  }, {
    name: 'fish',
    type: 'other',
  },
];

app.use('/client', express.static('client'));

app.get('/api/v1/animals', (req, res) => {
  const animalType = req.query.type;

  if (animalType) {
    const filteredAnimals = animals.filter(animal => animal.type === animalType);
    return res.json(filteredAnimals);
  }

  return res.json(animals);
});

app.listen(PORT);
console.log(`Server listening on localhost:${PORT}.`)
console.log(`Serving client from localhost:${PORT}/client.`);
