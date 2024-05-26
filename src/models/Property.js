const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
}, { _id: false });

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  address: { type: addressSchema, required: true },
  type: { type: String, required: true, enum: ['apartment', 'house', 'condo', 'townhouse'] },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true }, // in square feet
  amenities: [{ type: String }],
  rent: { type: Number, required: true },
  images: [{ type: String }], // URLs of property images
  likes: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Property', propertySchema);
