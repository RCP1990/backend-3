const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ap1uzpy.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length > 4) {
  //add entries to the phonebook DB
  const person = new Person({
    name: process.argv[3],
    phone: process.argv[4],
  })

  person.save()
    .then(result => {
      console.log(`added ${person.name} number ${person.phone} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => 
      console.log(`Error: ${error}`)
    )
} else {
  // list all( of the existing entries in the phonebook DB
  console.log('phonebook:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
  })
}