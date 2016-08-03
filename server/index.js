const express = require('express');
const Boom = require('boom');

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

app.get('/api/v1/animals', (req, res, next) => {
  const animalType = req.query.type;

  if (animalType) {
    const filteredAnimals = animals.filter(animal => animal.type === animalType);
    if (!filteredAnimals.length) {
      return next(Boom.badRequest(`No such animalType: ${animalType}.`));
    }
    return res.json(filteredAnimals);
  }

  return res.json(animals);
});

app.use((err, req, res, next) => {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  return res.status(500).json(err);
})

app.listen(PORT);
console.log(`Server listening on localhost:${PORT}.`)
console.log(`Serving client from localhost:${PORT}/client.`);
