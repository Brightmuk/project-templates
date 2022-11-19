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
        var connectDB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "@Beatsbydre99",
            database: "hotel"
        });
        data1 = "SELECT * " +
            "FROM  bookingstatus " +
            "WHERE status = 0 ";
        connectDB.query(data1, (err1, result1) => {
            if (err1) throw err1;
            else {
                for (i in result1) {
                    var a = result1[i].date;
                    result1[i].date = a.toString().slice(0, 15);
                }
                return res.render('admin/index', { msg: "", err: "", data: result1 });
            }
        })
    }

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
        "FROM admin " +
        "WHERE name = " + mysql.escape(req.body.name) +
        "AND pass = " + mysql.escape(req.body.pass);

    data1 = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 0 ";

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
                       
                        return res.render('admin/index', { msg: "", err: "", data: result1 });
                    }
                })

            }
            else {
                return res.render('admin/login', { msg: "", err: "Please Check Your Information Again" });
            }
        }
    })
}



//change booking status
exports.postChnageStatus = (req, res, next) => {
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
        "SET available = 0" 
        " WHERE roomNo = " + mysql.escape(req.body.roomNo)

    } else {
        data = "DELETE FROM bookingstatus " +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND roomWant = " + mysql.escape(req.body.want)
    }
    
    data1 = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 0 ";

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

                    return res.render('admin/index', { msg: "", err: "", data: result1 });
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

//get update page 

exports.getUpdate = (req, res, next) => {
    // console.log(req.body);
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND cost = " + mysql.escape(req.body.cost);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            req.session.info = result[0];
            res.render('admin/updatePage', { data: result[0] });
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

exports.updatePrevData = (req, res, next) => {
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "hotel"
    });

    data = "UPDATE category " +
        "SET type = " + mysql.escape(req.body.type) +
        ", cost = " + mysql.escape(parseInt(req.body.cost)) +
        ", available = " + mysql.escape(parseInt(req.body.avlvl)) +
        ", `dec` = " + mysql.escape(req.body.des) +
        " WHERE roomNo = " + mysql.escape(req.body.roomNo) +
      

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            res.render('admin/updatePage', { msg: "Update Done Successfuly", err: "", data:req.body })
        }
    })

}

//logout
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.render('admin/login', { msg: "", err: "" });
}

