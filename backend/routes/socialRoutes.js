const express = require('express')
const router = express.Router()

const {
    getSocial,
    updateSocial
} = require('../controllers/socialController')

router.get('/', getSocial);
router.put('/', updateSocial)

module.exports = router;