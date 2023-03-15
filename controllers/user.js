//moduler 
var mysql = require('mysql');

// show the home page
exports.getHome = (req, res, next) => {
   
   return res.render('user/home',{user:req.session.user});
   
}

exports.postLogin = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "cars"
   });


   query = "SELECT * " +
      "FROM users " +
      "WHERE username = " + mysql.escape(req.body.name) +
      "AND password = " + mysql.escape(req.body.password);


   connectDB.query(query, (err, result) => {
      if (err) throw err; 
      if (result.length) {
         req.session.user = result[0].id;
       
         return res.render('user/home',{user:result[0].username})
      }else{
         return res.render('user/login', { msg: "", err: "Please check your information  and try again" });
      } 
      
   })

}

//get request for category
exports.getLogin = (req, res, next) => {
   res.render('user/login',{msg:"",err:""});
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
    
         return res.render('user/showResults', { cars: filterResult, purpose:mysql.escape(req.body.purpose),user:req.session.user })
      }
   })

}
exports.postCars = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "cars"
   });


   carQuery = "SELECT * " +
      " FROM  cars ";

   connectDB.query(carQuery, (filterErr, filterResult) => {
      if (filterErr) throw filterErr; 
      else {
         return res.render('user/cars', { cars: filterResult ,user:req.session.user })
      }
   })

}




//view car
exports.postViewCar = (req, res, next) => {
 
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "cars"
   });
   var car = mysql.escape(req.body.carId);

   query = "SELECT * " + 
      " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
      " WHERE cars.id = (" + car + 
      ")"; 
   

   connectDB.query(query, (err, result) => {
      if (err) throw err; 
      else {
         return res.render('user/viewCar', {car: result[0],user:req.session.user });
      }
   })

}

//post view cars

exports.userCars = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "cars"
   });


   carQuery = "SELECT * " + 
      " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
      " WHERE cars.listing_user = (" + (req.session.user) + 
      ")"; 
   

   connectDB.query(carQuery, (err, result) => {
      if (err) throw err; 
      else {
       
         return res.render('user/cars', {cars: result,user:req.session.user });
      }
   })

}


exports.hireCar = (req, res, next) => {
 
   var connectDB = mysql.createConnection({
       host: "localhost",
       user: "root",
       password: "@Beatsbydre99",
       database: "cars"
   });
      var startDate = mysql.escape(req.body.startDate);
      var endDate = mysql.escape(req.body.endDate);
      var userId = mysql.escape(req.session.user);
      var carId = mysql.escape(req.body.carId);

   if(req.session.user==null){
      return res.render('user/login', { msg: "", err: "Your session expired, please login again!" });
   }

   hiringQuery = "INSERT INTO `hiring`(`car_id`, `user_id`,`start_date`,`end_date`) "+
   "VALUES(" + carId + ",'" + userId + "', " + startDate + "," + endDate+ " )"

   carQuery = "SELECT * " +  
       " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
       " WHERE cars.id =" + mysql.escape(req.body.carId);
   

   connectDB.query(hiringQuery, (err, result) => {
       if (err) throw err;
    
           connectDB.query(carQuery, (err2, carResult) => {
               if (err2) throw err2;
               
                   return res.render('user/invoice', { car: carResult[0],msg:"Car booked Successfully",err:"",user:req.session.user });
               
           })
   })

}


//get request for category
exports.getSearch = (req, res, next) => {

   res.render('user/search',{user:req.session.user });
}



//show contact page
exports.getContact =(req,res,next)=>{
      res.render('user/contact', { user:req.session.user });

}
//show contact page
exports.getAbout =(req,res,next)=>{
   res.render('user/about', { user:req.session.user  });

}


//post request of compare
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
       
         if(compareResult[0][purpose]>compareResult[1][purpose]){
            
            best = compareResult[0]
         }else{
           
            best = compareResult[1]
         }
         console.log('The best at '+ purpose +' is:'+best.make+' with '+best[purpose]);
       
         return res.render('user/compareResults', {cars: compareResult, bestOffer: best, purpose: purpose,user:req.session.user });
      }
   })

}
