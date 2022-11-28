//moduler 
var mysql = require('mysql');

// show the home page
exports.getHome = (req, res, next) => {
   return res.render('user/home');

}

//post request of cars
exports.postSearch = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "cars"
   });


   filterQuery = "SELECT * " +
      " FROM  cars " +
      " WHERE type = " + mysql.escape(req.body.type) +
      " AND fuel = " + mysql.escape(req.body.fuel) +
      " AND transmission = " + mysql.escape(req.body.transmission) +
      " AND seats >= " + mysql.escape(req.body.seats); 


   connectDB.query(filterQuery, (filterErr, filterResult) => {
      if (filterErr) throw filterErr; 
      else {
    
         return res.render('user/showResults', { cars: filterResult, purpose:mysql.escape(req.body.purpose) })
      }
   })

}


//post request of category
exports.postCompare = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "cars"
   });

   var carStr = mysql.escape(req.body.cars);
   var carPurpose = req.body.purpose;
   var purpose = carPurpose.slice(1,-1);
 
   var carList = carStr.slice(1,-1);

   var toInt = carList.split(',').map(function(car){return parseInt(car)}); 

   compareQery = "SELECT * " + 
      " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
      " WHERE cars.id IN (" + toInt + 
      ")"; 
   

   connectDB.query(compareQery, (compareErr, compareResult) => {
      if (compareErr) throw compareErr; 
      else {
         var best;
         compareResult.forEach(car => {
            var highest = 0;
            if(car[purpose]>highest){ 

               highest=car[purpose];
               best = car;
            }
         });
         console.log(best);
       
         return res.render('user/compareResults', {cars: compareResult, bestOffer:best, purpose: purpose});
      }
   })

}


//authentication check
exports.authentication = (req, res, next) => {

   if (req.session.mail != undefined) {
      next();
   }
   else {
      res.render('user/home', { user: "" });
   }
}



//show the login page
exports.getLogin = (req, res, next) => {
   res.render('user/loginAccount', { user: "", msg: [], err: [] });
}

//post page of login
exports.postLogin = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
   });

   data = "SELECT * " +
      "FROM  user " +
      "WHERE email = " + mysql.escape(req.body.mail) +
      " AND password = " + mysql.escape(req.body.pass);


   connectDB.query(data, (err, result) => {
      if (err) throw err; // show if any error have
      else {
         if (result.length) {
            req.session.mail = result[0].email;
            res.render('user/home', {user: result[0].email});
         }
         else {
            res.render('user/loginAccount', { user: "", msg: [], err: ["Please Check Your information again"] });
         }

      }
   })

}




// show create account page
exports.getCreateAccount = (req, res, next) => {
   res.render('user/createAccount', { user: "", msg: [], err: [] })
}

//get data from user for create account
exports.postCreateAccount = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
   });

   var p1 = req.body.pass;
   var p2 = req.body.con_pass;

   if (p1 != p2) { // if password doesn't match 
      return res.render("user/createAccount", { user: "", msg: [], err: ["Password Doesn't Match"] })
   }

   var data = "INSERT INTO user " +
      " VALUES ( '" + req.body.name + "' ,'" + req.body.mail + "','" + req.body.phone + "','" + p1 + "')";

   connectDB.query(data, (err, result) => {
      if (err) throw err;// if db has error, show that 
      else {
         res.render('user/loginAccount', { user: "", msg: ["Account Create Successfuly"], err: [] }); //show login page
      }
   })
}

//get request for category
exports.getSearch = (req, res, next) => {

   res.render('user/search');
}



//show contact page
exports.getContact =(req,res,next)=>{
   if(req.session.mail== undefined){
      res.render('user/contact', { user: "" });
   }
   else{
      res.render('user/contact', { user: req.session.mail });
   }
   
}

