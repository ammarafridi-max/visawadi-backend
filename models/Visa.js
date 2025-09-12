const mongoose = require('mongoose');

const VisaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    featuredImage: { type: String },

    quickFacts: {
      validity: { type: String },
      processingTime: { type: String },
      numberOfCountries: { type: String },
      visaType: { type: String },
    },

    testimonials: [
      {
        title: { type: String },
        name: { type: String },
        purpose: { type: String },
        text: { type: String },
      },
    ],

    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    packages: [
      {
        name: { type: String, required: true },
        description: { type: String },
        recommended: { type: Boolean, default: false },
        inclusions: [{ type: String }],
        exclusions: [{ type: String }],
        pricing: {
          price: { type: Number, required: true },
          type: { type: String },
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visa', VisaSchema);
