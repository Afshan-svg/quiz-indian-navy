const Location = require('../models/Location');

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { location } = req.body;

    // Validate input
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    // Check if location already exists
    const existingLocation = await Location.findOne({ location });
    if (existingLocation) {
      return res.status(400).json({ error: 'Location already exists' });
    }

    // Create new location
    const newLocation = new Location({
      location,
    });

    // Save location to database
    await newLocation.save();

    res.status(201).json({
      message: 'Location created successfully',
      location: {
        id: newLocation._id,
        location: newLocation.location,
      },
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Server error while creating location' });
  }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    const formattedLocations = locations.map(loc => ({
      id: loc._id,
      location: loc.location,
    }));
    res.status(200).json(formattedLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Server error while fetching locations' });
  }
};