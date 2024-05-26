const express = require('express');
const { createProperty, getProperties, likeProperty, interestedInProperty } = require('../controllers/property.controller');
const { validatePropertyCreation } = require('../middlewares/validation');

const router = express.Router();

router.post('/', validatePropertyCreation, createProperty);
router.get('/', getProperties);
router.post('/:id/like', likeProperty);
router.post('/:id/interested', interestedInProperty);

module.exports = router;
