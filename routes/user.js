const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.getHome); 

router.route('/search') 
       .get(userControler.getSearch)  
       .post(userControler.postSearch)

router.route('/compare')
       .post(userControler.postCompare)      
       
router.get('/contact',userControler.getContact);       
     

module.exports = router;