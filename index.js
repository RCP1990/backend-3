const express = require("express");
const app = express();
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan('tiny'))
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});          

app.get("/info", (request, response) => {
  let count = persons.length; 
  let date_ob = new Date();

  response.send(
    `<h2>Phonebook has info for ${count} people</h2>
    <p>${date_ob}</p>`
  )
});       

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  console.log('Received POST request:', request.body);
  const person = request.body

  if (!person.name || !person.phone) {
      return response.status(400).json({
          error: 'The name or number is missing'
        })
  } else if (persons.find(entry => entry.name === person.name)) {
      return response.status(400).json({
          error: 'The name must be unique'
        })
  }

  else{
    const contact = {
        id: generateId(),
        name: person.name,
        phone: person.phone,
    }


  persons = persons.concat(contact)

  response.json(contact)
  }
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
