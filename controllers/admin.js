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
        return res.render('admin/index')

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
                return res.render('admin/login', { msg: "", err: "Please check your information  and try again" });
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
                        res.render('admin/addCar', { msg: "Car Added Successfuly", err: "" });
                    }
                });
            }
        })
}


//-------------------------------------------------------



//get view room 

exports.viewCar = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "cars"
    });

    carQuery = "SELECT * " + 
    " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
    " WHERE cars.id =" + mysql.escape(req.body.id) ;
    ; 
    

    connectDB.query(carQuery, (err, carResult) => {
        if (err) throw err; 
        
        res.render('admin/viewCar', { car: carResult[0],msg:"",err:""});

    })
}

""

exports.updateCar = (req, res, next) => {
   console.log(req.body.id);
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "cars"
    });

    carQuery = "SELECT * " + 
    " FROM  cars  INNER JOIN carExtras ON cars.id=carExtras.car_listing" +
    " WHERE cars.id =" + mysql.escape(req.body.id);
    ; 

    updateQuery = "UPDATE cars " +
        "SET make = " + mysql.escape(req.body.make) +
        ", model = " + mysql.escape(req.body.model) +
        ", price = " + mysql.escape(parseInt(req.body.price)) +
        ", seats = " + mysql.escape(parseInt(req.body.seats)) +
        ", type = " + mysql.escape(req.body.type) +
        ", fuel = " + mysql.escape(req.body.fuel) +
        ", transmission = " + mysql.escape(req.body.transmission) +
        ", consumption = " + mysql.escape(parseInt(req.body.consumption)) +
        ", year = " + mysql.escape(req.body.year) +
        " WHERE id = " + mysql.escape(req.body.id);
    

    connectDB.query(updateQuery, (err, updateResult) => {
        if (err) throw err;
     
            connectDB.query(carQuery, (err2, carResult) => {
                if (err2) throw err2;
                
                    return res.render('admin/viewCar', { car: carResult[0],msg:"Car updated Successfully",err:""});
                
            })

    })

}









