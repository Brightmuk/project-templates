const express = require('express');
const path = require('path');


const router = express.Router();

const adminControler = require('../controllers/admin');


router.route('/')
   .get(adminControler.getLogin) 
   .post(adminControler.postLogin) 

router.route('/cars') 
      .get(adminControler.getCars)


router.get('/logout',adminControler.logout)  

router.route('/addCar')
      .get(adminControler.getAddCar) 
      .post(adminControler.postAddCar) 
 

router.route('/viewRoom')
      .post(adminControler.viewRoom)  

router.route('/updateRoom')
      .post(adminControler.updateRoom)   

 
module.exports = router;