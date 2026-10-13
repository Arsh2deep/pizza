// import the express module
import express from 'express';

//create an instance of an
//express appplication
const app = express();

//Define a port number for
// The server to listen
const PORT = 3000;

//enable static file serving
app.use(express.static('public'));


//Define a default route ("/")
app.get('/', (req,res) => {
    //res.send('Welcome to poppas\'s Pizza');
    res.sendFile(`${import.meta.dirname}/views/home.html`);
    
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
