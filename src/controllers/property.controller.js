const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
  const { title, description, address, type, bedrooms, bathrooms, area, amenities, rent, images } = req.body;
  try {
    const property = new Property({
      title,
      description,
      address,
      type,
      bedrooms,
      bathrooms,
      area,
      amenities,
      rent,
      images,
      seller: req.user.id, // Assuming req.user is populated by authentication middleware
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('seller', 'firstName lastName email phoneNumber');
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
