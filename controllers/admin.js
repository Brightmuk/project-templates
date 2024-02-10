var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
const session=require('express-session');

// login get request
exports.getLogin = (req, res, next) => {
    
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

//login post request
exports.postLogin = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM user " +
        "WHERE email = " + mysql.escape(req.body.name) +
        " AND password = " + mysql.escape(req.body.pass);

    data1 = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 0 ";

    reservationsQ = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 1 "; 
 
    guestQuery = "SELECT * " +
        "FROM  user " +
        "WHERE name != 'admin'";

    roomQuery = "SELECT * " +
    "FROM  category " +
    "WHERE available = 1 "; 

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            if (result.length) {
                req.session.admin = result[0].name;
                connectDB.query(data1, (err1, result1) => {
                    if (err1) throw err1;
                    else {
                        for (i in result1) {
                            var a = result1[i].date;
                            result1[i].date = a.toString().slice(0, 15);
                        }
                        connectDB.query(guestQuery, (err2, guestResult) => {
                            if (err2) throw err2;
                            connectDB.query(roomQuery, (err3, roomResult) => {
                                if (err3) throw err3;
                                connectDB.query(reservationsQ, (err4, reservations) => {
                                    if (err3) throw err3;
                                    return res.render('admin/index', { msg: "", err: "", data: result1, 
                                    guests:guestResult.length, rooms:roomResult.length, reservations: reservations.length});
                                })
                               
                            })
                           
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
    var cat = "", type = "", cost = 0, avlvl = 0, des = ""
   var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "cat") {
                cat = field;
            }
            else if (name === "type") {
                type = field;
            }
            else if (name === "cost") {
                cost = parseInt(field);
            }
            else if (name === "avlvl") {
                avlvl = parseInt(field);
            }
            else if (name === "des") {
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
                    imgPath = (cat + type + cost + "." + fileType);
                }
                imgPath ='/assets/img/rooms/' + (cat + type + cost + "." + fileType)
                file.path = a + '/public/assets/img/rooms/' + (cat + type + cost + "." + fileType); // __dirname
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
                
                data = "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) "+
                         "VALUES('" +cat + "','" + type + "', '" + cost + "','" +avlvl + "' ,'" + imgPath + "' ,'" + des + "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('admin/addRoom', { msg: "Data Insert Successfuly", err: "" });
                    }
                });
            }
        })
}

//get update page
exports.getSearch = (req, res, next) => {
    res.render('admin/search', { msg: "", err: "" })
}

//post request
exports.postSearch = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/update', { msg: "", err: "", data: result });
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

exports.checkout = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    updateRoom = "UPDATE category " +
        "SET available = 1 " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo);

    updateBooking = "UPDATE bookingStatus " +
        "SET checkout = 1 " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo)
        " AND email = " + mysql.escape(req.body.email);
 
    roomQuery = "SELECT * " + 
        "FROM category " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo);

    bookingQuery = "SELECT * " +
        "FROM bookingStatus " +
        "WHERE roomNo = " + mysql.escape(req.body.roomNo);
    
    connectDB.query(updateRoom, (err, res) => {
        if (err) throw err;
    connectDB.query(updateBooking, (err22, res22) => {
            if (err22) throw err22;
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
    })
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
        "FROM  bookingstatus " +
        "WHERE status = 1 ";
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
//get pending bookings
exports.getPending = (req, res, next) => {
    // console.log(req.body);
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 0 ";
    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            for (i in result) {
                var a = result[i].date;
                result[i].date = a.toString().slice(0, 15);
            }
            res.render('admin/pending', { data: result });
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

