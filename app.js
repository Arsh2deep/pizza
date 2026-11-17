// import the express module
import express from 'express';

//sql import allows node.js to commmunicate with a MySQL database
import mysql2 from 'mysql2';

//import .env
import dotenv from 'dotenv';
dotenv.config();

//Import express-session
import session from 'express-session';

//create a connection pool
const pool = mysql2.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
}).promise();

//create an instance of an
//express appplication
const app = express();

//A sesssion lets the server remember a user between requests.
//After this runs, every route can read and write req.session.
app.use(session({
    secret: process.env.SESSION_SECRET,// used to sign the session cookie (from .env)
    resave: false, //false = dont re-save sessions that didnt change
    saveUninitialized: false, // false = dont create a saession until we store something in it(loggedIN = true)
    cookie: {maxAGE:1000 * 60 * 60} // how long the login lasts, in milliseconds (1000ms * 60sec * 60min = 1 hour)
}));

//if the user is  logged in, we call next() to let them through.
//if not, we redirect them to the login page instead.
function requireLogin(req, res, next){
    if(req.session.loggedIn){
        next(); // a function that says "OK, continue to the route"
    }else{
        res.redirect('/login');
    }
}

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
/*
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
*/

//Define a default route ("/")
app.get('/', (req,res) => {
    //res.send('Welcome to poppas\'s Pizza');
    res.render('home');

});

//Add a contact root to display a contact view page
app.get('/contact-us',(req,res)=>{
    res.render('contact');
});

//Add a route for the login page
//display the login page
//we pass error
app.get('/login',(req,res)=>{
    res.render('login', {error: null });
});
app.post('/login', (req,res)=>{
    //compare them to the username and password stored in . env
    const username= req.body.username;
    const password= req.body.password;

    if(username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD){
            //correct! remember that this user is logged in
            req.session.loggedIn = true;

            //send them to the admin page
            res.redirect('/admin');
        }else{
            //wrong username or password - show the form again witg
            //NOTE: we dont say WHICH one was wrong. that would give
            //attackers a hint(e.g "the usesrname is correct passoword is not")
            res.render('login', {error: 'Invalid username or passoword'})
        }
});

//logout- http://localhost:3000/logout
//destroy() deletes the session from the server,
//when its finished, we send the user back to the login page
app.get('/logout', (req, res)=> {
    req.session.destroy(()=> {
        res.redirect('/login');
    });
});

//Add a route to process a pizza order
app.post('/submit-order',async (req,res)=> {
   
    //Create a JSON Object to store order date
    const order = req.body;
    order.timestamp = new Date();
    console.log(order);

    //Convert toppings array to a comma-delimited string
    order.toppings = Array.isArray(order.toppings)?
        order.toppings.join(", ") : "";

    //Define an SQL query to INSERT new order
    const sql = `INTSET INTO orders(fname,lname,email,
    size, method,toppings, comment)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;

        //create an array of parameters from order data
        const params = [
            order.fname,
            order.lname,
            order.email,
            order.size,
            order.method,
            order.toppings,
            order.comment
        ];

    //Execute the query
    const [result] = await pool.execute(sql, params);

    //get the id from the newly
    order.id = result.insertId;
    console.log("A new row was intserted with ID " + order.id);
   
    //Display the confirmation page
    res.render('confirm', { order });
});

//Add an menu page route
app.get('/order-menu',(req,res)=>{
    //res.send ('Menu for papi's pizza')
    res.render('menu');
});

// Add an admin route
app.get('/admin',requireLogin,async (req,res)=>{
    try{
        //Array destructuring gives us just the data from the query
        const [orders] = await 
            pool.query('SELECT * FROM orders ORDER BY timestamp DESC' );
        console.log(orders)
        res.render('admin', {orders});
    }catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error Occurred');
    }
    
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
