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
         return res.render('user/cars', { cars: filterResult })
      }
   })

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
       
         return res.render('user/compareResults', {cars: compareResult, bestOffer: best, purpose: purpose});
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
         return res.render('user/viewCar', {car: result[0]});
      }
   })

}







//get request for category
exports.getSearch = (req, res, next) => {

   res.render('user/search');
}



//show contact page
exports.getContact =(req,res,next)=>{
      res.render('user/contact', { user: "" });
   
}
//show contact page
exports.getAbout =(req,res,next)=>{
   res.render('user/about', { user: "" });

}

