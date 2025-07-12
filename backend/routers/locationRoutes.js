const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Change from '/locations' and '/create-location' to just '/'
router.post('/', locationController.createLocation);
router.get('/', locationController.getAllLocations);

module.exports = router;