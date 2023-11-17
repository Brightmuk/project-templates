const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.home); 

router.route('/login') 
       .get(userControler.getLogin)  
       .post(userControler.postLogin)

router.route('/search') 
       .get(userControler.getSearch)  
       .post(userControler.postSearch)
 

router.route('/account',)
       .get(userControler.account)     
      
router.post('/view',userControler.postViewFlower);  
router.post('/hireCar',userControler.hireCar); 
router.post('/returnCar', userControler.returnHire);
 
router.get('/contact',userControler.getContact);       
router.get('/about',userControler.getAbout);    
router.post('/logout',userControler.logout);  
module.exports = router;