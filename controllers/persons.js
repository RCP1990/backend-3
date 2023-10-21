const personsRouter = require('express').Router();
const Person = require('../models/person');
const logger = require('../utils/logger')

//get all persons
personsRouter.get('/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

//find person by id
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

//add new person
personsRouter.post('/', (request, response, next) => {
  logger.info('Received POST request:', request.body);
  const body = request.body;

  const person = new Person({
    //id: generateId(),
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then((newPerson) => {
      response.json(newPerson);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    });
});

//delete person
personsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//update person
personsRouter.put('/:id', (request, response, next) => {
  const { name, phone } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, phone },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
