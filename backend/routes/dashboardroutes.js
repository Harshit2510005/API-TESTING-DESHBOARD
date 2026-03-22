const express = require('express');
const router = express.Router();
// यहाँ getHistory को भी जोड़ें
const { testApi, getHistory } = require('../controllers/apicontroller'); 
const auth = require('../middleware/authmiddleware');

router.post('/test', auth, testApi);
router.get('/history', auth, getHistory); // अब यह एरर नहीं देगा

module.exports = router;