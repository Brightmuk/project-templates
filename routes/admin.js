const express = require('express');
const path = require('path');


const router = express.Router();
const userController = require('../controllers/user');
const adminControler = require('../controllers/admin');


router.route('/reservations')
.get(adminControler.getReservations)//get reservations


router.route('/rooms')
.get(adminControler.getRooms)//get pending

router.get('/logout',adminControler.logout) //get request   

router.post('/changeStatus',adminControler.postChangeStatus)// post change status

router.route('/addhotel')
      .get(adminControler.getAddHotel) // get request for hotel add page
      .post(adminControler.postAddHotel) // post request for hotel add to db

router.route('/viewRoom')
      .post(adminControler.viewRoom) //view room page

router.route('/updateRoom')
      .post(adminControler.updateRoom) // update prev data      


module.exports = router;