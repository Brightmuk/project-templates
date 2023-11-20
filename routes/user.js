const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.home); 

router.route('/login') 
       .get(userControler.getLogin)  
       .post(userControler.postLogin)

router.route('/cart') 
       .post(userControler.postCart) 
router.route('/filter') 
       .post(userControler.postFilter)  
router.route('/postOrder') 
       .post(userControler.postOrder) 

router.route('/account',)
       .get(userControler.account)     
      
router.post('/view',userControler.postViewFlower);  
router.get('/contact',userControler.getContact);       
router.get('/about',userControler.getAbout);    
router.post('/logout',userControler.logout);  
module.exports = router;