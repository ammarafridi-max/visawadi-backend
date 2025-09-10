const mongoose = require('mongoose')

const VisaSchema = mongoose.Schema({
  name: { type: String, unique: true, required: [true, 'Visa name is required']},
  slug:{ type: String, unique: true, required: [true, 'Visa name is required']}
})

const Visa = mongoose.model('visa', VisaSchema)

module.exports = Visa