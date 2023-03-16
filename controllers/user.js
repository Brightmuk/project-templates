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
         return res.render('user/cars', { cars: filterResult ,user:req.session.user, userCars:false  })
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

   hiringQuery =  "SELECT * FROM hiring "+
   "WHERE car_id="+car

   query = "SELECT * " + 
      " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
      " INNER JOIN hiring ON cars.id=hiring.car_id" +
      " WHERE cars.id = (" + car + 
      ")"; 
   
      connectDB.query(query, (err, hireResult) => {
         if (err) throw err; 

         if(hireResult.length<1){
            console.log('Not hired');

            query = "SELECT * " + 
            " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
            " WHERE cars.id = (" + car + 
            ")"; 
            connectDB.query(query, (err2, carResult) => {
               console.log('Doing here');
               if (err2) throw err2; 
               
               else {
                  console.log(carResult);
                  return res.render('user/viewCar', {car: carResult[0],user:req.session.user, isHired: false });
               }
            })
         }else{
            
            console.log('hired!');
            query = "SELECT * " + 
            " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
            " INNER JOIN hiring ON cars.id=hiring.car_id" +
            " WHERE cars.id = (" + car + 
            ")"; 
            connectDB.query(query, (err2, carResult) => {
               console.log('Doing there')
               if (err2) throw err2; 
               else {
                  return res.render('user/viewCar', {car: carResult[0],user:req.session.user, isHired: true });
               }
            })
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
      " FROM  hiring INNER JOIN cars ON hiring.car_id=cars.id" +
      " WHERE hiring.user_id = (" + (req.session.user) + 
      ")"; 
   

   connectDB.query(carQuery, (err, result) => {
      if (err) throw err; 
      else {
       
         return res.render('user/cars', {cars: result,user:req.session.user, userCars:true });
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

   hiringQueryInsert = "INSERT INTO `hiring`(`car_id`, `user_id`,`start_date`,`end_date`) "+
   "VALUES(" + carId + ",'" + userId + "', " + startDate + "," + endDate+ " )"

   hiringQueryGet = "SELECT * FROM hiring WHERE car_id=" + carId;

   carQuery = "SELECT * " +  
       " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
       " WHERE cars.id =" + mysql.escape(req.body.carId);

   userQuery = "SELECT * FROM users WHERE id=" + userId 
   

   connectDB.query(hiringQueryInsert, (err, result) => {
       if (err) throw err;

       connectDB.query(hiringQueryGet, (err2, resultHire) => {
         if (err2) throw err2;
            connectDB.query(userQuery, (err3, userResult) => {
               if (err3) throw err3;
    
           connectDB.query(carQuery, (err4, carResult) => {
               if (err4) throw err4;
               
                   return res.render('user/invoice', { 
                      car: carResult[0],
                      hiring:resultHire[0],
                      user:userResult[0] 
                  });
               })
           })
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
