const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')
//const mongoose = require('mongoose');

app.use(cors())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(express.json())

morgan.token('data', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ' '
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

//phonebook info
app.get('/info', (response) => {
  Person.find({})
  let date_ob = new Date()

  Person.find({})
    .then((people) => {
      response.send(
        `<h2>Phonebook has info for ${
          people.length
        } people</h2><p>${date_ob}</p>`
      )
    })
    .catch((error) => next(error))
})

//get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

//find person by id
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

//delete person
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

//add new person
app.post('/api/persons', (request, response, next) => {
  console.log('Received POST request:', request.body)
  const body = request.body

  const person = new Person({
    //id: generateId(),
    name: body.name,
    phone: body.phone,
  })

  person.save().then((newPerson) => {
    response.json(newPerson)
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message })
    } else {
      next(error)
    }
  })
})

//update person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, phone } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, phone },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    const validationErrors = {}

    // Extract and format validation error messages
    for (const field in error.errors) {
      validationErrors[field] = error.errors[field].message
    }

    return response.status(400).json({ validationErrors })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})