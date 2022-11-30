var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
const session=require('express-session');
const http = require('https');

// login get request
exports.getLogin = (req, res, next) => {
    
    if (req.session.admin == undefined) {
        
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        const options = {
            "method": "GET",
            "hostname": "news-api14.p.rapidapi.com",
            "port": null,
            "path": "/search?q=car%20industry&country=us&language=en&pageSize=10",
            "headers": {
                "x-rapidapi-subscription": "cars",
                "x-rapidapi-proxy-secret": "c02cea90-4588-11eb-add9-c577b8ecdc8e",
                "x-rapidapi-user": "suprikurniyanto",
                "X-RapidAPI-Key": "a307e8eddfmsh2a33e3d638138dcp17c32cjsne44e5a3808fc",
                "X-RapidAPI-Host": "news-api14.p.rapidapi.com",
                "useQueryString": true
            }
        };
        var results;
        const dataReq = http.request(options, function (dataRes) {
            const chunks = [];
        
            dataRes.on("data", function (chunk) {
                chunks.push(chunk);
            });
        
            dataRes.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(JSON.parse(body.toString()).articles);
                results=JSON.parse(body.toString()).articles;
                res.render('admin/index',{ articles: results,data:'My name' })
            });
        });
        dataReq.end();
       

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


    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            if (result.length) {
                req.session.admin = result[0].id;
                req.session.user = result[0].id;
                const options = {
                    "method": "GET",
                    "hostname": "news-api14.p.rapidapi.com",
                    "port": null,
                    "path": "/search?q=car%20industry&country=us&language=en&pageSize=10",
                    "headers": {
                        "x-rapidapi-subscription": "cars",
                        "x-rapidapi-proxy-secret": "c02cea90-4588-11eb-add9-c577b8ecdc8e",
                        "x-rapidapi-user": "suprikurniyanto",
                        "X-RapidAPI-Key": "a307e8eddfmsh2a33e3d638138dcp17c32cjsne44e5a3808fc",
                        "X-RapidAPI-Host": "news-api14.p.rapidapi.com",
                        "useQueryString": true
                    }
                };
                var results;
                const dataReq = http.request(options, function (dataRes) {
                    const chunks = [];
                
                    dataRes.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    dataRes.on("end", function () {
                        const body = Buffer.concat(chunks);
                        console.log(JSON.parse(body.toString()).articles);
                        results=JSON.parse(body.toString()).articles;
                        res.render('admin/index',{ articles: results,data:'My name' })
                    });
                }); 
                dataReq.end();
               

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

    carsQuery = "SELECT * FROM cars"

    connectDB.query(carsQuery, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/cars', { msg: "", err: "",cars:result});
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
   consumption=0, year="",reliability=0,utility=0,economy=0,performance=0,luxury=0,maintenance=0,offroading=0

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
            else if (name === "offroading") {
                offroading = field
            }
            else if (name === "utility") {
                utility = field
            }
            else if (name === "economy") {
                economy = field
            }
            else if (name === "maintenance") {
                maintenance = field
            }
            else if (name === "luxury") {
                luxury = field
            }
            else if (name === "performance") {
                performance = field
            }
            else if (name === "reliability") {
                reliability = field
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
                
                data = "INSERT INTO `cars`( `make`, `model`, `price`,`seats`,`type`,`fuel`,`transmission`, `consumption`,`year`,  `image`, `listing_user`) "+
                         "VALUES('" +make + "','" + model + "', '" + price + "','" +seats + "','" + type + "', '" + fuel + "','" +transmission + "', '" + consumption + "','" + year + "', '" +imgPath + "' ,'" + 1+ "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                      
                        carQ = "SELECT * " + 
                        "FROM  cars " +
                        "WHERE make = " + mysql.escape( make) +
                        " AND model = " + mysql.escape( model);
                        connectDB.query(carQ, (err2, thisCar) => {
                            if (err2) {
                                throw err2;
                            }
                            

                            statQ = "INSERT INTO `carExtras`(`reliability`,`Utility`,`economy`,`maintenance`,`luxury`,`performance`,`car_listing`,`offroading`) "+
                            "VALUES('"+reliability+"','"+utility+"','"+economy+"','"+maintenance+"','"+luxury+"','"+performance+"','"+ thisCar[0].id+"','"+offroading+"')"
                            connectDB.query(statQ, (statErr, statRes) => {
                                if (statErr) {
                                    throw statErr;
                                }
                                res.render('admin/addCar', { msg: "Car Added Successfuly", err: "" });
                            })
                        })

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
    " WHERE cars.id =" + mysql.escape(req.body.id);
    ; 
    

    connectDB.query(carQuery, (err, carResult) => {
        if (err) throw err; 
        
        res.render('admin/viewCar', { car: carResult[0],msg:"",err:""});

    })
}



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

exports.deleteCar = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@Beatsbydre99",
        database: "cars"
    });

    delQuery = "DELETE  " + 
    " FROM  cars" +
    " WHERE id =" + mysql.escape(req.body.id);

    extraQuery = "DELETE " + 
    " FROM  carExtras" +
    " WHERE car_listing =" + mysql.escape(req.body.id);

    carsQuery = "SELECT *"+ 
        " FROM cars";
    

    connectDB.query(extraQuery, (err1, carResult1) => {
        if (err1) throw err1; 
        
        connectDB.query(delQuery, (err2, carResult2) => {
        if (err2) throw err2; 
        
        connectDB.query(carsQuery, (err, result) => {
            if (err) throw err; 
            else { 
                return res.render('admin/cars', { msg: "Car deleted successfully", err: "", cars: result });
            }
        })

    })
    })
}









