const express = require('express'); //Require express to be able to use it

const app = express();  // Express app declaration

app.set('view engine', 'pug'); //Set up the engine template to use Pug

//Declare a route. The get methos takes 2 parameters. The route and a cb function
//The send methos sends a string to the client
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000');
}); // The app listens to port 3000 (localhost)
