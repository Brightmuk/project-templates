const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.getHome); //home page 

router.route('/login')
       .get(userControler.getLogin) // get request for login
       .post(userControler.postLogin)// post request for login

router.route('/createaccount') 
       .get(userControler.getCreateAccount)    //get request for create account   
       .post(userControler.postCreateAccount); //post request for create account   

router.get('/contact',userControler.getContact);   

router.get('/logout',userControler.logout); //logout


router.route('/viewProperty')
       .post(userControler.viewProperty) 

router.route('/filter')
       .post(userControler.filterResults)   
        
router.route('/status') 
       .post(userControler.postStatus); 

router.route('/showStatus')
       .get(userControler.authentication,userControler.getShowStatus);// get show status

router.post('/deletereq',userControler.deleteBooking,userControler.getShowStatus);       
       
       

module.exports = router;