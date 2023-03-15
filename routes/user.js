const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.getHome); 

router.route('/login') 
       .get(userControler.getLogin)  
       .post(userControler.postLogin)

router.route('/search') 
       .get(userControler.getSearch)  
       .post(userControler.postSearch)

router.route('/cars') 
       .get(userControler.postCars)  

router.route('/userCars',)
       .get(userControler.userCars)

router.route('/compare')
       .post(userControler.postCompare)      
 
       
router.post('/viewCar',userControler.postViewCar);  
router.post('/hireCar',userControler.hireCar); 

router.get('/contact',userControler.getContact);       
router.get('/about',userControler.getAbout);    

module.exports = router;