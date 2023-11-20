//moduler 
var mysql = require('mysql');
var dateFormat = require('dateformat');
const host =  "localhost";
const user =  "root";
const password = "@Beatsbydre99";
const database = "flowers";

function orderIdGen() {
   
   const random3DigitNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
   return random3DigitNumber;
 }
//query all cars that are available

exports.home = (req, res, next) => {
   
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
   });

   carQuery = "SELECT * " +
      " FROM  flowers";

   connectDB.query(carQuery, (filterErr, filterResult) => {
      if (filterErr) throw filterErr; 
      else {
         return res.render('user/home', { flowers: filterResult ,user:req.session.user, userCars:false  })
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
      " FROM  flowers";

   connectDB.query(query, (err, result) => {
      if (err) throw err; 
      if (result.length) {

         req.session.user = result[0].id;
       connectDB.query(carQuery, (err, carResult) => {
         return res.render('user/home',{user:result[0].username,flowers:carResult})
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
exports.postFilter = (req, res, next) => {
   
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database 
   });

   console.log(mysql.escape(req.body.type))
   console.log(mysql.escape(req.body.color));
   console.log(mysql.escape(req.body.price_start));
   console.log(mysql.escape(req.body.price_end));

   filterQuery = "SELECT * " +
      " FROM  flowers " +
      " WHERE type = " + mysql.escape(req.body.type) +
      " AND color = " + mysql.escape(req.body.color) +
      " AND price BETWEEN " + mysql.escape(parseInt(req.body.price_start)) +
      " AND "+ mysql.escape(parseInt(req.body.price_end));
      


   connectDB.query(filterQuery, (filterErr, filterResult) => {
      if (filterErr) throw filterErr; 
      else { 
    
         return res.render('user/home',{user:req.session.user, flowers:filterResult})
      }
   })

}






//view a single car
exports.postViewFlower = (req, res, next) => {
 
   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
   });

   query = "SELECT * " + 
      " FROM  flowers  " +
      " WHERE flowers.id = " + mysql.escape(req.body.flowerId) 
      ; 
   
      connectDB.query(query, (err2, carResult) => {
         console.log('Doing here');
         if (err2) throw err2; 
         
         else {
            console.log(carResult);
            return res.render('user/viewFlower', {flower: carResult[0],user:req.session.user, isHired: false });
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
   
   userQuery = "SELECT * " + 
      " FROM  users WHERE users.id="+req.session.user;  
   
   ordersQuery = "SELECT * " + 
      " FROM  orders";   
   

   connectDB.query(ordersQuery, (err, result) => {
      if (err) throw err; 
      else {
         connectDB.query(userQuery, (err2, res2) => {
            if (err2) throw err2; 
            else {
               
               return res.render('user/account', {orders: result, user:req.session.user, account:res2[0], userCars:true });
            }
         })
      }
   })

}

//get the search screen
exports.postCart = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database 
  });
  var items = (req.body.items).split(',');
  console.log(items)
  
  query = 
 `SELECT * FROM flowers WHERE id IN (${items})`;

  
  connectDB.query(query, (err1, result1) => {
   if (err1) throw err1; 
   else {
      var total = 0;
      for(var i = 0;i<result1.length;i++){
         total+=result1[i].price;
      }

      return res.render('user/cart', {flowers: result1, user:req.session.user, total:total, items:items.join(',') });

   }
})
}

exports.postOrder = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database 
  }); 
  var orderId = orderIdGen();

  var items = (req.body.items);

  var total = mysql.escape(req.body.total);
  const values = items.split(',');
  values.splice(values.indexOf('0'),1)
 
  var arr = values.map(val=>[orderId,val]);
 
  flowersQuery = "SELECT * " + 
  " FROM  flowers"; 

  orderItemsQuery = 
 'INSERT INTO order_items (order_id, flower_id) VALUES ?';
 

  query = "INSERT INTO `orders`(`id`,`user_id`,`delivery`,`price`,`status`) "+
   "VALUES(" + orderId + "," + req.session.user + ", 1 ," + total + ",' submitted ' )"

   
  connectDB.query(query, (err1, result1) => { 
   if (err1) throw err1;    
   else { 
       
      connectDB.query(flowersQuery, (err2, res2) => {
         if (err2) throw err2; 
         else {
            connectDB.query(orderItemsQuery,[arr], (err3, res3) => {
               if (err3) throw err3; 
               else {
                  return res.render('user/home', { flowers: res2 ,user:req.session.user, userCars:false  })
               }
            })
         }
      })

   }
})
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
   " FROM  flowers";

connectDB.query(carQuery, (filterErr, filterResult) => {
   if (filterErr) throw filterErr; 
   else {
      return res.render('user/home', { flowers: filterResult ,user:null, userCars:false  })
   }
})
   
}