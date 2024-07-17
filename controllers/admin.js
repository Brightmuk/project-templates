var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
const session=require('express-session');
const http = require('https');
 
const host =  process.env.DB_HOST;
const user =  process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = "pharmacy";
 
// login get request
exports.getLogin = (req, res, next) => {
    
    if (req.session.admin == undefined) {
        
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        carsQuery = "SELECT * FROM records";

        connectDB.query(carsQuery, (err, result) => {
            if (err) throw err;
            else {
                return res.render('admin/orders', { msg: "", err: "",orders: result});
            }
        })
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
        host: host,
        user: user,
        password: password,
        database: database
    });
    carsQuery = "SELECT * FROM orders"

    data = "SELECT * " +
        "FROM users " +
        "WHERE username = " + mysql.escape(req.body.name) +
        "AND password = " + mysql.escape(req.body.pass);


    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            if (result.length) {

                connectDB.query(carsQuery, (err, result) => {
                    if (err) throw err;
                    else {
                        return res.render('admin/orders', { msg: "", err: "",orders:result});
                    }
                })

            }else {
                return res.render('admin/login', { msg: "", err: "Please check your information  and try again" });
            }
        }
    })
}

//post request
exports.getRecords = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    carsQuery = "SELECT * FROM records"

    connectDB.query(carsQuery, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/records', { msg: "", err: "",flowers:result});
        }
    })

}

exports.getOrders = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    carsQuery = "SELECT * FROM orders"

    connectDB.query(carsQuery, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/orders', { msg: "", err: "",orders:result});
        }
    })

}
exports.fulfillOrder = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    updateQuery = "UPDATE  orders SET status = 'fulfilled' where orders.id = " +mysql.escape(req.body.id)
    carsQuery = "SELECT * FROM orders"
        
        connectDB.query(updateQuery, (err, result) => {
            if (err) throw err; 
            else { 
                connectDB.query(carsQuery, (er2, result2) => {
                    if (er2) throw err2; 
                    else {
                        return res.render('admin/orders', { msg: "", err: "", orders:result2});
                    }
                })
            }
        })

    
}



exports.getAddRecord = (req, res, next) => {
    res.render('admin/addRecord', { msg: "", err: "" });
}


exports.postAddRecord = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });
   
    //var
   var type = "", nm = "", color = "",quantity = 0, price = 0;
   

   var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "color") {
                color = field;
            }
            else if (name === "name") { 
                nm = field;
            }
            else if (name === "price") { 
                price = parseInt(field);
            }
            else if (name === "quantity") {
                quantity = parseInt(field);
            }
            else if (name === "type") {
                type = field;
              
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
                    imgPath = (name + color + "." + fileType);
                }
                imgPath ='/assets/img/flowers/' + (name + color + "." + fileType)
                file.path = a + '/public/assets/img/' + (name + color + "." + fileType); // __dirname
            } else {
                console.log("Wrong File type")
                wrong = 1;
                res.render('admin/addRecord', { msg: "", err: "Wrong File type" });
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
                
                
                var roomNo = Math.floor(Math.random() * 100) + 1;
                //saveDir = __dirname + '/uploads/';
                
                data = "INSERT INTO `records`( `type`, `name`, `color`,`price`,`quantity`,`rating`,`image`,`listing_user`) "+
                         "VALUES('" + type + "','" + nm + "', '" + color + "','" + price + "','" + quantity + "', ' 0 ','" +imgPath + "',' 1 ')"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err; 
                    }
                    else {
                       
                        carQ = "SELECT * " + 
                        "FROM  records " +
                        "WHERE type = " + mysql.escape( type) +
                        " AND name = " + mysql.escape( nm);
                        connectDB.query(carQ, (err2, thisCar) => {
                            if (err2) {
                                throw err2;
                            }
                            

                            res.render('admin/addRecord', { msg: "Record Added Successfuly", err: "" });
                        })

                    }
                });
            }
        })
}


//-------------------------------------------------------



//get view room 

exports.viewRecord = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    carQuery = "SELECT * " + 
    " FROM  records" +
    " WHERE records.id =" + mysql.escape(req.body.id);
    ; 
    

    connectDB.query(carQuery, (err, carResult) => {
        if (err) throw err; 
        
        res.render('admin/viewRecord', { flower: carResult[0],msg:"",err:""});

    })
}
exports.viewOrder = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    orderQuery = "SELECT * " + 
    " FROM  orders" +
    " WHERE orders.id =" + mysql.escape(req.body.id);
    ; 
    itemsQuery = "SELECT * " + 
    " FROM  order_items" +
    " WHERE order_items.order_id =" + mysql.escape(req.body.id);
    ; 
    
    flowersQuery = "SELECT * " + 
    " FROM  records" +
    " WHERE records.id IN (?)";
    

    connectDB.query(orderQuery, (err, result) => {
        if (err) throw err; 
        
        connectDB.query(itemsQuery, (err2, result2) => {
            if (err2) throw err2;
            var items = result2;
            var values = items.map(item=>item.flower_id)

            connectDB.query(flowersQuery,[values], (err3, result3) => {
                if (err3) throw err3;
                
                    return res.render('admin/viewOrder', { order: result[0], flowers: result3, msg:"",err:""});
                
            })
            
        })

    })
}



exports.updateRecord = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    }); 
    
    carQuery = "SELECT * FROM  records WHERE records.id = " + mysql.escape(req.body.id);
    

    updateQuery = "UPDATE records " +
        "SET type = " + mysql.escape(req.body.type) +
        ", name = " + mysql.escape(req.body.name) +
        ", color = " + mysql.escape(req.body.color) +
        ", price = " + mysql.escape(parseInt(req.body.price)) +
        ", image = " + mysql.escape(req.body.image) +
        ", quantity = " + mysql.escape(req.body.quantity)
        " WHERE records.id = "+mysql.escape(req.body.id);

    

    connectDB.query(updateQuery, (err, updateResult) => {
        if (err) throw err;
     
            connectDB.query(carQuery, (err2, carResult) => {
                if (err2) throw err2;
                
                    return res.render('admin/viewRecord', { flower: carResult[0],msg:"Record updated Successfully",err:""});
                
            })

    })

}

exports.deleteRecord = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    delQuery = "DELETE  " + 
    " FROM  records" +
    " WHERE id =" + mysql.escape(req.body.id);

     
        
        connectDB.query(delQuery, (err, result) => {
            if (err) throw err; 
            else { 
                return res.render('admin/records', { msg: "Record deleted successfully", err: "", flowers: result });
            }
        })

    
}