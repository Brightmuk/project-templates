//moduler 
var mysql = require('mysql');

const host =  "localhost";
const user =  "root";
const password = "@Beatsbydre99";
const database = "flowers";

//query all cars that are available

exports.home = (req, res, next) => {
   
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
   });

   carQuery = "SELECT * " +
      " FROM  cars";

   connectDB.query(carQuery, (filterErr, filterResult) => {
      if (filterErr) throw filterErr; 
      else {
         return res.render('user/home', { cars: filterResult ,user:req.session.user, userCars:false  })
      }
   })

}

//Post login
exports.postLogin = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
   });


   query = "SELECT * " +
      "FROM users " +
      "WHERE username = " + mysql.escape(req.body.name) +
      "AND password = " + mysql.escape(req.body.password);

      carQuery = "SELECT * " +
      " FROM  cars";

   connectDB.query(query, (err, result) => {
      if (err) throw err; 
      if (result.length) {

         req.session.user = result[0].id;
       connectDB.query(carQuery, (err, carResult) => {
         return res.render('user/home',{user:result[0].username,cars:carResult})
       })
         
      }else{
         return res.render('user/login', { msg: "", err: "Please check your information  and try again" });
      } 
      
   })

}

//get login screen
exports.getLogin = (req, res, next) => {
   res.render('user/login',{msg:"",err:""});
}

//post search cars
exports.postSearch = (req, res, next) => {
   
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
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






//view a single car
exports.postViewCar = (req, res, next) => {
 
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
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
                  return res.render('user/viewCar', {car: carResult[0], user:req.session.user, isHired: true });
               }
            })
         }
})

}

//post view user cars

exports.account = (req, res, next) => {
   
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
   });
   

   
   carQuery = "SELECT * " + 
      " FROM  hiring";  
   

   connectDB.query(carQuery, (err, result) => {
      if (err) throw err; 
      else {
       
         return res.render('user/account', {cars: result,user:req.session.user, userCars:true });
      }
   })

}

//return hire
exports.returnHire = (req, res, next)=>{

   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
  });

  returnHiring = "UPDATE hiring SET returned=1 WHERE car_id=" + (req.body.carId);

  carQuery = "SELECT * " + 
  " FROM  hiring INNER JOIN cars ON hiring.car_id=cars.id" +
  " WHERE hiring.user_id = (" + (req.session.user) + 
  ") AND hiring.returned=0"; 

  console.log('Returning...',(req.body.carId))
  connectDB.query(returnHiring, (err1, result1) => {
   if (err1) throw err1; 
   else {

      connectDB.query(carQuery, (err2, result2) => {
      if (err2) throw err2; 

         return res.render('user/cars', {cars: result2, user:req.session.user, userCars:true });
      })

   }
})

}


//Hire cars
exports.hireCar = (req, res, next) => {
 
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
   });
      var startDate = mysql.escape(req.body.startDate);
      var endDate = mysql.escape(req.body.endDate);
      var userId = mysql.escape(req.session.user);
      var carId = mysql.escape(req.body.carId);

   if(req.session.user==null){
      return res.render('user/login', { msg: "", err: "Your session expired, please login again!" });
   }

   hiringQueryInsert = "INSERT INTO `hiring`(`car_id`, `user_id`,`start_date`,`end_date`,`returned`) "+
   "VALUES(" + carId + ",'" + userId + "', " + startDate + "," + endDate+ "," + 0 + " )"

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


//get the search screen
exports.getSearch = (req, res, next) => {

   res.render('user/search',{user:req.session.user });
}


//show contact page
exports.getContact =(req,res,next)=>{
      res.render('user/contact', { user:req.session.user });

}
//show about page
exports.getAbout =(req,res,next)=>{
   res.render('user/about', { user:req.session.user  });

}


exports.logout = (req, res, next) => {
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password, 
      database: database
   });
   req.session.destroy();
   carQuery = "SELECT * " +
   " FROM  cars";

connectDB.query(carQuery, (filterErr, filterResult) => {
   if (filterErr) throw filterErr; 
   else {
      return res.render('user/home', { cars: filterResult ,user:null, userCars:false  })
   }
})
   
}