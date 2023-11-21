var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
const session=require('express-session');
const http = require('https');

const host =  "localhost";
const user =  "root";
const password = "@Beatsbydre99";
const database = "flowers";

// login get request
exports.getLogin = (req, res, next) => {
    
    if (req.session.admin == undefined) {
        
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        carsQuery = "SELECT * FROM orders";

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
exports.getFlowers = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    carsQuery = "SELECT * FROM flowers"

    connectDB.query(carsQuery, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/flowers', { msg: "", err: "",flowers:result});
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



exports.getAddFlower = (req, res, next) => {
    res.render('admin/addFlower', { msg: "", err: "" });
}


exports.postAddFlower = (req, res, next) => {
   
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
                file.path = a + '/public/assets/img/flowers/' + (name + color + "." + fileType); // __dirname
            } else {
                console.log("Wrong File type")
                wrong = 1;
                res.render('admin/addFlower', { msg: "", err: "Wrong File type" });
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
                
                data = "INSERT INTO `flowers`( `type`, `name`, `color`,`price`,`quantity`,`rating`,`image`,`listing_user`) "+
                         "VALUES('" + type + "','" + nm + "', '" + color + "','" + price + "','" + quantity + "', ' 0 ','" +imgPath + "',' 1 ')"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err; 
                    }
                    else {
                       
                        carQ = "SELECT * " + 
                        "FROM  flowers " +
                        "WHERE type = " + mysql.escape( type) +
                        " AND name = " + mysql.escape( nm);
                        connectDB.query(carQ, (err2, thisCar) => {
                            if (err2) {
                                throw err2;
                            }
                            

                            res.render('admin/addFlower', { msg: "Flower Added Successfuly", err: "" });
                        })

                    }
                });
            }
        })
}


//-------------------------------------------------------



//get view room 

exports.viewFlower = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    carQuery = "SELECT * " + 
    " FROM  flowers" +
    " WHERE flowers.id =" + mysql.escape(req.body.id);
    ; 
    

    connectDB.query(carQuery, (err, carResult) => {
        if (err) throw err; 
        
        res.render('admin/viewFlower', { flower: carResult[0],msg:"",err:""});

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
    " FROM  flowers" +
    " WHERE flowers.id IN (?)";
    

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



exports.updateFlower = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    }); 
    
    carQuery = "SELECT * FROM  flowers WHERE flowers.id = " + mysql.escape(req.body.id);
    

    updateQuery = "UPDATE flowers " +
        "SET type = " + mysql.escape(req.body.type) +
        ", name = " + mysql.escape(req.body.name) +
        ", color = " + mysql.escape(req.body.color) +
        ", price = " + mysql.escape(parseInt(req.body.price)) +
        ", image = " + mysql.escape(req.body.image) +
        ", quantity = " + mysql.escape(req.body.quantity)
        " WHERE flowers.id = "+mysql.escape(req.body.id);

    

    connectDB.query(updateQuery, (err, updateResult) => {
        if (err) throw err;
     
            connectDB.query(carQuery, (err2, carResult) => {
                if (err2) throw err2;
                
                    return res.render('admin/viewFlower', { flower: carResult[0],msg:"Flower updated Successfully",err:""});
                
            })

    })

}

exports.deleteFlower = (req, res, next) => {
    
    var connectDB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    delQuery = "DELETE  " + 
    " FROM  flowers" +
    " WHERE id =" + mysql.escape(req.body.id);

     
        
        connectDB.query(delQuery, (err, result) => {
            if (err) throw err; 
            else { 
                return res.render('admin/flowers', { msg: "Flower deleted successfully", err: "", flowers: result });
            }
        })

    
}
