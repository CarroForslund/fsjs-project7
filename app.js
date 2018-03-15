//VARIABLE DECLARATION
const express = require('express'); //Require express to be able to use it
const app = express();  // Express app declaration

const Twit = require('twit'); //Require Twit to be able to use it
const config = require('./config');
const T = new Twit(config);

//APP (EXPRESS) SETTINGS
app.set('view engine', 'pug'); //Set up the engine template to use Pug
app.use(express.static('public'));
//Declare a route. The get methos takes 2 parameters. The route and a cb function
//The send methos sends a string to the client
app.get('/', (req, res) => {
  // ========================
  // MOVE THIS TO APP.GET "/"
  // ========================
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
      const user = {};
      user.name = data.screen_name; //Get profile name
      user.image = data.profile_image_url; //Get profile image
      user.background = data.profile_banner_url; //Get background image
      console.log(user);
      // Get the 5 most recent tweets
      // Get the 5 most recent friends (people I follow)
      T.get('friends/ids', { screen_name: user.name, count: 5 },  function (err, data, response) {
        user.friends = data;
        console.log(user);
        res.locals.user = user;
        res.render('index');
        // console.log(data)
      });
      // Get the 5 most recent private messages


    });

});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000');
}); // The app listens to port 3000 (localhost)
