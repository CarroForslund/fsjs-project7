//VARIABLE DECLARATION
const express = require('express'); //Require express to be able to use it
const app = express();  // Express app declaration

const Twit = require('twit'); //Require Twit to be able to use it
const config = require('./config');
const T = new Twit(config);

//APP (EXPRESS) SETTINGS
app.set('view engine', 'pug'); //Set up the engine template to use Pug

//Declare a route. The get methos takes 2 parameters. The route and a cb function
//The send methos sends a string to the client
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000');
}); // The app listens to port 3000 (localhost)

// Twit has promise support; you can use the callback API,
// promise API, or both at the same time.
T.get('account/verify_credentials', { skip_status: true })
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function (result) {
    // `result` is an Object with keys "data" and "resp".
    // `data` and `resp` are the same objects as the ones passed
    // to the callback.
    // See https://github.com/ttezel/twit#tgetpath-params-callback
    // for details.
    const data = result.data;
    const profileName = data.screen_name; //Get profile name
    const profileImg = data.profile_image_url; //Get profile image
    const profileBg = data.profile_background_image_url; //Get background image
    // Get the 5 most recent tweets
    // Get the 5 most recent friends
    // Get the 5 most recent private messages
    console.log(profileName);
    //console.log('data', result.data);
  })
