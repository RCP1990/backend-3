const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const numberValidation = [
  {
    validator: (number) => {
      if ((number[2] === '-' || number[3] === '-') && number.length < 9) {
        return false
      }
      return true
    },
    message: 'must be at least 8 digits',
  },
  {
    validator: (number) => {
      const sanitizedNumber = number.replace(/-/g, '')
      return /^\d{8,}$/.test(sanitizedNumber)
    },
    message: props => `${props.value} is not a valid phone number!`,
  },
]

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: [true, 'name required'] },
  phone: { type: String, validate: numberValidation, required: [true, 'phone number required'] },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
