const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.get('/',userControler.getHome); 

router.route('/login')
       .get(userControler.getLogin)
       .post(userControler.postLogin)

router.route('/createaccount') 
       .get(userControler.getCreateAccount)      
       .post(userControler.postCreateAccount);  

router.get('/contact',userControler.getContact);   

router.get('/logout',userControler.logout); 
 

router.route('/viewProperty')
       .post(userControler.viewProperty) 

router.route('/requestDetails')
       .post(userControler.postRequestDetails) 

router.route('/filter') 
       .post(userControler.filterResults)  


module.exports = router;