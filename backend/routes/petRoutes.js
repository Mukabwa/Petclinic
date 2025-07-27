const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/', petController.createPet);
router.get('/', petController.getUserPets);
router.get('/:id', petController.getPetDetails);
router.put('/:id/details', petController.updatePetDetails);

module.exports = router;