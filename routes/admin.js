const express = require('express');
const path = require('path');


const router = express.Router();

const adminControler = require('../controllers/admin');


router.route('/')
   .get(adminControler.getLogin) 
   .post(adminControler.postLogin) 

router.route('/records') 
      .get(adminControler.getRecords)
router.route('/orders') 
      .get(adminControler.getOrders)

router.get('/logout',adminControler.logout)  

router.route('/addRecord')
      .get(adminControler.getAddRecord) 
      .post(adminControler.postAddRecord) 
 

router.route('/viewRecord')
      .post(adminControler.viewRecord)  
router.route('/viewOrder')
      .post(adminControler.viewOrder) 
router.route('/fulfill')
      .post(adminControler.fulfillOrder)

router.route('/deleteRecord')
      .post(adminControler.deleteRecord)  

router.route('/updateRecord')
      .post(adminControler.updateRecord)   

 
module.exports = router;