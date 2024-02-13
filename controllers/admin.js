var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
const session=require('express-session');


exports.getContact =(req,res,next)=>{
    if(req.session.mail== undefined){
       res.render('user/contact', { user: "" });
    }
    else{
       res.render('admin/contact', { user: req.session.mail });
    }
    
 }

exports.dashboard = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });
    
 
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


//change booking status
exports.postChangeStatus = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    var value = 0;

    if (req.body.click == "Approve") {
        value = 1;
        
        data = "UPDATE bookingstatus " +
        " SET  status = 1"
        " WHERE roomNo = " + mysql.escape(req.body.roomNo) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND roomWant = " + mysql.escape(req.body.want)

        data2 = "UPDATE category " +
        "SET available = 0" +
        " WHERE roomNo = " + mysql.escape(req.body.roomNo)

    } else {
        data = "DELETE FROM bookingstatus " +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND roomWant = " + mysql.escape(req.body.want)
    }
    

    data = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 1 ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;

        else {
            connectDB.query(data1, (err1, result1) => {
                if (err1) throw err1;
                else {
                    connectDB.query(data2, (err3,res) => {
                        if (err3) throw err3;
                        else{
                            for (i in result1) {
                                var a = result1[i].date; 
                                result1[i].date = a.toString().slice(0, 15);
                            }
                        } 
                    })

                    return res.render('admin/reservations', { msg: "", err: "", data: result1 });
                }
            }) 
        }
    })

}



//get add hotel page

exports.getAddHotel = (req, res, next) => {
    res.render('admin/addRoom', { msg: "", err: "" });
}

//add new hotel info
exports.postAddHotel = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    //var
    var category = "", nme = "", type = "", price = 0, location = "", des = ""
   var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "category") {
                category = field;
            }
            else if (name === "type") {
                type = field;
            }
            else if (name === "name") {
                nme = field;
            }
            else if (name === "price") {
                price = parseInt(field); 
            }
            else if (name === "location") {
                location = field;
            }
            else if (name === "description") {
                des = field
            } 

        })
        .on('file', (name, file) => {
            // console.log('Uploaded file', name)
            //   fs.rename(file.path,__dirname+"a")
        })
        .on('fileBegin', function (name, file) {
            //console.log(mail);

            var fileType = file.type.split('/').pop();
            if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {

                a = path.join(__dirname, '../')
                ///  console.log(__dirname)
                //  console.log(a)
                if (name === "img") {
                    imgPath = + (type + name  + "." + fileType);
                }
                imgPath ='/assets/img/rooms/' + (type + name  + "." + fileType)
                file.path = a + '/public/assets/img/rooms/' + (type + name  + "." + fileType); // __dirname
            } else {
                console.log("Wrong File type")
                wrong = 1;
                res.render('admin/addRoom', { msg: "", err: "Wrong File type" });
            }
        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        })
        .on('end', () => {

            if (wrong == 1) {
                console.log("Error") 

            }
            else { 

                //saveDir = __dirname + '/uploads/';
                
                data = "INSERT INTO `category`(`name`, `type`, `category`,`dec`, `price`, `location`, `img`,`lister` ) "+
                         "VALUES('" +nme + "','" + type + "', '" + category + "','" +des + "' ,'" + price + "' ,'" + location + "' ,'" + imgPath + "' ,'" + req.session.admin + "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('admin/addRoom', { msg: "Data Inserted Successfuly", err: "" });
                    }
                });
            }
        })
}

//post request
exports.getRooms = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/rooms', { msg: "", err: "", data: result });
        }
    })

}

//get view room 

exports.viewRoom = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel" 
    });

    roomQuery = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat);
    

    connectDB.query(roomQuery, (err, roomResult) => {
        if (err) throw err; 
        
        else {
            return res.render('admin/viewRoom', { room: roomResult[0], msg:"" });
    } 


    })
}




//get reserved rooms
exports.getReservations = (req, res, next) => {
    // console.log(req.body);
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM requests " +
        "WHERE lister = " + mysql.escape(req.session.admin);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            for (i in result) {
                var a = result[i].date;
                result[i].date = a.toString().slice(0, 15);
            }
            res.render('admin/reservations', { data: result });
        }
    })

}


//update previous data

exports.updateRoom = (req, res, next) => {
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    updateQuery = "UPDATE category " +
        "SET type = " + mysql.escape(req.body.type) +
        ", price = " + mysql.escape(parseInt(req.body.price)) +
        ", location = " + mysql.escape(req.body.location) +
        ", `dec` = " + mysql.escape(req.body.description) +
        " WHERE name = " + mysql.escape(req.body.name);
      
        roomQuery = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.name);


    connectDB.query(updateQuery, (err, result) => {
        if (err) throw err;
        else {
            connectDB.query(roomQuery, (err, roomResult) => {
                if (err) throw err;
                else {
                    return res.render('admin/viewRoom', { room: roomResult[0], err:"", msg: "Update Done Successfuly",});
                    
                }
            })
            
        }
    })

}

//logout
exports.logout = (req, res, next) => {
    req.session.destroy();
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

