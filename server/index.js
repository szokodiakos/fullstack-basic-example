const express = require('express');
const Boom = require('boom');
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());

app.use('/client', express.static('client'));

app.get('/api/v1/animals', (req, res, next) => {
  const animalType = req.query.type;

  if (animalType) {
    const filteredAnimals = animals.filter(animal => animal.type === animalType);
    if (!filteredAnimals.length) {
      return next(Boom.badRequest(`No such animalType: ${animalType}.`));
    }
    return res.json({ item: filteredAnimals });
  }

  return res.json({ item: animals });
});

app.post('/api/v1/animal', (req, res, next) => {
  const newAnimal = req.body.animal;
  if (!newAnimal.name) {
    return next(Boom.badRequest(`Animal must have a name.`));
  }

  const isAnimalAlreadyExists = animals.find(animal => animal.name === newAnimal.name);
  if (isAnimalAlreadyExists) {
    return next(Boom.badRequest(`Animal with name ${newAnimal.name} already exists.`));
  }

  animals.push(newAnimal);
  return res.json({ item: `Animal with name ${newAnimal.name} added!` });
});

app.delete('/api/v1/animal/:name', (req, res, next) => {
  const animalName = req.params.name;

  if (!animalName) {
    return next(Boom.badRequest('Name must be provided.'));
  }

  const indexOfAnimal = animals.findIndex(animal => animal.name === animalName);
  if (indexOfAnimal === -1) {
    return next(Boom.badRequest(`Animal with name ${animalName} does not exist.`));
  }

  animals.splice(indexOfAnimal, 1);
  return res.json({ item: `Animal with name ${animalName} deleted!`});
})

app.use((err, req, res, next) => {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  console.log(err.stack);
  return res.status(500).json(err);
})

app.listen(PORT);
console.log(`Server listening on localhost:${PORT}.`)
console.log(`Serving client from localhost:${PORT}/client.`);
