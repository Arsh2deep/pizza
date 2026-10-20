// import the express module
import express from 'express';

//create an instance of an
//express appplication
const app = express();

//Define a port number for
// The server to listen
const PORT = 3000;

//Create an array to store orders
const order =[];

//enable static file serving
app.use(express.static('public'));

//Add "middleware" to allow the app to parse form data
//Access form data through req.body
app.use(express.urlencoded({ extended: true }));

//Define a default route ("/")
app.get('/', (req,res) => {
    //res.send('Welcome to poppas\'s Pizza');
    res.sendFile(`${import.meta.dirname}/views/home.html`);
    
});

//Add a contact root to display a contact view page
app.get('/contact-us',(req,res)=>{
    //res.send ('Contact us')
    res.sendFile(`${import.meta.dirname}/views/contact.html`)
});

//Add an order confirmation route
app.get('/confirm-order',(req,res)=>{
    //res.send ('Thank you for you order')
    res.sendFile(`${import.meta.dirname}/views/confirm.html`)
});

//Add a route to process a pizza order
app.post('/submit-order',(req,res)=> {
    const order = req.body;
    order['timestamp'] = new Date();
    console.log(order);

    //Add order object to orders array
    orders.push(order);
    console.log(orders);

    //Display the confirmation page
    res.sendFile(`${import.meta.dirname}/views/confirm.html`)
});



//Add an menu page route
app.get('/order-menu',(req,res)=>{
    //res.send ('Menu for papi's pizza')
    res.sendFile(`${import.meta.dirname}/views/menu.html`)
});


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
