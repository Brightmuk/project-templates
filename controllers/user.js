 
var mysql = require('mysql');
var nodemailer = require('nodemailer');

//authentication check
exports.authentication = (req, res, next) => {

   if (req.session.mail != undefined) {
      next();
   }
   else {
      res.render('user/home', { user: "" });
   }
}
//Show the login page
exports.getLogin = (req, res, next) => {
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
  });

   if(req.session.mail != undefined){
      data = "SELECT * " +
      "FROM user " +
      "WHERE email = " + mysql.escape(req.session.mail);

      connectDB.query(data, (err, result) => {
         if (err) throw err;
         else {
             if (result.length) {
                 
                 connectDB.query(
                    "SELECT * " +
                 "FROM requests " +
                 "WHERE lister = ?", [result[0].name] , (err1, requestsResult) => {
                     if (err1) throw err1;
                     else {
                         
                         connectDB.query(
                            "SELECT * " +
                         "FROM category WHERE lister = ?",[result[0].name], (err2, listingResults) => {
                             if (err2) throw err2;
                             return res.render('admin/index', { msg: "", err: "",user: result[0] , listings: listingResults, requests: requestsResult});
                            
                         })
                        
                     }
                 })
  
             }
             else {
                 return res.render('user/loginAccount', { msg: "", err: "Please Check Your Information Again" });
             }
         }
     })
   }else{
      res.render('user/loginAccount', { user: "", msg: [], err: [] });
   }
   
}

//Login to admin
exports.postLogin = (req, res, next) => {

   var connectDB = mysql.createConnection({
       host: "localhost",
       user: "root",
       password: "@Beatsbydre99",
       database: "hotel"
   });
   console.log(req.body.mail);
   console.log(req.body.pass);

   data = "SELECT * " +
       "FROM user " +
       "WHERE email = " + mysql.escape(req.body.mail) +
       " AND password = " + mysql.escape(req.body.pass);

   connectDB.query(data, (err, result) => {
       if (err) throw err;
       else {
           if (result.length) {
               req.session.admin = result[0].name;
               req.session.mail = result[0].email;
               connectDB.query(
                  "SELECT * " +
               "FROM requests " +
               "WHERE lister = ?", [result[0].name] , (err1, requestsResult) => {
                   if (err1) throw err1;
                   else {
                       
                       connectDB.query(
                          "SELECT * " +
                       "FROM category WHERE lister = ?",[result[0].name], (err2, listingResults) => {
                           if (err2) throw err2;
                           return res.render('admin/index', { msg: "", err: "",user: result[0] , listings: listingResults, requests: requestsResult});
                          
                       })
                      
                   }
               })

           }
           else {
               return res.render('user/loginAccount', { msg: "", err: "Please Check Your Information Again" });
           }
       }
   })
}

//Show the home page
exports.getHome = (req, res, next) => {
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
   });
 
   data = "SELECT * " +
      " FROM  category ";

   connectDB.query(data, (err, result) => {
      if (err) throw err; //show if error found
      else {
         return res.render('user/home', { user: "" ,properties: result, filter:null });
        
      } 
   })
}

//Filter results
exports.filterResults = (req, res, next) => {
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  category " +
      " WHERE  category = " + mysql.escape(req.body.category) +
      " AND type = " + mysql.escape(req.body.type) +
      " AND location = " + mysql.escape(req.body.location);


   connectDB.query(data, (err, result) => {
      if (err) throw err; //show if error found
      else {
         return res.render('user/home', { user: "" ,properties: result,filter:{} });
        
      }
   })

}



//Show create account page
exports.getCreateAccount = (req, res, next) => {
   res.render('user/createAccount', { user: "", msg: [], err: [] })
}

//create new user account
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
 
//View a single property
exports.viewProperty = (req, res, next) => {

   
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
   });

   query = "SELECT * " + 
      " FROM  category " +
      " WHERE name = " + mysql.escape(req.body.name);

   query2 = "SELECT * " +  
      " FROM  user " +
      " WHERE name = " + mysql.escape(req.body.lister);
      
   connectDB.query(query, (err, result) => {
      if (err) throw err;
      else {
         connectDB.query(query2, (err2, result2) => {
            if (err2) throw err2;
           return  res.render('user/viewProperty', { property: result[0], err: "",msg:'', lister: result2[0] });
         })
        
      }
   })
}


//Request details of a certain listing
exports.postRequestDetails = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Beatsbydre99",
      database: "hotel"
   });
   
   var requester = req.body.email;
   var lister = req.body.lister
   var property = req.body.property

   
   data = "INSERT INTO requests " +
      " VALUES ('" + property + "','" + lister + "','" + requester + "')";

      data1 = 
      "SELECT * "
       + " FROM  category "
       +" WHERE name = '"+ property + 
      "'";

      data2 = "SELECT * "+ 
      " FROM  user "+
   " WHERE name = '"+ lister + 
   "'"; 

   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '2103086@students.kcau.ac.ke',
        pass: 'angw jlfz icps stie'
      }
    });

      
   connectDB.query(data, (err, result) => {
       
      if (err) throw err; 
      else {
         connectDB.query(data1, (err1, result1) => {
            if (err1) throw err1;
            else{
               
               connectDB.query(data2, (err2, result2) => {
                 
                  if (err2) throw err2;
                  else{
                     var mailOptions = {
                        from: '2103086@students.kcau.ac.ke',
                        to: requester,
                        subject: 'Detiails of the '+ property + " property",
                        text: 'Name: '+result1[0].name+" \n"+
                        "Type: "+result1[0].type+" \n"+
                        "Price: ksh."+result1[0].price+" \n"+
                        "Category: "+result1[0].category+" \n"+
                        "Location: "+result1[0].location+" \n"+
                        "Description: "+result1[0].dec+" \n\n"+
                        "Price: "+result1[0].price+" \n"
                      };
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });

                     res.render('user/viewProperty', { user: req.session.mail, msg: "Details sent to your email", err: "", property: result1[0], lister:result2[0] });
                  } 
               })
            }
            
         })
      }
   })
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


//logout
exports.logout = (req, res, next) => {
   req.session.destroy();
   res.render('user/home', { user: "" });

}