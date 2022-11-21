var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
const session=require('express-session');

// login get request
exports.getLogin = (req, res, next) => {
    
    if (req.session.admin == undefined) {
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        return res.render('/admin/index')

    }

} 
//logout
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.render('admin/login', { msg: "", err: "" });
}

//login post request
exports.postLogin = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "cars"
    });

    data = "SELECT * " +
        "FROM users " +
        "WHERE username = " + mysql.escape(req.body.name) +
        "AND password = " + mysql.escape(req.body.pass);

    carsQuery = "SELECT * " +
        "FROM cars";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            if (result.length) {
                req.session.admin = result[0].id;
                req.session.user = result[0].id;
                connectDB.query(carsQuery, (err, result) => {
                    if (err) throw err;
                    else {
                        return res.render('admin/index', { msg: "", err: "", cars: result });
                    }
                })

            }else {
                return res.render('admin/login', { msg: "", err: "Please Check Your Information Again" });
            }
        }
    })
}

//post request
exports.getCars = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "cars"
    });

    carsQuery = "SELECT * " +
        "FROM cars";

    connectDB.query(carsQuery, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/cars', { msg: "", err: "", cars: result });
        }
    })

}


//get add hotel page

exports.getAddCar = (req, res, next) => {
    res.render('admin/addCar', { msg: "", err: "" });
}

//add new hotel info
exports.postAddCar = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "cars"
    });

    //var
   var make = "", model = "", type = "",year = "", price = 0, seats = 0, fuel="",transmission="",purpose=""
   consumption=0, year=""

   var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "make") {
                make = field;
            }
            else if (name === "type") {
                type = field;
            }
            else if (name === "price") {
                price = parseInt(field);
            }
            else if (name === "seats") {
                seats = parseInt(field);
            }
            else if (name === "model") {
                model = field
            }
            else if (name === "fuel") {
                fuel = field
            }
            else if (name === "year") {
                year = field
            }
            else if (name === "transmission") {
                transmission = field
            }
            else if (name === "purpose") {
                purpose = field
            }
            else if (name === "consumption") {
                consumption = parseInt(field);
            }
            else if (name === "year") {
                year = field
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
                    imgPath = (make + type + price + "." + fileType);
                }
                imgPath ='/assets/img/cars/' + (make + type + price + "." + fileType)
                file.path = a + '/public/assets/img/cars/' + (make + type + price + "." + fileType); // __dirname
            } else {
                console.log("Wrong File type")
                wrong = 1;
                res.render('admin/addCar', { msg: "", err: "Wrong File type" });
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
                
                data = "INSERT INTO `cars`(`make`, `model`, `price`,`seats`,`type`,`fuel`,`transmission`, `consumption`,`year`,`purpose`,  `image`, `listing_user`) "+
                         "VALUES('" +make + "','" + model + "', '" + price + "','" +seats + "','" + type + "', '" + fuel + "','" +transmission + "', '" + consumption + "','" + year + "', '" + purpose + "','" +imgPath + "' ,'" + 1+ "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('admin/addCar', { msg: "Data Insertion Successfuly", err: "" });
                    }
                });
            }
        })
}


//-------------------------------------------------------



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
        "WHERE name = " + mysql.escape(req.body.cat) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND cost = " + mysql.escape(req.body.cost);

    bookingQuery = "SELECT * " +
        "FROM bookingStatus " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo);
    

    connectDB.query(roomQuery, (err, roomResult) => {
        if (err) throw err; 
        
        else {
        connectDB.query(bookingQuery, (err, bookingResult) => {
            if (err) throw err; 
            if(bookingResult.length>0){
                userQuery = "SELECT * " +
                "FROM user " +
                "WHERE email = " + mysql.escape(bookingResult[0].email);
    
                connectDB.query(userQuery, (err, userResult) => {
                    if (err) throw err;
                    else{
                        req.session.info = roomResult[0];
                        
                        res.render('admin/viewRoom', { room: roomResult[0] , booking: bookingResult[0] ,user: userResult[0]});
                    }
                }) 
            }else {
                req.session.info = roomResult[0];
                        
                res.render('admin/viewRoom', { room: roomResult[0]});
            }
        })
    } 


    })
}

//get view room 

exports.viewReservation = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    roomQuery = "SELECT * " +
        "FROM category " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo);


    bookingQuery = "SELECT * " +
        "FROM bookingStatus " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo)
        " AND email = " + mysql.escape(req.body.email);

    userQuery = "SELECT * " +
        "FROM user " +
        "WHERE email = " + mysql.escape(req.body.email); 

    connectDB.query(roomQuery, (err, roomResult) => {
        if (err) throw err; 
        
        else { 
        connectDB.query(bookingQuery, (err, bookingResult) => {
            if (err) throw err;  
           
                connectDB.query(userQuery, (err, userResult) => {
                    if (err) throw err;
                    else{
                        req.session.info = roomResult[0];
                        var today = Date.now()

                        var diff = today - bookingResult[0].date.getTime();

                        var days = (diff / (1000 * 3600 * 24)).toFixed(0);
                        
                        res.render('admin/singleReservation', { room: roomResult[0] , booking: bookingResult[0] ,user: userResult[0],days:days,cost:days*roomResult[0].cost});
                    }
                }) 
            
        }) 
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
        ", cost = " + mysql.escape(parseInt(req.body.cost)) +
        ", available = " + mysql.escape(parseInt(req.body.available)) +
        ", `dec` = " + mysql.escape(req.body.description) +
        " WHERE roomNo = " + mysql.escape(req.body.roomNo);
      
        roomQuery = "SELECT * " +
        "FROM category";


    connectDB.query(updateQuery, (err, result) => {
        if (err) throw err;
        else {
            connectDB.query(roomQuery, (err, roomResult) => {
                if (err) throw err;
                else {
                    return res.render('admin/rooms', { data: roomResult, msg: "Update Done Successfuly", err: "" });
                }
            })
            
        }
    })

}



