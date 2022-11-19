const express = require('express');
const path = require('path');


const router = express.Router();

const adminControler = require('../controllers/admin');


router.route('/')
   .get(adminControler.getLogin) //get request
   .post(adminControler.postLogin) // post request

router.route('/reservations')
.get(adminControler.getReservations)//get reservations

router.route('/pending')
.get(adminControler.getPending)//get pending

router.route('/rooms')
.get(adminControler.getRooms)//get pending

router.get('/logout',adminControler.logout) //get request   

router.post('/changeStatus',adminControler.postChangeStatus)// post change status

router.route('/addhotel')
      .get(adminControler.getAddHotel) // get request for hotel add page
      .post(adminControler.postAddHotel) // post request for hotel add to db

router.route('/search')
      .get(adminControler.getSearch)   // get request   
      .post(adminControler.postSearch) // post request

router.route('/viewRoom')
      .post(adminControler.viewRoom) //view room page

router.route('/viewReservation')
      .post(adminControler.viewReservation) //view room page
router.route('/checkout')
      .post(adminControler.checkout) //view room page  

router.route('/updateRoom')
      .post(adminControler.updateRoom) // update prev data      


module.exports = router;