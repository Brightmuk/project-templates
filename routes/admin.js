const express = require('express');
const path = require('path');


const router = express.Router();

const adminControler = require('../controllers/admin');


router.route('/')
   .get(adminControler.getLogin) 
   .post(adminControler.postLogin) 

router.route('/flowers') 
      .get(adminControler.getFlowers)


router.get('/logout',adminControler.logout)  

router.route('/addFlower')
      .get(adminControler.getAddFlower) 
      .post(adminControler.postAddFlower) 
 

router.route('/viewFlower')
      .post(adminControler.viewFlower)  
      
router.route('/deleteFlower')
      .post(adminControler.deleteFlower)  

router.route('/updateFlower')
      .post(adminControler.updateFlower)   

 
module.exports = router;