// import the express module
import express from 'express';

//sql import allows node.js to commmunicate with a MySQL database
import mysql2 from 'mysql2';

//import .env
import dotenv from 'dotenv';
dotenv.config();

//create a connection pool
const pool = mysql2.createPool({
    host:process.env.DB_HOST,
    user:proccess.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
}).promise();

//create an instance of an
//express appplication
const app = express();

//Define a port number for
// The server to listen
const PORT = 3000;

//Create an array to store orders
const orders =[];

//enable static file serving
app.use(express.static('public'));

//Add "middleware" to allow the app to parse form data
//Access form data through req.body
app.use(express.urlencoded({ extended: true }));

//set View engine to EJS
app.set('view engine','ejs');

//create a route to test database
app.get('/db-test',async(req,res)=>{
    try{
        const order = await 
            pool.query('SELECT * FROM orders' );
        res.send(order[0]);
    }catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error Occurred');
    }
});

//Define a default route ("/")
app.get('/', (req,res) => {
    //res.send('Welcome to poppas\'s Pizza');
    res.render('home');

});

//Add a contact root to display a contact view page
app.get('/contact-us',(req,res)=>{
    //res.send ('Contact us')
    res.render('contact');
});

//Add an order confirmation route
/* app.get('/confirm-order',(req,res)=>{
    //res.send ('Thank you for you order')
    res.render('confirm');
}); */

//Add a route to process a pizza order
app.post('/submit-order',async (req,res)=> {
    const order = req.body;
    order.timestamp = new Date();
    console.log(order);

    //define an SQL query to INSERT new order
    const sql = `INTSET INTO orders(fname,lname,email, size,
        method,toppings, comment)
        VALUES(?, ?, ?, ?, ?, ?, ?)`;

        //create an array of parameters from order data
        const parms = [
            order.fname,
            order.lname,
            order.email,
            order.size,
            order.method,
            order.toppings,
            order.comment
        ];

    //Execute the query
    cosnt [result] = await pool.execute(sql, params);

    //Display the confirmation page
    res.render('confirm', { order });
});

//Add an menu page route
app.get('/order-menu',(req,res)=>{
    //res.send ('Menu for papi's pizza')
    res.render('menu');
});

// Add an admin route
app.get('/admin',async (req,res)=>{
    try{
        const order = await 
            pool.query('SELECT * FROM orders' );
        res.send(order[0]);
        res.render('admin',{ orders: orders[0] });
    }catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error Occurred');
    }
    
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
