const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.getHome); 

router.route('/search') 
       .get(userControler.getSearch)  
       .post(userControler.postSearch)

router.route('/cars') 
       .get(userControler.postCars)  


router.route('/compare')
       .post(userControler.postCompare)      
 
       
router.post('/viewCar',userControler.postViewCar);  

router.get('/contact',userControler.getContact);       
router.get('/about',userControler.getAbout);    

module.exports = router;