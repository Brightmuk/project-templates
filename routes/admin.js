const express = require('express');
const path = require('path');


const router = express.Router();
const userController = require('../controllers/user');
const adminControler = require('../controllers/admin');


router.route('/requests')
.get(adminControler.getRequests)


router.route('/listings')
.get(adminControler.getListings)

router.get('/logout',adminControler.logout)  


router.route('/addListing')
      .get(adminControler.getAddListing) 
      .post(adminControler.postAddListing) 

router.route('/viewListing')
      .post(adminControler.viewListing)

router.route('/updateRoom')
      .post(adminControler.updateRoom)     


module.exports = router;