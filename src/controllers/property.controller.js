const Property = require('../models/Property');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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
      seller: req.user.id,
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.likeProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    property.likes += 1;
    await property.save();
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.interestedInProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id).populate('seller');
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    const buyer = await User.findById(req.user.id);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      }
    });

    const mailOptionsToSeller = {
      from: process.env.EMAIL,
      to: property.seller.email,
      subject: 'Interest in your property',
      text: `Hello ${property.seller.firstName},\n\n${buyer.firstName} ${buyer.lastName} is interested in your property "${property.title}". Contact details:\n\nEmail: ${buyer.email}\nPhone: ${buyer.phoneNumber}`
    };

    const mailOptionsToBuyer = {
      from: process.env.EMAIL,
      to: buyer.email,
      subject: 'Contact details for the property you are interested in',
      text: `Hello ${buyer.firstName},\n\nYou expressed interest in the property "${property.title}". Here are the contact details of the seller:\n\nName: ${property.seller.firstName} ${property.seller.lastName}\nEmail: ${property.seller.email}\nPhone: ${property.seller.phoneNumber}`
    };

    await transporter.sendMail(mailOptionsToSeller);
    await transporter.sendMail(mailOptionsToBuyer);

    res.status(200).json({ message: 'Interest expressed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProperties = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const properties = await Property.find()
      .populate('seller', 'firstName lastName email phoneNumber')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Property.countDocuments();

    res.status(200).json({
      properties,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
